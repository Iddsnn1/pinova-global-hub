import { InstitutionProfile } from '../types/education';

export const GLOBAL_EDUCATION_INSTITUTIONS: InstitutionProfile[] = [
  {
    "id": "inst-ng-buk-001",
    "name": "Bayero University Kano (BUK)",
    "legalName": "Bayero University, Kano (Federal Institution)",
    "tradingName": "BUK Portal",
    "institutionCode": "BUK-NG",
    "institutionType": "university",
    "supportedTiers": [
      "tertiary"
    ],
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kano",
    "city": "Kano",
    "address": "Gwarzo Road, New Campus, BUK, Kano State, Nigeria",
    "contactEmail": "admissions@buk.edu.ng",
    "contactPhone": "+234 64 666021",
    "website": "https://www.buk.edu.ng",
    "logoUrl": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=240&q=80",
    "coverImageUrl": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    "isPublic": true,
    "curriculum": [
      "NUC Core Curriculum and Minimum Academic Standards (CCMAS)"
    ],
    "instructionLanguage": [
      "English"
    ],
    "isBoarding": true,
    "hasDayOption": true,
    "accreditation": {
      "authority": "National Universities Commission (NUC)",
      "registrationNumber": "NUC/UNI/FED/004",
      "accreditationStatus": "accredited",
      "validThrough": "2029-12-31",
      "verifiedAt": "2025-01-15T09:00:00Z",
      "officialNotes": "Full institutional accreditation across all faculties."
    },
    "verificationStatus": "VERIFIED",
    "verificationDate": "2025-01-15T09:00:00Z",
    "administratorName": "Prof. Sagir Adamu Abbas (Vice-Chancellor)",
    "administratorEmail": "vc@buk.edu.ng",
    "acceptedCurrencies": [
      "USD",
      "PI",
      "NGN"
    ],
    "supportsPiPayment": true,
    "supportsInstallments": true,
    "activeSessions": [
      {
        "session": "2025/2026",
        "terms": [
          {
            "id": "buk-2526-s1",
            "name": "Harmattan (1st) Semester",
            "startDate": "2025-10-01",
            "endDate": "2026-02-28",
            "isCurrent": true
          },
          {
            "id": "buk-2526-s2",
            "name": "Rain (2nd) Semester",
            "startDate": "2026-03-15",
            "endDate": "2026-07-31",
            "isCurrent": false
          }
        ]
      }
    ],
    "faculties": [
      {
        "id": "fac-buk-csit",
        "name": "Faculty of Computer Science & Information Technology",
        "departments": [
          {
            "id": "dept-buk-cs",
            "name": "Department of Computer Science",
            "programmes": [
              {
                "id": "prog-buk-cs-01",
                "name": "B.Sc. Computer Science",
                "code": "CSC",
                "tier": "tertiary",
                "levelCode": "100L-400L",
                "durationYears": 4,
                "credentialAwarded": "B.Sc. (Hons) Computer Science",
                "tuitionPerPeriod": 120,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 70,
                  "registration": 15,
                  "examination": 10,
                  "laboratory": 12,
                  "library": 5,
                  "technology": 5,
                  "association": 3
                },
                "admissionRequirements": [
                  "UTME Score 220+",
                  "5 O-Level Credits in Math, English, Physics, Chem"
                ]
              },
              {
                "id": "prog-buk-se-01",
                "name": "B.Sc. Software Engineering",
                "code": "SWE",
                "tier": "tertiary",
                "levelCode": "100L-400L",
                "durationYears": 4,
                "credentialAwarded": "B.Sc. (Hons) Software Engineering",
                "tuitionPerPeriod": 130,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 75,
                  "registration": 15,
                  "examination": 12,
                  "laboratory": 15,
                  "library": 5,
                  "technology": 5,
                  "association": 3
                },
                "admissionRequirements": [
                  "UTME Score 230+",
                  "5 O-Level Credits including Further Math or Physics"
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "fac-buk-eng",
        "name": "Faculty of Engineering",
        "departments": [
          {
            "id": "dept-buk-cpe",
            "name": "Department of Computer Engineering",
            "programmes": [
              {
                "id": "prog-buk-cpe-01",
                "name": "B.Eng. Computer Engineering",
                "code": "CPE",
                "tier": "tertiary",
                "levelCode": "100L-500L",
                "durationYears": 5,
                "credentialAwarded": "B.Eng. (Hons) Computer Engineering",
                "tuitionPerPeriod": 150,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 85,
                  "registration": 15,
                  "examination": 12,
                  "laboratory": 22,
                  "library": 6,
                  "technology": 7,
                  "association": 3
                },
                "admissionRequirements": [
                  "UTME Score 240+",
                  "COREN Accredited Baseline Requirements"
                ]
              }
            ]
          },
          {
            "id": "dept-buk-eee",
            "name": "Department of Electrical Engineering",
            "programmes": [
              {
                "id": "prog-buk-eee-01",
                "name": "B.Eng. Electrical Engineering",
                "code": "EEE",
                "tier": "tertiary",
                "levelCode": "100L-500L",
                "durationYears": 5,
                "credentialAwarded": "B.Eng. (Hons) Electrical Engineering",
                "tuitionPerPeriod": 145,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 80,
                  "registration": 15,
                  "examination": 12,
                  "laboratory": 22,
                  "library": 6,
                  "technology": 7,
                  "association": 3
                },
                "admissionRequirements": [
                  "UTME Score 235+",
                  "5 O-Level Credits in Science subjects"
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "fac-buk-med",
        "name": "Faculty of Clinical Sciences",
        "departments": [
          {
            "id": "dept-buk-mbbs",
            "name": "Department of Medicine & Surgery",
            "programmes": [
              {
                "id": "prog-buk-mbbs",
                "name": "Bachelor of Medicine & Surgery (MBBS)",
                "code": "MBBS",
                "tier": "tertiary",
                "levelCode": "100L-600L",
                "durationYears": 6,
                "credentialAwarded": "MBBS",
                "tuitionPerPeriod": 250,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 150,
                  "registration": 20,
                  "examination": 20,
                  "laboratory": 40,
                  "library": 10,
                  "technology": 5,
                  "association": 5
                },
                "admissionRequirements": [
                  "UTME 280+",
                  "Post-UTME Screened",
                  "Straight A/B O-Level Sciences"
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "fac-buk-law",
        "name": "Faculty of Law",
        "departments": [
          {
            "id": "dept-buk-law",
            "name": "Department of Public and Islamic Law",
            "programmes": [
              {
                "id": "prog-buk-llb",
                "name": "LL.B Common & Islamic Law",
                "code": "LAW",
                "tier": "tertiary",
                "levelCode": "100L-500L",
                "durationYears": 5,
                "credentialAwarded": "LL.B (Hons)",
                "tuitionPerPeriod": 135,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 80,
                  "registration": 15,
                  "examination": 15,
                  "laboratory": 0,
                  "library": 15,
                  "technology": 5,
                  "association": 5
                },
                "admissionRequirements": [
                  "UTME 260+",
                  "Credits in Literature and Arabic/Islamic Studies"
                ]
              }
            ]
          }
        ]
      }
    ],
    "featuredBadge": "Federal Center of Academic Excellence",
    "overviewDescription": "Bayero University Kano is a leading first-generation university in Sub-Saharan Africa known for groundbreaking academic research in dryland agriculture, engineering, medicine, and Islamic banking."
  },
  {
    "id": "inst-ng-unilag-002",
    "name": "University of Lagos (UNILAG)",
    "legalName": "University of Lagos (Federal Institution)",
    "tradingName": "UNILAG Nigeria",
    "institutionCode": "UNILAG",
    "institutionType": "university",
    "supportedTiers": [
      "tertiary"
    ],
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Lagos",
    "city": "Akoka, Yaba, Lagos",
    "address": "University Road, Akoka, Yaba, Lagos State, Nigeria",
    "contactEmail": "admissions@unilag.edu.ng",
    "contactPhone": "+234 1 280 2439",
    "website": "https://unilag.edu.ng",
    "logoUrl": "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=240&q=80",
    "coverImageUrl": "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
    "isPublic": true,
    "curriculum": [
      "NUC CCMAS"
    ],
    "instructionLanguage": [
      "English"
    ],
    "isBoarding": true,
    "hasDayOption": true,
    "accreditation": {
      "authority": "National Universities Commission (NUC)",
      "registrationNumber": "NUC/UNI/FED/002",
      "accreditationStatus": "accredited",
      "validThrough": "2030-06-30",
      "verifiedAt": "2025-01-20T10:00:00Z",
      "officialNotes": "Flagship University of First Choice."
    },
    "verificationStatus": "VERIFIED",
    "verificationDate": "2025-01-20T10:00:00Z",
    "administratorName": "Prof. Folasade Ogunsola (Vice-Chancellor)",
    "administratorEmail": "vc@unilag.edu.ng",
    "acceptedCurrencies": [
      "USD",
      "PI",
      "NGN"
    ],
    "supportsPiPayment": true,
    "supportsInstallments": true,
    "activeSessions": [
      {
        "session": "2025/2026",
        "terms": [
          {
            "id": "unilag-2526-s1",
            "name": "1st Semester",
            "startDate": "2025-10-15",
            "endDate": "2026-03-01",
            "isCurrent": true
          },
          {
            "id": "unilag-2526-s2",
            "name": "2nd Semester",
            "startDate": "2026-03-20",
            "endDate": "2026-08-10",
            "isCurrent": false
          }
        ]
      }
    ],
    "faculties": [
      {
        "id": "fac-unilag-law",
        "name": "Faculty of Law",
        "departments": [
          {
            "id": "dept-unilag-law-pub",
            "name": "Department of Public & Private Law",
            "programmes": [
              {
                "id": "prog-unilag-llb",
                "name": "Bachelor of Laws (LL.B)",
                "code": "LAW",
                "tier": "tertiary",
                "levelCode": "100L-500L",
                "durationYears": 5,
                "credentialAwarded": "LL.B (Hons)",
                "tuitionPerPeriod": 140,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 85,
                  "registration": 15,
                  "examination": 15,
                  "library": 15,
                  "technology": 5,
                  "association": 5
                },
                "admissionRequirements": [
                  "UTME Score 260+",
                  "Credit in Literature in English & Math"
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "fac-unilag-mgt",
        "name": "Faculty of Management Sciences",
        "departments": [
          {
            "id": "dept-unilag-fin",
            "name": "Department of Finance & Accounting",
            "programmes": [
              {
                "id": "prog-unilag-bsc-acc",
                "name": "B.Sc. Accounting & Finance",
                "code": "ACC",
                "tier": "tertiary",
                "levelCode": "100L-400L",
                "durationYears": 4,
                "credentialAwarded": "B.Sc. (Hons) Accounting",
                "tuitionPerPeriod": 110,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 65,
                  "registration": 15,
                  "examination": 12,
                  "library": 10,
                  "technology": 5,
                  "association": 3
                },
                "admissionRequirements": [
                  "UTME Score 240+",
                  "O-Level Math, English, Economics"
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "fac-unilag-eng",
        "name": "Faculty of Engineering",
        "departments": [
          {
            "id": "dept-unilag-sys",
            "name": "Department of Systems Engineering",
            "programmes": [
              {
                "id": "prog-unilag-sys",
                "name": "B.Sc. Systems Engineering",
                "code": "SYS",
                "tier": "tertiary",
                "levelCode": "100L-500L",
                "durationYears": 5,
                "credentialAwarded": "B.Sc. (Hons) Systems Engineering",
                "tuitionPerPeriod": 160,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 95,
                  "registration": 15,
                  "examination": 15,
                  "laboratory": 22,
                  "library": 6,
                  "technology": 4,
                  "association": 3
                },
                "admissionRequirements": [
                  "UTME Score 260+",
                  "Credits in Further Math, Physics, Chemistry"
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "fac-unilag-sci",
        "name": "Faculty of Science",
        "departments": [
          {
            "id": "dept-unilag-csc",
            "name": "Department of Computer Sciences",
            "programmes": [
              {
                "id": "prog-unilag-csc",
                "name": "B.Sc. Computer Science",
                "code": "CSC",
                "tier": "tertiary",
                "levelCode": "100L-400L",
                "durationYears": 4,
                "credentialAwarded": "B.Sc. (Hons) Computer Science",
                "tuitionPerPeriod": 135,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 80,
                  "registration": 15,
                  "examination": 12,
                  "laboratory": 16,
                  "library": 5,
                  "technology": 4,
                  "association": 3
                },
                "admissionRequirements": [
                  "UTME Score 250+",
                  "5 O-Level Science credits"
                ]
              }
            ]
          }
        ]
      }
    ],
    "featuredBadge": "University of First Choice",
    "overviewDescription": "The University of Lagos is globally acknowledged as a center of enterprise, legal prowess, finance, and engineering innovation."
  },
  {
    "id": "inst-ng-yabatech-003",
    "name": "Yaba College of Technology (YABATECH)",
    "legalName": "Yaba College of Technology",
    "tradingName": "YABATECH Portal",
    "institutionCode": "YABA",
    "institutionType": "polytechnic",
    "supportedTiers": [
      "tertiary"
    ],
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Lagos",
    "city": "Yaba, Lagos",
    "address": "Herbert Macaulay Way, Yaba, Lagos State, Nigeria",
    "contactEmail": "registry@yabatech.edu.ng",
    "contactPhone": "+234 1 894 1234",
    "website": "https://www.yabatech.edu.ng",
    "logoUrl": "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=240&q=80",
    "coverImageUrl": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    "isPublic": true,
    "curriculum": [
      "NBTE Curriculum for Technical & Poly Education"
    ],
    "instructionLanguage": [
      "English"
    ],
    "isBoarding": true,
    "hasDayOption": true,
    "accreditation": {
      "authority": "National Board for Technical Education (NBTE)",
      "registrationNumber": "NBTE/POLY/FED/001",
      "accreditationStatus": "accredited",
      "validThrough": "2028-11-30",
      "verifiedAt": "2025-01-18T11:00:00Z",
      "officialNotes": "Pioneer higher educational institution in Nigeria."
    },
    "verificationStatus": "VERIFIED",
    "verificationDate": "2025-01-18T11:00:00Z",
    "administratorName": "Dr. Ibraheem Abdul (Rector)",
    "administratorEmail": "rector@yabatech.edu.ng",
    "acceptedCurrencies": [
      "USD",
      "PI",
      "NGN"
    ],
    "supportsPiPayment": true,
    "supportsInstallments": true,
    "activeSessions": [
      {
        "session": "2025/2026",
        "terms": [
          {
            "id": "yaba-2526-s1",
            "name": "1st Semester",
            "startDate": "2025-10-01",
            "endDate": "2026-02-15",
            "isCurrent": true
          },
          {
            "id": "yaba-2526-s2",
            "name": "2nd Semester",
            "startDate": "2026-03-01",
            "endDate": "2026-07-20",
            "isCurrent": false
          }
        ]
      }
    ],
    "faculties": [
      {
        "id": "fac-yabatech-tech",
        "name": "School of Technology",
        "departments": [
          {
            "id": "dept-yabatech-cs",
            "name": "Department of Computer Technology",
            "programmes": [
              {
                "id": "prog-yaba-nd-cs",
                "name": "National Diploma (ND) in Computer Science",
                "code": "ND-CS",
                "tier": "tertiary",
                "levelCode": "ND 1 - ND 2",
                "durationYears": 2,
                "credentialAwarded": "National Diploma (ND)",
                "tuitionPerPeriod": 85,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 50,
                  "registration": 12,
                  "examination": 10,
                  "laboratory": 8,
                  "library": 3,
                  "technology": 2
                },
                "admissionRequirements": [
                  "JAMB National Cutoff 160+",
                  "Credit in Math, English, Physics"
                ]
              },
              {
                "id": "prog-yaba-hnd-cs",
                "name": "Higher National Diploma (HND) in Computer Science",
                "code": "HND-CS",
                "tier": "tertiary",
                "levelCode": "HND 1 - HND 2",
                "durationYears": 2,
                "credentialAwarded": "Higher National Diploma (HND)",
                "tuitionPerPeriod": 95,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 55,
                  "registration": 12,
                  "examination": 12,
                  "laboratory": 10,
                  "library": 3,
                  "technology": 3
                },
                "admissionRequirements": [
                  "Lower Credit in ND Computer Science",
                  "1-year industrial training IT completion"
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "fac-yabatech-eng",
        "name": "School of Engineering",
        "departments": [
          {
            "id": "dept-yabatech-eee",
            "name": "Department of Electrical/Electronics Engineering",
            "programmes": [
              {
                "id": "prog-yaba-nd-eee",
                "name": "National Diploma in Electrical Engineering",
                "code": "ND-EEE",
                "tier": "tertiary",
                "levelCode": "ND 1 - ND 2",
                "durationYears": 2,
                "credentialAwarded": "National Diploma (ND)",
                "tuitionPerPeriod": 90,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 52,
                  "registration": 12,
                  "examination": 10,
                  "laboratory": 11,
                  "library": 3,
                  "technology": 2
                },
                "admissionRequirements": [
                  "JAMB Score 160+",
                  "Credits in Physics, Chemistry, Math"
                ]
              }
            ]
          }
        ]
      }
    ],
    "featuredBadge": "Pioneer Polytechnic of Nigeria",
    "overviewDescription": "Established in 1947, Yaba College of Technology is Nigeria's premier polytechnic recognized for technical innovation, arts, and industrial design."
  },
  {
    "id": "inst-ng-kings-college-004",
    "name": "King's College Lagos",
    "legalName": "King's College, Lagos (Federal Unity College)",
    "tradingName": "King's College Lagos",
    "institutionCode": "KCL-NG",
    "institutionType": "secondary_school",
    "supportedTiers": [
      "secondary"
    ],
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Lagos",
    "city": "Lagos Island, Lagos",
    "address": "3 Catholic Mission Street, Lagos Island, Lagos State, Nigeria",
    "contactEmail": "info@kingscollegelagos.sch.ng",
    "contactPhone": "+234 1 263 1111",
    "website": "https://kingscollegelagos.sch.ng",
    "logoUrl": "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=240&q=80",
    "coverImageUrl": "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    "isPublic": true,
    "curriculum": [
      "NERDC (Nigerian National Curriculum)",
      "WAEC / NECO / BECE"
    ],
    "instructionLanguage": [
      "English"
    ],
    "isBoarding": true,
    "hasDayOption": true,
    "accreditation": {
      "authority": "Federal Ministry of Education (FME)",
      "registrationNumber": "FME/FED/COL/001",
      "accreditationStatus": "accredited",
      "validThrough": "2030-01-01",
      "verifiedAt": "2025-01-10T08:30:00Z",
      "officialNotes": "Heritage Federal Unity College established 1909."
    },
    "verificationStatus": "VERIFIED",
    "verificationDate": "2025-01-10T08:30:00Z",
    "administratorName": "Mr. Ali A. (Principal)",
    "administratorEmail": "principal@kingscollegelagos.sch.ng",
    "acceptedCurrencies": [
      "USD",
      "PI",
      "NGN"
    ],
    "supportsPiPayment": true,
    "supportsInstallments": true,
    "activeSessions": [
      {
        "session": "2025/2026",
        "terms": [
          {
            "id": "kc-2526-t1",
            "name": "1st Term (Autumn)",
            "startDate": "2025-09-10",
            "endDate": "2025-12-18",
            "isCurrent": true
          },
          {
            "id": "kc-2526-t2",
            "name": "2nd Term (Winter)",
            "startDate": "2026-01-08",
            "endDate": "2026-04-05",
            "isCurrent": false
          },
          {
            "id": "kc-2526-t3",
            "name": "3rd Term (Summer)",
            "startDate": "2026-04-25",
            "endDate": "2026-07-22",
            "isCurrent": false
          }
        ]
      }
    ],
    "programmes": [
      {
        "id": "prog-kings-jss",
        "name": "Junior Secondary School Certificate (BECE / Basic Stage)",
        "code": "JSS-1-3",
        "tier": "secondary",
        "levelCode": "JSS 1 - JSS 3",
        "durationYears": 3,
        "credentialAwarded": "Basic Education Certificate Examination (BECE)",
        "tuitionPerPeriod": 80,
        "currency": "USD",
        "feePeriod": "per term",
        "feeSchedule": {
          "tuition": 45,
          "registration": 10,
          "examination": 10,
          "laboratory": 5,
          "library": 5,
          "technology": 3,
          "association": 2
        },
        "admissionRequirements": [
          "National Common Entrance Examination (NCEE) Merit Pass",
          "Interview Screening"
        ]
      },
      {
        "id": "prog-kings-sss-sci",
        "name": "Senior Secondary School (Science & STEM Track)",
        "code": "SSS-SCI",
        "tier": "secondary",
        "levelCode": "SSS 1 - SSS 3",
        "durationYears": 3,
        "credentialAwarded": "West African Senior School Certificate (WASSCE) & Cambridge IGCSE",
        "tuitionPerPeriod": 95,
        "currency": "USD",
        "feePeriod": "per term",
        "feeSchedule": {
          "tuition": 50,
          "registration": 10,
          "examination": 15,
          "laboratory": 12,
          "library": 4,
          "technology": 2,
          "association": 2
        },
        "admissionRequirements": [
          "Pass in Basic BECE with minimum 6 Credits including Math & Basic Science"
        ]
      },
      {
        "id": "prog-kings-sss-arts",
        "name": "Senior Secondary School (Arts & Commercial Track)",
        "code": "SSS-ART",
        "tier": "secondary",
        "levelCode": "SSS 1 - SSS 3",
        "durationYears": 3,
        "credentialAwarded": "West African Senior School Certificate (WASSCE)",
        "tuitionPerPeriod": 90,
        "currency": "USD",
        "feePeriod": "per term",
        "feeSchedule": {
          "tuition": 48,
          "registration": 10,
          "examination": 15,
          "laboratory": 5,
          "library": 8,
          "technology": 2,
          "association": 2
        },
        "admissionRequirements": [
          "Pass in BECE with Credits in English, Social Studies, Business Studies"
        ]
      }
    ],
    "featuredBadge": "Heritage Federal Unity College (Est. 1909)",
    "overviewDescription": "King's College Lagos is one of the most prestigious secondary schools in West Africa, with alumni including prime ministers, supreme court justices, and industry pioneers."
  },
  {
    "id": "inst-ng-kano-model-005",
    "name": "Kano Model Primary & Nursery Academy",
    "legalName": "Kano Model International Academy Limited",
    "tradingName": "Kano Model Academy",
    "institutionCode": "KMA-NG",
    "institutionType": "primary_school",
    "supportedTiers": [
      "early_childhood",
      "primary"
    ],
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kano",
    "city": "Nassarawa GRA, Kano",
    "address": "14 Bompai Road, Nassarawa GRA, Kano, Kano State, Nigeria",
    "contactEmail": "admissions@kanomodel.edu.ng",
    "contactPhone": "+234 64 912 3456",
    "website": "https://kanomodel.edu.ng",
    "logoUrl": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=240&q=80",
    "coverImageUrl": "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1200&q=80",
    "isPublic": false,
    "curriculum": [
      "Early Years Foundation Stage (EYFS)",
      "NERDC Universal Basic Primary",
      "Montessori"
    ],
    "instructionLanguage": [
      "English",
      "Hausa (Cultural)"
    ],
    "isBoarding": false,
    "hasDayOption": true,
    "accreditation": {
      "authority": "Kano State Ministry of Education & SUBEB",
      "registrationNumber": "KNS/ED/PRI/2012/88",
      "accreditationStatus": "accredited",
      "validThrough": "2028-09-01",
      "verifiedAt": "2025-01-05T14:00:00Z",
      "officialNotes": "Certified Model Early Childhood and Primary Center."
    },
    "verificationStatus": "VERIFIED",
    "verificationDate": "2025-01-05T14:00:00Z",
    "administratorName": "Hajiya Maryam S. (Head of School)",
    "administratorEmail": "headmistress@kanomodel.edu.ng",
    "acceptedCurrencies": [
      "USD",
      "PI",
      "NGN"
    ],
    "supportsPiPayment": true,
    "supportsInstallments": true,
    "activeSessions": [
      {
        "session": "2025/2026",
        "terms": [
          {
            "id": "kma-2526-t1",
            "name": "1st Term",
            "startDate": "2025-09-08",
            "endDate": "2025-12-15",
            "isCurrent": true
          },
          {
            "id": "kma-2526-t2",
            "name": "2nd Term",
            "startDate": "2026-01-10",
            "endDate": "2026-04-03",
            "isCurrent": false
          },
          {
            "id": "kma-2526-t3",
            "name": "3rd Term",
            "startDate": "2026-04-20",
            "endDate": "2026-07-18",
            "isCurrent": false
          }
        ]
      }
    ],
    "programmes": [
      {
        "id": "prog-kano-nursery",
        "name": "Early Childhood & Montessori Nursery Education",
        "code": "EYFS-NURSERY",
        "tier": "early_childhood",
        "levelCode": "Nursery 1 - 2",
        "durationYears": 2,
        "credentialAwarded": "Early Years Foundation Stage Certificate",
        "tuitionPerPeriod": 40,
        "currency": "USD",
        "feePeriod": "per term",
        "feeSchedule": {
          "tuition": 28,
          "registration": 5,
          "examination": 2,
          "library": 2,
          "technology": 1,
          "association": 2
        },
        "admissionRequirements": [
          "Ages 3-5 Years Developmental Readiness Assessment"
        ]
      },
      {
        "id": "prog-kano-primary",
        "name": "Basic Primary School Curriculum (Grades 1 to 6)",
        "code": "BASIC-PRI",
        "tier": "primary",
        "levelCode": "Primary 1 - 6",
        "durationYears": 6,
        "credentialAwarded": "First School Leaving Certificate (FSLC)",
        "tuitionPerPeriod": 50,
        "currency": "USD",
        "feePeriod": "per term",
        "feeSchedule": {
          "tuition": 32,
          "registration": 6,
          "examination": 4,
          "laboratory": 2,
          "library": 3,
          "technology": 1,
          "association": 2
        },
        "admissionRequirements": [
          "Placement evaluation in Numeracy and Literacy"
        ]
      }
    ],
    "featuredBadge": "Verified Early Childhood & Primary Provider",
    "overviewDescription": "Dedicated to nurturing early-stage intellect, character, and curiosity through an integrated international-Montessori curriculum in northern Nigeria."
  },
  {
    "id": "inst-ng-decagon-006",
    "name": "Decagon Software & AI Institute",
    "legalName": "Decagon Institute of Advanced Technology Limited",
    "tradingName": "Decagon Institute",
    "institutionCode": "DEC-TECH",
    "institutionType": "vocational_institute",
    "supportedTiers": [
      "technical_vocational",
      "professional_continuing"
    ],
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Lagos",
    "city": "Lekki Phase 1, Lagos",
    "address": "Plot 2, Admiralty Way, Lekki Phase 1, Lagos State, Nigeria",
    "contactEmail": "admissions@decagon.institute",
    "contactPhone": "+234 1 700 9900",
    "website": "https://decagon.institute",
    "logoUrl": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=240&q=80",
    "coverImageUrl": "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    "isPublic": false,
    "curriculum": [
      "Production Software Engineering",
      "Cloud & Distributed Systems",
      "AI & Data Engineering"
    ],
    "instructionLanguage": [
      "English"
    ],
    "isBoarding": true,
    "hasDayOption": true,
    "accreditation": {
      "authority": "National Board for Technical Education (NBTE) & ITF",
      "registrationNumber": "ITF/VOC/TECH/2020/094",
      "accreditationStatus": "accredited",
      "validThrough": "2029-05-01",
      "verifiedAt": "2025-01-22T15:00:00Z",
      "officialNotes": "Accredited high-impact tech apprenticeship and vocational engineering institute."
    },
    "verificationStatus": "VERIFIED",
    "verificationDate": "2025-01-22T15:00:00Z",
    "administratorName": "Engr. Chika Nwobi (Executive Director)",
    "administratorEmail": "director@decagon.institute",
    "acceptedCurrencies": [
      "USD",
      "PI"
    ],
    "supportsPiPayment": true,
    "supportsInstallments": true,
    "activeSessions": [
      {
        "session": "2025/2026",
        "terms": [
          {
            "id": "dec-c1",
            "name": "Q1 Spring Cohort",
            "startDate": "2025-02-01",
            "endDate": "2025-06-30",
            "isCurrent": false
          },
          {
            "id": "dec-c2",
            "name": "Q3 Fall Cohort",
            "startDate": "2025-08-01",
            "endDate": "2025-12-31",
            "isCurrent": true
          }
        ]
      }
    ],
    "programmes": [
      {
        "id": "prog-deca-swe",
        "name": "Full-Stack Software Engineering Fellowship",
        "code": "DECAGON-SWE",
        "tier": "technical_vocational",
        "levelCode": "Intensive Immersion",
        "durationYears": 0.5,
        "credentialAwarded": "Professional Software Engineer Certificate",
        "tuitionPerPeriod": 350,
        "currency": "USD",
        "feePeriod": "per programme",
        "feeSchedule": {
          "tuition": 280,
          "registration": 25,
          "examination": 20,
          "laboratory": 15,
          "technology": 10
        },
        "admissionRequirements": [
          "Cognitive and Coding Aptitude Assessment",
          "Algorithm Technical Interview"
        ]
      },
      {
        "id": "prog-deca-ai",
        "name": "Artificial Intelligence & Machine Learning Specialization",
        "code": "DECAGON-AI",
        "tier": "technical_vocational",
        "levelCode": "Specialization Track",
        "durationYears": 0.5,
        "credentialAwarded": "AI/ML Specialist Fellowship Certificate",
        "tuitionPerPeriod": 380,
        "currency": "USD",
        "feePeriod": "per programme",
        "feeSchedule": {
          "tuition": 300,
          "registration": 25,
          "examination": 25,
          "laboratory": 20,
          "technology": 10
        },
        "admissionRequirements": [
          "Prior Python Programming proficiency",
          "Linear Algebra & Calculus Foundations"
        ]
      }
    ],
    "featuredBadge": "Accredited Tech Accelerator & Vocational Institute",
    "overviewDescription": "Transforms promising talent into elite world-class software engineers and tech leaders through intensive hands-on production engineering."
  },
  {
    "id": "inst-gb-oxford-007",
    "name": "University of Oxford",
    "legalName": "The Chancellor, Masters and Scholars of the University of Oxford",
    "tradingName": "Oxford University",
    "institutionCode": "OXF-UK",
    "institutionType": "university",
    "supportedTiers": [
      "tertiary",
      "professional_continuing"
    ],
    "country": "United Kingdom",
    "countryCode": "GB",
    "state": "Oxfordshire",
    "city": "Oxford",
    "address": "University Offices, Wellington Square, Oxford, OX1 2JD, United Kingdom",
    "contactEmail": "admissions@ox.ac.uk",
    "contactPhone": "+44 1865 270000",
    "website": "https://www.ox.ac.uk",
    "logoUrl": "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=240&q=80",
    "coverImageUrl": "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
    "isPublic": true,
    "curriculum": [
      "UK Quality Assurance Agency (QAA) Framework"
    ],
    "instructionLanguage": [
      "English"
    ],
    "isBoarding": true,
    "hasDayOption": false,
    "accreditation": {
      "authority": "Office for Students (OfS) & QAA United Kingdom",
      "registrationNumber": "UKPRN-10007774",
      "accreditationStatus": "accredited",
      "validThrough": "2035-12-31",
      "verifiedAt": "2025-01-01T00:00:00Z",
      "officialNotes": "Royal Charter certified international collegiate research university."
    },
    "verificationStatus": "VERIFIED",
    "verificationDate": "2025-01-01T00:00:00Z",
    "administratorName": "Prof. Irene Tracey (Vice-Chancellor)",
    "administratorEmail": "vc.office@ox.ac.uk",
    "acceptedCurrencies": [
      "GBP",
      "USD",
      "PI"
    ],
    "supportsPiPayment": true,
    "supportsInstallments": true,
    "activeSessions": [
      {
        "session": "2025/2026",
        "terms": [
          {
            "id": "ox-2526-t1",
            "name": "Michaelmas Term",
            "startDate": "2025-10-12",
            "endDate": "2025-12-06",
            "isCurrent": true
          },
          {
            "id": "ox-2526-t2",
            "name": "Hilary Term",
            "startDate": "2026-01-18",
            "endDate": "2026-03-14",
            "isCurrent": false
          },
          {
            "id": "ox-2526-t3",
            "name": "Trinity Term",
            "startDate": "2026-04-26",
            "endDate": "2026-06-20",
            "isCurrent": false
          }
        ]
      }
    ],
    "faculties": [
      {
        "id": "fac-oxf-mpls",
        "name": "Mathematical, Physical and Life Sciences Division",
        "departments": [
          {
            "id": "dept-oxf-cs",
            "name": "Department of Computer Science",
            "programmes": [
              {
                "id": "prog-oxf-cs",
                "name": "BA in Computer Science",
                "code": "OXF-CS",
                "tier": "tertiary",
                "levelCode": "Years 1-3",
                "durationYears": 3,
                "credentialAwarded": "BA (Hons) Computer Science",
                "tuitionPerPeriod": 350,
                "currency": "USD",
                "feePeriod": "per term",
                "feeSchedule": {
                  "tuition": 280,
                  "registration": 20,
                  "examination": 20,
                  "laboratory": 15,
                  "library": 10,
                  "technology": 5
                },
                "admissionRequirements": [
                  "A-Levels A*A*A with A* in Maths",
                  "MAT (Mathematics Admissions Test)"
                ]
              }
            ]
          },
          {
            "id": "dept-oxf-eng",
            "name": "Department of Engineering Science",
            "programmes": [
              {
                "id": "prog-oxf-eng",
                "name": "M.Eng in Engineering Science",
                "code": "OXF-ENG",
                "tier": "tertiary",
                "levelCode": "Years 1-4",
                "durationYears": 4,
                "credentialAwarded": "M.Eng (Hons) Engineering Science",
                "tuitionPerPeriod": 370,
                "currency": "USD",
                "feePeriod": "per term",
                "feeSchedule": {
                  "tuition": 290,
                  "registration": 20,
                  "examination": 20,
                  "laboratory": 25,
                  "library": 10,
                  "technology": 5
                },
                "admissionRequirements": [
                  "A-Levels A*A*A in Maths and Physics",
                  "PAT Admissions Test"
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "fac-oxf-soc",
        "name": "Social Sciences Division",
        "departments": [
          {
            "id": "dept-oxf-law",
            "name": "Faculty of Law",
            "programmes": [
              {
                "id": "prog-oxf-law",
                "name": "BA in Jurisprudence (Law)",
                "code": "OXF-LAW",
                "tier": "tertiary",
                "levelCode": "Years 1-3",
                "durationYears": 3,
                "credentialAwarded": "BA (Hons) Jurisprudence",
                "tuitionPerPeriod": 330,
                "currency": "USD",
                "feePeriod": "per term",
                "feeSchedule": {
                  "tuition": 260,
                  "registration": 20,
                  "examination": 20,
                  "library": 20,
                  "technology": 5,
                  "association": 5
                },
                "admissionRequirements": [
                  "A-Levels AAA",
                  "LNAT Admissions Test Score"
                ]
              }
            ]
          }
        ]
      }
    ],
    "featuredBadge": "Global Collegiate Research University",
    "overviewDescription": "The oldest university in the English-speaking world, offering collegiate tutorial education and groundbreaking scholarly research."
  },
  {
    "id": "inst-gh-legon-008",
    "name": "University of Ghana (Legon)",
    "legalName": "University of Ghana",
    "tradingName": "UG Legon Portal",
    "institutionCode": "UG-GH",
    "institutionType": "university",
    "supportedTiers": [
      "tertiary"
    ],
    "country": "Ghana",
    "countryCode": "GH",
    "state": "Greater Accra",
    "city": "Legon, Accra",
    "address": "University of Ghana, Legon Boundary, Accra, Ghana",
    "contactEmail": "admissions@ug.edu.gh",
    "contactPhone": "+233 30 221 3820",
    "website": "https://www.ug.edu.gh",
    "logoUrl": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=240&q=80",
    "coverImageUrl": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80",
    "isPublic": true,
    "curriculum": [
      "Ghana Tertiary Education Commission (GTEC) Standards"
    ],
    "instructionLanguage": [
      "English"
    ],
    "isBoarding": true,
    "hasDayOption": true,
    "accreditation": {
      "authority": "Ghana Tertiary Education Commission (GTEC)",
      "registrationNumber": "GTEC/UNI/PUB/001",
      "accreditationStatus": "accredited",
      "validThrough": "2030-01-01",
      "verifiedAt": "2025-01-12T09:00:00Z",
      "officialNotes": "Accredited premier university of Ghana."
    },
    "verificationStatus": "VERIFIED",
    "verificationDate": "2025-01-12T09:00:00Z",
    "administratorName": "Prof. Nana Aba Appiah Amfo (Vice-Chancellor)",
    "administratorEmail": "vc@ug.edu.gh",
    "acceptedCurrencies": [
      "GHS",
      "USD",
      "PI"
    ],
    "supportsPiPayment": true,
    "supportsInstallments": true,
    "activeSessions": [
      {
        "session": "2025/2026",
        "terms": [
          {
            "id": "ug-2526-s1",
            "name": "1st Semester",
            "startDate": "2025-09-01",
            "endDate": "2025-12-20",
            "isCurrent": true
          },
          {
            "id": "ug-2526-s2",
            "name": "2nd Semester",
            "startDate": "2026-02-01",
            "endDate": "2026-06-15",
            "isCurrent": false
          }
        ]
      }
    ],
    "faculties": [
      {
        "id": "fac-ug-cbas",
        "name": "College of Basic and Applied Sciences",
        "departments": [
          {
            "id": "dept-ug-cs",
            "name": "School of Physical and Mathematical Sciences - Dept of Computer Science",
            "programmes": [
              {
                "id": "prog-ug-cs",
                "name": "B.Sc. Computer Science",
                "code": "UG-CS",
                "tier": "tertiary",
                "levelCode": "Levels 100-400",
                "durationYears": 4,
                "credentialAwarded": "B.Sc. (Hons) Computer Science",
                "tuitionPerPeriod": 130,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 85,
                  "registration": 15,
                  "examination": 12,
                  "laboratory": 10,
                  "library": 5,
                  "technology": 3
                },
                "admissionRequirements": [
                  "WASSCE Aggregate 10 or better",
                  "Credits in Core Math, Integrated Science, Elective Math"
                ]
              }
            ]
          },
          {
            "id": "dept-ug-cpe",
            "name": "School of Engineering Sciences - Dept of Computer Engineering",
            "programmes": [
              {
                "id": "prog-ug-cpe",
                "name": "B.Sc. Computer Engineering",
                "code": "UG-CPE",
                "tier": "tertiary",
                "levelCode": "Levels 100-400",
                "durationYears": 4,
                "credentialAwarded": "B.Sc. (Hons) Computer Engineering",
                "tuitionPerPeriod": 150,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 95,
                  "registration": 15,
                  "examination": 15,
                  "laboratory": 15,
                  "library": 6,
                  "technology": 4
                },
                "admissionRequirements": [
                  "WASSCE Aggregate 09 or better with Elective Physics and Math"
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "fac-ug-hum",
        "name": "College of Humanities",
        "departments": [
          {
            "id": "dept-ug-law",
            "name": "University of Ghana School of Law",
            "programmes": [
              {
                "id": "prog-ug-llb",
                "name": "Bachelor of Laws (LL.B)",
                "code": "UG-LLB",
                "tier": "tertiary",
                "levelCode": "Levels 100-400",
                "durationYears": 4,
                "credentialAwarded": "LL.B (Hons)",
                "tuitionPerPeriod": 140,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 90,
                  "registration": 15,
                  "examination": 15,
                  "library": 12,
                  "technology": 4,
                  "association": 4
                },
                "admissionRequirements": [
                  "WASSCE Aggregate 07 or Post-First Degree Law Entrance Examination"
                ]
              }
            ]
          }
        ]
      }
    ],
    "featuredBadge": "Premier University of Ghana",
    "overviewDescription": "The oldest and largest of Ghana's public universities, celebrated for its historic Legon campus and high academic standards."
  },
  {
    "id": "inst-uon-ke",
    "name": "University of Nairobi",
    "legalName": "The Council of the University of Nairobi",
    "institutionCode": "UON-KE-001",
    "institutionType": "university",
    "supportedTiers": [
      "tertiary",
      "professional_continuing"
    ],
    "country": "Kenya",
    "countryCode": "KE",
    "state": "Nairobi",
    "city": "Nairobi",
    "address": "University Way, Nairobi, Kenya",
    "contactEmail": "admissions@uonbi.ac.ke",
    "contactPhone": "+254 20 491 0000",
    "website": "https://www.uonbi.ac.ke",
    "logoUrl": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=256&q=80",
    "isPublic": true,
    "curriculum": [
      "Commission for University Education (CUE)",
      "East African Standard"
    ],
    "instructionLanguage": [
      "English",
      "Swahili"
    ],
    "isBoarding": true,
    "hasDayOption": true,
    "accreditation": {
      "authority": "Commission for University Education Kenya (CUE)",
      "registrationNumber": "CUE/UNIV/PUB/001",
      "accreditationStatus": "accredited",
      "validThrough": "2029-12-31",
      "verifiedAt": "2025-01-20T10:00:00Z",
      "officialNotes": "Flagship chartered public research university in Kenya."
    },
    "verificationStatus": "VERIFIED",
    "verificationDate": "2025-01-20T10:00:00Z",
    "administratorName": "Prof. Stephen Kiama (Vice-Chancellor)",
    "administratorEmail": "vc@uonbi.ac.ke",
    "acceptedCurrencies": [
      "USD",
      "PI",
      "KES"
    ],
    "supportsPiPayment": true,
    "supportsInstallments": true,
    "activeSessions": [
      {
        "session": "2025/2026",
        "terms": [
          {
            "id": "uon-2526-s1",
            "name": "Semester 1",
            "startDate": "2025-09-01",
            "endDate": "2026-01-25",
            "isCurrent": true
          },
          {
            "id": "uon-2526-s2",
            "name": "Semester 2",
            "startDate": "2026-02-15",
            "endDate": "2026-06-30",
            "isCurrent": false
          }
        ]
      }
    ],
    "faculties": [
      {
        "id": "fac-uon-fost",
        "name": "Faculty of Science and Technology",
        "departments": [
          {
            "id": "dept-uon-cs",
            "name": "Department of Computing and Informatics",
            "programmes": [
              {
                "id": "prog-uon-cs",
                "name": "B.Sc. Computer Science",
                "code": "UON-CS",
                "tier": "tertiary",
                "levelCode": "Year 1-4",
                "durationYears": 4,
                "credentialAwarded": "B.Sc. Computer Science",
                "tuitionPerPeriod": 140,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 90,
                  "registration": 15,
                  "examination": 12,
                  "laboratory": 13,
                  "library": 6,
                  "technology": 4
                },
                "admissionRequirements": [
                  "KCSE Mean Grade B+ with Mathematics & Physics B+"
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "fac-uon-eng",
        "name": "Faculty of Engineering",
        "departments": [
          {
            "id": "dept-uon-elec",
            "name": "Department of Electrical and Information Engineering",
            "programmes": [
              {
                "id": "prog-uon-eee",
                "name": "B.Sc. Electrical and Electronic Engineering",
                "code": "UON-EEE",
                "tier": "tertiary",
                "levelCode": "Year 1-5",
                "durationYears": 5,
                "credentialAwarded": "B.Sc. (Eng) Electrical Engineering",
                "tuitionPerPeriod": 160,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 100,
                  "registration": 15,
                  "examination": 15,
                  "laboratory": 20,
                  "library": 6,
                  "technology": 4
                },
                "admissionRequirements": [
                  "KCSE Mean Grade A- with A in Math and Physics"
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "fac-uon-fhs",
        "name": "Faculty of Health Sciences",
        "departments": [
          {
            "id": "dept-uon-med",
            "name": "Department of Clinical Medicine and Surgery",
            "programmes": [
              {
                "id": "prog-uon-mbchb",
                "name": "Bachelor of Medicine and Bachelor of Surgery (MBChB)",
                "code": "UON-MBCHB",
                "tier": "tertiary",
                "levelCode": "Year 1-6",
                "durationYears": 6,
                "credentialAwarded": "MBChB",
                "tuitionPerPeriod": 240,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 155,
                  "registration": 20,
                  "examination": 20,
                  "laboratory": 35,
                  "library": 6,
                  "technology": 4
                },
                "admissionRequirements": [
                  "KCSE Mean Grade A with straight As in Biology, Chemistry, Math"
                ]
              }
            ]
          }
        ]
      }
    ],
    "featuredBadge": "Pioneer University of East Africa",
    "overviewDescription": "Collegiate research university based in Nairobi, recognized as one of the top higher education institutions in Africa."
  },
  {
    "id": "inst-uct-za",
    "name": "University of Cape Town",
    "legalName": "University of Cape Town (UCT)",
    "institutionCode": "UCT-ZA-001",
    "institutionType": "university",
    "supportedTiers": [
      "tertiary",
      "professional_continuing"
    ],
    "country": "South Africa",
    "countryCode": "ZA",
    "state": "Western Cape",
    "city": "Cape Town",
    "address": "Rondebosch, Cape Town, 7700, South Africa",
    "contactEmail": "admissions@uct.ac.za",
    "contactPhone": "+27 21 650 9111",
    "website": "https://www.uct.ac.za",
    "logoUrl": "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=256&q=80",
    "isPublic": true,
    "curriculum": [
      "South African Higher Education (CHE)",
      "SAQA Framework"
    ],
    "instructionLanguage": [
      "English"
    ],
    "isBoarding": true,
    "hasDayOption": true,
    "accreditation": {
      "authority": "Council on Higher Education South Africa (CHE)",
      "registrationNumber": "CHE/HEQC/ZA/001",
      "accreditationStatus": "accredited",
      "validThrough": "2030-12-31",
      "verifiedAt": "2025-01-15T09:00:00Z",
      "officialNotes": "Highest ranked university in Africa."
    },
    "verificationStatus": "VERIFIED",
    "verificationDate": "2025-01-15T09:00:00Z",
    "administratorName": "Prof. Mosa Moshabela (Vice-Chancellor)",
    "administratorEmail": "vc@uct.ac.za",
    "acceptedCurrencies": [
      "USD",
      "PI",
      "ZAR"
    ],
    "supportsPiPayment": true,
    "supportsInstallments": true,
    "activeSessions": [
      {
        "session": "2025",
        "terms": [
          {
            "id": "uct-25-sem1",
            "name": "First Semester",
            "startDate": "2025-02-10",
            "endDate": "2025-06-25",
            "isCurrent": true
          },
          {
            "id": "uct-25-sem2",
            "name": "Second Semester",
            "startDate": "2025-07-20",
            "endDate": "2025-11-30",
            "isCurrent": false
          }
        ]
      }
    ],
    "faculties": [
      {
        "id": "fac-uct-sci",
        "name": "Faculty of Science",
        "departments": [
          {
            "id": "dept-uct-cs",
            "name": "Department of Computer Science",
            "programmes": [
              {
                "id": "prog-uct-cs",
                "name": "B.Sc. in Computer Science & Data Analytics",
                "code": "UCT-CS",
                "tier": "tertiary",
                "levelCode": "1st - 3rd Year",
                "durationYears": 3,
                "credentialAwarded": "B.Sc. (UCT)",
                "tuitionPerPeriod": 160,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 105,
                  "registration": 15,
                  "examination": 15,
                  "laboratory": 15,
                  "library": 6,
                  "technology": 4
                },
                "admissionRequirements": [
                  "NSC with Bachelor endorsement and 70%+ in Mathematics"
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "fac-uct-ebe",
        "name": "Faculty of Engineering & the Built Environment",
        "departments": [
          {
            "id": "dept-uct-elec",
            "name": "Department of Electrical Engineering",
            "programmes": [
              {
                "id": "prog-uct-eng-elec",
                "name": "B.Sc. (Eng) in Mechatronics and Electrical Engineering",
                "code": "UCT-MEC",
                "tier": "tertiary",
                "levelCode": "1st - 4th Year",
                "durationYears": 4,
                "credentialAwarded": "B.Sc. (Eng) Mechatronics",
                "tuitionPerPeriod": 180,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 115,
                  "registration": 15,
                  "examination": 15,
                  "laboratory": 24,
                  "library": 6,
                  "technology": 5
                },
                "admissionRequirements": [
                  "NSC with 80%+ in Mathematics and Physical Science"
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "fac-uct-comm",
        "name": "Faculty of Commerce",
        "departments": [
          {
            "id": "dept-uct-mgt",
            "name": "School of Management Studies",
            "programmes": [
              {
                "id": "prog-uct-bbussc",
                "name": "Bachelor of Business Science (BBusSc) in Finance",
                "code": "UCT-BUS",
                "tier": "tertiary",
                "levelCode": "1st - 4th Year",
                "durationYears": 4,
                "credentialAwarded": "BBusSc (Finance)",
                "tuitionPerPeriod": 150,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 100,
                  "registration": 15,
                  "examination": 15,
                  "library": 12,
                  "technology": 5,
                  "association": 3
                },
                "admissionRequirements": [
                  "NSC Bachelor pass with 75%+ in Mathematics"
                ]
              }
            ]
          }
        ]
      }
    ],
    "featuredBadge": "#1 Ranked University in Africa",
    "overviewDescription": "South Africa's oldest university and premier public research institution, nestled on the slopes of Table Mountain."
  },
  {
    "id": "inst-harvard-us",
    "name": "Harvard University",
    "legalName": "The President and Fellows of Harvard College",
    "institutionCode": "HARV-US-001",
    "institutionType": "university",
    "supportedTiers": [
      "tertiary",
      "professional_continuing"
    ],
    "country": "United States",
    "countryCode": "US",
    "state": "Massachusetts",
    "city": "Cambridge",
    "address": "Massachusetts Hall, Cambridge, MA 02138, USA",
    "contactEmail": "admissions@harvard.edu",
    "contactPhone": "+1 617 495 1000",
    "website": "https://www.harvard.edu",
    "logoUrl": "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=256&q=80",
    "isPublic": false,
    "curriculum": [
      "New England Commission of Higher Education (NECHE)",
      "US Higher Ed Standards"
    ],
    "instructionLanguage": [
      "English"
    ],
    "isBoarding": true,
    "hasDayOption": true,
    "accreditation": {
      "authority": "New England Commission of Higher Education (NECHE)",
      "registrationNumber": "NECHE-US-HARV-001",
      "accreditationStatus": "accredited",
      "validThrough": "2031-10-15",
      "verifiedAt": "2025-01-10T12:00:00Z",
      "officialNotes": "Oldest institution of higher learning in the United States, founded 1636."
    },
    "verificationStatus": "VERIFIED",
    "verificationDate": "2025-01-10T12:00:00Z",
    "administratorName": "Alan M. Garber (President)",
    "administratorEmail": "president@harvard.edu",
    "acceptedCurrencies": [
      "USD",
      "PI"
    ],
    "supportsPiPayment": true,
    "supportsInstallments": true,
    "activeSessions": [
      {
        "session": "2025/2026",
        "terms": [
          {
            "id": "harv-2526-fall",
            "name": "Fall Semester",
            "startDate": "2025-09-01",
            "endDate": "2025-12-20",
            "isCurrent": true
          },
          {
            "id": "harv-2526-spring",
            "name": "Spring Semester",
            "startDate": "2026-01-25",
            "endDate": "2026-05-20",
            "isCurrent": false
          }
        ]
      }
    ],
    "faculties": [
      {
        "id": "fac-harv-seas",
        "name": "John A. Paulson School of Engineering and Applied Sciences",
        "departments": [
          {
            "id": "dept-harv-cs",
            "name": "Computer Science Area",
            "programmes": [
              {
                "id": "prog-harv-cs",
                "name": "A.B. in Computer Science",
                "code": "HARV-CS",
                "tier": "tertiary",
                "levelCode": "Freshman - Senior",
                "durationYears": 4,
                "credentialAwarded": "A.B. (Bachelor of Arts)",
                "tuitionPerPeriod": 450,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 360,
                  "registration": 25,
                  "examination": 20,
                  "laboratory": 25,
                  "library": 12,
                  "technology": 8
                },
                "admissionRequirements": [
                  "Common App with Harvard College Supplement, High School Transcript"
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "fac-harv-fas",
        "name": "Faculty of Arts and Sciences",
        "departments": [
          {
            "id": "dept-harv-econ",
            "name": "Department of Economics",
            "programmes": [
              {
                "id": "prog-harv-econ",
                "name": "A.B. in Economics",
                "code": "HARV-ECON",
                "tier": "tertiary",
                "levelCode": "Freshman - Senior",
                "durationYears": 4,
                "credentialAwarded": "A.B. in Economics",
                "tuitionPerPeriod": 430,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 350,
                  "registration": 25,
                  "examination": 20,
                  "library": 20,
                  "technology": 10,
                  "association": 5
                },
                "admissionRequirements": [
                  "Rigorous High School Calculus & Advanced Social Sciences"
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "fac-harv-law",
        "name": "Harvard Law School",
        "departments": [
          {
            "id": "dept-harv-law-prog",
            "name": "Department of Law",
            "programmes": [
              {
                "id": "prog-harv-jd",
                "name": "Juris Doctor (JD)",
                "code": "HARV-JD",
                "tier": "tertiary",
                "levelCode": "1L - 3L",
                "durationYears": 3,
                "credentialAwarded": "Juris Doctor",
                "tuitionPerPeriod": 500,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 420,
                  "registration": 30,
                  "examination": 20,
                  "library": 20,
                  "technology": 10
                },
                "admissionRequirements": [
                  "Undergraduate Degree, LSAT / GRE Score, Dean Certification"
                ]
              }
            ]
          }
        ]
      }
    ],
    "featuredBadge": "Ivy League Premier Institution",
    "overviewDescription": "Global leader in higher education and research, committed to excellence in teaching, learning, and developing leaders who make a difference."
  },
  {
    "id": "inst-uoft-ca",
    "name": "University of Toronto",
    "legalName": "The Governing Council of the University of Toronto",
    "institutionCode": "UFT-CA-001",
    "institutionType": "university",
    "supportedTiers": [
      "tertiary",
      "professional_continuing"
    ],
    "country": "Canada",
    "countryCode": "CA",
    "state": "Ontario",
    "city": "Toronto",
    "address": "27 King's College Circle, Toronto, ON M5S 1A1, Canada",
    "contactEmail": "admissions@utoronto.ca",
    "contactPhone": "+1 416 978 2011",
    "website": "https://www.utoronto.ca",
    "logoUrl": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=256&q=80",
    "isPublic": true,
    "curriculum": [
      "Ontario Universities Council on Quality Assurance",
      "Canadian Degree Standards"
    ],
    "instructionLanguage": [
      "English"
    ],
    "isBoarding": true,
    "hasDayOption": true,
    "accreditation": {
      "authority": "Ontario Universities Council on Quality Assurance",
      "registrationNumber": "OUCQA-CA-001",
      "accreditationStatus": "accredited",
      "validThrough": "2030-06-30",
      "verifiedAt": "2025-01-12T10:00:00Z",
      "officialNotes": "Top Canadian public research university."
    },
    "verificationStatus": "VERIFIED",
    "verificationDate": "2025-01-12T10:00:00Z",
    "administratorName": "Meric Gertler (President)",
    "administratorEmail": "president@utoronto.ca",
    "acceptedCurrencies": [
      "USD",
      "PI",
      "CAD"
    ],
    "supportsPiPayment": true,
    "supportsInstallments": true,
    "activeSessions": [
      {
        "session": "2025/2026",
        "terms": [
          {
            "id": "uoft-2526-fall",
            "name": "Fall Term",
            "startDate": "2025-09-08",
            "endDate": "2025-12-22",
            "isCurrent": true
          },
          {
            "id": "uoft-2526-winter",
            "name": "Winter Term",
            "startDate": "2026-01-10",
            "endDate": "2026-04-30",
            "isCurrent": false
          }
        ]
      }
    ],
    "faculties": [
      {
        "id": "fac-uoft-fas",
        "name": "Faculty of Arts & Science",
        "departments": [
          {
            "id": "dept-uoft-cs",
            "name": "Department of Computer Science",
            "programmes": [
              {
                "id": "prog-uoft-cs",
                "name": "Honours B.Sc. in Computer Science",
                "code": "UOFT-CS",
                "tier": "tertiary",
                "levelCode": "Year 1-4",
                "durationYears": 4,
                "credentialAwarded": "Honours B.Sc. Computer Science",
                "tuitionPerPeriod": 320,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 245,
                  "registration": 20,
                  "examination": 20,
                  "laboratory": 20,
                  "library": 10,
                  "technology": 5
                },
                "admissionRequirements": [
                  "Ontario Grade 12 Advanced Functions and Calculus with 90%+"
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "fac-uoft-fase",
        "name": "Faculty of Applied Science & Engineering",
        "departments": [
          {
            "id": "dept-uoft-ece",
            "name": "The Edward S. Rogers Sr. Dept of Electrical & Computer Engineering",
            "programmes": [
              {
                "id": "prog-uoft-ece",
                "name": "B.A.Sc. in Computer Engineering",
                "code": "UOFT-ECE",
                "tier": "tertiary",
                "levelCode": "Year 1-4",
                "durationYears": 4,
                "credentialAwarded": "B.A.Sc. (Engineering)",
                "tuitionPerPeriod": 340,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 260,
                  "registration": 20,
                  "examination": 20,
                  "laboratory": 25,
                  "library": 10,
                  "technology": 5
                },
                "admissionRequirements": [
                  "Grade 12 Physics, Chemistry, Calculus with minimum 92% average"
                ]
              }
            ]
          }
        ]
      }
    ],
    "featuredBadge": "#1 Ranked University in Canada",
    "overviewDescription": "Canada's leading institution of learning, discovery and knowledge creation, home to one of the world's strongest research faculties."
  },
  {
    "id": "inst-cairo-eg",
    "name": "Cairo University",
    "legalName": "Cairo University Arab Republic of Egypt",
    "institutionCode": "CU-EG-001",
    "institutionType": "university",
    "supportedTiers": [
      "tertiary",
      "professional_continuing"
    ],
    "country": "Egypt",
    "countryCode": "EG",
    "state": "Giza",
    "city": "Giza",
    "address": "Gamaa Street, Giza, 12613, Egypt",
    "contactEmail": "info@cu.edu.eg",
    "contactPhone": "+20 2 3567 6105",
    "website": "https://cu.edu.eg",
    "logoUrl": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=256&q=80",
    "isPublic": true,
    "curriculum": [
      "Supreme Council of Universities Egypt (SCU)",
      "National Authority (NAQAAE)"
    ],
    "instructionLanguage": [
      "Arabic",
      "English"
    ],
    "isBoarding": true,
    "hasDayOption": true,
    "accreditation": {
      "authority": "National Authority for Quality Assurance and Accreditation of Education (NAQAAE)",
      "registrationNumber": "NAQAAE-EG-001",
      "accreditationStatus": "accredited",
      "validThrough": "2029-08-30",
      "verifiedAt": "2025-01-14T08:00:00Z",
      "officialNotes": "Egypt's premier public university founded in 1908."
    },
    "verificationStatus": "VERIFIED",
    "verificationDate": "2025-01-14T08:00:00Z",
    "administratorName": "Prof. Mohamed Sami Abdel Sadek (President)",
    "administratorEmail": "president@cu.edu.eg",
    "acceptedCurrencies": [
      "USD",
      "PI",
      "EGP"
    ],
    "supportsPiPayment": true,
    "supportsInstallments": true,
    "activeSessions": [
      {
        "session": "2025/2026",
        "terms": [
          {
            "id": "cu-2526-s1",
            "name": "First Term",
            "startDate": "2025-10-01",
            "endDate": "2026-01-20",
            "isCurrent": true
          },
          {
            "id": "cu-2526-s2",
            "name": "Second Term",
            "startDate": "2026-02-10",
            "endDate": "2026-06-15",
            "isCurrent": false
          }
        ]
      }
    ],
    "faculties": [
      {
        "id": "fac-cairo-fcai",
        "name": "Faculty of Computers and Artificial Intelligence",
        "departments": [
          {
            "id": "dept-cairo-cs",
            "name": "Department of Computer Science & AI",
            "programmes": [
              {
                "id": "prog-cairo-cs",
                "name": "B.Sc. Computer Science & Artificial Intelligence",
                "code": "CU-CS",
                "tier": "tertiary",
                "levelCode": "Level 1-4",
                "durationYears": 4,
                "credentialAwarded": "B.Sc. Computer Science",
                "tuitionPerPeriod": 125,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 80,
                  "registration": 15,
                  "examination": 12,
                  "laboratory": 12,
                  "library": 4,
                  "technology": 2
                },
                "admissionRequirements": [
                  "Egyptian Thanaweya Amma (Math Section) with 92%+"
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "fac-cairo-eng",
        "name": "Faculty of Engineering",
        "departments": [
          {
            "id": "dept-cairo-electronics",
            "name": "Department of Electronics & Communications Engineering",
            "programmes": [
              {
                "id": "prog-cairo-ece",
                "name": "B.Sc. Electronics and Communications Engineering",
                "code": "CU-ECE",
                "tier": "tertiary",
                "levelCode": "Level 1-5",
                "durationYears": 5,
                "credentialAwarded": "B.Sc. Engineering",
                "tuitionPerPeriod": 150,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 95,
                  "registration": 15,
                  "examination": 15,
                  "laboratory": 18,
                  "library": 5,
                  "technology": 2
                },
                "admissionRequirements": [
                  "Thanaweya Amma Math Track High Merit Placement"
                ]
              }
            ]
          }
        ]
      }
    ],
    "featuredBadge": "Historic Gateway of Knowledge",
    "overviewDescription": "Egypt's premier public university, nurturing world leaders and Nobel laureates across the Middle East and North Africa."
  },
  {
    "id": "inst-ur-rw",
    "name": "University of Rwanda",
    "legalName": "University of Rwanda (UR)",
    "institutionCode": "UR-RW-001",
    "institutionType": "university",
    "supportedTiers": [
      "tertiary",
      "technical_vocational"
    ],
    "country": "Rwanda",
    "countryCode": "RW",
    "state": "Kigali",
    "city": "Kigali",
    "address": "KK 737 Street, Gikondo, Kigali, Rwanda",
    "contactEmail": "admissions@ur.ac.rw",
    "contactPhone": "+250 788 304 316",
    "website": "https://ur.ac.rw",
    "logoUrl": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=256&q=80",
    "isPublic": true,
    "curriculum": [
      "Higher Education Council of Rwanda (HEC)",
      "East African Standards"
    ],
    "instructionLanguage": [
      "English"
    ],
    "isBoarding": true,
    "hasDayOption": true,
    "accreditation": {
      "authority": "Higher Education Council Rwanda (HEC)",
      "registrationNumber": "HEC-RW-PUB-001",
      "accreditationStatus": "accredited",
      "validThrough": "2029-12-31",
      "verifiedAt": "2025-01-16T11:30:00Z",
      "officialNotes": "National multi-campus university of Rwanda."
    },
    "verificationStatus": "VERIFIED",
    "verificationDate": "2025-01-16T11:30:00Z",
    "administratorName": "Dr. Didas Muganga Kayihura (Vice-Chancellor)",
    "administratorEmail": "vc@ur.ac.rw",
    "acceptedCurrencies": [
      "USD",
      "PI",
      "RWF"
    ],
    "supportsPiPayment": true,
    "supportsInstallments": true,
    "activeSessions": [
      {
        "session": "2025/2026",
        "terms": [
          {
            "id": "ur-2526-s1",
            "name": "Trimester 1",
            "startDate": "2025-09-15",
            "endDate": "2025-12-20",
            "isCurrent": true
          },
          {
            "id": "ur-2526-s2",
            "name": "Trimester 2",
            "startDate": "2026-01-10",
            "endDate": "2026-04-15",
            "isCurrent": false
          }
        ]
      }
    ],
    "faculties": [
      {
        "id": "fac-ur-cst",
        "name": "College of Science and Technology (CST)",
        "departments": [
          {
            "id": "dept-ur-ict",
            "name": "School of ICT - Dept of Computer Science",
            "programmes": [
              {
                "id": "prog-ur-cs",
                "name": "B.Sc. (Hons) in Computer Science & Systems",
                "code": "UR-CS",
                "tier": "tertiary",
                "levelCode": "Year 1-4",
                "durationYears": 4,
                "credentialAwarded": "B.Sc. (Hons) Computer Science",
                "tuitionPerPeriod": 115,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 75,
                  "registration": 12,
                  "examination": 12,
                  "laboratory": 10,
                  "library": 4,
                  "technology": 2
                },
                "admissionRequirements": [
                  "Rwanda Advanced Level (A2) with two principal passes in Math and Physics"
                ]
              }
            ]
          },
          {
            "id": "dept-ur-eng",
            "name": "School of Engineering - Dept of Civil Engineering",
            "programmes": [
              {
                "id": "prog-ur-civil",
                "name": "B.Sc. (Hons) in Civil Engineering",
                "code": "UR-CIVIL",
                "tier": "tertiary",
                "levelCode": "Year 1-4",
                "durationYears": 4,
                "credentialAwarded": "B.Sc. (Hons) Civil Engineering",
                "tuitionPerPeriod": 125,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 80,
                  "registration": 12,
                  "examination": 12,
                  "laboratory": 15,
                  "library": 4,
                  "technology": 2
                },
                "admissionRequirements": [
                  "A2 Certificate in PCM (Physics, Chemistry, Math)"
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "fac-ur-cbe",
        "name": "College of Business and Economics (CBE)",
        "departments": [
          {
            "id": "dept-ur-bank",
            "name": "School of Business - Dept of Banking & Finance",
            "programmes": [
              {
                "id": "prog-ur-fin",
                "name": "B.Sc. (Hons) in Banking and Finance",
                "code": "UR-FIN",
                "tier": "tertiary",
                "levelCode": "Year 1-3",
                "durationYears": 3,
                "credentialAwarded": "B.Sc. (Hons) Banking & Finance",
                "tuitionPerPeriod": 105,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 70,
                  "registration": 12,
                  "examination": 10,
                  "library": 8,
                  "technology": 3,
                  "association": 2
                },
                "admissionRequirements": [
                  "A2 Certificate in MEG or MPG with good pass in Mathematics"
                ]
              }
            ]
          }
        ]
      }
    ],
    "featuredBadge": "Rwanda Innovation Hub",
    "overviewDescription": "Rwanda's sole public university, leading East Africa in digital transformation, green technology, and applied research."
  },
  {
    "id": "inst-mak-ug",
    "name": "Makerere University",
    "legalName": "Makerere University Kampala",
    "institutionCode": "MAK-UG-001",
    "institutionType": "university",
    "supportedTiers": [
      "tertiary",
      "professional_continuing"
    ],
    "country": "Uganda",
    "countryCode": "UG",
    "state": "Kampala",
    "city": "Kampala",
    "address": "University Road, Makerere, Kampala, Uganda",
    "contactEmail": "admissions@mak.ac.ug",
    "contactPhone": "+256 414 532 634",
    "website": "https://mak.ac.ug",
    "logoUrl": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=256&q=80",
    "isPublic": true,
    "curriculum": [
      "National Council for Higher Education Uganda (NCHE)"
    ],
    "instructionLanguage": [
      "English"
    ],
    "isBoarding": true,
    "hasDayOption": true,
    "accreditation": {
      "authority": "National Council for Higher Education Uganda (NCHE)",
      "registrationNumber": "NCHE-UG-PUB-001",
      "accreditationStatus": "accredited",
      "validThrough": "2029-11-30",
      "verifiedAt": "2025-01-17T09:30:00Z",
      "officialNotes": "One of the oldest and most prestigious universities in Africa, founded 1922."
    },
    "verificationStatus": "VERIFIED",
    "verificationDate": "2025-01-17T09:30:00Z",
    "administratorName": "Prof. Barnabas Nawangwe (Vice-Chancellor)",
    "administratorEmail": "vc@mak.ac.ug",
    "acceptedCurrencies": [
      "USD",
      "PI",
      "UGX"
    ],
    "supportsPiPayment": true,
    "supportsInstallments": true,
    "activeSessions": [
      {
        "session": "2025/2026",
        "terms": [
          {
            "id": "mak-2526-s1",
            "name": "Semester 1",
            "startDate": "2025-08-25",
            "endDate": "2025-12-18",
            "isCurrent": true
          },
          {
            "id": "mak-2526-s2",
            "name": "Semester 2",
            "startDate": "2026-01-20",
            "endDate": "2026-05-30",
            "isCurrent": false
          }
        ]
      }
    ],
    "faculties": [
      {
        "id": "fac-mak-cocis",
        "name": "College of Computing and Information Sciences (CoCIS)",
        "departments": [
          {
            "id": "dept-mak-cs",
            "name": "School of Computing and Informatics Technology",
            "programmes": [
              {
                "id": "prog-mak-cs",
                "name": "B.Sc. in Computer Science",
                "code": "MAK-CS",
                "tier": "tertiary",
                "levelCode": "Year 1-3",
                "durationYears": 3,
                "credentialAwarded": "B.Sc. Computer Science",
                "tuitionPerPeriod": 120,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 78,
                  "registration": 14,
                  "examination": 12,
                  "laboratory": 10,
                  "library": 4,
                  "technology": 2
                },
                "admissionRequirements": [
                  "UACE with two principal passes in Mathematics and Physics"
                ]
              },
              {
                "id": "prog-mak-se",
                "name": "B.Sc. in Software Engineering",
                "code": "MAK-SE",
                "tier": "tertiary",
                "levelCode": "Year 1-4",
                "durationYears": 4,
                "credentialAwarded": "B.Sc. Software Engineering",
                "tuitionPerPeriod": 130,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 82,
                  "registration": 14,
                  "examination": 14,
                  "laboratory": 12,
                  "library": 5,
                  "technology": 3
                },
                "admissionRequirements": [
                  "UACE Principal passes in Mathematics and Economics or Physics"
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "fac-mak-cedat",
        "name": "College of Engineering, Design, Art and Technology (CEDAT)",
        "departments": [
          {
            "id": "dept-mak-elec",
            "name": "Department of Electrical & Computer Engineering",
            "programmes": [
              {
                "id": "prog-mak-eee",
                "name": "B.Sc. in Electrical Engineering",
                "code": "MAK-EEE",
                "tier": "tertiary",
                "levelCode": "Year 1-4",
                "durationYears": 4,
                "credentialAwarded": "B.Sc. Electrical Engineering",
                "tuitionPerPeriod": 140,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 90,
                  "registration": 14,
                  "examination": 14,
                  "laboratory": 16,
                  "library": 4,
                  "technology": 2
                },
                "admissionRequirements": [
                  "UACE Principal passes in Math and Physics with high cut-off points"
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "fac-mak-chs",
        "name": "College of Health Sciences",
        "departments": [
          {
            "id": "dept-mak-med",
            "name": "School of Medicine",
            "programmes": [
              {
                "id": "prog-mak-mbchb",
                "name": "Bachelor of Medicine and Bachelor of Surgery (MBChB)",
                "code": "MAK-MBCHB",
                "tier": "tertiary",
                "levelCode": "Year 1-5",
                "durationYears": 5,
                "credentialAwarded": "MBChB",
                "tuitionPerPeriod": 210,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 135,
                  "registration": 20,
                  "examination": 20,
                  "laboratory": 25,
                  "library": 6,
                  "technology": 4
                },
                "admissionRequirements": [
                  "UACE Essential principal passes in Biology and Chemistry"
                ]
              }
            ]
          }
        ]
      }
    ],
    "featuredBadge": "The Pride of East Africa",
    "overviewDescription": "Uganda's largest and oldest collegiate university, celebrated internationally for its medical, scientific, and humanities breakthroughs."
  },
  {
    "id": "inst-udsm-tz",
    "name": "University of Dar es Salaam",
    "legalName": "The Council of the University of Dar es Salaam",
    "institutionCode": "UDSM-TZ-001",
    "institutionType": "university",
    "supportedTiers": [
      "tertiary",
      "professional_continuing"
    ],
    "country": "Tanzania",
    "countryCode": "TZ",
    "state": "Dar es Salaam",
    "city": "Dar es Salaam",
    "address": "Mwalimu J.K. Nyerere Mlimani Campus, Dar es Salaam, Tanzania",
    "contactEmail": "admissions@udsm.ac.tz",
    "contactPhone": "+255 22 241 0500",
    "website": "https://www.udsm.ac.tz",
    "logoUrl": "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=256&q=80",
    "isPublic": true,
    "curriculum": [
      "Tanzania Commission for Universities (TCU)"
    ],
    "instructionLanguage": [
      "English",
      "Swahili"
    ],
    "isBoarding": true,
    "hasDayOption": true,
    "accreditation": {
      "authority": "Tanzania Commission for Universities (TCU)",
      "registrationNumber": "TCU-TZ-PUB-001",
      "accreditationStatus": "accredited",
      "validThrough": "2029-10-31",
      "verifiedAt": "2025-01-18T10:00:00Z",
      "officialNotes": "Oldest public university in Tanzania, established 1961."
    },
    "verificationStatus": "VERIFIED",
    "verificationDate": "2025-01-18T10:00:00Z",
    "administratorName": "Prof. William A.L. Anangisye (Vice-Chancellor)",
    "administratorEmail": "vc@udsm.ac.tz",
    "acceptedCurrencies": [
      "USD",
      "PI",
      "TZS"
    ],
    "supportsPiPayment": true,
    "supportsInstallments": true,
    "activeSessions": [
      {
        "session": "2025/2026",
        "terms": [
          {
            "id": "udsm-2526-s1",
            "name": "Semester 1",
            "startDate": "2025-11-01",
            "endDate": "2026-03-15",
            "isCurrent": true
          },
          {
            "id": "udsm-2526-s2",
            "name": "Semester 2",
            "startDate": "2026-04-01",
            "endDate": "2026-07-30",
            "isCurrent": false
          }
        ]
      }
    ],
    "faculties": [
      {
        "id": "fac-udsm-coict",
        "name": "College of Information and Communication Technologies (CoICT)",
        "departments": [
          {
            "id": "dept-udsm-cse",
            "name": "Department of Computer Science and Engineering",
            "programmes": [
              {
                "id": "prog-udsm-cs",
                "name": "B.Sc. in Computer Science",
                "code": "UDSM-CS",
                "tier": "tertiary",
                "levelCode": "Year 1-3",
                "durationYears": 3,
                "credentialAwarded": "B.Sc. Computer Science",
                "tuitionPerPeriod": 115,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 75,
                  "registration": 12,
                  "examination": 12,
                  "laboratory": 10,
                  "library": 4,
                  "technology": 2
                },
                "admissionRequirements": [
                  "ACSEE with two principal passes in Advanced Mathematics and Physics"
                ]
              },
              {
                "id": "prog-udsm-telecom",
                "name": "B.Sc. in Telecommunications Engineering",
                "code": "UDSM-TEL",
                "tier": "tertiary",
                "levelCode": "Year 1-4",
                "durationYears": 4,
                "credentialAwarded": "B.Sc. Telecommunications Engineering",
                "tuitionPerPeriod": 125,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 80,
                  "registration": 12,
                  "examination": 12,
                  "laboratory": 15,
                  "library": 4,
                  "technology": 2
                },
                "admissionRequirements": [
                  "ACSEE passes in Advanced Mathematics and Physics with grade C or better"
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "fac-udsm-coet",
        "name": "College of Engineering and Technology (CoET)",
        "departments": [
          {
            "id": "dept-udsm-mech",
            "name": "Department of Mechanical and Industrial Engineering",
            "programmes": [
              {
                "id": "prog-udsm-mech",
                "name": "B.Sc. in Mechanical Engineering",
                "code": "UDSM-MECH",
                "tier": "tertiary",
                "levelCode": "Year 1-4",
                "durationYears": 4,
                "credentialAwarded": "B.Sc. Mechanical Engineering",
                "tuitionPerPeriod": 130,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 82,
                  "registration": 12,
                  "examination": 14,
                  "laboratory": 16,
                  "library": 4,
                  "technology": 2
                },
                "admissionRequirements": [
                  "ACSEE with Principal passes in Physics, Chemistry, and Advanced Mathematics"
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "fac-udsm-udbs",
        "name": "University of Dar es Salaam Business School (UDBS)",
        "departments": [
          {
            "id": "dept-udsm-fin",
            "name": "Department of Finance",
            "programmes": [
              {
                "id": "prog-udsm-bcom",
                "name": "Bachelor of Commerce (B.Com) in Finance",
                "code": "UDSM-BCOM",
                "tier": "tertiary",
                "levelCode": "Year 1-3",
                "durationYears": 3,
                "credentialAwarded": "B.Com (Finance)",
                "tuitionPerPeriod": 110,
                "currency": "USD",
                "feePeriod": "per semester",
                "feeSchedule": {
                  "tuition": 72,
                  "registration": 12,
                  "examination": 12,
                  "library": 8,
                  "technology": 3,
                  "association": 3
                },
                "admissionRequirements": [
                  "ACSEE with passes in Economics, Accountancy, or Advanced Mathematics"
                ]
              }
            ]
          }
        ]
      }
    ],
    "featuredBadge": "Premier Higher Learning in Tanzania",
    "overviewDescription": "The oldest and largest public university in Tanzania, situated on the scenic Mlimani hill overlooking the city of Dar es Salaam."
  }
];
