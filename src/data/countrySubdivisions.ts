export interface CountrySubdivisionItem {
  name: string;
  code: string;
}

export interface CountrySubdivisionInfo {
  countryCode: string;
  countryName: string;
  subdivisionName: string; // e.g. State, Region, County, Province, Emirate, Governorate
  subdivisions: string[];
  subdivisionItems?: CountrySubdivisionItem[];
}

export const COUNTRY_SUBDIVISIONS_MAP: Record<string, CountrySubdivisionInfo> = {
  NG: {
    countryCode: 'NG',
    countryName: 'Nigeria',
    subdivisionName: 'State',
    subdivisions: [
      'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
      'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT Abuja', 'Gombe',
      'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
      'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
      'Taraba', 'Yobe', 'Zamfara'
    ],
    subdivisionItems: [
      { name: 'Kano', code: 'NG-KN' },
      { name: 'Kaduna', code: 'NG-KD' },
      { name: 'Lagos', code: 'NG-LA' },
      { name: 'FCT Abuja', code: 'NG-FC' },
      { name: 'Rivers', code: 'NG-RI' },
      { name: 'Oyo', code: 'NG-OY' },
      { name: 'Enugu', code: 'NG-EN' },
      { name: 'Edo', code: 'NG-ED' },
      { name: 'Ogun', code: 'NG-OG' },
      { name: 'Delta', code: 'NG-DE' }
    ]
  },
  GH: {
    countryCode: 'GH',
    countryName: 'Ghana',
    subdivisionName: 'Region',
    subdivisions: [
      'Greater Accra', 'Ashanti', 'Northern', 'Eastern', 'Western', 'Central',
      'Volta', 'Upper East', 'Upper West', 'Bono', 'Bono East', 'Ahafo', 'Oti',
      'Savannah', 'North East', 'Western North'
    ],
    subdivisionItems: [
      { name: 'Greater Accra', code: 'GH-AA' },
      { name: 'Ashanti', code: 'GH-AH' },
      { name: 'Northern', code: 'GH-NP' },
      { name: 'Western', code: 'GH-WP' }
    ]
  },
  KE: {
    countryCode: 'KE',
    countryName: 'Kenya',
    subdivisionName: 'County',
    subdivisions: [
      'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu', 'Uasin Gishu', 'Machakos',
      'Kilifi', 'Kajiado', 'Nyeri', 'Meru', 'Kakamega', 'Bungoma', 'Garissa', 'Turkana'
    ],
    subdivisionItems: [
      { name: 'Nairobi', code: 'KE-30' },
      { name: 'Mombasa', code: 'KE-28' },
      { name: 'Kisumu', code: 'KE-17' },
      { name: 'Nakuru', code: 'KE-31' }
    ]
  },
  ZA: {
    countryCode: 'ZA',
    countryName: 'South Africa',
    subdivisionName: 'Province',
    subdivisions: [
      'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Free State',
      'Mpumalanga', 'Limpopo', 'North West', 'Northern Cape'
    ],
    subdivisionItems: [
      { name: 'Gauteng', code: 'ZA-GT' },
      { name: 'Western Cape', code: 'ZA-WC' },
      { name: 'KwaZulu-Natal', code: 'ZA-NL' }
    ]
  },
  US: {
    countryCode: 'US',
    countryName: 'United States',
    subdivisionName: 'State',
    subdivisions: [
      'California', 'New York', 'Texas', 'Florida', 'Illinois', 'Washington',
      'Pennsylvania', 'Georgia', 'Ohio', 'Massachusetts', 'District of Columbia',
      'Michigan', 'North Carolina', 'Virginia', 'Colorado'
    ],
    subdivisionItems: [
      { name: 'California', code: 'US-CA' },
      { name: 'New York', code: 'US-NY' },
      { name: 'Texas', code: 'US-TX' },
      { name: 'Florida', code: 'US-FL' }
    ]
  },
  CA: {
    countryCode: 'CA',
    countryName: 'Canada',
    subdivisionName: 'Province / Territory',
    subdivisions: [
      'Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba',
      'Saskatchewan', 'Nova Scotia', 'New Brunswick', 'Newfoundland and Labrador'
    ],
    subdivisionItems: [
      { name: 'Ontario', code: 'CA-ON' },
      { name: 'Quebec', code: 'CA-QC' },
      { name: 'British Columbia', code: 'CA-BC' },
      { name: 'Alberta', code: 'CA-AB' }
    ]
  },
  GB: {
    countryCode: 'GB',
    countryName: 'United Kingdom',
    subdivisionName: 'Region / Constituent Country',
    subdivisions: [
      'Greater London', 'Scotland', 'Wales', 'Northern Ireland', 'West Midlands',
      'North West England', 'Yorkshire and the Humber', 'South East England',
      'East of England', 'South West England'
    ],
    subdivisionItems: [
      { name: 'Greater London', code: 'GB-LND' },
      { name: 'Scotland', code: 'GB-SCT' },
      { name: 'Wales', code: 'GB-WLS' }
    ]
  },
  IN: {
    countryCode: 'IN',
    countryName: 'India',
    subdivisionName: 'State / Union Territory',
    subdivisions: [
      'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal',
      'Gujarat', 'Telangana', 'Kerala', 'Rajasthan', 'Punjab', 'Haryana', 'Madhya Pradesh'
    ],
    subdivisionItems: [
      { name: 'Maharashtra', code: 'IN-MH' },
      { name: 'Delhi', code: 'IN-DL' },
      { name: 'Karnataka', code: 'IN-KA' }
    ]
  },
  SA: {
    countryCode: 'SA',
    countryName: 'Saudi Arabia',
    subdivisionName: 'Governorate / Region',
    subdivisions: [
      'Riyadh', 'Makkah', 'Eastern Province', 'Madinah', 'Asir', 'Tabuk', 'Al-Qassim'
    ],
    subdivisionItems: [
      { name: 'Riyadh', code: 'SA-01' },
      { name: 'Makkah', code: 'SA-02' },
      { name: 'Eastern Province', code: 'SA-04' }
    ]
  },
  AE: {
    countryCode: 'AE',
    countryName: 'United Arab Emirates',
    subdivisionName: 'Emirate',
    subdivisions: [
      'Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'
    ],
    subdivisionItems: [
      { name: 'Abu Dhabi', code: 'AE-AZ' },
      { name: 'Dubai', code: 'AE-DU' },
      { name: 'Sharjah', code: 'AE-SH' },
      { name: 'Ajman', code: 'AE-AJ' },
      { name: 'Ras Al Khaimah', code: 'AE-RK' },
      { name: 'Fujairah', code: 'AE-FU' },
      { name: 'Umm Al Quwain', code: 'AE-UQ' }
    ]
  },
  TR: {
    countryCode: 'TR',
    countryName: 'Turkey / Türkiye',
    subdivisionName: 'Province',
    subdivisions: [
      'Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya', 'Adana', 'Konya'
    ]
  },
  UG: {
    countryCode: 'UG',
    countryName: 'Uganda',
    subdivisionName: 'Region',
    subdivisions: ['Central', 'Western', 'Eastern', 'Northern', 'Kampala']
  },
  TZ: {
    countryCode: 'TZ',
    countryName: 'Tanzania',
    subdivisionName: 'Region',
    subdivisions: ['Dar es Salaam', 'Dodoma', 'Arusha', 'Mwanza', 'Zanzibar', 'Kilimanjaro']
  }
};

export function getSubdivisionInfo(countryCode: string): CountrySubdivisionInfo {
  const code = (countryCode || '').trim().toUpperCase();
  if (COUNTRY_SUBDIVISIONS_MAP[code]) {
    return COUNTRY_SUBDIVISIONS_MAP[code];
  }
  return {
    countryCode: code,
    countryName: code,
    subdivisionName: 'State / Region',
    subdivisions: []
  };
}

export function resolveSubdivisionCode(countryCode: string, subdivisionNameOrCode: string): string {
  if (!subdivisionNameOrCode) return '';
  const norm = subdivisionNameOrCode.trim();
  const info = getSubdivisionInfo(countryCode);
  if (info.subdivisionItems) {
    const found = info.subdivisionItems.find(
      (item) => item.code.toUpperCase() === norm.toUpperCase() || item.name.toLowerCase() === norm.toLowerCase()
    );
    if (found) return found.code;
  }
  // Generate standard prefix if not in map
  return `${countryCode.toUpperCase()}-${norm.replace(/[^A-Za-z0-9]/g, '').substring(0, 3).toUpperCase()}`;
}
