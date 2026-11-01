/**
 * PiNova Global Hub — Education Directory Functional Contract Suite
 *
 * The production directory must never seed or invent institution records.
 * This suite therefore verifies the fail-closed provider contract and the
 * repository hierarchy integrity for unknown/unconfigured institutions.
 */

import fs from 'fs';
import os from 'os';
import path from 'path';

process.env.PINOVA_DATA_DIR = path.join(
  os.tmpdir(),
  `pinova_education_directory_test_${Date.now()}`
);

import { EducationRepository } from '../src/server/db/repositories/EducationRepository';

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`[FAIL] ${message}`);
  console.log(`[PASS] ${message}`);
}

async function run() {
  console.log('============================================================');
  console.log('PINOVA EDUCATION DIRECTORY FUNCTIONAL CONTRACT');
  console.log('============================================================\n');

  const repo = new EducationRepository();

  // Production safety: a fresh repository must not contain synthetic institutions.
  const institutions = repo.getInstitutions({});
  assert(institutions.length === 0, 'Fresh production repository does not seed synthetic institutions');

  // Hierarchy endpoints must fail closed for unknown/unconfigured institutions.
  assert(
    repo.getFacultiesByInstitution('provider-unconfigured-institution').length === 0,
    'Unknown institution returns no academic units'
  );
  assert(
    repo.getDepartmentsByFaculty('provider-unconfigured-institution', 'provider-unconfigured-unit').length === 0,
    'Unknown academic unit returns no departments'
  );
  assert(
    repo.getProgrammesByDepartment(
      'provider-unconfigured-institution',
      'provider-unconfigured-unit',
      'provider-unconfigured-department'
    ).length === 0,
    'Unknown department returns no programmes'
  );
  assert(
    repo.getAllProgrammesByInstitution('provider-unconfigured-institution').length === 0,
    'Unknown institution returns no direct programmes'
  );

  // Source-level contract: the UI must actually call the hierarchy service and
  // reset dependent selections when a parent changes.
  const directorySource = fs.readFileSync(
    path.join(process.cwd(), 'src/components/education/InstitutionDirectory.tsx'),
    'utf8'
  );
  assert(
    directorySource.includes('educationService.getFaculties(selectedHierarchyInstitution)'),
    'Institution selection loads academic units through the service'
  );
  assert(
    directorySource.includes('educationService.getDepartments(selectedHierarchyInstitution, selectedFaculty)'),
    'Academic-unit selection loads departments through the service'
  );
  assert(
    directorySource.includes('educationService.getProgrammes(selectedHierarchyInstitution, selectedFaculty, selectedDepartment)'),
    'Department selection loads programmes through the service'
  );
  assert(
    directorySource.includes("setSelectedDepartment('');") &&
      directorySource.includes("setSelectedProgramme('');"),
    'Changing a parent resets dependent selections'
  );
  assert(
    directorySource.includes('Open Institution Profile'),
    'Hierarchy selection exposes a real institution-profile action'
  );
  assert(
    directorySource.includes('provider/registry feed') ||
      directorySource.includes('authoritative education provider/registry feed'),
    'Empty directory state explains the authoritative provider requirement'
  );

  console.log('\n>>> EDUCATION DIRECTORY FUNCTIONAL CONTRACT: PASS <<<');
}

run().catch((error) => {
  console.error(String(error?.stack || error));
  process.exit(1);
});
