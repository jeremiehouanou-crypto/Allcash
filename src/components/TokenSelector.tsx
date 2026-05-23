import React from 'react';
import { ChevronDown } from 'lucide-react';
import { CryptoToken } from '../types/crypto';
import { tokens } from '../data/tokens';

interface TokenSelectorProps {
  selectedToken: CryptoToken;
  onSelect: (token: CryptoToken) => void;
  isOpen: boolean;
  onToggle: () => void;
}

function TokenSelector({ selectedToken, onSelect, isOpen, onToggle }: TokenSelectorProps) {
  return (
    <div className="relative">
      <button 
        onClick={onToggle}
        className="flex items-center bg-slate-800 hover:bg-slate-700 rounded-xl px-3 py-2 transition-colors"
      >
        <img
          src={`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/32/color/${selectedToken.icon}.png`}
          alt={selectedToken.symbol}
          className="w-6 h-6"
        />
        <span className="mx-2">{selectedToken.symbol}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-slate-800 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
          {tokens.map((token) => (
            <button
              key={token.symbol}
              onClick={() => {
                onSelect(token);
                onToggle();
              }}
              className="w-full flex items-center px-4 py-3 hover:bg-slate-700 transition-colors"
            >
              <img
                src={`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/32/color/${token.icon}.png`}
                alt={token.symbol}
                className="w-6 h-6"
              />
              <span className="ml-2">{token.name}</span>
              <span className="ml-auto text-gray-400">{token.symbol}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default TokenSelector;