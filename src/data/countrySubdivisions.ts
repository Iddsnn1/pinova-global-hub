export interface CountrySubdivisionInfo {
  countryCode: string;
  countryName: string;
  subdivisionName: string; // e.g. State, Region, County, Province, Emirate, Governorate
  subdivisions: string[];
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
    ]
  },
  KE: {
    countryCode: 'KE',
    countryName: 'Kenya',
    subdivisionName: 'County',
    subdivisions: [
      'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu', 'Uasin Gishu', 'Machakos',
      'Kilifi', 'Kajiado', 'Nyeri', 'Meru', 'Kakamega', 'Bungoma', 'Garissa', 'Turkana'
    ]
  },
  ZA: {
    countryCode: 'ZA',
    countryName: 'South Africa',
    subdivisionName: 'Province',
    subdivisions: [
      'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Free State',
      'Mpumalanga', 'Limpopo', 'North West', 'Northern Cape'
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
    ]
  },
  IN: {
    countryCode: 'IN',
    countryName: 'India',
    subdivisionName: 'State / Union Territory',
    subdivisions: [
      'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal',
      'Gujarat', 'Telangana', 'Kerala', 'Rajasthan', 'Punjab', 'Haryana', 'Madhya Pradesh'
    ]
  },
  SA: {
    countryCode: 'SA',
    countryName: 'Saudi Arabia',
    subdivisionName: 'Governorate / Region',
    subdivisions: [
      'Riyadh', 'Makkah', 'Eastern Province', 'Madinah', 'Asir', 'Tabuk', 'Al-Qassim'
    ]
  },
  AE: {
    countryCode: 'AE',
    countryName: 'United Arab Emirates',
    subdivisionName: 'Emirate',
    subdivisions: [
      'Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'
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
