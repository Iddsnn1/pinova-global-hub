export interface EducationPaymentHistoryAccessInput {
  roles: string[];
  institutionId?: string;
  username?: string;
  userId?: string;
  guardianId?: string;
  studentId?: string;
  invoice: {
    institutionId?: string;
    guardianId?: string;
    studentId?: string;
    studentName?: string;
  };
}

function normalized(value?: string): string | undefined {
  const result = String(value || '').trim();
  return result || undefined;
}

function sameIdentity(left?: string, right?: string): boolean {
  const a = normalized(left);
  const b = normalized(right);
  return Boolean(a && b && a.toLowerCase() === b.toLowerCase());
}

/**
 * Payment history is visible to platform admins, staff bound to the invoice's
 * institution, or the authenticated guardian/student who owns the invoice.
 * Institution finance roles are never treated as global administrators.
 */
export function resolveEducationPaymentHistoryAccess(
  input: EducationPaymentHistoryAccessInput
): { allowed: boolean } {
  const roles = input.roles || [];
  if (roles.includes('PLATFORM_ADMIN')) return { allowed: true };

  const institutionStaff = roles.some((role) =>
    ['INSTITUTION_ADMIN', 'BURSAR', 'FINANCE_ADMIN'].includes(role)
  );
  if (
    institutionStaff &&
    normalized(input.institutionId) &&
    normalized(input.institutionId) === normalized(input.invoice.institutionId)
  ) return { allowed: true };

  const guardianOwned =
    sameIdentity(input.invoice.guardianId, input.username) ||
    sameIdentity(input.invoice.guardianId, input.userId) ||
    sameIdentity(input.invoice.guardianId, input.guardianId);
  const studentOwned =
    sameIdentity(input.invoice.studentId, input.username) ||
    sameIdentity(input.invoice.studentId, input.userId) ||
    sameIdentity(input.invoice.studentId, input.studentId) ||
    sameIdentity(input.invoice.studentName, input.username);

  return { allowed: guardianOwned || studentOwned };
}
