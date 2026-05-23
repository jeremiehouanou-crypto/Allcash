import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { CryptoToken } from '../../types/crypto';

interface SearchableTokenListProps {
  tokens: CryptoToken[];
  prices: Record<string, number>;
  onSelect: (token: CryptoToken) => void;
  onClose: () => void;
}

export default function SearchableTokenList({
  tokens,
  prices,
  onSelect,
  onClose
}: SearchableTokenListProps) {
  const [search, setSearch] = useState('');

  const filteredTokens = useMemo(() => {
    const searchTerm = search.toLowerCase();
    return tokens.filter(token => 
      token.name.toLowerCase().includes(searchTerm) ||
      token.symbol.toLowerCase().includes(searchTerm)
    );
  }, [tokens, search]);

  return (
    <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-lg overflow-hidden">
      <div className="p-3 border-b border-slate-700">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
                onClose();
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
  );
}