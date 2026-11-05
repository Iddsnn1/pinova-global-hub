import assert from 'node:assert/strict';
import crypto from 'node:crypto';

process.env.NODE_ENV = 'production';
process.env.JWT_SECRET = 'durable-auth-test-secret';
process.env.DATABASE_URL = '';
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

await assert.rejects(
  auth.createSession({ username: 'preview_test_user', roles: ['PLATFORM_ADMIN'], isAuthorizedAdmin: true }),
  /DURABLE_AUTH_DATABASE_REQUIRED/,
  'Production session creation must fail closed when Neon is unavailable'
);

console.log('PASS: production auth fails closed without durable Neon storage.');
