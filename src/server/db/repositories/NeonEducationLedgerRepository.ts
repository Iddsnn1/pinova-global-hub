import crypto from 'crypto';
import type { PoolClient } from 'pg';
import type {
  EducationInvoice,
  EducationPaymentTransaction,
  DigitalEducationReceipt
} from '../../../types/education';
import { neonQuery, withNeonTransaction } from '../neon';

const SCALE = 12;
const units = (value: number | string): bigint => {
  const raw = String(value ?? '').trim();
  if (!/^\d+(?:\.\d+)?$/.test(raw)) throw new Error('INVALID_PI_AMOUNT');
  const parts = raw.split('.');
  if ((parts[1] || '').length > SCALE) throw new Error('PI_AMOUNT_MAX_12_DECIMALS');
  return BigInt(parts[0]) * 1000000000000n +
    BigInt(((parts[1] || '') + '0'.repeat(SCALE)).slice(0, SCALE));
};
const decimal = (value: number | string): string => {
  const n = units(value);
  const whole = n / 1000000000000n;
  const frac = (n % 1000000000000n).toString().padStart(SCALE, '0');
  return whole.toString() + '.' + frac;
};
const num = (v: unknown) => Number(v);

function invoice(row: any): EducationInvoice {
  return {
    id: row.id, invoiceNumber: row.invoice_number, institutionId: row.institution_id,
    institutionName: row.institution_name, studentId: row.student_id, studentName: row.student_name,
    studentMatricOrReg: row.student_matric_or_reg || '', guardianId: row.guardian_id || undefined,
    educationTier: row.education_tier, educationLevel: row.education_level || undefined,
    programmeOrClass: row.programme_or_class, academicSession: row.academic_session,
    termOrSemester: row.term_or_semester, items: row.items || [], lineItems: row.line_items || undefined,
    subtotal: num(row.subtotal), discountAmount: num(row.discount_amount),
    discountReason: row.discount_reason || undefined, taxAmount: num(row.tax_amount),
    totalAmount: num(row.total_amount), amountPaid: num(row.amount_paid),
    outstandingBalance: num(row.outstanding_balance), currency: row.currency,
    countryCode: row.country_code || undefined, dueDate: new Date(row.due_date).toISOString(),
    issuedDate: row.issued_date ? new Date(row.issued_date).toISOString() : undefined,
    status: row.status, allowedInstallments: row.allowed_installments,
    installmentsPaidCount: row.installments_paid_count,
    createdAt: new Date(row.created_at).toISOString(), updatedAt: new Date(row.updated_at).toISOString()
  };
}

function payment(row: any): EducationPaymentTransaction {
  return {
    id: row.id, invoiceId: row.invoice_id, institutionId: row.institution_id, studentId: row.student_id,
    amountPaid: num(row.amount_paid), currency: row.currency, piAmount: num(row.pi_amount),
    piPaymentId: row.pi_payment_id || undefined, piTxid: row.pi_txid || undefined,
    paymentMethod: row.payment_method, status: row.status, receiptNumber: row.receipt_number,
    payerUsername: row.payer_username, idempotencyKey: row.idempotency_key,
    verifiedAt: new Date(row.verified_at).toISOString(), auditHash: row.audit_hash
  };
}

function receipt(row: any): DigitalEducationReceipt {
  return {
    receiptNumber: row.receipt_number, verificationReference: row.verification_reference,
    verificationHash: row.verification_hash, algorithm: row.algorithm, invoiceId: row.invoice_id,
    invoiceNumber: row.invoice_number, paymentId: row.payment_id || undefined,
    institutionId: row.institution_id, institutionName: row.institution_name,
    institutionLogo: row.institution_logo || undefined, studentId: row.student_id || undefined,
    studentName: row.student_name, studentMatricOrReg: row.student_matric_or_reg,
    educationLevel: row.education_level, academicSession: row.academic_session,
    termOrSemester: row.term_or_semester, chargeDescription: row.charge_description,
    amountPaid: num(row.amount_paid), currency: row.currency, piAmount: num(row.pi_amount),
    piPaymentId: row.pi_payment_id || undefined, piTxid: row.pi_txid || undefined,
    paymentMethod: row.payment_method, paymentDate: new Date(row.payment_date).toISOString(),
    settlementStatus: row.settlement_status || undefined, verifiedByServer: Boolean(row.verified_by_server),
    publicSafeSummary: row.public_safe_summary || {}
  };
}

