# Utility checkout release gates

This checklist describes the Neon-backed utility invoice flow. It does not enable provider fulfillment, apply database migrations, merge the pull request, or deploy production.

## Current safe state

- `POST /api/v2/utility/invoices` creates a server-priced invoice for the authenticated user.
- `POST /api/v2/utility/invoices/:invoiceId/payment` binds a Pi payment identifier to that user's open invoice.
- `GET /api/v2/utility/invoices/:invoiceId` exposes status only to the authenticated owner and matching Pi UID.
- `POST /api/v2/utility/invoices/:invoiceId/checkout` is implemented for a narrow Nigerian Airtime (NGN) path and is guarded by `PINOVA_UTILITY_CHECKOUT_ENABLED === "true"`.
- The current `FlexibleUtilityModal.tsx` is still quote-only: `handleExecutePayment` displays a paused-checkout message and the Pay with Pi button is disabled. The UI does **not yet** create/bind an invoice or call the checkout route. This is intentional fail-closed behavior, not a completed payment flow.
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

- [ ] Integrate the UI with the canonical invoice lifecycle: create invoice from server-validated form values, invoke the Pi SDK payment flow for the server-issued Pi amount, bind the resulting payment ID, then call the authenticated checkout endpoint only after the SDK flow completes. Preserve server-side verification as the authority; client callbacks are not proof of payment.
- [ ] Separate **Pi payment completion** from **utility fulfillment success** in the UI. The existing shared Pi SDK completion callback uses the generic `/api/v2/payments/complete` endpoint; a completed Pi payment must never be presented as a successful airtime recharge until the utility checkout response confirms fulfillment, or show a pending/reconciliation state for ambiguous provider outcomes.
- [ ] Add and run a mocked HTTP-route integration test for the feature-flag guard, authentication/owner mismatch, malformed invoice/payment ID, and proof that disabled checkout makes no DB/provider calls.
- [ ] Run route-level tests for wrong payment ID, unverified payment, wrong Pi UID, unsupported provider/service, expired invoice, replay, and concurrent checkout; unit tests for the orchestrator/repository are not a substitute for this HTTP coverage.
- [ ] Confirm the actual VTU.ng contract for duplicate request IDs, status reconciliation, request timeouts, and provider-specific airtime limits/denominations. Do not assume stable request IDs alone prevent duplicate recharges.
- [ ] Confirm the provider response and webhook signature contract against the provider's documentation and test successful, failed, pending, and ambiguous outcomes.
- [ ] Verify the production FX provider's account plan meets the configured quote-freshness policy. The daily free CurrencyAPI plan does not satisfy a 15-minute freshness requirement; do not loosen freshness or substitute a fabricated rate.
- [ ] Apply the reviewed Neon migrations only through an explicitly approved procedure, then verify schema, constraints, health, and rollback/recovery.
- [ ] Complete sandbox checkout with a mocked provider and demonstrate owner-bound receipts/status and reconciliation behavior.

## Validation snapshot — 2026-10-14

- GitHub Actions on PR head commit `845c30534ad3a9c4a04d37b94bc590a461cb35c7`: PiNova Global Hub CI, PiNova CI Verify, PiNova CI, and Currency Engine Validation all completed successfully.
- Vercel reports the Preview deployment for this commit as **Ready**: https://vercel.com/iddsnn1s-projects/pinova-global-hub/8uenuSoKuWfB61bpqLkLMmMqgB24. Automated URL fetch was blocked by deployment authentication, so the preview health endpoint was not independently verified in that check.
- A prior GET request to the checkout path returned a method-not-found response because the route is POST-only. This is **not** an end-to-end checkout test. A real authenticated POST integration test remains outstanding.
- Unit suites exercise authorization, repository reservations/replay, and orchestrator outcomes. They do not yet prove the complete HTTP route works end-to-end with auth and mocked provider dependencies, and the frontend is not yet wired to that route.

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
