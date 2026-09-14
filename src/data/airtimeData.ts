export interface AirtimeCountry {
  code: string; // ISO 2 Code (e.g. 'NG', 'KE', 'CA', 'DE')
  name: string; // 'Canada'
  flag: string; // '🇨🇦'
  dialCode: string; // '+1'
  placeholder: string; // '555 019 2834'
  digitsHint: string; // '10 digits'
}

export const AIRTIME_COUNTRIES: AirtimeCountry[] = [
  { code: 'AF', name: 'Afghanistan', flag: '🇦🇫', dialCode: '+93', placeholder: '070 123 4567', digitsHint: '9 digits starting with 07' },
  { code: 'AL', name: 'Albania', flag: '🇦🇱', dialCode: '+355', placeholder: '068 123 4567', digitsHint: '9 digits starting with 06' },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿', dialCode: '+213', placeholder: '0550 123 456', digitsHint: '9-10 digits starting with 05, 06, 07' },
  { code: 'AD', name: 'Andorra', flag: '🇦🇩', dialCode: '+376', placeholder: '312 345', digitsHint: '6 digits' },
  { code: 'AO', name: 'Angola', flag: '🇦🇴', dialCode: '+244', placeholder: '912 345 678', digitsHint: '9 digits starting with 9' },
  { code: 'AG', name: 'Antigua and Barbuda', flag: '🇦🇬', dialCode: '+1268', placeholder: '720 1234', digitsHint: '10 digits (+1-268)' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', dialCode: '+54', placeholder: '11 1234 5678', digitsHint: '10 digits (area code + number)' },
  { code: 'AM', name: 'Armenia', flag: '🇦🇲', dialCode: '+374', placeholder: '091 123456', digitsHint: '8 digits starting with 0' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61', placeholder: '0412 345 678', digitsHint: '9-10 digits starting with 04' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', dialCode: '+43', placeholder: '0664 1234567', digitsHint: '10-11 digits starting with 06' },
  { code: 'AZ', name: 'Azerbaijan', flag: '🇦🇿', dialCode: '+994', placeholder: '050 123 4567', digitsHint: '9 digits starting with 0' },
  { code: 'BS', name: 'Bahamas', flag: '🇧🇸', dialCode: '+1242', placeholder: '357 1234', digitsHint: '10 digits (+1-242)' },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭', dialCode: '+973', placeholder: '3912 3456', digitsHint: '8 digits starting with 3' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', dialCode: '+880', placeholder: '01712 345678', digitsHint: '11 digits starting with 01' },
  { code: 'BB', name: 'Barbados', flag: '🇧🇧', dialCode: '+1246', placeholder: '230 1234', digitsHint: '10 digits (+1-246)' },
  { code: 'BY', name: 'Belarus', flag: '🇧🇾', dialCode: '+375', placeholder: '29 123 4567', digitsHint: '9 digits' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', dialCode: '+32', placeholder: '0470 12 34 56', digitsHint: '9-10 digits starting with 04' },
  { code: 'BZ', name: 'Belize', flag: '🇧🇿', dialCode: '+501', placeholder: '610 1234', digitsHint: '7 digits starting with 6' },
  { code: 'BJ', name: 'Benin', flag: '🇧🇯', dialCode: '+229', placeholder: '97 12 34 56', digitsHint: '8 digits' },
  { code: 'BT', name: 'Bhutan', flag: '🇧🇹', dialCode: '+975', placeholder: '17 12 34 56', digitsHint: '8 digits starting with 17 or 77' },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴', dialCode: '+591', placeholder: '7123 4567', digitsHint: '8 digits starting with 6 or 7' },
  { code: 'BA', name: 'Bosnia and Herzegovina', flag: '🇧🇦', dialCode: '+387', placeholder: '061 123 456', digitsHint: '8-9 digits starting with 06' },
  { code: 'BW', name: 'Botswana', flag: '🇧🇼', dialCode: '+267', placeholder: '71 234 567', digitsHint: '8 digits starting with 7' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', dialCode: '+55', placeholder: '11 91234 5678', digitsHint: '11 digits (area code + 9xxxx-xxxx)' },
  { code: 'BN', name: 'Brunei', flag: '🇧🇳', dialCode: '+673', placeholder: '712 3456', digitsHint: '7 digits starting with 7 or 8' },
  { code: 'BG', name: 'Bulgaria', flag: '🇧🇬', dialCode: '+359', placeholder: '088 123 4567', digitsHint: '9 digits starting with 08 or 09' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', dialCode: '+226', placeholder: '70 12 34 56', digitsHint: '8 digits starting with 6, 7, 5' },
  { code: 'BI', name: 'Burundi', flag: '🇧🇮', dialCode: '+257', placeholder: '79 12 34 56', digitsHint: '8 digits' },
  { code: 'KH', name: 'Cambodia', flag: '🇰🇭', dialCode: '+855', placeholder: '012 345 678', digitsHint: '8-9 digits' },
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲', dialCode: '+237', placeholder: '6 71 23 45 67', digitsHint: '9 digits starting with 6' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1', placeholder: '(416) 555-0123', digitsHint: '10 digits (area code + 7 digits)' },
  { code: 'CV', name: 'Cape Verde', flag: '🇨🇻', dialCode: '+238', placeholder: '991 12 34', digitsHint: '7 digits' },
  { code: 'CF', name: 'Central African Republic', flag: '🇨🇫', dialCode: '+236', placeholder: '75 12 34 56', digitsHint: '8 digits' },
  { code: 'TD', name: 'Chad', flag: '🇹🇩', dialCode: '+235', placeholder: '66 12 34 56', digitsHint: '8 digits' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', dialCode: '+56', placeholder: '9 1234 5678', digitsHint: '9 digits starting with 9' },
  { code: 'CN', name: 'China', flag: '🇨🇳', dialCode: '+86', placeholder: '138 1234 5678', digitsHint: '11 digits starting with 1' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', dialCode: '+57', placeholder: '300 123 4567', digitsHint: '10 digits starting with 3' },
  { code: 'KM', name: 'Comoros', flag: '🇰🇲', dialCode: '+269', placeholder: '321 12 34', digitsHint: '7 digits' },
  { code: 'CG', name: 'Congo', flag: '🇨🇬', dialCode: '+242', placeholder: '06 123 4567', digitsHint: '9 digits' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷', dialCode: '+506', placeholder: '8312 3456', digitsHint: '8 digits starting with 8 or 6' },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷', dialCode: '+385', placeholder: '091 123 4567', digitsHint: '8-9 digits starting with 09' },
  { code: 'CU', name: 'Cuba', flag: '🇨🇺', dialCode: '+53', placeholder: '5 123 4567', digitsHint: '8 digits starting with 5' },
  { code: 'CY', name: 'Cyprus', flag: '🇨🇾', dialCode: '+357', placeholder: '99 123456', digitsHint: '8 digits starting with 9' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', dialCode: '+420', placeholder: '601 123 456', digitsHint: '9 digits starting with 6 or 7' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', dialCode: '+45', placeholder: '20 12 34 56', digitsHint: '8 digits' },
  { code: 'DJ', name: 'Djibouti', flag: '🇩🇯', dialCode: '+253', placeholder: '77 12 34 56', digitsHint: '8 digits' },
  { code: 'DM', name: 'Dominica', flag: '🇩🇲', dialCode: '+1767', placeholder: '235 1234', digitsHint: '10 digits (+1-767)' },
  { code: 'DO', name: 'Dominican Republic', flag: '🇩🇴', dialCode: '+1809', placeholder: '809 123 4567', digitsHint: '10 digits (+1-809 / 829 / 849)' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨', dialCode: '+593', placeholder: '099 123 4567', digitsHint: '9 digits starting with 09' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', dialCode: '+20', placeholder: '010 1234 5678', digitsHint: '10-11 digits starting with 010, 011, 012, 015' },
  { code: 'SV', name: 'El Salvador', flag: '🇸🇻', dialCode: '+503', placeholder: '7123 4567', digitsHint: '8 digits starting with 6 or 7' },
  { code: 'GQ', name: 'Equatorial Guinea', flag: '🇬🇶', dialCode: '+240', placeholder: '222 123 456', digitsHint: '9 digits' },
  { code: 'ER', name: 'Eritrea', flag: '🇪🇷', dialCode: '+291', placeholder: '7 123456', digitsHint: '7 digits' },
  { code: 'EE', name: 'Estonia', flag: '🇪🇪', dialCode: '+372', placeholder: '5123 4567', digitsHint: '7-8 digits' },
  { code: 'SZ', name: 'Eswatini', flag: '🇸🇿', dialCode: '+268', placeholder: '7612 3456', digitsHint: '8 digits starting with 7' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', dialCode: '+251', placeholder: '091 123 4567', digitsHint: '9-10 digits starting with 09' },
  { code: 'FJ', name: 'Fiji', flag: '🇫🇯', dialCode: '+679', placeholder: '701 2345', digitsHint: '7 digits' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', dialCode: '+358', placeholder: '040 1234567', digitsHint: '9-10 digits starting with 04 or 05' },
  { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33', placeholder: '06 12 34 56 78', digitsHint: '9-10 digits starting with 06 or 07' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦', dialCode: '+241', placeholder: '06 12 34 56', digitsHint: '8 digits' },
  { code: 'GM', name: 'Gambia', flag: '🇬🇲', dialCode: '+220', placeholder: '312 3456', digitsHint: '7 digits' },
  { code: 'GE', name: 'Georgia', flag: '🇬🇪', dialCode: '+995', placeholder: '591 12 34 56', digitsHint: '9 digits starting with 5' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49', placeholder: '0151 12345678', digitsHint: '10-11 digits starting with 015, 016, 017' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', dialCode: '+233', placeholder: '024 123 4567 or +233 24 123 4567', digitsHint: '9-10 digits (e.g. 0241234567)' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', dialCode: '+30', placeholder: '691 234 5678', digitsHint: '10 digits starting with 69' },
  { code: 'GD', name: 'Grenada', flag: '🇬🇩', dialCode: '+1473', placeholder: '415 1234', digitsHint: '10 digits (+1-473)' },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹', dialCode: '+502', placeholder: '5123 4567', digitsHint: '8 digits starting with 4 or 5' },
  { code: 'GN', name: 'Guinea', flag: '🇬🇳', dialCode: '+224', placeholder: '621 12 34 56', digitsHint: '9 digits starting with 6' },
  { code: 'GW', name: 'Guinea-Bissau', flag: '🇬🇼', dialCode: '+245', placeholder: '955 123 456', digitsHint: '9 digits' },
  { code: 'GY', name: 'Guyana', flag: '🇬🇾', dialCode: '+592', placeholder: '612 3456', digitsHint: '7 digits starting with 6' },
  { code: 'HT', name: 'Haiti', flag: '🇭🇹', dialCode: '+509', placeholder: '34 12 3456', digitsHint: '8 digits starting with 3 or 4' },
  { code: 'HN', name: 'Honduras', flag: '🇭🇳', dialCode: '+504', placeholder: '9123 4567', digitsHint: '8 digits starting with 8 or 9' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺', dialCode: '+36', placeholder: '20 123 4567', digitsHint: '9 digits starting with 20, 30, 70' },
  { code: 'IS', name: 'Iceland', flag: '🇮🇸', dialCode: '+354', placeholder: '612 3456', digitsHint: '7 digits starting with 6, 7, 8' },
  { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91', placeholder: '98765 43210 or +91 98765 43210', digitsHint: '10 digits starting with 6, 7, 8, 9' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', dialCode: '+62', placeholder: '0812 3456 7890 or +62 812 3456 7890', digitsHint: '10-12 digits starting with 08 or +628' },
  { code: 'IR', name: 'Iran', flag: '🇮🇷', dialCode: '+98', placeholder: '0912 345 6789', digitsHint: '11 digits starting with 09' },
  { code: 'IQ', name: 'Iraq', flag: '🇮🇶', dialCode: '+964', placeholder: '0770 123 4567', digitsHint: '10-11 digits starting with 07' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', dialCode: '+353', placeholder: '083 123 4567', digitsHint: '9 digits starting with 08' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', dialCode: '+972', placeholder: '050 123 4567', digitsHint: '9-10 digits starting with 05' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', dialCode: '+39', placeholder: '312 345 6789', digitsHint: '9-10 digits starting with 3' },
  { code: 'CI', name: 'Ivory Coast', flag: '🇨🇮', dialCode: '+225', placeholder: '07 12 34 56 78', digitsHint: '10 digits' },
  { code: 'JM', name: 'Jamaica', flag: '🇯🇲', dialCode: '+1876', placeholder: '876 123 4567', digitsHint: '10 digits (+1-876)' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', dialCode: '+81', placeholder: '090 1234 5678', digitsHint: '10-11 digits starting with 070, 080, 090' },
  { code: 'JO', name: 'Jordan', flag: '🇯🇴', dialCode: '+962', placeholder: '07 9123 4567', digitsHint: '9 digits starting with 07' },
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿', dialCode: '+7', placeholder: '701 123 4567', digitsHint: '10 digits starting with 7' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', dialCode: '+254', placeholder: '0712 345 678 or +254 712 345 678', digitsHint: '9-10 digits (e.g. 0712345678)' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', dialCode: '+965', placeholder: '9123 4567', digitsHint: '8 digits' },
  { code: 'KG', name: 'Kyrgyzstan', flag: '🇰🇬', dialCode: '+996', placeholder: '550 123 456', digitsHint: '9 digits' },
  { code: 'LA', name: 'Laos', flag: '🇱🇦', dialCode: '+856', placeholder: '020 1234 5678', digitsHint: '10 digits' },
  { code: 'LV', name: 'Latvia', flag: '🇱🇻', dialCode: '+371', placeholder: '2123 4567', digitsHint: '8 digits starting with 2' },
  { code: 'LB', name: 'Lebanon', flag: '🇱🇧', dialCode: '+961', placeholder: '71 123 456', digitsHint: '8 digits' },
  { code: 'LS', name: 'Lesotho', flag: '🇱🇸', dialCode: '+266', placeholder: '5812 3456', digitsHint: '8 digits starting with 5 or 6' },
  { code: 'LR', name: 'Liberia', flag: '🇱🇷', dialCode: '+231', placeholder: '77 123 456', digitsHint: '8 digits' },
  { code: 'LY', name: 'Libya', flag: '🇱🇾', dialCode: '+218', placeholder: '091 123 4567', digitsHint: '9-10 digits' },
  { code: 'LI', name: 'Liechtenstein', flag: '🇱🇮', dialCode: '+423', placeholder: '791 23 45', digitsHint: '7 digits' },
  { code: 'LT', name: 'Lithuania', flag: '🇱🇹', dialCode: '+370', placeholder: '612 34567', digitsHint: '8 digits starting with 6' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺', dialCode: '+352', placeholder: '621 123 456', digitsHint: '9 digits starting with 6' },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬', dialCode: '+261', placeholder: '032 12 345 67', digitsHint: '9-10 digits' },
  { code: 'MW', name: 'Malawi', flag: '🇲🇼', dialCode: '+265', placeholder: '099 123 4567', digitsHint: '9 digits' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', dialCode: '+60', placeholder: '012 345 6789', digitsHint: '9-10 digits starting with 01' },
  { code: 'MV', name: 'Maldives', flag: '🇲🇻', dialCode: '+960', placeholder: '712 3456', digitsHint: '7 digits starting with 7 or 9' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱', dialCode: '+223', placeholder: '65 12 34 56', digitsHint: '8 digits' },
  { code: 'MT', name: 'Malta', flag: '🇲🇹', dialCode: '+356', placeholder: '9912 3456', digitsHint: '8 digits starting with 7 or 9' },
  { code: 'MR', name: 'Mauritania', flag: '🇲🇷', dialCode: '+222', placeholder: '45 12 34 56', digitsHint: '8 digits' },
  { code: 'MU', name: 'Mauritius', flag: '🇲🇺', dialCode: '+230', placeholder: '5123 4567', digitsHint: '8 digits starting with 5' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', dialCode: '+52', placeholder: '55 1234 5678', digitsHint: '10 digits' },
  { code: 'MD', name: 'Moldova', flag: '🇲🇩', dialCode: '+373', placeholder: '069 123 456', digitsHint: '8 digits starting with 06 or 07' },
  { code: 'MC', name: 'Monaco', flag: '🇲🇨', dialCode: '+377', placeholder: '06 12 34 56 78', digitsHint: '8-9 digits' },
  { code: 'MN', name: 'Mongolia', flag: '🇲🇳', dialCode: '+976', placeholder: '8812 3456', digitsHint: '8 digits' },
  { code: 'ME', name: 'Montenegro', flag: '🇲🇪', dialCode: '+382', placeholder: '067 123 456', digitsHint: '8 digits starting with 06' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', dialCode: '+212', placeholder: '0612 345678', digitsHint: '9-10 digits starting with 06 or 07' },
  { code: 'MZ', name: 'Mozambique', flag: '🇲🇿', dialCode: '+258', placeholder: '82 123 4567', digitsHint: '9 digits starting with 82, 84, 85, 86, 87' },
  { code: 'MM', name: 'Myanmar', flag: '🇲🇲', dialCode: '+95', placeholder: '09 1234 5678', digitsHint: '9-10 digits starting with 09' },
  { code: 'NA', name: 'Namibia', flag: '🇳🇦', dialCode: '+264', placeholder: '081 123 4567', digitsHint: '9 digits' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵', dialCode: '+977', placeholder: '9841 234567', digitsHint: '10 digits starting with 98' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', dialCode: '+31', placeholder: '06 12345678', digitsHint: '9-10 digits starting with 06' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', dialCode: '+64', placeholder: '021 123 4567', digitsHint: '8-10 digits starting with 02' },
  { code: 'NI', name: 'Nicaragua', flag: '🇳🇮', dialCode: '+505', placeholder: '8123 4567', digitsHint: '8 digits starting with 8' },
  { code: 'NE', name: 'Niger', flag: '🇳🇪', dialCode: '+227', placeholder: '96 12 34 56', digitsHint: '8 digits' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', dialCode: '+234', placeholder: '0803 123 4567 or +234 803 123 4567', digitsHint: '10-11 digits (e.g. 08031234567)' },
  { code: 'MK', name: 'North Macedonia', flag: '🇲🇰', dialCode: '+389', placeholder: '070 123 456', digitsHint: '8 digits starting with 07' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', dialCode: '+47', placeholder: '412 34 567', digitsHint: '8 digits starting with 4 or 9' },
  { code: 'OM', name: 'Oman', flag: '🇴🇲', dialCode: '+968', placeholder: '9123 4567', digitsHint: '8 digits starting with 9' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', dialCode: '+92', placeholder: '0300 1234567', digitsHint: '11 digits starting with 03' },
  { code: 'PS', name: 'Palestine', flag: '🇵🇸', dialCode: '+970', placeholder: '059 912 3456', digitsHint: '9 digits' },
  { code: 'PA', name: 'Panama', flag: '🇵🇦', dialCode: '+507', placeholder: '6123 4567', digitsHint: '8 digits starting with 6' },
  { code: 'PG', name: 'Papua New Guinea', flag: '🇵🇬', dialCode: '+675', placeholder: '7123 4567', digitsHint: '8 digits' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾', dialCode: '+595', placeholder: '0981 123 456', digitsHint: '9 digits starting with 09' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', dialCode: '+51', placeholder: '912 345 678', digitsHint: '9 digits starting with 9' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', dialCode: '+63', placeholder: '0917 123 4567 or +63 917 123 4567', digitsHint: '10-11 digits starting with 09' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', dialCode: '+48', placeholder: '512 345 678', digitsHint: '9 digits' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', dialCode: '+351', placeholder: '912 345 678', digitsHint: '9 digits starting with 9' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', dialCode: '+974', placeholder: '3312 3456', digitsHint: '8 digits' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴', dialCode: '+40', placeholder: '0712 345 678', digitsHint: '10 digits starting with 07' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', dialCode: '+7', placeholder: '912 345-67-89', digitsHint: '10 digits starting with 9' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', dialCode: '+250', placeholder: '078 123 4567', digitsHint: '9 digits starting with 07' },
  { code: 'LC', name: 'Saint Lucia', flag: '🇱🇨', dialCode: '+1758', placeholder: '484 1234', digitsHint: '10 digits (+1-758)' },
  { code: 'WS', name: 'Samoa', flag: '🇼🇸', dialCode: '+685', placeholder: '721 2345', digitsHint: '7 digits' },
  { code: 'SM', name: 'San Marino', flag: '🇸🇲', dialCode: '+378', placeholder: '66 12 34 56', digitsHint: '8-10 digits' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '+966', placeholder: '050 123 4567', digitsHint: '9-10 digits starting with 05' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳', dialCode: '+221', placeholder: '77 123 45 67', digitsHint: '9 digits starting with 7' },
  { code: 'RS', name: 'Serbia', flag: '🇷🇸', dialCode: '+381', placeholder: '064 1234567', digitsHint: '8-9 digits starting with 06' },
  { code: 'SC', name: 'Seychelles', flag: '🇸🇨', dialCode: '+248', placeholder: '2 51 23 45', digitsHint: '7 digits' },
  { code: 'SL', name: 'Sierra Leone', flag: '🇸🇱', dialCode: '+232', placeholder: '76 123 456', digitsHint: '8 digits' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', dialCode: '+65', placeholder: '8123 4567', digitsHint: '8 digits starting with 8 or 9' },
  { code: 'SK', name: 'Slovakia', flag: '🇸🇰', dialCode: '+421', placeholder: '0912 345 678', digitsHint: '9 digits starting with 09' },
  { code: 'SI', name: 'Slovenia', flag: '🇸🇮', dialCode: '+386', placeholder: '040 123 456', digitsHint: '8 digits starting with 03, 04, 05, 06, 07' },
  { code: 'SO', name: 'Somalia', flag: '🇸🇴', dialCode: '+252', placeholder: '61 234 5678', digitsHint: '8-9 digits' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', dialCode: '+27', placeholder: '082 123 4567 or +27 82 123 4567', digitsHint: '9-10 digits' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', dialCode: '+82', placeholder: '010-1234-5678', digitsHint: '10-11 digits starting with 010' },
  { code: 'SS', name: 'South Sudan', flag: '🇸🇸', dialCode: '+211', placeholder: '092 123 4567', digitsHint: '9 digits' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', dialCode: '+34', placeholder: '612 34 56 78', digitsHint: '9 digits starting with 6 or 7' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', dialCode: '+94', placeholder: '077 123 4567', digitsHint: '9 digits starting with 07' },
  { code: 'SD', name: 'Sudan', flag: '🇸🇩', dialCode: '+249', placeholder: '091 234 5678', digitsHint: '9 digits starting with 09' },
  { code: 'SR', name: 'Suriname', flag: '🇸🇷', dialCode: '+597', placeholder: '812 3456', digitsHint: '7 digits' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', dialCode: '+46', placeholder: '070 123 45 67', digitsHint: '9-10 digits starting with 07' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', dialCode: '+41', placeholder: '079 123 45 67', digitsHint: '9 digits starting with 07' },
  { code: 'SY', name: 'Syria', flag: '🇸🇾', dialCode: '+963', placeholder: '093 123 4567', digitsHint: '9 digits starting with 09' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼', dialCode: '+886', placeholder: '0912 345 678', digitsHint: '9 digits starting with 09' },
  { code: 'TJ', name: 'Tajikistan', flag: '🇹🇯', dialCode: '+992', placeholder: '918 12 3456', digitsHint: '9 digits' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', dialCode: '+255', placeholder: '0712 345 678', digitsHint: '9 digits starting with 06 or 07' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', dialCode: '+66', placeholder: '081 234 5678', digitsHint: '9-10 digits starting with 06, 08, 09' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬', dialCode: '+228', placeholder: '90 12 34 56', digitsHint: '8 digits' },
  { code: 'TT', name: 'Trinidad and Tobago', flag: '🇹🇹', dialCode: '+1868', placeholder: '312 3456', digitsHint: '10 digits (+1-868)' },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳', dialCode: '+216', placeholder: '20 123 456', digitsHint: '8 digits' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', dialCode: '+90', placeholder: '0532 123 45 67', digitsHint: '10 digits starting with 05' },
  { code: 'TM', name: 'Turkmenistan', flag: '🇹🇲', dialCode: '+993', placeholder: '65 123456', digitsHint: '8 digits' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', dialCode: '+256', placeholder: '0772 123 456', digitsHint: '9 digits starting with 07 or 03' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦', dialCode: '+380', placeholder: '050 123 4567', digitsHint: '9 digits starting with 0' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', dialCode: '+971', placeholder: '050 123 4567', digitsHint: '9 digits starting with 05' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44', placeholder: '07911 123456 or +44 7911 123456', digitsHint: '10-11 digits starting with 07' },
  { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1', placeholder: '(555) 019-2834 or +1 555 019 2834', digitsHint: '10 digits (3-digit area code + 7 digits)' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾', dialCode: '+598', placeholder: '099 123 456', digitsHint: '8 digits starting with 09' },
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿', dialCode: '+998', placeholder: '90 123 45 67', digitsHint: '9 digits' },
  { code: 'VU', name: 'Vanuatu', flag: '🇻🇺', dialCode: '+678', placeholder: '591 2345', digitsHint: '7 digits' },
  { code: 'VA', name: 'Vatican City', flag: '🇻🇦', dialCode: '+379', placeholder: '06 69812345', digitsHint: '8-10 digits' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪', dialCode: '+58', placeholder: '0412 123 4567', digitsHint: '10 digits starting with 04' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', dialCode: '+84', placeholder: '098 123 4567 or +84 98 123 4567', digitsHint: '9-10 digits starting with 03, 05, 07, 08, 09' },
  { code: 'YE', name: 'Yemen', flag: '🇾🇪', dialCode: '+967', placeholder: '771 123 456', digitsHint: '9 digits starting with 7' },
  { code: 'ZM', name: 'Zambia', flag: '🇿🇲', dialCode: '+260', placeholder: '097 123 4567', digitsHint: '9 digits starting with 09' },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼', dialCode: '+263', placeholder: '077 123 4567', digitsHint: '9 digits starting with 07' }
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
      // Nigeria (+234 or 070, 080, 081, 090, 091)
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

    case 'US':
    case 'CA': {
      // NANP (+1, 10 digits)
      if (cleaned.startsWith('+1') && digitsOnly.length === 11) {
        return { isValid: true, message: `Valid ${country.name} mobile number (+1).`, formatted: `+${digitsOnly}` };
      }
      if (digitsOnly.length === 10) {
        return { isValid: true, message: `Valid ${country.name} 10-digit mobile number.`, formatted: `+1${digitsOnly}` };
      }
      return { isValid: false, message: `Enter a valid 10-digit ${country.name} mobile number.`, formatted: cleaned };
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
      // Indonesia (+62, 08xxx)
      if (digitsOnly.length >= 9 && digitsOnly.length <= 13) {
        return { isValid: true, message: 'Valid Indonesian mobile number.', formatted: cleaned.startsWith('+') ? cleaned : `+62${digitsOnly.replace(/^0/, '')}` };
      }
      return { isValid: false, message: 'Enter a valid Indonesian mobile number (e.g. 0812 3456 7890).', formatted: cleaned };
    }

    case 'VN': {
      // Vietnam (+84)
      if (digitsOnly.length >= 9 && digitsOnly.length <= 11) {
        return { isValid: true, message: 'Valid Vietnamese mobile number.', formatted: cleaned.startsWith('+') ? cleaned : `+84${digitsOnly.replace(/^0/, '')}` };
      }
      return { isValid: false, message: 'Enter a valid Vietnamese mobile number (e.g. 098 123 4567).', formatted: cleaned };
    }

    default: {
      // Generic validation rule for all other global countries
      if (digitsOnly.length >= 7 && digitsOnly.length <= 15) {
        const formattedNum = cleaned.startsWith('+') ? cleaned : `${country.dialCode}${digitsOnly.replace(/^0/, '')}`;
        return { isValid: true, message: `Valid mobile number structure for ${country.name}.`, formatted: formattedNum };
      }
      return { isValid: false, message: `Please enter a valid mobile number for ${country.name} (7-15 digits).`, formatted: cleaned };
    }
  }
}
