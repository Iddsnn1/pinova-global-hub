import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

function config() {
  const endpoint = String(process.env.AWS_ENDPOINT_URL_S3 || '').trim();
  const region = String(process.env.AWS_REGION || '').trim();
  const accessKeyId = String(process.env.AWS_ACCESS_KEY_ID || '').trim();
  const secretAccessKey = String(process.env.AWS_SECRET_ACCESS_KEY || '').trim();
  const bucket = String(process.env.VENDOR_DOCUMENT_BUCKET || '').trim();
  if (!endpoint || !region || !accessKeyId || !secretAccessKey || !bucket) {
    throw new Error('VENDOR_DOCUMENT_STORAGE_NOT_CONFIGURED');
  }
  return { endpoint, region, accessKeyId, secretAccessKey, bucket };
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

export function vendorDocumentStorageEnabled(): boolean {
  return Boolean(
    process.env.AWS_ENDPOINT_URL_S3 &&
    process.env.AWS_REGION &&
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.VENDOR_DOCUMENT_BUCKET
  );
}

export async function putVendorDocument(pathname: string, body: Uint8Array | string, contentType: string) {
  const { c, s3 } = client();
  const key = pathname.replace(/^\/+/, '');
  await s3.send(new PutObjectCommand({
    Bucket: c.bucket, Key: key, Body: body, ContentType: contentType, CacheControl: 'no-store'
  }));
}

export async function getVendorDocument(pathname: string): Promise<{ body: Uint8Array; contentType: string } | null> {
  const { c, s3 } = client();
  try {
    const out = await s3.send(new GetObjectCommand({ Bucket: c.bucket, Key: pathname.replace(/^\/+/, '') }));
    if (!out.Body) return null;
    return { body: new Uint8Array(await out.Body.transformToByteArray()), contentType: out.ContentType || 'application/octet-stream' };
  } catch (error: any) {
    const status = error?.$metadata?.httpStatusCode;
    if (status === 404 || error?.name === 'NoSuchKey' || error?.name === 'NotFound') return null;
    throw error;
  }
}
