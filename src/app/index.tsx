import Toast from 'react-native-toast-message';
import { Providers } from './providers/Providers';
import { AppRouter } from './router';
import { AppStateWatcher } from '@/shared/lib/AppStateWatcher';

export default function App() {
  return (
    <Providers>
      <AppRouter />
      <AppStateWatcher />
      <Toast topOffset={60} />
    </Providers>
  );
}
