import { Stack } from "expo-router";
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { AuthProvider } from '../src/lib/auth-context';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // change typography color
    onSurface: '#1f2937',
    primary: '#405de6',
  },
};

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <Stack />
      </AuthProvider>
    </PaperProvider>
  );
}
