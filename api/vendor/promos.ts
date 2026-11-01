import crypto from 'crypto';
import {
  authenticateVendorRequest as authenticateRequest,
  getDurableVendorApplication,
  saveDurableVendorApplication,
  listDurableVendorApplications,
  durableVendorStorageEnabled,
  pstpAuditRepo
} from '../../dist/server.cjs';

const valid = (p:any) =>
  typeof p?.code === 'string' &&
  /^[A-Z0-9_-]{3,32}$/.test(p.code) &&
  Number.isFinite(Number(p.discountPercent)) &&
  Number(p.discountPercent) >= 1 &&
  Number(p.discountPercent) <= 100 &&
  Number.isFinite(Number(p.minPurchasePi)) &&
  Number(p.minPurchasePi) >= 0 &&
  typeof p.expiresAt === 'string' &&
  Number.isFinite(Date.parse(p.expiresAt));

export default async function handler(req:any,res:any) {
  if (!['GET','POST'].includes(req.method)) return res.status(405).json({success:false,error:'METHOD_NOT_ALLOWED'});
  if (!durableVendorStorageEnabled()) return res.status(503).json({success:false,error:'DURABLE_VENDOR_STORAGE_UNAVAILABLE'});

  try {
    if (req.method === 'GET') {
      const apps = await listDurableVendorApplications();
      const now = Date.now();
      const promos = apps.flatMap((app:any) => {
        if (app?.status !== 'APPROVED' || app?.verificationStatus !== 'Verified' || app?.sellerStatus !== 'Active') return [];
        return (Array.isArray(app.promos) ? app.promos : [])
          .filter((p:any) => p?.active === true && Date.parse(p.expiresAt) > now)
          .map((p:any) => ({ ...p, sellerUsername: app.pioneerUsername, storeName: app.storeName || null }));
      });
      return res.status(200).json({success:true,promos});
    }

    const user = await authenticateRequest(req);
    if (!user?.username) return res.status(401).json({success:false,error:'UNAUTHORIZED'});
    const username = String(user.username).trim();
    const app = await getDurableVendorApplication(username);
    const approved = app?.status === 'APPROVED' && app?.verificationStatus === 'Verified' && app?.sellerStatus === 'Active';
    if (!approved) return res.status(403).json({success:false,error:'MERCHANT_NOT_APPROVED'});

    const body = req.body || {};
    const code = String(body.code || '').trim().toUpperCase();
    const discountPercent = Number(body.discountPercent);
    const minPurchasePi = Number(body.minPurchasePi);
    const expiresAt = new Date(body.expiresAt).toISOString();
    const existingPromos = Array.isArray((app as any).promos) ? (app as any).promos : [];
    if (!valid({code,discountPercent,minPurchasePi,expiresAt})) {
      return res.status(400).json({success:false,error:'INVALID_PROMO_INPUT'});
    }
    if (existingPromos.some((p:any) => p.active === true && String(p.code).toUpperCase() === code && Date.parse(p.expiresAt) > Date.now())) {
      return res.status(409).json({success:false,error:'PROMO_CODE_ALREADY_ACTIVE'});
    }

    const promo = {
      id: `promo-${crypto.randomBytes(8).toString('hex')}`,
      code, discountPercent, minPurchasePi, expiresAt,
      usageCount: 0, active: true, createdAt: new Date().toISOString()
    };
    const saved = await saveDurableVendorApplication({...app,promos:[...existingPromos,promo],updatedAt:new Date().toISOString()});
    pstpAuditRepo.appendLog({
      orderId:saved.id, actor:username, actorRole:'seller',
      action:'MERCHANT_PROMO_CREATED',
      details:`Promotion ${code} created at ${discountPercent}% with minimum ${minPurchasePi} Pi.`,
      ipAddress:req.ip || '127.0.0.1',
      deviceInfo:req.headers?.['user-agent'] || 'Pi Browser'
    });
    return res.status(201).json({success:true,promo});
  } catch (error:any) {
    console.error('[vendor-promos]',error);
    return res.status(500).json({success:false,error:'VENDOR_PROMO_EXCEPTION',message:error?.message || 'Unable to manage promotions.'});
  }
}
