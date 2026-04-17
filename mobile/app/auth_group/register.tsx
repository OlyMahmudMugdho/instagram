import React, { useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Title, Paragraph, Avatar, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/lib/auth-context';

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const theme = useTheme();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onRegister = async () => {
    if (!name || !username || !email || !password || !confirmPassword) {
      Alert.alert('Validation', 'Please fill all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Validation', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await register({ name, username, email, password });
      if (res.success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', String(res.message || 'Registration failed'));
      }
    } catch (err) {
      Alert.alert('Error', String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Avatar.Icon size={84} icon="account-plus" />
          <Title style={styles.title}>Create account</Title>
          <Paragraph style={styles.subtitle}>Join and start sharing moments</Paragraph>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            outlineColor="#e5e7eb"
            activeOutlineColor={theme.colors.primary}
            style={[styles.input, { backgroundColor: theme.colors.surface, borderRadius: 8 }]}
            contentStyle={styles.inputContent}
          />
          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            mode="outlined"
            outlineColor="#e5e7eb"
            activeOutlineColor={theme.colors.primary}
            style={[styles.input, { backgroundColor: theme.colors.surface, borderRadius: 8 }]}
            contentStyle={styles.inputContent}
          />
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            mode="outlined"
            outlineColor="#e5e7eb"
            activeOutlineColor={theme.colors.primary}
            style={[styles.input, { backgroundColor: theme.colors.surface, borderRadius: 8 }]}
            contentStyle={styles.inputContent}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            mode="outlined"
            outlineColor="#e5e7eb"
            activeOutlineColor={theme.colors.primary}
            right={<TextInput.Icon name={showPassword ? 'eye' : 'eye-off'} onPress={() => setShowPassword(v => !v)} />}
            style={[styles.input, { backgroundColor: theme.colors.surface, borderRadius: 8 }]}
            contentStyle={styles.inputContent}
          />
          <TextInput
            label="Confirm password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            mode="outlined"
            outlineColor="#e5e7eb"
            activeOutlineColor={theme.colors.primary}
            right={<TextInput.Icon name={showConfirmPassword ? 'eye' : 'eye-off'} onPress={() => setShowConfirmPassword(v => !v)} />}
            style={[styles.input, { backgroundColor: theme.colors.surface, borderRadius: 8 }]}
            contentStyle={styles.inputContent}
          />

          <Button mode="contained" onPress={onRegister} loading={loading} disabled={loading} contentStyle={styles.buttonContent} style={styles.button}>
            Create account
          </Button>
          <Button mode="text" onPress={() => router.replace('/auth_group/login')}>
            Back to sign in
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  inputContent: {
    paddingLeft: 12,
    paddingRight: 12,
  },
  button: {
    marginTop: 6,
  },
  buttonContent: {
    height: 48,
  },
});
