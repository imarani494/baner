import React from 'react';
import { Text as RNText, TextStyle, StyleProp } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { fontSize, fontWeight } from '../../theme';

type Variant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'bodySmall'
  | 'caption'
  | 'label'
  | 'badge';

const variantStyles: Record<Variant, TextStyle> = {
  display: { fontSize: fontSize.display, fontWeight: fontWeight.extrabold, lineHeight: 44 },
  h1:      { fontSize: fontSize.xxxl,   fontWeight: fontWeight.bold,      lineHeight: 38 },
  h2:      { fontSize: fontSize.xxl,    fontWeight: fontWeight.bold,      lineHeight: 30 },
  h3:      { fontSize: fontSize.xl,     fontWeight: fontWeight.semibold,  lineHeight: 26 },
  body:    { fontSize: fontSize.md,     fontWeight: fontWeight.regular,   lineHeight: 22 },
  bodySmall: { fontSize: fontSize.sm,   fontWeight: fontWeight.regular,   lineHeight: 18 },
  caption: { fontSize: fontSize.xs,     fontWeight: fontWeight.regular,   lineHeight: 15 },
  label:   { fontSize: fontSize.sm,     fontWeight: fontWeight.semibold,  lineHeight: 18 },
  badge:   { fontSize: fontSize.xs,     fontWeight: fontWeight.bold,      lineHeight: 14 },
};

interface TextProps {
  variant?: Variant;
  color?: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  children: React.ReactNode;
  accessibilityLabel?: string;
  selectable?: boolean;
}

export function Text({
  variant = 'body',
  color,
  style,
  numberOfLines,
  children,
  accessibilityLabel,
  selectable,
}: TextProps) {
  const theme = useTheme();
  return (
    <RNText
      style={[
        variantStyles[variant],
        { color: color ?? theme.text.primary },
        style,
      ]}
      numberOfLines={numberOfLines}
      accessibilityLabel={accessibilityLabel}
      selectable={selectable}
    >
      {children}
    </RNText>
  );
}
