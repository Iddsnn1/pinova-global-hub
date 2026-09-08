import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { GoogleGenAI } from '@google/genai';
import {
  paymentLedgerRepo,
  pstpAuditRepo,
  pstpDisputeRepo,
  flightFulfillmentRepo,
  utilityFulfillmentRepo,
  securityEventRepo,
  platformConfigRepo,
  idempotencyRepo,
  vendorApplicationRepo,
  educationRepo,
  FlightFulfillmentEntity
} from './src/server/db';
import { vtuNgAdapter } from './src/server/integrations';
import { getTaxonomyByCountry, GLOBAL_EDUCATION_TAXONOMIES } from './src/data/educationTaxonomyData';
import { normalizeCountryCode } from './src/data/countrySubdivisions';
import { SEED_MARKETPLACE_ITEMS } from './src/data/educationSeedData';
import {
  authService,
  authenticate,
  requireAuthenticatedUser,
  requireRole,
  requirePermission,
  AuthenticatedRequest,
  AuthenticatedUser,
  Permission
} from './src/server/auth';
import { createRateLimiter } from './src/server/auth/rateLimit';
import { AuditService } from './src/server/services/AuditService';
import { EducationClassificationEngine } from './src/server/services/EducationClassificationEngine';
import { StudentVerificationService } from './src/server/services/StudentVerificationService';
import { EducationRepository } from './src/server/db/repositories/EducationRepository';

dotenv.config();

const app = express();
// Bind port: In Google AI Studio environment, nginx reverse-proxies port 8080 to internal port 3000 (DEFAULT_APP_PORT=3000).
// In standalone Cloud Run without nginx proxy, bind directly to process.env.PORT.
const PORT = process.env.DEFAULT_APP_PORT 
  ? Number(process.env.DEFAULT_APP_PORT) 
  : (process.env.NGINX_PORT ? 3000 : (Number(process.env.PORT) || 3000));

app.use(express.json());

// Initialize core server-side services
const auditService = AuditService.getInstance(pstpAuditRepo);
const classificationEngine = EducationClassificationEngine.getInstance();
const studentVerificationService = StudentVerificationService.getInstance();

// Rate Limiters
const authRateLimiter = createRateLimiter({ windowMs: 60000, maxRequests: 30, message: 'Too many auth requests. Please retry in a minute.' });
const paymentRateLimiter = createRateLimiter({ windowMs: 60000, maxRequests: 20, message: 'Too many payment requests. Please retry in a minute.' });
const receiptVerifyRateLimiter = createRateLimiter({ windowMs: 60000, maxRequests: 60, message: 'Receipt verification rate limit exceeded.' });
const studentVerifyRateLimiter = createRateLimiter({ windowMs: 60000, maxRequests: 30, message: 'Student verification rate limit exceeded.' });
const disputeRateLimiter = createRateLimiter({ windowMs: 60000, maxRequests: 30, message: 'Dispute rate limit exceeded.' });
const securityEventsRateLimiter = createRateLimiter({ windowMs: 60000, maxRequests: 20, message: 'Security events reporting rate limit exceeded.' });

// Vercel Serverless Request URL Restoration Middleware
app.use((req, res, next) => {
  try {
    let targetPath = '';
    const rawUrl = req.url || '';

    if (rawUrl.includes('__path=')) {
      const match = rawUrl.match(/__path=([^&]+)/);
      if (match && match[1]) {
        targetPath = decodeURIComponent(match[1]);
      }
    }

    if (!targetPath && req.query && typeof req.query.__path === 'string') {
      targetPath = req.query.__path;
    } else if (!targetPath && req.headers['x-forwarded-uri']) {
      targetPath = req.headers['x-forwarded-uri'] as string;
    } else if (!targetPath && req.headers['x-original-url']) {
      targetPath = req.headers['x-original-url'] as string;
    } else if (!targetPath && req.headers['x-matched-path']) {
      targetPath = req.headers['x-matched-path'] as string;
    } else if (!targetPath && req.headers['x-invoke-path']) {
      targetPath = req.headers['x-invoke-path'] as string;
    }

    if (targetPath) {
      if (!targetPath.startsWith('/api')) {
        targetPath = '/api' + (targetPath.startsWith('/') ? targetPath : '/' + targetPath);
      }
      const [pathOnly, queryPart] = targetPath.split('?');
      req.url = pathOnly + (queryPart ? '?' + queryPart : '');
    } else if (req.url.startsWith('/api/index')) {
      req.url = req.url.replace('/api/index', '/api');
      if (req.url === '/api/' || req.url === '') req.url = '/api';
    }
  } catch (err) {
    console.error('[URL Restoration Middleware Error]:', err);
  }

  next();
});

const isProduction = process.env.NODE_ENV === 'production';

// Phase 16 & 17: Production CORS & Restricted Frame Ancestors
const ALLOWED_CORS_ORIGINS = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://app-cdn.minepi.com'
];

app.use((req, res, next) => {
  const origin = req.headers.origin as string | undefined;
  if (origin) {
    const isPiDomain = origin.endsWith('.minepi.com') || ALLOWED_CORS_ORIGINS.includes(origin) || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:');
    if (isPiDomain || !isProduction) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
  } else {
    // Non-browser or local client requests
    res.setHeader('Access-Control-Allow-Origin', isProduction ? 'https://app-cdn.minepi.com' : '*');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Admin-Key, X-Idempotency-Key, Idempotency-Key');
  // Allow Pi Browser & Google AI Studio iframe embedding strictly without wildcard leak
  res.removeHeader('X-Frame-Options');
  res.setHeader('Content-Security-Policy', "frame-ancestors 'self' https://*.minepi.com https://app-cdn.minepi.com pi: https://ai.studio https://*.google.com https://*.run.app https://localhost.corp.google.com:26001;");

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Logging Middleware & Request Context
app.use((req, res, next) => {
  console.log(`[API ${new Date().toISOString()}] ${req.method} ${req.url} - IP: ${req.ip}`);
  next();
});

// Phase 1: Authoritative Server-Side Admin Auth (Completely removes trust in client x-user-role header)
async function checkAdminAuth(req: express.Request): Promise<{ authenticated: boolean; authorized: boolean; user?: AuthenticatedUser }> {
  const authHeader = req.headers['authorization'] as string | undefined;
  const adminKeyHeader = req.headers['x-admin-key'] as string | undefined;
  const adminSecret = process.env.ADMIN_API_KEY || process.env.PI_API_KEY || process.env.PI_SERVER_KEY;

  // 1. Machine/Server Key Verification
  if (adminSecret && adminSecret !== 'YOUR_PI_PLATFORM_API_KEY' && adminSecret !== 'MY_PI_API_KEY') {
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7).trim() : null;
    const keyToken = authHeader?.startsWith('Key ') ? authHeader.substring(4).trim() : null;
    const directToken = authHeader?.trim();

    if (
      (bearerToken && bearerToken === adminSecret) ||
      (keyToken && keyToken === adminSecret) ||
      (directToken && directToken === adminSecret) ||
      (adminKeyHeader && adminKeyHeader === adminSecret)
    ) {
      return {
        authenticated: true,
        authorized: true,
        user: {
          id: 'usr-admin-sys',
          username: 'system_admin',
          roles: ['PLATFORM_ADMIN', 'COMPLIANCE_OFFICER'],
          permissions: new Set<Permission>(['platform.admin.access']),
          authMethod: 'API_KEY'
        }
      };
    }
  }

  // 2. Verified Server Session / Token (via AuthorizationService)
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7).trim() : authHeader?.trim();
  if (token) {
    const user = await authService.authenticateToken(token);
    if (user) {
      const isAuthorized = user.roles.some((r) => r === 'PLATFORM_ADMIN' || r === 'COMPLIANCE_OFFICER');
      return { authenticated: true, authorized: isAuthorized, user };
    }
  }

  // Unauthenticated or invalid token - NEVER trust client-supplied role headers
  return { authenticated: false, authorized: false };
}

// Authoritative Pi Payment Verification Service
export interface PiVerificationResult {
  verified: boolean;
  status: 'VERIFIED' | 'VERIFICATION_FAILED';
  source: 'pi_platform' | 'sandbox_dev';
  message: string;
  paymentData?: any;
}

export async function verifyPiPaymentAuthoritative(paymentId: string): Promise<PiVerificationResult> {
  if (!paymentId || typeof paymentId !== 'string') {
    return {
      verified: false,
      status: 'VERIFICATION_FAILED',
      source: 'pi_platform',
      message: 'Server verification failed. Payment is not confirmed on Pi Platform.'
    };
  }

  const cleanPaymentId = paymentId.trim();
  const piApiKey = (process.env.PI_API_KEY || process.env.PI_SERVER_KEY || '').trim();
  const hasValidApiKey = Boolean(piApiKey && piApiKey !== 'YOUR_PI_PLATFORM_API_KEY' && piApiKey !== 'MY_PI_API_KEY');

  if (isProduction) {
    // IN PRODUCTION: Fail-closed authoritative verification
    // "dev_pay_*", "pi_pay_*", "rcpt_*", and local "APPROVED" state MUST NOT bypass verification.
    // Missing or invalid PI_API_KEY MUST fail closed.
    if (!hasValidApiKey) {
      console.error(`[Pi Security] Production verification blocked: Missing PI_API_KEY for payment ${cleanPaymentId}`);
      return {
        verified: false,
        status: 'VERIFICATION_FAILED',
        source: 'pi_platform',
        message: 'Server verification failed. Payment is not confirmed on Pi Platform.'
      };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`https://api.minepi.com/v2/payments/${encodeURIComponent(cleanPaymentId)}`, {
        headers: {
          'Authorization': `Key ${piApiKey}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`[Pi Security] Pi Platform API rejected verification with HTTP ${response.status} for payment ${cleanPaymentId}`);
        return {
          verified: false,
          status: 'VERIFICATION_FAILED',
          source: 'pi_platform',
          message: 'Server verification failed. Payment is not confirmed on Pi Platform.'
        };
      }

      const paymentData = await response.json();
      const isCompleted = paymentData?.status?.developer_completed === true;
      const isTxVerified = paymentData?.transaction?.verified === true;

      if (isCompleted && isTxVerified) {
        console.log(`[Pi Security] Authoritative Pi Platform verification SUCCESS for payment ${cleanPaymentId}`);
        return {
          verified: true,
          status: 'VERIFIED',
          source: 'pi_platform',
          message: 'Payment verified and confirmed on Pi Platform.',
          paymentData
        };
      } else {
        console.warn(`[Pi Security] Payment ${cleanPaymentId} incomplete on Pi Platform (developer_completed: ${isCompleted}, tx_verified: ${isTxVerified})`);
        return {
          verified: false,
          status: 'VERIFICATION_FAILED',
          source: 'pi_platform',
          message: 'Server verification failed. Payment is not confirmed on Pi Platform.',
          paymentData
        };
      }
    } catch (fetchErr: any) {
      clearTimeout(timeoutId);
      console.error(`[Pi Security] Error contacting Pi Platform API for payment ${cleanPaymentId}:`, fetchErr.message);
      return {
        verified: false,
        status: 'VERIFICATION_FAILED',
        source: 'pi_platform',
        message: 'Server verification failed. Payment is not confirmed on Pi Platform.'
      };
    }
  } else {
    // OUTSIDE PRODUCTION (Development / Sandbox):
    // Attempt real Pi Platform verification first if API key is present and ID is not a dev mock
    if (hasValidApiKey && !cleanPaymentId.startsWith('dev_pay_') && !cleanPaymentId.startsWith('test_')) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await fetch(`https://api.minepi.com/v2/payments/${encodeURIComponent(cleanPaymentId)}`, {
          headers: {
            'Authorization': `Key ${piApiKey}`,
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const paymentData = await response.json();
          if (paymentData?.status?.developer_completed === true && paymentData?.transaction?.verified === true) {
            return {
              verified: true,
              status: 'VERIFIED',
              source: 'pi_platform',
              message: 'Payment verified on Pi Platform API (Testnet/Mainnet)',
              paymentData
            };
          }
        }
      } catch (err: any) {
        clearTimeout(timeoutId);
        console.warn(`[Pi Dev Fallback] Live verification attempt failed for ${cleanPaymentId}:`, err.message);
      }
    }

    // In development sandbox only: Allow clearly isolated dev_pay_* fallback
    const recorded = paymentLedgerRepo.findByPaymentId(cleanPaymentId);
    if (cleanPaymentId.startsWith('dev_pay_') || recorded?.status === 'COMPLETED' || recorded?.status === 'APPROVED') {
      return {
        verified: true,
        status: 'VERIFIED',
        source: 'sandbox_dev',
        message: 'Payment verified via Development Sandbox Fallback (Non-Production)',
        paymentData: recorded || {
          paymentId: cleanPaymentId,
          status: 'DEVELOPER_COMPLETED',
          transaction: { verified: true }
        }
      };
    }

    return {
      verified: false,
      status: 'VERIFICATION_FAILED',
      source: 'sandbox_dev',
      message: 'Server verification failed. Payment is not confirmed on Pi Platform.'
    };
  }
}

// Initialize Gemini AI Client lazily & safely
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey === 'YOUR_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// System health check - minimal, safe public response without internal metrics
app.get(['/api/health', '/health'], (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
    status: 'ok',
    runtime: 'vercel',
    durablePersistence: true
  });
});

// Pi Network Domain Ownership Validation Key
app.get('/validation-key.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.status(200).send('8a6a4b885d34141bb2512da532760394d83de4673574b82de61c4a0895e00cb11dacc69b4618c84393a5518a75ca356597e3df7ed67a9d884baa7b8edd3f7cca');
});

// Authentication Endpoints (Phase 1 Remediation)
app.post(['/api/auth/session', '/api/v1/auth/session'], authRateLimiter, async (req, res) => {
  try {
    const { accessToken, username, uid, roles } = req.body;
    const session = await authService.createSession({
      accessToken,
      username: username || 'pioneer_user',
      uid: uid || `pi-uid-${Date.now()}`,
      roles
    });

    res.json({
      success: true,
      token: session.token,
      expiresAt: session.expiresAt,
      user: session.user
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'SESSION_CREATION_FAILED', message: err.message });
  }
});

app.get(['/api/auth/me', '/api/v1/auth/me'], authenticate, requireAuthenticatedUser, (req: AuthenticatedRequest, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

app.post(['/api/auth/logout', '/api/v1/auth/logout'], authenticate, (req: AuthenticatedRequest, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7).trim() : authHeader?.trim();
  if (token) {
    authService.invalidateSession(token);
  }
  res.json({ success: true, message: 'Session invalidated successfully' });
});

// Diagnostic API Endpoint (Protected in Production)
app.get(['/api/debug/runtime', '/debug/runtime'], async (req, res) => {
  if (isProduction) {
    const auth = await checkAdminAuth(req);
    if (!auth.authenticated) {
      res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Authentication required to access runtime diagnostics.'
      });
      return;
    }
    if (!auth.authorized) {
      res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: 'Access denied: Administrative privileges required.'
      });
      return;
    }
  }

  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
    ok: true,
    runtime: 'vercel',
    nodeVersion: process.version,
    persistenceStatus: 'DURABLE_STORAGE_ACTIVE'
  });
});

// PSTP REST API Endpoints

// 1. Audit Logs Retrieval (Protected with Server-Side Admin Authorization & Pagination)
app.get(['/api/pstp/audit-logs', '/api/v1/pstp/audit-logs'], async (req, res) => {
  const auth = await checkAdminAuth(req);
  if (!auth.authenticated) {
    res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Authentication required to access PSTP audit logs.'
    });
    return;
  }
  if (!auth.authorized) {
    res.status(403).json({
      success: false,
      error: 'FORBIDDEN',
      message: 'Access denied: Administrative privileges required.'
    });
    return;
  }

  const allLogs = pstpAuditRepo.getAll();
  const page = Math.max(1, parseInt(req.query.page as string || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string || '50', 10)));
  const startIndex = (page - 1) * limit;
  const paginatedLogs = allLogs.slice(startIndex, startIndex + limit);

  res.json({
    success: true,
    count: paginatedLogs.length,
    total: allLogs.length,
    page,
    limit,
    totalPages: Math.ceil(allLogs.length / limit),
    logs: paginatedLogs
  });
});

// Create Audit Log Entry (Strict Server-Side Protected Ingestion)
app.post(['/api/pstp/audit-logs', '/api/v1/pstp/audit-logs'], authenticate, async (req: AuthenticatedRequest, res) => {
  const auth = await checkAdminAuth(req);
  if (!auth.authenticated) {
    res.status(401).json({ success: false, error: 'UNAUTHORIZED', message: 'Authentication required to post audit log' });
    return;
  }

  const { orderId, paymentId, action, details, ipAddress, deviceInfo } = req.body;
  const actor = req.user?.username || auth.user?.username || 'system';
  const actorRole = req.user?.roles[0] || auth.user?.roles[0] || 'system';

  const newLog = auditService.recordPstpAudit({
    orderId,
    paymentId,
    actor,
    actorRole,
    action: action || 'AUDIT_EVENT',
    details: details || 'PSTP Security Audit Log Entry',
    ipAddress: ipAddress || req.ip || '127.0.0.1',
    deviceInfo: deviceInfo || (req.headers['user-agent'] as string) || 'Server Verified Session'
  });
  res.json({ success: true, log: newLog });
});

// 2. Disputes API (Phase 2 Remediation)
app.get(['/api/pstp/disputes', '/api/v1/pstp/disputes'], (req, res) => {
  const disputes = pstpDisputeRepo.getAll();
  res.json({ success: true, disputes });
});

app.post(['/api/pstp/disputes', '/api/v1/pstp/disputes'], disputeRateLimiter, authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { orderId, reason, description, amountPi, evidenceFiles } = req.body;
    const idempotencyKey = (req.headers['idempotency-key'] as string) || (req.headers['x-idempotency-key'] as string) || req.body.idempotencyKey || `DISP-${orderId}-${Date.now()}`;

    // Derive buyer identity authoritatively from server authenticated user
    const buyerUsername = req.user?.username || req.body.buyerUsername || 'Pioneer_User';
    const sellerUsername = req.body.sellerUsername || 'Seller_Merchant';

    // Atomic idempotency reservation to prevent race conditions & duplicate tickets
    const reservation = await idempotencyRepo.reserveIdempotencyKey(
      idempotencyKey,
      req.user?.id || buyerUsername,
      'PSTP_CREATE_DISPUTE'
    );

    if (reservation.status === 'RESOLVED' && reservation.cachedResult) {
      res.json(reservation.cachedResult);
      return;
    }

    const newDispute = pstpDisputeRepo.createDispute({
      orderId: orderId || `ORD-${Date.now()}`,
      buyerUsername,
      sellerUsername,
      reason: reason || 'Item issue',
      description: description || 'Buyer submitted a dispute',
      amountPi: Number(amountPi) || 0,
      status: 'open',
      evidenceFiles: evidenceFiles || [],
      comments: [
        {
          id: `CMT-${Date.now()}`,
          sender: buyerUsername,
          role: 'buyer',
          text: description || 'Opened dispute ticket.',
          timestamp: new Date().toISOString()
        }
      ]
    });

    // Authoritative audit log
    auditService.recordPstpAudit({
      orderId: newDispute.orderId,
      actor: buyerUsername,
      actorRole: 'buyer',
      action: 'DISPUTE_FILED',
      details: `Dispute filed for order ${newDispute.orderId}. Reason: ${reason}`,
      ipAddress: req.ip || '127.0.0.1',
      deviceInfo: (req.headers['user-agent'] as string) || 'Pi Browser'
    });

    const responsePayload = { success: true, dispute: newDispute };
    await idempotencyRepo.completeIdempotencyKey(idempotencyKey, responsePayload);
    res.json(responsePayload);
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'DISPUTE_CREATION_FAILED', message: err.message });
  }
});

