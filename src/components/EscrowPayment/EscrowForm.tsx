import React, { useState } from 'react';
import { AlertTriangle, Shield } from 'lucide-react';
import CryptoSelector from '../withdrawal/CryptoSelector';
import { useCryptoPrices } from '../../hooks/useCryptoPrices';
import { useExchangeRates } from '../../hooks/useExchangeRates';
import { tokens } from '../../data/tokens';
import { validateEscrowAmount } from '../../utils/validation';
import { generateEscrowId, validateEmail } from '../../utils/escrow';
import { createEscrowOperation } from '../../services/operations';
import EscrowModal from './EscrowModal';
import EscrowNotice from './EscrowNotice';
import EmailInputs from './EmailInputs';
import EscrowSummary from './EscrowSummary';
import SellerAddressInput from './SellerAddressInput';
import DescriptionInput from './DescriptionInput';
import MultiCurrencyInput from './MultiCurrencyInput';
import CurrencyConverter from './CurrencyConverter';

export default function EscrowForm() {
  const { prices, loading } = useCryptoPrices();
  const { rates, loading: ratesLoading } = useExchangeRates();
  const [selectedToken, setSelectedToken] = useState(tokens[0]);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [fiatAmount, setFiatAmount] = useState('');
  const [description, setDescription] = useState('');
  const [sellerAddress, setSellerAddress] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [escrowId, setEscrowId] = useState<string>('');

  const handleFiatAmountChange = (value: string) => {
    const numFiatAmount = parseFloat(value);
    const rate = rates[selectedCurrency as keyof typeof rates];
    const amountUSD = numFiatAmount / rate;

    const validationError = validateEscrowAmount(amountUSD);
    setError(validationError);
    setFiatAmount(value);
  };

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (error) {
      alert(error);
      return;
    }

    if (!sellerAddress) {
      alert('Please enter the seller\'s address');
      return;
    }

    if (!description) {
      alert('Please enter a description of the goods or services');
      return;
    }

    if (!validateEmail(buyerEmail)) {
      alert('Please enter a valid buyer email address');
      return;
    }

    if (!validateEmail(sellerEmail)) {
      alert('Please enter a valid seller email address');
      return;
    }

    try {
      const numFiatAmount = parseFloat(fiatAmount);
      const rate = rates[selectedCurrency as keyof typeof rates];
      const amountUSD = numFiatAmount / rate;
      const tokenPrice = prices[selectedToken.symbol] || 0;
      const cryptoAmount = amountUSD / tokenPrice;

      const operationId = await createEscrowOperation({
        userEmail: buyerEmail,
        token: selectedToken.symbol,
        amount: cryptoAmount,
        buyerEmail,
        sellerEmail,
        sellerAddress,
        description,
      });

      console.log('Escrow operation created with ID:', operationId);
      setEscrowId(operationId);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Failed to create escrow operation:', error);
      alert('Failed to create escrow operation. Please try again.');
    }
  };

  if (loading || ratesLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-400">Loading exchange rates and cryptocurrency data...</p>
      </div>
    );
  }

  const tokenPrice = prices[selectedToken.symbol] || 0;
  const numFiatAmount = parseFloat(fiatAmount) || 0;
  const rate = rates[selectedCurrency as keyof typeof rates];
  const amountUSD = numFiatAmount / rate;
  const cryptoAmount = amountUSD / tokenPrice;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700">
        <div className="flex items-center mb-6">
          <Shield className="w-6 h-6 text-violet-400 mr-2" />
          <h2 className="text-xl font-bold">Escrow Payment</h2>
        </div>

        <EscrowNotice />

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <CryptoSelector
                selectedToken={selectedToken}
                onSelect={setSelectedToken}
                prices={prices}
              />

              <MultiCurrencyInput
                selectedCurrency={selectedCurrency}
                onCurrencyChange={handleCurrencyChange}
                amount={fiatAmount}
                onAmountChange={handleFiatAmountChange}
                cryptoPrice={tokenPrice}
                exchangeRates={rates}
              />

              <CurrencyConverter
                cryptoAmount={cryptoAmount}
                cryptoPrice={tokenPrice}
                exchangeRates={rates}
              />

              <SellerAddressInput
                value={sellerAddress}
                onChange={setSellerAddress}
                token={selectedToken}
              />

              <DescriptionInput
                value={description}
                onChange={setDescription}
              />
            </div>

            <div className="space-y-6">
              <EmailInputs
                buyerEmail={buyerEmail}
                sellerEmail={sellerEmail}
                onBuyerEmailChange={setBuyerEmail}
                onSellerEmailChange={setSellerEmail}
              />

              <EscrowSummary
                amount={cryptoAmount}
                token={selectedToken}
                tokenPrice={tokenPrice}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!!error || !fiatAmount}
            className={`w-full py-4 px-6 rounded-xl font-semibold transition-colors ${
              error || !fiatAmount
                ? 'bg-slate-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {error ? 'Invalid Amount' : 'Create Escrow'}
          </button>
        </form>

        <EscrowModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          token={selectedToken}
          amount={cryptoAmount}
          sellerAddress={sellerAddress}
          description={description}
          escrowId={escrowId}
          buyerEmail={buyerEmail}
          sellerEmail={sellerEmail}
        />
      </div>
    </div>
  );
}