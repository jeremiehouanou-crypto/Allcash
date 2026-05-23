import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useCryptoPrices } from '../hooks/useCryptoPrices';
import { tokens } from '../data/tokens';

function PopularPairs() {
  const { prices, loading } = useCryptoPrices();
  
  const pairs = [
    { from: 'BTC', to: 'USDT' },
    { from: 'ETH', to: 'USDT' },
    { from: 'BNB', to: 'USDT' },
    { from: 'SOL', to: 'USDT' },
  ].map(pair => {
    const fromPrice = prices[pair.from] || 0;
    const prevPrice = fromPrice * (1 + (Math.random() * 0.1 - 0.05)); // Simulate previous price
    const change = ((fromPrice - prevPrice) / prevPrice) * 100;
    const volume = fromPrice * (Math.random() * 1000 + 500); // Simulate volume

    return {
      ...pair,
      change: `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`,
      volume: `$${(volume / 1e6).toFixed(1)}M`
    };
  });

  if (loading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-700 rounded w-1/3"></div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-slate-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700">
      <div className="flex items-center mb-4">
        <TrendingUp className="w-5 h-5 text-violet-400 mr-2" />
        <h2 className="text-xl font-bold">Popular Pairs</h2>
      </div>

      <div className="space-y-4">
        {pairs.map((pair, index) => (
          <div
            key={index}
            className="bg-slate-900/50 rounded-xl p-4 hover:bg-slate-700/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  <img
                    src={`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/32/color/${pair.from.toLowerCase()}.png`}
                    alt={pair.from}
                    className="w-8 h-8"
                  />
                  <img
                    src={`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/32/color/${pair.to.toLowerCase()}.png`}
                    alt={pair.to}
                    className="w-8 h-8"
                  />
                </div>
                <span className="ml-3">{pair.from}/{pair.to}</span>
              </div>
              <div className="text-right">
                <div className={pair.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}>
                  {pair.change}
                </div>
                <div className="text-sm text-gray-400">{pair.volume}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PopularPairs;