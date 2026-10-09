import { calculateTrustedFiatToPi, type TrustedFiatToPiRequest } from './TrustedFiatToPiService';
import {
  DEFAULT_MAX_TRUSTED_FX_AGE_MS,
  validateTrustedFxQuote,
  type TrustedFxQuote,
} from './TrustedFxQuoteService';

export interface TrustedFxProviderConfig {
  endpoint: string;
  source: string;
  apiKey?: string;
  timeoutMs?: number;
  maxAgeMs?: number;
}

interface ProviderPayload {
  source?: unknown;
  asOf?: unknown;
  baseCurrency?: unknown;
  rates?: unknown;
}

function parseEndpoint(endpoint: string): URL {
  let url: URL;
  try { url = new URL(endpoint); } catch { throw new Error('FX_PROVIDER_ENDPOINT_INVALID'); }
  if (url.protocol !== 'https:') throw new Error('FX_PROVIDER_HTTPS_REQUIRED');
  if (url.username || url.password) throw new Error('FX_PROVIDER_CREDENTIALS_IN_URL_FORBIDDEN');
  return url;
}

/**
 * Normalized provider contract: JSON { source, asOf, baseCurrency: 'USD',
 * rates: { NGN: <units of NGN per USD>, ... } }. No rates are fabricated.
 * The endpoint and expected source must be explicitly configured server-side.
 */
export function parseTrustedFxProviderPayload(
  payload: ProviderPayload,
  currencyCode: string,
  expectedSource: string,
  nowMs = Date.now(),
  maxAgeMs = DEFAULT_MAX_TRUSTED_FX_AGE_MS,
): TrustedFxQuote {
  if (!payload || typeof payload !== 'object') throw new Error('FX_PROVIDER_PAYLOAD_INVALID');
  if (!expectedSource) throw new Error('FX_TRUSTED_SOURCE_NOT_CONFIGURED');
  if (payload.source !== expectedSource) throw new Error('FX_SOURCE_UNTRUSTED');
  if (String(payload.baseCurrency || '').trim().toUpperCase() !== 'USD') {
    throw new Error('FX_PROVIDER_BASE_CURRENCY_UNSUPPORTED');
  }
  const currency = String(currencyCode || '').trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(currency)) throw new Error('FX_CURRENCY_INVALID');
  const rates = payload.rates as Record<string, unknown> | undefined;
  const unitsPerUsd = rates?.[currency];
  if (typeof unitsPerUsd !== 'number' || !Number.isFinite(unitsPerUsd) || unitsPerUsd <= 0) {
    throw new Error('FX_PROVIDER_RATE_MISSING_OR_INVALID');
  }
  if (typeof payload.asOf !== 'string') throw new Error('FX_TIMESTAMP_INVALID');
  return validateTrustedFxQuote({
    currency,
    usdPerFiatUnit: 1 / unitsPerUsd,
    asOf: payload.asOf,
    source: String(payload.source),
  }, currency, expectedSource, nowMs, maxAgeMs);
}

export async function fetchTrustedFxQuote(
  currencyCode: string,
  config: TrustedFxProviderConfig,
  nowMs = Date.now(),
): Promise<TrustedFxQuote> {
  if (!config || !String(config.endpoint || '').trim()) throw new Error('FX_PROVIDER_ENDPOINT_NOT_CONFIGURED');
  if (!String(config.source || '').trim()) throw new Error('FX_TRUSTED_SOURCE_NOT_CONFIGURED');
  const endpoint = parseEndpoint(config.endpoint);
  const timeoutMs = config.timeoutMs ?? 5000;
  const maxAgeMs = config.maxAgeMs ?? DEFAULT_MAX_TRUSTED_FX_AGE_MS;
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0 || timeoutMs > 30000) throw new Error('FX_PROVIDER_TIMEOUT_CONFIG_INVALID');
  if (!Number.isFinite(maxAgeMs) || maxAgeMs <= 0) throw new Error('FX_VALIDATION_CONFIG_INVALID');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (config.apiKey) headers.Authorization = `Bearer ${config.apiKey}`;
    const response = await fetch(endpoint, {
      method: 'GET',
      headers,
      signal: controller.signal,
      redirect: 'error',
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('FX_PROVIDER_HTTP_ERROR');
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.toLowerCase().includes('application/json')) throw new Error('FX_PROVIDER_CONTENT_TYPE_INVALID');
    const payload = await response.json() as ProviderPayload;
    return parseTrustedFxProviderPayload(payload, currencyCode, config.source, nowMs, maxAgeMs);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('FX_')) throw error;
    if (controller.signal.aborted) throw new Error('FX_PROVIDER_TIMEOUT');
    throw new Error('FX_PROVIDER_REQUEST_FAILED');
  } finally {
    clearTimeout(timeout);
  }
}

export function getTrustedFxProviderConfig(env: Record<string, string | undefined> = process.env): TrustedFxProviderConfig {
  const endpoint = env.PINOVA_FX_PROVIDER_URL?.trim() || '';
  const source = env.PINOVA_FX_PROVIDER_SOURCE?.trim() || '';
  const apiKey = env.PINOVA_FX_PROVIDER_API_KEY?.trim() || undefined;
  if (!endpoint) throw new Error('FX_PROVIDER_ENDPOINT_NOT_CONFIGURED');
  if (!source) throw new Error('FX_TRUSTED_SOURCE_NOT_CONFIGURED');
  parseEndpoint(endpoint);
  return { endpoint, source, apiKey, timeoutMs: 5000, maxAgeMs: DEFAULT_MAX_TRUSTED_FX_AGE_MS };
}

/**
 * Convenience orchestration for server-side estimates: fetch a fresh quote
 * from the configured provider, then convert. It does not create or authorize
 * any payment; payment code must still verify the canonical invoice amount.
 */
export async function calculateFiatToPiWithConfiguredFx(
  fiatAmount: number,
  currencyCode: string,
  env: Record<string, string | undefined> = process.env,
): Promise<ReturnType<typeof calculateTrustedFiatToPi>> {
  const config = getTrustedFxProviderConfig(env);
  const quote = await fetchTrustedFxQuote(currencyCode, config);
  const request: TrustedFiatToPiRequest = {
    fiatAmount,
    currency: currencyCode,
    quote,
    trustedSource: config.source,
    maxAgeMs: config.maxAgeMs,
  };
  return calculateTrustedFiatToPi(request);
}
