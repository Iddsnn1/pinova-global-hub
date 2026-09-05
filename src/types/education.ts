/**
 * PiNova Global Hub — Global Education Ecosystem Data Models
 * Supports complete education lifecycle from Early Childhood to University and Lifelong Learning.
 */

export type EducationTier =
  | 'early_childhood'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'technical_vocational'
  | 'professional_continuing';

export type InstitutionType =
  | 'creche_nursery'
  | 'primary_school'
  | 'secondary_school'
  | 'comprehensive_school'
  | 'college_of_education'
  | 'polytechnic'
  | 'university'
  | 'vocational_institute'
  | 'technical_college'
  | 'professional_academy'
  | 'exam_board'
  | 'online_institution';

export type VerificationStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'VERIFIED_WITH_LIMITATIONS'
  | 'SUSPENDED'
  | 'REJECTED';

export type AccreditationStatus = 'accredited' | 'provisional' | 'under_review' | 'not_accredited';

export interface AccreditationDetails {
  authority: string;
  registrationNumber?: string;
  accreditationStatus: AccreditationStatus;
  validThrough?: string;
  verifiedAt?: string;
  officialNotes?: string;
}

export interface AcademicCalendarTerm {
  id: string;
  name: string; // e.g., "1st Term", "Harmattan Semester", "Fall Quarter"
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface AcademicSessionConfig {
  session: string; // e.g., "2025/2026"
  terms: AcademicCalendarTerm[];
}

export interface EducationProgramme {
  id: string;
  name: string;
  code: string;
  facultyName?: string;
  departmentName?: string;
  tier: EducationTier;
  levelCode: string; // e.g., "100L", "ND I", "JSS 1", "Grade 4"
  durationYears: number;
  credentialAwarded: string; // e.g., "B.Sc.", "HND", "SSCE", "Diploma", "Certification"
  tuitionPerPeriod: number;
  currency: string;
  admissionRequirements: string[];
  description?: string;
}

export interface UniversityFaculty {
  id: string;
  name: string;
  departments: {
    id: string;
    name: string;
    programmes: EducationProgramme[];
  }[];
}

export interface InstitutionProfile {
  id: string;
  name: string;
  legalName: string;
  tradingName?: string;
  institutionCode: string;
  institutionType: InstitutionType;
  supportedTiers: EducationTier[];
  country: string;
  countryCode: string;
  state: string;
  city: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  logoUrl: string;
  coverImageUrl?: string;
  isPublic: boolean; // true = public/federal/state, false = private
  curriculum: string[]; // e.g. ["NERDC (Nigerian National)", "British (Cambridge)", "IB", "American"]
  instructionLanguage: string[];
  isBoarding: boolean;
  hasDayOption: boolean;
  accreditation: AccreditationDetails;
  verificationStatus: VerificationStatus;
  verificationDate?: string;
  administratorName?: string;
  administratorEmail?: string;
  acceptedCurrencies: string[];
  supportsPiPayment: boolean;
  supportsInstallments: boolean;
  activeSessions: AcademicSessionConfig[];
  programmes?: EducationProgramme[];
  faculties?: UniversityFaculty[];
  featuredBadge?: string;
  overviewDescription: string;
}

// Global Education Taxonomy
export interface TaxonomyEducationLevel {
  id: string;
  tier: EducationTier;
  standardName: string; // e.g. "Primary Education"
  localName: string; // e.g. "Basic Education (Primary 1-6)"
  subGrades: string[]; // e.g. ["Primary 1", "Primary 2", ..., "Primary 6"]
  periodType: 'term' | 'semester' | 'trimester' | 'quarter' | 'course_based';
  periods: string[];
}

export type EducationLevelDefinition = TaxonomyEducationLevel;

export interface CountryEducationTaxonomy {
  countryCode: string;
  countryName: string;
  educationSystemName: string; // e.g., "6-3-3-4 System (Nigeria)", "K-12 System (USA)"
  regulatoryAuthorities: string[];
  defaultCurrency: string;
  supportedLevels: TaxonomyEducationLevel[];
}

// Student & Guardian Identity
export interface StudentIdentity {
  id: string; // Global PiNova Student Identity
  nationalStudentId?: string; // e.g. NIN, JAMB Reg, SSN
  institutionStudentId: string; // Matric or Reg #
  admissionNumber: string;
  fullName: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  currentInstitutionId: string;
  currentInstitutionName: string;
  tier: EducationTier;
  programmeName: string;
  currentLevel: string; // e.g., "300 Level", "Primary 4", "JSS 2"
  faculty?: string;
  department?: string;
  academicSession: string;
  currentTermOrSemester: string;
  guardianId: string;
  guardianName: string;
  guardianRelationship: 'father' | 'mother' | 'guardian' | 'sponsor' | 'self';
  enrollmentDate: string;
  status: 'active' | 'graduated' | 'transferred' | 'deferred';
}

export interface GuardianChildSummary {
  studentId: string;
  fullName: string;
  institutionId: string;
  institutionName: string;
  tier: EducationTier;
  currentLevel: string;
  academicSession: string;
  currentTermOrSemester: string;
  totalBilledFiat: number;
  totalPaidFiat: number;
  outstandingBalanceFiat: number;
  currency: string;
  nextDueDate?: string;
  activeInvoiceCount: number;
  recentReceiptId?: string;
  avatarUrl?: string;
}

// School Fees & Invoices
export type FeeCategory =
  | 'tuition'
  | 'registration'
  | 'admission'
  | 'acceptance'
  | 'examination'
  | 'development_levy'
  | 'pta'
  | 'technology_ict'
  | 'laboratory'
  | 'library'
  | 'medical'
  | 'insurance'
  | 'sports'
  | 'transport'
  | 'boarding'
  | 'accommodation'
  | 'feeding'
  | 'uniform'
  | 'books_learning_materials'
  | 'id_card'
  | 'graduation'
  | 'certification'
  | 'transcript'
  | 'application'
  | 'other_charge';

export interface FeeInvoiceItem {
  id: string;
  category: FeeCategory;
  description: string;
  amount: number;
  isCompulsory: boolean;
  compulsory?: boolean;
}

export type InvoicePaymentStatus =
  | 'UNPAID'
  | 'PARTIALLY_PAID'
  | 'PAID'
  | 'OVERDUE'
  | 'CANCELLED'
  | 'HELD_IN_ESCROW_FOR_REFUND';

export interface EducationInvoice {
  id: string;
  invoiceNumber: string;
  institutionId: string;
  institutionName: string;
  studentId: string;
  studentName: string;
  studentMatricOrReg: string;
  guardianId?: string;
  educationTier: EducationTier;
  educationLevel?: string;
  programmeOrClass: string;
  academicSession: string;
  termOrSemester: string;
  items: FeeInvoiceItem[];
  lineItems?: FeeInvoiceItem[];
  subtotal: number;
  discountAmount: number;
  discountReason?: string;
  taxAmount: number;
  totalAmount: number;
  amountPaid: number;
  outstandingBalance: number;
  currency: string;
  dueDate: string;
  issuedDate?: string;
  status: InvoicePaymentStatus;
  allowedInstallments: number; // 1 = full only, 2-4 = split
  installmentsPaidCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface EducationPaymentTransaction {
  id: string;
  invoiceId: string;
  institutionId: string;
  studentId: string;
  amountPaid: number;
  currency: string;
  piAmount: number;
  piPaymentId?: string;
  piTxid?: string;
  paymentMethod: 'PI_NETWORK' | 'FIAT_ESCROW' | 'SCHOLARSHIP_GRANT';
  status: 'PENDING' | 'VERIFIED_COMPLETED' | 'FAILED' | 'REFUNDED';
  receiptNumber: string;
  payerUsername: string;
  idempotencyKey: string;
  verifiedAt: string;
  auditHash: string;
}

export interface DigitalEducationReceipt {
  receiptNumber: string;
  verificationReference: string;
  verificationHash: string;
  algorithm?: string;
  invoiceId: string;
  invoiceNumber: string;
  paymentId?: string;
  institutionId: string;
  institutionName: string;
  institutionLogo?: string;
  studentId?: string;
  studentName: string;
  studentMatricOrReg: string;
  educationLevel: string;
  academicSession: string;
  termOrSemester: string;
  chargeDescription: string;
  amountPaid: number;
  currency: string;
  piAmount: number;
  piPaymentId?: string;
  piTxid?: string;
  paymentMethod: string;
  paymentDate: string;
  settlementStatus?: string;
  verifiedByServer: boolean;
  publicSafeSummary: {
    receiptNumber: string;
    institutionName: string;
    academicSession: string;
    termOrSemester: string;
    amountPaidFormatted: string;
    verifiedAt: string;
    isAuthentic: boolean;
  };
}

// Admission Workflow
export type AdmissionApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'ADDITIONAL_INFO_REQUIRED'
  | 'DOCUMENTS_REQUIRED'
  | 'ACCEPTED'
  | 'OFFER_ISSUED'
  | 'OFFERED'
  | 'OFFER_ACCEPTED'
  | 'REGISTRATION_COMPLETED'
  | 'ENROLLED'
  | 'REJECTED'
  | 'WITHDRAWN'
  | 'EXPIRED';

export interface AdmissionDocument {
  id: string;
  type: 'birth_certificate' | 'passport_photo' | 'previous_transcript' | 'ssce_result' | 'recommendation_letter' | 'other';
  fileName: string;
  fileSizeKb: number;
  uploadedAt: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
}

export interface AdmissionApplication {
  id: string;
  applicationNumber: string;
  institutionId: string;
  institutionName: string;
  programmeId: string;
  programmeName: string;
  educationTier: EducationTier;
  applicantFullName: string;
  applicantEmail: string;
  applicantPhone: string;
  guardianName?: string;
  guardianPhone?: string;
  dateOfBirth: string;
  academicSession?: string;
  status: AdmissionApplicationStatus;
  applicationFeeFiat: number;
  applicationFeePaid: boolean;
  applicationFeePi?: number;
  submittedAt: string;
  updatedAt: string;
  documents: AdmissionDocument[];
  offerDetails?: {
    offerDate: string;
    acceptanceDeadline: string;
    acceptanceFeeFiat?: number;
    acceptanceFee?: number;
    acceptanceFeePaid: boolean;
    offerLetterUrl?: string;
  };
  decisionNotes?: string;
}

// Scholarships & Aid
export interface ScholarshipOpportunity {
  id: string;
  title: string;
  sponsorName: string;
  sponsorType: 'government' | 'ngo' | 'corporate' | 'institution';
  badge: string;
  description: string;
  coverageType: 'Full Tuition' | 'Partial Tuition (50%)' | 'Research Grant' | 'Living Stipend';
  amountValue: string; // e.g. "$1,500 / Year" or "Full Tuition Covered"
  coverageAmountUsd?: number;
  applicableTiers: EducationTier[];
  eligibleCountries: string[];
  deadline: string;
  eligibilityCriteria: string[];
  numberOfAwards: number;
  applicationCount: number;
}

// Education Marketplace
export interface EducationMarketplaceItem {
  id: string;
  title: string;
  category: 'textbook' | 'uniform' | 'supplies' | 'software' | 'course' | 'exam_prep';
  publisherOrProvider: string;
  fiatPrice: number;
  currency: string;
  piPrice: number;
  tier: EducationTier;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  isDigital: boolean;
  inStock: boolean;
  description: string;
}

// RBAC
export type PlatformRole = 'SUPER_ADMIN' | 'COMPLIANCE_ADMIN' | 'FINANCE_ADMIN' | 'SUPPORT_ADMIN';
export type InstitutionStaffRole = 'INSTITUTION_OWNER' | 'PRINCIPAL' | 'SCHOOL_ADMIN' | 'ADMISSIONS_OFFICER' | 'FINANCE_OFFICER' | 'TEACHER' | 'REGISTRAR';
export type UserRole = 'PARENT' | 'GUARDIAN' | 'STUDENT' | 'SPONSOR';

export interface EducationAuditLog {
  id: string;
  action: string;
  entityType: 'INVOICE' | 'PAYMENT' | 'ADMISSION' | 'INSTITUTION' | 'STUDENT' | 'RECEIPT' | 'SCHOLARSHIP';
  entityId: string;
  actorUsername: string;
  actorRole: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
  auditHash: string;
}
