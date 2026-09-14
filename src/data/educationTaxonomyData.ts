import { CountryEducationTaxonomy } from '../types/education';

/**
 * Global Education Taxonomy & Classification Engine
 * Configurable multi-country education structures allowing any country's education
 * systems, levels, terminology, and terms/semesters to be supported dynamically.
 */
export const GLOBAL_EDUCATION_TAXONOMIES: Record<string, CountryEducationTaxonomy> = {
  NG: {
    countryCode: 'NG',
    countryName: 'Nigeria',
    educationSystemName: '6-3-3-4 Universal Basic & Tertiary Education System',
    regulatoryAuthorities: [
      'National Universities Commission (NUC)',
      'National Board for Technical Education (NBTE)',
      'National Commission for Colleges of Education (NCCE)',
      'Federal Ministry of Education (FME)',
      'National Examinations Council (NECO)',
      'West African Examinations Council (WAEC)',
      'Joint Admissions and Matriculation Board (JAMB)'
    ],
    defaultCurrency: 'USD', // Normalized to USD settlement with live Pi conversion in hub
    supportedLevels: [
      {
        id: 'ng-early-years',
        tier: 'early_childhood',
        standardName: 'Early Childhood Education',
        localName: 'Creche, Daycare, Nursery & Kindergarten',
        subGrades: ['Creche (3-18 mos)', 'Daycare / Playgroup', 'Nursery 1', 'Nursery 2', 'Kindergarten / Reception'],
        periodType: 'term',
        periods: ['1st Term (Autumn)', '2nd Term (Winter/Spring)', '3rd Term (Trinity)']
      },
      {
        id: 'ng-primary',
        tier: 'primary',
        standardName: 'Primary Basic Education',
        localName: 'Basic Education (Primary 1 - 6)',
        subGrades: ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'],
        periodType: 'term',
        periods: ['1st Term', '2nd Term', '3rd Term']
      },
      {
        id: 'ng-secondary',
        tier: 'secondary',
        standardName: 'Secondary Education',
        localName: 'Junior & Senior Secondary (JSS 1-3 & SSS 1-3)',
        subGrades: [
          'Junior Secondary 1 (JSS 1)',
          'Junior Secondary 2 (JSS 2)',
          'Junior Secondary 3 (JSS 3 / BECE)',
          'Senior Secondary 1 (SSS 1)',
          'Senior Secondary 2 (SSS 2)',
          'Senior Secondary 3 (SSS 3 / WAEC / NECO)'
        ],
        periodType: 'term',
        periods: ['1st Term', '2nd Term', '3rd Term']
      },
      {
        id: 'ng-tertiary',
        tier: 'tertiary',
        standardName: 'Tertiary & Higher Education',
        localName: 'Polytechnics, Colleges of Education & Universities',
        subGrades: [
          '100 Level (Freshman)',
          '200 Level (Sophomore)',
          '300 Level (Junior)',
          '400 Level (Senior)',
          '500 Level (Finalist Professional)',
          'National Diploma I (ND I)',
          'National Diploma II (ND II)',
          'Higher National Diploma I (HND I)',
          'Higher National Diploma II (HND II)',
          'Postgraduate Diploma (PGD)',
          'Master of Science (M.Sc. / M.Eng)',
          'Doctor of Philosophy (Ph.D.)'
        ],
        periodType: 'semester',
        periods: ['Harmattan / 1st Semester', 'Rain / 2nd Semester']
      },
      {
        id: 'ng-vocational',
        tier: 'technical_vocational',
        standardName: 'Technical & Vocational Education',
        localName: 'Technical Colleges, Trade Schools & Coding Academies',
        subGrades: [
          'Apprenticeship Year 1',
          'Apprenticeship Year 2',
          'NABTEB Modular Certificate',
          'National Technical Certificate (NTC)',
          'Full-Stack Software Engineering Intensive',
          'Cloud & DevOps Engineering Immersion'
        ],
        periodType: 'course_based',
        periods: ['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4', 'Modular Cohort']
      },
      {
        id: 'ng-professional',
        tier: 'professional_continuing',
        standardName: 'Professional & Continuing Education',
        localName: 'Professional Certifications & Executive Development',
        subGrades: [
          'Foundation Level',
          'Intermediate Professional',
          'Executive Masterclass',
          'Advanced Fellow Certification'
        ],
        periodType: 'course_based',
        periods: ['Cohort Jan-Mar', 'Cohort Apr-Jun', 'Cohort Jul-Sep', 'Cohort Oct-Dec']
      }
    ]
  },
  US: {
    countryCode: 'US',
    countryName: 'United States',
    educationSystemName: 'Pre-K to Higher Education & Graduate School',
    regulatoryAuthorities: ['U.S. Department of Education', 'Regional Accreditation Agencies (WASC, SACS, NECHE)'],
    defaultCurrency: 'USD',
    supportedLevels: [
      {
        id: 'us-early-years',
        tier: 'early_childhood',
        standardName: 'Early Childhood',
        localName: 'Infant, Toddler, Pre-K & Kindergarten',
        subGrades: ['Daycare', 'Pre-K3', 'Pre-K4', 'Kindergarten'],
        periodType: 'semester',
        periods: ['Fall Semester', 'Spring Semester', 'Summer Session']
      },
      {
        id: 'us-elementary',
        tier: 'primary',
        standardName: 'Elementary School',
        localName: 'Grades 1 through 5',
        subGrades: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'],
        periodType: 'semester',
        periods: ['Fall Semester', 'Spring Semester']
      },
      {
        id: 'us-secondary',
        tier: 'secondary',
        standardName: 'Middle & High School',
        localName: 'Grades 6 through 12',
        subGrades: ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9 (Freshman)', 'Grade 10 (Sophomore)', 'Grade 11 (Junior)', 'Grade 12 (Senior)'],
        periodType: 'semester',
        periods: ['Fall Semester', 'Spring Semester']
      },
      {
        id: 'us-tertiary',
        tier: 'tertiary',
        standardName: 'Higher Education',
        localName: 'Colleges, Universities & Graduate Schools',
        subGrades: ['Undergraduate (Freshman)', 'Undergraduate (Sophomore)', 'Undergraduate (Junior)', 'Undergraduate (Senior)', 'Master\'s Degree Candidate', 'Ph.D. Candidate'],
        periodType: 'semester',
        periods: ['Fall Semester', 'Spring Semester', 'Summer Term']
      },
      {
        id: 'us-vocational',
        tier: 'technical_vocational',
        standardName: 'Vocational & Technical Training',
        localName: 'Trade Schools, Technical Institutes & Bootcamps',
        subGrades: ['Certification Track 1', 'Apprenticeship Level', 'Accelerated Bootcamp'],
        periodType: 'course_based',
        periods: ['Spring Cohort', 'Summer Cohort', 'Fall Cohort']
      },
      {
        id: 'us-professional',
        tier: 'professional_continuing',
        standardName: 'Professional & Continuing Education',
        localName: 'Executive Education & Professional Development',
        subGrades: ['Executive Certificate', 'Continuing Education Unit (CEU)'],
        periodType: 'course_based',
        periods: ['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4']
      }
    ]
  },
  GB: {
    countryCode: 'GB',
    countryName: 'United Kingdom',
    educationSystemName: 'National Curriculum of England, Wales & Scotland',
    regulatoryAuthorities: ['Department for Education (DfE)', 'Ofsted', 'Office for Students (OfS)', 'QAA'],
    defaultCurrency: 'GBP',
    supportedLevels: [
      {
        id: 'gb-early-years',
        tier: 'early_childhood',
        standardName: 'Early Years Foundation Stage (EYFS)',
        localName: 'Nursery & Reception',
        subGrades: ['Nursery (Age 2-3)', 'Reception (Age 4-5)'],
        periodType: 'term',
        periods: ['Autumn Term', 'Spring Term', 'Summer Term']
      },
      {
        id: 'gb-primary',
        tier: 'primary',
        standardName: 'Primary School (Key Stages 1 & 2)',
        localName: 'Year 1 through Year 6',
        subGrades: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6'],
        periodType: 'term',
        periods: ['Autumn Term', 'Spring Term', 'Summer Term']
      },
      {
        id: 'gb-secondary',
        tier: 'secondary',
        standardName: 'Secondary School & Sixth Form',
        localName: 'Year 7 through Year 13 (GCSE & A-Levels)',
        subGrades: ['Year 7', 'Year 8', 'Year 9', 'Year 10 (GCSE)', 'Year 11 (GCSE)', 'Year 12 (Sixth Form / AS)', 'Year 13 (Sixth Form / A-Level)'],
        periodType: 'term',
        periods: ['Autumn Term', 'Spring Term', 'Summer Term']
      },
      {
        id: 'gb-tertiary',
        tier: 'tertiary',
        standardName: 'Higher Education',
        localName: 'Universities & Higher Education Colleges',
        subGrades: ['Undergraduate Year 1', 'Undergraduate Year 2', 'Undergraduate Year 3 (Honours)', 'Master\'s (Taught/Research)', 'Doctorate (DPhil / PhD)'],
        periodType: 'term',
        periods: ['Michaelmas / Autumn Term', 'Hilary / Spring Term', 'Trinity / Summer Term']
      },
      {
        id: 'gb-vocational',
        tier: 'technical_vocational',
        standardName: 'Vocational Education & Apprenticeships',
        localName: 'BTEC, NVQ & Higher Apprenticeships',
        subGrades: ['Level 2 Certificate', 'Level 3 Diploma', 'Degree Apprenticeship'],
        periodType: 'course_based',
        periods: ['Term 1', 'Term 2', 'Term 3']
      },
      {
        id: 'gb-professional',
        tier: 'professional_continuing',
        standardName: 'Professional & Lifelong Learning',
        localName: 'Chartered Institutes & CPD',
        subGrades: ['Chartered Member Exam', 'Executive CPD Series'],
        periodType: 'course_based',
        periods: ['Block 1', 'Block 2', 'Block 3']
      }
    ]
  },
  GH: {
    countryCode: 'GH',
    countryName: 'Ghana',
    educationSystemName: 'Basic & Tertiary Education System (Ghana)',
    regulatoryAuthorities: ['Ghana Tertiary Education Commission (GTEC)', 'Ministry of Education Ghana', 'WAEC'],
    defaultCurrency: 'GHS',
    supportedLevels: [
      {
        id: 'gh-early-years',
        tier: 'early_childhood',
        standardName: 'Early Childhood',
        localName: 'Creche, Nursery & Kindergarten',
        subGrades: ['Creche', 'Nursery 1-2', 'KG 1-2'],
        periodType: 'term',
        periods: ['1st Term', '2nd Term', '3rd Term']
      },
      {
        id: 'gh-primary',
        tier: 'primary',
        standardName: 'Primary Education',
        localName: 'Basic 1 to Basic 6',
        subGrades: ['Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5', 'Basic 6'],
        periodType: 'term',
        periods: ['1st Term', '2nd Term', '3rd Term']
      },
      {
        id: 'gh-secondary',
        tier: 'secondary',
        standardName: 'Secondary Education',
        localName: 'Junior High (JHS 1-3) & Senior High (SHS 1-3)',
        subGrades: ['JHS 1', 'JHS 2', 'JHS 3 (BECE)', 'SHS 1', 'SHS 2', 'SHS 3 (WASSCE)'],
        periodType: 'semester',
        periods: ['1st Semester', '2nd Semester']
      },
      {
        id: 'gh-tertiary',
        tier: 'tertiary',
        standardName: 'Tertiary Education',
        localName: 'Technical Universities & Universities',
        subGrades: ['Level 100', 'Level 200', 'Level 300', 'Level 400', 'Postgraduate'],
        periodType: 'semester',
        periods: ['1st Semester', '2nd Semester']
      },
      {
        id: 'gh-vocational',
        tier: 'technical_vocational',
        standardName: 'Technical & Vocational (TVET)',
        localName: 'NVTI & Technical Institutes',
        subGrades: ['Grade 1 Certificate', 'Diploma in Technology'],
        periodType: 'course_based',
        periods: ['Modular Cycle 1', 'Modular Cycle 2']
      },
      {
        id: 'gh-professional',
        tier: 'professional_continuing',
        standardName: 'Professional & Continuing Education',
        localName: 'Professional Institutes',
        subGrades: ['Professional Level 1', 'Advanced Level'],
        periodType: 'course_based',
        periods: ['Session A', 'Session B']
      }
    ]
  },
  KE: {
    countryCode: 'KE',
    countryName: 'Kenya',
    educationSystemName: 'Competency-Based Curriculum (CBC) & Universities',
    regulatoryAuthorities: ['Commission for University Education (CUE)', 'Ministry of Education Kenya', 'KNEC'],
    defaultCurrency: 'KES',
    supportedLevels: [
      {
        id: 'ke-early-years',
        tier: 'early_childhood',
        standardName: 'Pre-Primary Education',
        localName: 'PP1 & PP2',
        subGrades: ['Playgroup', 'Pre-Primary 1 (PP1)', 'Pre-Primary 2 (PP2)'],
        periodType: 'term',
        periods: ['Term 1', 'Term 2', 'Term 3']
      },
      {
        id: 'ke-primary',
        tier: 'primary',
        standardName: 'Primary & Junior School (CBC)',
        localName: 'Grade 1 to Grade 6',
        subGrades: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'],
        periodType: 'term',
        periods: ['Term 1', 'Term 2', 'Term 3']
      },
      {
        id: 'ke-secondary',
        tier: 'secondary',
        standardName: 'Junior & Senior School',
        localName: 'Grade 7 to Grade 12',
        subGrades: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
        periodType: 'term',
        periods: ['Term 1', 'Term 2', 'Term 3']
      },
      {
        id: 'ke-tertiary',
        tier: 'tertiary',
        standardName: 'Higher Education',
        localName: 'Universities & National Polytechnics',
        subGrades: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Masters', 'Doctorate'],
        periodType: 'semester',
        periods: ['Semester 1', 'Semester 2']
      },
      {
        id: 'ke-vocational',
        tier: 'technical_vocational',
        standardName: 'Technical & Vocational (TVET)',
        localName: 'TVET Colleges & Vocational Training Centres',
        subGrades: ['Artisan Level', 'Craft Certificate', 'Diploma'],
        periodType: 'course_based',
        periods: ['Cycle 1', 'Cycle 2']
      },
      {
        id: 'ke-professional',
        tier: 'professional_continuing',
        standardName: 'Professional & Continuing Education',
        localName: 'Professional Examination Boards (e.g. KASNEB)',
        subGrades: ['Foundation', 'Intermediate', 'Final'],
        periodType: 'course_based',
        periods: ['Sitting 1', 'Sitting 2']
      }
    ]
  }
};

/**
 * Helper to retrieve taxonomy for country code, falling back safely to Nigeria or Global structure
 */
export function getTaxonomyByCountry(countryCode: string): CountryEducationTaxonomy {
  const code = (countryCode || 'NG').toUpperCase();
  return GLOBAL_EDUCATION_TAXONOMIES[code] || GLOBAL_EDUCATION_TAXONOMIES.NG;
}
