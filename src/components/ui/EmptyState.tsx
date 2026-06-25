import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../../hooks/useTheme';
import { spacing, palette } from '../../theme';

interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, subtitle, action }: EmptyStateProps) {
  const theme = useTheme();
  return (
    <View style={styles.container} accessibilityRole="none">
      <Text style={styles.icon}>{icon}</Text>
      <Text variant="h3" color={theme.text.primary} style={styles.title}>
        {title}
      </Text>
      {subtitle && (
        <Text variant="body" color={theme.text.secondary} style={styles.subtitle}>
          {subtitle}
        </Text>
      )}
      {action && <View style={styles.action}>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  icon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  action: {
    marginTop: spacing.md,
  },
});
