import { Request, Response, NextFunction } from 'express';
import { AuthorizationService } from './AuthorizationService';
import { AuthenticatedUser, UserRole, Permission } from './types';

// Augment Express Request type
declare global {
  namespace Express {
    interface Request {
      authenticatedUser?: AuthenticatedUser;
    }
  }
}

export function createAuthMiddlewares(authService: AuthorizationService) {
  /**
   * Middleware to authoritatively authenticate the caller.
   * STRICT SECURITY MANDATE: NEVER trust `x-user-role`, `x-admin-role`, or `x-username` from headers!
   */
  const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers['authorization'] as string | undefined;
      const adminKeyHeader = req.headers['x-admin-key'] as string | undefined;

      // Check Authorization header or x-admin-key
      const token = authHeader || (adminKeyHeader ? `Key ${adminKeyHeader}` : undefined);
      if (token) {
        const user = await authService.verifyToken(token);
        if (user) {
          req.authenticatedUser = user;
        }
      }
    } catch (err) {
      console.error('[AuthMiddleware] Error during authentication:', err);
    }
    next();
  };

  /**
   * Requires that the request has an authenticated user.
   */
  const requireAuthenticatedUser = (req: Request, res: Response, next: NextFunction) => {
    if (!req.authenticatedUser) {
      res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Valid authentication credentials required.'
      });
      return;
    }
    next();
  };

  /**
   * Requires that the authenticated user possesses at least ONE of the specified roles.
   * Rejects client-supplied spoofing.
   */
  const requireRole = (...rolesArg: (UserRole | UserRole[])[]) => {
    const roles: UserRole[] = rolesArg.flat();
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.authenticatedUser) {
        res.status(401).json({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Valid authentication required.'
        });
        return;
      }

      const hasRequiredRole = roles.some((role) => req.authenticatedUser!.roles.includes(role));
      if (!hasRequiredRole) {
        res.status(403).json({
          success: false,
          error: 'FORBIDDEN',
          message: `Access denied. Requires one of roles: [${roles.join(', ')}].`
        });
        return;
      }

      next();
    };
  };

  /**
   * Requires that the authenticated user has the specified permission.
   */
  const requirePermission = (...permissionsArg: (Permission | Permission[])[]) => {
    const permissions: Permission[] = permissionsArg.flat();
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.authenticatedUser) {
        res.status(401).json({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Valid authentication required.'
        });
        return;
      }

      const hasAllPermissions = permissions.every((p) => req.authenticatedUser!.permissions.has(p));
      if (!hasAllPermissions) {
        res.status(403).json({
          success: false,
          error: 'FORBIDDEN',
          message: `Access denied. Missing required permissions: [${permissions.join(', ')}].`
        });
        return;
      }

      next();
    };
  };

  return {
    authenticate,
    requireAuthenticatedUser,
    requireRole,
    requirePermission
  };
}
