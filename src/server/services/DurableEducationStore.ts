import crypto from 'crypto';
import type {
  EducationInvoice,
  EducationPaymentTransaction,
  DigitalEducationReceipt
} from '../../types/education';
import { getNeonSql, neonDatabaseEnabled } from '../db/NeonDatabase';
import { piDecimalForStorage } from './piDecimal';

type DbRow = Record<string, any>;

export function durableEducationStorageEnabled(): boolean {
  return neonDatabaseEnabled();
}

function decodeJson<T>(value: unknown): T {
  if (typeof value === 'string') return JSON.parse(value) as T;
  return value as T;
}

function clean(value: unknown): string {
  return String(value ?? '').trim();
}

export type PaymentBinding = {
  invoiceId: string;
  idempotencyKey: string;
  piPaymentId: string;
  piTxid: string;
  payerUsername: string;
  amountPaid: number;
  piAmount: number;
};

export function matchesPaymentBinding(payment: EducationPaymentTransaction, expected: PaymentBinding): boolean {
  return payment.invoiceId === expected.invoiceId
    && payment.idempotencyKey === expected.idempotencyKey
    && payment.piPaymentId === expected.piPaymentId
    && payment.piTxid === expected.piTxid
    && payment.payerUsername.toLowerCase() === expected.payerUsername.toLowerCase()
    && Math.abs(payment.amountPaid - expected.amountPaid) <= 1e-12
    && Math.abs(Number(payment.piAmount) - expected.piAmount) <= 1e-12;
}

function digestReceipt(input: {
  receiptNumber: string;
  invoice: EducationInvoice;
  paymentId: string;
  amount: number;
  paymentDate: string;
}): string {
  const canonical = [
    input.receiptNumber.trim().toUpperCase(),
    input.invoice.invoiceNumber.trim(),
    input.paymentId,
    input.invoice.studentId,
    input.invoice.institutionId,
    piDecimalForStorage(input.amount),
    'PI',
    input.paymentDate,
    'SETTLED'
  ].join('|');
  return crypto.createHash('sha256').update(canonical).digest('hex');
}

/**
 * Explicit Neon-backed Education persistence.
 *
 * This store is deliberately not wired into the legacy synchronous
 * EducationRepository. Callers must opt in after a controlled legacy-data
 * migration has been reviewed. It never reads from or writes to Blob storage.
 */
export class DurableEducationStore {
  async getInvoice(invoiceId: string): Promise<EducationInvoice | null> {
    const id = clean(invoiceId);
    if (!id || !neonDatabaseEnabled()) return null;
    const sql = getNeonSql();
    const rows = await sql`SELECT data FROM education_invoices WHERE id = ${id} LIMIT 1` as unknown as DbRow[];
    return rows.length ? decodeJson<EducationInvoice>(rows[0].data) : null;
  }

  async listInvoices(filter?: {
    institutionId?: string;
    studentId?: string;
    status?: string;
  }): Promise<EducationInvoice[]> {
    if (!neonDatabaseEnabled()) return [];
    const sql = getNeonSql();
    const rows = await sql`SELECT data FROM education_invoices
      WHERE (${clean(filter?.institutionId) || null}::text IS NULL OR institution_id = ${clean(filter?.institutionId) || null})
        AND (${clean(filter?.studentId) || null}::text IS NULL OR student_id = ${clean(filter?.studentId) || null})
        AND (${clean(filter?.status) || null}::text IS NULL OR status = ${clean(filter?.status) || null})
      ORDER BY created_at DESC` as unknown as DbRow[];
    return rows.map((row) => decodeJson<EducationInvoice>(row.data));
  }

