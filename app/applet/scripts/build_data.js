const fs = require('fs');
const path = require('path');

const VALID_CATEGORIES = [
  'airtime', 'data', 'electricity', 'cable', 'internet', 'water',
  'exam', 'education', 'giftcard', 'voucher', 'betting', 'gaming',
  'streaming', 'insurance', 'government', 'transport', 'events', 'ecommerce'
];

function p({
  id, name, category, country, countryCode, dialCode,
  accountLabel, accountPlaceholder, designations, packages,
  supportsCustomAmount = true, supportsFixedPackages = true,
  minCustomFiat = 1.00, maxCustomFiat = 500.00,
  currency = 'USD', enabled = true, hasDirectValidationApi = true,
  logo = 'https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80'
}) {
  return {
    id,
    name,
    category,
    logo,
    country,
    countryCode,
    dialCode,
    supportsCustomAmount,
    supportsFixedPackages,
    accountLabel,
    accountPlaceholder,
    minCustomFiat,
    maxCustomFiat,
    currency,
    enabled,
    hasDirectValidationApi,
    designations: designations || ['Standard Service', 'Express Recharge'],
    packages: packages || [
      { id: `${id}-pkg-1`, name: `${name} Essential Pack`, description: `Basic ${name} service recharge`, fiatPrice: 5.00, currency: 'USD', validity: '30 Days' },
      { id: `${id}-pkg-2`, name: `${name} Value Bundle`, description: `Standard ${name} service recharge`, fiatPrice: 15.00, currency: 'USD', validity: '30 Days', badge: 'Popular' },
      { id: `${id}-pkg-3`, name: `${name} Max Pro Package`, description: `High-value ${name} pack`, fiatPrice: 50.00, currency: 'USD', validity: '90 Days', badge: 'Best Value' }
    ]
  };
}

const providers = [];

// ==========================================
// 1. AIRTIME
// ==========================================
const airtimeCountries = [
  { country: 'Nigeria', code: 'NG', dial: '+234', ops: ['MTN Nigeria', 'Airtel Nigeria', 'Glo Nigeria', '9mobile Nigeria'] },
  { country: 'Kenya', code: 'KE', dial: '+254', ops: ['Safaricom Kenya', 'Airtel Kenya', 'Telkom Kenya'] },
  { country: 'Ghana', code: 'GH', dial: '+233', ops: ['MTN Ghana', 'Telecel Ghana (Vodafone)', 'AT (AirtelTigo Ghana)'] },
  { country: 'South Africa', code: 'ZA', dial: '+27', ops: ['Vodacom South Africa', 'MTN South Africa', 'Telkom Mobile SA', 'Cell C South Africa'] },
  { country: 'Uganda', code: 'UG', dial: '+256', ops: ['MTN Uganda', 'Airtel Uganda'] },
  { country: 'Tanzania', code: 'TZ', dial: '+255', ops: ['Vodacom Tanzania', 'Airtel Tanzania', 'Tigo Tanzania', 'Halotel Tanzania'] },
  { country: 'Rwanda', code: 'RW', dial: '+250', ops: ['MTN Rwanda', 'Airtel Rwanda'] },
  { country: 'Zambia', code: 'ZM', dial: '+260', ops: ['MTN Zambia', 'Airtel Zambia', 'Zamtel'] },
  { country: 'Zimbabwe', code: 'ZW', dial: '+263', ops: ['Econet Wireless Zimbabwe', 'NetOne Zimbabwe', 'Telecel Zimbabwe'] },
  { country: 'Egypt', code: 'EG', dial: '+20', ops: ['Vodafone Egypt', 'Orange Egypt', 'Etisalat Egypt', 'WE Telecom Egypt'] },
  { country: 'Morocco', code: 'MA', dial: '+212', ops: ['Maroc Telecom', 'Orange Morocco', 'Inwi Morocco'] },
  { country: 'India', code: 'IN', dial: '+91', ops: ['Reliance Jio', 'Airtel India', 'Vi (Vodafone Idea)', 'BSNL India'] },
  { country: 'Pakistan', code: 'PK', dial: '+92', ops: ['Jazz Pakistan', 'Telenor Pakistan', 'Zong 4G Pakistan', 'Ufone'] },
  { country: 'Bangladesh', code: 'BD', dial: '+880', ops: ['Grameenphone', 'Robi Axiata', 'Banglalink', 'Teletalk'] },
  { country: 'Indonesia', code: 'ID', dial: '+62', ops: ['Telkomsel', 'Indosat Ooredoo Hutchison', 'XL Axiata', 'Smartfren'] },
  { country: 'Philippines', code: 'PH', dial: '+63', ops: ['Globe Telecom', 'Smart Communications', 'DITO Telecommunity'] },
  { country: 'Vietnam', code: 'VN', dial: '+84', ops: ['Viettel Telecom', 'Vinaphone', 'Mobifone'] },
  { country: 'Malaysia', code: 'MY', dial: '+60', ops: ['CelcomDigi', 'Maxis', 'U Mobile'] },
  { country: 'Singapore', code: 'SG', dial: '+65', ops: ['Singtel', 'StarHub', 'M1 Singapore'] },
  { country: 'Thailand', code: 'TH', dial: '+66', ops: ['AIS Thailand', 'TrueMove H', 'dtac Thailand'] },
  { country: 'United States', code: 'US', dial: '+1', ops: ['AT&T Prepaid', 'T-Mobile Prepaid', 'Verizon Wireless', 'Cricket Wireless'] },
  { country: 'Canada', code: 'CA', dial: '+1', ops: ['Rogers Prepaid', 'Bell Mobility', 'Telus Prepaid', 'Freedom Mobile'] },
  { country: 'Mexico', code: 'MX', dial: '+52', ops: ['Telcel Mexico', 'AT&T Mexico', 'Movistar Mexico'] },
  { country: 'Brazil', code: 'BR', dial: '+55', ops: ['Vivo Brazil', 'Claro Brasil', 'TIM Brasil'] },
  { country: 'Colombia', code: 'CO', dial: '+57', ops: ['Claro Colombia', 'Movistar Colombia', 'Tigo Colombia'] },
  { country: 'Argentina', code: 'AR', dial: '+54', ops: ['Personal Argentina', 'Movistar Argentina', 'Claro Argentina'] },
  { country: 'United Kingdom', code: 'GB', dial: '+44', ops: ['EE UK', 'Vodafone UK', 'O2 UK', 'Three UK', 'giffgaff UK'] },
  { country: 'France', code: 'FR', dial: '+33', ops: ['Orange France', 'SFR France', 'Bouygues Telecom', 'Free Mobile France'] },
  { country: 'Germany', code: 'DE', dial: '+49', ops: ['Telekom Deutschland', 'Vodafone Germany', 'O2 Germany'] },
  { country: 'Spain', code: 'ES', dial: '+34', ops: ['Movistar España', 'Vodafone España', 'Orange España'] },
  { country: 'Italy', code: 'IT', dial: '+39', ops: ['TIM Italia', 'Vodafone Italia', 'WindTre Italia', 'Iliad Italia'] },
  { country: 'Netherlands', code: 'NL', dial: '+31', ops: ['KPN Netherlands', 'Vodafone Netherlands', 'Odido'] },
  { country: 'Saudi Arabia', code: 'SA', dial: '+966', ops: ['STC Saudi', 'Mobily Saudi', 'Zain KSA'] },
  { country: 'United Arab Emirates', code: 'AE', dial: '+971', ops: ['e& (Etisalat UAE)', 'du UAE', 'Virgin Mobile UAE'] },
  { country: 'Turkey', code: 'TR', dial: '+90', ops: ['Turkcell', 'Vodafone Turkey', 'Türk Telekom Mobile'] },
  { country: 'Australia', code: 'AU', dial: '+61', ops: ['Telstra Prepaid', 'Optus Prepaid', 'Vodafone Australia'] }
];

