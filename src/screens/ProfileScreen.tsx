import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store/AppContext';
import { useNavigation } from '../navigation/NavigationContext';
import { useTheme } from '../hooks/useTheme';
import { useFadeIn } from '../hooks/useFadeIn';
import { Text } from '../components/ui/Text';
import { Avatar } from '../components/ui/Avatar';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Divider } from '../components/ui/Divider';
import { Button } from '../components/ui/Button';
import { palette, spacing, radius, shadow } from '../theme';
import { Notification } from '../types';



interface NotificationItemProps {
  notification: Notification;
  onRead: () => void;
}

const notifIcons: Record<string, string> = {
  like: '❤️', comment: '💬', task: '📋', system: '⚙️',
};

function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={onRead}
      style={[
        styles.notifItem,
        {
          backgroundColor: notification.isRead
            ? theme.surface
            : `${palette.primary}08`,
          borderLeftColor: notification.isRead ? 'transparent' : palette.primary,
          borderLeftWidth: 3,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={notification.message}
    >
      <View style={[styles.notifIcon, { backgroundColor: `${palette.primary}15` }]}>
        <Text style={{ fontSize: 20 }}>{notifIcons[notification.type] ?? '🔔'}</Text>
      </View>
      <View style={styles.notifContent}>
        <Text
          variant={notification.isRead ? 'bodySmall' : 'label'}
          color={notification.isRead ? theme.text.secondary : theme.text.primary}
          numberOfLines={2}
        >
          {notification.message}
        </Text>
        <Text variant="caption" color={theme.text.muted} style={{ marginTop: 2 }}>
          {new Date(notification.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
      {!notification.isRead && (
        <View style={styles.unreadDot} />
      )}
    </TouchableOpacity>
  );
}



interface SettingsRowProps {
  icon: string;
  label: string;
  value?: string;
  toggle?: boolean;
  isOn?: boolean;
  onToggle?: (v: boolean) => void;
  onPress?: () => void;
  destructive?: boolean;
}

function SettingsRow({ icon, label, value, toggle, isOn, onToggle, onPress, destructive }: SettingsRowProps) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.settingsRow}
      disabled={toggle}
      accessibilityRole={toggle ? 'switch' : 'button'}
      accessibilityLabel={label}
      accessibilityState={toggle ? { checked: isOn } : undefined}
    >
      <View style={[styles.settingsIcon, { backgroundColor: destructive ? `${palette.error}15` : `${palette.primary}10` }]}>
        <Text style={{ fontSize: 18 }}>{icon}</Text>
      </View>
      <Text
        variant="body"
        color={destructive ? palette.error : theme.text.primary}
        style={{ flex: 1, marginLeft: spacing.md }}
      >
        {label}
      </Text>
      {toggle ? (
        <Switch
          value={isOn}
          onValueChange={onToggle}
          trackColor={{ false: theme.border, true: palette.primary }}
          thumbColor={palette.white}
        />
      ) : (
        <>
          {value && <Text variant="bodySmall" color={theme.text.muted} style={{ marginRight: spacing.sm }}>{value}</Text>}
          {!destructive && <Text style={{ color: theme.text.muted, fontSize: 16 }}>›</Text>}
        </>
      )}
    </TouchableOpacity>
  );
}


