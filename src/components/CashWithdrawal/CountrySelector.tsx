import React, { useMemo } from 'react';
import { MapPin } from 'lucide-react';
import { countries } from '../../data/countries';

interface CountrySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CountrySelector({ value, onChange }: CountrySelectorProps) {
  const groupedCountries = useMemo(() => {
    const groups = countries.reduce((acc, country) => {
      if (!acc[country.region]) {
        acc[country.region] = [];
      }
      acc[country.region].push(country);
      return acc;
    }, {} as Record<string, typeof countries>);

    const sortedRegions = Object.keys(groups).sort();
    return { groups, regions: sortedRegions };
  }, []);

  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">Select Country</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-violet-500 transition-colors appearance-none hover:bg-slate-800/50"
        >
          <option value="">Select a country</option>
          {groupedCountries.regions.map(region => (
            <optgroup 
              key={region} 
              label={region}
              className="bg-slate-900 text-white"
            >
              {groupedCountries.groups[region].map(country => (
                <option 
                  key={country.code} 
                  value={country.code}
                  className="py-2 px-4 hover:bg-slate-700"
                >
                  {`${String.fromCodePoint(
                    ...country.code
                      .toUpperCase()
                      .split('')
                      .map(char => 127397 + char.charCodeAt(0))
                  )} ${country.name}`}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}