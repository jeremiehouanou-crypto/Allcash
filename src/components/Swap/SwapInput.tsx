import React from 'react';
import TokenSelector from '../TokenSelector';
import { CryptoToken } from '../../types/crypto';

interface SwapInputProps {
  label: string;
  amount: string;
  token: CryptoToken;
  price: number;
  network: string;
  readOnly?: boolean;
  onAmountChange?: (value: string) => void;
  onTokenSelect: (token: CryptoToken) => void;
  isSelectorOpen: boolean;
  onToggleSelector: () => void;
}

export default function SwapInput({
  label,
  amount,
  token,
  price,
  network,
  readOnly = false,
  onAmountChange,
  onTokenSelect,
  isSelectorOpen,
  onToggleSelector
}: SwapInputProps) {
  return (
    <div className="bg-slate-900/50 rounded-xl p-4">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-400">{label}</span>
        <div className="text-right">
          <span className="text-sm text-gray-400">
            1 {token.symbol} = ${price?.toFixed(2) || '0.00'}
          </span>
          <div className="text-xs text-violet-400">{network} Network</div>
        </div>
      </div>
      
      <div className="flex items-center">
        <input
          type="number"
          value={amount}
          onChange={(e) => onAmountChange?.(e.target.value)}
          placeholder="0.0"
          readOnly={readOnly}
          className="bg-transparent text-2xl outline-none w-full"
        />
        
        <TokenSelector
          selectedToken={token}
          onSelect={onTokenSelect}
          isOpen={isSelectorOpen}
          onToggle={onToggleSelector}
        />
      </div>
      
      {amount && price && (
        <div className="mt-2 text-sm text-gray-400">
          ≈ ${(parseFloat(amount) * price).toFixed(2)}
        </div>
      )}
    </div>
  );
}