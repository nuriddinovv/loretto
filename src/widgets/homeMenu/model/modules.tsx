import { icons } from '@/shared/assets';
import type { ImageSourcePropType } from 'react-native';

export type PermissionKey =
  | 'cashReport'
  | 'chartsOfAccounts'
  | 'journalEntry'
  | 'clients'
  | 'currencyExchange'
  | 'setRate';

export type HomeModule = {
  route: string;
  text: string;
  image: ImageSourcePropType;
  permissionKey?: PermissionKey;
};

export const modules: HomeModule[] = [
  {
    route: 'exchange-rate',
    text: 'VALYUTA KURSI',
    image: icons.exchangeRate,
  },
  {
    route: 'currency-exchange',
    text: 'VALYUTA ALMASHTIRISH',
    image: icons.exchange,
    permissionKey: 'currencyExchange',
  },
  {
    route: 'accounting-operation',
    text: 'BUXGALTERSKIY OPERATSIYA',
    image: icons.accountingOperation,
    permissionKey: 'journalEntry',
  },
  {
    route: 'clients',
    text: 'MIJOZLAR',
    image: icons.clients,
    permissionKey: 'clients',
  },
  {
    route: 'chart-of-accounts',
    text: 'PLAN SCHETOV',
    image: icons.chartOfAccounts,
    permissionKey: 'chartsOfAccounts',
  },
  {
    route: 'cash-report',
    text: 'KASSA OTCHET',
    image: icons.cashierReport,
    permissionKey: 'cashReport',
  },
];