  /**
   * Insert-only by default: existing durable invoice rows are never silently
   * overwritten by a stale file-backed snapshot.
   */
  async createInvoice(invoice: EducationInvoice): Promise<EducationInvoice> {
    if (!neonDatabaseEnabled()) throw new Error('DURABLE_EDUCATION_STORAGE_UNAVAILABLE');
    const id = clean(invoice?.id);
    if (!id) throw new Error('EDUCATION_INVOICE_ID_REQUIRED');
    if (clean(invoice.currency).toUpperCase() !== 'PI') throw new Error('PI_NATIVE_INVOICE_REQUIRED');
    const total = Number(invoice.totalAmount);
    const paid = Number(invoice.amountPaid || 0);
    const outstanding = Number(invoice.outstandingBalance);
    if (![total, paid, outstanding].every(Number.isFinite) || total < 0 || paid < 0 || outstanding < 0 || paid > total + 1e-12) {
      throw new Error('INVALID_EDUCATION_INVOICE_BALANCE');
    }
    if (Math.abs(outstanding - Math.max(0, total - paid)) > 1e-9) {
      throw new Error('EDUCATION_INVOICE_BALANCE_MISMATCH');
    }
    const snapshot: EducationInvoice = { ...invoice, currency: 'PI' };
    const sql = getNeonSql();
    try {
      const rows = await sql`INSERT INTO education_invoices
        (id, institution_id, student_id, status, currency, total_amount, amount_paid, outstanding_balance, data, created_at, updated_at)
        VALUES (${id}, ${clean(invoice.institutionId)}, ${clean(invoice.studentId)}, ${clean(invoice.status)}, 'PI',
          ${piDecimalForStorage(total)}, ${piDecimalForStorage(paid)}, ${piDecimalForStorage(outstanding)},
          ${JSON.stringify(snapshot)}::jsonb, ${invoice.createdAt}, ${invoice.updatedAt})
        ON CONFLICT (id) DO NOTHING
        RETURNING data` as unknown as DbRow[];
      if (!rows.length) throw new Error('EDUCATION_INVOICE_ALREADY_EXISTS');
      return decodeJson<EducationInvoice>(rows[0].data);
    } catch (error) {
      if (String((error as any)?.message || '').includes('EDUCATION_INVOICE_ALREADY_EXISTS')) throw error;
      throw error;
    }
  }

  async getPaymentById(paymentId: string): Promise<EducationPaymentTransaction | null> {
    const id = clean(paymentId);
    if (!id || !neonDatabaseEnabled()) return null;
    const sql = getNeonSql();
    const rows = await sql`SELECT data FROM education_payments WHERE id = ${id} LIMIT 1` as unknown as DbRow[];
    return rows.length ? decodeJson<EducationPaymentTransaction>(rows[0].data) : null;
  }

  async getPaymentsByInvoiceId(invoiceId: string): Promise<EducationPaymentTransaction[]> {
    const id = clean(invoiceId);
    if (!id) return [];
    if (!neonDatabaseEnabled()) throw new Error('DURABLE_EDUCATION_STORAGE_UNAVAILABLE');
    const sql = getNeonSql();
    const rows = await sql`SELECT data FROM education_payments
      WHERE invoice_id = ${id}
      ORDER BY verified_at DESC` as unknown as DbRow[];
    return rows.map((row) => decodeJson<EducationPaymentTransaction>(row.data));
  }

  async getAuditLogs(entityType?: string): Promise<DbRow[]> {
    if (!neonDatabaseEnabled()) throw new Error('DURABLE_EDUCATION_STORAGE_UNAVAILABLE');
    const type = clean(entityType) || null;
    const sql = getNeonSql();
    const rows = await sql`SELECT data FROM education_audit_logs
      WHERE (${type}::text IS NULL OR entity_type = ${type})
      ORDER BY created_at DESC` as unknown as DbRow[];
    return rows.map((row) => decodeJson<DbRow>(row.data));
  }

  async getReceiptByNumber(receiptNumber: string): Promise<DigitalEducationReceipt | null> {
    const number = clean(receiptNumber).toUpperCase();
    if (!number || !neonDatabaseEnabled()) return null;
    const sql = getNeonSql();
    const rows = await sql`SELECT data FROM education_receipts WHERE receipt_number = ${number} LIMIT 1` as unknown as DbRow[];
    return rows.length ? decodeJson<DigitalEducationReceipt>(rows[0].data) : null;
  }

