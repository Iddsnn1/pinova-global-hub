import { paymentLedgerRepo } from '../db';

export interface AuthoritativePiVerificationResult {
  verified: boolean;
  status: 'VERIFIED' | 'VERIFICATION_FAILED';
  source: 'pi_platform' | 'sandbox_dev';
  message: string;
  paymentData?: any;
}

/**
 * Single server-side Pi payment verification boundary for order/PSTP flows.
 * Production always fails closed and requires Pi Platform confirmation.
 */
export async function verifyPiPaymentAuthoritative(paymentId: string): Promise<AuthoritativePiVerificationResult> {
  const cleanPaymentId = String(paymentId || '').trim();
  if (!cleanPaymentId) {
    return { verified: false, status: 'VERIFICATION_FAILED', source: 'pi_platform', message: 'Server verification failed. Payment is not confirmed on Pi Platform.' };
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const piApiKey = String(process.env.PI_API_KEY || process.env.PI_SERVER_KEY || '').trim();
  const hasValidApiKey = Boolean(piApiKey && piApiKey !== 'YOUR_PI_PLATFORM_API_KEY' && piApiKey !== 'MY_PI_API_KEY');

  const verifyLive = async (): Promise<AuthoritativePiVerificationResult | null> => {
    if (!hasValidApiKey || cleanPaymentId.startsWith('dev_pay_') || cleanPaymentId.startsWith('test_')) return null;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(`https://api.minepi.com/v2/payments/${encodeURIComponent(cleanPaymentId)}`, {
        headers: { Authorization: `Key ${piApiKey}`, 'Content-Type': 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) return null;
      const paymentData = await response.json();
      const verified = paymentData?.status?.developer_completed === true && paymentData?.transaction?.verified === true;
      return {
        verified,
        status: verified ? 'VERIFIED' : 'VERIFICATION_FAILED',
        source: 'pi_platform',
        message: verified ? 'Payment verified on Pi Platform.' : 'Server verification failed. Payment is not confirmed on Pi Platform.',
        paymentData
      };
    } catch {
      clearTimeout(timeoutId);
      return null;
    }
  };

  const live = await verifyLive();
  if (live) return live;

  if (isProduction) {
    return { verified: false, status: 'VERIFICATION_FAILED', source: 'pi_platform', message: 'Server verification failed. Payment is not confirmed on Pi Platform.' };
  }

  const recorded = paymentLedgerRepo.findByPaymentId(cleanPaymentId);
  if (cleanPaymentId.startsWith('dev_pay_') || recorded?.status === 'COMPLETED' || recorded?.status === 'APPROVED') {
    return {
      verified: true,
      status: 'VERIFIED',
      source: 'sandbox_dev',
      message: 'Payment verified via Development Sandbox Fallback (Non-Production).',
      paymentData: recorded || { paymentId: cleanPaymentId, status: { developer_completed: true }, transaction: { verified: true } }
    };
  }

  return { verified: false, status: 'VERIFICATION_FAILED', source: 'sandbox_dev', message: 'Server verification failed. Payment is not confirmed on Pi Platform.' };
}
