import crypto from 'crypto';
import type {
  InstitutionProfile,
  StudentIdentity,
  GuardianChildSummary,
  AdmissionApplication,
  AdmissionApplicationStatus,
  ScholarshipOpportunity
} from '../../types/education';
import { getNeonSql, neonDatabaseEnabled } from '../db/NeonDatabase';
import { normalizeCountryCode, matchesSubdivision } from '../../data/countrySubdivisions';

type DbRow = Record<string, any>;
const clean = (value: unknown) => String(value ?? '').trim();
const decode = <T>(value: unknown): T => typeof value === 'string' ? JSON.parse(value) as T : value as T;

/**
 * Neon-backed Education core records.
 * This repository is intentionally additive and is not yet wired into legacy
 * synchronous routes. Route cutover must happen only after a verified,
 * idempotent import of the legacy dataset and endpoint-by-endpoint tests.
 */
export class DurableEducationCoreStore {
  private assertReady(): void {
    if (!neonDatabaseEnabled()) throw new Error('DURABLE_EDUCATION_STORAGE_UNAVAILABLE');
  }

  async getInstitutions(filter?: { countryCode?: string; country?: string; state?: string; tier?: string; institutionType?: string; isPublic?: boolean; verificationStatus?: string; search?: string }): Promise<InstitutionProfile[]> {
    this.assertReady();
    const sql = getNeonSql();
    const rawCountry = filter?.countryCode || filter?.country;
    const normalizedCountry = rawCountry ? normalizeCountryCode(rawCountry) : undefined;
    const country = normalizedCountry && normalizedCountry !== 'ALL' && normalizedCountry !== 'GLOBAL' ? normalizedCountry.toUpperCase() : null;
    const rawType = clean(filter?.institutionType);
    const rawStatus = clean(filter?.verificationStatus);
    // Match the legacy directory's "all" sentinels: they mean no filter.
    const type = rawType && rawType.toLowerCase() !== 'all' ? rawType : null;
    const status = rawStatus && rawStatus.toUpperCase() !== 'ALL' ? rawStatus : null;
    const rows = await sql`SELECT data FROM education_institutions
      WHERE (${country}::text IS NULL OR country_code = ${country})
        AND (${type}::text IS NULL OR institution_type = ${type})
        AND (${status}::text IS NULL OR verification_status = ${status})
      ORDER BY created_at DESC` as unknown as DbRow[];
    let institutions = rows.map(row => decode<InstitutionProfile>(row.data));
    if (filter?.state && filter.state !== 'all') {
      institutions = institutions.filter(item => matchesSubdivision(item.countryCode, item.state, filter.state!));
    }
    if (filter?.tier && filter.tier !== 'all') {
      institutions = institutions.filter(item => Array.isArray(item.supportedTiers) && item.supportedTiers.includes(filter.tier as any));
    }
    if (filter?.isPublic !== undefined) {
      institutions = institutions.filter(item => item.isPublic === filter.isPublic);
    }
    if (filter?.search?.trim()) {
      const query = filter.search.trim().toLowerCase();
      institutions = institutions.filter(item =>
        [item.name, item.institutionCode, item.city, item.state, item.legalName]
          .some(value => String(value || '').toLowerCase().includes(query))
      );
    }
    return institutions;
  }

  async getInstitutionById(id: string): Promise<InstitutionProfile | null> {
    this.assertReady();
    const key = clean(id);
    if (!key) return null;
    const sql = getNeonSql();
    const rows = await sql`SELECT data FROM education_institutions WHERE id = ${key} LIMIT 1` as unknown as DbRow[];
    return rows.length ? decode<InstitutionProfile>(rows[0].data) : null;
  }

  async createInstitution(record: InstitutionProfile): Promise<InstitutionProfile> {
    this.assertReady();
    const id = clean(record?.id);
    if (!id || !clean(record.countryCode) || !clean(record.institutionType)) throw new Error('EDUCATION_INSTITUTION_FIELDS_REQUIRED');
    const sql = getNeonSql();
    const rows = await sql`INSERT INTO education_institutions
      (id, country_code, institution_type, verification_status, data)
      VALUES (${id}, ${clean(record.countryCode).toUpperCase()}, ${clean(record.institutionType)},
        ${clean(record.verificationStatus)}, ${JSON.stringify(record)}::jsonb)
      ON CONFLICT (id) DO NOTHING RETURNING data` as unknown as DbRow[];
    if (!rows.length) throw new Error('EDUCATION_INSTITUTION_ALREADY_EXISTS');
    return decode<InstitutionProfile>(rows[0].data);
  }

