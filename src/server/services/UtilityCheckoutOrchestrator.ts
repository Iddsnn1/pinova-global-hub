import type { CreatedUtilityInvoice, NeonUtilityInvoiceRepository } from '../db/repositories/NeonUtilityInvoiceRepository';
import type { AuthoritativePiVerificationResult } from './PiPaymentVerificationService';

export type UtilityProviderOutcome =
  | { status: 'SUCCEEDED'; providerReference?: string; response?: unknown }
  | { status: 'FAILED'; providerReference?: string; response?: unknown }
  | { status: 'UNKNOWN'; providerReference?: string; response?: unknown };

export type UtilityCheckoutResult =
  | { status: 'RESOLVED'; invoiceId: string; paymentId: string; response: unknown }
  | { status: 'IN_PROGRESS'; invoiceId: string; paymentId: string }
  | { status: 'REJECTED'; error: string }
  | { status: 'FULFILLED'; invoiceId: string; paymentId: string; txid: string; providerReference?: string; response?: unknown }
  | { status: 'FULFILLMENT_FAILED'; invoiceId: string; paymentId: string; txid: string; error: string }
  | { status: 'FULFILLMENT_PENDING'; invoiceId: string; paymentId: string; txid: string };

export interface UtilityCheckoutDependencies {
  repository: Pick<NeonUtilityInvoiceRepository,
    'findOwnedInvoice' | 'authorizeAndReserve' | 'recordFulfillmentOutcome'>;
  verifyPayment: (paymentId: string) => Promise<AuthoritativePiVerificationResult>;
  fulfill: (invoice: CreatedUtilityInvoice, paymentId: string, txid: string) => Promise<UtilityProviderOutcome>;
}

/**
 * Coordinates the server-authoritative utility checkout sequence.
 *
 * The caller must provide an authenticated owner ID. All fulfillment arguments
 * are derived from the persisted invoice; client-provided service/account/amount
 * fields are deliberately not accepted here. A thrown provider call is UNKNOWN,
 * because the upstream may have completed the purchase despite a lost response.
 */
export async function processUtilityCheckout(
  deps: UtilityCheckoutDependencies,
  input: { invoiceId: string; ownerUserId: string; paymentId: string },
): Promise<UtilityCheckoutResult> {
  const invoiceId = String(input?.invoiceId || '').trim();
  const ownerUserId = String(input?.ownerUserId || '').trim();
  const paymentId = String(input?.paymentId || '').trim();
  if (!invoiceId || !ownerUserId || !paymentId) {
    return { status: 'REJECTED', error: 'UTILITY_CHECKOUT_FIELDS_REQUIRED' };
  }

  let invoice: CreatedUtilityInvoice | null;
  try {
    invoice = await deps.repository.findOwnedInvoice(invoiceId, ownerUserId);
  } catch {
    return { status: 'REJECTED', error: 'UTILITY_INVOICE_LOOKUP_FAILED' };
  }
  if (!invoice) return { status: 'REJECTED', error: 'UTILITY_INVOICE_NOT_FOUND' };
  if (invoice.paymentId !== paymentId) {
    return { status: 'REJECTED', error: 'PI_PAYMENT_ID_MISMATCH' };
  }

  let verification: AuthoritativePiVerificationResult;
  try {
    verification = await deps.verifyPayment(paymentId);
  } catch {
    return { status: 'REJECTED', error: 'PI_PAYMENT_VERIFICATION_UNAVAILABLE' };
  }
  if (!verification.verified || !verification.paymentData) {
    return { status: 'REJECTED', error: 'PI_PAYMENT_NOT_VERIFIED' };
  }

  let reservation;
  try {
    reservation = await deps.repository.authorizeAndReserve(
      invoiceId, ownerUserId, paymentId, verification.paymentData,
    );
  } catch {
    return { status: 'REJECTED', error: 'UTILITY_PAYMENT_RESERVATION_FAILED' };
  }
  if (reservation.status === 'REJECTED') return reservation;
  if (reservation.status === 'IN_PROGRESS') {
    return { status: 'IN_PROGRESS', invoiceId, paymentId };
  }
  if (reservation.status === 'RESOLVED') {
    return { status: 'RESOLVED', invoiceId, paymentId, response: reservation.response };
  }

  let outcome: UtilityProviderOutcome;
  try {
    outcome = await deps.fulfill(invoice, paymentId, reservation.txid);
  } catch {
    outcome = { status: 'UNKNOWN', response: { error: 'PROVIDER_RESPONSE_UNKNOWN' } };
  }

  let recorded: boolean;
  try {
    recorded = await deps.repository.recordFulfillmentOutcome({
      invoiceId, txid: reservation.txid, status: outcome.status,
      providerReference: outcome.providerReference, response: outcome.response,
    });
  } catch {
    // Never dispatch a second provider request if persistence fails after the
    // external side effect; operations must reconcile this attempt first.
    return { status: 'FULFILLMENT_PENDING', invoiceId, paymentId, txid: reservation.txid };
  }
  if (!recorded) {
    return { status: 'FULFILLMENT_PENDING', invoiceId, paymentId, txid: reservation.txid };
  }
  if (outcome.status === 'SUCCEEDED') {
    return {
      status: 'FULFILLED', invoiceId, paymentId, txid: reservation.txid,
      providerReference: outcome.providerReference, response: outcome.response,
    };
  }
  if (outcome.status === 'FAILED') {
    return {
      status: 'FULFILLMENT_FAILED', invoiceId, paymentId, txid: reservation.txid,
      error: 'UTILITY_PROVIDER_REJECTED',
    };
  }
  return { status: 'FULFILLMENT_PENDING', invoiceId, paymentId, txid: reservation.txid };
}
