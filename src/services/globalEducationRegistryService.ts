import type { InstitutionProfile } from '../types/education';
import {
  buildGlobalEducationCoverageAudit,
  getGlobalEducationCoverageGaps,
  getGlobalEducationPartialCoverage,
  getGlobalEducationCoverageSummary,
  mapInstitutionVerificationStatus,
} from '../data/globalEducationCoverageEngine';
import { buildGlobalEducationSourceQueue } from '../data/globalEducationSourceQueue';
import { GLOBAL_EDUCATION_REGISTRY_POLICY } from '../data/globalEducationRegistry';

/**
 * Application-facing bridge for the global Education Registry governance layer.
 *
 * This service is read-only: it never invents institutions, promotes discovery
 * records to verified records, or replaces country-specific academic hierarchy.
 */
export const globalEducationRegistryService = {
  getPolicy() {
    return GLOBAL_EDUCATION_REGISTRY_POLICY;
  },

  getCoverageAudit(institutions?: InstitutionProfile[]) {
    return buildGlobalEducationCoverageAudit(institutions);
  },

  getCoverageGaps(institutions?: InstitutionProfile[]) {
    return getGlobalEducationCoverageGaps(institutions);
  },

  getPartialCoverage(institutions?: InstitutionProfile[]) {
    return getGlobalEducationPartialCoverage(institutions);
  },

  getCoverageSummary(institutions?: InstitutionProfile[]) {
    return getGlobalEducationCoverageSummary(institutions);
  },

  getSourceQueue(institutions?: InstitutionProfile[]) {
    return buildGlobalEducationSourceQueue(institutions);
  },

  mapVerificationStatus(status?: string) {
    return mapInstitutionVerificationStatus(status);
  },
};

export type GlobalEducationRegistryService = typeof globalEducationRegistryService;
