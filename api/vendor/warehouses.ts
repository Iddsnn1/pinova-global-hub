import crypto from 'crypto';
import {
  authenticateVendorRequest as authenticateRequest,
  getDurableVendorApplication,
  saveDurableVendorApplication,
  durableVendorStorageEnabled,
  pstpAuditRepo
} from '../../dist/server.cjs';

function canManage(app:any) {
  return app?.status === 'APPROVED' &&
    app?.verificationStatus === 'Verified' &&
    app?.sellerStatus === 'Active';
}

export default async function handler(req:any,res:any) {
  if (!['GET','POST'].includes(req.method)) {
    return res.status(405).json({ ok:false, error:'METHOD_NOT_ALLOWED' });
  }
  if (!durableVendorStorageEnabled()) {
    return res.status(503).json({ ok:false, error:'DURABLE_VENDOR_STORAGE_UNAVAILABLE' });
  }

  try {
    const user = await authenticateRequest(req);
    if (!user?.username) return res.status(401).json({ ok:false, error:'INVALID_SESSION' });

    const username = String(user.username).trim();
    const app = await getDurableVendorApplication(username);
    if (!canManage(app)) {
      return res.status(403).json({ ok:false, error:'MERCHANT_SELLER_ACCESS_REQUIRED' });
    }

    const warehouses = Array.isArray((app as any).warehouses) ? (app as any).warehouses : [];

    if (req.method === 'GET') {
      return res.status(200).json({ ok:true, warehouses });
    }

    const body = req.body || {};
    const name = String(body.name || '').trim();
    const location = String(body.location || '').trim();
    const country = String(body.country || '').trim();

    if (name.length < 2 || name.length > 120 || location.length > 160) {
      return res.status(400).json({ ok:false, error:'INVALID_WAREHOUSE_INPUT' });
    }

    const warehouse = {
      id: `wh_${Date.now()}_${crypto.randomBytes(5).toString('hex')}`,
      name,
      location,
      country,
      isPrimary: warehouses.length === 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = await saveDurableVendorApplication({
      ...app,
      warehouses: [...warehouses, warehouse],
      updatedAt: new Date().toISOString()
    });

    try {
      await pstpAuditRepo.append({
        actor: username,
        action: 'MERCHANT_WAREHOUSE_CREATED',
        resourceType: 'merchant_inventory',
        resourceId: warehouse.id,
        details: { name, location, country }
      });
    } catch {}

    return res.status(201).json({ ok:true, warehouse, warehouses:saved.warehouses || [] });
  } catch (error:any) {
    console.error('[vendor-warehouses]', error);
    return res.status(500).json({ ok:false, error:'VENDOR_WAREHOUSE_EXCEPTION', message:error?.message || 'Unable to manage warehouses.' });
  }
}
