import crypto from 'crypto';
import { StorageEngine } from '../StorageEngine';
import {
  InstitutionProfile,
  UniversityFaculty,
  AcademicDepartment,
  EducationProgramme,
  StudentIdentity,
  GuardianChildSummary,
  EducationInvoice,
  EducationPaymentTransaction,
  DigitalEducationReceipt,
  AdmissionApplication,
  AdmissionApplicationStatus,
  ScholarshipOpportunity,
  EducationAuditLog
} from '../../../types/education';
import { normalizeCountryCode, matchesSubdivision } from '../../../data/countrySubdivisions';
export class EducationRepository {
  private institutionsEngine: StorageEngine<InstitutionProfile>;
  private studentsEngine: StorageEngine<StudentIdentity>;
  private childrenSummariesEngine: StorageEngine<GuardianChildSummary>;
  private invoicesEngine: StorageEngine<EducationInvoice>;
  private paymentsEngine: StorageEngine<EducationPaymentTransaction>;
  private receiptsEngine: StorageEngine<DigitalEducationReceipt>;
  private admissionsEngine: StorageEngine<AdmissionApplication>;
  private scholarshipsEngine: StorageEngine<ScholarshipOpportunity>;
  private auditEngine: StorageEngine<EducationAuditLog>;

  constructor() {
    this.institutionsEngine = new StorageEngine<InstitutionProfile>(
      'education_institutions',
      'id',
      []
    );
    this.studentsEngine = new StorageEngine<StudentIdentity>(
      'education_students',
      'id',
      []
    );
    this.childrenSummariesEngine = new StorageEngine<GuardianChildSummary>(
      'education_guardian_children',
      'studentId',
      []
    );
    this.invoicesEngine = new StorageEngine<EducationInvoice>(
      'education_invoices',
      'id',
      []
    );
    this.paymentsEngine = new StorageEngine<EducationPaymentTransaction>(
      'education_payments',
      'id',
      []
    );
    this.receiptsEngine = new StorageEngine<DigitalEducationReceipt>(
      'education_receipts',
      'receiptNumber',
      []
    );
    this.admissionsEngine = new StorageEngine<AdmissionApplication>(
      'education_admissions',
      'id',
      []
    );
    this.scholarshipsEngine = new StorageEngine<ScholarshipOpportunity>(
      'education_scholarships',
      'id',
      []
    );
    this.auditEngine = new StorageEngine<EducationAuditLog>(
      'education_audit_logs',
      'id'
    );

  }