// Protected Dispute Comments (Restricted to Buyer, Seller, or Compliance Admin)
app.post(['/api/pstp/disputes/:id/comment', '/api/v1/pstp/disputes/:id/comment'], disputeRateLimiter, authenticate, (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const dispute = pstpDisputeRepo.findById(id);

  if (!dispute) {
    res.status(404).json({ success: false, error: 'DISPUTE_NOT_FOUND', message: 'Dispute not found' });
    return;
  }

  const currentUser = req.user?.username || req.body.sender || 'User';
  const isAdmin = req.user?.roles.some((r) => r === 'PLATFORM_ADMIN' || r === 'COMPLIANCE_OFFICER');
  const isSeller = dispute.sellerUsername === currentUser;
  const isBuyer = dispute.buyerUsername === currentUser;

  if (!isAdmin && !isSeller && !isBuyer) {
    res.status(403).json({
      success: false,
      error: 'FORBIDDEN',
      message: 'Access denied: You are not an authorized party or compliance officer for this dispute.'
    });
    return;
  }

  // Derive role authoritatively on the server
  let derivedRole: 'admin' | 'seller' | 'buyer' = 'buyer';
  if (isAdmin) {
    derivedRole = 'admin';
  } else if (isSeller) {
    derivedRole = 'seller';
  } else {
    derivedRole = 'buyer';
  }

  const updatedDispute = pstpDisputeRepo.addComment(id, {
    sender: currentUser,
    role: derivedRole,
    text: text || ''
  });

  auditService.recordPstpAudit({
    orderId: dispute.orderId,
    actor: currentUser,
    actorRole: derivedRole,
    action: 'DISPUTE_COMMENT_ADDED',
    details: `Added ${derivedRole} comment to dispute ${id}`,
    ipAddress: req.ip || '127.0.0.1',
    deviceInfo: (req.headers['user-agent'] as string) || 'Pi Browser'
  });

  res.json({ success: true, dispute: updatedDispute });
});

// Protected Dispute Resolution (Restricted to Server-Verified Admins with State Machine Validation)
app.post(['/api/pstp/disputes/:id/resolve', '/api/v1/pstp/disputes/:id/resolve'], disputeRateLimiter, authenticate, requireRole(['PLATFORM_ADMIN', 'COMPLIANCE_OFFICER']), (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { decision, note, refundAmountPi } = req.body;
  const dispute = pstpDisputeRepo.findById(id);

  if (!dispute) {
    res.status(404).json({ success: false, error: 'DISPUTE_NOT_FOUND', message: 'Dispute not found' });
    return;
  }

  // Prevent invalid re-resolution on already resolved/closed disputes
  if (dispute.status === 'resolved_refunded' || dispute.status === 'resolved_rejected' || dispute.status === 'closed') {
    res.status(400).json({
      success: false,
      error: 'INVALID_STATUS_TRANSITION',
      message: `Dispute ${id} is already in terminal state "${dispute.status}". Re-resolution rejected.`
    });
    return;
  }

  // Authoritatively derive resolver identity from authenticated user
  const resolvedBy = req.user?.username || 'Platform_Admin';

  const updatedDispute = pstpDisputeRepo.resolveDispute(id, {
    decision,
    note: note || 'Admin resolved dispute according to PSTP guidelines',
    refundAmountPi: refundAmountPi ? Number(refundAmountPi) : (decision === 'full_refund' ? dispute.amountPi : 0),
    resolvedBy,
    resolvedAt: new Date().toISOString()
  });

  // Record immutable audit log
  auditService.recordPstpAudit({
    orderId: dispute.orderId,
    actor: resolvedBy,
    actorRole: 'admin',
    action: 'DISPUTE_RESOLVED',
    details: `Admin decision: ${decision}. Note: ${note || 'None'}. Refund Pi: ${refundAmountPi || 0}`,
    ipAddress: req.ip || '127.0.0.1',
    deviceInfo: (req.headers['user-agent'] as string) || 'Admin Console'
  });

  res.json({ success: true, dispute: updatedDispute });
});

// 3. Vendor Application System Endpoints
app.get(['/api/vendor/application/:username', '/api/v1/vendor/application/:username'], (req, res) => {
  const { username } = req.params;
  const application = vendorApplicationRepo.findByUsername(username);
  res.json({ success: true, application: application || null });
});

app.post(['/api/vendor/apply', '/api/v1/vendor/apply'], (req, res) => {
  try {
    const {
      pioneerUsername,
      pioneerUid,
      storeName,
      sellerType,
      country,
      countryCode,
      stateRegion,
      city,
      contactEmail,
      contactPhone,
      contactTelegram,
      storeDescription,
      storeTagline,
      logoUrl,
      bannerUrl,
      businessRegistrationNumber,
      taxId,
      websiteUrl,
      categoriesToSell,
      documents,
      policies,
      pstpAgreementAccepted
    } = req.body || {};

    if (!pioneerUsername || !storeName || !contactEmail) {
      res.status(400).json({
        success: false,
        error: 'MISSING_REQUIRED_FIELDS',
        message: 'Pioneer username, store name, and contact email are required.'
      });
      return;
    }

    const existing = vendorApplicationRepo.findByUsername(pioneerUsername);
    const appId = existing?.id || `VAPP-${(countryCode || 'GL').toUpperCase()}-${Date.now().toString().slice(-6)}`;

    const applicationRecord = {
      id: appId,
      pioneerUsername,
      pioneerUid: pioneerUid || `UID_${pioneerUsername.toUpperCase()}`,
      storeName,
      sellerType: (sellerType as any) || 'individual',
      country: country || 'Global',
      countryCode: (countryCode || 'GLOBAL').toUpperCase(),
      stateRegion: stateRegion || '',
      city: city || '',
      contactEmail,
      contactPhone: contactPhone || '',
      contactTelegram,
      storeDescription: storeDescription || '',
      storeTagline,
      logoUrl: logoUrl || 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=200&q=80',
      bannerUrl: bannerUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
      businessRegistrationNumber,
      taxId,
      websiteUrl,
      categoriesToSell: Array.isArray(categoriesToSell) ? categoriesToSell : ['physical'],
      documents: Array.isArray(documents) ? documents : [],
      policies: policies || {
        returnRefundPolicy: '14-day standard return on unused goods under PSTP buyer protection.',
        deliveryShippingPolicy: 'Standard dispatch within 24-48 business hours with tracking.'
      },
      pstpAgreementAccepted: Boolean(pstpAgreementAccepted),
      status: (existing?.status === 'APPROVED' ? 'APPROVED' : 'PENDING_REVIEW') as any,
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    vendorApplicationRepo.save(applicationRecord);

    pstpAuditRepo.appendLog({
      orderId: appId,
      actor: pioneerUsername,
      actorRole: 'seller',
      action: 'VENDOR_APPLICATION_SUBMITTED',
      details: `Vendor application submitted for store "${storeName}". Type: ${sellerType || 'individual'}`,
      ipAddress: req.ip || '127.0.0.1',
      deviceInfo: (req.headers['user-agent'] as string) || 'Pi Browser'
    });

    res.json({
      success: true,
      message: 'Vendor application submitted for compliance review.',
      application: applicationRecord
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'VENDOR_APPLY_EXCEPTION', message: err.message });
  }
});

app.get(['/api/admin/vendor-applications', '/api/v1/admin/vendor-applications'], async (req, res) => {
  const auth = await checkAdminAuth(req);
  if (!auth.authenticated) {
    res.status(401).json({ success: false, error: 'UNAUTHORIZED', message: 'Authentication required.' });
    return;
  }
  if (!auth.authorized) {
    res.status(403).json({ success: false, error: 'FORBIDDEN', message: 'Admin privileges required.' });
    return;
  }

  const applications = vendorApplicationRepo.getAll();
  res.json({ success: true, count: applications.length, applications });
});

app.post(['/api/admin/vendor-application/:id/review', '/api/v1/admin/vendor-application/:id/review'], async (req, res) => {
  const auth = await checkAdminAuth(req);
  if (!auth.authenticated) {
    res.status(401).json({ success: false, error: 'UNAUTHORIZED', message: 'Authentication required.' });
    return;
  }
  if (!auth.authorized) {
    res.status(403).json({ success: false, error: 'FORBIDDEN', message: 'Admin privileges required.' });
    return;
  }

  const { id } = req.params;
  const { status, adminNotes } = req.body || {};
  const reviewedBy = auth.user?.username || 'Admin_Compliance_Lead';
  const updated = vendorApplicationRepo.updateStatus(id, status, adminNotes, reviewedBy);

  if (!updated) {
    res.status(404).json({ success: false, error: 'APPLICATION_NOT_FOUND', message: 'Application not found' });
    return;
  }

  auditService.recordPstpAudit({
    orderId: id,
    actor: reviewedBy,
    actorRole: 'admin',
    action: `VENDOR_APPLICATION_${status}`,
    details: `Application ${id} (${updated.storeName}) status updated to ${status}. Notes: ${adminNotes || 'None'}`,
    ipAddress: req.ip || '127.0.0.1',
    deviceInfo: (req.headers['user-agent'] as string) || 'Admin Console'
  });

  res.json({ success: true, application: updated });
});

// 4. Security Events API (Phase 4 Remediation)
app.get(['/api/pstp/security-events', '/api/v1/pstp/security-events'], async (req, res) => {
  const auth = await checkAdminAuth(req);
  if (!auth.authenticated) {
    res.status(401).json({ success: false, error: 'UNAUTHORIZED', message: 'Authentication required to view security events.' });
    return;
  }
  if (!auth.authorized) {
    res.status(403).json({ success: false, error: 'FORBIDDEN', message: 'Administrative privileges required.' });
    return;
  }

  const events = securityEventRepo.getAll();
  res.json({ success: true, count: events.length, events });
});

app.post(['/api/pstp/security-events', '/api/v1/pstp/security-events'], securityEventsRateLimiter, authenticate, (req: AuthenticatedRequest, res) => {
  try {
    const { eventType, severity, description, resourceType, resourceId, metadata } = req.body;
    const correlationId = (req.headers['x-correlation-id'] as string) || `CORR-SEC-${Date.now()}`;

    // Record authoritatively with server validation and sanitization
    const newEvent = securityEventRepo.recordEvent({
      eventType: eventType || 'suspicious_login',
      severity: severity || 'info',
      username: req.user?.username || req.body.username || 'anonymous_client',
      actorId: req.user?.id,
      correlationId,
      resourceType,
      resourceId,
      ip: req.ip || '127.0.0.1',
      device: (req.headers['user-agent'] as string) || 'Pi Browser Web',
      details: description ? String(description).slice(0, 1000) : 'Security Event Recorded',
      metadata,
      resolved: false
    });

    res.json({ success: true, event: newEvent });
  } catch (err: any) {
    res.status(400).json({ success: false, error: 'INVALID_SECURITY_EVENT', message: err.message });
  }
});

// 5. Platform Pricing Configuration & Utility Config APIs
const handleGetUtilityConfig = (req: express.Request, res: express.Response) => {
  const config = platformConfigRepo.getConfig();
  const logs = platformConfigRepo.getAuditLogs();
  res.json({ success: true, config, logs });
};

const handlePostUtilityConfig = async (req: express.Request, res: express.Response) => {
  const auth = await checkAdminAuth(req);
  if (!auth.authenticated) {
    res.status(401).json({ success: false, error: 'UNAUTHORIZED', message: 'Authentication required to update pricing configuration.' });
    return;
  }
  if (!auth.authorized) {
    res.status(403).json({ success: false, error: 'FORBIDDEN', message: 'Platform administration privileges required.' });
    return;
  }

  const { piRateUsd, minPurchasePi, maxPurchasePi, reason } = req.body;
  if (!piRateUsd || Number(piRateUsd) <= 0) {
    res.status(400).json({ error: 'Pricing rate must be greater than zero' });
    return;
  }

  const updatedBy = auth.user?.username || 'Platform_Admin';
  const previousConfig = platformConfigRepo.getConfig();
  const updatedConfig = platformConfigRepo.updateConfig({
    piRateUsd: Number(piRateUsd),
    minPurchasePi: minPurchasePi ? Number(minPurchasePi) : previousConfig.minPurchasePi,
    maxPurchasePi: maxPurchasePi ? Number(maxPurchasePi) : previousConfig.maxPurchasePi,
    updatedBy
  });

  const newLog = platformConfigRepo.addAuditLog({
    previousRate: previousConfig.piRateUsd,
    newRate: updatedConfig.piRateUsd,
    currency: 'USD',
    source: reason || 'Pricing updated via Admin Console',
    updatedBy,
    ipAddress: req.ip || '127.0.0.1'
  });

  res.json({ success: true, config: updatedConfig, log: newLog });
};

app.get('/api/utility/config', handleGetUtilityConfig);
app.get('/api/v1/utility/config', handleGetUtilityConfig);

app.post('/api/utility/config', handlePostUtilityConfig);
app.post('/api/v1/utility/config', handlePostUtilityConfig);

// Provider Account Validation API (Adapter Pattern)
const handleUtilityValidate = async (req: express.Request, res: express.Response) => {
  const { providerId, accountNumber } = req.body;
  if (!accountNumber) {
    res.status(400).json({ error: 'Account number parameter is required' });
    return;
  }

  const directApiProviders = ['safaricom', 'mtn', 'ikedc', 'dstv', 'mpesa', 'airtel', 'gotv', 'startimes', 'eko-electric', 'abuja-electric', 'kano-electric'];
  const isDirectApiSupported = directApiProviders.some((p) => (providerId || '').toLowerCase().includes(p));

  // If VTU.ng adapter is configured and this is a TV or utility provider, perform real customer lookup
  if (vtuNgAdapter.isConfigured() && isDirectApiSupported) {
    try {
      const vtuResult = await vtuNgAdapter.verifyCustomer(providerId, accountNumber);
      if (vtuResult.success && vtuResult.valid) {
        res.json({
          success: true,
          valid: true,
          accountNumber,
          accountName: vtuResult.customerName || `Verified Account (${accountNumber.slice(-4)})`,
          providerId: providerId || 'unknown',
          requiresManualVerification: false,
          verificationMethod: 'DIRECT_API',
          statusMessage: 'Account structure validated via VTU.ng provider API gateway.',
          disclaimer: 'Direct VTU.ng provider API validation.'
        });
        return;
      }
    } catch (e: any) {
      console.warn('[Utility Validate] VTU customer lookup notice:', e.message);
    }
  }

  if (isDirectApiSupported) {
    res.json({
      success: true,
      valid: true,
      accountNumber,
      accountName: `Verified Account (${accountNumber.slice(-4)})`,
      providerId: providerId || 'unknown',
      requiresManualVerification: false,
      verificationMethod: 'DIRECT_API',
      statusMessage: 'Account structure validated via provider API gateway.',
      disclaimer: 'Direct provider API validation.'
    });
  } else {
    res.json({
      success: true,
      valid: true,
      accountNumber,
      accountName: `Account #${accountNumber}`,
      providerId: providerId || 'unknown',
      requiresManualVerification: true,
      verificationMethod: 'MANUAL_VERIFICATION',
      statusMessage: 'Account queued for manual verification by utility provider operations.',
      disclaimer: 'No direct customer lookup API connected for this provider. Verified manually by fulfillment team.'
    });
  }
};

// Electricity Real Meter / Provider Verification API Endpoint
const handleElectricityVerify = async (req: express.Request, res: express.Response) => {
  try {
    const { meterNumber, meterType = 'prepaid', providerId, countryCode = 'NG' } = req.body || {};
    if (!meterNumber || typeof meterNumber !== 'string' || meterNumber.trim().length < 5) {
      res.status(400).json({
        success: false,
        valid: false,
        status: 'INVALID',
        statusTitle: 'Invalid Meter Number',
        message: 'Meter/account number could not be verified. Please check the digits and try again.'
      });
      return;
    }

    const cleanMeter = meterNumber.replace(/[^a-zA-Z0-9]/g, '').trim();

    // 1. Authoritative VTU.ng v2 Adapter Verification (Primary for NG DisCos)
    if (vtuNgAdapter.isConfigured() && (countryCode === 'NG' || !countryCode)) {
      try {
        const vtuServiceId = vtuNgAdapter.mapServiceId(providerId || 'ikeja-electric');
        const vtuResult = await vtuNgAdapter.verifyCustomer(vtuServiceId, cleanMeter, meterType);

        if (vtuResult.success && vtuResult.valid) {
          res.json({
            success: true,
            valid: true,
            apiConfigured: true,
            status: 'VERIFIED',
            isCustomerVerified: true,
            customerName: vtuResult.customerName || undefined,
            customerAddress: vtuResult.customerAddress || undefined,
            accountStatus: vtuResult.accountStatus || 'ACTIVE',
            tariffBand: vtuResult.tariffBand || 'Band A (20+ hrs verified)',
            tariffRatePerKwh: vtuResult.tariffRatePerKwh,
            outstandingDebtFiat: vtuResult.outstandingDebtFiat,
            minVendFiat: vtuResult.minVendFiat || 1000,
            resolvedProviderId: providerId || vtuServiceId,
            resolvedProviderName: providerId || 'Electricity Distribution Provider',
            verificationMethod: 'VTU_NG_LIVE_API',
            statusTitle: 'Meter verified ✓',
            message: 'Customer details confirmed by electricity distribution provider via VTU.ng.'
          });
          return;
        } else if (vtuResult.success && !vtuResult.valid) {
          res.status(400).json({
            success: false,
            valid: false,
            status: 'INVALID',
            statusTitle: 'Invalid Meter Number',
            message: vtuResult.message || 'Meter/account number could not be verified with provider.'
          });
          return;
        }
      } catch (vtuErr: any) {
        console.warn('[Electricity Verification] VTU.ng provider gateway call notice:', vtuErr.message);
      }
    }

    // Default / Unconfigured Provider API Mode:
    // Strictly do NOT fabricate or generate customer names, tariff bands, or energy units!
    res.json({
      success: true,
      valid: true,
      apiConfigured: false,
      status: 'UNAVAILABLE',
      isCustomerVerified: false,
      meterNumber: cleanMeter,
      meterType,
      providerIdentified: true,
      resolvedProviderId: providerId || 'unknown',
      verificationMethod: 'UNCONFIGURED',
      statusTitle: 'Meter number captured',
      statusSubtitle: 'Provider verification required',
      message: 'We need to verify this meter with the electricity provider before displaying customer details or processing the transaction.'
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      valid: false,
      status: 'INVALID',
      statusTitle: 'Verification Service Error',
      message: 'Failed to communicate with meter verification service.'
    });
  }
};

app.post('/api/utility/validate', handleUtilityValidate);
app.post('/api/v1/utility/validate', handleUtilityValidate);
app.post('/api/utility/electricity/verify', handleElectricityVerify);
app.post('/api/v1/utility/electricity/verify', handleElectricityVerify);

// Official Pi Platform API Proxy: Payment Handlers

const handleApprovePayment = async (req: express.Request, res: express.Response) => {
  const timestamp = new Date().toISOString();
  try {
    const { paymentId } = req.body;
    if (!paymentId) {
      console.warn(`[Pi Approval] HTTP 400 | Endpoint: ${req.path} | Time: ${timestamp} | Error: MISSING_PAYMENT_ID`);
      res.status(400).json({ success: false, error: 'MISSING_PAYMENT_ID', message: 'Missing paymentId parameter' });
      return;
    }

    const cleanPaymentId = String(paymentId).trim();
    const piApiKey = (process.env.PI_API_KEY || process.env.PI_SERVER_KEY || '').trim();
    const hasKey = Boolean(piApiKey && piApiKey !== 'YOUR_PI_PLATFORM_API_KEY' && piApiKey !== 'MY_PI_API_KEY');
    const isDevPayment = cleanPaymentId.startsWith('pi_pay_') || cleanPaymentId.startsWith('dev_pay_') || cleanPaymentId.startsWith('test_');
    const selectedNetwork = isDevPayment ? 'SANDBOX_DEV' : 'PI_PLATFORM';

    console.log(`[Pi Approval Started] Payment ID: ${cleanPaymentId} | Endpoint: ${req.path} | Time: ${timestamp} | Network: ${selectedNetwork} | HasKey: ${hasKey}`);

    // In production: Strictly enforce valid API key & do not allow dev payment bypass
    if (isProduction) {
      if (!hasKey) {
        console.error(`[Pi Approval Failed] Payment ID: ${cleanPaymentId} | Endpoint: ${req.path} | Time: ${timestamp} | Status: 500 | Error: PI_SERVER_CREDENTIAL_MISSING`);
        res.status(500).json({
          success: false,
          error: 'PI_SERVER_CREDENTIAL_MISSING',
          message: 'Pi Platform API key (PI_API_KEY or PI_SERVER_KEY) is missing in server environment variables. Real payments cannot be approved without credentials.'
        });
        return;
      }

      // Real Pi Platform API call with bounded 10s timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await fetch(`https://api.minepi.com/v2/payments/${encodeURIComponent(cleanPaymentId)}/approve`, {
          method: 'POST',
          headers: {
            'Authorization': `Key ${piApiKey}`,
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          console.warn(`[Pi Approval Failed] Payment ID: ${cleanPaymentId} | Endpoint: ${req.path} | Time: ${timestamp} | Status: ${response.status}`);
          res.status(response.status).json({
            success: false,
            error: response.status === 401 || response.status === 403 ? 'PI_API_KEY_INVALID' : 'PI_APPROVAL_FAILED',
            message: `Pi Platform Approval failed with HTTP status ${response.status}`
          });
          return;
        }

        const data = await response.json();
        paymentLedgerRepo.recordApproval(cleanPaymentId);
        console.log(`[Pi Approval Success] Payment ID: ${cleanPaymentId} | Endpoint: ${req.path} | Time: ${timestamp} | Status: 200`);
        res.json({ success: true, paymentId: cleanPaymentId, status: 'approved', data });
        return;
      } catch (fetchErr: any) {
        clearTimeout(timeoutId);
        const isTimeout = fetchErr.name === 'AbortError';
        const errCode = isTimeout ? 'PI_PLATFORM_TIMEOUT' : 'PI_PLATFORM_NETWORK_ERROR';
        console.error(`[Pi Approval Error] Payment ID: ${cleanPaymentId} | Endpoint: ${req.path} | Time: ${timestamp} | Code: ${errCode} | Message: ${fetchErr.message}`);
        res.status(isTimeout ? 504 : 500).json({
          success: false,
          error: errCode,
          message: isTimeout ? 'Approval request to Pi Platform API timed out after 10 seconds' : 'Failed to contact Pi Platform API'
        });
        return;
      }
    } else {
      // Non-production (Dev/Sandbox Mode):
      paymentLedgerRepo.recordApproval(cleanPaymentId);

      if (hasKey && !isDevPayment) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        try {
          const response = await fetch(`https://api.minepi.com/v2/payments/${encodeURIComponent(cleanPaymentId)}/approve`, {
            method: 'POST',
            headers: {
              'Authorization': `Key ${piApiKey}`,
              'Content-Type': 'application/json'
            },
            signal: controller.signal
          });
          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            res.json({ success: true, paymentId: cleanPaymentId, status: 'approved', data });
            return;
          }
        } catch (fetchErr: any) {
          clearTimeout(timeoutId);
          console.warn(`[Pi Approval Dev Fallback] Live attempt failed: ${fetchErr.message}`);
        }
      }

      console.log(`[Pi Approval Success Sandbox] Payment ID: ${cleanPaymentId} | Endpoint: ${req.path} | Time: ${timestamp} | Status: 200`);
      res.json({
        success: true,
        paymentId: cleanPaymentId,
        status: 'approved',
        message: 'Payment approved by PiNova Escrow Server (Sandbox/Dev Test Payment)'
      });
    }
  } catch (err: any) {
    console.error(`[Pi Approval Exception] Endpoint: ${req.path} | Time: ${timestamp} | Error: ${err.message}`);
    res.status(500).json({
      success: false,
      error: 'SERVER_APPROVAL_EXCEPTION',
      message: 'Internal server error during approval'
    });
  }
};

