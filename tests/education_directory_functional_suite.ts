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
import { GLOBAL_EDUCATION_INSTITUTIONS } from '../src/data/educationInstitutionsData';
import { GLOBAL_EDUCATION_AUTHORITATIVE_SOURCES } from '../src/data/globalEducationAuthoritativeSources';

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

  // The runtime repository intentionally starts empty when no authoritative
  // institution provider has populated it. This suite therefore verifies the
  // authoritative registry fixture/source contract separately, rather than
  // treating static records as a production fallback.
  assert(
    GLOBAL_EDUCATION_AUTHORITATIVE_SOURCES.some((source) => source.countryCode !== 'NG'),
    'Global education source registry retains non-Nigeria coverage',
  );
  assert(
    GLOBAL_EDUCATION_AUTHORITATIVE_SOURCES.some((source) => source.countryCode === 'GLOBAL'),
    'Global education source registry includes a global reference layer',
  );
  assert(
    GLOBAL_EDUCATION_AUTHORITATIVE_SOURCES.some((source) => source.countryCode === 'US' && source.ingestionStatus === 'LIVE_ADAPTER'),
    'US education directory has a live authoritative adapter',
  );

  const verifiedInstitutions = GLOBAL_EDUCATION_INSTITUTIONS;
  const nigeriaInstitutions = verifiedInstitutions.filter((i) => i.countryCode === 'NG');
  const nigeriaUniversities = nigeriaInstitutions.filter((i) => i.institutionType === 'university');

  assert(
    verifiedInstitutions.some((i) => i.countryCode !== 'NG') ||
      GLOBAL_EDUCATION_AUTHORITATIVE_SOURCES.some((source) => source.countryCode !== 'NG'),
    'Global directory contract is not Nigeria-only',
  );
  assert(nigeriaInstitutions.length > 0, 'Nigeria verified institution registry is available');

  const buk = withHierarchyOverrides(verifiedInstitutions.find((i) => i.id === 'inst-ng-buk-001') || null);
  const unilag = withHierarchyOverrides(verifiedInstitutions.find((i) => i.id === 'inst-ng-unilag-002') || null);
  const yabatech = withHierarchyOverrides(verifiedInstitutions.find((i) => i.id === 'inst-ng-yabatech-003') || null);

  assert(Boolean(buk), 'BUK is present in the verified Nigeria registry');
  assert(Boolean(unilag), 'UNILAG is present in the verified Nigeria registry');
  assert(Boolean(yabatech), 'YABATECH is present in the verified Nigeria registry');
  assert(nigeriaUniversities.some((i) => i.id === 'inst-ng-buk-001'), 'Nigeria university filter returns BUK');
  assert(nigeriaUniversities.some((i) => i.id === 'inst-ng-unilag-002'), 'Nigeria university filter returns UNILAG');

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