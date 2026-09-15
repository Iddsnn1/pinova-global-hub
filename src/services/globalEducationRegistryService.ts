import type { InstitutionProfile } from '../types/education';
import { educationService } from './educationService';
import { buildGlobalEducationCoverageAudit, getGlobalEducationCoverageGaps, getGlobalEducationPartialCoverage, getGlobalEducationCoverageSummary, mapInstitutionVerificationStatus } from '../data/globalEducationCoverageEngine';
import { buildGlobalEducationSourceQueue } from '../data/globalEducationSourceQueue';
import { GLOBAL_EDUCATION_REGISTRY_POLICY } from '../data/globalEducationRegistry';
import { loadCanadaDliInstitutions } from './globalEducationNationalAdapters';

const NCES_IPEDS_ENDPOINT = 'https://nces.ed.gov/arcgis/rest/services/IPEDS/IPEDS/MapServer/0/query';
const US_STATE_CODES = new Set('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY DC'.split(' '));
let ncesCache: { expiresAt: number; institutions: InstitutionProfile[] } | null = null;
type NcesRow = { UnitID?: number; INSTNM?: string; ADDR?: string; CITY?: string; STABBR?: string; WEBADDR?: string; CONTROL?: number; ICLEVEL?: number };

function mapNcesInstitution(row: NcesRow): InstitutionProfile | null {
  const unitId = Number(row.UnitID || 0), name = String(row.INSTNM || '').trim(), state = String(row.STABBR || '').toUpperCase();
  if (!unitId || !name || !US_STATE_CODES.has(state)) return null;
  const now = new Date().toISOString(), website = String(row.WEBADDR || '').trim();
  const institutionType: InstitutionProfile['institutionType'] = row.ICLEVEL === 1 ? 'university' : row.ICLEVEL === 2 ? 'polytechnic' : 'vocational_institute';
  return {
    id: `inst-us-ipeds-${unitId}`, name, legalName: name, tradingName: name, institutionCode: `IPEDS-${unitId}`,
    institutionType, supportedTiers: ['tertiary'], country: 'United States', countryCode: 'US', state,
    city: String(row.CITY || '').trim(), address: String(row.ADDR || '').trim(), contactEmail: '', contactPhone: '',
    website: website ? (website.startsWith('http') ? website : `https://${website}`) : `https://nces.ed.gov/collegenavigator/?id=${unitId}`,
    logoUrl: '', isPublic: Number(row.CONTROL) === 1,
    curriculum: ['U.S. postsecondary education — NCES IPEDS directory record'], instructionLanguage: ['English'],
    isBoarding: false, hasDayOption: true,
    accreditation: { authority: 'U.S. Department of Education — NCES IPEDS', registrationNumber: String(unitId), accreditationStatus: 'under_review', verifiedAt: now, officialNotes: 'Institution identity is verified against the NCES IPEDS directory. Academic hierarchy and accreditation are not inferred.' },
    verificationStatus: 'VERIFIED_WITH_LIMITATIONS', verificationDate: now, acceptedCurrencies: ['USD'], supportsPiPayment: false, supportsInstallments: false,
    activeSessions: [], faculties: [], hierarchyVerificationStatus: 'PARTIALLY_VERIFIED',
    overviewDescription: 'NCES IPEDS directory record. Faculties, departments, programmes and accreditation require separate official verification.'
  };
}