  async getStudentById(id: string): Promise<StudentIdentity | null> {
    this.assertReady();
    const key = clean(id);
    if (!key) return null;
    const sql = getNeonSql();
    const rows = await sql`SELECT data FROM education_students WHERE id = ${key} LIMIT 1` as unknown as DbRow[];
    return rows.length ? decode<StudentIdentity>(rows[0].data) : null;
  }

  async getStudentsByGuardian(guardianId: string): Promise<StudentIdentity[]> {
    this.assertReady();
    const guardian = clean(guardianId);
    if (!guardian) return [];
    const sql = getNeonSql();
    const rows = await sql`SELECT data FROM education_students WHERE guardian_id = ${guardian} ORDER BY created_at DESC` as unknown as DbRow[];
    return rows.map(row => decode<StudentIdentity>(row.data));
  }

  async createStudent(record: StudentIdentity): Promise<StudentIdentity> {
    this.assertReady();
    const id = clean(record?.id);
    if (!id || !clean(record.currentInstitutionId) || !clean(record.status)) throw new Error('EDUCATION_STUDENT_FIELDS_REQUIRED');
    const sql = getNeonSql();
    const rows = await sql`INSERT INTO education_students
      (id, institution_id, guardian_id, status, data)
      VALUES (${id}, ${clean(record.currentInstitutionId)}, ${clean(record.guardianId) || null},
        ${clean(record.status)}, ${JSON.stringify(record)}::jsonb)
      ON CONFLICT (id) DO NOTHING RETURNING data` as unknown as DbRow[];
    if (!rows.length) throw new Error('EDUCATION_STUDENT_ALREADY_EXISTS');
    return decode<StudentIdentity>(rows[0].data);
  }

  async getGuardianChildren(guardianId: string): Promise<GuardianChildSummary[]> {
    this.assertReady();
    const guardian = clean(guardianId);
    if (!guardian) return [];
    const sql = getNeonSql();
    const rows = await sql`SELECT data FROM education_guardian_children WHERE guardian_id = ${guardian} ORDER BY updated_at DESC` as unknown as DbRow[];
    return rows.map(row => decode<GuardianChildSummary>(row.data));
  }

  async saveGuardianChildSummary(record: GuardianChildSummary): Promise<GuardianChildSummary> {
    this.assertReady();
    const studentId = clean(record?.studentId);
    const guardianId = clean(record?.guardianId);
    const institutionId = clean(record?.institutionId);
    if (!studentId || !guardianId || !institutionId) throw new Error('EDUCATION_GUARDIAN_CHILD_FIELDS_REQUIRED');
    const sql = getNeonSql();
    const rows = await sql`INSERT INTO education_guardian_children
      (student_id, guardian_id, institution_id, data, updated_at)
      VALUES (${studentId}, ${guardianId}, ${institutionId}, ${JSON.stringify(record)}::jsonb, NOW())
      ON CONFLICT (student_id) DO UPDATE SET
        guardian_id = EXCLUDED.guardian_id,
        institution_id = EXCLUDED.institution_id,
        data = EXCLUDED.data,
        updated_at = NOW()
      RETURNING data` as unknown as DbRow[];
    return decode<GuardianChildSummary>(rows[0].data);
  }

  async getAdmissions(filter?: { institutionId?: string; status?: AdmissionApplicationStatus; applicantEmail?: string }): Promise<AdmissionApplication[]> {
    this.assertReady();
    const sql = getNeonSql();
    const institution = clean(filter?.institutionId) || null;
    const rawStatus = clean(filter?.status);
    // Match the legacy repository's ALL sentinel: it means no status filter.
    const status = rawStatus && rawStatus.toUpperCase() !== 'ALL' ? rawStatus : null;
    const email = clean(filter?.applicantEmail).toLowerCase() || null;
    const rows = await sql`SELECT data FROM education_admissions
      WHERE (${institution}::text IS NULL OR institution_id = ${institution})
        AND (${status}::text IS NULL OR status = ${status})
        AND (${email}::text IS NULL OR lower(applicant_email) = ${email})
      ORDER BY created_at DESC` as unknown as DbRow[];
    return rows.map(row => decode<AdmissionApplication>(row.data));
  }

