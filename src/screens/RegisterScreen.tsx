import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Animated,
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
import { palette, spacing } from '../theme';

type Role = 'photographer' | 'editor' | 'viewer';

const ROLES: { value: Role; label: string; icon: string; desc: string }[] = [
  { value: 'photographer', label: 'Photographer', icon: '📷', desc: 'Shoot & manage portfolios' },
  { value: 'editor',       label: 'Editor',       icon: '✏️',  desc: 'Edit & retouch photos'    },
  { value: 'viewer',       label: 'Viewer',       icon: '👁️',  desc: 'Browse & collaborate'    },
];

export function RegisterScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { login, state } = useApp();
  const { replace, goBack } = useNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('photographer');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { opacity, translateY } = useFadeIn(100);

  const validate = () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!email.includes('@') || !email.includes('.')) e.email = 'Enter a valid email';
    if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    const success = await login(email);
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
          { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity, transform: [{ translateY }] }}>
          {/* Back button */}
          <TouchableOpacity
            onPress={goBack}
            style={styles.backBtn}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <Text variant="h1" color={theme.text.primary} style={styles.title}>
            Join FotoOwl ✨
          </Text>
          <Text variant="body" color={theme.text.secondary} style={styles.subtitle}>
            Create your photography workspace
          </Text>

          <Card elevated style={styles.formCard}>
            <Input
              label="Full Name"
              value={name}
              onChangeText={setName}
              error={errors.name}
              placeholder="Aryan Mehta"
              leftIcon={<Text style={styles.icon}>👤</Text>}
              autoCapitalize="words"
            />
            <Input
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              placeholder="you@example.com"
              leftIcon={<Text style={styles.icon}>📧</Text>}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              placeholder="Create a strong password"
              leftIcon={<Text style={styles.icon}>🔒</Text>}
              secureTextEntry
            />

           
            <Text variant="label" color={theme.text.secondary} style={styles.roleLabel}>
              I am a...
            </Text>
            <View style={styles.roleGrid}>
              {ROLES.map(r => {
                const isSelected = role === r.value;
                return (
                  <TouchableOpacity
                    key={r.value}
                    onPress={() => setRole(r.value)}
                    style={[
                      styles.roleCard,
                      {
                        backgroundColor: isSelected ? `${palette.primary}15` : theme.surface,
                        borderColor: isSelected ? palette.primary : theme.border,
                        borderWidth: isSelected ? 1.5 : 1,
                      },
                    ]}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={r.label}
                  >
                    <Text style={styles.roleIcon}>{r.icon}</Text>
                    <Text variant="label" color={isSelected ? palette.primary : theme.text.primary}>
                      {r.label}
                    </Text>
                    <Text variant="caption" color={theme.text.muted} style={{ textAlign: 'center', marginTop: 2 }}>
                      {r.desc}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Button
              label="Create Account"
              onPress={handleRegister}
              loading={state.isLoading}
              fullWidth
              size="lg"
              style={styles.registerBtn}
            />
          </Card>

          <View style={styles.footer}>
            <Text variant="bodySmall" color={theme.text.secondary}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={goBack} accessibilityRole="button">
              <Text variant="label" color={palette.primary}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: spacing.lg, flexGrow: 1 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${palette.primary}15`,
    marginBottom: spacing.lg,
  },
  backIcon: { fontSize: 18, color: palette.primary, fontWeight: '600' },
  title: { marginBottom: spacing.xs },
  subtitle: { marginBottom: spacing.xl },
  formCard: { padding: spacing.lg },
  icon: { fontSize: 18 },
  roleLabel: { marginBottom: spacing.sm },
  roleGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  roleCard: {
    flex: 1,
    borderRadius: 12,
    padding: spacing.sm,
    alignItems: 'center',
  },
  roleIcon: { fontSize: 24, marginBottom: 4 },
  registerBtn: { marginTop: spacing.xs },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
});
