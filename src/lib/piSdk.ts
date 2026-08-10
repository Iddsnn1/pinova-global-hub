import { PiUser } from '../types';
import { safeFetchJson } from './safeFetch';

declare global {
  interface Window {
    Pi?: {
      init: (config: { version: string; sandbox?: boolean }) => void;
      authenticate: (
        scopes: string[],
        onIncompletePaymentFound: (payment: PiPayment) => void
      ) => Promise<{
        accessToken: string;
        user: {
          username: string;
          uid: string;
        };
      }>;
      createPayment: (
        paymentData: PiPaymentData,
        callbacks: PiPaymentCallbacks
      ) => void;
    };
  }
}

export interface PiPaymentData {
  amount: number;
  memo: string;
  metadata: Record<string, any>;
}

export interface PiPayment {
  identifier: string;
  user_uid: string;
  amount: number;
  memo: string;
  metadata: Record<string, any>;
  status: {
    developer_approved: boolean;
    transaction_verified: boolean;
    developer_completed: boolean;
    cancelled: boolean;
    user_cancelled: boolean;
  };
  transaction?: {
    txid: string;
    verified: boolean;
    _link: string;
  };
}

export interface PiPaymentCallbacks {
  onReadyForServerApproval: (paymentId: string) => void;
  onReadyForServerCompletion: (paymentId: string, txid: string) => void;
  onCancel: (paymentId: string) => void;
  onError: (error: Error, payment?: PiPayment) => void;
}

let piInitialized = false;
let piInitPromise: Promise<boolean> | null = null;
let piPaymentScopeGranted = false;
let authenticatedUser: PiUser | null = null;

export function isSandboxMode(): boolean {
  const metaEnv = (import.meta as any).env;
  if (metaEnv) {
    if (metaEnv.VITE_PI_SANDBOX === 'false' || metaEnv.VITE_PI_ENV === 'mainnet') {
      return false;
    }
    if (metaEnv.VITE_PI_SANDBOX === 'true' || metaEnv.VITE_PI_ENV === 'sandbox') {
      return true;
    }
  }
  return process.env.NODE_ENV !== 'production';
}

export function isPiBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  const userAgent = navigator.userAgent || '';
  return userAgent.includes('PiBrowser') || userAgent.includes('Pi Network') || Boolean((window as any).Pi);
}

export function isPiSdkInitialized(): boolean {
  return piInitialized && typeof window !== 'undefined' && Boolean(window.Pi);
}

export function isPaymentScopeReady(): boolean {
  return piPaymentScopeGranted && Boolean(authenticatedUser);
}

export async function loadPiSdkScript(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (window.Pi) return true;

  return new Promise((resolve) => {
    const existingScript = document.querySelector('script[src*="sdk.minepi.com/pi-sdk.js"]');
    if (existingScript) {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (window.Pi) {
          clearInterval(interval);
          resolve(true);
        } else if (attempts > 20) {
          clearInterval(interval);
          resolve(Boolean(window.Pi));
        }
      }, 150);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.minepi.com/pi-sdk.js';
    script.async = true;
    script.onload = () => {
      resolve(Boolean(window.Pi));
    };
    script.onerror = () => {
      console.warn('[PI PAYMENT] Pi SDK script failed to load from CDN.');
      resolve(false);
    };
    document.head.appendChild(script);
  });
}

export async function initPiSdk(sandbox: boolean = isSandboxMode()): Promise<boolean> {
  if (piInitialized && typeof window !== 'undefined' && window.Pi) return true;
  if (piInitPromise) return piInitPromise;

  piInitPromise = (async () => {
    if (typeof window === 'undefined') return false;

    // Retry loop to load script & invoke window.Pi.init()
    for (let attempt = 0; attempt < 10; attempt++) {
      if (window.Pi) {
        try {
          window.Pi.init({ version: '2.0', sandbox });
          piInitialized = true;
          console.log(`[PI PAYMENT] SDK ready - v2.0 initialized. Sandbox: ${sandbox}`);
          return true;
        } catch (err: any) {
          const errMsg = String(err?.message || err);
          if (errMsg.toLowerCase().includes('initialized')) {
            piInitialized = true;
            return true;
          }
        }
      } else {
        await loadPiSdkScript();
      }
      await new Promise((res) => setTimeout(res, 200));
    }

    if (window.Pi) {
      try {
        window.Pi.init({ version: '2.0', sandbox });
        piInitialized = true;
        console.log(`[PI PAYMENT] SDK ready - v2.0 initialized. Sandbox: ${sandbox}`);
        return true;
      } catch (err: any) {
        if (String(err?.message || err).toLowerCase().includes('initialized')) {
          piInitialized = true;
          return true;
        }
      }
    }

    return piInitialized;
  })();

  const success = await piInitPromise;
  if (!success) {
    piInitPromise = null;
  }
  return success;
}

