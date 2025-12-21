import { AppState, AppStateStatus } from 'react-native';
import { useEffect, useRef } from 'react';
import { CommonActions, useNavigation } from '@react-navigation/native';

export function AppStateWatcher() {
  const navigation = useNavigation();
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const sub = AppState.addEventListener('change', nextState => {
      if (
        appState.current === 'active' &&
        (nextState === 'background' || nextState === 'inactive')
      ) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'login' }],
          }),
        );
      }

      appState.current = nextState;
    });

    return () => sub.remove();
  }, []);

  return null;
}
