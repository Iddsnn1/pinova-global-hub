import assert from 'node:assert/strict';
import { ALL_GLOBAL_COUNTRIES } from '../src/data/countriesData';
import { GLOBAL_EDUCATION_INSTITUTIONS } from '../src/data/educationInstitutionsData';
import {
  buildGlobalEducationCoverageAudit,
  getGlobalEducationCoverageGaps,
  mapInstitutionVerificationStatus,
} from '../src/data/globalEducationCoverageEngine';
import { buildGlobalEducationSourceQueue } from '../src/data/globalEducationSourceQueue';

const audit = buildGlobalEducationCoverageAudit();

assert.equal(
  audit.length,
  ALL_GLOBAL_COUNTRIES.length,
  'Coverage audit must evaluate every country in the global country directory',
);

assert.equal(
  audit.reduce((sum, record) => sum + record.localInstitutionCount, 0),
  GLOBAL_EDUCATION_INSTITUTIONS.length,
  'Coverage audit must account for every indexed institution exactly once',
);

const gaps = getGlobalEducationCoverageGaps();
assert.ok(gaps.length > 0, 'Current registry should expose real coverage gaps rather than claiming global completeness');
assert.ok(gaps.every((record) => record.localInstitutionCount === 0));

const queue = buildGlobalEducationSourceQueue();
assert.ok(queue.length >= gaps.length, 'Every no-record country must be represented in the source queue');
assert.ok(queue.some((task) => task.priority === 'HIGH'), 'Uncovered countries must be high-priority discovery work');
assert.ok(queue.every((task) => task.preferredSourceKinds.length > 0));

assert.equal(mapInstitutionVerificationStatus('VERIFIED'), 'FULLY_VERIFIED');
assert.equal(mapInstitutionVerificationStatus('VERIFIED_WITH_LIMITATIONS'), 'SOURCE_VERIFIED');
assert.equal(mapInstitutionVerificationStatus('PENDING'), 'DISCOVERED');
assert.equal(mapInstitutionVerificationStatus('UNDER_REVIEW'), 'PENDING_VERIFICATION');

console.log('Global education registry coverage suite: PASS');
console.log(`Countries audited: ${audit.length}`);
console.log(`Coverage gaps: ${gaps.length}`);
console.log(`Source queue tasks: ${queue.length}`);
