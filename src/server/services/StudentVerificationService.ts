import { accreditationAdapterRegistry, StudentVerificationResult } from './AccreditationProviderAdapter';
import { EducationRepository } from '../db/repositories/EducationRepository';
import {
  getNigeriaAuthoritativeProviderForCapability,
  getAuthoritativeEducationProvider
} from './AuthoritativeEducationProviderRegistry';

export interface VerifyStudentRequestParams {
  institutionId: string;
  studentReference: string;
  academicSession?: string;
  dateOfBirth?: string;
  nationalId?: string;
  countryCode?: string;
}

export class StudentVerificationService {
  private static instance: StudentVerificationService | null = null;
  private educationRepo: EducationRepository;

  public static getInstance(educationRepo?: EducationRepository): StudentVerificationService {
    if (!StudentVerificationService.instance) {
      StudentVerificationService.instance = new StudentVerificationService(educationRepo || new EducationRepository());
    }
    return StudentVerificationService.instance;
  }

  constructor(educationRepo: EducationRepository) {
    this.educationRepo = educationRepo;
  }

  public async verifyInstitution(institutionId: string, countryCode: string = 'NG', registryNumber?: string) {
    const code = (countryCode || 'GLOBAL').trim().toUpperCase();

    if (code === 'NG') {
      const providers = getNigeriaAuthoritativeProviderForCapability('INSTITUTION_REGISTRY');
      const configured = providers.find((provider) => provider.integrationStatus === 'CONFIGURED');
      if (!configured) {
        return {
          accredited: false,
          status: 'UNAVAILABLE',
          authority: providers.map((provider) => provider.id).join(', '),
          notes: 'Authoritative Nigerian institution registry integration is not configured. No verification claim was made.'
        };
      }
    }

    const adapter = accreditationAdapterRegistry.getAdapter(code);
    const result = await adapter.verifyInstitution(registryNumber || institutionId);
    return {
      accredited: result.valid,
      status: result.status,
      authority: result.authorityName,
      accreditationReference: result.accreditationReference,
      notes: result.notes
    };
  }

  public async verifyStudent(params: VerifyStudentRequestParams | any): Promise<StudentVerificationResult & { verificationStatus?: string }> {
    const institutionId = params.institutionId;
    const studentReference = params.studentReference || params.matricOrRegistrationNumber || params.studentId;
    const academicSession = params.academicSession;
    const countryCode = (params.countryCode || 'NG').trim().toUpperCase();

    if (!studentReference) {
      return {
        verified: false,
        status: 'NOT_FOUND',
        verificationStatus: 'REJECTED',
        authorityName: 'Authoritative Student Verification Provider',
        referenceId: 'UNKNOWN',
        notes: 'Student reference is strictly required.',
        checkedAt: new Date().toISOString()
      };
    }

    if (!institutionId || !institutionId.trim()) {
      return {
        verified: false,
        status: 'UNAVAILABLE',
        verificationStatus: 'REJECTED',
        authorityName: 'Authoritative Student Verification Provider',
        referenceId: studentReference,
        notes: 'Institution context is required. No default institution is assumed.',
        checkedAt: new Date().toISOString()
      };
    }

    if (countryCode === 'NG') {
      const admissionProviders = getNigeriaAuthoritativeProviderForCapability('ADMISSION_STATUS');
      const configuredAdmissionProvider = admissionProviders.find(
        (provider) => provider.integrationStatus === 'CONFIGURED'
      );
      const registryProviders = getNigeriaAuthoritativeProviderForCapability('INSTITUTION_REGISTRY');
      const configuredRegistryProvider = registryProviders.find(
        (provider) => provider.integrationStatus === 'CONFIGURED'
      );

      if (!configuredAdmissionProvider && !configuredRegistryProvider) {
        return {
          verified: false,
          status: 'UNAVAILABLE',
          verificationStatus: 'REJECTED',
          authorityName: admissionProviders
            .map((provider) => getAuthoritativeEducationProvider(provider.id).authorityName)
            .join(' / '),
          referenceId: studentReference,
          notes: 'Authoritative Nigerian student/admission provider integration is not configured. No verification claim was made.',
          checkedAt: new Date().toISOString()
        };
      }
    }

    const adapter = accreditationAdapterRegistry.getAdapter(countryCode);
    const verificationResult = await adapter.verifyStudent(institutionId.trim(), studentReference, academicSession);

    if (verificationResult.verified && verificationResult.verifiedProfile) {
      const institution = this.educationRepo.getInstitutionById(institutionId);
      if (institution) {
        verificationResult.verifiedProfile.institutionName = institution.name;
      }
    }

    return {
      ...verificationResult,
      verificationStatus: verificationResult.verified ? 'VERIFIED' : 'REJECTED'
    };
  }
}
