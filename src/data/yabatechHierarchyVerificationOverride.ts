import type { InstitutionProfile, UniversityFaculty } from '../types/education';

const verifiedTechnicalEducationSchool: UniversityFaculty = {
  id: 'fac-yabatech-tech-ed',
  name: 'School of Technical Education',
  unitType: 'school',
  verificationStatus: 'VERIFIED',
  departments: [
    {
      id: 'dept-yabatech-fine-applied-art-ed',
      name: 'Department of Fine and Applied Arts Education',
      verificationStatus: 'VERIFIED',
      programmes: []
    },
    {
      id: 'dept-yabatech-educational-foundations',
      name: 'Department of Educational Foundations',
      verificationStatus: 'VERIFIED',
      programmes: []
    },
    {
      id: 'dept-yabatech-science-education',
      name: 'Department of Science Education',
      verificationStatus: 'VERIFIED',
      programmes: []
    },
    {
      id: 'dept-yabatech-vocational-education',
      name: 'Department of Vocational Education',
      verificationStatus: 'VERIFIED',
      programmes: []
    }
  ]
};

export function applyYabatechHierarchyVerificationOverride(institution: InstitutionProfile): InstitutionProfile {
  if (institution.id !== 'inst-ng-yabatech-003') return institution;

  const existing = institution.faculties || [];
  if (existing.some((unit) => unit.id === verifiedTechnicalEducationSchool.id)) return institution;

  return {
    ...institution,
    faculties: [...existing, verifiedTechnicalEducationSchool],
    hierarchyVerificationStatus: 'VERIFIED'
  };
}