export async function authenticatePiUser(
  onIncompletePaymentFound?: (payment: PiPayment) => void,
  forceReauth: boolean = false
): Promise<PiUser> {
  console.log('[PI] Authenticating pioneer with payments scope');

  const inPiBrowser = isPiBrowser();
  const sandbox = isSandboxMode();
  const hasSdk = await initPiSdk(sandbox);

  if (inPiBrowser && hasSdk && typeof window !== 'undefined' && window.Pi) {
    if (!forceReauth && piPaymentScopeGranted && authenticatedUser) {
      console.log('[PI] Already authenticated with payment scope for user:', authenticatedUser.username);
      return authenticatedUser;
    }

    // MANDATORY: Request payments scope together with username
    const requestedScopes = ['payments', 'username'];

    try {
      console.log('[PI] Invoking native window.Pi.authenticate with scopes:', requestedScopes);
      
      const incompletePaymentHandler = (payment: PiPayment) => {
        console.log('[PI PAYMENT] Incomplete payment detected on Pi Network:', payment);
        if (onIncompletePaymentFound) {
          onIncompletePaymentFound(payment);
        }
      };

      // Native Pi.authenticate call - await fully so Pioneer can accept scopes in Pi Browser
      const authPromise = window.Pi.authenticate(requestedScopes, incompletePaymentHandler);
      
      // 45-second safeguard timeout in case user closes or hangs the browser dialog
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Pi Network authentication timed out. Please grant payment permissions in Pi Browser.'));
        }, 45000);
      });

      const auth = await Promise.race([authPromise, timeoutPromise]);

      if (auth && auth.user && auth.accessToken) {
        piPaymentScopeGranted = true;
        authenticatedUser = {
          username: auth.user.username,
          uid: auth.user.uid,
          accessToken: auth.accessToken,
          authenticated: true,
          role: auth.user.username === 'admin' ? 'admin' : 'buyer'
        };
        console.log('[PI] Native authentication success. Payment scope granted for user:', auth.user.username);
        return authenticatedUser;
      } else {
        throw new Error('Pi Authentication did not return user credentials or access token');
      }
    } catch (err: any) {
      piPaymentScopeGranted = false;
      authenticatedUser = null;
      console.error('[PI] Native authentication error:', err);
      throw new Error(err?.message || 'Pi Network authentication failed');
    }
  }

  // Non-Pi Browser environment (Desktop web preview / demo mode)
  console.log('[PI] Non-Pi Browser environment detected (Web Preview / Demo Mode)');
  piPaymentScopeGranted = false;
  authenticatedUser = {
    username: 'pioneer_demo',
    uid: 'sb_pioneer_uid_98765',
    accessToken: 'sb_access_token_demo',
    authenticated: true,
    role: 'buyer'
  };
  return authenticatedUser;
}

export async function ensurePaymentScopeReady(
  onIncompletePaymentFound?: (payment: PiPayment) => void
): Promise<boolean> {
  const inPi = isPiBrowser();
  if (!inPi) {
    throw new Error('Official Pi Browser is required to execute Pi payments. Please open this app inside Pi Browser.');
  }

  const sandbox = isSandboxMode();
  const sdkReady = await initPiSdk(sandbox);
  if (!sdkReady || !window.Pi) {
    throw new Error('Pi Network SDK failed to initialize.');
  }

  if (piPaymentScopeGranted && authenticatedUser) {
    return true;
  }

  console.log('[PI] Payment scope not ready. Triggering Pi.authenticate(["payments", "username"])...');
  const user = await authenticatePiUser(onIncompletePaymentFound, true);
  if (!piPaymentScopeGranted || !user) {
    throw new Error('Payment scope ("payments") was not granted by Pi Browser user.');
  }
  return true;
}