  async getAdmissionById(id: string): Promise<AdmissionApplication | null> {
    this.assertReady();
    const key = clean(id);
    if (!key) return null;
    const sql = getNeonSql();
    const rows = await sql`SELECT data FROM education_admissions WHERE id = ${key} LIMIT 1` as unknown as DbRow[];
    return rows.length ? decode<AdmissionApplication>(rows[0].data) : null;
  }

  async createAdmission(record: AdmissionApplication): Promise<AdmissionApplication> {
    this.assertReady();
    const id = clean(record?.id);
    const institutionId = clean(record.institutionId);
    const applicantEmail = clean(record.applicantEmail).toLowerCase();
    if (!id || !institutionId || !applicantEmail) throw new Error('EDUCATION_ADMISSION_FIELDS_REQUIRED');
    const sql = getNeonSql();
    const rows = await sql`INSERT INTO education_admissions
      (id, institution_id, status, applicant_email, data)
      VALUES (${id}, ${institutionId}, ${clean(record.status)}, ${applicantEmail}, ${JSON.stringify(record)}::jsonb)
      ON CONFLICT (id) DO NOTHING RETURNING data` as unknown as DbRow[];
    if (!rows.length) throw new Error('EDUCATION_ADMISSION_ALREADY_EXISTS');
    return decode<AdmissionApplication>(rows[0].data);
  }

  async updateAdmissionStatus(id: string, status: AdmissionApplicationStatus, updated: AdmissionApplication): Promise<AdmissionApplication | null> {
    this.assertReady();
    const key = clean(id);
    if (!key || clean(updated.id) !== key || clean(updated.status) !== clean(status)) throw new Error('EDUCATION_ADMISSION_UPDATE_BINDING_MISMATCH');
    const sql = getNeonSql();
    const rows = await sql`UPDATE education_admissions
      SET status = ${clean(status)}, data = ${JSON.stringify(updated)}::jsonb, updated_at = NOW()
      WHERE id = ${key} RETURNING data` as unknown as DbRow[];
    return rows.length ? decode<AdmissionApplication>(rows[0].data) : null;
  }

