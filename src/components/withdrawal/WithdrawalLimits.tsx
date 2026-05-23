import React from 'react';
import { AlertCircle } from 'lucide-react';
import { CryptoToken } from '../../types/crypto';
import { MIN_WITHDRAWAL_AMOUNT_USD, MAX_WITHDRAWAL_AMOUNT_USD } from '../../utils/validation';

interface WithdrawalLimitsProps {
  token: CryptoToken;
  price: number;
}

export default function WithdrawalLimits({ token, price }: WithdrawalLimitsProps) {
  const minAmount = MIN_WITHDRAWAL_AMOUNT_USD / price;
  const maxAmount = MAX_WITHDRAWAL_AMOUNT_USD / price;

  return (
    <div className="mt-2 bg-violet-500/10 border border-violet-500/20 rounded-lg p-3">
      <div className="flex items-center text-violet-400 text-sm mb-1">
        <AlertCircle className="w-4 h-4 mr-1" />
        <span>Withdrawal Limits</span>
      </div>
      <div className="text-xs text-gray-400">
        <div>Minimum: {minAmount.toFixed(8)} {token.symbol}</div>
        <div>Maximum: {maxAmount.toFixed(8)} {token.symbol}</div>
      </div>
    </div>
  );
}