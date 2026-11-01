import assert from 'node:assert/strict';
import {
  getSafeEducationHierarchy,
  hasFabricatedPlaceholderName,
  isHierarchyIncomplete,
} from '../src/data/educationDataIntegrity';
import type { InstitutionProfile } from '../src/types/education';

function makeInstitution(overrides: Partial<InstitutionProfile> = {}): InstitutionProfile {
  return {
    id: 'test-institution',
    name: 'Test Institution',
    legalName: 'Test Institution',
    institutionCode: 'TEST',
    institutionType: 'university',
    supportedTiers: ['tertiary'],
    country: 'Nigeria',
    countryCode: 'NG',
    state: 'Kano',
    city: 'Kano',
    address: 'Test address',
    contactEmail: 'test@example.invalid',
    contactPhone: '+2340000000000',
    website: 'https://example.invalid',
    logoUrl: '',
    isPublic: true,
    curriculum: [],
    instructionLanguage: ['English'],
    isBoarding: false,
    hasDayOption: true,
    accreditation: {
      authority: 'Test authority',
      registrationNumber: 'TEST',
      accreditationStatus: 'accredited',
      validThrough: '2099-01-01',
      verifiedAt: '2026-01-01T00:00:00Z',
      officialNotes: 'Test fixture only',
    },
    verificationStatus: 'VERIFIED',
    acceptedCurrencies: ['NGN'],
    supportsPiPayment: false,
    supportsInstallments: false,
    activeSessions: [],
    overviewDescription: 'Test fixture only',
    ...overrides,
  };
}

assert.equal(hasFabricatedPlaceholderName('Faculty 1'), true);
assert.equal(hasFabricatedPlaceholderName('Department 12'), true);
assert.equal(hasFabricatedPlaceholderName('Faculty of Science'), false);

const partiallyVerified = makeInstitution({
  hierarchyVerificationStatus: 'PARTIALLY_VERIFIED',
  faculties: [
    {
      id: 'fac-verified',
      name: 'Faculty of Verified Studies',
      unitType: 'faculty',
      verificationStatus: 'VERIFIED',
      departments: [
        {
          id: 'dept-verified',
          name: 'Department of Verified Studies',
          verificationStatus: 'VERIFIED',
          programmes: [{
            id: 'prog-verified',
            name: 'B.Sc. Verified Studies',
            code: 'BSC-VERIFIED',
            tier: 'tertiary',
            levelCode: '100L-400L',
            durationYears: 4,
            credentialAwarded: 'B.Sc.',
            tuitionPerPeriod: 0,
            currency: 'NGN',
            admissionRequirements: [],
            description: 'Test fixture only',
          }],
        },
      ],
    },
    {
      id: 'fac-unverified',
      name: 'Faculty from Unverified Source',
      unitType: 'faculty',
      verificationStatus: 'UNVERIFIED',
      departments: [],
    },
    {
      id: 'fac-placeholder',
      name: 'Faculty 2',
      unitType: 'faculty',
      verificationStatus: 'VERIFIED',
      departments: [],
    },
  ],
});

assert.equal(isHierarchyIncomplete(partiallyVerified), true);

const safe = getSafeEducationHierarchy(partiallyVerified);
assert.deepEqual(
  safe.faculties?.map((faculty) => faculty.name),
  ['Faculty of Verified Studies'],
);
assert.deepEqual(
  safe.faculties?.[0]?.departments.map((department) => department.name),
  ['Department of Verified Studies'],
);
assert.equal(safe.faculties?.some((faculty) => faculty.name === 'Faculty 2'), false);
assert.equal(safe.faculties?.some((faculty) => faculty.name === 'Faculty from Unverified Source'), false);

const pending = makeInstitution({ hierarchyVerificationStatus: 'PENDING', faculties: [] });
assert.equal(isHierarchyIncomplete(pending), true);
assert.deepEqual(getSafeEducationHierarchy(pending).faculties, []);

console.log('EDUCATION DATA INTEGRITY EDGE SUITE: PASS');