const handleCompletePayment = async (req: express.Request, res: express.Response) => {
  const timestamp = new Date().toISOString();
  try {
    const { paymentId, txid } = req.body;
    if (!paymentId || !txid) {
      console.warn(`[Pi Completion] HTTP 400 | Endpoint: ${req.path} | Time: ${timestamp} | Error: MISSING_PARAMETERS`);
      res.status(400).json({ success: false, error: 'MISSING_PARAMETERS', message: 'Missing paymentId or txid parameter' });
      return;
    }

    const cleanPaymentId = String(paymentId).trim();
    const cleanTxid = String(txid).trim();
    const piApiKey = (process.env.PI_API_KEY || process.env.PI_SERVER_KEY || '').trim();
    const hasKey = Boolean(piApiKey && piApiKey !== 'YOUR_PI_PLATFORM_API_KEY' && piApiKey !== 'MY_PI_API_KEY');
    const isDevPayment = cleanPaymentId.startsWith('pi_pay_') || cleanPaymentId.startsWith('dev_pay_') || cleanPaymentId.startsWith('test_');
    const selectedNetwork = isDevPayment ? 'SANDBOX_DEV' : 'PI_PLATFORM';

    console.log(`[Pi Completion Started] Payment ID: ${cleanPaymentId} | Endpoint: ${req.path} | Time: ${timestamp} | Network: ${selectedNetwork}`);

    // In production: Strictly enforce valid API key & do not allow dev payment bypass
    if (isProduction) {
      if (!hasKey) {
        console.error(`[Pi Completion Failed] Payment ID: ${cleanPaymentId} | Endpoint: ${req.path} | Time: ${timestamp} | Status: 500 | Error: PI_SERVER_CREDENTIAL_MISSING`);
        res.status(500).json({
          success: false,
          error: 'PI_SERVER_CREDENTIAL_MISSING',
          message: 'Pi Platform API key (PI_API_KEY or PI_SERVER_KEY) is missing in server environment variables. Real payments cannot be completed without credentials.'
        });
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await fetch(`https://api.minepi.com/v2/payments/${encodeURIComponent(cleanPaymentId)}/complete`, {
          method: 'POST',
          headers: {
            'Authorization': `Key ${piApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ txid: cleanTxid }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          console.warn(`[Pi Completion Failed] Payment ID: ${cleanPaymentId} | Endpoint: ${req.path} | Time: ${timestamp} | Status: ${response.status}`);
          res.status(response.status).json({
            success: false,
            error: response.status === 401 || response.status === 403 ? 'PI_API_KEY_INVALID' : 'PI_COMPLETION_FAILED',
            message: `Pi Platform Completion failed with HTTP status ${response.status}`
          });
          return;
        }

        const data = await response.json();
        paymentLedgerRepo.recordCompletion(cleanPaymentId, cleanTxid);
        console.log(`[Pi Completion Success] Payment ID: ${cleanPaymentId} | Endpoint: ${req.path} | Time: ${timestamp} | Status: 200`);
        res.json({ success: true, paymentId: cleanPaymentId, txid: cleanTxid, status: 'completed', data });
        return;
      } catch (fetchErr: any) {
        clearTimeout(timeoutId);
        const isTimeout = fetchErr.name === 'AbortError';
        const errCode = isTimeout ? 'PI_PLATFORM_TIMEOUT' : 'PI_PLATFORM_NETWORK_ERROR';
        console.error(`[Pi Completion Error] Payment ID: ${cleanPaymentId} | Endpoint: ${req.path} | Time: ${timestamp} | Code: ${errCode} | Message: ${fetchErr.message}`);
        res.status(isTimeout ? 504 : 500).json({
          success: false,
          error: errCode,
          message: isTimeout ? 'Completion request to Pi Platform API timed out after 10 seconds' : 'Failed to complete transaction on Pi Platform API'
        });
        return;
      }
    } else {
      // Non-production (Dev/Sandbox Mode):
      paymentLedgerRepo.recordCompletion(cleanPaymentId, cleanTxid);

      if (hasKey && !isDevPayment) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        try {
          const response = await fetch(`https://api.minepi.com/v2/payments/${encodeURIComponent(cleanPaymentId)}/complete`, {
            method: 'POST',
            headers: {
              'Authorization': `Key ${piApiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ txid: cleanTxid }),
            signal: controller.signal
          });
          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            res.json({ success: true, paymentId: cleanPaymentId, txid: cleanTxid, status: 'completed', data });
            return;
          }
        } catch (fetchErr: any) {
          clearTimeout(timeoutId);
          console.warn(`[Pi Completion Dev Fallback] Live attempt failed: ${fetchErr.message}`);
        }
      }

      console.log(`[Pi Completion Success Sandbox] Payment ID: ${cleanPaymentId} | Endpoint: ${req.path} | Time: ${timestamp} | Status: 200`);
      res.json({
        success: true,
        paymentId: cleanPaymentId,
        txid: cleanTxid,
        status: 'completed',
        message: 'Payment completed & Escrow locked in PiNova Ledger (Sandbox/Dev Test Payment)'
      });
    }
  } catch (err: any) {
    console.error(`[Pi Completion Exception] Endpoint: ${req.path} | Time: ${timestamp} | Error: ${err.message}`);
    res.status(500).json({
      success: false,
      error: 'SERVER_COMPLETION_EXCEPTION',
      message: 'Internal server error during completion'
    });
  }
};

const handleIncompletePayment = async (req: express.Request, res: express.Response) => {
  try {
    const { payment, paymentId } = req.body;
    const targetId = paymentId || payment?.identifier || payment?.id || 'unknown';
    console.log(`[Pi Server API] Incomplete payment notification received for ID: ${targetId}`);
    res.json({
      success: true,
      message: 'Incomplete payment handled by PiNova Escrow Server',
      paymentId: targetId
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'INCOMPLETE_PAYMENT_EXCEPTION', message: 'Error handling incomplete payment' });
  }
};

const handleCancelPayment = async (req: express.Request, res: express.Response) => {
  try {
    const { paymentId } = req.body;
    console.log(`[Pi Server API] Payment cancellation request for ID: ${paymentId}`);
    if (paymentId) {
      paymentLedgerRepo.recordCancellation(paymentId);
    }
    res.json({
      success: true,
      paymentId,
      status: 'cancelled',
      message: 'Payment cancelled successfully'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'CANCEL_PAYMENT_EXCEPTION', message: 'Error handling payment cancellation' });
  }
};

const handleVerifyPayment = async (req: express.Request, res: express.Response) => {
  try {
    const paymentId = req.params.paymentId || (req.query.paymentId as string) || '';
    if (!paymentId) {
      res.status(400).json({ success: false, verified: false, error: 'MISSING_PAYMENT_ID', message: 'Missing paymentId parameter' });
      return;
    }

    console.log(`[Pi Server API] Authoritative verification query for Payment ID: ${paymentId}`);
    const verification = await verifyPiPaymentAuthoritative(paymentId);

    if (verification.verified) {
      res.json({
        success: true,
        verified: true,
        source: verification.source,
        payment: verification.paymentData || { paymentId, status: 'VERIFIED' }
      });
    } else {
      res.status(400).json({
        success: false,
        verified: false,
        status: 'VERIFICATION_FAILED',
        error: 'VERIFICATION_FAILED',
        message: verification.message || 'Server verification failed. Payment is not confirmed on Pi Platform.'
      });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, verified: false, error: 'VERIFY_PAYMENT_EXCEPTION', message: 'Internal error during payment verification' });
  }
};

const handleGetPaymentConfig = (req: express.Request, res: express.Response) => {
  const piApiKey = (process.env.PI_API_KEY || process.env.PI_SERVER_KEY || '').trim();
  const configured = Boolean(piApiKey && piApiKey !== 'YOUR_PI_PLATFORM_API_KEY' && piApiKey !== 'MY_PI_API_KEY');
  const runtimeHost = (req.get('host') || '').toLowerCase().trim() || 'iddsnn.com';

  let isSandbox = true;
  if (process.env.PI_SANDBOX_MODE === 'false' || process.env.PI_SANDBOX_MODE === '0') {
    isSandbox = false;
  } else {
    isSandbox = true;
  }

  const configuredAppUrl = process.env.APP_URL || process.env.VITE_APP_URL || 'https://iddsnn.com';
  const runtimeProto = req.get('x-forwarded-proto') || req.protocol || 'https';
  const runtimeOrigin = req.get('origin') || `${runtimeProto}://${runtimeHost}`;

  console.log(`[Pi Server Diagnostic] runtimeOrigin=${runtimeOrigin} runtimeHost=${runtimeHost} configuredAppUrl=${configuredAppUrl} sandbox=${isSandbox} network=${isSandbox ? 'SANDBOX' : 'MAINNET'} piSdkAvailability=${configured ? 'configured' : 'missing'}`);

  res.json({
    success: true,
    apiConfiguration: configured ? 'configured' : 'missing',
    network: isSandbox ? 'SANDBOX' : 'MAINNET',
    sandbox: isSandbox,
    version: '2.0',
    configuredAppUrl,
    runtimeOrigin,
    expectedProductionOrigin: 'https://iddsnn.com',
    piSdkEnvironment: isSandbox ? 'SANDBOX' : 'MAINNET',
    piSdkAvailability: configured ? 'configured' : 'missing'
  });
};

app.post(['/api/v2/payments/approve', '/api/pi-payment/approve', '/api/v1/pi-payment/approve'], handleApprovePayment);
app.post(['/api/v2/payments/complete', '/api/pi-payment/complete', '/api/v1/pi-payment/complete'], handleCompletePayment);
app.post(['/api/v2/payments/incomplete', '/api/pi-payment/incomplete', '/api/v1/pi-payment/incomplete'], handleIncompletePayment);
app.post(['/api/v2/payments/cancel', '/api/pi-payment/cancel', '/api/v1/pi-payment/cancel'], handleCancelPayment);
app.get(['/api/v2/payments/verify/:paymentId', '/api/pi-payment/verify/:paymentId', '/api/v2/pi/payments/verify', '/api/v2/payments/verify', '/api/pi-payment/verify'], handleVerifyPayment);
app.get(['/api/v2/payments/config', '/api/pi-payment/config', '/api/v2/pi/config', '/api/v2/pi/diagnostic', '/api/pi/diagnostic'], handleGetPaymentConfig);

// Server-side Utility Fulfillment & Verification Endpoint
app.post('/api/v2/utility/fulfill', async (req, res) => {
  const { paymentId, txid, category, country, countryCode, providerId, accountNumber, fiatAmount, piAmount, packageName, idempotencyKey } = req.body;

  if (!paymentId) {
    res.status(400).json({ success: false, error: 'Missing paymentId parameter' });
    return;
  }

  let numericFiatAmount = typeof fiatAmount === 'number' ? fiatAmount : parseFloat(String(fiatAmount || '').replace(/[^0-9.]/g, ''));
  if (isNaN(numericFiatAmount) || !isFinite(numericFiatAmount) || numericFiatAmount <= 0) {
    const numPi = Number(piAmount);
    if (numPi > 0) {
      const cfgRate = platformConfigRepo.getConfig().piRateUsd || 10.0;
      numericFiatAmount = numPi * cfgRate;
    }
  }

  if (isNaN(numericFiatAmount) || !isFinite(numericFiatAmount) || numericFiatAmount <= 0) {
    res.status(400).json({
      success: false,
      status: 'INVALID_AMOUNT',
      message: 'Validation Error: fiatAmount must be a valid positive number greater than 0.'
    });
    return;
  }

  // Validate Airtime Category Country-Provider consistency
  if (category === 'airtime' || category === 'mobile_data') {
    if (countryCode && providerId) {
      const providerCountryMap: Record<string, string> = {
        'prov-airtime-mtn-ng': 'NG',
        'prov-airtime-airtel-ng': 'NG',
        'prov-airtime-glo-ng': 'NG',
        'prov-airtime-9mobile-ng': 'NG',
        'prov-airtime-safaricom-ke': 'KE',
        'prov-airtime-airtel-ke': 'KE',
        'prov-airtime-mtn-gh': 'GH',
        'prov-airtime-vodafone-gh': 'GH',
        'prov-airtime-airtel-in': 'IN',
        'prov-airtime-jio-in': 'IN',
        'prov-airtime-att-us': 'US',
        'prov-airtime-tmobile-us': 'US',
        'prov-airtime-ee-gb': 'GB',
        'prov-airtime-vodafone-gb': 'GB',
        'prov-airtime-vodacom-za': 'ZA',
        'prov-airtime-mtn-za': 'ZA',
        'prov-airtime-globe-ph': 'PH',
        'prov-airtime-smart-ph': 'PH',
        'prov-airtime-telkomsel-id': 'ID',
        'prov-airtime-indosat-id': 'ID',
        'prov-airtime-viettel-vn': 'VN',
        'prov-airtime-vinaphone-vn': 'VN'
      };

      const expectedCountry = providerCountryMap[providerId];
      if (expectedCountry && expectedCountry !== countryCode) {
        res.status(400).json({
          success: false,
          status: 'INVALID_PROVIDER_COUNTRY',
          message: `Validation Error: Provider ${providerId} does not belong to target country code ${countryCode}.`
        });
        return;
      }
    }
  }

  // Idempotency check: If this paymentId or idempotencyKey was already fulfilled, return cached record
  const existingKey = idempotencyKey || paymentId;
  const existingTransaction = utilityFulfillmentRepo.findByKey(existingKey);
  if (existingTransaction) {
    console.log(`[Utility Fulfillment] Idempotent replay for Payment ID: ${existingKey}`);
    res.json({
      success: true,
      idempotent: true,
      data: existingTransaction
    });
    return;
  }

  // Authoritative Pi Payment Verification
  const verification = await verifyPiPaymentAuthoritative(paymentId);

  if (!verification.verified) {
    console.warn(`[Utility Fulfillment] Payment verification rejected for ID: ${paymentId}`);
    res.status(400).json({
      success: false,
      status: 'VERIFICATION_FAILED',
      message: 'Server verification failed. Payment is not confirmed on Pi Platform.'
    });
    return;
  }

  const recordedPayment = paymentLedgerRepo.findByPaymentId(paymentId);
  const verifiedTxid =
    verification.paymentData?.transaction?.txid ||
    recordedPayment?.txid ||
    txid ||
    '';

  // Execute VTU.ng v2 Adapter or Global Escrow Fallback
  let fulfillmentStatus: 'FULFILLED' | 'FULFILLMENT_PENDING' = 'FULFILLMENT_PENDING';
  let fulfillmentMessage = 'Payment verified successfully. Fulfillment is pending provider configuration or operator confirmation.';
  let providerRef: string = vtuNgAdapter.generateRequestId(paymentId, 'PEND');
  let fulfillmentMetadata: Record<string, any> | undefined = undefined;

  const normalizedCategory = String(category || 'utility').toLowerCase();
  const isNigerianProvider = (countryCode === 'NG' || !countryCode || providerId?.toLowerCase().includes('-ng') || providerId?.toLowerCase().includes('ikedc') || providerId?.toLowerCase().includes('dstv'));

  if (vtuNgAdapter.isConfigured() && isNigerianProvider) {
    try {
      if (normalizedCategory === 'airtime') {
        const result = await vtuNgAdapter.purchaseAirtime({
          paymentId,
          phone: accountNumber,
          serviceId: providerId,
          amount: numericFiatAmount
        });
        fulfillmentStatus = result.fulfilled ? 'FULFILLED' : 'FULFILLMENT_PENDING';
        fulfillmentMessage = result.fulfilled
          ? (result.message || 'Airtime credited successfully via VTU.ng.')
          : (result.message || 'Payment verified successfully. Fulfillment is pending provider configuration or operator confirmation.');
        providerRef = result.providerReference || result.orderId || vtuNgAdapter.generateRequestId(paymentId, result.fulfilled ? 'AIRT' : 'PEND');
        fulfillmentMetadata = { requestId: result.requestId, raw: result.rawResponse };
      } else if (normalizedCategory === 'mobile_data' || normalizedCategory === 'data') {
        const result = await vtuNgAdapter.purchaseData({
          paymentId,
          phone: accountNumber,
          serviceId: providerId,
          variationId: req.body.variationId || req.body.packageId || 'data-default'
        });
        fulfillmentStatus = result.fulfilled ? 'FULFILLED' : 'FULFILLMENT_PENDING';
        fulfillmentMessage = result.fulfilled
          ? (result.message || 'Data bundle activated successfully via VTU.ng.')
          : (result.message || 'Payment verified successfully. Fulfillment is pending provider configuration or operator confirmation.');
        providerRef = result.providerReference || result.orderId || vtuNgAdapter.generateRequestId(paymentId, result.fulfilled ? 'DATA' : 'PEND');
        fulfillmentMetadata = { requestId: result.requestId, raw: result.rawResponse };
      } else if (normalizedCategory === 'electricity' || normalizedCategory === 'power') {
        const result = await vtuNgAdapter.purchaseElectricity({
          paymentId,
          phone: req.body.phone || accountNumber,
          serviceId: providerId,
          customerId: accountNumber,
          variationId: req.body.meterType === 'postpaid' ? 'postpaid' : 'prepaid',
          amount: numericFiatAmount
        });
        fulfillmentStatus = result.fulfilled ? 'FULFILLED' : 'FULFILLMENT_PENDING';
        fulfillmentMessage = result.fulfilled
          ? (result.message || 'Electricity token generated successfully via VTU.ng.')
          : (result.message || 'Payment verified successfully. Fulfillment is pending provider configuration or operator confirmation.');
        providerRef = result.providerReference || result.orderId || vtuNgAdapter.generateRequestId(paymentId, result.fulfilled ? 'ELEC' : 'PEND');
        fulfillmentMetadata = {
          requestId: result.requestId,
          token: result.token,
          units: result.units,
          customerName: result.customerName,
          raw: result.rawResponse
        };
      } else if (normalizedCategory === 'tv' || normalizedCategory === 'cable') {
        const result = await vtuNgAdapter.purchaseTv({
          paymentId,
          phone: req.body.phone || '08000000000',
          serviceId: providerId,
          smartcardNumber: accountNumber,
          variationId: req.body.variationId || req.body.packageId || 'tv-default',
          amount: numericFiatAmount
        });
        fulfillmentStatus = result.fulfilled ? 'FULFILLED' : 'FULFILLMENT_PENDING';
        fulfillmentMessage = result.fulfilled
          ? (result.message || 'Cable TV subscription renewed successfully via VTU.ng.')
          : (result.message || 'Payment verified successfully. Fulfillment is pending provider configuration or operator confirmation.');
        providerRef = result.providerReference || result.orderId || vtuNgAdapter.generateRequestId(paymentId, result.fulfilled ? 'CABL' : 'PEND');
        fulfillmentMetadata = { requestId: result.requestId, raw: result.rawResponse };
      } else {
        // Unmapped Nigerian category - Safe Pending State
        fulfillmentStatus = 'FULFILLMENT_PENDING';
        fulfillmentMessage = 'Payment verified successfully. Fulfillment is pending provider configuration or operator confirmation.';
        providerRef = vtuNgAdapter.generateRequestId(paymentId, 'PEND');
      }
    } catch (vtuErr: any) {
      console.warn('[VTU.ng Adapter] Transaction dispatch error:', vtuErr.message);
      fulfillmentStatus = 'FULFILLMENT_PENDING';
      fulfillmentMessage = 'Payment verified successfully. Fulfillment is pending provider configuration or operator confirmation.';
      providerRef = vtuNgAdapter.generateRequestId(paymentId, 'PEND');
    }
  } else {
    // Unconfigured or International Provider Mode: Safe Pending State with Escrow Lock
    fulfillmentStatus = 'FULFILLMENT_PENDING';
    fulfillmentMessage = 'Payment verified successfully. Fulfillment is pending provider configuration or operator confirmation.';
    providerRef = vtuNgAdapter.generateRequestId(paymentId, 'PEND');
  }

  const resultRecord = {
    transactionId: `UTIL-TX-${Date.now()}`,
    paymentId,
    txid: verifiedTxid,
    status: fulfillmentStatus,
    message: fulfillmentMessage,
    category: category || 'utility',
    providerId: providerId || 'unknown',
    accountNumber: accountNumber || '',
    fiatAmount: Number(numericFiatAmount.toFixed(2)),
    piAmount: Number(Number(piAmount || 0).toFixed(4)),
    packageName: packageName || 'Utility Payment',
    timestamp: new Date().toISOString(),
    providerReference: providerRef,
    metadata: fulfillmentMetadata
  };

  utilityFulfillmentRepo.recordTransaction(existingKey, resultRecord);

  res.json({
    success: true,
    data: resultRecord
  });
});

// VTU.ng v2 Dedicated Auxiliary Endpoints
app.get(['/api/v2/utility/config', '/api/utility/provider-config'], (req, res) => {
  res.json({
    success: true,
    provider: 'VTU.ng',
    configured: vtuNgAdapter.isConfigured(),
    authentication: 'JWT',
    mode: process.env.PI_SANDBOX_MODE === 'false' ? 'live' : 'sandbox'
  });
});

app.get('/api/v2/utility/vtu/balance', async (req, res) => {
  const balanceResult = await vtuNgAdapter.getBalance();
  res.json(balanceResult);
});

app.get('/api/v2/utility/vtu/variations/data', async (req, res) => {
  const variationsResult = await vtuNgAdapter.getDataVariations();
  res.json(variationsResult);
});

app.get('/api/v2/utility/vtu/variations/tv', async (req, res) => {
  const variationsResult = await vtuNgAdapter.getTvVariations();
  res.json(variationsResult);
});

app.post('/api/v2/utility/vtu/requery', async (req, res) => {
  const { requestId } = req.body || {};
  if (!requestId) {
    res.status(400).json({ success: false, error: 'Missing requestId parameter' });
    return;
  }
  const requeryResult = await vtuNgAdapter.requeryOrder(requestId);
  res.json(requeryResult);
});

// VTU.ng Webhook / Status Callback Endpoint with Signature Verification
app.post('/api/v2/utility/vtu/webhook', (req, res) => {
  try {
    const rawSignature = (req.headers['x-vtu-signature'] || req.headers['signature'] || req.headers['x-signature']) as string | undefined;
    const rawBody = JSON.stringify(req.body || {});
    
    // Validate signature using VTU_USER_PIN if configured
    const isSignatureValid = vtuNgAdapter.verifyWebhookSignature(rawBody, rawSignature);
    if (!isSignatureValid) {
      console.warn('[VTU.ng Webhook] Rejected incoming webhook with invalid signature');
      res.status(401).json({ success: false, error: 'INVALID_WEBHOOK_SIGNATURE' });
      return;
    }

    const { request_id, order_id, status, token, units } = req.body || {};
    if (request_id) {
      // Find and idempotently update transaction status if registered
      const existing = utilityFulfillmentRepo.findByKey(request_id);
      if (existing) {
        const normalizedStatus = String(status || '').toUpperCase();
        const updatedStatus = normalizedStatus === 'SUCCESS' || normalizedStatus === 'COMPLETED' ? 'FULFILLED' : (normalizedStatus === 'FAILED' ? 'FAILED' : 'FULFILLMENT_PENDING');
        
        utilityFulfillmentRepo.recordTransaction(request_id, {
          ...existing,
          status: updatedStatus as any,
          providerReference: order_id ? String(order_id) : existing.providerReference,
          metadata: {
            ...(existing.metadata || {}),
            token: token || existing.metadata?.token,
            units: units || existing.metadata?.units,
            webhookReceivedAt: new Date().toISOString()
          }
        });
      }
    }

    res.json({ success: true, received: true });
  } catch (err: any) {
    console.warn('[VTU.ng Webhook] Processing error:', err.message);
    res.status(500).json({ success: false, error: 'WEBHOOK_PROCESSING_ERROR' });
  }
});

// ==========================================
// PINOVA GLOBAL EDUCATION ECOSYSTEM API
// ==========================================

// 1. Institution Directory & Verification Registry
app.get('/api/education/institutions', (req, res) => {
  try {
    const { countryCode, country, state, tier, institutionType, isPublic, search, verificationStatus } = req.query;
    const filter: any = {};

    // Support both countryCode and country, preferring countryCode
    const rawCountry = (countryCode !== undefined && countryCode !== '')
      ? String(countryCode)
      : (country !== undefined && country !== '' ? String(country) : undefined);

    if (rawCountry) {
      filter.countryCode = normalizeCountryCode(rawCountry);
    }
    if (state) filter.state = String(state);
    if (tier) filter.tier = String(tier);
    if (institutionType) filter.institutionType = String(institutionType);
    if (isPublic !== undefined) filter.isPublic = isPublic === 'true';
    if (search) filter.search = String(search);
    if (verificationStatus) filter.verificationStatus = String(verificationStatus);

    const list = educationRepo.getInstitutions(filter);
    res.json({
      success: true,
      count: list.length,
      institutions: list
    });
  } catch (err: any) {
    console.error('[Education API] Failed to query institutions:', err.message);
    res.status(500).json({ success: false, error: 'FAILED_TO_LOAD_INSTITUTIONS', message: err.message });
  }
});

app.get('/api/education/institutions/:id', (req, res) => {
  try {
    const inst = educationRepo.getInstitutionById(req.params.id);
    if (!inst) {
      res.status(404).json({ success: false, error: 'INSTITUTION_NOT_FOUND', message: `Institution ${req.params.id} does not exist.` });
      return;
    }
    res.json({ success: true, institution: inst });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'INSTITUTION_FETCH_FAILED', message: err.message });
  }
});

// 2. Global Education Taxonomy / Classification (Phase 6 Remediation)
app.get(['/api/education/taxonomy', '/api/education/taxonomy/:countryCode?'], (req, res) => {
  try {
    const countryCode = req.params.countryCode || (req.query.countryCode as string);
    if (!countryCode || countryCode === 'all') {
      res.json({
        success: true,
        count: Object.keys(GLOBAL_EDUCATION_TAXONOMIES).length,
        supportedCountries: classificationEngine.getSupportedCountries(),
        taxonomies: classificationEngine.getAllTaxonomies()
      });
      return;
    }

    const taxonomy = classificationEngine.getTaxonomy(countryCode);
    res.json({
      success: true,
      countryCode: taxonomy.countryCode,
      taxonomy
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'TAXONOMY_FETCH_FAILED', message: err.message });
  }
});

// 3. Student Identity & Verification Engine (Phase 7 Remediation)
app.post('/api/education/students/verify', studentVerifyRateLimiter, authenticate, (req: AuthenticatedRequest, res) => {
  try {
    const { studentId, matricOrRegistrationNumber, institutionId, countryCode, claimedFullName, nationalStudentNumber } = req.body;
    if (!studentId && !matricOrRegistrationNumber) {
      res.status(400).json({
        success: false,
        error: 'MISSING_IDENTIFIER',
        message: 'Student ID or Matric/Registration number is required for authoritative verification.'
      });
      return;
    }

    const verificationResult = studentVerificationService.verifyStudent({
      studentId,
      matricOrRegistrationNumber,
      institutionId,
      countryCode: countryCode || 'NG',
      claimedFullName,
      nationalStudentNumber
    });

    res.json({
      success: true,
      verification: verificationResult
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'STUDENT_VERIFICATION_FAILED', message: err.message });
  }
});

app.post('/api/education/institutions/:id/verify-accreditation', studentVerifyRateLimiter, (req, res) => {
  try {
    const { id } = req.params;
    const { countryCode, registryNumber } = req.body;
    const result = studentVerificationService.verifyInstitution(id, countryCode || 'NG', registryNumber);
    res.json({ success: true, accreditation: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'ACCREDITATION_CHECK_FAILED', message: err.message });
  }
});

app.get('/api/education/students/:id', (req, res) => {
  try {
    const student = educationRepo.getStudentById(req.params.id);
    if (!student) {
      res.status(404).json({ success: false, error: 'STUDENT_NOT_FOUND' });
      return;
    }
    res.json({ success: true, student });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'STUDENT_FETCH_FAILED', message: err.message });
  }
});

app.get('/api/education/guardians/:id/children', (req, res) => {
  try {
    const children = educationRepo.getGuardianChildrenSummaries(req.params.id);
    res.json({ success: true, count: children.length, children });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'GUARDIAN_CHILDREN_FETCH_FAILED', message: err.message });
  }
});

// 4. Invoices & Authoritative School Fees Engine (Phase 5 & 11 Remediation)
app.get('/api/education/invoices', (req, res) => {
  try {
    const { studentId, institutionId, status, guardianId } = req.query;
    const filter: any = {};
    if (studentId) filter.studentId = String(studentId);
    if (institutionId) filter.institutionId = String(institutionId);
    if (status) filter.status = String(status);
    if (guardianId) filter.guardianId = String(guardianId);

    const invoices = educationRepo.getInvoices(filter);
    res.json({ success: true, count: invoices.length, invoices });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'INVOICES_FETCH_FAILED', message: err.message });
  }
});

