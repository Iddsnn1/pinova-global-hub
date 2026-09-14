import type { InstitutionProfile } from '../types/education';
import { educationService } from './educationService';
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

  /**
   * Loads the same directory dataset used by the Education UI, then derives
   * global coverage metadata from that live service result. This keeps the
   * governance layer attached to the real directory flow without changing
   * institution records or bypassing the existing API/fallback logic.
   */
  async getDirectorySnapshot(filter?: Parameters<typeof educationService.getInstitutions>[0]) {
    const institutions = await educationService.getInstitutions(filter);
    return {
      institutions,
      coverage: buildGlobalEducationCoverageAudit(institutions),
      gaps: getGlobalEducationCoverageGaps(institutions),
      partialCoverage: getGlobalEducationPartialCoverage(institutions),
      summary: getGlobalEducationCoverageSummary(institutions),
      sourceQueue: buildGlobalEducationSourceQueue(institutions),
    };
  },
};

export type GlobalEducationRegistryService = typeof globalEducationRegistryService;
