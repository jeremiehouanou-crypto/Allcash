import React from 'react';
import { AlertCircle, XCircle, Loader2, Network, Info } from 'lucide-react';
import { CryptoToken } from '../../types/crypto';
import CopyButton from '../common/CopyButton';

interface EscrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: CryptoToken;
  amount: number;
  sellerAddress: string;
  description: string;
  escrowId: string;
  buyerEmail: string;
  sellerEmail: string;
}

export default function EscrowModal({
  isOpen,
  onClose,
  token,
  amount,
  sellerAddress,
  description,
  escrowId,
  buyerEmail,
  sellerEmail
}: EscrowModalProps) {
  const escrowFee = amount * 0.01; // 1% fee
  const totalAmount = amount + escrowFee;
  const totalAmountString = `${totalAmount.toFixed(8)} ${token.symbol}`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pt-4 pb-20">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-slate-800 rounded-2xl p-6 max-w-lg w-full mx-4 border border-slate-700 my-8">
        <div className="flex justify-center mb-6">
          <div className="animate-spin">
            <Loader2 className="w-12 h-12 text-violet-400" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-center mb-6">Waiting for Escrow Deposit...</h3>

        <div className="space-y-6">
          <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
            <div className="flex items-center text-violet-400 mb-2">
              <Info className="w-5 h-5 mr-2" />
              <span className="font-medium">Escrow ID: {escrowId}</span>
            </div>
            <p className="text-sm text-gray-300">
              Save this ID for future reference and support requests.
            </p>
          </div>

          <div className="bg-slate-900/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-violet-400">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">Payment Instructions</span>
              </div>
              <CopyButton text={token.receiveAddress} label="Copy Address" />
            </div>
            <p className="text-sm mb-4">
              Please send exactly{' '}
              <span className="font-mono relative group">
                {totalAmountString}
                <CopyButton 
                  text={totalAmountString} 
                  variant="compact" 
                  label="Copy amount"
                />
              </span>{' '}
              to:
            </p>
            <div className="bg-slate-800 rounded-lg p-3 font-mono text-sm break-all">
              {token.receiveAddress}
            </div>
          </div>

          <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
            <div className="flex items-center mb-2">
              <Network className="w-5 h-5 text-violet-400 mr-2" />
              <span className="text-violet-400 font-medium">Network Information</span>
            </div>
            <p className="text-sm text-gray-300">
              Send funds on the <span className="font-medium">{token.network}</span> Network
            </p>
          </div>

          <div className="bg-slate-900/50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Amount</span>
              <div className="flex items-center">
                <span className="font-mono">{amount.toFixed(8)} {token.symbol}</span>
                <CopyButton 
                  text={`${amount.toFixed(8)} ${token.symbol}`} 
                  variant="compact"
                  label="Copy amount"
                />
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Escrow Fee (1%)</span>
              <div className="flex items-center">
                <span className="font-mono">{escrowFee.toFixed(8)} {token.symbol}</span>
                <CopyButton 
                  text={`${escrowFee.toFixed(8)} ${token.symbol}`} 
                  variant="compact"
                  label="Copy fee amount"
                />
              </div>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span className="text-gray-400">Total to Send</span>
              <div className="flex items-center">
                <span className="font-mono">{totalAmountString}</span>
                <CopyButton 
                  text={totalAmountString} 
                  variant="compact"
                  label="Copy total amount"
                />
              </div>
            </div>
            <div className="pt-3 border-t border-slate-700">
              <div className="text-sm">
                <span className="text-gray-400">Seller's Address:</span>
                <div className="flex items-center mt-1">
                  <span className="font-mono text-xs break-all">{sellerAddress}</span>
                  <CopyButton 
                    text={sellerAddress} 
                    variant="compact"
                    label="Copy seller's address"
                  />
                </div>
              </div>
              <div className="mt-3 text-sm">
                <span className="text-gray-400">Registered Emails:</span>
                <div className="mt-1 space-y-1">
                  <div className="text-gray-300">Buyer: {buyerEmail}</div>
                  <div className="text-gray-300">Seller: {sellerEmail}</div>
                </div>
              </div>
              <div className="mt-3 text-sm">
                <span className="text-gray-400">Description:</span>
                <div className="mt-1 text-gray-300">{description}</div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <XCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}