import React, { useState } from 'react';
import { Banknote, Info, AlertTriangle } from 'lucide-react';
import CountrySelector from './CountrySelector';
import RecipientForm from './RecipientForm';
import WithdrawalSummary from './WithdrawalSummary';
import WithdrawalModal from './WithdrawalModal';
import CryptoSelector from '../withdrawal/CryptoSelector';
import WithdrawalLimits from '../withdrawal/WithdrawalLimits';
import { useCryptoPrices } from '../../hooks/useCryptoPrices';
import { tokens } from '../../data/tokens';
import { validateWithdrawalAmount } from '../../utils/validation';
import { createCashWithdrawalOperation } from '../../services/operations';

const WITHDRAWAL_FEE = 0.02; // 2% fee

export default function CashWithdrawalForm() {
  const { prices, loading } = useCryptoPrices();
  const [selectedToken, setSelectedToken] = useState(tokens[0]);
  const [amount, setAmount] = useState('');
  const [country, setCountry] = useState('');
  const [recipientInfo, setRecipientInfo] = useState({
    fullName: '',
    address: '',
    email: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAmountChange = (value: string) => {
    const numAmount = parseFloat(value);
    const tokenPrice = prices[selectedToken.symbol] || 0;
    const amountUSD = numAmount * tokenPrice;
    
    const validationError = validateWithdrawalAmount(amountUSD);
    setError(validationError);
    setAmount(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (error) {
      alert(error);
      return;
    }

    if (!recipientInfo.fullName || !recipientInfo.address || !recipientInfo.email || !country || !amount) {
      alert('Please fill in all required fields');
      return;
    }

    if (!recipientInfo.email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      const operationId = await createCashWithdrawalOperation({
        userEmail: recipientInfo.email,
        token: selectedToken.symbol,
        amount: numAmount,
        country,
        recipientName: recipientInfo.fullName,
        recipientAddress: recipientInfo.address,
        recipientEmail: recipientInfo.email,
        fee: feeAmount,
        finalAmount,
      });

      console.log('Cash withdrawal operation created with ID:', operationId);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Failed to create cash withdrawal operation:', error);
      alert('Failed to create withdrawal operation. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500 mx-auto"></div>
        <p className="mt-4 text-gray-400">Loading cryptocurrency data...</p>
      </div>
    );
  }

  const tokenPrice = prices[selectedToken.symbol] || 0;
  const numAmount = parseFloat(amount) || 0;
  const feeAmount = numAmount * WITHDRAWAL_FEE;
  const finalAmount = numAmount - feeAmount;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700">
        <div className="flex items-center mb-6">
          <Banknote className="w-6 h-6 text-violet-400 mr-2" />
          <h2 className="text-xl font-bold">Cash Withdrawal</h2>
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
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition-colors"
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

              <CountrySelector
                value={country}
                onChange={setCountry}
              />

              <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
                <div className="flex items-center text-violet-400 mb-2">
                  <Info className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Withdrawal Fee</span>
                </div>
                <p className="text-sm text-gray-400">
                  A flat 2% fee is applied to all cash withdrawals. No additional network or hidden fees.
                </p>
              </div>
            </div>

            <div>
              <RecipientForm
                values={recipientInfo}
                onChange={setRecipientInfo}
                selectedCountry={country}
              />
            </div>
          </div>

          <WithdrawalSummary
            amount={numAmount}
            token={selectedToken}
            fee={feeAmount}
            total={finalAmount}
            recipientInfo={recipientInfo}
            country={country}
            tokenPrice={tokenPrice}
          />

          <button
            type="submit"
            disabled={!!error || !amount}
            className={`w-full py-4 px-6 rounded-xl font-semibold transition-colors ${
              error || !amount
                ? 'bg-slate-600 cursor-not-allowed'
                : 'bg-violet-600 hover:bg-violet-700'
            }`}
          >
            {error ? 'Invalid Amount' : 'Proceed with Withdrawal'}
          </button>
        </form>
      </div>

      <WithdrawalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        token={selectedToken}
        amount={numAmount}
        recipientInfo={recipientInfo}
        finalAmount={finalAmount}
      />
    </div>
  );
}