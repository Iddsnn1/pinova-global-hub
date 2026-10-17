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
- [x] Add and run the initial HTTP-route integration suite for unauthenticated access (401), feature flag OFF (503), and malformed invoice ID (400). The disabled-flag branch returns before repository construction/provider dispatch by code inspection.
- [ ] Extend HTTP-route integration coverage for owner mismatch, malformed payment ID, and explicit repository/provider call counters; current route suite does not yet prove those cases.
- [ ] Run route-level tests for wrong payment ID, unverified payment, wrong Pi UID, unsupported provider/service, expired invoice, replay, and concurrent checkout; unit tests for the orchestrator/repository are not a substitute for this HTTP coverage.
- [ ] Confirm the actual VTU.ng contract for duplicate request IDs, status reconciliation, request timeouts, and provider-specific airtime limits/denominations. Do not assume stable request IDs alone prevent duplicate recharges.
- [ ] Confirm the provider response and webhook signature contract against the provider's documentation and test successful, failed, pending, and ambiguous outcomes.
- [ ] Verify the production FX provider's account plan meets the configured quote-freshness policy. The daily free CurrencyAPI plan does not satisfy a 15-minute freshness requirement; do not loosen freshness or substitute a fabricated rate.
- [ ] Apply the reviewed Neon migrations only through an explicitly approved procedure, then verify schema, constraints, health, and rollback/recovery.
- [ ] Complete sandbox checkout with a mocked provider and demonstrate owner-bound receipts/status and reconciliation behavior.

## Validation snapshot — 2026-10-17 (latest verified code commit)

- Latest inspected PR head: `eeede44c1c94bb95617b5a4c5b871e879f857d0c` (`test(currency): cover trusted FX transport and credential handling`). PR #11 remains open and Draft; it has not been merged.
- All four GitHub Actions workflows passed on this exact commit:
  - [Currency Engine Validation](https://github.com/Iddsnn1/pinova-global-hub/actions/runs/39054668626)
  - [PiNova CI Verify](https://github.com/Iddsnn1/pinova-global-hub/actions/runs/39054668602)
  - [PiNova Global Hub CI](https://github.com/Iddsnn1/pinova-global-hub/actions/runs/39054668587)
  - [PiNova CI](https://github.com/Iddsnn1/pinova-global-hub/actions/runs/39054668550)
- Vercel Preview for this exact code commit is **READY**: https://pinova-global-8kz11hopq-iddsnn1s-projects.vercel.app. Preview readiness does not prove live Pi payment or provider fulfillment.
- The trusted FX transport tests now explicitly check that credentials embedded in provider URLs are rejected, the configured API key is sent in the Authorization header rather than URL query parameters, redirects are rejected, cache is disabled, source metadata is checked, and malformed successful HTTP responses fail closed without local/fabricated rate fallback.
- The HTTP checkout route integration suite covers unauthenticated access (401), feature flag OFF (503), malformed invoice ID/payment IDs (400), missing Pi UID (403), and repository outage (503 with `Cache-Control: no-store`). It still does not instrument repository/provider constructor calls or exercise owner mismatch through the real HTTP route.
- Repository and orchestrator suites cover owner-scoped invoice lookup/payment binding, stale quote rejection, exact Pi amount, idempotency, conflicting/pending replays, and concurrent reservation. These unit-level tests are not a substitute for full HTTP owner-mismatch, replay/concurrency, or real provider contract validation.
- Remaining gates include Pi SDK cancellation/error-path review, HTTP owner mismatch and payment-verification scenarios, VTU.ng idempotency/reconciliation/webhook contract confirmation, compliant trusted FX quote freshness, and mocked-provider sandbox checkout.
- Read-only SQL against the isolated Neon utility-checkout test branch previously showed `utility_invoices`, `utility_payment_idempotency`, and `utility_fulfillment_attempts` are not present. No migrations were applied.
- Cross-module audit documented in [currency-engine-configuration.md](./currency-engine-configuration.md): Airtime's client estimate is not payment authorization; flights currently accept USD-denominated offers only; Education invoices are Pi-native without a fiat-to-Pi invoice path; marketplace conversion outside the USD reference is unavailable rather than guessed.
- The configured 15-minute FX freshness policy remains incompatible with CurrencyAPI's daily free-plan updates; verify the provider plan or use a compliant trusted feed rather than loosening freshness or inventing a rate.

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
