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
export * from './repositories/ProductRepository';
export * from './repositories/OrderRepository';

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
import { ProductRepository } from './repositories/ProductRepository';
import { OrderRepository } from './repositories/OrderRepository';
import { applyEducationHierarchyVerificationOverrides } from '../../data/educationHierarchyVerificationOverrides';
import { applyYabatechHierarchyVerificationOverride } from '../../data/yabatechHierarchyVerificationOverride';
import { normalizeBukFacultyHierarchy } from '../../data/bukHierarchyNormalization';
import { getSafeEducationHierarchy } from '../../data/educationDataIntegrity';

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
export const productRepo = new ProductRepository();
export const orderRepo = new OrderRepository();

// Reconcile authoritative hierarchy corrections after durable snapshots load.
// The final integrity pass is intentionally server-side: API consumers must not
// be able to bypass the same anti-fabrication rules enforced by UI read paths.
for (const institution of educationRepo.getInstitutions()) {
  const corrected = applyEducationHierarchyVerificationOverrides(institution);
  const withYabatechCorrection = applyYabatechHierarchyVerificationOverride(corrected);
  const withBukNormalization = normalizeBukFacultyHierarchy(withYabatechCorrection);
  Object.assign(institution, getSafeEducationHierarchy(withBukNormalization));
}
