# Education API Route Inventory — Preview Migration

Scope: `fix/education-global-neon-integrity` only. This is an inventory and migration checklist; it does not change runtime behavior or data.

## Verified runtime dependency

The Education route block in `server.ts` uses the synchronous `educationRepo` (legacy `EducationRepository`) across public directory, academic hierarchy, students, guardian summaries, invoices, payments, receipts, admissions, scholarships, verification, analytics, and audit-log endpoints. The async `NeonEducationRepository` is not wired into these handlers.

## Public institution directory: client compatibility findings

The legacy `GET /api/education/institutions` contract returns the full filtered list in `{ success, count, institutions }`; it has no `limit`, `offset`, or page metadata.

Current consumers inspected on this branch:

- `src/services/educationService.ts` calls the legacy endpoint and returns only `data.institutions`. Its public method has no pagination arguments and does not expose count/page metadata.
- `src/components/education/InstitutionDirectory.tsx` stores the returned array as the complete directory. Its filters include country, subdivision, tier, institution type, public/private, and search. It has no page state, total count, or load-more contract in the inspected flow.
- `src/components/education/InstitutionAdminPortal.tsx` loads the entire institution list, uses the first row as the default selection, and renders the complete array in its institution selector. This consumer needs an explicit institution-scope policy; a paginated first page must not be mistaken for the complete authorized institution set.
- `src/services/globalEducationRegistryService.ts` wraps `educationService.getInstitutions`. For US, Canada, and UK requests it merges the local API response with country-registry adapter results in memory, de-duplicates by institution id, and applies additional filters. A paginated server result would make this merge incomplete unless the adapter and merge contract are redesigned deliberately.

Compatibility decision: do not change the legacy endpoint's response or silently cap it. Introduce an additive versioned endpoint such as `GET /api/education/v2/institutions` with bounded `limit` and `offset`, the same filters, and explicit `count` plus `pagination: { limit, offset, total, hasMore }`. Add a separate typed `getInstitutionPage` client method; retain `getInstitutions` for the legacy contract until each consumer is migrated. Directory UI migration must add page/load-more state and preserve filters across pages. Admin portal must first be changed to request only the authenticated institution (or use an explicit authorized institution selector endpoint); it must not rely on the first global page. Global registry adapters need a separately tested merge strategy and must not claim global completeness from a single page.

## Route-to-repository matrix

| Route family | Current repository calls | Required durable read contract | Scope / migration gate |
|---|---|---|---|
| `GET /api/education/institutions` | `getInstitutions(filter)` | `listInstitutions` with country, state/subdivision aliases, tier, public flag, type, verification, search, bounded pagination | Public catalog; Neon adapter implements filters, including country-name normalization, `GLOBAL`/`ALL`, known subdivision aliases, and exact `countInstitutions` independent of page size. Route response parity and Preview integration remain unverified. Legacy route has no pagination contract and returns every match; Neon adapter caps a page at 100. Keep legacy behavior unchanged until the additive v2 contract and all client migrations above are tested. |
| `/institutions/:id` and hierarchy routes | `getInstitutionById`, faculty/department/programme getters | Institution aggregate read, then hierarchy extraction | Neon adapter exposes read-only faculty, department, programme, and institution-programme extraction from the existing JSON aggregate. No separate hierarchy tables are assumed; route response parity remains unverified. |
| `/students/:id` | `getStudentById` | `getStudentById(id, institutionId)` plus an explicit self/global-admin policy | Institution staff must be scoped to authenticated institution. For self access, derive institution scope from trusted identity mapping; do not perform an unscoped read then filter. |
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

1. The current adapter provides institution list/get and hierarchy reads; scoped student get; scoped invoice get/list; scoped admissions list; and admission-by-id lookup requiring exactly one institution or applicant scope.
2. Institution directory filters now include state/subdivision aliases, tier, and public/private status. Broader country-specific alias parity still needs fixture coverage beyond the currently tested Nigeria and UK cases.
3. Academic hierarchy is stored inside institution JSON payload; there are no dedicated faculty, department, or programme tables in the inspected Preview schema. The Neon adapter reads this aggregate but does not write it.
4. Guardian summary aggregation is not implemented in the Neon adapter.
5. Payment, receipt, scholarship, audit-log, admission-by-id, and document-metadata repository methods are not implemented in the adapter.
6. `education_admission_documents` has owner and nullable application id, but no institution id and no FK to admissions. Ownership is currently resolved through the legacy admission repository in route handlers.
7. `EducationRepository` and `StorageEngine` still use synchronous JSON file persistence; a serverless local filesystem is not a shared durable database.
8. Directory UI and global registry adapter are not pagination-aware. Institution Admin Portal also loads the entire public institution list and selects its first result; this must be corrected to an authenticated institution-scoped selector before relying on paginated directory data.

## Security and correctness gates before route rewiring

- Never query a tenant record by entity ID alone when the caller is not a global role or verified owner. Scope SQL with authenticated institution/student/guardian identity.
- Resolve ownership from trusted server-side identity and persisted relationships, not client-supplied role or institution headers.
- Keep public institution discovery separate from private student, financial, admission, and document data.
- Preserve response envelopes and field names while introducing async handlers.
- Add route integration tests for cross-institution access, applicant ownership, guardian/student ownership, global-role exceptions, missing scope, and Neon outage.
- Do not introduce silent fallback to `StorageEngine`; fail closed if the durable path is enabled but unavailable.
- Do not wire payment, Pi settlement, receipt issuance, or payment-history routes in the same change as read-only catalog/admission migration.

## Recommended next slices

1. Implement the additive v2 directory response contract and tests while keeping the legacy route unchanged.
2. Add a typed page-based client method, migrate the public directory to page/load-more behavior, and separately test the US/Canada/UK adapter merge so it cannot report partial results as complete.
3. Replace the Institution Admin Portal's unscoped full-directory load with a server-authorized institution-scoped selector before connecting it to Neon.
4. Extend and test Neon read contracts for institution aggregate, admission-by-id, guardian summaries, scholarship catalog, and audit reads.
5. Add an explicit, default-off Preview-only feature flag and test schema readiness/fail-closed behavior.
6. Wire only low-risk public institution directory reads first, preserving exact filtering and response shape; then test Preview.
7. Wire private reads only after tenant-scoped query contracts and route integration tests pass.
8. Treat all writes and payment-related routes as a separate transaction-focused phase with explicit rollback/reconciliation design.

No database migration or data mutation is authorized by this inventory.