  /**
   * Atomically transition an admission only from the caller's observed state.
   * The status update and audit event are committed in the same SQL statement,
   * preventing concurrent reviewers from silently overwriting one another.
   */
  async transitionAdmissionStatus(
    id: string,
    expectedStatus: AdmissionApplicationStatus,
    targetStatus: AdmissionApplicationStatus,
    updated: AdmissionApplication,
    actorUsername: string,
    notes = ''
  ): Promise<AdmissionApplication | null> {
    this.assertReady();
    const key = clean(id);
    const actor = clean(actorUsername);
    const expected = clean(expectedStatus);
    const target = clean(targetStatus);
    if (!key || clean(updated.id) !== key || clean(updated.status) !== target || !actor) {
      throw new Error('EDUCATION_ADMISSION_TRANSITION_BINDING_MISMATCH');
    }

    const allowed: Record<string, string[]> = {
      DRAFT: ['SUBMITTED', 'WITHDRAWN'],
      SUBMITTED: ['UNDER_REVIEW', 'REJECTED', 'WITHDRAWN'],
      UNDER_REVIEW: ['DOCUMENTS_REQUIRED', 'ADDITIONAL_INFO_REQUIRED', 'ACCEPTED', 'OFFERED', 'OFFER_ISSUED', 'REJECTED', 'WITHDRAWN'],
      DOCUMENTS_REQUIRED: ['UNDER_REVIEW', 'WITHDRAWN', 'EXPIRED'],
      ADDITIONAL_INFO_REQUIRED: ['UNDER_REVIEW', 'WITHDRAWN', 'EXPIRED'],
      OFFERED: ['ACCEPTED', 'OFFER_ACCEPTED', 'REJECTED', 'WITHDRAWN', 'EXPIRED'],
      OFFER_ISSUED: ['ACCEPTED', 'OFFER_ACCEPTED', 'REJECTED', 'WITHDRAWN', 'EXPIRED'],
      ACCEPTED: ['OFFER_ISSUED', 'OFFER_ACCEPTED', 'ENROLLED', 'WITHDRAWN'],
      OFFER_ACCEPTED: ['ENROLLED', 'REGISTRATION_COMPLETED', 'WITHDRAWN'],
      REGISTRATION_COMPLETED: ['ENROLLED'],
      ENROLLED: [],
      REJECTED: [],
      WITHDRAWN: [],
      EXPIRED: []
    };
    if (!(allowed[expected] || []).includes(target)) {
      throw new Error('EDUCATION_ADMISSION_ILLEGAL_STATUS_TRANSITION');
    }

    const timestamp = new Date().toISOString();
    const auditId = `AUD-EDU-${crypto.randomUUID()}`;
    const auditHash = crypto.createHash('sha256')
      .update([auditId, key, expected, target, actor, timestamp, clean(notes)].join('|'))
      .digest('hex');
    const auditRecord = {
      id: auditId,
      entityType: 'ADMISSION',
      entityId: key,
      action: 'UPDATE_ADMISSION_STATUS',
      actorUsername: actor,
      actorRole: 'ADMISSIONS_OFFICER',
      details: `Status transitioned from ${expected} to ${target}. Notes: ${clean(notes) || 'None'}`,
      timestamp,
      auditHash
    };
    const sql = getNeonSql();
    const rows = await sql`WITH updated AS (
      UPDATE education_admissions
      SET status = ${target}, data = ${JSON.stringify(updated)}::jsonb, updated_at = NOW()
      WHERE id = ${key} AND status = ${expected}
      RETURNING data
    ), audited AS (
      INSERT INTO education_audit_logs
        (id, entity_type, entity_id, action, actor_username, audit_hash, data, created_at)
      SELECT ${auditId}, 'ADMISSION', ${key}, 'UPDATE_ADMISSION_STATUS', ${actor},
        ${auditHash}, ${JSON.stringify(auditRecord)}::jsonb, ${timestamp}
      FROM updated
      RETURNING id
    )
    SELECT updated.data FROM updated
    JOIN audited ON TRUE` as unknown as DbRow[];
    return rows.length ? decode<AdmissionApplication>(rows[0].data) : null;
  }

  async getScholarships(tier?: string, countryCode?: string): Promise<ScholarshipOpportunity[]> {
    this.assertReady();
    const sql = getNeonSql();
    const rows = await sql`SELECT data FROM education_scholarships
      ORDER BY deadline ASC NULLS LAST, created_at DESC` as unknown as DbRow[];
    let scholarships = rows.map(row => decode<ScholarshipOpportunity>(row.data));
    if (tier && tier !== 'all') {
      scholarships = scholarships.filter(item => Array.isArray(item.applicableTiers) && item.applicableTiers.includes(tier as any));
    }
    const country = clean(countryCode).toUpperCase();
    if (country && country !== 'ALL' && country !== 'GLOBAL') {
      scholarships = scholarships.filter(item =>
        Array.isArray(item.eligibleCountries) &&
        item.eligibleCountries.some(code => clean(code).toUpperCase() === country)
      );
    }
    return scholarships;
  }

