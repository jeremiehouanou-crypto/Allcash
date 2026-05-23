import React from 'react';
import { ChevronDown } from 'lucide-react';
import { CryptoToken } from '../../types/crypto';

interface TokenSelectorProps {
  selectedToken: CryptoToken;
  onSelect: (token: CryptoToken) => void;
  tokens: CryptoToken[];
}

export default function TokenSelector({ selectedToken, onSelect, tokens }: TokenSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
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
          <span>{selectedToken.name}</span>
          <span className="ml-2 text-gray-400">({selectedToken.symbol})</span>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {tokens.map((token) => (
            <button
              key={token.symbol}
              type="button"
              onClick={() => {
                onSelect(token);
                setIsOpen(false);
              }}
              className="w-full flex items-center px-4 py-3 hover:bg-slate-700 transition-colors"
            >
              <img
                src={`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/32/color/${token.icon}.png`}
                alt={token.symbol}
                className="w-6 h-6 mr-2"
              />
              <span>{token.name}</span>
              <span className="ml-2 text-gray-400">({token.symbol})</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}