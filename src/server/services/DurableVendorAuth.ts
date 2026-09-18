import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export function getBundledServer(): any {
  return require('../../dist/server.cjs');
}

export async function authenticateRequest(req: { headers: Record<string, any> }): Promise<any | null> {
  const auth = req.headers?.authorization as string | undefined;
  const token = auth?.startsWith('Bearer ') ? auth.slice(7).trim() : auth?.trim();
  if (!token) return null;
  const server = getBundledServer();
  return server.authService.authenticateToken(token);
}

export async function authenticateAdminRequest(req: { headers: Record<string, any> }): Promise<any | null> {
  const user = await authenticateRequest(req);
  if (!user) return null;
  const roles = Array.isArray(user.roles) ? user.roles : [];
  return roles.includes('PLATFORM_ADMIN') || roles.includes('COMPLIANCE_OFFICER') ? user : null;
}
