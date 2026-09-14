/**
 * Global Education Coverage Expansion Engine
 *
 * This module audits registry coverage across the existing global country list
 * without inventing institution records. It identifies countries with no local
 * registry records, countries with partial records, and countries where the
 * current registry already has verified/limited verification data.
 *
 * Coverage is deliberately separate from verification: an empty country does
 * not mean "no institutions"; it means PiNova has not imported/verified local
 * institution records yet.
 */

import { ALL_GLOBAL_COUNTRIES } from './countriesData';
import { GLOBAL_EDUCATION_INSTITUTIONS } from './educationInstitutionsData';
import type { InstitutionProfile } from '../types/education';
import type {
  EducationRegistryCoverageRecord,
  EducationRegistryVerificationStatus,
  EducationRegistrySource,
} from './globalEducationRegistry';

export type GlobalEducationCoverageStatus =
  | 'NO_LOCAL_RECORDS'
  | 'PARTIAL_LOCAL_COVERAGE'
  | 'LOCAL_RECORDS_PRESENT';

export interface GlobalEducationCoverageAuditRecord
  extends EducationRegistryCoverageRecord {
  status: GlobalEducationCoverageStatus;
  localInstitutionCount: number;
  verifiedInstitutionCount: number;
  institutionTypes: string[];
  hasHigherEducationRecord: boolean;
  hasPrimaryOrSecondaryRecord: boolean;
  hasTechnicalOrVocationalRecord: boolean;
}

export interface GlobalEducationCoverageSummary {
  countriesInGlobalDirectory: number;
  countriesWithLocalRecords: number;
  countriesWithoutLocalRecords: number;
  institutionsIndexed: number;
  verifiedInstitutionsIndexed: number;
  partialCoverageCountries: number;
}

const GLOBAL_REFERENCE_SOURCE: EducationRegistrySource = {
  kind: 'GLOBAL_REFERENCE',
  authority: 'International Association of Universities / UNESCO WHED',
  reference: 'https://whed.net/Home2.html',
};

function isVerified(status?: string): boolean {
  return status === 'VERIFIED' || status === 'VERIFIED_WITH_LIMITATIONS';
}

function isHigherEducation(institution: InstitutionProfile): boolean {
  return institution.supportedTiers.includes('tertiary') ||
    ['university', 'polytechnic', 'college_of_education'].includes(institution.institutionType);
}

function isPrimaryOrSecondary(institution: InstitutionProfile): boolean {
  return institution.supportedTiers.includes('primary') ||
    institution.supportedTiers.includes('secondary') ||
    ['creche_nursery', 'primary_school', 'secondary_school', 'comprehensive_school'].includes(institution.institutionType);
}

function isTechnicalOrVocational(institution: InstitutionProfile): boolean {
  return institution.supportedTiers.includes('technical_vocational') ||
    ['vocational_institute', 'technical_college', 'professional_academy'].includes(institution.institutionType);
}

function buildCountryRecord(
  countryCode: string,
  countryName: string,
  institutions: InstitutionProfile[],
): GlobalEducationCoverageAuditRecord {
  const verifiedInstitutionCount = institutions.filter((institution) =>
    isVerified(institution.verificationStatus),
  ).length;

  const sourceCoverageStatus = institutions.length > 0
    ? 'PARTIAL'
    : 'REFERENCE_AVAILABLE';

  return {
    countryCode,
    countryName,
    institutionCountKnown: institutions.length,
    sourceCoverageStatus,
    primarySources: [GLOBAL_REFERENCE_SOURCE],
    status: institutions.length === 0
      ? 'NO_LOCAL_RECORDS'
      : verifiedInstitutionCount > 0
        ? 'LOCAL_RECORDS_PRESENT'
        : 'PARTIAL_LOCAL_COVERAGE',
    localInstitutionCount: institutions.length,
    verifiedInstitutionCount,
    institutionTypes: [...new Set(institutions.map((institution) => institution.institutionType))].sort(),
    hasHigherEducationRecord: institutions.some(isHigherEducation),
    hasPrimaryOrSecondaryRecord: institutions.some(isPrimaryOrSecondary),
    hasTechnicalOrVocationalRecord: institutions.some(isTechnicalOrVocational),
    notes: institutions.length === 0
      ? 'No local PiNova institution record is currently indexed. This is a coverage gap, not evidence that the country has no institutions.'
      : verifiedInstitutionCount < institutions.length
        ? 'Local records exist, but registry verification is incomplete for at least one record.'
        : 'Local records exist and at least one institution is verified; country-wide completeness is not implied.',
  };
}

