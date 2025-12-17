import { setAuthHeaders } from '@/shared/api';
import React, { createContext, useContext, useMemo, useState } from 'react';

export type Permissions = {
  cashReport: boolean;
  chartsOfAccounts: boolean;
  journalEntry: boolean;
  clients: boolean;
  currencyExchange: boolean;
  setRate: boolean;
};

export type AuthState = {
  userCode: string | null;
  isSuperUser: boolean;
  sessionId: string | null;
  permissions: Permissions | null;
};

type AuthContextValue = AuthState & {
  setAuthFromLogin: (payload: {
    userCode: string;
    isSuperUser: boolean;
    sessionId: string;
    permissions: Permissions;
  }) => void;
  clearAuth: () => void;
  can: (key: keyof Permissions) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const EMPTY: AuthState = {
  userCode: null,
  isSuperUser: false,
  sessionId: null,
  permissions: null,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(EMPTY);

  const value = useMemo<AuthContextValue>(() => {
    const setAuthFromLogin: AuthContextValue['setAuthFromLogin'] = p => {
      setState({
        userCode: p.userCode,
        isSuperUser: p.isSuperUser,
        sessionId: p.sessionId,
        permissions: p.permissions,
      });

      // axios headerlarni 1 marta o‘rnatamiz
      setAuthHeaders({ sessionId: p.sessionId, userCode: p.userCode });
    };

    const clearAuth = () => {
      setState(EMPTY);
      setAuthHeaders({ sessionId: null, userCode: null });
    };

    const can = (key: keyof Permissions) => {
      if (state.isSuperUser) return true;
      return !!state.permissions?.[key];
    };

    return { ...state, setAuthFromLogin, clearAuth, can };
  }, [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
