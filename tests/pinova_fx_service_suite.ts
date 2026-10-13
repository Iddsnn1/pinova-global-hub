import assert from 'node:assert/strict';
import { quoteFiatToPiReference } from '../src/server/services/PiNovaFxService';
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

  console.log('PiNova FX service suite passed.');
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