airtimeCountries.forEach(c => {
  c.ops.forEach((opName, idx) => {
    const slug = opName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    providers.push(p({
      id: `prov-airtime-${c.code.toLowerCase()}-${slug}`,
      name: opName,
      category: 'airtime',
      country: c.country,
      countryCode: c.code,
      dialCode: c.dial,
      accountLabel: 'Mobile Phone Number',
      accountPlaceholder: `Enter ${c.country} phone number`,
      designations: ['Prepaid Airtime Top-up', 'Postpaid Bill Payment', 'VTU Instant Recharge'],
      packages: [
        { id: `pkg-at-${c.code.toLowerCase()}-${idx}-1`, name: `${opName} $2 Airtime`, description: 'Instant network credit top-up', fiatPrice: 2.00, currency: 'USD', validity: 'Instant' },
        { id: `pkg-at-${c.code.toLowerCase()}-${idx}-2`, name: `${opName} $5 Airtime`, description: 'Instant network credit top-up', fiatPrice: 5.00, currency: 'USD', validity: 'Instant', badge: 'Popular' },
        { id: `pkg-at-${c.code.toLowerCase()}-${idx}-3`, name: `${opName} $10 Airtime + Bonus`, description: 'Includes bonus talktime', fiatPrice: 10.00, currency: 'USD', validity: 'Instant', badge: 'Best Value' }
      ]
    }));
  });
});

// ==========================================
// 2. DATA
// ==========================================
const dataCountries = [
  { country: 'Nigeria', code: 'NG', dial: '+234', ops: ['MTN Nigeria 4G/5G Data', 'Airtel Nigeria Data Bundles', 'Glo Nigeria Data', '9mobile Nigeria Data'] },
  { country: 'Kenya', code: 'KE', dial: '+254', ops: ['Safaricom Kenya Data Bundles', 'Airtel Kenya Data Passes', 'Telkom Kenya Data'] },
  { country: 'Ghana', code: 'GH', dial: '+233', ops: ['MTN Ghana Data Bundles', 'Telecel Ghana Data', 'AT Ghana Data'] },
  { country: 'South Africa', code: 'ZA', dial: '+27', ops: ['Vodacom SA Data Passes', 'MTN SA Data Bundles', 'Telkom Mobile SA Data', 'Cell C Data'] },
  { country: 'Uganda', code: 'UG', dial: '+256', ops: ['MTN Uganda Data', 'Airtel Uganda Data'] },
  { country: 'Tanzania', code: 'TZ', dial: '+255', ops: ['Vodacom Tanzania Data', 'Airtel Tanzania Data'] },
  { country: 'India', code: 'IN', dial: '+91', ops: ['Reliance Jio India Data Boosters', 'Airtel India Data Packs', 'Vi India Data Boosters', 'BSNL Data'] },
  { country: 'Pakistan', code: 'PK', dial: '+92', ops: ['Jazz 4G Data Bundles', 'Zong 4G Data Bundles', 'Telenor Data'] },
  { country: 'Bangladesh', code: 'BD', dial: '+880', ops: ['Grameenphone 4G Data', 'Robi Axiata Data'] },
  { country: 'Indonesia', code: 'ID', dial: '+62', ops: ['Telkomsel Data Flash', 'Indosat Freedom Internet', 'XL Axiata Data'] },
  { country: 'Philippines', code: 'PH', dial: '+63', ops: ['Globe GoSURF Data', 'Smart Giga Data', 'DITO Data Packs'] },
  { country: 'Vietnam', code: 'VN', dial: '+84', ops: ['Viettel 4G/5G Data', 'Vinaphone Data'] },
  { country: 'Malaysia', code: 'MY', dial: '+60', ops: ['CelcomDigi Internet Passes', 'Maxis Hotlink Data'] },
  { country: 'Thailand', code: 'TH', dial: '+66', ops: ['AIS 5G Max Speed Data', 'TrueMove H Data'] },
  { country: 'United States', code: 'US', dial: '+1', ops: ['AT&T USA Mobile Data Pass', 'T-Mobile USA Data Pass', 'Verizon USA Data Pass'] },
  { country: 'Canada', code: 'CA', dial: '+1', ops: ['Rogers Canada Data Pass', 'Bell Canada Data Pass', 'Telus Data Pass'] },
  { country: 'Mexico', code: 'MX', dial: '+52', ops: ['Telcel Amigo Data', 'AT&T Mexico Data'] },
  { country: 'Brazil', code: 'BR', dial: '+55', ops: ['Vivo Internet Movel', 'Claro Internet Brasil', 'TIM Internet'] },
  { country: 'United Kingdom', code: 'GB', dial: '+44', ops: ['EE UK Data Add-On', 'Vodafone UK Data Pass', 'O2 UK Data Bolt-On', 'Three UK Data'] },
  { country: 'France', code: 'FR', dial: '+33', ops: ['Orange France Pass Internet', 'SFR Pass Data'] },
  { country: 'Germany', code: 'DE', dial: '+49', ops: ['Telekom DE Data Pass', 'Vodafone DE Data Option', 'O2 DE Data'] },
  { country: 'Spain', code: 'ES', dial: '+34', ops: ['Movistar Bono Datos', 'Vodafone España Datos'] },
  { country: 'Saudi Arabia', code: 'SA', dial: '+966', ops: ['STC Quicknet Data', 'Mobily Data Vouchers', 'Zain Saudi Data'] },
  { country: 'United Arab Emirates', code: 'AE', dial: '+971', ops: ['e& UAE Data Pass', 'du UAE Data Add-on'] },
  { country: 'Australia', code: 'AU', dial: '+61', ops: ['Telstra Mobile Data Pass', 'Optus Data Top-Up'] }
];

dataCountries.forEach(c => {
  c.ops.forEach((opName, idx) => {
    const slug = opName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    providers.push(p({
      id: `prov-data-${c.code.toLowerCase()}-${slug}`,
      name: opName,
      category: 'data',
      country: c.country,
      countryCode: c.code,
      dialCode: c.dial,
      accountLabel: 'Mobile Phone Number',
      accountPlaceholder: `Enter ${c.country} phone number`,
      designations: ['Daily Data Bundle', 'Weekly Data Pass', 'Monthly 4G/5G Plan', 'SME Corporate Data', 'Night Data Unlimited'],
      packages: [
        { id: `pkg-data-${c.code.toLowerCase()}-${idx}-1`, name: `${opName} 2.5GB (7 Days)`, description: 'High-speed 4G/5G data pass', fiatPrice: 3.00, currency: 'USD', validity: '7 Days' },
        { id: `pkg-data-${c.code.toLowerCase()}-${idx}-2`, name: `${opName} 10GB Monthly Bundle`, description: 'Full 30-day high-speed internet bundle', fiatPrice: 8.00, currency: 'USD', validity: '30 Days', badge: 'Popular' },
        { id: `pkg-data-${c.code.toLowerCase()}-${idx}-3`, name: `${opName} 50GB Heavy User Plan`, description: 'Unlimited social & high-speed data', fiatPrice: 25.00, currency: 'USD', validity: '30 Days', badge: 'Best Value' }
      ]
    }));
  });
});

