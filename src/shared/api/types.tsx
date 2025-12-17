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
