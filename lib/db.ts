import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

let _sql: NeonQueryFunction<false, false> | null = null;

/**
 * Lazily creates the Neon SQL tagged-template client.
 * Throws a clear error if DATABASE_URL isn't set yet (e.g. before the
 * Neon integration has been connected in the Vercel project).
 */
export function sql(): NeonQueryFunction<false, false> {
  if (_sql) return _sql;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. Connect the Neon Postgres integration to this Vercel project, then redeploy.'
    );
  }
  _sql = neon(url);
  return _sql;
}

export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
