import React, { useState } from 'react';
import { ArrowDownUp, AlertCircle, AlertTriangle } from 'lucide-react';
import TokenSelector from './TokenSelector';
import AddressInput from './AddressInput';
import SwapModal from './SwapModal';
import { tokens } from '../data/tokens';
import { useCryptoPrices } from '../hooks/useCryptoPrices';
import { calculateSwapAmount } from '../utils/fees';
import { validateSwapAmount } from '../utils/validation';
import type { CryptoToken, SwapFormData } from '../types/crypto';

function SwapCard() {
  const { prices, loading } = useCryptoPrices();
  const [formData, setFormData] = useState<SwapFormData>({
    fromAmount: '',
    toAmount: '',
    toAddress: '',
    fromToken: { ...tokens[0], usdPrice: 0 },
    toToken: { ...tokens[1], usdPrice: 0 },
    priority: 'regular'
  });
  const [error, setError] = useState<string | null>(null);
  const [isFromSelectorOpen, setIsFromSelectorOpen] = useState(false);
  const [isToSelectorOpen, setIsToSelectorOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getTokenWithPrice = (token: CryptoToken) => ({
    ...token,
    usdPrice: prices[token.symbol] || 0,
  });

  const calculateToAmount = (fromAmount: string) => {
    const amount = parseFloat(fromAmount);
    if (isNaN(amount)) return '';
    
    const fromPrice = prices[formData.fromToken.symbol] || 0;
    const toPrice = prices[formData.toToken.symbol] || 0;
    
    const { toAmount } = calculateSwapAmount(amount, fromPrice, toPrice);
    return toAmount.toFixed(8);
  };

  const handleFromAmountChange = (value: string) => {
    const amount = parseFloat(value);
    const fromPrice = prices[formData.fromToken.symbol] || 0;
    const amountUSD = amount * fromPrice;
    
    const validationError = validateSwapAmount(amountUSD);
    setError(validationError);
    
    setFormData(prev => ({
      ...prev,
      fromAmount: value,
      toAmount: calculateToAmount(value),
    }));
  };

  const handleSwap = () => {
    if (error) {
      alert(error);
      return;
    }
    if (!formData.toAddress) {
      alert('Please enter your receiving address');
      return;
    }
    if (!formData.fromAmount) {
      alert('Please enter the amount to swap');
      return;
    }
    
    setIsModalOpen(true);
  };

  const switchTokens = () => {
    setFormData(prev => ({
      ...prev,
      fromToken: prev.toToken,
      toToken: prev.fromToken,
      fromAmount: prev.toAmount,
      toAmount: prev.fromAmount,
    }));
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500 mx-auto"></div>
        <p className="mt-4 text-gray-400">Loading prices...</p>
      </div>
    );
  }

  const fromPrice = prices[formData.fromToken.symbol] || 0;
  const fromAmountUSD = parseFloat(formData.fromAmount) * fromPrice;
  const { fee } = calculateSwapAmount(
    parseFloat(formData.fromAmount) || 0,
    fromPrice,
    prices[formData.toToken.symbol] || 0
  );

  return (
    <>
      <div className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-slate-900/50 rounded-xl p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">You Send</span>
            <div className="text-right">
              <span className="text-sm text-gray-400">
                1 {formData.fromToken.symbol} = ${prices[formData.fromToken.symbol]?.toFixed(2) || '0.00'}
              </span>
              <div className="text-xs text-violet-400">{formData.fromToken.network} Network</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="number"
              value={formData.fromAmount}
              onChange={(e) => handleFromAmountChange(e.target.value)}
              placeholder="0.0"
              className="bg-transparent text-2xl outline-none w-full"
            />
            
            <TokenSelector
              selectedToken={formData.fromToken}
              onSelect={(token) => {
                setFormData(prev => ({
                  ...prev,
                  fromToken: getTokenWithPrice(token),
                  toAmount: calculateToAmount(prev.fromAmount),
                }));
                setError(null);
              }}
              isOpen={isFromSelectorOpen}
              onToggle={() => setIsFromSelectorOpen(!isFromSelectorOpen)}
            />
          </div>
          
          {formData.fromAmount && (
            <div className="mt-2 text-sm text-gray-400">
              ≈ ${fromAmountUSD.toFixed(2)}
            </div>
          )}
        </div>

        <div className="flex justify-center -my-2 relative z-10">
          <button 
            onClick={switchTokens}
            className="bg-slate-800 p-2 rounded-xl hover:bg-slate-700 transition-colors"
          >
            <ArrowDownUp className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">You Receive</span>
            <div className="text-right">
              <span className="text-sm text-gray-400">
                1 {formData.toToken.symbol} = ${prices[formData.toToken.symbol]?.toFixed(2) || '0.00'}
              </span>
              <div className="text-xs text-violet-400">{formData.toToken.network} Network</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="number"
              value={formData.toAmount}
              readOnly
              placeholder="0.0"
              className="bg-transparent text-2xl outline-none w-full"
            />
            
            <TokenSelector
              selectedToken={formData.toToken}
              onSelect={(token) => {
                setFormData(prev => ({
                  ...prev,
                  toToken: getTokenWithPrice(token),
                  toAmount: calculateToAmount(prev.fromAmount),
                }));
              }}
              isOpen={isToSelectorOpen}
              onToggle={() => setIsToSelectorOpen(!isToSelectorOpen)}
            />
          </div>
        </div>

        <AddressInput
          label="Your Receiving Address"
          value={formData.toAddress}
          onChange={(value) => setFormData(prev => ({ ...prev, toAddress: value }))}
          token={formData.toToken}
          placeholder={`Your ${formData.toToken.symbol} Address`}
        />

        <div className="bg-slate-900/50 rounded-xl p-4 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Service Fee (1%)</span>
            <span>${fee.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={handleSwap}
          disabled={!!error}
          className={`w-full py-4 px-6 rounded-xl font-semibold transition-colors ${
            error 
              ? 'bg-slate-600 cursor-not-allowed' 
              : 'bg-violet-600 hover:bg-violet-700'
          }`}
        >
          {error ? 'Invalid Amount' : 'Swap Now'}
        </button>
      </div>

      <SwapModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fromToken={formData.fromToken}
        toToken={formData.toToken}
        fromAmount={formData.fromAmount}
        toAmount={formData.toAmount}
        toAddress={formData.toAddress}
        fee={fee}
      />
    </>
  );
}

export default SwapCard;