// ==========================================
// 3. ELECTRICITY
// ==========================================
const electricityList = [
  { country: 'Nigeria', code: 'NG', ops: ['Ikeja Electric (IKEDC)', 'Eko Electricity (EKEDC)', 'Abuja Electricity (AEDC)', 'Kano Electricity (KEDCO)', 'Enugu Electricity (EEDC)', 'Ibadan Electricity (IBEDC)', 'Port Harcourt Electricity (PHED)'] },
  { country: 'Kenya', code: 'KE', ops: ['Kenya Power (KPLC Stima Prepaid)', 'Kenya Power (KPLC Postpaid)'] },
  { country: 'Ghana', code: 'GH', ops: ['Electricity Company of Ghana (ECG)', 'Northern Electricity Distribution (NEDCo)'] },
  { country: 'South Africa', code: 'ZA', ops: ['Eskom Prepaid Electricity', 'City Power Johannesburg', 'Tshwane Prepaid Electricity', 'eThekwini Electricity Durban', 'Cape Town Electricity'] },
  { country: 'Uganda', code: 'UG', ops: ['Umeme Uganda Electricity'] },
  { country: 'Tanzania', code: 'TZ', ops: ['TANESCO LUKU Electricity'] },
  { country: 'India', code: 'IN', ops: ['Tata Power Delhi/Mumbai', 'Adani Electricity Mumbai', 'BESCOM Bangalore Electric', 'MSEDCL Maharashtra Electric', 'CESC Kolkata Power', 'TANGEDCO Tamil Nadu'] },
  { country: 'United States', code: 'US', ops: ['ConEd New York Settlement', 'Pacific Gas & Electric (PG&E)', 'Florida Power & Light (FPL)', 'ComEd Chicago Electric', 'Southern California Edison (SCE)'] },
  { country: 'United Kingdom', code: 'GB', ops: ['EDF Energy UK Electricity', 'British Gas Power', 'Octopus Energy UK', 'E.ON Next UK', 'ScottishPower'] },
  { country: 'France', code: 'FR', ops: ['EDF France Electricité', 'ENGIE France Electricité'] },
  { country: 'Germany', code: 'DE', ops: ['E.ON Energie Deutschland', 'Vattenfall Germany Strom', 'EnBW Energie'] },
  { country: 'Philippines', code: 'PH', ops: ['Meralco Manila Electric Company', 'VECO Visayan Electric'] },
  { country: 'Brazil', code: 'BR', ops: ['Enel Distribuição São Paulo', 'Light Rio de Janeiro', 'CEMIG Minas Gerais'] },
  { country: 'Canada', code: 'CA', ops: ['Hydro-Québec Electricity', 'Toronto Hydro Power', 'BC Hydro Canada'] },
  { country: 'United Arab Emirates', code: 'AE', ops: ['DEWA Dubai Electricity', 'SEWA Sharjah Electricity'] },
  { country: 'Saudi Arabia', code: 'SA', ops: ['SEC Saudi Electricity Company'] }
];

electricityList.forEach(c => {
  c.ops.forEach((opName, idx) => {
    const slug = opName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    providers.push(p({
      id: `prov-elec-${c.code.toLowerCase()}-${slug}`,
      name: opName,
      category: 'electricity',
      country: c.country,
      countryCode: c.code,
      accountLabel: 'Meter Number / Customer Account ID',
      accountPlaceholder: `Enter 11 to 13 digit ${c.country} meter ID`,
      designations: ['Prepaid Meter Token Generation', 'Postpaid Monthly Bill Settlement', 'Commercial Utility Payment'],
      packages: [
        { id: `pkg-elec-${c.code.toLowerCase()}-${idx}-1`, name: `${opName} $10 Token Credit`, description: 'Direct token generation / bill credit', fiatPrice: 10.00, currency: 'USD', validity: 'Instant Token' },
        { id: `pkg-elec-${c.code.toLowerCase()}-${idx}-2`, name: `${opName} $25 Token Credit`, description: 'Direct token generation / bill credit', fiatPrice: 25.00, currency: 'USD', validity: 'Instant Token', badge: 'Popular' },
        { id: `pkg-elec-${c.code.toLowerCase()}-${idx}-3`, name: `${opName} $100 Heavy Power Credit`, description: 'Direct token generation / bill credit', fiatPrice: 100.00, currency: 'USD', validity: 'Instant Token', badge: 'Best Value' }
      ]
    }));
  });
});

// ==========================================
// 4. CABLE TV
// ==========================================
const cableList = [
  { country: 'Nigeria', code: 'NG', ops: ['DStv Subscriptions & Upgrades', 'GOtv Subscription Packages', 'StarTimes Nigeria', 'TSTV Pay TV'] },
  { country: 'Kenya', code: 'KE', ops: ['DStv Kenya Packages', 'GOtv Kenya', 'Zuku TV Kenya', 'StarTimes Kenya'] },
  { country: 'Ghana', code: 'GH', ops: ['DStv Ghana', 'GOtv Ghana', 'StarTimes Ghana'] },
  { country: 'South Africa', code: 'ZA', ops: ['DStv South Africa', 'StarSat South Africa', 'Openview HD'] },
  { country: 'Uganda', code: 'UG', ops: ['DStv Uganda', 'GOtv Uganda', 'StarTimes Uganda'] },
  { country: 'Tanzania', code: 'TZ', ops: ['DStv Tanzania', 'Azam TV Tanzania', 'GOtv Tanzania'] },
  { country: 'United Kingdom', code: 'GB', ops: ['Sky Digital TV UK', 'Virgin Media TV UK'] },
  { country: 'United States', code: 'US', ops: ['Comcast Xfinity TV', 'Spectrum TV Pass', 'DIRECTV Stream USA', 'DISH Network'] },
  { country: 'India', code: 'IN', ops: ['Tata Play (Tata Sky)', 'Airtel Digital TV', 'Dish TV India', 'Sun Direct'] },
  { country: 'France', code: 'FR', ops: ['Canal+ France', 'Orange TV France'] },
  { country: 'Brazil', code: 'BR', ops: ['Claro TV Brasil', 'SKY Brasil', 'Vivo TV'] },
  { country: 'Mexico', code: 'MX', ops: ['SKY México', 'Izzi Telecom TV'] }
];

cableList.forEach(c => {
  c.ops.forEach((opName, idx) => {
    const slug = opName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    providers.push(p({
      id: `prov-cable-${c.code.toLowerCase()}-${slug}`,
      name: opName,
      category: 'cable',
      country: c.country,
      countryCode: c.code,
      accountLabel: 'Smartcard / IUC / Decoder Number',
      accountPlaceholder: `Enter 10 or 11 digit Smartcard number`,
      designations: ['Monthly Subscription Renewal', 'Package Upgrade / Add-On', 'Decoder Box Clearing & Reactivation'],
      packages: [
        { id: `pkg-cable-${c.code.toLowerCase()}-${idx}-1`, name: `${opName} Compact / Basic`, description: 'Access to core channels & news', fiatPrice: 12.00, currency: 'USD', validity: '30 Days' },
        { id: `pkg-cable-${c.code.toLowerCase()}-${idx}-2`, name: `${opName} Premium / Ultra Pass`, description: 'Full access to sports, movies & HD', fiatPrice: 35.00, currency: 'USD', validity: '30 Days', badge: 'Popular' }
      ]
    }));
  });
});