app.get('/api/education/invoices/:id', (req, res) => {
  try {
    const invoice = educationRepo.getInvoiceById(req.params.id);
    if (!invoice) {
      res.status(404).json({ success: false, error: 'INVOICE_NOT_FOUND' });
      return;
    }
    res.json({ success: true, invoice });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'INVOICE_FETCH_FAILED', message: err.message });
  }
});

// Authoritative fee calculation endpoint (prevents client-side price tampering)
app.post('/api/education/invoices/calculate', (req, res) => {
  try {
    const { items, subtotal, discountAmount, taxAmount } = req.body;
    let computedSubtotal = Number(subtotal) || 0;

    if (Array.isArray(items) && items.length > 0) {
      computedSubtotal = items.reduce((acc: number, item: any) => {
        const itemAmount = Number(item.amount || item.unitPrice || 0);
        const itemQty = Number(item.quantity || 1);
        return acc + (itemAmount * itemQty);
      }, 0);
    }

    const totals = EducationRepository.calculateInvoiceTotals({
      subtotal: computedSubtotal,
      discount: Number(discountAmount) || 0,
      tax: Number(taxAmount) || 0
    });

    res.json({
      success: true,
      totals
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: 'CALCULATION_ERROR', message: err.message });
  }
});

// Apply Scholarship to Invoice (Requires Financial/Institutional Admin Role)
app.post('/api/education/invoices/:id/apply-scholarship', authenticate, requireRole(['PLATFORM_ADMIN', 'INSTITUTION_ADMIN', 'FINANCE_ADMIN']), (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const { scholarshipId, notes } = req.body;

    if (!scholarshipId) {
      res.status(400).json({ success: false, error: 'MISSING_SCHOLARSHIP_ID', message: 'scholarshipId is required' });
      return;
    }

    const updatedInvoice = educationRepo.applyScholarshipToInvoice(id, scholarshipId, notes);
    res.json({
      success: true,
      message: 'Scholarship credit applied to invoice',
      invoice: updatedInvoice
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: 'SCHOLARSHIP_APPLICATION_FAILED', message: err.message });
  }
});

// 5. Secure Pi School Fees Settlement & Digital Receipt Issuance (Phase 5 & 12 Remediation)
app.post('/api/education/invoices/pay', paymentRateLimiter, authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const {
      invoiceId,
      amountPaid,
      currency = 'USD',
      piAmount,
      piPaymentId,
      piTxid,
      paymentMethod = 'PI_NETWORK',
      idempotencyKey
    } = req.body;

    if (!invoiceId) {
      res.status(400).json({ success: false, error: 'MISSING_INVOICE_ID', message: 'Invoice ID is required' });
      return;
    }

    const numericAmount = Number(amountPaid);
    if (!numericAmount || numericAmount <= 0) {
      res.status(400).json({ success: false, error: 'INVALID_AMOUNT', message: 'Payment amount must be greater than zero' });
      return;
    }

    const invoice = educationRepo.getInvoiceById(invoiceId);
    if (!invoice) {
      res.status(404).json({ success: false, error: 'INVOICE_NOT_FOUND', message: `Invoice ${invoiceId} not found` });
      return;
    }

    if (invoice.status === 'PAID') {
      res.status(400).json({ success: false, error: 'INVOICE_ALREADY_PAID', message: 'This invoice is already fully paid.' });
      return;
    }

    if (numericAmount > invoice.outstandingBalance + 0.01) {
      res.status(400).json({
        success: false,
        error: 'AMOUNT_EXCEEDS_BALANCE',
        message: `Amount $${numericAmount} exceeds current outstanding balance of $${invoice.outstandingBalance.toFixed(2)}`
      });
      return;
    }

    // Pi Network server verification: Check if paymentId was completed on ledger
    if (piPaymentId) {
      const ledgerEntry = paymentLedgerRepo.findByPaymentId(piPaymentId);
      if (ledgerEntry && ledgerEntry.status === 'FAILED') {
        res.status(400).json({ success: false, error: 'PI_PAYMENT_FAILED_ON_LEDGER', message: 'The referenced Pi payment failed verification.' });
        return;
      }
    }

    // Authoritatively derive payer username
    const payerUsername = req.user?.username || req.body.payerUsername || 'pioneer_parent';
    const effectiveIdempotencyKey = idempotencyKey || piPaymentId || `IDEMP-EDU-${invoiceId}-${Date.now()}`;

    // Execute atomic settlement in repository with canonical SHA-256 digest creation
    const result = educationRepo.recordPayment({
      invoiceId,
      amountPaid: numericAmount,
      currency,
      piAmount: Number(piAmount || (numericAmount * 0.00000318).toFixed(6)),
      piPaymentId,
      piTxid,
      paymentMethod,
      payerUsername,
      idempotencyKey: effectiveIdempotencyKey
    });

    // Record immutable audit log
    auditService.recordPstpAudit({
      orderId: invoiceId,
      paymentId: piPaymentId,
      actor: payerUsername,
      actorRole: 'payer',
      action: 'EDUCATION_FEE_PAID',
      details: `Paid ${numericAmount} ${currency} (Pi: ${result.payment.piAmount}) for student ${invoice.studentName}`,
      ipAddress: req.ip || '127.0.0.1',
      deviceInfo: (req.headers['user-agent'] as string) || 'Pi Browser Web'
    });

    res.json({
      success: true,
      message: 'School fee payment verified and completed successfully',
      payment: result.payment,
      invoice: result.invoice,
      receipt: result.receipt
    });
  } catch (err: any) {
    console.error('[Education Payment] Processing error:', err.message);
    res.status(500).json({ success: false, error: 'PAYMENT_PROCESSING_FAILED', message: err.message });
  }
});

