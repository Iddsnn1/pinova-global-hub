# Utility checkout release gates

This checklist describes the Neon-backed utility invoice flow. It does not enable provider fulfillment, apply database migrations, merge the pull request, or deploy production.

## Current safe state

- `POST /api/v2/utility/invoices` creates a server-priced invoice for the authenticated user.
- `POST /api/v2/utility/invoices/:invoiceId/payment` binds a Pi payment identifier to that user's open invoice.
- `GET /api/v2/utility/invoices/:invoiceId` exposes status only to the authenticated owner and matching Pi UID.
- `POST /api/v2/utility/invoices/:invoiceId/checkout` is implemented for a narrow Nigerian Airtime (NGN) path and is guarded by `PINOVA_UTILITY_CHECKOUT_ENABLED === "true"`.
- `FlexibleUtilityModal.tsx` now contains the client-side canonical flow for the narrow supported path: request a server-priced invoice, call the Pi SDK with the invoice's Pi amount in `payment-only` mode, bind the returned payment ID, then call the authenticated checkout endpoint. It only creates a `SUCCESS` receipt when checkout returns `FULFILLED` or `RESOLVED`; provider failures and ambiguous outcomes are shown as failed/pending with invoice/payment identifiers. This client flow still requires route-level integration tests and sandbox validation before release.
- The feature flag has not been enabled in Vercel. With the flag unset, checkout returns `503 UTILITY_CHECKOUT_DISABLED` before opening the invoice repository or contacting a provider.
- The legacy `POST /api/v2/utility/fulfill` endpoint remains intentionally disabled with HTTP 503.
- The three utility checkout tables (`utility_invoices`, `utility_payment_idempotency`, `utility_fulfillment_attempts`) were created and checked on the isolated Neon test branch only; production branch migrations have not been applied. Legacy Blob stores and data remain untouched.

## Implemented safeguards

1. **Identity and ownership:** checkout uses the authenticated internal user ID and Pi UID, and compares the Pi Platform payment's `user_uid` with the invoice owner Pi UID.
2. **Authoritative payment verification:** the server-side Pi verifier requires the exact payment identifier, `user_to_app` direction, expected Pi network, `developer_completed === true`, `transaction.verified === true`, transaction ID, and exact amount at pico-Pi precision.
3. **Invoice binding and reservation:** payment IDs are bound to open owner-scoped invoices; the repository reserves invoice/payment idempotency and fulfillment attempt state transactionally before provider dispatch.
4. **Fail-closed service scope:** the checkout route currently accepts only Nigerian Airtime invoices in NGN with an explicit supported network ID, a valid Nigerian mobile number, and a positive whole-naira amount. Unsupported categories/providers are rejected before reservation.
5. **Ambiguous outcomes:** provider timeouts, ambiguous responses, and outcome-persistence failures remain UNKNOWN/PENDING for reconciliation. Do not blindly retry a purchase. The stable provider `request_id` helps correlation but is not proof that the provider guarantees idempotency.
6. **Server-only secrets:** Pi and VTU.ng credentials must stay server-side; no live secrets belong in source control or browser variables.

## Remaining release gates

- [x] Wire the UI to create a canonical server-priced invoice, invoke the Pi SDK using the invoice-issued Pi amount in `payment-only` mode, bind the resulting payment ID, and call the authenticated checkout endpoint after Pi SDK completion. Server-side verification remains authoritative; client callbacks are not proof of payment.
- [x] Separate **Pi payment completion** from **utility fulfillment success** in the UI: a success receipt is emitted only for checkout `FULFILLED`/`RESOLVED`; definite provider failure is shown as failed, and ambiguous outcomes remain pending with invoice/payment identifiers for reconciliation.
- [ ] Review and test all Pi SDK completion/cancellation/error paths against this utility-specific flow; do not interpret generic Pi completion as provider fulfillment.
- [x] Add and run HTTP-route integration coverage for unauthenticated access (401), feature flag OFF (503), malformed invoice ID/payment IDs (400), missing Pi UID (403), and repository outage (503 with `Cache-Control: no-store`).
- [ ] Extend HTTP-route integration coverage for owner mismatch, authoritative payment verification failures, and explicit repository/provider call counters; current route suite does not yet prove those cases.
- [ ] Run route-level tests for wrong payment ID, unverified payment, wrong Pi UID, unsupported provider/service, expired invoice, replay, and concurrent checkout; unit tests for the orchestrator/repository are not a substitute for this HTTP coverage.
- [ ] Confirm the actual VTU.ng contract for duplicate request IDs, status reconciliation, request timeouts, and provider-specific airtime limits/denominations. Do not assume stable request IDs alone prevent duplicate recharges.
- [ ] Confirm the provider response and webhook signature contract against the provider's documentation and test successful, failed, pending, and ambiguous outcomes.
- [ ] Verify the production FX provider's account plan meets the configured quote-freshness policy. The daily free CurrencyAPI plan does not satisfy a 15-minute freshness requirement; do not loosen freshness or substitute a fabricated rate.
- [ ] Apply the reviewed Neon migrations only through an explicitly approved procedure, then verify schema, constraints, health, and rollback/recovery.
- [ ] Complete sandbox checkout with a mocked provider and demonstrate owner-bound receipts/status and reconciliation behavior.

