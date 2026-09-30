import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

function config() {
  const endpoint = String(process.env.OBJECT_STORAGE_ENDPOINT || '').trim();
  const bucket = String(process.env.OBJECT_STORAGE_BUCKET || '').trim();
  const region = String(process.env.OBJECT_STORAGE_REGION || 'auto').trim();
  const accessKeyId = String(process.env.OBJECT_STORAGE_ACCESS_KEY_ID || '').trim();
  const secretAccessKey = String(process.env.OBJECT_STORAGE_SECRET_ACCESS_KEY || '').trim();
  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) {
    throw new Error('OBJECT_STORAGE_NOT_CONFIGURED');
  }
  return { endpoint, bucket, region, accessKeyId, secretAccessKey };
}

function client() {
  const c = config();
  return {
    c,
    s3: new S3Client({
      region: c.region,
      endpoint: c.endpoint,
      forcePathStyle: process.env.OBJECT_STORAGE_FORCE_PATH_STYLE !== 'false',
      credentials: { accessKeyId: c.accessKeyId, secretAccessKey: c.secretAccessKey }
    })
  };
}

export function objectStorageEnabled(): boolean {
  return Boolean(
    process.env.OBJECT_STORAGE_ENDPOINT &&
    process.env.OBJECT_STORAGE_BUCKET &&
    process.env.OBJECT_STORAGE_ACCESS_KEY_ID &&
    process.env.OBJECT_STORAGE_SECRET_ACCESS_KEY
  );
}

export async function putObject(pathname: string, body: Uint8Array | string, contentType = 'application/octet-stream') {
  const { c, s3 } = client();
  const key = pathname.replace(/^\/+/, '');
  await s3.send(new PutObjectCommand({
    Bucket: c.bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: contentType.startsWith('image/') ? 'public, max-age=31536000, immutable' : undefined
  }));
  return { pathname: key, url: publicObjectUrl(key) };
}

export async function getObject(pathname: string): Promise<{ body: Uint8Array; contentType: string } | null> {
  const { c, s3 } = client();
  try {
    const out = await s3.send(new GetObjectCommand({ Bucket: c.bucket, Key: pathname.replace(/^\/+/, '') }));
    if (!out.Body) return null;
    const bytes = new Uint8Array(await out.Body.transformToByteArray());
    return { body: bytes, contentType: out.ContentType || 'application/octet-stream' };
  } catch (error: any) {
    const status = error?.$metadata?.httpStatusCode;
    if (status === 404 || error?.name === 'NoSuchKey' || error?.name === 'NotFound') return null;
    throw error;
  }
}

export async function deleteObject(pathname: string): Promise<void> {
  const { c, s3 } = client();
  await s3.send(new DeleteObjectCommand({ Bucket: c.bucket, Key: pathname.replace(/^\/+/, '') }));
}

export async function listObjects(prefix: string): Promise<string[]> {
  const { c, s3 } = client();
  const keys: string[] = [];
  let ContinuationToken: string | undefined;
  do {
    const out = await s3.send(new ListObjectsV2Command({
      Bucket: c.bucket,
      Prefix: prefix.replace(/^\/+/, ''),
      ContinuationToken
    }));
    for (const item of out.Contents || []) if (item.Key) keys.push(item.Key);
    ContinuationToken = out.IsTruncated ? out.NextContinuationToken : undefined;
  } while (ContinuationToken);
  return keys;
}

export function publicObjectUrl(pathname: string): string {
  const base = String(process.env.OBJECT_STORAGE_PUBLIC_BASE_URL || '').trim().replace(/\/+$/, '');
  if (!base) return '';
  return `${base}/${pathname.replace(/^\/+/, '').split('/').map(encodeURIComponent).join('/')}`;
}
