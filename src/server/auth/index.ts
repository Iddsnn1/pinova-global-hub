export * from './types';
export * from './UserIdentityRepository';
export * from './AuthRepository';
export * from './LegacyAuthRepository';
export * from './NeonAuthRepository';
export * from './RoleRepository';
export * from './AuthorizationService';
export * from './middleware';

import { UserIdentityRepository } from './UserIdentityRepository';
import { LegacyAuthRepository } from './LegacyAuthRepository';
import { NeonAuthRepository } from './NeonAuthRepository';
import { AuthorizationService } from './AuthorizationService';
import { createAuthMiddlewares } from './middleware';
import { neonDatabaseEnabled } from '../db/NeonDatabase';

export const userIdentityRepo = new UserIdentityRepository();

// Vercel Preview/Production uses Neon whenever DATABASE_URL is configured.
// A deployed production runtime without durable auth storage fails closed;
// process-local file storage is reserved for local development and tests.
const durableAuthConfigured = neonDatabaseEnabled();
if (process.env.NODE_ENV === 'production' && !durableAuthConfigured) {
  throw new Error('DURABLE_AUTH_DATABASE_REQUIRED');
}

export const authRepository = durableAuthConfigured
  ? new NeonAuthRepository()
  : new LegacyAuthRepository(userIdentityRepo);

export const authorizationService = new AuthorizationService(authRepository);
export const authService = authorizationService;
export const authMiddlewares = createAuthMiddlewares(authorizationService);
export const authenticate = authMiddlewares.authenticate;
export const requireAuthenticatedUser = authMiddlewares.requireAuthenticatedUser;
export const requireRole = authMiddlewares.requireRole;
export const requirePermission = authMiddlewares.requirePermission;
