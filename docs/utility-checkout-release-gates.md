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
- Neon migrations have not been applied by this work. Legacy Blob stores and data remain untouched.

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
- [ ] Add and run a mocked HTTP-route integration test for the feature-flag guard, authentication/owner mismatch, malformed invoice/payment ID, and proof that disabled checkout makes no DB/provider calls.
- [ ] Run route-level tests for wrong payment ID, unverified payment, wrong Pi UID, unsupported provider/service, expired invoice, replay, and concurrent checkout; unit tests for the orchestrator/repository are not a substitute for this HTTP coverage.
- [ ] Confirm the actual VTU.ng contract for duplicate request IDs, status reconciliation, request timeouts, and provider-specific airtime limits/denominations. Do not assume stable request IDs alone prevent duplicate recharges.
- [ ] Confirm the provider response and webhook signature contract against the provider's documentation and test successful, failed, pending, and ambiguous outcomes.
- [ ] Verify the production FX provider's account plan meets the configured quote-freshness policy. The daily free CurrencyAPI plan does not satisfy a 15-minute freshness requirement; do not loosen freshness or substitute a fabricated rate.
- [ ] Apply the reviewed Neon migrations only through an explicitly approved procedure, then verify schema, constraints, health, and rollback/recovery.
- [ ] Complete sandbox checkout with a mocked provider and demonstrate owner-bound receipts/status and reconciliation behavior.

## Validation snapshot — 2026-10-15

- PR head commit `9012b73f4937de062d5bafc9e6e2d02f5bb585ca`; PR #11 remains open and Draft on `feat/global-currency-pi-engine`.
- GitHub combined status reports the Vercel check as **success**. The corresponding Vercel Preview deployment was separately confirmed **Ready** at https://pinova-global-ltgm5elks-iddsnn1s-projects.vercel.app.
- `GET /api/health` and `GET /api/v2/utility/checkout-status` returned HTTP 200 in Preview. These are health/readiness checks, not an authenticated payment or fulfillment test.
- Read-only SQL against the isolated Neon utility-checkout test branch showed that `utility_invoices`, `utility_payment_idempotency`, and `utility_fulfillment_attempts` are not present yet. No migrations were applied.
- Unit suites cover trusted FX invoice pricing, amount mismatch, expiry, idempotency/reservation, authorization and orchestrator outcomes. A mocked HTTP-route integration suite is still missing; successful CI does not prove real Pi payment or VTU.ng fulfillment.

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
