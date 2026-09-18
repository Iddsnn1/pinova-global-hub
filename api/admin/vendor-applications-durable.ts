import { authenticateVendorAdminRequest as authenticateAdminRequest, listDurableVendorApplications, durableVendorStorageEnabled } from '../../dist/server.cjs';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'METHOD_NOT_ALLOWED' });
  const user = await authenticateAdminRequest(req);
  if (!user) return res.status(403).json({ success: false, error: 'FORBIDDEN', message: 'Admin privileges required.' });
  if (!durableVendorStorageEnabled()) return res.status(503).json({ success: false, error: 'DURABLE_VENDOR_STORAGE_UNAVAILABLE' });
  const applications = await listDurableVendorApplications();
  return res.json({ success: true, count: applications.length, applications });
}
