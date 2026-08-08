export interface AirtimeCountry {
  code: string; // ISO 2 Code (e.g. 'NG', 'KE', 'IN')
  name: string; // 'Nigeria'
  flag: string; // '🇳🇬'
  dialCode: string; // '+234'
  placeholder: string; // '0803 123 4567'
  digitsHint: string; // '10 or 11 digits starting with 07, 08, 09 or +234'
}

export const AIRTIME_COUNTRIES: AirtimeCountry[] = [
  {
    code: 'NG',
    name: 'Nigeria',
    flag: '🇳🇬',
    dialCode: '+234',
    placeholder: '0803 123 4567 or +234 803 123 4567',
    digitsHint: '10-11 digits (e.g. 08031234567 or +2348031234567)'
  },
  {
    code: 'KE',
    name: 'Kenya',
    flag: '🇰🇪',
    dialCode: '+254',
    placeholder: '0712 345 678 or +254 712 345 678',
    digitsHint: '9-10 digits (e.g. 0712345678 or +254712345678)'
  },
  {
    code: 'GH',
    name: 'Ghana',
    flag: '🇬🇭',
    dialCode: '+233',
    placeholder: '024 123 4567 or +233 24 123 4567',
    digitsHint: '9-10 digits (e.g. 0241234567 or +233241234567)'
  },
  {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    dialCode: '+91',
    placeholder: '98765 43210 or +91 98765 43210',
    digitsHint: '10 digits starting with 6, 7, 8, or 9'
  },
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    dialCode: '+1',
    placeholder: '(555) 019-2834 or +1 555 019 2834',
    digitsHint: '10 digits (3-digit area code + 7 digits)'
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    dialCode: '+44',
    placeholder: '07911 123456 or +44 7911 123456',
    digitsHint: '10-11 digits starting with 07 or +447'
  },
  {
    code: 'ZA',
    name: 'South Africa',
    flag: '🇿🇦',
    dialCode: '+27',
    placeholder: '082 123 4567 or +27 82 123 4567',
    digitsHint: '9-10 digits starting with 06, 07, 08 or +27'
  },
  {
    code: 'PH',
    name: 'Philippines',
    flag: '🇵🇭',
    dialCode: '+63',
    placeholder: '0917 123 4567 or +63 917 123 4567',
    digitsHint: '10-11 digits starting with 09 or +639'
  },
  {
    code: 'ID',
    name: 'Indonesia',
    flag: '🇮🇩',
    dialCode: '+62',
    placeholder: '0812 3456 7890 or +62 812 3456 7890',
    digitsHint: '10-12 digits starting with 08 or +628'
  },
  {
    code: 'VN',
    name: 'Vietnam',
    flag: '🇻🇳',
    dialCode: '+84',
    placeholder: '098 123 4567 or +84 98 123 4567',
    digitsHint: '9-10 digits starting with 03, 05, 07, 08, 09'
  }
];

export interface PhoneValidationStatus {
  isValid: boolean;
  message: string;
  formatted: string;
}

