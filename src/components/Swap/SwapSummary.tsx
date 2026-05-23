import React from 'react';

interface SwapSummaryProps {
  fee: number;
}

export default function SwapSummary({ fee }: SwapSummaryProps) {
  return (
    <div className="bg-slate-900/50 rounded-xl p-4 space-y-4">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">Service Fee (1%)</span>
        <span>${fee.toFixed(2)}</span>
      </div>
    </div>
  );
}