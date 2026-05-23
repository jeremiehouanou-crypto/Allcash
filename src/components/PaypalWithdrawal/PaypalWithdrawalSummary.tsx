import React from 'react';
import { Receipt, Info } from 'lucide-react';
import { CryptoToken } from '../../types/crypto';

interface PaypalWithdrawalSummaryProps {
  amount: number;
  token: CryptoToken;
  fee: number;
  total: number;
  paypalEmail: string;
  tokenPrice: number;
}

export default function PaypalWithdrawalSummary({
  amount,
  token,
  fee,
  total,
  paypalEmail,
  tokenPrice
}: PaypalWithdrawalSummaryProps) {
  const amountUSD = amount * tokenPrice;
  const feeUSD = fee * tokenPrice;
  const totalUSD = total * tokenPrice;

  return (
    <div className="bg-slate-900/50 rounded-xl p-4">
      <div className="flex items-center mb-4">
        <Receipt className="w-5 h-5 text-violet-400 mr-2" />
        <h3 className="text-lg font-semibold">Transaction Summary</h3>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Amount</span>
          <div className="text-right">
            <div>{amount.toFixed(8)} {token.symbol}</div>
            <div className="text-xs text-gray-400">≈ ${amountUSD.toFixed(2)}</div>
          </div>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Withdrawal Fee (2.5%)</span>
          <div className="text-right text-red-400">
            <div>-{fee.toFixed(8)} {token.symbol}</div>
            <div className="text-xs">≈ -${feeUSD.toFixed(2)}</div>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-3">
          <div className="flex justify-between font-medium">
            <span className="text-gray-400">You Receive</span>
            <div className="text-right text-green-400">
              <div>{total.toFixed(8)} {token.symbol}</div>
              <div className="text-xs">≈ ${totalUSD.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-between text-sm pt-2">
          <span className="text-gray-400">PayPal Email</span>
          <span className="font-mono text-xs">{paypalEmail || 'Not set'}</span>
        </div>

        <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <div className="flex items-center text-blue-400 text-sm mb-1">
            <Info className="w-4 h-4 mr-1" />
            <span>Processing Time</span>
          </div>
          <p className="text-xs text-gray-400">
            PayPal withdrawals are typically processed within 1-3 business days.
          </p>
        </div>
      </div>
    </div>
  );
}