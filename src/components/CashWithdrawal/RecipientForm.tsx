import React from 'react';
import { User, MapPin, Mail } from 'lucide-react';

interface RecipientFormProps {
  values: {
    fullName: string;
    address: string;
    email: string;
  };
  onChange: (values: {
    fullName: string;
    address: string;
    email: string;
  }) => void;
  selectedCountry?: {
    code: string;
    name: string;
  };
}

export default function RecipientForm({ values, onChange, selectedCountry }: RecipientFormProps) {
  const handleChange = (field: string, value: string) => {
    onChange({ ...values, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Recipient Information</h3>
      
      <div>
        <label className="block text-sm text-gray-400 mb-2">Full Name</label>
        <div className="relative">
          <input
            type="text"
            value={values.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="Enter recipient's full name"
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-violet-500 transition-colors"
            required
          />
          <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">Email Address</label>
        <div className="relative">
          <input
            type="email"
            value={values.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Enter your email address"
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-violet-500 transition-colors"
            required
          />
          <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">Delivery Address</label>
        <div className="relative">
          <textarea
            value={values.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Enter complete delivery address"
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-violet-500 transition-colors min-h-[100px]"
            required
          />
          <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
}