import { InstitutionProfile } from '../types/education';

/**
 * Global Verified Education Institution Registry
 * Verified profiles across Early Childhood, Primary, Secondary, Tertiary, Vocational, and Professional.
 */
export const GLOBAL_EDUCATION_INSTITUTIONS: InstitutionProfile[] = [
  // 1. Bayero University Kano (BUK) - Premier Federal University, Nigeria
  {
    id: 'inst-ng-buk-001',
    name: 'Bayero University Kano (BUK)',
    legalName: 'Bayero University, Kano (Federal Institution)',
    tradingName: 'BUK Portal',
    institutionCode: 'BUK-NG',
    institutionType: 'university',
    supportedTiers: ['tertiary'],
    country: 'Nigeria',
    countryCode: 'NG',
    state: 'Kano',
    city: 'Kano',
    address: 'Gwarzo Road, New Campus, BUK, Kano State, Nigeria',
    contactEmail: 'admissions@buk.edu.ng',
    contactPhone: '+234 64 666021',
    website: 'https://www.buk.edu.ng',
    logoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=240&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    isPublic: true,
    curriculum: ['NUC Core Curriculum and Minimum Academic Standards (CCMAS)'],
    instructionLanguage: ['English'],
    isBoarding: true,
    hasDayOption: true,
    accreditation: {
      authority: 'National Universities Commission (NUC)',
      registrationNumber: 'NUC/UNI/FED/004',
      accreditationStatus: 'accredited',
      validThrough: '2029-12-31',
      verifiedAt: '2025-01-15T09:00:00Z',
      officialNotes: 'Full institutional accreditation across all faculties.'
    },
    verificationStatus: 'VERIFIED',
    verificationDate: '2025-01-15T09:00:00Z',
    administratorName: 'Prof. Sagir Adamu Abbas (Vice-Chancellor)',
    administratorEmail: 'vc@buk.edu.ng',
    acceptedCurrencies: ['USD', 'PI', 'NGN'],
    supportsPiPayment: true,
    supportsInstallments: true,
    activeSessions: [
      {
        session: '2025/2026',
        terms: [
          { id: 'buk-2526-s1', name: 'Harmattan (1st) Semester', startDate: '2025-10-01', endDate: '2026-02-28', isCurrent: true },
          { id: 'buk-2526-s2', name: 'Rain (2nd) Semester', startDate: '2026-03-15', endDate: '2026-07-31', isCurrent: false }
        ]
      }
    ],
    faculties: [
      {
        id: 'fac-eng',
        name: 'Faculty of Engineering',
        departments: [
          {
            id: 'dept-comp-eng',
            name: 'Department of Computer Engineering',
            programmes: [
              {
                id: 'prog-buk-beng-comp',
                name: 'B.Eng Computer Engineering',
                code: 'CPE',
                tier: 'tertiary',
                levelCode: '100L-500L',
                durationYears: 5,
                credentialAwarded: 'B.Eng (Hons)',
                tuitionPerPeriod: 120,
                currency: 'USD',
                admissionRequirements: ['5 O-Level Credits in Math, English, Physics, Chem, Further Math', 'JAMB Cutoff 220+']
              }
            ]
          },
          {
            id: 'dept-elect-eng',
            name: 'Department of Electrical Engineering',
            programmes: [
              {
                id: 'prog-buk-beng-ee',
                name: 'B.Eng Electrical Engineering',
                code: 'EEE',
                tier: 'tertiary',
                levelCode: '100L-500L',
                durationYears: 5,
                credentialAwarded: 'B.Eng (Hons)',
                tuitionPerPeriod: 110,
                currency: 'USD',
                admissionRequirements: ['5 O-Level Credits in Science subjects', 'UTME Score 200+']
              }
            ]
          }
        ]
      },
      {
        id: 'fac-science',
        name: 'Faculty of Computing',
        departments: [
          {
            id: 'dept-cs',
            name: 'Department of Computer Science',
            programmes: [
              {
                id: 'prog-buk-bsc-cs',
                name: 'B.Sc. Computer Science',
                code: 'CSC',
                tier: 'tertiary',
                levelCode: '100L-400L',
                durationYears: 4,
                credentialAwarded: 'B.Sc. (Hons)',
                tuitionPerPeriod: 100,
                currency: 'USD',
                admissionRequirements: ['JAMB UTME 210+', 'O-Level Math & Physics A or B']
              },
              {
                id: 'prog-buk-msc-cs',
                name: 'M.Sc. Computer Science (AI & Cyber Systems)',
                code: 'MSC-CSC',
                tier: 'tertiary',
                levelCode: 'Postgraduate',
                durationYears: 2,
                credentialAwarded: 'M.Sc.',
                tuitionPerPeriod: 220,
                currency: 'USD',
                admissionRequirements: ['B.Sc. First Class or Second Class Upper in Computing']
              }
            ]
          }
        ]
      },
      {
        id: 'fac-med',
        name: 'Faculty of Clinical Sciences',
        departments: [
          {
            id: 'dept-mbbs',
            name: 'Department of Medicine & Surgery',
            programmes: [
              {
                id: 'prog-buk-mbbs',
                name: 'Bachelor of Medicine & Surgery (MBBS)',
                code: 'MBBS',
                tier: 'tertiary',
                levelCode: '100L-600L',
                durationYears: 6,
                credentialAwarded: 'MBBS',
                tuitionPerPeriod: 250,
                currency: 'USD',
                admissionRequirements: ['UTME 280+', 'Post-UTME Screened', 'Straight A/B O-Level Sciences']
              }
            ]
          }
        ]
      }
    ],
    featuredBadge: 'Federal Center of Academic Excellence',
    overviewDescription: 'Bayero University Kano is a leading first-generation university in Sub-Saharan Africa known for groundbreaking academic research in dryland agriculture, engineering, medicine, and Islamic banking.'
  },

  // 2. University of Lagos (UNILAG) - Premier Federal University, Nigeria
  {
    id: 'inst-ng-unilag-002',
    name: 'University of Lagos (UNILAG)',
    legalName: 'University of Lagos (Federal Institution)',
    tradingName: 'UNILAG Nigeria',
    institutionCode: 'UNILAG',
    institutionType: 'university',
    supportedTiers: ['tertiary'],
    country: 'Nigeria',
    countryCode: 'NG',
    state: 'Lagos',
    city: 'Akoka, Yaba, Lagos',
    address: 'University Road, Akoka, Yaba, Lagos State, Nigeria',
    contactEmail: 'admissions@unilag.edu.ng',
    contactPhone: '+234 1 280 2439',
    website: 'https://unilag.edu.ng',
    logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=240&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
    isPublic: true,
    curriculum: ['NUC CCMAS'],
    instructionLanguage: ['English'],
    isBoarding: true,
    hasDayOption: true,
    accreditation: {
      authority: 'National Universities Commission (NUC)',
      registrationNumber: 'NUC/UNI/FED/002',
      accreditationStatus: 'accredited',
      validThrough: '2030-06-30',
      verifiedAt: '2025-01-20T10:00:00Z',
      officialNotes: 'Flagship University of First Choice.'
    },
    verificationStatus: 'VERIFIED',
    verificationDate: '2025-01-20T10:00:00Z',
    administratorName: 'Prof. Folasade Ogunsola (Vice-Chancellor)',
    administratorEmail: 'vc@unilag.edu.ng',
    acceptedCurrencies: ['USD', 'PI', 'NGN'],
    supportsPiPayment: true,
    supportsInstallments: true,
    activeSessions: [
      {
        session: '2025/2026',
        terms: [
          { id: 'unilag-2526-s1', name: '1st Semester', startDate: '2025-10-15', endDate: '2026-03-01', isCurrent: true },
          { id: 'unilag-2526-s2', name: '2nd Semester', startDate: '2026-03-20', endDate: '2026-08-10', isCurrent: false }
        ]
      }
    ],
    faculties: [
      {
        id: 'fac-law',
        name: 'Faculty of Law',
        departments: [
          {
            id: 'dept-law',
            name: 'Department of Public & Private Law',
            programmes: [
              {
                id: 'prog-unilag-llb',
                name: 'Bachelor of Laws (LL.B)',
                code: 'LAW',
                tier: 'tertiary',
                levelCode: '100L-500L',
                durationYears: 5,
                credentialAwarded: 'LL.B (Hons)',
                tuitionPerPeriod: 140,
                currency: 'USD',
                admissionRequirements: ['UTME Score 260+', 'Credit in Literature in English & Math']
              }
            ]
          }
        ]
      },
      {
        id: 'fac-bus-admin',
        name: 'Faculty of Management Sciences',
        departments: [
          {
            id: 'dept-finance',
            name: 'Department of Finance & Accounting',
            programmes: [
              {
                id: 'prog-unilag-bsc-acc',
                name: 'B.Sc. Accounting & Finance',
                code: 'ACC',
                tier: 'tertiary',
                levelCode: '100L-400L',
                durationYears: 4,
                credentialAwarded: 'B.Sc. (Hons)',
                tuitionPerPeriod: 110,
                currency: 'USD',
                admissionRequirements: ['UTME 240+', 'O-Level Math & Economics']
              }
            ]
          }
        ]
      }
    ],
    featuredBadge: 'University of First Choice',
    overviewDescription: 'The University of Lagos is globally acknowledged as a center of enterprise, legal prowess, finance, and engineering innovation.'
  },

  // 3. Yaba College of Technology (YABATECH) - Premier Polytechnic, Nigeria
  {
    id: 'inst-ng-yabatech-003',
    name: 'Yaba College of Technology (YABATECH)',
    legalName: 'Yaba College of Technology',
    tradingName: 'YABATECH Portal',
    institutionCode: 'YABA',
    institutionType: 'polytechnic',
    supportedTiers: ['tertiary'],
    country: 'Nigeria',
    countryCode: 'NG',
    state: 'Lagos',
    city: 'Yaba, Lagos',
    address: 'Herbert Macaulay Way, Yaba, Lagos State, Nigeria',
    contactEmail: 'registry@yabatech.edu.ng',
    contactPhone: '+234 1 894 1234',
    website: 'https://www.yabatech.edu.ng',
    logoUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=240&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    isPublic: true,
    curriculum: ['NBTE Curriculum for Technical & Poly Education'],
    instructionLanguage: ['English'],
    isBoarding: true,
    hasDayOption: true,
    accreditation: {
      authority: 'National Board for Technical Education (NBTE)',
      registrationNumber: 'NBTE/POLY/FED/001',
      accreditationStatus: 'accredited',
      validThrough: '2028-11-30',
      verifiedAt: '2025-01-18T11:00:00Z',
      officialNotes: 'Pioneer higher educational institution in Nigeria.'
    },
    verificationStatus: 'VERIFIED',
    verificationDate: '2025-01-18T11:00:00Z',
    administratorName: 'Dr. Ibraheem Abdul (Rector)',
    administratorEmail: 'rector@yabatech.edu.ng',
    acceptedCurrencies: ['USD', 'PI', 'NGN'],
    supportsPiPayment: true,
    supportsInstallments: true,
    activeSessions: [
      {
        session: '2025/2026',
        terms: [
          { id: 'yaba-2526-s1', name: '1st Semester', startDate: '2025-10-01', endDate: '2026-02-15', isCurrent: true },
          { id: 'yaba-2526-s2', name: '2nd Semester', startDate: '2026-03-01', endDate: '2026-07-20', isCurrent: false }
        ]
      }
    ],
    faculties: [
      {
        id: 'fac-tech',
        name: 'School of Technology',
        departments: [
          {
            id: 'dept-comp-tech',
            name: 'Department of Computer Technology',
            programmes: [
              {
                id: 'prog-yaba-nd-cs',
                name: 'National Diploma in Computer Science (ND I - ND II)',
                code: 'ND-CS',
                tier: 'tertiary',
                levelCode: 'ND I & ND II',
                durationYears: 2,
                credentialAwarded: 'National Diploma (ND)',
                tuitionPerPeriod: 65,
                currency: 'USD',
                admissionRequirements: ['JAMB UTME Polytechnic Cutoff 160+', '5 O-Level Credits']
              },
              {
                id: 'prog-yaba-hnd-cs',
                name: 'Higher National Diploma in Computer Science (HND I - HND II)',
                code: 'HND-CS',
                tier: 'tertiary',
                levelCode: 'HND I & HND II',
                durationYears: 2,
                credentialAwarded: 'Higher National Diploma (HND)',
                tuitionPerPeriod: 80,
                currency: 'USD',
                admissionRequirements: ['ND Lower Credit minimum + 1 Year Industrial Training (IT)']
              }
            ]
          }
        ]
      }
    ],
    featuredBadge: 'Pioneer Polytechnic of Nigeria',
    overviewDescription: 'Established in 1947, Yaba College of Technology is Nigeria\'s premier polytechnic recognized for technical innovation, arts, and industrial design.'
  },

  // 4. King's College Lagos - Premier Secondary School, Nigeria
  {
    id: 'inst-ng-kings-college-004',
    name: "King's College Lagos",
    legalName: "King's College, Lagos (Federal Unity College)",
    tradingName: "King's College Lagos",
    institutionCode: 'KCL-NG',
    institutionType: 'secondary_school',
    supportedTiers: ['secondary'],
    country: 'Nigeria',
    countryCode: 'NG',
    state: 'Lagos',
    city: 'Lagos Island, Lagos',
    address: '3 Catholic Mission Street, Lagos Island, Lagos State, Nigeria',
    contactEmail: 'info@kingscollegelagos.sch.ng',
    contactPhone: '+234 1 263 1111',
    website: 'https://kingscollegelagos.sch.ng',
    logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=240&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    isPublic: true,
    curriculum: ['NERDC (Nigerian National Curriculum)', 'WAEC / NECO / BECE'],
    instructionLanguage: ['English'],
    isBoarding: true,
    hasDayOption: true,
    accreditation: {
      authority: 'Federal Ministry of Education (FME)',
      registrationNumber: 'FME/FED/COL/001',
      accreditationStatus: 'accredited',
      validThrough: '2030-01-01',
      verifiedAt: '2025-01-10T08:30:00Z',
      officialNotes: 'Heritage Federal Unity College established 1909.'
    },
    verificationStatus: 'VERIFIED',
    verificationDate: '2025-01-10T08:30:00Z',
    administratorName: 'Mr. Ali A. (Principal)',
    administratorEmail: 'principal@kingscollegelagos.sch.ng',
    acceptedCurrencies: ['USD', 'PI', 'NGN'],
    supportsPiPayment: true,
    supportsInstallments: true,
    activeSessions: [
      {
        session: '2025/2026',
        terms: [
          { id: 'kc-2526-t1', name: '1st Term (Autumn)', startDate: '2025-09-10', endDate: '2025-12-18', isCurrent: true },
          { id: 'kc-2526-t2', name: '2nd Term (Winter)', startDate: '2026-01-08', endDate: '2026-04-05', isCurrent: false },
          { id: 'kc-2526-t3', name: '3rd Term (Summer)', startDate: '2026-04-25', endDate: '2026-07-22', isCurrent: false }
        ]
      }
    ],
    programmes: [
      {
        id: 'prog-kc-jss',
        name: 'Junior Secondary School (JSS 1 - JSS 3)',
        code: 'JSS',
        tier: 'secondary',
        levelCode: 'JSS 1-3',
        durationYears: 3,
        credentialAwarded: 'Basic Education Certificate (BECE)',
        tuitionPerPeriod: 90,
        currency: 'USD',
        admissionRequirements: ['National Common Entrance Examination (NCEE) Pass', 'Interview Screening']
      },
      {
        id: 'prog-kc-sss',
        name: 'Senior Secondary School (SSS 1 - SSS 3)',
        code: 'SSS',
        tier: 'secondary',
        levelCode: 'SSS 1-3',
        durationYears: 3,
        credentialAwarded: 'West African Senior School Certificate (WASSCE / SSCE)',
        tuitionPerPeriod: 110,
        currency: 'USD',
        admissionRequirements: ['BECE Pass with minimum 6 Merits including Math & English']
      }
    ],
    featuredBadge: 'Heritage Federal Unity College (Est. 1909)',
    overviewDescription: "King's College Lagos is one of the most prestigious secondary schools in West Africa, with alumni including prime ministers, supreme court justices, and industry pioneers."
  },

  // 5. Kano Model Primary & Nursery School - Early Childhood & Primary, Nigeria
  {
    id: 'inst-ng-kano-model-005',
    name: 'Kano Model Primary & Nursery Academy',
    legalName: 'Kano Model International Academy Limited',
    tradingName: 'Kano Model Academy',
    institutionCode: 'KMA-NG',
    institutionType: 'primary_school',
    supportedTiers: ['early_childhood', 'primary'],
    country: 'Nigeria',
    countryCode: 'NG',
    state: 'Kano',
    city: 'Nassarawa GRA, Kano',
    address: '14 Bompai Road, Nassarawa GRA, Kano, Kano State, Nigeria',
    contactEmail: 'admissions@kanomodel.edu.ng',
    contactPhone: '+234 64 912 3456',
    website: 'https://kanomodel.edu.ng',
    logoUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=240&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1200&q=80',
    isPublic: false,
    curriculum: ['Early Years Foundation Stage (EYFS)', 'NERDC Universal Basic Primary', 'Montessori'],
    instructionLanguage: ['English', 'Hausa (Cultural)'],
    isBoarding: false,
    hasDayOption: true,
    accreditation: {
      authority: 'Kano State Ministry of Education & SUBEB',
      registrationNumber: 'KNS/ED/PRI/2012/88',
      accreditationStatus: 'accredited',
      validThrough: '2028-09-01',
      verifiedAt: '2025-01-05T14:00:00Z',
      officialNotes: 'Certified Model Early Childhood and Primary Center.'
    },
    verificationStatus: 'VERIFIED',
    verificationDate: '2025-01-05T14:00:00Z',
    administratorName: 'Hajiya Maryam S. (Head of School)',
    administratorEmail: 'headmistress@kanomodel.edu.ng',
    acceptedCurrencies: ['USD', 'PI', 'NGN'],
    supportsPiPayment: true,
    supportsInstallments: true,
    activeSessions: [
      {
        session: '2025/2026',
        terms: [
          { id: 'kma-2526-t1', name: '1st Term', startDate: '2025-09-08', endDate: '2025-12-15', isCurrent: true },
          { id: 'kma-2526-t2', name: '2nd Term', startDate: '2026-01-10', endDate: '2026-04-03', isCurrent: false },
          { id: 'kma-2526-t3', name: '3rd Term', startDate: '2026-04-20', endDate: '2026-07-18', isCurrent: false }
        ]
      }
    ],
    programmes: [
      {
        id: 'prog-kma-eyfs',
        name: 'Early Years & Kindergarten (Creche, Nursery 1-2, KG)',
        code: 'EYFS',
        tier: 'early_childhood',
        levelCode: 'Creche - KG',
        durationYears: 3,
        credentialAwarded: 'Early Childhood Milestone Certificate',
        tuitionPerPeriod: 60,
        currency: 'USD',
        admissionRequirements: ['Birth Certificate', 'Immunization Records', 'Parent Consultation']
      },
      {
        id: 'prog-kma-pri',
        name: 'Primary Basic Education (Primary 1 - 6)',
        code: 'PRI',
        tier: 'primary',
        levelCode: 'Primary 1-6',
        durationYears: 6,
        credentialAwarded: 'First School Leaving Certificate (FSLC)',
        tuitionPerPeriod: 75,
        currency: 'USD',
        admissionRequirements: ['Kindergarten Graduation Certificate or Placement Diagnostic Assessment']
      }
    ],
    featuredBadge: 'Verified Early Childhood & Primary Provider',
    overviewDescription: 'Dedicated to nurturing early-stage intellect, character, and curiosity through an integrated international-Montessori curriculum in northern Nigeria.'
  },

  // 6. Decagon Tech & Vocational Academy - Technical & Vocational, Nigeria
  {
    id: 'inst-ng-decagon-006',
    name: 'Decagon Software & AI Institute',
    legalName: 'Decagon Institute of Advanced Technology Limited',
    tradingName: 'Decagon Institute',
    institutionCode: 'DEC-TECH',
    institutionType: 'vocational_institute',
    supportedTiers: ['technical_vocational', 'professional_continuing'],
    country: 'Nigeria',
    countryCode: 'NG',
    state: 'Lagos',
    city: 'Lekki Phase 1, Lagos',
    address: 'Plot 2, Admiralty Way, Lekki Phase 1, Lagos State, Nigeria',
    contactEmail: 'admissions@decagon.institute',
    contactPhone: '+234 1 700 9900',
    website: 'https://decagon.institute',
    logoUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=240&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    isPublic: false,
    curriculum: ['Production Software Engineering', 'Cloud & Distributed Systems', 'AI & Data Engineering'],
    instructionLanguage: ['English'],
    isBoarding: true,
    hasDayOption: true,
    accreditation: {
      authority: 'National Board for Technical Education (NBTE) & ITF',
      registrationNumber: 'ITF/VOC/TECH/2020/094',
      accreditationStatus: 'accredited',
      validThrough: '2029-05-01',
      verifiedAt: '2025-01-22T15:00:00Z',
      officialNotes: 'Accredited high-impact tech apprenticeship and vocational engineering institute.'
    },
    verificationStatus: 'VERIFIED',
    verificationDate: '2025-01-22T15:00:00Z',
    administratorName: 'Engr. Chika Nwobi (Executive Director)',
    administratorEmail: 'director@decagon.institute',
    acceptedCurrencies: ['USD', 'PI'],
    supportsPiPayment: true,
    supportsInstallments: true,
    activeSessions: [
      {
        session: '2025/2026',
        terms: [
          { id: 'dec-c1', name: 'Q1 Spring Cohort', startDate: '2025-02-01', endDate: '2025-06-30', isCurrent: false },
          { id: 'dec-c2', name: 'Q3 Fall Cohort', startDate: '2025-08-01', endDate: '2025-12-31', isCurrent: true }
        ]
      }
    ],
    programmes: [
      {
        id: 'prog-dec-se',
        name: 'Full-Stack Software Engineering Intensive (6 Months)',
        code: 'FS-SE',
        tier: 'technical_vocational',
        levelCode: 'Vocational Modular',
        durationYears: 0.5,
        credentialAwarded: 'Professional Diploma in Software Engineering',
        tuitionPerPeriod: 350,
        currency: 'USD',
        admissionRequirements: ['Aptitude Exam in Logic & Math', 'Algorithmic Coding Challenge', 'Live Interview']
      },
      {
        id: 'prog-dec-ai',
        name: 'Applied Artificial Intelligence & Machine Learning Track',
        code: 'AI-ML',
        tier: 'technical_vocational',
        levelCode: 'Vocational Advanced',
        durationYears: 0.5,
        credentialAwarded: 'Certified AI Systems Practitioner',
        tuitionPerPeriod: 400,
        currency: 'USD',
        admissionRequirements: ['Python proficiency test', 'Linear Algebra & Statistics Diagnostic']
      }
    ],
    featuredBadge: 'Accredited Tech Accelerator & Vocational Institute',
    overviewDescription: 'Transforms promising talent into elite world-class software engineers and tech leaders through intensive hands-on production engineering.'
  },

  // 7. University of Oxford - International Flagship (United Kingdom)
  {
    id: 'inst-gb-oxford-007',
    name: 'University of Oxford',
    legalName: 'The Chancellor, Masters and Scholars of the University of Oxford',
    tradingName: 'Oxford University',
    institutionCode: 'OXF-UK',
    institutionType: 'university',
    supportedTiers: ['tertiary', 'professional_continuing'],
    country: 'United Kingdom',
    countryCode: 'GB',
    state: 'Oxfordshire',
    city: 'Oxford',
    address: 'University Offices, Wellington Square, Oxford, OX1 2JD, United Kingdom',
    contactEmail: 'admissions@ox.ac.uk',
    contactPhone: '+44 1865 270000',
    website: 'https://www.ox.ac.uk',
    logoUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=240&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    isPublic: true,
    curriculum: ['UK Quality Assurance Agency (QAA) Framework'],
    instructionLanguage: ['English'],
    isBoarding: true,
    hasDayOption: false,
    accreditation: {
      authority: 'Office for Students (OfS) & QAA United Kingdom',
      registrationNumber: 'UKPRN-10007774',
      accreditationStatus: 'accredited',
      validThrough: '2035-12-31',
      verifiedAt: '2025-01-01T00:00:00Z',
      officialNotes: 'Royal Charter certified international collegiate research university.'
    },
    verificationStatus: 'VERIFIED',
    verificationDate: '2025-01-01T00:00:00Z',
    administratorName: 'Prof. Irene Tracey (Vice-Chancellor)',
    administratorEmail: 'vc.office@ox.ac.uk',
    acceptedCurrencies: ['GBP', 'USD', 'PI'],
    supportsPiPayment: true,
    supportsInstallments: true,
    activeSessions: [
      {
        session: '2025/2026',
        terms: [
          { id: 'ox-2526-t1', name: 'Michaelmas Term', startDate: '2025-10-12', endDate: '2025-12-06', isCurrent: true },
          { id: 'ox-2526-t2', name: 'Hilary Term', startDate: '2026-01-18', endDate: '2026-03-14', isCurrent: false },
          { id: 'ox-2526-t3', name: 'Trinity Term', startDate: '2026-04-26', endDate: '2026-06-20', isCurrent: false }
        ]
      }
    ],
    faculties: [
      {
        id: 'fac-ox-mpls',
        name: 'Mathematical, Physical and Life Sciences Division',
        departments: [
          {
            id: 'dept-ox-cs',
            name: 'Department of Computer Science',
            programmes: [
              {
                id: 'prog-ox-ba-cs',
                name: 'BA in Computer Science',
                code: 'OX-CS',
                tier: 'tertiary',
                levelCode: 'Undergraduate',
                durationYears: 3,
                credentialAwarded: 'BA (Hons)',
                tuitionPerPeriod: 980,
                currency: 'USD',
                admissionRequirements: ['A*AA at A-Level with A* in Math', 'MAT (Mathematics Admissions Test)', 'Oxford Interview']
              }
            ]
          }
        ]
      }
    ],
    featuredBadge: 'Global Collegiate Research University',
    overviewDescription: 'The oldest university in the English-speaking world, offering collegiate tutorial education and groundbreaking scholarly research.'
  },

  // 8. University of Ghana (Legon) - Premier University, Ghana
  {
    id: 'inst-gh-legon-008',
    name: 'University of Ghana (Legon)',
    legalName: 'University of Ghana',
    tradingName: 'UG Legon Portal',
    institutionCode: 'UG-GH',
    institutionType: 'university',
    supportedTiers: ['tertiary'],
    country: 'Ghana',
    countryCode: 'GH',
    state: 'Greater Accra',
    city: 'Legon, Accra',
    address: 'University of Ghana, Legon Boundary, Accra, Ghana',
    contactEmail: 'admissions@ug.edu.gh',
    contactPhone: '+233 30 221 3820',
    website: 'https://www.ug.edu.gh',
    logoUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=240&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
    isPublic: true,
    curriculum: ['Ghana Tertiary Education Commission (GTEC) Standards'],
    instructionLanguage: ['English'],
    isBoarding: true,
    hasDayOption: true,
    accreditation: {
      authority: 'Ghana Tertiary Education Commission (GTEC)',
      registrationNumber: 'GTEC/UNI/PUB/001',
      accreditationStatus: 'accredited',
      validThrough: '2030-01-01',
      verifiedAt: '2025-01-12T09:00:00Z',
      officialNotes: 'Accredited premier university of Ghana.'
    },
    verificationStatus: 'VERIFIED',
    verificationDate: '2025-01-12T09:00:00Z',
    administratorName: 'Prof. Nana Aba Appiah Amfo (Vice-Chancellor)',
    administratorEmail: 'vc@ug.edu.gh',
    acceptedCurrencies: ['GHS', 'USD', 'PI'],
    supportsPiPayment: true,
    supportsInstallments: true,
    activeSessions: [
      {
        session: '2025/2026',
        terms: [
          { id: 'ug-2526-s1', name: '1st Semester', startDate: '2025-09-01', endDate: '2025-12-20', isCurrent: true },
          { id: 'ug-2526-s2', name: '2nd Semester', startDate: '2026-02-01', endDate: '2026-06-15', isCurrent: false }
        ]
      }
    ],
    faculties: [
      {
        id: 'fac-ug-cbas',
        name: 'College of Basic and Applied Sciences',
        departments: [
          {
            id: 'dept-ug-cs',
            name: 'Department of Computer Science',
            programmes: [
              {
                id: 'prog-ug-bsc-cs',
                name: 'B.Sc. Computer Science',
                code: 'UG-CS',
                tier: 'tertiary',
                levelCode: 'Level 100-400',
                durationYears: 4,
                credentialAwarded: 'B.Sc. (Hons)',
                tuitionPerPeriod: 130,
                currency: 'USD',
                admissionRequirements: ['WASSCE Aggregate 08-12 with A1/B2 in Core Math & Elective Math']
              }
            ]
          }
        ]
      }
    ],
    featuredBadge: 'Premier University of Ghana',
    overviewDescription: 'The oldest and largest of Ghana\'s public universities, celebrated for its historic Legon campus and high academic standards.'
  },
  {
    id: 'inst-uon-ke',
    name: 'University of Nairobi',
    legalName: 'The Council of the University of Nairobi',
    institutionCode: 'UON-KE-001',
    institutionType: 'university',
    supportedTiers: ['tertiary', 'professional_continuing'],
    country: 'Kenya',
    countryCode: 'KE',
    state: 'Nairobi',
    city: 'Nairobi',
    address: 'University Way, Nairobi, Kenya',
    contactEmail: 'admissions@uonbi.ac.ke',
    contactPhone: '+254 20 491 0000',
    website: 'https://www.uonbi.ac.ke',
    logoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=256&q=80',
    isPublic: true,
    curriculum: ['Commission for University Education (CUE)', 'East African Standard'],
    instructionLanguage: ['English', 'Swahili'],
    isBoarding: true,
    hasDayOption: true,
    accreditation: {
      authority: 'Commission for University Education Kenya (CUE)',
      registrationNumber: 'CUE/UNIV/PUB/001',
      accreditationStatus: 'accredited',
      validThrough: '2029-12-31',
      verifiedAt: '2025-01-20T10:00:00Z',
      officialNotes: 'Flagship chartered public research university in Kenya.'
    },
    verificationStatus: 'VERIFIED',
    verificationDate: '2025-01-20T10:00:00Z',
    administratorName: 'Prof. Stephen Kiama (Vice-Chancellor)',
    administratorEmail: 'vc@uonbi.ac.ke',
    acceptedCurrencies: ['USD', 'PI', 'KES'],
    supportsPiPayment: true,
    supportsInstallments: true,
    activeSessions: [
      {
        session: '2025/2026',
        terms: [
          { id: 'uon-2526-s1', name: 'Semester 1', startDate: '2025-09-01', endDate: '2026-01-25', isCurrent: true },
          { id: 'uon-2526-s2', name: 'Semester 2', startDate: '2026-02-15', endDate: '2026-06-30', isCurrent: false }
        ]
      }
    ],
    faculties: [
      {
        id: 'fac-uon-sci',
        name: 'Faculty of Science and Technology',
        departments: [
          {
            id: 'dept-uon-cs',
            name: 'Department of Computing and Informatics',
            programmes: [
              {
                id: 'prog-uon-cs',
                name: 'B.Sc. Computer Science',
                code: 'UON-CS',
                tier: 'tertiary',
                levelCode: 'Year 1-4',
                durationYears: 4,
                credentialAwarded: 'B.Sc. Computer Science',
                tuitionPerPeriod: 140,
                currency: 'USD',
                admissionRequirements: ['KCSE Mean Grade B+ with Mathematics & Physics B+']
              }
            ]
          }
        ]
      }
    ],
    featuredBadge: 'Pioneer University of East Africa',
    overviewDescription: 'Collegiate research university based in Nairobi, recognized as one of the top higher education institutions in Africa.'
  },
  {
    id: 'inst-uct-za',
    name: 'University of Cape Town',
    legalName: 'University of Cape Town (UCT)',
    institutionCode: 'UCT-ZA-001',
    institutionType: 'university',
    supportedTiers: ['tertiary', 'professional_continuing'],
    country: 'South Africa',
    countryCode: 'ZA',
    state: 'Western Cape',
    city: 'Cape Town',
    address: 'Rondebosch, Cape Town, 7700, South Africa',
    contactEmail: 'admissions@uct.ac.za',
    contactPhone: '+27 21 650 9111',
    website: 'https://www.uct.ac.za',
    logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=256&q=80',
    isPublic: true,
    curriculum: ['South African Higher Education (CHE)', 'SAQA Framework'],
    instructionLanguage: ['English'],
    isBoarding: true,
    hasDayOption: true,
    accreditation: {
      authority: 'Council on Higher Education South Africa (CHE)',
      registrationNumber: 'CHE/HEQC/ZA/001',
      accreditationStatus: 'accredited',
      validThrough: '2030-12-31',
      verifiedAt: '2025-01-15T09:00:00Z',
      officialNotes: 'Highest ranked university in Africa.'
    },
    verificationStatus: 'VERIFIED',
    verificationDate: '2025-01-15T09:00:00Z',
    administratorName: 'Prof. Mosa Moshabela (Vice-Chancellor)',
    administratorEmail: 'vc@uct.ac.za',
    acceptedCurrencies: ['USD', 'PI', 'ZAR'],
    supportsPiPayment: true,
    supportsInstallments: true,
    activeSessions: [
      {
        session: '2025',
        terms: [
          { id: 'uct-25-sem1', name: 'First Semester', startDate: '2025-02-10', endDate: '2025-06-25', isCurrent: true },
          { id: 'uct-25-sem2', name: 'Second Semester', startDate: '2025-07-20', endDate: '2025-11-30', isCurrent: false }
        ]
      }
    ],
    faculties: [
      {
        id: 'fac-uct-sci',
        name: 'Faculty of Science',
        departments: [
          {
            id: 'dept-uct-cs',
            name: 'Department of Computer Science',
            programmes: [
              {
                id: 'prog-uct-cs',
                name: 'B.Sc. in Computer Science & Data Analytics',
                code: 'UCT-CS',
                tier: 'tertiary',
                levelCode: '1st - 3rd Year',
                durationYears: 3,
                credentialAwarded: 'B.Sc. (UCT)',
                tuitionPerPeriod: 160,
                currency: 'USD',
                admissionRequirements: ['NSC with Bachelor endorsement and 70%+ in Mathematics']
              }
            ]
          }
        ]
      }
    ],
    featuredBadge: '#1 Ranked University in Africa',
    overviewDescription: 'South Africa\'s oldest university and premier public research institution, nestled on the slopes of Table Mountain.'
  },
  {
    id: 'inst-harvard-us',
    name: 'Harvard University',
    legalName: 'The President and Fellows of Harvard College',
    institutionCode: 'HARV-US-001',
    institutionType: 'university',
    supportedTiers: ['tertiary', 'professional_continuing'],
    country: 'United States',
    countryCode: 'US',
    state: 'Massachusetts',
    city: 'Cambridge',
    address: 'Massachusetts Hall, Cambridge, MA 02138, USA',
    contactEmail: 'admissions@harvard.edu',
    contactPhone: '+1 617 495 1000',
    website: 'https://www.harvard.edu',
    logoUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=256&q=80',
    isPublic: false,
    curriculum: ['New England Commission of Higher Education (NECHE)', 'US Higher Ed Standards'],
    instructionLanguage: ['English'],
    isBoarding: true,
    hasDayOption: true,
    accreditation: {
      authority: 'New England Commission of Higher Education (NECHE)',
      registrationNumber: 'NECHE-US-HARV-001',
      accreditationStatus: 'accredited',
      validThrough: '2031-10-15',
      verifiedAt: '2025-01-10T12:00:00Z',
      officialNotes: 'Oldest institution of higher learning in the United States, founded 1636.'
    },
    verificationStatus: 'VERIFIED',
    verificationDate: '2025-01-10T12:00:00Z',
    administratorName: 'Alan M. Garber (President)',
    administratorEmail: 'president@harvard.edu',
    acceptedCurrencies: ['USD', 'PI'],
    supportsPiPayment: true,
    supportsInstallments: true,
    activeSessions: [
      {
        session: '2025/2026',
        terms: [
          { id: 'harv-2526-fall', name: 'Fall Semester', startDate: '2025-09-01', endDate: '2025-12-20', isCurrent: true },
          { id: 'harv-2526-spring', name: 'Spring Semester', startDate: '2026-01-25', endDate: '2026-05-20', isCurrent: false }
        ]
      }
    ],
    faculties: [
      {
        id: 'fac-harv-seas',
        name: 'John A. Paulson School of Engineering and Applied Sciences',
        departments: [
          {
            id: 'dept-harv-cs',
            name: 'Computer Science Area',
            programmes: [
              {
                id: 'prog-harv-ab-cs',
                name: 'A.B. in Computer Science',
                code: 'HARV-AB-CS',
                tier: 'tertiary',
                levelCode: 'Undergraduate',
                durationYears: 4,
                credentialAwarded: 'Artium Baccalaureus (A.B.)',
                tuitionPerPeriod: 250,
                currency: 'USD',
                admissionRequirements: ['Harvard College Holistic Admissions Review']
              }
            ]
          }
        ]
      }
    ],
    featuredBadge: 'Ivy League Premier Institution',
    overviewDescription: 'Global leader in higher education and research, committed to excellence in teaching, learning, and developing leaders who make a difference.'
  },
  {
    id: 'inst-uoft-ca',
    name: 'University of Toronto',
    legalName: 'The Governing Council of the University of Toronto',
    institutionCode: 'UFT-CA-001',
    institutionType: 'university',
    supportedTiers: ['tertiary', 'professional_continuing'],
    country: 'Canada',
    countryCode: 'CA',
    state: 'Ontario',
    city: 'Toronto',
    address: '27 King\'s College Circle, Toronto, ON M5S 1A1, Canada',
    contactEmail: 'admissions@utoronto.ca',
    contactPhone: '+1 416 978 2011',
    website: 'https://www.utoronto.ca',
    logoUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=256&q=80',
    isPublic: true,
    curriculum: ['Ontario Universities Council on Quality Assurance', 'Canadian Degree Standards'],
    instructionLanguage: ['English'],
    isBoarding: true,
    hasDayOption: true,
    accreditation: {
      authority: 'Ontario Universities Council on Quality Assurance',
      registrationNumber: 'OUCQA-CA-001',
      accreditationStatus: 'accredited',
      validThrough: '2030-06-30',
      verifiedAt: '2025-01-12T10:00:00Z',
      officialNotes: 'Top Canadian public research university.'
    },
    verificationStatus: 'VERIFIED',
    verificationDate: '2025-01-12T10:00:00Z',
    administratorName: 'Meric Gertler (President)',
    administratorEmail: 'president@utoronto.ca',
    acceptedCurrencies: ['USD', 'PI', 'CAD'],
    supportsPiPayment: true,
    supportsInstallments: true,
    activeSessions: [
      {
        session: '2025/2026',
        terms: [
          { id: 'uoft-2526-fall', name: 'Fall Term', startDate: '2025-09-08', endDate: '2025-12-22', isCurrent: true },
          { id: 'uoft-2526-winter', name: 'Winter Term', startDate: '2026-01-10', endDate: '2026-04-30', isCurrent: false }
        ]
      }
    ],
    faculties: [
      {
        id: 'fac-uoft-artsci',
        name: 'Faculty of Arts & Science',
        departments: [
          {
            id: 'dept-uoft-cs',
            name: 'Department of Computer Science',
            programmes: [
              {
                id: 'prog-uoft-hbsc-cs',
                name: 'Honours B.Sc. in Computer Science',
                code: 'UOFT-HBSC-CS',
                tier: 'tertiary',
                levelCode: '1st - 4th Year',
                durationYears: 4,
                credentialAwarded: 'Honours B.Sc.',
                tuitionPerPeriod: 180,
                currency: 'USD',
                admissionRequirements: ['Ontario Secondary School Diploma with Grade 12 Calculus']
              }
            ]
          }
        ]
      }
    ],
    featuredBadge: '#1 Ranked University in Canada',
    overviewDescription: 'Canada\'s leading institution of learning, discovery and knowledge creation, home to one of the world\'s strongest research faculties.'
  },
  {
    id: 'inst-cairo-eg',
    name: 'Cairo University',
    legalName: 'Cairo University Arab Republic of Egypt',
    institutionCode: 'CU-EG-001',
    institutionType: 'university',
    supportedTiers: ['tertiary', 'professional_continuing'],
    country: 'Egypt',
    countryCode: 'EG',
    state: 'Giza',
    city: 'Giza',
    address: 'Gamaa Street, Giza, 12613, Egypt',
    contactEmail: 'info@cu.edu.eg',
    contactPhone: '+20 2 3567 6105',
    website: 'https://cu.edu.eg',
    logoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=256&q=80',
    isPublic: true,
    curriculum: ['Supreme Council of Universities Egypt (SCU)', 'National Authority (NAQAAE)'],
    instructionLanguage: ['Arabic', 'English'],
    isBoarding: true,
    hasDayOption: true,
    accreditation: {
      authority: 'National Authority for Quality Assurance and Accreditation of Education (NAQAAE)',
      registrationNumber: 'NAQAAE-EG-001',
      accreditationStatus: 'accredited',
      validThrough: '2029-08-30',
      verifiedAt: '2025-01-14T08:00:00Z',
      officialNotes: 'Egypt\'s premier public university founded in 1908.'
    },
    verificationStatus: 'VERIFIED',
    verificationDate: '2025-01-14T08:00:00Z',
    administratorName: 'Prof. Mohamed Sami Abdel Sadek (President)',
    administratorEmail: 'president@cu.edu.eg',
    acceptedCurrencies: ['USD', 'PI', 'EGP'],
    supportsPiPayment: true,
    supportsInstallments: true,
    activeSessions: [
      {
        session: '2025/2026',
        terms: [
          { id: 'cu-2526-s1', name: 'First Term', startDate: '2025-10-01', endDate: '2026-01-20', isCurrent: true },
          { id: 'cu-2526-s2', name: 'Second Term', startDate: '2026-02-10', endDate: '2026-06-15', isCurrent: false }
        ]
      }
    ],
    faculties: [
      {
        id: 'fac-cu-fci',
        name: 'Faculty of Computers and Artificial Intelligence',
        departments: [
          {
            id: 'dept-cu-cs',
            name: 'Department of Computer Science',
            programmes: [
              {
                id: 'prog-cu-bsc-cs',
                name: 'B.Sc. in Computer Science and AI',
                code: 'CU-CS-AI',
                tier: 'tertiary',
                levelCode: 'Level 1-4',
                durationYears: 4,
                credentialAwarded: 'B.Sc. (Cairo Univ)',
                tuitionPerPeriod: 110,
                currency: 'USD',
                admissionRequirements: ['Thanaweya Amma Scientific Division Cutoff']
              }
            ]
          }
        ]
      }
    ],
    featuredBadge: 'Historic Gateway of Knowledge',
    overviewDescription: 'Egypt\'s premier public university, nurturing world leaders and Nobel laureates across the Middle East and North Africa.'
  },
  {
    id: 'inst-ur-rw',
    name: 'University of Rwanda',
    legalName: 'University of Rwanda (UR)',
    institutionCode: 'UR-RW-001',
    institutionType: 'university',
    supportedTiers: ['tertiary', 'technical_vocational'],
    country: 'Rwanda',
    countryCode: 'RW',
    state: 'Kigali',
    city: 'Kigali',
    address: 'KK 737 Street, Gikondo, Kigali, Rwanda',
    contactEmail: 'admissions@ur.ac.rw',
    contactPhone: '+250 788 304 316',
    website: 'https://ur.ac.rw',
    logoUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=256&q=80',
    isPublic: true,
    curriculum: ['Higher Education Council of Rwanda (HEC)', 'East African Standards'],
    instructionLanguage: ['English'],
    isBoarding: true,
    hasDayOption: true,
    accreditation: {
      authority: 'Higher Education Council Rwanda (HEC)',
      registrationNumber: 'HEC-RW-PUB-001',
      accreditationStatus: 'accredited',
      validThrough: '2029-12-31',
      verifiedAt: '2025-01-16T11:30:00Z',
      officialNotes: 'National multi-campus university of Rwanda.'
    },
    verificationStatus: 'VERIFIED',
    verificationDate: '2025-01-16T11:30:00Z',
    administratorName: 'Dr. Didas Muganga Kayihura (Vice-Chancellor)',
    administratorEmail: 'vc@ur.ac.rw',
    acceptedCurrencies: ['USD', 'PI', 'RWF'],
    supportsPiPayment: true,
    supportsInstallments: true,
    activeSessions: [
      {
        session: '2025/2026',
        terms: [
          { id: 'ur-2526-s1', name: 'Trimester 1', startDate: '2025-09-15', endDate: '2025-12-20', isCurrent: true },
          { id: 'ur-2526-s2', name: 'Trimester 2', startDate: '2026-01-10', endDate: '2026-04-15', isCurrent: false }
        ]
      }
    ],
    faculties: [
      {
        id: 'fac-ur-cst',
        name: 'College of Science and Technology (CST)',
        departments: [
          {
            id: 'dept-ur-ict',
            name: 'School of ICT',
            programmes: [
              {
                id: 'prog-ur-bit',
                name: 'B.Sc. in Information Technology & Software Engineering',
                code: 'UR-BIT',
                tier: 'tertiary',
                levelCode: 'Year 1 - Year 4',
                durationYears: 4,
                credentialAwarded: 'B.Sc. Honours',
                tuitionPerPeriod: 95,
                currency: 'USD',
                admissionRequirements: ['Advanced Level Certificate with 2 Principal Passes in Math & Physics']
              }
            ]
          }
        ]
      }
    ],
    featuredBadge: 'Rwanda Innovation Hub',
    overviewDescription: 'Rwanda\'s sole public university, leading East Africa in digital transformation, green technology, and applied research.'
  },
  {
    id: 'inst-mak-ug',
    name: 'Makerere University',
    legalName: 'Makerere University Kampala',
    institutionCode: 'MAK-UG-001',
    institutionType: 'university',
    supportedTiers: ['tertiary', 'professional_continuing'],
    country: 'Uganda',
    countryCode: 'UG',
    state: 'Kampala',
    city: 'Kampala',
    address: 'University Road, Makerere, Kampala, Uganda',
    contactEmail: 'admissions@mak.ac.ug',
    contactPhone: '+256 414 532 634',
    website: 'https://mak.ac.ug',
    logoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=256&q=80',
    isPublic: true,
    curriculum: ['National Council for Higher Education Uganda (NCHE)'],
    instructionLanguage: ['English'],
    isBoarding: true,
    hasDayOption: true,
    accreditation: {
      authority: 'National Council for Higher Education Uganda (NCHE)',
      registrationNumber: 'NCHE-UG-PUB-001',
      accreditationStatus: 'accredited',
      validThrough: '2029-11-30',
      verifiedAt: '2025-01-17T09:30:00Z',
      officialNotes: 'One of the oldest and most prestigious universities in Africa, founded 1922.'
    },
    verificationStatus: 'VERIFIED',
    verificationDate: '2025-01-17T09:30:00Z',
    administratorName: 'Prof. Barnabas Nawangwe (Vice-Chancellor)',
    administratorEmail: 'vc@mak.ac.ug',
    acceptedCurrencies: ['USD', 'PI', 'UGX'],
    supportsPiPayment: true,
    supportsInstallments: true,
    activeSessions: [
      {
        session: '2025/2026',
        terms: [
          { id: 'mak-2526-s1', name: 'Semester 1', startDate: '2025-08-25', endDate: '2025-12-18', isCurrent: true },
          { id: 'mak-2526-s2', name: 'Semester 2', startDate: '2026-01-20', endDate: '2026-05-30', isCurrent: false }
        ]
      }
    ],
    faculties: [
      {
        id: 'fac-mak-cocis',
        name: 'College of Computing and Information Sciences (CoCIS)',
        departments: [
          {
            id: 'dept-mak-cs',
            name: 'Department of Computer Science',
            programmes: [
              {
                id: 'prog-mak-csc',
                name: 'B.Sc. in Computer Science',
                code: 'MAK-CSC',
                tier: 'tertiary',
                levelCode: 'Year 1-3',
                durationYears: 3,
                credentialAwarded: 'B.Sc. (Makerere)',
                tuitionPerPeriod: 120,
                currency: 'USD',
                admissionRequirements: ['UACE with 2 Principal Passes in Mathematics & Physics/Economics']
              }
            ]
          }
        ]
      }
    ],
    featuredBadge: 'The Pride of East Africa',
    overviewDescription: 'Uganda\'s largest and oldest collegiate university, celebrated internationally for its medical, scientific, and humanities breakthroughs.'
  },
  {
    id: 'inst-udsm-tz',
    name: 'University of Dar es Salaam',
    legalName: 'The Council of the University of Dar es Salaam',
    institutionCode: 'UDSM-TZ-001',
    institutionType: 'university',
    supportedTiers: ['tertiary', 'professional_continuing'],
    country: 'Tanzania',
    countryCode: 'TZ',
    state: 'Dar es Salaam',
    city: 'Dar es Salaam',
    address: 'Mwalimu J.K. Nyerere Mlimani Campus, Dar es Salaam, Tanzania',
    contactEmail: 'admissions@udsm.ac.tz',
    contactPhone: '+255 22 241 0500',
    website: 'https://www.udsm.ac.tz',
    logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=256&q=80',
    isPublic: true,
    curriculum: ['Tanzania Commission for Universities (TCU)'],
    instructionLanguage: ['English', 'Swahili'],
    isBoarding: true,
    hasDayOption: true,
    accreditation: {
      authority: 'Tanzania Commission for Universities (TCU)',
      registrationNumber: 'TCU-TZ-PUB-001',
      accreditationStatus: 'accredited',
      validThrough: '2029-10-31',
      verifiedAt: '2025-01-18T10:00:00Z',
      officialNotes: 'Oldest public university in Tanzania, established 1961.'
    },
    verificationStatus: 'VERIFIED',
    verificationDate: '2025-01-18T10:00:00Z',
    administratorName: 'Prof. William A.L. Anangisye (Vice-Chancellor)',
    administratorEmail: 'vc@udsm.ac.tz',
    acceptedCurrencies: ['USD', 'PI', 'TZS'],
    supportsPiPayment: true,
    supportsInstallments: true,
    activeSessions: [
      {
        session: '2025/2026',
        terms: [
          { id: 'udsm-2526-s1', name: 'Semester 1', startDate: '2025-11-01', endDate: '2026-03-15', isCurrent: true },
          { id: 'udsm-2526-s2', name: 'Semester 2', startDate: '2026-04-01', endDate: '2026-07-30', isCurrent: false }
        ]
      }
    ],
    faculties: [
      {
        id: 'fac-udsm-coict',
        name: 'College of Information and Communication Technologies (CoICT)',
        departments: [
          {
            id: 'dept-udsm-cse',
            name: 'Computer Science and Engineering Department',
            programmes: [
              {
                id: 'prog-udsm-bsc-cs',
                name: 'B.Sc. in Computer Science',
                code: 'UDSM-CS',
                tier: 'tertiary',
                levelCode: 'First - Third Year',
                durationYears: 3,
                credentialAwarded: 'B.Sc. (UDSM)',
                tuitionPerPeriod: 105,
                currency: 'USD',
                admissionRequirements: ['ACSEE with 2 Principal Passes in Advanced Mathematics and Physics']
              }
            ]
          }
        ]
      }
    ],
    featuredBadge: 'Premier Higher Learning in Tanzania',
    overviewDescription: 'The oldest and largest public university in Tanzania, situated on the scenic Mlimani hill overlooking the city of Dar es Salaam.'
  }
];

