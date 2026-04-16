import React, { useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Title, Paragraph, Avatar, Snackbar, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/lib/auth-context';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || 'http://10.0.2.2:5000';



export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const theme = useTheme();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onLogin = async () => {
    if (!username || !password) {
      Alert.alert('Validation', 'Please enter username and password');
      return;
    }

    setLoading(true);
    try {
      const res = await login({ username, password });
      if (!res.success) {
        const msg = res.message || 'Login failed. Check your credentials.';
        setErrorMessage(msg);
        return;
      }
      setErrorMessage(null);
      router.replace('/');
    } catch (err) {
      console.error('Login error', err);
      setErrorMessage(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Avatar.Icon size={84} icon="camera" />
            <Title style={styles.title}>Welcome back</Title>
            <Paragraph style={styles.subtitle}>Sign in to continue to Instagram</Paragraph>
          </View>

          <View style={styles.form}>
            <TextInput
              label="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              mode="outlined"
              outlineColor="#e5e7eb"
              activeOutlineColor={theme.colors.primary}
              selectionColor={theme.colors.primary}
              style={[styles.input, { backgroundColor: theme.colors.surface, borderRadius: 8 }]}
              contentStyle={{ paddingLeft: 12, paddingRight: 12 }}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!visible}
              mode="outlined"
              outlineColor="#e5e7eb"
              activeOutlineColor={theme.colors.primary}
              selectionColor={theme.colors.primary}
              right={<TextInput.Icon name={visible ? 'eye' : 'eye-off'} onPress={() => setVisible(v => !v)} />}
              style={[styles.input, { backgroundColor: theme.colors.surface, borderRadius: 8 }]}
              contentStyle={{ paddingLeft: 12, paddingRight: 12 }}
            />

            <Button
              mode="contained"
              onPress={onLogin}
              loading={loading}
              disabled={loading || !username || !password}
              contentStyle={styles.buttonContent}
              style={styles.button}
            >
              Sign in
            </Button>

            <Button
              mode="text"
              onPress={() => router.push('/forgot-password')}
              labelStyle={{ color: theme.colors.primary }}
            >
              Forgot password?
            </Button>

            <View style={styles.divider} />

            <Button
              mode="outlined"
              onPress={() => router.push('/register')}
              style={styles.button}
              labelStyle={{ color: theme.colors.primary }}
            >
              Create account
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Snackbar visible={!!errorMessage} onDismiss={() => setErrorMessage(null)} duration={4000} action={{ label: 'OK', onPress: () => setErrorMessage(null) }}>
        {errorMessage}
      </Snackbar>
    </>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  subtitle: {
    marginTop: 6,
    color: '#374151',
    textAlign: 'center',
  },
  form: {
    gap: 12,
  },
  input: {
    backgroundColor: 'transparent',
  },
  button: {
    marginTop: 6,
  },
  buttonContent: {
    height: 48,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
});
