import React from 'react';
import {
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { usePressAnimation } from '../../hooks/usePressAnimation';
import { palette, spacing, radius, fontSize, fontWeight } from '../../theme';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  accessibilityLabel?: string;
  fullWidth?: boolean;
}

const sizeMap: Record<Size, { height: number; paddingH: number; textSize: number }> = {
  sm: { height: 36, paddingH: spacing.md, textSize: fontSize.sm },
  md: { height: 48, paddingH: spacing.lg, textSize: fontSize.md },
  lg: { height: 56, paddingH: spacing.xl, textSize: fontSize.lg },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  accessibilityLabel,
  fullWidth = false,
}: ButtonProps) {
  const theme = useTheme();
  const { scale, onPressIn, onPressOut } = usePressAnimation(0.96);
  const { height, paddingH, textSize } = sizeMap[size];

  const getBackground = () => {
    if (disabled) return theme.border;
    switch (variant) {
      case 'primary':   return palette.primary;
      case 'secondary': return palette.secondary;
      case 'outline':   return 'transparent';
      case 'ghost':     return 'transparent';
      case 'danger':    return palette.error;
    }
  };

  const getBorder = () => {
    if (variant === 'outline') return palette.primary;
    if (variant === 'danger')  return palette.error;
    return 'transparent';
  };

  const getTextColor = () => {
    if (disabled) return theme.text.muted;
    if (variant === 'outline') return palette.primary;
    if (variant === 'ghost')   return palette.primary;
    return palette.white;
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, fullWidth && { width: '100%' }]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled || loading}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityState={{ disabled: disabled || loading }}
        style={[
          styles.base,
          {
            height,
            paddingHorizontal: paddingH,
            backgroundColor: getBackground(),
            borderColor: getBorder(),
            borderWidth: variant === 'outline' ? 1.5 : 0,
          },
          fullWidth && styles.fullWidth,
          style,
        ]}
      >
        {leftIcon && !loading && leftIcon}
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'outline' || variant === 'ghost' ? palette.primary : palette.white}
          />
        ) : (
          <Text
            style={[
              {
                fontSize: textSize,
                fontWeight: fontWeight.semibold,
                color: getTextColor(),
                marginHorizontal: leftIcon || rightIcon ? spacing.xs : 0,
              },
              textStyle,
            ]}
          >
            {label}
          </Text>
        )}
        {rightIcon && !loading && rightIcon}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    gap: spacing.xs,
  },
  fullWidth: {
    width: '100%',
  },
});
