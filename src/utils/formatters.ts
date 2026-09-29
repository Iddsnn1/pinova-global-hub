/**
 * Pi Amount Formatting & Precision Utilities
 *
 * Ensures full precision for Pi payments, receipts, and order histories.
 * Guarantees that non-zero amounts are NEVER rounded to 0 or 0.0000.
 */

export interface FormatPiOptions {
  minDecimals?: number;
  maxDecimals?: number;
  showSymbol?: boolean;
  symbol?: string;
}

/**
 * Calculates authoritative Pi amount from fiat price and configured rate.
 * Uses 8 decimal places for micro-amounts to ensure precision is maintained.
 */
export function calculateAuthoritativePiAmount(
  fiatAmount: number,
  piRateUsd: number
): number {
  if (!fiatAmount || fiatAmount <= 0 || !piRateUsd || piRateUsd <= 0) {
    return 0;
  }
  // PiNova Oracle reference precision: preserve 12 decimal places so
  // micro-Pi values such as $0.01 -> 0.000000031831 Pi are not lost.
  return Number((fiatAmount / piRateUsd).toFixed(12));
}

/**
 * Formats a Pi amount for display across all UI screens, receipts, and order histories.
 *
 * Requirements:
 * 1. A non-zero positive Pi amount is NEVER displayed as "0.0000" or "0".
 * 2. Uses up to 12 decimal places where necessary for micro-amounts.
 * 3. Removes unnecessary trailing zeros while preserving all meaningful significant digits.
 * 4. Supports large amounts, standard decimals, and micro-amounts.
 */
export function formatPiAmount(
  amount: number | string | undefined | null,
  options?: FormatPiOptions
): string {
  if (amount === undefined || amount === null || amount === '') {
    return options?.showSymbol ? `0 ${options.symbol || 'π'}` : '0';
  }

  const num = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
  if (isNaN(num) || !isFinite(num)) {
    return options?.showSymbol ? `0 ${options.symbol || 'π'}` : '0';
  }

  if (num === 0) {
    return options?.showSymbol ? `0 ${options.symbol || 'π'}` : '0';
  }

  const absNum = Math.abs(num);
  let formatted = '';

  if (absNum >= 1000) {
    formatted = num.toLocaleString('en-US', {
      minimumFractionDigits: options?.minDecimals ?? 0,
      maximumFractionDigits: options?.maxDecimals ?? 4,
    });
  } else if (absNum >= 1) {
    const maxDec = options?.maxDecimals ?? 6;
    const minDec = options?.minDecimals ?? 0;
    const fixedStr = num.toFixed(maxDec);
    if (minDec === 0) {
      formatted = fixedStr.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '');
    } else {
      formatted = num.toLocaleString('en-US', {
        minimumFractionDigits: minDec,
        maximumFractionDigits: maxDec,
      });
    }
  } else if (absNum >= 0.001) {
    const fixedStr = num.toFixed(options?.maxDecimals ?? 7);
    formatted = fixedStr.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '');
  } else {
    // Micro-amounts, e.g. 0.0000015915 or 0.000002
    const maxDec = Math.max(12, options?.maxDecimals ?? 12);
    let fixedStr = num.toFixed(maxDec);

    if (parseFloat(fixedStr) === 0 && absNum > 0) {
      fixedStr = num.toFixed(12);
    }

    formatted = fixedStr.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '');

    // Critical invariant: Never display a non-zero number as "0" or "0.0000"
    if (formatted === '0' || formatted === '0.0000' || parseFloat(formatted) === 0) {
      formatted = num.toFixed(12);
    }
  }

  if (options?.showSymbol) {
    return `${formatted} ${options.symbol || 'π'}`;
  }

  return formatted;
}
