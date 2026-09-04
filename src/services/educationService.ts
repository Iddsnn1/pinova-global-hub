import {
  InstitutionProfile,
  CountryEducationTaxonomy,
  StudentIdentity,
  GuardianChildSummary,
  EducationInvoice,
  DigitalEducationReceipt,
  AdmissionApplication,
  ScholarshipOpportunity,
  EducationMarketplaceItem,
  EducationPaymentTransaction
} from '../types/education';
import { getTaxonomyByCountry } from '../data/educationTaxonomyData';
import { GLOBAL_EDUCATION_INSTITUTIONS } from '../data/educationInstitutionsData';
import {
  SEED_CHILDREN_SUMMARIES,
  SEED_INVOICES,
  SEED_RECEIPTS,
  SEED_ADMISSION_APPLICATIONS,
  SEED_SCHOLARSHIPS,
  SEED_MARKETPLACE_ITEMS
} from '../data/educationSeedData';

export const educationService = {
  async getInstitutions(filter?: {
    countryCode?: string;
    tier?: string;
    institutionType?: string;
    isPublic?: boolean;
    search?: string;
    verificationStatus?: string;
  }): Promise<InstitutionProfile[]> {
    try {
      const params = new URLSearchParams();
      if (filter?.countryCode) params.append('countryCode', filter.countryCode);
      if (filter?.tier) params.append('tier', filter.tier);
      if (filter?.institutionType) params.append('institutionType', filter.institutionType);
      if (filter?.isPublic !== undefined) params.append('isPublic', String(filter.isPublic));
      if (filter?.search) params.append('search', filter.search);
      if (filter?.verificationStatus) params.append('verificationStatus', filter.verificationStatus);

      const res = await fetch(`/api/education/institutions?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        return data.institutions || [];
      }
    } catch (e) {
      console.warn('[educationService] Fallback to local institutions data:', e);
    }
    // Fallback
    return GLOBAL_EDUCATION_INSTITUTIONS;
  },

  async getInstitution(id: string): Promise<InstitutionProfile | null> {
    try {
      const res = await fetch(`/api/education/institutions/${encodeURIComponent(id)}`);
      if (res.ok) {
        const data = await res.json();
        return data.institution;
      }
    } catch (e) {
      console.warn('[educationService] Failed fetching institution by ID:', e);
    }
    return GLOBAL_EDUCATION_INSTITUTIONS.find((i) => i.id === id) || null;
  },

  async getTaxonomy(countryCode: string = 'NG'): Promise<CountryEducationTaxonomy> {
    try {
      const res = await fetch(`/api/education/taxonomy/${encodeURIComponent(countryCode)}`);
      if (res.ok) {
        const data = await res.json();
        return data.taxonomy;
      }
    } catch (e) {
      console.warn('[educationService] Using local taxonomy config:', e);
    }
    return getTaxonomyByCountry(countryCode);
  },

  async getGuardianChildren(guardianId: string = 'user-pioneer-parent-001'): Promise<GuardianChildSummary[]> {
    try {
      const res = await fetch(`/api/education/guardians/${encodeURIComponent(guardianId)}/children`);
      if (res.ok) {
        const data = await res.json();
        return data.children || [];
      }
    } catch (e) {
      console.warn('[educationService] Fallback to seed children summaries:', e);
    }
    return SEED_CHILDREN_SUMMARIES;
  },

  async getInvoices(filter?: {
    studentId?: string;
    institutionId?: string;
    status?: string;
    guardianId?: string;
  }): Promise<EducationInvoice[]> {
    try {
      const params = new URLSearchParams();
      if (filter?.studentId) params.append('studentId', filter.studentId);
      if (filter?.institutionId) params.append('institutionId', filter.institutionId);
      if (filter?.status) params.append('status', filter.status);
      if (filter?.guardianId) params.append('guardianId', filter.guardianId);

      const res = await fetch(`/api/education/invoices?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        return data.invoices || [];
      }
    } catch (e) {
      console.warn('[educationService] Fallback to seed invoices:', e);
    }
    return SEED_INVOICES;
  },

  async payInvoice(payload: {
    invoiceId: string;
    amountPaid: number;
    currency?: string;
    piAmount?: number;
    piPaymentId?: string;
    piTxid?: string;
    paymentMethod?: 'PI_NETWORK' | 'FIAT_ESCROW' | 'SCHOLARSHIP_GRANT';
    payerUsername?: string;
    idempotencyKey?: string;
  }): Promise<{
    success: boolean;
    payment: EducationPaymentTransaction;
    invoice: EducationInvoice;
    receipt: DigitalEducationReceipt;
    message?: string;
  }> {
    const res = await fetch('/api/education/invoices/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || err.error || 'Payment failed');
    }

    return await res.json();
  },

  async verifyReceipt(receiptNumber: string): Promise<{
    success: boolean;
    isAuthentic: boolean;
    receiptNumber: string;
    verificationReference?: string;
    verificationHash?: string;
    institutionName?: string;
    academicSession?: string;
    termOrSemester?: string;
    educationLevel?: string;
    amountPaid?: number;
    currency?: string;
    piAmount?: number;
    paymentDate?: string;
    chargeDescription?: string;
    publicSummary?: any;
    error?: string;
  }> {
    try {
      const res = await fetch(`/api/education/receipts/${encodeURIComponent(receiptNumber)}/verify`);
      if (res.ok) {
        return await res.json();
      }
      const err = await res.json().catch(() => ({}));
      return { success: false, isAuthentic: false, receiptNumber, error: err.message || 'Receipt not found' };
    } catch (e: any) {
      return { success: false, isAuthentic: false, receiptNumber, error: e.message };
    }
  },

  async getAdmissions(filter?: {
    institutionId?: string;
    status?: string;
    applicantEmail?: string;
  }): Promise<AdmissionApplication[]> {
    try {
      const params = new URLSearchParams();
      if (filter?.institutionId) params.append('institutionId', filter.institutionId);
      if (filter?.status) params.append('status', filter.status);
      if (filter?.applicantEmail) params.append('applicantEmail', filter.applicantEmail);

      const res = await fetch(`/api/education/admissions?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        return data.applications || [];
      }
    } catch (e) {
      console.warn('[educationService] Using seed admissions:', e);
    }
    return SEED_ADMISSION_APPLICATIONS;
  },

  async submitAdmission(appData: any): Promise<AdmissionApplication> {
    const res = await fetch('/api/education/admissions/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to submit application');
    }
    const data = await res.json();
    return data.application;
  },

  async acceptOffer(applicationId: string): Promise<AdmissionApplication> {
    const res = await fetch(`/api/education/admissions/${encodeURIComponent(applicationId)}/offer/accept`, {
      method: 'POST'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to accept offer');
    }
    const data = await res.json();
    return data.application;
  },

  async getScholarships(tier?: string, countryCode?: string): Promise<ScholarshipOpportunity[]> {
    try {
      const params = new URLSearchParams();
      if (tier) params.append('tier', tier);
      if (countryCode) params.append('countryCode', countryCode);

      const res = await fetch(`/api/education/scholarships?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        return data.scholarships || [];
      }
    } catch (e) {
      console.warn('[educationService] Using seed scholarships:', e);
    }
    return SEED_SCHOLARSHIPS;
  },

  async getMarketplaceItems(category?: string, tier?: string): Promise<EducationMarketplaceItem[]> {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (tier) params.append('tier', tier);

      const res = await fetch(`/api/education/marketplace?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        return data.items || [];
      }
    } catch (e) {
      console.warn('[educationService] Using seed marketplace items:', e);
    }
    return SEED_MARKETPLACE_ITEMS;
  },

  async getInstitutionAnalytics(institutionId: string): Promise<any> {
    try {
      const res = await fetch(`/api/education/admin/institutions/${encodeURIComponent(institutionId)}/analytics`);
      if (res.ok) {
        const data = await res.json();
        return data.analytics;
      }
    } catch (e) {
      console.warn('[educationService] Failed to load analytics:', e);
    }
    return null;
  },

  async verifyInstitutionAdmin(institutionId: string, status: string, notes?: string): Promise<InstitutionProfile> {
    const res = await fetch(`/api/education/admin/institutions/${encodeURIComponent(institutionId)}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Verification update failed');
    }
    const data = await res.json();
    return data.institution;
  }
};
