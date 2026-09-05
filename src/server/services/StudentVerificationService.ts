import { accreditationAdapterRegistry, StudentVerificationResult } from './AccreditationProviderAdapter';
import { EducationRepository } from '../db/repositories/EducationRepository';

export interface VerifyStudentRequestParams {
  institutionId: string;
  studentReference: string;
  academicSession?: string;
  dateOfBirth?: string;
  nationalId?: string;
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
    const adapter = accreditationAdapterRegistry.getAdapter(countryCode);
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
    const countryCode = params.countryCode || 'NG';

    if (!studentReference) {
      return {
        verified: false,
        status: 'NOT_FOUND',
        verificationStatus: 'REJECTED',
        authorityName: 'Central Student Verification Engine',
        referenceId: studentReference || 'UNKNOWN',
        notes: 'Student reference is strictly required.',
        checkedAt: new Date().toISOString()
      };
    }

    // Query Authoritative Accreditation Adapter
    const adapter = accreditationAdapterRegistry.getAdapter(countryCode);
    const verificationResult = await adapter.verifyStudent(institutionId || 'inst-unilag-001', studentReference, academicSession);

    // If verified and institution exists, enrich profile with institution branding
    if (verificationResult.verified && verificationResult.verifiedProfile && institutionId) {
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
