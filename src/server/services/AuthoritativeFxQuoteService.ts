import crypto from 'crypto';
import { PI_REFERENCE_DECIMAL_PLACES, PI_REFERENCE_RATE_USD } from '../../config/piReference';
import { AuthoritativeFxQuote } from '../../types/utility';

export interface IssuedFxQuote extends AuthoritativeFxQuote {
  signature: string;
}

const QUOTE_TTL_MS = 5 * 60 * 1000;

function getSigningSecret(): string {
  return String(process.env.PINOVA_FX_QUOTE_SIGNING_SECRET || '').trim();
}

function getConfiguredRates(): Record<string, number> {
  const raw = String(process.env.PINOVA_FX_RATES_JSON || '').trim();
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const rates: Record<string, number> = {};
    for (const [currency, value] of Object.entries(parsed)) {
      const code = currency.trim().toUpperCase();
      const rate = Number(value);
      if (code && Number.isFinite(rate) && rate > 0) rates[code] = rate;
    }
    return rates;
  } catch {
    return {};
  }
}

function payload(quote: AuthoritativeFxQuote): string {
  return [
    quote.quoteId,
    quote.currencyCode,
    quote.unitsPerUsd.toString(),
    quote.source,
    quote.issuedAt,
    quote.expiresAt
  ].join('|');
}

function sign(quote: AuthoritativeFxQuote): string {
  const secret = getSigningSecret();
  if (!secret) throw new Error('FX_QUOTE_SIGNING_SECRET_UNAVAILABLE');
  return crypto.createHmac('sha256', secret).update(payload(quote)).digest('hex');
}

export function issueAuthoritativeFxQuote(currencyCode: string): IssuedFxQuote {
  const code = String(currencyCode || '').trim().toUpperCase();
  if (!code) throw new Error('CURRENCY_CODE_REQUIRED');

  const secret = getSigningSecret();
  if (!secret) throw new Error('FX_QUOTE_PROVIDER_UNAVAILABLE');

  const rates = getConfiguredRates();
  const unitsPerUsd = code === 'USD' ? 1 : rates[code];
  if (!Number.isFinite(unitsPerUsd) || unitsPerUsd <= 0) {
    throw new Error('FX_RATE_UNAVAILABLE');
  }

  const issuedAt = new Date();
  const expiresAt = new Date(issuedAt.getTime() + QUOTE_TTL_MS);
  const quote: AuthoritativeFxQuote = {
    quoteId: `fxq_${crypto.randomUUID()}`,
    currencyCode: code,
    unitsPerUsd,
    source: String(process.env.PINOVA_FX_SOURCE || '').trim() || 'CONFIGURED_AUTHORIZED_FX_SOURCE',
    issuedAt: issuedAt.toISOString(),
    expiresAt: expiresAt.toISOString()
  };

  return { ...quote, signature: sign(quote) };
}

export function validateAuthoritativeFxQuote(
  quote: unknown,
  expectedCurrencyCode: string,
  now = new Date()
): { valid: true; quote: AuthoritativeFxQuote } | { valid: false; error: string } {
  if (!quote || typeof quote !== 'object') return { valid: false, error: 'FX_QUOTE_REQUIRED' };
  const candidate = quote as Partial<IssuedFxQuote>;
  const expectedCurrency = String(expectedCurrencyCode || '').trim().toUpperCase();
  const actualCurrency = String(candidate.currencyCode || '').trim().toUpperCase();

  if (!candidate.quoteId || !candidate.signature) return { valid: false, error: 'FX_QUOTE_SIGNATURE_REQUIRED' };
  if (!expectedCurrency || actualCurrency !== expectedCurrency) return { valid: false, error: 'FX_QUOTE_CURRENCY_MISMATCH' };
  if (!candidate.source || !candidate.issuedAt || !candidate.expiresAt) return { valid: false, error: 'FX_QUOTE_METADATA_INVALID' };
  if (!Number.isFinite(candidate.unitsPerUsd) || Number(candidate.unitsPerUsd) <= 0) {
    return { valid: false, error: 'FX_RATE_INVALID' };
  }

  const issuedMs = Date.parse(String(candidate.issuedAt));
  const expiresMs = Date.parse(String(candidate.expiresAt));
  if (!Number.isFinite(issuedMs) || !Number.isFinite(expiresMs) || expiresMs <= issuedMs) {
    return { valid: false, error: 'FX_QUOTE_TIME_INVALID' };
  }
  if (now.getTime() < issuedMs || now.getTime() >= expiresMs) {
    return { valid: false, error: 'FX_QUOTE_EXPIRED' };
  }

  const secret = getSigningSecret();
  if (!secret) return { valid: false, error: 'FX_QUOTE_PROVIDER_UNAVAILABLE' };
  const expectedSignature = sign({
    quoteId: String(candidate.quoteId),
    currencyCode: actualCurrency,
    unitsPerUsd: Number(candidate.unitsPerUsd),
    source: String(candidate.source),
    issuedAt: String(candidate.issuedAt),
    expiresAt: String(candidate.expiresAt)
  });
  if (!crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(String(candidate.signature)))) {
    return { valid: false, error: 'FX_QUOTE_SIGNATURE_INVALID' };
  }

  return {
    valid: true,
    quote: {
      quoteId: String(candidate.quoteId),
      currencyCode: actualCurrency,
      unitsPerUsd: Number(candidate.unitsPerUsd),
      source: String(candidate.source),
      issuedAt: String(candidate.issuedAt),
      expiresAt: String(candidate.expiresAt)
    }
  };
}

function decimalToScaled(value: number | string, scale: number): bigint {
  const raw = String(value).trim();
  if (!/^\d+(?:\.\d+)?$/.test(raw)) throw new Error('DECIMAL_INVALID');
  const [whole, fraction = ''] = raw.split('.');
  const digits = (fraction + '0'.repeat(scale)).slice(0, scale);
  return BigInt(whole) * (10n ** BigInt(scale)) + BigInt(digits || '0');
}

export function calculatePiFromAuthoritativeQuote(
  fiatAmount: number,
  quote: AuthoritativeFxQuote
): number {
  if (!Number.isFinite(fiatAmount) || fiatAmount <= 0) throw new Error('FIAT_AMOUNT_INVALID');
  const fiatScaled = decimalToScaled(fiatAmount, 12);
  const fxScaled = decimalToScaled(quote.unitsPerUsd, 12);
  const usdScaled = (fiatScaled * (10n ** 12n)) / fxScaled;
  const piScaled = (usdScaled * (10n ** 12n)) / BigInt(PI_REFERENCE_RATE_USD);
  return Number(piScaled) / 10 ** PI_REFERENCE_DECIMAL_PLACES;
}

export function expectedPiMatchesPaidAmount(
  fiatAmount: number,
  quote: AuthoritativeFxQuote,
  paidPiAmount: number
): boolean {
  if (!Number.isFinite(paidPiAmount) || paidPiAmount <= 0) return false;
  const expected = calculatePiFromAuthoritativeQuote(fiatAmount, quote);
  const expectedScaled = decimalToScaled(expected, PI_REFERENCE_DECIMAL_PLACES);
  const paidScaled = decimalToScaled(paidPiAmount, PI_REFERENCE_DECIMAL_PLACES);
  return expectedScaled === paidScaled;
}