async function loadNcesUsInstitutions(): Promise<InstitutionProfile[]> {
  if (ncesCache && ncesCache.expiresAt > Date.now()) return ncesCache.institutions;
  const rows: NcesRow[] = [];
  for (let offset = 0; offset < 10000; offset += 1000) {
    const params = new URLSearchParams({ where: '1=1', outFields: 'UnitID,INSTNM,ADDR,CITY,STABBR,WEBADDR,CONTROL,ICLEVEL', returnGeometry: 'false', resultRecordCount: '1000', resultOffset: String(offset), orderByFields: 'INSTNM ASC', f: 'json' });
    const response = await fetch(`${NCES_IPEDS_ENDPOINT}?${params.toString()}`);
    if (!response.ok) throw new Error(`NCES IPEDS HTTP ${response.status}`);
    const payload = await response.json() as { features?: Array<{ attributes?: NcesRow }>; exceededTransferLimit?: boolean };
    const page = (payload.features || []).map((feature) => feature.attributes || {}); rows.push(...page);
    if (page.length < 1000 && !payload.exceededTransferLimit) break;
    if (!page.length) break;
  }
  const institutions = Array.from(new Map(rows.map(mapNcesInstitution).filter((x): x is InstitutionProfile => Boolean(x)).map((x) => [x.id, x])).values());
  ncesCache = { expiresAt: Date.now() + 15 * 60 * 1000, institutions }; return institutions;
}

function applyDirectoryFilters(institutions: InstitutionProfile[], filter: Parameters<typeof educationService.getInstitutions>[0]): InstitutionProfile[] {
  let merged = institutions;
  if (filter?.state && filter.state !== 'all') merged = merged.filter((item) => item.state?.toUpperCase() === String(filter.state).toUpperCase());
  if (filter?.institutionType && filter.institutionType !== 'all') merged = merged.filter((item) => item.institutionType === filter.institutionType);
  if (filter?.isPublic !== undefined) merged = merged.filter((item) => item.isPublic === filter.isPublic);
  if (filter?.search) { const q = filter.search.toLowerCase(); merged = merged.filter((item) => `${item.name} ${item.city} ${item.state}`.toLowerCase().includes(q)); }
  return merged;
}

const originalGetInstitutions = educationService.getInstitutions.bind(educationService);
educationService.getInstitutions = async (filter) => {
  const country = String(filter?.countryCode || filter?.country || '').toUpperCase();
  const adapter = country === 'US' || country === 'USA' || country === 'UNITED STATES'
    ? loadNcesUsInstitutions
    : country === 'CA' || country === 'CAN' || country === 'CANADA'
      ? loadCanadaDliInstitutions
      : null;
  if (!adapter) return originalGetInstitutions(filter);
  try {
    const local = await originalGetInstitutions(filter);
    const remote = await adapter();
    const merged = [...local, ...remote.filter((item) => !local.some((existing) => existing.id === item.id))];
    return applyDirectoryFilters(merged, filter);
  } catch (error) {
    console.warn(`[Global Education Registry] authoritative ${country} adapter unavailable; retaining existing directory:`, error);
    return originalGetInstitutions(filter);
  }
};

export const globalEducationRegistryService = {
  getPolicy() { return GLOBAL_EDUCATION_REGISTRY_POLICY; },
  getCoverageAudit(institutions?: InstitutionProfile[]) { return buildGlobalEducationCoverageAudit(institutions); },
  getCoverageGaps(institutions?: InstitutionProfile[]) { return getGlobalEducationCoverageGaps(institutions); },
  getPartialCoverage(institutions?: InstitutionProfile[]) { return getGlobalEducationPartialCoverage(institutions); },
  getCoverageSummary(institutions?: InstitutionProfile[]) { return getGlobalEducationCoverageSummary(institutions); },
  getSourceQueue(institutions?: InstitutionProfile[]) { return buildGlobalEducationSourceQueue(institutions); },
  mapVerificationStatus(status?: string) { return mapInstitutionVerificationStatus(status); },
  async getDirectorySnapshot(filter?: Parameters<typeof educationService.getInstitutions>[0]) {
    const institutions = await educationService.getInstitutions(filter);
    return { institutions, coverage: buildGlobalEducationCoverageAudit(institutions), gaps: getGlobalEducationCoverageGaps(institutions), partialCoverage: getGlobalEducationPartialCoverage(institutions), summary: getGlobalEducationCoverageSummary(institutions), sourceQueue: buildGlobalEducationSourceQueue(institutions) };
  },
};
export type GlobalEducationRegistryService = typeof globalEducationRegistryService;
