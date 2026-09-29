import {
  StudentIdentity,
  GuardianChildSummary,
  EducationInvoice,
  AdmissionApplication,
  ScholarshipOpportunity,
  EducationMarketplaceItem,
  DigitalEducationReceipt,
  EducationPaymentTransaction
} from '../types/education';

/**
 * Deprecated compatibility module.
 *
 * Education production data must come from authoritative provider integrations
 * or authenticated server-created records. This module intentionally contains
 * no demo students, invoices, payments, receipts, admissions, scholarships,
 * marketplace items, or hard-coded guardian identities.
 */
export const SEED_PARENT_USER_ID = '';
export const SEED_STUDENTS: StudentIdentity[] = [];
export const SEED_CHILDREN_SUMMARIES: GuardianChildSummary[] = [];
export const SEED_INVOICES: EducationInvoice[] = [];
export const SEED_RECEIPTS: DigitalEducationReceipt[] = [];
export const SEED_PAYMENTS: EducationPaymentTransaction[] = [];
export const SEED_ADMISSION_APPLICATIONS: AdmissionApplication[] = [];
export const SEED_SCHOLARSHIPS: ScholarshipOpportunity[] = [];
export const SEED_MARKETPLACE_ITEMS: EducationMarketplaceItem[] = [];
