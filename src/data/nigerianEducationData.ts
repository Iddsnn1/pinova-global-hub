import { UtilityServiceProvider } from '../types/utility';

export const NIGERIAN_EDUCATION_PROVIDERS: UtilityServiceProvider[] = [
  {
    "id": "prov-edu-ng-bayero-university-kano-buk",
    "name": "Bayero University Kano (BUK) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kano",
    "subdivisionCode": "NG-KN",
    "supportedStates": [
      "Kano"
    ],
    "supportedSubdivisions": [
      "NG-KN"
    ],
    "institutionName": "Bayero University Kano (BUK)",
    "institutionCode": "BUK",
    "institutionType": "university",
    "institutionAliases": [
      "BUK",
      "Bayero",
      "Kano",
      "Bayero University Kano"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Reg No / Admission Number",
    "accountPlaceholder": "e.g. CKS/BUS/21/0012 or BUK/2024/9912",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Semester Tuition Fee Clearance",
      "Fresh Student Acceptance Fee",
      "Hostel Accommodation Pass",
      "Statement of Result / Transcript Token"
    ],
    "packages": [
      {
        "id": "pkg-edu-buk-1",
        "name": "BUK $25 Portal Fee Token",
        "description": "Direct student portal tuition clearance",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-buk-2",
        "name": "BUK $100 Full Semester Clearance",
        "description": "Full semester tuition fee settlement",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-yusuf-maitama-sule-univ-kano",
    "name": "Yusuf Maitama Sule University Kano",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kano",
    "subdivisionCode": "NG-KN",
    "supportedStates": [
      "Kano"
    ],
    "supportedSubdivisions": [
      "NG-KN"
    ],
    "institutionName": "Yusuf Maitama Sule University Kano (YUMSUK)",
    "institutionCode": "YUMSUK",
    "institutionType": "university",
    "institutionAliases": [
      "YUMSUK",
      "NWU",
      "North West Univ",
      "Yusuf Maitama Sule"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric No",
    "accountPlaceholder": "Enter YUMSUK student ID",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Postgraduate Application Fee",
      "Portal Clearance Levy"
    ],
    "packages": [
      {
        "id": "pkg-edu-yumsuk-1",
        "name": "YUMSUK $30 Portal Clearance",
        "description": "Student fee portal credit",
        "fiatPrice": 30,
        "currency": "USD",
        "validity": "Instant"
      },
      {
        "id": "pkg-edu-yumsuk-2",
        "name": "YUMSUK $100 Semester Tuition Deposit",
        "description": "Full semester fee clearance",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-kust-wudil-adustech",
    "name": "Aliko Dangote Univ of Science & Tech (ADUSTECH/KUST)",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kano",
    "subdivisionCode": "NG-KN",
    "supportedStates": [
      "Kano"
    ],
    "supportedSubdivisions": [
      "NG-KN"
    ],
    "institutionName": "Aliko Dangote University of Science and Technology, Wudil",
    "institutionCode": "ADUSTECH",
    "institutionType": "university",
    "institutionAliases": [
      "KUST",
      "ADUSTECH",
      "Wudil",
      "Kano University of Science and Technology",
      "Dangote University"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Reg / Matric No",
    "accountPlaceholder": "e.g. KUST/UG/2024/0142",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Science & Tech Tuition Clearance",
      "Undergraduate Acceptance Fee",
      "Hostel & Utility Maintenance Levy",
      "Academic Transcript Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-adustech-1",
        "name": "ADUSTECH $25 Portal Voucher",
        "description": "Direct fee clearance voucher",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant"
      },
      {
        "id": "pkg-edu-adustech-2",
        "name": "ADUSTECH $100 Tuition Deposit",
        "description": "Semester tuition deposit",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-skyline-university-nigeria",
    "name": "Skyline University Nigeria (SUN Kano)",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kano",
    "subdivisionCode": "NG-KN",
    "supportedStates": [
      "Kano"
    ],
    "supportedSubdivisions": [
      "NG-KN"
    ],
    "institutionName": "Skyline University Nigeria (SUN)",
    "institutionCode": "SUN",
    "institutionType": "university",
    "institutionAliases": [
      "SUN",
      "Skyline",
      "Skyline Kano",
      "Skyline University"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Registration / Student ID",
    "accountPlaceholder": "Enter SUN Kano student ID",
    "minCustomFiat": 1,
    "maxCustomFiat": 1000,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "Degree Tuition Settlement",
      "International Student Fee",
      "Admission Acceptance Fee",
      "Student Resource Pass"
    ],
    "packages": [
      {
        "id": "pkg-edu-sun-1",
        "name": "SUN Kano $50 Tuition Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 50,
        "currency": "USD",
        "validity": "Instant"
      },
      {
        "id": "pkg-edu-sun-2",
        "name": "SUN Kano $150 Semester Clearance",
        "description": "Tuition installment payment",
        "fiatPrice": 150,
        "currency": "USD",
        "validity": "Instant",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-maryam-abacha-american-univ",
    "name": "Maryam Abacha American University of Nigeria (MAAUN Kano)",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kano",
    "subdivisionCode": "NG-KN",
    "supportedStates": [
      "Kano"
    ],
    "supportedSubdivisions": [
      "NG-KN"
    ],
    "institutionName": "Maryam Abacha American University of Nigeria",
    "institutionCode": "MAAUN",
    "institutionType": "university",
    "institutionAliases": [
      "MAAUN",
      "Maryam Abacha",
      "MAAUN Kano"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "MAAUN Matric / Applicant ID",
    "accountPlaceholder": "Enter MAAUN student ID",
    "minCustomFiat": 1,
    "maxCustomFiat": 1000,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "Medical & Health Sciences Tuition Deposit",
      "Undergraduate Tuition Clearance",
      "Campus Accommodation Levy",
      "Matriculation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-maaun-1",
        "name": "MAAUN $50 Tuition Pass",
        "description": "Direct fee credit",
        "fiatPrice": 50,
        "currency": "USD",
        "validity": "Instant"
      },
      {
        "id": "pkg-edu-maaun-2",
        "name": "MAAUN $120 Semester Deposit",
        "description": "Undergraduate tuition settlement",
        "fiatPrice": 120,
        "currency": "USD",
        "validity": "Instant",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-capital-city-university-kano",
    "name": "Capital City University Kano (CCUK)",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kano",
    "subdivisionCode": "NG-KN",
    "supportedStates": [
      "Kano"
    ],
    "supportedSubdivisions": [
      "NG-KN"
    ],
    "institutionName": "Capital City University Kano",
    "institutionCode": "CCUK",
    "institutionType": "university",
    "institutionAliases": [
      "CCUK",
      "Capital City",
      "Capital City Kano"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "CCUK Student Reg No",
    "accountPlaceholder": "Enter CCUK student ID",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "Tuition Fee Clearance",
      "Acceptance Fee Deposit",
      "Hostel Fee Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ccuk-1",
        "name": "CCUK $40 Portal Credit",
        "description": "Direct fee voucher",
        "fiatPrice": 40,
        "currency": "USD",
        "validity": "Instant"
      }
    ]
  },
  {
    "id": "prov-edu-ng-kano-state-polytechnic",
    "name": "Kano State Polytechnic Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kano",
    "subdivisionCode": "NG-KN",
    "supportedStates": [
      "Kano"
    ],
    "supportedSubdivisions": [
      "NG-KN"
    ],
    "institutionName": "Kano State Polytechnic",
    "institutionCode": "KANOPOLY",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Kano Poly",
      "Kano State Poly",
      "KANOPOLY"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Reg / Matriculation No",
    "accountPlaceholder": "Enter Kano Poly student ID",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "ND / HND Tuition Settlement",
      "Acceptance Fee Deposit",
      "Polytechnic Exam Fee",
      "Transcript Verification Pass"
    ],
    "packages": [
      {
        "id": "pkg-edu-kanopoly-1",
        "name": "Kano Poly $20 Fee Voucher",
        "description": "Direct fee clearance deposit",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant"
      },
      {
        "id": "pkg-edu-kanopoly-2",
        "name": "Kano Poly $60 Semester Clearance",
        "description": "ND/HND Tuition Fee Deposit",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-audu-bako-college-agric-danbatta",
    "name": "Audu Bako College of Agriculture Danbatta (ABCOA)",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kano",
    "subdivisionCode": "NG-KN",
    "supportedStates": [
      "Kano"
    ],
    "supportedSubdivisions": [
      "NG-KN"
    ],
    "institutionName": "Audu Bako College of Agriculture Danbatta",
    "institutionCode": "ABCOA",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "ABCOA",
      "Audu Bako",
      "Danbatta",
      "Agric Danbatta"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Admission No",
    "accountPlaceholder": "Enter ABCOA student number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "Agricultural Tech ND/HND Tuition",
      "Field Practical Clearance",
      "Student Portal Registration"
    ],
    "packages": [
      {
        "id": "pkg-edu-abcoa-1",
        "name": "ABCOA $20 Registration Voucher",
        "description": "Agric polytechnic fee pass",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant"
      }
    ]
  },
  {
    "id": "prov-edu-ng-kano-state-college-health-tech",
    "name": "Kano State College of Health Sciences & Technology",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kano",
    "subdivisionCode": "NG-KN",
    "supportedStates": [
      "Kano"
    ],
    "supportedSubdivisions": [
      "NG-KN"
    ],
    "institutionName": "Kano State College of Health Sciences and Technology",
    "institutionCode": "KASTECH",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "KASTECH",
      "School of Hygiene Kano",
      "Health Tech Kano",
      "School of Health Tech"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Reg / Index No",
    "accountPlaceholder": "Enter Health Tech student ID",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "Health Technology Tuition Clearance",
      "Clinical Practicum Levy",
      "Acceptance Fee Deposit"
    ],
    "packages": [
      {
        "id": "pkg-edu-kastech-1",
        "name": "Health Tech Kano $25 Fee Credit",
        "description": "Direct student fee deposit",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant"
      }
    ]
  },
  {
    "id": "prov-edu-ng-saadatu-rimi-college-kano",
    "name": "Sa'adatu Rimi College of Education Kumbotso (SRCOE)",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kano",
    "subdivisionCode": "NG-KN",
    "supportedStates": [
      "Kano"
    ],
    "supportedSubdivisions": [
      "NG-KN"
    ],
    "institutionName": "Sa'adatu Rimi College of Education Kano",
    "institutionCode": "SRCOE",
    "institutionType": "college",
    "institutionAliases": [
      "SRCOE",
      "Saadatu Rimi",
      "Kumbotso",
      "SRCLOE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Degree Reg No",
    "accountPlaceholder": "Enter student ID",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE Tuition Clearance",
      "Degree Program Registration Fee",
      "Teaching Practice Levy"
    ],
    "packages": [
      {
        "id": "pkg-edu-srcoe-1",
        "name": "SRCOE $15 Tuition Pass",
        "description": "College fee clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant"
      }
    ]
  },
  {
    "id": "prov-edu-ng-federal-college-of-education-kano",
    "name": "Federal College of Education (FCE) Kano Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kano",
    "subdivisionCode": "NG-KN",
    "supportedStates": [
      "Kano"
    ],
    "supportedSubdivisions": [
      "NG-KN"
    ],
    "institutionName": "Federal College of Education Kano",
    "institutionCode": "FCEKANO",
    "institutionType": "college",
    "institutionAliases": [
      "FCE Kano",
      "FCE",
      "Federal College Kano",
      "FCEK"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Degree Matric No",
    "accountPlaceholder": "e.g. FCEK/NCE/2024/0821",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "NCE / Degree Tuition Deposit",
      "Acceptance Fee Clearance",
      "Hostel Fee Clearance",
      "Teaching Practice Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-fcekano-1",
        "name": "FCE Kano $20 Fee Voucher",
        "description": "Direct student fee deposit",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant"
      },
      {
        "id": "pkg-edu-fcekano-2",
        "name": "FCE Kano $50 Semester Clearance",
        "description": "NCE tuition clearance",
        "fiatPrice": 50,
        "currency": "USD",
        "validity": "Instant",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fce-technical-bichi-kano",
    "name": "Federal College of Education (Technical) Bichi",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kano",
    "subdivisionCode": "NG-KN",
    "supportedStates": [
      "Kano"
    ],
    "supportedSubdivisions": [
      "NG-KN"
    ],
    "institutionName": "Federal College of Education (Technical) Bichi",
    "institutionCode": "FCETBICHI",
    "institutionType": "college",
    "institutionAliases": [
      "FCET Bichi",
      "FCE Bichi",
      "Bichi",
      "Technical College Bichi"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Reg / Matric No",
    "accountPlaceholder": "Enter FCET Bichi student ID",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "Technical Education Tuition Pass",
      "Science Lab & Workshop Levy",
      "Student Clearance Deposit"
    ],
    "packages": [
      {
        "id": "pkg-edu-fcetbichi-1",
        "name": "FCET Bichi $20 Fee Voucher",
        "description": "Technical tuition clearance",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant"
      }
    ]
  },
  {
    "id": "prov-edu-ng-aminu-kano-college-islamic-legal",
    "name": "Aminu Kano College of Islamic & Legal Studies (AKCILS)",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kano",
    "subdivisionCode": "NG-KN",
    "supportedStates": [
      "Kano"
    ],
    "supportedSubdivisions": [
      "NG-KN"
    ],
    "institutionName": "Aminu Kano College of Islamic and Legal Studies",
    "institutionCode": "AKCILS",
    "institutionType": "college",
    "institutionAliases": [
      "AKCILS",
      "Aminu Kano College",
      "Legal Studies Kano",
      "Sharia College"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Diploma / NCE Reg No",
    "accountPlaceholder": "Enter AKCILS student ID",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "Diploma & NCE Tuition Settlement",
      "Legal Studies Registration Fee",
      "Portal Clearance Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-akcils-1",
        "name": "AKCILS $20 Portal Credit",
        "description": "Direct fee voucher",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant"
      }
    ]
  },
  {
    "id": "prov-edu-ng-kano-remedial-studies-cas",
    "name": "Kano State College of Arts, Science & Remedial Studies (CAS)",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kano",
    "subdivisionCode": "NG-KN",
    "supportedStates": [
      "Kano"
    ],
    "supportedSubdivisions": [
      "NG-KN"
    ],
    "institutionName": "Kano State College of Arts, Science and Remedial Studies",
    "institutionCode": "CASKANO",
    "institutionType": "college",
    "institutionAliases": [
      "CAS Kano",
      "CAS",
      "Kano Remedial Studies"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "IJMB / Remedial Reg No",
    "accountPlaceholder": "Enter CAS student ID",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "IJMB / Remedial Tuition Clearance",
      "Pre-Degree Registration Fee",
      "Portal Clearance Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-cas-1",
        "name": "CAS Kano $15 Registration Voucher",
        "description": "IJMB & Remedial tuition pass",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant"
      }
    ]
  },
  {
    "id": "prov-edu-ng-absu-abia-state-university-uturu-absu",
    "name": "Abia State University, Uturu (ABSU) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Abia",
    "subdivisionCode": "NG-AB",
    "supportedStates": [
      "Abia"
    ],
    "supportedSubdivisions": [
      "NG-AB"
    ],
    "institutionName": "Abia State University, Uturu (ABSU)",
    "institutionCode": "ABSU",
    "institutionType": "university",
    "institutionAliases": [
      "ABSU",
      "Abia State Univ",
      "Uturu"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter ABSU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-absu-abia-state-university-uturu-absu-1",
        "name": "ABSU $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-absu-abia-state-university-uturu-absu-2",
        "name": "ABSU $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-mouau-michael-okpara-university-of-agriculture-umudike-mouau",
    "name": "Michael Okpara University of Agriculture, Umudike (MOUAU) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Abia",
    "subdivisionCode": "NG-AB",
    "supportedStates": [
      "Abia"
    ],
    "supportedSubdivisions": [
      "NG-AB"
    ],
    "institutionName": "Michael Okpara University of Agriculture, Umudike (MOUAU)",
    "institutionCode": "MOUAU",
    "institutionType": "university",
    "institutionAliases": [
      "MOUAU",
      "Umudike",
      "Agric Umudike"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter MOUAU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-mouau-michael-okpara-university-of-agriculture-umudike-mouau-1",
        "name": "MOUAU $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-mouau-michael-okpara-university-of-agriculture-umudike-mouau-2",
        "name": "MOUAU $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-rhema-rhema-university-aba",
    "name": "Rhema University, Aba Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Abia",
    "subdivisionCode": "NG-AB",
    "supportedStates": [
      "Abia"
    ],
    "supportedSubdivisions": [
      "NG-AB"
    ],
    "institutionName": "Rhema University, Aba",
    "institutionCode": "RHEMA",
    "institutionType": "university",
    "institutionAliases": [
      "Rhema",
      "Rhema Univ Aba"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter RHEMA student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-rhema-rhema-university-aba-1",
        "name": "RHEMA $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-rhema-rhema-university-aba-2",
        "name": "RHEMA $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-abiapoly-abia-state-polytechnic-aba",
    "name": "Abia State Polytechnic, Aba Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Abia",
    "subdivisionCode": "NG-AB",
    "supportedStates": [
      "Abia"
    ],
    "supportedSubdivisions": [
      "NG-AB"
    ],
    "institutionName": "Abia State Polytechnic, Aba",
    "institutionCode": "ABIAPOLY",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Abia Poly",
      "Aba Poly",
      "ABIAPOLY"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter ABIAPOLY student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-abiapoly-abia-state-polytechnic-aba-1",
        "name": "ABIAPOLY $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-abiapoly-abia-state-polytechnic-aba-2",
        "name": "ABIAPOLY $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-templepoly-temple-gate-polytechnic-aba",
    "name": "Temple Gate Polytechnic, Aba Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Abia",
    "subdivisionCode": "NG-AB",
    "supportedStates": [
      "Abia"
    ],
    "supportedSubdivisions": [
      "NG-AB"
    ],
    "institutionName": "Temple Gate Polytechnic, Aba",
    "institutionCode": "TEMPLEPOLY",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Temple Gate",
      "Temple Gate Poly"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter TEMPLEPOLY student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-templepoly-temple-gate-polytechnic-aba-1",
        "name": "TEMPLEPOLY $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-templepoly-temple-gate-polytechnic-aba-2",
        "name": "TEMPLEPOLY $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-asceta-abia-state-college-of-education-technical-arochukwu",
    "name": "Abia State College of Education (Technical) Arochukwu Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Abia",
    "subdivisionCode": "NG-AB",
    "supportedStates": [
      "Abia"
    ],
    "supportedSubdivisions": [
      "NG-AB"
    ],
    "institutionName": "Abia State College of Education (Technical) Arochukwu",
    "institutionCode": "ASCETA",
    "institutionType": "college",
    "institutionAliases": [
      "ASCETA",
      "Arochukwu COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter ASCETA student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-asceta-abia-state-college-of-education-technical-arochukwu-1",
        "name": "ASCETA $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-asceta-abia-state-college-of-education-technical-arochukwu-2",
        "name": "ASCETA $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-abscohmat-abia-state-college-of-health-sciences-management-technology-aba",
    "name": "Abia State College of Health Sciences & Management Technology, Aba Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Abia",
    "subdivisionCode": "NG-AB",
    "supportedStates": [
      "Abia"
    ],
    "supportedSubdivisions": [
      "NG-AB"
    ],
    "institutionName": "Abia State College of Health Sciences & Management Technology, Aba",
    "institutionCode": "ABSCOHMAT",
    "institutionType": "college",
    "institutionAliases": [
      "ABSCOHMAT",
      "Aba Health Tech"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter ABSCOHMAT student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-abscohmat-abia-state-college-of-health-sciences-management-technology-aba-1",
        "name": "ABSCOHMAT $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-abscohmat-abia-state-college-of-health-sciences-management-technology-aba-2",
        "name": "ABSCOHMAT $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-mau-modibbo-adama-university-yola-mau",
    "name": "Modibbo Adama University, Yola (MAU) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Adamawa",
    "subdivisionCode": "NG-AD",
    "supportedStates": [
      "Adamawa"
    ],
    "supportedSubdivisions": [
      "NG-AD"
    ],
    "institutionName": "Modibbo Adama University, Yola (MAU)",
    "institutionCode": "MAU",
    "institutionType": "university",
    "institutionAliases": [
      "MAU",
      "MAUTECH",
      "Modibbo Adama",
      "Yola"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter MAU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-mau-modibbo-adama-university-yola-mau-1",
        "name": "MAU $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-mau-modibbo-adama-university-yola-mau-2",
        "name": "MAU $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-adsu-adamawa-state-university-mubi-adsu",
    "name": "Adamawa State University, Mubi (ADSU) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Adamawa",
    "subdivisionCode": "NG-AD",
    "supportedStates": [
      "Adamawa"
    ],
    "supportedSubdivisions": [
      "NG-AD"
    ],
    "institutionName": "Adamawa State University, Mubi (ADSU)",
    "institutionCode": "ADSU",
    "institutionType": "university",
    "institutionAliases": [
      "ADSU",
      "Adamawa State Univ",
      "Mubi"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter ADSU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-adsu-adamawa-state-university-mubi-adsu-1",
        "name": "ADSU $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-adsu-adamawa-state-university-mubi-adsu-2",
        "name": "ADSU $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-aun-american-university-of-nigeria-yola-aun",
    "name": "American University of Nigeria, Yola (AUN) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Adamawa",
    "subdivisionCode": "NG-AD",
    "supportedStates": [
      "Adamawa"
    ],
    "supportedSubdivisions": [
      "NG-AD"
    ],
    "institutionName": "American University of Nigeria, Yola (AUN)",
    "institutionCode": "AUN",
    "institutionType": "university",
    "institutionAliases": [
      "AUN",
      "American Univ Nigeria"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter AUN student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-aun-american-university-of-nigeria-yola-aun-1",
        "name": "AUN $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-aun-american-university-of-nigeria-yola-aun-2",
        "name": "AUN $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fpm-federal-polytechnic-mubi",
    "name": "Federal Polytechnic, Mubi Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Adamawa",
    "subdivisionCode": "NG-AD",
    "supportedStates": [
      "Adamawa"
    ],
    "supportedSubdivisions": [
      "NG-AD"
    ],
    "institutionName": "Federal Polytechnic, Mubi",
    "institutionCode": "FPM",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Fed Poly Mubi",
      "Mubi Poly",
      "FPM"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter FPM student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fpm-federal-polytechnic-mubi-1",
        "name": "FPM $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fpm-federal-polytechnic-mubi-2",
        "name": "FPM $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-spy-adamawa-state-polytechnic-yola",
    "name": "Adamawa State Polytechnic, Yola Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Adamawa",
    "subdivisionCode": "NG-AD",
    "supportedStates": [
      "Adamawa"
    ],
    "supportedSubdivisions": [
      "NG-AD"
    ],
    "institutionName": "Adamawa State Polytechnic, Yola",
    "institutionCode": "SPY",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Adamawa Poly",
      "Yola Poly",
      "SPY"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter SPY student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-spy-adamawa-state-polytechnic-yola-1",
        "name": "SPY $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-spy-adamawa-state-polytechnic-yola-2",
        "name": "SPY $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fceyola-federal-college-of-education-yola-fce-yola",
    "name": "Federal College of Education, Yola (FCE Yola) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Adamawa",
    "subdivisionCode": "NG-AD",
    "supportedStates": [
      "Adamawa"
    ],
    "supportedSubdivisions": [
      "NG-AD"
    ],
    "institutionName": "Federal College of Education, Yola (FCE Yola)",
    "institutionCode": "FCEYOLA",
    "institutionType": "college",
    "institutionAliases": [
      "FCE Yola",
      "Yola COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter FCEYOLA student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fceyola-federal-college-of-education-yola-fce-yola-1",
        "name": "FCEYOLA $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fceyola-federal-college-of-education-yola-fce-yola-2",
        "name": "FCEYOLA $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-coaganye-college-of-agriculture-ganye",
    "name": "College of Agriculture, Ganye Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Adamawa",
    "subdivisionCode": "NG-AD",
    "supportedStates": [
      "Adamawa"
    ],
    "supportedSubdivisions": [
      "NG-AD"
    ],
    "institutionName": "College of Agriculture, Ganye",
    "institutionCode": "COAGANYE",
    "institutionType": "college",
    "institutionAliases": [
      "Ganye Agric",
      "Adamawa Agric"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter COAGANYE student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-coaganye-college-of-agriculture-ganye-1",
        "name": "COAGANYE $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-coaganye-college-of-agriculture-ganye-2",
        "name": "COAGANYE $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-uniuyo-university-of-uyo-uniuyo",
    "name": "University of Uyo (UNIUYO) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Akwa Ibom",
    "subdivisionCode": "NG-AK",
    "supportedStates": [
      "Akwa Ibom"
    ],
    "supportedSubdivisions": [
      "NG-AK"
    ],
    "institutionName": "University of Uyo (UNIUYO)",
    "institutionCode": "UNIUYO",
    "institutionType": "university",
    "institutionAliases": [
      "UNIUYO",
      "Univ of Uyo",
      "Uyo"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter UNIUYO student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-uniuyo-university-of-uyo-uniuyo-1",
        "name": "UNIUYO $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-uniuyo-university-of-uyo-uniuyo-2",
        "name": "UNIUYO $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-aksu-akwa-ibom-state-university-ikot-akpaden-aksu",
    "name": "Akwa Ibom State University, Ikot Akpaden (AKSU) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Akwa Ibom",
    "subdivisionCode": "NG-AK",
    "supportedStates": [
      "Akwa Ibom"
    ],
    "supportedSubdivisions": [
      "NG-AK"
    ],
    "institutionName": "Akwa Ibom State University, Ikot Akpaden (AKSU)",
    "institutionCode": "AKSU",
    "institutionType": "university",
    "institutionAliases": [
      "AKSU",
      "Akwa Ibom State Univ"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter AKSU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-aksu-akwa-ibom-state-university-ikot-akpaden-aksu-1",
        "name": "AKSU $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-aksu-akwa-ibom-state-university-ikot-akpaden-aksu-2",
        "name": "AKSU $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-topfaith-topfaith-university-mkpatak",
    "name": "Topfaith University, Mkpatak Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Akwa Ibom",
    "subdivisionCode": "NG-AK",
    "supportedStates": [
      "Akwa Ibom"
    ],
    "supportedSubdivisions": [
      "NG-AK"
    ],
    "institutionName": "Topfaith University, Mkpatak",
    "institutionCode": "TOPFAITH",
    "institutionType": "university",
    "institutionAliases": [
      "Topfaith",
      "Topfaith Univ"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter TOPFAITH student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-topfaith-topfaith-university-mkpatak-1",
        "name": "TOPFAITH $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-topfaith-topfaith-university-mkpatak-2",
        "name": "TOPFAITH $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fedpolyukana-federal-polytechnic-ukana",
    "name": "Federal Polytechnic, Ukana Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Akwa Ibom",
    "subdivisionCode": "NG-AK",
    "supportedStates": [
      "Akwa Ibom"
    ],
    "supportedSubdivisions": [
      "NG-AK"
    ],
    "institutionName": "Federal Polytechnic, Ukana",
    "institutionCode": "FEDPOLYUKANA",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Fed Poly Ukana",
      "Ukana Poly"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter FEDPOLYUKANA student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fedpolyukana-federal-polytechnic-ukana-1",
        "name": "FEDPOLYUKANA $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fedpolyukana-federal-polytechnic-ukana-2",
        "name": "FEDPOLYUKANA $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-akwapoly-akwa-ibom-state-polytechnic-ikot-osurua",
    "name": "Akwa Ibom State Polytechnic, Ikot Osurua Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Akwa Ibom",
    "subdivisionCode": "NG-AK",
    "supportedStates": [
      "Akwa Ibom"
    ],
    "supportedSubdivisions": [
      "NG-AK"
    ],
    "institutionName": "Akwa Ibom State Polytechnic, Ikot Osurua",
    "institutionCode": "AKWAPOLY",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Akwa Poly",
      "Ikot Osurua Poly",
      "AKWAPOLY"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter AKWAPOLY student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-akwapoly-akwa-ibom-state-polytechnic-ikot-osurua-1",
        "name": "AKWAPOLY $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-akwapoly-akwa-ibom-state-polytechnic-ikot-osurua-2",
        "name": "AKWAPOLY $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-coeaafaha-college-of-education-afaha-nsit",
    "name": "College of Education, Afaha Nsit Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Akwa Ibom",
    "subdivisionCode": "NG-AK",
    "supportedStates": [
      "Akwa Ibom"
    ],
    "supportedSubdivisions": [
      "NG-AK"
    ],
    "institutionName": "College of Education, Afaha Nsit",
    "institutionCode": "COEAAFAHA",
    "institutionType": "college",
    "institutionAliases": [
      "Afaha Nsit COE",
      "Akwa Ibom COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter COEAAFAHA student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-coeaafaha-college-of-education-afaha-nsit-1",
        "name": "COEAAFAHA $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-coeaafaha-college-of-education-afaha-nsit-2",
        "name": "COEAAFAHA $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-akscohtech-akwa-ibom-state-college-of-health-technology-etinan",
    "name": "Akwa Ibom State College of Health Technology, Etinan Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Akwa Ibom",
    "subdivisionCode": "NG-AK",
    "supportedStates": [
      "Akwa Ibom"
    ],
    "supportedSubdivisions": [
      "NG-AK"
    ],
    "institutionName": "Akwa Ibom State College of Health Technology, Etinan",
    "institutionCode": "AKSCOHTECH",
    "institutionType": "college",
    "institutionAliases": [
      "Etinan Health Tech",
      "Akwa Health Tech"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter AKSCOHTECH student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-akscohtech-akwa-ibom-state-college-of-health-technology-etinan-1",
        "name": "AKSCOHTECH $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-akscohtech-akwa-ibom-state-college-of-health-technology-etinan-2",
        "name": "AKSCOHTECH $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-unizik-nnamdi-azikiwe-university-awka-unizik",
    "name": "Nnamdi Azikiwe University, Awka (UNIZIK) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Anambra",
    "subdivisionCode": "NG-AN",
    "supportedStates": [
      "Anambra"
    ],
    "supportedSubdivisions": [
      "NG-AN"
    ],
    "institutionName": "Nnamdi Azikiwe University, Awka (UNIZIK)",
    "institutionCode": "UNIZIK",
    "institutionType": "university",
    "institutionAliases": [
      "UNIZIK",
      "NAU",
      "Awka",
      "Nnamdi Azikiwe"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter UNIZIK student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-unizik-nnamdi-azikiwe-university-awka-unizik-1",
        "name": "UNIZIK $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-unizik-nnamdi-azikiwe-university-awka-unizik-2",
        "name": "UNIZIK $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-coou-chukwuemeka-odumegwu-ojukwu-university-uli-coou",
    "name": "Chukwuemeka Odumegwu Ojukwu University, Uli (COOU) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Anambra",
    "subdivisionCode": "NG-AN",
    "supportedStates": [
      "Anambra"
    ],
    "supportedSubdivisions": [
      "NG-AN"
    ],
    "institutionName": "Chukwuemeka Odumegwu Ojukwu University, Uli (COOU)",
    "institutionCode": "COOU",
    "institutionType": "university",
    "institutionAliases": [
      "COOU",
      "ANSU",
      "Ojukwu Univ"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter COOU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-coou-chukwuemeka-odumegwu-ojukwu-university-uli-coou-1",
        "name": "COOU $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-coou-chukwuemeka-odumegwu-ojukwu-university-uli-coou-2",
        "name": "COOU $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-paul-paul-university-awka",
    "name": "Paul University, Awka Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Anambra",
    "subdivisionCode": "NG-AN",
    "supportedStates": [
      "Anambra"
    ],
    "supportedSubdivisions": [
      "NG-AN"
    ],
    "institutionName": "Paul University, Awka",
    "institutionCode": "PAUL",
    "institutionType": "university",
    "institutionAliases": [
      "Paul Univ",
      "Paul Awka"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter PAUL student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-paul-paul-university-awka-1",
        "name": "PAUL $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-paul-paul-university-awka-2",
        "name": "PAUL $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-okopoly-federal-polytechnic-oko",
    "name": "Federal Polytechnic, Oko Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Anambra",
    "subdivisionCode": "NG-AN",
    "supportedStates": [
      "Anambra"
    ],
    "supportedSubdivisions": [
      "NG-AN"
    ],
    "institutionName": "Federal Polytechnic, Oko",
    "institutionCode": "OKOPOLY",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Oko Poly",
      "Fed Poly Oko",
      "OKOPOLY"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter OKOPOLY student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-okopoly-federal-polytechnic-oko-1",
        "name": "OKOPOLY $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-okopoly-federal-polytechnic-oko-2",
        "name": "OKOPOLY $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-anspoly-anambra-state-polytechnic-mgbakwu",
    "name": "Anambra State Polytechnic, Mgbakwu Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Anambra",
    "subdivisionCode": "NG-AN",
    "supportedStates": [
      "Anambra"
    ],
    "supportedSubdivisions": [
      "NG-AN"
    ],
    "institutionName": "Anambra State Polytechnic, Mgbakwu",
    "institutionCode": "ANSPOLY",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Anambra Poly",
      "Mgbakwu Poly"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter ANSPOLY student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-anspoly-anambra-state-polytechnic-mgbakwu-1",
        "name": "ANSPOLY $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-anspoly-anambra-state-polytechnic-mgbakwu-2",
        "name": "ANSPOLY $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fcetumunze-federal-college-of-education-technical-umunze",
    "name": "Federal College of Education (Technical) Umunze Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Anambra",
    "subdivisionCode": "NG-AN",
    "supportedStates": [
      "Anambra"
    ],
    "supportedSubdivisions": [
      "NG-AN"
    ],
    "institutionName": "Federal College of Education (Technical) Umunze",
    "institutionCode": "FCETUMUNZE",
    "institutionType": "college",
    "institutionAliases": [
      "FCET Umunze",
      "Umunze Tech"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter FCETUMUNZE student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fcetumunze-federal-college-of-education-technical-umunze-1",
        "name": "FCETUMUNZE $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fcetumunze-federal-college-of-education-technical-umunze-2",
        "name": "FCETUMUNZE $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-nocen-nwafor-orizu-college-of-education-nsugbe-nocen",
    "name": "Nwafor Orizu College of Education, Nsugbe (NOCEN) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Anambra",
    "subdivisionCode": "NG-AN",
    "supportedStates": [
      "Anambra"
    ],
    "supportedSubdivisions": [
      "NG-AN"
    ],
    "institutionName": "Nwafor Orizu College of Education, Nsugbe (NOCEN)",
    "institutionCode": "NOCEN",
    "institutionType": "college",
    "institutionAliases": [
      "NOCEN",
      "Nsugbe COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter NOCEN student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-nocen-nwafor-orizu-college-of-education-nsugbe-nocen-1",
        "name": "NOCEN $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-nocen-nwafor-orizu-college-of-education-nsugbe-nocen-2",
        "name": "NOCEN $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-atbu-abubakar-tafawa-balewa-university-bauchi-atbu",
    "name": "Abubakar Tafawa Balewa University, Bauchi (ATBU) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Bauchi",
    "subdivisionCode": "NG-BA",
    "supportedStates": [
      "Bauchi"
    ],
    "supportedSubdivisions": [
      "NG-BA"
    ],
    "institutionName": "Abubakar Tafawa Balewa University, Bauchi (ATBU)",
    "institutionCode": "ATBU",
    "institutionType": "university",
    "institutionAliases": [
      "ATBU",
      "Tafawa Balewa",
      "Bauchi Univ"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter ATBU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-atbu-abubakar-tafawa-balewa-university-bauchi-atbu-1",
        "name": "ATBU $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-atbu-abubakar-tafawa-balewa-university-bauchi-atbu-2",
        "name": "ATBU $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-basug-sa-adu-zungur-university-gadau-basug",
    "name": "Sa'adu Zungur University, Gadau (BASUG) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Bauchi",
    "subdivisionCode": "NG-BA",
    "supportedStates": [
      "Bauchi"
    ],
    "supportedSubdivisions": [
      "NG-BA"
    ],
    "institutionName": "Sa'adu Zungur University, Gadau (BASUG)",
    "institutionCode": "BASUG",
    "institutionType": "university",
    "institutionAliases": [
      "BASUG",
      "Bauchi State Univ",
      "Gadau"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter BASUG student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-basug-sa-adu-zungur-university-gadau-basug-1",
        "name": "BASUG $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-basug-sa-adu-zungur-university-gadau-basug-2",
        "name": "BASUG $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fedpolybau-federal-polytechnic-bauchi",
    "name": "Federal Polytechnic, Bauchi Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Bauchi",
    "subdivisionCode": "NG-BA",
    "supportedStates": [
      "Bauchi"
    ],
    "supportedSubdivisions": [
      "NG-BA"
    ],
    "institutionName": "Federal Polytechnic, Bauchi",
    "institutionCode": "FEDPOLYBAU",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Fed Poly Bauchi",
      "Bauchi Poly"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter FEDPOLYBAU student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fedpolybau-federal-polytechnic-bauchi-1",
        "name": "FEDPOLYBAU $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fedpolybau-federal-polytechnic-bauchi-2",
        "name": "FEDPOLYBAU $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-atapoly-abubakar-tatari-ali-polytechnic-bauchi-atapoly",
    "name": "Abubakar Tatari Ali Polytechnic, Bauchi (ATAPOLY) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Bauchi",
    "subdivisionCode": "NG-BA",
    "supportedStates": [
      "Bauchi"
    ],
    "supportedSubdivisions": [
      "NG-BA"
    ],
    "institutionName": "Abubakar Tatari Ali Polytechnic, Bauchi (ATAPOLY)",
    "institutionCode": "ATAPOLY",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "ATAPOLY",
      "Tatari Ali Poly"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter ATAPOLY student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-atapoly-abubakar-tatari-ali-polytechnic-bauchi-atapoly-1",
        "name": "ATAPOLY $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-atapoly-abubakar-tatari-ali-polytechnic-bauchi-atapoly-2",
        "name": "ATAPOLY $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fcejamaare-federal-college-of-education-jama-are",
    "name": "Federal College of Education, Jama'are Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Bauchi",
    "subdivisionCode": "NG-BA",
    "supportedStates": [
      "Bauchi"
    ],
    "supportedSubdivisions": [
      "NG-BA"
    ],
    "institutionName": "Federal College of Education, Jama'are",
    "institutionCode": "FCEJAMAARE",
    "institutionType": "college",
    "institutionAliases": [
      "FCE Jamaare",
      "Jamaare COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter FCEJAMAARE student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fcejamaare-federal-college-of-education-jama-are-1",
        "name": "FCEJAMAARE $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fcejamaare-federal-college-of-education-jama-are-2",
        "name": "FCEJAMAARE $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-ascoea-aminu-saleh-college-of-education-azare-ascoea",
    "name": "Aminu Saleh College of Education, Azare (ASCOEA) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Bauchi",
    "subdivisionCode": "NG-BA",
    "supportedStates": [
      "Bauchi"
    ],
    "supportedSubdivisions": [
      "NG-BA"
    ],
    "institutionName": "Aminu Saleh College of Education, Azare (ASCOEA)",
    "institutionCode": "ASCOEA",
    "institutionType": "college",
    "institutionAliases": [
      "Azare COE",
      "ASCOEA",
      "Aminu Saleh"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter ASCOEA student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-ascoea-aminu-saleh-college-of-education-azare-ascoea-1",
        "name": "ASCOEA $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-ascoea-aminu-saleh-college-of-education-azare-ascoea-2",
        "name": "ASCOEA $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-ndu-niger-delta-university-wilberforce-island-ndu",
    "name": "Niger Delta University, Wilberforce Island (NDU) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Bayelsa",
    "subdivisionCode": "NG-BY",
    "supportedStates": [
      "Bayelsa"
    ],
    "supportedSubdivisions": [
      "NG-BY"
    ],
    "institutionName": "Niger Delta University, Wilberforce Island (NDU)",
    "institutionCode": "NDU",
    "institutionType": "university",
    "institutionAliases": [
      "NDU",
      "Niger Delta Univ",
      "Wilberforce"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter NDU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-ndu-niger-delta-university-wilberforce-island-ndu-1",
        "name": "NDU $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-ndu-niger-delta-university-wilberforce-island-ndu-2",
        "name": "NDU $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fuotuoke-federal-university-otuoke-fuotuoke",
    "name": "Federal University, Otuoke (FUOtuoke) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Bayelsa",
    "subdivisionCode": "NG-BY",
    "supportedStates": [
      "Bayelsa"
    ],
    "supportedSubdivisions": [
      "NG-BY"
    ],
    "institutionName": "Federal University, Otuoke (FUOtuoke)",
    "institutionCode": "FUOTUOKE",
    "institutionType": "university",
    "institutionAliases": [
      "FUOtuoke",
      "Fed Univ Otuoke",
      "Otuoke"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter FUOTUOKE student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fuotuoke-federal-university-otuoke-fuotuoke-1",
        "name": "FUOTUOKE $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fuotuoke-federal-university-otuoke-fuotuoke-2",
        "name": "FUOTUOKE $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fedpolyekowe-federal-polytechnic-ekowe",
    "name": "Federal Polytechnic, Ekowe Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Bayelsa",
    "subdivisionCode": "NG-BY",
    "supportedStates": [
      "Bayelsa"
    ],
    "supportedSubdivisions": [
      "NG-BY"
    ],
    "institutionName": "Federal Polytechnic, Ekowe",
    "institutionCode": "FEDPOLYEKOWE",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Fed Poly Ekowe",
      "Ekowe Poly"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter FEDPOLYEKOWE student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fedpolyekowe-federal-polytechnic-ekowe-1",
        "name": "FEDPOLYEKOWE $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fedpolyekowe-federal-polytechnic-ekowe-2",
        "name": "FEDPOLYEKOWE $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-bayelsapoly-bayelsa-state-polytechnic-aleibiri",
    "name": "Bayelsa State Polytechnic, Aleibiri Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Bayelsa",
    "subdivisionCode": "NG-BY",
    "supportedStates": [
      "Bayelsa"
    ],
    "supportedSubdivisions": [
      "NG-BY"
    ],
    "institutionName": "Bayelsa State Polytechnic, Aleibiri",
    "institutionCode": "BAYELSAPOLY",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Bayelsa Poly",
      "Aleibiri Poly"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter BAYELSAPOLY student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-bayelsapoly-bayelsa-state-polytechnic-aleibiri-1",
        "name": "BAYELSAPOLY $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-bayelsapoly-bayelsa-state-polytechnic-aleibiri-2",
        "name": "BAYELSAPOLY $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-ijbcoe-isaac-jasper-boro-college-of-education-sagbama",
    "name": "Isaac Jasper Boro College of Education, Sagbama Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Bayelsa",
    "subdivisionCode": "NG-BY",
    "supportedStates": [
      "Bayelsa"
    ],
    "supportedSubdivisions": [
      "NG-BY"
    ],
    "institutionName": "Isaac Jasper Boro College of Education, Sagbama",
    "institutionCode": "IJBCOE",
    "institutionType": "college",
    "institutionAliases": [
      "Sagbama COE",
      "Boro COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter IJBCOE student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-ijbcoe-isaac-jasper-boro-college-of-education-sagbama-1",
        "name": "IJBCOE $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-ijbcoe-isaac-jasper-boro-college-of-education-sagbama-2",
        "name": "IJBCOE $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-bycohtech-bayelsa-state-college-of-health-technology-otuogidi",
    "name": "Bayelsa State College of Health Technology, Otuogidi Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Bayelsa",
    "subdivisionCode": "NG-BY",
    "supportedStates": [
      "Bayelsa"
    ],
    "supportedSubdivisions": [
      "NG-BY"
    ],
    "institutionName": "Bayelsa State College of Health Technology, Otuogidi",
    "institutionCode": "BYCOHTECH",
    "institutionType": "college",
    "institutionAliases": [
      "Otuogidi Health Tech",
      "Bayelsa Health Tech"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter BYCOHTECH student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-bycohtech-bayelsa-state-college-of-health-technology-otuogidi-1",
        "name": "BYCOHTECH $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-bycohtech-bayelsa-state-college-of-health-technology-otuogidi-2",
        "name": "BYCOHTECH $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-jostum-joseph-sarwuan-tarka-university-makurdi-jostum-fuam",
    "name": "Joseph Sarwuan Tarka University, Makurdi (JOSTUM / FUAM) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Benue",
    "subdivisionCode": "NG-BE",
    "supportedStates": [
      "Benue"
    ],
    "supportedSubdivisions": [
      "NG-BE"
    ],
    "institutionName": "Joseph Sarwuan Tarka University, Makurdi (JOSTUM / FUAM)",
    "institutionCode": "JOSTUM",
    "institutionType": "university",
    "institutionAliases": [
      "JOSTUM",
      "FUAM",
      "Agric Makurdi",
      "Tarka Univ"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter JOSTUM student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-jostum-joseph-sarwuan-tarka-university-makurdi-jostum-fuam-1",
        "name": "JOSTUM $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-jostum-joseph-sarwuan-tarka-university-makurdi-jostum-fuam-2",
        "name": "JOSTUM $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-bsum-benue-state-university-makurdi-bsum",
    "name": "Benue State University, Makurdi (BSUM) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Benue",
    "subdivisionCode": "NG-BE",
    "supportedStates": [
      "Benue"
    ],
    "supportedSubdivisions": [
      "NG-BE"
    ],
    "institutionName": "Benue State University, Makurdi (BSUM)",
    "institutionCode": "BSUM",
    "institutionType": "university",
    "institutionAliases": [
      "BSUM",
      "Benue State Univ",
      "Makurdi"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter BSUM student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-bsum-benue-state-university-makurdi-bsum-1",
        "name": "BSUM $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-bsum-benue-state-university-makurdi-bsum-2",
        "name": "BSUM $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fedpolywannune-federal-polytechnic-wannune",
    "name": "Federal Polytechnic, Wannune Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Benue",
    "subdivisionCode": "NG-BE",
    "supportedStates": [
      "Benue"
    ],
    "supportedSubdivisions": [
      "NG-BE"
    ],
    "institutionName": "Federal Polytechnic, Wannune",
    "institutionCode": "FEDPOLYWANNUNE",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Fed Poly Wannune",
      "Wannune Poly"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter FEDPOLYWANNUNE student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fedpolywannune-federal-polytechnic-wannune-1",
        "name": "FEDPOLYWANNUNE $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fedpolywannune-federal-polytechnic-wannune-2",
        "name": "FEDPOLYWANNUNE $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-benpoly-benue-state-polytechnic-ugbokolo-benpoly",
    "name": "Benue State Polytechnic, Ugbokolo (BENPOLY) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Benue",
    "subdivisionCode": "NG-BE",
    "supportedStates": [
      "Benue"
    ],
    "supportedSubdivisions": [
      "NG-BE"
    ],
    "institutionName": "Benue State Polytechnic, Ugbokolo (BENPOLY)",
    "institutionCode": "BENPOLY",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Benue Poly",
      "Ugbokolo Poly",
      "BENPOLY"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter BENPOLY student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-benpoly-benue-state-polytechnic-ugbokolo-benpoly-1",
        "name": "BENPOLY $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-benpoly-benue-state-polytechnic-ugbokolo-benpoly-2",
        "name": "BENPOLY $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-coekatsinaala-college-of-education-katsina-ala",
    "name": "College of Education, Katsina-Ala Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Benue",
    "subdivisionCode": "NG-BE",
    "supportedStates": [
      "Benue"
    ],
    "supportedSubdivisions": [
      "NG-BE"
    ],
    "institutionName": "College of Education, Katsina-Ala",
    "institutionCode": "COEKATSINAALA",
    "institutionType": "college",
    "institutionAliases": [
      "Katsina-Ala COE",
      "Benue COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter COEKATSINAALA student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-coekatsinaala-college-of-education-katsina-ala-1",
        "name": "COEKATSINAALA $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-coekatsinaala-college-of-education-katsina-ala-2",
        "name": "COEKATSINAALA $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-coeoju-college-of-education-oju",
    "name": "College of Education, Oju Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Benue",
    "subdivisionCode": "NG-BE",
    "supportedStates": [
      "Benue"
    ],
    "supportedSubdivisions": [
      "NG-BE"
    ],
    "institutionName": "College of Education, Oju",
    "institutionCode": "COEOJU",
    "institutionType": "college",
    "institutionAliases": [
      "Oju COE",
      "Oju College"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter COEOJU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-coeoju-college-of-education-oju-1",
        "name": "COEOJU $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-coeoju-college-of-education-oju-2",
        "name": "COEOJU $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-unimaid-university-of-maiduguri-unimaid",
    "name": "University of Maiduguri (UNIMAID) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Borno",
    "subdivisionCode": "NG-BO",
    "supportedStates": [
      "Borno"
    ],
    "supportedSubdivisions": [
      "NG-BO"
    ],
    "institutionName": "University of Maiduguri (UNIMAID)",
    "institutionCode": "UNIMAID",
    "institutionType": "university",
    "institutionAliases": [
      "UNIMAID",
      "Univ of Maiduguri",
      "Maiduguri"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter UNIMAID student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-unimaid-university-of-maiduguri-unimaid-1",
        "name": "UNIMAID $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-unimaid-university-of-maiduguri-unimaid-2",
        "name": "UNIMAID $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-bosu-borno-state-university-maiduguri-bosu",
    "name": "Borno State University, Maiduguri (BOSU) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Borno",
    "subdivisionCode": "NG-BO",
    "supportedStates": [
      "Borno"
    ],
    "supportedSubdivisions": [
      "NG-BO"
    ],
    "institutionName": "Borno State University, Maiduguri (BOSU)",
    "institutionCode": "BOSU",
    "institutionType": "university",
    "institutionAliases": [
      "BOSU",
      "Borno State Univ"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter BOSU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-bosu-borno-state-university-maiduguri-bosu-1",
        "name": "BOSU $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-bosu-borno-state-university-maiduguri-bosu-2",
        "name": "BOSU $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-ramatpoly-ramat-polytechnic-maiduguri",
    "name": "Ramat Polytechnic, Maiduguri Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Borno",
    "subdivisionCode": "NG-BO",
    "supportedStates": [
      "Borno"
    ],
    "supportedSubdivisions": [
      "NG-BO"
    ],
    "institutionName": "Ramat Polytechnic, Maiduguri",
    "institutionCode": "RAMATPOLY",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Ramat Poly",
      "RAMATPOLY",
      "Maiduguri Poly"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter RAMATPOLY student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-ramatpoly-ramat-polytechnic-maiduguri-1",
        "name": "RAMATPOLY $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-ramatpoly-ramat-polytechnic-maiduguri-2",
        "name": "RAMATPOLY $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fedpolymonguno-federal-polytechnic-monguno",
    "name": "Federal Polytechnic, Monguno Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Borno",
    "subdivisionCode": "NG-BO",
    "supportedStates": [
      "Borno"
    ],
    "supportedSubdivisions": [
      "NG-BO"
    ],
    "institutionName": "Federal Polytechnic, Monguno",
    "institutionCode": "FEDPOLYMONGUNO",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Fed Poly Monguno",
      "Monguno Poly"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter FEDPOLYMONGUNO student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fedpolymonguno-federal-polytechnic-monguno-1",
        "name": "FEDPOLYMONGUNO $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fedpolymonguno-federal-polytechnic-monguno-2",
        "name": "FEDPOLYMONGUNO $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fcegwoza-federal-college-of-education-gwoza",
    "name": "Federal College of Education, Gwoza Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Borno",
    "subdivisionCode": "NG-BO",
    "supportedStates": [
      "Borno"
    ],
    "supportedSubdivisions": [
      "NG-BO"
    ],
    "institutionName": "Federal College of Education, Gwoza",
    "institutionCode": "FCEGWOZA",
    "institutionType": "college",
    "institutionAliases": [
      "FCE Gwoza",
      "Gwoza COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter FCEGWOZA student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fcegwoza-federal-college-of-education-gwoza-1",
        "name": "FCEGWOZA $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fcegwoza-federal-college-of-education-gwoza-2",
        "name": "FCEGWOZA $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-elkanemicoe-umar-ibn-ibrahim-el-kanemi-college-of-education-science-tech-bama",
    "name": "Umar Ibn Ibrahim El-Kanemi College of Education, Science & Tech, Bama Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Borno",
    "subdivisionCode": "NG-BO",
    "supportedStates": [
      "Borno"
    ],
    "supportedSubdivisions": [
      "NG-BO"
    ],
    "institutionName": "Umar Ibn Ibrahim El-Kanemi College of Education, Science & Tech, Bama",
    "institutionCode": "ELKANEMICOE",
    "institutionType": "college",
    "institutionAliases": [
      "Bama COE",
      "El-Kanemi COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter ELKANEMICOE student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-elkanemicoe-umar-ibn-ibrahim-el-kanemi-college-of-education-science-tech-bama-1",
        "name": "ELKANEMICOE $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-elkanemicoe-umar-ibn-ibrahim-el-kanemi-college-of-education-science-tech-bama-2",
        "name": "ELKANEMICOE $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-unical-university-of-calabar-unical",
    "name": "University of Calabar (UNICAL) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Cross River",
    "subdivisionCode": "NG-CR",
    "supportedStates": [
      "Cross River"
    ],
    "supportedSubdivisions": [
      "NG-CR"
    ],
    "institutionName": "University of Calabar (UNICAL)",
    "institutionCode": "UNICAL",
    "institutionType": "university",
    "institutionAliases": [
      "UNICAL",
      "Univ of Calabar",
      "Calabar"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter UNICAL student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-unical-university-of-calabar-unical-1",
        "name": "UNICAL $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-unical-university-of-calabar-unical-2",
        "name": "UNICAL $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-unicross-university-of-cross-river-state-unicross-crutech",
    "name": "University of Cross River State (UNICROSS / CRUTECH) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Cross River",
    "subdivisionCode": "NG-CR",
    "supportedStates": [
      "Cross River"
    ],
    "supportedSubdivisions": [
      "NG-CR"
    ],
    "institutionName": "University of Cross River State (UNICROSS / CRUTECH)",
    "institutionCode": "UNICROSS",
    "institutionType": "university",
    "institutionAliases": [
      "UNICROSS",
      "CRUTECH",
      "Cross River Univ"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter UNICROSS student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-unicross-university-of-cross-river-state-unicross-crutech-1",
        "name": "UNICROSS $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-unicross-university-of-cross-river-state-unicross-crutech-2",
        "name": "UNICROSS $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fedpolyugep-federal-polytechnic-ugep",
    "name": "Federal Polytechnic, Ugep Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Cross River",
    "subdivisionCode": "NG-CR",
    "supportedStates": [
      "Cross River"
    ],
    "supportedSubdivisions": [
      "NG-CR"
    ],
    "institutionName": "Federal Polytechnic, Ugep",
    "institutionCode": "FEDPOLYUGEP",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Fed Poly Ugep",
      "Ugep Poly"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter FEDPOLYUGEP student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fedpolyugep-federal-polytechnic-ugep-1",
        "name": "FEDPOLYUGEP $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fedpolyugep-federal-polytechnic-ugep-2",
        "name": "FEDPOLYUGEP $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fceobudu-federal-college-of-education-obudu-fce-obudu",
    "name": "Federal College of Education, Obudu (FCE Obudu) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Cross River",
    "subdivisionCode": "NG-CR",
    "supportedStates": [
      "Cross River"
    ],
    "supportedSubdivisions": [
      "NG-CR"
    ],
    "institutionName": "Federal College of Education, Obudu (FCE Obudu)",
    "institutionCode": "FCEOBUDU",
    "institutionType": "college",
    "institutionAliases": [
      "FCE Obudu",
      "Obudu COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter FCEOBUDU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fceobudu-federal-college-of-education-obudu-fce-obudu-1",
        "name": "FCEOBUDU $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fceobudu-federal-college-of-education-obudu-fce-obudu-2",
        "name": "FCEOBUDU $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-coeakamkpa-cross-river-state-college-of-education-akamkpa",
    "name": "Cross River State College of Education, Akamkpa Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Cross River",
    "subdivisionCode": "NG-CR",
    "supportedStates": [
      "Cross River"
    ],
    "supportedSubdivisions": [
      "NG-CR"
    ],
    "institutionName": "Cross River State College of Education, Akamkpa",
    "institutionCode": "COEAKAMKPA",
    "institutionType": "college",
    "institutionAliases": [
      "Akamkpa COE",
      "Cross River COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter COEAKAMKPA student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-coeakamkpa-cross-river-state-college-of-education-akamkpa-1",
        "name": "COEAKAMKPA $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-coeakamkpa-cross-river-state-college-of-education-akamkpa-2",
        "name": "COEAKAMKPA $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fupre-federal-university-of-petroleum-resources-effurun-fupre",
    "name": "Federal University of Petroleum Resources, Effurun (FUPRE) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Delta",
    "subdivisionCode": "NG-DE",
    "supportedStates": [
      "Delta"
    ],
    "supportedSubdivisions": [
      "NG-DE"
    ],
    "institutionName": "Federal University of Petroleum Resources, Effurun (FUPRE)",
    "institutionCode": "FUPRE",
    "institutionType": "university",
    "institutionAliases": [
      "FUPRE",
      "Petroleum Univ Effurun",
      "Effurun"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter FUPRE student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fupre-federal-university-of-petroleum-resources-effurun-fupre-1",
        "name": "FUPRE $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fupre-federal-university-of-petroleum-resources-effurun-fupre-2",
        "name": "FUPRE $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-delsu-delta-state-university-abraka-delsu",
    "name": "Delta State University, Abraka (DELSU) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Delta",
    "subdivisionCode": "NG-DE",
    "supportedStates": [
      "Delta"
    ],
    "supportedSubdivisions": [
      "NG-DE"
    ],
    "institutionName": "Delta State University, Abraka (DELSU)",
    "institutionCode": "DELSU",
    "institutionType": "university",
    "institutionAliases": [
      "DELSU",
      "Abraka Univ",
      "Delta State Univ"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter DELSU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-delsu-delta-state-university-abraka-delsu-1",
        "name": "DELSU $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-delsu-delta-state-university-abraka-delsu-2",
        "name": "DELSU $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-unidel-university-of-delta-agbor-unidel",
    "name": "University of Delta, Agbor (UNIDEL) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Delta",
    "subdivisionCode": "NG-DE",
    "supportedStates": [
      "Delta"
    ],
    "supportedSubdivisions": [
      "NG-DE"
    ],
    "institutionName": "University of Delta, Agbor (UNIDEL)",
    "institutionCode": "UNIDEL",
    "institutionType": "university",
    "institutionAliases": [
      "UNIDEL",
      "Univ of Delta",
      "Agbor"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter UNIDEL student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-unidel-university-of-delta-agbor-unidel-1",
        "name": "UNIDEL $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-unidel-university-of-delta-agbor-unidel-2",
        "name": "UNIDEL $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fedpolyorogun-federal-polytechnic-orogun",
    "name": "Federal Polytechnic, Orogun Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Delta",
    "subdivisionCode": "NG-DE",
    "supportedStates": [
      "Delta"
    ],
    "supportedSubdivisions": [
      "NG-DE"
    ],
    "institutionName": "Federal Polytechnic, Orogun",
    "institutionCode": "FEDPOLYOROGUN",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Fed Poly Orogun",
      "Orogun Poly"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter FEDPOLYOROGUN student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fedpolyorogun-federal-polytechnic-orogun-1",
        "name": "FEDPOLYOROGUN $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fedpolyorogun-federal-polytechnic-orogun-2",
        "name": "FEDPOLYOROGUN $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-dspg-delta-state-polytechnic-ogwashi-uku-dspg",
    "name": "Delta State Polytechnic, Ogwashi-Uku (DSPG) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Delta",
    "subdivisionCode": "NG-DE",
    "supportedStates": [
      "Delta"
    ],
    "supportedSubdivisions": [
      "NG-DE"
    ],
    "institutionName": "Delta State Polytechnic, Ogwashi-Uku (DSPG)",
    "institutionCode": "DSPG",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Ogwashi-Uku Poly",
      "DSPG"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter DSPG student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-dspg-delta-state-polytechnic-ogwashi-uku-dspg-1",
        "name": "DSPG $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-dspg-delta-state-polytechnic-ogwashi-uku-dspg-2",
        "name": "DSPG $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-despo-delta-state-polytechnic-otefe-oghara-despo",
    "name": "Delta State Polytechnic, Otefe-Oghara (DESPO) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Delta",
    "subdivisionCode": "NG-DE",
    "supportedStates": [
      "Delta"
    ],
    "supportedSubdivisions": [
      "NG-DE"
    ],
    "institutionName": "Delta State Polytechnic, Otefe-Oghara (DESPO)",
    "institutionCode": "DESPO",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "DESPO",
      "Oghara Poly"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter DESPO student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-despo-delta-state-polytechnic-otefe-oghara-despo-1",
        "name": "DESPO $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-despo-delta-state-polytechnic-otefe-oghara-despo-2",
        "name": "DESPO $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fcetasaba-federal-college-of-education-technical-asaba",
    "name": "Federal College of Education (Technical) Asaba Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Delta",
    "subdivisionCode": "NG-DE",
    "supportedStates": [
      "Delta"
    ],
    "supportedSubdivisions": [
      "NG-DE"
    ],
    "institutionName": "Federal College of Education (Technical) Asaba",
    "institutionCode": "FCETASABA",
    "institutionType": "college",
    "institutionAliases": [
      "FCET Asaba",
      "Asaba Tech COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter FCETASABA student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fcetasaba-federal-college-of-education-technical-asaba-1",
        "name": "FCETASABA $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fcetasaba-federal-college-of-education-technical-asaba-2",
        "name": "FCETASABA $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-coewarri-college-of-education-warri",
    "name": "College of Education, Warri Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Delta",
    "subdivisionCode": "NG-DE",
    "supportedStates": [
      "Delta"
    ],
    "supportedSubdivisions": [
      "NG-DE"
    ],
    "institutionName": "College of Education, Warri",
    "institutionCode": "COEWARRI",
    "institutionType": "college",
    "institutionAliases": [
      "Warri COE",
      "Warri College"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter COEWARRI student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-coewarri-college-of-education-warri-1",
        "name": "COEWARRI $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-coewarri-college-of-education-warri-2",
        "name": "COEWARRI $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-aefunai-alex-ekwueme-federal-university-ndufu-alike-ae-funai",
    "name": "Alex Ekwueme Federal University, Ndufu-Alike (AE-FUNAI) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Ebonyi",
    "subdivisionCode": "NG-EB",
    "supportedStates": [
      "Ebonyi"
    ],
    "supportedSubdivisions": [
      "NG-EB"
    ],
    "institutionName": "Alex Ekwueme Federal University, Ndufu-Alike (AE-FUNAI)",
    "institutionCode": "AEFUNAI",
    "institutionType": "university",
    "institutionAliases": [
      "AE-FUNAI",
      "FUNAI",
      "Ndufu-Alike",
      "Alex Ekwueme"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter AEFUNAI student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-aefunai-alex-ekwueme-federal-university-ndufu-alike-ae-funai-1",
        "name": "AEFUNAI $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-aefunai-alex-ekwueme-federal-university-ndufu-alike-ae-funai-2",
        "name": "AEFUNAI $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-ebsu-ebonyi-state-university-abakaliki-ebsu",
    "name": "Ebonyi State University, Abakaliki (EBSU) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Ebonyi",
    "subdivisionCode": "NG-EB",
    "supportedStates": [
      "Ebonyi"
    ],
    "supportedSubdivisions": [
      "NG-EB"
    ],
    "institutionName": "Ebonyi State University, Abakaliki (EBSU)",
    "institutionCode": "EBSU",
    "institutionType": "university",
    "institutionAliases": [
      "EBSU",
      "Ebonyi State Univ",
      "Abakaliki"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter EBSU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-ebsu-ebonyi-state-university-abakaliki-ebsu-1",
        "name": "EBSU $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-ebsu-ebonyi-state-university-abakaliki-ebsu-2",
        "name": "EBSU $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-aifpu-akanu-ibiam-federal-polytechnic-unwana",
    "name": "Akanu Ibiam Federal Polytechnic, Unwana Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Ebonyi",
    "subdivisionCode": "NG-EB",
    "supportedStates": [
      "Ebonyi"
    ],
    "supportedSubdivisions": [
      "NG-EB"
    ],
    "institutionName": "Akanu Ibiam Federal Polytechnic, Unwana",
    "institutionCode": "AIFPU",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Unwana Poly",
      "Akanu Ibiam Poly",
      "AIFPU"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter AIFPU student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-aifpu-akanu-ibiam-federal-polytechnic-unwana-1",
        "name": "AIFPU $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-aifpu-akanu-ibiam-federal-polytechnic-unwana-2",
        "name": "AIFPU $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-coeikwo-ebonyi-state-college-of-education-ikwo",
    "name": "Ebonyi State College of Education, Ikwo Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Ebonyi",
    "subdivisionCode": "NG-EB",
    "supportedStates": [
      "Ebonyi"
    ],
    "supportedSubdivisions": [
      "NG-EB"
    ],
    "institutionName": "Ebonyi State College of Education, Ikwo",
    "institutionCode": "COEIKWO",
    "institutionType": "college",
    "institutionAliases": [
      "Ikwo COE",
      "Ebonyi COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter COEIKWO student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-coeikwo-ebonyi-state-college-of-education-ikwo-1",
        "name": "COEIKWO $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-coeikwo-ebonyi-state-college-of-education-ikwo-2",
        "name": "COEIKWO $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-ngbohealth-ebonyi-state-college-of-health-sciences-and-management-technology-ngbo",
    "name": "Ebonyi State College of Health Sciences and Management Technology, Ngbo Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Ebonyi",
    "subdivisionCode": "NG-EB",
    "supportedStates": [
      "Ebonyi"
    ],
    "supportedSubdivisions": [
      "NG-EB"
    ],
    "institutionName": "Ebonyi State College of Health Sciences and Management Technology, Ngbo",
    "institutionCode": "NGBOHEALTH",
    "institutionType": "college",
    "institutionAliases": [
      "Ngbo Health Tech",
      "Ebonyi Health Tech"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter NGBOHEALTH student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-ngbohealth-ebonyi-state-college-of-health-sciences-and-management-technology-ngbo-1",
        "name": "NGBOHEALTH $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-ngbohealth-ebonyi-state-college-of-health-sciences-and-management-technology-ngbo-2",
        "name": "NGBOHEALTH $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-uniben-university-of-benin-uniben",
    "name": "University of Benin (UNIBEN) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Edo",
    "subdivisionCode": "NG-ED",
    "supportedStates": [
      "Edo"
    ],
    "supportedSubdivisions": [
      "NG-ED"
    ],
    "institutionName": "University of Benin (UNIBEN)",
    "institutionCode": "UNIBEN",
    "institutionType": "university",
    "institutionAliases": [
      "UNIBEN",
      "Univ of Benin",
      "Benin"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter UNIBEN student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-uniben-university-of-benin-uniben-1",
        "name": "UNIBEN $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-uniben-university-of-benin-uniben-2",
        "name": "UNIBEN $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-aau-ambrose-alli-university-ekpoma-aau",
    "name": "Ambrose Alli University, Ekpoma (AAU) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Edo",
    "subdivisionCode": "NG-ED",
    "supportedStates": [
      "Edo"
    ],
    "supportedSubdivisions": [
      "NG-ED"
    ],
    "institutionName": "Ambrose Alli University, Ekpoma (AAU)",
    "institutionCode": "AAU",
    "institutionType": "university",
    "institutionAliases": [
      "AAU",
      "Ambrose Alli",
      "Ekpoma"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter AAU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-aau-ambrose-alli-university-ekpoma-aau-1",
        "name": "AAU $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-aau-ambrose-alli-university-ekpoma-aau-2",
        "name": "AAU $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-edsu-edo-state-university-uzairue-edsu",
    "name": "Edo State University, Uzairue (EDSU) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Edo",
    "subdivisionCode": "NG-ED",
    "supportedStates": [
      "Edo"
    ],
    "supportedSubdivisions": [
      "NG-ED"
    ],
    "institutionName": "Edo State University, Uzairue (EDSU)",
    "institutionCode": "EDSU",
    "institutionType": "university",
    "institutionAliases": [
      "EDSU",
      "Edo State Univ",
      "Iyamho",
      "Uzairue"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter EDSU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-edsu-edo-state-university-uzairue-edsu-1",
        "name": "EDSU $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-edsu-edo-state-university-uzairue-edsu-2",
        "name": "EDSU $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-auchipoly-federal-polytechnic-auchi-auchipoly",
    "name": "Federal Polytechnic, Auchi (AUCHIPOLY) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Edo",
    "subdivisionCode": "NG-ED",
    "supportedStates": [
      "Edo"
    ],
    "supportedSubdivisions": [
      "NG-ED"
    ],
    "institutionName": "Federal Polytechnic, Auchi (AUCHIPOLY)",
    "institutionCode": "AUCHIPOLY",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Auchi Poly",
      "AUCHIPOLY",
      "Auchi"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter AUCHIPOLY student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-auchipoly-federal-polytechnic-auchi-auchipoly-1",
        "name": "AUCHIPOLY $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-auchipoly-federal-polytechnic-auchi-auchipoly-2",
        "name": "AUCHIPOLY $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-edopolyusen-edo-state-polytechnic-usen",
    "name": "Edo State Polytechnic, Usen Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Edo",
    "subdivisionCode": "NG-ED",
    "supportedStates": [
      "Edo"
    ],
    "supportedSubdivisions": [
      "NG-ED"
    ],
    "institutionName": "Edo State Polytechnic, Usen",
    "institutionCode": "EDOPOLYUSEN",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Usen Poly",
      "Edo Poly"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter EDOPOLYUSEN student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-edopolyusen-edo-state-polytechnic-usen-1",
        "name": "EDOPOLYUSEN $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-edopolyusen-edo-state-polytechnic-usen-2",
        "name": "EDOPOLYUSEN $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fcetekiadolor-federal-college-of-education-technical-ekiadolor",
    "name": "Federal College of Education (Technical) Ekiadolor Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Edo",
    "subdivisionCode": "NG-ED",
    "supportedStates": [
      "Edo"
    ],
    "supportedSubdivisions": [
      "NG-ED"
    ],
    "institutionName": "Federal College of Education (Technical) Ekiadolor",
    "institutionCode": "FCETEKIADOLOR",
    "institutionType": "college",
    "institutionAliases": [
      "FCET Ekiadolor",
      "Ekiadolor COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter FCETEKIADOLOR student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fcetekiadolor-federal-college-of-education-technical-ekiadolor-1",
        "name": "FCETEKIADOLOR $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fcetekiadolor-federal-college-of-education-technical-ekiadolor-2",
        "name": "FCETEKIADOLOR $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-coeigueben-edo-state-college-of-education-igueben",
    "name": "Edo State College of Education, Igueben Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Edo",
    "subdivisionCode": "NG-ED",
    "supportedStates": [
      "Edo"
    ],
    "supportedSubdivisions": [
      "NG-ED"
    ],
    "institutionName": "Edo State College of Education, Igueben",
    "institutionCode": "COEIGUEBEN",
    "institutionType": "college",
    "institutionAliases": [
      "Igueben COE",
      "Edo COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter COEIGUEBEN student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-coeigueben-edo-state-college-of-education-igueben-1",
        "name": "COEIGUEBEN $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-coeigueben-edo-state-college-of-education-igueben-2",
        "name": "COEIGUEBEN $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fuoye-federal-university-oye-ekiti-fuoye",
    "name": "Federal University, Oye-Ekiti (FUOYE) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Ekiti",
    "subdivisionCode": "NG-EK",
    "supportedStates": [
      "Ekiti"
    ],
    "supportedSubdivisions": [
      "NG-EK"
    ],
    "institutionName": "Federal University, Oye-Ekiti (FUOYE)",
    "institutionCode": "FUOYE",
    "institutionType": "university",
    "institutionAliases": [
      "FUOYE",
      "Fed Univ Oye-Ekiti",
      "Oye Ekiti"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter FUOYE student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fuoye-federal-university-oye-ekiti-fuoye-1",
        "name": "FUOYE $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fuoye-federal-university-oye-ekiti-fuoye-2",
        "name": "FUOYE $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-eksu-ekiti-state-university-ado-ekiti-eksu",
    "name": "Ekiti State University, Ado-Ekiti (EKSU) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Ekiti",
    "subdivisionCode": "NG-EK",
    "supportedStates": [
      "Ekiti"
    ],
    "supportedSubdivisions": [
      "NG-EK"
    ],
    "institutionName": "Ekiti State University, Ado-Ekiti (EKSU)",
    "institutionCode": "EKSU",
    "institutionType": "university",
    "institutionAliases": [
      "EKSU",
      "Ado Ekiti Univ",
      "UNAD"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter EKSU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-eksu-ekiti-state-university-ado-ekiti-eksu-1",
        "name": "EKSU $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-eksu-ekiti-state-university-ado-ekiti-eksu-2",
        "name": "EKSU $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-abuad-afe-babalola-university-ado-ekiti-abuad",
    "name": "Afe Babalola University, Ado-Ekiti (ABUAD) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Ekiti",
    "subdivisionCode": "NG-EK",
    "supportedStates": [
      "Ekiti"
    ],
    "supportedSubdivisions": [
      "NG-EK"
    ],
    "institutionName": "Afe Babalola University, Ado-Ekiti (ABUAD)",
    "institutionCode": "ABUAD",
    "institutionType": "university",
    "institutionAliases": [
      "ABUAD",
      "Afe Babalola"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter ABUAD student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-abuad-afe-babalola-university-ado-ekiti-abuad-1",
        "name": "ABUAD $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-abuad-afe-babalola-university-ado-ekiti-abuad-2",
        "name": "ABUAD $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fedpolyado-federal-polytechnic-ado-ekiti",
    "name": "Federal Polytechnic, Ado-Ekiti Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Ekiti",
    "subdivisionCode": "NG-EK",
    "supportedStates": [
      "Ekiti"
    ],
    "supportedSubdivisions": [
      "NG-EK"
    ],
    "institutionName": "Federal Polytechnic, Ado-Ekiti",
    "institutionCode": "FEDPOLYADO",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Fed Poly Ado",
      "Ado Poly",
      "FEDPOLYADO"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter FEDPOLYADO student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fedpolyado-federal-polytechnic-ado-ekiti-1",
        "name": "FEDPOLYADO $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fedpolyado-federal-polytechnic-ado-ekiti-2",
        "name": "FEDPOLYADO $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-bouesti-bamidele-olumilua-university-of-education-science-tech-ikere-ekiti-bouesti",
    "name": "Bamidele Olumilua University of Education, Science & Tech, Ikere-Ekiti (BOUESTI) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Ekiti",
    "subdivisionCode": "NG-EK",
    "supportedStates": [
      "Ekiti"
    ],
    "supportedSubdivisions": [
      "NG-EK"
    ],
    "institutionName": "Bamidele Olumilua University of Education, Science & Tech, Ikere-Ekiti (BOUESTI)",
    "institutionCode": "BOUESTI",
    "institutionType": "college",
    "institutionAliases": [
      "BOUESTI",
      "Ikere COE",
      "Ikere-Ekiti"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter BOUESTI student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-bouesti-bamidele-olumilua-university-of-education-science-tech-ikere-ekiti-bouesti-1",
        "name": "BOUESTI $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-bouesti-bamidele-olumilua-university-of-education-science-tech-ikere-ekiti-bouesti-2",
        "name": "BOUESTI $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-ijerohealth-ekiti-state-college-of-health-sciences-and-technology-ijero-ekiti",
    "name": "Ekiti State College of Health Sciences and Technology, Ijero-Ekiti Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Ekiti",
    "subdivisionCode": "NG-EK",
    "supportedStates": [
      "Ekiti"
    ],
    "supportedSubdivisions": [
      "NG-EK"
    ],
    "institutionName": "Ekiti State College of Health Sciences and Technology, Ijero-Ekiti",
    "institutionCode": "IJEROHEALTH",
    "institutionType": "college",
    "institutionAliases": [
      "Ijero Health Tech",
      "Ekiti Health Tech"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter IJEROHEALTH student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-ijerohealth-ekiti-state-college-of-health-sciences-and-technology-ijero-ekiti-1",
        "name": "IJEROHEALTH $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-ijerohealth-ekiti-state-college-of-health-sciences-and-technology-ijero-ekiti-2",
        "name": "IJEROHEALTH $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-unn-university-of-nigeria-nsukka-unn",
    "name": "University of Nigeria, Nsukka (UNN) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Enugu",
    "subdivisionCode": "NG-EN",
    "supportedStates": [
      "Enugu"
    ],
    "supportedSubdivisions": [
      "NG-EN"
    ],
    "institutionName": "University of Nigeria, Nsukka (UNN)",
    "institutionCode": "UNN",
    "institutionType": "university",
    "institutionAliases": [
      "UNN",
      "Univ of Nigeria",
      "Nsukka"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter UNN student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-unn-university-of-nigeria-nsukka-unn-1",
        "name": "UNN $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-unn-university-of-nigeria-nsukka-unn-2",
        "name": "UNN $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-esut-enugu-state-university-of-science-and-technology-esut",
    "name": "Enugu State University of Science and Technology (ESUT) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Enugu",
    "subdivisionCode": "NG-EN",
    "supportedStates": [
      "Enugu"
    ],
    "supportedSubdivisions": [
      "NG-EN"
    ],
    "institutionName": "Enugu State University of Science and Technology (ESUT)",
    "institutionCode": "ESUT",
    "institutionType": "university",
    "institutionAliases": [
      "ESUT",
      "Enugu State Univ",
      "Agbani"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter ESUT student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-esut-enugu-state-university-of-science-and-technology-esut-1",
        "name": "ESUT $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-esut-enugu-state-university-of-science-and-technology-esut-2",
        "name": "ESUT $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-gouni-godfrey-okoye-university-enugu-gouni",
    "name": "Godfrey Okoye University, Enugu (GOUNI) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Enugu",
    "subdivisionCode": "NG-EN",
    "supportedStates": [
      "Enugu"
    ],
    "supportedSubdivisions": [
      "NG-EN"
    ],
    "institutionName": "Godfrey Okoye University, Enugu (GOUNI)",
    "institutionCode": "GOUNI",
    "institutionType": "university",
    "institutionAliases": [
      "GOUNI",
      "Godfrey Okoye"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter GOUNI student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-gouni-godfrey-okoye-university-enugu-gouni-1",
        "name": "GOUNI $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-gouni-godfrey-okoye-university-enugu-gouni-2",
        "name": "GOUNI $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-imtenugu-institute-of-management-and-technology-enugu-imt",
    "name": "Institute of Management and Technology, Enugu (IMT) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Enugu",
    "subdivisionCode": "NG-EN",
    "supportedStates": [
      "Enugu"
    ],
    "supportedSubdivisions": [
      "NG-EN"
    ],
    "institutionName": "Institute of Management and Technology, Enugu (IMT)",
    "institutionCode": "IMTENUGU",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "IMT Enugu",
      "IMT",
      "Institute of Management & Tech"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter IMTENUGU student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-imtenugu-institute-of-management-and-technology-enugu-imt-1",
        "name": "IMTENUGU $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-imtenugu-institute-of-management-and-technology-enugu-imt-2",
        "name": "IMTENUGU $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fedpolyohodo-federal-polytechnic-ohodo",
    "name": "Federal Polytechnic, Ohodo Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Enugu",
    "subdivisionCode": "NG-EN",
    "supportedStates": [
      "Enugu"
    ],
    "supportedSubdivisions": [
      "NG-EN"
    ],
    "institutionName": "Federal Polytechnic, Ohodo",
    "institutionCode": "FEDPOLYOHODO",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Fed Poly Ohodo",
      "Ohodo Poly"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter FEDPOLYOHODO student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fedpolyohodo-federal-polytechnic-ohodo-1",
        "name": "FEDPOLYOHODO $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fedpolyohodo-federal-polytechnic-ohodo-2",
        "name": "FEDPOLYOHODO $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fceehaamufu-federal-college-of-education-eha-amufu-fce-eha-amufu",
    "name": "Federal College of Education, Eha-Amufu (FCE Eha-Amufu) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Enugu",
    "subdivisionCode": "NG-EN",
    "supportedStates": [
      "Enugu"
    ],
    "supportedSubdivisions": [
      "NG-EN"
    ],
    "institutionName": "Federal College of Education, Eha-Amufu (FCE Eha-Amufu)",
    "institutionCode": "FCEEHAAMUFU",
    "institutionType": "college",
    "institutionAliases": [
      "FCE Eha Amufu",
      "Eha-Amufu COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter FCEEHAAMUFU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fceehaamufu-federal-college-of-education-eha-amufu-fce-eha-amufu-1",
        "name": "FCEEHAAMUFU $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fceehaamufu-federal-college-of-education-eha-amufu-fce-eha-amufu-2",
        "name": "FCEEHAAMUFU $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-escet-enugu-state-college-of-education-technical-enugu-escet",
    "name": "Enugu State College of Education (Technical), Enugu (ESCET) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Enugu",
    "subdivisionCode": "NG-EN",
    "supportedStates": [
      "Enugu"
    ],
    "supportedSubdivisions": [
      "NG-EN"
    ],
    "institutionName": "Enugu State College of Education (Technical), Enugu (ESCET)",
    "institutionCode": "ESCET",
    "institutionType": "college",
    "institutionAliases": [
      "ESCET",
      "Enugu Tech COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter ESCET student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-escet-enugu-state-college-of-education-technical-enugu-escet-1",
        "name": "ESCET $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-escet-enugu-state-college-of-education-technical-enugu-escet-2",
        "name": "ESCET $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-uniabuja-university-of-abuja-uniabuja",
    "name": "University of Abuja (UNIABUJA) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "FCT Abuja",
    "subdivisionCode": "NG-FC",
    "supportedStates": [
      "FCT Abuja"
    ],
    "supportedSubdivisions": [
      "NG-FC"
    ],
    "institutionName": "University of Abuja (UNIABUJA)",
    "institutionCode": "UNIABUJA",
    "institutionType": "university",
    "institutionAliases": [
      "UNIABUJA",
      "Univ of Abuja",
      "Gwagwalada"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter UNIABUJA student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-uniabuja-university-of-abuja-uniabuja-1",
        "name": "UNIABUJA $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-uniabuja-university-of-abuja-uniabuja-2",
        "name": "UNIABUJA $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-nile-nile-university-of-nigeria-abuja",
    "name": "Nile University of Nigeria, Abuja Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "FCT Abuja",
    "subdivisionCode": "NG-FC",
    "supportedStates": [
      "FCT Abuja"
    ],
    "supportedSubdivisions": [
      "NG-FC"
    ],
    "institutionName": "Nile University of Nigeria, Abuja",
    "institutionCode": "NILE",
    "institutionType": "university",
    "institutionAliases": [
      "Nile University",
      "Nile Univ Abuja",
      "Nile"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter NILE student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-nile-nile-university-of-nigeria-abuja-1",
        "name": "NILE $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-nile-nile-university-of-nigeria-abuja-2",
        "name": "NILE $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-baze-baze-university-abuja",
    "name": "Baze University, Abuja Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "FCT Abuja",
    "subdivisionCode": "NG-FC",
    "supportedStates": [
      "FCT Abuja"
    ],
    "supportedSubdivisions": [
      "NG-FC"
    ],
    "institutionName": "Baze University, Abuja",
    "institutionCode": "BAZE",
    "institutionType": "university",
    "institutionAliases": [
      "Baze Univ",
      "Baze University",
      "Baze"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter BAZE student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-baze-baze-university-abuja-1",
        "name": "BAZE $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-baze-baze-university-abuja-2",
        "name": "BAZE $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-veritas-veritas-university-abuja",
    "name": "Veritas University, Abuja Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "FCT Abuja",
    "subdivisionCode": "NG-FC",
    "supportedStates": [
      "FCT Abuja"
    ],
    "supportedSubdivisions": [
      "NG-FC"
    ],
    "institutionName": "Veritas University, Abuja",
    "institutionCode": "VERITAS",
    "institutionType": "university",
    "institutionAliases": [
      "Veritas",
      "Veritas Univ Abuja"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter VERITAS student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-veritas-veritas-university-abuja-1",
        "name": "VERITAS $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-veritas-veritas-university-abuja-2",
        "name": "VERITAS $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-dorbenpoly-dorben-polytechnic-bwari-abuja",
    "name": "Dorben Polytechnic, Bwari Abuja Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "FCT Abuja",
    "subdivisionCode": "NG-FC",
    "supportedStates": [
      "FCT Abuja"
    ],
    "supportedSubdivisions": [
      "NG-FC"
    ],
    "institutionName": "Dorben Polytechnic, Bwari Abuja",
    "institutionCode": "DORBENPOLY",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Dorben Poly",
      "Bwari Poly",
      "Dorben"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter DORBENPOLY student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-dorbenpoly-dorben-polytechnic-bwari-abuja-1",
        "name": "DORBENPOLY $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-dorbenpoly-dorben-polytechnic-bwari-abuja-2",
        "name": "DORBENPOLY $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fcezuba-federal-college-of-education-zuba-abuja-fce-zuba",
    "name": "Federal College of Education, Zuba Abuja (FCE Zuba) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "FCT Abuja",
    "subdivisionCode": "NG-FC",
    "supportedStates": [
      "FCT Abuja"
    ],
    "supportedSubdivisions": [
      "NG-FC"
    ],
    "institutionName": "Federal College of Education, Zuba Abuja (FCE Zuba)",
    "institutionCode": "FCEZUBA",
    "institutionType": "college",
    "institutionAliases": [
      "FCE Zuba",
      "Zuba COE",
      "Abuja COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter FCEZUBA student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fcezuba-federal-college-of-education-zuba-abuja-fce-zuba-1",
        "name": "FCEZUBA $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fcezuba-federal-college-of-education-zuba-abuja-fce-zuba-2",
        "name": "FCEZUBA $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fukashere-federal-university-kashere-fukashere",
    "name": "Federal University, Kashere (FUKashere) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Gombe",
    "subdivisionCode": "NG-GO",
    "supportedStates": [
      "Gombe"
    ],
    "supportedSubdivisions": [
      "NG-GO"
    ],
    "institutionName": "Federal University, Kashere (FUKashere)",
    "institutionCode": "FUKASHERE",
    "institutionType": "university",
    "institutionAliases": [
      "FUKashere",
      "Fed Univ Kashere",
      "Kashere"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter FUKASHERE student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fukashere-federal-university-kashere-fukashere-1",
        "name": "FUKASHERE $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fukashere-federal-university-kashere-fukashere-2",
        "name": "FUKASHERE $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-gsu-gombe-state-university-tudun-wada-gsu",
    "name": "Gombe State University, Tudun Wada (GSU) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Gombe",
    "subdivisionCode": "NG-GO",
    "supportedStates": [
      "Gombe"
    ],
    "supportedSubdivisions": [
      "NG-GO"
    ],
    "institutionName": "Gombe State University, Tudun Wada (GSU)",
    "institutionCode": "GSU",
    "institutionType": "university",
    "institutionAliases": [
      "GSU",
      "Gombe State Univ",
      "Tudun Wada"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter GSU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-gsu-gombe-state-university-tudun-wada-gsu-1",
        "name": "GSU $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-gsu-gombe-state-university-tudun-wada-gsu-2",
        "name": "GSU $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fedpolykaltungo-federal-polytechnic-kaltungo",
    "name": "Federal Polytechnic, Kaltungo Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Gombe",
    "subdivisionCode": "NG-GO",
    "supportedStates": [
      "Gombe"
    ],
    "supportedSubdivisions": [
      "NG-GO"
    ],
    "institutionName": "Federal Polytechnic, Kaltungo",
    "institutionCode": "FEDPOLYKALTUNGO",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Fed Poly Kaltungo",
      "Kaltungo Poly"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter FEDPOLYKALTUNGO student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fedpolykaltungo-federal-polytechnic-kaltungo-1",
        "name": "FEDPOLYKALTUNGO $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fedpolykaltungo-federal-polytechnic-kaltungo-2",
        "name": "FEDPOLYKALTUNGO $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-gombepolybajoga-gombe-state-polytechnic-bajoga",
    "name": "Gombe State Polytechnic, Bajoga Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Gombe",
    "subdivisionCode": "NG-GO",
    "supportedStates": [
      "Gombe"
    ],
    "supportedSubdivisions": [
      "NG-GO"
    ],
    "institutionName": "Gombe State Polytechnic, Bajoga",
    "institutionCode": "GOMBEPOLYBAJOGA",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Bajoga Poly",
      "Gombe Poly"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter GOMBEPOLYBAJOGA student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-gombepolybajoga-gombe-state-polytechnic-bajoga-1",
        "name": "GOMBEPOLYBAJOGA $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-gombepolybajoga-gombe-state-polytechnic-bajoga-2",
        "name": "GOMBEPOLYBAJOGA $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fcetgombe-federal-college-of-education-technical-gombe",
    "name": "Federal College of Education (Technical) Gombe Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Gombe",
    "subdivisionCode": "NG-GO",
    "supportedStates": [
      "Gombe"
    ],
    "supportedSubdivisions": [
      "NG-GO"
    ],
    "institutionName": "Federal College of Education (Technical) Gombe",
    "institutionCode": "FCETGOMBE",
    "institutionType": "college",
    "institutionAliases": [
      "FCET Gombe",
      "Gombe Tech COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter FCETGOMBE student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fcetgombe-federal-college-of-education-technical-gombe-1",
        "name": "FCETGOMBE $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fcetgombe-federal-college-of-education-technical-gombe-2",
        "name": "FCETGOMBE $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-coebilliri-college-of-education-billiri",
    "name": "College of Education, Billiri Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Gombe",
    "subdivisionCode": "NG-GO",
    "supportedStates": [
      "Gombe"
    ],
    "supportedSubdivisions": [
      "NG-GO"
    ],
    "institutionName": "College of Education, Billiri",
    "institutionCode": "COEBILLIRI",
    "institutionType": "college",
    "institutionAliases": [
      "Billiri COE",
      "Gombe COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter COEBILLIRI student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-coebilliri-college-of-education-billiri-1",
        "name": "COEBILLIRI $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-coebilliri-college-of-education-billiri-2",
        "name": "COEBILLIRI $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-futo-federal-university-of-technology-owerri-futo",
    "name": "Federal University of Technology, Owerri (FUTO) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Imo",
    "subdivisionCode": "NG-IM",
    "supportedStates": [
      "Imo"
    ],
    "supportedSubdivisions": [
      "NG-IM"
    ],
    "institutionName": "Federal University of Technology, Owerri (FUTO)",
    "institutionCode": "FUTO",
    "institutionType": "university",
    "institutionAliases": [
      "FUTO",
      "Tech Owerri",
      "Owerri Univ"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter FUTO student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-futo-federal-university-of-technology-owerri-futo-1",
        "name": "FUTO $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-futo-federal-university-of-technology-owerri-futo-2",
        "name": "FUTO $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-imsu-imo-state-university-owerri-imsu",
    "name": "Imo State University, Owerri (IMSU) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Imo",
    "subdivisionCode": "NG-IM",
    "supportedStates": [
      "Imo"
    ],
    "supportedSubdivisions": [
      "NG-IM"
    ],
    "institutionName": "Imo State University, Owerri (IMSU)",
    "institutionCode": "IMSU",
    "institutionType": "university",
    "institutionAliases": [
      "IMSU",
      "Imo State Univ"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter IMSU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-imsu-imo-state-university-owerri-imsu-1",
        "name": "IMSU $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-imsu-imo-state-university-owerri-imsu-2",
        "name": "IMSU $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fedponek-federal-polytechnic-nekede-owerri",
    "name": "Federal Polytechnic, Nekede Owerri Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Imo",
    "subdivisionCode": "NG-IM",
    "supportedStates": [
      "Imo"
    ],
    "supportedSubdivisions": [
      "NG-IM"
    ],
    "institutionName": "Federal Polytechnic, Nekede Owerri",
    "institutionCode": "FEDPONEK",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Fed Poly Nekede",
      "Nekede Poly",
      "FEDPONEK"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter FEDPONEK student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fedponek-federal-polytechnic-nekede-owerri-1",
        "name": "FEDPONEK $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fedponek-federal-polytechnic-nekede-owerri-2",
        "name": "FEDPONEK $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-imopoly-imo-state-polytechnic-omuma-imopoly",
    "name": "Imo State Polytechnic, Omuma (IMOPOLY) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Imo",
    "subdivisionCode": "NG-IM",
    "supportedStates": [
      "Imo"
    ],
    "supportedSubdivisions": [
      "NG-IM"
    ],
    "institutionName": "Imo State Polytechnic, Omuma (IMOPOLY)",
    "institutionCode": "IMOPOLY",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Imo Poly",
      "Omuma Poly",
      "Umuagwo"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter IMOPOLY student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-imopoly-imo-state-polytechnic-omuma-imopoly-1",
        "name": "IMOPOLY $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-imopoly-imo-state-polytechnic-omuma-imopoly-2",
        "name": "IMOPOLY $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-alvan-alvan-ikoku-federal-college-of-education-owerri-alvan",
    "name": "Alvan Ikoku Federal College of Education, Owerri (ALVAN) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Imo",
    "subdivisionCode": "NG-IM",
    "supportedStates": [
      "Imo"
    ],
    "supportedSubdivisions": [
      "NG-IM"
    ],
    "institutionName": "Alvan Ikoku Federal College of Education, Owerri (ALVAN)",
    "institutionCode": "ALVAN",
    "institutionType": "college",
    "institutionAliases": [
      "Alvan Ikoku",
      "Alvan",
      "ALVAN Owerri"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter ALVAN student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-alvan-alvan-ikoku-federal-college-of-education-owerri-alvan-1",
        "name": "ALVAN $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-alvan-alvan-ikoku-federal-college-of-education-owerri-alvan-2",
        "name": "ALVAN $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fudutse-federal-university-dutse-fudutse",
    "name": "Federal University, Dutse (FUDutse) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Jigawa",
    "subdivisionCode": "NG-JI",
    "supportedStates": [
      "Jigawa"
    ],
    "supportedSubdivisions": [
      "NG-JI"
    ],
    "institutionName": "Federal University, Dutse (FUDutse)",
    "institutionCode": "FUDUTSE",
    "institutionType": "university",
    "institutionAliases": [
      "FUD",
      "FUDutse",
      "Fed Univ Dutse",
      "Dutse"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter FUDUTSE student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fudutse-federal-university-dutse-fudutse-1",
        "name": "FUDUTSE $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fudutse-federal-university-dutse-fudutse-2",
        "name": "FUDUTSE $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-slu-sule-lamido-university-kafin-hausa-slu",
    "name": "Sule Lamido University, Kafin Hausa (SLU) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Jigawa",
    "subdivisionCode": "NG-JI",
    "supportedStates": [
      "Jigawa"
    ],
    "supportedSubdivisions": [
      "NG-JI"
    ],
    "institutionName": "Sule Lamido University, Kafin Hausa (SLU)",
    "institutionCode": "SLU",
    "institutionType": "university",
    "institutionAliases": [
      "SLU",
      "Sule Lamido Univ",
      "Kafin Hausa"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter SLU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-slu-sule-lamido-university-kafin-hausa-slu-1",
        "name": "SLU $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-slu-sule-lamido-university-kafin-hausa-slu-2",
        "name": "SLU $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-khadija-khadija-university-majia",
    "name": "Khadija University, Majia Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Jigawa",
    "subdivisionCode": "NG-JI",
    "supportedStates": [
      "Jigawa"
    ],
    "supportedSubdivisions": [
      "NG-JI"
    ],
    "institutionName": "Khadija University, Majia",
    "institutionCode": "KHADIJA",
    "institutionType": "university",
    "institutionAliases": [
      "Khadija Univ",
      "Khadija Majia"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter KHADIJA student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-khadija-khadija-university-majia-1",
        "name": "KHADIJA $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-khadija-khadija-university-majia-2",
        "name": "KHADIJA $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-hafedpoly-hussaini-adamu-federal-polytechnic-kazaure-hafedpoly",
    "name": "Hussaini Adamu Federal Polytechnic, Kazaure (HAFEDPOLY) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Jigawa",
    "subdivisionCode": "NG-JI",
    "supportedStates": [
      "Jigawa"
    ],
    "supportedSubdivisions": [
      "NG-JI"
    ],
    "institutionName": "Hussaini Adamu Federal Polytechnic, Kazaure (HAFEDPOLY)",
    "institutionCode": "HAFEDPOLY",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Kazaure Poly",
      "Hussaini Adamu",
      "HAFEDPOLY"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter HAFEDPOLY student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-hafedpoly-hussaini-adamu-federal-polytechnic-kazaure-hafedpoly-1",
        "name": "HAFEDPOLY $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-hafedpoly-hussaini-adamu-federal-polytechnic-kazaure-hafedpoly-2",
        "name": "HAFEDPOLY $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-jigawapoly-jigawa-state-polytechnic-dutse",
    "name": "Jigawa State Polytechnic, Dutse Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Jigawa",
    "subdivisionCode": "NG-JI",
    "supportedStates": [
      "Jigawa"
    ],
    "supportedSubdivisions": [
      "NG-JI"
    ],
    "institutionName": "Jigawa State Polytechnic, Dutse",
    "institutionCode": "JIGAWAPOLY",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Jigawa Poly",
      "Dutse Poly"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter JIGAWAPOLY student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-jigawapoly-jigawa-state-polytechnic-dutse-1",
        "name": "JIGAWAPOLY $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-jigawapoly-jigawa-state-polytechnic-dutse-2",
        "name": "JIGAWAPOLY $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-jscoegumel-jigawa-state-college-of-education-gumel-jscoe",
    "name": "Jigawa State College of Education, Gumel (JSCOE) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Jigawa",
    "subdivisionCode": "NG-JI",
    "supportedStates": [
      "Jigawa"
    ],
    "supportedSubdivisions": [
      "NG-JI"
    ],
    "institutionName": "Jigawa State College of Education, Gumel (JSCOE)",
    "institutionCode": "JSCOEGUMEL",
    "institutionType": "college",
    "institutionAliases": [
      "Gumel COE",
      "Jigawa COE",
      "JSCOE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter JSCOEGUMEL student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-jscoegumel-jigawa-state-college-of-education-gumel-jscoe-1",
        "name": "JSCOEGUMEL $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-jscoegumel-jigawa-state-college-of-education-gumel-jscoe-2",
        "name": "JSCOEGUMEL $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-buphadejia-bilyaminu-usman-polytechnic-college-hadejia",
    "name": "Bilyaminu Usman Polytechnic / College, Hadejia Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Jigawa",
    "subdivisionCode": "NG-JI",
    "supportedStates": [
      "Jigawa"
    ],
    "supportedSubdivisions": [
      "NG-JI"
    ],
    "institutionName": "Bilyaminu Usman Polytechnic / College, Hadejia",
    "institutionCode": "BUPHADEJIA",
    "institutionType": "college",
    "institutionAliases": [
      "Hadejia Poly",
      "Bilyaminu Usman",
      "Hadejia College"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter BUPHADEJIA student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-buphadejia-bilyaminu-usman-polytechnic-college-hadejia-1",
        "name": "BUPHADEJIA $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-buphadejia-bilyaminu-usman-polytechnic-college-hadejia-2",
        "name": "BUPHADEJIA $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-abu-ahmadu-bello-university-zaria-abu",
    "name": "Ahmadu Bello University, Zaria (ABU) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kaduna",
    "subdivisionCode": "NG-KD",
    "supportedStates": [
      "Kaduna"
    ],
    "supportedSubdivisions": [
      "NG-KD"
    ],
    "institutionName": "Ahmadu Bello University, Zaria (ABU)",
    "institutionCode": "ABU",
    "institutionType": "university",
    "institutionAliases": [
      "ABU",
      "Ahmadu Bello",
      "Zaria",
      "ABU Zaria"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter ABU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-abu-ahmadu-bello-university-zaria-abu-1",
        "name": "ABU $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-abu-ahmadu-bello-university-zaria-abu-2",
        "name": "ABU $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-kasu-kaduna-state-university-kasu",
    "name": "Kaduna State University (KASU) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kaduna",
    "subdivisionCode": "NG-KD",
    "supportedStates": [
      "Kaduna"
    ],
    "supportedSubdivisions": [
      "NG-KD"
    ],
    "institutionName": "Kaduna State University (KASU)",
    "institutionCode": "KASU",
    "institutionType": "university",
    "institutionAliases": [
      "KASU",
      "Kaduna State Univ",
      "Kaduna Univ"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter KASU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-kasu-kaduna-state-university-kasu-1",
        "name": "KASU $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-kasu-kaduna-state-university-kasu-2",
        "name": "KASU $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-afit-air-force-institute-of-technology-kaduna-afit",
    "name": "Air Force Institute of Technology, Kaduna (AFIT) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kaduna",
    "subdivisionCode": "NG-KD",
    "supportedStates": [
      "Kaduna"
    ],
    "supportedSubdivisions": [
      "NG-KD"
    ],
    "institutionName": "Air Force Institute of Technology, Kaduna (AFIT)",
    "institutionCode": "AFIT",
    "institutionType": "university",
    "institutionAliases": [
      "AFIT",
      "AFIT Kaduna",
      "Air Force Institute"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter AFIT student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-afit-air-force-institute-of-technology-kaduna-afit-1",
        "name": "AFIT $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-afit-air-force-institute-of-technology-kaduna-afit-2",
        "name": "AFIT $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-greenfield-greenfield-university-kaduna",
    "name": "Greenfield University, Kaduna Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kaduna",
    "subdivisionCode": "NG-KD",
    "supportedStates": [
      "Kaduna"
    ],
    "supportedSubdivisions": [
      "NG-KD"
    ],
    "institutionName": "Greenfield University, Kaduna",
    "institutionCode": "GREENFIELD",
    "institutionType": "university",
    "institutionAliases": [
      "Greenfield Univ",
      "Greenfield Kaduna"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter GREENFIELD student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-greenfield-greenfield-university-kaduna-1",
        "name": "GREENFIELD $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-greenfield-greenfield-university-kaduna-2",
        "name": "GREENFIELD $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-kadpoly-kaduna-polytechnic-kadpoly",
    "name": "Kaduna Polytechnic (KADPOLY) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kaduna",
    "subdivisionCode": "NG-KD",
    "supportedStates": [
      "Kaduna"
    ],
    "supportedSubdivisions": [
      "NG-KD"
    ],
    "institutionName": "Kaduna Polytechnic (KADPOLY)",
    "institutionCode": "KADPOLY",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "KadPoly",
      "Kaduna Poly",
      "KADPOLY"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter KADPOLY student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-kadpoly-kaduna-polytechnic-kadpoly-1",
        "name": "KADPOLY $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-kadpoly-kaduna-polytechnic-kadpoly-2",
        "name": "KADPOLY $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-nubapoly-nuhu-bamalli-polytechnic-zaria-nubapoly",
    "name": "Nuhu Bamalli Polytechnic, Zaria (NUBAPOLY) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kaduna",
    "subdivisionCode": "NG-KD",
    "supportedStates": [
      "Kaduna"
    ],
    "supportedSubdivisions": [
      "NG-KD"
    ],
    "institutionName": "Nuhu Bamalli Polytechnic, Zaria (NUBAPOLY)",
    "institutionCode": "NUBAPOLY",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Nuhu Bamalli",
      "Zaria Poly",
      "NUBAPOLY"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter NUBAPOLY student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-nubapoly-nuhu-bamalli-polytechnic-zaria-nubapoly-1",
        "name": "NUBAPOLY $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-nubapoly-nuhu-bamalli-polytechnic-zaria-nubapoly-2",
        "name": "NUBAPOLY $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fcezaria-federal-college-of-education-zaria-fce-zaria",
    "name": "Federal College of Education, Zaria (FCE Zaria) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kaduna",
    "subdivisionCode": "NG-KD",
    "supportedStates": [
      "Kaduna"
    ],
    "supportedSubdivisions": [
      "NG-KD"
    ],
    "institutionName": "Federal College of Education, Zaria (FCE Zaria)",
    "institutionCode": "FCEZARIA",
    "institutionType": "college",
    "institutionAliases": [
      "FCE Zaria",
      "Zaria COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter FCEZARIA student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fcezaria-federal-college-of-education-zaria-fce-zaria-1",
        "name": "FCEZARIA $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fcezaria-federal-college-of-education-zaria-fce-zaria-2",
        "name": "FCEZARIA $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-kscoe-kaduna-state-college-of-education-gidan-waya-kscoe",
    "name": "Kaduna State College of Education, Gidan Waya (KSCOE) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kaduna",
    "subdivisionCode": "NG-KD",
    "supportedStates": [
      "Kaduna"
    ],
    "supportedSubdivisions": [
      "NG-KD"
    ],
    "institutionName": "Kaduna State College of Education, Gidan Waya (KSCOE)",
    "institutionCode": "KSCOE",
    "institutionType": "college",
    "institutionAliases": [
      "Gidan Waya COE",
      "Kaduna COE",
      "KSCOE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter KSCOE student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-kscoe-kaduna-state-college-of-education-gidan-waya-kscoe-1",
        "name": "KSCOE $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-kscoe-kaduna-state-college-of-education-gidan-waya-kscoe-2",
        "name": "KSCOE $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-umyu-umaru-musa-yar-adua-university-katsina-umyu",
    "name": "Umaru Musa Yar'adua University, Katsina (UMYU) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Katsina",
    "subdivisionCode": "NG-KT",
    "supportedStates": [
      "Katsina"
    ],
    "supportedSubdivisions": [
      "NG-KT"
    ],
    "institutionName": "Umaru Musa Yar'adua University, Katsina (UMYU)",
    "institutionCode": "UMYU",
    "institutionType": "university",
    "institutionAliases": [
      "UMYU",
      "Yaradua Univ",
      "Katsina State Univ"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter UMYU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-umyu-umaru-musa-yar-adua-university-katsina-umyu-1",
        "name": "UMYU $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-umyu-umaru-musa-yar-adua-university-katsina-umyu-2",
        "name": "UMYU $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fudma-federal-university-dutsin-ma-fudma",
    "name": "Federal University, Dutsin-Ma (FUDMA) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Katsina",
    "subdivisionCode": "NG-KT",
    "supportedStates": [
      "Katsina"
    ],
    "supportedSubdivisions": [
      "NG-KT"
    ],
    "institutionName": "Federal University, Dutsin-Ma (FUDMA)",
    "institutionCode": "FUDMA",
    "institutionType": "university",
    "institutionAliases": [
      "FUDMA",
      "Fed Univ Dutsinma",
      "Dutsin-Ma"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter FUDMA student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fudma-federal-university-dutsin-ma-fudma-1",
        "name": "FUDMA $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fudma-federal-university-dutsin-ma-fudma-2",
        "name": "FUDMA $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-auk-al-qalam-university-katsina-auk",
    "name": "Al-Qalam University, Katsina (AUK) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Katsina",
    "subdivisionCode": "NG-KT",
    "supportedStates": [
      "Katsina"
    ],
    "supportedSubdivisions": [
      "NG-KT"
    ],
    "institutionName": "Al-Qalam University, Katsina (AUK)",
    "institutionCode": "AUK",
    "institutionType": "university",
    "institutionAliases": [
      "Al-Qalam",
      "AUK Katsina",
      "Alqalam"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter AUK student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-auk-al-qalam-university-katsina-auk-1",
        "name": "AUK $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-auk-al-qalam-university-katsina-auk-2",
        "name": "AUK $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-hukpoly-hassan-usman-katsina-polytechnic-hukpoly",
    "name": "Hassan Usman Katsina Polytechnic (HUKPOLY) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Katsina",
    "subdivisionCode": "NG-KT",
    "supportedStates": [
      "Katsina"
    ],
    "supportedSubdivisions": [
      "NG-KT"
    ],
    "institutionName": "Hassan Usman Katsina Polytechnic (HUKPOLY)",
    "institutionCode": "HUKPOLY",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Hassan Usman Poly",
      "HUKPOLY",
      "Katsina Poly"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter HUKPOLY student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-hukpoly-hassan-usman-katsina-polytechnic-hukpoly-1",
        "name": "HUKPOLY $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-hukpoly-hassan-usman-katsina-polytechnic-hukpoly-2",
        "name": "HUKPOLY $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fedpolydaura-federal-polytechnic-daura",
    "name": "Federal Polytechnic, Daura Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Katsina",
    "subdivisionCode": "NG-KT",
    "supportedStates": [
      "Katsina"
    ],
    "supportedSubdivisions": [
      "NG-KT"
    ],
    "institutionName": "Federal Polytechnic, Daura",
    "institutionCode": "FEDPOLYDAURA",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Fed Poly Daura",
      "Daura Poly"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter FEDPOLYDAURA student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fedpolydaura-federal-polytechnic-daura-1",
        "name": "FEDPOLYDAURA $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fedpolydaura-federal-polytechnic-daura-2",
        "name": "FEDPOLYDAURA $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fcekatsina-federal-college-of-education-katsina-fce-katsina",
    "name": "Federal College of Education, Katsina (FCE Katsina) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Katsina",
    "subdivisionCode": "NG-KT",
    "supportedStates": [
      "Katsina"
    ],
    "supportedSubdivisions": [
      "NG-KT"
    ],
    "institutionName": "Federal College of Education, Katsina (FCE Katsina)",
    "institutionCode": "FCEKATSINA",
    "institutionType": "college",
    "institutionAliases": [
      "FCE Katsina",
      "Katsina FCE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter FCEKATSINA student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fcekatsina-federal-college-of-education-katsina-fce-katsina-1",
        "name": "FCEKATSINA $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fcekatsina-federal-college-of-education-katsina-fce-katsina-2",
        "name": "FCEKATSINA $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-ikcoe-isa-kaita-college-of-education-dutsin-ma-ikcoe",
    "name": "Isa Kaita College of Education, Dutsin-Ma (IKCOE) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Katsina",
    "subdivisionCode": "NG-KT",
    "supportedStates": [
      "Katsina"
    ],
    "supportedSubdivisions": [
      "NG-KT"
    ],
    "institutionName": "Isa Kaita College of Education, Dutsin-Ma (IKCOE)",
    "institutionCode": "IKCOE",
    "institutionType": "college",
    "institutionAliases": [
      "Isa Kaita COE",
      "IKCOE Dutsinma"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter IKCOE student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-ikcoe-isa-kaita-college-of-education-dutsin-ma-ikcoe-1",
        "name": "IKCOE $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-ikcoe-isa-kaita-college-of-education-dutsin-ma-ikcoe-2",
        "name": "IKCOE $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fubk-federal-university-birnin-kebbi-fubk",
    "name": "Federal University, Birnin Kebbi (FUBK) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kebbi",
    "subdivisionCode": "NG-KE",
    "supportedStates": [
      "Kebbi"
    ],
    "supportedSubdivisions": [
      "NG-KE"
    ],
    "institutionName": "Federal University, Birnin Kebbi (FUBK)",
    "institutionCode": "FUBK",
    "institutionType": "university",
    "institutionAliases": [
      "FUBK",
      "Fed Univ Birnin Kebbi",
      "Birnin Kebbi"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter FUBK student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fubk-federal-university-birnin-kebbi-fubk-1",
        "name": "FUBK $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fubk-federal-university-birnin-kebbi-fubk-2",
        "name": "FUBK $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-ksusta-kebbi-state-university-of-science-and-technology-aliero-ksusta",
    "name": "Kebbi State University of Science and Technology, Aliero (KSUSTA) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kebbi",
    "subdivisionCode": "NG-KE",
    "supportedStates": [
      "Kebbi"
    ],
    "supportedSubdivisions": [
      "NG-KE"
    ],
    "institutionName": "Kebbi State University of Science and Technology, Aliero (KSUSTA)",
    "institutionCode": "KSUSTA",
    "institutionType": "university",
    "institutionAliases": [
      "KSUSTA",
      "Aliero Univ",
      "Kebbi Tech Univ"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter KSUSTA student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-ksusta-kebbi-state-university-of-science-and-technology-aliero-ksusta-1",
        "name": "KSUSTA $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-ksusta-kebbi-state-university-of-science-and-technology-aliero-ksusta-2",
        "name": "KSUSTA $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-wufpbk-waziri-umaru-federal-polytechnic-birnin-kebbi-wufpbk",
    "name": "Waziri Umaru Federal Polytechnic, Birnin Kebbi (WUFPBK) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kebbi",
    "subdivisionCode": "NG-KE",
    "supportedStates": [
      "Kebbi"
    ],
    "supportedSubdivisions": [
      "NG-KE"
    ],
    "institutionName": "Waziri Umaru Federal Polytechnic, Birnin Kebbi (WUFPBK)",
    "institutionCode": "WUFPBK",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Waziri Umaru Poly",
      "WUFPBK",
      "Kebbi Poly"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter WUFPBK student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-wufpbk-waziri-umaru-federal-polytechnic-birnin-kebbi-wufpbk-1",
        "name": "WUFPBK $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-wufpbk-waziri-umaru-federal-polytechnic-birnin-kebbi-wufpbk-2",
        "name": "WUFPBK $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-aacoe-adamu-augie-college-of-education-argungu-aacoe",
    "name": "Adamu Augie College of Education, Argungu (AACOE) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kebbi",
    "subdivisionCode": "NG-KE",
    "supportedStates": [
      "Kebbi"
    ],
    "supportedSubdivisions": [
      "NG-KE"
    ],
    "institutionName": "Adamu Augie College of Education, Argungu (AACOE)",
    "institutionCode": "AACOE",
    "institutionType": "college",
    "institutionAliases": [
      "Adamu Augie COE",
      "Argungu COE",
      "AACOE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter AACOE student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-aacoe-adamu-augie-college-of-education-argungu-aacoe-1",
        "name": "AACOE $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-aacoe-adamu-augie-college-of-education-argungu-aacoe-2",
        "name": "AACOE $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-kebbinursing-kebbi-state-college-of-nursing-sciences-birnin-kebbi",
    "name": "Kebbi State College of Nursing Sciences, Birnin Kebbi Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kebbi",
    "subdivisionCode": "NG-KE",
    "supportedStates": [
      "Kebbi"
    ],
    "supportedSubdivisions": [
      "NG-KE"
    ],
    "institutionName": "Kebbi State College of Nursing Sciences, Birnin Kebbi",
    "institutionCode": "KEBBINURSING",
    "institutionType": "college",
    "institutionAliases": [
      "Kebbi Nursing",
      "Birnin Kebbi Nursing"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter KEBBINURSING student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-kebbinursing-kebbi-state-college-of-nursing-sciences-birnin-kebbi-1",
        "name": "KEBBINURSING $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-kebbinursing-kebbi-state-college-of-nursing-sciences-birnin-kebbi-2",
        "name": "KEBBINURSING $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fulokoja-federal-university-lokoja-fulokoja",
    "name": "Federal University, Lokoja (FULokoja) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kogi",
    "subdivisionCode": "NG-KO",
    "supportedStates": [
      "Kogi"
    ],
    "supportedSubdivisions": [
      "NG-KO"
    ],
    "institutionName": "Federal University, Lokoja (FULokoja)",
    "institutionCode": "FULOKOJA",
    "institutionType": "university",
    "institutionAliases": [
      "FULokoja",
      "Fed Univ Lokoja",
      "Lokoja Univ"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter FULOKOJA student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fulokoja-federal-university-lokoja-fulokoja-1",
        "name": "FULOKOJA $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fulokoja-federal-university-lokoja-fulokoja-2",
        "name": "FULOKOJA $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-paau-prince-abubakar-audu-university-anyigba-paau-ksu",
    "name": "Prince Abubakar Audu University, Anyigba (PAAU / KSU) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kogi",
    "subdivisionCode": "NG-KO",
    "supportedStates": [
      "Kogi"
    ],
    "supportedSubdivisions": [
      "NG-KO"
    ],
    "institutionName": "Prince Abubakar Audu University, Anyigba (PAAU / KSU)",
    "institutionCode": "PAAU",
    "institutionType": "university",
    "institutionAliases": [
      "PAAU",
      "Kogi State Univ",
      "Anyigba",
      "KSU"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter PAAU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-paau-prince-abubakar-audu-university-anyigba-paau-ksu-1",
        "name": "PAAU $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-paau-prince-abubakar-audu-university-anyigba-paau-ksu-2",
        "name": "PAAU $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-custech-confluence-university-of-science-and-technology-osara-custech",
    "name": "Confluence University of Science and Technology, Osara (CUSTECH) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kogi",
    "subdivisionCode": "NG-KO",
    "supportedStates": [
      "Kogi"
    ],
    "supportedSubdivisions": [
      "NG-KO"
    ],
    "institutionName": "Confluence University of Science and Technology, Osara (CUSTECH)",
    "institutionCode": "CUSTECH",
    "institutionType": "university",
    "institutionAliases": [
      "CUSTECH",
      "Confluence Univ",
      "Osara"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter CUSTECH student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-custech-confluence-university-of-science-and-technology-osara-custech-1",
        "name": "CUSTECH $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-custech-confluence-university-of-science-and-technology-osara-custech-2",
        "name": "CUSTECH $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fedpolyidah-federal-polytechnic-idah",
    "name": "Federal Polytechnic, Idah Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kogi",
    "subdivisionCode": "NG-KO",
    "supportedStates": [
      "Kogi"
    ],
    "supportedSubdivisions": [
      "NG-KO"
    ],
    "institutionName": "Federal Polytechnic, Idah",
    "institutionCode": "FEDPOLYIDAH",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Fed Poly Idah",
      "Idah Poly",
      "IDAHPOLY"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter FEDPOLYIDAH student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fedpolyidah-federal-polytechnic-idah-1",
        "name": "FEDPOLYIDAH $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fedpolyidah-federal-polytechnic-idah-2",
        "name": "FEDPOLYIDAH $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-kogipoly-kogi-state-polytechnic-lokoja",
    "name": "Kogi State Polytechnic, Lokoja Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kogi",
    "subdivisionCode": "NG-KO",
    "supportedStates": [
      "Kogi"
    ],
    "supportedSubdivisions": [
      "NG-KO"
    ],
    "institutionName": "Kogi State Polytechnic, Lokoja",
    "institutionCode": "KOGIPOLY",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Kogi Poly",
      "Lokoja Poly",
      "KOGIPOLY"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter KOGIPOLY student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-kogipoly-kogi-state-polytechnic-lokoja-1",
        "name": "KOGIPOLY $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-kogipoly-kogi-state-polytechnic-lokoja-2",
        "name": "KOGIPOLY $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fceokene-federal-college-of-education-okene-fce-okene",
    "name": "Federal College of Education, Okene (FCE Okene) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kogi",
    "subdivisionCode": "NG-KO",
    "supportedStates": [
      "Kogi"
    ],
    "supportedSubdivisions": [
      "NG-KO"
    ],
    "institutionName": "Federal College of Education, Okene (FCE Okene)",
    "institutionCode": "FCEOKENE",
    "institutionType": "college",
    "institutionAliases": [
      "FCE Okene",
      "Okene COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter FCEOKENE student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fceokene-federal-college-of-education-okene-fce-okene-1",
        "name": "FCEOKENE $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fceokene-federal-college-of-education-okene-fce-okene-2",
        "name": "FCEOKENE $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-coeankpa-kogi-state-college-of-education-ankpa",
    "name": "Kogi State College of Education, Ankpa Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kogi",
    "subdivisionCode": "NG-KO",
    "supportedStates": [
      "Kogi"
    ],
    "supportedSubdivisions": [
      "NG-KO"
    ],
    "institutionName": "Kogi State College of Education, Ankpa",
    "institutionCode": "COEANKPA",
    "institutionType": "college",
    "institutionAliases": [
      "Ankpa COE",
      "Kogi COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter COEANKPA student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-coeankpa-kogi-state-college-of-education-ankpa-1",
        "name": "COEANKPA $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-coeankpa-kogi-state-college-of-education-ankpa-2",
        "name": "COEANKPA $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-unilorin-university-of-ilorin-unilorin",
    "name": "University of Ilorin (UNILORIN) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kwara",
    "subdivisionCode": "NG-KW",
    "supportedStates": [
      "Kwara"
    ],
    "supportedSubdivisions": [
      "NG-KW"
    ],
    "institutionName": "University of Ilorin (UNILORIN)",
    "institutionCode": "UNILORIN",
    "institutionType": "university",
    "institutionAliases": [
      "UNILORIN",
      "Univ of Ilorin",
      "Ilorin"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter UNILORIN student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-unilorin-university-of-ilorin-unilorin-1",
        "name": "UNILORIN $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-unilorin-university-of-ilorin-unilorin-2",
        "name": "UNILORIN $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-kwasu-kwara-state-university-malete-kwasu",
    "name": "Kwara State University, Malete (KWASU) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kwara",
    "subdivisionCode": "NG-KW",
    "supportedStates": [
      "Kwara"
    ],
    "supportedSubdivisions": [
      "NG-KW"
    ],
    "institutionName": "Kwara State University, Malete (KWASU)",
    "institutionCode": "KWASU",
    "institutionType": "university",
    "institutionAliases": [
      "KWASU",
      "Malete Univ",
      "Kwara State Univ"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter KWASU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-kwasu-kwara-state-university-malete-kwasu-1",
        "name": "KWASU $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-kwasu-kwara-state-university-malete-kwasu-2",
        "name": "KWASU $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-alhikmah-al-hikmah-university-ilorin",
    "name": "Al-Hikmah University, Ilorin Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kwara",
    "subdivisionCode": "NG-KW",
    "supportedStates": [
      "Kwara"
    ],
    "supportedSubdivisions": [
      "NG-KW"
    ],
    "institutionName": "Al-Hikmah University, Ilorin",
    "institutionCode": "ALHIKMAH",
    "institutionType": "university",
    "institutionAliases": [
      "Al-Hikmah",
      "Al Hikmah Ilorin"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter ALHIKMAH student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-alhikmah-al-hikmah-university-ilorin-1",
        "name": "ALHIKMAH $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-alhikmah-al-hikmah-university-ilorin-2",
        "name": "ALHIKMAH $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-offapoly-federal-polytechnic-offa-offapoly",
    "name": "Federal Polytechnic, Offa (OFFAPOLY) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kwara",
    "subdivisionCode": "NG-KW",
    "supportedStates": [
      "Kwara"
    ],
    "supportedSubdivisions": [
      "NG-KW"
    ],
    "institutionName": "Federal Polytechnic, Offa (OFFAPOLY)",
    "institutionCode": "OFFAPOLY",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Offa Poly",
      "Fed Poly Offa",
      "OFFAPOLY"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter OFFAPOLY student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-offapoly-federal-polytechnic-offa-offapoly-1",
        "name": "OFFAPOLY $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-offapoly-federal-polytechnic-offa-offapoly-2",
        "name": "OFFAPOLY $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-kwarapoly-kwara-state-polytechnic-ilorin-kwarapoly",
    "name": "Kwara State Polytechnic, Ilorin (KWARAPOLY) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kwara",
    "subdivisionCode": "NG-KW",
    "supportedStates": [
      "Kwara"
    ],
    "supportedSubdivisions": [
      "NG-KW"
    ],
    "institutionName": "Kwara State Polytechnic, Ilorin (KWARAPOLY)",
    "institutionCode": "KWARAPOLY",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Kwara Poly",
      "Ilorin Poly",
      "KWARAPOLY"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter KWARAPOLY student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-kwarapoly-kwara-state-polytechnic-ilorin-kwarapoly-1",
        "name": "KWARAPOLY $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-kwarapoly-kwara-state-polytechnic-ilorin-kwarapoly-2",
        "name": "KWARAPOLY $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-kwcoeilorin-kwara-state-college-of-education-ilorin-kwcoe",
    "name": "Kwara State College of Education, Ilorin (KWCOE) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kwara",
    "subdivisionCode": "NG-KW",
    "supportedStates": [
      "Kwara"
    ],
    "supportedSubdivisions": [
      "NG-KW"
    ],
    "institutionName": "Kwara State College of Education, Ilorin (KWCOE)",
    "institutionCode": "KWCOEILORIN",
    "institutionType": "college",
    "institutionAliases": [
      "Kwara COE Ilorin",
      "KWCOE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter KWCOEILORIN student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-kwcoeilorin-kwara-state-college-of-education-ilorin-kwcoe-1",
        "name": "KWCOEILORIN $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-kwcoeilorin-kwara-state-college-of-education-ilorin-kwcoe-2",
        "name": "KWCOEILORIN $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-coeoro-kwara-state-college-of-education-oro",
    "name": "Kwara State College of Education, Oro Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Kwara",
    "subdivisionCode": "NG-KW",
    "supportedStates": [
      "Kwara"
    ],
    "supportedSubdivisions": [
      "NG-KW"
    ],
    "institutionName": "Kwara State College of Education, Oro",
    "institutionCode": "COEORO",
    "institutionType": "college",
    "institutionAliases": [
      "Oro COE",
      "Kwara Oro"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter COEORO student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-coeoro-kwara-state-college-of-education-oro-1",
        "name": "COEORO $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-coeoro-kwara-state-college-of-education-oro-2",
        "name": "COEORO $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-unilag-university-of-lagos-akoka-unilag",
    "name": "University of Lagos, Akoka (UNILAG) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Lagos",
    "subdivisionCode": "NG-LA",
    "supportedStates": [
      "Lagos"
    ],
    "supportedSubdivisions": [
      "NG-LA"
    ],
    "institutionName": "University of Lagos, Akoka (UNILAG)",
    "institutionCode": "UNILAG",
    "institutionType": "university",
    "institutionAliases": [
      "UNILAG",
      "Univ of Lagos",
      "Akoka"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter UNILAG student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-unilag-university-of-lagos-akoka-unilag-1",
        "name": "UNILAG $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-unilag-university-of-lagos-akoka-unilag-2",
        "name": "UNILAG $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-lasu-lagos-state-university-ojo-lasu",
    "name": "Lagos State University, Ojo (LASU) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Lagos",
    "subdivisionCode": "NG-LA",
    "supportedStates": [
      "Lagos"
    ],
    "supportedSubdivisions": [
      "NG-LA"
    ],
    "institutionName": "Lagos State University, Ojo (LASU)",
    "institutionCode": "LASU",
    "institutionType": "university",
    "institutionAliases": [
      "LASU",
      "Lagos State Univ",
      "Ojo"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter LASU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-lasu-lagos-state-university-ojo-lasu-1",
        "name": "LASU $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-lasu-lagos-state-university-ojo-lasu-2",
        "name": "LASU $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-lasustech-lagos-state-university-of-science-and-technology-ikorodu-lasustech",
    "name": "Lagos State University of Science and Technology, Ikorodu (LASUSTECH) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Lagos",
    "subdivisionCode": "NG-LA",
    "supportedStates": [
      "Lagos"
    ],
    "supportedSubdivisions": [
      "NG-LA"
    ],
    "institutionName": "Lagos State University of Science and Technology, Ikorodu (LASUSTECH)",
    "institutionCode": "LASUSTECH",
    "institutionType": "university",
    "institutionAliases": [
      "LASUSTECH",
      "LASPOTECH Univ",
      "Ikorodu Tech"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter LASUSTECH student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-lasustech-lagos-state-university-of-science-and-technology-ikorodu-lasustech-1",
        "name": "LASUSTECH $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-lasustech-lagos-state-university-of-science-and-technology-ikorodu-lasustech-2",
        "name": "LASUSTECH $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-pau-pan-atlantic-university-lekki-pau",
    "name": "Pan-Atlantic University, Lekki (PAU) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Lagos",
    "subdivisionCode": "NG-LA",
    "supportedStates": [
      "Lagos"
    ],
    "supportedSubdivisions": [
      "NG-LA"
    ],
    "institutionName": "Pan-Atlantic University, Lekki (PAU)",
    "institutionCode": "PAU",
    "institutionType": "university",
    "institutionAliases": [
      "PAU",
      "Pan-Atlantic",
      "Lekki Univ"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter PAU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-pau-pan-atlantic-university-lekki-pau-1",
        "name": "PAU $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-pau-pan-atlantic-university-lekki-pau-2",
        "name": "PAU $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-yabatech-yaba-college-of-technology-yaba-yabatech",
    "name": "Yaba College of Technology, Yaba (YABATECH) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Lagos",
    "subdivisionCode": "NG-LA",
    "supportedStates": [
      "Lagos"
    ],
    "supportedSubdivisions": [
      "NG-LA"
    ],
    "institutionName": "Yaba College of Technology, Yaba (YABATECH)",
    "institutionCode": "YABATECH",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "YABATECH",
      "Yaba Tech",
      "Yaba Poly"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter YABATECH student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-yabatech-yaba-college-of-technology-yaba-yabatech-1",
        "name": "YABATECH $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-yabatech-yaba-college-of-technology-yaba-yabatech-2",
        "name": "YABATECH $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-laspotech-lagos-state-polytechnic-ikorodu-campus",
    "name": "Lagos State Polytechnic, Ikorodu Campus Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Lagos",
    "subdivisionCode": "NG-LA",
    "supportedStates": [
      "Lagos"
    ],
    "supportedSubdivisions": [
      "NG-LA"
    ],
    "institutionName": "Lagos State Polytechnic, Ikorodu Campus",
    "institutionCode": "LASPOTECH",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "LASPOTECH",
      "Lagos Poly"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter LASPOTECH student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-laspotech-lagos-state-polytechnic-ikorodu-campus-1",
        "name": "LASPOTECH $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-laspotech-lagos-state-polytechnic-ikorodu-campus-2",
        "name": "LASPOTECH $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fcetakoka-federal-college-of-education-technical-akoka",
    "name": "Federal College of Education (Technical) Akoka Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Lagos",
    "subdivisionCode": "NG-LA",
    "supportedStates": [
      "Lagos"
    ],
    "supportedSubdivisions": [
      "NG-LA"
    ],
    "institutionName": "Federal College of Education (Technical) Akoka",
    "institutionCode": "FCETAKOKA",
    "institutionType": "college",
    "institutionAliases": [
      "FCET Akoka",
      "Akoka Tech COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter FCETAKOKA student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fcetakoka-federal-college-of-education-technical-akoka-1",
        "name": "FCETAKOKA $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fcetakoka-federal-college-of-education-technical-akoka-2",
        "name": "FCETAKOKA $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-mocped-michael-otedola-college-of-primary-education-lasued-epe-mocped",
    "name": "Michael Otedola College of Primary Education / LASUED, Epe (MOCPED) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Lagos",
    "subdivisionCode": "NG-LA",
    "supportedStates": [
      "Lagos"
    ],
    "supportedSubdivisions": [
      "NG-LA"
    ],
    "institutionName": "Michael Otedola College of Primary Education / LASUED, Epe (MOCPED)",
    "institutionCode": "MOCPED",
    "institutionType": "college",
    "institutionAliases": [
      "MOCPED",
      "Epe COE",
      "LASUED Epe"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter MOCPED student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-mocped-michael-otedola-college-of-primary-education-lasued-epe-mocped-1",
        "name": "MOCPED $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-mocped-michael-otedola-college-of-primary-education-lasued-epe-mocped-2",
        "name": "MOCPED $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fulafia-federal-university-of-lafia-fulafia",
    "name": "Federal University of Lafia (FULafia) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Nasarawa",
    "subdivisionCode": "NG-NA",
    "supportedStates": [
      "Nasarawa"
    ],
    "supportedSubdivisions": [
      "NG-NA"
    ],
    "institutionName": "Federal University of Lafia (FULafia)",
    "institutionCode": "FULAFIA",
    "institutionType": "university",
    "institutionAliases": [
      "FULafia",
      "Fed Univ Lafia",
      "Lafia Univ"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter FULAFIA student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fulafia-federal-university-of-lafia-fulafia-1",
        "name": "FULAFIA $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fulafia-federal-university-of-lafia-fulafia-2",
        "name": "FULAFIA $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-nsuk-nasarawa-state-university-keffi-nsuk",
    "name": "Nasarawa State University, Keffi (NSUK) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Nasarawa",
    "subdivisionCode": "NG-NA",
    "supportedStates": [
      "Nasarawa"
    ],
    "supportedSubdivisions": [
      "NG-NA"
    ],
    "institutionName": "Nasarawa State University, Keffi (NSUK)",
    "institutionCode": "NSUK",
    "institutionType": "university",
    "institutionAliases": [
      "NSUK",
      "Keffi Univ",
      "Nasarawa State Univ"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter NSUK student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-nsuk-nasarawa-state-university-keffi-nsuk-1",
        "name": "NSUK $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-nsuk-nasarawa-state-university-keffi-nsuk-2",
        "name": "NSUK $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-bingham-bingham-university-karu",
    "name": "Bingham University, Karu Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Nasarawa",
    "subdivisionCode": "NG-NA",
    "supportedStates": [
      "Nasarawa"
    ],
    "supportedSubdivisions": [
      "NG-NA"
    ],
    "institutionName": "Bingham University, Karu",
    "institutionCode": "BINGHAM",
    "institutionType": "university",
    "institutionAliases": [
      "Bingham Univ",
      "Bingham Karu"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter BINGHAM student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-bingham-bingham-university-karu-1",
        "name": "BINGHAM $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-bingham-bingham-university-karu-2",
        "name": "BINGHAM $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fedponas-federal-polytechnic-nasarawa",
    "name": "Federal Polytechnic, Nasarawa Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Nasarawa",
    "subdivisionCode": "NG-NA",
    "supportedStates": [
      "Nasarawa"
    ],
    "supportedSubdivisions": [
      "NG-NA"
    ],
    "institutionName": "Federal Polytechnic, Nasarawa",
    "institutionCode": "FEDPONAS",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Fed Poly Nasarawa",
      "Nasarawa Poly",
      "FEDPONAS"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter FEDPONAS student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fedponas-federal-polytechnic-nasarawa-1",
        "name": "FEDPONAS $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fedponas-federal-polytechnic-nasarawa-2",
        "name": "FEDPONAS $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-imap-isa-mustapha-agwai-i-polytechnic-lafia-imap",
    "name": "Isa Mustapha Agwai I Polytechnic, Lafia (IMAP) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Nasarawa",
    "subdivisionCode": "NG-NA",
    "supportedStates": [
      "Nasarawa"
    ],
    "supportedSubdivisions": [
      "NG-NA"
    ],
    "institutionName": "Isa Mustapha Agwai I Polytechnic, Lafia (IMAP)",
    "institutionCode": "IMAP",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "IMAP",
      "Lafia Poly",
      "Nasarawa State Poly"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter IMAP student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-imap-isa-mustapha-agwai-i-polytechnic-lafia-imap-1",
        "name": "IMAP $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-imap-isa-mustapha-agwai-i-polytechnic-lafia-imap-2",
        "name": "IMAP $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-coeakwanga-college-of-education-akwanga-coe-akwanga",
    "name": "College of Education, Akwanga (COE Akwanga) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Nasarawa",
    "subdivisionCode": "NG-NA",
    "supportedStates": [
      "Nasarawa"
    ],
    "supportedSubdivisions": [
      "NG-NA"
    ],
    "institutionName": "College of Education, Akwanga (COE Akwanga)",
    "institutionCode": "COEAKWANGA",
    "institutionType": "college",
    "institutionAliases": [
      "Akwanga COE",
      "Nasarawa COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter COEAKWANGA student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-coeakwanga-college-of-education-akwanga-coe-akwanga-1",
        "name": "COEAKWANGA $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-coeakwanga-college-of-education-akwanga-coe-akwanga-2",
        "name": "COEAKWANGA $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-futminna-federal-university-of-technology-minna-futminna",
    "name": "Federal University of Technology, Minna (FUTMINNA) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Niger",
    "subdivisionCode": "NG-NI",
    "supportedStates": [
      "Niger"
    ],
    "supportedSubdivisions": [
      "NG-NI"
    ],
    "institutionName": "Federal University of Technology, Minna (FUTMINNA)",
    "institutionCode": "FUTMINNA",
    "institutionType": "university",
    "institutionAliases": [
      "FUTMINNA",
      "FUT Minna",
      "Minna Tech"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter FUTMINNA student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-futminna-federal-university-of-technology-minna-futminna-1",
        "name": "FUTMINNA $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-futminna-federal-university-of-technology-minna-futminna-2",
        "name": "FUTMINNA $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-ibbul-ibrahim-badamasi-babangida-university-lapai-ibbul",
    "name": "Ibrahim Badamasi Babangida University, Lapai (IBBUL) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Niger",
    "subdivisionCode": "NG-NI",
    "supportedStates": [
      "Niger"
    ],
    "supportedSubdivisions": [
      "NG-NI"
    ],
    "institutionName": "Ibrahim Badamasi Babangida University, Lapai (IBBUL)",
    "institutionCode": "IBBUL",
    "institutionType": "university",
    "institutionAliases": [
      "IBBUL",
      "Lapai Univ",
      "IBB University"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter IBBUL student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-ibbul-ibrahim-badamasi-babangida-university-lapai-ibbul-1",
        "name": "IBBUL $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-ibbul-ibrahim-badamasi-babangida-university-lapai-ibbul-2",
        "name": "IBBUL $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-edusoko-edusoko-university-bida",
    "name": "Edusoko University, Bida Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Niger",
    "subdivisionCode": "NG-NI",
    "supportedStates": [
      "Niger"
    ],
    "supportedSubdivisions": [
      "NG-NI"
    ],
    "institutionName": "Edusoko University, Bida",
    "institutionCode": "EDUSOKO",
    "institutionType": "university",
    "institutionAliases": [
      "Edusoko Univ",
      "Bida Univ"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter EDUSOKO student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-edusoko-edusoko-university-bida-1",
        "name": "EDUSOKO $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-edusoko-edusoko-university-bida-2",
        "name": "EDUSOKO $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fedpolybida-federal-polytechnic-bida",
    "name": "Federal Polytechnic, Bida Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Niger",
    "subdivisionCode": "NG-NI",
    "supportedStates": [
      "Niger"
    ],
    "supportedSubdivisions": [
      "NG-NI"
    ],
    "institutionName": "Federal Polytechnic, Bida",
    "institutionCode": "FEDPOLYBIDA",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Fed Poly Bida",
      "Bida Poly",
      "BIDAPOLY"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter FEDPOLYBIDA student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fedpolybida-federal-polytechnic-bida-1",
        "name": "FEDPOLYBIDA $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fedpolybida-federal-polytechnic-bida-2",
        "name": "FEDPOLYBIDA $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-nigerpoly-niger-state-polytechnic-zungeru",
    "name": "Niger State Polytechnic, Zungeru Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Niger",
    "subdivisionCode": "NG-NI",
    "supportedStates": [
      "Niger"
    ],
    "supportedSubdivisions": [
      "NG-NI"
    ],
    "institutionName": "Niger State Polytechnic, Zungeru",
    "institutionCode": "NIGERPOLY",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Niger Poly",
      "Zungeru Poly"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter NIGERPOLY student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-nigerpoly-niger-state-polytechnic-zungeru-1",
        "name": "NIGERPOLY $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-nigerpoly-niger-state-polytechnic-zungeru-2",
        "name": "NIGERPOLY $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fcekontagora-federal-college-of-education-kontagora-fce-kontagora",
    "name": "Federal College of Education, Kontagora (FCE Kontagora) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Niger",
    "subdivisionCode": "NG-NI",
    "supportedStates": [
      "Niger"
    ],
    "supportedSubdivisions": [
      "NG-NI"
    ],
    "institutionName": "Federal College of Education, Kontagora (FCE Kontagora)",
    "institutionCode": "FCEKONTAGORA",
    "institutionType": "college",
    "institutionAliases": [
      "FCE Kontagora",
      "Kontagora COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter FCEKONTAGORA student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fcekontagora-federal-college-of-education-kontagora-fce-kontagora-1",
        "name": "FCEKONTAGORA $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fcekontagora-federal-college-of-education-kontagora-fce-kontagora-2",
        "name": "FCEKONTAGORA $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-coeminna-niger-state-college-of-education-minna-coe-minna",
    "name": "Niger State College of Education, Minna (COE Minna) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Niger",
    "subdivisionCode": "NG-NI",
    "supportedStates": [
      "Niger"
    ],
    "supportedSubdivisions": [
      "NG-NI"
    ],
    "institutionName": "Niger State College of Education, Minna (COE Minna)",
    "institutionCode": "COEMINNA",
    "institutionType": "college",
    "institutionAliases": [
      "Minna COE",
      "Niger COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter COEMINNA student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-coeminna-niger-state-college-of-education-minna-coe-minna-1",
        "name": "COEMINNA $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-coeminna-niger-state-college-of-education-minna-coe-minna-2",
        "name": "COEMINNA $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-funaab-federal-university-of-agriculture-abeokuta-funaab",
    "name": "Federal University of Agriculture, Abeokuta (FUNAAB) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Ogun",
    "subdivisionCode": "NG-OG",
    "supportedStates": [
      "Ogun"
    ],
    "supportedSubdivisions": [
      "NG-OG"
    ],
    "institutionName": "Federal University of Agriculture, Abeokuta (FUNAAB)",
    "institutionCode": "FUNAAB",
    "institutionType": "university",
    "institutionAliases": [
      "FUNAAB",
      "Agric Abeokuta",
      "UNAAB"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter FUNAAB student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-funaab-federal-university-of-agriculture-abeokuta-funaab-1",
        "name": "FUNAAB $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-funaab-federal-university-of-agriculture-abeokuta-funaab-2",
        "name": "FUNAAB $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-oou-olabisi-onabanjo-university-ago-iwoye-oou",
    "name": "Olabisi Onabanjo University, Ago-Iwoye (OOU) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Ogun",
    "subdivisionCode": "NG-OG",
    "supportedStates": [
      "Ogun"
    ],
    "supportedSubdivisions": [
      "NG-OG"
    ],
    "institutionName": "Olabisi Onabanjo University, Ago-Iwoye (OOU)",
    "institutionCode": "OOU",
    "institutionType": "university",
    "institutionAliases": [
      "OOU",
      "Ago Iwoye Univ",
      "OSU"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter OOU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-oou-olabisi-onabanjo-university-ago-iwoye-oou-1",
        "name": "OOU $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-oou-olabisi-onabanjo-university-ago-iwoye-oou-2",
        "name": "OOU $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-cu-covenant-university-ota",
    "name": "Covenant University, Ota Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Ogun",
    "subdivisionCode": "NG-OG",
    "supportedStates": [
      "Ogun"
    ],
    "supportedSubdivisions": [
      "NG-OG"
    ],
    "institutionName": "Covenant University, Ota",
    "institutionCode": "CU",
    "institutionType": "university",
    "institutionAliases": [
      "Covenant Univ",
      "CU Ota",
      "Covenant"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter CU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-cu-covenant-university-ota-1",
        "name": "CU $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-cu-covenant-university-ota-2",
        "name": "CU $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-babcock-babcock-university-ilishan-remo",
    "name": "Babcock University, Ilishan-Remo Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Ogun",
    "subdivisionCode": "NG-OG",
    "supportedStates": [
      "Ogun"
    ],
    "supportedSubdivisions": [
      "NG-OG"
    ],
    "institutionName": "Babcock University, Ilishan-Remo",
    "institutionCode": "BABCOCK",
    "institutionType": "university",
    "institutionAliases": [
      "Babcock Univ",
      "Babcock"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter BABCOCK student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-babcock-babcock-university-ilishan-remo-1",
        "name": "BABCOCK $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-babcock-babcock-university-ilishan-remo-2",
        "name": "BABCOCK $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-ilaropoly-federal-polytechnic-ilaro-ilaropoly",
    "name": "Federal Polytechnic, Ilaro (ILAROPOLY) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Ogun",
    "subdivisionCode": "NG-OG",
    "supportedStates": [
      "Ogun"
    ],
    "supportedSubdivisions": [
      "NG-OG"
    ],
    "institutionName": "Federal Polytechnic, Ilaro (ILAROPOLY)",
    "institutionCode": "ILAROPOLY",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Ilaro Poly",
      "Fed Poly Ilaro",
      "ILAROPOLY"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter ILAROPOLY student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-ilaropoly-federal-polytechnic-ilaro-ilaropoly-1",
        "name": "ILAROPOLY $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-ilaropoly-federal-polytechnic-ilaro-ilaropoly-2",
        "name": "ILAROPOLY $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-mapoly-moshood-abiola-polytechnic-abeokuta-mapoly",
    "name": "Moshood Abiola Polytechnic, Abeokuta (MAPOLY) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Ogun",
    "subdivisionCode": "NG-OG",
    "supportedStates": [
      "Ogun"
    ],
    "supportedSubdivisions": [
      "NG-OG"
    ],
    "institutionName": "Moshood Abiola Polytechnic, Abeokuta (MAPOLY)",
    "institutionCode": "MAPOLY",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "MAPOLY",
      "Ojere Poly",
      "Abeokuta Poly"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter MAPOLY student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-mapoly-moshood-abiola-polytechnic-abeokuta-mapoly-1",
        "name": "MAPOLY $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-mapoly-moshood-abiola-polytechnic-abeokuta-mapoly-2",
        "name": "MAPOLY $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fceabeokuta-federal-college-of-education-osiele-abeokuta-fce-abeokuta",
    "name": "Federal College of Education, Osiele Abeokuta (FCE Abeokuta) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Ogun",
    "subdivisionCode": "NG-OG",
    "supportedStates": [
      "Ogun"
    ],
    "supportedSubdivisions": [
      "NG-OG"
    ],
    "institutionName": "Federal College of Education, Osiele Abeokuta (FCE Abeokuta)",
    "institutionCode": "FCEABEOKUTA",
    "institutionType": "college",
    "institutionAliases": [
      "FCE Abeokuta",
      "Osiele COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter FCEABEOKUTA student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fceabeokuta-federal-college-of-education-osiele-abeokuta-fce-abeokuta-1",
        "name": "FCEABEOKUTA $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fceabeokuta-federal-college-of-education-osiele-abeokuta-fce-abeokuta-2",
        "name": "FCEABEOKUTA $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-tasce-tai-solarin-college-of-education-omu-ijebu-tasce",
    "name": "Tai Solarin College of Education, Omu-Ijebu (TASCE) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Ogun",
    "subdivisionCode": "NG-OG",
    "supportedStates": [
      "Ogun"
    ],
    "supportedSubdivisions": [
      "NG-OG"
    ],
    "institutionName": "Tai Solarin College of Education, Omu-Ijebu (TASCE)",
    "institutionCode": "TASCE",
    "institutionType": "college",
    "institutionAliases": [
      "TASCE",
      "Omu Ijebu COE",
      "Tai Solarin COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter TASCE student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-tasce-tai-solarin-college-of-education-omu-ijebu-tasce-1",
        "name": "TASCE $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-tasce-tai-solarin-college-of-education-omu-ijebu-tasce-2",
        "name": "TASCE $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-futa-federal-university-of-technology-akure-futa",
    "name": "Federal University of Technology, Akure (FUTA) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Ondo",
    "subdivisionCode": "NG-ON",
    "supportedStates": [
      "Ondo"
    ],
    "supportedSubdivisions": [
      "NG-ON"
    ],
    "institutionName": "Federal University of Technology, Akure (FUTA)",
    "institutionCode": "FUTA",
    "institutionType": "university",
    "institutionAliases": [
      "FUTA",
      "Tech Akure",
      "Univ of Tech Akure"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter FUTA student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-futa-federal-university-of-technology-akure-futa-1",
        "name": "FUTA $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-futa-federal-university-of-technology-akure-futa-2",
        "name": "FUTA $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-aaua-adekunle-ajasin-university-akungba-akoko-aaua",
    "name": "Adekunle Ajasin University, Akungba-Akoko (AAUA) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Ondo",
    "subdivisionCode": "NG-ON",
    "supportedStates": [
      "Ondo"
    ],
    "supportedSubdivisions": [
      "NG-ON"
    ],
    "institutionName": "Adekunle Ajasin University, Akungba-Akoko (AAUA)",
    "institutionCode": "AAUA",
    "institutionType": "university",
    "institutionAliases": [
      "AAUA",
      "Akungba Univ",
      "Adekunle Ajasin"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter AAUA student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-aaua-adekunle-ajasin-university-akungba-akoko-aaua-1",
        "name": "AAUA $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-aaua-adekunle-ajasin-university-akungba-akoko-aaua-2",
        "name": "AAUA $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-oaustech-olusegun-agagu-university-of-science-tech-okitipupa-oaustech",
    "name": "Olusegun Agagu University of Science & Tech, Okitipupa (OAUSTECH) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Ondo",
    "subdivisionCode": "NG-ON",
    "supportedStates": [
      "Ondo"
    ],
    "supportedSubdivisions": [
      "NG-ON"
    ],
    "institutionName": "Olusegun Agagu University of Science & Tech, Okitipupa (OAUSTECH)",
    "institutionCode": "OAUSTECH",
    "institutionType": "university",
    "institutionAliases": [
      "OAUSTECH",
      "OSUSTECH",
      "Okitipupa Tech"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter OAUSTECH student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-oaustech-olusegun-agagu-university-of-science-tech-okitipupa-oaustech-1",
        "name": "OAUSTECH $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-oaustech-olusegun-agagu-university-of-science-tech-okitipupa-oaustech-2",
        "name": "OAUSTECH $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-achievers-achievers-university-owo",
    "name": "Achievers University, Owo Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Ondo",
    "subdivisionCode": "NG-ON",
    "supportedStates": [
      "Ondo"
    ],
    "supportedSubdivisions": [
      "NG-ON"
    ],
    "institutionName": "Achievers University, Owo",
    "institutionCode": "ACHIEVERS",
    "institutionType": "university",
    "institutionAliases": [
      "Achievers Univ",
      "Achievers Owo"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter ACHIEVERS student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-achievers-achievers-university-owo-1",
        "name": "ACHIEVERS $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-achievers-achievers-university-owo-2",
        "name": "ACHIEVERS $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fedpolel-federal-polytechnic-ile-oluji",
    "name": "Federal Polytechnic, Ile-Oluji Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Ondo",
    "subdivisionCode": "NG-ON",
    "supportedStates": [
      "Ondo"
    ],
    "supportedSubdivisions": [
      "NG-ON"
    ],
    "institutionName": "Federal Polytechnic, Ile-Oluji",
    "institutionCode": "FEDPOLEL",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Fed Poly Ile-Oluji",
      "Ile-Oluji Poly",
      "FEDPOLEL"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter FEDPOLEL student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fedpolel-federal-polytechnic-ile-oluji-1",
        "name": "FEDPOLEL $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fedpolel-federal-polytechnic-ile-oluji-2",
        "name": "FEDPOLEL $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-rugipo-rufus-giwa-polytechnic-owo-rugipo",
    "name": "Rufus Giwa Polytechnic, Owo (RUGIPO) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Ondo",
    "subdivisionCode": "NG-ON",
    "supportedStates": [
      "Ondo"
    ],
    "supportedSubdivisions": [
      "NG-ON"
    ],
    "institutionName": "Rufus Giwa Polytechnic, Owo (RUGIPO)",
    "institutionCode": "RUGIPO",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "RUGIPO",
      "Owo Poly",
      "Rufus Giwa"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter RUGIPO student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-rugipo-rufus-giwa-polytechnic-owo-rugipo-1",
        "name": "RUGIPO $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-rugipo-rufus-giwa-polytechnic-owo-rugipo-2",
        "name": "RUGIPO $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-aceondo-adeyemi-federal-university-of-education-ondo-ace-ondo",
    "name": "Adeyemi Federal University of Education, Ondo (ACE Ondo) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Ondo",
    "subdivisionCode": "NG-ON",
    "supportedStates": [
      "Ondo"
    ],
    "supportedSubdivisions": [
      "NG-ON"
    ],
    "institutionName": "Adeyemi Federal University of Education, Ondo (ACE Ondo)",
    "institutionCode": "ACEONDO",
    "institutionType": "college",
    "institutionAliases": [
      "Adeyemi COE",
      "ACE Ondo",
      "Adeyemi Univ"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter ACEONDO student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-aceondo-adeyemi-federal-university-of-education-ondo-ace-ondo-1",
        "name": "ACEONDO $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-aceondo-adeyemi-federal-university-of-education-ondo-ace-ondo-2",
        "name": "ACEONDO $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-oau-obafemi-awolowo-university-ile-ife-oau",
    "name": "Obafemi Awolowo University, Ile-Ife (OAU) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Osun",
    "subdivisionCode": "NG-OS",
    "supportedStates": [
      "Osun"
    ],
    "supportedSubdivisions": [
      "NG-OS"
    ],
    "institutionName": "Obafemi Awolowo University, Ile-Ife (OAU)",
    "institutionCode": "OAU",
    "institutionType": "university",
    "institutionAliases": [
      "OAU",
      "Great Ife",
      "Obafemi Awolowo Univ",
      "Ife"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter OAU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-oau-obafemi-awolowo-university-ile-ife-oau-1",
        "name": "OAU $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-oau-obafemi-awolowo-university-ile-ife-oau-2",
        "name": "OAU $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-uniosun-osun-state-university-osogbo-uniosun",
    "name": "Osun State University, Osogbo (UNIOSUN) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Osun",
    "subdivisionCode": "NG-OS",
    "supportedStates": [
      "Osun"
    ],
    "supportedSubdivisions": [
      "NG-OS"
    ],
    "institutionName": "Osun State University, Osogbo (UNIOSUN)",
    "institutionCode": "UNIOSUN",
    "institutionType": "university",
    "institutionAliases": [
      "UNIOSUN",
      "Osun State Univ",
      "Osogbo Univ"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter UNIOSUN student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-uniosun-osun-state-university-osogbo-uniosun-1",
        "name": "UNIOSUN $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-uniosun-osun-state-university-osogbo-uniosun-2",
        "name": "UNIOSUN $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-bowen-bowen-university-iwo",
    "name": "Bowen University, Iwo Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Osun",
    "subdivisionCode": "NG-OS",
    "supportedStates": [
      "Osun"
    ],
    "supportedSubdivisions": [
      "NG-OS"
    ],
    "institutionName": "Bowen University, Iwo",
    "institutionCode": "BOWEN",
    "institutionType": "university",
    "institutionAliases": [
      "Bowen Univ",
      "Bowen Iwo"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter BOWEN student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-bowen-bowen-university-iwo-1",
        "name": "BOWEN $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-bowen-bowen-university-iwo-2",
        "name": "BOWEN $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-adeleke-adeleke-university-ede",
    "name": "Adeleke University, Ede Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Osun",
    "subdivisionCode": "NG-OS",
    "supportedStates": [
      "Osun"
    ],
    "supportedSubdivisions": [
      "NG-OS"
    ],
    "institutionName": "Adeleke University, Ede",
    "institutionCode": "ADELEKE",
    "institutionType": "university",
    "institutionAliases": [
      "Adeleke Univ",
      "Adeleke Ede"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter ADELEKE student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-adeleke-adeleke-university-ede-1",
        "name": "ADELEKE $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-adeleke-adeleke-university-ede-2",
        "name": "ADELEKE $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-edepoly-federal-polytechnic-ede-edepoly",
    "name": "Federal Polytechnic, Ede (EDEPOLY) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Osun",
    "subdivisionCode": "NG-OS",
    "supportedStates": [
      "Osun"
    ],
    "supportedSubdivisions": [
      "NG-OS"
    ],
    "institutionName": "Federal Polytechnic, Ede (EDEPOLY)",
    "institutionCode": "EDEPOLY",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Ede Poly",
      "Fed Poly Ede",
      "EDEPOLY"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter EDEPOLY student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-edepoly-federal-polytechnic-ede-edepoly-1",
        "name": "EDEPOLY $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-edepoly-federal-polytechnic-ede-edepoly-2",
        "name": "EDEPOLY $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-ospoly-osun-state-polytechnic-iree-ospoly",
    "name": "Osun State Polytechnic, Iree (OSPOLY) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Osun",
    "subdivisionCode": "NG-OS",
    "supportedStates": [
      "Osun"
    ],
    "supportedSubdivisions": [
      "NG-OS"
    ],
    "institutionName": "Osun State Polytechnic, Iree (OSPOLY)",
    "institutionCode": "OSPOLY",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Iree Poly",
      "OSPOLY",
      "Osun Poly"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter OSPOLY student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-ospoly-osun-state-polytechnic-iree-ospoly-1",
        "name": "OSPOLY $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-ospoly-osun-state-polytechnic-iree-ospoly-2",
        "name": "OSPOLY $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-oscotech-osun-state-college-of-technology-esa-oke-oscotech",
    "name": "Osun State College of Technology, Esa-Oke (OSCOTECH) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Osun",
    "subdivisionCode": "NG-OS",
    "supportedStates": [
      "Osun"
    ],
    "supportedSubdivisions": [
      "NG-OS"
    ],
    "institutionName": "Osun State College of Technology, Esa-Oke (OSCOTECH)",
    "institutionCode": "OSCOTECH",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Esa Oke Tech",
      "OSCOTECH"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter OSCOTECH student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-oscotech-osun-state-college-of-technology-esa-oke-oscotech-1",
        "name": "OSCOTECH $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-oscotech-osun-state-college-of-technology-esa-oke-oscotech-2",
        "name": "OSCOTECH $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fceiwo-federal-college-of-education-iwo",
    "name": "Federal College of Education, Iwo Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Osun",
    "subdivisionCode": "NG-OS",
    "supportedStates": [
      "Osun"
    ],
    "supportedSubdivisions": [
      "NG-OS"
    ],
    "institutionName": "Federal College of Education, Iwo",
    "institutionCode": "FCEIWO",
    "institutionType": "college",
    "institutionAliases": [
      "FCE Iwo",
      "Iwo COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter FCEIWO student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fceiwo-federal-college-of-education-iwo-1",
        "name": "FCEIWO $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fceiwo-federal-college-of-education-iwo-2",
        "name": "FCEIWO $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-oscoedilesa-osun-state-college-of-education-ilesa-unilesa-oscoed",
    "name": "Osun State College of Education, Ilesa (UNILESA / OSCOED) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Osun",
    "subdivisionCode": "NG-OS",
    "supportedStates": [
      "Osun"
    ],
    "supportedSubdivisions": [
      "NG-OS"
    ],
    "institutionName": "Osun State College of Education, Ilesa (UNILESA / OSCOED)",
    "institutionCode": "OSCOEDILESA",
    "institutionType": "college",
    "institutionAliases": [
      "Ilesa COE",
      "UNILESA",
      "Osun COE Ilesa"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter OSCOEDILESA student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-oscoedilesa-osun-state-college-of-education-ilesa-unilesa-oscoed-1",
        "name": "OSCOEDILESA $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-oscoedilesa-osun-state-college-of-education-ilesa-unilesa-oscoed-2",
        "name": "OSCOEDILESA $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-ui-university-of-ibadan-ui",
    "name": "University of Ibadan (UI) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Oyo",
    "subdivisionCode": "NG-OY",
    "supportedStates": [
      "Oyo"
    ],
    "supportedSubdivisions": [
      "NG-OY"
    ],
    "institutionName": "University of Ibadan (UI)",
    "institutionCode": "UI",
    "institutionType": "university",
    "institutionAliases": [
      "UI",
      "Univ of Ibadan",
      "Premier Univ",
      "Ibadan"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter UI student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-ui-university-of-ibadan-ui-1",
        "name": "UI $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-ui-university-of-ibadan-ui-2",
        "name": "UI $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-lautech-ladoke-akintola-university-of-technology-ogbomoso-lautech",
    "name": "Ladoke Akintola University of Technology, Ogbomoso (LAUTECH) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Oyo",
    "subdivisionCode": "NG-OY",
    "supportedStates": [
      "Oyo"
    ],
    "supportedSubdivisions": [
      "NG-OY"
    ],
    "institutionName": "Ladoke Akintola University of Technology, Ogbomoso (LAUTECH)",
    "institutionCode": "LAUTECH",
    "institutionType": "university",
    "institutionAliases": [
      "LAUTECH",
      "Ladoke Akintola",
      "Ogbomoso"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter LAUTECH student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-lautech-ladoke-akintola-university-of-technology-ogbomoso-lautech-1",
        "name": "LAUTECH $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-lautech-ladoke-akintola-university-of-technology-ogbomoso-lautech-2",
        "name": "LAUTECH $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-leadcity-lead-city-university-ibadan",
    "name": "Lead City University, Ibadan Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Oyo",
    "subdivisionCode": "NG-OY",
    "supportedStates": [
      "Oyo"
    ],
    "supportedSubdivisions": [
      "NG-OY"
    ],
    "institutionName": "Lead City University, Ibadan",
    "institutionCode": "LEADCITY",
    "institutionType": "university",
    "institutionAliases": [
      "Lead City",
      "Lead City Univ"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter LEADCITY student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-leadcity-lead-city-university-ibadan-1",
        "name": "LEADCITY $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-leadcity-lead-city-university-ibadan-2",
        "name": "LEADCITY $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-koladaisi-koladaisi-university-ibadan",
    "name": "KolaDaisi University, Ibadan Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Oyo",
    "subdivisionCode": "NG-OY",
    "supportedStates": [
      "Oyo"
    ],
    "supportedSubdivisions": [
      "NG-OY"
    ],
    "institutionName": "KolaDaisi University, Ibadan",
    "institutionCode": "KOLADAISI",
    "institutionType": "university",
    "institutionAliases": [
      "KolaDaisi",
      "Kola Daisi Univ"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter KOLADAISI student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-koladaisi-koladaisi-university-ibadan-1",
        "name": "KOLADAISI $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-koladaisi-koladaisi-university-ibadan-2",
        "name": "KOLADAISI $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-polyibadan-the-polytechnic-ibadan",
    "name": "The Polytechnic, Ibadan Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Oyo",
    "subdivisionCode": "NG-OY",
    "supportedStates": [
      "Oyo"
    ],
    "supportedSubdivisions": [
      "NG-OY"
    ],
    "institutionName": "The Polytechnic, Ibadan",
    "institutionCode": "POLYIBADAN",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Poly Ibadan",
      "Ibadan Poly",
      "POLYIBADAN"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter POLYIBADAN student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-polyibadan-the-polytechnic-ibadan-1",
        "name": "POLYIBADAN $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-polyibadan-the-polytechnic-ibadan-2",
        "name": "POLYIBADAN $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fedpolyayede-federal-polytechnic-ayede",
    "name": "Federal Polytechnic, Ayede Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Oyo",
    "subdivisionCode": "NG-OY",
    "supportedStates": [
      "Oyo"
    ],
    "supportedSubdivisions": [
      "NG-OY"
    ],
    "institutionName": "Federal Polytechnic, Ayede",
    "institutionCode": "FEDPOLYAYEDE",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Fed Poly Ayede",
      "Ayede Poly"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter FEDPOLYAYEDE student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fedpolyayede-federal-polytechnic-ayede-1",
        "name": "FEDPOLYAYEDE $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fedpolyayede-federal-polytechnic-ayede-2",
        "name": "FEDPOLYAYEDE $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-spedoyo-federal-college-of-education-special-oyo-sped-oyo",
    "name": "Federal College of Education (Special), Oyo (SPED Oyo) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Oyo",
    "subdivisionCode": "NG-OY",
    "supportedStates": [
      "Oyo"
    ],
    "supportedSubdivisions": [
      "NG-OY"
    ],
    "institutionName": "Federal College of Education (Special), Oyo (SPED Oyo)",
    "institutionCode": "SPEDOYO",
    "institutionType": "college",
    "institutionAliases": [
      "SPED Oyo",
      "FCE Special Oyo",
      "Oyo Special COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter SPEDOYO student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-spedoyo-federal-college-of-education-special-oyo-sped-oyo-1",
        "name": "SPEDOYO $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-spedoyo-federal-college-of-education-special-oyo-sped-oyo-2",
        "name": "SPEDOYO $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-eacoed-emmanuel-alayande-university-college-of-education-oyo-eacoed",
    "name": "Emmanuel Alayande University / College of Education, Oyo (EACOED) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Oyo",
    "subdivisionCode": "NG-OY",
    "supportedStates": [
      "Oyo"
    ],
    "supportedSubdivisions": [
      "NG-OY"
    ],
    "institutionName": "Emmanuel Alayande University / College of Education, Oyo (EACOED)",
    "institutionCode": "EACOED",
    "institutionType": "college",
    "institutionAliases": [
      "EACOED",
      "Emmanuel Alayande",
      "Oyo COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter EACOED student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-eacoed-emmanuel-alayande-university-college-of-education-oyo-eacoed-1",
        "name": "EACOED $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-eacoed-emmanuel-alayande-university-college-of-education-oyo-eacoed-2",
        "name": "EACOED $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-unijos-university-of-jos-unijos",
    "name": "University of Jos (UNIJOS) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Plateau",
    "subdivisionCode": "NG-PL",
    "supportedStates": [
      "Plateau"
    ],
    "supportedSubdivisions": [
      "NG-PL"
    ],
    "institutionName": "University of Jos (UNIJOS)",
    "institutionCode": "UNIJOS",
    "institutionType": "university",
    "institutionAliases": [
      "UNIJOS",
      "Univ of Jos",
      "Jos"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter UNIJOS student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-unijos-university-of-jos-unijos-1",
        "name": "UNIJOS $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-unijos-university-of-jos-unijos-2",
        "name": "UNIJOS $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-plasu-plateau-state-university-bokkos-plasu",
    "name": "Plateau State University, Bokkos (PLASU) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Plateau",
    "subdivisionCode": "NG-PL",
    "supportedStates": [
      "Plateau"
    ],
    "supportedSubdivisions": [
      "NG-PL"
    ],
    "institutionName": "Plateau State University, Bokkos (PLASU)",
    "institutionCode": "PLASU",
    "institutionType": "university",
    "institutionAliases": [
      "PLASU",
      "Bokkos Univ",
      "Plateau State Univ"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter PLASU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-plasu-plateau-state-university-bokkos-plasu-1",
        "name": "PLASU $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-plasu-plateau-state-university-bokkos-plasu-2",
        "name": "PLASU $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-kku-karl-kumm-university-vom",
    "name": "Karl Kumm University, Vom Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Plateau",
    "subdivisionCode": "NG-PL",
    "supportedStates": [
      "Plateau"
    ],
    "supportedSubdivisions": [
      "NG-PL"
    ],
    "institutionName": "Karl Kumm University, Vom",
    "institutionCode": "KKU",
    "institutionType": "university",
    "institutionAliases": [
      "Karl Kumm",
      "KKU Vom"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter KKU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-kku-karl-kumm-university-vom-1",
        "name": "KKU $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-kku-karl-kumm-university-vom-2",
        "name": "KKU $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fedpolyshemdam-federal-polytechnic-nyak-shendam",
    "name": "Federal Polytechnic, Nyak-Shendam Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Plateau",
    "subdivisionCode": "NG-PL",
    "supportedStates": [
      "Plateau"
    ],
    "supportedSubdivisions": [
      "NG-PL"
    ],
    "institutionName": "Federal Polytechnic, Nyak-Shendam",
    "institutionCode": "FEDPOLYSHEMDAM",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Fed Poly Shendam",
      "Shendam Poly"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter FEDPOLYSHEMDAM student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fedpolyshemdam-federal-polytechnic-nyak-shendam-1",
        "name": "FEDPOLYSHEMDAM $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fedpolyshemdam-federal-polytechnic-nyak-shendam-2",
        "name": "FEDPOLYSHEMDAM $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-plapoly-plateau-state-polytechnic-barkin-ladi-plapoly",
    "name": "Plateau State Polytechnic, Barkin Ladi (PLAPOLY) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Plateau",
    "subdivisionCode": "NG-PL",
    "supportedStates": [
      "Plateau"
    ],
    "supportedSubdivisions": [
      "NG-PL"
    ],
    "institutionName": "Plateau State Polytechnic, Barkin Ladi (PLAPOLY)",
    "institutionCode": "PLAPOLY",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Plateau Poly",
      "Barkin Ladi Poly",
      "PLAPOLY"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter PLAPOLY student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-plapoly-plateau-state-polytechnic-barkin-ladi-plapoly-1",
        "name": "PLAPOLY $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-plapoly-plateau-state-polytechnic-barkin-ladi-plapoly-2",
        "name": "PLAPOLY $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fcepankshin-federal-college-of-education-pankshin-fce-pankshin",
    "name": "Federal College of Education, Pankshin (FCE Pankshin) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Plateau",
    "subdivisionCode": "NG-PL",
    "supportedStates": [
      "Plateau"
    ],
    "supportedSubdivisions": [
      "NG-PL"
    ],
    "institutionName": "Federal College of Education, Pankshin (FCE Pankshin)",
    "institutionCode": "FCEPANKSHIN",
    "institutionType": "college",
    "institutionAliases": [
      "FCE Pankshin",
      "Pankshin COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter FCEPANKSHIN student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fcepankshin-federal-college-of-education-pankshin-fce-pankshin-1",
        "name": "FCEPANKSHIN $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fcepankshin-federal-college-of-education-pankshin-fce-pankshin-2",
        "name": "FCEPANKSHIN $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-coegindiri-college-of-education-gindiri",
    "name": "College of Education, Gindiri Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Plateau",
    "subdivisionCode": "NG-PL",
    "supportedStates": [
      "Plateau"
    ],
    "supportedSubdivisions": [
      "NG-PL"
    ],
    "institutionName": "College of Education, Gindiri",
    "institutionCode": "COEGINDIRI",
    "institutionType": "college",
    "institutionAliases": [
      "Gindiri COE",
      "Plateau COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter COEGINDIRI student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-coegindiri-college-of-education-gindiri-1",
        "name": "COEGINDIRI $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-coegindiri-college-of-education-gindiri-2",
        "name": "COEGINDIRI $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-uniport-university-of-port-harcourt-uniport",
    "name": "University of Port Harcourt (UNIPORT) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Rivers",
    "subdivisionCode": "NG-RI",
    "supportedStates": [
      "Rivers"
    ],
    "supportedSubdivisions": [
      "NG-RI"
    ],
    "institutionName": "University of Port Harcourt (UNIPORT)",
    "institutionCode": "UNIPORT",
    "institutionType": "university",
    "institutionAliases": [
      "UNIPORT",
      "Univ of Port Harcourt",
      "Choba",
      "Port Harcourt"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter UNIPORT student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-uniport-university-of-port-harcourt-uniport-1",
        "name": "UNIPORT $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-uniport-university-of-port-harcourt-uniport-2",
        "name": "UNIPORT $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-rsu-rivers-state-university-nkpolu-oroworukwo-rsu",
    "name": "Rivers State University, Nkpolu-Oroworukwo (RSU) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Rivers",
    "subdivisionCode": "NG-RI",
    "supportedStates": [
      "Rivers"
    ],
    "supportedSubdivisions": [
      "NG-RI"
    ],
    "institutionName": "Rivers State University, Nkpolu-Oroworukwo (RSU)",
    "institutionCode": "RSU",
    "institutionType": "university",
    "institutionAliases": [
      "RSU",
      "UST",
      "Rivers State Univ",
      "RSUST"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter RSU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-rsu-rivers-state-university-nkpolu-oroworukwo-rsu-1",
        "name": "RSU $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-rsu-rivers-state-university-nkpolu-oroworukwo-rsu-2",
        "name": "RSU $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-iaue-ignatius-ajuru-university-of-education-rumuolumeni-iaue",
    "name": "Ignatius Ajuru University of Education, Rumuolumeni (IAUE) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Rivers",
    "subdivisionCode": "NG-RI",
    "supportedStates": [
      "Rivers"
    ],
    "supportedSubdivisions": [
      "NG-RI"
    ],
    "institutionName": "Ignatius Ajuru University of Education, Rumuolumeni (IAUE)",
    "institutionCode": "IAUE",
    "institutionType": "university",
    "institutionAliases": [
      "IAUE",
      "Ignatius Ajuru",
      "Rumuolumeni"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter IAUE student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-iaue-ignatius-ajuru-university-of-education-rumuolumeni-iaue-1",
        "name": "IAUE $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-iaue-ignatius-ajuru-university-of-education-rumuolumeni-iaue-2",
        "name": "IAUE $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fpogbonny-federal-polytechnic-of-oil-and-gas-bonny-fpog",
    "name": "Federal Polytechnic of Oil and Gas, Bonny (FPOG) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Rivers",
    "subdivisionCode": "NG-RI",
    "supportedStates": [
      "Rivers"
    ],
    "supportedSubdivisions": [
      "NG-RI"
    ],
    "institutionName": "Federal Polytechnic of Oil and Gas, Bonny (FPOG)",
    "institutionCode": "FPOGBONNY",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "FPOG Bonny",
      "Oil & Gas Poly Bonny",
      "Bonny Poly"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter FPOGBONNY student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fpogbonny-federal-polytechnic-of-oil-and-gas-bonny-fpog-1",
        "name": "FPOGBONNY $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fpogbonny-federal-polytechnic-of-oil-and-gas-bonny-fpog-2",
        "name": "FPOGBONNY $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-ceapoly-captain-elechi-amadi-polytechnic-rumuola-port-harcourt-poly",
    "name": "Captain Elechi Amadi Polytechnic, Rumuola (Port Harcourt Poly) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Rivers",
    "subdivisionCode": "NG-RI",
    "supportedStates": [
      "Rivers"
    ],
    "supportedSubdivisions": [
      "NG-RI"
    ],
    "institutionName": "Captain Elechi Amadi Polytechnic, Rumuola (Port Harcourt Poly)",
    "institutionCode": "CEAPOLY",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Elechi Amadi Poly",
      "Port Harcourt Poly",
      "Rumuola Poly"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter CEAPOLY student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-ceapoly-captain-elechi-amadi-polytechnic-rumuola-port-harcourt-poly-1",
        "name": "CEAPOLY $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-ceapoly-captain-elechi-amadi-polytechnic-rumuola-port-harcourt-poly-2",
        "name": "CEAPOLY $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-kenpoly-kenule-beeson-saro-wiwa-polytechnic-bori-kenpoly",
    "name": "Kenule Beeson Saro-Wiwa Polytechnic, Bori (KenPoly) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Rivers",
    "subdivisionCode": "NG-RI",
    "supportedStates": [
      "Rivers"
    ],
    "supportedSubdivisions": [
      "NG-RI"
    ],
    "institutionName": "Kenule Beeson Saro-Wiwa Polytechnic, Bori (KenPoly)",
    "institutionCode": "KENPOLY",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "KenPoly",
      "Bori Poly",
      "Saro-Wiwa Poly"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter KENPOLY student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-kenpoly-kenule-beeson-saro-wiwa-polytechnic-bori-kenpoly-1",
        "name": "KENPOLY $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-kenpoly-kenule-beeson-saro-wiwa-polytechnic-bori-kenpoly-2",
        "name": "KENPOLY $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fcetomoku-federal-college-of-education-technical-omoku",
    "name": "Federal College of Education (Technical) Omoku Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Rivers",
    "subdivisionCode": "NG-RI",
    "supportedStates": [
      "Rivers"
    ],
    "supportedSubdivisions": [
      "NG-RI"
    ],
    "institutionName": "Federal College of Education (Technical) Omoku",
    "institutionCode": "FCETOMOKU",
    "institutionType": "college",
    "institutionAliases": [
      "FCET Omoku",
      "Omoku Tech COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter FCETOMOKU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fcetomoku-federal-college-of-education-technical-omoku-1",
        "name": "FCETOMOKU $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fcetomoku-federal-college-of-education-technical-omoku-2",
        "name": "FCETOMOKU $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-udus-usmanu-danfodiyo-university-sokoto-udus",
    "name": "Usmanu Danfodiyo University, Sokoto (UDUS) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Sokoto",
    "subdivisionCode": "NG-SO",
    "supportedStates": [
      "Sokoto"
    ],
    "supportedSubdivisions": [
      "NG-SO"
    ],
    "institutionName": "Usmanu Danfodiyo University, Sokoto (UDUS)",
    "institutionCode": "UDUS",
    "institutionType": "university",
    "institutionAliases": [
      "UDUS",
      "Danfodiyo Univ",
      "Sokoto Univ",
      "UDUSOK"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter UDUS student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-udus-usmanu-danfodiyo-university-sokoto-udus-1",
        "name": "UDUS $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-udus-usmanu-danfodiyo-university-sokoto-udus-2",
        "name": "UDUS $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-ssu-sokoto-state-university-sokoto-ssu",
    "name": "Sokoto State University, Sokoto (SSU) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Sokoto",
    "subdivisionCode": "NG-SO",
    "supportedStates": [
      "Sokoto"
    ],
    "supportedSubdivisions": [
      "NG-SO"
    ],
    "institutionName": "Sokoto State University, Sokoto (SSU)",
    "institutionCode": "SSU",
    "institutionType": "university",
    "institutionAliases": [
      "SSU",
      "Sokoto State Univ"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter SSU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-ssu-sokoto-state-university-sokoto-ssu-1",
        "name": "SSU $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-ssu-sokoto-state-university-sokoto-ssu-2",
        "name": "SSU $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-sospoly-umaru-ali-shinkafi-polytechnic-sokoto-sospoly",
    "name": "Umaru Ali Shinkafi Polytechnic, Sokoto (SOSPOLY) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Sokoto",
    "subdivisionCode": "NG-SO",
    "supportedStates": [
      "Sokoto"
    ],
    "supportedSubdivisions": [
      "NG-SO"
    ],
    "institutionName": "Umaru Ali Shinkafi Polytechnic, Sokoto (SOSPOLY)",
    "institutionCode": "SOSPOLY",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Sokoto Poly",
      "Shinkafi Poly",
      "SOSPOLY"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter SOSPOLY student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-sospoly-umaru-ali-shinkafi-polytechnic-sokoto-sospoly-1",
        "name": "SOSPOLY $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-sospoly-umaru-ali-shinkafi-polytechnic-sokoto-sospoly-2",
        "name": "SOSPOLY $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-sscoesokoto-shehu-shagari-college-of-education-sokoto-sscoe",
    "name": "Shehu Shagari College of Education, Sokoto (SSCOE) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Sokoto",
    "subdivisionCode": "NG-SO",
    "supportedStates": [
      "Sokoto"
    ],
    "supportedSubdivisions": [
      "NG-SO"
    ],
    "institutionName": "Shehu Shagari College of Education, Sokoto (SSCOE)",
    "institutionCode": "SSCOESOKOTO",
    "institutionType": "college",
    "institutionAliases": [
      "Shehu Shagari COE",
      "SSCOE",
      "Sokoto COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter SSCOESOKOTO student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-sscoesokoto-shehu-shagari-college-of-education-sokoto-sscoe-1",
        "name": "SSCOESOKOTO $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-sscoesokoto-shehu-shagari-college-of-education-sokoto-sscoe-2",
        "name": "SSCOESOKOTO $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-sokotonursing-sokoto-state-college-of-nursing-sciences-sokoto",
    "name": "Sokoto State College of Nursing Sciences, Sokoto Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Sokoto",
    "subdivisionCode": "NG-SO",
    "supportedStates": [
      "Sokoto"
    ],
    "supportedSubdivisions": [
      "NG-SO"
    ],
    "institutionName": "Sokoto State College of Nursing Sciences, Sokoto",
    "institutionCode": "SOKOTONURSING",
    "institutionType": "college",
    "institutionAliases": [
      "Sokoto Nursing",
      "Sokoto Health"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter SOKOTONURSING student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-sokotonursing-sokoto-state-college-of-nursing-sciences-sokoto-1",
        "name": "SOKOTONURSING $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-sokotonursing-sokoto-state-college-of-nursing-sciences-sokoto-2",
        "name": "SOKOTONURSING $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fuwukari-federal-university-wukari-fuwukari",
    "name": "Federal University, Wukari (FUWukari) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Taraba",
    "subdivisionCode": "NG-TA",
    "supportedStates": [
      "Taraba"
    ],
    "supportedSubdivisions": [
      "NG-TA"
    ],
    "institutionName": "Federal University, Wukari (FUWukari)",
    "institutionCode": "FUWUKARI",
    "institutionType": "university",
    "institutionAliases": [
      "FUWukari",
      "Fed Univ Wukari",
      "Wukari"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter FUWUKARI student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fuwukari-federal-university-wukari-fuwukari-1",
        "name": "FUWUKARI $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fuwukari-federal-university-wukari-fuwukari-2",
        "name": "FUWUKARI $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-tsu-taraba-state-university-jalingo-tsu",
    "name": "Taraba State University, Jalingo (TSU) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Taraba",
    "subdivisionCode": "NG-TA",
    "supportedStates": [
      "Taraba"
    ],
    "supportedSubdivisions": [
      "NG-TA"
    ],
    "institutionName": "Taraba State University, Jalingo (TSU)",
    "institutionCode": "TSU",
    "institutionType": "university",
    "institutionAliases": [
      "TSU",
      "Taraba State Univ",
      "Jalingo"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter TSU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-tsu-taraba-state-university-jalingo-tsu-1",
        "name": "TSU $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-tsu-taraba-state-university-jalingo-tsu-2",
        "name": "TSU $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-kwararafa-kwararafa-university-wukari",
    "name": "Kwararafa University, Wukari Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Taraba",
    "subdivisionCode": "NG-TA",
    "supportedStates": [
      "Taraba"
    ],
    "supportedSubdivisions": [
      "NG-TA"
    ],
    "institutionName": "Kwararafa University, Wukari",
    "institutionCode": "KWARARAFA",
    "institutionType": "university",
    "institutionAliases": [
      "Kwararafa Univ",
      "Kwararafa Wukari"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter KWARARAFA student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-kwararafa-kwararafa-university-wukari-1",
        "name": "KWARARAFA $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-kwararafa-kwararafa-university-wukari-2",
        "name": "KWARARAFA $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fedpolybali-federal-polytechnic-bali",
    "name": "Federal Polytechnic, Bali Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Taraba",
    "subdivisionCode": "NG-TA",
    "supportedStates": [
      "Taraba"
    ],
    "supportedSubdivisions": [
      "NG-TA"
    ],
    "institutionName": "Federal Polytechnic, Bali",
    "institutionCode": "FEDPOLYBALI",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Fed Poly Bali",
      "Bali Poly"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter FEDPOLYBALI student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fedpolybali-federal-polytechnic-bali-1",
        "name": "FEDPOLYBALI $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fedpolybali-federal-polytechnic-bali-2",
        "name": "FEDPOLYBALI $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-tarabapoly-taraba-state-polytechnic-suntai",
    "name": "Taraba State Polytechnic, Suntai Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Taraba",
    "subdivisionCode": "NG-TA",
    "supportedStates": [
      "Taraba"
    ],
    "supportedSubdivisions": [
      "NG-TA"
    ],
    "institutionName": "Taraba State Polytechnic, Suntai",
    "institutionCode": "TARABAPOLY",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Taraba Poly",
      "Suntai Poly"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter TARABAPOLY student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-tarabapoly-taraba-state-polytechnic-suntai-1",
        "name": "TARABAPOLY $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-tarabapoly-taraba-state-polytechnic-suntai-2",
        "name": "TARABAPOLY $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-coezing-college-of-education-zing",
    "name": "College of Education, Zing Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Taraba",
    "subdivisionCode": "NG-TA",
    "supportedStates": [
      "Taraba"
    ],
    "supportedSubdivisions": [
      "NG-TA"
    ],
    "institutionName": "College of Education, Zing",
    "institutionCode": "COEZING",
    "institutionType": "college",
    "institutionAliases": [
      "Zing COE",
      "Taraba COE",
      "COE Zing"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter COEZING student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-coezing-college-of-education-zing-1",
        "name": "COEZING $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-coezing-college-of-education-zing-2",
        "name": "COEZING $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fuga-federal-university-gashua-fuga",
    "name": "Federal University, Gashua (FUGA) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Yobe",
    "subdivisionCode": "NG-YO",
    "supportedStates": [
      "Yobe"
    ],
    "supportedSubdivisions": [
      "NG-YO"
    ],
    "institutionName": "Federal University, Gashua (FUGA)",
    "institutionCode": "FUGA",
    "institutionType": "university",
    "institutionAliases": [
      "FUGA",
      "Fed Univ Gashua",
      "Gashua Univ"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter FUGA student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fuga-federal-university-gashua-fuga-1",
        "name": "FUGA $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fuga-federal-university-gashua-fuga-2",
        "name": "FUGA $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-ysu-yobe-state-university-damaturu-ysu",
    "name": "Yobe State University, Damaturu (YSU) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Yobe",
    "subdivisionCode": "NG-YO",
    "supportedStates": [
      "Yobe"
    ],
    "supportedSubdivisions": [
      "NG-YO"
    ],
    "institutionName": "Yobe State University, Damaturu (YSU)",
    "institutionCode": "YSU",
    "institutionType": "university",
    "institutionAliases": [
      "YSU",
      "Yobe State Univ",
      "Damaturu"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter YSU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-ysu-yobe-state-university-damaturu-ysu-1",
        "name": "YSU $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-ysu-yobe-state-university-damaturu-ysu-2",
        "name": "YSU $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fedpolydamaturu-federal-polytechnic-damaturu",
    "name": "Federal Polytechnic, Damaturu Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Yobe",
    "subdivisionCode": "NG-YO",
    "supportedStates": [
      "Yobe"
    ],
    "supportedSubdivisions": [
      "NG-YO"
    ],
    "institutionName": "Federal Polytechnic, Damaturu",
    "institutionCode": "FEDPOLYDAMATURU",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Fed Poly Damaturu",
      "Damaturu Poly",
      "FEDPODAM"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter FEDPOLYDAMATURU student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fedpolydamaturu-federal-polytechnic-damaturu-1",
        "name": "FEDPOLYDAMATURU $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fedpolydamaturu-federal-polytechnic-damaturu-2",
        "name": "FEDPOLYDAMATURU $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-aloomapoly-mai-idris-alooma-polytechnic-geidam",
    "name": "Mai Idris Alooma Polytechnic, Geidam Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Yobe",
    "subdivisionCode": "NG-YO",
    "supportedStates": [
      "Yobe"
    ],
    "supportedSubdivisions": [
      "NG-YO"
    ],
    "institutionName": "Mai Idris Alooma Polytechnic, Geidam",
    "institutionCode": "ALOOMAPOLY",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Alooma Poly",
      "Geidam Poly",
      "Mai Idris Alooma"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter ALOOMAPOLY student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-aloomapoly-mai-idris-alooma-polytechnic-geidam-1",
        "name": "ALOOMAPOLY $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-aloomapoly-mai-idris-alooma-polytechnic-geidam-2",
        "name": "ALOOMAPOLY $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fcetpotiskum-federal-college-of-education-technical-potiskum",
    "name": "Federal College of Education (Technical) Potiskum Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Yobe",
    "subdivisionCode": "NG-YO",
    "supportedStates": [
      "Yobe"
    ],
    "supportedSubdivisions": [
      "NG-YO"
    ],
    "institutionName": "Federal College of Education (Technical) Potiskum",
    "institutionCode": "FCETPOTISKUM",
    "institutionType": "college",
    "institutionAliases": [
      "FCET Potiskum",
      "Potiskum Tech COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter FCETPOTISKUM student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fcetpotiskum-federal-college-of-education-technical-potiskum-1",
        "name": "FCETPOTISKUM $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fcetpotiskum-federal-college-of-education-technical-potiskum-2",
        "name": "FCETPOTISKUM $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-uscoega-umar-suleiman-college-of-education-gashua-uscoega",
    "name": "Umar Suleiman College of Education, Gashua (USCOEGA) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Yobe",
    "subdivisionCode": "NG-YO",
    "supportedStates": [
      "Yobe"
    ],
    "supportedSubdivisions": [
      "NG-YO"
    ],
    "institutionName": "Umar Suleiman College of Education, Gashua (USCOEGA)",
    "institutionCode": "USCOEGA",
    "institutionType": "college",
    "institutionAliases": [
      "Umar Suleiman COE",
      "Gashua COE",
      "USCOEGA"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter USCOEGA student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-uscoega-umar-suleiman-college-of-education-gashua-uscoega-1",
        "name": "USCOEGA $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-uscoega-umar-suleiman-college-of-education-gashua-uscoega-2",
        "name": "USCOEGA $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fugusau-federal-university-gusau-fugusau",
    "name": "Federal University, Gusau (FUGusau) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Zamfara",
    "subdivisionCode": "NG-ZA",
    "supportedStates": [
      "Zamfara"
    ],
    "supportedSubdivisions": [
      "NG-ZA"
    ],
    "institutionName": "Federal University, Gusau (FUGusau)",
    "institutionCode": "FUGUSAU",
    "institutionType": "university",
    "institutionAliases": [
      "FUGusau",
      "Fed Univ Gusau",
      "Gusau Univ"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter FUGUSAU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fugusau-federal-university-gusau-fugusau-1",
        "name": "FUGUSAU $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fugusau-federal-university-gusau-fugusau-2",
        "name": "FUGUSAU $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-zamsut-zamfara-state-university-talata-mafara-zamsut",
    "name": "Zamfara State University, Talata Mafara (ZAMSUT) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Zamfara",
    "subdivisionCode": "NG-ZA",
    "supportedStates": [
      "Zamfara"
    ],
    "supportedSubdivisions": [
      "NG-ZA"
    ],
    "institutionName": "Zamfara State University, Talata Mafara (ZAMSUT)",
    "institutionCode": "ZAMSUT",
    "institutionType": "university",
    "institutionAliases": [
      "ZAMSUT",
      "Zamfara State Univ",
      "Talata Mafara"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "Student Matric / Reg / Admission No",
    "accountPlaceholder": "Enter ZAMSUT student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "hasDirectValidationApi": true,
    "designations": [
      "Undergraduate Tuition Settlement",
      "Postgraduate Fee Clearance",
      "Acceptance & Verification Fee",
      "Hostel Accommodation Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-zamsut-zamfara-state-university-talata-mafara-zamsut-1",
        "name": "ZAMSUT $25 Portal Credit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 25,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-zamsut-zamfara-state-university-talata-mafara-zamsut-2",
        "name": "ZAMSUT $100 Tuition Deposit",
        "description": "Direct student fee portal payment",
        "fiatPrice": 100,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fedponam-federal-polytechnic-kaura-namoda",
    "name": "Federal Polytechnic, Kaura Namoda Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Zamfara",
    "subdivisionCode": "NG-ZA",
    "supportedStates": [
      "Zamfara"
    ],
    "supportedSubdivisions": [
      "NG-ZA"
    ],
    "institutionName": "Federal Polytechnic, Kaura Namoda",
    "institutionCode": "FEDPONAM",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Fed Poly Kaura Namoda",
      "Kaura Namoda Poly",
      "FEDPONAM"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter FEDPONAM student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fedponam-federal-polytechnic-kaura-namoda-1",
        "name": "FEDPONAM $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fedponam-federal-polytechnic-kaura-namoda-2",
        "name": "FEDPONAM $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-agp-abdu-gusau-polytechnic-talata-mafara-agp",
    "name": "Abdu Gusau Polytechnic, Talata Mafara (AGP) Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Zamfara",
    "subdivisionCode": "NG-ZA",
    "supportedStates": [
      "Zamfara"
    ],
    "supportedSubdivisions": [
      "NG-ZA"
    ],
    "institutionName": "Abdu Gusau Polytechnic, Talata Mafara (AGP)",
    "institutionCode": "AGP",
    "institutionType": "polytechnic",
    "institutionAliases": [
      "Abdu Gusau Poly",
      "AGP Talata Mafara"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "ND / HND Reg Number",
    "accountPlaceholder": "Enter AGP student reg number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "ND / HND Tuition Deposit",
      "Acceptance Fee Clearance",
      "Semester Examination Fee",
      "Departmental Due Clearance"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-agp-abdu-gusau-polytechnic-talata-mafara-agp-1",
        "name": "AGP $20 Fee Voucher",
        "description": "ND/HND student portal payment",
        "fiatPrice": 20,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-agp-abdu-gusau-polytechnic-talata-mafara-agp-2",
        "name": "AGP $75 Semester Clearance",
        "description": "ND/HND student portal payment",
        "fiatPrice": 75,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-fcetgusau-federal-college-of-education-technical-gusau",
    "name": "Federal College of Education (Technical) Gusau Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Zamfara",
    "subdivisionCode": "NG-ZA",
    "supportedStates": [
      "Zamfara"
    ],
    "supportedSubdivisions": [
      "NG-ZA"
    ],
    "institutionName": "Federal College of Education (Technical) Gusau",
    "institutionCode": "FCETGUSAU",
    "institutionType": "college",
    "institutionAliases": [
      "FCET Gusau",
      "Gusau Tech COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter FCETGUSAU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-fcetgusau-federal-college-of-education-technical-gusau-1",
        "name": "FCETGUSAU $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-fcetgusau-federal-college-of-education-technical-gusau-2",
        "name": "FCETGUSAU $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  },
  {
    "id": "prov-edu-ng-coemaru-zamfara-state-college-of-education-maru",
    "name": "Zamfara State College of Education, Maru Portal",
    "category": "education",
    "logo": "https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80",
    "country": "Nigeria",
    "countryCode": "NG",
    "state": "Zamfara",
    "subdivisionCode": "NG-ZA",
    "supportedStates": [
      "Zamfara"
    ],
    "supportedSubdivisions": [
      "NG-ZA"
    ],
    "institutionName": "Zamfara State College of Education, Maru",
    "institutionCode": "COEMARU",
    "institutionType": "college",
    "institutionAliases": [
      "Maru COE",
      "Zamfara COE"
    ],
    "supportsCustomAmount": true,
    "supportsFixedPackages": true,
    "accountLabel": "NCE / Student ID",
    "accountPlaceholder": "Enter COEMARU student ID or matric number",
    "minCustomFiat": 1,
    "maxCustomFiat": 500,
    "currency": "USD",
    "enabled": true,
    "designations": [
      "NCE / Certificate Tuition Deposit",
      "Acceptance Fee Clearance",
      "Teaching Practice / Lab Fee",
      "Portal Registration Fee"
    ],
    "packages": [
      {
        "id": "pkg-edu-ng-coemaru-zamfara-state-college-of-education-maru-1",
        "name": "COEMARU $15 Portal Voucher",
        "description": "College student portal clearance",
        "fiatPrice": 15,
        "currency": "USD",
        "validity": "Instant Deposit"
      },
      {
        "id": "pkg-edu-ng-coemaru-zamfara-state-college-of-education-maru-2",
        "name": "COEMARU $60 Tuition Deposit",
        "description": "College student portal clearance",
        "fiatPrice": 60,
        "currency": "USD",
        "validity": "Instant Deposit",
        "badge": "Popular"
      }
    ]
  }
];
