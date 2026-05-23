import React from 'react';
import { CryptoToken } from '../../types/crypto';

interface EscrowSummaryProps {
  amount: number;
  token: CryptoToken;
  tokenPrice: number;
}

export default function EscrowSummary({ amount, token, tokenPrice }: EscrowSummaryProps) {
  const fee = amount * 0.01; // 1% fee
  const feeUSD = fee * tokenPrice;

  return (
    <div className="bg-slate-900/50 rounded-xl p-4 space-y-4">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">Escrow Fee (1%)</span>
        <div className="text-right">
          <div>{fee.toFixed(8)} {token.symbol}</div>
          <div className="text-xs text-gray-400">≈ ${feeUSD.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}