  /**
   * Public receipt verification reads only the authoritative Neon records.
   * It cross-binds receipt, payment and invoice rows before recomputing SHA-256.
   */
  async verifyReceipt(receiptNumber: string): Promise<{
    found: boolean;
    valid: boolean;
    status: 'VERIFIED' | 'TAMPERED' | 'NOT_FOUND';
    algorithm: 'SHA-256';
    digest?: string;
    receipt?: DigitalEducationReceipt;
  }> {
    const number = clean(receiptNumber).toUpperCase();
    if (!number) return { found: false, valid: false, status: 'NOT_FOUND', algorithm: 'SHA-256' };
    if (!neonDatabaseEnabled()) throw new Error('DURABLE_EDUCATION_STORAGE_UNAVAILABLE');

    const sql = getNeonSql();
    const rows = await sql`SELECT r.data AS receipt, r.verification_hash AS persisted_hash,
        p.data AS payment, i.data AS invoice
      FROM education_receipts r
      JOIN education_payments p ON p.id = r.payment_id
      JOIN education_invoices i ON i.id = r.invoice_id
      WHERE r.receipt_number = ${number}
      LIMIT 1` as unknown as DbRow[];

    if (!rows.length) return { found: false, valid: false, status: 'NOT_FOUND', algorithm: 'SHA-256' };

    const receipt = decodeJson<DigitalEducationReceipt>(rows[0].receipt);
    const payment = decodeJson<EducationPaymentTransaction>(rows[0].payment);
    const invoice = decodeJson<EducationInvoice>(rows[0].invoice);
    const expected = digestReceipt({
      receiptNumber: receipt.receiptNumber,
      invoice,
      paymentId: payment.id,
      amount: payment.amountPaid,
      paymentDate: payment.verifiedAt
    });
    const storedHash = clean(receipt.verificationHash).toLowerCase();
    const persistedHash = clean(rows[0].persisted_hash).toLowerCase();
    const auditHash = clean(payment.auditHash).toLowerCase();
    const hashesMatch = [storedHash, persistedHash, auditHash].every((hash) => /^[a-f0-9]{64}$/.test(hash)
      && crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(expected, 'hex')));
    const bindingsMatch = receipt.receiptNumber.trim().toUpperCase() === number
      && receipt.paymentId === payment.id
      && payment.receiptNumber === receipt.receiptNumber
      && receipt.invoiceId === invoice.id
      && payment.invoiceId === invoice.id
      && receipt.institutionId === invoice.institutionId
      && payment.institutionId === invoice.institutionId
      && receipt.studentId === invoice.studentId
      && payment.studentId === invoice.studentId
      && Math.abs(Number(receipt.amountPaid) - Number(payment.amountPaid)) <= 1e-12
      && Math.abs(Number(payment.amountPaid) - Number(payment.piAmount)) <= 1e-12
      && receipt.currency === 'PI'
      && payment.currency === 'PI'
      && payment.paymentMethod === 'PI_NETWORK'
      && payment.status === 'VERIFIED_COMPLETED'
      && receipt.settlementStatus === 'SETTLED'
      && receipt.verifiedByServer === true
      && Boolean(payment.piPaymentId && payment.piTxid)
      && receipt.piPaymentId === payment.piPaymentId
      && receipt.piTxid === payment.piTxid
      && receipt.paymentDate === payment.verifiedAt;
    const valid = bindingsMatch && hashesMatch;

