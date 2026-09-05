import type { Request } from 'express';

export type UserRole =
  | 'STUDENT'
  | 'GUARDIAN'
  | 'INSTITUTION_ADMIN'
  | 'BURSAR'
  | 'FINANCE_ADMIN'
  | 'ADMISSIONS_OFFICER'
  | 'TEACHER'
  | 'SELLER'
  | 'PLATFORM_ADMIN'
  | 'COMPLIANCE_ADMIN'
  | 'COMPLIANCE_OFFICER'
  | 'BUYER'
  | 'PIONEER';

export type Permission =
  // Education permissions
  | 'education.student.read'
  | 'education.student.update'
  | 'education.guardian.read'
  | 'education.invoice.read'
  | 'education.invoice.create'
  | 'education.invoice.settle'
  | 'education.admission.apply'
  | 'education.admission.review'
  | 'education.admission.accept'
  | 'education.scholarship.read'
  | 'education.scholarship.manage'
  | 'education.institution.read'
  | 'education.institution.manage'
  | 'education.institution.verify'
  | 'education.receipt.verify'
  // PSTP & Marketplace permissions
  | 'pstp.dispute.read'
  | 'pstp.dispute.create'
  | 'pstp.dispute.comment'
  | 'pstp.dispute.resolve'
  | 'pstp.payment.verify'
  | 'pstp.payment.refund'
  // Platform & Security permissions
  | 'platform.audit.read'
  | 'platform.audit.write'
  | 'platform.security.read'
  | 'platform.security.record'
  | 'platform.config.manage'
  | 'platform.admin.access';

export interface UserIdentityEntity {
  id: string;
  username: string;
  piUid?: string;
  email?: string;
  roles: UserRole[];
  institutionId?: string; // If bound to an educational institution
  guardianId?: string;    // If bound to a guardian identity
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  createdAt: string;
  updatedAt: string;
}

export interface SessionEntity {
  token: string;
  userId: string;
  username: string;
  roles: UserRole[];
  institutionId?: string;
  expiresAt: number;
  createdAt: string;
}

export interface AuthenticatedUser {
  id: string;
  username: string;
  piUid?: string;
  roles: UserRole[];
  permissions: Set<Permission>;
  institutionId?: string;
  guardianId?: string;
  isMachineKey?: boolean;
  authMethod?: string;
}

export interface AuthenticatedRequest extends Request {
  authenticatedUser?: AuthenticatedUser;
  user?: AuthenticatedUser;
}
