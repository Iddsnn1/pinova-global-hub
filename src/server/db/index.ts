export * from './types';
export * from './StorageEngine';
export * from './repositories/PaymentLedgerRepository';
export * from './repositories/PstpAuditRepository';
export * from './repositories/PstpDisputeRepository';
export * from './repositories/FlightFulfillmentRepository';
export * from './repositories/UtilityFulfillmentRepository';
export * from './repositories/SecurityEventRepository';
export * from './repositories/IdempotencyRepository';
export * from './repositories/PlatformConfigRepository';
export * from './repositories/VendorApplicationRepository';
export * from './repositories/EducationRepository';

import { PaymentLedgerRepository } from './repositories/PaymentLedgerRepository';
import { PstpAuditRepository } from './repositories/PstpAuditRepository';
import { PstpDisputeRepository } from './repositories/PstpDisputeRepository';
import { FlightFulfillmentRepository } from './repositories/FlightFulfillmentRepository';
import { UtilityFulfillmentRepository } from './repositories/UtilityFulfillmentRepository';
import { SecurityEventRepository } from './repositories/SecurityEventRepository';
import { IdempotencyRepository } from './repositories/IdempotencyRepository';
import { PlatformConfigRepository } from './repositories/PlatformConfigRepository';
import { VendorApplicationRepository } from './repositories/VendorApplicationRepository';
import { EducationRepository } from './repositories/EducationRepository';
import { applyEducationHierarchyVerificationOverrides } from '../../data/educationHierarchyVerificationOverrides';

// Durable Singleton Repositories
export const paymentLedgerRepo = new PaymentLedgerRepository();
export const pstpAuditRepo = new PstpAuditRepository();
export const pstpDisputeRepo = new PstpDisputeRepository();
export const flightFulfillmentRepo = new FlightFulfillmentRepository();
export const utilityFulfillmentRepo = new UtilityFulfillmentRepository();
export const securityEventRepo = new SecurityEventRepository();
export const idempotencyRepo = new IdempotencyRepository();
export const platformConfigRepo = new PlatformConfigRepository();
export const vendorApplicationRepo = new VendorApplicationRepository();
export const educationRepo = new EducationRepository();

// Reconcile authoritative hierarchy corrections after durable snapshots load.
// This repairs legacy/incomplete persisted faculty snapshots without changing
// payment, authentication, RBAC, or other repository behavior.
for (const institution of educationRepo.getInstitutions()) {
  const corrected = applyEducationHierarchyVerificationOverrides(institution);
  if (corrected !== institution) {
    // getInstitutionById returns the live cached object; the repository's
    // reconciliation has already persisted seed additions. The override is
    // intentionally applied to the live runtime graph for every process.
    Object.assign(institution, corrected);
  }
}
