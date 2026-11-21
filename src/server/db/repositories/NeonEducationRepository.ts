import { getNeonSql } from '../NeonDatabase';
import type {
  InstitutionProfile,
  StudentIdentity,
  EducationInvoice,
  AdmissionApplication
} from '../../../types/education';

type Sql = ReturnType<typeof getNeonSql>;
type QueryResult = Awaited<ReturnType<Sql>>;
type JsonRow = { data: unknown };

/**
 * Async, Neon-backed Education read repository.
 * No StorageEngine/file fallback: callers explicitly adopt these async methods.
 * The legacy synchronous EducationRepository remains unchanged during migration.
 */
export class NeonEducationRepository {
  private readonly sql: Sql;

  constructor(sql: Sql = getNeonSql()) {
    this.sql = sql;
  }

  /**
   * Neon exposes row arrays in its default mode, while its public result type
   * also permits FullQueryResults. Normalize both shapes at this boundary.
   */
  private toRows<T>(result: QueryResult): T[] {
    if (Array.isArray(result)) return result as T[];
    if (
      result &&
      typeof result === 'object' &&
      'rows' in result &&
      Array.isArray(result.rows)
    ) {
      return result.rows as T[];
    }
    throw new Error('EDUCATION_NEON_QUERY_RESULT_INVALID');
  }

  public async assertSchemaReady(): Promise<void> {
    const rows = this.toRows<{
      institutions: string | null;
      students: string | null;
      invoices: string | null;
      admissions: string | null;
    }>(await this.sql`
      SELECT
        to_regclass('public.education_institutions') AS institutions,
        to_regclass('public.education_students') AS students,
        to_regclass('public.education_invoices') AS invoices,
        to_regclass('public.education_admissions') AS admissions
    `);
    const row = rows[0];
    if (!row?.institutions || !row?.students || !row?.invoices || !row?.admissions) {
      throw new Error('EDUCATION_NEON_SCHEMA_NOT_READY');
    }
  }

  private decode<T>(row: JsonRow | undefined): T | null {
    if (!row) return null;
    const value = row.data;
    if (typeof value === 'string') return JSON.parse(value) as T;
    if (value && typeof value === 'object') return value as T;
    throw new Error('EDUCATION_NEON_ROW_DATA_INVALID');
  }

