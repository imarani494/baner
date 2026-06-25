import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  FlatList,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store/AppContext';
import { useNavigation } from '../navigation/NavigationContext';
import { useTheme } from '../hooks/useTheme';
import { useFadeIn } from '../hooks/useFadeIn';
import { usePressAnimation } from '../hooks/usePressAnimation';
import { Text } from '../components/ui/Text';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { palette, spacing, radius, shadow } from '../theme';
import { Photo, Task } from '../types';

const { width } = Dimensions.get('window');
const FEATURED_WIDTH = width - spacing.lg * 2;

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  const theme = useTheme();
  const { scale, onPressIn, onPressOut } = usePressAnimation();
  return (
    <Animated.View style={{ transform: [{ scale }], flex: 1 }}>
      <TouchableOpacity
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
      >
        <Card style={styles.statCard}>
          <View style={[styles.statIconBox, { backgroundColor: `${color}18` }]}>
            <Text style={styles.statIcon}>{icon}</Text>
          </View>
          <Text variant="h2" color={color} style={{ marginTop: spacing.xs }}>
            {value}
          </Text>
          <Text variant="caption" color={theme.text.secondary}>
            {label}
          </Text>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );
}

interface FeaturedPhotoCardProps {
  photo: Photo;
  onPress: () => void;
  onLike: () => void;
}