/**
 * Build an audit for every country already available in PiNova's global
 * country directory. The function is deterministic and read-only.
 */
export function buildGlobalEducationCoverageAudit(
  institutions: InstitutionProfile[] = GLOBAL_EDUCATION_INSTITUTIONS,
): GlobalEducationCoverageAuditRecord[] {
  const byCountry = new Map<string, InstitutionProfile[]>();

  for (const institution of institutions) {
    const code = institution.countryCode?.trim().toUpperCase();
    if (!code) continue;
    const existing = byCountry.get(code) || [];
    existing.push(institution);
    byCountry.set(code, existing);
  }

  return ALL_GLOBAL_COUNTRIES
    .map((country) => buildCountryRecord(
      country.code.toUpperCase(),
      country.name,
      byCountry.get(country.code.toUpperCase()) || [],
    ))
    .sort((a, b) => a.countryName.localeCompare(b.countryName));
}

/** Countries that should be queued for authoritative source discovery. */
export function getGlobalEducationCoverageGaps(
  institutions: InstitutionProfile[] = GLOBAL_EDUCATION_INSTITUTIONS,
): GlobalEducationCoverageAuditRecord[] {
  return buildGlobalEducationCoverageAudit(institutions)
    .filter((record) => record.status === 'NO_LOCAL_RECORDS');
}

/** Countries with records that still need broader source/hierarchy verification. */
export function getGlobalEducationPartialCoverage(
  institutions: InstitutionProfile[] = GLOBAL_EDUCATION_INSTITUTIONS,
): GlobalEducationCoverageAuditRecord[] {
  return buildGlobalEducationCoverageAudit(institutions)
    .filter((record) => record.status === 'PARTIAL_LOCAL_COVERAGE' || record.sourceCoverageStatus === 'PARTIAL');
}

export function getGlobalEducationCoverageSummary(
  institutions: InstitutionProfile[] = GLOBAL_EDUCATION_INSTITUTIONS,
): GlobalEducationCoverageSummary {
  const audit = buildGlobalEducationCoverageAudit(institutions);
  return {
    countriesInGlobalDirectory: audit.length,
    countriesWithLocalRecords: audit.filter((record) => record.localInstitutionCount > 0).length,
    countriesWithoutLocalRecords: audit.filter((record) => record.localInstitutionCount === 0).length,
    institutionsIndexed: institutions.length,
    verifiedInstitutionsIndexed: institutions.filter((institution) => isVerified(institution.verificationStatus)).length,
    partialCoverageCountries: audit.filter((record) => record.sourceCoverageStatus === 'PARTIAL').length,
  };
}

/**
 * Converts the app's institution-level verification status into the registry
 * governance vocabulary without changing the institution record itself.
 */
export function mapInstitutionVerificationStatus(
  status?: string,
): EducationRegistryVerificationStatus {
  switch (status) {
    case 'VERIFIED':
      return 'FULLY_VERIFIED';
    case 'VERIFIED_WITH_LIMITATIONS':
      return 'SOURCE_VERIFIED';
    case 'UNDER_REVIEW':
      return 'PENDING_VERIFICATION';
    case 'PENDING':
      return 'DISCOVERED';
    default:
      return 'PENDING_VERIFICATION';
  }
}
