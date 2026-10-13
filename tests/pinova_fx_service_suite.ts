import assert from 'node:assert/strict';
import { quoteFiatToPiReference, signPiNovaFxQuote, verifyPiNovaFxQuoteToken } from '../src/server/services/PiNovaFxService';
import { PI_REFERENCE_RATE_USD } from '../src/config/piReference';

async function run() {
  const oneDollar = await quoteFiatToPiReference(1, 'USD');
  assert.equal(oneDollar.currency, 'USD');
  assert.equal(oneDollar.amountUsd, 1);
  assert.equal(oneDollar.usdToCurrencyRate, 1);
  assert.equal(oneDollar.referencePiAmount, Number((1 / PI_REFERENCE_RATE_USD).toFixed(12)));
  assert.equal(oneDollar.referenceRateUsdPerPi, PI_REFERENCE_RATE_USD);
  assert.equal(oneDollar.source, 'identity-usd');

  const fractionalUsd = await quoteFiatToPiReference(15, ' usd ');
  assert.equal(fractionalUsd.amountUsd, 15);
  assert.equal(fractionalUsd.referencePiAmount, Number((15 / PI_REFERENCE_RATE_USD).toFixed(12)));

  await assert.rejects(() => quoteFiatToPiReference(0, 'USD'), RangeError);
  await assert.rejects(() => quoteFiatToPiReference(-1, 'USD'), RangeError);
  await assert.rejects(() => quoteFiatToPiReference(Number.NaN, 'USD'), RangeError);
  await assert.rejects(() => quoteFiatToPiReference(1, 'US'), TypeError);
  await assert.rejects(() => quoteFiatToPiReference(1, 'US1'), TypeError);

  const previousSecret = process.env.PINOVA_FX_QUOTE_SECRET;
  process.env.PINOVA_FX_QUOTE_SECRET = 'test-only-fx-quote-secret-which-is-long-enough';
  try {
    const signed = signPiNovaFxQuote(oneDollar, 1_800_000_000_000);
    const verified = verifyPiNovaFxQuoteToken(signed.token, 1_800_000_001_000);
    assert.ok(verified);
    assert.equal(verified.currency, 'USD');
    assert.equal(verified.amount, 1);
    assert.equal(verified.referencePiAmount, oneDollar.referencePiAmount);
    assert.equal(verifyPiNovaFxQuoteToken(signed.token + 'x', 1_800_000_001_000), null);
    assert.equal(verifyPiNovaFxQuoteToken(signed.token, 1_800_000_301_000), null);
  } finally {
    if (previousSecret === undefined) delete process.env.PINOVA_FX_QUOTE_SECRET;
    else process.env.PINOVA_FX_QUOTE_SECRET = previousSecret;
  }

  console.log('PiNova FX service suite passed.');
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
