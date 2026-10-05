import {
  isAllowedOrderTransition,
  isAllowedSellerTransition,
  expectedCarrierTransition,
} from '../src/modules/orders/lifecycle';

let passed = 0;
let failed = 0;

function assert(condition: boolean, name: string) {
  if (condition) {
    console.log(`  [PASS] ${name}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${name}`);
    failed++;
  }
}

console.log('PINOVA GLOBAL HUB — ORDER LIFECYCLE CONTRACT SUITE');

const sellerPath = [
  'Payment Verified',
  'Seller Accepted',
  'Preparing Order',
  'Packed',
  'Shipped',
] as const;

for (let i = 0; i < sellerPath.length - 1; i++) {
  assert(
    isAllowedSellerTransition(sellerPath[i], sellerPath[i + 1]),
    `Seller transition ${sellerPath[i]} -> ${sellerPath[i + 1]}`
  );
}

const carrierPath = [
  'Shipped',
  'In Transit',
  'Out for Delivery',
  'Delivered',
] as const;

for (let i = 0; i < carrierPath.length - 1; i++) {
  assert(
    expectedCarrierTransition(carrierPath[i]) === carrierPath[i + 1],
    `Carrier transition ${carrierPath[i]} -> ${carrierPath[i + 1]}`
  );
}

assert(!isAllowedSellerTransition('Packed', 'Out for Delivery'), 'Seller cannot advance Packed -> Out for Delivery');
assert(!isAllowedSellerTransition('Shipped', 'Delivered'), 'Seller cannot advance Shipped -> Delivered');
assert(expectedCarrierTransition('Shipped') === 'In Transit', 'Carrier Shipped milestone is exactly In Transit');
assert(expectedCarrierTransition('In Transit') === 'Out for Delivery', 'Carrier In Transit milestone is exactly Out for Delivery');
assert(expectedCarrierTransition('Out for Delivery') === 'Delivered', 'Carrier Out for Delivery milestone is exactly Delivered');
assert(!isAllowedOrderTransition('Shipped', 'Delivered'), 'Global lifecycle rejects direct Shipped -> Delivered');
assert(!isAllowedOrderTransition('In Transit', 'Delivered'), 'Global lifecycle rejects direct In Transit -> Delivered');
assert(!isAllowedOrderTransition('Packed', 'Out for Delivery'), 'Global lifecycle rejects direct Packed -> Out for Delivery');

console.log(`Lifecycle contract result: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