// ==========================================
// 5. INTERNET
// ==========================================
const internetList = [
  { country: 'Global', code: 'GLOBAL', ops: ['Starlink Satellite Internet'] },
  { country: 'Nigeria', code: 'NG', ops: ['Spectranet 4G LTE Nigeria', 'Smile Telecom 4G', 'IPNX Fiber Broadband', 'Airtel Fiber Nigeria'] },
  { country: 'Kenya', code: 'KE', ops: ['Safaricom Home Fibre Kenya', 'Zuku Fiber Kenya', 'Faiba JTL Kenya'] },
  { country: 'Ghana', code: 'GH', ops: ['Telecel Fiber Ghana', 'MTN Fiber Ghana'] },
  { country: 'South Africa', code: 'ZA', ops: ['Rain 5G/LTE South Africa', 'Telkom SA Fibre', 'Vumatel Fiber', 'Cool Ideas'] },
  { country: 'Uganda', code: 'UG', ops: ['Liquid Intelligent Technologies Uganda', 'Roke Telkom'] },
  { country: 'United States', code: 'US', ops: ['Comcast Xfinity Broadband', 'AT&T Fiber USA', 'Verizon Fios Broadband', 'Spectrum Internet'] },
  { country: 'United Kingdom', code: 'GB', ops: ['BT Broadband UK', 'Virgin Media Broadband', 'Sky Broadband UK'] },
  { country: 'India', code: 'IN', ops: ['JioFiber Broadband', 'Airtel Xstream Fiber', 'ACT Fibernet India', 'BSNL Bharat Fiber'] },
  { country: 'Canada', code: 'CA', ops: ['Rogers Ignite Internet', 'Bell Fibe Canada'] },
  { country: 'Australia', code: 'AU', ops: ['Telstra NBN Broadband', 'Optus NBN Internet'] },
  { country: 'France', code: 'FR', ops: ['Freebox Internet', 'Orange Fibre France'] }
];

internetList.forEach(c => {
  c.ops.forEach((opName, idx) => {
    const slug = opName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    providers.push(p({
      id: `prov-internet-${c.code.toLowerCase()}-${slug}`,
      name: opName,
      category: 'internet',
      country: c.country,
      countryCode: c.code,
      accountLabel: 'User Account ID / Router Serial Number',
      accountPlaceholder: `Enter customer account or subscription ref`,
      designations: ['Home Fiber Unlimited Monthly', 'Business Dedicated Bandwidth', 'Wi-Fi Data Cap Top-Up'],
      packages: [
        { id: `pkg-net-${c.code.toLowerCase()}-${idx}-1`, name: `${opName} 50Mbps Fiber Pass`, description: 'Unlimited home high-speed broadband', fiatPrice: 25.00, currency: 'USD', validity: '30 Days' },
        { id: `pkg-net-${c.code.toLowerCase()}-${idx}-2`, name: `${opName} 100Mbps Ultra Fiber`, description: 'Gigabit streaming & gaming pass', fiatPrice: 60.00, currency: 'USD', validity: '30 Days', badge: 'Popular' }
      ]
    }));
  });
});

// ==========================================
// 6. WATER
// ==========================================
const waterList = [
  { country: 'Nigeria', code: 'NG', ops: ['Lagos Water Corporation (LSWC)', 'FCT Water Board Abuja', 'Ogun State Water Corporation', 'Enugu State Water Corporation'] },
  { country: 'Kenya', code: 'KE', ops: ['Nairobi City Water (NCWSC)', 'Mombasa Water (MOWASS)', 'Kisumu Water (KIWASCO)'] },
  { country: 'South Africa', code: 'ZA', ops: ['Rand Water Utility Board', 'Johannesburg Water', 'eThekwini Water Durban', 'City of Cape Town Water'] },
  { country: 'Ghana', code: 'GH', ops: ['Ghana Water Company Limited (GWCL)'] },
  { country: 'Uganda', code: 'UG', ops: ['National Water & Sewerage Corporation (NWSC)'] },
  { country: 'Tanzania', code: 'TZ', ops: ['DAWASA Dar es Salaam Water'] },
  { country: 'Philippines', code: 'PH', ops: ['Manila Water Company', 'Maynilad Water Services'] },
  { country: 'India', code: 'IN', ops: ['Delhi Jal Board (DJB)', 'Brihanmumbai Municipal Corp (BMC Water)', 'BWSSB Bangalore Water'] },
  { country: 'United States', code: 'US', ops: ['US Municipal Water Board', 'NYC Water & Sewer', 'Los Angeles Dept of Water & Power', 'Houston Water Board'] },
  { country: 'United Kingdom', code: 'GB', ops: ['Thames Water UK', 'Severn Trent Water', 'United Utilities UK', 'Anglian Water'] },
  { country: 'Brazil', code: 'BR', ops: ['Sabesp São Paulo Water', 'Cedae Rio Water'] }
];

waterList.forEach(c => {
  c.ops.forEach((opName, idx) => {
    const slug = opName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    providers.push(p({
      id: `prov-water-${c.code.toLowerCase()}-${slug}`,
      name: opName,
      category: 'water',
      country: c.country,
      countryCode: c.code,
      accountLabel: 'Municipal Water Account Ref / Meter Number',
      accountPlaceholder: `Enter water meter or account number`,
      designations: ['Municipal Water Meter Payment', 'Residential Utility Settlement', 'Commercial Water Bill'],
      packages: [
        { id: `pkg-water-${c.code.toLowerCase()}-${idx}-1`, name: `${opName} $15 Water Credit`, description: 'Direct municipal bill settlement', fiatPrice: 15.00, currency: 'USD', validity: 'Instant Credit' },
        { id: `pkg-water-${c.code.toLowerCase()}-${idx}-2`, name: `${opName} $50 Water Credit`, description: 'Direct municipal bill settlement', fiatPrice: 50.00, currency: 'USD', validity: 'Instant Credit', badge: 'Popular' }
      ]
    }));
  });
});

// ==========================================
// 7. EXAM CARDS
// ==========================================
const examList = [
  { country: 'Nigeria', code: 'NG', ops: ['WAEC Direct Result E-PINs', 'NECO Result Verification Tokens', 'JAMB UTME Registration E-PINs', 'NABTEB Result E-PINs'] },
  { country: 'Kenya', code: 'KE', ops: ['KNEC Exam Verification Kenya', 'KUCCPS University Placement Voucher'] },
  { country: 'Ghana', code: 'GH', ops: ['WAEC Ghana Result Checker E-PIN', 'BECE Result Checker Voucher'] },
  { country: 'Uganda', code: 'UG', ops: ['UNEB Exam Verification Uganda'] },
  { country: 'India', code: 'IN', ops: ['NTA Exam Portal Fee Token', 'CBSE Certificate Verification Token'] },
  { country: 'United States', code: 'US', ops: ['SAT & AP College Board Test Voucher', 'GED Exam Test Token'] },
  { country: 'United Kingdom', code: 'GB', ops: ['Pearson Edexcel Certificate Verification', 'Cambridge Assessment Pass'] }
];

examList.forEach(c => {
  c.ops.forEach((opName, idx) => {
    const slug = opName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    providers.push(p({
      id: `prov-exam-${c.code.toLowerCase()}-${slug}`,
      name: opName,
      category: 'exam',
      country: c.country,
      countryCode: c.code,
      supportsCustomAmount: false,
      supportsFixedPackages: true,
      accountLabel: 'Candidate Index / Examination Number',
      accountPlaceholder: `Enter candidate index or registration ID`,
      designations: ['Result Verification Token', 'Exam Portal E-PIN Voucher', 'Certificate Authentication Pass'],
      packages: [
        { id: `pkg-exam-${c.code.toLowerCase()}-${idx}-1`, name: `${opName} Official Voucher`, description: 'Instant PIN delivery to dashboard', fiatPrice: 5.00, currency: 'USD', validity: 'Instant PIN', badge: 'Official' }
      ]
    }));
  });
});