  // --- Institutions ---
  public getInstitutions(filter?: {
    countryCode?: string;
    country?: string;
    state?: string;
    tier?: string;
    institutionType?: string;
    isPublic?: boolean;
    verificationStatus?: string;
    search?: string;
  }): InstitutionProfile[] {
    let list = this.institutionsEngine.getAll();

    if (!filter) return list;

    const rawCountry = filter.countryCode || filter.country;
    const normalizedCountry = rawCountry ? normalizeCountryCode(rawCountry) : undefined;

    if (normalizedCountry && normalizedCountry !== 'ALL' && normalizedCountry !== 'GLOBAL') {
      list = list.filter((i) => i.countryCode.toUpperCase() === normalizedCountry.toUpperCase());
    }
    if (filter.state && filter.state !== 'all') {
      list = list.filter((i) => matchesSubdivision(i.countryCode, i.state, filter.state));
    }
    if (filter.tier && filter.tier !== 'all') {
      list = list.filter((i) => i.supportedTiers.includes(filter.tier as any));
    }
    if (filter.institutionType && filter.institutionType !== 'all') {
      list = list.filter((i) => i.institutionType === filter.institutionType);
    }
    if (filter.isPublic !== undefined) {
      list = list.filter((i) => i.isPublic === filter.isPublic);
    }
    if (filter.verificationStatus && filter.verificationStatus !== 'ALL') {
      list = list.filter((i) => i.verificationStatus === filter.verificationStatus);
    }
    if (filter.search && filter.search.trim()) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.institutionCode.toLowerCase().includes(q) ||
          i.city.toLowerCase().includes(q) ||
          i.state.toLowerCase().includes(q) ||
          i.legalName.toLowerCase().includes(q)
      );
    }
    return list;
  }

  public getInstitutionById(id: string): InstitutionProfile | null {
    return this.institutionsEngine.get(id);
  }

  public verifyInstitution(
    id: string,
    status: 'VERIFIED' | 'VERIFIED_WITH_LIMITATIONS' | 'SUSPENDED' | 'REJECTED',
    adminNotes?: string
  ): InstitutionProfile | null {
    const inst = this.institutionsEngine.get(id);
    if (!inst) return null;

    const updated: InstitutionProfile = {
      ...inst,
      verificationStatus: status,
      verificationDate: new Date().toISOString(),
      accreditation: {
        ...inst.accreditation,
        officialNotes: adminNotes || inst.accreditation.officialNotes
      }
    };
    this.institutionsEngine.set(id, updated);

    this.recordAuditLog({
      action: 'VERIFY_INSTITUTION',
      entityType: 'INSTITUTION',
      entityId: id,
      actorUsername: 'compliance_admin',
      actorRole: 'COMPLIANCE_ADMIN',
      details: `Institution ${inst.name} verification updated to ${status}. Notes: ${adminNotes || 'None'}`
    });

    return updated;
  }

  // --- Academic Hierarchy (Faculties, Colleges, Departments, Programmes) ---
  public getFacultiesByInstitution(institutionId: string): UniversityFaculty[] {
    const inst = this.institutionsEngine.get(institutionId);
    if (!inst || !inst.faculties) return [];
    return inst.faculties;
  }

  public getFacultyById(institutionId: string, facultyId: string): UniversityFaculty | null {
    const faculties = this.getFacultiesByInstitution(institutionId);
    return faculties.find((f) => f.id === facultyId) || null;
  }

  public getDepartmentsByFaculty(institutionId: string, facultyId: string): AcademicDepartment[] {
    const faculty = this.getFacultyById(institutionId, facultyId);
    if (!faculty || !faculty.departments) return [];
    return faculty.departments;
  }

  public getDepartmentById(institutionId: string, facultyId: string, departmentId: string): AcademicDepartment | null {
    const departments = this.getDepartmentsByFaculty(institutionId, facultyId);
    return departments.find((d) => d.id === departmentId) || null;
  }

  public getProgrammesByDepartment(
    institutionId: string,
    facultyId: string,
    departmentId: string
  ): EducationProgramme[] {
    const dept = this.getDepartmentById(institutionId, facultyId, departmentId);
    if (!dept || !dept.programmes) return [];
    return dept.programmes;
  }

  public getAllProgrammesByInstitution(institutionId: string): EducationProgramme[] {
    const inst = this.institutionsEngine.get(institutionId);
    if (!inst) return [];

    // If institution has direct programmes (e.g. secondary school, vocational institute)
    if (inst.programmes && inst.programmes.length > 0) {
      return inst.programmes;
    }

    // Otherwise aggregate from faculties -> departments -> programmes
    const allProgs: EducationProgramme[] = [];
    if (inst.faculties) {
      for (const fac of inst.faculties) {
        if (fac.departments) {
          for (const dept of fac.departments) {
            if (dept.programmes) {
              allProgs.push(...dept.programmes);
            }
          }
        }
      }
    }
    return allProgs;
  }

  // --- Students & Guardian ---
  public getStudentsByGuardian(guardianId: string): StudentIdentity[] {
    return this.studentsEngine.filter((s) => s.guardianId === guardianId);
  }

  public getStudentById(id: string): StudentIdentity | null {
    return this.studentsEngine.get(id);
  }

  public getGuardianChildrenSummaries(guardianId: string): GuardianChildSummary[] {
    // Dynamically recalculate balances based on active invoices
    const cleanGuardianId = (guardianId || '').trim();
    if (!cleanGuardianId) return [];
    const children = this.childrenSummariesEngine.filter((c) =>
      String(c.guardianId || '').trim().toLowerCase() === cleanGuardianId.toLowerCase()
    );
    return children.map((c) => {
      const studentInvoices = this.invoicesEngine.filter((inv) => inv.studentId === c.studentId);
      const activeInvoices = studentInvoices.filter((inv) => inv.status !== 'PAID' && inv.status !== 'CANCELLED');
      const totalBilled = studentInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
      const totalPaid = studentInvoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
      const balance = Math.max(0, totalBilled - totalPaid);

      return {
        ...c,
        totalBilledFiat: totalBilled,
        totalPaidFiat: totalPaid,
        outstandingBalanceFiat: balance,
        activeInvoiceCount: activeInvoices.length
      };
    });
  }

  // --- Invoices & Fees ---
  public getInvoices(filter?: {
    studentId?: string;
    institutionId?: string;
    status?: string;
    guardianId?: string;
  }): EducationInvoice[] {
    let list = this.invoicesEngine.getAll();
    if (!filter) return list;

    if (filter.studentId) list = list.filter((i) => i.studentId === filter.studentId);
    if (filter.institutionId) list = list.filter((i) => i.institutionId === filter.institutionId);
    if (filter.status && filter.status !== 'ALL') list = list.filter((i) => i.status === filter.status);
    if (filter.guardianId) list = list.filter((i) => i.guardianId === filter.guardianId);

    return list;
  }

  public getInvoiceById(id: string): EducationInvoice | null {
    return this.invoicesEngine.get(id);
  }

  /**
   * Phase 9: Server-side calculated fee engine
   * Authoritatively computes invoice totals and prevents client manipulation or floating point errors
   */
  public static calculateInvoiceTotals(params: {
    subtotal: number;
    compulsoryFees?: number;
    optionalFees?: number;
    discount?: number;
    scholarship?: number;
    tax?: number;
  }): {
    subtotal: number;
    compulsoryFees: number;
    optionalFees: number;
    discount: number;
    scholarship: number;
    tax: number;
    totalAmount: number;
  } {
    const round2 = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;
    const subtotal = Math.max(0, round2(params.subtotal || 0));
    const compulsoryFees = Math.max(0, round2(params.compulsoryFees || 0));
    const optionalFees = Math.max(0, round2(params.optionalFees || 0));
    const discount = Math.max(0, round2(params.discount || 0));
    const scholarship = Math.max(0, round2(params.scholarship || 0));
    const tax = Math.max(0, round2(params.tax || 0));

    const totalBeforeDeductions = round2(subtotal + compulsoryFees + optionalFees);
    const cappedDiscount = Math.min(discount, totalBeforeDeductions);
    const cappedScholarship = Math.min(scholarship, Math.max(0, totalBeforeDeductions - cappedDiscount));
    const totalDeductions = round2(cappedDiscount + cappedScholarship);
    const totalAmount = Math.max(0, round2(totalBeforeDeductions - totalDeductions + tax));

    return {
      subtotal,
      compulsoryFees,
      optionalFees,
      discount: cappedDiscount,
      scholarship: cappedScholarship,
      tax,
      totalAmount
    };
  }

  public createInvoice(invoiceData: EducationInvoice): EducationInvoice {
    // Recompute authoritative totals server-side
    const totals = EducationRepository.calculateInvoiceTotals({
      subtotal: invoiceData.subtotal,
      discount: invoiceData.discountAmount,
      tax: invoiceData.taxAmount
    });

    const invoiceCurrency = String(invoiceData.currency || '').trim().toUpperCase();
    if (invoiceCurrency !== 'PI') {
      throw new Error('PI_NATIVE_INVOICE_REQUIRED');
    }

    const invoice: EducationInvoice = {
      ...invoiceData,
      currency: 'PI',
      subtotal: totals.subtotal,
      discountAmount: totals.discount,
      taxAmount: totals.tax,
      totalAmount: totals.totalAmount,
      outstandingBalance: Math.max(0, totals.totalAmount - (invoiceData.amountPaid || 0))
    };

    this.invoicesEngine.set(invoice.id, invoice);
    this.recordAuditLog({
      action: 'CREATE_INVOICE',
      entityType: 'INVOICE',
      entityId: invoice.id,
      actorUsername: 'school_bursar',
      actorRole: 'FINANCE_OFFICER',
      details: `Created Pi-native invoice ${invoice.invoiceNumber} for student ${invoice.studentName} amount ${invoice.totalAmount} π`
    });
    return invoice;
  }

  /**
   * Phase 12: Canonical Receipt Serialization & Digest Generation
   * Canonical digest covers: receiptReference|invoiceReference|paymentId|studentId|institutionId|amount|currency|paymentTimestamp|settlementStatus
   */
  public static computeReceiptDigest(params: {
    receiptReference: string;
    invoiceReference: string;
    paymentId?: string;
    studentId?: string;
    institutionId: string;
    amount: number;
    currency: string;
    paymentTimestamp: string;
    settlementStatus: string;
  }): string {
    const canonicalPayload = [
      (params.receiptReference || '').trim().toUpperCase(),
      (params.invoiceReference || '').trim(),
      (params.paymentId || '').trim(),
      (params.studentId || '').trim(),
      (params.institutionId || '').trim(),
      (() => {
        const units = EducationRepository.toPiUnits(params.amount);
        const whole = units / 1000000000000n;
        const fraction = (units % 1000000000000n).toString().padStart(12, '0');
        return `${whole.toString()}.${fraction}`;
      })(),
      (params.currency || 'PI').trim().toUpperCase(),
      (params.paymentTimestamp || '').trim(),
      (params.settlementStatus || 'SETTLED').trim().toUpperCase()
    ].join('|');

    return crypto.createHash('sha256').update(canonicalPayload).digest('hex');
  }

  // Pi financial values are represented in fixed 12-decimal units for settlement comparisons.
  // This avoids floating-point tolerances that could accept/reject values outside the canonical 12-decimal contract.
  private static toPiUnits(value: number | string): bigint {
    const raw = String(value ?? '').trim();
    if (!/^\\d+(?:\\.\\d+)?$/.test(raw)) throw new Error('INVALID_PI_AMOUNT');
    const [whole, fraction = ''] = raw.split('.');
    if (fraction.length > 12) throw new Error('PI_AMOUNT_MAX_12_DECIMALS');
    return (BigInt(whole) * 1000000000000n) + BigInt((fraction + '0'.repeat(12)).slice(0, 12));
  }

  private static fromPiUnits(units: bigint): number {
    const negative = units < 0n;
    const absolute = negative ? -units : units;
    const whole = absolute / 1000000000000n;
    const fraction = (absolute % 1000000000000n).toString().padStart(12, '0');
    return Number((negative ? '-' : '') + whole.toString() + '.' + fraction);
  }

  // --- Payments & Tamper-Evident Receipts ---
  public recordPayment(params: {
    invoiceId: string;
    amountPaid: number;
    currency: string;
    piAmount?: number;
    piPaymentId?: string;
    piTxid?: string;
    paymentMethod: 'PI_NETWORK' | 'FIAT_ESCROW' | 'SCHOLARSHIP_GRANT';
    payerUsername: string;
    idempotencyKey?: string;
  }): {
    success: boolean;
    payment: EducationPaymentTransaction;
    invoice: EducationInvoice;
    receipt: DigitalEducationReceipt;
  } {
    // 1. Replay binding: an existing idempotency key / Pi payment may only
    // return the original settlement when every financial binding is identical.
    const existingPayment = this.paymentsEngine.find(
      (p) =>
        (params.idempotencyKey && p.idempotencyKey && p.idempotencyKey === params.idempotencyKey) ||
        (params.piPaymentId && p.piPaymentId && p.piPaymentId === params.piPaymentId)
    );

    if (existingPayment) {
      const existingInvoice = this.invoicesEngine.get(existingPayment.invoiceId);
      if (!existingInvoice) throw new Error('PAYMENT_REPLAY_INVOICE_MISSING');

      const sameInvoice = existingPayment.invoiceId === params.invoiceId;
      const sameCurrency = existingPayment.currency.trim().toUpperCase() === String(params.currency || '').trim().toUpperCase();
      const sameAmount = String(existingPayment.currency || '').trim().toUpperCase() === 'PI'
        ? EducationRepository.toPiUnits(existingPayment.amountPaid) === EducationRepository.toPiUnits(params.amountPaid)
        : existingPayment.amountPaid === params.amountPaid;
      const samePiAmount = String(existingPayment.currency || '').trim().toUpperCase() === 'PI'
        ? EducationRepository.toPiUnits(existingPayment.piAmount) === EducationRepository.toPiUnits(Number(params.piAmount ?? 0))
        : existingPayment.piAmount === Number(params.piAmount ?? 0);
      const samePiPayment = (existingPayment.piPaymentId || '') === (params.piPaymentId || '');
      const samePayer = existingPayment.payerUsername.trim().toLowerCase() === params.payerUsername.trim().toLowerCase();

      if (!(sameInvoice && sameCurrency && sameAmount && samePiAmount && samePiPayment && samePayer)) {
        throw new Error('PAYMENT_REPLAY_BINDING_MISMATCH');
      }

      const existingReceipt = this.receiptsEngine.get(existingPayment.receiptNumber);
      if (!existingReceipt) throw new Error('PAYMENT_REPLAY_RECEIPT_MISSING');

      return {
        success: true,
        payment: existingPayment,
        invoice: existingInvoice,
        receipt: existingReceipt
      };
    }

    // 2. Fetch target invoice
    const invoice = this.invoicesEngine.get(params.invoiceId);
    if (!invoice) {
      throw new Error(`Invoice with ID ${params.invoiceId} not found`);
    }

    if (params.paymentMethod === 'PI_NETWORK') {
      if (!params.piPaymentId) throw new Error('PI_PAYMENT_ID_REQUIRED');
      const invoiceCurrency = String(invoice.currency || '').trim().toUpperCase();
      const paymentCurrency = String(params.currency || '').trim().toUpperCase();
      if (invoiceCurrency !== 'PI') throw new Error('PI_NATIVE_INVOICE_REQUIRED');
      if (paymentCurrency !== 'PI') throw new Error('PI_NATIVE_PAYMENT_REQUIRED');
      if (!Number.isFinite(params.piAmount) || Number(params.piAmount) <= 0) throw new Error('PI_AMOUNT_REQUIRED');
      const paidPiAmount = Number(params.amountPaid);
      const submittedPiAmount = Number(params.piAmount);
      if (!Number.isFinite(paidPiAmount) || paidPiAmount <= 0) throw new Error('PI_AMOUNT_REQUIRED');
      if (!Number.isFinite(submittedPiAmount) || submittedPiAmount <= 0) throw new Error('PI_AMOUNT_REQUIRED');
      if (EducationRepository.toPiUnits(submittedPiAmount) !== EducationRepository.toPiUnits(paidPiAmount)) throw new Error('PI_AMOUNT_MISMATCH');
    }

    // Phase 10: Prevent overpayment beyond outstanding balance
    if (String(invoice.currency || '').trim().toUpperCase() === 'PI') {
      const paymentUnits = EducationRepository.toPiUnits(params.amountPaid);
      const balanceUnits = EducationRepository.toPiUnits(invoice.outstandingBalance);
      if (paymentUnits > balanceUnits) {
        throw new Error(`Payment amount (${params.amountPaid} π) exceeds outstanding balance (${invoice.outstandingBalance} π). Overpayment rejected.`);
      }
    } else if (params.amountPaid > invoice.outstandingBalance) {
      throw new Error(`Payment amount (${params.amountPaid}) exceeds outstanding balance (${invoice.outstandingBalance}). Overpayment rejected.`);
    }

    const timestamp = new Date().toISOString();
    const entropyHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    const paymentId = `PAY-EDU-${Date.now()}-${entropyHex}`;
    const receiptNumber = `RCP-EDU-${invoice.institutionId.slice(-3).toUpperCase()}-${Date.now().toString().slice(-6)}-${entropyHex}`;
    const verificationRef = `VER-${invoice.institutionId.slice(-3).toUpperCase()}-${Date.now().toString().slice(-4)}-${entropyHex}`;

    // 3. Cryptographic Tamper-Proof Canonical SHA-256 Digest
    const auditHash = EducationRepository.computeReceiptDigest({
      receiptReference: receiptNumber,
      invoiceReference: invoice.invoiceNumber,
      paymentId,
      studentId: invoice.studentId,
      institutionId: invoice.institutionId,
      amount: params.amountPaid,
      currency: params.currency,
      paymentTimestamp: timestamp,
      settlementStatus: 'SETTLED'
    });

    // 4. Update Invoice Balances
    const isPiInvoice = String(invoice.currency || '').trim().toUpperCase() === 'PI';
    const newAmountPaid = isPiInvoice
      ? EducationRepository.fromPiUnits(EducationRepository.toPiUnits(invoice.amountPaid) + EducationRepository.toPiUnits(params.amountPaid))
      : invoice.amountPaid + params.amountPaid;
    const newOutstandingBalance = isPiInvoice
      ? EducationRepository.fromPiUnits(EducationRepository.toPiUnits(invoice.totalAmount) - EducationRepository.toPiUnits(newAmountPaid) < 0n ? 0n : EducationRepository.toPiUnits(invoice.totalAmount) - EducationRepository.toPiUnits(newAmountPaid))
      : Math.max(0, invoice.totalAmount - newAmountPaid);
    const newStatus = isPiInvoice ? newOutstandingBalance === 0 : newOutstandingBalance <= 0;

    const updatedInvoice: EducationInvoice = {
      ...invoice,
      amountPaid: newAmountPaid,
      outstandingBalance: newOutstandingBalance,
      status: newStatus,
      installmentsPaidCount: invoice.installmentsPaidCount + 1,
      updatedAt: timestamp
    };
    this.invoicesEngine.set(invoice.id, updatedInvoice);

    // 5. Create Payment Record
    const paymentRecord: EducationPaymentTransaction = {
      id: paymentId,
      invoiceId: params.invoiceId,
      institutionId: invoice.institutionId,
      studentId: invoice.studentId,
      amountPaid: params.amountPaid,
      currency: params.currency,
      piAmount: params.piAmount ?? 0,
      piPaymentId: params.piPaymentId,
      piTxid: params.piTxid,
      paymentMethod: params.paymentMethod,
      status: 'VERIFIED_COMPLETED',
      receiptNumber,
      payerUsername: params.payerUsername,
      idempotencyKey: params.idempotencyKey || params.piPaymentId || paymentId,
      verifiedAt: timestamp,
      auditHash
    };
    this.paymentsEngine.set(paymentId, paymentRecord);

    // 6. Generate Digital Education Receipt
    const inst = this.institutionsEngine.get(invoice.institutionId);
    const receipt: DigitalEducationReceipt = {
      receiptNumber,
      verificationReference: verificationRef,
      verificationHash: auditHash,
      algorithm: 'SHA-256',
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      paymentId,
      institutionId: invoice.institutionId,
      institutionName: invoice.institutionName,
      institutionLogo: inst?.logoUrl,
      studentId: invoice.studentId,
      studentName: invoice.studentName,
      studentMatricOrReg: invoice.studentMatricOrReg,
      educationLevel: invoice.programmeOrClass || (invoice as any).educationLevel || 'Undergraduate',
      academicSession: invoice.academicSession,
      termOrSemester: invoice.termOrSemester,
      chargeDescription: ((invoice.items || (invoice as any).lineItems || []) as any[]).map((i) => i.description || i.title || 'Fee item').join(', ') || 'School Fee Payment',
      amountPaid: params.amountPaid,
      currency: params.currency,
      piAmount: params.piAmount ?? 0,
      piPaymentId: params.piPaymentId,
      piTxid: params.piTxid,
      paymentMethod: params.paymentMethod,
      paymentDate: timestamp,
      settlementStatus: 'SETTLED',
      verifiedByServer: true,
      publicSafeSummary: {
        receiptNumber,
        institutionName: invoice.institutionName,
        academicSession: invoice.academicSession,
        termOrSemester: invoice.termOrSemester,
        amountPaidFormatted: `${(params.piAmount ?? params.amountPaid).toFixed(12)} π`,
        verifiedAt: timestamp,
        isAuthentic: true
      }
    };
    this.receiptsEngine.set(receiptNumber, receipt);

    // 7. Audit Log
    this.recordAuditLog({
      action: 'SETTLE_FEE_PAYMENT',
      entityType: 'PAYMENT',
      entityId: paymentId,
      actorUsername: params.payerUsername,
      actorRole: 'PARENT',
      details: `Paid ${params.amountPaid} π for Invoice ${invoice.invoiceNumber}. Receipt ${receiptNumber} generated.`
    });

    return {
      success: true,
      payment: paymentRecord,
      invoice: updatedInvoice,
      receipt
    };
  }

  public getPaymentsByInvoiceId(invoiceId: string): EducationPaymentTransaction[] {
    const cleanId = (invoiceId || '').trim();
    return this.paymentsEngine
      .filter((p) => p.invoiceId === cleanId)
      .sort((a, b) => new Date(b.verifiedAt).getTime() - new Date(a.verifiedAt).getTime());
  }

  public getPaymentById(paymentId: string): EducationPaymentTransaction | null {
    const cleanId = (paymentId || '').trim();
    return this.paymentsEngine.get(cleanId) || null;
  }

  public getAllPayments(): EducationPaymentTransaction[] {
    return this.paymentsEngine.getAll();
  }

  // --- Public Safe Receipt Verification with SHA-256 Recomputation ---
  public verifyReceipt(receiptNumber: string): {
    valid: boolean;
    found: boolean;
    status: 'VERIFIED' | 'TAMPERED' | 'NOT_FOUND';
    receiptReference: string;
    algorithm: string;
    digest?: string;
    receipt?: DigitalEducationReceipt;
    error?: string;
  } {
    const cleanNo = receiptNumber.trim().toUpperCase();
    const receipt = this.receiptsEngine.get(cleanNo);
    if (!receipt) {
      return {
        valid: false,
        found: false,
        status: 'NOT_FOUND',
        receiptReference: cleanNo,
        algorithm: 'SHA-256',
        error: 'Receipt reference not found in verified registry'
      };
    }

    // Phase 12: authoritatively recompute canonical digest from record fields
    const expectedDigest = EducationRepository.computeReceiptDigest({
      receiptReference: receipt.receiptNumber,
      invoiceReference: receipt.invoiceNumber || receipt.invoiceId,
      paymentId: receipt.paymentId || receipt.piPaymentId || '',
      studentId: receipt.studentId || '',
      institutionId: receipt.institutionId,
      amount: receipt.amountPaid,
      currency: receipt.currency,
      paymentTimestamp: receipt.paymentDate,
      settlementStatus: receipt.settlementStatus || 'SETTLED'
    });

    const isTampered = expectedDigest !== receipt.verificationHash;
    if (isTampered) {
      return {
        valid: false,
        found: true,
        status: 'TAMPERED',
        receiptReference: receipt.receiptNumber,
        algorithm: 'SHA-256',
        digest: receipt.verificationHash,
        error: 'Cryptographic digest mismatch: protected receipt payload has been tampered with or modified.'
      };
    }

    return {
      valid: true,
      found: true,
      status: 'VERIFIED',
      receiptReference: receipt.receiptNumber,
      algorithm: 'SHA-256',
      digest: receipt.verificationHash,
      receipt: {
        ...receipt,
        publicSafeSummary: {
          ...receipt.publicSafeSummary,
          isAuthentic: true
        }
      }
    };
  }

  public getReceiptByNumber(receiptNumber: string): DigitalEducationReceipt | null {
    return this.receiptsEngine.get(receiptNumber.trim().toUpperCase());
  }

  // --- Admissions Workflow & State Machine ---
  public getAdmissions(filter?: {
    institutionId?: string;
    status?: string;
    applicantEmail?: string;
  }): AdmissionApplication[] {
    let list = this.admissionsEngine.getAll();
    if (!filter) return list;

    if (filter.institutionId) list = list.filter((a) => a.institutionId === filter.institutionId);
    if (filter.status && filter.status !== 'ALL') list = list.filter((a) => a.status === filter.status);
    if (filter.applicantEmail) list = list.filter((a) => a.applicantEmail.toLowerCase() === filter.applicantEmail?.toLowerCase());

    return list;
  }

  public getAdmissionById(id: string): AdmissionApplication | null {
    return this.admissionsEngine.get(id);
  }

  public submitAdmissionApplication(app: Partial<AdmissionApplication> & Pick<AdmissionApplication, 'institutionId' | 'institutionName' | 'programmeId' | 'programmeName' | 'applicantFullName' | 'applicantEmail'>): AdmissionApplication {
    const id = `adm-app-${Date.now()}`;
    const applicationNumber = `APP/${new Date().getFullYear()}/${app.institutionId.slice(-3).toUpperCase()}/${Math.floor(100 + Math.random() * 900)}`;
    const timestamp = new Date().toISOString();

    if (!app.educationTier || !app.dateOfBirth || app.applicationFeeFiat == null || app.applicationFeePaid == null) {
      throw new Error('Authoritative admission application fields are incomplete');
    }

    const record: AdmissionApplication = {
      educationTier: app.educationTier,
      applicantPhone: app.applicantPhone || '',
      dateOfBirth: app.dateOfBirth,
      applicationFeeFiat: app.applicationFeeFiat,
      applicationFeePaid: app.applicationFeePaid,
      documents: app.documents || [],
      ...app,
      id,
      applicationNumber,
      status: 'SUBMITTED', // Server enforces authoritative initial status
      submittedAt: timestamp,
      updatedAt: timestamp
    };

    this.admissionsEngine.set(id, record);

    this.recordAuditLog({
      action: 'SUBMIT_ADMISSION_APPLICATION',
      entityType: 'ADMISSION',
      entityId: id,
      actorUsername: app.applicantEmail,
      actorRole: 'STUDENT',
      details: `Submitted application ${applicationNumber} for programme ${app.programmeName} at ${app.institutionName}`
    });

    return record;
  }

  /**
   * Phase 14: Server-side enforced admissions state machine
   */
  public updateAdmissionStatus(
    applicationId: string,
    targetStatus: AdmissionApplicationStatus | string,
    arg3?: string,
    arg4?: string
  ): AdmissionApplication & { success: boolean; application: AdmissionApplication; error?: string } {
    const app = this.admissionsEngine.get(applicationId);
    if (!app) {
      throw new Error(`Admission application ${applicationId} not found`);
    }

    const currentStatus = app.status;
    const allowedTransitions: Record<string, string[]> = {
      DRAFT: ['SUBMITTED', 'WITHDRAWN'],
      SUBMITTED: ['UNDER_REVIEW', 'REJECTED', 'WITHDRAWN'],
      UNDER_REVIEW: ['DOCUMENTS_REQUIRED', 'ADDITIONAL_INFO_REQUIRED', 'ACCEPTED', 'OFFERED', 'OFFER_ISSUED', 'REJECTED', 'WITHDRAWN'],
      DOCUMENTS_REQUIRED: ['UNDER_REVIEW', 'WITHDRAWN', 'EXPIRED'],
      ADDITIONAL_INFO_REQUIRED: ['UNDER_REVIEW', 'WITHDRAWN', 'EXPIRED'],
      OFFERED: ['ACCEPTED', 'OFFER_ACCEPTED', 'REJECTED', 'WITHDRAWN', 'EXPIRED'],
      OFFER_ISSUED: ['ACCEPTED', 'OFFER_ACCEPTED', 'REJECTED', 'WITHDRAWN', 'EXPIRED'],
      ACCEPTED: ['OFFER_ISSUED', 'OFFER_ACCEPTED', 'ENROLLED', 'WITHDRAWN'],
      OFFER_ACCEPTED: ['ENROLLED', 'REGISTRATION_COMPLETED', 'WITHDRAWN'],
      REGISTRATION_COMPLETED: ['ENROLLED'],
      ENROLLED: [],
      REJECTED: [],
      WITHDRAWN: [],
      EXPIRED: []
    };

    const validTargets = allowedTransitions[currentStatus] || [];
    if (!validTargets.includes(targetStatus)) {
      throw new Error(`Illegal state transition from ${currentStatus} to ${targetStatus}. Allowed: [${validTargets.join(', ')}]`);
    }

    let actorUsername = 'admissions_officer';
    let notes = '';
    if (arg3 && arg3.includes(' ') && !arg4) {
      notes = arg3;
    } else {
      actorUsername = arg3 || 'admissions_officer';
      notes = arg4 || '';
    }

    const timestamp = new Date().toISOString();
    const updated: AdmissionApplication = {
      ...app,
      status: targetStatus as any,
      updatedAt: timestamp,
      decisionNotes: notes || app.decisionNotes
    };

    this.admissionsEngine.set(applicationId, updated);

    this.recordAuditLog({
      action: 'UPDATE_ADMISSION_STATUS',
      entityType: 'ADMISSION',
      entityId: applicationId,
      actorUsername,
      actorRole: 'ADMISSIONS_OFFICER',
      details: `Status transitioned from ${currentStatus} to ${targetStatus}. Notes: ${notes || 'None'}`
    });

    const resultApp: AdmissionApplication & { success: boolean; application: AdmissionApplication; error?: string } = {
      ...updated,
      success: true,
      get application() {
        return updated;
      }
    };

    return resultApp;
  }

  public acceptAdmissionOffer(applicationId: string, actorUsername?: string): AdmissionApplication | null {
    let res: (AdmissionApplication & { success?: boolean; application?: AdmissionApplication }) | null = null;
    try {
      res = this.updateAdmissionStatus(applicationId, 'OFFER_ACCEPTED', actorUsername || 'student', 'Candidate accepted offer');
    } catch {
      try {
        res = this.updateAdmissionStatus(applicationId, 'ACCEPTED', actorUsername || 'student', 'Candidate accepted offer');
      } catch {
        return null;
      }
    }

    const updated: AdmissionApplication = {
      ...(res as AdmissionApplication),
      updatedAt: new Date().toISOString(),
      offerDetails: res.offerDetails ? { ...res.offerDetails } : undefined
    };
    delete (updated as any).application;
    delete (updated as any).success;
    this.admissionsEngine.set(applicationId, updated);
    return updated;
  }

  // --- Phase 13: Persistent, Role-Governed Scholarships ---
  public getScholarships(tier?: string, countryCode?: string): ScholarshipOpportunity[] {
    let list = this.scholarshipsEngine.getAll();
    if (tier && tier !== 'all') {
      list = list.filter((s) => s.applicableTiers.includes(tier as any));
    }
    if (countryCode && countryCode !== 'ALL' && countryCode !== 'GLOBAL') {
      list = list.filter((s) => s.eligibleCountries.includes(countryCode));
    }
    return list;
  }

  public createScholarship(
    scholarship: Omit<ScholarshipOpportunity, 'id'>,
    actorUsername: string = 'admin'
  ): ScholarshipOpportunity {
    const id = `sch-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newRecord: ScholarshipOpportunity = {
      ...scholarship,
      id
    };
    this.scholarshipsEngine.set(id, newRecord);
    this.recordAuditLog({
      action: 'CREATE_SCHOLARSHIP',
      entityType: 'SCHOLARSHIP',
      entityId: id,
      actorUsername,
      actorRole: 'INSTITUTION_ADMIN',
      details: `Created scholarship grant "${scholarship.title}" with coverage $${scholarship.coverageAmountUsd}`
    });
    return newRecord;
  }

  public updateScholarship(
    id: string,
    updates: Partial<ScholarshipOpportunity>,
    actorUsername: string = 'admin'
  ): ScholarshipOpportunity | null {
    const existing = this.scholarshipsEngine.get(id);
    if (!existing) return null;

    const updated: ScholarshipOpportunity = { ...existing, ...updates };
    this.scholarshipsEngine.set(id, updated);
    this.recordAuditLog({
      action: 'UPDATE_SCHOLARSHIP',
      entityType: 'SCHOLARSHIP',
      entityId: id,
      actorUsername,
      actorRole: 'INSTITUTION_ADMIN',
      details: `Updated scholarship "${existing.title}"`
    });
    return updated;
  }

  public applyScholarshipToInvoice(
    invoiceId: string,
    scholarshipId: string,
    actorUsername: string = 'school_bursar'
  ): { success: boolean; invoice?: EducationInvoice; error?: string } {
    const invoice = this.invoicesEngine.get(invoiceId);
    if (!invoice) return { success: false, error: 'Invoice not found' };

    const scholarship = this.scholarshipsEngine.get(scholarshipId);
    if (!scholarship) return { success: false, error: 'Scholarship not found' };

    if (!Number.isFinite(scholarship.coverageAmountUsd) || scholarship.coverageAmountUsd <= 0) {
      return { success: false, error: 'INVALID_SCHOLARSHIP_AMOUNT' };
    }
    if (!Number.isFinite(invoice.outstandingBalance) || invoice.outstandingBalance <= 0) {
      return { success: false, error: 'INVOICE_ALREADY_SETTLED' };
    }
    const applicableTiers = Array.isArray(scholarship.applicableTiers) ? scholarship.applicableTiers : [];
    if (invoice.educationTier && applicableTiers.length > 0 && !applicableTiers.includes(invoice.educationTier as any)) {
      return { success: false, error: 'SCHOLARSHIP_TIER_NOT_ELIGIBLE' };
    }
    if (scholarship.eligibleCountries?.length && invoice.countryCode && !scholarship.eligibleCountries.includes(invoice.countryCode)) {
      return { success: false, error: 'SCHOLARSHIP_COUNTRY_NOT_ELIGIBLE' };
    }
    const deduction = Math.min(scholarship.coverageAmountUsd, invoice.outstandingBalance);
    const newAmountPaid = invoice.amountPaid + deduction;
    const newOutstanding = Math.max(0, invoice.totalAmount - newAmountPaid);
    const newStatus = newOutstanding <= 0.001 ? 'PAID' : 'PARTIALLY_PAID';

    const updated: EducationInvoice = {
      ...invoice,
      amountPaid: newAmountPaid,
      outstandingBalance: newOutstanding,
      status: newStatus,
      updatedAt: new Date().toISOString()
    };
    this.invoicesEngine.set(invoiceId, updated);

    this.recordAuditLog({
      action: 'APPLY_SCHOLARSHIP',
      entityType: 'INVOICE',
      entityId: invoiceId,
      actorUsername,
      actorRole: 'FINANCE_OFFICER',
      details: `Applied scholarship ${scholarship.title} ($${deduction}) to invoice ${invoice.invoiceNumber}`
    });

    return { success: true, invoice: updated };
  }

  // --- Institution Financial Analytics (School Portal) ---
  public getInstitutionAnalytics(institutionId: string) {
    const inst = this.institutionsEngine.get(institutionId);
    const invoices = this.invoicesEngine.filter((i) => i.institutionId === institutionId);
    const admissions = this.admissionsEngine.filter((a) => a.institutionId === institutionId);
    const students = this.studentsEngine.filter((s) => s.currentInstitutionId === institutionId);

    const totalBilled = invoices.reduce((sum, i) => sum + i.totalAmount, 0);
    const totalCollected = invoices.reduce((sum, i) => sum + i.amountPaid, 0);
    const outstanding = Math.max(0, totalBilled - totalCollected);
    const paidInvoicesCount = invoices.filter((i) => i.status === 'PAID').length;
    const pendingInvoicesCount = invoices.filter((i) => i.status !== 'PAID').length;

    return {
      institution: inst,
      totalStudentsEnrolled: students.length,
      totalAdmissionsApplications: admissions.length,
      financials: {
        totalBilledPi: totalBilled,
        totalCollectedPi: totalCollected,
        outstandingBalancePi: outstanding,
        collectionRatePercent: totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 100,
        paidInvoicesCount,
        pendingInvoicesCount
      }
    };
  }

  // --- Audit Log ---
  private recordAuditLog(log: Omit<EducationAuditLog, 'id' | 'timestamp' | 'auditHash'>): EducationAuditLog {
    const id = `AUD-EDU-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const timestamp = new Date().toISOString();
    const raw = `${id}|${log.action}|${log.entityType}|${log.entityId}|${log.actorUsername}|${timestamp}`;
    const auditHash = crypto.createHash('sha256').update(raw).digest('hex');

    const entry: EducationAuditLog = {
      ...log,
      id,
      timestamp,
      auditHash
    };

    this.auditEngine.set(id, entry);
    return entry;
  }

  public getAuditLogs(entityType?: string): EducationAuditLog[] {
    let list = this.auditEngine.getAll();
    if (entityType) {
      list = list.filter((l) => l.entityType === entityType);
    }
    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
}
