# Education Institution Directory v2 — API Contract Proposal

Status: design-only, Preview-first. This document does not change runtime behavior, database schema, or data.

## Purpose

Introduce a bounded, predictable directory API without changing the legacy `GET /api/education/institutions` contract. The legacy route currently returns every matching record in `{ success, count, institutions }`; existing clients depend on that behavior.

Proposed route:

`GET /api/education/v2/institutions`

The v2 route is a separate contract. It must not be enabled until route-level tests and Preview verification pass.

## Query parameters

The v2 endpoint accepts the existing directory filters:

- `countryCode` or legacy alias `country` (countryCode takes precedence)
- `state`
- `tier`
- `institutionType`
- `isPublic` (`true` or `false` only)
- `search`
- `verificationStatus`

Pagination:

- `limit`: integer from 1 through 100; default 50.
- `offset`: integer greater than or equal to 0; default 0.
- Reject malformed, fractional, negative, or out-of-range pagination values with HTTP 400. Do not silently coerce invalid values.
- Trim string filters; treat documented `all` / `ALL` sentinels consistently with the existing repository contract.
- Enforce a reasonable maximum length for search and other string filters at the route boundary.

## Response envelope

Successful response (HTTP 200):

```json
{
  "success": true,
  "count": 237,
  "institutions": [],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 237,
    "hasMore": true
  }
}
```

Contract rules:

- `count` and `pagination.total` are the exact total matching the same normalized filters, independent of page size.
- `institutions` contains at most `limit` records.
- `hasMore` is `offset + institutions.length < total`.
- Use deterministic ordering with a stable tie-breaker (institution name, then immutable institution ID).
- The page query and count query must use exactly the same filter normalization and predicates.
- If a consistent point-in-time page/count snapshot cannot be guaranteed by the chosen query strategy, document that limitation and use a single SQL statement/transaction snapshot before claiming strict snapshot consistency.

## Error behavior

- HTTP 400: `INVALID_DIRECTORY_QUERY` for invalid query values.
- HTTP 503: `EDUCATION_DIRECTORY_V2_DISABLED` when the Preview feature gate is off.
- HTTP 503: `EDUCATION_DIRECTORY_SCHEMA_NOT_READY` when required Neon schema is unavailable.
- HTTP 503: `EDUCATION_DIRECTORY_UNAVAILABLE` for Neon connectivity/query failures.
- Never fall back to `StorageEngine` or static institution fixtures when the v2 durable route is enabled.
- Do not return database connection details, SQL text, credentials, or stack traces to clients.

## Data and security boundaries

- This is a public institution-catalog read only. It must not expose student, guardian, applicant, invoice, payment, receipt, or document data.
- The route must use the existing Neon directory repository and its exact count method.
- No client-supplied role, institution, tenant, or authorization headers are trusted for this public read.
- Do not add or alter database schema as part of this API contract.
- The endpoint must be explicitly feature-gated and default off. Enablement is permitted only in the Preview environment after verification; Production must remain untouched.
- A Neon outage must fail closed. Do not serve a stale or partial directory while reporting it as complete.

## Client migration requirements

1. Add a separate typed client method such as `getInstitutionPage(filter, pagination)`; retain `getInstitutions(filter)` unchanged for legacy consumers.
2. Migrate the public `InstitutionDirectory` to page/load-more behavior. Reset offset when any filter changes, prevent duplicate concurrent page loads, and de-duplicate appended rows by immutable institution ID.
3. Display total results and an explicit loading/error/end-of-results state. Do not imply that one page is the complete global directory.
4. Do not migrate `InstitutionAdminPortal` to the public directory endpoint. Replace its current global-list/first-row selection with a server-authorized institution-scoped identity lookup or selector. The authenticated institution must be derived from trusted server identity, not a client-selected ID.
5. Do not route US/Canada/UK registry adapter merges through a single local page. Those adapters currently merge full local and external datasets in memory. Either preserve their independently complete behavior behind a separate contract or design a page-aware merge with a truthful total/coverage model. Never label a partial merged page as a complete national/global registry.
6. Keep the legacy endpoint and its response envelope unchanged until every consumer has an explicit migration and compatibility tests.

## Required tests before Preview enablement

- Defaults: limit 50, offset 0.
- Boundary values: limit 1 and 100; offset 0 and a large valid offset.
- Reject fractional, negative, malformed, and over-limit values.
- Exact count is independent of the page limit and uses the same normalized filters as the page query.
- Stable ordering across adjacent pages; no duplicate or skipped IDs in a fixed dataset.
- Filter parity for country aliases, subdivisions, tier, institution type, public/private, verification status, and search.
- Empty result and final-page `hasMore=false` behavior.
- Feature gate default-off and disabled response.
- Schema-not-ready and Neon outage fail-closed behavior; no file/static fallback.
- Legacy route contract remains unchanged.
- Directory UI filter reset, load-more, duplicate suppression, error/retry, and empty states.
- Admin portal cannot select another institution by manipulating a query parameter or client state.
- Registry adapter tests prove that partial pages are not reported as complete national/global coverage.

## Rollout gates

1. Contract and tests reviewed.
2. Route implemented behind a default-off flag; legacy route untouched.
3. Unit and route integration suites pass in CI.
4. Preview-only feature flag enabled for controlled testing.
5. Compare v2 results and totals against the legacy directory on a known Preview fixture set.
6. Verify the public directory UI and registry coverage semantics.
7. Keep Production, Production Neon, Pi checkout/payment, and legacy Blob unchanged. No merge or production promotion is authorized by this proposal.

## Current blockers

- The directory UI has no pagination state or total-count display.
- The admin portal currently loads the global directory and chooses its first row; this must be replaced with trusted institution scoping.
- The US/Canada/UK adapters merge complete local and remote datasets in memory and are not page-aware.
- Route-level test coverage for an async Neon-backed Express handler has not yet been added.

This proposal is a design artifact only; it does not authorize route wiring, data changes, migration, deployment, merge, or Production enablement.