// ==========================================
// 8. EDUCATION
// ==========================================
const eduList = [
  { country: 'Global', code: 'GLOBAL', ops: ['Coursera Global Learning', 'edX MicroMasters & Certificates', 'Udemy Academy Voucher'] },
  { country: 'Nigeria', code: 'NG', ops: ['UNILAG Student Tuition Portal', 'Obafemi Awolowo Univ (OAU) Portal', 'Ahmadu Bello Univ (ABU) Portal', 'Covenant University Portal', 'University of Ibadan (UI) Portal'] },
  { country: 'Kenya', code: 'KE', ops: ['University of Nairobi (UoN)', 'Kenyatta University (KU)', 'Strathmore University Portal'] },
  { country: 'Ghana', code: 'GH', ops: ['University of Ghana Legon', 'KNUST Kumasi Fee Portal'] },
  { country: 'South Africa', code: 'ZA', ops: ['University of Cape Town (UCT)', 'Wits University Portal', 'Stellenbosch University'] },
  { country: 'Uganda', code: 'UG', ops: ['Makerere University Kampala Portal'] },
  { country: 'United States', code: 'US', ops: ['Harvard Online & Extension Portal', 'MIT xPro Online', 'NYU Student Fee Portal'] },
  { country: 'United Kingdom', code: 'GB', ops: ['Oxford Continuing Education', 'Cambridge Assessment Portal'] },
  { country: 'India', code: 'IN', ops: ['IIT Bombay Student Portal', 'Delhi University (DU) Portal'] }
];

eduList.forEach(c => {
  c.ops.forEach((opName, idx) => {
    const slug = opName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    providers.push(p({
      id: `prov-edu-${c.code.toLowerCase()}-${slug}`,
      name: opName,
      category: 'education',
      country: c.country,
      countryCode: c.code,
      accountLabel: 'Student Matric / Admission Number / Account ID',
      accountPlaceholder: `Enter student matriculation or candidate ID`,
      designations: ['Semester Tuition Fee Deposit', 'Acceptance Fee Clearance', 'Campus Accommodation Levy', 'E-Learning Certification Pass'],
      packages: [
        { id: `pkg-edu-${c.code.toLowerCase()}-${idx}-1`, name: `${opName} $25 Portal Credit`, description: 'Direct student fee portal payment', fiatPrice: 25.00, currency: 'USD', validity: 'Instant Deposit' },
        { id: `pkg-edu-${c.code.toLowerCase()}-${idx}-2`, name: `${opName} $100 Tuition Deposit`, description: 'Direct student fee portal payment', fiatPrice: 100.00, currency: 'USD', validity: 'Instant Deposit', badge: 'Popular' }
      ]
    }));
  });
});

// ==========================================
// 9. GIFTCARD
// ==========================================
const giftcardList = [
  { country: 'Global', code: 'GLOBAL', ops: ['Apple & iTunes Gift Card', 'Google Play Gift Card', 'Steam Wallet Digital Code', 'PlayStation Network (PSN) Card', 'Xbox Live Gift Card', 'Razer Gold PIN'] },
  { country: 'United States', code: 'US', ops: ['Amazon Global E-Gift Cards', 'Walmart E-Gift Card', 'Target Gift Card', 'eBay Gift Card USA'] },
  { country: 'United Kingdom', code: 'GB', ops: ['Argos UK Gift Card', 'Marks & Spencer Voucher'] },
  { country: 'India', code: 'IN', ops: ['Flipkart E-Gift Card India', 'Myntra Voucher'] },
  { country: 'Canada', code: 'CA', ops: ['Canadian Tire Gift Card', 'Tim Hortons E-Card'] },
  { country: 'Australia', code: 'AU', ops: ['Woolworths Wish Gift Card'] }
];

giftcardList.forEach(c => {
  c.ops.forEach((opName, idx) => {
    const slug = opName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    providers.push(p({
      id: `prov-gift-${c.code.toLowerCase()}-${slug}`,
      name: opName,
      category: 'giftcard',
      country: c.country,
      countryCode: c.code,
      supportsCustomAmount: false,
      supportsFixedPackages: true,
      accountLabel: 'Recipient Email Address / Phone',
      accountPlaceholder: 'Enter email to receive code',
      designations: ['Digital Gift Code', 'Store Voucher Redemption', 'E-Wallet Refill PIN'],
      packages: [
        { id: `pkg-gift-${c.code.toLowerCase()}-${idx}-1`, name: `${opName} $10 Code`, description: 'Instant digital code via email', fiatPrice: 10.00, currency: 'USD', validity: 'Instant Delivery' },
        { id: `pkg-gift-${c.code.toLowerCase()}-${idx}-2`, name: `${opName} $25 Code`, description: 'Instant digital code via email', fiatPrice: 25.00, currency: 'USD', validity: 'Instant Delivery', badge: 'Popular' },
        { id: `pkg-gift-${c.code.toLowerCase()}-${idx}-3`, name: `${opName} $50 Code`, description: 'Instant digital code via email', fiatPrice: 50.00, currency: 'USD', validity: 'Instant Delivery', badge: 'Best Value' }
      ]
    }));
  });
});

// ==========================================
// 10. VOUCHER
// ==========================================
const voucherList = [
  { country: 'Global', code: 'GLOBAL', ops: ['Uber Rides & Eats Cash Voucher', 'Airbnb Travel Voucher', 'Bolt Ride Credit'] },
  { country: 'United States', code: 'US', ops: ['Starbucks Coffee Voucher', 'DoorDash Gift Card', 'Uber Eats USA Voucher'] },
  { country: 'Nigeria', code: 'NG', ops: ['Jumia E-Commerce Voucher', 'Konga Online Voucher'] },
  { country: 'Kenya', code: 'KE', ops: ['Jumia Kenya Voucher', 'Naivas Supermarket Voucher'] },
  { country: 'South Africa', code: 'ZA', ops: ['Takealot Shopping Voucher', 'Woolworths SA Voucher'] },
  { country: 'United Kingdom', code: 'GB', ops: ['Deliveroo Food Voucher UK', 'Costa Coffee Voucher'] },
  { country: 'India', code: 'IN', ops: ['Swiggy Food Voucher', 'Zomato Pro Voucher'] }
];

voucherList.forEach(c => {
  c.ops.forEach((opName, idx) => {
    const slug = opName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    providers.push(p({
      id: `prov-vouch-${c.code.toLowerCase()}-${slug}`,
      name: opName,
      category: 'voucher',
      country: c.country,
      countryCode: c.code,
      supportsCustomAmount: true,
      supportsFixedPackages: true,
      accountLabel: 'Recipient Email / Phone Number',
      accountPlaceholder: 'Enter email or phone number for voucher code',
      designations: ['Retail Voucher', 'Dining & Food Delivery Pass', 'Ride-Hailing Credit'],
      packages: [
        { id: `pkg-vouch-${c.code.toLowerCase()}-${idx}-1`, name: `${opName} $10 Credit`, description: 'Digital voucher code', fiatPrice: 10.00, currency: 'USD', validity: 'Instant' },
        { id: `pkg-vouch-${c.code.toLowerCase()}-${idx}-2`, name: `${opName} $25 Credit`, description: 'Digital voucher code', fiatPrice: 25.00, currency: 'USD', validity: 'Instant', badge: 'Popular' }
      ]
    }));
  });
});

// ==========================================
// 11. BETTING
// ==========================================
const bettingList = [
  { country: 'Global', code: 'GLOBAL', ops: ['1xBet Wallet Deposit', 'Betway Global Account Deposit'] },
  { country: 'Nigeria', code: 'NG', ops: ['SportyBet Nigeria Top-up', 'Bet9ja Wallet Top-up', '1xBet Nigeria', 'PremierBet Nigeria', 'BangBet Nigeria'] },
  { country: 'Kenya', code: 'KE', ops: ['SportyBet Kenya', 'MozzartBet Kenya', 'Betika Kenya Top-up'] },
  { country: 'Ghana', code: 'GH', ops: ['SportyBet Ghana', 'Betway Ghana', 'Soccabet Ghana'] },
  { country: 'South Africa', code: 'ZA', ops: ['Betway South Africa', 'Hollywoodbets Top-up'] },
  { country: 'United Kingdom', code: 'GB', ops: ['Bet365 UK Wallet', 'Ladbrokes UK Account Deposit'] }
];