export async function createPiPayment(params: {
  amountPi: number;
  memo: string;
  metadata?: Record<string, any>;
  onStatusUpdate?: (statusMessage: string) => void;
  onIncompletePaymentFound?: (payment: PiPayment) => void;
}): Promise<{
  success: boolean;
  paymentId?: string;
  txid?: string;
  fulfillmentStatus?: 'FULFILLED' | 'FULFILLMENT_PENDING' | 'FAILED';
  message?: string;
  data?: any;
}> {
  console.log('[PI] createPiPayment started', params);
  if (params.onStatusUpdate) params.onStatusUpdate('Connecting Pi Network Wallet...');

  const inPi = isPiBrowser();
  if (!inPi) {
    if (params.onStatusUpdate) params.onStatusUpdate('Official Pi Browser required');
    return {
      success: false,
      message: 'Official Pi Browser is required to execute Pi payments. Please open this app inside Pi Browser.'
    };
  }

  try {
    if (params.onStatusUpdate) params.onStatusUpdate('Requesting payment authorization from Pi Wallet...');
    await ensurePaymentScopeReady(params.onIncompletePaymentFound);
  } catch (authErr: any) {
    const errMsg = authErr?.message || String(authErr);
    console.error('[PI] createPiPayment error - Authorization failed:', errMsg);
    if (params.onStatusUpdate) params.onStatusUpdate('Authorization failed');
    return {
      success: false,
      message: `Pi Payment Authorization failed: ${errMsg}`
    };
  }

  return new Promise((resolve) => {
    executePiPayment(
      {
        amount: params.amountPi,
        memo: params.memo,
        metadata: params.metadata || {}
      },
      {
        onStatusUpdate: params.onStatusUpdate,
        onIncompletePaymentFound: params.onIncompletePaymentFound,
        onSuccess: async (paymentId, txid) => {
          if (params.onStatusUpdate) params.onStatusUpdate('Payment verified on Pi ledger. Processing fulfillment...');

          try {
            const fulfillResult = await safeFetchJson('/api/v2/utility/fulfill', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                paymentId,
                txid,
                category: params.metadata?.category || 'utility',
                country: params.metadata?.country,
                countryCode: params.metadata?.countryCode,
                providerId: params.metadata?.providerId || 'unknown',
                accountNumber: params.metadata?.accountNumber || '',
                fiatAmount: params.metadata?.fiatAmount || 0,
                piAmount: params.amountPi,
                packageName: params.metadata?.packageName || '',
                idempotencyKey: paymentId
              })
            });

            const fulfillData = fulfillResult.data || {};
            if (fulfillResult.ok && fulfillData.success) {
              const status = fulfillData.data?.status;
              if (params.onStatusUpdate) {
                params.onStatusUpdate(status === 'FULFILLED' ? 'Fulfilled successfully!' : 'Fulfillment pending');
              }
              resolve({
                success: true,
                paymentId,
                txid,
                fulfillmentStatus: status || 'FULFILLMENT_PENDING',
                message: fulfillData.data?.message || 'Payment Received — Order Processed Successfully',
                data: fulfillData.data
              });
            } else {
              if (params.onStatusUpdate) params.onStatusUpdate('Fulfillment verification failed');
              resolve({
                success: false,
                paymentId,
                txid,
                fulfillmentStatus: 'FAILED',
                message: fulfillData.message || 'Server-side payment verification failed.'
              });
            }
          } catch (err: any) {
            if (params.onStatusUpdate) params.onStatusUpdate('Fulfillment error');
            resolve({
              success: false,
              paymentId,
              txid,
              fulfillmentStatus: 'FAILED',
              message: `Fulfillment error: ${err.message || 'Failed to reach fulfillment endpoint'}`
            });
          }
        },
        onCancel: (paymentId) => {
          if (params.onStatusUpdate) params.onStatusUpdate('Payment cancelled in Pi Wallet');
          resolve({
            success: false,
            paymentId,
            message: 'Payment was cancelled in Pi Wallet.'
          });
        },
        onError: (err) => {
          if (params.onStatusUpdate) params.onStatusUpdate('Payment error encountered');
          resolve({
            success: false,
            message: err.message || 'Payment failed in Pi Wallet.'
          });
        }
      }
    );
  });
}

