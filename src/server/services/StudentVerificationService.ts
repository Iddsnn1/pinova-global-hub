import { accreditationAdapterRegistry, StudentVerificationResult } from './AccreditationProviderAdapter';
import { authoritativeEducationConnectorRegistry } from './AuthoritativeEducationConnectorRegistry';
import { AuthoritativeEducationProviderId } from './AuthoritativeEducationProviderRegistry';
import { EducationRepository } from '../db/repositories/EducationRepository';

export interface VerifyStudentRequestParams {
  institutionId: string;
  studentReference: string;
  academicSession?: string;
  dateOfBirth?: string;
  nationalId?: string;
  countryCode?: string;
  providerId?: AuthoritativeEducationProviderId;
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

  public async verifyInstitution(
    institutionId: string,
    countryCode: string = 'NG',
    registryNumber?: string,
    providerId?: AuthoritativeEducationProviderId
  ) {
    const code = (countryCode || 'GLOBAL').trim().toUpperCase();

    if (code === 'NG') {
      const connector = authoritativeEducationConnectorRegistry.resolveForCapability(
        'INSTITUTION_REGISTRY',
        providerId
      );
      if (!connector) {
        return {
          accredited: false,
          status: 'UNAVAILABLE',
          authority: providerId || 'NUC / NBTE',
          notes: 'Select the specific Nigerian authority (NUC or NBTE). PiNova will not guess which regulator should verify this institution.'
        };
      }
      const result = await connector.verifyInstitution(registryNumber || institutionId);
      return {
        accredited: result.valid,
        status: result.status,
        authority: result.authorityName,
        accreditationReference: result.accreditationReference,
        notes: result.notes
      };
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
    const request = params && typeof params === 'object' ? params : {};
    const institutionId = typeof request.institutionId === 'string' ? request.institutionId.trim() : '';
    const rawStudentReference = request.studentReference || request.matricOrRegistrationNumber || request.studentId;
    const studentReference = typeof rawStudentReference === 'string' ? rawStudentReference.trim() : '';
    const academicSession = typeof request.academicSession === 'string' ? request.academicSession.trim() : undefined;
    const countryCode = typeof request.countryCode === 'string' && request.countryCode.trim()
      ? request.countryCode.trim().toUpperCase()
      : 'NG';

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

    if (!institutionId) {
      return {
        verified: false,
        status: 'UNAVAILABLE',
        verificationStatus: 'UNAVAILABLE',
        authorityName: 'Authoritative Student Verification Provider',
        referenceId: studentReference,
        notes: 'Institution context is required. No default institution is assumed.',
        checkedAt: new Date().toISOString()
      };
    }

    let verificationResult: StudentVerificationResult;
    if (countryCode === 'NG') {
      const connector = authoritativeEducationConnectorRegistry.resolveForCapability(
        'ADMISSION_STATUS',
        request.providerId
      );
      if (!connector) {
        return {
          verified: false,
          status: 'UNAVAILABLE',
          verificationStatus: 'UNAVAILABLE',
          authorityName: 'JAMB CAPS',
          referenceId: studentReference,
          notes: 'No unambiguous Nigerian admission-status connector was selected. No verification claim was made.',
          checkedAt: new Date().toISOString()
        };
      }
      verificationResult = await connector.verifyStudent(institutionId, studentReference, academicSession);
    } else {
      const adapter = accreditationAdapterRegistry.getAdapter(countryCode);
      verificationResult = await adapter.verifyStudent(institutionId, studentReference, academicSession);
    }

    if (verificationResult.verified && verificationResult.verifiedProfile) {
      const institution = this.educationRepo.getInstitutionById(institutionId);
      if (institution) {
        verificationResult.verifiedProfile.institutionName = institution.name;
      }
    }

    return {
      ...verificationResult,
      verificationStatus: verificationResult.verified ? 'VERIFIED' : verificationResult.status === 'UNAVAILABLE' ? 'UNAVAILABLE' : verificationResult.status === 'PENDING' ? 'PENDING' : verificationResult.status === 'REQUIRES_MANUAL_REVIEW' ? 'UNDER_REVIEW' : verificationResult.status === 'NOT_FOUND' ? 'NOT_FOUND' : 'REJECTED'
    };
  }
}
