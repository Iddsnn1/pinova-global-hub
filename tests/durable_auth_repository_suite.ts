import assert from 'node:assert/strict';
import { AuthorizationService } from '../src/server/auth/AuthorizationService';

process.env.SESSION_SECRET = 'durable-auth-test-secret-with-at-least-32-characters';

type Identity = {
  id: string; username: string; piUid: string; roles: any[];
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  createdAt: string; updatedAt: string;
};

function createHarness() {
  const identities = new Map<string, Identity>();
  const sessions = new Map<string, { userId: string; expiresAt: number }>();
  const revocations = new Set<string>();
  const repository = {
    async findUserByUsername(username: string) {
      const value = identities.get(username.toLowerCase());
      return value ? { ...value, roles: [...value.roles] } : null;
    },
    async setAuthoritativeRoles(userId: string, roles: any[]) {
      const value = [...identities.values()].find((user) => user.id === userId);
      if (!value) return null;
      value.roles = [...roles];
      value.updatedAt = new Date().toISOString();
      return { ...value, roles: [...value.roles] };
    },
    async createSession(token: string, userId: string, expiresAt: number) {
      sessions.set(token, { userId, expiresAt });
    },
    async findActiveSession(token: string) {
      if (revocations.has(token)) return null;
      const session = sessions.get(token);
      if (!session || session.expiresAt <= Date.now()) return null;
      const user = [...identities.values()].find((candidate) => candidate.id === session.userId);
      return user ? { user: { ...user, roles: [...user.roles] }, expiresAt: session.expiresAt } : null;
    },
    async revokeSession(token: string) {
      revocations.add(token);
      sessions.delete(token);
    }
  };
  const addIdentity = (username: string, status: Identity['status'] = 'ACTIVE') => {
    const user: Identity = {
      id: `id-${username}`, username, piUid: `pi-${username}`,
      roles: ['PIONEER'], status,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    };
    identities.set(username.toLowerCase(), user);
    return user;
  };
  return { repository, identities, sessions, revocations, addIdentity };
}

async function run() {
  const harness = createHarness();
  harness.addIdentity('alice');
  const auth = new AuthorizationService(harness.repository as any);

  const session = await auth.createSession({
    username: 'alice', uid: 'pi-alice', roles: ['PLATFORM_ADMIN']
  });
  assert.ok(session.token.startsWith('pinova_sess_v2_'));
  const payload = session.token.slice('pinova_sess_v2_'.length).split('.')[0];
  const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  assert.equal(decoded.roles, undefined, 'Signed bearer token must not carry authorization roles');
  assert.equal(decoded.sub, 'id-alice');

  const verified = await auth.verifyToken(session.token);
  assert.deepEqual(verified?.roles, ['PIONEER'], 'Client/session input cannot grant roles');
  const secondInstance = new AuthorizationService(harness.repository as any);
  assert.deepEqual((await secondInstance.verifyToken(session.token))?.roles, ['PIONEER'], 'A second server instance validates the shared Neon session');

  // Current database roles, not token claims, govern each authenticated request.
  const alice = harness.identities.get('alice')!;
  alice.roles = ['SELLER'];
  const roleChanged = await auth.verifyToken(session.token);
  assert.deepEqual(roleChanged?.roles, ['SELLER']);

  alice.status = 'SUSPENDED';
  assert.equal(await auth.verifyToken(session.token), null, 'Suspended identities are rejected');
  alice.status = 'PENDING_VERIFICATION';
  assert.equal(await auth.verifyToken(session.token), null, 'Pending identities are rejected');
  alice.status = 'ACTIVE';

  assert.equal(await auth.invalidateSession('not-a-valid-session'), false, 'Malformed logout token cannot create revocation rows');
  await auth.invalidateSession(session.token);
  assert.equal(harness.sessions.has(session.token), false, 'Logout removes active session');
  assert.equal(harness.revocations.has(session.token), true, 'Logout persists revocation');
  assert.equal(await auth.verifyToken(session.token), null, 'Revoked token is rejected');

  const tampered = session.token.slice(0, -1) + (session.token.endsWith('a') ? 'b' : 'a');
  assert.equal(await auth.verifyToken(tampered), null, 'Tampered signature is rejected');

  const weakSecret = process.env.SESSION_SECRET;
  const jwtSecret = process.env.JWT_SECRET;
  delete process.env.JWT_SECRET;
  process.env.SESSION_SECRET = 'short';
  await assert.rejects(
    () => auth.createSession({ username: 'alice', uid: 'pi-alice' }),
    /AUTH_SESSION_SECRET_MISSING_OR_WEAK/
  );
  process.env.SESSION_SECRET = weakSecret;
  if (jwtSecret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = jwtSecret;

  const expiring = await auth.createSession({ username: 'alice', uid: 'pi-alice' }, 1);
  await new Promise((resolve) => setTimeout(resolve, 5));
  assert.equal(await auth.verifyToken(expiring.token), null, 'Expired session is rejected');

  const oldDatabaseUrl = process.env.DATABASE_URL;
  process.env.DATABASE_URL = '';
  const noDatabase = new AuthorizationService();
  await assert.rejects(
    () => noDatabase.createSession({ username: 'alice', uid: 'pi-alice' }),
    /NEON_DATABASE_URL_UNAVAILABLE_OR_INVALID/
  );
  if (oldDatabaseUrl === undefined) delete process.env.DATABASE_URL;
  else process.env.DATABASE_URL = oldDatabaseUrl;

  // A session cannot be created for an identity absent from the authoritative store.
  await assert.rejects(
    () => auth.createSession({ username: 'unknown', uid: 'pi-unknown' }),
    /AUTH_DURABLE_IDENTITY_NOT_FOUND_OR_MISMATCH/
  );

  const fs = await import('node:fs/promises');
  const repositorySource = await fs.readFile(new URL('../src/server/auth/NeonAuthRepository.ts', import.meta.url), 'utf8');
  assert.ok(repositorySource.includes("createHash('sha256')"), 'Repository hashes session tokens before persistence');
  assert.ok(repositorySource.includes('token_hash'), 'Repository persists token_hash columns, not raw bearer tokens');

  console.log('Durable auth regression suite passed.');
}

run().catch((error) => {
  console.error('Durable auth regression suite failed:', error);
  process.exitCode = 1;
});
