import { CryptoToken } from '../types/crypto';

const SWAP_FEE_RATE = 0.01; // 1% swap fee
const PAYPAL_FEE_USD = 5; // $5 USD fixed PayPal fee

export const calculateSwapAmount = (
  fromAmount: number,
  fromTokenPrice: number,
  toTokenPrice: number
): { toAmount: number; fee: number } => {
  const fromAmountUSD = fromAmount * fromTokenPrice;
  const fee = fromAmountUSD * SWAP_FEE_RATE;
  const netAmountUSD = fromAmountUSD - fee;
  const toAmount = netAmountUSD / toTokenPrice;

  return {
    toAmount,
    fee: fee / fromTokenPrice // Convert fee back to source token amount
  };
};

export const calculateWithdrawalFee = (
  amount: number,
  token: CryptoToken,
  priority: 'standard' | 'express' | 'instant'
): { fee: number; total: number } => {
  let feePercentage = 0.02; // Base fee 2%

  switch (priority) {
    case 'instant':
      feePercentage += 0.03; // Additional 3%
      break;
    case 'express':
      feePercentage += 0.015; // Additional 1.5%
      break;
    default:
      break;
  }

  const fee = amount * feePercentage;
  const total = amount - fee;

  return { fee, total };
};

export const calculatePaypalFees = (
  amount: number,
  tokenPrice: number
): { serviceFee: number; paypalFee: number; total: number } => {
  const amountUSD = amount * tokenPrice;
  const serviceFeeUSD = amountUSD * 0.01; // 1% service fee
  const paypalFeeUSD = PAYPAL_FEE_USD;

  const serviceFee = serviceFeeUSD / tokenPrice;
  const paypalFee = paypalFeeUSD / tokenPrice;
  const total = amount - serviceFee - paypalFee;

  return {
    serviceFee,
    paypalFee,
    total
  };
};