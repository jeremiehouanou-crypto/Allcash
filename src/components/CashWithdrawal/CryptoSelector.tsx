import React, { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { CryptoToken } from '../../types/crypto';
import { tokens } from '../../data/tokens';

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
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTokens = tokens.filter(token => 
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-lg">
          <div className="p-3 border-b border-slate-700">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cryptocurrency..."
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-violet-500 transition-colors text-sm"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            {filteredTokens.length === 0 ? (
              <div className="p-4 text-center text-gray-400 text-sm">
                No cryptocurrencies found
              </div>
            ) : (
              filteredTokens.map((token) => (
                <button
                  key={token.symbol}
                  onClick={() => {
                    onSelect(token);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center">
                    <img
                      src={`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/32/color/${token.icon}.png`}
                      alt={token.symbol}
                      className="w-6 h-6 mr-2"
                    />
                    <div className="text-left">
                      <div>{token.name}</div>
                      <div className="text-sm text-gray-400">{token.symbol}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div>${prices[token.symbol]?.toFixed(2) || '0.00'}</div>
                    <div className="text-xs text-gray-400">{token.network}</div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}