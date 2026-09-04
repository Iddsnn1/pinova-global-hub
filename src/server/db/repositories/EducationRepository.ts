import crypto from 'crypto';
import { StorageEngine } from '../StorageEngine';
import {
  InstitutionProfile,
  StudentIdentity,
  GuardianChildSummary,
  EducationInvoice,
  EducationPaymentTransaction,
  DigitalEducationReceipt,
  AdmissionApplication,
  ScholarshipOpportunity,
  EducationAuditLog
} from '../../../types/education';
import { GLOBAL_EDUCATION_INSTITUTIONS } from '../../../data/educationInstitutionsData';
import {
  SEED_STUDENTS,
  SEED_CHILDREN_SUMMARIES,
  SEED_INVOICES,
  SEED_RECEIPTS,
  SEED_ADMISSION_APPLICATIONS,
  SEED_SCHOLARSHIPS,
  SEED_PARENT_USER_ID
} from '../../../data/educationSeedData';

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
      GLOBAL_EDUCATION_INSTITUTIONS
    );
    this.studentsEngine = new StorageEngine<StudentIdentity>(
      'education_students',
      'id',
      SEED_STUDENTS
    );
    this.childrenSummariesEngine = new StorageEngine<GuardianChildSummary>(
      'education_guardian_children',
      'studentId',
      SEED_CHILDREN_SUMMARIES
    );
    this.invoicesEngine = new StorageEngine<EducationInvoice>(
      'education_invoices',
      'id',
      SEED_INVOICES
    );
    this.paymentsEngine = new StorageEngine<EducationPaymentTransaction>(
      'education_payments',
      'id'
    );
    this.receiptsEngine = new StorageEngine<DigitalEducationReceipt>(
      'education_receipts',
      'receiptNumber',
      SEED_RECEIPTS
    );
    this.admissionsEngine = new StorageEngine<AdmissionApplication>(
      'education_admissions',
      'id',
      SEED_ADMISSION_APPLICATIONS
    );
    this.scholarshipsEngine = new StorageEngine<ScholarshipOpportunity>(
      'education_scholarships',
      'id',
      SEED_SCHOLARSHIPS
    );
    this.auditEngine = new StorageEngine<EducationAuditLog>(
      'education_audit_logs',
      'id'
    );
  }

  // --- Institutions ---
  public getInstitutions(filter?: {
    countryCode?: string;
    tier?: string;
    institutionType?: string;
    isPublic?: boolean;
    verificationStatus?: string;
    search?: string;
  }): InstitutionProfile[] {
    let list = this.institutionsEngine.getAll();

    if (!filter) return list;

    if (filter.countryCode && filter.countryCode !== 'ALL' && filter.countryCode !== 'GLOBAL') {
      list = list.filter((i) => i.countryCode === filter.countryCode);
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

  // --- Students & Guardian ---
  public getStudentsByGuardian(guardianId: string = SEED_PARENT_USER_ID): StudentIdentity[] {
    return this.studentsEngine.filter((s) => s.guardianId === guardianId);
  }

  public getStudentById(id: string): StudentIdentity | null {
    return this.studentsEngine.get(id);
  }

  public getGuardianChildrenSummaries(guardianId: string = SEED_PARENT_USER_ID): GuardianChildSummary[] {
    // Dynamically recalculate balances based on active invoices
    const children = this.childrenSummariesEngine.getAll();
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

  public createInvoice(invoice: EducationInvoice): EducationInvoice {
    this.invoicesEngine.set(invoice.id, invoice);
    this.recordAuditLog({
      action: 'CREATE_INVOICE',
      entityType: 'INVOICE',
      entityId: invoice.id,
      actorUsername: 'school_bursar',
      actorRole: 'FINANCE_OFFICER',
      details: `Created invoice ${invoice.invoiceNumber} for student ${invoice.studentName} amount $${invoice.totalAmount}`
    });
    return invoice;
  }

  // --- Payments & Tamper-Evident Receipts ---
  public recordPayment(params: {
    invoiceId: string;
    amountPaid: number;
    currency: string;
    piAmount: number;
    piPaymentId?: string;
    piTxid?: string;
    paymentMethod: 'PI_NETWORK' | 'FIAT_ESCROW' | 'SCHOLARSHIP_GRANT';
    payerUsername: string;
    idempotencyKey: string;
  }): {
    success: boolean;
    payment: EducationPaymentTransaction;
    invoice: EducationInvoice;
    receipt: DigitalEducationReceipt;
  } {
    // 1. Idempotency Check: if this payment or idempotency key was already recorded, return existing
    const existingPayment = this.paymentsEngine.find(
      (p) => p.idempotencyKey === params.idempotencyKey || (params.piPaymentId && p.piPaymentId === params.piPaymentId)
    );

    if (existingPayment) {
      const existingInvoice = this.invoicesEngine.get(existingPayment.invoiceId)!;
      const existingReceipt = this.receiptsEngine.get(existingPayment.receiptNumber)!;
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

    const timestamp = new Date().toISOString();
    const paymentId = `PAY-EDU-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const receiptNumber = `RCP-EDU-${invoice.institutionId.slice(-3).toUpperCase()}-${Date.now().toString().slice(-6)}`;
    const verificationRef = `VER-${invoice.institutionId.slice(-3).toUpperCase()}-${Date.now().toString().slice(-4)}`;

    // 3. Cryptographic Tamper-Proof Audit Hash
    const rawPayload = `${receiptNumber}|${params.invoiceId}|${invoice.studentId}|${params.amountPaid}|${params.currency}|${params.piAmount}|${timestamp}`;
    const auditHash = crypto.createHash('sha256').update(rawPayload).digest('hex');

    // 4. Update Invoice Balances
    const newAmountPaid = invoice.amountPaid + params.amountPaid;
    const newOutstandingBalance = Math.max(0, invoice.totalAmount - newAmountPaid);
    const newStatus = newOutstandingBalance <= 0 ? 'PAID' : 'PARTIALLY_PAID';

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
      piAmount: params.piAmount,
      piPaymentId: params.piPaymentId,
      piTxid: params.piTxid,
      paymentMethod: params.paymentMethod,
      status: 'VERIFIED_COMPLETED',
      receiptNumber,
      payerUsername: params.payerUsername,
      idempotencyKey: params.idempotencyKey,
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
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      institutionId: invoice.institutionId,
      institutionName: invoice.institutionName,
      institutionLogo: inst?.logoUrl,
      studentName: invoice.studentName,
      studentMatricOrReg: invoice.studentMatricOrReg,
      educationLevel: invoice.programmeOrClass,
      academicSession: invoice.academicSession,
      termOrSemester: invoice.termOrSemester,
      chargeDescription: invoice.items.map((i) => i.description).join(', '),
      amountPaid: params.amountPaid,
      currency: params.currency,
      piAmount: params.piAmount,
      piPaymentId: params.piPaymentId,
      piTxid: params.piTxid,
      paymentMethod: params.paymentMethod,
      paymentDate: timestamp,
      verifiedByServer: true,
      publicSafeSummary: {
        receiptNumber,
        institutionName: invoice.institutionName,
        academicSession: invoice.academicSession,
        termOrSemester: invoice.termOrSemester,
        amountPaidFormatted: `$${params.amountPaid.toFixed(2)} ${params.currency} (${params.piAmount.toFixed(6)} π)`,
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
      details: `Paid $${params.amountPaid} (${params.piAmount} π) for Invoice ${invoice.invoiceNumber}. Receipt ${receiptNumber} generated.`
    });

    return {
      success: true,
      payment: paymentRecord,
      invoice: updatedInvoice,
      receipt
    };
  }

  // --- Public Safe Receipt Verification ---
  public verifyReceipt(receiptNumber: string): {
    found: boolean;
    receipt?: DigitalEducationReceipt;
    error?: string;
  } {
    const cleanNo = receiptNumber.trim().toUpperCase();
    const receipt = this.receiptsEngine.get(cleanNo);
    if (!receipt) {
      return { found: false, error: 'Receipt reference not found in verified registry' };
    }

    return {
      found: true,
      receipt
    };
  }

  public getReceiptByNumber(receiptNumber: string): DigitalEducationReceipt | null {
    return this.receiptsEngine.get(receiptNumber.trim().toUpperCase());
  }

  // --- Admissions Workflow ---
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

  public submitAdmissionApplication(app: Omit<AdmissionApplication, 'id' | 'applicationNumber' | 'submittedAt' | 'updatedAt'>): AdmissionApplication {
    const id = `adm-app-${Date.now()}`;
    const applicationNumber = `APP/${new Date().getFullYear()}/${app.institutionId.slice(-3).toUpperCase()}/${Math.floor(100 + Math.random() * 900)}`;
    const timestamp = new Date().toISOString();

    const record: AdmissionApplication = {
      ...app,
      id,
      applicationNumber,
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

  public acceptAdmissionOffer(applicationId: string): AdmissionApplication | null {
    const app = this.admissionsEngine.get(applicationId);
    if (!app) return null;

    const timestamp = new Date().toISOString();
    const updated: AdmissionApplication = {
      ...app,
      status: 'OFFER_ACCEPTED',
      offerDetails: app.offerDetails ? { ...app.offerDetails, acceptanceFeePaid: true } : undefined,
      updatedAt: timestamp
    };

    this.admissionsEngine.set(applicationId, updated);

    this.recordAuditLog({
      action: 'ACCEPT_ADMISSION_OFFER',
      entityType: 'ADMISSION',
      entityId: applicationId,
      actorUsername: app.applicantEmail,
      actorRole: 'STUDENT',
      details: `Candidate accepted offer for ${app.programmeName} (${app.applicationNumber})`
    });

    return updated;
  }

  // --- Scholarships ---
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
        totalBilledUsd: totalBilled,
        totalCollectedUsd: totalCollected,
        outstandingBalanceUsd: outstanding,
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
