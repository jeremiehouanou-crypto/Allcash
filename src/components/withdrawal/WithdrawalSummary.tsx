import React from 'react';
import { Receipt } from 'lucide-react';
import { CryptoToken } from '../../types/crypto';
import { calculateDeliveryWindow, formatDeliveryTime } from '../../utils/dates';

interface WithdrawalSummaryProps {
  amount: number;
  token: CryptoToken;
  fee: number;
  total: number;
  priority: 'standard' | 'express' | 'instant';
}

export default function WithdrawalSummary({
  amount,
  token,
  fee,
  total,
  priority
}: WithdrawalSummaryProps) {
  const { earliest, latest } = calculateDeliveryWindow(priority);

  return (
    <div className="mt-6 bg-slate-900/50 rounded-xl p-4">
      <div className="flex items-center mb-4">
        <Receipt className="w-5 h-5 text-violet-400 mr-2" />
        <h3 className="text-lg font-semibold">Transaction Summary</h3>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Amount</span>
          <span>{amount.toFixed(8)} {token.symbol}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Network Fee</span>
          <span className="text-red-400">-{fee.toFixed(8)} {token.symbol}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-400">You Receive</span>
          <span className="text-green-400">{total.toFixed(8)} {token.symbol}</span>
        </div>

        <div className="pt-3 border-t border-slate-700">
          <span className="text-sm text-gray-400">Estimated Delivery Time</span>
          <p className="mt-1 text-sm">
            {formatDeliveryTime(earliest)} - {formatDeliveryTime(latest)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            *Delivery during business hours only (Mon-Fri, 9:00 AM - 5:00 PM)
          </p>
        </div>
      </div>
    </div>
  );
}