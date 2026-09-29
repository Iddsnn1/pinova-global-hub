export interface InstitutionVerificationResult {
  valid: boolean;
  status: 'VERIFIED' | 'VERIFIED_WITH_LIMITATIONS' | 'SUSPENDED' | 'NOT_FOUND' | 'UNAVAILABLE';
  authorityName: string;
  accreditationReference?: string;
  notes?: string;
  checkedAt: string;
}

export interface StudentVerificationResult {
  verified: boolean;
  status: 'VERIFIED' | 'NOT_FOUND' | 'PENDING' | 'UNAVAILABLE' | 'REQUIRES_MANUAL_REVIEW';
  authorityName: string;
  referenceId: string;
  verifiedProfile?: {
    fullName: string;
    matricNumber: string;
    institutionName: string;
    facultyOrSchool?: string;
    departmentOrClass?: string;
    programmeLevel?: string;
    academicSession: string;
    enrollmentStatus: string;
  };
  checkedAt: string;
  notes?: string;
}

export interface IAccreditationProviderAdapter {
  countryCode: string;
  authorities: string[];
  verifyInstitution(institutionCode: string): Promise<InstitutionVerificationResult>;
  verifyStudent(institutionId: string, studentReference: string, academicSession?: string): Promise<StudentVerificationResult>;
}

/**
 * Nigeria Accreditation Provider (NUC, NBTE, NCCE, WAEC, JAMB)
 */
export class NigerianAccreditationAdapter extends UnconfiguredAccreditationAdapter {
  constructor() {
    super('NG', ['NUC', 'NBTE', 'NCCE', 'JAMB', 'WAEC']);
  }
}

class LegacyRemovedNigerianAdapter implements IAccreditationProviderAdapter {
  public countryCode = 'NG';
  public authorities = [
    'National Universities Commission (NUC)',
    'National Board for Technical Education (NBTE)',
    'National Commission for Colleges of Education (NCCE)',
    'Joint Admissions and Matriculation Board (JAMB)',
    'West African Examinations Council (WAEC)'
  ];

  // Production safety: no static institution registry is used.
  private officialRegistry: Record<string, never> = {};
  private studentRecords: Record<string, never> = {};

  public async verifyInstitution(institutionCode: string): Promise<InstitutionVerificationResult> {
    return {
      valid: false,
      status: 'UNAVAILABLE',
      authorityName: 'Authoritative accreditation provider',
      notes: 'Authoritative accreditation provider integration is not configured. No verification claim was made.',
      checkedAt: new Date().toISOString()
    };
  }

  public async verifyStudent(institutionId: string, studentReference: string, academicSession?: string): Promise<StudentVerificationResult> {
    return {
      verified: false,
      status: 'UNAVAILABLE',
      authorityName: 'Authoritative student registry provider',
      referenceId: studentReference,
      notes: 'Authoritative student registry integration is not configured. No verification claim was made.',
      checkedAt: new Date().toISOString()
    };
  }
}

/**
 * United States Accreditation Provider (Regional Agencies / USDE)
 */
export class UsAccreditationAdapter extends UnconfiguredAccreditationAdapter {
  constructor() {
    super('US', ['U.S. Department of Education', 'CHEA']);
  }
}

export class GlobalAccreditationAdapter extends UnconfiguredAccreditationAdapter {
  constructor() {
    super('GLOBAL', ['Authoritative national/institutional accreditation provider']);
  }
}

export class AccreditationAdapterRegistry {
  private adapters: Map<string, IAccreditationProviderAdapter> = new Map();

  constructor() {
    this.register(new NigerianAccreditationAdapter());
    this.register(new UsAccreditationAdapter());
    this.register(new GlobalAccreditationAdapter());
  }

  public register(adapter: IAccreditationProviderAdapter): void {
    this.adapters.set(adapter.countryCode.toUpperCase(), adapter);
  }

  public getAdapter(countryCode: string = 'GLOBAL'): IAccreditationProviderAdapter {
    const code = countryCode.toUpperCase().trim();
    return this.adapters.get(code) || this.adapters.get('GLOBAL') || this.adapters.get('NG')!;
  }
}

export const accreditationAdapterRegistry = new AccreditationAdapterRegistry();