bettingList.forEach(c => {
  c.ops.forEach((opName, idx) => {
    const slug = opName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    providers.push(p({
      id: `prov-bet-${c.code.toLowerCase()}-${slug}`,
      name: opName,
      category: 'betting',
      country: c.country,
      countryCode: c.code,
      accountLabel: 'User Account ID / Phone Number',
      accountPlaceholder: `Enter registered account ID or phone`,
      designations: ['Wallet Instant Top-up', 'Sportsbook Deposit', 'Casino Balance Credit'],
      packages: [
        { id: `pkg-bet-${c.code.toLowerCase()}-${idx}-1`, name: `${opName} $5 Deposit`, description: 'Instant wallet deposit', fiatPrice: 5.00, currency: 'USD', validity: 'Instant' },
        { id: `pkg-bet-${c.code.toLowerCase()}-${idx}-2`, name: `${opName} $20 Deposit`, description: 'Instant wallet deposit', fiatPrice: 20.00, currency: 'USD', validity: 'Instant', badge: 'Popular' }
      ]
    }));
  });
});

// ==========================================
// 12. GAMING
// ==========================================
const gamingList = [
  { country: 'Global', code: 'GLOBAL', ops: [
    'PUBG Mobile Unknown Cash (UC)', 'Free Fire Diamonds Top-Up', 'Roblox Robux Digital Code',
    'Mobile Legends Diamonds', 'Valorant Points Code', 'Call of Duty COD Points',
    'League of Legends RP', 'Genshin Impact Genesis Crystals'
  ]}
];

gamingList.forEach(c => {
  c.ops.forEach((opName, idx) => {
    const slug = opName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    providers.push(p({
      id: `prov-game-${c.code.toLowerCase()}-${slug}`,
      name: opName,
      category: 'gaming',
      country: c.country,
      countryCode: c.code,
      accountLabel: 'Player ID / Character UID',
      accountPlaceholder: 'Enter in-game Player ID or UID',
      designations: ['In-Game Currency Recharge', 'Battle Pass Activation', 'Exclusive Skin Voucher'],
      packages: [
        { id: `pkg-game-${c.code.toLowerCase()}-${idx}-1`, name: `${opName} Starter Pack`, description: 'Direct player UID top-up', fiatPrice: 2.99, currency: 'USD', validity: 'Instant' },
        { id: `pkg-game-${c.code.toLowerCase()}-${idx}-2`, name: `${opName} Mega Value Pack`, description: 'Direct player UID top-up + bonus', fiatPrice: 9.99, currency: 'USD', validity: 'Instant', badge: 'Popular' },
        { id: `pkg-game-${c.code.toLowerCase()}-${idx}-3`, name: `${opName} Ultimate Pass`, description: 'Maximum currency bundle', fiatPrice: 49.99, currency: 'USD', validity: 'Instant', badge: 'Best Value' }
      ]
    }));
  });
});

// ==========================================
// 13. STREAMING
// ==========================================
const streamingList = [
  { country: 'Global', code: 'GLOBAL', ops: [
    'Netflix Subscription Voucher', 'Spotify Premium Gift Voucher', 'YouTube Premium Credit',
    'Disney+ Gift Code', 'Apple Music Voucher', 'Crunchyroll Premium Pass',
    'Amazon Prime Video Code', 'Deezer Premium Pass'
  ]}
];

streamingList.forEach(c => {
  c.ops.forEach((opName, idx) => {
    const slug = opName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    providers.push(p({
      id: `prov-stream-${c.code.toLowerCase()}-${slug}`,
      name: opName,
      category: 'streaming',
      country: c.country,
      countryCode: c.code,
      accountLabel: 'Recipient Email / Account Ref',
      accountPlaceholder: 'Enter email address for gift code',
      designations: ['Monthly Subscription Code', 'Annual VIP Streaming Pass', 'Family Plan Voucher'],
      packages: [
        { id: `pkg-stream-${c.code.toLowerCase()}-${idx}-1`, name: `${opName} 1 Month Pass`, description: 'Instant voucher code', fiatPrice: 10.00, currency: 'USD', validity: '30 Days' },
        { id: `pkg-stream-${c.code.toLowerCase()}-${idx}-2`, name: `${opName} 3 Month Pass`, description: 'Instant voucher code', fiatPrice: 28.00, currency: 'USD', validity: '90 Days', badge: 'Popular' }
      ]
    }));
  });
});

// ==========================================
// 14. INSURANCE
// ==========================================
const insuranceList = [
  { country: 'Nigeria', code: 'NG', ops: ['Leadway Assurance Nigeria', 'AIICO Insurance Premium', 'AXA Mansard Insurance', 'Custodian Investment Insurance'] },
  { country: 'South Africa', code: 'ZA', ops: ['Sanlam Life Insurance Cover', 'Discovery Health & Drive', 'Old Mutual South Africa'] },
  { country: 'Kenya', code: 'KE', ops: ['Jubilee Insurance Kenya', 'CIC Insurance Group Kenya'] },
  { country: 'United States', code: 'US', ops: ['Geico Auto Insurance Premium', 'State Farm Policy Payment'] },
  { country: 'United Kingdom', code: 'GB', ops: ['Aviva Insurance UK', 'AXA UK Insurance'] },
  { country: 'India', code: 'IN', ops: ['LIC India Life Insurance', 'HDFC ERGO General Insurance'] }
];

insuranceList.forEach(c => {
  c.ops.forEach((opName, idx) => {
    const slug = opName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    providers.push(p({
      id: `prov-ins-${c.code.toLowerCase()}-${slug}`,
      name: opName,
      category: 'insurance',
      country: c.country,
      countryCode: c.code,
      accountLabel: 'Policy Number / National ID',
      accountPlaceholder: `Enter ${c.country} policy number or ID`,
      designations: ['Health Insurance Premium', 'Life Cover Policy Payment', 'Auto / Motor Vehicle Insurance', 'Property / Home Protection'],
      packages: [
        { id: `pkg-ins-${c.code.toLowerCase()}-${idx}-1`, name: `${opName} $20 Premium Settlement`, description: 'Direct insurer ledger settlement', fiatPrice: 20.00, currency: 'USD', validity: 'Instant Credit' },
        { id: `pkg-ins-${c.code.toLowerCase()}-${idx}-2`, name: `${opName} $50 Policy Payment`, description: 'Direct insurer ledger settlement', fiatPrice: 50.00, currency: 'USD', validity: 'Instant Credit', badge: 'Popular' }
      ]
    }));
  });
});

// ==========================================
// 15. GOVERNMENT
// ==========================================
const govList = [
  { country: 'Nigeria', code: 'NG', ops: ['Remita TSA Govt Taxes & Passports', 'Federal Inland Revenue (FIRS) Taxes', 'FRSC Driver License Renewal'] },
  { country: 'Kenya', code: 'KE', ops: ['Kenya eCitizen Portal Services', 'KRA iTax Tax Settlement'] },
  { country: 'South Africa', code: 'ZA', ops: ['SARS Tax Payment South Africa', 'eNaTIS Vehicle License'] },
  { country: 'United States', code: 'US', ops: ['US Internal Revenue Service (IRS) Direct', 'DMV Registration Renewal USA'] },
  { country: 'United Kingdom', code: 'GB', ops: ['GOV.UK Vehicle Tax & Passport Fees'] },
  { country: 'India', code: 'IN', ops: ['Income Tax India Portal', 'Parivahan Driving License Portal'] }
];

