/**
 * Global Education Registry governance layer.
 *
 * This file intentionally does NOT contain a copied global institution dataset.
 * It defines the source/verification contract used to expand the registry safely.
 * Institution records remain in educationInstitutionsData.ts until they have an
 * authoritative source and can be reconciled without fabricating data.
 */

export const GLOBAL_EDUCATION_REGISTRY_VERSION = '1.0.0';

export type EducationRegistryVerificationStatus =
  | 'DISCOVERED'
  | 'SOURCE_REFERENCED'
  | 'SOURCE_VERIFIED'
  | 'FULLY_VERIFIED'
  | 'PARTIALLY_VERIFIED'
  | 'PENDING_VERIFICATION';

export type EducationRegistrySourceKind =
  | 'NATIONAL_AUTHORITY'
  | 'REGIONAL_AUTHORITY'
  | 'INSTITUTION_OFFICIAL'
  | 'GLOBAL_REFERENCE'
  | 'UNESCO_CLASSIFICATION';

export interface EducationRegistrySource {
  kind: EducationRegistrySourceKind;
  authority: string;
  reference?: string;
  countryCode?: string;
  lastCheckedAt?: string;
}

/**
 * Global-first source policy.
 *
 * Higher education may use IAU/WHED as a global reference, but WHED is not a
 * universal registry for primary, secondary or vocational institutions. Those
 * records must therefore be verified against the relevant national/regional
 * authority or the institution's official source.
 */
export const GLOBAL_EDUCATION_SOURCE_POLICY = {
  higherEducation: [
    'NATIONAL_AUTHORITY',
    'INSTITUTION_OFFICIAL',
    'GLOBAL_REFERENCE',
  ] as EducationRegistrySourceKind[],
  primaryAndSecondary: [
    'NATIONAL_AUTHORITY',
    'REGIONAL_AUTHORITY',
    'INSTITUTION_OFFICIAL',
  ] as EducationRegistrySourceKind[],
  technicalAndVocational: [
    'NATIONAL_AUTHORITY',
    'REGIONAL_AUTHORITY',
    'INSTITUTION_OFFICIAL',
  ] as EducationRegistrySourceKind[],
  classification: ['UNESCO_CLASSIFICATION'] as EducationRegistrySourceKind[],
} as const;

/**
 * Institution hierarchy is native to each education system. Never assume that
 * every institution has faculties or departments.
 */
export type EducationHierarchyModel =
  | 'FACULTY_DEPARTMENT_PROGRAMME'
  | 'SCHOOL_DEPARTMENT_PROGRAMME'
  | 'COLLEGE_DEPARTMENT_PROGRAMME'
  | 'INSTITUTE_PROGRAMME'
  | 'LEVEL_CLASS_SUBJECT'
  | 'TRAINING_PROGRAMME'
  | 'CUSTOM';

export interface EducationRegistryCoverageRecord {
  countryCode: string;
  countryName: string;
  institutionCountKnown: number;
  sourceCoverageStatus: 'REFERENCE_AVAILABLE' | 'PARTIAL' | 'NOT_AUDITED';
  primarySources: EducationRegistrySource[];
  notes?: string;
}

/**
 * Coverage metadata, not institution data. Counts are intentionally omitted
 * until they are produced by an authoritative source audit; this prevents the
 * UI from presenting a guessed global institution count as fact.
 */
export const GLOBAL_EDUCATION_REGISTRY_POLICY = {
  defaultScope: 'GLOBAL',
  defaultCountry: 'ALL',
  allowUnverifiedDiscovery: true,
  neverLabelDiscoveryAsVerified: true,
  requireSourceForSourceVerified: true,
  requireInstitutionOrAuthorityConfirmationForFullyVerified: true,
  requireNativeHierarchyForAcademicUnits: true,
  preserveCountrySpecificStructures: true,
  useIscEdForCrossCountryClassification: true,
} as const;

export function isVerifiedEducationRegistryStatus(
  status: EducationRegistryVerificationStatus,
): boolean {
  return status === 'FULLY_VERIFIED' || status === 'SOURCE_VERIFIED';
}

export function canDisplayAsVerifiedEducationInstitution(
  status: EducationRegistryVerificationStatus,
): boolean {
  return isVerifiedEducationRegistryStatus(status);
}
