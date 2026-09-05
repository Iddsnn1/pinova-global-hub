import { UserRole, Permission } from './types';

export class RoleRepository {
  private static rolePermissions: Record<UserRole, Permission[]> = {
    PLATFORM_ADMIN: [
      'platform.admin.access',
      'platform.audit.read',
      'platform.audit.write',
      'platform.security.read',
      'platform.security.record',
      'platform.config.manage',
      'pstp.dispute.read',
      'pstp.dispute.create',
      'pstp.dispute.comment',
      'pstp.dispute.resolve',
      'pstp.payment.verify',
      'pstp.payment.refund',
      'education.student.read',
      'education.student.update',
      'education.guardian.read',
      'education.invoice.read',
      'education.invoice.create',
      'education.invoice.settle',
      'education.admission.apply',
      'education.admission.review',
      'education.admission.accept',
      'education.scholarship.read',
      'education.scholarship.manage',
      'education.institution.read',
      'education.institution.manage',
      'education.institution.verify',
      'education.receipt.verify'
    ],
    COMPLIANCE_ADMIN: [
      'platform.audit.read',
      'platform.security.read',
      'platform.security.record',
      'pstp.dispute.read',
      'pstp.dispute.resolve',
      'pstp.dispute.comment',
      'education.institution.read',
      'education.institution.verify',
      'education.receipt.verify',
      'education.student.read',
      'education.invoice.read'
    ],
    COMPLIANCE_OFFICER: [
      'platform.audit.read',
      'platform.security.read',
      'platform.security.record',
      'pstp.dispute.read',
      'pstp.dispute.resolve',
      'pstp.dispute.comment',
      'education.institution.read',
      'education.institution.verify',
      'education.receipt.verify',
      'education.student.read',
      'education.invoice.read'
    ],
    FINANCE_ADMIN: [
      'education.invoice.read',
      'education.invoice.create',
      'education.invoice.settle',
      'education.scholarship.read',
      'education.scholarship.manage',
      'education.receipt.verify',
      'pstp.payment.verify',
      'pstp.payment.refund'
    ],
    INSTITUTION_ADMIN: [
      'education.institution.read',
      'education.institution.manage',
      'education.student.read',
      'education.student.update',
      'education.invoice.read',
      'education.invoice.create',
      'education.admission.review',
      'education.scholarship.read',
      'education.scholarship.manage',
      'education.receipt.verify'
    ],
    BURSAR: [
      'education.invoice.read',
      'education.invoice.create',
      'education.invoice.settle',
      'education.student.read',
      'education.institution.read',
      'education.receipt.verify'
    ],
    ADMISSIONS_OFFICER: [
      'education.admission.review',
      'education.admission.accept',
      'education.student.read',
      'education.institution.read'
    ],
    TEACHER: [
      'education.student.read',
      'education.institution.read'
    ],
    GUARDIAN: [
      'education.guardian.read',
      'education.student.read',
      'education.invoice.read',
      'education.invoice.settle',
      'education.admission.apply',
      'education.admission.accept',
      'education.scholarship.read',
      'education.institution.read',
      'education.receipt.verify',
      'pstp.dispute.create',
      'pstp.dispute.comment',
      'pstp.dispute.read'
    ],
    STUDENT: [
      'education.student.read',
      'education.invoice.read',
      'education.invoice.settle',
      'education.admission.apply',
      'education.admission.accept',
      'education.scholarship.read',
      'education.institution.read',
      'education.receipt.verify',
      'pstp.dispute.create',
      'pstp.dispute.comment',
      'pstp.dispute.read'
    ],
    SELLER: [
      'pstp.dispute.read',
      'pstp.dispute.comment',
      'pstp.payment.verify'
    ],
    BUYER: [
      'pstp.dispute.create',
      'pstp.dispute.comment',
      'pstp.dispute.read',
      'education.institution.read',
      'education.scholarship.read',
      'education.receipt.verify'
    ],
    PIONEER: [
      'education.institution.read',
      'education.scholarship.read',
      'education.receipt.verify',
      'pstp.dispute.create',
      'pstp.dispute.comment',
      'pstp.dispute.read'
    ]
  };

  public static getPermissionsForRole(role: UserRole): Permission[] {
    return this.rolePermissions[role] || [];
  }

  public static getPermissionsForRoles(roles: UserRole[]): Set<Permission> {
    const permissions = new Set<Permission>();
    for (const role of roles) {
      const perms = this.getPermissionsForRole(role);
      for (const p of perms) {
        permissions.add(p);
      }
    }
    return permissions;
  }

  public static hasPermission(roles: UserRole[], permission: Permission): boolean {
    const permissions = this.getPermissionsForRoles(roles);
    return permissions.has(permission);
  }
}