export function executePiPayment(
  paymentData: PiPaymentData,
  callbacks: {
    onSuccess: (paymentId: string, txid: string) => void;
    onCancel: (paymentId: string) => void;
    onError: (error: Error) => void;
    onStatusUpdate?: (statusMessage: string) => void;
    onIncompletePaymentFound?: (payment: PiPayment) => void;
  }
): void {
  let hasHandledResponse = false;
  const updateStatus = (msg: string) => {
    console.log('[PI PAYMENT] status:', msg);
    if (callbacks.onStatusUpdate) callbacks.onStatusUpdate(msg);
  };

  const inPi = isPiBrowser();
  if (!inPi || typeof window === 'undefined' || !window.Pi) {
    updateStatus('Official Pi Browser required');
    if (!hasHandledResponse) {
      hasHandledResponse = true;
      callbacks.onError(new Error('Official Pi Browser is required to execute Pi payments. Please open this app inside Pi Browser.'));
    }
    return;
  }

  const runPaymentFlow = async () => {
    try {
      if (!piPaymentScopeGranted) {
        updateStatus('Authorizing payment permissions in Pi Wallet...');
        await authenticatePiUser(callbacks.onIncompletePaymentFound, true);
      }

      if (!piPaymentScopeGranted) {
        throw new Error('Payment scope ("payments") was not granted by Pi Browser.');
      }

      updateStatus('Connecting to Pi Network Wallet...');
      
      const paymentTimeout = setTimeout(() => {
        if (!hasHandledResponse) {
          hasHandledResponse = true;
          console.warn('[PI] Native payment creation timed out.');
          updateStatus('Pi Wallet connection timed out');
          callbacks.onError(new Error('Pi Network wallet connection timed out. Please retry inside Pi Browser.'));
        }
      }, 35000);

      window.Pi!.createPayment(paymentData, {
        onReadyForServerApproval: async (paymentId: string) => {
          clearTimeout(paymentTimeout);
          console.log('[PI PAYMENT] paymentId received:', paymentId);
          updateStatus('Waiting for server approval...');
          try {
            const res = await safeFetchJson('/api/v2/payments/approve', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId })
            });
            const data = res.data || {};
            if (!res.ok || !data.success) {
              throw new Error(data.message || data.error || res.error || 'Server approval failed');
            }
            updateStatus('Payment approved by server. Please confirm transaction in Pi Wallet...');
          } catch (err: any) {
            if (!hasHandledResponse) {
              hasHandledResponse = true;
              updateStatus('Payment approval failed');
              callbacks.onError(err);
            }
          }
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          clearTimeout(paymentTimeout);
          console.log('[PI PAYMENT] completion requested:', { paymentId, txid });
          updateStatus('Payment submitted to Pi blockchain. Completing on server...');
          try {
            const res = await safeFetchJson('/api/v2/payments/complete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId, txid })
            });
            const data = res.data || {};
            if (!res.ok || !data.success) {
              throw new Error(data.message || data.error || res.error || 'Server completion failed');
            }
            if (!hasHandledResponse) {
              hasHandledResponse = true;
              updateStatus('Payment verified successfully!');
              callbacks.onSuccess(paymentId, txid);
            }
          } catch (err: any) {
            if (!hasHandledResponse) {
              hasHandledResponse = true;
              updateStatus('Payment completion failed');
              callbacks.onError(err);
            }
          }
        },
        onCancel: (paymentId: string) => {
          clearTimeout(paymentTimeout);
          if (!hasHandledResponse) {
            hasHandledResponse = true;
            updateStatus('Payment cancelled');
            callbacks.onCancel(paymentId);
          }
        },
        onError: (error: Error) => {
          clearTimeout(paymentTimeout);
          if (!hasHandledResponse) {
            hasHandledResponse = true;
            console.warn('[PI PAYMENT] Native error encountered:', error);
            updateStatus('Payment error: ' + (error?.message || 'Transaction rejected'));
            callbacks.onError(error || new Error('Payment error encountered in Pi Wallet'));
          }
        }
      });
    } catch (err: any) {
      if (!hasHandledResponse) {
        hasHandledResponse = true;
        updateStatus('Payment execution failed');
        callbacks.onError(err || new Error('Failed to initialize Pi Wallet payment'));
      }
    }
  };

  runPaymentFlow();
}
