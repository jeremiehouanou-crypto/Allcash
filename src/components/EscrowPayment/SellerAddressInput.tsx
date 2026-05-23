import React from 'react';
import { Wallet } from 'lucide-react';
import { CryptoToken } from '../../types/crypto';

interface SellerAddressInputProps {
  value: string;
  onChange: (value: string) => void;
  token: CryptoToken;
}

export default function SellerAddressInput({ value, onChange, token }: SellerAddressInputProps) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">Seller's Address</label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter the seller's ${token.symbol} address`}
          className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-violet-500 transition-colors"
        />
        <Wallet className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
      </div>
      <p className="mt-1 text-xs text-gray-400">
        Make sure to enter the correct {token.network} network address
      </p>
    </div>
  );
}