import { neon } from '@neondatabase/serverless';

let cachedSql: ReturnType<typeof neon> | null = null;

/**
 * Accept either a raw PostgreSQL URL (the recommended Vercel value) or a
 * copied .env assignment such as DATABASE_URL="postgresql://...".
 * Never include the supplied value in validation errors or logs.
 */
function getConnectionString(): string {
  let value = String(process.env.DATABASE_URL || '').trim();
  if (!value) return '';

  value = value.replace(/^DATABASE_URL\s*=\s*/i, '').trim();

  if (
    value.length >= 2 &&
    ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'")))
  ) {
    value = value.slice(1, -1).trim();
  }

  try {
    const parsed = new URL(value);
    if (
      (parsed.protocol !== 'postgres:' && parsed.protocol !== 'postgresql:') ||
      !parsed.hostname ||
      !parsed.pathname ||
      parsed.pathname === '/'
    ) {
      return '';
    }
  } catch {
    return '';
  }

  return value;
}

export function neonDatabaseEnabled(): boolean {
  return Boolean(getConnectionString());
}

export function getNeonSql() {
  const connectionString = getConnectionString();
  if (!connectionString) throw new Error('NEON_DATABASE_URL_UNAVAILABLE_OR_INVALID');
  if (!cachedSql) cachedSql = neon(connectionString);
  return cachedSql;
}