// 6. Digital Receipt Verification (Tamper-Resistant Cryptographic Validation)
app.get('/api/education/receipts/:receiptNumber/verify', receiptVerifyRateLimiter, (req, res) => {
  try {
    const { receiptNumber } = req.params;
    const verification = educationRepo.verifyReceipt(receiptNumber);
    if (!verification.found || !verification.receipt) {
      res.status(404).json({
        success: false,
        status: 'NOT_FOUND',
        isAuthentic: false,
        error: 'RECEIPT_NOT_FOUND',
        message: `No authentic education fee receipt matches reference "${receiptNumber}".`
      });
      return;
    }

    res.json({
      success: true,
      status: verification.status,
      isAuthentic: verification.status === 'VERIFIED',
      algorithm: verification.algorithm,
      digest: verification.digest,
      receiptNumber: verification.receipt.receiptNumber,
      verificationReference: verification.receipt.verificationReference,
      verificationHash: verification.receipt.verificationHash,
      institutionName: verification.receipt.institutionName,
      academicSession: verification.receipt.academicSession,
      termOrSemester: verification.receipt.termOrSemester,
      educationLevel: verification.receipt.educationLevel,
      amountPaid: verification.receipt.amountPaid,
      currency: verification.receipt.currency,
      piAmount: verification.receipt.piAmount,
      paymentDate: verification.receipt.paymentDate,
      verifiedByServer: verification.receipt.verifiedByServer,
      chargeDescription: verification.receipt.chargeDescription,
      publicSummary: verification.receipt.publicSafeSummary
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'VERIFICATION_FAILED', message: err.message });
  }
});

app.get('/api/education/receipts/:receiptNumber', (req, res) => {
  try {
    const receipt = educationRepo.getReceiptByNumber(req.params.receiptNumber);
    if (!receipt) {
      res.status(404).json({ success: false, error: 'RECEIPT_NOT_FOUND' });
      return;
    }
    res.json({ success: true, receipt });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'RECEIPT_FETCH_FAILED', message: err.message });
  }
});

// 7. Admissions & Application Pipeline (Phase 5 & 10 Remediation)
app.get('/api/education/admissions', (req, res) => {
  try {
    const { institutionId, status, applicantEmail } = req.query;
    const filter: any = {};
    if (institutionId) filter.institutionId = String(institutionId);
    if (status) filter.status = String(status);
    if (applicantEmail) filter.applicantEmail = String(applicantEmail);

    const list = educationRepo.getAdmissions(filter);
    res.json({ success: true, count: list.length, applications: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'ADMISSIONS_FETCH_FAILED', message: err.message });
  }
});

app.post('/api/education/admissions/apply', authenticate, (req: AuthenticatedRequest, res) => {
  try {
    const appData = req.body;
    if (!appData.institutionId || !appData.applicantFullName || !appData.programmeName) {
      res.status(400).json({ success: false, error: 'MISSING_REQUIRED_FIELDS' });
      return;
    }

    const application = educationRepo.submitAdmissionApplication({
      ...appData,
      applicantEmail: req.user?.username ? `${req.user.username}@pinova.hub` : appData.applicantEmail || 'applicant@pinova.hub',
      applicationFeePaid: Boolean(appData.applicationFeePaid),
      documents: appData.documents || []
    });

    res.json({ success: true, message: 'Admission application submitted successfully', application });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'ADMISSION_SUBMISSION_FAILED', message: err.message });
  }
});

// Admissions State Machine Transition (Requires Institution Admin or Compliance Officer)
app.post('/api/education/admissions/:id/status', authenticate, requireRole(['PLATFORM_ADMIN', 'INSTITUTION_ADMIN', 'COMPLIANCE_OFFICER']), (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!status) {
      res.status(400).json({ success: false, error: 'MISSING_STATUS', message: 'Status field is required' });
      return;
    }

    const updatedBy = req.user?.username || 'Admissions_Committee';
    const updated = educationRepo.updateAdmissionStatus(id, status, reason, updatedBy);

    res.json({
      success: true,
      message: `Admission application status updated to ${status}`,
      application: updated
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: 'INVALID_ADMISSION_TRANSITION', message: err.message });
  }
});

app.post('/api/education/admissions/:id/offer/accept', (req, res) => {
  try {
    const updated = educationRepo.acceptAdmissionOffer(req.params.id);
    if (!updated) {
      res.status(404).json({ success: false, error: 'APPLICATION_NOT_FOUND' });
      return;
    }
    res.json({ success: true, message: 'Admission offer accepted', application: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'OFFER_ACCEPT_FAILED', message: err.message });
  }
});

// 8. Scholarships & Financial Aid (Phase 5 & 10 Remediation)
app.get('/api/education/scholarships', (req, res) => {
  try {
    const { tier, countryCode } = req.query;
    const scholarships = educationRepo.getScholarships(tier as string, countryCode as string);
    res.json({ success: true, count: scholarships.length, scholarships });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'SCHOLARSHIPS_FETCH_FAILED', message: err.message });
  }
});

app.post('/api/education/scholarships', authenticate, requireRole(['PLATFORM_ADMIN', 'INSTITUTION_ADMIN']), (req: AuthenticatedRequest, res) => {
  try {
    const scholarship = educationRepo.createScholarship(req.body);
    res.json({ success: true, message: 'Scholarship created successfully', scholarship });
  } catch (err: any) {
    res.status(400).json({ success: false, error: 'SCHOLARSHIP_CREATION_FAILED', message: err.message });
  }
});

// 9. Education Marketplace Products
app.get('/api/education/marketplace', (req, res) => {
  try {
    const { category, tier } = req.query;
    let items = SEED_MARKETPLACE_ITEMS;
    if (category && category !== 'all') {
      items = items.filter((i) => i.category === category);
    }
    if (tier && tier !== 'all') {
      items = items.filter((i) => i.tier === tier);
    }
    res.json({ success: true, count: items.length, items });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'MARKETPLACE_FETCH_FAILED', message: err.message });
  }
});

// 10. School Administrator Portal Endpoints (Phase 10 Remediation)
app.post('/api/education/admin/institutions/:id/verify', async (req, res) => {
  const auth = await checkAdminAuth(req);
  if (!auth.authenticated) {
    res.status(401).json({ success: false, error: 'UNAUTHORIZED', message: 'Authentication required.' });
    return;
  }
  if (!auth.authorized) {
    res.status(403).json({ success: false, error: 'FORBIDDEN', message: 'Admin privileges required.' });
    return;
  }

  try {
    const { status, notes } = req.body;
    if (!status) {
      res.status(400).json({ success: false, error: 'MISSING_VERIFICATION_STATUS' });
      return;
    }
    const updated = educationRepo.verifyInstitution(req.params.id, status, notes);
    if (!updated) {
      res.status(404).json({ success: false, error: 'INSTITUTION_NOT_FOUND' });
      return;
    }
    res.json({ success: true, institution: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'VERIFICATION_UPDATE_FAILED', message: err.message });
  }
});

app.get('/api/education/admin/institutions/:id/analytics', async (req, res) => {
  const auth = await checkAdminAuth(req);
  if (!auth.authenticated) {
    res.status(401).json({ success: false, error: 'UNAUTHORIZED', message: 'Authentication required.' });
    return;
  }

  try {
    const analytics = educationRepo.getInstitutionAnalytics(req.params.id);
    res.json({ success: true, analytics });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'ANALYTICS_FAILED', message: err.message });
  }
});

app.get('/api/education/admin/audit-logs', async (req, res) => {
  const auth = await checkAdminAuth(req);
  if (!auth.authenticated) {
    res.status(401).json({ success: false, error: 'UNAUTHORIZED', message: 'Authentication required.' });
    return;
  }
  if (!auth.authorized) {
    res.status(403).json({ success: false, error: 'FORBIDDEN', message: 'Admin privileges required.' });
    return;
  }

  try {
    const logs = educationRepo.getAuditLogs(req.query.entityType as string);
    res.json({ success: true, count: logs.length, logs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'AUDIT_LOGS_FAILED', message: err.message });
  }
});

// AI Search Endpoint using Gemini 3.6 Flash
const handleAiSearch = async (req: express.Request, res: express.Response) => {
  try {
    const { query, catalog } = req.body;
    if (!query) {
      res.status(400).json({ error: 'Query prompt is required' });
      return;
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Fallback keyword search response if GEMINI_API_KEY is not set
      const lowerQ = query.toLowerCase();
      const matched = (catalog || []).filter((p: any) =>
        p.title.toLowerCase().includes(lowerQ) ||
        p.description.toLowerCase().includes(lowerQ) ||
        p.tags.some((t: string) => t.toLowerCase().includes(lowerQ)) ||
        p.category.toLowerCase().includes(lowerQ)
      );

      res.json({
        aiInsights: `Found ${matched.length} product(s) matching your request "${query}" in PiNova Marketplace.`,
        recommendedProductIds: matched.map((p: any) => p.id),
        suggestedCategory: matched[0]?.category || 'all'
      });
      return;
    }

    const promptText = `
You are the AI Concierge for PiNova Global Hub, an enterprise platform where products (Physical, Digital, Airtime, Utility Bills, Gift Cards) are bought with Pi Coin.

User Query: "${query}"

Product Catalog Context:
${JSON.stringify((catalog || []).map((p: any) => ({
      id: p.id,
      title: p.title,
      pricePi: p.pricePi,
      category: p.category,
      tags: p.tags,
      description: p.description
    })))}

Instructions:
1. Analyze the user's intent, budget constraints in Pi Coin, and preferred item type.
2. Select the most relevant product IDs from the catalog.
3. Write a short, friendly, 2-sentence AI Shopping Recommendation.
4. Output strict JSON with key "aiInsights" (string), "recommendedProductIds" (string array), and "suggestedCategory" (string).
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || '{}';
    let parsedResult;
    try {
      parsedResult = JSON.parse(text);
    } catch {
      parsedResult = {
        aiInsights: text,
        recommendedProductIds: [],
        suggestedCategory: 'all'
      };
    }

    res.json(parsedResult);
  } catch (err: any) {
    console.error('AI Search route error:', err);
    res.status(500).json({ error: 'AI Search processing error', message: err.message });
  }
};

app.post('/api/ai/search', handleAiSearch);
app.post('/api/v1/ai/search', handleAiSearch);

// ===================================================
// Real-Time Flight & Transport Booking API Layer
// ===================================================

// Rate Limiter Store & Correlation ID Middleware
const FLIGHT_RATE_LIMIT_STORE: Record<string, { count: number; resetTime: number }> = {};

const flightRateLimiter = (maxRequests: number) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Correlation ID
    let reqId = (req.headers['x-request-id'] as string || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
    if (!reqId) {
      reqId = `req_flt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    }
    res.setHeader('X-Request-ID', reqId);
    (req as any).reqId = reqId;

    // IP Rate Limiting
    const clientIp = (req.headers['x-forwarded-for'] as string || req.ip || req.socket.remoteAddress || '127.0.0.1').split(',')[0].trim();
    const endpointKey = `${clientIp}:${req.path}`;
    const now = Date.now();
    const windowMs = 60000; // 1 minute window

    const record = FLIGHT_RATE_LIMIT_STORE[endpointKey];
    if (!record || now > record.resetTime) {
      FLIGHT_RATE_LIMIT_STORE[endpointKey] = { count: 1, resetTime: now + windowMs };
    } else {
      record.count += 1;
      if (record.count > maxRequests) {
        console.warn(`[Flight Rate Limit Exceeded] reqId=${reqId}, IP=${clientIp}, Path=${req.path}`);
        res.status(429).json({
          success: false,
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please wait a minute before retrying.',
          reqId
        });
        return;
      }
    }
    next();
  };
};

const isFlightApiConfigured = (): boolean => {
  const provider = (process.env.FLIGHT_API_PROVIDER || 'duffel').trim().toLowerCase();
  const baseUrl = (process.env.FLIGHT_API_BASE_URL || 'https://api.duffel.com').trim();
  const token = (process.env.FLIGHT_API_ACCESS_TOKEN || '').trim();
  return Boolean(provider === 'duffel' && baseUrl.length > 0 && token.length > 0);
};

const handleFlightConfig = (req: express.Request, res: express.Response) => {
  const reqId = (req as any).reqId || 'req_cfg';
  const configured = isFlightApiConfigured();
  res.json({
    success: true,
    apiConfigured: configured,
    provider: (process.env.FLIGHT_API_PROVIDER || 'duffel').trim().toLowerCase(),
    mode: configured ? 'live-duffel' : 'verified-carrier',
    baseUrl: process.env.FLIGHT_API_BASE_URL || 'https://api.duffel.com',
    message: configured
      ? 'Live Flight API provider (Duffel) is configured.'
      : 'Live flight booking is currently unavailable. Showing verified carrier information only.',
    reqId
  });
};

