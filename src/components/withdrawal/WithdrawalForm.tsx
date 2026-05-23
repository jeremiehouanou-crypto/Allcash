import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import CryptoSelector from './CryptoSelector';
import DeliveryOptions from './DeliveryOptions';
import WithdrawalSummary from './WithdrawalSummary';
import WithdrawalLimits from './WithdrawalLimits';
import { CryptoToken } from '../../types/crypto';
import { calculateWithdrawalFee } from '../../utils/fees';
import { validateWithdrawalAmount } from '../../utils/validation';
import { useCryptoPrices } from '../../hooks/useCryptoPrices';
import { tokens } from '../../data/tokens';

export default function WithdrawalForm() {
  const { prices, loading } = useCryptoPrices();
  const [selectedToken, setSelectedToken] = useState<CryptoToken>(tokens[0]);
  const [amount, setAmount] = useState('');
  const [priority, setPriority] = useState<'standard' | 'express' | 'instant'>('standard');
  const [error, setError] = useState<string | null>(null);

  const handleAmountChange = (value: string) => {
    const numAmount = parseFloat(value);
    const tokenPrice = prices[selectedToken.symbol] || 0;
    const amountUSD = numAmount * tokenPrice;
    
    const validationError = validateWithdrawalAmount(amountUSD);
    setError(validationError);
    setAmount(value);
  };

  const { fee, total } = calculateWithdrawalFee(
    parseFloat(amount) || 0,
    selectedToken,
    priority
  );

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500 mx-auto"></div>
        <p className="mt-4 text-gray-400">Loading cryptocurrency data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <CryptoSelector
          selectedToken={selectedToken}
          onSelect={setSelectedToken}
          prices={prices}
        />

        <div className="mt-6">
          <label className="block text-sm text-gray-400 mb-2">Amount</label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder={`Enter amount in ${selectedToken.symbol}`}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition-colors"
            />
            {amount && (
              <div className="mt-1 text-sm text-gray-400">
                ≈ ${((parseFloat(amount) || 0) * (prices[selectedToken.symbol] || 0)).toFixed(2)}
              </div>
            )}
          </div>

          <WithdrawalLimits
            token={selectedToken}
            price={prices[selectedToken.symbol] || 0}
          />
        </div>

        <DeliveryOptions
          priority={priority}
          onChange={setPriority}
          amount={parseFloat(amount) || 0}
          token={selectedToken}
        />

        <WithdrawalSummary
          amount={parseFloat(amount) || 0}
          token={selectedToken}
          fee={fee}
          total={total}
          priority={priority}
        />

        <button
          disabled={!!error || !amount}
          className={`w-full mt-6 py-4 px-6 rounded-xl font-semibold transition-colors ${
            error || !amount
              ? 'bg-slate-600 cursor-not-allowed'
              : 'bg-violet-600 hover:bg-violet-700'
          }`}
        >
          {error ? 'Invalid Amount' : 'Proceed with Withdrawal'}
        </button>
      </div>
    </div>
  );
}