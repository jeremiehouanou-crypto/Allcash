import React, { useState } from 'react';
import { ExchangeRates } from '../../hooks/useExchangeRates';

interface MultiCurrencyInputProps {
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
  amount: string;
  onAmountChange: (amount: string) => void;
  cryptoPrice: number;
  exchangeRates: ExchangeRates;
}

const CURRENCIES = ['USD', 'EUR', 'RON', 'CHF'] as const;
const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  RON: 'lei',
  CHF: 'CHF',
};

export default function MultiCurrencyInput({
  selectedCurrency,
  onCurrencyChange,
  amount,
  onAmountChange,
  cryptoPrice,
  exchangeRates,
}: MultiCurrencyInputProps) {
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onAmountChange(e.target.value);
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCurrencyChange(e.target.value);
  };

  const numAmount = parseFloat(amount) || 0;
  const rate = exchangeRates[selectedCurrency as keyof ExchangeRates];
  const usdValue = numAmount / rate;

  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">Fiat Amount</label>
      <div className="flex gap-3">
        <select
          value={selectedCurrency}
          onChange={handleCurrencyChange}
          className="bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-3 text-sm font-medium focus:outline-none focus:border-blue-500 transition-colors w-24"
        >
          {CURRENCIES.map((curr) => (
            <option key={curr} value={curr}>
              {curr}
            </option>
          ))}
        </select>

        <div className="flex-1 relative">
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            placeholder={`Enter amount in ${selectedCurrency}`}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            {CURRENCY_SYMBOLS[selectedCurrency as keyof typeof CURRENCY_SYMBOLS]}
          </div>
        </div>
      </div>

      {numAmount > 0 && (
        <div className="mt-2 text-sm text-gray-400">
          ≈ ${usdValue.toFixed(2)} USD
        </div>
      )}
    </div>
  );
}
