import React from 'react';
import { Receipt } from 'lucide-react';
import { CryptoToken } from '../../types/crypto';
import { countries } from '../../data/countries';
import { calculateWithdrawalAmount } from '../../utils/withdrawal';

interface WithdrawalSummaryProps {
  token: CryptoToken;
  amount: number;
  fee: number;
  recipientInfo: {
    fullName: string;
    address: string;
    email: string;
  };
  country: string;
  tokenPrice: number;
}

export default function WithdrawalSummary({
  token,
  amount,
  fee,
  recipientInfo,
  country,
  tokenPrice
}: WithdrawalSummaryProps) {
  const selectedCountry = countries.find(c => c.code === country);
  const { finalAmount, feeAmount } = calculateWithdrawalAmount(amount, fee);
  
  // Calculate USD values
  const amountUSD = amount * tokenPrice;
  const feeAmountUSD = feeAmount * tokenPrice;
  const finalAmountUSD = finalAmount * tokenPrice;
  
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
          <span className="text-gray-400">Service Fee ({(fee * 100).toFixed(0)}%)</span>
          <div className="text-right text-red-400">
            <div>-{feeAmount.toFixed(8)} {token.symbol}</div>
            <div className="text-xs">≈ -${feeAmountUSD.toFixed(2)}</div>
          </div>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-400">You Receive</span>
          <div className="text-right text-green-400">
            <div>{finalAmount.toFixed(8)} {token.symbol}</div>
            <div className="text-xs">≈ ${finalAmountUSD.toFixed(2)}</div>
          </div>
        </div>

        {recipientInfo.fullName && (
          <div className="mt-4 pt-4 border-t border-slate-700">
            <h4 className="text-sm font-medium text-gray-400 mb-2">Delivery Details</h4>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-400">Recipient:</span> {recipientInfo.fullName}</p>
              <p><span className="text-gray-400">Email:</span> {recipientInfo.email}</p>
              <p><span className="text-gray-400">Address:</span> {recipientInfo.address}</p>
              {selectedCountry && (
                <p><span className="text-gray-400">Country:</span> {selectedCountry.name}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}