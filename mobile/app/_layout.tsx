import { Stack, useSegments, useRouter } from 'expo-router';
import { Provider as PaperProvider, MD3LightTheme, ActivityIndicator } from 'react-native-paper';
import { AuthProvider, useAuth } from '../src/lib/auth-context';
import { View, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    onSurface: '#1f2937',
    primary: '#405de6',
  },
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'auth_group';

    // If not authenticated and not in auth group, force to login
    if (!user && !inAuthGroup) {
      router.replace('/auth_group/login');
    } 
    // If authenticated and in auth group, force to tabs
    else if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="auth_group/login" />
      <Stack.Screen name="auth_group/register" />
      <Stack.Screen name="auth_group/forgot-password" />
    </Stack>
  );
}

const styles = StyleSheet.create({ center: { flex: 1, justifyContent: 'center', alignItems: 'center' } });
