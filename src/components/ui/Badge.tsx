import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Text } from './Text';
import { palette, spacing, radius } from '../../theme';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: StyleProp<ViewStyle>;
  size?: 'sm' | 'md';
}

const variantColors: Record<BadgeVariant, { bg: string; text: string }> = {
  primary: { bg: `${palette.primary}22`, text: palette.primary },
  success: { bg: `${palette.success}22`, text: palette.success },
  warning: { bg: `${palette.warning}22`, text: '#A06B00' },
  error:   { bg: `${palette.error}22`,   text: palette.error },
  info:    { bg: `${palette.info}22`,     text: '#006B8F' },
  neutral: { bg: palette.grey200,         text: palette.grey600 },
};

export function Badge({ label, variant = 'neutral', style, size = 'sm' }: BadgeProps) {
  const { bg, text } = variantColors[variant];
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bg,
          paddingHorizontal: size === 'sm' ? spacing.sm : spacing.md,
          paddingVertical: size === 'sm' ? 3 : spacing.xs,
        },
        style,
      ]}
    >
      <Text
        variant="badge"
        color={text}
        style={{ letterSpacing: 0.3 }}
      >
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
});
