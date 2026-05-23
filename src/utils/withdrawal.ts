interface WithdrawalAmount {
  finalAmount: number;
  feeAmount: number;
}

export function calculateWithdrawalAmount(amount: number, feeRate: number): WithdrawalAmount {
  const feeAmount = amount * feeRate;
  const finalAmount = amount - feeAmount;

  return {
    finalAmount,
    feeAmount
  };
}