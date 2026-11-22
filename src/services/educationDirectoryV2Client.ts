import type { InstitutionProfile } from '../types/education';

export interface EducationDirectoryFilters {
  countryCode?: string;
  country?: string;
  state?: string;
  tier?: string;
  institutionType?: string;
  isPublic?: boolean;
  search?: string;
  verificationStatus?: string;
}

export interface EducationDirectoryPagination {
  limit?: number;
  offset?: number;
}

export interface EducationDirectoryPage {
  success: true;
  count: number;
  institutions: InstitutionProfile[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
    hasMore: boolean;
  };
}

export class EducationDirectoryV2Error extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = 'EducationDirectoryV2Error';
    this.status = status;
    this.code = code;
  }
}

/**
 * Reads one page from the additive Neon-backed directory contract.
 *
 * This client intentionally has no legacy/static fallback: callers must opt in
 * explicitly and handle disabled/unavailable responses without presenting a
 * partial page as a complete directory.
 */
export async function getInstitutionPage(
  filters: EducationDirectoryFilters = {},
  pagination: EducationDirectoryPagination = {}
): Promise<EducationDirectoryPage> {
  const params = new URLSearchParams();
  const limit = pagination.limit ?? 50;
  const offset = pagination.offset ?? 0;

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new EducationDirectoryV2Error('Directory page limit must be an integer from 1 to 100.', 400, 'INVALID_DIRECTORY_QUERY');
  }
  if (!Number.isInteger(offset) || offset < 0) {
    throw new EducationDirectoryV2Error('Directory page offset must be a non-negative integer.', 400, 'INVALID_DIRECTORY_QUERY');
  }

  params.set('limit', String(limit));
  params.set('offset', String(offset));

  for (const key of ['countryCode', 'country', 'state', 'tier', 'institutionType', 'search', 'verificationStatus'] as const) {
    const value = filters[key];
    if (value !== undefined && value.trim()) params.set(key, value.trim());
  }
  if (filters.isPublic !== undefined) params.set('isPublic', String(filters.isPublic));

  const response = await fetch(`/api/education/v2/institutions?${params.toString()}`);
  const payload = await response.json().catch(() => ({})) as Record<string, unknown>;

  if (!response.ok) {
    const code = typeof payload.error === 'string' ? payload.error : 'EDUCATION_DIRECTORY_UNAVAILABLE';
    const message = typeof payload.message === 'string' ? payload.message : 'The institution directory is temporarily unavailable.';
    throw new EducationDirectoryV2Error(message, response.status, code);
  }

  const page = payload as Partial<EducationDirectoryPage>;
  const meta = page.pagination;
  if (
    page.success !== true ||
    !Array.isArray(page.institutions) ||
    !meta ||
    !Number.isInteger(meta.limit) ||
    !Number.isInteger(meta.offset) ||
    !Number.isInteger(meta.total) ||
    typeof meta.hasMore !== 'boolean' ||
    typeof page.count !== 'number' ||
    page.count !== meta.total
  ) {
    throw new EducationDirectoryV2Error('The institution directory returned an invalid page response.', 502, 'EDUCATION_DIRECTORY_RESPONSE_INVALID');
  }

  const expectedHasMore = offset + page.institutions.length < meta.total;
  if (
    page.institutions.length > limit ||
    meta.limit !== limit ||
    meta.offset !== offset ||
    meta.total < 0 ||
    meta.hasMore !== expectedHasMore
  ) {
    throw new EducationDirectoryV2Error('The institution directory returned inconsistent pagination metadata.', 502, 'EDUCATION_DIRECTORY_RESPONSE_INVALID');
  }

  return page as EducationDirectoryPage;
}
