import type { InstitutionProfile, UniversityFaculty } from '../types/education';

/**
 * Final BUK hierarchy normalization.
 *
 * The legacy seed can contain an older faculty record alongside the newer
 * authoritative override under a different ID. Faculty identity is semantic
 * (the published faculty name), not the legacy record ID, so retain the
 * authoritative last occurrence and remove duplicate faculty names.
 */
export function normalizeBukFacultyHierarchy(institution: InstitutionProfile): InstitutionProfile {
  if (institution.id !== 'inst-ng-buk-001') return institution;

  const faculties = institution.faculties || [];
  const byName = new Map<string, UniversityFaculty>();

  for (const faculty of faculties) {
    const key = faculty.name.trim().replace(/\s+/g, ' ').toLowerCase();
    byName.set(key, faculty);
  }

  return {
    ...institution,
    faculties: Array.from(byName.values()),
    hierarchyVerificationStatus: 'VERIFIED'
  };
}
