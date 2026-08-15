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
      { name: 'Abia', code: 'NG-AB' },
      { name: 'Adamawa', code: 'NG-AD' },
      { name: 'Akwa Ibom', code: 'NG-AK' },
      { name: 'Anambra', code: 'NG-AN' },
      { name: 'Bauchi', code: 'NG-BA' },
      { name: 'Bayelsa', code: 'NG-BY' },
      { name: 'Benue', code: 'NG-BE' },
      { name: 'Borno', code: 'NG-BO' },
      { name: 'Cross River', code: 'NG-CR' },
      { name: 'Delta', code: 'NG-DE' },
      { name: 'Ebonyi', code: 'NG-EB' },
      { name: 'Edo', code: 'NG-ED' },
      { name: 'Ekiti', code: 'NG-EK' },
      { name: 'Enugu', code: 'NG-EN' },
      { name: 'FCT Abuja', code: 'NG-FC' },
      { name: 'Gombe', code: 'NG-GO' },
      { name: 'Imo', code: 'NG-IM' },
      { name: 'Jigawa', code: 'NG-JI' },
      { name: 'Kaduna', code: 'NG-KD' },
      { name: 'Kano', code: 'NG-KN' },
      { name: 'Katsina', code: 'NG-KT' },
      { name: 'Kebbi', code: 'NG-KE' },
      { name: 'Kogi', code: 'NG-KO' },
      { name: 'Kwara', code: 'NG-KW' },
      { name: 'Lagos', code: 'NG-LA' },
      { name: 'Nasarawa', code: 'NG-NA' },
      { name: 'Niger', code: 'NG-NI' },
      { name: 'Ogun', code: 'NG-OG' },
      { name: 'Ondo', code: 'NG-ON' },
      { name: 'Osun', code: 'NG-OS' },
      { name: 'Oyo', code: 'NG-OY' },
      { name: 'Plateau', code: 'NG-PL' },
      { name: 'Rivers', code: 'NG-RI' },
      { name: 'Sokoto', code: 'NG-SO' },
      { name: 'Taraba', code: 'NG-TA' },
      { name: 'Yobe', code: 'NG-YO' },
      { name: 'Zamfara', code: 'NG-ZA' }
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
      { name: 'Eastern', code: 'GH-EP' },
      { name: 'Western', code: 'GH-WP' },
      { name: 'Central', code: 'GH-CP' },
      { name: 'Volta', code: 'GH-TV' },
      { name: 'Upper East', code: 'GH-UE' },
      { name: 'Upper West', code: 'GH-UW' },
      { name: 'Bono', code: 'GH-BE' },
      { name: 'Bono East', code: 'GH-BA' },
      { name: 'Ahafo', code: 'GH-AF' },
      { name: 'Oti', code: 'GH-OT' },
      { name: 'Savannah', code: 'GH-SV' },
      { name: 'North East', code: 'GH-NE' },
      { name: 'Western North', code: 'GH-WN' }
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
      { name: 'Nakuru', code: 'KE-31' },
      { name: 'Kiambu', code: 'KE-13' },
      { name: 'Uasin Gishu', code: 'KE-44' },
      { name: 'Machakos', code: 'KE-22' },
      { name: 'Kilifi', code: 'KE-18' },
      { name: 'Kajiado', code: 'KE-12' },
      { name: 'Nyeri', code: 'KE-35' },
      { name: 'Meru', code: 'KE-26' },
      { name: 'Kakamega', code: 'KE-15' },
      { name: 'Bungoma', code: 'KE-04' },
      { name: 'Garissa', code: 'KE-07' },
      { name: 'Turkana', code: 'KE-41' }
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
      { name: 'KwaZulu-Natal', code: 'ZA-NL' },
      { name: 'Eastern Cape', code: 'ZA-EC' },
      { name: 'Free State', code: 'ZA-FS' },
      { name: 'Mpumalanga', code: 'ZA-MP' },
      { name: 'Limpopo', code: 'ZA-LP' },
      { name: 'North West', code: 'ZA-NW' },
      { name: 'Northern Cape', code: 'ZA-NC' }
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
      { name: 'Florida', code: 'US-FL' },
      { name: 'Illinois', code: 'US-IL' },
      { name: 'Washington', code: 'US-WA' },
      { name: 'Pennsylvania', code: 'US-PA' },
      { name: 'Georgia', code: 'US-GA' },
      { name: 'Ohio', code: 'US-OH' },
      { name: 'Massachusetts', code: 'US-MA' },
      { name: 'District of Columbia', code: 'US-DC' },
      { name: 'Michigan', code: 'US-MI' },
      { name: 'North Carolina', code: 'US-NC' },
      { name: 'Virginia', code: 'US-VA' },
      { name: 'Colorado', code: 'US-CO' }
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
      { name: 'Alberta', code: 'CA-AB' },
      { name: 'Manitoba', code: 'CA-MB' },
      { name: 'Saskatchewan', code: 'CA-SK' },
      { name: 'Nova Scotia', code: 'CA-NS' },
      { name: 'New Brunswick', code: 'CA-NB' },
      { name: 'Newfoundland and Labrador', code: 'CA-NL' }
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
      { name: 'Wales', code: 'GB-WLS' },
      { name: 'Northern Ireland', code: 'GB-NIR' },
      { name: 'West Midlands', code: 'GB-WMD' },
      { name: 'North West England', code: 'GB-NWE' },
      { name: 'Yorkshire and the Humber', code: 'GB-YOR' },
      { name: 'South East England', code: 'GB-SEE' },
      { name: 'East of England', code: 'GB-EOE' },
      { name: 'South West England', code: 'GB-SWE' }
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
      { name: 'Karnataka', code: 'IN-KA' },
      { name: 'Tamil Nadu', code: 'IN-TN' },
      { name: 'Uttar Pradesh', code: 'IN-UP' },
      { name: 'West Bengal', code: 'IN-WB' },
      { name: 'Gujarat', code: 'IN-GJ' },
      { name: 'Telangana', code: 'IN-TG' },
      { name: 'Kerala', code: 'IN-KL' },
      { name: 'Rajasthan', code: 'IN-RJ' },
      { name: 'Punjab', code: 'IN-PB' },
      { name: 'Haryana', code: 'IN-HR' },
      { name: 'Madhya Pradesh', code: 'IN-MP' }
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
      { name: 'Eastern Province', code: 'SA-04' },
      { name: 'Madinah', code: 'SA-03' },
      { name: 'Asir', code: 'SA-06' },
      { name: 'Tabuk', code: 'SA-07' },
      { name: 'Al-Qassim', code: 'SA-05' }
    ]
  },
  TR: {
    countryCode: 'TR',
    countryName: 'Turkey / Türkiye',
    subdivisionName: 'Province',
    subdivisions: [
      'Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya', 'Adana', 'Konya'
    ],
    subdivisionItems: [
      { name: 'Istanbul', code: 'TR-34' },
      { name: 'Ankara', code: 'TR-06' },
      { name: 'Izmir', code: 'TR-35' },
      { name: 'Bursa', code: 'TR-16' },
      { name: 'Antalya', code: 'TR-07' },
      { name: 'Adana', code: 'TR-01' },
      { name: 'Konya', code: 'TR-42' }
    ]
  },
  UG: {
    countryCode: 'UG',
    countryName: 'Uganda',
    subdivisionName: 'Region',
    subdivisions: ['Central', 'Western', 'Eastern', 'Northern', 'Kampala'],
    subdivisionItems: [
      { name: 'Central', code: 'UG-C' },
      { name: 'Kampala', code: 'UG-102' },
      { name: 'Western', code: 'UG-W' },
      { name: 'Eastern', code: 'UG-E' },
      { name: 'Northern', code: 'UG-N' }
    ]
  },
  TZ: {
    countryCode: 'TZ',
    countryName: 'Tanzania',
    subdivisionName: 'Region',
    subdivisions: ['Dar es Salaam', 'Dodoma', 'Arusha', 'Mwanza', 'Zanzibar', 'Kilimanjaro'],
    subdivisionItems: [
      { name: 'Dar es Salaam', code: 'TZ-02' },
      { name: 'Dodoma', code: 'TZ-03' },
      { name: 'Arusha', code: 'TZ-01' },
      { name: 'Mwanza', code: 'TZ-14' },
      { name: 'Zanzibar', code: 'TZ-30' },
      { name: 'Kilimanjaro', code: 'TZ-09' }
    ]
  },
  VN: {
    countryCode: 'VN',
    countryName: 'Vietnam',
    subdivisionName: 'Province / Municipality',
    subdivisions: ['Hanoi', 'Ho Chi Minh City', 'Da Nang', 'Hai Phong', 'Can Tho', 'Binh Duong', 'Dong Nai', 'Khanh Hoa'],
    subdivisionItems: [
      { name: 'Hanoi', code: 'VN-HN' },
      { name: 'Ho Chi Minh City', code: 'VN-SG' },
      { name: 'Da Nang', code: 'VN-DN' },
      { name: 'Hai Phong', code: 'VN-HP' },
      { name: 'Can Tho', code: 'VN-CT' },
      { name: 'Binh Duong', code: 'VN-BD' },
      { name: 'Dong Nai', code: 'VN-75' },
      { name: 'Khanh Hoa', code: 'VN-34' }
    ]
  },
  ID: {
    countryCode: 'ID',
    countryName: 'Indonesia',
    subdivisionName: 'Province',
    subdivisions: ['Jakarta', 'West Java', 'East Java', 'Central Java', 'Bali', 'North Sumatra', 'Banten', 'Yogyakarta'],
    subdivisionItems: [
      { name: 'Jakarta', code: 'ID-JK' },
      { name: 'West Java', code: 'ID-JB' },
      { name: 'East Java', code: 'ID-JI' },
      { name: 'Central Java', code: 'ID-JT' },
      { name: 'Bali', code: 'ID-BA' },
      { name: 'North Sumatra', code: 'ID-SU' },
      { name: 'Banten', code: 'ID-BT' },
      { name: 'Yogyakarta', code: 'ID-YO' }
    ]
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
