import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';

const BUCKET = String(process.env.EDUCATION_DOCUMENT_BUCKET || 'education-academic-documents').trim();

function config() {
  const endpoint = String(process.env.AWS_ENDPOINT_URL_S3 || '').trim();
  const region = String(process.env.AWS_REGION || '').trim();
  const accessKeyId = String(process.env.AWS_ACCESS_KEY_ID || '').trim();
  const secretAccessKey = String(process.env.AWS_SECRET_ACCESS_KEY || '').trim();
  if (!endpoint || !region || !accessKeyId || !secretAccessKey || !BUCKET) throw new Error('EDUCATION_DOCUMENT_STORAGE_NOT_CONFIGURED');
  return { endpoint, region, accessKeyId, secretAccessKey };
}

function client() {
  const c = config();
  return {
    c,
    s3: new S3Client({
      region: c.region,
      endpoint: c.endpoint,
      forcePathStyle: true,
      credentials: { accessKeyId: c.accessKeyId, secretAccessKey: c.secretAccessKey }
    })
  };
}

export function educationDocumentStorageEnabled(): boolean {
  return Boolean(
    process.env.AWS_ENDPOINT_URL_S3 &&
    process.env.AWS_REGION &&
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    BUCKET
  );
}

export function educationDocumentBucketName(): string {
  return BUCKET;
}

export async function putEducationDocument(key: string, body: Uint8Array | string, contentType: string): Promise<void> {
  const { s3 } = client();
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key.replace(/^\/+/, ''),
    Body: body,
    ContentType: contentType,
    CacheControl: 'no-store'
  }));
}

export async function deleteEducationDocument(key: string): Promise<void> {
  const { s3 } = client();
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key.replace(/^\/+/, '') }));
}


export const EDUCATION_DOCUMENT_MAX_BYTES = 10 * 1024 * 1024;
export const EDUCATION_DOCUMENT_TYPES = [
  'birth_certificate',
  'passport_photo',
  'previous_transcript',
  'ssce_result',
  'recommendation_letter',
  'other'
] as const;
export type EducationAdmissionDocumentType = typeof EDUCATION_DOCUMENT_TYPES[number];

const ALLOWED_CONTENT_TYPES = new Set(['application/pdf', 'image/jpeg', 'image/png']);

function database() {
  const url = String(process.env.DATABASE_URL || '').trim();
  if (!url) throw new Error('EDUCATION_DOCUMENT_DB_NOT_CONFIGURED');
  return neon(url);
}

function normalizeOwner(value: string): string {
  const owner = String(value || '').trim().replace(/^@/, '').toLowerCase();
  if (!owner) throw new Error('EDUCATION_DOCUMENT_OWNER_REQUIRED');
  return owner;
}

function extensionFor(contentType: string): string {
  return contentType === 'application/pdf' ? 'pdf' : contentType === 'image/jpeg' ? 'jpg' : 'png';
}

function signatureMatches(bytes: Uint8Array, contentType: string): boolean {
  if (contentType === 'application/pdf') return Buffer.from(bytes.subarray(0, 5)).toString('ascii') === '%PDF-';
  if (contentType === 'image/jpeg') return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const png = [137, 80, 78, 71, 13, 10, 26, 10];
  return bytes.length >= png.length && png.every((v, i) => bytes[i] === v);
}

function safeFileName(value: string): string {
  const base = String(value || 'document').replace(/\\/g, '/').split('/').pop() || 'document';
  return base.replace(/[^a-zA-Z0-9._-]+/g, '_').slice(0, 120) || 'document';
}

export async function saveEducationAdmissionDocument(input: {
  ownerUsername: string;
  applicationId?: string;
  documentType: EducationAdmissionDocumentType;
  fileName: string;
  contentType: string;
  bytes: Uint8Array;
}) {
  if (!educationDocumentStorageEnabled()) throw new Error('EDUCATION_DOCUMENT_STORAGE_NOT_CONFIGURED');
  if (!EDUCATION_DOCUMENT_TYPES.includes(input.documentType)) throw new Error('EDUCATION_DOCUMENT_TYPE_INVALID');
  if (!ALLOWED_CONTENT_TYPES.has(input.contentType)) throw new Error('EDUCATION_DOCUMENT_CONTENT_TYPE_INVALID');
  if (input.bytes.length < 1 || input.bytes.length > EDUCATION_DOCUMENT_MAX_BYTES) throw new Error('EDUCATION_DOCUMENT_SIZE_INVALID');
  if (!signatureMatches(input.bytes, input.contentType)) throw new Error('EDUCATION_DOCUMENT_SIGNATURE_INVALID');

  const owner = normalizeOwner(input.ownerUsername);
  const documentId = `edu-doc-${crypto.randomUUID()}`;
  const ownerHash = crypto.createHash('sha256').update(owner).digest('hex').slice(0, 32);
  const objectKey = `applicants/${ownerHash}/${documentId}.${extensionFor(input.contentType)}`;
  const sha256 = crypto.createHash('sha256').update(input.bytes).digest('hex');

  await putEducationDocument(objectKey, input.bytes, input.contentType);
  try {
    const sql = database();
    await sql`
      INSERT INTO education_admission_documents
        (document_id, owner_username, application_id, document_type, original_file_name, content_type, size_bytes, object_key, sha256)
      VALUES
        (${documentId}, ${owner}, ${input.applicationId || null}, ${input.documentType}, ${safeFileName(input.fileName)}, ${input.contentType}, ${input.bytes.length}, ${objectKey}, ${sha256})
    `;
  } catch (error) {
    await deleteEducationDocument(objectKey).catch(() => undefined);
    throw error;
  }

  return {
    id: documentId,
    type: input.documentType,
    fileName: safeFileName(input.fileName),
    fileSizeKb: Math.ceil(input.bytes.length / 1024),
    uploadedAt: new Date().toISOString(),
    verificationStatus: 'pending' as const,
    applicationId: input.applicationId || null,
    sha256
  };
}

export async function listEducationAdmissionDocuments(ownerUsername: string, applicationId?: string) {
  const owner = normalizeOwner(ownerUsername);
  const sql = database();
  const rows = applicationId
    ? await sql`
      SELECT document_id AS "id", document_type AS "type", original_file_name AS "fileName",
             size_bytes AS "sizeBytes", uploaded_at AS "uploadedAt",
             verification_status AS "verificationStatus", application_id AS "applicationId"
      FROM education_admission_documents
      WHERE owner_username = ${owner} AND application_id = ${applicationId}
      ORDER BY uploaded_at DESC
    `
    : await sql`
      SELECT document_id AS "id", document_type AS "type", original_file_name AS "fileName",
             size_bytes AS "sizeBytes", uploaded_at AS "uploadedAt",
             verification_status AS "verificationStatus", application_id AS "applicationId"
      FROM education_admission_documents
      WHERE owner_username = ${owner}
      ORDER BY uploaded_at DESC
    `;

  return rows.map((row: any) => ({
    id: row.id,
    type: row.type,
    fileName: row.fileName,
    fileSizeKb: Math.ceil(Number(row.sizeBytes) / 1024),
    uploadedAt: row.uploadedAt,
    verificationStatus: row.verificationStatus,
    applicationId: row.applicationId || null
  }));
}
