import { randomUUID, createHash } from 'node:crypto';
import { Pool } from 'pg';
import {
  authorizeUtilityPayment,
  piAmountToPico,
  type CanonicalUtilityInvoice,
  type PiPaymentVerificationData,
} from '../../services/UtilityPaymentAuthorizationService';
import { validateTrustedFxQuote } from '../../services/TrustedFxQuoteService';

export interface NewUtilityInvoice {
  ownerUserId: string;
  serviceCategory: string;
  providerId: string;
  accountNumber: string;
  packageName: string;
  fiatAmount: string;
  fiatCurrency: string;
  piAmount: string;
  fxSource: string;
  fxAsOf: string;
  fxUsdPerFiatUnit: string;
  expiresAt: string;
}

export interface CreatedUtilityInvoice extends CanonicalUtilityInvoice {
  ownerUserId: string;
  serviceCategory: string;
  providerId: string;
  accountNumber: string;
  packageName: string;
  fiatAmount: string;
  fxSource: string;
  fxAsOf: string;
  fxUsdPerFiatUnit: string;
  expiresAt: string;
  createdAt: string;
}

export type UtilityReservationResult =
  | { status: 'RESERVED'; invoiceId: string; paymentId: string; txid: string; attemptId: string }
  | { status: 'IN_PROGRESS'; invoiceId: string; paymentId: string; txid: string }
  | { status: 'RESOLVED'; invoiceId: string; paymentId: string; txid: string; response: unknown }
  | { status: 'REJECTED'; error: string };

type InvoiceRow = {
  invoice_id: string;
  owner_user_id: string;
  payment_id: string | null;
  service_category: string;
  provider_id: string;
  account_number: string;
  package_name: string;
  fiat_amount: string;
  fiat_currency: string;
  pi_amount: string;
  fx_source: string;
  fx_as_of: Date | string;
  fx_usd_per_fiat_unit: string;
  status: CanonicalUtilityInvoice['status'] | 'FAILED';
  payment_txid: string | null;
  expires_at: Date | string;
  created_at: Date | string;
};


function isPositiveDecimal(value: string, maxDecimals: number): boolean {
  if (typeof value !== 'string' || !/^(?:0|[1-9]\\d*)(?:\\.\\d+)?$/.test(value)) return false;
  const [whole, fraction = ''] = value.split('.');
  if (fraction.length > maxDecimals) return false;
  try {
    return BigInt(whole) > 0n || /[1-9]/.test(fraction);
  } catch {
    return false;
  }
}

