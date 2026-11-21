import type { Request, Response, RequestHandler } from 'express';

export interface EducationDirectoryRepository {
  assertSchemaReady(): Promise<void>;
  listInstitutions(filter: EducationDirectoryFilters & { limit: number; offset: number }): Promise<unknown[]>;
  countInstitutions(filter: EducationDirectoryFilters): Promise<number>;
}

export interface EducationDirectoryFilters {
  countryCode?: string;
  state?: string;
  tier?: string;
  institutionType?: string;
  isPublic?: boolean;
  search?: string;
  verificationStatus?: string;
}

const MAX_SEARCH_LENGTH = 120;
const MAX_FILTER_LENGTH = 100;

function queryString(value: unknown, name: string, maxLength = MAX_FILTER_LENGTH): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'string') throw new Error(`INVALID_${name.toUpperCase()}`);
  const normalized = value.trim();
  if (!normalized) return undefined;
  if (normalized.length > maxLength) throw new Error(`INVALID_${name.toUpperCase()}`);
  return normalized;
}

function paginationInteger(value: unknown, name: string, fallback: number, min: number, max?: number): number {
  if (value === undefined) return fallback;
  if (typeof value !== 'string' || !/^(0|[1-9]\d*)$/.test(value)) {
    throw new Error('INVALID_DIRECTORY_QUERY');
  }
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < min || (max !== undefined && parsed > max)) {
    throw new Error('INVALID_DIRECTORY_QUERY');
  }
  return parsed;
}

export function createEducationDirectoryV2Handler(
  getRepository: () => EducationDirectoryRepository,
  enabled: () => boolean
): RequestHandler {
  return async (req: Request, res: Response) => {
    if (!enabled()) {
      res.status(503).json({ success: false, error: 'EDUCATION_DIRECTORY_V2_DISABLED' });
      return;
    }

    try {
      const limit = paginationInteger(req.query.limit, 'limit', 50, 1, 100);
      const offset = paginationInteger(req.query.offset, 'offset', 0, 0);
      const countryCode = queryString(req.query.countryCode ?? req.query.country, 'countryCode');
      const state = queryString(req.query.state, 'state');
      const tier = queryString(req.query.tier, 'tier');
      const institutionType = queryString(req.query.institutionType, 'institutionType');
      const search = queryString(req.query.search, 'search', MAX_SEARCH_LENGTH);
      const verificationStatus = queryString(req.query.verificationStatus, 'verificationStatus');

      let isPublic: boolean | undefined;
      if (req.query.isPublic !== undefined) {
        if (req.query.isPublic === 'true') isPublic = true;
        else if (req.query.isPublic === 'false') isPublic = false;
        else throw new Error('INVALID_DIRECTORY_QUERY');
      }

      const filters: EducationDirectoryFilters = {
        countryCode,
        state,
        tier,
        institutionType,
        isPublic,
        search,
        verificationStatus
      };

      const repository = getRepository();
      await repository.assertSchemaReady();
      const [institutions, total] = await Promise.all([
        repository.listInstitutions({ ...filters, limit, offset }),
        repository.countInstitutions(filters)
      ]);

      if (!Number.isSafeInteger(total) || total < 0) {
        throw new Error('EDUCATION_DIRECTORY_COUNT_INVALID');
      }

      res.status(200).json({
        success: true,
        count: total,
        institutions,
        pagination: {
          limit,
          offset,
          total,
          hasMore: offset + institutions.length < total
        }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      if (message.startsWith('INVALID_')) {
        res.status(400).json({ success: false, error: 'INVALID_DIRECTORY_QUERY' });
        return;
      }
      if (message === 'EDUCATION_NEON_SCHEMA_NOT_READY') {
        res.status(503).json({ success: false, error: 'EDUCATION_DIRECTORY_SCHEMA_NOT_READY' });
        return;
      }
      console.error('[Education Directory v2] Durable directory query failed:', message);
      res.status(503).json({ success: false, error: 'EDUCATION_DIRECTORY_UNAVAILABLE' });
    }
  };
}
