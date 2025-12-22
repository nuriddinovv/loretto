import { useMutation } from '@tanstack/react-query';
import { loginApi, type LoginPayload } from '../api/login.api';
import { useAuth } from '@/entities/session';
import { navigate } from '@/shared/lib/NavigationService';
import Toast from 'react-native-toast-message';

export function useLoginMutation() {
  const { setAuthFromLogin } = useAuth();

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload),
    onSuccess: res => {
      if (res.status !== 'success') return;
      const d = res.data;
      setAuthFromLogin({
        userCode: d.userCode,
        isSuperUser: d.isSuperUser,
        sessionId: d.sessionId,
        permissions: {
          cashReport: d.cashReport,
          chartsOfAccounts: d.chartsOfAccounts,
          journalEntry: d.journalEntry,
          clients: d.clients,
          currencyExchange: d.currencyExchange,
          setRate: d.setRate,
        },
      });

      navigate('home');
    },
    onError: err => {
      Toast.show({
        type: 'error',
        //@ts-ignore
        text1: `Error Code: ${err.code}`,
        text2: err.message,
      });
    },
  });
}
