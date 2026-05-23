import React, { useState, useEffect } from 'react';
import { AlertCircle, Copy, Check, XCircle, Loader2, Network, CheckCircle } from 'lucide-react';
import { CryptoToken } from '../types/crypto';
import { getOperationById } from '../services/operations';

interface SwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  fromToken: CryptoToken;
  toToken: CryptoToken;
  fromAmount: string;
  toAmount: string;
  toAddress: string;
  fee: number;
  operationId: string;
}

export default function SwapModal({
  isOpen,
  onClose,
  fromToken,
  toToken,
  fromAmount,
  toAmount,
  toAddress,
  fee,
  operationId
}: SwapModalProps) {
  const [copied, setCopied] = useState(false);
  const [copiedOpId, setCopiedOpId] = useState(false);
  const [paymentReceived, setPaymentReceived] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!isOpen || !operationId) return;

    const checkPaymentStatus = async () => {
      try {
        const data = await getOperationById(operationId);
        if (data?.operation.payment_received) {
          setPaymentReceived(true);
          setTimeout(() => {
            setShouldRedirect(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            onClose();
          }, 3000);
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    };

    const interval = setInterval(checkPaymentStatus, 3000);
    checkPaymentStatus();

    return () => clearInterval(interval);
  }, [isOpen, operationId, onClose]);

  if (!isOpen) return null;

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(fromToken.receiveAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const copyOperationId = async () => {
    try {
      await navigator.clipboard.writeText(operationId);
      setCopiedOpId(true);
      setTimeout(() => setCopiedOpId(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pt-4 pb-20">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-slate-800 rounded-2xl p-6 max-w-lg w-full mx-4 border border-slate-700 my-8">
        <div className="flex justify-center mb-6">
          {paymentReceived ? (
            <CheckCircle className="w-12 h-12 text-green-400" />
          ) : (
            <div className="animate-spin">
              <Loader2 className="w-12 h-12 text-violet-400" />
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold text-center mb-6">
          {paymentReceived ? 'Payment Received!' : 'Waiting for Payment...'}
        </h3>

        <div className="space-y-6">
          {paymentReceived && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <p className="text-green-400 text-center font-medium">
                Your payment has been confirmed! Redirecting to home page...
              </p>
            </div>
          )}

          <div className="bg-slate-900/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-blue-400">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">Operation ID</span>
              </div>
              <button
                onClick={copyOperationId}
                className={`flex items-center px-3 py-1 rounded-lg transition-colors ${
                  copiedOpId
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                }`}
              >
                {copiedOpId ? (
                  <Check className="w-4 h-4 mr-1" />
                ) : (
                  <Copy className="w-4 h-4 mr-1" />
                )}
                <span className="text-sm">{copiedOpId ? 'Copied!' : 'Copy ID'}</span>
              </button>
            </div>
            <p className="text-sm mb-2 text-gray-400">
              Save this ID to track your operation:
            </p>
            <div className="bg-slate-800 rounded-lg p-3 font-mono text-xs break-all">
              {operationId}
            </div>
          </div>

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
              Please send exactly <span className="font-mono">{fromAmount} {fromToken.symbol}</span> to:
            </p>
            <div className="bg-slate-800 rounded-lg p-3 font-mono text-sm break-all">
              {fromToken.receiveAddress}
            </div>
          </div>

          <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
            <div className="flex items-center mb-2">
              <Network className="w-5 h-5 text-violet-400 mr-2" />
              <span className="text-violet-400 font-medium">Network Information</span>
            </div>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-gray-400">Send on:</span> {fromToken.network} Network
              </p>
              <p className="text-sm">
                <span className="text-gray-400">Receive on:</span> {toToken.network} Network
              </p>
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">You Send</span>
              <span>{fromAmount} {fromToken.symbol}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">You Receive</span>
              <span>{toAmount} {toToken.symbol}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Service Fee (1%)</span>
              <span>{fee.toFixed(8)} {fromToken.symbol}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Receiving Address</span>
              <span className="font-mono text-xs break-all">{toAddress}</span>
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