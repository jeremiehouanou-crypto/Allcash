import React, { useState } from 'react';
import { AlertCircle, Copy, Check, XCircle, Loader2, Network } from 'lucide-react';
import { CryptoToken } from '../../types/crypto';

interface PaypalWithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: CryptoToken;
  amount: number;
  paypalEmail: string;
  finalAmount: number;
  fee: number;
}

export default function PaypalWithdrawalModal({
  isOpen,
  onClose,
  token,
  amount,
  paypalEmail,
  finalAmount,
  fee
}: PaypalWithdrawalModalProps) {
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'waiting' | 'received' | 'confirmed'>('waiting');

  if (!isOpen) return null;

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(token.receiveAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pt-4 pb-20">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-slate-800 rounded-2xl p-6 max-w-lg w-full mx-4 border border-slate-700 my-8">
        <div className="flex justify-center mb-6">
          <div className="animate-spin">
            <Loader2 className="w-12 h-12 text-violet-400" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-center mb-6">Waiting for Payment...</h3>

        <div className="space-y-6">
          <div className="bg-slate-900/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-violet-400">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">Payment Instructions</span>
              </div>
              <button
                onClick={copyAddress}
                className={`flex items-center px-3 py-1 rounded-lg transition-colors ${
                  copied 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-violet-500/20 text-violet-400 hover:bg-violet-500/30'
                }`}
              >
                {copied ? (
                  <Check className="w-4 h-4 mr-1" />
                ) : (
                  <Copy className="w-4 h-4 mr-1" />
                )}
                <span className="text-sm">{copied ? 'Copied!' : 'Copy Address'}</span>
              </button>
            </div>
            <p className="text-sm mb-4">
              Please send exactly <span className="font-mono">{amount} {token.symbol}</span> to:
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
            <p className="text-sm">
              <span className="text-gray-400">Send on:</span> {token.network} Network
            </p>
          </div>

          <div className="bg-slate-900/50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">You Send</span>
              <span>{amount.toFixed(8)} {token.symbol}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Withdrawal Fee (2.5%)</span>
              <span className="text-red-400">-{fee.toFixed(8)} {token.symbol}</span>
            </div>
            <div className="border-t border-slate-700 pt-2">
              <div className="flex justify-between font-medium">
                <span className="text-gray-400">You Receive</span>
                <span className="text-green-400">{finalAmount.toFixed(8)} {token.symbol}</span>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">PayPal Email</span>
              <span className="font-mono text-xs">{paypalEmail}</span>
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