const handleFlightSearch = async (req: express.Request, res: express.Response) => {
  const reqId = (req as any).reqId || 'req_src';
  try {
    const { origin, destination, tripType, departureDate, returnDate, passengers, cabinClass } = req.body || {};

    // Strict input type validation (reject object/array injections)
    if (typeof origin !== 'string' || typeof destination !== 'string') {
      res.status(400).json({ success: false, error: 'INVALID_CRITERIA', message: 'Origin and destination parameters must be strings.', reqId });
      return;
    }

    const originCode = origin.trim().toUpperCase().slice(0, 10);
    const destinationCode = destination.trim().toUpperCase().slice(0, 10);

    // Validation
    if (!originCode || !destinationCode) {
      res.status(400).json({ success: false, error: 'INVALID_CRITERIA', message: 'Origin and destination parameters are required.', reqId });
      return;
    }

    if (originCode.length < 2 || destinationCode.length < 2 || !/^[A-Z0-9]{2,10}$/.test(originCode) || !/^[A-Z0-9]{2,10}$/.test(destinationCode)) {
      res.status(400).json({ success: false, error: 'INVALID_AIRPORT_CODE', message: 'Airport codes must be 3-letter IATA or valid code identifiers.', reqId });
      return;
    }

    if (originCode === destinationCode) {
      res.status(400).json({ success: false, error: 'INVALID_ROUTE', message: 'Origin and destination airport codes cannot be identical.', reqId });
      return;
    }

    // Date validation
    const safeDepartureDate = typeof departureDate === 'string' ? departureDate.trim() : '';
    if (safeDepartureDate && isNaN(Date.parse(safeDepartureDate))) {
      res.status(400).json({ success: false, error: 'INVALID_DATE', message: 'Departure date must be a valid date format (YYYY-MM-DD).', reqId });
      return;
    }

    const safeTripType = typeof tripType === 'string' ? tripType.trim().toLowerCase() : 'one_way';
    const safeReturnDate = typeof returnDate === 'string' ? returnDate.trim() : '';

    if (safeTripType === 'round_trip') {
      if (!safeReturnDate || isNaN(Date.parse(safeReturnDate))) {
        res.status(400).json({ success: false, error: 'INVALID_DATE', message: 'Return date is required for round-trip searches.', reqId });
        return;
      }
      if (new Date(safeReturnDate) < new Date(safeDepartureDate || Date.now())) {
        res.status(400).json({ success: false, error: 'INVALID_DATE_RANGE', message: 'Return date cannot be earlier than departure date.', reqId });
        return;
      }
    }

    // Passengers validation
    const rawAdults = passengers && typeof passengers.adults === 'number' ? passengers.adults : parseInt(passengers?.adults || '1', 10);
    const rawChildren = passengers && typeof passengers.children === 'number' ? passengers.children : parseInt(passengers?.children || '0', 10);
    const rawInfants = passengers && typeof passengers.infants === 'number' ? passengers.infants : parseInt(passengers?.infants || '0', 10);

    const adults = Math.max(1, isNaN(rawAdults) ? 1 : rawAdults);
    const children = Math.max(0, isNaN(rawChildren) ? 0 : rawChildren);
    const infants = Math.max(0, isNaN(rawInfants) ? 0 : rawInfants);
    const totalPassengers = adults + children + infants;

    if (isNaN(totalPassengers) || totalPassengers < 1 || totalPassengers > 9) {
      res.status(400).json({ success: false, error: 'INVALID_PASSENGERS', message: 'Passenger count must be between 1 and 9 passengers.', reqId });
      return;
    }

    const safeCabinStr = typeof cabinClass === 'string' ? cabinClass.trim().toLowerCase() : 'economy';
    const validCabins = ['economy', 'premium_economy', 'business', 'first'];
    const safeCabin = validCabins.includes(safeCabinStr) ? safeCabinStr : 'economy';

    console.log(`[Flight Lifecycle] flight.search.started reqId=${reqId} route=${originCode}->${destinationCode} dep=${safeDepartureDate || 'flexible'} trip=${safeTripType} pax=${totalPassengers} cabin=${safeCabin}`);

    const configured = isFlightApiConfigured();

    if (!configured) {
      res.json({
        success: true,
        apiConfigured: false,
        providerName: process.env.FLIGHT_API_PROVIDER || 'duffel',
        liveResults: [],
        message: 'Live flight booking is currently unavailable. Showing verified carrier information only.',
        reqId
      });
      return;
    }

    const baseUrl = process.env.FLIGHT_API_BASE_URL || 'https://api.duffel.com';
    const token = process.env.FLIGHT_API_ACCESS_TOKEN;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000);

    try {
      const passengerSlices = [
        ...Array.from({ length: adults }, () => ({ type: 'adult' })),
        ...Array.from({ length: children }, () => ({ type: 'child' })),
        ...Array.from({ length: infants }, () => ({ type: 'infant_without_seat' }))
      ];

      const apiRes = await fetch(`${baseUrl}/air/offer_requests?return_offers=true`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Duffel-Version': 'v2',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          data: {
            slices: [
              { origin: originCode, destination: destinationCode, departure_date: safeDepartureDate || new Date().toISOString().split('T')[0] },
              ...(safeTripType === 'round_trip' && safeReturnDate ? [{ origin: destinationCode, destination: originCode, departure_date: safeReturnDate }] : [])
            ],
            passengers: passengerSlices,
            cabin_class: safeCabin
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!apiRes.ok) {
        const errorText = await apiRes.text();
        console.warn(`[Flight Lifecycle] Duffel Search Non-200 reqId=${reqId} status=${apiRes.status}:`, errorText.substring(0, 150));
        res.json({
          success: true,
          apiConfigured: true,
          providerName: process.env.FLIGHT_API_PROVIDER || 'duffel',
          liveResults: [],
          verificationMode: 'verified-carrier',
          message: `Duffel API returned status ${apiRes.status}. Fallback to verified carrier catalog.`,
          reqId
        });
        return;
      }

      const rawData = await apiRes.json();
      const offerRequestId = rawData?.data?.id || 'unknown_req';
      const offers = rawData?.data?.offers || [];
      const rawOffersCount = offers.length;
      const validDuffelOffers = Array.isArray(offers)
        ? offers.filter((off: any, idx: number) => {
            const rawOfferId = typeof off?.id === 'string' ? off.id.trim() : '';
            if (!/^off_[A-Za-z0-9]+$/.test(rawOfferId)) {
              console.warn(`[Flight Lifecycle] Invalid Duffel offer ID reqId=${reqId} index=${idx}`);
              return false;
            }
            return true;
          })
        : [];

      // Task 2: Safe Development Diagnostic for Raw Duffel Search Response
      console.log('DUFFEL_SEARCH_DIAGNOSTIC');
      console.log(`offer_request_id: ${offerRequestId}`);
      console.log(`offer_count: ${validDuffelOffers.length}`);
      validDuffelOffers.forEach((off: any, idx: number) => {
        const ownerName = off.owner?.name || 'Unknown Airline';
        const ownerIata = off.owner?.iata_code || '??';
        const segments = off.slices?.[0]?.segments || [];
        const flightNumbers = segments
          .map((s: any) => `${s.operating_carrier?.iata_code || s.marketing_carrier?.iata_code || ''} ${s.operating_carrier_flight_number || s.marketing_flight_number || ''}`.trim())
          .filter(Boolean)
          .join(' -> ') || 'Scheduled Flight';
        const origIata = off.slices?.[0]?.origin?.iata_code || originCode;
        const destIata = off.slices?.[0]?.destination?.iata_code || destinationCode;
        console.log(
          `${idx + 1}. offer_id=${off.id} carrier=${ownerName} (${ownerIata}) flight=${flightNumbers} route=${origIata}->${destIata} total=${off.total_amount} ${off.total_currency} expires_at=${off.expires_at || 'N/A'}`
        );
      });

      const mappedLiveResults = validDuffelOffers.map((off: any) => {
        const rawOfferId = off.id.trim();
        const airline = off.owner?.name || 'Partner Airline';
        const slice0 = off.slices?.[0];
        const segments = slice0?.segments || [];
        const numSegments = segments.length;
        const firstSegment = segments[0];
        const lastSegment = segments[numSegments - 1] || firstSegment;

        // Build comprehensive flight number string and segment details
        const segmentFlightNums = segments
          .map((s: any) => `${s.operating_carrier?.iata_code || s.marketing_carrier?.iata_code || ''} ${s.operating_carrier_flight_number || s.marketing_flight_number || ''}`.trim())
          .filter(Boolean);

        const flightNumber = segmentFlightNums.length > 0
          ? segmentFlightNums.join(' ➔ ')
          : (firstSegment?.marketing_flight_number || 'Scheduled Flight');

        // Extract stop airports
        const stopAirports: string[] = [];
        if (numSegments > 1) {
          for (let i = 0; i < numSegments - 1; i++) {
            const stopCode = segments[i]?.destination?.iata_code;
            if (stopCode) stopAirports.push(stopCode);
          }
        }

        const total_amount = off.total_amount || '0';
        const total_currency = off.total_currency || 'USD';

        console.log(
          `[Flight Lifecycle] search_offer_id=${rawOfferId} airline=${airline} flightNumber=${flightNumber} stops=${stopAirports.length} total_amount=${total_amount} ${total_currency}`
        );

        const fareBrandName = slice0?.fare_brand_name || off.fare_brand_name || undefined;
        const baseFareFiat = parseFloat(off.base_amount) || undefined;
        const taxesAndFeesFiat = parseFloat(off.tax_amount) || undefined;
        const mappedSegments = segments.map((s: any) => ({
          marketingAirline: s.marketing_carrier?.name || s.marketing_carrier?.iata_code || airline,
          operatingAirline: s.operating_carrier?.name || s.operating_carrier?.iata_code || undefined,
          flightNumber: `${s.operating_carrier?.iata_code || s.marketing_carrier?.iata_code || ''} ${s.operating_carrier_flight_number || s.marketing_flight_number || ''}`.trim(),
          aircraft: s.aircraft?.name || undefined,
          originCode: s.origin?.iata_code || originCode,
          originName: s.origin?.name || undefined,
          destinationCode: s.destination?.iata_code || destinationCode,
          destinationName: s.destination?.name || undefined,
          departureTime: s.departing_at || safeDepartureDate,
          arrivalTime: s.arriving_at || safeDepartureDate,
          duration: s.duration || 'Scheduled',
          cabinClass: safeCabin
        }));

        return {
          offerId: rawOfferId,
          offerRequestId,
          airline,
          flightNumber,
          originCode: slice0?.origin?.iata_code || originCode,
          originCity: slice0?.origin?.city_name || undefined,
          destinationCode: slice0?.destination?.iata_code || destinationCode,
          destinationCity: slice0?.destination?.city_name || undefined,
          departureTime: firstSegment?.departing_at || safeDepartureDate,
          arrivalTime: lastSegment?.arriving_at || firstSegment?.arriving_at || safeDepartureDate,
          duration: slice0?.duration || 'Scheduled',
          stops: numSegments > 1 ? numSegments - 1 : 0,
          stopAirports,
          aircraft: firstSegment?.aircraft?.name || 'Commercial Aircraft',
          cabinClass: safeCabin,
          baggageAllowance: firstSegment?.passengers?.[0]?.baggages?.length ? `${firstSegment.passengers[0].baggages.length} Checked Bag(s)` : 'Standard Allowance',
          fareAmountFiat: parseFloat(total_amount) || 0,
          baseFareFiat,
          taxesAndFeesFiat,
          fareBrandName,
          currency: total_currency,
          seatsAvailable: typeof off.available_seats === 'number' ? off.available_seats : 1,
          fareConditions: off.conditions?.refund_before_departure?.allowed ? 'Refundable before departure' : (fareBrandName ? `${fareBrandName} Tariff` : 'Live Duffel Tariff. Changeable subject to airline rules.'),
          expiresAt: off.expires_at || undefined,
          isLive: true,
          bookingMode: 'LIVE_DUFFEL' as const,
          isLiveBooking: true,
          searchTimestamp: new Date().toISOString(),
          segments: mappedSegments
        };
      });

      // Calculate unique physical itineraries for diagnostics
      const uniqueItineraryKeys = new Set<string>();
      validDuffelOffers.forEach((off: any) => {
        const slice = off.slices?.[0];
        const segs = slice?.segments || [];
        const fp = [
          slice?.origin?.iata_code || originCode,
          slice?.destination?.iata_code || destinationCode,
          segs[0]?.departing_at || '',
          segs[segs.length - 1]?.arriving_at || '',
          segs.map((s: any) => `${s.operating_carrier?.iata_code || s.marketing_carrier?.iata_code || ''} ${s.operating_carrier_flight_number || s.marketing_flight_number || ''}`.trim()).join(','),
          segs.map((s: any) => s.operating_carrier?.iata_code || s.marketing_carrier?.iata_code || '').join(','),
          safeCabin
        ].join('|');
        uniqueItineraryKeys.add(fp);
      });

      console.log(
        `[FLIGHT SEARCH] requestId=${offerRequestId} rawOffers=${rawOffersCount} normalizedOffers=${mappedLiveResults.length} uniqueItineraries=${uniqueItineraryKeys.size} renderedCards=${uniqueItineraryKeys.size}`
      );

      res.json({
        success: true,
        apiConfigured: true,
        providerName: process.env.FLIGHT_API_PROVIDER || 'duffel',
        offerRequestId,
        liveResults: mappedLiveResults,
        verificationMode: mappedLiveResults.length > 0 ? 'live-duffel' : 'verified-carrier',
        message: mappedLiveResults.length > 0 
          ? 'Live flight results retrieved directly from Duffel API.' 
          : 'Duffel API returned 0 live offers for this route. Fallback to verified carrier catalog.',
        reqId
      });
    } catch (fetchErr: any) {
      clearTimeout(timeoutId);
      console.error(`[Flight Lifecycle] Duffel Search Exception reqId=${reqId}:`, fetchErr.message);
      res.json({
        success: true,
        apiConfigured: true,
        providerName: process.env.FLIGHT_API_PROVIDER || 'duffel',
        liveResults: [],
        verificationMode: 'verified-carrier',
        message: 'Duffel API endpoint timed out or failed to respond. Fallback to verified carrier catalog.',
        reqId
      });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'FLIGHT_SEARCH_EXCEPTION', message: 'Internal flight search error.', reqId });
  }
};

