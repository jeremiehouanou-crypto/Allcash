export interface CryptoToken {
  symbol: string;
  name: string;
  icon: string;
  network: string;
  receiveAddress: string;
  coingeckoId: string;
  usdPrice: number;
}

export interface SwapFormData {
  fromAmount: string;
  toAmount: string;
  toAddress: string;
  fromToken: CryptoToken;
  toToken: CryptoToken;
  priority: 'economic' | 'regular' | 'priority';
}