govList.forEach(c => {
  c.ops.forEach((opName, idx) => {
    const slug = opName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    providers.push(p({
      id: `prov-gov-${c.code.toLowerCase()}-${slug}`,
      name: opName,
      category: 'government',
      country: c.country,
      countryCode: c.code,
      accountLabel: 'RRR / Reference ID / Taxpayer ID',
      accountPlaceholder: `Enter government reference or tax ID`,
      designations: ['Passport Renewal Fee', 'Driver License Renewal', 'Civic Tax & Levy Payment', 'Public Service Clearance Fee'],
      packages: [
        { id: `pkg-gov-${c.code.toLowerCase()}-${idx}-1`, name: `${opName} $15 Fee Settlement`, description: 'Direct government Treasury settlement', fiatPrice: 15.00, currency: 'USD', validity: 'Instant Receipt' },
        { id: `pkg-gov-${c.code.toLowerCase()}-${idx}-2`, name: `${opName} $50 Duty Clearance`, description: 'Direct government Treasury settlement', fiatPrice: 50.00, currency: 'USD', validity: 'Instant Receipt', badge: 'Popular' }
      ]
    }));
  });
});

// ==========================================
// 16. TRANSPORT
// ==========================================
const transList = [
  { country: 'Global', code: 'GLOBAL', ops: ['Global Airline Flight Voucher', 'Emirates Airline Flight Voucher', 'Qatar Airways Flight Pass'] },
  { country: 'Nigeria', code: 'NG', ops: ['Nigerian Railway Corp (NRC) Train Pass', 'Peace Mass Transit Ticket'] },
  { country: 'Kenya', code: 'KE', ops: ['SGR Madaraka Express Train Kenya'] },
  { country: 'United States', code: 'US', ops: ['Amtrak Train Travel Voucher', 'Greyhound Bus Pass USA'] },
  { country: 'United Kingdom', code: 'GB', ops: ['National Rail UK E-Ticket'] },
  { country: 'India', code: 'IN', ops: ['IRCTC Railway E-Ticket India'] }
];

transList.forEach(c => {
  c.ops.forEach((opName, idx) => {
    const slug = opName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    providers.push(p({
      id: `prov-trans-${c.code.toLowerCase()}-${slug}`,
      name: opName,
      category: 'transport',
      country: c.country,
      countryCode: c.code,
      accountLabel: 'Passenger Name / PNR / Ticket Ref',
      accountPlaceholder: `Enter PNR or passenger email`,
      designations: ['Airline Flight E-Voucher', 'High-Speed Rail Ticket', 'Inter-City Express Bus Pass'],
      packages: [
        { id: `pkg-trans-${c.code.toLowerCase()}-${idx}-1`, name: `${opName} $30 Travel Pass`, description: 'Instant transit e-voucher', fiatPrice: 30.00, currency: 'USD', validity: 'Instant' },
        { id: `pkg-trans-${c.code.toLowerCase()}-${idx}-2`, name: `${opName} $100 Long-Haul Pass`, description: 'Instant transit e-voucher', fiatPrice: 100.00, currency: 'USD', validity: 'Instant', badge: 'Popular' }
      ]
    }));
  });
});

// ==========================================
// 17. EVENTS
// ==========================================
const eventList = [
  { country: 'Global', code: 'GLOBAL', ops: ['Eventbrite Global Summit Tickets', 'Ticketmaster Global Pass'] },
  { country: 'United States', code: 'US', ops: ['StubHub Event Pass USA'] },
  { country: 'United Kingdom', code: 'GB', ops: ['AXS UK Event Pass'] },
  { country: 'Nigeria', code: 'NG', ops: ['Nairabox Event Pass Nigeria', 'Afritickets Pass'] },
  { country: 'Kenya', code: 'KE', ops: ['Tiketi.com Kenya Event Voucher'] },
  { country: 'South Africa', code: 'ZA', ops: ['Computicket South Africa Pass'] }
];

eventList.forEach(c => {
  c.ops.forEach((opName, idx) => {
    const slug = opName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    providers.push(p({
      id: `prov-event-${c.code.toLowerCase()}-${slug}`,
      name: opName,
      category: 'events',
      country: c.country,
      countryCode: c.code,
      accountLabel: 'Attendee Email Address / Registration Ref',
      accountPlaceholder: `Enter attendee email for QR pass`,
      designations: ['Concert & Live Show Pass', 'Tech Summit VIP Pass', 'Sports Match Ticket'],
      packages: [
        { id: `pkg-event-${c.code.toLowerCase()}-${idx}-1`, name: `${opName} General Admission`, description: 'QR code entry pass sent to email', fiatPrice: 15.00, currency: 'USD', validity: 'Event Day' },
        { id: `pkg-event-${c.code.toLowerCase()}-${idx}-2`, name: `${opName} VIP Access Pass`, description: 'Priority entry + lounge access', fiatPrice: 75.00, currency: 'USD', validity: 'Event Day', badge: 'VIP' }
      ]
    }));
  });
});

// ==========================================
// 18. ECOMMERCE
// ==========================================
const ecomList = [
  { country: 'Global', code: 'GLOBAL', ops: ['PiNova Store Credit Voucher', 'eBay Global Gift Certificate', 'AliExpress Shopping Coupon'] },
  { country: 'United States', code: 'US', ops: ["Macy's Store Credit USA", 'Sephora E-Gift Card USA'] },
  { country: 'United Kingdom', code: 'GB', ops: ['ASOS E-Gift Card UK'] },
  { country: 'India', code: 'IN', ops: ['Myntra Fashion Voucher India'] },
  { country: 'Nigeria', code: 'NG', ops: ['Shoprite Shopping Voucher Nigeria'] }
];

ecomList.forEach(c => {
  c.ops.forEach((opName, idx) => {
    const slug = opName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    providers.push(p({
      id: `prov-ecom-${c.code.toLowerCase()}-${slug}`,
      name: opName,
      category: 'ecommerce',
      country: c.country,
      countryCode: c.code,
      accountLabel: 'Recipient Email / Phone Number',
      accountPlaceholder: `Enter email for store voucher code`,
      designations: ['Store Credit Digital Voucher', 'Shopping Gift Card', 'Checkout Coupon Code'],
      packages: [
        { id: `pkg-ecom-${c.code.toLowerCase()}-${idx}-1`, name: `${opName} $10 Shopping Voucher`, description: 'Digital voucher for online checkout', fiatPrice: 10.00, currency: 'USD', validity: 'Instant' },
        { id: `pkg-ecom-${c.code.toLowerCase()}-${idx}-2`, name: `${opName} $50 Shopping Voucher`, description: 'Digital voucher for online checkout', fiatPrice: 50.00, currency: 'USD', validity: 'Instant', badge: 'Popular' }
      ]
    }));
  });
});

// ==========================================
// VALIDATION ROUTINE
// ==========================================
console.log(`\n==============================================`);
console.log(`RUNNING FULL UTILITY DATASET VALIDATION (${providers.length} Total Providers)`);
console.log(`==============================================\n`);

const errors = [];
const idMap = new Set();

providers.forEach((prov, idx) => {
  if (!prov.id) errors.push(`[#${idx}] Missing id`);
  if (idMap.has(prov.id)) errors.push(`Duplicate ID: ${prov.id}`);
  idMap.add(prov.id);

  if (!prov.name) errors.push(`[${prov.id}] Missing name`);
  if (!prov.category || !VALID_CATEGORIES.includes(prov.category)) errors.push(`[${prov.id}] Invalid category: ${prov.category}`);
  if (!prov.country) errors.push(`[${prov.id}] Missing country`);
  if (!prov.countryCode) errors.push(`[${prov.id}] Missing countryCode`);
  if (!prov.accountLabel) errors.push(`[${prov.id}] Missing accountLabel`);
  if (!prov.accountPlaceholder) errors.push(`[${prov.id}] Missing accountPlaceholder`);
  if (typeof prov.supportsCustomAmount !== 'boolean') errors.push(`[${prov.id}] Invalid supportsCustomAmount`);
  if (typeof prov.supportsFixedPackages !== 'boolean') errors.push(`[${prov.id}] Invalid supportsFixedPackages`);
  if (typeof prov.hasDirectValidationApi !== 'boolean') errors.push(`[${prov.id}] Invalid hasDirectValidationApi`);
  if (!Array.isArray(prov.designations) || prov.designations.length === 0) errors.push(`[${prov.id}] Missing designations`);
  if (!Array.isArray(prov.packages) || prov.packages.length === 0) errors.push(`[${prov.id}] Missing packages`);
});

