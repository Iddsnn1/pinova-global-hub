/**
 * PiNova Global Hub FX conversion.
 *
 * CurrencyAPI credentials stay server-side. This service converts a local
 * currency amount to USD using a live USD-base quote, then calculates the
 * application's configured Pi reference amount. The Pi reference is not an
 * official Pi Network market price and must not replace a canonical invoice.
 */
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
