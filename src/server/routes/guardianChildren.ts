import type { RequestHandler } from 'express';

export interface GuardianChildrenRepository {
  listGuardianChildrenSummaries(guardianId: string, institutionId?: string): Promise<unknown[]>;
}

type AuthenticatedGuardianRequest = {
  user?: {
    guardianId?: string;
    institutionId?: string;
    roles?: string[];
  };
  params: { id?: string };
};

const GLOBAL_READ_ROLES = new Set(['PLATFORM_ADMIN', 'BURSAR', 'FINANCE_ADMIN']);

function clean(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * Guardian dashboard read handler.
 * Every tenant constraint is passed to the repository so institution scoping
 * happens in SQL before rows or invoice aggregates are returned.
 */
export function createGuardianChildrenHandler(
  getRepository: () => GuardianChildrenRepository,
  mode: 'self' | 'scoped'
): RequestHandler {
  return async (req, res) => {
    const request = req as typeof req & AuthenticatedGuardianRequest;
    const user = request.user;
    if (!user) {
      res.status(401).json({ success: false, error: 'AUTHENTICATION_REQUIRED' });
      return;
    }

    const roles = Array.isArray(user.roles) ? user.roles : [];
    const isGlobalAdmin = roles.some((role) => GLOBAL_READ_ROLES.has(role));
    const isInstitutionAdmin = roles.includes('INSTITUTION_ADMIN');
    const ownGuardianId = clean(user.guardianId);

    let guardianId = '';
    let institutionId: string | undefined;

    if (mode === 'self') {
      // Do not fall back to username or user id: guardian linkage is an
      // authoritative Neon identity attribute, not a caller-controlled alias.
      if (!ownGuardianId) {
        res.status(403).json({ success: false, error: 'GUARDIAN_IDENTITY_REQUIRED' });
        return;
      }
      guardianId = ownGuardianId;
    } else {
      const requestedGuardianId = clean(request.params.id);
      if (!requestedGuardianId) {
        res.status(400).json({ success: false, error: 'GUARDIAN_ID_REQUIRED' });
        return;
      }

      if (isGlobalAdmin) {
        guardianId = requestedGuardianId;
      } else if (isInstitutionAdmin) {
        institutionId = clean(user.institutionId);
        if (!institutionId) {
          res.status(403).json({ success: false, error: 'INSTITUTION_SCOPE_REQUIRED' });
          return;
        }
        guardianId = requestedGuardianId;
      } else if (ownGuardianId && ownGuardianId.toLowerCase() === requestedGuardianId.toLowerCase()) {
        guardianId = ownGuardianId;
      } else {
        res.status(403).json({ success: false, error: 'FORBIDDEN' });
        return;
      }
    }

    try {
      const children = await getRepository().listGuardianChildrenSummaries(guardianId, institutionId);
      res.status(200).json({ success: true, count: children.length, children });
    } catch {
      res.status(503).json({ success: false, error: 'GUARDIAN_CHILDREN_UNAVAILABLE' });
    }
  };
}
