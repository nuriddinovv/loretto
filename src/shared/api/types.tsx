export type ApiError = {
  code: string;
  message: string;
};

export type LoginResponse = {
  status: string;
  data: LoginData;
  error: null | ApiError;
};

export type LoginData = {
  userCode: string;
  isSuperUser: boolean;
  cashReport: boolean;
  chartsOfAccounts: boolean;
  journalEntry: boolean;
  clients: boolean;
  currencyExchange: boolean;
  setRate: boolean;
  sessionId: string;
};

export type ExchangeRate = {
  currency: string;
  rate: string | null;
  rateDate: string;
};

export type Client = {
  cardCode: string;
  cardName: string;

  groupCode: number;
  groupName: string;

  phone1: string | null;
  phone2: string | null;

  balance: number;
  currency: string;

  balanceFC: number;
  currencyFC: string;

  slpCode: number;
  slpName: string;
};

export type ChartOfAccount = {
  acctCode: string;
  acctName: string;
  balance: number;
  currency: string;
  balanceUSD: number;
};