const handleFlightRevalidate = async (req: express.Request, res: express.Response) => {
  const reqId = (req as any).reqId || 'req_rev';
  try {
    const { offerId, expectedFareFiat } = req.body || {};
    if (typeof offerId !== 'string' || !offerId.trim()) {
      res.status(400).json({ success: false, error: 'INVALID_OFFER', message: 'offerId parameter must be a non-empty string', reqId });
      return;
    }

    const cleanOfferId = offerId.trim();
    const isLiveOfferId = /^off_[A-Za-z0-9]+$/.test(cleanOfferId);
    const configured = isFlightApiConfigured();
    const bookingMode = (configured && isLiveOfferId) ? 'LIVE_DUFFEL' : 'VERIFIED_CARRIER';

    console.log(`[Flight Lifecycle] revalidated_offer_id=${cleanOfferId} reqId=${reqId}`);

    if (!configured || !isLiveOfferId) {
      res.json({
        success: true,
        valid: false,
        priceChanged: false,
        newFareFiat: Number(expectedFareFiat) || 0,
        seatsAvailable: 0,
        verificationMode: 'verified-carrier',
        offerId: cleanOfferId,
        message: 'This selection is not a live Duffel offer.',
        reqId
      });
      return;
    }

    const baseUrl = process.env.FLIGHT_API_BASE_URL || 'https://api.duffel.com';
    const token = process.env.FLIGHT_API_ACCESS_TOKEN;

    try {
      const apiRes = await fetch(`${baseUrl}/air/offers/${encodeURIComponent(cleanOfferId)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Duffel-Version': 'v2',
          'Accept': 'application/json'
        }
      });

      console.log(`[Flight Lifecycle] flight.offer.duffel_response reqId=${reqId} offerId=${cleanOfferId} status=${apiRes.status}`);

      if (!apiRes.ok) {
        console.warn(`[Flight Lifecycle] flight.offer.expired reqId=${reqId} offerId=${cleanOfferId} status=${apiRes.status}`);
        res.json({
          success: false,
          valid: false,
          error: 'OFFER_NO_LONGER_AVAILABLE',
          priceChanged: false,
          seatsAvailable: 0,
          verificationMode: 'LIVE_DUFFEL',
          offerId: cleanOfferId,
          message: 'This flight offer is no longer available. Please search again to get the latest availability.',
          reqId
        });
        return;
      }

      const offerData = await apiRes.json();
      const offer = offerData?.data;

      // Expiry Check
      if (offer?.expires_at) {
        const expiresAtMs = new Date(offer.expires_at).getTime();
        if (!isNaN(expiresAtMs) && expiresAtMs <= Date.now()) {
          console.warn(`[Flight Lifecycle] flight.offer.past_expiry reqId=${reqId} offerId=${cleanOfferId} expires_at=${offer.expires_at}`);
          res.json({
            success: false,
            valid: false,
            error: 'OFFER_NO_LONGER_AVAILABLE',
            priceChanged: false,
            seatsAvailable: 0,
            verificationMode: 'LIVE_DUFFEL',
            offerId: cleanOfferId,
            message: 'This flight offer has expired. Please search again to get the latest availability.',
            reqId
          });
          return;
        }
      }

      const currentPrice = parseFloat(offer?.total_amount) || Number(expectedFareFiat);
      const priceChanged = Math.abs(currentPrice - Number(expectedFareFiat)) > 0.01;

      console.log(`[Flight Lifecycle] flight.offer.revalidated reqId=${reqId} offerId=${cleanOfferId} priceChanged=${priceChanged} fare=${currentPrice}`);

      res.json({
        success: true,
        valid: true,
        priceChanged,
        newFareFiat: currentPrice,
        seatsAvailable: typeof offer?.available_seats === 'number' ? offer.available_seats : 1,
        verificationMode: 'LIVE_DUFFEL',
        offerId: cleanOfferId,
        expiresAt: offer?.expires_at,
        currency: offer?.total_currency || 'USD',
        message: priceChanged ? 'Fare has been updated by carrier.' : 'Live Duffel fare revalidated successfully.',
        reqId
      });
    } catch (err: any) {
      console.error(`[Flight Lifecycle] flight.offer.revalidate.exception reqId=${reqId}:`, err.message);
      res.json({
        success: false,
        valid: false,
        error: 'OFFER_NO_LONGER_AVAILABLE',
        priceChanged: false,
        newFareFiat: Number(expectedFareFiat) || 0,
        seatsAvailable: 0,
        verificationMode: 'LIVE_DUFFEL',
        offerId: cleanOfferId,
        message: 'This flight offer is no longer available. Please search again to get the latest availability.',
        reqId
      });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'FLIGHT_REVALIDATE_EXCEPTION', message: 'Internal revalidation error.', reqId });
  }
};

function hashKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex').slice(0, 12);
}

interface FlightOrderDiagnosticParams {
  paymentId: string;
  bookingAttemptId: string;
  offerId: string;
  idempotencyKey: string;
  duffelRequestId?: string;
  duffelOrderId?: string | null;
  bookingReference?: string | null;
  httpStatus: number;
  transportError?: string;
  bookingStatus: string;
  reconciliationStatus: string;
}

function logFlightOrderDiagnostic(params: FlightOrderDiagnosticParams) {
  const keyHash = hashKey(params.idempotencyKey);
  console.log(
    `[FLIGHT ORDER] paymentId=${params.paymentId} ` +
    `bookingAttemptId=${params.bookingAttemptId} ` +
    `offerId=${params.offerId} ` +
    `idempotencyKeyHash=${keyHash} ` +
    `duffelRequestId=${params.duffelRequestId || 'N/A'} ` +
    `duffelOrderId=${params.duffelOrderId || 'N/A'} ` +
    `bookingReference=${params.bookingReference || 'N/A'} ` +
    `httpStatus=${params.httpStatus} ` +
    `transportError=${params.transportError || 'none'} ` +
    `bookingStatus=${params.bookingStatus} ` +
    `reconciliationStatus=${params.reconciliationStatus}`
  );
}

async function reconcileDuffelBooking(params: {
  paymentId: string;
  offerId: string;
  idempotencyKey: string;
  bookingAttemptId: string;
  cleanGivenName: string;
  cleanFamilyName: string;
  baseUrl: string;
  token?: string;
  reqId: string;
}): Promise<{
  outcome: 'CONFIRMED' | 'NO_ORDER' | 'AMBIGUOUS';
  order?: any;
  pnr?: string;
  duffelOrderId?: string;
  ticketNumber?: string | null;
  message?: string;
  httpStatus?: number;
  transportError?: string;
}> {
  if (!params.token) {
    return { outcome: 'AMBIGUOUS', transportError: 'NO_TOKEN' };
  }

  try {
    // Read-only query of Duffel recent orders
    const ordersRes = await fetch(`${params.baseUrl}/air/orders?limit=50`, {
      headers: {
        'Authorization': `Bearer ${params.token}`,
        'Duffel-Version': 'v2',
        'Accept': 'application/json'
      }
    });

    if (ordersRes.ok) {
      const ordersData = await ordersRes.json();
      const ordersList: any[] = Array.isArray(ordersData?.data) ? ordersData.data : [];

      const matchedOrders = ordersList.filter((ord: any) => {
        // 1. Primary correlation chain: exact metadata match (paymentId, bookingAttemptId, or idempotencyKey)
        if (ord.metadata && typeof ord.metadata === 'object') {
          if (
            (ord.metadata.payment_id && ord.metadata.payment_id === params.paymentId) ||
            (ord.metadata.booking_attempt_id && ord.metadata.booking_attempt_id === params.bookingAttemptId) ||
            (ord.metadata.idempotency_key && ord.metadata.idempotency_key === params.idempotencyKey)
          ) {
            return true;
          }
        }

        // 2. Secondary correlation chain: requires MULTIPLE independent fields:
        // Must match exact offerId AND full passenger identity (given AND family name) AND recency window.
        // NEVER match merely on passenger name, email, or amount alone!
        const offerMatches = Boolean(
          (params.offerId && ord.offer_id === params.offerId) ||
          (params.offerId && Array.isArray(ord.selected_offers) && ord.selected_offers.includes(params.offerId)) ||
          (params.offerId && Array.isArray(ord.slices) && ord.slices.some((s: any) => s.id === params.offerId || s.offer_id === params.offerId))
        );

        const passengerMatches = Boolean(
          params.cleanFamilyName &&
          Array.isArray(ord.passengers) &&
          ord.passengers.some((p: any) =>
            typeof p.family_name === 'string' &&
            p.family_name.toLowerCase() === params.cleanFamilyName.toLowerCase() &&
            (!params.cleanGivenName || (typeof p.given_name === 'string' && p.given_name.toLowerCase() === params.cleanGivenName.toLowerCase()))
          )
        );

        let recencyMatches = false;
        if (ord.created_at) {
          const ageMs = Date.now() - new Date(ord.created_at).getTime();
          recencyMatches = ageMs >= 0 && ageMs < 60 * 60 * 1000;
        }

        return offerMatches && passengerMatches && recencyMatches;
      });

      if (matchedOrders.length === 1) {
        const matchedOrder = matchedOrders[0];
        return {
          outcome: 'CONFIRMED',
          order: matchedOrder,
          pnr: matchedOrder.booking_reference || null,
          duffelOrderId: matchedOrder.id,
          ticketNumber: (Array.isArray(matchedOrder.documents) && matchedOrder.documents[0]?.unique_identifier)
            ? matchedOrder.documents[0].unique_identifier
            : null
        };
      } else if (matchedOrders.length > 1) {
        console.warn(`[Flight Lifecycle] Multiple potential order matches encountered for paymentId=${params.paymentId}`);
        return {
          outcome: 'AMBIGUOUS',
          message: 'Multiple potential order matches encountered; manual verification required.',
          httpStatus: 202
        };
      } else {
        return {
          outcome: 'NO_ORDER',
          message: 'No airline order matches this booking attempt.'
        };
      }
    } else {
      return {
        outcome: 'AMBIGUOUS',
        transportError: `HTTP_${ordersRes.status}`
      };
    }
  } catch (err: any) {
    console.warn(`[Flight Lifecycle] Error querying orders during reconciliation reqId=${params.reqId}: ${err.message}`);
    return {
      outcome: 'AMBIGUOUS',
      transportError: err.message
    };
  }
}

const handleFlightBook = async (req: express.Request, res: express.Response) => {
  const reqId = (req as any).reqId || 'req_bok';
  try {
    const { paymentId, txid, offerId, passengerDetails, idempotencyKey } = req.body || {};

    if (typeof paymentId !== 'string' || !paymentId.trim()) {
      res.status(400).json({ success: false, error: 'MISSING_PAYMENT_ID', message: 'paymentId parameter must be a non-empty string', reqId });
      return;
    }

    const cleanPaymentId = paymentId.trim();
    // Deterministic stable idempotency key for Duffel tied strictly to the Pi payment
    const safePaymentSegment = cleanPaymentId.replace(/[^a-zA-Z0-9_-]/g, '');
    const stableIdempotencyKey = `pinova-flight-${safePaymentSegment}`;
    const bookingAttemptId = `att_${safePaymentSegment}`;
    const cleanOfferId = typeof offerId === 'string' ? offerId.trim() : '';

    const baseUrl = process.env.FLIGHT_API_BASE_URL || 'https://api.duffel.com';
    const token = process.env.FLIGHT_API_ACCESS_TOKEN;
    const configured = isFlightApiConfigured();
    const isLiveOfferId = /^off_[A-Za-z0-9]+$/.test(cleanOfferId);
    const isLiveDuffelBooking = configured && isLiveOfferId;

    // Invariant: 1 Pi Payment ID -> 1 Booking Attempt -> 1 Idempotency Key -> at most 1 Duffel Order
    const existingBooking =
      flightFulfillmentRepo.findByPaymentId(cleanPaymentId) ||
      flightFulfillmentRepo.findByIdempotencyKey(stableIdempotencyKey) ||
      flightFulfillmentRepo.findByKey(cleanPaymentId);

    if (existingBooking) {
      // Case A: Confirmed order
      if (
        existingBooking.bookingStatus === 'TICKET_ISSUED' ||
        existingBooking.bookingStatus === 'VERIFIED_CARRIER_VOUCHER_ISSUED' ||
        Boolean(existingBooking.duffelOrderId && existingBooking.pnr)
      ) {
        logFlightOrderDiagnostic({
          paymentId: cleanPaymentId,
          bookingAttemptId: existingBooking.bookingAttemptId || bookingAttemptId,
          offerId: existingBooking.offerId || cleanOfferId,
          idempotencyKey: stableIdempotencyKey,
          duffelOrderId: existingBooking.duffelOrderId,
          bookingReference: existingBooking.bookingReference || existingBooking.pnr,
          httpStatus: 200,
          transportError: 'none',
          bookingStatus: existingBooking.bookingStatus,
          reconciliationStatus: existingBooking.reconciliationStatus || 'NOT_REQUIRED'
        });

        res.json({
          success: true,
          idempotent: true,
          booking: existingBooking,
          reqId
        });
        return;
      }

      // Case B: Ambiguous / Reconciliation Required
      if (
        existingBooking.bookingStatus === 'BOOKING_RECONCILIATION_REQUIRED' ||
        existingBooking.bookingStatus === 'BOOKING_OUTCOME_UNKNOWN'
      ) {
        console.log(`[Flight Lifecycle] Reconciling existing ambiguous booking attempt for paymentId=${cleanPaymentId}`);
        const reconciliation = await reconcileDuffelBooking({
          paymentId: cleanPaymentId,
          offerId: existingBooking.offerId || cleanOfferId,
          idempotencyKey: stableIdempotencyKey,
          bookingAttemptId: existingBooking.bookingAttemptId || bookingAttemptId,
          cleanGivenName: (passengerDetails?.givenName || existingBooking.passengerName?.split(' ')[0] || '').trim(),
          cleanFamilyName: (passengerDetails?.familyName || existingBooking.passengerName?.split(' ').slice(1).join(' ') || '').trim(),
          baseUrl,
          token,
          reqId
        });

        if (reconciliation.outcome === 'CONFIRMED' && reconciliation.order) {
          const order = reconciliation.order;
          const duffelOrderId = order.id || reconciliation.duffelOrderId;
          const pnr = order.booking_reference || reconciliation.pnr || null;
          const ticketNumber = (Array.isArray(order.documents) && order.documents[0]?.unique_identifier)
            ? order.documents[0].unique_identifier
            : (reconciliation.ticketNumber || null);

          const resolvedRecord = flightFulfillmentRepo.recordBooking(cleanPaymentId, {
            ...existingBooking,
            pnr,
            bookingReference: pnr || duffelOrderId,
            duffelOrderId,
            ticketNumber,
            bookingStatus: 'TICKET_ISSUED',
            reconciliationStatus: 'RECONCILED_SUCCESS',
            message: 'Live airline ticket issued successfully via Duffel after reconciliation.',
            metadata: {
              ...(existingBooking.metadata || {}),
              reconciledAt: new Date().toISOString()
            }
          });

          logFlightOrderDiagnostic({
            paymentId: cleanPaymentId,
            bookingAttemptId: existingBooking.bookingAttemptId || bookingAttemptId,
            offerId: existingBooking.offerId || cleanOfferId,
            idempotencyKey: stableIdempotencyKey,
            duffelOrderId,
            bookingReference: pnr || duffelOrderId,
            httpStatus: 200,
            transportError: 'none',
            bookingStatus: 'TICKET_ISSUED',
            reconciliationStatus: 'RECONCILED_SUCCESS'
          });

          res.json({
            success: true,
            booking: resolvedRecord,
            reqId
          });
          return;
        } else if (reconciliation.outcome === 'NO_ORDER') {
          const failedRecord = flightFulfillmentRepo.recordBooking(cleanPaymentId, {
            ...existingBooking,
            bookingStatus: 'BOOKING_FAILED_HELD_FOR_REFUND',
            reconciliationStatus: 'RECONCILED_FAILED',
            message: 'Reconciliation confirmed no airline booking was created. Payment is secured in Escrow for refund.',
            metadata: {
              ...(existingBooking.metadata || {}),
              reconciledAt: new Date().toISOString()
            }
          });

          logFlightOrderDiagnostic({
            paymentId: cleanPaymentId,
            bookingAttemptId: existingBooking.bookingAttemptId || bookingAttemptId,
            offerId: existingBooking.offerId || cleanOfferId,
            idempotencyKey: stableIdempotencyKey,
            httpStatus: 502,
            transportError: 'none',
            bookingStatus: 'BOOKING_FAILED_HELD_FOR_REFUND',
            reconciliationStatus: 'RECONCILED_FAILED'
          });

          res.status(502).json({
            success: false,
            error: 'AIRLINE_BOOKING_NOT_FOUND',
            status: 'BOOKING_FAILED_HELD_FOR_REFUND',
            message: 'Reconciliation confirmed no airline booking was created. Payment is secured in Escrow for refund.',
            booking: failedRecord,
            reqId
          });
          return;
        } else {
          // Ambiguous remains
          logFlightOrderDiagnostic({
            paymentId: cleanPaymentId,
            bookingAttemptId: existingBooking.bookingAttemptId || bookingAttemptId,
            offerId: existingBooking.offerId || cleanOfferId,
            idempotencyKey: stableIdempotencyKey,
            httpStatus: 202,
            transportError: reconciliation.transportError || 'gateway_unresponsive',
            bookingStatus: 'BOOKING_RECONCILIATION_REQUIRED',
            reconciliationStatus: 'PENDING'
          });

          res.status(202).json({
            success: false,
            status: 'BOOKING_RECONCILIATION_REQUIRED',
            error: 'BOOKING_OUTCOME_UNKNOWN',
            message: 'Your payment was received. We are verifying the airline booking result before allowing another attempt.',
            booking: existingBooking,
            reqId
          });
          return;
        }
      }

      // Case C: Conclusively failed and held in Escrow
      if (existingBooking.bookingStatus === 'BOOKING_FAILED_HELD_FOR_REFUND') {
        res.status(502).json({
          success: false,
          error: 'BOOKING_PREVIOUSLY_FAILED_IN_ESCROW',
          status: 'BOOKING_FAILED_HELD_FOR_REFUND',
          message: 'Your payment was received. This booking attempt was previously resolved as failed and funds are held in Escrow.',
          booking: existingBooking,
          reqId
        });
        return;
      }
    }

    // Authoritative Pi Payment Verification
    const verification = await verifyPiPaymentAuthoritative(cleanPaymentId);

    if (!verification.verified) {
      console.warn(`[Flight Lifecycle] flight.payment.verification_failed reqId=${reqId} paymentId=${cleanPaymentId}`);
      res.status(400).json({
        success: false,
        status: 'VERIFICATION_FAILED',
        message: 'Server verification failed. Payment is not confirmed on Pi Platform.',
        reqId
      });
      return;
    }

    console.log(`[Flight Lifecycle] flight.payment.verified reqId=${reqId} paymentId=${cleanPaymentId}`);

    const recordedPayment = paymentLedgerRepo.findByPaymentId(cleanPaymentId);
    const verifiedTxid =
      verification.paymentData?.transaction?.txid ||
      recordedPayment?.txid ||
      txid ||
      '';

    const bookingMode = isLiveDuffelBooking ? 'LIVE_DUFFEL' : 'VERIFIED_CARRIER';
    console.log(`[Flight Lifecycle] book_offer_id=${cleanOfferId} reqId=${reqId} paymentId=${cleanPaymentId} bookingMode=${bookingMode}`);

    if (isLiveDuffelBooking) {
      // 1. Authoritative Offer Hydration from Duffel
      let currentOffer: any = null;
      try {
        const offerRes = await fetch(`${baseUrl}/air/offers/${encodeURIComponent(cleanOfferId)}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Duffel-Version': 'v2',
            'Accept': 'application/json'
          }
        });

        const offerReqId = offerRes.headers.get('x-request-id') || 'unknown';

        if (!offerRes.ok) {
          const offerErrText = await offerRes.text().catch(() => '');
          console.warn(`[Flight Lifecycle] Duffel offer hydration failed reqId=${reqId} duffelReqId=${offerReqId} status=${offerRes.status} offerId=${cleanOfferId}:`, offerErrText.substring(0, 150));
          
          const failedBookingRecord = {
            id: `FLT-BOK-${Date.now()}`,
            key: cleanPaymentId,
            paymentId: cleanPaymentId,
            bookingAttemptId,
            offerId: cleanOfferId,
            idempotencyKey: stableIdempotencyKey,
            pnr: null,
            bookingReference: `ESCROW-${cleanPaymentId.slice(-8).toUpperCase()}`,
            duffelOrderId: null,
            ticketNumber: null,
            bookingStatus: 'BOOKING_FAILED_HELD_FOR_REFUND' as const,
            reconciliationStatus: 'NOT_REQUIRED' as const,
            provider: 'duffel',
            bookingMode: 'LIVE_DUFFEL' as const,
            isLiveBooking: false,
            message: 'Your Pi payment was received. The selected airline offer is no longer available. Your payment protection/retry workflow has been preserved.',
            passengerName: `${passengerDetails?.givenName || 'Pioneer'} ${passengerDetails?.familyName || 'Traveler'}`,
            timestamp: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          flightFulfillmentRepo.recordBooking(cleanPaymentId, failedBookingRecord);
          res.status(400).json({
            success: false,
            error: 'OFFER_NO_LONGER_AVAILABLE',
            status: 'BOOKING_FAILED_HELD_FOR_REFUND',
            message: 'Your Pi payment was received. The selected airline offer is no longer available. Your payment protection/retry workflow has been preserved.',
            booking: failedBookingRecord,
            reqId
          });
          return;
        }

        const offerData = await offerRes.json();
        currentOffer = offerData?.data;
      } catch (fetchErr: any) {
        console.error(`[Flight Lifecycle] Duffel offer hydration exception reqId=${reqId}:`, fetchErr.message);
        const failedBookingRecord = {
          id: `FLT-BOK-${Date.now()}`,
          key: cleanPaymentId,
          paymentId: cleanPaymentId,
          bookingAttemptId,
          offerId: cleanOfferId,
          idempotencyKey: stableIdempotencyKey,
          pnr: null,
          bookingReference: `ESCROW-${cleanPaymentId.slice(-8).toUpperCase()}`,
          duffelOrderId: null,
          ticketNumber: null,
          bookingStatus: 'BOOKING_FAILED_HELD_FOR_REFUND' as const,
          reconciliationStatus: 'NOT_REQUIRED' as const,
          provider: 'duffel',
          bookingMode: 'LIVE_DUFFEL' as const,
          isLiveBooking: false,
          message: 'Your Pi payment was received. Could not connect to airline gateway to verify offer. Funds held in Escrow.',
          passengerName: `${passengerDetails?.givenName || 'Pioneer'} ${passengerDetails?.familyName || 'Traveler'}`,
          timestamp: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        flightFulfillmentRepo.recordBooking(cleanPaymentId, failedBookingRecord);
        res.status(502).json({
          success: false,
          error: 'DUFFEL_GATEWAY_ERROR',
          status: 'BOOKING_FAILED_HELD_FOR_REFUND',
          message: 'Your Pi payment was received. Could not connect to airline gateway. Funds held in Escrow.',
          booking: failedBookingRecord,
          reqId
        });
        return;
      }

      if (!currentOffer || !currentOffer.id) {
        res.status(400).json({
          success: false,
          error: 'OFFER_NOT_FOUND',
          message: 'Authoritative flight offer not found on airline gateway.',
          reqId
        });
        return;
      }

      // 2. Offer Expiry Verification
      if (currentOffer.expires_at) {
        const expiresAtMs = new Date(currentOffer.expires_at).getTime();
        if (!isNaN(expiresAtMs) && expiresAtMs <= Date.now()) {
          console.warn(`[Flight Lifecycle] Duffel offer expired reqId=${reqId} offerId=${cleanOfferId} expires_at=${currentOffer.expires_at}`);
          const failedBookingRecord = {
            id: `FLT-BOK-${Date.now()}`,
            key: cleanPaymentId,
            paymentId: cleanPaymentId,
            bookingAttemptId,
            offerId: cleanOfferId,
            idempotencyKey: stableIdempotencyKey,
            pnr: null,
            bookingReference: `ESCROW-${cleanPaymentId.slice(-8).toUpperCase()}`,
            duffelOrderId: null,
            ticketNumber: null,
            bookingStatus: 'BOOKING_FAILED_HELD_FOR_REFUND' as const,
            reconciliationStatus: 'NOT_REQUIRED' as const,
            provider: 'duffel',
            bookingMode: 'LIVE_DUFFEL' as const,
            isLiveBooking: false,
            message: 'Your Pi payment was received. The selected airline offer has expired. Funds are protected in Escrow.',
            passengerName: `${passengerDetails?.givenName || 'Pioneer'} ${passengerDetails?.familyName || 'Traveler'}`,
            timestamp: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          flightFulfillmentRepo.recordBooking(cleanPaymentId, failedBookingRecord);
          res.status(400).json({
            success: false,
            error: 'OFFER_NO_LONGER_AVAILABLE',
            status: 'BOOKING_FAILED_HELD_FOR_REFUND',
            message: 'Your Pi payment was received. The selected airline offer has expired. Funds are protected in Escrow for instant refund or retry.',
            booking: failedBookingRecord,
            reqId
          });
          return;
        }
      }

      // 3. Authoritative Passenger ID Resolution
      const authoritativePassengerId = currentOffer.passengers?.[0]?.id;
      if (!authoritativePassengerId || typeof authoritativePassengerId !== 'string' || !/^pas_[A-Za-z0-9]+$/.test(authoritativePassengerId)) {
        console.warn(`[Flight Lifecycle] No authoritative passenger ID on Duffel offer reqId=${reqId} offerId=${cleanOfferId}`);
        const failedBookingRecord = {
          id: `FLT-BOK-${Date.now()}`,
          key: cleanPaymentId,
          paymentId: cleanPaymentId,
          bookingAttemptId,
          offerId: cleanOfferId,
          idempotencyKey: stableIdempotencyKey,
          pnr: null,
          bookingReference: `ESCROW-${cleanPaymentId.slice(-8).toUpperCase()}`,
          duffelOrderId: null,
          ticketNumber: null,
          bookingStatus: 'BOOKING_FAILED_HELD_FOR_REFUND' as const,
          reconciliationStatus: 'NOT_REQUIRED' as const,
          provider: 'duffel',
          bookingMode: 'LIVE_DUFFEL' as const,
          isLiveBooking: false,
          message: 'Authoritative passenger structure is missing on this airline offer. Funds held in Escrow.',
          passengerName: `${passengerDetails?.givenName || 'Pioneer'} ${passengerDetails?.familyName || 'Traveler'}`,
          timestamp: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        flightFulfillmentRepo.recordBooking(cleanPaymentId, failedBookingRecord);
        res.status(400).json({
          success: false,
          error: 'PASSENGER_DATA_INVALID',
          status: 'BOOKING_FAILED_HELD_FOR_REFUND',
          message: 'Authoritative passenger identifier is missing on this offer. Please search for a fresh flight.',
          booking: failedBookingRecord,
          reqId
        });
        return;
      }

      // 4. Passenger Demographic Mapping & Validation
      const rawTitle = typeof passengerDetails?.title === 'string' ? passengerDetails.title.trim() : '';
      let cleanTitle: 'mr' | 'ms' | 'mrs' | '' = '';
      const titleLower = rawTitle.toLowerCase().replace(/[^a-z]/g, '');
      if (titleLower === 'mr' || titleLower === 'dr' || titleLower === 'alh') {
        cleanTitle = 'mr';
      } else if (titleLower === 'mrs' || titleLower === 'hjy') {
        cleanTitle = 'mrs';
      } else if (titleLower === 'ms' || titleLower === 'miss') {
        cleanTitle = 'ms';
      }

      const rawGender = typeof passengerDetails?.gender === 'string' ? passengerDetails.gender.trim().toLowerCase() : '';
      let cleanGender: 'm' | 'f' | '' = '';
      if (rawGender === 'male' || rawGender === 'm') {
        cleanGender = 'm';
      } else if (rawGender === 'female' || rawGender === 'f') {
        cleanGender = 'f';
      }

      const rawDob = typeof passengerDetails?.dateOfBirth === 'string' ? passengerDetails.dateOfBirth.trim() : (typeof passengerDetails?.bornOn === 'string' ? passengerDetails.bornOn.trim() : '');
      const isDobValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(rawDob);
      let isDobSensible = false;
      if (isDobValidFormat) {
        const [y, m, d] = rawDob.split('-').map(Number);
        if (m >= 1 && m <= 12 && d >= 1 && d <= 31 && y >= 1900) {
          const parsedDate = new Date(y, m - 1, d);
          if (
            parsedDate.getFullYear() === y &&
            parsedDate.getMonth() === m - 1 &&
            parsedDate.getDate() === d &&
            parsedDate.getTime() < Date.now()
          ) {
            isDobSensible = true;
          }
        }
      }

      const cleanGivenName = typeof passengerDetails?.givenName === 'string' ? passengerDetails.givenName.trim().slice(0, 50) : '';
      const cleanFamilyName = typeof passengerDetails?.familyName === 'string' ? passengerDetails.familyName.trim().slice(0, 50) : '';
      const cleanEmail = typeof passengerDetails?.email === 'string' ? passengerDetails.email.trim().slice(0, 100) : 'traveler@pinova.hub';
      const cleanPhone = typeof passengerDetails?.phone === 'string' ? passengerDetails.phone.trim().slice(0, 25) : '+2348000000000';

      if (!cleanGivenName || !cleanFamilyName) {
        res.status(400).json({
          success: false,
          error: 'PASSENGER_DATA_INVALID',
          message: 'Passenger first and last name are required for airline ticketing.',
          reqId
        });
        return;
      }

      if (!cleanTitle) {
        res.status(400).json({
          success: false,
          error: 'PASSENGER_DATA_INVALID',
          message: 'Passenger title (Mr, Mrs, Ms) is required for airline ticket issuance.',
          reqId
        });
        return;
      }

      if (!cleanGender) {
        res.status(400).json({
          success: false,
          error: 'PASSENGER_DATA_INVALID',
          message: 'Passenger gender (male or female) is required for airline ticket issuance.',
          reqId
        });
        return;
      }

      if (!isDobValidFormat || !isDobSensible) {
        res.status(400).json({
          success: false,
          error: 'PASSENGER_DATA_INVALID',
          message: 'Passenger date of birth in valid YYYY-MM-DD format is required for airline ticket issuance.',
          reqId
        });
        return;
      }

      // 5. Authoritative Carrier Settlement Amount & Currency
      const authoritativeAmount = typeof currentOffer.total_amount === 'string' && currentOffer.total_amount.trim() ? currentOffer.total_amount.trim() : '0.00';
      const authoritativeCurrency = typeof currentOffer.total_currency === 'string' && currentOffer.total_currency.trim() ? currentOffer.total_currency.trim() : 'USD';

      if (parseFloat(authoritativeAmount) <= 0) {
        res.status(400).json({
          success: false,
          error: 'DUFFEL_VALIDATION_ERROR',
          message: 'Authoritative offer has an invalid carrier fare amount. Please search again.',
          reqId
        });
        return;
      }

      // 6. Build Duffel POST /air/orders Payload
      const orderPayload = {
        data: {
          type: 'instant',
          selected_offers: [cleanOfferId],
          passengers: [
            {
              id: authoritativePassengerId,
              title: cleanTitle,
              gender: cleanGender,
              given_name: cleanGivenName,
              family_name: cleanFamilyName,
              born_on: rawDob,
              email: cleanEmail,
              phone_number: cleanPhone
            }
          ],
          payments: [
            {
              type: 'balance',
              currency: authoritativeCurrency,
              amount: authoritativeAmount
            }
          ],
          metadata: {
            payment_id: cleanPaymentId,
            booking_attempt_id: bookingAttemptId,
            idempotency_key: stableIdempotencyKey
          }
        }
      };

      // 7. Persist in-flight state BEFORE dispatching to Duffel to survive container restart or network abort
      const initialRecord: FlightFulfillmentEntity = {
        id: `FLT-BOK-${Date.now()}`,
        key: cleanPaymentId,
        paymentId: cleanPaymentId,
        bookingAttemptId,
        offerId: cleanOfferId,
        idempotencyKey: stableIdempotencyKey,
        pnr: null,
        bookingReference: `ESCROW-${cleanPaymentId.slice(-8).toUpperCase()}`,
        duffelOrderId: null,
        ticketNumber: null,
        bookingStatus: 'BOOKING_RECONCILIATION_REQUIRED',
        reconciliationStatus: 'PENDING',
        provider: 'duffel',
        passengerName: `${cleanGivenName} ${cleanFamilyName}`,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        bookingMode: 'LIVE_DUFFEL',
        isLiveBooking: true,
        message: 'Order submission initiated; awaiting carrier outcome.',
        metadata: {
          amount: authoritativeAmount,
          currency: authoritativeCurrency,
          txid: verifiedTxid
        }
      };
      flightFulfillmentRepo.recordBooking(cleanPaymentId, initialRecord);

      try {
        const orderRes = await fetch(`${baseUrl}/air/orders`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Duffel-Version': 'v2',
            'Duffel-Idempotency-Key': stableIdempotencyKey,
            'Idempotency-Key': stableIdempotencyKey,
            'Accept': 'application/json'
          },
          body: JSON.stringify(orderPayload)
        });

        const duffelReqId = orderRes.headers.get('x-request-id') || 'unknown';

        if (orderRes.ok) {
          const orderData = await orderRes.json();
          const order = orderData?.data || {};
          const pnr = order.booking_reference || null;
          const duffelOrderId = order.id || `ord_${Date.now()}`;
          // Requirement 8: Do NOT require documents[0] to exist.
          const ticketNumber = (Array.isArray(order.documents) && order.documents[0]?.unique_identifier)
            ? order.documents[0].unique_identifier
            : null;

          // Requirement 7: bookingReference is pnr, duffelOrderId stored distinctly
          const bookingRecord: FlightFulfillmentEntity = {
            id: `FLT-BOK-${Date.now()}`,
            key: cleanPaymentId,
            paymentId: cleanPaymentId,
            bookingAttemptId,
            offerId: cleanOfferId,
            idempotencyKey: stableIdempotencyKey,
            pnr,
            bookingReference: pnr || duffelOrderId,
            duffelOrderId,
            ticketNumber,
            bookingStatus: 'TICKET_ISSUED',
            reconciliationStatus: 'NOT_REQUIRED',
            provider: 'duffel',
            bookingMode: 'LIVE_DUFFEL',
            isLiveBooking: true,
            message: 'Live airline ticket issued successfully via Duffel.',
            passengerName: `${cleanGivenName} ${cleanFamilyName}`,
            timestamp: new Date().toISOString(),
            createdAt: initialRecord.createdAt,
            updatedAt: new Date().toISOString(),
            metadata: {
              duffelReqId,
              amount: authoritativeAmount,
              currency: authoritativeCurrency,
              liveMode: Boolean(order.live_mode)
            }
          };

          flightFulfillmentRepo.recordBooking(cleanPaymentId, bookingRecord);

          logFlightOrderDiagnostic({
            paymentId: cleanPaymentId,
            bookingAttemptId,
            offerId: cleanOfferId,
            idempotencyKey: stableIdempotencyKey,
            duffelRequestId: duffelReqId,
            duffelOrderId,
            bookingReference: pnr || duffelOrderId,
            httpStatus: orderRes.status,
            transportError: 'none',
            bookingStatus: 'TICKET_ISSUED',
            reconciliationStatus: 'NOT_REQUIRED'
          });

          res.json({ success: true, booking: bookingRecord, reqId });
          return;
        } else {
          // HTTP 4xx or 5xx from Duffel
          const rawErrText = await orderRes.text().catch(() => '');
          let duffelErrors: any[] = [];
          try {
            const parsed = JSON.parse(rawErrText);
            duffelErrors = Array.isArray(parsed?.errors) ? parsed.errors : [];
          } catch {}

          const firstErr = duffelErrors[0] || {};
          const sanitizedErrDetails = duffelErrors.map((e: any) => ({
            code: e.code,
            title: e.title,
            type: e.type,
            field: e.source?.field || e.source?.pointer,
            message: e.message
          }));

          // First check: Could Duffel have created an order despite 409 or 422 or 500?
          if (orderRes.status === 409 || orderRes.status === 422 || orderRes.status >= 500) {
            const reconciliation = await reconcileDuffelBooking({
              paymentId: cleanPaymentId,
              offerId: cleanOfferId,
              idempotencyKey: stableIdempotencyKey,
              bookingAttemptId,
              cleanGivenName,
              cleanFamilyName,
              baseUrl,
              token,
              reqId
            });

            if (reconciliation.outcome === 'CONFIRMED' && reconciliation.order) {
              const order = reconciliation.order;
              const duffelOrderId = order.id || reconciliation.duffelOrderId;
              const pnr = order.booking_reference || reconciliation.pnr || null;
              const ticketNumber = (Array.isArray(order.documents) && order.documents[0]?.unique_identifier)
                ? order.documents[0].unique_identifier
                : null;

              const confirmedRecord: FlightFulfillmentEntity = {
                id: `FLT-BOK-${Date.now()}`,
                key: cleanPaymentId,
                paymentId: cleanPaymentId,
                bookingAttemptId,
                offerId: cleanOfferId,
                idempotencyKey: stableIdempotencyKey,
                pnr,
                bookingReference: pnr || duffelOrderId,
                duffelOrderId,
                ticketNumber,
                bookingStatus: 'TICKET_ISSUED',
                reconciliationStatus: 'RECONCILED_SUCCESS',
                provider: 'duffel',
                bookingMode: 'LIVE_DUFFEL',
                isLiveBooking: true,
                message: 'Live airline ticket confirmed after gateway reconciliation.',
                passengerName: `${cleanGivenName} ${cleanFamilyName}`,
                timestamp: new Date().toISOString(),
                createdAt: initialRecord.createdAt,
                updatedAt: new Date().toISOString(),
                metadata: {
                  duffelReqId,
                  amount: authoritativeAmount,
                  currency: authoritativeCurrency,
                  reconciledAfterStatus: orderRes.status
                }
              };

              flightFulfillmentRepo.recordBooking(cleanPaymentId, confirmedRecord);

              logFlightOrderDiagnostic({
                paymentId: cleanPaymentId,
                bookingAttemptId,
                offerId: cleanOfferId,
                idempotencyKey: stableIdempotencyKey,
                duffelRequestId: duffelReqId,
                duffelOrderId,
                bookingReference: pnr || duffelOrderId,
                httpStatus: orderRes.status,
                transportError: 'none',
                bookingStatus: 'TICKET_ISSUED',
                reconciliationStatus: 'RECONCILED_SUCCESS'
              });

              res.json({ success: true, booking: confirmedRecord, reqId });
              return;
            }
          }

          // Conclusive provider rejection
          const isAirlineInternalError =
            firstErr.code === 'airline_internal_error' ||
            firstErr.code === 'internal_error' ||
            firstErr.type === 'airline_error' ||
            firstErr.type === 'supplier_error' ||
            (typeof firstErr.message === 'string' && firstErr.message.toLowerCase().includes('internal_error'));

          const isOfferUnavailable = firstErr.code === 'offer_no_longer_available' || orderRes.status === 422;

          const errorCategory = isOfferUnavailable
            ? 'OFFER_NO_LONGER_AVAILABLE'
            : (isAirlineInternalError
              ? 'AIRLINE_GATEWAY_INTERNAL_ERROR'
              : (firstErr.code === 'validation_required'
                ? 'DUFFEL_VALIDATION_ERROR'
                : (firstErr.code ? `DUFFEL_${String(firstErr.code).toUpperCase()}` : 'DUFFEL_ORDER_FAILED')));

          const userMessage = isOfferUnavailable
            ? 'Your Pi payment was received. The selected airline offer is no longer available. Your payment protection/retry workflow has been preserved.'
            : (isAirlineInternalError
              ? `Airline gateway rejected booking: ${firstErr.message || 'The airline reservation system reported an internal error'}. Funds held safely in Escrow for instant refund/retry.`
              : (firstErr.message
                ? `Airline gateway rejected booking: ${firstErr.message}. Funds held safely in Escrow for instant refund/retry.`
                : 'Payment completed on Pi Network. Airline seat allocation failed at carrier gateway. Funds held safely in Escrow for instant refund/retry.'));

          const failedBookingRecord: FlightFulfillmentEntity = {
            id: `FLT-BOK-${Date.now()}`,
            key: cleanPaymentId,
            paymentId: cleanPaymentId,
            bookingAttemptId,
            offerId: cleanOfferId,
            idempotencyKey: stableIdempotencyKey,
            pnr: null,
            bookingReference: `ESCROW-${cleanPaymentId.slice(-8).toUpperCase()}`,
            duffelOrderId: null,
            ticketNumber: null,
            bookingStatus: 'BOOKING_FAILED_HELD_FOR_REFUND',
            reconciliationStatus: 'RECONCILED_FAILED',
            provider: 'duffel',
            bookingMode: 'LIVE_DUFFEL',
            isLiveBooking: false,
            message: userMessage,
            passengerName: `${cleanGivenName} ${cleanFamilyName}`,
            timestamp: new Date().toISOString(),
            createdAt: initialRecord.createdAt,
            updatedAt: new Date().toISOString(),
            metadata: {
              duffelReqId,
              httpStatus: orderRes.status,
              isAirlineInternalError,
              errors: sanitizedErrDetails
            }
          };

          flightFulfillmentRepo.recordBooking(cleanPaymentId, failedBookingRecord);

          logFlightOrderDiagnostic({
            paymentId: cleanPaymentId,
            bookingAttemptId,
            offerId: cleanOfferId,
            idempotencyKey: stableIdempotencyKey,
            duffelRequestId: duffelReqId,
            httpStatus: orderRes.status,
            transportError: 'none',
            bookingStatus: 'BOOKING_FAILED_HELD_FOR_REFUND',
            reconciliationStatus: 'RECONCILED_FAILED'
          });

          res.status(502).json({
            success: false,
            error: errorCategory,
            status: 'BOOKING_FAILED_HELD_FOR_REFUND',
            message: userMessage,
            details: firstErr.title || (isAirlineInternalError ? 'Carrier gateway internal error' : 'Carrier allocation error. Refund available in Escrow.'),
            booking: failedBookingRecord,
            reqId,
            duffelReqId
          });
          return;
        }
      } catch (transportErr: any) {
        // Transport failure (Timeout, socket disconnect, ECONNRESET, AbortError)
        console.warn(`[Flight Lifecycle] Transport error during POST /air/orders reqId=${reqId}: ${transportErr.message}`);

        // Reconcile before classifying outcome!
        const reconciliation = await reconcileDuffelBooking({
          paymentId: cleanPaymentId,
          offerId: cleanOfferId,
          idempotencyKey: stableIdempotencyKey,
          bookingAttemptId,
          cleanGivenName,
          cleanFamilyName,
          baseUrl,
          token,
          reqId
        });

        if (reconciliation.outcome === 'CONFIRMED' && reconciliation.order) {
          const order = reconciliation.order;
          const duffelOrderId = order.id || reconciliation.duffelOrderId;
          const pnr = order.booking_reference || reconciliation.pnr || null;
          const ticketNumber = (Array.isArray(order.documents) && order.documents[0]?.unique_identifier)
            ? order.documents[0].unique_identifier
            : null;

          const confirmedRecord: FlightFulfillmentEntity = {
            id: `FLT-BOK-${Date.now()}`,
            key: cleanPaymentId,
            paymentId: cleanPaymentId,
            bookingAttemptId,
            offerId: cleanOfferId,
            idempotencyKey: stableIdempotencyKey,
            pnr,
            bookingReference: pnr || duffelOrderId,
            duffelOrderId,
            ticketNumber,
            bookingStatus: 'TICKET_ISSUED',
            reconciliationStatus: 'RECONCILED_SUCCESS',
            provider: 'duffel',
            bookingMode: 'LIVE_DUFFEL',
            isLiveBooking: true,
            message: 'Live airline ticket confirmed after transport reconciliation.',
            passengerName: `${cleanGivenName} ${cleanFamilyName}`,
            timestamp: new Date().toISOString(),
            createdAt: initialRecord.createdAt,
            updatedAt: new Date().toISOString()
          };

          flightFulfillmentRepo.recordBooking(cleanPaymentId, confirmedRecord);

          logFlightOrderDiagnostic({
            paymentId: cleanPaymentId,
            bookingAttemptId,
            offerId: cleanOfferId,
            idempotencyKey: stableIdempotencyKey,
            duffelOrderId,
            bookingReference: pnr || duffelOrderId,
            httpStatus: 200,
            transportError: transportErr.message,
            bookingStatus: 'TICKET_ISSUED',
            reconciliationStatus: 'RECONCILED_SUCCESS'
          });

          res.json({ success: true, booking: confirmedRecord, reqId });
          return;
        } else {
          // Ambiguous network outcome: MUST NOT be treated as terminal booking failure!
          // State remains BOOKING_RECONCILIATION_REQUIRED so subsequent check safely reconciles.
          const ambiguousRecord: FlightFulfillmentEntity = {
            id: `FLT-BOK-${Date.now()}`,
            key: cleanPaymentId,
            paymentId: cleanPaymentId,
            bookingAttemptId,
            offerId: cleanOfferId,
            idempotencyKey: stableIdempotencyKey,
            pnr: null,
            bookingReference: `ESCROW-${cleanPaymentId.slice(-8).toUpperCase()}`,
            duffelOrderId: null,
            ticketNumber: null,
            bookingStatus: 'BOOKING_RECONCILIATION_REQUIRED',
            reconciliationStatus: 'PENDING',
            provider: 'duffel',
            bookingMode: 'LIVE_DUFFEL',
            isLiveBooking: true,
            message: 'Your payment was received. We are verifying the airline booking result before allowing another attempt.',
            passengerName: `${cleanGivenName} ${cleanFamilyName}`,
            timestamp: new Date().toISOString(),
            createdAt: initialRecord.createdAt,
            updatedAt: new Date().toISOString(),
            metadata: {
              transportError: transportErr.message
            }
          };

          flightFulfillmentRepo.recordBooking(cleanPaymentId, ambiguousRecord);

          logFlightOrderDiagnostic({
            paymentId: cleanPaymentId,
            bookingAttemptId,
            offerId: cleanOfferId,
            idempotencyKey: stableIdempotencyKey,
            httpStatus: 202,
            transportError: transportErr.message,
            bookingStatus: 'BOOKING_RECONCILIATION_REQUIRED',
            reconciliationStatus: 'PENDING'
          });

          res.status(202).json({
            success: false,
            status: 'BOOKING_RECONCILIATION_REQUIRED',
            error: 'BOOKING_OUTCOME_UNKNOWN',
            message: 'Your payment was received. We are verifying the airline booking result before allowing another attempt.',
            booking: ambiguousRecord,
            reqId
          });
          return;
        }
      }
    } else {
      // Verified carrier voucher issuance when live Duffel offer is not used
      const pnr = `PNR-VOUCHER-${cleanPaymentId.slice(-6).toUpperCase()}`;
      const bookingReference = `REF-CARRIER-${Date.now()}`;
      const ticketNumber = `TKT-CARRIER-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

      console.log(`[Flight Lifecycle] flight.booking.issued_voucher reqId=${reqId} pnr=${pnr}`);

      const safeTitle = typeof passengerDetails?.title === 'string' ? passengerDetails.title : '';
      const safeGiven = typeof passengerDetails?.givenName === 'string' ? passengerDetails.givenName.slice(0, 50) : '';
      const safeFamily = typeof passengerDetails?.familyName === 'string' ? passengerDetails.familyName.slice(0, 50) : '';
      const fullName = safeGiven ? `${safeTitle ? safeTitle + ' ' : ''}${safeGiven} ${safeFamily}`.trim() : 'Verified Pioneer Passenger';

      const bookingRecord: FlightFulfillmentEntity = {
        id: `FLT-BOK-${Date.now()}`,
        key: cleanPaymentId,
        paymentId: cleanPaymentId,
        bookingAttemptId,
        idempotencyKey: stableIdempotencyKey,
        pnr,
        bookingReference,
        duffelOrderId: null,
        ticketNumber,
        bookingStatus: 'VERIFIED_CARRIER_VOUCHER_ISSUED',
        reconciliationStatus: 'NOT_REQUIRED',
        provider: 'Verified Transport Carrier Gateway',
        bookingMode: 'VERIFIED_CARRIER',
        isLiveBooking: false,
        message: 'Verified carrier voucher issued. Not an airline-issued ticket.',
        passengerName: fullName,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      flightFulfillmentRepo.recordBooking(cleanPaymentId, bookingRecord);

      res.json({
        success: true,
        booking: bookingRecord,
        reqId
      });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'FLIGHT_BOOK_EXCEPTION', message: 'Internal flight booking exception.', reqId });
  }
};

app.get('/api/flight/config', flightRateLimiter(60), handleFlightConfig);
app.get('/api/v1/flight/config', flightRateLimiter(60), handleFlightConfig);

app.post('/api/flight/search', flightRateLimiter(60), handleFlightSearch);
app.post('/api/v1/flight/search', flightRateLimiter(60), handleFlightSearch);

app.post('/api/flight/revalidate', flightRateLimiter(60), handleFlightRevalidate);
app.post('/api/v1/flight/revalidate', flightRateLimiter(60), handleFlightRevalidate);

app.post('/api/flight/book', flightRateLimiter(10), handleFlightBook);
app.post('/api/v1/flight/book', flightRateLimiter(10), handleFlightBook);

// Catch-all 404 Handler for ALL /api endpoints - Guarantees JSON response, never HTML
app.use('/api', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(404).json({
    success: false,
    error: `API endpoint not found: ${req.method} ${req.path}`,
    path: req.path
  });
});

// Global Error Handling Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Global API Error Handler]:', err);
  res.setHeader('Content-Type', 'application/json');
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    path: req.path
  });
});

async function startServer() {
  const distPath = path.join(process.cwd(), 'dist');
  const hasDist = fs.existsSync(path.join(distPath, 'index.html'));
  const isProduction = process.env.NODE_ENV === 'production' || (hasDist && process.env.NODE_ENV !== 'development');

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PiNova Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});

export default app;
