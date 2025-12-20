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

export type InvoiceData = {
  accountCode: string | null;
  bplid: number;
  credit: number;
  contraAccount: string | null;
  debit: number;
  fccredit: number;
  fccurrency: string;
  fcdebit: number;
  shortName: string;
  name: string;
};

export type CashReportResponse = {
  status: string;
  data: CashReport;
  error: null | ApiError;
};

export type CashReport = {
  acctCode: string | null;
  acctName: string | null;
  openingBalanceUZS: number;
  openingBalanceUSD: number;
  closingBalanceUZS: number;
  closingBalanceUSD: number;
  averageRate: number;
  lines: CashReportLine[];
};

export type CashReportLine = {
  number: number;
  type: string;
  acctCode: string;
  acctName: string;
  refDate: string;
  amountUZS: number;
  amountUSD: number;
  memo: string | null;
  cardName: string;
  rate: number;
};
