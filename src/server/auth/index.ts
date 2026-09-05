export * from './types';
export * from './UserIdentityRepository';
export * from './RoleRepository';
export * from './AuthorizationService';
export * from './middleware';

import { UserIdentityRepository } from './UserIdentityRepository';
import { AuthorizationService } from './AuthorizationService';
import { createAuthMiddlewares } from './middleware';

export const userIdentityRepo = new UserIdentityRepository();
export const authorizationService = new AuthorizationService(userIdentityRepo);
export const authService = authorizationService;
export const authMiddlewares = createAuthMiddlewares(authorizationService);
export const authenticate = authMiddlewares.authenticate;
export const requireAuthenticatedUser = authMiddlewares.requireAuthenticatedUser;
export const requireRole = authMiddlewares.requireRole;
export const requirePermission = authMiddlewares.requirePermission;
