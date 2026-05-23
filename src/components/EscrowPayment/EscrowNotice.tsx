import React from 'react';
import { Info } from 'lucide-react';

export default function EscrowNotice() {
  return (
    <>
      <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4 mb-6">
        <div className="flex items-center text-violet-400 mb-2">
          <Info className="w-5 h-5 mr-2" />
          <span className="font-medium">How it works</span>
        </div>
        <ol className="list-decimal list-inside text-sm text-gray-300 space-y-2">
          <li>You deposit funds into the escrow smart contract</li>
          <li>The seller is notified and proceeds with the delivery</li>
          <li>Once you confirm receipt, funds are released to the seller</li>
          <li>If there's a dispute, our support team will help resolve it</li>
        </ol>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6">
        <div className="flex items-center text-amber-400 mb-2">
          <Info className="w-5 h-5 mr-2" />
          <span className="font-medium">Important Notice</span>
        </div>
        <p className="text-sm text-gray-300">
          Claims and disputes will only be processed from the registered email addresses provided.
          Please ensure both email addresses are correct and accessible.
        </p>
      </div>
    </>
  );
}