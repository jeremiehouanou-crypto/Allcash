import { useState, useEffect } from 'react';
import { tokens } from '../data/tokens';

export function useCryptoPrices() {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const ids = tokens.map(token => token.coingeckoId).join(',');
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch prices');
        }

        const data = await response.json();
        
        const updatedPrices: Record<string, number> = {};
        tokens.forEach(token => {
          updatedPrices[token.symbol] = data[token.coingeckoId]?.usd || 0;
        });

        setPrices(updatedPrices);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch prices');
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return { prices, loading, error };
}