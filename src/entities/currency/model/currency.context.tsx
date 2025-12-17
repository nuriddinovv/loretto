import React, { createContext, useContext, useMemo, useState } from 'react';

type CurrencyContextValue = {
  rate: number | null;
  setRate: (rate: number | null) => void;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [rate, setRateState] = useState<number | null>(null);

  const value = useMemo(
    () => ({
      rate,
      setRate: (v: number | null) => setRateState(v),
    }),
    [rate],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
