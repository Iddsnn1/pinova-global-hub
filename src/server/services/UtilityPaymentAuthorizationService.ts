/**
 * Authoritative utility payment checks.
 *
 * This module deliberately does not fetch or trust client invoices. Callers must
 * load the invoice from server-owned persistence and pass it here. Checkout must
 * remain disabled until that persistence lifecycle is wired into the route.
 */
export interface CanonicalUtilityInvoice {
  invoiceId: string;
  paymentId: string;
  fiatAmount: string;
  fiatCurrency: string;
  piAmount: string;
  status: 'OPEN' | 'PAID' | 'FULFILLMENT_PENDING' | 'FULFILLED' | 'CANCELLED' | 'FAILED';
}

export interface PiPaymentVerificationData {
  identifier?: unknown;
  user_uid?: unknown;
  direction?: unknown;
  network?: unknown;
  amount?: unknown;
  status?: { developer_completed?: unknown };
  transaction?: { verified?: unknown; txid?: unknown };
}

export type UtilityPaymentAuthorizationFailure =
  | 'UTILITY_INVOICE_REQUIRED'
  | 'UTILITY_INVOICE_NOT_PAYABLE'
  | 'PI_PAYMENT_ID_MISMATCH'
  | 'PI_PAYMENT_OWNER_MISMATCH'
  | 'PI_PAYMENT_DIRECTION_INVALID'
  | 'PI_PAYMENT_NETWORK_MISMATCH'
  | 'PI_PAYMENT_NOT_COMPLETED'
  | 'PI_PAYMENT_AMOUNT_INVALID'
  | 'UTILITY_INVOICE_AMOUNT_INVALID'
  | 'PI_PAYMENT_AMOUNT_MISMATCH';

export interface UtilityPaymentAuthorizationResult {
  authorized: boolean;
  error?: UtilityPaymentAuthorizationFailure;
  expectedPiAmount?: string;
  paidPiAmount?: string;
  txid?: string;
}

/** Convert a plain decimal amount to integer pico-Pi units without float math. */
export function piAmountToPico(value: unknown): bigint | null {
  if (typeof value !== 'string' && typeof value !== 'number') return null;
  if (typeof value === 'number' && (!Number.isFinite(value) || value < 0 || value >= 1e21)) return null;
  let raw = String(value).trim();
  // JavaScript may stringify small finite numbers in exponent notation. Expand
  // that representation only for numeric inputs; caller-supplied strings with
  // exponent notation remain invalid. Then enforce the 12-decimal contract.
  if (typeof value === 'number' && /e/i.test(raw)) {
    const [mantissa, exponentText] = raw.toLowerCase().split('e');
    const exponent = Number(exponentText);
    if (!Number.isInteger(exponent)) return null;
    const negative = mantissa.startsWith('-');
    const unsigned = negative ? mantissa.slice(1) : mantissa;
    const [wholePart, fractionPart = ''] = unsigned.split('.');
    const digits = wholePart + fractionPart;
    const decimalPosition = wholePart.length + exponent;
    if (decimalPosition <= 0) {
      raw = `0.${'0'.repeat(-decimalPosition)}${digits}`;
    } else if (decimalPosition >= digits.length) {
      raw = `${digits}${'0'.repeat(decimalPosition - digits.length)}`;
    } else {
      raw = `${digits.slice(0, decimalPosition)}.${digits.slice(decimalPosition)}`;
    }
    if (negative) raw = `-${raw}`;
  }
  // Trailing fractional zeroes do not add precision. Trim them before enforcing
  // the 12-decimal contract, but keep rejecting any non-zero digit beyond pico-Pi.
  if (typeof value === 'string' && raw.includes('.')) {
    const [wholePart, fractionPart = ''] = raw.split('.');
    const trimmedFraction = fractionPart.replace(/0+$/, '');
    raw = trimmedFraction ? `${wholePart}.${trimmedFraction}` : wholePart;
  }
  // No signs, separators, exponent notation, or more than 12 significant decimal places.
  if (!/^(?:0|[1-9]\d*)(?:\.\d{1,12})?$/.test(raw)) return null;
  const [whole, fraction = ''] = raw.split('.');
  try {
    return BigInt(whole) * 1_000_000_000_000n + BigInt((fraction + '000000000000').slice(0, 12));
  } catch {
    return null;
  }
}