if (errors.length > 0) {
  console.error('FAILED VALIDATION WITH ERRORS:');
  console.error(errors);
  process.exit(1);
} else {
  console.log('✅ ALL PROVIDERS PASSED SCHEMA & INTEGRITY VALIDATION (0 ERRORS)\n');
}

// Print breakdown
console.log('==============================================');
console.log('CATEGORY BREAKDOWN & GLOBAL MARKETPLACE COVERAGE');
console.log('==============================================\n');

VALID_CATEGORIES.forEach((cat, index) => {
  const catProvs = providers.filter(p => p.category === cat);
  const countries = Array.from(new Set(catProvs.map(p => p.countryCode)));
  console.log(`[${index + 1}/18] Category: ${cat.toUpperCase()}`);
  console.log(`   Provider Count: ${catProvs.length}`);
  console.log(`   Country Count: ${countries.length}`);
  console.log(`   Countries: ${countries.join(', ')}`);
  
  countries.forEach(cCode => {
    const matched = catProvs.filter(p => p.countryCode === cCode);
    console.log(`     -> ${cCode} (${matched[0].country}): ${matched.map(m => m.name).join(' | ')}`);
  });
  console.log('');
});

// Output code file
const fileHeader = `import { UtilityServiceProvider, PiConversionConfig, ConversionRateLog, UtilityTransactionReceipt } from '../types/utility';

export const INITIAL_PI_CONVERSION_CONFIG: PiConversionConfig = {
  piRateUsd: 10.00, // Default: 1 Pi = $10.00 USD
  minPurchasePi: 0.000001,
  maxPurchasePi: 1000.00,
  currencyCode: 'USD',
  currencySymbol: '$',
  autoRateUpdateEnabled: true,
  autoUpdateSource: 'Pi Market Index Oracle API',
  lastUpdated: new Date().toISOString(),
  updatedBy: 'System Governance Engine'
};

export const INITIAL_CONVERSION_RATE_LOGS: ConversionRateLog[] = [
  {
    id: 'RATE-LOG-101',
    previousRateUsd: 8.50,
    newRateUsd: 10.00,
    reason: 'Pi Ecosystem Global Commerce Rate Adjustment',
    updatedBy: 'Platform_Admin',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'RATE-LOG-102',
    previousRateUsd: 10.00,
    newRateUsd: 10.00,
    reason: 'Routine Oracle Price Feed Verification',
    updatedBy: 'Oracle_Automated_Bot',
    timestamp: new Date(Date.now() - 3600000 * 6).toISOString()
  }
];

export const UTILITY_CATEGORY_META: Record<string, { title: string; description: string; iconName: string; color: string }> = {
  airtime: {
    title: 'Airtime Recharge',
    description: 'Instant mobile top-up for global telecom carriers.',
    iconName: 'Smartphone',
    color: 'from-emerald-500 to-teal-600'
  },
  data: {
    title: 'Mobile Data Bundles',
    description: 'High-speed 4G/5G data packages for all networks.',
    iconName: 'Wifi',
    color: 'from-blue-500 to-indigo-600'
  },
  electricity: {
    title: 'Electricity Bills',
    description: 'Instant prepaid meter token generation & postpaid bill settlement.',
    iconName: 'Zap',
    color: 'from-amber-500 to-orange-600'
  },
  cable: {
    title: 'Cable TV Subscriptions',
    description: 'Pay DStv, GOtv, StarTimes, Canal+, and Sky packages instantly.',
    iconName: 'Tv',
    color: 'from-purple-500 to-violet-600'
  },
  internet: {
    title: 'Internet & Starlink',
    description: 'Starlink, fiber broadband, and 4G Wi-Fi subscriptions.',
    iconName: 'Globe',
    color: 'from-cyan-500 to-blue-600'
  },
  water: {
    title: 'Water Bills',
    description: 'Municipal and utility water bill settlement with instant receipts.',
    iconName: 'Droplets',
    color: 'from-sky-500 to-blue-600'
  },
  exam: {
    title: 'Exam Cards & E-PINs',
    description: 'WAEC Direct result pins, JAMB UTME PINs, and NECO tokens.',
    iconName: 'GraduationCap',
    color: 'from-indigo-500 to-purple-600'
  },
  education: {
    title: 'Education Payments',
    description: 'University tuition fees, school fee portal deposits, and e-learning.',
    iconName: 'BookOpen',
    color: 'from-rose-500 to-pink-600'
  },
  giftcard: {
    title: 'Global Gift Cards',
    description: 'Amazon, Apple, Google Play, Steam, PlayStation, and Xbox vouchers.',
    iconName: 'Gift',
    color: 'from-amber-400 to-rose-500'
  },
  voucher: {
    title: 'Digital Vouchers',
    description: 'Uber Cash, Starbucks, shopping vouchers, and store credits.',
    iconName: 'Ticket',
    color: 'from-fuchsia-500 to-pink-600'
  },
  betting: {
    title: 'Betting Wallet Top-up',
    description: 'Instant deposit to registered betting accounts (where permitted).',
    iconName: 'Coins',
    color: 'from-emerald-600 to-green-700'
  },
  gaming: {
    title: 'Gaming Top-ups',
    description: 'Free Fire Diamonds, PUBG UC, Roblox Robux, and Valorant Points.',
    iconName: 'Gamepad2',
    color: 'from-red-500 to-rose-600'
  },
  streaming: {
    title: 'Streaming Subscriptions',
    description: 'Netflix, Spotify Premium, Apple Music, and Disney+ vouchers.',
    iconName: 'Film',
    color: 'from-red-600 to-amber-600'
  },
  insurance: {
    title: 'Insurance Payments',
    description: 'Health, travel, auto, and property insurance premium payments.',
    iconName: 'Shield',
    color: 'from-teal-500 to-emerald-600'
  },
  government: {
    title: 'Government Services',
    description: 'Municipal taxes, passport renewal fees, and civic levies.',
    iconName: 'Building2',
    color: 'from-slate-600 to-slate-800'
  },
  transport: {
    title: 'Transport Tickets',
    description: 'Airline flight e-vouchers, railway passes, and bus fares.',
    iconName: 'Plane',
    color: 'from-blue-600 to-indigo-700'
  },
  events: {
    title: 'Event & Conference Tickets',
    description: 'Concerts, sports matches, and tech summit VIP access passes.',
    iconName: 'Ticket',
    color: 'from-purple-600 to-pink-600'
  },
  ecommerce: {
    title: 'Store Credit Vouchers',
    description: 'PiNova Store Credit, eBay, and global retail gift certificates.',
    iconName: 'ShoppingBag',
    color: 'from-amber-500 to-indigo-600'
  }
};

export const SAMPLE_UTILITY_PROVIDERS: UtilityServiceProvider[] = ${JSON.stringify(providers, null, 2)};
`;

const targetPath = path.join(__dirname, '../src/data/utilityData.ts');
fs.writeFileSync(targetPath, fileHeader, 'utf8');
console.log(`\n✅ SUCCESSFULLY WRITTEN NEW GLOBAL DATASET TO ${targetPath}`);
