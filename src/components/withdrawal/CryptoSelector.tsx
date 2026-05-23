import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CryptoToken } from '../../types/crypto';
import { tokens } from '../../data/tokens';
import SearchableTokenList from './SearchableTokenList';

interface CryptoSelectorProps {
  selectedToken: CryptoToken;
  onSelect: (token: CryptoToken) => void;
  prices: Record<string, number>;
}

export default function CryptoSelector({
  selectedToken,
  onSelect,
  prices
}: CryptoSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm text-gray-400 mb-2">Select Cryptocurrency</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 hover:border-violet-500 transition-colors"
      >
        <div className="flex items-center">
          <img
            src={`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/32/color/${selectedToken.icon}.png`}
            alt={selectedToken.symbol}
            className="w-6 h-6 mr-2"
          />
          <div className="text-left">
            <div>{selectedToken.name}</div>
            <div className="text-sm text-gray-400">{selectedToken.network} Network</div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="text-right mr-2">
            <div>${prices[selectedToken.symbol]?.toFixed(2) || '0.00'}</div>
            <div className="text-xs text-gray-400">Current Price</div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </button>

      {isOpen && (
        <SearchableTokenList
          tokens={tokens}
          prices={prices}
          onSelect={onSelect}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}