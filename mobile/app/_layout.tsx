import { Stack, useSegments, useRouter } from 'expo-router';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { AuthProvider, useAuth } from '../src/lib/auth-context';
import { View, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

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
      <StatusBar style="dark" />
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
    return <StartupSkeleton />;
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

function StartupSkeleton() {
  return (
    <View style={styles.skeletonRoot}>
      <View style={styles.skeletonHeader} />
      <View style={styles.skeletonCard} />
      <View style={styles.skeletonCard} />
      <View style={styles.skeletonCard} />
      <View style={styles.skeletonTabBar}>
        <View style={styles.skeletonTabDot} />
        <View style={styles.skeletonTabDot} />
        <View style={styles.skeletonTabDot} />
        <View style={styles.skeletonTabDot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeletonRoot: { flex: 1, backgroundColor: '#fff', paddingTop: 24 },
  skeletonHeader: { height: 28, borderRadius: 8, backgroundColor: '#e5e7eb', marginHorizontal: 16, marginBottom: 18 },
  skeletonCard: { height: 150, borderRadius: 12, backgroundColor: '#e5e7eb', marginHorizontal: 12, marginBottom: 12 },
  skeletonTabBar: {
    marginTop: 'auto',
    height: 64,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  skeletonTabDot: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#e5e7eb' },
});
