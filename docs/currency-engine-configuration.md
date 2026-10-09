# PiNova Currency Engine: Trusted FX Configuration

## Current status

The shared fiat-to-Pi conversion engine and deterministic tests are implemented on
`feat/global-currency-pi-engine`. A live FX provider is **not configured by this
change**. Until a trusted provider is selected, configured, and tested, non-USD
conversion must remain unavailable rather than inventing or silently substituting
an exchange rate.

The Pi reference used by the product is `1 Pi = USD 314,159`. This is a
PiNova/community reference for product calculations, not an official Pi Network
market rate.

## Server-side environment

Configure these variables only in the server runtime (Vercel Production/Preview
or the applicable server environment). Never expose the provider key through a
`VITE_*` variable or return it to the browser.

- `PINOVA_FX_PROVIDER_URL`: HTTPS endpoint returning the normalized JSON contract below.
- `PINOVA_FX_PROVIDER_SOURCE`: exact source identifier expected in each response.
- `PINOVA_FX_PROVIDER_API_KEY`: optional bearer token, only if required by the chosen provider.

The code rejects non-HTTPS endpoints, URLs containing embedded credentials,
redirects, non-JSON responses, invalid rates, mismatched source identifiers,
and stale/future timestamps. The configured provider must be reachable from the
server runtime. The adapter has a 5-second request timeout by default and rejects
quotes older than the configured maximum age.

## Normalized provider response contract

The configured endpoint must return JSON with this shape:

```json
{
  "source": "configured-source-id",
  "asOf": "2026-10-09T12:00:00.000Z",
  "baseCurrency": "USD",
  "rates": {
    "NGN": 1500,
    "EUR": 0.92,
    "GBP": 0.79
  }
}
```

The numbers above are **illustrative schema examples only**, not live exchange
rates. `rates[CODE]` means units of that fiat currency per one USD. The adapter
inverts the provider rate to obtain USD per one unit of the requested fiat
currency. `asOf` must be the provider's actual quote timestamp; do not replace
it with the server's current time.

A real provider may return a different schema. In that case, implement and test a
provider-specific adapter that maps its authentic response into this contract;
do not relabel or fabricate its source, rate, or timestamp.

## Conversion and payment safety

1. Obtain a fresh FX quote from the configured trusted source on the server.
2. Convert fiat to USD using that quote, then convert USD to the PiNova community
   reference amount, retaining the supported 12-decimal Pi precision.
3. Display estimates as estimates, including the reference-rate disclaimer.
4. Independently recompute the canonical invoice and verify the actual Pi
   transaction server-side before approving or fulfilling a payment.
5. If the provider is missing, stale, invalid, or unreachable, fail closed and
   show that the estimate is unavailable. Do not fall back to 1:1 FX or treat a
   client-provided amount as authoritative.

## Rollout checklist

- [ ] Select an FX provider and verify its provenance, terms, supported currencies,
      timestamp semantics, availability, and rate limits.
- [ ] Implement the provider-specific response adapter if needed.
- [ ] Add the three server environment variables above in Preview first.
- [ ] Test NGN and other target currencies against independently verified test
      fixtures; never put real API keys in source control.
- [ ] Confirm missing, stale, malformed, mismatched-source, timeout, and HTTP
      failures all fail closed.
- [ ] Wire the shared server conversion into each relevant quote/invoice path
      (Marketplace, Global Utilities, Education, and Travel & Transport) without
      making the browser conversion an authorization decision.
- [ ] Run the complete CI and payment lifecycle tests in Preview before merging.

## Validation commands

```sh
npm run test:currency
npm run lint
```

The focused currency workflow runs both commands. A successful focused workflow
does not by itself prove that every module is wired to the shared engine or that
live provider credentials are configured.
