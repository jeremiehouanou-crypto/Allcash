import { countries } from '../data/countries';

export const getCountryPhoneCode = (countryCode: string): string => {
  const phoneCodes: Record<string, string> = {
    // North America
    'US': '+1', 'CA': '+1', 'MX': '+52',
    
    // Europe
    'GB': '+44', 'FR': '+33', 'DE': '+49', 'IT': '+39', 'ES': '+34',
    'PT': '+351', 'NL': '+31', 'BE': '+32', 'CH': '+41', 'AT': '+43',
    'DK': '+45', 'SE': '+46', 'NO': '+47', 'FI': '+358', 'PL': '+48',
    'RO': '+40', 'BG': '+359', 'GR': '+30', 'HU': '+36', 'CZ': '+420',
    'SK': '+421', 'IE': '+353', 'HR': '+385', 'EE': '+372', 'LV': '+371',
    'LT': '+370', 'SI': '+386', 'CY': '+357', 'LU': '+352', 'MT': '+356',
    
    // Asia
    'CN': '+86', 'JP': '+81', 'KR': '+82', 'IN': '+91', 'ID': '+62',
    'MY': '+60', 'SG': '+65', 'TH': '+66', 'VN': '+84', 'PH': '+63',
    'HK': '+852', 'TW': '+886', 'AE': '+971', 'IL': '+972', 'SA': '+966',
    
    // South America
    'BR': '+55', 'AR': '+54', 'CL': '+56', 'CO': '+57', 'PE': '+51',
    'VE': '+58', 'UY': '+598', 'PY': '+595', 'BO': '+591', 'EC': '+593',
    
    // Africa
    'EG': '+20', 'ZA': '+27', 'MA': '+212', 'NG': '+234', 'KE': '+254',
    'TN': '+216', 'GH': '+233', 'UG': '+256', 'TZ': '+255', 'ET': '+251',
    
    // Oceania
    'AU': '+61', 'NZ': '+64', 'FJ': '+679', 'PG': '+675', 'SB': '+677',
    'VU': '+678'
  };

  if (!countryCode) {
    console.warn('No country code provided');
    return '';
  }

  const code = phoneCodes[countryCode.toUpperCase()];
  if (!code) {
    console.warn(`Phone code not found for country: ${countryCode}`);
    return '';
  }

  return code;
};

export const formatPhoneNumber = (phoneNumber: string, countryCode: string): string => {
  if (!phoneNumber) return '';
  if (!countryCode) return phoneNumber;
  
  // Remove any existing formatting
  const cleaned = phoneNumber.replace(/\D/g, '');
  const code = getCountryPhoneCode(countryCode);
  
  if (!code || !cleaned) return cleaned;
  
  // Format based on country
  switch (countryCode.toUpperCase()) {
    case 'US':
    case 'CA':
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    case 'GB':
      return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3');
    case 'FR':
      return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
    case 'DE':
      return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3');
    case 'IT':
    case 'ES':
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    default:
      // Group by 2 digits for better readability
      return cleaned.replace(/(\d{2})/g, '$1 ').trim();
  }
};