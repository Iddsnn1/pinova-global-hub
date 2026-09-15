import assert from 'node:assert/strict';
import { GLOBAL_EDUCATION_INSTITUTIONS } from '../src/data/educationInstitutionsData';
import { applyYabatechHierarchyVerificationOverride } from '../src/data/yabatechHierarchyVerificationOverride';
import {
  filterVerifiedFaculties,
  filterVerifiedDepartments,
  filterVerifiedProgrammes,
  hasFabricatedPlaceholderName,
} from '../src/data/educationDataIntegrity';

const PLACEHOLDER_NAMES = [
  'Faculty 1',
  'School 1',
  'College 1',
  'Department 1',
  'Programme 1',
  'Program 1',
];

for (const name of PLACEHOLDER_NAMES) {
  assert.equal(hasFabricatedPlaceholderName(name), true, `placeholder must be rejected: ${name}`);
}

for (const institution of GLOBAL_EDUCATION_INSTITUTIONS) {
  for (const faculty of institution.faculties || []) {
    assert.equal(hasFabricatedPlaceholderName(faculty.name), false, `${institution.name}: fabricated faculty name`);
    for (const department of faculty.departments || []) {
      assert.equal(hasFabricatedPlaceholderName(department.name), false, `${institution.name}: fabricated department name`);
      for (const programme of department.programmes || []) {
        assert.equal(hasFabricatedPlaceholderName(programme.name), false, `${institution.name}: fabricated programme name`);
      }
    }
  }
}

// YABATECH's verified School of Technical Education is maintained as an
// explicit source-backed verification override because the seed dataset does
// not contain that verified unit. Test the effective published hierarchy, not
// the uncorrected seed snapshot.
const yabatechSeed = GLOBAL_EDUCATION_INSTITUTIONS.find((i) => i.id === 'inst-ng-yabatech-003');
assert.ok(yabatechSeed, 'YABATECH must exist');
const yabatech = applyYabatechHierarchyVerificationOverride(yabatechSeed!);
assert.equal(yabatech.faculties?.length, 8, 'YABATECH must expose 8 verified Schools after the source-backed override');
assert.ok((yabatech.faculties || []).every((unit) => unit.unitType === 'school'), 'YABATECH hierarchy must use Schools');
assert.ok((yabatech.faculties || []).every((unit) => unit.verificationStatus === 'VERIFIED'), 'YABATECH Schools must be verified');

for (const institution of GLOBAL_EDUCATION_INSTITUTIONS) {
  const verifiedFaculties = filterVerifiedFaculties(institution.faculties);
  assert.ok(verifiedFaculties.every((f) => f.verificationStatus === 'VERIFIED'), `${institution.name}: unverified faculty leaked`);
  for (const faculty of verifiedFaculties) {
    const verifiedDepartments = filterVerifiedDepartments(faculty.departments);
    assert.ok(verifiedDepartments.every((d) => d.verificationStatus === 'VERIFIED'), `${institution.name}/${faculty.name}: unverified department leaked`);
    for (const department of verifiedDepartments) {
      assert.ok(filterVerifiedProgrammes(department.programmes).every((p) => !hasFabricatedPlaceholderName(p.name)), `${institution.name}/${department.name}: fabricated programme leaked`);
    }
  }
}

console.log('PASS: education data-integrity suite');
