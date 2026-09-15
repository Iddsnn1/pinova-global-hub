import type { InstitutionProfile, InstitutionType } from '../types/education';

const CANADA_DLI_CSV_URL = 'https://www.ircc.canada.ca/opendata-donneesouvertes/data/ODP-TR-Study-DLI_name_PT_Inst_type.csv';
const UK_HESA_CURRENT_PROVIDERS_CSV_URL = 'https://www.hesa.ac.uk/collection/provider-tools/all_hesa_providers?ProviderAllCurrentHESA.csv';

let canadaCache: { expiresAt: number; institutions: InstitutionProfile[] } | null = null;
let ukCache: { expiresAt: number; institutions: InstitutionProfile[] } | null = null;

type CsvRow = Record<string, string>;

function parseCsv(text: string): CsvRow[] {
  const rows: string[][] = [];
  let row: string[] = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i], next = text[i + 1];
    if (char === '"') {
      if (quoted && next === '"') { cell += '"'; i += 1; } else quoted = !quoted;
    } else if (char === ',' && !quoted) { row.push(cell.trim()); cell = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(cell.trim()); cell = ''; if (row.some(Boolean)) rows.push(row); row = [];
    } else cell += char;
  }
  if (cell || row.length) { row.push(cell.trim()); rows.push(row); }
  if (!rows.length) return [];
  const headers = rows[0].map((h) => h.replace(/^\uFEFF/, '').trim());
  return rows.slice(1).map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] || ''])));
}

function findValue(row: CsvRow, ...names: string[]): string {
  const entries = Object.entries(row);
  for (const name of names) {
    const exact = entries.find(([key]) => key.trim().toLowerCase() === name.toLowerCase());
    if (exact) return exact[1].trim();
    const loose = entries.find(([key]) => key.toLowerCase().includes(name.toLowerCase()));
    if (loose) return loose[1].trim();
  }
  return '';
}

function verifiedInstitution(params: {
  id: string; name: string; code: string; country: string; countryCode: string;
  state?: string; city?: string; website: string; authority: string; notes: string;
  isPublic?: boolean; institutionType?: InstitutionType; currency: string;
}): InstitutionProfile {
  const now = new Date().toISOString();
  return {
    id: params.id, name: params.name, legalName: params.name, tradingName: params.name,
    institutionCode: params.code, institutionType: params.institutionType || 'university', supportedTiers: ['tertiary'],
    country: params.country, countryCode: params.countryCode, state: params.state || '', city: params.city || '',
    address: '', contactEmail: '', contactPhone: '', website: params.website, logoUrl: '', isPublic: params.isPublic ?? false,
    curriculum: [`${params.country} postsecondary education — authoritative provider directory record`],
    instructionLanguage: params.countryCode === 'CA' ? ['English', 'French'] : ['English'],
    isBoarding: false, hasDayOption: true,
    accreditation: { authority: params.authority, registrationNumber: params.code, accreditationStatus: 'under_review', verifiedAt: now, officialNotes: params.notes },
    verificationStatus: 'VERIFIED_WITH_LIMITATIONS', verificationDate: now, acceptedCurrencies: [params.currency],
    supportsPiPayment: false, supportsInstallments: false, activeSessions: [], faculties: [], hierarchyVerificationStatus: 'PARTIALLY_VERIFIED',
    overviewDescription: params.notes,
  };
}

function mapCanadaType(rawType: string): InstitutionType {
  const type = rawType.toLowerCase();
  if (type.includes('university')) return 'university';
  if (type.includes('college') || type.includes('cegep')) return 'polytechnic';
  if (type.includes('vocational') || type.includes('career') || type.includes('language')) return 'vocational_institute';
  return 'technical_college';
}

