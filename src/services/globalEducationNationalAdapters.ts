import type { InstitutionProfile, InstitutionType } from '../types/education';

const CANADA_DLI_CSV_URL = 'https://www.ircc.canada.ca/opendata-donneesouvertes/data/ODP-TR-Study-DLI_name_PT_Inst_type.csv';

let canadaCache: { expiresAt: number; institutions: InstitutionProfile[] } | null = null;

type CsvRow = Record<string, string>;

function parseCsv(text: string): CsvRow[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"') {
      if (quoted && next === '"') { cell += '"'; i += 1; }
      else quoted = !quoted;
    } else if (char === ',' && !quoted) {
      row.push(cell.trim()); cell = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(cell.trim()); cell = '';
      if (row.some(Boolean)) rows.push(row);
      row = [];
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
  const institutionTypeRaw = findValue(row, 'Institution Type', 'institution type', 'type');
  if (!name || !province) return null;
  const dliNumber = findValue(row, 'DLI number', 'DLI #', 'dli');
  const publicPrivate = findValue(row, 'Public/Private', 'public/private').toLowerCase();
  const isPublic = publicPrivate.includes('public') && !publicPrivate.includes('private');
  const stableId = dliNumber ? `inst-ca-dli-${dliNumber}` : `inst-ca-dli-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
  const now = new Date().toISOString();
  const institutionType = mapCanadaType(institutionTypeRaw);
  return {
    id: stableId,
    name,
    legalName: name,
    tradingName: name,
    institutionCode: dliNumber || stableId.replace('inst-ca-dli-', 'DLI-'),
    institutionType,
    supportedTiers: ['tertiary'],
    country: 'Canada',
    countryCode: 'CA',
    state: province,
    city: '',
    address: '',
    contactEmail: '',
    contactPhone: '',
    website: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/prepare/designated-learning-institutions-list.html',
    logoUrl: '',
    isPublic,
    curriculum: ['Canadian postsecondary education — IRCC DLI directory record'],
    instructionLanguage: ['English', 'French'],
    isBoarding: false,
    hasDayOption: true,
    accreditation: {
      authority: 'Government of Canada — Immigration, Refugees and Citizenship Canada (IRCC)',
      registrationNumber: dliNumber || undefined,
      accreditationStatus: 'under_review',
      verifiedAt: now,
      officialNotes: 'Institution is represented from the federal DLI dataset. Provincial/territorial accreditation and academic hierarchy are not inferred.'
    },
    verificationStatus: 'VERIFIED_WITH_LIMITATIONS',
    verificationDate: now,
    acceptedCurrencies: ['CAD'],
    supportsPiPayment: false,
    supportsInstallments: false,
    activeSessions: [],
    faculties: [],
    hierarchyVerificationStatus: 'PARTIALLY_VERIFIED',
    overviewDescription: 'Government of Canada DLI directory record. Faculties, departments, programmes and institutional accreditation require separate official verification.'
  };
}

export async function loadCanadaDliInstitutions(): Promise<InstitutionProfile[]> {
  if (canadaCache && canadaCache.expiresAt > Date.now()) return canadaCache.institutions;
  const response = await fetch(CANADA_DLI_CSV_URL, { headers: { Accept: 'text/csv,text/plain;q=0.9,*/*;q=0.8' } });
  if (!response.ok) throw new Error(`Canada DLI HTTP ${response.status}`);
  const text = await response.text();
  const institutions = Array.from(new Map(parseCsv(text).map(mapCanadaRow).filter((x): x is InstitutionProfile => Boolean(x)).map((x) => [x.id, x])).values());
  if (!institutions.length) throw new Error('Canada DLI source returned no institution records');
  canadaCache = { expiresAt: Date.now() + 30 * 60 * 1000, institutions };
  return institutions;
}

export const GLOBAL_NATIONAL_ADAPTERS = {
  CA: loadCanadaDliInstitutions,
};
