import { neon } from '@neondatabase/serverless';

let cachedSql: ReturnType<typeof neon> | null = null;

export function neonDatabaseEnabled(): boolean {
  return Boolean(String(process.env.DATABASE_URL || '').trim());
}

export function getNeonSql() {
  const connectionString = String(process.env.DATABASE_URL || '').trim();
  if (!connectionString) throw new Error('NEON_DATABASE_URL_UNAVAILABLE');
  if (!cachedSql) cachedSql = neon(connectionString);
  return cachedSql;
}
