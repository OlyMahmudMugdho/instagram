import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Button, Paragraph, TextInput, Title, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { authService } from '../../src/services/auth';

type Step = 'email' | 'code' | 'reset';

export default function ForgotPassword() {
  const router = useRouter();
  const theme = useTheme();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const sendCode = async () => {
    if (!email) {
      Alert.alert('Validation', 'Please enter your email');
      return;
    }
    setLoading(true);
    try {
      const res = await authService.forgotPassword(email.trim());
      if (res.success) {
        Alert.alert('Success', 'Reset code sent to your email');
        setStep('code');
      } else {
        Alert.alert('Error', String(res.message || 'Failed to send code'));
      }
    } catch (err) {
      Alert.alert('Error', String(err));
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!code) {
      Alert.alert('Validation', 'Please enter the verification code');
      return;
    }
    setLoading(true);
    try {
      const res = await authService.verifyResetCode(email.trim(), code.trim());
      if (res.success) {
        setStep('reset');
      } else {
        Alert.alert('Error', String(res.message || 'Invalid verification code'));
      }
    } catch (err) {
      Alert.alert('Error', String(err));
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Validation', 'Please enter and confirm your new password');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Validation', 'Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await authService.resetPassword(email.trim(), newPassword, confirmPassword);
      if (res.success) {
        Alert.alert('Success', 'Password updated. Please sign in.');
        router.replace('/auth_group/login');
      } else {
        Alert.alert('Error', String(res.message || 'Failed to reset password'));
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
          <Avatar.Icon size={84} icon="lock-reset" />
          <Title style={styles.title}>Reset password</Title>
          <Paragraph style={styles.subtitle}>
            {step === 'email' ? 'Enter your email to receive a verification code' : step === 'code' ? `Enter the code sent to ${email}` : 'Set your new password'}
          </Paragraph>
        </View>

        <View style={styles.form}>
          {step === 'email' ? (
            <>
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
              <Button mode="contained" onPress={sendCode} loading={loading} disabled={loading} contentStyle={styles.buttonContent} style={styles.button}>
                Send code
              </Button>
            </>
          ) : null}

          {step === 'code' ? (
            <>
              <TextInput
                label="Verification code"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                mode="outlined"
                outlineColor="#e5e7eb"
                activeOutlineColor={theme.colors.primary}
                style={[styles.input, { backgroundColor: theme.colors.surface, borderRadius: 8 }]}
                contentStyle={styles.inputContent}
              />
              <Button mode="contained" onPress={verifyCode} loading={loading} disabled={loading} contentStyle={styles.buttonContent} style={styles.button}>
                Verify code
              </Button>
              <Button mode="text" onPress={sendCode} disabled={loading}>
                Resend code
              </Button>
            </>
          ) : null}

          {step === 'reset' ? (
            <>
              <TextInput
                label="New password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showPassword}
                mode="outlined"
                outlineColor="#e5e7eb"
                activeOutlineColor={theme.colors.primary}
                right={<TextInput.Icon name={showPassword ? 'eye' : 'eye-off'} onPress={() => setShowPassword(v => !v)} />}
                style={[styles.input, { backgroundColor: theme.colors.surface, borderRadius: 8 }]}
                contentStyle={styles.inputContent}
              />
              <TextInput
                label="Confirm new password"
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
              <Button mode="contained" onPress={resetPassword} loading={loading} disabled={loading} contentStyle={styles.buttonContent} style={styles.button}>
                Reset password
              </Button>
            </>
          ) : null}

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
