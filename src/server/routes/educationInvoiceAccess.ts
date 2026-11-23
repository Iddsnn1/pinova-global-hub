export interface EducationInvoiceListScopeInput {
  roles: string[];
  username?: string;
  userId?: string;
  guardianId?: string;
  institutionId?: string;
  query: {
    studentId?: unknown;
    institutionId?: unknown;
    status?: unknown;
    guardianId?: unknown;
  };
}

export interface EducationInvoiceListScopeResult {
  allowed: boolean;
  error?: 'FORBIDDEN' | 'INSTITUTION_SCOPE_REQUIRED';
  filter: {
    studentId?: string;
    institutionId?: string;
    status?: string;
    guardianId?: string;
  };
}

function queryValue(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  const normalized = String(value).trim();
  return normalized || undefined;
}

/**
 * Derive invoice-list filters from authenticated identity.
 * Institution administrators are always pinned to their own institution,
 * even when the client omits institutionId. A conflicting client scope fails closed.
 */
export function resolveEducationInvoiceListScope(
  input: EducationInvoiceListScopeInput
): EducationInvoiceListScopeResult {
  const roles = input.roles || [];
  const isGlobalAdmin = roles.some((role) =>
    ['PLATFORM_ADMIN', 'BURSAR', 'FINANCE_ADMIN'].includes(role)
  );
  const isInstitutionAdmin = roles.includes('INSTITUTION_ADMIN');
  const requestedInstitution = queryValue(input.query.institutionId);
  const requestedGuardian = queryValue(input.query.guardianId);
  const requestedStudent = queryValue(input.query.studentId);
  const username = queryValue(input.username);
  const userId = queryValue(input.userId);
  const guardianId = queryValue(input.guardianId);
  const ownInstitution = queryValue(input.institutionId);

  if (isInstitutionAdmin && !ownInstitution) {
    return { allowed: false, error: 'INSTITUTION_SCOPE_REQUIRED', filter: {} };
  }
  if (isInstitutionAdmin && requestedInstitution && requestedInstitution !== ownInstitution) {
    return { allowed: false, error: 'FORBIDDEN', filter: {} };
  }

  const ownsGuardianFilter = Boolean(
    requestedGuardian &&
    ((username && requestedGuardian.toLowerCase() === username.toLowerCase()) ||
      (userId && requestedGuardian === userId) ||
      (guardianId && requestedGuardian.toLowerCase() === guardianId.toLowerCase()))
  );
  const ownsStudentFilter = Boolean(
    requestedStudent &&
    ((username && requestedStudent.toLowerCase() === username.toLowerCase()) ||
      (userId && requestedStudent === userId))
  );

  if (!isGlobalAdmin && !isInstitutionAdmin && !ownsGuardianFilter && !ownsStudentFilter) {
    return { allowed: false, error: 'FORBIDDEN', filter: {} };
  }

  const filter: EducationInvoiceListScopeResult['filter'] = {};
  if (requestedStudent) filter.studentId = requestedStudent;
  const effectiveInstitution = isInstitutionAdmin ? ownInstitution : requestedInstitution;
  if (effectiveInstitution) filter.institutionId = effectiveInstitution;
  const status = queryValue(input.query.status);
  if (status) filter.status = status;
  if (requestedGuardian) filter.guardianId = requestedGuardian;

  return { allowed: true, filter };
}
