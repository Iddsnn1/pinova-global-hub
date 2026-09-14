/**
 * PiNova Global Hub — Education Directory Functional Verification Suite
 *
 * Verifies the runtime data path used by the Education Directory without
 * inventing records: Global scope remains global-first, while the Nigerian
 * deployment hub exposes the complete verified BUK/UNILAG/YABATECH hierarchy.
 */

import os from 'os';
import path from 'path';
process.env.PINOVA_DATA_DIR = path.join(os.tmpdir(), `pinova_education_directory_test_${Date.now()}`);

import { EducationRepository } from '../src/server/db/repositories/EducationRepository';
import { applyEducationHierarchyVerificationOverrides } from '../src/data/educationHierarchyVerificationOverrides';
import { applyYabatechHierarchyVerificationOverride } from '../src/data/yabatechHierarchyVerificationOverride';
import { normalizeBukFacultyHierarchy } from '../src/data/bukHierarchyNormalization';

function assert(condition: boolean, message: string, details?: string) {
  if (!condition) {
    throw new Error(`[FAIL] ${message}${details ? ` — ${details}` : ''}`);
  }
  console.log(`[PASS] ${message}`);
}

function withHierarchyOverrides(institution: ReturnType<EducationRepository['getInstitutionById']>) {
  if (!institution) return null;
  const corrected = applyEducationHierarchyVerificationOverrides(institution);
  const withYabatechCorrection = applyYabatechHierarchyVerificationOverride(corrected);
  return normalizeBukFacultyHierarchy(withYabatechCorrection);
}

const normalizeFacultyName = (value: string): string =>
  value.trim().toLowerCase().replace(/^faculty of\s+/, '');

async function run() {
  console.log('============================================================');
  console.log('PINOVA EDUCATION DIRECTORY FUNCTIONAL VERIFICATION');
  console.log('============================================================\n');

  const repo = new EducationRepository();
  const globalInstitutions = repo.getInstitutions({});
  const nigeriaInstitutions = repo.getInstitutions({ countryCode: 'NG' });
  const nigeriaUniversities = repo.getInstitutions({ countryCode: 'NG', institutionType: 'university' });

  // Global-first contract: ALL scope must not collapse into Nigeria-only data.
  assert(globalInstitutions.some((i) => i.countryCode !== 'NG'), 'Global scope retains non-Nigeria institutions');
  assert(globalInstitutions.length >= nigeriaInstitutions.length, 'Global scope contains at least the Nigeria deployment-hub set');

  // Nigeria deployment hub: institution filtering must return the target universities.
  const buk = withHierarchyOverrides(repo.getInstitutionById('inst-ng-buk-001'));
  const unilag = withHierarchyOverrides(repo.getInstitutionById('inst-ng-unilag-002'));
  const yabatech = withHierarchyOverrides(repo.getInstitutionById('inst-ng-yabatech-003'));

  assert(Boolean(buk), 'BUK is present in the Nigeria registry');
  assert(Boolean(unilag), 'UNILAG is present in the Nigeria registry');
  assert(Boolean(yabatech), 'YABATECH is present in the Nigeria registry');
  assert(nigeriaUniversities.some((i) => i.id === 'inst-ng-buk-001'), 'Nigeria university filter returns BUK');
  assert(nigeriaUniversities.some((i) => i.id === 'inst-ng-unilag-002'), 'Nigeria university filter returns UNILAG');

  // Complete university hierarchy checks.
  assert(buk!.faculties?.length === 19, 'BUK exposes all 19 verified faculties', `Found ${buk!.faculties?.length ?? 0}`);
  assert(unilag!.faculties?.length === 19, 'UNILAG exposes all 19 verified faculties', `Found ${unilag!.faculties?.length ?? 0}`);
  assert(
    (buk!.faculties || []).every((faculty) => (faculty.departments || []).length > 0),
    'Every BUK faculty exposes at least one department',
  );
  assert(
    (unilag!.faculties || []).every((faculty) => (faculty.departments || []).length > 0),
    'Every UNILAG faculty exposes at least one department',
  );
  const bukFacultyNames = new Set((buk!.faculties || []).map((faculty) => normalizeFacultyName(faculty.name)));
  assert(
    bukFacultyNames.has('life sciences') && bukFacultyNames.has('physical sciences'),
    'BUK science structure is split into Life Sciences and Physical Sciences',
  );

  // Polytechnic-native hierarchy: Schools, not Faculties.
  const yabatechUnits = yabatech!.faculties || [];
  assert(yabatechUnits.length === 8, 'YABATECH exposes all 8 verified schools', `Found ${yabatechUnits.length}`);
  assert(
    yabatechUnits.every((unit) => unit.unitType === 'school'),
    'YABATECH hierarchy uses native School units rather than university Faculty terminology',
  );
  assert(
    yabatechUnits.every((school) => (school.departments || []).length > 0),
    'Every YABATECH school exposes at least one department',
  );

  console.log('\n>>> EDUCATION DIRECTORY FUNCTIONAL TEST: PASS <<<');
}

run().catch((error) => {
  console.error(String(error?.stack || error));
  process.exit(1);
});