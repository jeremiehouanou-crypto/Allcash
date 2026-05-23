interface Country {
  code: string;
  name: string;
  currency: string;
  region: string;
}

export const countries: Country[] = [
  // North America
  { code: 'US', name: 'United States', currency: 'USD', region: 'North America' },
  { code: 'CA', name: 'Canada', currency: 'CAD', region: 'North America' },
  { code: 'MX', name: 'Mexico', currency: 'MXN', region: 'North America' },

  // South America
  { code: 'AR', name: 'Argentina', currency: 'ARS', region: 'South America' },
  { code: 'BR', name: 'Brazil', currency: 'BRL', region: 'South America' },
  { code: 'CL', name: 'Chile', currency: 'CLP', region: 'South America' },
  { code: 'CO', name: 'Colombia', currency: 'COP', region: 'South America' },
  { code: 'PE', name: 'Peru', currency: 'PEN', region: 'South America' },
  { code: 'UY', name: 'Uruguay', currency: 'UYU', region: 'South America' },
  { code: 'VE', name: 'Venezuela', currency: 'VES', region: 'South America' },

  // Europe
  { code: 'AT', name: 'Austria', currency: 'EUR', region: 'Europe' },
  { code: 'BE', name: 'Belgium', currency: 'EUR', region: 'Europe' },
  { code: 'BG', name: 'Bulgaria', currency: 'BGN', region: 'Europe' },
  { code: 'HR', name: 'Croatia', currency: 'EUR', region: 'Europe' },
  { code: 'CY', name: 'Cyprus', currency: 'EUR', region: 'Europe' },
  { code: 'CZ', name: 'Czech Republic', currency: 'CZK', region: 'Europe' },
  { code: 'DK', name: 'Denmark', currency: 'DKK', region: 'Europe' },
  { code: 'EE', name: 'Estonia', currency: 'EUR', region: 'Europe' },
  { code: 'FI', name: 'Finland', currency: 'EUR', region: 'Europe' },
  { code: 'FR', name: 'France', currency: 'EUR', region: 'Europe' },
  { code: 'DE', name: 'Germany', currency: 'EUR', region: 'Europe' },
  { code: 'GR', name: 'Greece', currency: 'EUR', region: 'Europe' },
  { code: 'HU', name: 'Hungary', currency: 'HUF', region: 'Europe' },
  { code: 'IE', name: 'Ireland', currency: 'EUR', region: 'Europe' },
  { code: 'IT', name: 'Italy', currency: 'EUR', region: 'Europe' },
  { code: 'LV', name: 'Latvia', currency: 'EUR', region: 'Europe' },
  { code: 'LT', name: 'Lithuania', currency: 'EUR', region: 'Europe' },
  { code: 'LU', name: 'Luxembourg', currency: 'EUR', region: 'Europe' },
  { code: 'MT', name: 'Malta', currency: 'EUR', region: 'Europe' },
  { code: 'NL', name: 'Netherlands', currency: 'EUR', region: 'Europe' },
  { code: 'PL', name: 'Poland', currency: 'PLN', region: 'Europe' },
  { code: 'PT', name: 'Portugal', currency: 'EUR', region: 'Europe' },
  { code: 'RO', name: 'Romania', currency: 'RON', region: 'Europe' },
  { code: 'SK', name: 'Slovakia', currency: 'EUR', region: 'Europe' },
  { code: 'SI', name: 'Slovenia', currency: 'EUR', region: 'Europe' },
  { code: 'ES', name: 'Spain', currency: 'EUR', region: 'Europe' },
  { code: 'SE', name: 'Sweden', currency: 'SEK', region: 'Europe' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', region: 'Europe' },
  { code: 'CH', name: 'Switzerland', currency: 'CHF', region: 'Europe' },
  { code: 'NO', name: 'Norway', currency: 'NOK', region: 'Europe' },

  // Asia
  { code: 'CN', name: 'China', currency: 'CNY', region: 'Asia' },
  { code: 'HK', name: 'Hong Kong', currency: 'HKD', region: 'Asia' },
  { code: 'IN', name: 'India', currency: 'INR', region: 'Asia' },
  { code: 'ID', name: 'Indonesia', currency: 'IDR', region: 'Asia' },
  { code: 'JP', name: 'Japan', currency: 'JPY', region: 'Asia' },
  { code: 'KR', name: 'South Korea', currency: 'KRW', region: 'Asia' },
  { code: 'MY', name: 'Malaysia', currency: 'MYR', region: 'Asia' },
  { code: 'PH', name: 'Philippines', currency: 'PHP', region: 'Asia' },
  { code: 'SG', name: 'Singapore', currency: 'SGD', region: 'Asia' },
  { code: 'TW', name: 'Taiwan', currency: 'TWD', region: 'Asia' },
  { code: 'TH', name: 'Thailand', currency: 'THB', region: 'Asia' },
  { code: 'VN', name: 'Vietnam', currency: 'VND', region: 'Asia' },
  { code: 'AE', name: 'United Arab Emirates', currency: 'AED', region: 'Asia' },
  { code: 'IL', name: 'Israel', currency: 'ILS', region: 'Asia' },
  { code: 'SA', name: 'Saudi Arabia', currency: 'SAR', region: 'Asia' },

  // Africa
  { code: 'EG', name: 'Egypt', currency: 'EGP', region: 'Africa' },
  { code: 'GH', name: 'Ghana', currency: 'GHS', region: 'Africa' },
  { code: 'KE', name: 'Kenya', currency: 'KES', region: 'Africa' },
  { code: 'MA', name: 'Morocco', currency: 'MAD', region: 'Africa' },
  { code: 'NG', name: 'Nigeria', currency: 'NGN', region: 'Africa' },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR', region: 'Africa' },
  { code: 'TN', name: 'Tunisia', currency: 'TND', region: 'Africa' },
  { code: 'UG', name: 'Uganda', currency: 'UGX', region: 'Africa' },
  { code: 'TZ', name: 'Tanzania', currency: 'TZS', region: 'Africa' },
  { code: 'ET', name: 'Ethiopia', currency: 'ETB', region: 'Africa' },

  // Oceania
  { code: 'AU', name: 'Australia', currency: 'AUD', region: 'Oceania' },
  { code: 'NZ', name: 'New Zealand', currency: 'NZD', region: 'Oceania' },
  { code: 'FJ', name: 'Fiji', currency: 'FJD', region: 'Oceania' },
  { code: 'PG', name: 'Papua New Guinea', currency: 'PGK', region: 'Oceania' },
  { code: 'SB', name: 'Solomon Islands', currency: 'SBD', region: 'Oceania' },
  { code: 'VU', name: 'Vanuatu', currency: 'VUV', region: 'Oceania' }
].sort((a, b) => a.name.localeCompare(b.name));