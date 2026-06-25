import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store/AppContext';
import { useNavigation } from '../navigation/NavigationContext';
import { useFadeIn } from '../hooks/useFadeIn';
import { useTheme } from '../hooks/useTheme';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { palette, spacing, fontWeight } from '../theme';
import { Animated } from 'react-native';

const { height } = Dimensions.get('window');

export function LoginScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { login, state } = useApp();
  const { navigate, replace } = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { opacity: headerOpacity, translateY: headerY } = useFadeIn(100);
  const { opacity: formOpacity, translateY: formY } = useFadeIn(300);
  const { opacity: footerOpacity, translateY: footerY } = useFadeIn(500);

  const validate = () => {
    let valid = true;
    if (!email.includes('@') || !email.includes('.')) {
      setEmailError('Please enter a valid email address');
      valid = false;
    } else {
      setEmailError('');
    }
    if (password.length < 4) {
      setPasswordError('Password must be at least 4 characters');
      valid = false;
    } else {
      setPasswordError('');
    }
    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    const success = await login(email);
    if (success) {
      replace('Home');
    } else {
      setEmailError('No account found with this email');
    }
  };

  const handleDemoLogin = async () => {
    const success = await login('aryan@fotowl.ai');
    if (success) replace('Home');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          style={{ opacity: headerOpacity, transform: [{ translateY: headerY }] }}
        >
          <View style={styles.brandRow}>
            <Text style={styles.logoEmoji}>🦉</Text>
            <View>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: fontWeight.extrabold,
                  color: palette.primary,
                  letterSpacing: -0.5,
                }}
              >
                FotoOwl AI
              </Text>
              <Text variant="caption" color={theme.text.muted}>
                Photography Platform
              </Text>
            </View>
          </View>
          <Text variant="h1" color={theme.text.primary} style={styles.welcomeTitle}>
            Welcome back 👋
          </Text>
          <Text variant="body" color={theme.text.secondary} style={styles.subtitle}>
            Sign in to your photography workspace
          </Text>
        </Animated.View>

        {/* Form */}
        <Animated.View
          style={{ opacity: formOpacity, transform: [{ translateY: formY }], marginTop: spacing.xl }}
        >
          <Card elevated style={styles.formCard}>
            <Input
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={emailError}
              placeholder="you@example.com"
              leftIcon={<Text style={styles.inputIcon}>📧</Text>}
              returnKeyType="next"
            />
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              error={passwordError}
              placeholder="Enter your password"
              leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
              rightIcon={
                <Text style={styles.inputIcon}>{showPassword ? '🙈' : '👁️'}</Text>
              }
              onRightIconPress={() => setShowPassword(v => !v)}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />

            <TouchableOpacity
              style={styles.forgotLink}
              accessibilityRole="button"
              accessibilityLabel="Forgot password"
            >
              <Text variant="label" color={palette.primary}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <Button
              label="Sign In"
              onPress={handleLogin}
              loading={state.isLoading}
              fullWidth
              size="lg"
              style={styles.loginBtn}
            />

            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, { backgroundColor: theme.divider }]} />
              <Text variant="caption" color={theme.text.muted} style={{ marginHorizontal: spacing.sm }}>
                or
              </Text>
              <View style={[styles.dividerLine, { backgroundColor: theme.divider }]} />
            </View>

            <Button
              label="🚀  Try Demo Account"
              onPress={handleDemoLogin}
              variant="outline"
              fullWidth
              size="lg"
              loading={state.isLoading}
            />
          </Card>
        </Animated.View>

        {/* Footer */}
        <Animated.View
          style={{
            opacity: footerOpacity,
            transform: [{ translateY: footerY }],
            marginTop: spacing.xl,
            alignItems: 'center',
          }}
        >
          <Text variant="body" color={theme.text.secondary}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity
            onPress={() => navigate('Register')}
            accessibilityRole="button"
            accessibilityLabel="Create account"
          >
            <Text variant="label" color={palette.primary}>
              Create Account
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    flexGrow: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  logoEmoji: {
    fontSize: 40,
  },
  welcomeTitle: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    lineHeight: 22,
  },
  formCard: {
    padding: spacing.lg,
  },
  inputIcon: {
    fontSize: 18,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: spacing.md,
    marginTop: -spacing.xs,
  },
  loginBtn: {
    marginBottom: spacing.md,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
});