export function normalizePiAmount(value: unknown): string | null {
  const pico = piAmountToPico(value);
  if (pico === null) return null;
  const whole = pico / 1_000_000_000_000n;
  const fraction = String(pico % 1_000_000_000_000n).padStart(12, '0');
  return `${whole}.${fraction}`;
}

/**
 * Requires a server-loaded invoice already bound to this Pi payment ID.
 * This does not itself load the invoice, reserve idempotency, or fulfill service.
 */
export function authorizeUtilityPayment(
  invoice: CanonicalUtilityInvoice | null | undefined,
  paymentId: string,
  paymentData: PiPaymentVerificationData | null | undefined,
  expectedPiUid: string | null | undefined,
): UtilityPaymentAuthorizationResult {
  if (!invoice || !invoice.invoiceId || !invoice.paymentId) {
    return { authorized: false, error: 'UTILITY_INVOICE_REQUIRED' };
  }
  if (invoice.status !== 'OPEN') {
    return { authorized: false, error: 'UTILITY_INVOICE_NOT_PAYABLE' };
  }
  // Never substitute the caller-supplied ID for the identifier returned by Pi.
  // Missing provider identity must fail closed rather than appear verified.
  const verifiedPaymentId =
    typeof paymentData?.identifier === 'string' ? paymentData.identifier : '';
  if (!paymentId || invoice.paymentId !== paymentId || verifiedPaymentId !== paymentId) {
    return { authorized: false, error: 'PI_PAYMENT_ID_MISMATCH' };
  }
  // Bind the verified Pi payment to the invoice owner's server-authenticated Pi UID.
  // Missing identity on either side is a hard failure; internal user IDs are not Pi UIDs.
  const verifiedPiUid = typeof paymentData?.user_uid === 'string' ? paymentData.user_uid.trim() : '';
  if (!expectedPiUid || !expectedPiUid.trim() || !verifiedPiUid || verifiedPiUid !== expectedPiUid.trim()) {
    return { authorized: false, error: 'PI_PAYMENT_OWNER_MISMATCH' };
  }
  if (paymentData?.direction !== 'user_to_app') {
    return { authorized: false, error: 'PI_PAYMENT_DIRECTION_INVALID' };
  }
  const expectedNetwork = process.env.VITE_PI_ENV === 'production' || process.env.PI_SANDBOX_MODE === 'false'
    ? 'Pi Network'
    : 'Pi Testnet';
  if (paymentData?.network !== expectedNetwork) {
    return { authorized: false, error: 'PI_PAYMENT_NETWORK_MISMATCH' };
  }
  if (paymentData?.status?.developer_completed !== true || paymentData?.transaction?.verified !== true) {
    return { authorized: false, error: 'PI_PAYMENT_NOT_COMPLETED' };
  }
  const expectedPico = piAmountToPico(invoice.piAmount);
  if (expectedPico === null || expectedPico <= 0n) {
    return { authorized: false, error: 'UTILITY_INVOICE_AMOUNT_INVALID' };
  }
  const paidPico = piAmountToPico(paymentData.amount);
  if (paidPico === null || paidPico <= 0n) {
    return { authorized: false, error: 'PI_PAYMENT_AMOUNT_INVALID' };
  }
  if (expectedPico !== paidPico) {
    return {
      authorized: false,
      error: 'PI_PAYMENT_AMOUNT_MISMATCH',
      expectedPiAmount: normalizePiAmount(invoice.piAmount) || undefined,
      paidPiAmount: normalizePiAmount(paymentData.amount) || undefined,
    };
  }
  return {
    authorized: true,
    expectedPiAmount: normalizePiAmount(invoice.piAmount) || undefined,
    paidPiAmount: normalizePiAmount(paymentData.amount) || undefined,
    txid: typeof paymentData.transaction?.txid === 'string' ? paymentData.transaction.txid : undefined,
  };
}
