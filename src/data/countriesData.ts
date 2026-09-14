export interface GlobalCountry {
  name: string;
  code: string; // ISO 3166-1 alpha-2
  code3: string; // ISO 3166-1 alpha-3
  flag: string;
  dialCode: string;
  region: 'Africa' | 'Americas' | 'Asia' | 'Europe' | 'Oceania' | 'Middle East';
  currency: {
    code: string;
    name: string;
    symbol: string;
  };
  subdivisionType: string; // e.g. State, Province, Region, County, Emirate, Prefecture, Department
  subdivisions: string[];
  subdivisionItems?: { name: string; code: string; cities?: string[] }[];
  popularCities?: string[];
  businessRegName?: string; // e.g. CAC Registration (RC/BN)
  taxIdName?: string; // e.g. TIN, EIN, VAT, GSTIN
  idDocTypes?: { value: string; label: string }[];
}

export const ALL_GLOBAL_COUNTRIES: GlobalCountry[] = [
  // 1. AFRICA
  {
    name: 'Nigeria',
    code: 'NG',
    code3: 'NGA',
    flag: '🇳🇬',
    dialCode: '+234',
    region: 'Africa',
    currency: { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
    subdivisionType: 'State',
    subdivisions: [
      'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
      'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT Abuja', 'Gombe',
      'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
      'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
      'Taraba', 'Yobe', 'Zamfara'
    ],
    subdivisionItems: [
      { name: 'Abia', code: 'NG-AB', cities: ['Umuahia', 'Aba', 'Ohafia'] },
      { name: 'Adamawa', code: 'NG-AD', cities: ['Yola', 'Mubi', 'Jimeta'] },
      { name: 'Akwa Ibom', code: 'NG-AK', cities: ['Uyo', 'Eket', 'Ikot Ekpene'] },
      { name: 'Anambra', code: 'NG-AN', cities: ['Awka', 'Onitsha', 'Nnewi'] },
      { name: 'Bauchi', code: 'NG-BA', cities: ['Bauchi', 'Azare', 'Misau'] },
      { name: 'Bayelsa', code: 'NG-BY', cities: ['Yenagoa', 'Brass', 'Ogbia'] },
      { name: 'Benue', code: 'NG-BE', cities: ['Makurdi', 'Gboko', 'Otukpo'] },
      { name: 'Borno', code: 'NG-BO', cities: ['Maiduguri', 'Biu', 'Bama'] },
      { name: 'Cross River', code: 'NG-CR', cities: ['Calabar', 'Ikom', 'Ogoja'] },
      { name: 'Delta', code: 'NG-DE', cities: ['Asaba', 'Warri', 'Ughelli', 'Sapele'] },
      { name: 'Ebonyi', code: 'NG-EB', cities: ['Abakaliki', 'Afikpo', 'Onueke'] },
      { name: 'Edo', code: 'NG-ED', cities: ['Benin City', 'Auchi', 'Ekpoma'] },
      { name: 'Ekiti', code: 'NG-EK', cities: ['Ado-Ekiti', 'Ikere', 'Ijero'] },
      { name: 'Enugu', code: 'NG-EN', cities: ['Enugu', 'Nsukka', 'Awgu'] },
      { name: 'FCT Abuja', code: 'NG-FC', cities: ['Abuja Municipal', 'Garki', 'Wuse', 'Maitama', 'Gwarinpa', 'Kubwa', 'Bwari', 'Kuje'] },
      { name: 'Gombe', code: 'NG-GO', cities: ['Gombe', 'Kaltungo', 'Dukku'] },
      { name: 'Imo', code: 'NG-IM', cities: ['Owerri', 'Orlu', 'Okigwe'] },
      { name: 'Jigawa', code: 'NG-JI', cities: ['Dutse', 'Hadejia', 'Kazaure'] },
      { name: 'Kaduna', code: 'NG-KD', cities: ['Kaduna', 'Zaria', 'Kafanchan'] },
      { name: 'Kano', code: 'NG-KN', cities: ['Kano Municipal', 'Fagge', 'Dala', 'Nassarawa', 'Gwale', 'Tarauni', 'Kumbotso', 'Ungogo'] },
      { name: 'Katsina', code: 'NG-KT', cities: ['Katsina', 'Daura', 'Funtua'] },
      { name: 'Kebbi', code: 'NG-KE', cities: ['Birnin Kebbi', 'Argungu', 'Yauri'] },
      { name: 'Kogi', code: 'NG-KO', cities: ['Lokoja', 'Okene', 'Kabba'] },
      { name: 'Kwara', code: 'NG-KW', cities: ['Ilorin', 'Offa', 'Omu-Aran'] },
      { name: 'Lagos', code: 'NG-LA', cities: ['Ikeja', 'Lagos Island', 'Victoria Island', 'Lekki', 'Surulere', 'Yaba', 'Ikorodu', 'Epe', 'Badagry', 'Alimosho'] },
      { name: 'Nasarawa', code: 'NG-NA', cities: ['Lafia', 'Keffi', 'Akwanga', 'Karu'] },
      { name: 'Niger', code: 'NG-NI', cities: ['Minna', 'Bida', 'Suleja', 'Kontagora'] },
      { name: 'Ogun', code: 'NG-OG', cities: ['Abeokuta', 'Ijebu-Ode', 'Sagamu', 'Ota'] },
      { name: 'Ondo', code: 'NG-ON', cities: ['Akure', 'Ondo Town', 'Owo'] },
      { name: 'Osun', code: 'NG-OS', cities: ['Osogbo', 'Ile-Ife', 'Ede', 'Ilesa'] },
      { name: 'Oyo', code: 'NG-OY', cities: ['Ibadan', 'Ogbomoso', 'Oyo Town', 'Iseyin'] },
      { name: 'Plateau', code: 'NG-PL', cities: ['Jos', 'Bukuru', 'Pankshin'] },
      { name: 'Rivers', code: 'NG-RI', cities: ['Port Harcourt', 'Obio-Akpor', 'Bonny', 'Eleme'] },
      { name: 'Sokoto', code: 'NG-SO', cities: ['Sokoto', 'Wamakko', 'Tambuwal'] },
      { name: 'Taraba', code: 'NG-TA', cities: ['Jalingo', 'Wukari', 'Bali'] },
      { name: 'Yobe', code: 'NG-YO', cities: ['Damaturu', 'Potiskum', 'Gashua'] },
      { name: 'Zamfara', code: 'NG-ZA', cities: ['Gusau', 'Kaura Namoda', 'Talata Mafara'] }
    ],
    popularCities: ['Lagos', 'Abuja', 'Kano', 'Ibadan', 'Port Harcourt', 'Kaduna', 'Benin City', 'Enugu'],
    businessRegName: 'CAC Registration (RC/BN Number)',
    taxIdName: 'Tax Identification Number (TIN/FIRS)',
    idDocTypes: [
      { value: 'national_id', label: 'National Identity Card (NIN / NIN Slip)' },
      { value: 'passport', label: 'Nigerian International Passport' },
      { value: 'voters_card', label: "Permanent Voter's Card (PVC)" },
      { value: 'drivers_license', label: "FRSC Driver's License" },
      { value: 'business_cert', label: 'CAC Certificate of Incorporation / Business Name' },
      { value: 'utility_bill', label: 'Electricity / Utility Bill (Proof of Address)' }
    ]
  },
  {
    name: 'Ghana',
    code: 'GH',
    code3: 'GHA',
    flag: '🇬🇭',
    dialCode: '+233',
    region: 'Africa',
    currency: { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵' },
    subdivisionType: 'Region',
    subdivisions: [
      'Greater Accra', 'Ashanti', 'Northern', 'Eastern', 'Western', 'Central',
      'Volta', 'Upper East', 'Upper West', 'Bono', 'Bono East', 'Ahafo', 'Oti',
      'Savannah', 'North East', 'Western North'
    ],
    subdivisionItems: [
      { name: 'Greater Accra', code: 'GH-AA', cities: ['Accra', 'Tema', 'Madina', 'Adenta'] },
      { name: 'Ashanti', code: 'GH-AH', cities: ['Kumasi', 'Obuasi', 'Tafo'] },
      { name: 'Northern', code: 'GH-NP', cities: ['Tamale', 'Yendi', 'Savelugu'] },
      { name: 'Eastern', code: 'GH-EP', cities: ['Koforidua', 'Nkawkaw'] },
      { name: 'Western', code: 'GH-WP', cities: ['Sekondi-Takoradi', 'Tarkwa'] },
      { name: 'Central', code: 'GH-CP', cities: ['Cape Coast', 'Kasoa', 'Winneba'] }
    ],
    popularCities: ['Accra', 'Kumasi', 'Tamale', 'Sekondi-Takoradi', 'Tema', 'Cape Coast'],
    businessRegName: "Registrar General's Dept (RGD Number)",
    taxIdName: 'GRA Tax Identification Number (TIN)',
    idDocTypes: [
      { value: 'national_id', label: 'Ghana Card (National ID)' },
      { value: 'passport', label: 'Ghanaian Passport' },
      { value: 'voters_card', label: "Voter's ID Card" },
      { value: 'business_cert', label: 'RGD Certificate of Registration' }
    ]
  },
  {
    name: 'Kenya',
    code: 'KE',
    code3: 'KEN',
    flag: '🇰🇪',
    dialCode: '+254',
    region: 'Africa',
    currency: { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
    subdivisionType: 'County',
    subdivisions: [
      'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu', 'Uasin Gishu', 'Machakos',
      'Kilifi', 'Kajiado', 'Nyeri', 'Meru', 'Kakamega', 'Bungoma', 'Garissa', 'Turkana'
    ],
    subdivisionItems: [
      { name: 'Nairobi', code: 'KE-30', cities: ['Nairobi Central', 'Westlands', 'Kilimani', 'Eastleigh'] },
      { name: 'Mombasa', code: 'KE-28', cities: ['Mombasa City', 'Nyali', 'Likoni'] },
      { name: 'Kisumu', code: 'KE-17', cities: ['Kisumu City', 'Kondele'] },
      { name: 'Nakuru', code: 'KE-31', cities: ['Nakuru Town', 'Naivasha'] },
      { name: 'Kiambu', code: 'KE-13', cities: ['Kiambu', 'Thika', 'Ruiru'] }
    ],
    popularCities: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika'],
    businessRegName: 'BRS Business Registration / CR12',
    taxIdName: 'KRA PIN Number',
    idDocTypes: [
      { value: 'national_id', label: 'Huduma Card / National ID' },
      { value: 'passport', label: 'Kenyan Passport' },
      { value: 'business_cert', label: 'BRS Certificate of Incorporation / CR12' }
    ]
  },
  {
    name: 'South Africa',
    code: 'ZA',
    code3: 'ZAF',
    flag: '🇿🇦',
    dialCode: '+27',
    region: 'Africa',
    currency: { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
    subdivisionType: 'Province',
    subdivisions: [
      'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Free State',
      'Mpumalanga', 'Limpopo', 'North West', 'Northern Cape'
    ],
    subdivisionItems: [
      { name: 'Gauteng', code: 'ZA-GT', cities: ['Johannesburg', 'Pretoria', 'Sandton', 'Soweto', 'Centurion'] },
      { name: 'Western Cape', code: 'ZA-WC', cities: ['Cape Town', 'Stellenbosch', 'George'] },
      { name: 'KwaZulu-Natal', code: 'ZA-NL', cities: ['Durban', 'Pietermaritzburg', 'Umhlanga'] }
    ],
    popularCities: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth', 'Sandton'],
    businessRegName: 'CIPC Registration (CoR Number)',
    taxIdName: 'SARS Tax Reference Number',
    idDocTypes: [
      { value: 'national_id', label: 'South African Green Barcoded ID / Smart ID' },
      { value: 'passport', label: 'South African Passport' },
      { value: 'business_cert', label: 'CIPC Certificate of Registration' }
    ]
  },
  {
    name: 'Egypt',
    code: 'EG',
    code3: 'EGY',
    flag: '🇪🇬',
    dialCode: '+20',
    region: 'Africa',
    currency: { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£' },
    subdivisionType: 'Governorate',
    subdivisions: ['Cairo', 'Giza', 'Alexandria', 'Dakahlia', 'Red Sea', 'Sharqia', 'Qalyubia', 'Aswan', 'Luxor'],
    popularCities: ['Cairo', 'Alexandria', 'Giza', 'Shubra El Kheima', 'Port Said', 'Suez', 'Mansoura'],
    businessRegName: 'Commercial Register Number (CR)',
    taxIdName: 'Egyptian Tax Card / ID'
  },
  {
    name: 'Ethiopia',
    code: 'ET',
    code3: 'ETH',
    flag: '🇪🇹',
    dialCode: '+251',
    region: 'Africa',
    currency: { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br' },
    subdivisionType: 'Region / Chartered City',
    subdivisions: ['Addis Ababa', 'Oromia', 'Amhara', 'Sidama', 'Somali', 'Tigray', 'Dire Dawa', 'Southern Nations'],
    popularCities: ['Addis Ababa', 'Dire Dawa', 'Hawassa', 'Bahir Dar', 'Gondar', 'Mekelle', 'Adama'],
    businessRegName: 'Ministry of Trade License (TIN)',
    taxIdName: 'Federal Tax ID (TIN)'
  },
  {
    name: 'Uganda',
    code: 'UG',
    code3: 'UGA',
    flag: '🇺🇬',
    dialCode: '+256',
    region: 'Africa',
    currency: { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh' },
    subdivisionType: 'Region',
    subdivisions: ['Central', 'Kampala', 'Western', 'Eastern', 'Northern'],
    popularCities: ['Kampala', 'Entebbe', 'Jinja', 'Mbarara', 'Gulu', 'Mbale'],
    businessRegName: 'URSB Company Registration Number',
    taxIdName: 'URA Tax Identification Number (TIN)'
  },
  {
    name: 'Tanzania',
    code: 'TZ',
    code3: 'TZA',
    flag: '🇹🇿',
    dialCode: '+255',
    region: 'Africa',
    currency: { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh' },
    subdivisionType: 'Region',
    subdivisions: ['Dar es Salaam', 'Dodoma', 'Arusha', 'Mwanza', 'Zanzibar', 'Kilimanjaro', 'Mbeya', 'Morogoro'],
    popularCities: ['Dar es Salaam', 'Dodoma', 'Mwanza', 'Arusha', 'Zanzibar City', 'Mbeya'],
    businessRegName: 'BRELA Registration Certificate',
    taxIdName: 'TRA Taxpayer Identification Number (TIN)'
  },
  {
    name: 'Rwanda',
    code: 'RW',
    code3: 'RWA',
    flag: '🇷🇼',
    dialCode: '+250',
    region: 'Africa',
    currency: { code: 'RWF', name: 'Rwandan Franc', symbol: 'RF' },
    subdivisionType: 'Province',
    subdivisions: ['Kigali City', 'Northern Province', 'Southern Province', 'Eastern Province', 'Western Province'],
    popularCities: ['Kigali', 'Butare', 'Gisenyi', 'Ruhengeri', 'Muhanga'],
    businessRegName: 'RDB Company Registration',
    taxIdName: 'RRA Tax Identification Number (TIN)'
  },
  {
    name: 'Cameroon',
    code: 'CM',
    code3: 'CMR',
    flag: '🇨🇲',
    dialCode: '+237',
    region: 'Africa',
    currency: { code: 'XAF', name: 'Central African CFA Franc', symbol: 'FCFA' },
    subdivisionType: 'Region',
    subdivisions: ['Centre', 'Littoral', 'West', 'North-West', 'South-West', 'North', 'Far North', 'South', 'East', 'Adamawa'],
    popularCities: ['Douala', 'Yaounde', 'Bamenda', 'Bafoussam', 'Garoua', 'Maroua']
  },
  {
    name: "Côte d'Ivoire (Ivory Coast)",
    code: 'CI',
    code3: 'CIV',
    flag: '🇨🇮',
    dialCode: '+225',
    region: 'Africa',
    currency: { code: 'XOF', name: 'West African CFA Franc', symbol: 'CFA' },
    subdivisionType: 'District / Region',
    subdivisions: ['Abidjan', 'Yamoussoukro', 'Bas-Sassandra', 'Comoe', 'Gôh-Djiboua', 'Lacs', 'Lagunes', 'Montagnes', 'Sassandra-Marahoué', 'Savanes', 'Vallée du Bandama', 'Woroba', 'Zanzan'],
    popularCities: ['Abidjan', 'Bouake', 'Daloa', 'Yamoussoukro', 'San Pedro', 'Korhogo']
  },
  {
    name: 'Senegal',
    code: 'SN',
    code3: 'SEN',
    flag: '🇸🇳',
    dialCode: '+221',
    region: 'Africa',
    currency: { code: 'XOF', name: 'West African CFA Franc', symbol: 'CFA' },
    subdivisionType: 'Region',
    subdivisions: ['Dakar', 'Thies', 'Diourbel', 'Saint-Louis', 'Kaolack', 'Ziguinchor', 'Louga', 'Fatick', 'Kolda', 'Tambacounda'],
    popularCities: ['Dakar', 'Thies', 'Kaolack', 'Saint-Louis', 'Touba', 'Ziguinchor']
  },
  {
    name: 'Morocco',
    code: 'MA',
    code3: 'MAR',
    flag: '🇲🇦',
    dialCode: '+212',
    region: 'Africa',
    currency: { code: 'MAD', name: 'Moroccan Dirham', symbol: 'DH' },
    subdivisionType: 'Region',
    subdivisions: ['Casablanca-Settat', 'Rabat-Salé-Kénitra', 'Marrakesh-Safi', 'Tangier-Tetouan-Al Hoceima', 'Fès-Meknès', 'Souss-Massa', 'Oriental', 'Béni Mellal-Khénifra', 'Drâa-Tafilalet'],
    popularCities: ['Casablanca', 'Rabat', 'Marrakech', 'Tangier', 'Fes', 'Agadir', 'Meknes']
  },
  {
    name: 'Algeria',
    code: 'DZ',
    code3: 'DZA',
    flag: '🇩🇿',
    dialCode: '+213',
    region: 'Africa',
    currency: { code: 'DZD', name: 'Algerian Dinar', symbol: 'DA' },
    subdivisionType: 'Province (Wilaya)',
    subdivisions: ['Algiers', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Batna', 'Djelfa', 'Setif'],
    popularCities: ['Algiers', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Batna']
  },
  {
    name: 'Angola',
    code: 'AO',
    code3: 'AGO',
    flag: '🇦🇴',
    dialCode: '+244',
    region: 'Africa',
    currency: { code: 'AOA', name: 'Angolan Kwanza', symbol: 'Kz' },
    subdivisionType: 'Province',
    subdivisions: ['Luanda', 'Benguela', 'Huambo', 'Huila', 'Cabinda', 'Cuanza Sul', 'Uige', 'Malanje'],
    popularCities: ['Luanda', 'Huambo', 'Lobito', 'Benguela', 'Lubango', 'Malanje']
  },
  {
    name: 'Zambia',
    code: 'ZM',
    code3: 'ZMB',
    flag: '🇿🇲',
    dialCode: '+260',
    region: 'Africa',
    currency: { code: 'ZMW', name: 'Zambian Kwacha', symbol: 'ZK' },
    subdivisionType: 'Province',
    subdivisions: ['Lusaka', 'Copperbelt', 'Southern', 'Central', 'Eastern', 'Western', 'Northern', 'North-Western', 'Luapula', 'Muchinga'],
    popularCities: ['Lusaka', 'Kitwe', 'Ndola', 'Kabwe', 'Chingola', 'Livingstone']
  },
  {
    name: 'Zimbabwe',
    code: 'ZW',
    code3: 'ZWE',
    flag: '🇿🇼',
    dialCode: '+263',
    region: 'Africa',
    currency: { code: 'USD', name: 'US Dollar / ZiG', symbol: '$' },
    subdivisionType: 'Province',
    subdivisions: ['Harare', 'Bulawayo', 'Manicaland', 'Mashonaland Central', 'Mashonaland East', 'Mashonaland West', 'Masvingo', 'Matabeleland North', 'Matabeleland South', 'Midlands'],
    popularCities: ['Harare', 'Bulawayo', 'Chitungwiza', 'Mutare', 'Gweru', 'Kwekwe']
  },
  {
    name: 'Namibia',
    code: 'NA',
    code3: 'NAM',
    flag: '🇳🇦',
    dialCode: '+264',
    region: 'Africa',
    currency: { code: 'NAD', name: 'Namibian Dollar', symbol: 'N$' },
    subdivisionType: 'Region',
    subdivisions: ['Khomas', 'Erongo', 'Otjozondjupa', 'Oshana', 'Hardap', 'Karas', 'Kavango East', 'Oshikoto'],
    popularCities: ['Windhoek', 'Walvis Bay', 'Swakopmund', 'Oshakati', 'Rehoboth']
  },
  {
    name: 'Botswana',
    code: 'BW',
    code3: 'BWA',
    flag: '🇧🇼',
    dialCode: '+267',
    region: 'Africa',
    currency: { code: 'BWP', name: 'Botswana Pula', symbol: 'P' },
    subdivisionType: 'District',
    subdivisions: ['Gaborone', 'Francistown', 'Kweneng', 'Central', 'South-East', 'Southern', 'North-West', 'Kgatleng'],
    popularCities: ['Gaborone', 'Francistown', 'Molepolole', 'Maun', 'Serowe']
  },
  {
    name: 'Mozambique',
    code: 'MZ',
    code3: 'MOZ',
    flag: '🇲🇿',
    dialCode: '+258',
    region: 'Africa',
    currency: { code: 'MZN', name: 'Mozambican Metical', symbol: 'MT' },
    subdivisionType: 'Province',
    subdivisions: ['Maputo City', 'Maputo', 'Nampula', 'Zambezia', 'Sofala', 'Cabo Delgado', 'Inhambane', 'Gaza', 'Manica', 'Tete', 'Niassa'],
    popularCities: ['Maputo', 'Matola', 'Nampula', 'Beira', 'Chimoio', 'Nacala']
  },
  {
    name: 'Mauritius',
    code: 'MU',
    code3: 'MUS',
    flag: '🇲🇺',
    dialCode: '+230',
    region: 'Africa',
    currency: { code: 'MUR', name: 'Mauritian Rupee', symbol: '₨' },
    subdivisionType: 'District',
    subdivisions: ['Port Louis', 'Plaines Wilhems', 'Pamplemousses', 'Riviere du Rempart', 'Flacq', 'Grand Port', 'Savanne', 'Riviere Noire', 'Moka'],
    popularCities: ['Port Louis', 'Beau Bassin-Rose Hill', 'Vacoas-Phoenix', 'Curepipe', 'Quatre Bornes']
  },

  // 2. NORTH AMERICA & AMERICAS
  {
    name: 'United States',
    code: 'US',
    code3: 'USA',
    flag: '🇺🇸',
    dialCode: '+1',
    region: 'Americas',
    currency: { code: 'USD', name: 'US Dollar', symbol: '$' },
    subdivisionType: 'State',
    subdivisions: [
      'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
      'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
      'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
      'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina',
      'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
      'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
      'Wisconsin', 'Wyoming', 'District of Columbia', 'Puerto Rico'
    ],
    subdivisionItems: [
      { name: 'California', code: 'US-CA', cities: ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Sacramento', 'Oakland'] },
      { name: 'New York', code: 'US-NY', cities: ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany'] },
      { name: 'Texas', code: 'US-TX', cities: ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'El Paso'] },
      { name: 'Florida', code: 'US-FL', cities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale', 'Tallahassee'] },
      { name: 'Illinois', code: 'US-IL', cities: ['Chicago', 'Aurora', 'Naperville', 'Joliet', 'Springfield'] },
      { name: 'Washington', code: 'US-WA', cities: ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue'] }
    ],
    popularCities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami', 'San Francisco', 'Austin', 'Seattle'],
    businessRegName: 'State Business Filing (SOS) / EIN',
    taxIdName: 'Federal Employer ID (EIN / SSN)',
    idDocTypes: [
      { value: 'drivers_license', label: "US State Driver's License / Real ID" },
      { value: 'passport', label: 'US Passport / Passport Card' },
      { value: 'national_id', label: 'State Issued Identification Card' },
      { value: 'business_cert', label: 'Articles of Incorporation / LLC Filing' }
    ]
  },
  {
    name: 'Canada',
    code: 'CA',
    code3: 'CAN',
    flag: '🇨🇦',
    dialCode: '+1',
    region: 'Americas',
    currency: { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
    subdivisionType: 'Province / Territory',
    subdivisions: [
      'Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba',
      'Saskatchewan', 'Nova Scotia', 'New Brunswick', 'Newfoundland and Labrador',
      'Prince Edward Island', 'Northwest Territories', 'Yukon', 'Nunavut'
    ],
    subdivisionItems: [
      { name: 'Ontario', code: 'CA-ON', cities: ['Toronto', 'Ottawa', 'Mississauga', 'Hamilton', 'Brampton', 'London'] },
      { name: 'Quebec', code: 'CA-QC', cities: ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Longueuil'] },
      { name: 'British Columbia', code: 'CA-BC', cities: ['Vancouver', 'Victoria', 'Surrey', 'Burnaby', 'Richmond'] },
      { name: 'Alberta', code: 'CA-AB', cities: ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge'] }
    ],
    popularCities: ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Ottawa', 'Edmonton'],
    businessRegName: 'Corporation Number / BN (Business Number)',
    taxIdName: 'CRA GST/HST Number',
    idDocTypes: [
      { value: 'drivers_license', label: "Provincial Driver's License" },
      { value: 'passport', label: 'Canadian Passport' },
      { value: 'business_cert', label: 'Certificate of Incorporation / Master Business Licence' }
    ]
  },
  {
    name: 'Brazil',
    code: 'BR',
    code3: 'BRA',
    flag: '🇧🇷',
    dialCode: '+55',
    region: 'Americas',
    currency: { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
    subdivisionType: 'State',
    subdivisions: [
      'São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Bahia', 'Paraná', 'Rio Grande do Sul',
      'Pernambuco', 'Ceará', 'Pará', 'Santa Catarina', 'Goiás', 'Maranhão', 'Amazonas',
      'Espírito Santo', 'Paraíba', 'Rio Grande do Norte', 'Mato Grosso', 'Alagoas',
      'Piauí', 'Distrito Federal', 'Mato Grosso do Sul', 'Sergipe', 'Rondônia', 'Tocantins',
      'Acre', 'Amapá', 'Roraima'
    ],
    subdivisionItems: [
      { name: 'São Paulo', code: 'BR-SP', cities: ['São Paulo', 'Campinas', 'Guarulhos', 'São Bernardo do Campo', 'Santos'] },
      { name: 'Rio de Janeiro', code: 'BR-RJ', cities: ['Rio de Janeiro', 'São Gonçalo', 'Duque de Caxias', 'Niterói'] },
      { name: 'Minas Gerais', code: 'BR-MG', cities: ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora'] }
    ],
    popularCities: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Curitiba'],
    businessRegName: 'CNPJ (Cadastro Nacional da Pessoa Jurídica)',
    taxIdName: 'CPF (Individual) / Inscrição Estadual',
    idDocTypes: [
      { value: 'national_id', label: 'RG (Carteira de Identidade Nacional)' },
      { value: 'drivers_license', label: 'CNH (Carteira Nacional de Habilitação)' },
      { value: 'passport', label: 'Passaporte Brasileiro' },
      { value: 'business_cert', label: 'Cartão CNPJ / Contrato Social' }
    ]
  },
  {
    name: 'Mexico',
    code: 'MX',
    code3: 'MEX',
    flag: '🇲🇽',
    dialCode: '+52',
    region: 'Americas',
    currency: { code: 'MXN', name: 'Mexican Peso', symbol: 'Mex$' },
    subdivisionType: 'State',
    subdivisions: [
      'Ciudad de México', 'Jalisco', 'Nuevo León', 'Puebla', 'Guanajuato', 'Veracruz',
      'Yucatán', 'Querétaro', 'Quintana Roo', 'Chihuahua', 'Sonora', 'Baja California',
      'Tamaulipas', 'Michoacán', 'Sinaloa', 'Coahuila', 'San Luis Potosí', 'Hidalgo'
    ],
    popularCities: ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'Cancún', 'Querétaro'],
    businessRegName: 'RFC (Registro Federal de Contribuyentes)',
    taxIdName: 'RFC / SAT Tax Number'
  },
  {
    name: 'Argentina',
    code: 'AR',
    code3: 'ARG',
    flag: '🇦🇷',
    dialCode: '+54',
    region: 'Americas',
    currency: { code: 'ARS', name: 'Argentine Peso', symbol: '$' },
    subdivisionType: 'Province',
    subdivisions: ['Buenos Aires', 'Ciudad Autónoma de Buenos Aires', 'Córdoba', 'Santa Fe', 'Mendoza', 'Tucumán', 'Entre Ríos', 'Salta', 'Misiones', 'Chaco', 'Corrientes', 'San Juan', 'Jujuy'],
    popularCities: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata', 'San Miguel de Tucumán', 'Mar del Plata']
  },
  {
    name: 'Colombia',
    code: 'CO',
    code3: 'COL',
    flag: '🇨🇴',
    dialCode: '+57',
    region: 'Americas',
    currency: { code: 'COP', name: 'Colombian Peso', symbol: 'COL$' },
    subdivisionType: 'Department',
    subdivisions: ['Bogotá D.C.', 'Antioquia', 'Valle del Cauca', 'Cundinamarca', 'Santander', 'Atlántico', 'Bolívar', 'Boyacá', 'Tolima', 'Caldas', 'Risaralda', 'Huila'],
    popularCities: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Cúcuta', 'Bucaramanga']
  },
  {
    name: 'Chile',
    code: 'CL',
    code3: 'CHL',
    flag: '🇨🇱',
    dialCode: '+56',
    region: 'Americas',
    currency: { code: 'CLP', name: 'Chilean Peso', symbol: 'CLP$' },
    subdivisionType: 'Region',
    subdivisions: ['Región Metropolitana de Santiago', 'Valparaíso', 'Biobío', 'Maule', 'La Araucanía', "O'Higgins", 'Los Lagos', 'Coquimbo', 'Antofagasta'],
    popularCities: ['Santiago', 'Valparaíso', 'Concepción', 'La Serena', 'Antofagasta', 'Temuco']
  },
  {
    name: 'Peru',
    code: 'PE',
    code3: 'PER',
    flag: '🇵🇪',
    dialCode: '+51',
    region: 'Americas',
    currency: { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/.' },
    subdivisionType: 'Region / Department',
    subdivisions: ['Lima', 'Arequipa', 'La Libertad', 'Piura', 'Cusco', 'Lambayeque', 'Junín', 'Áncash', 'Callao', 'Ica', 'San Martín'],
    popularCities: ['Lima', 'Arequipa', 'Trujillo', 'Chiclayo', 'Piura', 'Cusco', 'Iquitos']
  },

  // 3. EUROPE
  {
    name: 'United Kingdom',
    code: 'GB',
    code3: 'GBR',
    flag: '🇬🇧',
    dialCode: '+44',
    region: 'Europe',
    currency: { code: 'GBP', name: 'British Pound', symbol: '£' },
    subdivisionType: 'Region / Country',
    subdivisions: [
      'Greater London', 'Scotland', 'Wales', 'Northern Ireland', 'West Midlands',
      'North West England', 'Yorkshire and the Humber', 'South East England',
      'East of England', 'South West England', 'East Midlands', 'North East England'
    ],
    subdivisionItems: [
      { name: 'Greater London', code: 'GB-LND', cities: ['London City', 'Westminster', 'Camden', 'Greenwich', 'Kensington', 'Islington'] },
      { name: 'Scotland', code: 'GB-SCT', cities: ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee', 'Inverness'] },
      { name: 'Wales', code: 'GB-WLS', cities: ['Cardiff', 'Swansea', 'Newport', 'Wrexham'] },
      { name: 'Northern Ireland', code: 'GB-NIR', cities: ['Belfast', 'Derry', 'Lisburn', 'Newry'] },
      { name: 'West Midlands', code: 'GB-WMD', cities: ['Birmingham', 'Coventry', 'Wolverhampton'] },
      { name: 'North West England', code: 'GB-NWE', cities: ['Manchester', 'Liverpool', 'Preston', 'Bolton'] }
    ],
    popularCities: ['London', 'Manchester', 'Birmingham', 'Edinburgh', 'Glasgow', 'Liverpool', 'Bristol', 'Leeds'],
    businessRegName: 'Companies House CRN (Company Registration No.)',
    taxIdName: 'HMRC UTR / VAT Registration Number',
    idDocTypes: [
      { value: 'passport', label: 'British International Passport' },
      { value: 'drivers_license', label: 'UK Photocard Driving Licence' },
      { value: 'business_cert', label: 'Companies House Certificate of Incorporation' }
    ]
  },
  {
    name: 'Germany',
    code: 'DE',
    code3: 'DEU',
    flag: '🇩🇪',
    dialCode: '+49',
    region: 'Europe',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    subdivisionType: 'Federal State (Bundesland)',
    subdivisions: [
      'Bavaria (Bayern)', 'North Rhine-Westphalia (NRW)', 'Baden-Württemberg', 'Berlin',
      'Hesse (Hessen)', 'Lower Saxony (Niedersachsen)', 'Saxony (Sachsen)', 'Hamburg',
      'Rhineland-Palatinate', 'Schleswig-Holstein', 'Brandenburg', 'Thuringia',
      'Saxony-Anhalt', 'Mecklenburg-Vorpommern', 'Saarland', 'Bremen'
    ],
    popularCities: ['Berlin', 'Munich (München)', 'Frankfurt', 'Hamburg', 'Cologne (Köln)', 'Stuttgart', 'Düsseldorf', 'Leipzig'],
    businessRegName: 'Handelsregister (HRB/HRA Number)',
    taxIdName: 'Steuernummer / USt-IdNr. (VAT ID)'
  },
  {
    name: 'France',
    code: 'FR',
    code3: 'FRA',
    flag: '🇫🇷',
    dialCode: '+33',
    region: 'Europe',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    subdivisionType: 'Region / Department',
    subdivisions: [
      'Île-de-France', 'Auvergne-Rhône-Alpes', 'Nouvelle-Aquitaine', 'Occitanie',
      'Hauts-de-France', "Provence-Alpes-Côte d'Azur", 'Grand Est', 'Pays de la Loire',
      'Brittany (Bretagne)', 'Normandy (Normandie)', 'Bourgogne-Franche-Comté', 'Centre-Val de Loire', 'Corsica'
    ],
    popularCities: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Bordeaux', 'Lille'],
    businessRegName: 'SIREN / SIRET Number (RCS)',
    taxIdName: 'Numéro de TVA Intracommunautaire'
  },
  {
    name: 'Italy',
    code: 'IT',
    code3: 'ITA',
    flag: '🇮🇹',
    dialCode: '+39',
    region: 'Europe',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    subdivisionType: 'Region',
    subdivisions: ['Lombardy', 'Lazio', 'Campania', 'Veneto', 'Sicily', 'Piedmont', 'Emilia-Romagna', 'Tuscany', 'Apulia', 'Calabria', 'Sardinia', 'Liguria', 'Marche'],
    popularCities: ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence', 'Venice']
  },
  {
    name: 'Spain',
    code: 'ES',
    code3: 'ESP',
    flag: '🇪🇸',
    dialCode: '+34',
    region: 'Europe',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    subdivisionType: 'Autonomous Community',
    subdivisions: ['Madrid', 'Catalonia', 'Andalusia', 'Valencian Community', 'Galicia', 'Castile and León', 'Basque Country', 'Canary Islands', 'Castilla-La Mancha', 'Murcia', 'Aragon', 'Balearic Islands'],
    popularCities: ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Málaga', 'Murcia', 'Palma', 'Bilbao']
  },
  {
    name: 'Netherlands',
    code: 'NL',
    code3: 'NLD',
    flag: '🇳🇱',
    dialCode: '+31',
    region: 'Europe',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    subdivisionType: 'Province',
    subdivisions: ['North Holland', 'South Holland', 'Utrecht', 'North Brabant', 'Gelderland', 'Overijssel', 'Limburg', 'Friesland', 'Groningen', 'Drenthe', 'Zeeland', 'Flevoland'],
    popularCities: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Groningen', 'Tilburg']
  },
  {
    name: 'Switzerland',
    code: 'CH',
    code3: 'CHE',
    flag: '🇨🇭',
    dialCode: '+41',
    region: 'Europe',
    currency: { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    subdivisionType: 'Canton',
    subdivisions: ['Zurich', 'Bern', 'Vaud', 'Geneva', 'Aargau', 'St. Gallen', 'Lucerne', 'Ticino', 'Valais', 'Basel-Stadt'],
    popularCities: ['Zurich', 'Geneva', 'Basel', 'Lausanne', 'Bern', 'Winterthur', 'Lucerne', 'St. Gallen']
  },
  {
    name: 'Sweden',
    code: 'SE',
    code3: 'SWE',
    flag: '🇸🇪',
    dialCode: '+46',
    region: 'Europe',
    currency: { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
    subdivisionType: 'County (Län)',
    subdivisions: ['Stockholm', 'Västra Götaland', 'Skåne', 'Östergötland', 'Uppsala', 'Jönköping', 'Halland', 'Örebro', 'Dalarna', 'Västerbotten'],
    popularCities: ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Västerås', 'Örebro', 'Linköping', 'Helsingborg']
  },
  {
    name: 'Poland',
    code: 'PL',
    code3: 'POL',
    flag: '🇵🇱',
    dialCode: '+48',
    region: 'Europe',
    currency: { code: 'PLN', name: 'Polish Złoty', symbol: 'zł' },
    subdivisionType: 'Voivodeship (Province)',
    subdivisions: ['Masovian (Mazowieckie)', 'Silesian (Śląskie)', 'Greater Poland (Wielkopolskie)', 'Lesser Poland (Małopolskie)', 'Lower Silesian (Dolnośląskie)', 'Łódź', 'Pomeranian (Pomorskie)', 'Kuyavian-Pomeranian'],
    popularCities: ['Warsaw', 'Kraków', 'Łódź', 'Wrocław', 'Poznań', 'Gdańsk', 'Szczecin', 'Bydgoszcz']
  },
  {
    name: 'Belgium',
    code: 'BE',
    code3: 'BEL',
    flag: '🇧🇪',
    dialCode: '+32',
    region: 'Europe',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    subdivisionType: 'Region / Province',
    subdivisions: ['Brussels-Capital', 'Flanders (Antwerp)', 'Flanders (East Flanders)', 'Flanders (West Flanders)', 'Flanders (Flemish Brabant)', 'Flanders (Limburg)', 'Wallonia (Hainaut)', 'Wallonia (Liège)', 'Wallonia (Walloon Brabant)', 'Wallonia (Namur)', 'Wallonia (Luxembourg)'],
    popularCities: ['Brussels', 'Antwerp', 'Ghent', 'Charleroi', 'Liège', 'Bruges', 'Namur', 'Leuven']
  },
  {
    name: 'Austria',
    code: 'AT',
    code3: 'AUT',
    flag: '🇦🇹',
    dialCode: '+43',
    region: 'Europe',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    subdivisionType: 'Federal State (Bundesland)',
    subdivisions: ['Vienna (Wien)', 'Lower Austria', 'Upper Austria', 'Styria (Steiermark)', 'Tyrol (Tirol)', 'Carinthia (Kärnten)', 'Salzburg', 'Vorarlberg', 'Burgenland'],
    popularCities: ['Vienna', 'Graz', 'Linz', 'Salzburg', 'Innsbruck', 'Klagenfurt', 'Villach']
  },
  {
    name: 'Norway',
    code: 'NO',
    code3: 'NOR',
    flag: '🇳🇴',
    dialCode: '+47',
    region: 'Europe',
    currency: { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
    subdivisionType: 'County (Fylke)',
    subdivisions: ['Oslo', 'Viken', 'Vestland', 'Rogaland', 'Trøndelag', 'Innlandet', 'Agder', 'Vestfold og Telemark', 'Nordland', 'Troms og Finnmark', 'Møre og Romsdal'],
    popularCities: ['Oslo', 'Bergen', 'Trondheim', 'Stavanger', 'Bærum', 'Kristiansand', 'Drammen', 'Tromsø']
  },
  {
    name: 'Denmark',
    code: 'DK',
    code3: 'DNK',
    flag: '🇩🇰',
    dialCode: '+45',
    region: 'Europe',
    currency: { code: 'DKK', name: 'Danish Krone', symbol: 'kr.' },
    subdivisionType: 'Region',
    subdivisions: ['Capital Region (Hovedstaden)', 'Central Denmark (Midtjylland)', 'Southern Denmark (Syddanmark)', 'Zealand (Sjælland)', 'North Denmark (Nordjylland)'],
    popularCities: ['Copenhagen', 'Aarhus', 'Odense', 'Aalborg', 'Frederiksberg', 'Esbjerg', 'Randers']
  },
  {
    name: 'Finland',
    code: 'FI',
    code3: 'FIN',
    flag: '🇫🇮',
    dialCode: '+358',
    region: 'Europe',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    subdivisionType: 'Region',
    subdivisions: ['Uusimaa', 'Pirkanmaa', 'Southwest Finland', 'North Ostrobothnia', 'Central Finland', 'Lapland', 'Satakunta', 'Pohjois-Savo'],
    popularCities: ['Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Oulu', 'Turku', 'Jyväskylä', 'Lahti']
  },
  {
    name: 'Ireland',
    code: 'IE',
    code3: 'IRL',
    flag: '🇮🇪',
    dialCode: '+353',
    region: 'Europe',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    subdivisionType: 'County / Province',
    subdivisions: ['Dublin', 'Cork', 'Galway', 'Limerick', 'Waterford', 'Kildare', 'Meath', 'Wicklow', 'Louth', 'Donegal', 'Kerry', 'Tipperary'],
    popularCities: ['Dublin', 'Cork', 'Limerick', 'Galway', 'Waterford', 'Drogheda', 'Dundalk', 'Swords']
  },
  {
    name: 'Portugal',
    code: 'PT',
    code3: 'PRT',
    flag: '🇵🇹',
    dialCode: '+351',
    region: 'Europe',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    subdivisionType: 'District / Autonomous Region',
    subdivisions: ['Lisbon', 'Porto', 'Braga', 'Setúbal', 'Aveiro', 'Faro (Algarve)', 'Leiria', 'Coimbra', 'Santarém', 'Madeira', 'Azores'],
    popularCities: ['Lisbon', 'Porto', 'Vila Nova de Gaia', 'Amadora', 'Braga', 'Funchal', 'Coimbra', 'Setúbal']
  },
  {
    name: 'Greece',
    code: 'GR',
    code3: 'GRC',
    flag: '🇬🇷',
    dialCode: '+30',
    region: 'Europe',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    subdivisionType: 'Region / Decentralized Admin',
    subdivisions: ['Attica (Athens)', 'Central Macedonia (Thessaloniki)', 'Crete', 'Western Greece', 'Peloponnese', 'Thessaly', 'South Aegean', 'Epirus', 'Ionian Islands'],
    popularCities: ['Athens', 'Thessaloniki', 'Patras', 'Heraklion', 'Larissa', 'Volos', 'Rhodes', 'Ioannina']
  },

  // 4. MIDDLE EAST
  {
    name: 'United Arab Emirates',
    code: 'AE',
    code3: 'ARE',
    flag: '🇦🇪',
    dialCode: '+971',
    region: 'Middle East',
    currency: { code: 'AED', name: 'UAE Dirham', symbol: 'AED' },
    subdivisionType: 'Emirate',
    subdivisions: [
      'Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'
    ],
    subdivisionItems: [
      { name: 'Dubai', code: 'AE-DU', cities: ['Downtown Dubai', 'Dubai Marina', 'Business Bay', 'Deira', 'Jumeirah', 'Al Barsha'] },
      { name: 'Abu Dhabi', code: 'AE-AZ', cities: ['Abu Dhabi City', 'Al Ain', 'Al Dhafra', 'Yas Island'] },
      { name: 'Sharjah', code: 'AE-SH', cities: ['Sharjah City', 'Khor Fakkan', 'Kalba'] }
    ],
    popularCities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Al Ain', 'Ajman', 'Ras Al Khaimah'],
    businessRegName: 'DED Trade License / Commercial Register Number',
    taxIdName: 'Federal Tax Authority TRN (Tax Registration Number)',
    idDocTypes: [
      { value: 'national_id', label: 'Emirates ID (National ID Card)' },
      { value: 'passport', label: 'UAE / International Passport' },
      { value: 'business_cert', label: 'DED / Free Zone Commercial Trade License' }
    ]
  },
  {
    name: 'Saudi Arabia',
    code: 'SA',
    code3: 'SAU',
    flag: '🇸🇦',
    dialCode: '+966',
    region: 'Middle East',
    currency: { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR' },
    subdivisionType: 'Region / Province',
    subdivisions: [
      'Riyadh', 'Makkah (Mecca)', 'Eastern Province (Sharqiyah)', 'Madinah (Medina)',
      'Asir', 'Tabuk', 'Al-Qassim', 'Hail', 'Jazan', 'Najran', 'Al-Bahah', 'Al-Jowf', 'Northern Borders'
    ],
    subdivisionItems: [
      { name: 'Riyadh', code: 'SA-01', cities: ['Riyadh City', 'Al Kharj', 'Diriyah'] },
      { name: 'Makkah (Mecca)', code: 'SA-02', cities: ['Jeddah', 'Mecca (Makkah)', 'Taif'] },
      { name: 'Eastern Province (Sharqiyah)', code: 'SA-04', cities: ['Dammam', 'Khobar', 'Jubail', 'Dhahran', 'Al Ahsa'] },
      { name: 'Madinah (Medina)', code: 'SA-03', cities: ['Madinah City', 'Yanbu'] }
    ],
    popularCities: ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar', 'Taif', 'Tabuk'],
    businessRegName: 'Commercial Registration (CR / Sijil Tijari)',
    taxIdName: 'ZATCA VAT / Tax Identification Number',
    idDocTypes: [
      { value: 'national_id', label: 'National ID (Hawiyya / Iqama)' },
      { value: 'passport', label: 'Saudi / International Passport' },
      { value: 'business_cert', label: 'Commercial Registration (CR) Certificate' }
    ]
  },
  {
    name: 'Qatar',
    code: 'QA',
    code3: 'QAT',
    flag: '🇶🇦',
    dialCode: '+974',
    region: 'Middle East',
    currency: { code: 'QAR', name: 'Qatari Riyal', symbol: 'QR' },
    subdivisionType: 'Municipality (Baladiyah)',
    subdivisions: ['Doha', 'Al Rayyan', 'Al Wakrah', 'Al Khor', 'Umm Salal', 'Al Daayen', 'Al Shahaniya', 'Al Shamal'],
    popularCities: ['Doha', 'Al Rayyan', 'Al Wakrah', 'Al Khor', 'Lusail', 'Mesaieed'],
    businessRegName: 'Commercial Registration (CR Number)',
    taxIdName: 'General Tax Authority TIN'
  },
  {
    name: 'Kuwait',
    code: 'KW',
    code3: 'KWT',
    flag: '🇰🇼',
    dialCode: '+965',
    region: 'Middle East',
    currency: { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'KD' },
    subdivisionType: 'Governorate',
    subdivisions: ['Capital (Al Asimah)', 'Hawalli', 'Farwaniya', 'Ahmadi', 'Jahra', 'Mubarak Al-Kabeer'],
    popularCities: ['Kuwait City', 'Hawalli', 'Salmiya', 'Al Ahmadi', 'Sabah Al Salem']
  },
  {
    name: 'Oman',
    code: 'OM',
    code3: 'OMN',
    flag: '🇴🇲',
    dialCode: '+968',
    region: 'Middle East',
    currency: { code: 'OMR', name: 'Omani Rial', symbol: 'OMR' },
    subdivisionType: 'Governorate',
    subdivisions: ['Muscat', 'Dhofar', 'Al Batinah North', 'Al Batinah South', 'Al Dakhiliyah', 'Al Sharqiyah North', 'Al Sharqiyah South', 'Al Dhahirah', 'Al Buraimi', 'Musandam', 'Al Wusta'],
    popularCities: ['Muscat', 'Salalah', 'Sohar', 'Nizwa', 'Sur', 'Seeb', 'Bawshar']
  },
  {
    name: 'Bahrain',
    code: 'BH',
    code3: 'BHR',
    flag: '🇧🇭',
    dialCode: '+973',
    region: 'Middle East',
    currency: { code: 'BHD', name: 'Bahraini Dinar', symbol: 'BD' },
    subdivisionType: 'Governorate',
    subdivisions: ['Capital (Manama)', 'Muharraq', 'Northern Governorate', 'Southern Governorate'],
    popularCities: ['Manama', 'Muharraq', 'Riffa', 'Hamad Town', 'A\'ali', 'Isa Town']
  },
  {
    name: 'Jordan',
    code: 'JO',
    code3: 'JOR',
    flag: '🇯🇴',
    dialCode: '+962',
    region: 'Middle East',
    currency: { code: 'JOD', name: 'Jordanian Dinar', symbol: 'JD' },
    subdivisionType: 'Governorate',
    subdivisions: ['Amman', 'Irbid', 'Zarqa', 'Balqa', 'Aqaba', 'Mafraq', 'Jerash', 'Madaba', 'Karak', 'Ajloun', 'Ma\'an', 'Tafilah'],
    popularCities: ['Amman', 'Zarqa', 'Irbid', 'Aqaba', 'Russeifa', 'Wadi As-Sir']
  },
  {
    name: 'Lebanon',
    code: 'LB',
    code3: 'LBN',
    flag: '🇱🇧',
    dialCode: '+961',
    region: 'Middle East',
    currency: { code: 'LBP', name: 'Lebanese Pound', symbol: 'L£' },
    subdivisionType: 'Governorate',
    subdivisions: ['Beirut', 'Mount Lebanon', 'North', 'Akkar', 'South', 'Nabatieh', 'Beqaa', 'Baalbek-Hermel'],
    popularCities: ['Beirut', 'Tripoli', 'Sidon', 'Jounieh', 'Zahle', 'Tyre', 'Byblos']
  },
  {
    name: 'Turkey',
    code: 'TR',
    code3: 'TUR',
    flag: '🇹🇷',
    dialCode: '+90',
    region: 'Middle East',
    currency: { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
    subdivisionType: 'Province (İl)',
    subdivisions: [
      'Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya', 'Adana', 'Konya',
      'Gaziantep', 'Şanlıurfa', 'Kocaeli', 'Mersin', 'Diyarbakır', 'Hatay', 'Manisa', 'Kayseri'
    ],
    popularCities: ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep'],
    businessRegName: 'Ticaret Sicil Numarası (Trade Registry Number)',
    taxIdName: 'Vergi Kimlik Numarası (VKN)'
  },

  // 5. ASIA & PACIFIC
  {
    name: 'India',
    code: 'IN',
    code3: 'IND',
    flag: '🇮🇳',
    dialCode: '+91',
    region: 'Asia',
    currency: { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    subdivisionType: 'State / Union Territory',
    subdivisions: [
      'Maharashtra', 'Delhi (NCT)', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal',
      'Gujarat', 'Telangana', 'Kerala', 'Rajasthan', 'Punjab', 'Haryana', 'Madhya Pradesh',
      'Bihar', 'Odisha', 'Andhra Pradesh', 'Assam', 'Jharkhand', 'Chhattisgarh', 'Uttarakhand',
      'Goa', 'Himachal Pradesh', 'Jammu & Kashmir'
    ],
    subdivisionItems: [
      { name: 'Maharashtra', code: 'IN-MH', cities: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik'] },
      { name: 'Delhi (NCT)', code: 'IN-DL', cities: ['New Delhi', 'Central Delhi', 'South Delhi', 'Dwarka', 'Noida'] },
      { name: 'Karnataka', code: 'IN-KA', cities: ['Bengaluru (Bangalore)', 'Mysuru', 'Mangaluru', 'Hubballi'] },
      { name: 'Tamil Nadu', code: 'IN-TN', cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli'] },
      { name: 'Telangana', code: 'IN-TG', cities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'] }
    ],
    popularCities: ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'],
    businessRegName: 'CIN / LLPIN / Udyam MSME Registration',
    taxIdName: 'GSTIN / PAN Number',
    idDocTypes: [
      { value: 'national_id', label: 'Aadhaar Card (UIDAI)' },
      { value: 'pan_card', label: 'PAN Card (Permanent Account Number)' },
      { value: 'passport', label: 'Indian Passport' },
      { value: 'business_cert', label: 'Certificate of Incorporation / GSTIN Certificate' }
    ]
  },
  {
    name: 'China',
    code: 'CN',
    code3: 'CHN',
    flag: '🇨🇳',
    dialCode: '+86',
    region: 'Asia',
    currency: { code: 'CNY', name: 'Chinese Yuan Renminbi', symbol: '¥' },
    subdivisionType: 'Province / Municipality',
    subdivisions: [
      'Guangdong', 'Beijing', 'Shanghai', 'Zhejiang', 'Jiangsu', 'Shandong', 'Sichuan',
      'Henan', 'Hebei', 'Hunan', 'Hubei', 'Fujian', 'Chongqing', 'Tianjin', 'Shaanxi',
      'Anhui', 'Liaoning', 'Yunnan', 'Guangxi', 'Hong Kong SAR', 'Macau SAR'
    ],
    popularCities: ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Hangzhou', 'Wuhan', 'Chongqing', 'Nanjing'],
    businessRegName: 'Unified Social Credit Code (USCC / 统一社会信用代码)',
    taxIdName: 'State Taxation Admin Tax ID (税务登记号)'
  },
  {
    name: 'Japan',
    code: 'JP',
    code3: 'JPN',
    flag: '🇯🇵',
    dialCode: '+81',
    region: 'Asia',
    currency: { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    subdivisionType: 'Prefecture',
    subdivisions: [
      'Tokyo', 'Osaka', 'Kanagawa', 'Aichi', 'Hokkaido', 'Fukuoka', 'Hyogo',
      'Chiba', 'Saitama', 'Shizuoka', 'Kyoto', 'Hiroshima', 'Miyagi', 'Niigata'
    ],
    popularCities: ['Tokyo', 'Osaka', 'Yokohama', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe', 'Kyoto', 'Kawasaki', 'Saitama'],
    businessRegName: 'Corporate Number (法人番号 / Hojin Bango)',
    taxIdName: 'National Tax Agency Qualified Invoice Issuer ID'
  },
  {
    name: 'South Korea',
    code: 'KR',
    code3: 'KOR',
    flag: '🇰🇷',
    dialCode: '+82',
    region: 'Asia',
    currency: { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
    subdivisionType: 'Province / Metropolitan City',
    subdivisions: ['Seoul', 'Gyeonggi-do', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Ulsan', 'Gyeongsangnam-do', 'Chungcheongnam-do', 'Jeollanam-do', 'Jeju-do'],
    popularCities: ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Suwon', 'Ulsan', 'Changwon'],
    businessRegName: 'Business Registration Certificate (사업자등록증)',
    taxIdName: 'National Tax Service BRN Number'
  },
  {
    name: 'Philippines',
    code: 'PH',
    code3: 'PHL',
    flag: '🇵🇭',
    dialCode: '+63',
    region: 'Asia',
    currency: { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
    subdivisionType: 'Region / Province',
    subdivisions: [
      'Metro Manila (NCR)', 'Calabarzon (Region IV-A)', 'Central Luzon (Region III)',
      'Central Visayas (Region VII)', 'Western Visayas (Region VI)', 'Davao Region (Region XI)',
      'Ilocos Region (Region I)', 'Northern Mindanao (Region X)', 'Bicol Region (Region V)'
    ],
    popularCities: ['Manila', 'Quezon City', 'Makati', 'Cebu City', 'Davao City', 'Taguig', 'Pasig', 'Cagayan de Oro'],
    businessRegName: 'DTI Registration / SEC Certificate Number',
    taxIdName: 'BIR Taxpayer Identification Number (TIN)'
  },
  {
    name: 'Indonesia',
    code: 'ID',
    code3: 'IDN',
    flag: '🇮🇩',
    dialCode: '+62',
    region: 'Asia',
    currency: { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
    subdivisionType: 'Province',
    subdivisions: [
      'Jakarta (DKI)', 'West Java (Jawa Barat)', 'East Java (Jawa Timur)', 'Central Java (Jawa Tengah)',
      'Banten', 'North Sumatra (Sumatera Utara)', 'Bali', 'Riau', 'South Sulawesi (Sulawesi Selatan)', 'Yogyakarta'
    ],
    popularCities: ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Tangerang', 'Depok', 'Bekasi', 'Denpasar (Bali)'],
    businessRegName: 'Nomor Induk Berusaha (NIB / OSS)',
    taxIdName: 'Nomor Pokok Wajib Pajak (NPWP)'
  },
  {
    name: 'Vietnam',
    code: 'VN',
    code3: 'VNM',
    flag: '🇻🇳',
    dialCode: '+84',
    region: 'Asia',
    currency: { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
    subdivisionType: 'Province / Municipality',
    subdivisions: [
      'Hanoi', 'Ho Chi Minh City', 'Da Nang', 'Hai Phong', 'Can Tho', 'Binh Duong',
      'Dong Nai', 'Khanh Hoa (Nha Trang)', 'Quang Ninh', 'Ba Ria - Vung Tau', 'Thua Thien Hue'
    ],
    popularCities: ['Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Hai Phong', 'Can Tho', 'Bien Hoa', 'Nha Trang', 'Hue'],
    businessRegName: 'Enterprise Code / Business Registration Certificate (Mã số doanh nghiệp)',
    taxIdName: 'Tax Identification Number (Mã số thuế - MST)'
  },
  {
    name: 'Thailand',
    code: 'TH',
    code3: 'THA',
    flag: '🇹🇭',
    dialCode: '+66',
    region: 'Asia',
    currency: { code: 'THB', name: 'Thai Baht', symbol: '฿' },
    subdivisionType: 'Province',
    subdivisions: ['Bangkok (Krung Thep)', 'Chiang Mai', 'Phuket', 'Chonburi (Pattaya)', 'Nonthaburi', 'Samut Prakan', 'Pathum Thani', 'Nakhon Ratchasima', 'Khon Kaen', 'Songkhla'],
    popularCities: ['Bangkok', 'Chiang Mai', 'Pattaya', 'Phuket', 'Nonthaburi', 'Hat Yai', 'Udon Thani', 'Nakhon Ratchasima'],
    businessRegName: 'Department of Business Development (DBD ID)',
    taxIdName: 'Revenue Department Tax ID (TIN)'
  },
  {
    name: 'Malaysia',
    code: 'MY',
    code3: 'MYS',
    flag: '🇲🇾',
    dialCode: '+60',
    region: 'Asia',
    currency: { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
    subdivisionType: 'State / Federal Territory',
    subdivisions: ['Kuala Lumpur', 'Selangor', 'Penang (Pulau Pinang)', 'Johor', 'Sarawak', 'Sabah', 'Perak', 'Melaka', 'Pahang', 'Negeri Sembilan', 'Kedah', 'Kelantan', 'Terengganu', 'Putrajaya'],
    popularCities: ['Kuala Lumpur', 'George Town (Penang)', 'Johor Bahru', 'Petaling Jaya', 'Shah Alam', 'Kuching', 'Kota Kinabalu', 'Ipoh', 'Melaka'],
    businessRegName: 'SSM Company Registration Number (Suruhanjaya Syarikat Malaysia)',
    taxIdName: 'LHDN Income Tax / SST Number'
  },
  {
    name: 'Singapore',
    code: 'SG',
    code3: 'SGP',
    flag: '🇸🇬',
    dialCode: '+65',
    region: 'Asia',
    currency: { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    subdivisionType: 'Region / District',
    subdivisions: ['Central Region', 'East Region', 'North Region', 'North-East Region', 'West Region'],
    popularCities: ['Singapore', 'Jurong', 'Tampines', 'Woodlands', 'Orchard', 'Marina Bay', 'Changi'],
    businessRegName: 'ACRA Unique Entity Number (UEN)',
    taxIdName: 'IRAS Tax Reference / GST Registration Number'
  },
  {
    name: 'Pakistan',
    code: 'PK',
    code3: 'PAK',
    flag: '🇵🇰',
    dialCode: '+92',
    region: 'Asia',
    currency: { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨' },
    subdivisionType: 'Province',
    subdivisions: ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Islamabad Capital Territory', 'Gilgit-Baltistan', 'Azad Jammu & Kashmir'],
    popularCities: ['Karachi', 'Lahore', 'Faisalabad', 'Rawalpindi', 'Islamabad', 'Multan', 'Peshawar', 'Quetta', 'Sialkot'],
    businessRegName: 'SECP Company Registration',
    taxIdName: 'FBR National Tax Number (NTN)'
  },
  {
    name: 'Bangladesh',
    code: 'BD',
    code3: 'BGD',
    flag: '🇧🇩',
    dialCode: '+880',
    region: 'Asia',
    currency: { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳' },
    subdivisionType: 'Division',
    subdivisions: ['Dhaka', 'Chattogram (Chittagong)', 'Rajshahi', 'Khulna', 'Sylhet', 'Barishal', 'Rangpur', 'Mymensingh'],
    popularCities: ['Dhaka', 'Chittagong', 'Khulna', 'Rajshahi', 'Sylhet', 'Bogura', 'Comilla', 'Barisal'],
    businessRegName: 'RJSC Registration Certificate',
    taxIdName: 'NBR Electronic Tax Identification Number (e-TIN)'
  },
  {
    name: 'Sri Lanka',
    code: 'LK',
    code3: 'LKA',
    flag: '🇱🇰',
    dialCode: '+94',
    region: 'Asia',
    currency: { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs' },
    subdivisionType: 'Province',
    subdivisions: ['Western Province', 'Central Province', 'Southern Province', 'Northern Province', 'Eastern Province', 'North Western Province', 'North Central Province', 'Uva Province', 'Sabaragamuwa Province'],
    popularCities: ['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo', 'Batticaloa', 'Matara']
  },
  {
    name: 'Nepal',
    code: 'NP',
    code3: 'NPL',
    flag: '🇳🇵',
    dialCode: '+977',
    region: 'Asia',
    currency: { code: 'NPR', name: 'Nepalese Rupee', symbol: 'रू' },
    subdivisionType: 'Province',
    subdivisions: ['Bagmati (Kathmandu)', 'Gandaki (Pokhara)', 'Koshi', 'Madhesh', 'Lumbini', 'Karnali', 'Sudurpashchim'],
    popularCities: ['Kathmandu', 'Pokhara', 'Lalitpur', 'Biratnagar', 'Bharatpur', 'Birgunj', 'Dharan']
  },
  {
    name: 'Taiwan',
    code: 'TW',
    code3: 'TWN',
    flag: '🇹🇼',
    dialCode: '+886',
    region: 'Asia',
    currency: { code: 'TWD', name: 'New Taiwan Dollar', symbol: 'NT$' },
    subdivisionType: 'Special Municipality / County',
    subdivisions: ['Taipei City', 'New Taipei City', 'Taichung City', 'Kaohsiung City', 'Taoyuan City', 'Tainan City', 'Hsinchu City', 'Keelung City', 'Changhua County'],
    popularCities: ['Taipei', 'Kaohsiung', 'Taichung', 'Tainan', 'Taoyuan', 'Hsinchu', 'Keelung'],
    businessRegName: 'Unified Business Number (UBN / 統一編號)',
    taxIdName: 'Ministry of Finance Tax ID'
  },
  {
    name: 'Hong Kong SAR',
    code: 'HK',
    code3: 'HKG',
    flag: '🇭🇰',
    dialCode: '+852',
    region: 'Asia',
    currency: { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
    subdivisionType: 'District',
    subdivisions: ['Central and Western', 'Wan Chai', 'Eastern', 'Southern', 'Yau Tsim Mong (Kowloon)', 'Sham Shui Po', 'Kowloon City', 'Kwun Tong', 'Sha Tin', 'Tsuen Wan', 'Tuen Mun', 'Sai Kung'],
    popularCities: ['Hong Kong Island', 'Kowloon', 'Tsim Sha Tsui', 'Mong Kok', 'Central', 'Sha Tin', 'Tsuen Wan'],
    businessRegName: 'Companies Registry CR Number',
    taxIdName: 'Inland Revenue Dept BRN (Business Registration No.)'
  },

  // 6. OCEANIA
  {
    name: 'Australia',
    code: 'AU',
    code3: 'AUS',
    flag: '🇦🇺',
    dialCode: '+61',
    region: 'Oceania',
    currency: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    subdivisionType: 'State / Territory',
    subdivisions: [
      'New South Wales (NSW)', 'Victoria (VIC)', 'Queensland (QLD)', 'Western Australia (WA)',
      'South Australia (SA)', 'Tasmania (TAS)', 'Australian Capital Territory (ACT)', 'Northern Territory (NT)'
    ],
    subdivisionItems: [
      { name: 'New South Wales', code: 'AU-NSW', cities: ['Sydney', 'Newcastle', 'Wollongong', 'Central Coast'] },
      { name: 'Victoria', code: 'AU-VIC', cities: ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo'] },
      { name: 'Queensland', code: 'AU-QLD', cities: ['Brisbane', 'Gold Coast', 'Sunshine Coast', 'Cairns', 'Townsville'] },
      { name: 'Western Australia', code: 'AU-WA', cities: ['Perth', 'Fremantle', 'Mandurah', 'Bunbury'] }
    ],
    popularCities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Canberra', 'Hobart'],
    businessRegName: 'Australian Business Number (ABN / ACN)',
    taxIdName: 'ATO Tax File Number (TFN) / GST Number',
    idDocTypes: [
      { value: 'drivers_license', label: "Australian State Driver's Licence" },
      { value: 'passport', label: 'Australian Passport' },
      { value: 'business_cert', label: 'ASIC Certificate of Registration / ABN Verification' }
    ]
  },
  {
    name: 'New Zealand',
    code: 'NZ',
    code3: 'NZL',
    flag: '🇳🇿',
    dialCode: '+64',
    region: 'Oceania',
    currency: { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
    subdivisionType: 'Region',
    subdivisions: ['Auckland', 'Canterbury (Christchurch)', 'Wellington', 'Waikato', 'Bay of Plenty', 'Manawatu-Wanganui', 'Otago', 'Hawke\'s Bay', 'Taranaki', 'Northland', 'Southland', 'Nelson-Tasman'],
    popularCities: ['Auckland', 'Wellington', 'Christchurch', 'Hamilton', 'Tauranga', 'Dunedin', 'Palmerston North'],
    businessRegName: 'New Zealand Companies Office (NZBN)',
    taxIdName: 'Inland Revenue IRD Number'
  },
  {
    name: 'Papua New Guinea',
    code: 'PG',
    code3: 'PNG',
    flag: '🇵🇬',
    dialCode: '+675',
    region: 'Oceania',
    currency: { code: 'PGK', name: 'Papua New Guinean Kina', symbol: 'K' },
    subdivisionType: 'Province',
    subdivisions: ['National Capital District (Port Moresby)', 'Morobe (Lae)', 'Eastern Highlands', 'Western Highlands', 'Madang', 'East New Britain', 'Autonomous Region of Bougainville'],
    popularCities: ['Port Moresby', 'Lae', 'Mount Hagen', 'Madang', 'Goroka', 'Kokopo']
  },
  {
    name: 'Fiji',
    code: 'FJ',
    code3: 'FJI',
    flag: '🇫🇯',
    dialCode: '+679',
    region: 'Oceania',
    currency: { code: 'FJD', name: 'Fijian Dollar', symbol: 'FJ$' },
    subdivisionType: 'Division',
    subdivisions: ['Central (Suva)', 'Western (Lautoka/Nadi)', 'Northern (Labasa)', 'Eastern'],
    popularCities: ['Suva', 'Lautoka', 'Nadi', 'Labasa', 'Nausori']
  },

  // 7. ADDITIONAL GLOBAL COUNTRIES & TERRITORIES (COMPLETE GLOBAL COVERAGE)
  { name: 'Afghanistan', code: 'AF', code3: 'AFG', flag: '🇦🇫', dialCode: '+93', region: 'Asia', currency: { code: 'AFN', name: 'Afghan Afghani', symbol: '؋' }, subdivisionType: 'Province', subdivisions: ['Kabul', 'Herat', 'Kandahar', 'Balkh', 'Nangarhar'] },
  { name: 'Albania', code: 'AL', code3: 'ALB', flag: '🇦🇱', dialCode: '+355', region: 'Europe', currency: { code: 'ALL', name: 'Albanian Lek', symbol: 'L' }, subdivisionType: 'County', subdivisions: ['Tirana', 'Durrës', 'Vlorë', 'Shkodër', 'Fier'] },
  { name: 'Andorra', code: 'AD', code3: 'AND', flag: '🇦🇩', dialCode: '+376', region: 'Europe', currency: { code: 'EUR', name: 'Euro', symbol: '€' }, subdivisionType: 'Parish', subdivisions: ['Andorra la Vella', 'Escaldes-Engordany', 'Encamp', 'Sant Julià de Lòria'] },
  { name: 'Armenia', code: 'AM', code3: 'ARM', flag: '🇦🇲', dialCode: '+374', region: 'Asia', currency: { code: 'AMD', name: 'Armenian Dram', symbol: '֏' }, subdivisionType: 'Province', subdivisions: ['Yerevan', 'Shirak', 'Lori', 'Kotayk', 'Ararat'] },
  { name: 'Azerbaijan', code: 'AZ', code3: 'AZE', flag: '🇦🇿', dialCode: '+994', region: 'Asia', currency: { code: 'AZN', name: 'Azerbaijani Manat', symbol: '₼' }, subdivisionType: 'Economic Region / Rayon', subdivisions: ['Baku', 'Absheron', 'Ganja-Dashkasan', 'Shaki-Zaqatala'] },
  { name: 'Bahamas', code: 'BS', code3: 'BHS', flag: '🇧🇸', dialCode: '+1-242', region: 'Americas', currency: { code: 'BSD', name: 'Bahamian Dollar', symbol: 'B$' }, subdivisionType: 'District', subdivisions: ['New Providence (Nassau)', 'Grand Bahama (Freeport)', 'Abaco', 'Eleuthera'] },
  { name: 'Barbados', code: 'BB', code3: 'BRB', flag: '🇧🇧', dialCode: '+1-246', region: 'Americas', currency: { code: 'BBD', name: 'Barbadian Dollar', symbol: 'Bds$' }, subdivisionType: 'Parish', subdivisions: ['Saint Michael (Bridgetown)', 'Christ Church', 'Saint James', 'Saint Philip'] },
  { name: 'Belarus', code: 'BY', code3: 'BLR', flag: '🇧🇾', dialCode: '+375', region: 'Europe', currency: { code: 'BYN', name: 'Belarusian Ruble', symbol: 'Br' }, subdivisionType: 'Region (Oblast)', subdivisions: ['Minsk City', 'Minsk Region', 'Brest', 'Gomel', 'Grodno', 'Mogilev', 'Vitebsk'] },
  { name: 'Belize', code: 'BZ', code3: 'BLZ', flag: '🇧🇿', dialCode: '+501', region: 'Americas', currency: { code: 'BZD', name: 'Belize Dollar', symbol: 'BZ$' }, subdivisionType: 'District', subdivisions: ['Belize District', 'Cayo (Belmopan)', 'Orange Walk', 'Corozal', 'Stann Creek'] },
  { name: 'Benin', code: 'BJ', code3: 'BEN', flag: '🇧🇯', dialCode: '+229', region: 'Africa', currency: { code: 'XOF', name: 'West African CFA Franc', symbol: 'CFA' }, subdivisionType: 'Department', subdivisions: ['Littoral (Cotonou)', 'Atlantique', 'Ouémé (Porto-Novo)', 'Borgou', 'Zou', 'Collines'] },
  { name: 'Bermuda', code: 'BM', code3: 'BMU', flag: '🇧🇲', dialCode: '+1-441', region: 'Americas', currency: { code: 'BMD', name: 'Bermudian Dollar', symbol: '$' }, subdivisionType: 'Parish', subdivisions: ['Hamilton', 'Saint George', 'Pembroke', 'Paget', 'Warwick'] },
  { name: 'Bhutan', code: 'BT', code3: 'BTN', flag: '🇧🇹', dialCode: '+975', region: 'Asia', currency: { code: 'BTN', name: 'Bhutanese Ngultrum', symbol: 'Nu.' }, subdivisionType: 'District (Dzongkhag)', subdivisions: ['Thimphu', 'Chukha (Phuntsholing)', 'Paro', 'Punakha', 'Samdrup Jongkhar'] },
  { name: 'Bolivia', code: 'BO', code3: 'BOL', flag: '🇧🇴', dialCode: '+591', region: 'Americas', currency: { code: 'BOB', name: 'Bolivian Boliviano', symbol: 'Bs.' }, subdivisionType: 'Department', subdivisions: ['Santa Cruz', 'La Paz', 'Cochabamba', 'Chuquisaca (Sucre)', 'Oruro', 'Tarija', 'Potosí'] },
  { name: 'Bosnia and Herzegovina', code: 'BA', code3: 'BIH', flag: '🇧🇦', dialCode: '+387', region: 'Europe', currency: { code: 'BAM', name: 'Convertible Mark', symbol: 'KM' }, subdivisionType: 'Entity / Canton', subdivisions: ['Sarajevo Canton', 'Tuzla Canton', 'Zenica-Doboj', 'Republika Srpska (Banja Luka)', 'Herzegovina-Neretva'] },
  { name: 'Brunei', code: 'BN', code3: 'BRN', flag: '🇧🇳', dialCode: '+673', region: 'Asia', currency: { code: 'BND', name: 'Brunei Dollar', symbol: 'B$' }, subdivisionType: 'District (Daerah)', subdivisions: ['Brunei-Muara (Bandar Seri Begawan)', 'Belait', 'Tutong', 'Temburong'] },
  { name: 'Bulgaria', code: 'BG', code3: 'BGR', flag: '🇧🇬', dialCode: '+359', region: 'Europe', currency: { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв' }, subdivisionType: 'Province (Oblast)', subdivisions: ['Sofia City', 'Plovdiv', 'Varna', 'Burgas', 'Ruse', 'Stara Zagora', 'Pleven'] },
  { name: 'Burkina Faso', code: 'BF', code3: 'BFA', flag: '🇧🇫', dialCode: '+226', region: 'Africa', currency: { code: 'XOF', name: 'West African CFA Franc', symbol: 'CFA' }, subdivisionType: 'Region', subdivisions: ['Centre (Ouagadougou)', 'Hauts-Bassins (Bobo-Dioulasso)', 'Centre-Ouest', 'Boucle du Mouhoun'] },
  { name: 'Burundi', code: 'BI', code3: 'BDI', flag: '🇧🇮', dialCode: '+257', region: 'Africa', currency: { code: 'BIF', name: 'Burundian Franc', symbol: 'FBu' }, subdivisionType: 'Province', subdivisions: ['Bujumbura Mairie', 'Gitega', 'Ngozi', 'Muyinga', 'Bubanza'] },
  { name: 'Cambodia', code: 'KH', code3: 'KHM', flag: '🇰🇭', dialCode: '+855', region: 'Asia', currency: { code: 'KHR', name: 'Cambodian Riel', symbol: '៛' }, subdivisionType: 'Province / Municipality', subdivisions: ['Phnom Penh', 'Siem Reap', 'Battambang', 'Kandal', 'Preah Sihanouk', 'Kampong Cham'] },
  { name: 'Cape Verde (Cabo Verde)', code: 'CV', code3: 'CPV', flag: '🇨🇻', dialCode: '+238', region: 'Africa', currency: { code: 'CVE', name: 'Cape Verdean Escudo', symbol: '$' }, subdivisionType: 'Municipality', subdivisions: ['Praia (Santiago)', 'São Vicente (Mindelo)', 'Sal', 'Boa Vista', 'Santa Catarina'] },
  { name: 'Cayman Islands', code: 'KY', code3: 'CYM', flag: '🇰🇾', dialCode: '+1-345', region: 'Americas', currency: { code: 'KYD', name: 'Cayman Islands Dollar', symbol: '$' }, subdivisionType: 'District', subdivisions: ['George Town', 'West Bay', 'Bodden Town', 'North Side', 'Cayman Brac'] },
  { name: 'Central African Republic', code: 'CF', code3: 'CAF', flag: '🇨🇫', dialCode: '+236', region: 'Africa', currency: { code: 'XAF', name: 'Central African CFA Franc', symbol: 'FCFA' }, subdivisionType: 'Prefecture', subdivisions: ['Bangui', 'Ombella-M\'Poko', 'Ouham', 'Nana-Mambéré', 'Mambéré-Kadéï'] },
  { name: 'Chad', code: 'TD', code3: 'TCD', flag: '🇹🇩', dialCode: '+235', region: 'Africa', currency: { code: 'XAF', name: 'Central African CFA Franc', symbol: 'FCFA' }, subdivisionType: 'Province', subdivisions: ['N\'Djamena', 'Chari-Baguirmi', 'Mayo-Kebbi Est', 'Logone Occidental (Moundou)', 'Ouaddaï'] },
  { name: 'Costa Rica', code: 'CR', code3: 'CRI', flag: '🇨🇷', dialCode: '+506', region: 'Americas', currency: { code: 'CRC', name: 'Costa Rican Colón', symbol: '₡' }, subdivisionType: 'Province', subdivisions: ['San José', 'Alajuela', 'Cartago', 'Heredia', 'Guanacaste', 'Puntarenas', 'Limón'] },
  { name: 'Croatia', code: 'HR', code3: 'HRV', flag: '🇭🇷', dialCode: '+385', region: 'Europe', currency: { code: 'EUR', name: 'Euro', symbol: '€' }, subdivisionType: 'County (Županija)', subdivisions: ['City of Zagreb', 'Split-Dalmatia', 'Primorje-Gorski Kotar (Rijeka)', 'Osijek-Baranja', 'Istria'] },
  { name: 'Cuba', code: 'CU', code3: 'CUB', flag: '🇨🇺', dialCode: '+53', region: 'Americas', currency: { code: 'CUP', name: 'Cuban Peso', symbol: '$' }, subdivisionType: 'Province', subdivisions: ['La Habana', 'Santiago de Cuba', 'Holguín', 'Camagüey', 'Villa Clara (Santa Clara)', 'Matanzas'] },
  { name: 'Cyprus', code: 'CY', code3: 'CYP', flag: '🇨🇾', dialCode: '+357', region: 'Europe', currency: { code: 'EUR', name: 'Euro', symbol: '€' }, subdivisionType: 'District', subdivisions: ['Nicosia', 'Limassol', 'Larnaca', 'Paphos', 'Famagusta'] },
  { name: 'Czech Republic (Czechia)', code: 'CZ', code3: 'CZE', flag: '🇨🇿', dialCode: '+420', region: 'Europe', currency: { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč' }, subdivisionType: 'Region (Kraj)', subdivisions: ['Prague (Praha)', 'Central Bohemian', 'South Moravian (Brno)', 'Moravian-Silesian (Ostrava)', 'Plzeň'] },
  { name: 'Democratic Republic of the Congo', code: 'CD', code3: 'COD', flag: '🇨🇩', dialCode: '+243', region: 'Africa', currency: { code: 'CDF', name: 'Congolese Franc', symbol: 'FC' }, subdivisionType: 'Province', subdivisions: ['Kinshasa', 'Haut-Katanga (Lubumbashi)', 'North Kivu (Goma)', 'South Kivu (Bukavu)', 'Kongo Central', 'Tshopo'] },
  { name: 'Djibouti', code: 'DJ', code3: 'DJI', flag: '🇩🇯', dialCode: '+253', region: 'Africa', currency: { code: 'DJF', name: 'Djiboutian Franc', symbol: 'Fdj' }, subdivisionType: 'Region', subdivisions: ['Djibouti City', 'Ali Sabieh', 'Dikhil', 'Tadjourah', 'Arta', 'Obock'] },
  { name: 'Dominican Republic', code: 'DO', code3: 'DOM', flag: '🇩🇴', dialCode: '+1-809', region: 'Americas', currency: { code: 'DOP', name: 'Dominican Peso', symbol: 'RD$' }, subdivisionType: 'Province', subdivisions: ['Distrito Nacional (Santo Domingo)', 'Santiago', 'Santo Domingo Province', 'La Altagracia (Punta Cana)', 'San Cristóbal'] },
  { name: 'Ecuador', code: 'EC', code3: 'ECU', flag: '🇪🇨', dialCode: '+593', region: 'Americas', currency: { code: 'USD', name: 'US Dollar', symbol: '$' }, subdivisionType: 'Province', subdivisions: ['Guayas (Guayaquil)', 'Pichincha (Quito)', 'Azuay (Cuenca)', 'Manabí (Manta)', 'El Oro', 'Tungurahua'] },
  { name: 'El Salvador', code: 'SV', code3: 'SLV', flag: '🇸🇻', dialCode: '+503', region: 'Americas', currency: { code: 'USD', name: 'US Dollar', symbol: '$' }, subdivisionType: 'Department', subdivisions: ['San Salvador', 'La Libertad (Santa Tecla)', 'Santa Ana', 'San Miguel', 'Sonsonate'] },
  { name: 'Equatorial Guinea', code: 'GQ', code3: 'GNQ', flag: '🇬🇶', dialCode: '+240', region: 'Africa', currency: { code: 'XAF', name: 'Central African CFA Franc', symbol: 'FCFA' }, subdivisionType: 'Province', subdivisions: ['Bioko Norte (Malabo)', 'Litoral (Bata)', 'Wele-Nzas', 'Kié-Ntem', 'Centro Sur'] },
  { name: 'Estonia', code: 'EE', code3: 'EST', flag: '🇪🇪', dialCode: '+372', region: 'Europe', currency: { code: 'EUR', name: 'Euro', symbol: '€' }, subdivisionType: 'County (Maakond)', subdivisions: ['Harju (Tallinn)', 'Tartu', 'Ida-Viru (Narva)', 'Pärnu', 'Lääne-Viru'] },
  { name: 'Gabon', code: 'GA', code3: 'GAB', flag: '🇬🇦', dialCode: '+241', region: 'Africa', currency: { code: 'XAF', name: 'Central African CFA Franc', symbol: 'FCFA' }, subdivisionType: 'Province', subdivisions: ['Estuaire (Libreville)', 'Haut-Ogooué (Franceville)', 'Ogooué-Maritime (Port-Gentil)', 'Woleu-Ntem', 'Ngounié'] },
  { name: 'Gambia', code: 'GM', code3: 'GMB', flag: '🇬🇲', dialCode: '+220', region: 'Africa', currency: { code: 'GMD', name: 'Gambian Dalasi', symbol: 'D' }, subdivisionType: 'Division / Region', subdivisions: ['Banjul', 'Kanifing (Serekunda)', 'West Coast (Brikama)', 'North Bank', 'Central River'] },
  { name: 'Georgia', code: 'GE', code3: 'GEO', flag: '🇬🇪', dialCode: '+995', region: 'Asia', currency: { code: 'GEL', name: 'Georgian Lari', symbol: '₾' }, subdivisionType: 'Region / Autonomous Republic', subdivisions: ['Tbilisi', 'Adjara (Batumi)', 'Imereti (Kutaisi)', 'Kvemo Kartli (Rustavi)', 'Kakheti'] },
  { name: 'Guatemala', code: 'GT', code3: 'GTM', flag: '🇬🇹', dialCode: '+502', region: 'Americas', currency: { code: 'GTQ', name: 'Guatemalan Quetzal', symbol: 'Q' }, subdivisionType: 'Department', subdivisions: ['Guatemala (Guatemala City)', 'Quetzaltenango', 'Escuintla', 'San Marcos', 'Alta Verapaz'] },
  { name: 'Guinea', code: 'GN', code3: 'GIN', flag: '🇬🇳', dialCode: '+224', region: 'Africa', currency: { code: 'GNF', name: 'Guinean Franc', symbol: 'FG' }, subdivisionType: 'Region', subdivisions: ['Conakry', 'Kindia', 'Boké', 'Labé', 'Nzérékoré', 'Kankan', 'Mamou'] },
  { name: 'Honduras', code: 'HN', code3: 'HND', flag: '🇭🇳', dialCode: '+504', region: 'Americas', currency: { code: 'HNL', name: 'Honduran Lempira', symbol: 'L' }, subdivisionType: 'Department', subdivisions: ['Francisco Morazán (Tegucigalpa)', 'Cortés (San Pedro Sula)', 'Atlántida (La Ceiba)', 'Choluteca', 'Yoro'] },
  { name: 'Hungary', code: 'HU', code3: 'HUN', flag: '🇭🇺', dialCode: '+36', region: 'Europe', currency: { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft' }, subdivisionType: 'County (Megye)', subdivisions: ['Budapest', 'Pest', 'Borsod-Abaúj-Zemplén (Miskolc)', 'Hajdú-Bihar (Debrecen)', 'Győr-Moson-Sopron'] },
  { name: 'Iceland', code: 'IS', code3: 'ISL', flag: '🇮🇸', dialCode: '+354', region: 'Europe', currency: { code: 'ISK', name: 'Icelandic Króna', symbol: 'kr' }, subdivisionType: 'Region', subdivisions: ['Capital Region (Reykjavík)', 'Southern Peninsula (Keflavík)', 'South (Selfoss)', 'Northeast (Akureyri)'] },
  { name: 'Iran', code: 'IR', code3: 'IRN', flag: '🇮🇷', dialCode: '+98', region: 'Middle East', currency: { code: 'IRR', name: 'Iranian Rial', symbol: '﷼' }, subdivisionType: 'Province', subdivisions: ['Tehran', 'Razavi Khorasan (Mashhad)', 'Isfahan', 'Fars (Shiraz)', 'Khuzestan (Ahvaz)', 'East Azerbaijan (Tabriz)'] },
  { name: 'Iraq', code: 'IQ', code3: 'IRQ', flag: '🇮🇶', dialCode: '+964', region: 'Middle East', currency: { code: 'IQD', name: 'Iraqi Dinar', symbol: 'ع.د' }, subdivisionType: 'Governorate', subdivisions: ['Baghdad', 'Basra', 'Nineveh (Mosul)', 'Erbil (Kurdistan)', 'Sulaymaniyah', 'Najaf', 'Karbala'] },
  { name: 'Israel', code: 'IL', code3: 'ISR', flag: '🇮🇱', dialCode: '+972', region: 'Middle East', currency: { code: 'ILS', name: 'Israeli New Shekel', symbol: '₪' }, subdivisionType: 'District', subdivisions: ['Tel Aviv District', 'Jerusalem District', 'Central District', 'Haifa District', 'Northern District', 'Southern District'] },
  { name: 'Jamaica', code: 'JM', code3: 'JAM', flag: '🇯🇲', dialCode: '+1-876', region: 'Americas', currency: { code: 'JMD', name: 'Jamaican Dollar', symbol: 'J$' }, subdivisionType: 'Parish', subdivisions: ['Kingston', 'Saint Andrew', 'Saint Catherine (Spanish Town)', 'Saint James (Montego Bay)', 'Manchester'] },
  { name: 'Kazakhstan', code: 'KZ', code3: 'KAZ', flag: '🇰🇿', dialCode: '+7', region: 'Asia', currency: { code: 'KZT', name: 'Kazakhstani Tenge', symbol: '₸' }, subdivisionType: 'Region / City', subdivisions: ['Almaty City', 'Astana City', 'Shymkent City', 'Karaganda', 'Aktobe', 'Atyrau', 'East Kazakhstan'] },
  { name: 'Latvia', code: 'LV', code3: 'LVA', flag: '🇱🇻', dialCode: '+371', region: 'Europe', currency: { code: 'EUR', name: 'Euro', symbol: '€' }, subdivisionType: 'Municipality / City', subdivisions: ['Riga', 'Daugavpils', 'Liepāja', 'Jelgava', 'Jūrmala', 'Ventspils'] },
  { name: 'Lithuania', code: 'LT', code3: 'LTU', flag: '🇱🇹', dialCode: '+370', region: 'Europe', currency: { code: 'EUR', name: 'Euro', symbol: '€' }, subdivisionType: 'County', subdivisions: ['Vilnius County', 'Kaunas County', 'Klaipėda County', 'Šiauliai County', 'Panevėžys County'] },
  { name: 'Luxembourg', code: 'LU', code3: 'LUX', flag: '🇱🇺', dialCode: '+352', region: 'Europe', currency: { code: 'EUR', name: 'Euro', symbol: '€' }, subdivisionType: 'Canton', subdivisions: ['Luxembourg City', 'Esch-sur-Alzette', 'Differdange', 'Dudelange', 'Ettelbruck'] },
  { name: 'Madagascar', code: 'MG', code3: 'MDG', flag: '🇲🇬', dialCode: '+261', region: 'Africa', currency: { code: 'MGA', name: 'Malagasy Ariary', symbol: 'Ar' }, subdivisionType: 'Region', subdivisions: ['Analamanga (Antananarivo)', 'Atsinanana (Toamasina)', 'Vakinankaratra (Antsirabe)', 'Boeny (Mahajanga)', 'Diana (Antsiranana)'] },
  { name: 'Malawi', code: 'MW', code3: 'MWI', flag: '🇲🇼', dialCode: '+265', region: 'Africa', currency: { code: 'MWK', name: 'Malawian Kwacha', symbol: 'MK' }, subdivisionType: 'Region', subdivisions: ['Central Region (Lilongwe)', 'Southern Region (Blantyre)', 'Northern Region (Mzuzu)'] },
  { name: 'Maldives', code: 'MV', code3: 'MDV', flag: '🇲🇻', dialCode: '+960', region: 'Asia', currency: { code: 'MVR', name: 'Maldivian Rufiyaa', symbol: 'Rf' }, subdivisionType: 'Atoll / City', subdivisions: ['Malé City', 'Addu City', 'Fuvahmulah', 'Haa Alif', 'Kaafu (North Malé)'] },
  { name: 'Mali', code: 'ML', code3: 'MLI', flag: '🇲🇱', dialCode: '+223', region: 'Africa', currency: { code: 'XOF', name: 'West African CFA Franc', symbol: 'CFA' }, subdivisionType: 'Region', subdivisions: ['Bamako Capital District', 'Sikasso', 'Koulikoro', 'Kayes', 'Ségou', 'Mopti'] },
  { name: 'Malta', code: 'MT', code3: 'MLT', flag: '🇲🇹', dialCode: '+356', region: 'Europe', currency: { code: 'EUR', name: 'Euro', symbol: '€' }, subdivisionType: 'Region', subdivisions: ['Northern Harbour (Birkirkara/Sliema)', 'Southern Harbour (Valletta)', 'Northern', 'Western', 'South Eastern', 'Gozo'] },
  { name: 'Mauritania', code: 'MR', code3: 'MRT', flag: '🇲🇷', dialCode: '+222', region: 'Africa', currency: { code: 'MRU', name: 'Mauritanian Ouguiya', symbol: 'UM' }, subdivisionType: 'Region (Wilaya)', subdivisions: ['Nouakchott Ouest', 'Nouakchott Nord', 'Nouakchott Sud', 'Dakhlet Nouadhibou', 'Trarza'] },
  { name: 'Moldova', code: 'MD', code3: 'MDA', flag: '🇲🇩', dialCode: '+373', region: 'Europe', currency: { code: 'MDL', name: 'Moldovan Leu', symbol: 'L' }, subdivisionType: 'District (Raion) / Municipality', subdivisions: ['Chișinău', 'Bălți', 'Gagauzia', 'Ungheni', 'Cahul', 'Orhei'] },
  { name: 'Monaco', code: 'MC', code3: 'MCO', flag: '🇲🇨', dialCode: '+377', region: 'Europe', currency: { code: 'EUR', name: 'Euro', symbol: '€' }, subdivisionType: 'Quarter', subdivisions: ['Monte Carlo', 'La Condamine', 'Monaco-Ville', 'Fontvieille', 'Larvotto'] },
  { name: 'Mongolia', code: 'MN', code3: 'MNG', flag: '🇲🇳', dialCode: '+976', region: 'Asia', currency: { code: 'MNT', name: 'Mongolian Tögrög', symbol: '₮' }, subdivisionType: 'Province (Aimag)', subdivisions: ['Ulaanbaatar', 'Orkhon (Erdenet)', 'Darkhan-Uul', 'Selenge', 'Khövsgöl'] },
  { name: 'Montenegro', code: 'ME', code3: 'MNE', flag: '🇲🇪', dialCode: '+382', region: 'Europe', currency: { code: 'EUR', name: 'Euro', symbol: '€' }, subdivisionType: 'Municipality', subdivisions: ['Podgorica', 'Nikšić', 'Bar', 'Budva', 'Herceg Novi', 'Kotor', 'Bijelo Polje'] },
  { name: 'Myanmar (Burma)', code: 'MM', code3: 'MMR', flag: '🇲🇲', dialCode: '+95', region: 'Asia', currency: { code: 'MMK', name: 'Myanmar Kyat', symbol: 'K' }, subdivisionType: 'Region / State', subdivisions: ['Yangon', 'Mandalay', 'Naypyidaw Union Territory', 'Bago', 'Shan State', 'Ayeyarwady'] },
  { name: 'Nicaragua', code: 'NI', code3: 'NIC', flag: '🇳🇮', dialCode: '+505', region: 'Americas', currency: { code: 'NIO', name: 'Nicaraguan Córdoba', symbol: 'C$' }, subdivisionType: 'Department', subdivisions: ['Managua', 'León', 'Matagalpa', 'Chinandega', 'Masaya', 'Estelí', 'Granada'] },
  { name: 'Niger', code: 'NE', code3: 'NER', flag: '🇳🇪', dialCode: '+227', region: 'Africa', currency: { code: 'XOF', name: 'West African CFA Franc', symbol: 'CFA' }, subdivisionType: 'Region', subdivisions: ['Niamey', 'Maradi', 'Zinder', 'Tahoua', 'Tillabéri', 'Agadez', 'Dosso', 'Diffa'] },
  { name: 'North Macedonia', code: 'MK', code3: 'MKD', flag: '🇲🇰', dialCode: '+389', region: 'Europe', currency: { code: 'MKD', name: 'Macedonian Denar', symbol: 'ден' }, subdivisionType: 'Statistical Region', subdivisions: ['Skopje', 'Polog (Tetovo)', 'Pelagonia (Bitola)', 'Southwestern (Ohrid)', 'Vardar'] },
  { name: 'Panama', code: 'PA', code3: 'PAN', flag: '🇵🇦', dialCode: '+507', region: 'Americas', currency: { code: 'USD', name: 'US Dollar / Balboa', symbol: '$' }, subdivisionType: 'Province', subdivisions: ['Panamá (Panama City)', 'Panamá Oeste', 'Chiriquí (David)', 'Colón', 'Coclé', 'Veraguas'] },
  { name: 'Paraguay', code: 'PY', code3: 'PRY', flag: '🇵🇾', dialCode: '+595', region: 'Americas', currency: { code: 'PYG', name: 'Paraguayan Guaraní', symbol: '₲' }, subdivisionType: 'Department', subdivisions: ['Central (San Lorenzo/Luque)', 'Asunción Capital District', 'Alto Paraná (Ciudad del Este)', 'Itapúa (Encarnación)', 'Caaguazú'] },
  { name: 'Romania', code: 'RO', code3: 'ROU', flag: '🇷🇴', dialCode: '+40', region: 'Europe', currency: { code: 'RON', name: 'Romanian Leu', symbol: 'lei' }, subdivisionType: 'County (Județ)', subdivisions: ['Bucharest (București)', 'Cluj (Cluj-Napoca)', 'Timiș (Timișoara)', 'Iași', 'Constanța', 'Brașov', 'Prahova (Ploiești)'] },
  { name: 'Serbia', code: 'RS', code3: 'SRB', flag: '🇷🇸', dialCode: '+381', region: 'Europe', currency: { code: 'RSD', name: 'Serbian Dinar', symbol: 'дин.' }, subdivisionType: 'District', subdivisions: ['Belgrade (Beograd)', 'South Bačka (Novi Sad)', 'Nišava (Niš)', 'Šumadija (Kragujevac)', 'Subotica'] },
  { name: 'Slovakia', code: 'SK', code3: 'SVK', flag: '🇸🇰', dialCode: '+421', region: 'Europe', currency: { code: 'EUR', name: 'Euro', symbol: '€' }, subdivisionType: 'Region (Kraj)', subdivisions: ['Bratislava Region', 'Košice Region', 'Prešov Region', 'Žilina Region', 'Nitra Region', 'Banská Bystrica'] },
  { name: 'Slovenia', code: 'SI', code3: 'SVN', flag: '🇸🇮', dialCode: '+386', region: 'Europe', currency: { code: 'EUR', name: 'Euro', symbol: '€' }, subdivisionType: 'Statistical Region', subdivisions: ['Central Slovenia (Ljubljana)', 'Drava (Maribor)', 'Savinja (Celje)', 'Coastal-Karst (Koper)', 'Gorenjska (Kranj)'] },
  { name: 'Somalia', code: 'SO', code3: 'SOM', flag: '🇸🇴', dialCode: '+252', region: 'Africa', currency: { code: 'SOS', name: 'Somali Shilling', symbol: 'Sh' }, subdivisionType: 'Federal State / Region', subdivisions: ['Banaadir (Mogadishu)', 'Puntland (Garowe/Bosaso)', 'Somaliland (Hargeisa)', 'Jubaland (Kismayo)', 'South West (Baidoa)', 'Galmudug'] },
  { name: 'Sudan', code: 'SD', code3: 'SDN', flag: '🇸🇩', dialCode: '+249', region: 'Africa', currency: { code: 'SDG', name: 'Sudanese Pound', symbol: 'ج.س.' }, subdivisionType: 'State', subdivisions: ['Khartoum', 'Red Sea (Port Sudan)', 'Gezira (Wad Madani)', 'Kassala', 'North Kordofan', 'South Darfur'] },
  { name: 'Trinidad and Tobago', code: 'TT', code3: 'TTO', flag: '🇹🇹', dialCode: '+1-868', region: 'Americas', currency: { code: 'TTD', name: 'Trinidad and Tobago Dollar', symbol: 'TT$' }, subdivisionType: 'Regional Corporation / Borough', subdivisions: ['Port of Spain', 'San Fernando', 'Chaguanas', 'Tunapuna-Piarco', 'San Juan-Laventille', 'Tobago'] },
  { name: 'Tunisia', code: 'TN', code3: 'TUN', flag: '🇹🇳', dialCode: '+216', region: 'Africa', currency: { code: 'TND', name: 'Tunisian Dinar', symbol: 'DT' }, subdivisionType: 'Governorate', subdivisions: ['Tunis', 'Sfax', 'Sousse', 'Ariana', 'Ben Arous', 'Monastir', 'Bizerte', 'Nabeul', 'Kairouan'] },
  { name: 'Ukraine', code: 'UA', code3: 'UKR', flag: '🇺🇦', dialCode: '+380', region: 'Europe', currency: { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴' }, subdivisionType: 'Oblast (Region)', subdivisions: ['Kyiv City', 'Kyiv Oblast', 'Lviv', 'Odesa', 'Kharkiv', 'Dnipro (Dnipropetrovsk)', 'Zaporizhzhia', 'Vinnytsia'] },
  { name: 'Uruguay', code: 'UY', code3: 'URY', flag: '🇺🇾', dialCode: '+598', region: 'Americas', currency: { code: 'UYU', name: 'Uruguayan Peso', symbol: '$U' }, subdivisionType: 'Department', subdivisions: ['Montevideo', 'Canelones', 'Maldonado (Punta del Este)', 'Salto', 'Paysandú', 'Colonia'] },
  { name: 'Uzbekistan', code: 'UZ', code3: 'UZB', flag: '🇺🇿', dialCode: '+998', region: 'Asia', currency: { code: 'UZS', name: 'Uzbekistani Som', symbol: 'soʻm' }, subdivisionType: 'Region (Viloyat)', subdivisions: ['Tashkent City', 'Samarkand', 'Fergana', 'Andijan', 'Namangan', 'Bukhara', 'Kashkadarya'] },
  { name: 'Venezuela', code: 'VE', code3: 'VEN', flag: '🇻🇪', dialCode: '+58', region: 'Americas', currency: { code: 'VES', name: 'Venezuelan Bolívar', symbol: 'Bs.S' }, subdivisionType: 'State', subdivisions: ['Capital District (Caracas)', 'Miranda', 'Zulia (Maracaibo)', 'Carabobo (Valencia)', 'Lara (Barquisimeto)', 'Aragua (Maracay)'] },
  { name: 'Yemen', code: 'YE', code3: 'YEM', flag: '🇾🇪', dialCode: '+967', region: 'Middle East', currency: { code: 'YER', name: 'Yemeni Rial', symbol: '﷼' }, subdivisionType: 'Governorate', subdivisions: ['Sana\'a', 'Aden', 'Taiz', 'Al Hudaydah', 'Hadhramaut (Mukalla)', 'Ibb', 'Dhamar'] }
];

// Helper Functions
export const GLOBAL_COUNTRIES_MAP: Record<string, GlobalCountry> = {};
ALL_GLOBAL_COUNTRIES.forEach((c) => {
  GLOBAL_COUNTRIES_MAP[c.code.toUpperCase()] = c;
  GLOBAL_COUNTRIES_MAP[c.code3.toUpperCase()] = c;
  GLOBAL_COUNTRIES_MAP[c.name.toLowerCase()] = c;
});

/**
 * High-performance instant search matching Country Name, ISO 2, ISO 3, Dial Code, or Region
 */
export function searchGlobalCountries(query: string): GlobalCountry[] {
  if (!query || !query.trim()) {
    return ALL_GLOBAL_COUNTRIES;
  }
  const cleanQ = query.trim().toLowerCase();
  
  return ALL_GLOBAL_COUNTRIES.filter((c) => {
    return (
      c.name.toLowerCase().includes(cleanQ) ||
      c.code.toLowerCase() === cleanQ ||
      c.code3.toLowerCase() === cleanQ ||
      c.dialCode.toLowerCase().includes(cleanQ) ||
      c.region.toLowerCase().includes(cleanQ) ||
      (c.currency?.code && c.currency.code.toLowerCase().includes(cleanQ))
    );
  });
}

/**
 * Retrieves country by ISO2, ISO3, or full name
 */
export function getCountryInfo(countryCodeOrName: string): GlobalCountry | null {
  if (!countryCodeOrName) return null;
  const trimmed = countryCodeOrName.trim();
  const upper = trimmed.toUpperCase();
  const lower = trimmed.toLowerCase();

  if (GLOBAL_COUNTRIES_MAP[upper]) return GLOBAL_COUNTRIES_MAP[upper];
  if (GLOBAL_COUNTRIES_MAP[lower]) return GLOBAL_COUNTRIES_MAP[lower];

  const found = ALL_GLOBAL_COUNTRIES.find(
    (c) => c.name.toLowerCase() === lower || c.code === upper || c.code3 === upper
  );
  return found || null;
}

/**
 * Returns flag emoji for country code or name with reliable fallback
 */
export function getCountryFlag(countryCodeOrName: string): string {
  const info = getCountryInfo(countryCodeOrName);
  if (info) return info.flag;
  if (!countryCodeOrName || countryCodeOrName === 'GLOBAL') return '🌐';
  
  // Try computing from ISO-2
  if (countryCodeOrName.length === 2) {
    const code = countryCodeOrName.toUpperCase();
    return String.fromCodePoint(
      ...code.split('').map((char) => 127397 + char.charCodeAt(0))
    );
  }
  return '🌐';
}
