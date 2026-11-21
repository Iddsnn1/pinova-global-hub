# Education API Route Inventory — Preview Migration

Scope: `fix/education-global-neon-integrity` only. This is an inventory and migration checklist; it does not change runtime behavior or data.

## Verified runtime dependency

The Education route block in `server.ts` uses the synchronous `educationRepo` (legacy `EducationRepository`) across public directory, academic hierarchy, students, guardian summaries, invoices, payments, receipts, admissions, scholarships, verification, analytics, and audit-log endpoints. The async `NeonEducationRepository` is not wired into these handlers.

## Route-to-repository matrix

| Route family | Current repository calls | Required durable read contract | Scope / migration gate |
|---|---|---|---|
| `GET /api/education/institutions` | `getInstitutions(filter)` | `listInstitutions` with country, state/subdivision, tier, public flag, type, verification, search, bounded pagination | Public catalog; preserve normalization and response fields. Current Neon method omits state, tier, and isPublic filters. |
| `GET /institutions/:id` and hierarchy routes | `getInstitutionById`, faculty/department/programme getters | Institution aggregate read, then hierarchy extraction | Hierarchy is embedded in institution JSON today; do not invent separate tables or flattening semantics without a schema decision. |
| `GET /students/:id` | `getStudentById` | `getStudentById(id, institutionId)` plus an explicit self/global-admin policy | Institution staff must be scoped to authenticated institution. For self access, derive institution scope from trusted identity mapping; do not perform an unscoped read then filter. |
| Guardian child routes | `getGuardianChildrenSummaries` | Guardian-child list scoped by guardian identity and, where relevant, institution; invoice aggregation in SQL or a tested service | Current implementation reads guardian children and invoices from local stores. Institution admin must not load other-institution rows before filtering. |
| `GET /invoices`, `GET /invoices/:id` | `getInvoices`, `getInvoiceById` | Scoped invoice list/get, with trusted guardian/student identity and institution scope | Existing list authorization supports global roles, institution staff, guardian owner, or student owner. SQL filters must enforce the same policy, not merely hide results after loading. |
| `POST /invoices/pay` and invoice payment history | `getInvoiceById`, `recordPayment`, `getPaymentsByInvoiceId` | Transactional invoice/payment/receipt repository contract | High risk: settlement writes and Pi verification are explicitly out of scope for this migration slice. Do not modify payment route, Pi checkout, or settlement semantics. |
| Receipt verify/detail | `verifyReceipt`, `getReceiptByNumber` | Public cryptographic verification read plus authenticated tenant-scoped receipt detail | Keep public verification distinct from private receipt detail; preserve verification hash semantics. |
| Admissions list/status/offer | `getAdmissions`, `getAdmissionById`, `updateAdmissionStatus`, `acceptAdmissionOffer` | Scoped admissions list/get and transactional state transition | Institution admin must match admission institution; offer acceptance must remain applicant-only. Status transitions require provider authorization before write. |
| Admission document list/upload | `getAdmissionById`, `listEducationAdmissionDocuments`, `saveEducationAdmissionDocument` | Neon admission owner lookup + document metadata repository + S3 object lifecycle | Current list/upload route resolves admission ownership from file-backed repository. Fix this dependency before calling document flow fully durable. Upload remains applicant-only. |
| Scholarships | `getScholarships`, scholarship create method | Scholarship catalog read/write with sponsor/provider provenance | Do not present unverified catalogue entries as authoritative. Institution writes must carry authenticated institution scope. |
| Institution verification | `verifyInstitution` | Scoped institution update plus immutable audit event | Positive verification remains provider-backed; no admin-only promotion to VERIFIED. |
| Institution analytics | `getInstitutionAnalytics` | Tenant-scoped aggregate queries | Institution admin must be restricted to own institution; global roles need explicit policy. |
| Audit logs | `getAuditLogs` | Append-only audit repository with actor/entity filters and integrity verification | Audit writes should be atomic with business transactions; do not silently lose logs on Neon failure. |

## Gaps confirmed in current Neon adapter/schema

1. The current adapter provides institution list/get, scoped student get, scoped invoice get/list, and scoped admissions list only.
2. Institution list adapter currently lacks legacy filters for state/subdivision, tier, and public/private status.
3. Academic hierarchy is stored inside institution JSON payload; there are no dedicated faculty, department, or programme tables in the inspected Preview schema.
4. Guardian summary aggregation is not implemented in the Neon adapter.
5. Payment, receipt, scholarship, audit-log, admission-by-id, and document-metadata repository methods are not implemented in the adapter.
6. `education_admission_documents` has owner and nullable application id, but no institution id and no FK to admissions. Ownership is currently resolved through the legacy admission repository in route handlers.
7. `EducationRepository` and `StorageEngine` still use synchronous JSON file persistence; a serverless local filesystem is not a shared durable database.

## Security and correctness gates before route rewiring

- Never query a tenant record by entity ID alone when the caller is not a global role or verified owner. Scope SQL with authenticated institution/student/guardian identity.
- Resolve ownership from trusted server-side identity and persisted relationships, not client-supplied role or institution headers.
- Keep public institution discovery separate from private student, financial, admission, and document data.
- Preserve response envelopes and field names while introducing async handlers.
- Add route integration tests for cross-institution access, applicant ownership, guardian/student ownership, global-role exceptions, missing scope, and Neon outage.
- Do not introduce silent fallback to `StorageEngine`; fail closed if the durable path is enabled but unavailable.
- Do not wire payment, Pi settlement, receipt issuance, or payment-history routes in the same change as read-only catalog/admission migration.

## Recommended next slices

1. Extend and test Neon read contracts for institution filters, institution aggregate, admission-by-id, guardian summaries, scholarship catalog, and audit reads.
2. Add an explicit, default-off Preview-only feature flag and test schema readiness/fail-closed behavior.
3. Wire only low-risk public institution directory reads first, preserving exact filtering and response shape; then test Preview.
4. Wire private reads only after tenant-scoped query contracts and route integration tests pass.
5. Treat all writes and payment-related routes as a separate transaction-focused phase with explicit rollback/reconciliation design.

No database migration or data mutation is authorized by this inventory.
