import { authenticateVendorRequest as authenticateRequest, getDurableVendorApplication, saveDurableVendorApplication, durableVendorStorageEnabled, pstpAuditRepo } from '../../dist/server.cjs';

const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: ['manage_store', 'manage_products', 'manage_orders', 'manage_inventory', 'view_finances', 'manage_customers', 'manage_marketing', 'manage_staff'],
  manager: ['manage_store', 'manage_products', 'manage_orders', 'manage_inventory', 'manage_customers', 'manage_marketing'],
  sales: ['manage_customers', 'manage_orders', 'view_products'],
  support: ['manage_customers', 'manage_orders', 'view_products'],
  warehouse: ['manage_inventory', 'manage_orders', 'view_products'],
  finance: ['view_finances', 'view_orders', 'view_reports']
};

const normalizeRole = (value: any): string | null => {
  const role = String(value || '').trim().toLowerCase();
  return Object.prototype.hasOwnProperty.call(ROLE_PERMISSIONS, role) ? role : null;
};

const emailIsValid = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default async function handler(req: any, res: any) {
  if (!['GET', 'POST'].includes(req.method)) {
    return res.status(405).json({ success: false, error: 'METHOD_NOT_ALLOWED' });
  }

  if (!durableVendorStorageEnabled()) {
    return res.status(503).json({
      success: false,
      error: 'DURABLE_VENDOR_STORAGE_UNAVAILABLE',
      message: 'Merchant storage is not configured.'
    });
  }

  try {
    const user = await authenticateRequest(req);
    if (!user?.username) {
      return res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Authenticated Pioneer session required.'
      });
    }

    const username = String(user.username).trim();
    const application = await getDurableVendorApplication(username);
    if (!application) {
      return res.status(404).json({ success: false, error: 'VENDOR_APPLICATION_NOT_FOUND' });
    }

    const approved =
      application.status === 'APPROVED' &&
      application.verificationStatus === 'Verified' &&
      application.sellerStatus === 'Active';

    if (!approved) {
      return res.status(403).json({
        success: false,
        error: 'MERCHANT_NOT_APPROVED',
        message: 'Verified and active merchant status is required to manage staff.'
      });
    }

    const staff = Array.isArray((application as any).staff)
      ? (application as any).staff
      : [];

    if (req.method === 'GET') {
      return res.status(200).json({
        success: true,
        owner: {
          username: application.pioneerUsername,
          storeName: application.storeName || null
        },
        staff
      });
    }

    const body = req.body || {};
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const role = normalizeRole(body.role);

    if (!name || !email || !role) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_STAFF_INVITATION',
        message: 'Name, valid email, and supported role are required.'
      });
    }
    if (!emailIsValid(email)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_EMAIL',
        message: 'A valid email address is required.'
      });
    }

    const duplicate = staff.find((member: any) =>
      String(member.email || '').toLowerCase() === email &&
      member.status !== 'disabled'
    );
    if (duplicate) {
      return res.status(409).json({
        success: false,
        error: 'STAFF_ALREADY_INVITED',
        message: 'This email already has an active team invitation.'
      });
    }

    const now = new Date().toISOString();
    const member = {
      id: `staff-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      email,
      role,
      permissions: ROLE_PERMISSIONS[role],
      joinedAt: now,
      status: 'invited'
    };

    const savedApplication = await saveDurableVendorApplication({
      ...application,
      staff: [...staff, member],
      updatedAt: now
    });

    pstpAuditRepo.appendLog({
      orderId: savedApplication.id,
      actor: username,
      actorRole: 'seller',
      action: 'MERCHANT_STAFF_INVITED',
      details: `Staff invitation recorded for ${email} with role ${role}.`,
      ipAddress: req.ip || '127.0.0.1',
      deviceInfo: req.headers?.['user-agent'] || 'Pi Browser'
    });

    return res.status(201).json({
      success: true,
      message: 'Team invitation recorded securely.',
      delivery: 'RECORDED',
      member
    });
  } catch (error: any) {
    console.error('[vendor-team]', error);
    return res.status(500).json({
      success: false,
      error: 'VENDOR_TEAM_EXCEPTION',
      message: error?.message || 'Unable to manage merchant team.'
    });
  }
}