function FeaturedPhotoCard({ photo, onPress, onLike }: FeaturedPhotoCardProps) {
  const theme = useTheme();
  const { scale, onPressIn, onPressOut } = usePressAnimation(0.98);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
        accessibilityRole="button"
        accessibilityLabel={`View photo: ${photo.title}`}
        style={[styles.featuredCard, shadow.md]}
      >
        <Image
          source={{ uri: photo.uri }}
          style={styles.featuredImage}
          resizeMode="cover"
          accessibilityLabel={photo.title}
        />
        <View style={styles.featuredOverlay} />
        <View style={styles.featuredContent}>
          <Badge label={photo.category} variant="primary" />
          <Text
            variant="h3"
            color={palette.white}
            style={styles.featuredTitle}
            numberOfLines={2}
          >
            {photo.title}
          </Text>
          <View style={styles.featuredFooter}>
            <Text variant="caption" color="rgba(255,255,255,0.8)">
              by {photo.author}
            </Text>
            <TouchableOpacity
              onPress={onLike}
              style={styles.likeBtn}
              accessibilityRole="button"
              accessibilityLabel={photo.isLiked ? 'Unlike photo' : 'Like photo'}
            >
              <Text style={styles.likeIcon}>{photo.isLiked ? '❤️' : '🤍'}</Text>
              <Text
                variant="caption"
                color="rgba(255,255,255,0.9)"
                style={{ marginLeft: 4 }}
              >
                {photo.likes}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

interface TaskRowProps {
  task: Task;
  onPress: () => void;
}

const priorityColors: Record<string, string> = {
  high: palette.error,
  medium: palette.warning,
  low: palette.success,
};

function TaskRow({ task, onPress }: TaskRowProps) {
  const theme = useTheme();
  const daysLeft = Math.ceil(
    (new Date(task.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.taskRow,
        { backgroundColor: theme.surface, borderColor: theme.border },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Task: ${task.title}`}
    >
      <View
        style={[
          styles.taskPriorityBar,
          { backgroundColor: priorityColors[task.priority] },
        ]}
      />
      <View style={styles.taskInfo}>
        <Text
          variant="label"
          color={task.status === 'done' ? theme.text.muted : theme.text.primary}
          style={task.status === 'done' ? styles.strikethrough : undefined}
          numberOfLines={1}
        >
          {task.title}
        </Text>
        <Text
          variant="caption"
          color={theme.text.muted}
          style={{ marginTop: 2 }}
        >
          {task.status === 'done'
            ? '✅ Completed'
            : daysLeft < 0
            ? `⚠️ ${Math.abs(daysLeft)}d overdue`
            : daysLeft === 0
            ? '🔥 Due today'
            : `📅 ${daysLeft}d left`}
        </Text>
      </View>
      <Badge
        label={
          task.status === 'in-progress'
            ? 'Active'
            : task.status === 'done'
            ? 'Done'
            : 'Todo'
        }
        variant={
          task.status === 'done'
            ? 'success'
            : task.status === 'in-progress'
            ? 'primary'
            : 'neutral'
        }
      />
    </TouchableOpacity>
  );
}

function NotificationBell() {
  const { navigate } = useNavigation();
  const { unreadNotificationCount } = useApp();
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={() => navigate('Profile')}
      style={styles.notifBtn}
      accessibilityRole="button"
      accessibilityLabel={`Notifications, ${unreadNotificationCount} unread`}
    >
      <Text style={styles.notifIcon}>🔔</Text>
      {unreadNotificationCount > 0 && (
        <View style={styles.notifBadge}>
          <Text variant="badge" color={palette.white}>
            {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { state, toggleLike } = useApp();
  const { navigate } = useNavigation();

  const { opacity: op1, translateY: ty1 } = useFadeIn(0);
  const { opacity: op2, translateY: ty2 } = useFadeIn(150);
  const { opacity: op3, translateY: ty3 } = useFadeIn(300);

  const user = state.user!;
  const recentPhotos = state.photos.slice(0, 4);
  const pendingTasks = state.tasks.filter(t => t.status !== 'done').slice(0, 3);
  const totalLikes = state.photos.reduce((sum, p) => sum + p.likes, 0);
  const completedTasks = state.tasks.filter(t => t.status === 'done').length;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
      >
        <View
          style={[
            styles.hero,
            {
              paddingTop: insets.top + spacing.md,
              backgroundColor: palette.primary,
            },
          ]}
        >
          <Animated.View
            style={{ opacity: op1, transform: [{ translateY: ty1 }] }}
          >
            <View style={styles.heroRow}>
              <View style={styles.heroLeft}>
                <Avatar initials={user.avatar} size={50} />
                <View style={styles.heroGreeting}>
                  <Text variant="caption" color="rgba(255,255,255,0.7)">
                    {greeting()},
                  </Text>
                  <Text variant="h3" color={palette.white} numberOfLines={1}>
                    {user.name.split(' ')[0]} 👋
                  </Text>
                </View>
              </View>
              <NotificationBell />
            </View>

            {/* Stats row */}
            <View style={styles.heroStats}>
              {[
                { v: state.photos.length, l: 'Photos' },
                { v: totalLikes, l: 'Likes' },
                { v: completedTasks, l: 'Done' },
              ].map(s => (
                <View key={s.l} style={styles.heroStat}>
                  <Text variant="h2" color={palette.white}>
                    {s.v}
                  </Text>
                  <Text variant="caption" color="rgba(255,255,255,0.7)">
                    {s.l}
                  </Text>
                </View>
              ))}
            </View>
          </Animated.View>
        </View>

        <View style={styles.content}>
          <Animated.View
            style={{ opacity: op2, transform: [{ translateY: ty2 }] }}
          >
            <View style={styles.statsGrid}>
              <StatCard
                label="Total Photos"
                value={state.photos.length}
                icon="📷"
                color={palette.primary}
              />
              <StatCard
                label="Tasks Active"
                value={pendingTasks.length}
                icon="⚡"
                color={palette.warning}
              />
              <StatCard
                label="Saved"
                value={state.photos.filter(p => p.isSaved).length}
                icon="🔖"
                color={palette.secondary}
              />
            </View>
          </Animated.View>

          {/* ── Featured Photos ── */}
          <Animated.View
            style={{ opacity: op3, transform: [{ translateY: ty3 }] }}
          >
            <View style={styles.sectionHeader}>
              <Text variant="h3" color={theme.text.primary}>
                Featured Work
              </Text>
              <TouchableOpacity
                onPress={() => navigate('Gallery')}
                accessibilityRole="button"
                accessibilityLabel="See all photos"
              >
                <Text variant="label" color={palette.primary}>
                  See All →
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={recentPhotos}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id}
              contentContainerStyle={{
                gap: spacing.md,
                paddingRight: spacing.md,
              }}
              renderItem={({ item }) => (
                <FeaturedPhotoCard
                  photo={item}
                  onPress={() => navigate('PhotoDetail', { photoId: item.id })}
                  onLike={() => toggleLike(item.id)}
                />
              )}
              snapToInterval={FEATURED_WIDTH + spacing.md}
              decelerationRate="fast"
            />
          </Animated.View>

          <Animated.View
            style={{
              opacity: op3,
              transform: [{ translateY: ty3 }],
              marginTop: spacing.lg,
            }}
          >
            <View style={styles.sectionHeader}>
              <Text variant="h3" color={theme.text.primary}>
                Pending Tasks
              </Text>
              <TouchableOpacity
                onPress={() => navigate('Tasks')}
                accessibilityRole="button"
                accessibilityLabel="See all tasks"
              >
                <Text variant="label" color={palette.primary}>
                  See All →
                </Text>
              </TouchableOpacity>
            </View>

            {pendingTasks.length === 0 ? (
              <Card style={styles.emptyTaskCard}>
                <Text style={{ fontSize: 32, textAlign: 'center' }}>🎉</Text>
                <Text
                  variant="body"
                  color={theme.text.secondary}
                  style={{ textAlign: 'center', marginTop: spacing.xs }}
                >
                  All caught up! No pending tasks.
                </Text>
              </Card>
            ) : (
              <View style={styles.taskList}>
                {pendingTasks.map(task => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onPress={() => navigate('TaskDetail', { taskId: task.id })}
                  />
                ))}
              </View>
            )}
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
    paddingBottom: spacing.xl + 8,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  heroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  heroGreeting: { marginLeft: spacing.xs },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  heroStat: { alignItems: 'center' },
  notifBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifIcon: { fontSize: 20 },
  notifBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: palette.error,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    padding: spacing.md,
    alignItems: 'center',
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIcon: { fontSize: 20 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  featuredCard: {
    width: FEATURED_WIDTH,
    height: 220,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: palette.grey300,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    backgroundImage: undefined,
  },
  featuredContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
  },
  featuredTitle: { marginTop: spacing.xs, marginBottom: spacing.xs },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  likeBtn: { flexDirection: 'row', alignItems: 'center' },
  likeIcon: { fontSize: 18 },
  taskList: { gap: spacing.sm },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: 'hidden',
    paddingVertical: spacing.sm,
    paddingRight: spacing.md,
  },
  taskPriorityBar: {
    width: 4,
    alignSelf: 'stretch',
    marginRight: spacing.sm,
  },
  taskInfo: { flex: 1, paddingRight: spacing.sm },
  strikethrough: { textDecorationLine: 'line-through', opacity: 0.5 },
  emptyTaskCard: { alignItems: 'center', padding: spacing.xl },
});
