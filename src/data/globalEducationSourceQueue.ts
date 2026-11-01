/**
 * Global Education authoritative-source discovery queue.
 *
 * This queue does not create institution records and does not guess national
 * authorities. It turns coverage gaps into deterministic work items that can
 * later be fulfilled from official national/regional/institution sources.
 */

import type { EducationRegistrySourceKind } from './globalEducationRegistry';
import {
  buildGlobalEducationCoverageAudit,
  type GlobalEducationCoverageAuditRecord,
} from './globalEducationCoverageEngine';
import type { InstitutionProfile } from '../types/education';

export type EducationSourceDiscoveryPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface EducationSourceDiscoveryTask {
  countryCode: string;
  countryName: string;
  priority: EducationSourceDiscoveryPriority;
  targetLayers: Array<'HIGHER_EDUCATION' | 'PRIMARY_SECONDARY' | 'TECHNICAL_VOCATIONAL'>;
  preferredSourceKinds: EducationRegistrySourceKind[];
  reason: string;
}

function buildTask(record: GlobalEducationCoverageAuditRecord): EducationSourceDiscoveryTask {
  const targetLayers: EducationSourceDiscoveryTask['targetLayers'] = [];
  if (!record.hasHigherEducationRecord) targetLayers.push('HIGHER_EDUCATION');
  if (!record.hasPrimaryOrSecondaryRecord) targetLayers.push('PRIMARY_SECONDARY');
  if (!record.hasTechnicalOrVocationalRecord) targetLayers.push('TECHNICAL_VOCATIONAL');

  const noLocalRecords = record.localInstitutionCount === 0;
  const priority: EducationSourceDiscoveryPriority = noLocalRecords
    ? 'HIGH'
    : record.verifiedInstitutionCount < record.localInstitutionCount
      ? 'MEDIUM'
      : 'LOW';

  return {
    countryCode: record.countryCode,
    countryName: record.countryName,
    priority,
    targetLayers,
    preferredSourceKinds: targetLayers.includes('HIGHER_EDUCATION')
      ? ['NATIONAL_AUTHORITY', 'INSTITUTION_OFFICIAL', 'GLOBAL_REFERENCE']
      : ['NATIONAL_AUTHORITY', 'REGIONAL_AUTHORITY', 'INSTITUTION_OFFICIAL'],
    reason: noLocalRecords
      ? 'PiNova has no local institution records for this country; discover authoritative sources before adding records.'
      : record.verifiedInstitutionCount < record.localInstitutionCount
        ? 'PiNova has local records but verification coverage is incomplete; reconcile against authoritative sources.'
        : 'Existing records are present; broader country coverage should be checked without implying completeness.',
  };
}

/** Build deterministic source-discovery work items from the current registry. */
export function buildGlobalEducationSourceQueue(
  institutions?: InstitutionProfile[],
): EducationSourceDiscoveryTask[] {
  return buildGlobalEducationCoverageAudit(institutions)
    .filter((record) => record.localInstitutionCount === 0 || record.verifiedInstitutionCount < record.localInstitutionCount)
    .map(buildTask)
    .sort((a, b) => {
      const rank = { HIGH: 0, MEDIUM: 1, LOW: 2 } as const;
      return rank[a.priority] - rank[b.priority] || a.countryName.localeCompare(b.countryName);
    });
}
