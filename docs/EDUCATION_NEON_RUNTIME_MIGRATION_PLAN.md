# Education Neon Runtime Migration Plan

Status: Preview-only engineering plan. This document does not change runtime behavior or database contents.

## Verified baseline

- Target branch: `fix/education-global-neon-integrity`
- Preview Neon branch: `pinova-neon-preview-test-data` (`br-shiny-dust-b2gghz70`), database `neondb`.
- The relational-integrity migration is applied on Preview and its six added foreign keys are validated.
- The Education tables inspected on Preview currently report zero bytes of table data / no application rows.
- CI run #1313 passed TypeScript typecheck, critical API route typecheck, build, and tests.
- PR #24 remains an open Draft and must not be merged as part of this work.
- Production Neon, production environment/domain, Pi checkout/payment, and legacy Blob are out of scope.

## Current runtime boundary

`src/server/db/repositories/EducationRepository.ts` is still synchronous and constructs `StorageEngine` instances for institutions, students, guardian links, invoices, payments, receipts, admissions, scholarships, and audit logs.

`src/server/db/StorageEngine.ts` reads and writes JSON files with synchronous filesystem calls. Its default path is `data/db`, with a fallback to `/tmp/pinova_db`. Neither path is a shared, durable, multi-instance persistence contract for serverless deployments. Do not treat this implementation as production-grade durable storage.

`src/server/db/repositories/NeonEducationRepository.ts` is an asynchronous read adapter only. It is not wired into the API routes and does not yet implement writes, payments, receipts, scholarships, guardian summaries, or audit persistence.

Admission document metadata is separately stored by `EducationDocumentStorage.ts` in `education_admission_documents`; object bytes use S3-compatible storage. The document-list route still obtains the admission/application ownership context through the legacy Education repository, so the Neon-backed document metadata alone does not make the whole document workflow durable.

## Schema contract observations

Preview tables use relational columns plus a JSONB `data` payload. The adapter must preserve both representations consistently.

- Institutions: `id`, `country_code`, `institution_type`, `verification_status`, `data`.
- Students: `id`, `institution_id`, `guardian_id`, `status`, `data`.
- Admissions: `id`, `institution_id`, `status`, `applicant_email`, `data`.
- Invoices: `id`, `institution_id`, `student_id`, `status`, `currency`, amount columns, `data`.
- Payments: invoice/institution/student scope, Pi identifiers, idempotency key, amount/status, `data`.
- Receipts: receipt number, payment/invoice references, verification hash, `data`.
- Scholarships and audit logs have dedicated relational columns and JSONB payloads.
- Admission documents currently have `owner_username` and nullable `application_id`, but no `institution_id` column and no FK to admissions.

Do not add document-table columns or constraints until the route ownership source, admission identity mapping, nullability/backfill policy, and object-store lifecycle have been reviewed together.

## Required staged migration

### Stage A — Contract and mapping (no writes)
1. Define explicit serializers/deserializers for every Education entity.
2. Map every model property to authoritative relational columns and JSONB payload fields.
3. Decide whether JSONB is the canonical aggregate snapshot or whether normalized columns are canonical; avoid two independently mutable sources of truth.
4. Add schema-version checks and fail-closed behavior for missing or incompatible schema.
5. Add contract tests for malformed JSONB, nulls, decimals, timestamps, and old records.

### Stage B — Read-path adoption (Preview only)
1. Extend the async repository for all read operations required by routes.
2. Require tenant scope for every student, admission, invoice, payment, receipt, guardian, and document lookup.
3. Convert route handlers to async only where their repository contract is fully implemented.
4. Keep the old implementation isolated behind an explicit, default-off Preview feature flag; never silently fall back to local files when Neon is unavailable.
5. Add route integration tests for cross-institution IDOR, applicant ownership, global-admin scope, pagination, and database outage behavior.

### Stage C — Transactional writes (Preview only)
1. Implement parameterized Neon writes for institutions, students, admissions, invoices, payments, receipts, scholarships, guardian links, and audit records.
2. Use transactions for related multi-row operations, especially invoice/payment/receipt state transitions.
3. Preserve unique idempotency keys and Pi payment identifiers; do not change Pi checkout or settlement behavior in this migration.
4. Ensure audit records are committed atomically with the business operation they describe.
5. Add concurrency, duplicate-request, retry, rollback, and process-restart tests.

### Stage D — Document workflow
1. Move admission/application ownership resolution to the durable admission repository before using document metadata as authoritative.
2. Decide and document how `application_id` maps to `education_admissions.id` and how institution ownership is derived.
3. Add institution linkage only through a reviewed, backward-compatible migration with a defined treatment for existing null values.
4. Verify object upload, metadata insert, cleanup on failure, authorization, and download access as one workflow.

### Stage E — Cutover gates
- All Education routes use the async durable repository; no file-backed fallback remains in the active route path.
- Preview CI and integration tests pass, including restart/concurrency and tenant-isolation suites.
- Preview smoke tests verify create/read/update flows and document lifecycle against Preview Neon and the configured Preview object store.
- Data reconciliation and rollback procedures are reviewed and tested.
- Explicit approval is obtained before any Production schema or runtime work. No Production action is implied by this plan.

## Immediate next implementation slice

Start with a read-only route inventory and repository contract matrix. For each Education route, record the current repository method, tenant identity source, required Neon query, and response shape. Then implement missing Neon read methods with mocked contract tests before changing route wiring. No DDL or DML is required for this slice.