function digest(ref: string, inv: string, pay: string, student: string, inst: string,
  amount: number | string, currency: string, timestamp: string, status: string): string {
  const canonical = [
    ref.trim().toUpperCase(), inv.trim(), pay.trim(), student.trim(), inst.trim(),
    decimal(amount), currency.trim().toUpperCase(), timestamp.trim(), status.trim().toUpperCase()
  ].join('|');
  return crypto.createHash('sha256').update(canonical).digest('hex');
}

async function duplicate(client: PoolClient, invoiceId: string, key: string, piPaymentId: string, piTxid?: string) {
  const pr = await client.query(
    'SELECT p.* FROM education_payments p ' +
    'WHERE p.invoice_id = $1 AND (p.idempotency_key = $2 OR p.pi_payment_id = $3 OR ($4::text IS NOT NULL AND p.pi_txid = $4)) LIMIT 1',
    [invoiceId, key, piPaymentId, piTxid || null]
  );
  if (!pr.rows[0]) return null;

  const ir = await client.query('SELECT * FROM education_invoices WHERE id = $1', [pr.rows[0].invoice_id]);
  const rr = await client.query('SELECT * FROM education_receipts WHERE receipt_number = $1', [pr.rows[0].receipt_number]);
  if (!ir.rows[0] || !rr.rows[0]) throw new Error('PAYMENT_REPLAY_RECEIPT_MISSING');

  return {
    payment: payment(pr.rows[0]),
    invoice: invoice(ir.rows[0]),
    receipt: receipt(rr.rows[0])
  };
}

export class NeonEducationLedgerRepository {
  async getInvoiceById(id: string): Promise<EducationInvoice | null> {
    const rows = await neonQuery<any>('SELECT * FROM education_invoices WHERE id = $1 LIMIT 1', [id]);
    return rows[0] ? invoice(rows[0]) : null;
  }

  async getInvoices(filter?: { studentId?: string; institutionId?: string; status?: string; guardianId?: string }): Promise<EducationInvoice[]> {
    const clauses: string[] = [];
    const values: unknown[] = [];
    const add = (column: string, value: string) => {
      values.push(value);
      clauses.push(column + ' = $' + values.length);
    };
    if (filter?.studentId) add('student_id', filter.studentId);
    if (filter?.institutionId) add('institution_id', filter.institutionId);
    if (filter?.status && filter.status !== 'ALL') add('status', filter.status);
    if (filter?.guardianId) add('guardian_id', filter.guardianId);
    const sql = 'SELECT * FROM education_invoices' +
      (clauses.length ? ' WHERE ' + clauses.join(' AND ') : '') + ' ORDER BY created_at DESC';
    const rows = await neonQuery<any>(sql, values);
    return rows.map(invoice);
  }

  /**
   * Persists an already provider-authoritative invoice.
   * Fee calculation is intentionally outside this repository.
   */
  async createInvoice(input: EducationInvoice): Promise<EducationInvoice> {
    if (String(input.currency || '').trim().toUpperCase() !== 'PI') {
      throw new Error('PI_NATIVE_INVOICE_REQUIRED');
    }

    const total = decimal(input.totalAmount);
    const subtotal = decimal(input.subtotal);
    const discount = decimal(input.discountAmount);
    const tax = decimal(input.taxAmount);
    const amountPaid = decimal(input.amountPaid);
    const outstanding = decimal(input.outstandingBalance);

    if (units(amountPaid) !== 0n) throw new Error('INVOICE_INITIAL_PAYMENT_MUST_BE_ZERO');
    if (units(outstanding) !== units(total)) throw new Error('INVOICE_BALANCE_INCONSISTENT');
    if (!input.id || !input.invoiceNumber || !input.institutionId || !input.studentId) {
      throw new Error('INVOICE_REQUIRED_FIELDS_MISSING');
    }

    const now = new Date().toISOString();
    const issuedAt = input.issuedDate || now;
    if (!input.dueDate || Number.isNaN(new Date(input.dueDate).getTime())) {
      throw new Error('INVOICE_DUE_DATE_REQUIRED');
    }

    const record = {
      ...input,
      currency: 'PI' as const,
      subtotal: Number(subtotal),
      discountAmount: Number(discount),
      taxAmount: Number(tax),
      totalAmount: Number(total),
      amountPaid: 0,
      outstandingBalance: Number(outstanding),
      status: 'UNPAID',
      issuedDate: issuedAt,
      createdAt: input.createdAt || now,
      updatedAt: now
    };

    await neonQuery(
      'INSERT INTO education_invoices (' +
      'id, invoice_number, institution_id, institution_name, student_id, student_name, ' +
      'student_matric_or_reg, guardian_id, education_tier, education_level, programme_or_class, ' +
      'academic_session, term_or_semester, items, line_items, subtotal, discount_amount, ' +
      'discount_reason, tax_amount, total_amount, amount_paid, outstanding_balance, currency, ' +
      'country_code, due_date, issued_date, status, allowed_installments, installments_paid_count, ' +
      'created_at, updated_at) VALUES (' +
      '$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14::jsonb,$15::jsonb,' +
      '$16::numeric,$17::numeric,$18,$19::numeric,$20::numeric,$21::numeric,$22::numeric,' +
      'PI',$23,$24,$25,$26,$27,$28,$29,$30,$31)',
      [
        record.id, record.invoiceNumber, record.institutionId, record.institutionName,
        record.studentId, record.studentName, record.studentMatricOrReg || null,
        record.guardianId || null, record.educationTier, record.educationLevel || null,
        record.programmeOrClass, record.academicSession, record.termOrSemester,
        JSON.stringify(record.items || []), JSON.stringify(record.lineItems || null),
        subtotal, discount, record.discountReason || null, tax, total, '0.000000000000',
        outstanding, record.countryCode || null, record.dueDate, issuedAt, 'UNPAID',
        record.allowedInstallments || 1, 0, record.createdAt, record.updatedAt
      ]
    );