export function validateAirtimePhoneNumber(phone: string, countryCode: string): PhoneValidationStatus {
  const trimmed = phone.trim();
  if (!trimmed) {
    return {
      isValid: false,
      message: 'Please enter a mobile phone number.',
      formatted: ''
    };
  }

  // Strip all spaces, hyphens, parentheses
  const cleaned = trimmed.replace(/[\s\-\(\)]/g, '');
  const digitsOnly = cleaned.replace(/\+/g, '');

  const country = AIRTIME_COUNTRIES.find((c) => c.code === countryCode) || AIRTIME_COUNTRIES[0];

  switch (countryCode) {
    case 'NG': {
      // Nigeria (+234 or 070, 080, 081, 090, 091, 070)
      if (cleaned.startsWith('+234')) {
        if (digitsOnly.length === 13) {
          return { isValid: true, message: 'Valid Nigerian international mobile number (+234).', formatted: `+${digitsOnly}` };
        }
        return { isValid: false, message: 'Nigerian international numbers (+234) must contain 10 subscriber digits.', formatted: cleaned };
      }
      if (digitsOnly.startsWith('234') && digitsOnly.length === 13) {
        return { isValid: true, message: 'Valid Nigerian mobile number (+234).', formatted: `+${digitsOnly}` };
      }
      if (digitsOnly.startsWith('0') && digitsOnly.length === 11) {
        return { isValid: true, message: 'Valid Nigerian national mobile number (11 digits).', formatted: cleaned };
      }
      if (digitsOnly.length === 10 && ['7', '8', '9'].includes(digitsOnly[0])) {
        return { isValid: true, message: 'Valid Nigerian mobile number.', formatted: `+234${digitsOnly}` };
      }
      return { isValid: false, message: 'Enter a valid Nigerian mobile number (e.g. 0803 123 4567 or +234 803 123 4567).', formatted: cleaned };
    }

    case 'KE': {
      // Kenya (+254 or 07/01)
      if (cleaned.startsWith('+254') && digitsOnly.length === 12) {
        return { isValid: true, message: 'Valid Kenyan international mobile number (+254).', formatted: `+${digitsOnly}` };
      }
      if (digitsOnly.startsWith('254') && digitsOnly.length === 12) {
        return { isValid: true, message: 'Valid Kenyan mobile number (+254).', formatted: `+${digitsOnly}` };
      }
      if (digitsOnly.startsWith('0') && digitsOnly.length === 10) {
        return { isValid: true, message: 'Valid Kenyan national mobile number.', formatted: cleaned };
      }
      if (digitsOnly.length === 9) {
        return { isValid: true, message: 'Valid Kenyan mobile number.', formatted: `+254${digitsOnly}` };
      }
      return { isValid: false, message: 'Enter a valid Kenyan mobile number (e.g. 0712 345 678 or +254 712 345 678).', formatted: cleaned };
    }

    case 'GH': {
      // Ghana (+233 or 02/03/05)
      if (cleaned.startsWith('+233') && digitsOnly.length === 12) {
        return { isValid: true, message: 'Valid Ghanaian international mobile number (+233).', formatted: `+${digitsOnly}` };
      }
      if (digitsOnly.startsWith('0') && digitsOnly.length === 10) {
        return { isValid: true, message: 'Valid Ghanaian national mobile number.', formatted: cleaned };
      }
      if (digitsOnly.length === 9) {
        return { isValid: true, message: 'Valid Ghanaian mobile number.', formatted: `+233${digitsOnly}` };
      }
      return { isValid: false, message: 'Enter a valid Ghanaian mobile number (e.g. 024 123 4567 or +233 24 123 4567).', formatted: cleaned };
    }

    case 'IN': {
      // India (+91, 10 digits starting with 6,7,8,9)
      if (cleaned.startsWith('+91') && digitsOnly.length === 12) {
        return { isValid: true, message: 'Valid Indian international mobile number (+91).', formatted: `+${digitsOnly}` };
      }
      if (digitsOnly.startsWith('91') && digitsOnly.length === 12) {
        return { isValid: true, message: 'Valid Indian mobile number (+91).', formatted: `+${digitsOnly}` };
      }
      if (digitsOnly.length === 10 && ['6', '7', '8', '9'].includes(digitsOnly[0])) {
        return { isValid: true, message: 'Valid Indian mobile number (10 digits).', formatted: `+91${digitsOnly}` };
      }
      return { isValid: false, message: 'Enter a valid 10-digit Indian mobile number (e.g. 98765 43210).', formatted: cleaned };
    }

    case 'US': {
      // USA (+1, 10 digits)
      if (cleaned.startsWith('+1') && digitsOnly.length === 11) {
        return { isValid: true, message: 'Valid US mobile number (+1).', formatted: `+${digitsOnly}` };
      }
      if (digitsOnly.length === 10) {
        return { isValid: true, message: 'Valid US 10-digit mobile number.', formatted: `+1${digitsOnly}` };
      }
      return { isValid: false, message: 'Enter a valid 10-digit US mobile number (e.g. 555-019-2834).', formatted: cleaned };
    }

    case 'GB': {
      // UK (+44, 07xxx)
      if (cleaned.startsWith('+44') && digitsOnly.length === 12) {
        return { isValid: true, message: 'Valid UK international mobile number (+44).', formatted: `+${digitsOnly}` };
      }
      if (digitsOnly.startsWith('07') && digitsOnly.length === 11) {
        return { isValid: true, message: 'Valid UK national mobile number.', formatted: cleaned };
      }
      if (digitsOnly.length === 10 && digitsOnly.startsWith('7')) {
        return { isValid: true, message: 'Valid UK mobile number.', formatted: `+44${digitsOnly}` };
      }
      return { isValid: false, message: 'Enter a valid UK mobile number starting with 07 or +447.', formatted: cleaned };
    }

    case 'ZA': {
      // South Africa (+27, 06/07/08)
      if (cleaned.startsWith('+27') && digitsOnly.length === 11) {
        return { isValid: true, message: 'Valid South African mobile number (+27).', formatted: `+${digitsOnly}` };
      }
      if (digitsOnly.startsWith('0') && digitsOnly.length === 10) {
        return { isValid: true, message: 'Valid South African national mobile number.', formatted: cleaned };
      }
      if (digitsOnly.length === 9) {
        return { isValid: true, message: 'Valid South African mobile number.', formatted: `+27${digitsOnly}` };
      }
      return { isValid: false, message: 'Enter a valid South African mobile number (e.g. 082 123 4567).', formatted: cleaned };
    }

    case 'PH': {
      // Philippines (+63, 09xxx)
      if (cleaned.startsWith('+63') && digitsOnly.length === 12) {
        return { isValid: true, message: 'Valid Philippine mobile number (+63).', formatted: `+${digitsOnly}` };
      }
      if (digitsOnly.startsWith('09') && digitsOnly.length === 11) {
        return { isValid: true, message: 'Valid Philippine national mobile number.', formatted: cleaned };
      }
      if (digitsOnly.length === 10 && digitsOnly.startsWith('9')) {
        return { isValid: true, message: 'Valid Philippine mobile number.', formatted: `+63${digitsOnly}` };
      }
      return { isValid: false, message: 'Enter a valid Philippine mobile number starting with 09 or +639.', formatted: cleaned };
    }

    case 'ID': {
      // Indonesia (+62, 08xxx, 10-12 digits)
      if (digitsOnly.length >= 9 && digitsOnly.length <= 13) {
        return { isValid: true, message: 'Valid Indonesian mobile number.', formatted: cleaned.startsWith('+') ? cleaned : `+62${digitsOnly.replace(/^0/, '')}` };
      }
      return { isValid: false, message: 'Enter a valid Indonesian mobile number (e.g. 0812 3456 7890).', formatted: cleaned };
    }

    case 'VN': {
      // Vietnam (+84, 03/05/07/08/09)
      if (digitsOnly.length >= 9 && digitsOnly.length <= 11) {
        return { isValid: true, message: 'Valid Vietnamese mobile number.', formatted: cleaned.startsWith('+') ? cleaned : `+84${digitsOnly.replace(/^0/, '')}` };
      }
      return { isValid: false, message: 'Enter a valid Vietnamese mobile number (e.g. 098 123 4567).', formatted: cleaned };
    }

    default: {
      if (digitsOnly.length >= 8 && digitsOnly.length <= 15) {
        return { isValid: true, message: `Format matches ${country.name} phone number structure.`, formatted: cleaned };
      }
      return { isValid: false, message: `Please enter a valid phone number for ${country.name}.`, formatted: cleaned };
    }
  }
}
