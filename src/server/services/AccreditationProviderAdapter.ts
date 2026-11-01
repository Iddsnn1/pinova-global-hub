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

class UnconfiguredAccreditationAdapter implements IAccreditationProviderAdapter {
  constructor(public countryCode: string, public authorities: string[]) {}

  async verifyInstitution(_institutionCode: string): Promise<InstitutionVerificationResult> {
    return {
      valid: false,
      status: 'UNAVAILABLE',
      authorityName: this.authorities[0] || 'Authoritative accreditation provider',
      notes: 'Authoritative accreditation provider integration is not configured. No verification claim was made.',
      checkedAt: new Date().toISOString()
    };
  }

  async verifyStudent(_institutionId: string, studentReference: string, _academicSession?: string): Promise<StudentVerificationResult> {
    return {
      verified: false,
      status: 'UNAVAILABLE',
      authorityName: this.authorities[0] || 'Authoritative student registry provider',
      referenceId: studentReference,
      notes: 'Authoritative student registry integration is not configured. No verification claim was made.',
      checkedAt: new Date().toISOString()
    };
  }
}

export class NigerianAccreditationAdapter extends UnconfiguredAccreditationAdapter {
  constructor() {
    super('NG', ['NUC', 'NBTE', 'NCCE', 'JAMB', 'WAEC']);
  }
}

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
  private adapters = new Map<string, IAccreditationProviderAdapter>();

  constructor() {
    this.register(new NigerianAccreditationAdapter());
    this.register(new UsAccreditationAdapter());
    this.register(new GlobalAccreditationAdapter());
  }

  register(adapter: IAccreditationProviderAdapter): void {
    this.adapters.set(adapter.countryCode.toUpperCase(), adapter);
  }

  getAdapter(countryCode = 'GLOBAL'): IAccreditationProviderAdapter {
    return this.adapters.get(countryCode.toUpperCase()) || this.adapters.get('GLOBAL')!;
  }
}

export const accreditationAdapterRegistry = new AccreditationAdapterRegistry();
