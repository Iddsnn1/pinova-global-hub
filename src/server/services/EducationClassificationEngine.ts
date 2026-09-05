import { GLOBAL_EDUCATION_TAXONOMIES, getTaxonomyByCountry } from '../../data/educationTaxonomyData';
import { CountryEducationTaxonomy, EducationTier, EducationLevelDefinition } from '../../types/education';

export interface TierEquivalence {
  tier: EducationTier;
  standardName: string;
  globalEquivalentAgeRange: string;
  isTertiaryOrHigher: boolean;
}

export class EducationClassificationEngine {
  private static instance: EducationClassificationEngine | null = null;
  private taxonomies: Record<string, CountryEducationTaxonomy>;

  public static getInstance(customTaxonomies?: Record<string, CountryEducationTaxonomy>): EducationClassificationEngine {
    if (!EducationClassificationEngine.instance) {
      EducationClassificationEngine.instance = new EducationClassificationEngine(customTaxonomies);
    }
    return EducationClassificationEngine.instance;
  }

  constructor(customTaxonomies?: Record<string, CountryEducationTaxonomy>) {
    this.taxonomies = customTaxonomies || GLOBAL_EDUCATION_TAXONOMIES;
  }

  public getSupportedCountries(): string[] {
    return this.getSupportedCountryCodes();
  }

  public getAllTaxonomies(): Record<string, CountryEducationTaxonomy> {
    return this.taxonomies;
  }

  /**
   * Returns supported country taxonomies
   */
  public getSupportedCountryCodes(): string[] {
    return Object.keys(this.taxonomies);
  }

  /**
   * Retrieves taxonomy by country code with intelligent fallback
   */
  public getTaxonomy(countryCode: string = 'GLOBAL'): CountryEducationTaxonomy {
    const code = (countryCode || 'GLOBAL').toUpperCase().trim();
    return this.taxonomies[code] || this.taxonomies['GLOBAL'] || this.taxonomies['NG'];
  }

  /**
   * Resolves tier definition for a given country
   */
  public getLevelDefinition(countryCode: string, tier: EducationTier): EducationLevelDefinition | null {
    const tax = this.getTaxonomy(countryCode);
    return tax.supportedLevels.find((l) => l.tier === tier) || null;
  }

  /**
   * Validates if a sub-grade/class belongs to a given tier in a country system
   */
  public validateSubGrade(countryCode: string, tier: EducationTier, subGrade: string): boolean {
    const level = this.getLevelDefinition(countryCode, tier);
    if (!level) return false;
    const clean = subGrade.trim().toLowerCase();
    return level.subGrades.some((sg) => sg.toLowerCase().includes(clean) || clean.includes(sg.toLowerCase()));
  }

  /**
   * Global tier equivalence standard
   */
  public getTierEquivalence(tier: EducationTier): TierEquivalence {
    switch (tier) {
      case 'early_childhood':
        return {
          tier,
          standardName: 'Early Childhood Education & Care (ECEC)',
          globalEquivalentAgeRange: '0 - 5 years',
          isTertiaryOrHigher: false
        };
      case 'primary':
        return {
          tier,
          standardName: 'Primary / Elementary Basic Education',
          globalEquivalentAgeRange: '6 - 11 years',
          isTertiaryOrHigher: false
        };
      case 'secondary':
        return {
          tier,
          standardName: 'Junior & Senior Secondary / Middle & High School',
          globalEquivalentAgeRange: '12 - 18 years',
          isTertiaryOrHigher: false
        };
      case 'technical_vocational':
        return {
          tier,
          standardName: 'Technical & Vocational Education and Training (TVET)',
          globalEquivalentAgeRange: '16+ years / Post-Secondary',
          isTertiaryOrHigher: false
        };
      case 'tertiary':
        return {
          tier,
          standardName: 'Higher Education (Colleges, Polytechnics, Universities)',
          globalEquivalentAgeRange: '18+ years / Degree Awarding',
          isTertiaryOrHigher: true
        };
      case 'professional_continuing':
        return {
          tier,
          standardName: 'Executive, Professional Certification & Lifelong Learning',
          globalEquivalentAgeRange: 'Adult / Post-Graduate',
          isTertiaryOrHigher: true
        };
    }
  }
}

export const educationClassificationEngine = new EducationClassificationEngine();
