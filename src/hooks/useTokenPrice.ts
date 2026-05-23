import { useState, useEffect } from 'react';
import { CryptoToken } from '../types/crypto';

export function useTokenPrice(token: CryptoToken) {
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${token.coingeckoId}&vs_currencies=usd`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch price');
        }

        const data = await response.json();
        setPrice(data[token.coingeckoId]?.usd || 0);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch price');
        setLoading(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 30000);

    return () => clearInterval(interval);
  }, [token.coingeckoId]);

  return { price, loading, error };
}