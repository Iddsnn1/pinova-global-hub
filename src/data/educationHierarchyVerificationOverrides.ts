import type { InstitutionProfile, UniversityFaculty, AcademicDepartment } from '../types/education';

/**
 * Authoritative hierarchy corrections sourced from the institution's current
 * published academic structure. These are runtime reconciliation overlays for
 * persisted legacy snapshots; they do not fabricate programmes or fees.
 */

const dept = (id: string, name: string, verificationStatus: AcademicDepartment['verificationStatus'] = 'VERIFIED'): AcademicDepartment => ({
  id,
  name,
  verificationStatus,
  programmes: []
});

const faculty = (
  id: string,
  name: string,
  departments: AcademicDepartment[],
  unitType: UniversityFaculty['unitType'] = 'faculty'
): UniversityFaculty => ({
  id,
  name,
  unitType,
  verificationStatus: 'VERIFIED',
  departments
});

const BUK_ADDITIONAL_FACULTIES: UniversityFaculty[] = [
  faculty('fac-buk-agri', 'Faculty of Agriculture', [
    dept('dept-buk-agri-econ', 'Department of Agricultural Economics and Extension'),
    dept('dept-buk-agronomy', 'Department of Agronomy'),
    dept('dept-buk-animal', 'Department of Animal Science'),
    dept('dept-buk-crop-protection', 'Department of Crop Protection'),
    dept('dept-buk-soil', 'Department of Soil Science'),
    dept('dept-buk-fst', 'Department of Food Science and Technology'),
    dept('dept-buk-fisheries', 'Department of Fisheries and Aquaculture'),
    dept('dept-buk-forestry', 'Department of Forestry and Wildlife Management')
  ]),
  faculty('fac-buk-basic-clinical', 'Faculty of Basic Clinical Sciences', [
    dept('dept-buk-bcs-anatomy', 'Department of Anatomy'),
    dept('dept-buk-bcs-biochemistry', 'Department of Biochemistry'),
    dept('dept-buk-bcs-physiology', 'Department of Human Physiology')
  ]),
  faculty('fac-buk-dentistry', 'Faculty of Dentistry', [
    dept('dept-buk-dent-restorative', 'Department of Restorative Dentistry'),
    dept('dept-buk-dent-child', 'Department of Child Dental Health'),
    dept('dept-buk-dent-oral', 'Department of Oral and Maxillofacial Surgery / Oral Diagnostic Sciences'),
    dept('dept-buk-dent-preventive', 'Department of Preventive Dentistry')
  ]),
  faculty('fac-buk-life', 'Faculty of Life Sciences', [
    dept('dept-buk-life-biological', 'Department of Biological Sciences'),
    dept('dept-buk-life-microbiology', 'Department of Microbiology'),
    dept('dept-buk-life-plant', 'Department of Plant Biology')
  ]),
  faculty('fac-buk-pharm', 'Faculty of Pharmaceutical Sciences', [
    dept('dept-buk-pharm-clinical', 'Department of Clinical Pharmacy & Pharmacy Practice'),
    dept('dept-buk-pharm-chem', 'Department of Pharmaceutical and Medicinal Chemistry'),
    dept('dept-buk-pharm-micro', 'Department of Pharmaceutical Microbiology and Biotechnology'),
    dept('dept-buk-pharm-tech', 'Department of Pharmaceutics and Pharmaceutical Technology'),
    dept('dept-buk-pharm-pharmaco', 'Department of Pharmacognosy and Herbal Medicine'),
    dept('dept-buk-pharm-therapeutics', 'Department of Pharmacology and Therapeutics')
  ]),
  faculty('fac-buk-physical', 'Faculty of Physical Sciences', [
    dept('dept-buk-physical-maths', 'Department of Mathematical Sciences'),
    dept('dept-buk-physical-physics', 'Department of Physics'),
    dept('dept-buk-physical-chem', 'Department of Pure and Industrial Chemistry')
  ]),
  faculty('fac-buk-vet', 'Faculty of Veterinary Medicine', [
    dept('dept-buk-vet-anatomy', 'Department of Veterinary Anatomy'),
    dept('dept-buk-vet-microbiology', 'Department of Veterinary Microbiology'),
    dept('dept-buk-vet-parasitology', 'Department of Veterinary Parasitology and Entomology'),
    dept('dept-buk-vet-physiology', 'Department of Veterinary Physiology and Biochemistry')
  ])
];

export function applyEducationHierarchyVerificationOverrides(institution: InstitutionProfile): InstitutionProfile {
  if (institution.id !== 'inst-ng-buk-001') return institution;

  const existing = institution.faculties || [];

  // The legacy "Faculty of Science" record predates BUK's split into
  // Life Sciences and Physical Sciences. Replace it with the current units.
  const retained = existing.filter((f) => f.id !== 'fac-buk-sci');
  const existingIds = new Set(retained.map((f) => f.id));

  for (const replacement of BUK_ADDITIONAL_FACULTIES) {
    if (!existingIds.has(replacement.id)) retained.push(replacement);
  }

  return {
    ...institution,
    faculties: retained,
    hierarchyVerificationStatus: 'VERIFIED'
  };
}
