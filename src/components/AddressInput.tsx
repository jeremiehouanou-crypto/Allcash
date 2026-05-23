import React from 'react';
import { CryptoToken } from '../types/crypto';

interface AddressInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  token: CryptoToken;
  placeholder?: string;
}

function AddressInput({ label, value, onChange, token, placeholder }: AddressInputProps) {
  return (
    <div className="bg-slate-900/50 rounded-xl p-4">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-400">{label}</span>
        <span className="text-sm text-gray-400">{token.network} Network</span>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || `Enter ${token.network} address`}
        className="w-full bg-transparent border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 transition-colors"
      />
    </div>
  );
}

export default AddressInput;