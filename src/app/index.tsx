import Toast from 'react-native-toast-message';
import { Providers } from './providers/Providers';
import { AppRouter } from './router';

export default function App() {
  return (
    <Providers>
      <AppRouter />
      <Toast topOffset={60} />
    </Providers>
  );
}