    return {
      found: true,
      valid,
      status: valid ? 'VERIFIED' : 'TAMPERED',
      algorithm: 'SHA-256',
      digest: valid ? expected : undefined,
      receipt: valid ? receipt : undefined
    };
  }

  /**
   * Settles only a server-verified Pi payment. Invoice balance mutation,
   * payment, receipt and audit record are one PostgreSQL statement/transaction.
   * A row lock plus conditional balance update prevents concurrent overpayment;
   * unique database indexes prevent idempotency, payment-ID and TXID replay.
   */
  async settleVerifiedPiPayment(params: {
    invoiceId: string;
    amountPaid: number;
    piAmount: number;
    piPaymentId: string;
    piTxid: string;
    idempotencyKey: string;
    payerUsername: string;
  }): Promise<{
    success: true;
    payment: EducationPaymentTransaction;
    invoice: EducationInvoice;
    receipt: DigitalEducationReceipt;
    replayed: boolean;
  }> {
    if (!neonDatabaseEnabled()) throw new Error('DURABLE_EDUCATION_STORAGE_UNAVAILABLE');
    const invoiceId = clean(params.invoiceId);
    const paymentIdOnPi = clean(params.piPaymentId);
    const txid = clean(params.piTxid);
    const idempotencyKey = clean(params.idempotencyKey);
    const payer = clean(params.payerUsername);
    const amount = Number(params.amountPaid);
    const piAmount = Number(params.piAmount);
    if (!invoiceId || !paymentIdOnPi || !txid || !idempotencyKey || !payer) throw new Error('EDUCATION_PI_PAYMENT_BINDING_REQUIRED');
    if (!Number.isFinite(amount) || amount <= 0 || !Number.isFinite(piAmount) || piAmount <= 0) throw new Error('PAYMENT_AMOUNT_REQUIRED');
    if (Math.abs(amount - piAmount) > 1e-12) throw new Error('PI_AMOUNT_MISMATCH');

    const sql = getNeonSql();
    const existingRows = await sql`SELECT p.data AS payment, r.data AS receipt, i.data AS invoice
      FROM education_payments p
      JOIN education_receipts r ON r.payment_id = p.id
      JOIN education_invoices i ON i.id = p.invoice_id
      WHERE p.idempotency_key = ${idempotencyKey}
         OR p.pi_payment_id = ${paymentIdOnPi}
         OR p.pi_txid = ${txid}` as unknown as DbRow[];

    if (existingRows.length) {
      const matched = existingRows.map((row) => ({
        payment: decodeJson<EducationPaymentTransaction>(row.payment),
        invoice: decodeJson<EducationInvoice>(row.invoice),
        receipt: decodeJson<DigitalEducationReceipt>(row.receipt)
      }));
      const expected: PaymentBinding = {
        invoiceId, idempotencyKey, piPaymentId: paymentIdOnPi, piTxid: txid,
        payerUsername: payer, amountPaid: amount, piAmount
      };
      // Every matching unique key must resolve to the same exact settlement.
      // Checking only an arbitrary first row can hide a collision where, for
      // example, the idempotency key belongs to payment A but the TXID to B.
      if (!matched.every((entry) => matchesPaymentBinding(entry.payment, expected))) {
        throw new Error('EDUCATION_PAYMENT_REPLAY_BINDING_MISMATCH');
      }
      return { success: true, ...matched[0], replayed: true };
    }

    const invoice = await this.getInvoice(invoiceId);
    if (!invoice) throw new Error('DURABLE_EDUCATION_INVOICE_NOT_FOUND');
    if (clean(invoice.currency).toUpperCase() !== 'PI') throw new Error('PI_NATIVE_INVOICE_REQUIRED');
    if (amount > invoice.outstandingBalance + 1e-12) throw new Error('EDUCATION_OVERPAYMENT_REJECTED');

    const now = new Date().toISOString();
    const entropy = crypto.randomBytes(5).toString('hex').toUpperCase();
    const paymentId = `PAY-EDU-${Date.now()}-${entropy}`;
    const receiptNumber = `RCP-EDU-${clean(invoice.institutionId).slice(-3).toUpperCase()}-${Date.now().toString().slice(-6)}-${entropy}`;
    const verificationReference = `VER-EDU-${entropy}`;
    const auditId = `AUD-EDU-${crypto.randomUUID()}`;
    const verificationHash = digestReceipt({ receiptNumber, invoice, paymentId, amount, paymentDate: now });
    const payment: EducationPaymentTransaction = {
      id: paymentId,
      invoiceId,
      institutionId: invoice.institutionId,
      studentId: invoice.studentId,
      amountPaid: amount,
      currency: 'PI',
      piAmount,
      piPaymentId: paymentIdOnPi,
      piTxid: txid,
      paymentMethod: 'PI_NETWORK',
      status: 'VERIFIED_COMPLETED',
      receiptNumber,
      payerUsername: payer,
      idempotencyKey,
      verifiedAt: now,
      auditHash: verificationHash
    };
    const receipt: DigitalEducationReceipt = {
      receiptNumber,
      verificationReference,
      verificationHash,
      algorithm: 'SHA-256',
      invoiceId,
      invoiceNumber: invoice.invoiceNumber,
      paymentId,
      institutionId: invoice.institutionId,
      institutionName: invoice.institutionName,
      studentId: invoice.studentId,
      studentName: invoice.studentName,
      studentMatricOrReg: invoice.studentMatricOrReg,
      educationLevel: invoice.programmeOrClass || invoice.educationLevel || 'Undergraduate',
      academicSession: invoice.academicSession,
      termOrSemester: invoice.termOrSemester,
      chargeDescription: (invoice.items || invoice.lineItems || []).map((item) => item.description || 'Fee item').join(', ') || 'School Fee Payment',
      amountPaid: amount,
      currency: 'PI',
      piAmount,
      piPaymentId: paymentIdOnPi,
      piTxid: txid,
      paymentMethod: 'PI_NETWORK',
      paymentDate: now,
      settlementStatus: 'SETTLED',
      verifiedByServer: true,
      publicSafeSummary: {
        receiptNumber,
        institutionName: invoice.institutionName,
        academicSession: invoice.academicSession,
        termOrSemester: invoice.termOrSemester,
        amountPaidFormatted: `${piAmount.toFixed(12)} π`,
        verifiedAt: now,
        isAuthentic: true
      }
    };
    const auditPayload = {
      id: auditId,
      entityType: 'PAYMENT',
      entityId: paymentId,
      action: 'SETTLE_FEE_PAYMENT',
      actorUsername: payer,
      auditHash: crypto.createHash('sha256').update([auditId, paymentId, payer, now, verificationHash].join('|')).digest('hex'),
      details: `Verified Pi fee payment ${paymentId} for invoice ${invoice.invoiceNumber}`,
      timestamp: now
    };

    const amountDb = piDecimalForStorage(amount);
    let rows: DbRow[];
    try {
      rows = await sql`WITH updated_invoice AS (
        UPDATE education_invoices
        SET amount_paid = amount_paid + ${amountDb}::numeric,
            outstanding_balance = GREATEST(outstanding_balance - ${amountDb}::numeric, 0),
            status = CASE WHEN GREATEST(outstanding_balance - ${amountDb}::numeric, 0) <= 0.000000000001
                          THEN 'PAID' ELSE 'PARTIALLY_PAID' END,
            data = data || jsonb_build_object(
              'amountPaid', amount_paid + ${amountDb}::numeric,
              'outstandingBalance', GREATEST(outstanding_balance - ${amountDb}::numeric, 0),
              'status', CASE WHEN GREATEST(outstanding_balance - ${amountDb}::numeric, 0) <= 0.000000000001
                             THEN 'PAID' ELSE 'PARTIALLY_PAID' END,
              'installmentsPaidCount', COALESCE(NULLIF(data->>'installmentsPaidCount','')::integer, 0) + 1,
              'updatedAt', ${now}
            ),
            updated_at = ${now}
        WHERE id = ${invoiceId}
          AND currency = 'PI'
          AND status <> 'CANCELLED'
          AND outstanding_balance >= ${amountDb}::numeric
        RETURNING data
      ), inserted_payment AS (
        INSERT INTO education_payments
          (id, invoice_id, institution_id, student_id, pi_payment_id, pi_txid, idempotency_key, amount_paid, currency, status, data, verified_at)
        SELECT ${paymentId}, ${invoiceId}, ${invoice.institutionId}, ${invoice.studentId},
          ${paymentIdOnPi}, ${txid}, ${idempotencyKey}, ${amountDb}::numeric, 'PI',
          'VERIFIED_COMPLETED', ${JSON.stringify(payment)}::jsonb, ${now}
        FROM updated_invoice
        RETURNING data
      ), inserted_receipt AS (
        INSERT INTO education_receipts
          (receipt_number, payment_id, invoice_id, verification_hash, data, created_at)
        SELECT ${receiptNumber}, ${paymentId}, ${invoiceId}, ${verificationHash},
          ${JSON.stringify(receipt)}::jsonb, ${now}
        FROM inserted_payment
        RETURNING data
      ), inserted_audit AS (
        INSERT INTO education_audit_logs
          (id, entity_type, entity_id, action, actor_username, audit_hash, data, created_at)
        SELECT ${auditId}, 'PAYMENT', ${paymentId}, 'SETTLE_FEE_PAYMENT', ${payer},
          ${auditPayload.auditHash}, ${JSON.stringify(auditPayload)}::jsonb, ${now}
        FROM inserted_receipt
        RETURNING id
      )
      SELECT (SELECT data FROM inserted_payment) AS payment,
             (SELECT data FROM updated_invoice) AS invoice,
             (SELECT data FROM inserted_receipt) AS receipt,
             (SELECT id FROM inserted_audit) AS audit_id` as unknown as DbRow[];
    } catch (error) {
      if (String((error as any)?.code || '') !== '23505') throw error;
      const racedRows = await sql`SELECT p.data AS payment, r.data AS receipt, i.data AS invoice
        FROM education_payments p
        JOIN education_receipts r ON r.payment_id = p.id
        JOIN education_invoices i ON i.id = p.invoice_id
        WHERE p.idempotency_key = ${idempotencyKey}
           OR p.pi_payment_id = ${paymentIdOnPi}
           OR p.pi_txid = ${txid}` as unknown as DbRow[];
      if (!racedRows.length) throw new Error('EDUCATION_PAYMENT_REPLAY_CONFLICT');
      const raced = racedRows.map((row) => ({
        payment: decodeJson<EducationPaymentTransaction>(row.payment),
        invoice: decodeJson<EducationInvoice>(row.invoice),
        receipt: decodeJson<DigitalEducationReceipt>(row.receipt)
      }));
      const expected: PaymentBinding = {
        invoiceId, idempotencyKey, piPaymentId: paymentIdOnPi, piTxid: txid,
        payerUsername: payer, amountPaid: amount, piAmount
      };
      if (!raced.every((entry) => matchesPaymentBinding(entry.payment, expected))) {
        throw new Error('EDUCATION_PAYMENT_REPLAY_BINDING_MISMATCH');
      }
      return { success: true, ...raced[0], replayed: true };
    }

    if (!rows.length || !rows[0].payment || !rows[0].receipt || !rows[0].invoice || !rows[0].audit_id) {
      // A concurrent exact retry can observe a zero-row conditional invoice
      // update after the first request has consumed the full remaining balance.
      // Re-read the unique payment bindings before classifying this as an error.
      const committedRows = await sql`SELECT p.data AS payment, r.data AS receipt, i.data AS invoice
        FROM education_payments p
        JOIN education_receipts r ON r.payment_id = p.id
        JOIN education_invoices i ON i.id = p.invoice_id
        WHERE p.idempotency_key = ${idempotencyKey}
           OR p.pi_payment_id = ${paymentIdOnPi}
           OR p.pi_txid = ${txid}` as unknown as DbRow[];
      if (committedRows.length) {
        const committed = committedRows.map((row) => ({
          payment: decodeJson<EducationPaymentTransaction>(row.payment),
          invoice: decodeJson<EducationInvoice>(row.invoice),
          receipt: decodeJson<DigitalEducationReceipt>(row.receipt)
        }));
        const expected: PaymentBinding = {
          invoiceId, idempotencyKey, piPaymentId: paymentIdOnPi, piTxid: txid,
          payerUsername: payer, amountPaid: amount, piAmount
        };
        if (!committed.every((entry) => matchesPaymentBinding(entry.payment, expected))) {
          throw new Error('EDUCATION_PAYMENT_REPLAY_BINDING_MISMATCH');
        }
        return { success: true, ...committed[0], replayed: true };
      }
      const current = await this.getInvoice(invoiceId);
      if (!current) throw new Error('DURABLE_EDUCATION_INVOICE_NOT_FOUND');
      if (amount > current.outstandingBalance + 1e-12) throw new Error('EDUCATION_OVERPAYMENT_REJECTED');
      throw new Error('EDUCATION_SETTLEMENT_NOT_COMMITTED');
    }

    const updatedInvoice = decodeJson<EducationInvoice>(rows[0].invoice);
    const paymentResult = decodeJson<EducationPaymentTransaction>(rows[0].payment);
    const receiptResult = decodeJson<DigitalEducationReceipt>(rows[0].receipt);
    return {
      success: true,
      payment: paymentResult,
      invoice: updatedInvoice,
      receipt: receiptResult,
      replayed: false
    };
  }
}