/**
 * Filter and query institutions by criteria
 */
export function searchInstitutionRegistry(query: {
  countryCode?: string;
  state?: string;
  tier?: string;
  institutionType?: string;
  isPublic?: boolean;
  search?: string;
  verificationStatus?: string;
}): InstitutionProfile[] {
  return GLOBAL_EDUCATION_INSTITUTIONS.filter((inst) => {
    if (query.countryCode && query.countryCode !== 'ALL' && query.countryCode !== 'GLOBAL') {
      if (inst.countryCode.toUpperCase() !== query.countryCode.toUpperCase()) return false;
    }
    if (query.state && query.state.toUpperCase() !== 'ALL') {
      if (inst.state.toLowerCase() !== query.state.toLowerCase()) return false;
    }
    if (query.tier && query.tier.toLowerCase() !== 'all') {
      if (!inst.supportedTiers.includes(query.tier as any)) return false;
    }
    if (query.institutionType && query.institutionType.toLowerCase() !== 'all') {
      if (inst.institutionType !== query.institutionType) return false;
    }
    if (query.isPublic !== undefined) {
      if (inst.isPublic !== query.isPublic) return false;
    }
    if (query.verificationStatus && query.verificationStatus.toUpperCase() !== 'ALL') {
      if (inst.verificationStatus !== query.verificationStatus) return false;
    }
    if (query.search && query.search.trim()) {
      const q = query.search.toLowerCase().trim();
      const matchName = inst.name.toLowerCase().includes(q);
      const matchCode = inst.institutionCode.toLowerCase().includes(q);
      const matchCity = inst.city.toLowerCase().includes(q);
      const matchLegal = inst.legalName.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchCity && !matchLegal) return false;
    }
    return true;
  });
}
