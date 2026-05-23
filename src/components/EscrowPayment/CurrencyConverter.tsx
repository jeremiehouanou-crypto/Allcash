import React from 'react';
import { DollarSign, Euro, TrendingUp } from 'lucide-react';
import { ExchangeRates } from '../../hooks/useExchangeRates';

interface CurrencyConverterProps {
  cryptoAmount: number;
  cryptoPrice: number;
  exchangeRates: ExchangeRates;
}

const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  RON: 'lei',
  CHF: 'CHF',
};

const CURRENCIES = ['USD', 'EUR', 'RON', 'CHF'] as const;

export default function CurrencyConverter({
  cryptoAmount,
  cryptoPrice,
  exchangeRates,
}: CurrencyConverterProps) {
  const usdValue = cryptoAmount * cryptoPrice;

  if (!usdValue) {
    return null;
  }

  return (
    <div className="bg-slate-900/50 rounded-xl p-4 space-y-3">
      <div className="flex items-center mb-3">
        <TrendingUp className="w-4 h-4 text-emerald-400 mr-2" />
        <h3 className="text-sm font-semibold text-gray-300">Amount in Other Currencies</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {CURRENCIES.map((currency) => {
          const rate = exchangeRates[currency];
          const convertedAmount = usdValue * rate;
          const symbol = CURRENCY_SYMBOLS[currency];

          return (
            <div
              key={currency}
              className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50"
            >
              <p className="text-xs text-gray-500 mb-1">{currency}</p>
              <p className="text-lg font-semibold">
                {symbol} {convertedAmount.toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
