/**
 * Authoritative education-source map.
 *
 * This file is deliberately a source registry, not an institution seed list.
 * A source may only be promoted to a live ingestion adapter after its
 * records, identifiers and licensing/usage conditions are verified.
 */

import type { EducationRegistrySourceKind } from './globalEducationRegistry';

export interface GlobalEducationAuthoritativeSource {
  countryCode: string;
  countryName: string;
  layer: 'HIGHER_EDUCATION' | 'PRIMARY_SECONDARY' | 'TECHNICAL_VOCATIONAL' | 'MULTI_LAYER';
  authorityName: string;
  sourceKind: EducationRegistrySourceKind;
  sourceUrl: string;
  sourceRole: string;
  machineReadable: boolean;
  ingestionStatus: 'LIVE_ADAPTER' | 'SOURCE_READY' | 'DISCOVERY_ONLY';
}

export const GLOBAL_EDUCATION_AUTHORITATIVE_SOURCES: GlobalEducationAuthoritativeSource[] = [
  {
    countryCode: 'US', countryName: 'United States', layer: 'HIGHER_EDUCATION',
    authorityName: 'U.S. Department of Education — National Center for Education Statistics (IPEDS)',
    sourceKind: 'NATIONAL_AUTHORITY', sourceUrl: 'https://nces.ed.gov/ipeds/',
    sourceRole: 'National postsecondary institution directory and identifiers', machineReadable: true, ingestionStatus: 'LIVE_ADAPTER',
  },
  {
    countryCode: 'CA', countryName: 'Canada', layer: 'HIGHER_EDUCATION',
    authorityName: 'Government of Canada — Immigration, Refugees and Citizenship Canada (IRCC)', sourceKind: 'NATIONAL_AUTHORITY',
    sourceUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/prepare/designated-learning-institutions-list.html',
    sourceRole: 'Federal designated postsecondary institution directory; DLI records are ingested from the official IRCC open-data feed', machineReadable: true, ingestionStatus: 'LIVE_ADAPTER',
  },
  {
    countryCode: 'GB', countryName: 'United Kingdom', layer: 'HIGHER_EDUCATION',
    authorityName: 'HESA / UK Register of Learning Providers / Office for Students',
    sourceKind: 'NATIONAL_AUTHORITY', sourceUrl: 'https://www.hesa.ac.uk/collection/provider-tools/',
    sourceRole: 'UK higher-education provider metadata and regulatory reference', machineReadable: true, ingestionStatus: 'SOURCE_READY',
  },
  {
    countryCode: 'AU', countryName: 'Australia', layer: 'HIGHER_EDUCATION',
    authorityName: 'Tertiary Education Quality and Standards Agency (TEQSA)',
    sourceKind: 'NATIONAL_AUTHORITY', sourceUrl: 'https://www.teqsa.gov.au/national-register',
    sourceRole: 'National Register of higher-education providers and registration status', machineReadable: false, ingestionStatus: 'SOURCE_READY',
  },
  {
    countryCode: 'IN', countryName: 'India', layer: 'HIGHER_EDUCATION',
    authorityName: 'Government of India — Ministry of Education / AISHE',
    sourceKind: 'NATIONAL_AUTHORITY', sourceUrl: 'https://www.education.gov.in/',
    sourceRole: 'National higher-education institutional and AISHE reference data', machineReadable: false, ingestionStatus: 'SOURCE_READY',
  },
  {
    countryCode: 'NG', countryName: 'Nigeria', layer: 'HIGHER_EDUCATION',
    authorityName: 'National Universities Commission (NUC)',
    sourceKind: 'NATIONAL_AUTHORITY', sourceUrl: 'https://enuc.nuc.edu.ng/nus',
    sourceRole: 'Verified Nigerian university system directory and approved programmes', machineReadable: false, ingestionStatus: 'SOURCE_READY',
  },
  {
    countryCode: 'KE', countryName: 'Kenya', layer: 'HIGHER_EDUCATION',
    authorityName: 'Commission for University Education (CUE)',
    sourceKind: 'NATIONAL_AUTHORITY', sourceUrl: 'https://www.cue.or.ke/',
    sourceRole: 'University status, accreditation and programme reference', machineReadable: false, ingestionStatus: 'SOURCE_READY',
  },
  {
    countryCode: 'GH', countryName: 'Ghana', layer: 'HIGHER_EDUCATION',
    authorityName: 'Ghana Tertiary Education Commission (GTEC)',
    sourceKind: 'NATIONAL_AUTHORITY', sourceUrl: 'https://gtec.edu.gh/',
    sourceRole: 'Tertiary institution recognition and quality-assurance reference', machineReadable: false, ingestionStatus: 'SOURCE_READY',
  },
  {
    countryCode: 'ZA', countryName: 'South Africa', layer: 'HIGHER_EDUCATION',
    authorityName: 'South Africa Department of Higher Education and Training (DHET)',
    sourceKind: 'NATIONAL_AUTHORITY', sourceUrl: 'https://www.dhet.gov.za/',
    sourceRole: 'National higher-education and training regulatory reference', machineReadable: false, ingestionStatus: 'SOURCE_READY',
  },
  {
    countryCode: 'GLOBAL', countryName: 'Global', layer: 'MULTI_LAYER',
    authorityName: 'UNESCO Institute for Statistics (UIS)',
    sourceKind: 'GLOBAL_REFERENCE', sourceUrl: 'https://www.uis.unesco.org/en/data',
    sourceRole: 'Cross-national education systems, country profiles and ISCED classification layer', machineReadable: true, ingestionStatus: 'SOURCE_READY',
  },
];

export function getAuthoritativeEducationSources(countryCode?: string): GlobalEducationAuthoritativeSource[] {
  if (!countryCode) return GLOBAL_EDUCATION_AUTHORITATIVE_SOURCES;
  const normalized = countryCode.toUpperCase();
  return GLOBAL_EDUCATION_AUTHORITATIVE_SOURCES.filter((source) => source.countryCode === normalized || source.countryCode === 'GLOBAL');
}
