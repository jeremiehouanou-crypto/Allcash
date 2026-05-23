import React from 'react';
import { Mail } from 'lucide-react';

interface EmailInputsProps {
  buyerEmail: string;
  sellerEmail: string;
  onBuyerEmailChange: (email: string) => void;
  onSellerEmailChange: (email: string) => void;
}

export default function EmailInputs({
  buyerEmail,
  sellerEmail,
  onBuyerEmailChange,
  onSellerEmailChange
}: EmailInputsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm text-gray-400 mb-2">Buyer's Email</label>
        <div className="relative">
          <input
            type="email"
            value={buyerEmail}
            onChange={(e) => onBuyerEmailChange(e.target.value)}
            placeholder="Enter buyer's email address"
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-violet-500 transition-colors"
          />
          <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">Seller's Email</label>
        <div className="relative">
          <input
            type="email"
            value={sellerEmail}
            onChange={(e) => onSellerEmailChange(e.target.value)}
            placeholder="Enter seller's email address"
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-violet-500 transition-colors"
          />
          <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
}