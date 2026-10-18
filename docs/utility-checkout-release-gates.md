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

## Validation snapshot — 2026-10-18 (latest inspected PR head)

- PR #11 head at the time of this snapshot: `bb81e9b421852aae99b23805965b1140cbeb4e25`. PR #11 remains open and Draft; it has not been merged.
- All four GitHub Actions workflows passed on this exact commit:
  - [Currency Engine Validation](https://github.com/Iddsnn1/pinova-global-hub/actions/runs/39122325065)
  - [PiNova CI Verify](https://github.com/Iddsnn1/pinova-global-hub/actions/runs/39122325024)
  - [PiNova CI](https://github.com/Iddsnn1/pinova-global-hub/actions/runs/39122325036)
  - [PiNova Global Hub CI](https://github.com/Iddsnn1/pinova-global-hub/actions/runs/39122325050)
- Vercel Preview deployment for this exact commit reached `READY` and its combined Vercel status is `success`. This does not prove live Pi payment or VTU.ng fulfillment.
- The HTTP checkout route integration suite covers unauthenticated access (401), checkout flag OFF (503), malformed invoice ID/payment IDs (400), missing Pi UID (403), repository outage (503), and malformed FX amount/currency plus unconfigured trusted FX provider failure.
- Repository/orchestrator suites cover exact Pi amount, owner UID checks, invoice expiry, idempotency/replay, and concurrent reservation at unit/repository level. Full HTTP owner-mismatch and payment-verification scenarios, plus explicit provider-call counters, remain open.
- The 15-minute FX quote freshness policy remains a blocker until the actual CurrencyAPI plan provides sufficiently fresh timestamps or a different trusted feed is configured. Do not loosen freshness or fabricate rates.
- Live Pi Wallet + VTU.ng end-to-end fulfillment is not confirmed. Neon production migrations have not been applied; the utility checkout feature flag remains OFF; legacy Blob stores and production domain remain unchanged.
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