## Validation snapshot — 2026-10-19 (commit 78f9bb3be47afb2f5435cc9671006971898deb24)

- Latest inspected PR #11 head: `78f9bb3be47afb2f5435cc9671006971898deb24`. PR #11 remains open and Draft; it has not been merged.
- All four GitHub Actions workflows passed on this commit:
  - [Currency Engine Validation](https://github.com/Iddsnn1/pinova-global-hub/actions/runs/39262360033)
  - [PiNova CI Verify](https://github.com/Iddsnn1/pinova-global-hub/actions/runs/39262359849)
  - [PiNova CI](https://github.com/Iddsnn1/pinova-global-hub/actions/runs/39262359421)
  - [PiNova Global Hub CI](https://github.com/Iddsnn1/pinova-global-hub/actions/runs/39262359773)
- TypeScript checks, production build, currency conversion tests, and all configured test suites passed in those workflows. The Vercel commit status is `success`; this is a Preview status, not a production deployment or a live checkout proof.
- The latest test change corrected the orchestrator test harness so overridden verifier/fulfillment mocks still increment call counters. The fail-closed assertions remain in place.
- The HTTP checkout route integration suite currently covers unauthenticated access (401), checkout flag OFF (503), malformed invoice/payment IDs (400), missing Pi UID (403), repository outage (503), and malformed FX amount/currency plus unconfigured trusted FX provider failure.
- Full HTTP owner-mismatch and authoritative payment-verification scenarios with explicit provider-call counters remain open. The unit/orchestrator tests do not replace this HTTP coverage.
- The 15-minute FX quote freshness policy remains a blocker until the actual CurrencyAPI plan supplies sufficiently fresh timestamps or a different trusted feed is configured. Do not loosen freshness or fabricate rates.
- Live Pi Wallet + VTU.ng end-to-end fulfillment is not confirmed. Neon production migrations have not been applied; `PINOVA_UTILITY_CHECKOUT_ENABLED` remains OFF; legacy Blob stores and production domain remain unchanged.

## Release sequence

1. Finish route-level tests and review the PR diff.
2. Keep `PINOVA_UTILITY_CHECKOUT_ENABLED` unset while validating the feature.
3. Obtain explicit operator approval before applying Neon migrations or enabling live provider fulfillment.
4. Apply migrations through the approved process and run schema/health checks.
5. Run sandbox tests with a mocked provider, including replay/concurrency and reconciliation.
6. Enable live fulfillment only after all gates pass and explicit production approval.

## Do not do

- Do not delete or rewrite legacy Blob stores or existing `marketplace-orders`, `product-catalog`, or `vendor-applications` data.
- Do not merge the PR, deploy production, apply Neon migrations, or enable live VTU/recharge fulfillment without explicit approval.
- Do not treat a client FX estimate as payment authorization.
- Do not call a fulfillment provider before authoritative Pi verification and durable idempotency reservation.
- Do not automatically retry an UNKNOWN provider outcome.


## Additional audit note — 2026-10-19

- Rechecked current PR head `6f0dde8e9849ae0851ec7cf6c12a73345a470c73`: all four GitHub Actions workflows report success and the Vercel commit status is `success`. This is not evidence of a live payment or provider transaction.
- Reviewed `src/server/integrations/vtuNgAdapter.ts`, `tests/vtu_webhook_signature_suite.ts`, and the `POST /api/v2/utility/vtu/webhook` handler in `server.ts`. Unit tests cover HMAC verification for the exact raw body, absent secret/signature, changed body, and malformed signature. The HTTP handler verifies the signature but deliberately does not mutate fulfillment state; its response states that reconciliation through durable Neon records is still required.
- The webhook signature unit suite is not a substitute for a provider-documented signature contract or HTTP webhook integration tests. Keep webhook-driven state changes disabled until event/request identifiers can be matched to a durable invoice and fulfillment attempt, and duplicate/out-of-order delivery behavior is tested.
- No production setting, Neon production schema, provider transaction, or legacy Blob data was changed during this audit.