export function ProfileScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { state, logout, toggleTheme, markNotificationRead } = useApp();
  const { reset } = useNavigation();

  const { opacity: op1, translateY: ty1 } = useFadeIn(0);
  const { opacity: op2, translateY: ty2 } = useFadeIn(150);
  const { opacity: op3, translateY: ty3 } = useFadeIn(300);

  const user = state.user!;
  const unread = state.notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    logout();
    reset('Login');
  };

  const roleColors: Record<string, string> = {
    photographer: palette.primary,
    editor: palette.accent,
    viewer: palette.info,
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.xxl + insets.bottom }}
      >
        {/* Profile Hero */}
        <Animated.View
          style={[
            styles.hero,
            {
              paddingTop: insets.top + spacing.lg,
              backgroundColor: palette.primary,
              opacity: op1,
              transform: [{ translateY: ty1 }],
            },
          ]}
        >
          {/* Avatar + info */}
          <View style={styles.profileInfo}>
            <View style={styles.avatarWrapper}>
              <Avatar initials={user.avatar} size={84} />
              <View style={styles.onlineDot} />
            </View>
            <Text variant="h2" color={palette.white} style={styles.userName}>
              {user.name}
            </Text>
            <Text variant="bodySmall" color="rgba(255,255,255,0.75)" style={styles.userEmail}>
              {user.email}
            </Text>
            <View style={styles.badgeRow}>
              <Badge
                label={user.role}
                variant="primary"
                style={{ backgroundColor: `${roleColors[user.role]}50` }}
              />
            </View>
            <Text
              variant="bodySmall"
              color="rgba(255,255,255,0.7)"
              style={styles.bio}
            >
              {user.bio}
            </Text>
          </View>

          {/* Stats */}
          <View style={styles.heroStats}>
            {[
              { label: 'Photos',    value: state.photos.filter(p => p.author === user.name).length },
              { label: 'Saved',     value: state.photos.filter(p => p.isSaved).length },
              { label: 'Tasks',     value: state.tasks.filter(t => t.assignee === user.name).length },
              { label: 'Completed', value: state.tasks.filter(t => t.status === 'done').length },
            ].map(s => (
              <View key={s.label} style={styles.heroStat}>
                <Text variant="h3" color={palette.white}>{s.value}</Text>
                <Text variant="caption" color="rgba(255,255,255,0.6)">{s.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <View style={styles.content}>
          {/* Notifications */}
          <Animated.View style={{ opacity: op2, transform: [{ translateY: ty2 }] }}>
            <View style={styles.sectionHeader}>
              <Text variant="h3" color={theme.text.primary}>Notifications</Text>
              {unread > 0 && (
                <Badge label={`${unread} new`} variant="primary" />
              )}
            </View>
            <Card style={styles.notifCard} padding={0}>
              {state.notifications.slice(0, 5).map((n, i) => (
                <View key={n.id}>
                  <NotificationItem
                    notification={n}
                    onRead={() => markNotificationRead(n.id)}
                  />
                  {i < 4 && <Divider marginVertical={0} />}
                </View>
              ))}
            </Card>
          </Animated.View>

          {/* Settings */}
          <Animated.View style={{ opacity: op3, transform: [{ translateY: ty3 }], marginTop: spacing.lg }}>
            <Text variant="h3" color={theme.text.primary} style={styles.sectionLabel}>
              Preferences
            </Text>
            <Card padding={0} style={styles.settingsCard}>
              <SettingsRow
                icon="🌙"
                label="Dark Mode"
                toggle
                isOn={state.theme === 'dark'}
                onToggle={toggleTheme}
              />
              <Divider marginVertical={0} />
              <SettingsRow
                icon="🔔"
                label="Notifications"
                value="Enabled"
                onPress={() => {}}
              />
              <Divider marginVertical={0} />
              <SettingsRow
                icon="🌐"
                label="Language"
                value="English"
                onPress={() => {}}
              />
              <Divider marginVertical={0} />
              <SettingsRow
                icon="📱"
                label="App Version"
                value="1.0.0"
              />
            </Card>

            <Text variant="h3" color={theme.text.primary} style={[styles.sectionLabel, { marginTop: spacing.lg }]}>
              Account
            </Text>
            <Card padding={0} style={styles.settingsCard}>
              <SettingsRow icon="✏️"  label="Edit Profile" onPress={() => {}} />
              <Divider marginVertical={0} />
              <SettingsRow icon="🔒" label="Change Password" onPress={() => {}} />
              <Divider marginVertical={0} />
              <SettingsRow icon="🛡️" label="Privacy Settings" onPress={() => {}} />
              <Divider marginVertical={0} />
              <SettingsRow icon="📊" label="Storage Used" value="2.4 GB / 10 GB" onPress={() => {}} />
            </Card>

            {/* Logout */}
            <Button
              label="Sign Out"
              onPress={handleLogout}
              variant="outline"
              fullWidth
              size="lg"
              style={[styles.logoutBtn, { borderColor: palette.error }]}
              textStyle={{ color: palette.error }}
            />

            {/* Member since */}
            <Text variant="caption" color={theme.text.muted} style={styles.memberSince}>
              Member since {new Date(user.joinedAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
              })}
            </Text>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  profileInfo: { alignItems: 'center' },
  avatarWrapper: { position: 'relative', marginBottom: spacing.md },
  onlineDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: palette.success,
    borderWidth: 2,
    borderColor: palette.primary,
  },
  userName: { marginBottom: 4 },
  userEmail: { marginBottom: spacing.sm },
  badgeRow: { marginBottom: spacing.sm },
  bio: {
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  heroStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  heroStat: {
    flex: 1,
    alignItems: 'center',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: 'rgba(255,255,255,0.25)',
  },
  content: { padding: spacing.lg },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionLabel: { marginBottom: spacing.md },
  notifCard: { overflow: 'hidden' },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  notifIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  notifContent: { flex: 1, marginHorizontal: spacing.md },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.primary,
    flexShrink: 0,
  },
  settingsCard: { overflow: 'hidden' },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutBtn: {
    marginTop: spacing.xl,
  },
  memberSince: {
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
