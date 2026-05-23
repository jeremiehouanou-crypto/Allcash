import React, { useState } from 'react';
import { AlertTriangle, Banknote, Info } from 'lucide-react';
import CryptoSelector from '../withdrawal/CryptoSelector';
import WithdrawalLimits from '../withdrawal/WithdrawalLimits';
import PaypalWithdrawalSummary from './PaypalWithdrawalSummary';
import PaypalWithdrawalModal from './PaypalWithdrawalModal';
import { useCryptoPrices } from '../../hooks/useCryptoPrices';
import { tokens } from '../../data/tokens';
import { validatePaypalAmount } from '../../utils/validation';
import { calculatePaypalFees } from '../../utils/fees';
import { createPaypalWithdrawalOperation } from '../../services/operations';

const PAYPAL_FEE = 0.025;

export default function PaypalWithdrawalForm() {
  const { prices, loading } = useCryptoPrices();
  const [selectedToken, setSelectedToken] = useState(tokens[0]);
  const [amount, setAmount] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAmountChange = (value: string) => {
    const numAmount = parseFloat(value);
    const tokenPrice = prices[selectedToken.symbol] || 0;
    const amountUSD = numAmount * tokenPrice;

    const validationError = validatePaypalAmount(amountUSD);
    setError(validationError);
    setAmount(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (error) {
      alert(error);
      return;
    }

    if (!paypalEmail) {
      alert('Please enter your PayPal email address');
      return;
    }

    if (!paypalEmail.includes('@')) {
      alert('Please enter a valid PayPal email address');
      return;
    }

    if (!amount) {
      alert('Please enter an amount');
      return;
    }

    try {
      const operationId = await createPaypalWithdrawalOperation({
        userEmail: paypalEmail,
        token: selectedToken.symbol,
        amount: numAmount,
        paypalEmail,
        fee: feeAmount,
        finalAmount,
      });

      console.log('PayPal withdrawal operation created with ID:', operationId);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Failed to create PayPal withdrawal operation:', error);
      alert('Failed to create withdrawal operation. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-400">Loading cryptocurrency data...</p>
      </div>
    );
  }

  const tokenPrice = prices[selectedToken.symbol] || 0;
  const numAmount = parseFloat(amount) || 0;
  const feeAmount = numAmount * PAYPAL_FEE;
  const finalAmount = numAmount - feeAmount;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700">
        <div className="flex items-center mb-6">
          <Banknote className="w-6 h-6 text-blue-400 mr-2" />
          <h2 className="text-xl font-bold">PayPal Withdrawal</h2>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
          <div className="flex items-center text-blue-400 mb-2">
            <Info className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">PayPal Withdrawal Info</span>
          </div>
          <p className="text-sm text-gray-400">
            Convert your cryptocurrency to USD and receive it directly in your PayPal account. Processing time: 1-3 business days.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <CryptoSelector
                selectedToken={selectedToken}
                onSelect={setSelectedToken}
                prices={prices}
              />

              <div>
                <label className="block text-sm text-gray-400 mb-2">Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder={`Enter amount in ${selectedToken.symbol}`}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                    step="any"
                  />
                  {amount && (
                    <div className="mt-1 text-sm text-gray-400">
                      ≈ ${(numAmount * tokenPrice).toFixed(2)}
                    </div>
                  )}
                </div>

                <WithdrawalLimits
                  token={selectedToken}
                  price={tokenPrice}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">PayPal Email Address</label>
                <input
                  type="email"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-center text-blue-400 mb-2">
                  <Info className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Withdrawal Fee</span>
                </div>
                <p className="text-sm text-gray-400">
                  A 2.5% fee is applied to all PayPal withdrawals to cover processing costs.
                </p>
              </div>
            </div>

            <div>
              <PaypalWithdrawalSummary
                amount={numAmount}
                token={selectedToken}
                fee={feeAmount}
                total={finalAmount}
                paypalEmail={paypalEmail}
                tokenPrice={tokenPrice}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!!error || !amount || !paypalEmail}
            className={`w-full py-4 px-6 rounded-xl font-semibold transition-colors ${
              error || !amount || !paypalEmail
                ? 'bg-slate-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {error ? 'Invalid Amount' : 'Proceed with Withdrawal'}
          </button>
        </form>
      </div>

      <PaypalWithdrawalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        token={selectedToken}
        amount={numAmount}
        paypalEmail={paypalEmail}
        finalAmount={finalAmount}
        fee={feeAmount}
      />
    </div>
  );
}
