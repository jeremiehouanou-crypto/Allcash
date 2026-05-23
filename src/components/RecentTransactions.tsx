import React, { useState, useEffect } from 'react';
import { Clock, ExternalLink } from 'lucide-react';
import { tokens } from '../data/tokens';

// Simulate fetching transactions
const fetchLatestTransactions = () => {
  // In a real app, this would be an API call
  return tokens.slice(0, 4).map((token, index) => {
    const toToken = tokens[(index + 1) % tokens.length];
    const amount = (Math.random() * 10).toFixed(2);
    const timeAgo = Math.floor(Math.random() * 29) + 1;
    
    return {
      from: token.symbol,
      to: toToken.symbol,
      amount: `${amount} ${token.symbol}`,
      time: `${timeAgo}m ago`,
      status: 'completed',
      hash: `0x${Math.random().toString(16).slice(2)}`,
    };
  });
};

function RecentTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    // Initial fetch
    setTransactions(fetchLatestTransactions());

    // Set up interval for updates
    const interval = setInterval(() => {
      setTransactions(fetchLatestTransactions());
    }, 30000); // 30 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Clock className="w-5 h-5 text-violet-400 mr-2" />
          <h2 className="text-xl font-bold">Recent Transactions</h2>
        </div>
        <div className="text-sm text-gray-400">
          Updates every 30s
        </div>
      </div>

      <div className="space-y-4">
        {transactions.map((tx, index) => (
          <div
            key={tx.hash}
            className="bg-slate-900/50 rounded-xl p-4 hover:bg-slate-700/50 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  <img
                    src={`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/32/color/${tx.from.toLowerCase()}.png`}
                    alt={tx.from}
                    className="w-6 h-6"
                  />
                  <img
                    src={`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/32/color/${tx.to.toLowerCase()}.png`}
                    alt={tx.to}
                    className="w-6 h-6"
                  />
                </div>
                <span className="ml-3">{tx.from} → {tx.to}</span>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">{tx.amount}</span>
              <span className="text-gray-400">{tx.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentTransactions;