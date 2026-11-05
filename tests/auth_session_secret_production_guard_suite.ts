import assert from 'node:assert/strict';
import { AuthorizationService } from '../src/server/auth/AuthorizationService';

const originalNodeEnv = process.env.NODE_ENV;
const originalJwtSecret = process.env.JWT_SECRET;
const originalSessionSecret = process.env.SESSION_SECRET;

try {
  process.env.NODE_ENV = 'production';
  delete process.env.JWT_SECRET;
  delete process.env.SESSION_SECRET;

  assert.throws(
    () => new AuthorizationService(),
    /AUTH_SESSION_SECRET_REQUIRED/,
    'production startup must fail closed when no strong session secret is configured'
  );

  process.env.SESSION_SECRET = 'test-only-session-secret-with-more-than-32-characters';
  assert.doesNotThrow(
    () => new AuthorizationService(),
    'production auth service accepts an explicitly configured strong session secret'
  );

  process.env.SESSION_SECRET = 'short';
  assert.throws(
    () => new AuthorizationService(),
    /AUTH_SESSION_SECRET_REQUIRED/,
    'production auth service rejects short session secrets'
  );

  console.log('Production session secret guard suite: PASS');
} finally {
  if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
  else process.env.NODE_ENV = originalNodeEnv;

  if (originalJwtSecret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = originalJwtSecret;

  if (originalSessionSecret === undefined) delete process.env.SESSION_SECRET;
  else process.env.SESSION_SECRET = originalSessionSecret;
}