    const rows = await neonQuery<any>('SELECT * FROM education_invoices WHERE id = $1 LIMIT 1', [record.id]);
    if (!rows[0]) throw new Error('INVOICE_PERSISTENCE_FAILED');
    return invoice(rows[0]);
  }

  async recordPayment(params: {
    invoiceId: string; amountPaid: number | string; piAmount: number | string;
    piPaymentId: string; piTxid?: string; payerUsername: string; idempotencyKey: string;
    institutionLogo?: string;
  }): Promise<{ success: true; payment: EducationPaymentTransaction; invoice: EducationInvoice; receipt: DigitalEducationReceipt }> {
    return withNeonTransaction(async (client) => {
      const ir = await client.query('SELECT * FROM education_invoices WHERE id = $1 FOR UPDATE', [params.invoiceId]);
      if (!ir.rows[0]) throw new Error('INVOICE_NOT_FOUND');
      const inv = invoice(ir.rows[0]);
      if (inv.currency !== 'PI') throw new Error('PI_NATIVE_INVOICE_REQUIRED');

      const existing = await duplicate(client, params.invoiceId, params.idempotencyKey, params.piPaymentId, params.piTxid);
      if (existing) {
        if (decimal(existing.payment.amountPaid) !== decimal(params.amountPaid) ||
            decimal(existing.payment.piAmount) !== decimal(params.piAmount) ||
            existing.payment.payerUsername.toLowerCase() !== params.payerUsername.toLowerCase()) {
          throw new Error('PAYMENT_REPLAY_BINDING_MISMATCH');
        }
        return { success: true, ...existing };
      }

      const amount = decimal(params.amountPaid);
      const piAmount = decimal(params.piAmount);
      if (amount !== piAmount) throw new Error('PI_AMOUNT_MISMATCH');
      if (units(amount) > units(inv.outstandingBalance)) throw new Error('AMOUNT_EXCEEDS_BALANCE');

      const timestamp = new Date().toISOString();
      const entropy = crypto.randomBytes(3).toString('hex').toUpperCase();
      const paymentId = 'PAY-EDU-' + Date.now() + '-' + entropy;
      const receiptNumber = 'RCP-EDU-' + inv.institutionId.slice(-3).toUpperCase() + '-' + Date.now().toString().slice(-6) + '-' + entropy;
      const verificationRef = 'VER-' + inv.institutionId.slice(-3).toUpperCase() + '-' + Date.now().toString().slice(-4) + '-' + entropy;
      const total = units(inv.totalAmount);
      const paid = units(inv.amountPaid) + units(amount);
      const outstanding = total > paid ? total - paid : 0n;
      const status = outstanding === 0n ? 'PAID' : 'PARTIALLY_PAID';
      const hash = digest(receiptNumber, inv.invoiceNumber, paymentId, inv.studentId, inv.institutionId, amount, 'PI', timestamp, 'SETTLED');

      await client.query(
        'UPDATE education_invoices SET amount_paid = amount_paid + $1::numeric, outstanding_balance = GREATEST(0::numeric, outstanding_balance - $1::numeric), status = $2, installments_paid_count = installments_paid_count + 1, updated_at = $3 WHERE id = $4',
        [amount, status, timestamp, inv.id]
      );

      const pr = await client.query(
        'INSERT INTO education_payments (id, invoice_id, institution_id, student_id, amount_paid, currency, pi_amount, pi_payment_id, pi_txid, payment_method, status, receipt_number, payer_username, idempotency_key, verified_at, audit_hash) VALUES ($1,$2,$3,$4,$5::numeric,\'PI\',$6::numeric,$7,$8,\'PI_NETWORK\',\'VERIFIED_COMPLETED\',$9,$10,$11,$12,$13) RETURNING *',
        [paymentId, inv.id, inv.institutionId, inv.studentId, amount, piAmount, params.piPaymentId, params.piTxid || null, receiptNumber, params.payerUsername, params.idempotencyKey, timestamp, hash]
      );

      const description = (inv.items || []).map((x: any) => x.description || x.title || 'Fee item').join(', ') || 'School Fee Payment';
      const summary = {
        receiptNumber, institutionName: inv.institutionName, academicSession: inv.academicSession,
        termOrSemester: inv.termOrSemester, amountPaidFormatted: piAmount + ' π', verifiedAt: timestamp, isAuthentic: true
      };
      const rr = await client.query(
        'INSERT INTO education_receipts (receipt_number, verification_reference, verification_hash, algorithm, invoice_id, invoice_number, payment_id, institution_id, institution_name, institution_logo, student_id, student_name, student_matric_or_reg, education_level, academic_session, term_or_semester, charge_description, amount_paid, currency, pi_amount, pi_payment_id, pi_txid, payment_method, payment_date, settlement_status, verified_by_server, public_safe_summary) VALUES ($1,$2,$3,\'SHA-256\',$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17::numeric,\'PI\',$18::numeric,$19,$20,\'PI_NETWORK\',$21,\'SETTLED\',TRUE,$22::jsonb) RETURNING *',
        [receiptNumber, verificationRef, hash, inv.id, inv.invoiceNumber, paymentId, inv.institutionId, inv.institutionName,
         params.institutionLogo || null, inv.studentId, inv.studentName, inv.studentMatricOrReg,
         inv.educationLevel || inv.programmeOrClass, inv.academicSession, inv.termOrSemester, description, amount,
         piAmount, params.piPaymentId, params.piTxid || null, timestamp, JSON.stringify(summary)]
      );
      const ur = await client.query('SELECT * FROM education_invoices WHERE id = $1', [inv.id]);
      return { success: true, payment: payment(pr.rows[0]), invoice: invoice(ur.rows[0]), receipt: receipt(rr.rows[0]) };
    });
  }

  async getPaymentsByInvoiceId(invoiceId: string): Promise<EducationPaymentTransaction[]> {
    const rows = await neonQuery<any>('SELECT * FROM education_payments WHERE invoice_id = $1 ORDER BY verified_at DESC', [invoiceId]);
    return rows.map(payment);
  }

  async getReceiptByNumber(receiptNumber: string): Promise<DigitalEducationReceipt | null> {
    const rows = await neonQuery<any>('SELECT * FROM education_receipts WHERE receipt_number = $1 LIMIT 1', [receiptNumber.trim().toUpperCase()]);
    return rows[0] ? receipt(rows[0]) : null;
  }

  async verifyReceipt(receiptNumber: string) {
    const r = await this.getReceiptByNumber(receiptNumber);
    if (!r) return { valid: false, found: false, status: 'NOT_FOUND' as const, receiptReference: receiptNumber.trim().toUpperCase(), algorithm: 'SHA-256' };
    const expected = digest(r.receiptNumber, r.invoiceNumber || r.invoiceId, r.paymentId || r.piPaymentId || '', r.studentId || '', r.institutionId, r.amountPaid, r.currency, r.paymentDate, r.settlementStatus || 'SETTLED');
    if (expected !== r.verificationHash) return { valid: false, found: true, status: 'TAMPERED' as const, receiptReference: r.receiptNumber, algorithm: 'SHA-256', digest: r.verificationHash };
    return { valid: true, found: true, status: 'VERIFIED' as const, receiptReference: r.receiptNumber, algorithm: 'SHA-256', digest: r.verificationHash, receipt: { ...r, publicSafeSummary: { ...r.publicSafeSummary, isAuthentic: true } } };
  }
}
