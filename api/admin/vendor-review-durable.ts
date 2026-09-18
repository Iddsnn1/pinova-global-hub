import { authenticateAdminRequest, getBundledServer } from '../../src/server/services/DurableVendorAuth';
import { getDurableVendorApplication, listDurableVendorApplications, saveDurableVendorApplication, durableVendorStorageEnabled } from '../../src/server/services/DurableVendorApplicationStore';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'METHOD_NOT_ALLOWED' });
  const user = await authenticateAdminRequest(req);
  if (!user) return res.status(403).json({ success: false, error: 'FORBIDDEN', message: 'Admin privileges required.' });
  if (!durableVendorStorageEnabled()) return res.status(503).json({ success: false, error: 'DURABLE_VENDOR_STORAGE_UNAVAILABLE' });
  const id = String(req.query?.id || '').trim();
  const body = req.body || {};
  const status = String(body.status || '').trim();
  if (!['PENDING_REVIEW','UNDER_REVIEW','APPROVED','REJECTED','ACTION_REQUIRED'].includes(status)) return res.status(400).json({ success: false, error: 'INVALID_VENDOR_STATUS' });
  const apps = await listDurableVendorApplications();
  const existing = apps.find((a: any) => a.id === id);
  if (!existing) return res.status(404).json({ success: false, error: 'APPLICATION_NOT_FOUND' });
  const lifecycle = status === 'APPROVED' ? { verificationStatus: 'Verified', sellerStatus: 'Active' } : status === 'REJECTED' ? { verificationStatus: 'Unverified', sellerStatus: 'Suspended' } : { verificationStatus: 'Pending Verification', sellerStatus: 'Probation' };
  const updated = await saveDurableVendorApplication({ ...existing, status, ...lifecycle, adminReviewNotes: body.adminNotes ?? existing.adminReviewNotes, reviewedBy: user.username, reviewedAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  const server = getBundledServer();
  server.pstpAuditRepo.appendLog({ orderId: id, actor: user.username, actorRole: 'admin', action: `VENDOR_APPLICATION_${status}`, details: `Application ${id} status updated to ${status}.`, ipAddress: req.ip || '127.0.0.1', deviceInfo: req.headers?.['user-agent'] || 'Admin Console' });
  return res.json({ success: true, application: updated });
}