function mapCanadaRow(row: CsvRow): InstitutionProfile | null {
  const name = findValue(row, 'DLI name', 'institution name', 'name');
  const province = findValue(row, 'P/T', 'province', 'territory');
  if (!name || !province) return null;
  const dliNumber = findValue(row, 'DLI number', 'DLI #', 'dli');
  const publicPrivate = findValue(row, 'Public/Private', 'public/private').toLowerCase();
  return verifiedInstitution({
    id: dliNumber ? `inst-ca-dli-${dliNumber}` : `inst-ca-dli-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`,
    name, code: dliNumber || name, country: 'Canada', countryCode: 'CA', state: province,
    website: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/prepare/designated-learning-institutions-list.html',
    authority: 'Government of Canada — Immigration, Refugees and Citizenship Canada (IRCC)', currency: 'CAD',
    isPublic: publicPrivate.includes('public') && !publicPrivate.includes('private'), institutionType: mapCanadaType(findValue(row, 'Institution Type', 'institution type', 'type')),
    notes: 'Institution is represented from the federal DLI dataset. Provincial/territorial accreditation and academic hierarchy are not inferred.'
  });
}

export async function loadCanadaDliInstitutions(): Promise<InstitutionProfile[]> {
  if (canadaCache && canadaCache.expiresAt > Date.now()) return canadaCache.institutions;
  const response = await fetch(CANADA_DLI_CSV_URL, { headers: { Accept: 'text/csv,text/plain;q=0.9,*/*;q=0.8' } });
  if (!response.ok) throw new Error(`Canada DLI HTTP ${response.status}`);
  const institutions = Array.from(new Map(parseCsv(await response.text()).map(mapCanadaRow).filter((x): x is InstitutionProfile => Boolean(x)).map((x) => [x.id, x])).values());
  if (!institutions.length) throw new Error('Canada DLI source returned no institution records');
  canadaCache = { expiresAt: Date.now() + 30 * 60 * 1000, institutions }; return institutions;
}

function mapUkRow(row: CsvRow): InstitutionProfile | null {
  const name = findValue(row, 'Provider Name', 'Published Name', 'Provider', 'Name');
  const ukprn = findValue(row, 'UKPRN', 'UK Provider Reference Number');
  const instid = findValue(row, 'INSTID', 'InstID', 'Institution ID');
  if (!name || (!ukprn && !instid)) return null;
  const countryCodeRaw = findValue(row, 'Country Code', 'Country');
  const country = /england/i.test(countryCodeRaw) ? 'England' : /scotland/i.test(countryCodeRaw) ? 'Scotland' : /wales/i.test(countryCodeRaw) ? 'Wales' : /northern ireland/i.test(countryCodeRaw) ? 'Northern Ireland' : 'United Kingdom';
  const id = ukprn ? `inst-gb-hesa-${ukprn}` : `inst-gb-hesa-${instid}`;
  const isCurrent = findValue(row, 'Current Provider', 'Current', 'Rescinded').toLowerCase();
  return verifiedInstitution({
    id, name, code: ukprn || instid, country, countryCode: 'GB',
    website: 'https://www.hesa.ac.uk/collection/provider-tools/all_hesa_providers',
    authority: 'HESA / UK Register of Learning Providers', currency: 'GBP', isPublic: true,
    institutionType: 'university',
    notes: `Current HESA provider record identified by ${ukprn ? `UKPRN ${ukprn}` : `INSTID ${instid}`}.${isCurrent ? ` Provider status field: ${isCurrent}.` : ''} Academic hierarchy and degree-awarding status are not inferred.`
  });
}

export async function loadUkHesaInstitutions(): Promise<InstitutionProfile[]> {
  if (ukCache && ukCache.expiresAt > Date.now()) return ukCache.institutions;
  const response = await fetch(UK_HESA_CURRENT_PROVIDERS_CSV_URL, { headers: { Accept: 'text/csv,text/plain;q=0.9,*/*;q=0.8' } });
  if (!response.ok) throw new Error(`HESA current providers HTTP ${response.status}`);
  const text = await response.text();
  const institutions = Array.from(new Map(parseCsv(text).map(mapUkRow).filter((x): x is InstitutionProfile => Boolean(x)).map((x) => [x.id, x])).values());
  if (!institutions.length) throw new Error('HESA current provider source returned no institution records');
  ukCache = { expiresAt: Date.now() + 30 * 60 * 1000, institutions }; return institutions;
}

export const GLOBAL_NATIONAL_ADAPTERS = {
  CA: loadCanadaDliInstitutions,
  GB: loadUkHesaInstitutions,
};