  public async listInstitutions(filter: {
    countryCode?: string;
    state?: string;
    tier?: string;
    institutionType?: string;
    isPublic?: boolean;
    verificationStatus?: string;
    search?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<InstitutionProfile[]> {
    const limit = Math.min(100, Math.max(1, Math.trunc(filter.limit ?? 50)));
    const offset = Math.max(0, Math.trunc(filter.offset ?? 0));
    const countryCode = filter.countryCode?.trim().toUpperCase() || null;
    const state = filter.state?.trim() || null;
    const tier = filter.tier?.trim() && filter.tier !== 'all' ? filter.tier.trim() : null;
    const institutionType = filter.institutionType?.trim() && filter.institutionType !== 'all'
      ? filter.institutionType.trim()
      : null;
    const isPublic = filter.isPublic === undefined ? null : String(filter.isPublic);
    const verificationStatus = filter.verificationStatus?.trim() && filter.verificationStatus !== 'ALL'
      ? filter.verificationStatus.trim()
      : null;
    const search = filter.search?.trim() || null;

    const rows = this.toRows<JsonRow>(await this.sql`
      SELECT data
      FROM education_institutions
      WHERE (${countryCode}::text IS NULL OR upper(country_code) = ${countryCode})
        AND (${state}::text IS NULL OR lower(data->>'state') = lower(${state}))
        AND (${tier}::text IS NULL OR COALESCE(data->'supportedTiers', '[]'::jsonb) ? ${tier})
        AND (${institutionType}::text IS NULL OR institution_type = ${institutionType})
        AND (${isPublic}::text IS NULL OR lower(data->>'isPublic') = lower(${isPublic}))
        AND (${verificationStatus}::text IS NULL OR verification_status = ${verificationStatus})
        AND (
          ${search}::text IS NULL
          OR data->>'name' ILIKE '%' || ${search} || '%'
          OR data->>'legalName' ILIKE '%' || ${search} || '%'
          OR data->>'institutionCode' ILIKE '%' || ${search} || '%'
          OR data->>'city' ILIKE '%' || ${search} || '%'
        )
      ORDER BY data->>'name' ASC, id ASC
      LIMIT ${limit} OFFSET ${offset}
    `);
    return rows.map((row) => this.decode<InstitutionProfile>(row)).filter((item): item is InstitutionProfile => item !== null);
  }

  public async getInstitutionById(id: string): Promise<InstitutionProfile | null> {
    const key = id.trim();
    if (!key) return null;
    const rows = this.toRows<JsonRow>(await this.sql`
      SELECT data FROM education_institutions WHERE id = ${key} LIMIT 1
    `);
    return this.decode<InstitutionProfile>(rows[0]);
  }

  /**
   * Admission lookup must be scoped to either the owning institution or the
   * authenticated applicant. An ID alone is never sufficient for a tenant read.
   */
  public async getAdmissionById(
    id: string,
    scope: { institutionId?: string; applicantEmail?: string }
  ): Promise<AdmissionApplication | null> {
    const key = id.trim();
    const institutionId = scope.institutionId?.trim() || null;
    const applicantEmail = scope.applicantEmail?.trim().toLowerCase() || null;
    // Do not combine tenant and applicant scopes: the OR predicate would
    // widen access beyond either caller's intended authorization boundary.
    if (!key || Boolean(institutionId) === Boolean(applicantEmail)) return null;
    const rows = this.toRows<JsonRow>(await this.sql`
      SELECT data FROM education_admissions
      WHERE id = ${key}
        AND (
          (${institutionId}::text IS NOT NULL AND institution_id = ${institutionId})
          OR
          (${applicantEmail}::text IS NOT NULL AND lower(applicant_email) = ${applicantEmail})
        )
      LIMIT 1
    `);
    return this.decode<AdmissionApplication>(rows[0]);
  }

  /** Student lookup is institution-scoped to prevent cross-school IDOR. */
  public async getStudentById(id: string, institutionId: string): Promise<StudentIdentity | null> {
    const key = id.trim();
    const tenant = institutionId.trim();
    if (!key || !tenant) return null;
    const rows = this.toRows<JsonRow>(await this.sql`
      SELECT data FROM education_students
      WHERE id = ${key} AND institution_id = ${tenant}
      LIMIT 1
    `);
    return this.decode<StudentIdentity>(rows[0]);
  }

  /** Invoice lookup requires institution scope derived from authenticated identity. */
  public async getInvoiceById(id: string, institutionId: string): Promise<EducationInvoice | null> {
    const key = id.trim();
    const tenant = institutionId.trim();
    if (!key || !tenant) return null;
    const rows = this.toRows<JsonRow>(await this.sql`
      SELECT data FROM education_invoices
      WHERE id = ${key} AND institution_id = ${tenant}
      LIMIT 1
    `);
    return this.decode<EducationInvoice>(rows[0]);
  }

  public async listInvoices(filter: {
    institutionId: string;
    studentId?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<EducationInvoice[]> {
    const institutionId = filter.institutionId.trim();
    if (!institutionId) throw new Error('EDUCATION_INSTITUTION_SCOPE_REQUIRED');
    const studentId = filter.studentId?.trim() || null;
    const status = filter.status?.trim() || null;
    const limit = Math.min(100, Math.max(1, Math.trunc(filter.limit ?? 50)));
    const offset = Math.max(0, Math.trunc(filter.offset ?? 0));
    const rows = this.toRows<JsonRow>(await this.sql`
      SELECT data FROM education_invoices
      WHERE institution_id = ${institutionId}
        AND (${studentId}::text IS NULL OR student_id = ${studentId})
        AND (${status}::text IS NULL OR ${status} = 'ALL' OR status = ${status})
      ORDER BY created_at DESC, id DESC
      LIMIT ${limit} OFFSET ${offset}
    `);
    return rows.map((row) => this.decode<EducationInvoice>(row)).filter((item): item is EducationInvoice => item !== null);
  }

  public async listAdmissions(filter: {
    institutionId: string;
    status?: string;
    applicantEmail?: string;
    limit?: number;
    offset?: number;
  }): Promise<AdmissionApplication[]> {
    const institutionId = filter.institutionId.trim();
    if (!institutionId) throw new Error('EDUCATION_INSTITUTION_SCOPE_REQUIRED');
    const status = filter.status?.trim() || null;
    const applicantEmail = filter.applicantEmail?.trim().toLowerCase() || null;
    const limit = Math.min(100, Math.max(1, Math.trunc(filter.limit ?? 50)));
    const offset = Math.max(0, Math.trunc(filter.offset ?? 0));
    const rows = this.toRows<JsonRow>(await this.sql`
      SELECT data FROM education_admissions
      WHERE institution_id = ${institutionId}
        AND (${status}::text IS NULL OR ${status} = 'ALL' OR status = ${status})
        AND (${applicantEmail}::text IS NULL OR lower(applicant_email) = ${applicantEmail})
      ORDER BY created_at DESC, id DESC
      LIMIT ${limit} OFFSET ${offset}
    `);
    return rows.map((row) => this.decode<AdmissionApplication>(row)).filter((item): item is AdmissionApplication => item !== null);
  }
}