function iso(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function mapInvoice(row: InvoiceRow): CreatedUtilityInvoice {
  return {
    invoiceId: row.invoice_id,
    ownerUserId: row.owner_user_id,
    paymentId: row.payment_id || '',
    fiatAmount: String(row.fiat_amount),
    fiatCurrency: row.fiat_currency.trim().toUpperCase(),
    piAmount: String(row.pi_amount),
    status: row.status === 'FAILED' ? 'CANCELLED' : row.status,
    serviceCategory: row.service_category,
    providerId: row.provider_id,
    accountNumber: row.account_number,
    packageName: row.package_name,
    fxSource: row.fx_source,
    fxAsOf: iso(row.fx_as_of),
    fxUsdPerFiatUnit: String(row.fx_usd_per_fiat_unit),
    expiresAt: iso(row.expires_at),
    createdAt: iso(row.created_at),
  };
}

/**
 * Neon/Postgres-backed utility invoice persistence.
 *
 * This repository never accepts a client-supplied fiat or Pi amount as authority
 * during payment authorization. Invoice prices and FX provenance are written
 * at creation and subsequently read back from Postgres. Fulfillment remains a
 * separate provider action; callers must reconcile UNKNOWN outcomes before retry.
 */
export class NeonUtilityInvoiceRepository {
  private readonly pool: Pool;

  constructor(pool?: Pool) {
    if (pool) {
      this.pool = pool;
      return;
    }
    const connectionString = process.env.DATABASE_URL?.trim();
    if (!connectionString) throw new Error('UTILITY_DATABASE_URL_REQUIRED');
    this.pool = new Pool({
      connectionString,
      max: 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 5_000,
      ...(new URL(connectionString).hostname.endsWith('.neon.tech')
        ? { ssl: { rejectUnauthorized: false } }
        : {}),
    });
  }

  async createInvoice(input: NewUtilityInvoice): Promise<CreatedUtilityInvoice> {
    const currency = String(input.fiatCurrency || '').trim().toUpperCase();
    if (!/^[A-Z]{3}$/.test(currency)) throw new Error('UTILITY_FIAT_CURRENCY_INVALID');
    if (!isPositiveDecimal(input.fiatAmount, 8)) throw new Error('UTILITY_FIAT_AMOUNT_INVALID');
    const piPico = piAmountToPico(input.piAmount);
    if (piPico === null || piPico <= 0n) throw new Error('UTILITY_PI_AMOUNT_INVALID');
    if (!isPositiveDecimal(input.fxUsdPerFiatUnit, 16)) throw new Error('UTILITY_FX_RATE_INVALID');
    const expectedFxSource = process.env.PINOVA_FX_PROVIDER_SOURCE?.trim() || '';
    validateTrustedFxQuote({
      currency,
      usdPerFiatUnit: Number(input.fxUsdPerFiatUnit),
      asOf: input.fxAsOf,
      source: input.fxSource,
    }, currency, expectedFxSource);
    if (!input.ownerUserId || !input.serviceCategory || !input.providerId || !input.accountNumber) {
      throw new Error('UTILITY_INVOICE_FIELDS_REQUIRED');
    }
    const expiresAt = Date.parse(input.expiresAt);
    const fxAsOf = Date.parse(input.fxAsOf);
    if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) throw new Error('UTILITY_INVOICE_EXPIRY_INVALID');
    if (!Number.isFinite(fxAsOf)) throw new Error('UTILITY_FX_TIMESTAMP_INVALID');
    const invoiceId = `UTIL-${randomUUID()}`;
    const result = await this.pool.query<InvoiceRow>(
      `INSERT INTO public.utility_invoices
       (invoice_id, owner_user_id, payment_id, service_category, provider_id, account_number,
        package_name, fiat_amount, fiat_currency, pi_amount, fx_source, fx_as_of,
        fx_usd_per_fiat_unit, status, expires_at)
       VALUES ($1,$2,NULL,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'OPEN',$13)
       RETURNING invoice_id, owner_user_id, payment_id, service_category, provider_id,
         account_number, package_name, fiat_amount::text, fiat_currency, pi_amount::text,
         fx_source, fx_as_of, fx_usd_per_fiat_unit::text, status, payment_txid, expires_at, created_at`,
      [invoiceId, input.ownerUserId, input.serviceCategory, input.providerId, input.accountNumber,
       input.packageName, input.fiatAmount, currency, input.piAmount, input.fxSource,
       new Date(fxAsOf).toISOString(), input.fxUsdPerFiatUnit, new Date(expiresAt).toISOString()],
    );
    return mapInvoice(result.rows[0]);
  }

  /** Bind the Pi SDK payment identifier once, to an unexpired invoice owned by the caller. */
  async bindPaymentId(invoiceId: string, ownerUserId: string, paymentId: string): Promise<boolean> {
    if (!invoiceId || !ownerUserId || !paymentId || paymentId.length > 200) return false;
    try {
      const result = await this.pool.query(
        `UPDATE public.utility_invoices
         SET payment_id = $3, updated_at = now()
         WHERE invoice_id = $1 AND owner_user_id = $2
           AND status = 'OPEN' AND expires_at > now()
           AND (payment_id IS NULL OR payment_id = $3)`,
        [invoiceId, ownerUserId, paymentId],
      );
      return result.rowCount === 1;
    } catch (error) {
      if ((error as { code?: string })?.code === '23505') return false;
      throw error;
    }
  }

  async findOwnedInvoice(invoiceId: string, ownerUserId: string): Promise<CreatedUtilityInvoice | null> {
    const result = await this.pool.query<InvoiceRow>(
      `SELECT invoice_id, owner_user_id, payment_id, service_category, provider_id,
        account_number, package_name, fiat_amount::text, fiat_currency, pi_amount::text,
        fx_source, fx_as_of, fx_usd_per_fiat_unit::text, status, payment_txid, expires_at, created_at
       FROM public.utility_invoices WHERE invoice_id = $1 AND owner_user_id = $2 LIMIT 1`,
      [invoiceId, ownerUserId],
    );
    return result.rows[0] ? mapInvoice(result.rows[0]) : null;
  }

  /**
   * Verifies the authoritative Pi payload and atomically claims the invoice,
   * idempotency key and provider attempt in one database transaction.
   */
  async authorizeAndReserve(
    invoiceId: string,
    ownerUserId: string,
    paymentId: string,
    paymentData: PiPaymentVerificationData,
  ): Promise<UtilityReservationResult> {
    const client = await this.pool.connect();
    let inTransaction = false;
    try {
      await client.query('BEGIN');
      inTransaction = true;
      const found = await client.query<InvoiceRow>(
        `SELECT invoice_id, owner_user_id, payment_id, service_category, provider_id,
          account_number, package_name, fiat_amount::text, fiat_currency, pi_amount::text,
          fx_source, fx_as_of, fx_usd_per_fiat_unit::text, status, payment_txid, expires_at, created_at
         FROM public.utility_invoices
         WHERE invoice_id = $1 AND owner_user_id = $2
         FOR UPDATE`,
        [invoiceId, ownerUserId],
      );
      const row = found.rows[0];
      if (!row) {
        await client.query('ROLLBACK');
        inTransaction = false;
        return { status: 'REJECTED', error: 'UTILITY_INVOICE_NOT_FOUND' };
      }
      const invoice = mapInvoice(row);
      if (Date.parse(invoice.expiresAt) <= Date.now()) {
        await client.query('ROLLBACK');
        inTransaction = false;
        return { status: 'REJECTED', error: 'UTILITY_INVOICE_EXPIRED' };
      }
      const authorization = authorizeUtilityPayment(invoice, paymentId, paymentData);
      if (!authorization.authorized) {
        await client.query('ROLLBACK');
        inTransaction = false;
        return { status: 'REJECTED', error: authorization.error || 'UTILITY_PAYMENT_REJECTED' };
      }
      const txid = authorization.txid;
      if (!txid || txid.length > 200) {
        await client.query('ROLLBACK');
        inTransaction = false;
        return { status: 'REJECTED', error: 'PI_TRANSACTION_ID_REQUIRED' };
      }

      const requestFingerprint = createHash('sha256')
        .update([invoiceId, paymentId, txid, authorization.paidPiAmount || ''].join('|'))
        .digest('hex');
      const keyResult = await client.query(
        `INSERT INTO public.utility_payment_idempotency
          (idempotency_key, invoice_id, payment_id, request_fingerprint, status, expires_at)
         VALUES ($1,$2,$3,$4,'PENDING',now() + interval '24 hours')
         ON CONFLICT DO NOTHING RETURNING idempotency_key`,
        [paymentId, invoiceId, paymentId, requestFingerprint],
      );
      if (keyResult.rowCount !== 1) {
        const existing = await client.query(
          `SELECT invoice_id, payment_id, request_fingerprint, status, response
           FROM public.utility_payment_idempotency WHERE idempotency_key = $1 FOR UPDATE`,
          [paymentId],
        );
        const record = existing.rows[0];
        if (!record || record.invoice_id !== invoiceId || record.payment_id !== paymentId ||
            record.request_fingerprint !== requestFingerprint) {
          await client.query('ROLLBACK');
          inTransaction = false;
          return { status: 'REJECTED', error: 'UTILITY_IDEMPOTENCY_CONFLICT' };
        }
        await client.query('COMMIT');
        inTransaction = false;
        if (record.status === 'RESOLVED') {
          return { status: 'RESOLVED', invoiceId, paymentId, txid, response: record.response };
        }
        return { status: 'IN_PROGRESS', invoiceId, paymentId, txid };
      }

      const changed = await client.query(
        `UPDATE public.utility_invoices
         SET status = 'FULFILLMENT_PENDING', payment_txid = $2, paid_at = now(), updated_at = now()
         WHERE invoice_id = $1 AND status = 'OPEN' AND payment_id = $3 AND expires_at > now()`,
        [invoiceId, txid, paymentId],
      );
      if (changed.rowCount !== 1) {
        await client.query('ROLLBACK');
        inTransaction = false;
        return { status: 'REJECTED', error: 'UTILITY_INVOICE_STATE_CONFLICT' };
      }
      const attemptId = randomUUID();
      await client.query(
        `INSERT INTO public.utility_fulfillment_attempts
          (attempt_id, invoice_id, payment_id, payment_txid, provider, status)
         VALUES ($1,$2,$3,$4,$5,'STARTED')`,
        [attemptId, invoiceId, paymentId, txid, invoice.providerId],
      );
      await client.query('COMMIT');
      inTransaction = false;
      return { status: 'RESERVED', invoiceId, paymentId, txid, attemptId };
    } catch (error) {
      if (inTransaction) await client.query('ROLLBACK').catch(() => undefined);
      if ((error as { code?: string })?.code === '23505') {
        return { status: 'REJECTED', error: 'UTILITY_PAYMENT_REPLAY_DETECTED' };
      }
      throw error;
    } finally {
      client.release();
    }
  }

  /** Persist provider outcome. UNKNOWN must be reconciled, not blindly retried. */
  async recordFulfillmentOutcome(input: {
    invoiceId: string;
    txid: string;
    status: 'SUCCEEDED' | 'FAILED' | 'UNKNOWN';
    providerReference?: string;
    response?: unknown;
  }): Promise<boolean> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const updated = await client.query(
        `UPDATE public.utility_fulfillment_attempts
         SET status = $3, provider_reference = $4, response = $5::jsonb, updated_at = now()
         WHERE invoice_id = $1 AND payment_txid = $2 AND status IN ('STARTED','UNKNOWN')`,
        [input.invoiceId, input.txid, input.status, input.providerReference || null,
         input.response === undefined ? null : JSON.stringify(input.response)],
      );
      if (updated.rowCount !== 1) {
        await client.query('ROLLBACK');
        return false;
      }
      const invoiceStatus = input.status === 'SUCCEEDED' ? 'FULFILLED'
        : input.status === 'FAILED' ? 'FAILED' : 'FULFILLMENT_PENDING';
      await client.query(
        `UPDATE public.utility_invoices SET status = $2, provider_reference = $3,
          fulfillment_response = $4::jsonb, fulfilled_at = CASE WHEN $2 = 'FULFILLED' THEN now() ELSE fulfilled_at END,
          updated_at = now() WHERE invoice_id = $1 AND status = 'FULFILLMENT_PENDING'`,
        [input.invoiceId, invoiceStatus, input.providerReference || null,
         input.response === undefined ? null : JSON.stringify(input.response)],
      );
      await client.query(
        `UPDATE public.utility_payment_idempotency
         SET status = $2, response = $3::jsonb, updated_at = now()
         WHERE invoice_id = $1 AND status = 'PENDING'`,
        [input.invoiceId, input.status === 'UNKNOWN' ? 'PENDING' : input.status === 'SUCCEEDED' ? 'RESOLVED' : 'FAILED',
         input.response === undefined ? null : JSON.stringify(input.response)],
      );
      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK').catch(() => undefined);
      throw error;
    } finally {
      client.release();
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
