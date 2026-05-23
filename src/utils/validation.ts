export const MIN_SWAP_AMOUNT_USD = 200;
export const MIN_WITHDRAWAL_AMOUNT_USD = 500;
export const MAX_WITHDRAWAL_AMOUNT_USD = 10000;
export const MAX_PAYPAL_AMOUNT_USD = 50000;
export const MIN_ESCROW_AMOUNT_USD = 500;

export const validateSwapAmount = (amountUSD: number): string | null => {
  if (amountUSD < MIN_SWAP_AMOUNT_USD) {
    return `Minimum swap amount is $${MIN_SWAP_AMOUNT_USD}`;
  }
  return null;
};

export const validateEscrowAmount = (amountUSD: number): string | null => {
  if (amountUSD < MIN_ESCROW_AMOUNT_USD) {
    return `Minimum escrow service amount is $${MIN_ESCROW_AMOUNT_USD}`;
  }
  return null;
};

export const validateWithdrawalAmount = (amountUSD: number): string | null => {
  if (amountUSD < MIN_WITHDRAWAL_AMOUNT_USD) {
    return `Minimum withdrawal amount is $${MIN_WITHDRAWAL_AMOUNT_USD}`;
  }
  if (amountUSD > MAX_WITHDRAWAL_AMOUNT_USD) {
    return `Maximum withdrawal amount is $${MAX_WITHDRAWAL_AMOUNT_USD}`;
  }
  return null;
};

export const validatePaypalAmount = (amountUSD: number): string | null => {
  if (amountUSD < MIN_WITHDRAWAL_AMOUNT_USD) {
    return `Minimum PayPal withdrawal amount is $${MIN_WITHDRAWAL_AMOUNT_USD}`;
  }
  if (amountUSD > MAX_PAYPAL_AMOUNT_USD) {
    return `Maximum PayPal withdrawal amount is $${MAX_PAYPAL_AMOUNT_USD}`;
  }
  return null;
};