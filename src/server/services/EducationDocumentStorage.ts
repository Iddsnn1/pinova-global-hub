import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

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
