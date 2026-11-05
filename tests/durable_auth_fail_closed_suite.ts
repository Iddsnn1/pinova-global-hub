import assert from 'node:assert/strict';
import crypto from 'node:crypto';

process.env.NODE_ENV = 'production';
process.env.JWT_SECRET = 'durable-auth-test-secret';
process.env.DATABASE_URL = '';
process.env.PI_API_KEY = '';
process.env.PI_SERVER_KEY = '';
process.env.ADMIN_API_KEY = 'test-machine-key-not-used';

const { AuthorizationService } = await import('../src/server/auth/AuthorizationService');
const auth = new AuthorizationService();

const payload = Buffer.from(JSON.stringify({
  v: 1,
  username: 'attacker',
  roles: ['PLATFORM_ADMIN', 'COMPLIANCE_ADMIN'],
  exp: Date.now() + 60_000,
  nonce: 'test-nonce'
})).toString('base64url');
const signature = crypto.createHmac('sha256', process.env.JWT_SECRET!)
  .update(payload)
  .digest('base64url');
const forgedPortableShape = `pinova_sess_v1_${payload}.${signature}`;

assert.equal(
  await auth.verifyToken(forgedPortableShape),
  null,
  'A correctly signed portable-shaped token must not authenticate in production without durable storage'
);

assert.equal(
  await auth.verifyToken('pi-access-token-placeholder-which-is-not-verified'),
  null,
  'A raw Pi token must not authenticate through a local identity fallback when durable storage is unavailable'
);

assert.equal(
  (await auth.verifyToken(process.env.ADMIN_API_KEY!))?.roles.join(','),
  'PLATFORM_ADMIN',
  'The dedicated ADMIN_API_KEY may authenticate a machine identity with the platform role only'
);

assert.equal(
  await auth.verifyPiAccessToken(process.env.ADMIN_API_KEY!),
  null,
  'The Pi session-establishment path must never accept the application ADMIN_API_KEY'
);

const originalFetch = globalThis.fetch;
let observedPiAuthorization = '';
globalThis.fetch = (async (_input: any, init?: any) => {
  observedPiAuthorization = String(init?.headers?.Authorization || '');
  return new Response('Unauthorized', { status: 401 });
}) as typeof fetch;

process.env.ADMIN_API_KEY = '';
process.env.PI_API_KEY = 'pi-platform-secret-that-must-not-be-an-admin-key';
process.env.PI_SERVER_KEY = 'pi-server-secret-that-must-not-be-an-admin-key';

assert.equal(
  await auth.verifyToken(process.env.PI_API_KEY),
  null,
  'PI_API_KEY must not authenticate as an application machine administrator'
);
assert.equal(
  observedPiAuthorization,
  '',
  'The application session verifier must not send the Pi Platform API key as a Pioneer access token'
);
assert.equal(
  await auth.verifyPiAccessToken('fake-pioneer-access-token-that-is-not-valid'),
  null,
  'An unverified Pioneer token must not establish a session'
);
assert.equal(
  observedPiAuthorization,
  'Bearer fake-pioneer-access-token-that-is-not-valid',
  'The session endpoint verifier must send the Pioneer token to Pi Platform for verification'
);
globalThis.fetch = originalFetch;


await assert.rejects(
  auth.createSession({ username: 'preview_test_user', roles: ['PLATFORM_ADMIN'], isAuthorizedAdmin: true }),
  /DURABLE_AUTH_DATABASE_REQUIRED/,
  'Production session creation must fail closed when Neon is unavailable'
);

console.log('PASS: production auth fails closed without durable Neon storage.');
