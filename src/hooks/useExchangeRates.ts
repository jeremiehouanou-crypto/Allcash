import { useState, useEffect } from 'react';

export interface ExchangeRates {
  EUR: number;
  USD: number;
  RON: number;
  CHF: number;
}

export function useExchangeRates() {
  const [rates, setRates] = useState<ExchangeRates>({
    EUR: 1,
    USD: 1,
    RON: 1,
    CHF: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch(
          'https://api.exchangerate-api.com/v4/latest/USD'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch exchange rates');
        }

        const data = await response.json();

        setRates({
          USD: 1,
          EUR: data.rates.EUR,
          RON: data.rates.RON,
          CHF: data.rates.CHF,
        });
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch rates');
        setLoading(false);
      }
    };

    fetchRates();
    const interval = setInterval(fetchRates, 300000);

    return () => clearInterval(interval);
  }, []);

  return { rates, loading, error };
}
