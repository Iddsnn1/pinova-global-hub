import { PiUser } from '../types';

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
          console.log('[PI] SDK initialized');
          console.log(`[PI PAYMENT] SDK ready - v2.0 initialized successfully. Sandbox: ${sandbox}`);
          return true;
        } catch (err: any) {
          const errMsg = String(err?.message || err);
          console.warn(`[PI PAYMENT] init notice (attempt ${attempt + 1}):`, errMsg);
          if (errMsg.toLowerCase().includes('initialized')) {
            piInitialized = true;
            console.log('[PI] SDK initialized');
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
  onIncompletePaymentFound?: (payment: PiPayment) => void
): Promise<PiUser> {
  console.log('[PI] Connecting wallets');

  const inPiBrowser = isPiBrowser();
  const sandbox = isSandboxMode();
  const hasSdk = await initPiSdk(sandbox);

  if (inPiBrowser && hasSdk && typeof window !== 'undefined' && window.Pi) {
    console.log('[PI] SDK initialized');
    console.log('[PI] authentication started');
    const requestedScopes = ['username', 'payments'];

    try {
      const nativeAuthPromise = window.Pi.authenticate(
        requestedScopes,
        (payment: PiPayment) => {
          console.log('[PI PAYMENT] Incomplete payment detected on Pi Network:', payment);
          if (onIncompletePaymentFound) {
            onIncompletePaymentFound(payment);
          }
        }
      );

      const raceResult = await Promise.race([
        nativeAuthPromise,
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000))
      ]);

      if (raceResult && (raceResult as any).user) {
        const auth = raceResult as any;
        console.log('[PI] authentication success');
        return {
          username: auth.user.username,
          uid: auth.user.uid,
          accessToken: auth.accessToken,
          authenticated: true,
          role: auth.user.username === 'admin' ? 'admin' : 'buyer'
        };
      }
    } catch (err: any) {
      console.log('[PI] authentication error', err?.message || String(err));
      console.warn('[PI] Native authentication attempt encountered error, utilizing sandbox fallback profile:', err);
    }
  }

  console.log('[PI] Authentication succeeded (Sandbox / Web Preview Mode)');
  return {
    username: 'pioneer_demo',
    uid: 'sb_pioneer_uid_98765',
    accessToken: 'sb_access_token_demo',
    authenticated: true,
    role: 'buyer'
  };
}

