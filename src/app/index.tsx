import Toast from 'react-native-toast-message';
import { Providers } from './providers';
import { AppRouter } from './router';

export default function App() {
  return (
    <Providers>
      <AppRouter />
      <Toast />
    </Providers>
  );
}
