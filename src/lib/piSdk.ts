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

export function isPiBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  const userAgent = navigator.userAgent || '';
  return userAgent.includes('PiBrowser') || Boolean(window.Pi);
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
      console.warn('Pi SDK script failed to load or running in standalone browser.');
      resolve(false);
    };
    document.head.appendChild(script);
  });
}

export async function initPiSdk(sandbox: boolean = true): Promise<boolean> {
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
          console.log(`[Pi SDK] v2.0 initialized successfully. Sandbox: ${sandbox}`);
          return true;
        } catch (err: any) {
          const errMsg = String(err?.message || err);
          console.warn(`[Pi SDK] init warning (attempt ${attempt + 1}):`, errMsg);
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
  const hasSdk = await initPiSdk(true);

  if (hasSdk && window.Pi) {
    try {
      const auth = await window.Pi.authenticate(
        ['username', 'payments', 'wallet_address'],
        (payment: PiPayment) => {
          console.log('Incomplete payment detected on Pi Network:', payment);
          if (onIncompletePaymentFound) {
            onIncompletePaymentFound(payment);
          }
        }
      );

      return {
        username: auth.user.username,
        uid: auth.user.uid,
        accessToken: auth.accessToken,
        authenticated: true,
        role: auth.user.username === 'admin' ? 'admin' : 'buyer'
      };
    } catch (err) {
      console.error('Pi SDK Authentication failed or cancelled:', err);
      throw err;
    }
  } else {
    // Development preview fallback when opened in non-Pi browser tab
    return {
      username: 'Pi_Pioneer_Developer',
      uid: 'dev-uid-pinova-2026',
      walletAddress: 'GD5X...PINOVA_DEVELOPER_KEY',
      authenticated: true,
      role: 'buyer'
    };
  }
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
  if (params.onStatusUpdate) params.onStatusUpdate('Initializing Pi SDK...');

  // Ensure Pi SDK v2 is fully initialized before starting payment
  const isReady = await initPiSdk(true);
  if (!isReady && isPiBrowser()) {
    return {
      success: false,
      message: 'Pi Network SDK is not initialized. Please ensure you are opening the app within Pi Browser and have a stable network connection.'
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
            if (params.onStatusUpdate) params.onStatusUpdate('Fulfillment pending');
            resolve({
              success: true,
              paymentId,
              txid,
              fulfillmentStatus: 'FULFILLMENT_PENDING',
              message: 'Payment Received — Fulfillment Pending'
            });
          }
        },
        onCancel: (paymentId) => {
          if (params.onStatusUpdate) params.onStatusUpdate('Payment cancelled');
          resolve({
            success: false,
            paymentId,
            message: 'Payment cancelled'
          });
        },
        onError: (err) => {
          if (params.onStatusUpdate) params.onStatusUpdate('Payment failed');
          resolve({
            success: false,
            message: err.message || 'Payment failed'
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
    console.log('[Pi Payment System]:', msg);
    if (callbacks.onStatusUpdate) callbacks.onStatusUpdate(msg);
  };

  const paymentTimeout = setTimeout(() => {
    if (!hasHandledResponse) {
      hasHandledResponse = true;
      updateStatus('Payment failed');
      callbacks.onError(new Error('Pi Wallet payment request timed out. Please verify Pi Browser connectivity.'));
    }
  }, 35000);

  if (window.Pi) {
    if (!piInitialized) {
      try {
        window.Pi.init({ version: '2.0', sandbox: true });
        piInitialized = true;
      } catch (e) {
        // Ignored if already initialized
      }
    }

    updateStatus('Connecting to Pi Network...');
    try {
      window.Pi.createPayment(paymentData, {
        onReadyForServerApproval: async (paymentId: string) => {
          updateStatus('Waiting for wallet confirmation...');
          try {
            const res = await fetch('/api/v2/payments/approve', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId })
            });
            const data = await res.json();
            if (!res.ok) {
              throw new Error(data.message || 'Server approval failed');
            }
            updateStatus('Payment submitted...');
          } catch (err: any) {
            if (!hasHandledResponse) {
              hasHandledResponse = true;
              clearTimeout(paymentTimeout);
              updateStatus('Payment failed');
              callbacks.onError(err);
            }
          }
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          updateStatus('Payment verified...');
          try {
            const res = await fetch('/api/v2/payments/complete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId, txid })
            });
            const data = await res.json();
            if (!res.ok) {
              throw new Error(data.message || 'Server completion failed');
            }
            if (!hasHandledResponse) {
              hasHandledResponse = true;
              clearTimeout(paymentTimeout);
              callbacks.onSuccess(paymentId, txid);
            }
          } catch (err: any) {
            if (!hasHandledResponse) {
              hasHandledResponse = true;
              clearTimeout(paymentTimeout);
              updateStatus('Payment failed');
              callbacks.onError(err);
            }
          }
        },
        onCancel: (paymentId: string) => {
          if (!hasHandledResponse) {
            hasHandledResponse = true;
            clearTimeout(paymentTimeout);
            updateStatus('Payment cancelled');
            callbacks.onCancel(paymentId);
          }
        },
        onError: (error: Error) => {
          if (!hasHandledResponse) {
            hasHandledResponse = true;
            clearTimeout(paymentTimeout);
            updateStatus('Payment failed');
            callbacks.onError(error);
          }
        }
      });
    } catch (err: any) {
      if (!hasHandledResponse) {
        hasHandledResponse = true;
        clearTimeout(paymentTimeout);
        updateStatus('Payment failed');
        callbacks.onError(err);
      }
    }
  } else {
    // Non-Pi Browser development test environment simulation
    updateStatus('Connecting to Pi Network...');
    const devPaymentId = `dev_pay_${Date.now()}`;
    
    fetch('/api/v2/payments/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId: devPaymentId })
    })
      .then(async (res) => {
        updateStatus('Payment submitted...');
        const devTxid = `0x_DEV_TX_${Date.now()}_PINOVA`;
        return fetch('/api/v2/payments/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentId: devPaymentId,
            txid: devTxid
          })
        });
      })
      .then(async (res) => {
        if (!hasHandledResponse) {
          hasHandledResponse = true;
          clearTimeout(paymentTimeout);
          updateStatus('Payment verified...');
          callbacks.onSuccess(devPaymentId, `0x_DEV_TX_${Date.now()}_PINOVA`);
        }
      })
      .catch((err) => {
        if (!hasHandledResponse) {
          hasHandledResponse = true;
          clearTimeout(paymentTimeout);
          updateStatus('Payment failed');
          callbacks.onError(err);
        }
      });
  }
}