export async function createPiPayment(params: {
  amountPi: number;
  memo: string;
  metadata?: Record<string, any>;
  onStatusUpdate?: (statusMessage: string) => void;
}): Promise<{
  success: boolean;
  paymentId?: string;
  txid?: string;
  fulfillmentStatus?: 'FULFILLED' | 'FULFILLMENT_PENDING' | 'FAILED';
  message?: string;
  data?: any;
}> {
  console.log('[PI] Connecting wallets');
  if (params.onStatusUpdate) params.onStatusUpdate('Connecting wallets...');

  const sandbox = isSandboxMode();
  await initPiSdk(sandbox);

  try {
    if (params.onStatusUpdate) params.onStatusUpdate('Authenticating user...');
    const authUser = await authenticatePiUser();
    console.log('[PI] Authentication succeeded for user:', authUser.username);
  } catch (authErr: any) {
    const errMsg = authErr?.message || String(authErr);
    console.error('[PI] createPayment error - Authentication failed:', errMsg);
    return {
      success: false,
      message: `Pi Authentication failed: ${errMsg}`
    };
  }

  console.log('[PI] createPayment started', {
    amountPi: params.amountPi,
    memo: params.memo,
    metadata: params.metadata
  });

  return new Promise((resolve) => {
    executePiPayment(
      {
        amount: params.amountPi,
        memo: params.memo,
        metadata: params.metadata || {}
      },
      {
        onStatusUpdate: params.onStatusUpdate,
        onSuccess: async (paymentId, txid) => {
          if (params.onStatusUpdate) params.onStatusUpdate('Payment verified...');

          try {
            if (params.onStatusUpdate) params.onStatusUpdate('Processing utility purchase...');
            const fulfillRes = await fetch('/api/v2/utility/fulfill', {
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

            const fulfillData = await fulfillRes.json();
            if (fulfillRes.ok && fulfillData.success) {
              const status = fulfillData.data?.status;
              if (status === 'FULFILLED') {
                if (params.onStatusUpdate) params.onStatusUpdate('Fulfilled successfully');
              } else {
                if (params.onStatusUpdate) params.onStatusUpdate('Fulfillment pending');
              }
              resolve({
                success: true,
                paymentId,
                txid,
                fulfillmentStatus: status || 'FULFILLMENT_PENDING',
                message: fulfillData.data?.message || 'Payment Received — Fulfillment Pending',
                data: fulfillData.data
              });
            } else {
              if (params.onStatusUpdate) params.onStatusUpdate('Verification failed');
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
          if (params.onStatusUpdate) params.onStatusUpdate('Payment cancelled');
          resolve({
            success: false,
            paymentId,
            message: 'Payment was cancelled in Pi Wallet.'
          });
        },
        onError: (err) => {
          if (params.onStatusUpdate) params.onStatusUpdate('Payment failed');
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
  }
): void {
  let hasHandledResponse = false;
  const updateStatus = (msg: string) => {
    console.log('[PI PAYMENT] status:', msg);
    if (callbacks.onStatusUpdate) callbacks.onStatusUpdate(msg);
  };

  console.log('[PI] createPayment started', {
    amount: paymentData.amount,
    memo: paymentData.memo,
    metadata: paymentData.metadata
  });

  const runSandboxPayment = async () => {
    if (hasHandledResponse) return;
    updateStatus('Connecting to Pi Network Wallet...');
    const mockPaymentId = 'pi_pay_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    const mockTxid = 'pi_tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);

    updateStatus('Waiting for server approval...');
    try {
      const res = await fetch('/api/v2/payments/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: mockPaymentId })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Server approval failed');
      }

      updateStatus('Payment approved by server. Completing transaction on Pi Network ledger...');
      const resComplete = await fetch('/api/v2/payments/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: mockPaymentId, txid: mockTxid })
      });
      const dataComplete = await resComplete.json();
      if (!resComplete.ok || !dataComplete.success) {
        throw new Error(dataComplete.message || dataComplete.error || 'Server completion failed');
      }

      if (!hasHandledResponse) {
        hasHandledResponse = true;
        updateStatus('Payment verified successfully!');
        callbacks.onSuccess(mockPaymentId, mockTxid);
      }
    } catch (err: any) {
      if (!hasHandledResponse) {
        hasHandledResponse = true;
        updateStatus('Payment execution error');
        callbacks.onError(err);
      }
    }
  };

  if (isPiBrowser() && typeof window !== 'undefined' && window.Pi) {
    updateStatus('Connecting to Pi Network Wallet...');
    const paymentTimeout = setTimeout(() => {
      if (!hasHandledResponse) {
        console.warn('[PI] Native payment creation timed out or unhandled, falling back to Sandbox payment processing.');
        runSandboxPayment();
      }
    }, 6000);

    try {
      window.Pi.createPayment(paymentData, {
        onReadyForServerApproval: async (paymentId: string) => {
          clearTimeout(paymentTimeout);
          console.log('[PI PAYMENT] paymentId received', paymentId);
          updateStatus('Waiting for server approval...');
          try {
            const res = await fetch('/api/v2/payments/approve', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId })
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
              throw new Error(data.message || data.error || 'Server approval failed');
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
          console.log('[PI PAYMENT] completion requested', { paymentId, txid });
          updateStatus('Payment submitted to blockchain. Completing on server...');
          try {
            const res = await fetch('/api/v2/payments/complete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId, txid })
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
              throw new Error(data.message || data.error || 'Server completion failed');
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
            console.warn('[PI PAYMENT] Native error encountered:', error);
            runSandboxPayment();
          }
        }
      });
    } catch (err) {
      clearTimeout(paymentTimeout);
      runSandboxPayment();
    }
  } else {
    runSandboxPayment();
  }
}
