import { piDecimalForStorage } from '../src/server/services/piDecimal';

const cases: Array<[number, string]> = [
  [0.000000031831, '0.000000031831'],
  [0.00041, '0.000410000000'],
  [1.234567890123, '1.234567890123'],
  [314159, '314159.000000000000'],
];

for (const [input, expected] of cases) {
  const actual = piDecimalForStorage(input);
  if (actual !== expected) throw new Error('PI_PRECISION_FAILED:' + input + ':' + actual);
}

if (piDecimalForStorage('0.000000031831') !== '0.000000031831') throw new Error('PI_STRING_PRECISION_FAILED');
if (piDecimalForStorage('0.00041') !== '0.00041') throw new Error('PI_STRING_NORMALIZATION_FAILED');

for (const invalid of ['1.1234567890123', '-1', '1.', 'abc']) {
  try { piDecimalForStorage(invalid); throw new Error('PI_INVALID_ACCEPTED:' + invalid); }
  catch (error) { if (error instanceof Error && error.message.startsWith('PI_INVALID_ACCEPTED:')) throw error; }
}

console.log('Pi precision persistence boundary: PASS');
