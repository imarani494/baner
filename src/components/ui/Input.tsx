import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useAnimatedValue } from '../../hooks/useAnimatedValue';
import { palette, spacing, radius, fontSize, fontWeight } from '../../theme';
import { Text } from './Text';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  onRightIconPress?: () => void;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  containerStyle,
  onRightIconPress,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const borderAnim = useAnimatedValue(0);
  const inputRef = useRef<TextInput>(null);

  const handleFocus = (e: Parameters<NonNullable<TextInputProps['onFocus']>>[0]) => {
    setIsFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onFocus?.(e);
  };

  const handleBlur = (e: Parameters<NonNullable<TextInputProps['onBlur']>>[0]) => {
    setIsFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onBlur?.(e);
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      error ? palette.error : theme.input.border,
      error ? palette.error : palette.primary,
    ],
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          variant="label"
          color={error ? palette.error : isFocused ? palette.primary : theme.text.secondary}
          style={styles.label}
        >
          {label}
        </Text>
      )}
      <Animated.View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: theme.input.background,
            borderColor,
            borderWidth: isFocused || error ? 1.5 : 1,
          },
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            {
              color: theme.text.primary,
              fontSize: fontSize.md,
              flex: 1,
              paddingLeft: leftIcon ? 0 : spacing.md,
              paddingRight: rightIcon ? 0 : spacing.md,
            },
          ]}
          placeholderTextColor={theme.input.placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIcon}
            accessibilityRole="button"
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </Animated.View>
      {(error || hint) && (
        <Text
          variant="caption"
          color={error ? palette.error : theme.text.muted}
          style={styles.helperText}
        >
          {error ?? hint}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
    marginLeft: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    minHeight: 52,
    overflow: 'hidden',
  },
  input: {
    paddingVertical: spacing.sm + 2,
    fontWeight: '400',
  },
  leftIcon: {
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightIcon: {
    paddingRight: spacing.md,
    paddingLeft: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helperText: {
    marginTop: spacing.xs,
    marginLeft: 2,
  },
});
