import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, CheckCircle2, XCircle, Copy, Clock, Network } from 'lucide-react';
import { CryptoToken } from '../../types/crypto';
import { BlockchainMonitor } from '../../utils/blockchain';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: CryptoToken;
  amount: number;
  recipientInfo: {
    fullName: string;
    address: string;
    email: string;
  };
  finalAmount: number;
}

export default function WithdrawalModal({
  isOpen,
  onClose,
  token,
  amount,
  recipientInfo,
  finalAmount
}: WithdrawalModalProps) {
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'waiting' | 'received' | 'confirmed'>('waiting');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');

  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const minDelivery = new Date(now.getTime() + (4 * 60 * 60 * 1000));
      const maxDelivery = new Date(now.getTime() + (48 * 60 * 60 * 1000));
      
      const formatDate = (date: Date) => {
        return date.toLocaleString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        });
      };

      setEstimatedDelivery(`${formatDate(minDelivery)} - ${formatDate(maxDelivery)}`);

      const monitor = new BlockchainMonitor();
      monitor.startMonitoring(token.receiveAddress, (confirmed) => {
        setPaymentStatus(confirmed ? 'confirmed' : 'waiting');
      });

      return () => monitor.stopMonitoring();
    }
  }, [isOpen, token.receiveAddress]);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(token.receiveAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-slate-800 rounded-2xl p-6 max-w-lg w-full mx-4 border border-slate-700">
        <div className="flex justify-center mb-6">
          {paymentStatus === 'waiting' && (
            <div className="animate-spin">
              <Loader2 className="w-12 h-12 text-violet-400" />
            </div>
          )}
          {paymentStatus === 'received' && (
            <CheckCircle2 className="w-12 h-12 text-green-400" />
          )}
          {paymentStatus === 'confirmed' && (
            <CheckCircle2 className="w-12 h-12 text-green-400" />
          )}
        </div>

        <h3 className="text-xl font-bold text-center mb-6">
          {paymentStatus === 'waiting' && 'Waiting for Payment...'}
          {paymentStatus === 'received' && 'Payment Received!'}
          {paymentStatus === 'confirmed' && 'Payment Confirmed!'}
        </h3>

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
                  <CheckCircle2 className="w-4 h-4 mr-1" />
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
            <p className="text-sm text-gray-300">
              Send funds on the <span className="font-medium">{token.network}</span> Network
            </p>
          </div>

          <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-violet-400 mr-2" />
              <span className="text-violet-400 font-medium">Estimated Delivery Time</span>
            </div>
            <p className="text-sm text-gray-300">
              {estimatedDelivery}
            </p>
          </div>

          <div className="border-t border-slate-700 pt-4">
            <h4 className="text-sm font-medium text-gray-400 mb-2">You will receive</h4>
            <p className="text-lg font-bold">{finalAmount.toFixed(2)} {token.symbol}</p>
            <p className="text-sm text-gray-400 mt-1">at the provided delivery address</p>
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