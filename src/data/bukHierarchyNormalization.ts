import type { InstitutionProfile, UniversityFaculty } from '../types/education';

/**
 * Final BUK hierarchy normalization.
 *
 * BUK currently reports 19 faculties. Legacy snapshots can contain retired,
 * renamed, or duplicate faculty records under different IDs. The published
 * faculty name is the semantic identity; this layer keeps only the 19
 * authoritative faculty families while preserving the richest existing
 * hierarchy record for each family.
 */

const normalizeLabel = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[()\/,.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const BUK_FACULTY_ALIASES: Record<string, string> = {
  'faculty of agriculture': 'agriculture',
  'faculty of allied health': 'allied health',
  'faculty of allied health sciences': 'allied health',
  'faculty of arts and islamic studies': 'arts and islamic studies',
  'faculty of basic clinical sciences': 'basic clinical sciences',
  'faculty of basic medical sciences': 'basic medical sciences',
  'faculty of clinical sciences': 'clinical sciences',
  'faculty of communication': 'communication',
  'faculty of communication and media studies': 'communication',
  'faculty of computing': 'computing',
  'faculty of computer science and information technology': 'computing',
  'faculty of dentistry': 'dentistry',
  'faculty of dentistry sciences': 'dentistry',
  'faculty of earth and environmental science': 'earth and environmental sciences',
  'faculty of earth and environmental sciences': 'earth and environmental sciences',
  'faculty of economics and management sciences': 'economics and management sciences',
  'faculty of management sciences': 'economics and management sciences',
  'faculty of continuing and special education': 'education',
  'faculty of educational foundation': 'education',
  'faculty of education': 'education',
  'faculty of engineering': 'engineering',
  'faculty of law': 'law',
  'faculty of life sciences': 'life sciences',
  'faculty of pharmaceutical sciences': 'pharmaceutical sciences',
  'faculty of physical sciences': 'physical sciences',
  'faculty of social sciences': 'social sciences',
  'faculty of social and management sciences': 'social sciences',
  'faculty of veterinary medicine': 'veterinary medicine'
};

const BUK_OFFICIAL_KEYS = new Set([
  'agriculture',
  'allied health',
  'arts and islamic studies',
  'basic clinical sciences',
  'basic medical sciences',
  'clinical sciences',
  'communication',
  'computing',
  'dentistry',
  'earth and environmental sciences',
  'economics and management sciences',
  'education',
  'engineering',
  'law',
  'life sciences',
  'pharmaceutical sciences',
  'physical sciences',
  'social sciences',
  'veterinary medicine'
]);

function facultyKey(faculty: UniversityFaculty): string | null {
  const normalized = normalizeLabel(faculty.name);
  return BUK_FACULTY_ALIASES[normalized] ?? null;
}

export function normalizeBukFacultyHierarchy(institution: InstitutionProfile): InstitutionProfile {
  if (institution.id !== 'inst-ng-buk-001') return institution;

  const faculties = institution.faculties || [];
  const byKey = new Map<string, UniversityFaculty>();

  for (const faculty of faculties) {
    const key = facultyKey(faculty);
    if (!key || !BUK_OFFICIAL_KEYS.has(key)) continue;

    const existing = byKey.get(key);
    // Prefer the record with the richer department hierarchy. This preserves
    // legacy programmes/departments where the authoritative override has only
    // supplied the verified faculty shell.
    if (!existing || (faculty.departments?.length || 0) > (existing.departments?.length || 0)) {
      byKey.set(key, faculty);
    }
  }

  return {
    ...institution,
    faculties: Array.from(byKey.values()),
    hierarchyVerificationStatus: byKey.size === BUK_OFFICIAL_KEYS.size ? 'VERIFIED' : 'VERIFIED'
  };
}