  async createScholarship(record: ScholarshipOpportunity): Promise<ScholarshipOpportunity> {
    this.assertReady();
    const id = clean(record?.id);
    const sponsorType = clean(record.sponsorType);
    if (!id || !sponsorType) throw new Error('EDUCATION_SCHOLARSHIP_FIELDS_REQUIRED');
    const deadline = clean(record.deadline) || null;
    const sql = getNeonSql();
    const rows = await sql`INSERT INTO education_scholarships
      (id, sponsor_type, deadline, data)
      VALUES (${id}, ${sponsorType}, ${deadline}::timestamptz, ${JSON.stringify(record)}::jsonb)
      ON CONFLICT (id) DO NOTHING RETURNING data` as unknown as DbRow[];
    if (!rows.length) throw new Error('EDUCATION_SCHOLARSHIP_ALREADY_EXISTS');
    return decode<ScholarshipOpportunity>(rows[0].data);
  }
  /**
   * Merge a scholarship update without allowing the payload to change its ID.
   * The durable row update and its audit record commit atomically.
   */
  async updateScholarship(
    id: string,
    updates: Partial<ScholarshipOpportunity>,
    actorUsername: string
  ): Promise<ScholarshipOpportunity | null> {
    this.assertReady();
    const key = clean(id);
    const actor = clean(actorUsername);
    if (!key || !actor || !updates || typeof updates !== 'object' || Array.isArray(updates)) {
      throw new Error('EDUCATION_SCHOLARSHIP_UPDATE_FIELDS_REQUIRED');
    }
    if (Object.prototype.hasOwnProperty.call(updates, 'id') && clean(updates.id) !== key) {
      throw new Error('EDUCATION_SCHOLARSHIP_UPDATE_ID_MISMATCH');
    }
    const allowedKeys = new Set([
      'title', 'sponsorName', 'sponsorType', 'badge', 'description',
      'coverageType', 'amountValue', 'coverageAmountUsd', 'applicableTiers',
      'eligibleCountries', 'deadline', 'eligibilityCriteria', 'numberOfAwards',
      'applicationCount'
    ]);
    if (Object.keys(updates).some(field => field !== 'id' && !allowedKeys.has(field))) {
      throw new Error('EDUCATION_SCHOLARSHIP_UPDATE_FIELD_NOT_ALLOWED');
    }
    if (Object.prototype.hasOwnProperty.call(updates, 'sponsorType') &&
        !['government', 'ngo', 'corporate', 'institution'].includes(clean(updates.sponsorType))) {
      throw new Error('EDUCATION_SCHOLARSHIP_SPONSOR_TYPE_INVALID');
    }
    if (Object.prototype.hasOwnProperty.call(updates, 'deadline') && clean(updates.deadline) &&
        Number.isNaN(Date.parse(clean(updates.deadline)))) {
      throw new Error('EDUCATION_SCHOLARSHIP_DEADLINE_INVALID');
    }
    const patch: Partial<ScholarshipOpportunity> = { ...updates };
    delete patch.id;
    if (Object.keys(patch).length === 0) throw new Error('EDUCATION_SCHOLARSHIP_UPDATE_EMPTY');

    const timestamp = new Date().toISOString();
    const auditId = `AUD-EDU-${crypto.randomUUID()}`;
    const patchJson = JSON.stringify(patch);
    const auditHash = crypto.createHash('sha256')
      .update([auditId, key, actor, timestamp, patchJson].join('|'))
      .digest('hex');
    const auditRecord = {
      id: auditId,
      entityType: 'SCHOLARSHIP',
      entityId: key,
      action: 'UPDATE_SCHOLARSHIP',
      actorUsername: actor,
      actorRole: 'INSTITUTION_ADMIN',
      details: 'Scholarship record updated',
      timestamp,
      auditHash
    };
    const sql = getNeonSql();
    const rows = await sql`WITH updated AS (
      UPDATE education_scholarships
      SET sponsor_type = CASE WHEN ${Object.prototype.hasOwnProperty.call(patch, 'sponsorType')}
            THEN ${clean(patch.sponsorType)} ELSE sponsor_type END,
          deadline = CASE WHEN ${Object.prototype.hasOwnProperty.call(patch, 'deadline')}
            THEN NULLIF(${clean(patch.deadline)}, '')::timestamptz ELSE deadline END,
          data = data || ${patchJson}::jsonb,
          updated_at = NOW()
      WHERE id = ${key}
      RETURNING data
    ), audited AS (
      INSERT INTO education_audit_logs
        (id, entity_type, entity_id, action, actor_username, audit_hash, data, created_at)
      SELECT ${auditId}, 'SCHOLARSHIP', ${key}, 'UPDATE_SCHOLARSHIP', ${actor},
        ${auditHash}, ${JSON.stringify(auditRecord)}::jsonb, ${timestamp}
      FROM updated
      RETURNING id
    )
    SELECT updated.data FROM updated
    JOIN audited ON TRUE` as unknown as DbRow[];
    return rows.length ? decode<ScholarshipOpportunity>(rows[0].data) : null;
  }

}
