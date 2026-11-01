/**
 * Education hierarchy data-integrity gate.
 *
 * Core rule: global coverage must never be achieved by fabricating academic
 * hierarchy. Unverified child records may exist in source data, but they must
 * not be exposed as verified hierarchy by read paths or filters.
 */
import type {
  AcademicDepartment,
  EducationProgramme,
  InstitutionProfile,
  UniversityFaculty,
} from '../types/education';

const PLACEHOLDER_NAME = /^(faculty|school|college|department|programme|program)\s*\d+$/i;

export function isVerifiedHierarchyStatus(status?: string): boolean {
  return status === 'VERIFIED';
}

export function isVerifiedInstitution(inst: InstitutionProfile): boolean {
  return inst.verificationStatus === 'VERIFIED' || inst.verificationStatus === 'VERIFIED_WITH_LIMITATIONS';
}

export function hasFabricatedPlaceholderName(name?: string): boolean {
  return Boolean(name && PLACEHOLDER_NAME.test(name.trim()));
}

export function filterVerifiedFaculties(faculties?: UniversityFaculty[]): UniversityFaculty[] {
  if (!faculties) return [];
  return faculties.filter((faculty) =>
    isVerifiedHierarchyStatus(faculty.verificationStatus) &&
    !hasFabricatedPlaceholderName(faculty.name),
  );
}

export function filterVerifiedDepartments(departments?: AcademicDepartment[]): AcademicDepartment[] {
  if (!departments) return [];
  return departments.filter((department) =>
    isVerifiedHierarchyStatus(department.verificationStatus) &&
    !hasFabricatedPlaceholderName(department.name),
  );
}

export function filterVerifiedProgrammes(programmes?: EducationProgramme[]): EducationProgramme[] {
  if (!programmes) return [];
  return programmes.filter((programme) => !hasFabricatedPlaceholderName(programme.name));
}

/**
 * Returns a safe institution snapshot for display. Partial hierarchy remains
 * visible at institution level, but only verified academic children are
 * exposed through this normalized snapshot.
 */
export function getSafeEducationHierarchy(inst: InstitutionProfile): InstitutionProfile {
  return {
    ...inst,
    faculties: filterVerifiedFaculties(inst.faculties).map((faculty) => ({
      ...faculty,
      departments: filterVerifiedDepartments(faculty.departments).map((department) => ({
        ...department,
        programmes: filterVerifiedProgrammes(department.programmes),
      })),
    })),
    programmes: filterVerifiedProgrammes(inst.programmes),
  };
}

export function isHierarchyIncomplete(inst: InstitutionProfile): boolean {
  return inst.hierarchyVerificationStatus === 'PARTIALLY_VERIFIED' ||
    inst.hierarchyVerificationStatus === 'PENDING';
}
