export interface EducationVerificationAccessInput {
  roles: string[];
  authenticatedInstitutionId?: string;
  requestedInstitutionId?: string;
}

export interface EducationVerificationAccessResult {
  allowed: boolean;
  institutionId?: string;
  error?: 'FORBIDDEN' | 'INSTITUTION_SCOPE_REQUIRED';
}

const GLOBAL_VERIFICATION_ROLES = ['PLATFORM_ADMIN', 'COMPLIANCE_ADMIN', 'COMPLIANCE_OFFICER'];
const INSTITUTION_VERIFICATION_ROLES = ['INSTITUTION_ADMIN', 'ADMISSIONS_OFFICER'];

function normalized(value?: string): string | undefined {
  const result = String(value || '').trim();
  return result || undefined;
}

/**
 * Student verification is staff-only until student/guardian ownership can be
 * proven against a durable student identity record. Institution staff are
 * pinned to their authenticated institution; global compliance roles must
 * explicitly supply the institution they are reviewing.
 */
export function resolveStudentVerificationAccess(
  input: EducationVerificationAccessInput
): EducationVerificationAccessResult {
  const roles = input.roles || [];
  const ownInstitution = normalized(input.authenticatedInstitutionId);
  const requestedInstitution = normalized(input.requestedInstitutionId);
  const isGlobal = roles.some((role) => GLOBAL_VERIFICATION_ROLES.includes(role));
  const isInstitutionStaff = roles.some((role) => INSTITUTION_VERIFICATION_ROLES.includes(role));

  if (!isGlobal && !isInstitutionStaff) return { allowed: false, error: 'FORBIDDEN' };
  if (isInstitutionStaff && !ownInstitution) {
    return { allowed: false, error: 'INSTITUTION_SCOPE_REQUIRED' };
  }
  if (isInstitutionStaff && requestedInstitution && requestedInstitution !== ownInstitution) {
    return { allowed: false, error: 'FORBIDDEN' };
  }
  const institutionId = isGlobal ? requestedInstitution : ownInstitution;
  if (!institutionId) return { allowed: false, error: 'INSTITUTION_SCOPE_REQUIRED' };
  return { allowed: true, institutionId };
}

/** Institution accreditation checks are reserved for global compliance staff. */
export function canVerifyInstitutionAccreditation(roles: string[]): boolean {
  return (roles || []).some((role) => GLOBAL_VERIFICATION_ROLES.includes(role));
}
