import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '../../navigation/NavigationContext';
import { useTheme } from '../../hooks/useTheme';
import { Text } from '../ui/Text';
import { spacing, shadow, palette } from '../../theme';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  transparent?: boolean;
}

export function Header({
  title,
  showBack = false,
  rightAction,
  transparent = false,
}: HeaderProps) {
  const { goBack, canGoBack } = useNavigation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + spacing.sm,
          backgroundColor: transparent ? 'transparent' : theme.surface,
        },
        !transparent && shadow.sm,
      ]}
    >
      {/* Left — Back button */}
      <View style={styles.side}>
        {showBack && canGoBack && (
          <TouchableOpacity
            onPress={goBack}
            style={styles.backBtn}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Center — Title */}
      <Text
        variant="h3"
        color={theme.text.primary}
        style={styles.title}
        numberOfLines={1}
      >
        {title}
      </Text>

      {/* Right — Action */}
      <View style={[styles.side, styles.rightSide]}>
        {rightAction ?? <View style={styles.placeholder} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    zIndex: 10,
  },
  side: {
    width: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rightSide: {
    alignItems: 'flex-end',
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: `${palette.primary}15`,
  },
  backIcon: {
    fontSize: 18,
    color: palette.primary,
    fontWeight: '600',
  },
  placeholder: {
    width: 36,
  },
});
