import type { InstitutionProfile, UniversityFaculty, AcademicDepartment, EducationProgramme } from '../types/education';

/**
 * Authoritative hierarchy corrections sourced from the institutions' published
 * academic structures. These runtime reconciliation overlays repair legacy or
 * incomplete persisted snapshots without fabricating fees or programmes.
 */

const dept = (
  id: string,
  name: string,
  programmes: EducationProgramme[] = [],
  verificationStatus: AcademicDepartment['verificationStatus'] = 'VERIFIED'
): AcademicDepartment => ({
  id,
  name,
  verificationStatus,
  programmes
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

const UNILAG_FACULTIES: UniversityFaculty[] = [
  faculty('fac-unilag-architecture', 'Faculty of Architecture', [
    dept('dept-unilag-architecture', 'Department of Architecture'),
    dept('dept-unilag-landscape', 'Department of Landscape Architecture and Urban Design'),
    dept('dept-unilag-interior', 'Department of Interior Architecture and Design')
  ]),
  faculty('fac-unilag-arts', 'Faculty of Arts', [
    dept('dept-unilag-arts-english', 'Department of English'),
    dept('dept-unilag-arts-european', 'Department of European Languages and Integration Studies'),
    dept('dept-unilag-arts-history', 'Department of History and Strategic Studies'),
    dept('dept-unilag-arts-linguistics', 'Department of Linguistics, African and Asian Studies'),
    dept('dept-unilag-arts-philosophy', 'Department of Philosophy'),
    dept('dept-unilag-arts-religious', 'Department of Religious Studies')
  ]),
  faculty('fac-unilag-basic-clinical', 'Faculty of Basic Clinical Sciences', [
    dept('dept-unilag-bcs-pathology', 'Department of Anatomic and Molecular Pathology'),
    dept('dept-unilag-bcs-haematology', 'Department of Haematology and Blood Transfusion'),
    dept('dept-unilag-bcs-medmicro', 'Department of Medical Microbiology and Parasitology'),
    dept('dept-unilag-bcs-clinpath', 'Department of Clinical Pathology'),
    dept('dept-unilag-bcs-clinpharm', 'Department of Clinical Pharmacology')
  ]),
  faculty('fac-unilag-basic-medical', 'Faculty of Basic Medical Sciences', [
    dept('dept-unilag-bms-anatomy', 'Department of Anatomy'),
    dept('dept-unilag-bms-physiology', 'Department of Physiology'),
    dept('dept-unilag-bms-biochem', 'Department of Medical Biochemistry'),
    dept('dept-unilag-bms-pharm', 'Department of Pharmacology, Therapeutics and Toxicology')
  ]),
  faculty('fac-unilag-clinical', 'Faculty of Clinical Sciences', [
    dept('dept-unilag-clin-anaesthesia', 'Department of Anaesthesia'),
    dept('dept-unilag-clin-community', 'Department of Community Health and Primary Care'),
    dept('dept-unilag-clin-medicine', 'Department of Medicine'),
    dept('dept-unilag-clin-obgyn', 'Department of Obstetrics and Gynaecology'),
    dept('dept-unilag-clin-ophthalmology', 'Department of Ophthalmology'),
    dept('dept-unilag-clin-paediatrics', 'Department of Paediatrics'),
    dept('dept-unilag-clin-psychiatry', 'Department of Psychiatry'),
    dept('dept-unilag-clin-radiology', 'Department of Radiation Biology, Radiotherapy and Radiodiagnosis'),
    dept('dept-unilag-clin-surgery', 'Department of Surgery')
  ]),
  faculty('fac-unilag-communication', 'Faculty of Communication and Media Studies', [
    dept('dept-unilag-comm-masscomm', 'Department of Mass Communication'),
    dept('dept-unilag-comm-pr', 'Department of Public Relations and Advertising'),
    dept('dept-unilag-comm-journalism', 'Department of Journalism, Broadcasting and Media Studies')
  ]),
  faculty('fac-unilag-computing', 'Faculty of Computing and Informatics', [
    dept('dept-unilag-computing-cs', 'Department of Computer Science'),
    dept('dept-unilag-computing-robotics', 'Department of Intelligent Systems and Robotics'),
    dept('dept-unilag-computing-cyber', 'Department of Cybersecurity and Software Engineering')
  ]),
  faculty('fac-unilag-creative-arts', 'Faculty of Creative Arts', [
    dept('dept-unilag-creative-music', 'Department of Music and Sound Production'),
    dept('dept-unilag-creative-theatre', 'Department of Theatre Arts and Film Studies'),
    dept('dept-unilag-creative-fine', 'Department of Fine and Applied Arts')
  ]),
  faculty('fac-unilag-dental', 'Faculty of Dental Sciences', [
    dept('dept-unilag-dental-child', 'Department of Child Dental Health'),
    dept('dept-unilag-dental-oralpath', 'Department of Oral and Maxillofacial Pathology/Biology'),
    dept('dept-unilag-dental-oral-surgery', 'Department of Oral and Maxillofacial Surgery'),
    dept('dept-unilag-dental-preventive', 'Department of Preventive Dentistry'),
    dept('dept-unilag-dental-restorative', 'Department of Restorative Dentistry')
  ]),
  faculty('fac-unilag-education', 'Faculty of Education', [
    dept('dept-unilag-edu-adult', 'Department of Adult Education'),
    dept('dept-unilag-edu-arts', 'Department of Arts Education'),
    dept('dept-unilag-edu-foundations', 'Department of Educational Foundations'),
    dept('dept-unilag-edu-management', 'Department of Educational Management'),
    dept('dept-unilag-edu-hke', 'Department of Human Kinetics and Health Education'),
    dept('dept-unilag-edu-science', 'Department of Science Education'),
    dept('dept-unilag-edu-social', 'Department of Social Sciences Education'),
    dept('dept-unilag-edu-technology', 'Department of Technology and Vocational Education')
  ]),
  faculty('fac-unilag-engineering', 'Faculty of Engineering', [
    dept('dept-unilag-eng-biomedical', 'Department of Biomedical Engineering'),
    dept('dept-unilag-eng-chemical', 'Department of Chemical Engineering'),
    dept('dept-unilag-eng-petroleum', 'Department of Petroleum and Gas Engineering'),
    dept('dept-unilag-eng-civil', 'Department of Civil and Environmental Engineering'),
    dept('dept-unilag-eng-electrical', 'Department of Electrical and Electronics Engineering'),
    dept('dept-unilag-eng-mechanical', 'Department of Mechanical Engineering'),
    dept('dept-unilag-eng-metallurgy', 'Department of Metallurgical and Materials Engineering'),
    dept('dept-unilag-eng-surveying', 'Department of Surveying and Geoinformatics'),
    dept('dept-unilag-eng-systems', 'Department of Systems Engineering')
  ]),
  faculty('fac-unilag-environmental', 'Faculty of Environmental Sciences', [
    dept('dept-unilag-env-building', 'Department of Building'),
    dept('dept-unilag-env-estate', 'Department of Estate Management'),
    dept('dept-unilag-env-quantity', 'Department of Quantity Surveying'),
    dept('dept-unilag-env-urban', 'Department of Urban and Regional Planning')
  ]),
  faculty('fac-unilag-health-professions', 'Faculty of Health Professions', [
    dept('dept-unilag-health-mls', 'Department of Medical Laboratory Science'),
    dept('dept-unilag-health-nursing', 'Department of Nursing Science'),
    dept('dept-unilag-health-physio', 'Department of Physiotherapy'),
    dept('dept-unilag-health-radio', 'Department of Radiography')
  ]),
  faculty('fac-unilag-law', 'Faculty of Law', [
    dept('dept-unilag-law-commercial', 'Department of Commercial and Industrial Law'),
    dept('dept-unilag-law-jurisprudence', 'Department of Jurisprudence and International Law'),
    dept('dept-unilag-law-private', 'Department of Private and Property Law'),
    dept('dept-unilag-law-public', 'Department of Public Law')
  ]),
  faculty('fac-unilag-life', 'Faculty of Life Sciences', [
    dept('dept-unilag-life-biochem', 'Department of Biochemistry'),
    dept('dept-unilag-life-botany', 'Department of Botany'),
    dept('dept-unilag-life-cell', 'Department of Cell Biology and Genetics'),
    dept('dept-unilag-life-marine', 'Department of Marine Science'),
    dept('dept-unilag-life-micro', 'Department of Microbiology'),
    dept('dept-unilag-life-zoology', 'Department of Zoology'),
    dept('dept-unilag-life-fisheries', 'Department of Fisheries and Aquaculture')
  ]),
  faculty('fac-unilag-management', 'Faculty of Management Sciences', [
    dept('dept-unilag-mgt-accounting', 'Department of Accounting'),
    dept('dept-unilag-mgt-actuarial', 'Department of Actuarial Science and Insurance'),
    dept('dept-unilag-mgt-business', 'Department of Business Administration'),
    dept('dept-unilag-mgt-hr', 'Department of Employment Relations and Human Resource Management'),
    dept('dept-unilag-mgt-finance', 'Department of Finance')
  ]),
  faculty('fac-unilag-pharmacy', 'Faculty of Pharmacy', [
    dept('dept-unilag-pharm-clinical', 'Department of Clinical Pharmacy and Biopharmacy'),
    dept('dept-unilag-pharm-chem', 'Department of Pharmaceutical Chemistry'),
    dept('dept-unilag-pharm-micro', 'Department of Pharmaceutical Microbiology and Biotechnology'),
    dept('dept-unilag-pharm-tech', 'Department of Pharmaceutics and Pharmaceutical Technology'),
    dept('dept-unilag-pharm-pharmaco', 'Department of Pharmacognosy')
  ]),
  faculty('fac-unilag-physical-earth', 'Faculty of Physical and Earth Sciences', [
    dept('dept-unilag-physical-chemistry', 'Department of Chemistry'),
    dept('dept-unilag-physical-geosciences', 'Department of Geosciences'),
    dept('dept-unilag-physical-maths', 'Department of Mathematics'),
    dept('dept-unilag-physical-physics', 'Department of Physics'),
    dept('dept-unilag-physical-statistics', 'Department of Statistics')
  ]),
  faculty('fac-unilag-social', 'Faculty of Social Sciences', [
    dept('dept-unilag-social-economics', 'Department of Economics'),
    dept('dept-unilag-social-geography', 'Department of Geography'),
    dept('dept-unilag-social-library', 'Department of Library and Information Science'),
    dept('dept-unilag-social-political', 'Department of Political Science'),
    dept('dept-unilag-social-psychology', 'Department of Psychology'),
    dept('dept-unilag-social-work', 'Department of Social Work'),
    dept('dept-unilag-social-sociology', 'Department of Sociology')
  ])
];

function mergeExistingProgrammes(nextFaculty: UniversityFaculty, existingFaculty?: UniversityFaculty): UniversityFaculty {
  if (!existingFaculty) return nextFaculty;
  const existingDepartments = new Map(
    (existingFaculty.departments || []).map((d) => [d.name.trim().toLowerCase(), d])
  );
  return {
    ...nextFaculty,
    departments: nextFaculty.departments.map((d) => {
      const existingDept = existingDepartments.get(d.name.trim().toLowerCase());
      return existingDept?.programmes?.length
        ? { ...d, programmes: existingDept.programmes }
        : d;
    })
  };
}

export function applyEducationHierarchyVerificationOverrides(institution: InstitutionProfile): InstitutionProfile {
  if (institution.id === 'inst-ng-buk-001') {
    const existing = institution.faculties || [];
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

  if (institution.id === 'inst-ng-unilag-001') {
    const existing = institution.faculties || [];
    const existingByName = new Map(existing.map((f) => [f.name.trim().toLowerCase(), f]));
    const corrected = UNILAG_FACULTIES.map((f) => mergeExistingProgrammes(f, existingByName.get(f.name.trim().toLowerCase())));
    return {
      ...institution,
      faculties: corrected,
      hierarchyVerificationStatus: 'VERIFIED'
    };
  }

  return institution;
}
