/**
 * Unit & Integration Tests for Pi Amount Precision & Receipt Formatting
 */

import { formatPiAmount, calculateAuthoritativePiAmount } from './formatters';

export function runPiPrecisionTests() {
  const PI_RATE = 314159.00;
  const results: { test: string; passed: boolean; output: string }[] = [];

  function assert(testName: string, actual: string, expected: string) {
    const passed = actual === expected;
    results.push({
      test: testName,
      passed,
      output: `Actual: "${actual}", Expected: "${expected}"`
    });
    if (!passed) {
      console.error(`❌ FAILED: ${testName} -> Actual: "${actual}", Expected: "${expected}"`);
    } else {
      console.log(`✅ PASSED: ${testName} -> "${actual}"`);
    }
  }

  console.log('--- RUNNING PI PRECISION TESTS ---');

  // Test 1: $0.50 USD at 1 PI = $314,159 USD
  const amt0_50 = calculateAuthoritativePiAmount(0.50, PI_RATE);
  assert(
    '$0.50 calculation precision',
    amt0_50.toString(),
    '0.00000159'
  );
  assert(
    '$0.50 formatted display never rounds to 0.0000',
    formatPiAmount(amt0_50),
    '0.00000159'
  );

  // Test 2: $1.00 USD at 1 PI = $314,159 USD
  const amt1_00 = calculateAuthoritativePiAmount(1.00, PI_RATE);
  assert(
    '$1.00 calculation precision',
    amt1_00.toString(),
    '0.00000318'
  );
  assert(
    '$1.00 formatted display',
    formatPiAmount(amt1_00),
    '0.00000318'
  );

  // Test 3: $10.00 USD at 1 PI = $314,159 USD
  const amt10_00 = calculateAuthoritativePiAmount(10.00, PI_RATE);
  assert(
    '$10.00 calculation precision',
    amt10_00.toString(),
    '0.00003183'
  );
  assert(
    '$10.00 formatted display',
    formatPiAmount(amt10_00),
    '0.00003183'
  );

  // Test 4: $100.00 USD at 1 PI = $314,159 USD
  const amt100_00 = calculateAuthoritativePiAmount(100.00, PI_RATE);
  assert(
    '$100.00 calculation precision',
    amt100_00.toString(),
    '0.0003183'
  );
  assert(
    '$100.00 formatted display',
    formatPiAmount(amt100_00),
    '0.0003183'
  );

  // Test 5: Very small Pi amounts
  assert(
    'Very small Pi amount: 0.0000015915',
    formatPiAmount(0.0000015915),
    '0.00000159'
  );
  assert(
    'Very small Pi amount: 0.000002',
    formatPiAmount(0.000002),
    '0.000002'
  );

  // Test 6: Normal & intermediate Pi amounts
  assert(
    'Intermediate Pi amount: 0.0019735',
    formatPiAmount(0.0019735),
    '0.0019735'
  );
  assert(
    'Standard Pi amount: 250',
    formatPiAmount(250),
    '250'
  );
  assert(
    'Decimal Pi amount: 12.345',
    formatPiAmount(12.345),
    '12.345'
  );

  // Test 7: Zero and Edge cases
  assert(
    'Zero Pi amount',
    formatPiAmount(0),
    '0'
  );
  assert(
    'Null Pi amount',
    formatPiAmount(null),
    '0'
  );
  assert(
    'Undefined Pi amount',
    formatPiAmount(undefined),
    '0'
  );

  const allPassed = results.every(r => r.passed);
  console.log(`--- PI PRECISION TESTS SUMMARY: ${allPassed ? 'ALL PASSED' : 'SOME FAILED'} (${results.length} tests) ---`);
  return allPassed;
}

// Auto-run if executed directly via tsx
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('formatters.test')) {
  const success = runPiPrecisionTests();
  if (!success) {
    process.exit(1);
  }
}
