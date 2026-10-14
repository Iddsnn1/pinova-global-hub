# Utility checkout release gates

This document is a release checklist for the Neon-backed utility invoice flow. It does not enable provider fulfillment or apply database migrations.

## Current safe state

- `POST /api/v2/utility/invoices` creates a server-priced invoice for the authenticated user.
- `POST /api/v2/utility/invoices/:invoiceId/payment` binds a Pi payment identifier to that user's open invoice.
- `GET /api/v2/utility/invoices/:invoiceId` exposes status only to the authenticated owner and matching Pi UID.
- `POST /api/v2/utility/fulfill` intentionally returns HTTP 503. Keep it disabled until all gates below pass.
- The orchestrator exists, but it is not wired into a live HTTP checkout route.

## Required before any live checkout route

1. **Identity:** use the server-authenticated user ID and Pi UID; compare the authoritative Pi Platform `user_uid` with the invoice's persisted owner Pi UID.
2. **Payment:** fetch the payment from Pi Platform on the server; require the exact payment identifier, `user_to_app` direction, expected Pi network, `developer_completed === true`, `transaction.verified === true`, transaction ID, and exact invoice amount in pico-Pi units.
3. **Invoice state:** reject expired, cancelled, failed, or already-claimed invoices. A payment ID must not be reusable across invoices.
4. **Atomic reservation:** reserve invoice, payment idempotency key, transaction ID, and fulfillment attempt in one database transaction before calling any provider.
5. **Provider allowlist:** derive provider operation, service identifier, and amount from server-side catalog/configuration. Never use a client-supplied provider URL, operation, amount, or package ID as authority.
6. **Airtime amount:** validate Nigerian custom amounts and server-resolved provider minimum/maximum/denomination rules. UI preset chips are convenience only, not provider authorization.
7. **Outcome handling:** persist provider reference and result. Treat timeouts or database write failures after dispatch as UNKNOWN/PENDING and reconcile before retrying; never blindly dispatch again.
8. **Receipt/status:** provide an owner-bound status endpoint and safe receipt fields; do not expose full account numbers, provider credentials, or raw provider payloads.
9. **Operational controls:** require server-only credentials, rate limits, redacted logs, bounded provider timeouts, monitoring, and a documented manual reconciliation path.
10. **Verification:** add/maintain tests for wrong owner, wrong payment ID, wrong network, wrong direction, wrong amount, unverified/incomplete payment, expired invoice, replay, concurrent checkout, provider timeout, and persistence failure after provider dispatch.

## Release sequence

- Run CI and inspect the Vercel preview check.
- Review the code diff and confirm the checkout feature remains disabled by default.
- Obtain explicit operator approval before applying Neon migrations or enabling live provider fulfillment.
- Apply the migration only through an approved deployment procedure, then run schema/health checks.
- Exercise the complete flow in a sandbox with a mocked provider; verify replay/concurrency behavior and reconciliation.
- Enable live fulfillment only after all tests pass and an explicit production go-ahead.

## Do not do

- Do not delete or rewrite legacy Blob stores or their existing data.
- Do not treat a client FX estimate as payment authorization.
- Do not call VTU.ng or another fulfillment provider before authoritative payment verification and durable idempotency reservation.
- Do not automatically retry an UNKNOWN provider outcome.

## Audit findings — 2026-10-14

- The latest checked commit has successful results for Currency Engine Validation, PiNova CI, PiNova CI Verify, PiNova Global Hub CI, and the Vercel check.
- The HTTP checkout route is still absent: the existing orchestrator is not yet called by a checkout endpoint. Do not treat passing unit suites as proof of end-to-end checkout readiness.
- The VTU.ng airtime adapter sends `Math.round(params.amount)`. Before integrating it, the server must enforce the allowed airtime service, NGN currency, whole-naira amount, phone/account format, and provider-specific limits from trusted configuration. Do not silently round a persisted invoice amount during dispatch.
- The compatibility migration leaves `owner_pi_uid` nullable for legacy rows on purpose. Such rows must remain ineligible for payment until a verified owner UID is established; never backfill it from the internal user ID.
- Existing orchestrator/repository tests cover core authorization, replay, expiry, and pending outcomes, but a mocked HTTP-route integration test is still required before a checkout route can be considered release-ready.


## Authenticated checkout route status (2026-10-14)

- `POST /api/v2/utility/invoices/:invoiceId/checkout` is wired to the canonical invoice repository, authoritative Pi verification, reservation/idempotency, and the VTU.ng Airtime adapter.
- It is guarded by `PINOVA_UTILITY_CHECKOUT_ENABLED === "true"`; the flag has **not** been set in Vercel and must remain unset pending explicit release approval.
- When disabled, the route returns `503 UTILITY_CHECKOUT_DISABLED` before opening a database connection or contacting any provider.
- Current adapter scope is only Nigerian Airtime (NGN) with a supported network ID, valid Nigerian mobile number, and whole-number NGN amount. Other utility categories are rejected before reservation.
- Provider responses that are pending or ambiguous are stored as `UNKNOWN`/pending reconciliation; do not retry a purchase until the original provider request is reconciled. The stable `request_id` is not proof of provider-side idempotency by itself.
- This route addition does not apply migrations, enable the feature flag, merge the PR, or deploy production. CI and Vercel Preview checks must complete before considering the code ready for review.


## CI status follow-up — 2026-10-14

The GitHub Actions runs associated with commit `87ee3d38e4edd42bc829b44d045f183e28b2cee5` completed successfully:
- PiNova Global Hub CI
- PiNova CI
- PiNova CI Verify
- Currency Engine Validation

The Vercel status check for that exact commit was still reported as `pending` at the last status poll. Therefore, a successful GitHub CI result is not being represented as a successful Vercel Preview deployment. Keep the checkout feature flag unset and do not perform live provider tests until Preview is confirmed and the reviewed Neon migration has been applied through an approved process.
