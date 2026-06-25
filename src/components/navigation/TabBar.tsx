import React, { useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '../../navigation/NavigationContext';
import { useApp } from '../../store/AppContext';
import { useTheme } from '../../hooks/useTheme';
import { useAnimatedValue } from '../../hooks/useAnimatedValue';
import { Text } from '../ui/Text';
import { palette, shadow, spacing } from '../../theme';
import { ScreenName } from '../../types';

interface TabItem {
  name: ScreenName;
  label: string;
  icon: string;
  activeIcon: string;
}

const TABS: TabItem[] = [
  { name: 'Home',    label: 'Home',    icon: '🏠', activeIcon: '🏠' },
  { name: 'Gallery', label: 'Gallery', icon: '📷', activeIcon: '📸' },
  { name: 'Tasks',   label: 'Tasks',   icon: '📋', activeIcon: '✅' },
  { name: 'Profile', label: 'Profile', icon: '👤', activeIcon: '👤' },
];

interface TabButtonProps {
  tab: TabItem;
  isActive: boolean;
  badgeCount?: number;
  onPress: () => void;
}

function TabButton({ tab, isActive, badgeCount, onPress }: TabButtonProps) {
  const theme = useTheme();
  const scale = useAnimatedValue(1);

  const handlePress = useCallback(() => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.85, duration: 80, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, bounciness: 12 }),
    ]).start();
    onPress();
  }, [scale, onPress]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.tabButton}
      accessibilityRole="tab"
      accessibilityLabel={tab.label}
      accessibilityState={{ selected: isActive }}
    >
      <Animated.View style={[styles.tabInner, { transform: [{ scale }] }]}>
        {/* Active indicator pill */}
        {isActive && (
          <View
            style={[styles.activePill, { backgroundColor: `${palette.primary}18` }]}
          />
        )}
        <Text style={styles.tabIcon}>{isActive ? tab.activeIcon : tab.icon}</Text>
        {/* Badge */}
        {badgeCount != null && badgeCount > 0 && (
          <View style={styles.badge}>
            <Text variant="badge" color={palette.white}>
              {badgeCount > 9 ? '9+' : String(badgeCount)}
            </Text>
          </View>
        )}
      </Animated.View>
      <Text
        variant="caption"
        color={isActive ? theme.tab.active : theme.tab.inactive}
        style={[
          styles.tabLabel,
          isActive && { fontWeight: '600' },
        ]}
      >
        {tab.label}
      </Text>
    </TouchableOpacity>
  );
}

export function TabBar() {
  const theme = useTheme();
  const { currentRoute, navigate } = useNavigation();
  const { unreadNotificationCount } = useApp();
  const insets = useSafeAreaInsets();

  const activeTab = currentRoute.name;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.tab.background,
          paddingBottom: Math.max(insets.bottom, spacing.sm),
        },
        shadow.md,
      ]}
    >
      {TABS.map(tab => (
        <TabButton
          key={tab.name}
          tab={tab}
          isActive={activeTab === tab.name}
          badgeCount={tab.name === 'Home' ? unreadNotificationCount : undefined}
          onPress={() => navigate(tab.name)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabInner: {
    width: 48,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activePill: {
    position: 'absolute',
    width: 48,
    height: 32,
    borderRadius: 16,
  },
  tabIcon: {
    fontSize: 22,
  },
  tabLabel: {
    marginTop: 2,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: palette.error,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
});
