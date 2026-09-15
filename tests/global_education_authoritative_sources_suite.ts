import assert from 'node:assert/strict';
import { GLOBAL_EDUCATION_AUTHORITATIVE_SOURCES, getAuthoritativeEducationSources } from '../src/data/globalEducationAuthoritativeSources';

const priorityCountries = ['US', 'CA', 'GB', 'AU', 'IN', 'NG', 'KE', 'GH', 'ZA'];
for (const countryCode of priorityCountries) {
  const sources = getAuthoritativeEducationSources(countryCode);
  assert.ok(sources.some((source) => source.countryCode === countryCode), `Missing authoritative source for ${countryCode}`);
  assert.ok(sources.some((source) => source.countryCode === 'GLOBAL'), `Missing global reference source for ${countryCode}`);
}

const us = getAuthoritativeEducationSources('US').find((source) => source.countryCode === 'US');
assert.equal(us?.ingestionStatus, 'LIVE_ADAPTER');
assert.equal(us?.machineReadable, true);
assert.ok(GLOBAL_EDUCATION_AUTHORITATIVE_SOURCES.length >= 10);

console.log(`PASS: ${priorityCountries.length} priority countries have authoritative source mappings.`);
console.log(`PASS: ${GLOBAL_EDUCATION_AUTHORITATIVE_SOURCES.length} authoritative/global source entries registered.`);
