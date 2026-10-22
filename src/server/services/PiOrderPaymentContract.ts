/**
 * Pi order settlement comparison.
 *
 * PiNova persists reference/payment amounts to 12 decimal places. Compare at
 * that same precision rather than accepting a broad 1e-7 tolerance.
 */
export function matchesPiAmountAt12Decimals(actual: unknown, expected: unknown): boolean {
  const actualAmount = typeof actual === 'number' ? actual : Number(actual);
  const expectedAmount = typeof expected === 'number' ? expected : Number(expected);
  if (!Number.isFinite(actualAmount) || !Number.isFinite(expectedAmount)) return false;
  if (actualAmount <= 0 || expectedAmount <= 0) return false;
  return Math.round(actualAmount * 1e12) === Math.round(expectedAmount * 1e12);
}

/**
 * Settlement transaction identifiers must come only from the authoritative
 * Pi platform verification response. Never use a client-request body fallback.
 */
export function getPiAuthoritativeTransactionId(paymentData: unknown): string {
  if (!paymentData || typeof paymentData !== 'object') return '';
  const data = paymentData as {
    transaction?: { txid?: unknown; hash?: unknown } | null;
  };
  const candidate = data.transaction?.txid || data.transaction?.hash || '';
  return typeof candidate === 'string' || typeof candidate === 'number'
    ? String(candidate).trim()
    : '';
}
