/**
 * PiNova Global Hub FX conversion.
 *
 * CurrencyAPI credentials stay server-side. This service converts a local
 * currency amount to USD using a live USD-base quote, then calculates the
 * application's configured Pi reference amount. The Pi reference is not an
 * official Pi Network market price and must not replace a canonical invoice.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';
import { calculatePiReferenceFromUsd, PI_REFERENCE_RATE_USD } from '../../config/piReference';

export interface PiNovaFxQuote {
  source: string;
  baseCurrency: 'USD';
  currency: string;
  usdToCurrencyRate: number;
  amount: number;
  amountUsd: number;
  referencePiAmount: number;
  referenceRateUsdPerPi: number;
  retrievedAt: string;
}

export class FxConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FxConfigurationError';
  }
}

export class FxProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FxProviderError';
  }
}

const CURRENCY_CODE = /^[A-Z]{3}$/;

export async function quoteFiatToPiReference(
  amount: number,
  currencyInput: string
): Promise<PiNovaFxQuote> {
  if (!Number.isFinite(amount) || amount <= 0 || amount > 1_000_000_000) {
    throw new RangeError('Amount must be a positive finite number within supported limits.');
  }

  const currency = String(currencyInput || '').trim().toUpperCase();
  if (!CURRENCY_CODE.test(currency)) {
    throw new TypeError('Currency must be a valid three-letter ISO currency code.');
  }

  const retrievedAt = new Date().toISOString();
  if (currency === 'USD') {
    return {
      source: 'identity-usd',
      baseCurrency: 'USD',
      currency,
      usdToCurrencyRate: 1,
      amount,
      amountUsd: amount,
      referencePiAmount: calculatePiReferenceFromUsd(amount),
      referenceRateUsdPerPi: PI_REFERENCE_RATE_USD,
      retrievedAt
    };
  }

  const apiKey = process.env.PINOVA_FX_PROVIDER_API_KEY?.trim();
  const endpoint = process.env.PINOVA_FX_PROVIDER_URL?.trim() || 'https://api.currencyapi.com/v3/latest';
  if (!apiKey) {
    throw new FxConfigurationError('Currency conversion is not configured on the server.');
  }

  let url: URL;
  try {
    url = new URL(endpoint);
  } catch {
    throw new FxConfigurationError('Currency provider URL is invalid.');
  }
  if (url.protocol !== 'https:' || url.hostname !== 'api.currencyapi.com') {
    throw new FxConfigurationError('Currency provider must use the approved HTTPS CurrencyAPI endpoint.');
  }
  url.searchParams.set('base_currency', 'USD');
  url.searchParams.set('currencies', currency);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  let response: Response;
  try {
    response = await fetch(url.toString(), {
      method: 'GET',
      headers: { apikey: apiKey, Accept: 'application/json' },
      signal: controller.signal
    });
  } catch {
    throw new FxProviderError('Currency provider could not be reached.');
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new FxProviderError('Currency provider returned an unsuccessful response.');
  }

  let payload: any;
  try {
    payload = await response.json();
  } catch {
    throw new FxProviderError('Currency provider returned invalid JSON.');
  }

  const quote = payload?.data?.[currency];
  const rate = Number(quote?.value);
  if (
    !quote ||
    String(quote.code || '').toUpperCase() !== currency ||
    !Number.isFinite(rate) ||
    rate <= 0 ||
    rate > 1_000_000_000
  ) {
    throw new FxProviderError('Currency provider response did not contain a valid requested currency rate.');
  }

  const amountUsd = amount / rate;
  if (!Number.isFinite(amountUsd) || amountUsd <= 0) {
    throw new FxProviderError('Currency conversion produced an invalid USD amount.');
  }

  return {
    source: 'currencyapi.com',
    baseCurrency: 'USD',
    currency,
    usdToCurrencyRate: rate,
    amount,
    amountUsd,
    referencePiAmount: calculatePiReferenceFromUsd(amountUsd),
    referenceRateUsdPerPi: PI_REFERENCE_RATE_USD,
    retrievedAt: new Date().toISOString()
  };
}

export interface SignedPiNovaFxQuote {
  token: string;
  expiresAt: string;
}

function getFxQuoteSecret(): string {
  const secret = process.env.PINOVA_FX_QUOTE_SECRET?.trim();
  if (!secret || Buffer.byteLength(secret, 'utf8') < 32) {
    throw new FxConfigurationError('Signed FX quotes are not configured on the server.');
  }
  return secret;
}

function stableQuotePayload(quote: PiNovaFxQuote, expiresAt: number): string {
  return JSON.stringify({
    version: 1,
    currency: quote.currency,
    amount: quote.amount,
    amountUsd: quote.amountUsd,
    referencePiAmount: quote.referencePiAmount,
    retrievedAt: quote.retrievedAt,
    expiresAt
  });
}

function assertConsistentFxQuote(quote: PiNovaFxQuote): void {
  if (
    !quote ||
    typeof quote.currency !== 'string' ||
    !CURRENCY_CODE.test(quote.currency) ||
    !Number.isFinite(quote.amount) ||
    quote.amount <= 0 ||
    quote.amount > 1_000_000_000 ||
    !Number.isFinite(quote.amountUsd) ||
    quote.amountUsd <= 0 ||
    !Number.isFinite(quote.usdToCurrencyRate) ||
    quote.usdToCurrencyRate <= 0 ||
    quote.usdToCurrencyRate > 1_000_000_000 ||
    !Number.isFinite(quote.referencePiAmount) ||
    quote.referencePiAmount <= 0 ||
    !Number.isFinite(quote.referenceRateUsdPerPi) ||
    quote.referenceRateUsdPerPi !== PI_REFERENCE_RATE_USD ||
    !Number.isFinite(Date.parse(quote.retrievedAt))
  ) {
    throw new TypeError('FX quote contains invalid or unsupported values.');
  }

  const expectedUsd = quote.currency === 'USD'
    ? quote.amount
    : quote.amount / quote.usdToCurrencyRate;
  const expectedPi = calculatePiReferenceFromUsd(quote.amountUsd);
  const tolerance = Math.max(1e-12, Math.abs(expectedUsd) * 1e-12);

  if (
    Math.abs(quote.amountUsd - expectedUsd) > tolerance ||
    quote.referencePiAmount !== expectedPi ||
    (quote.currency === 'USD' && (quote.usdToCurrencyRate !== 1 || quote.source !== 'identity-usd')) ||
    (quote.currency !== 'USD' && quote.source !== 'currencyapi.com')
  ) {
    throw new TypeError('FX quote fiat, USD, and Pi reference amounts do not match.');
  }
}

export function signPiNovaFxQuote(quote: PiNovaFxQuote, nowMs = Date.now()): SignedPiNovaFxQuote {
  assertConsistentFxQuote(quote);
  if (!Number.isFinite(nowMs)) throw new TypeError('FX quote signing time must be finite.');
  const expiresAtMs = nowMs + 5 * 60 * 1000;
  const payload = stableQuotePayload(quote, expiresAtMs);
  const encoded = Buffer.from(payload, 'utf8').toString('base64url');
  const signature = createHmac('sha256', getFxQuoteSecret()).update(encoded).digest('base64url');
  return { token: encoded + '.' + signature, expiresAt: new Date(expiresAtMs).toISOString() };
}

export interface VerifiedPiNovaFxQuote {
  currency: string;
  amount: number;
  amountUsd: number;
  referencePiAmount: number;
  retrievedAt: string;
  expiresAt: number;
}

export function verifyPiNovaFxQuoteToken(token: unknown, nowMs = Date.now()): VerifiedPiNovaFxQuote | null {
  if (typeof token !== 'string' || token.length > 4096) return null;
  const parts = token.split('.');
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  try {
    const expected = createHmac('sha256', getFxQuoteSecret()).update(parts[0]).digest();
    const actual = Buffer.from(parts[1], 'base64url');
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
    const payload = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
    if (payload?.version !== 1 || !Number.isFinite(payload.expiresAt) || payload.expiresAt <= nowMs) return null;
    if (typeof payload.currency !== 'string' || !/^[A-Z]{3}$/.test(payload.currency)) return null;
    if (![payload.amount, payload.amountUsd, payload.referencePiAmount].every((v: unknown) => typeof v === 'number' && Number.isFinite(v) && v > 0)) return null;
    if (typeof payload.retrievedAt !== 'string' || !Number.isFinite(Date.parse(payload.retrievedAt))) return null;
    return {
      currency: payload.currency,
      amount: payload.amount,
      amountUsd: payload.amountUsd,
      referencePiAmount: payload.referencePiAmount,
      retrievedAt: payload.retrievedAt,
      expiresAt: payload.expiresAt
    };
  } catch (error) {
    if (error instanceof FxConfigurationError) throw error;
    return null;
  }
}
