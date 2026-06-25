import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store/AppContext';
import { useNavigation } from '../navigation/NavigationContext';
import { useTheme } from '../hooks/useTheme';
import { useFadeIn } from '../hooks/useFadeIn';
import { Text } from '../components/ui/Text';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { palette, spacing, radius } from '../theme';
import { Task, TaskStatus } from '../types';

const PRIORITY_META = {
  high:   { color: palette.error,   icon: '🔴', label: 'High Priority' },
  medium: { color: palette.warning, icon: '🟡', label: 'Medium Priority' },
  low:    { color: palette.success, icon: '🟢', label: 'Low Priority' },
};

const STATUS_META = {
  'todo':        { variant: 'neutral'  as const, label: 'Todo'        },
  'in-progress': { variant: 'primary'  as const, label: 'In Progress' },
  'done':        { variant: 'success'  as const, label: 'Done'        },
};

const STATUS_FLOW: Record<TaskStatus, { next: TaskStatus | null; label: string }> = {
  'todo':        { next: 'in-progress', label: '▶  Start Task' },
  'in-progress': { next: 'done',        label: '✓  Mark Complete' },
  'done':        { next: null,          label: '' },
};

export function TaskDetailScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { state, updateTaskStatus, deleteTask } = useApp();
  const { currentRoute, goBack } = useNavigation();

  const taskId = currentRoute.params?.taskId as string;
  const task = state.tasks.find(t => t.id === taskId);

  const { opacity, translateY } = useFadeIn(100);

  if (!task) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text variant="h3" color={theme.text.secondary}>Task not found</Text>
        <Button label="Go Back" onPress={goBack} variant="outline" style={{ marginTop: spacing.md }} />
      </View>
    );
  }

  const pm = PRIORITY_META[task.priority];
  const sm = STATUS_META[task.status];
  const sf = STATUS_FLOW[task.status];

  const daysLeft = Math.ceil(
    (new Date(task.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );

  const handleDelete = () => {
    deleteTask(task.id);
    goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Back Header */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + spacing.sm, backgroundColor: theme.surface, borderLeftColor: pm.color, borderLeftWidth: 4 },
        ]}
      >
        <TouchableOpacity
          onPress={goBack}
          style={[styles.backBtn, { backgroundColor: `${palette.primary}15` }]}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={{ color: palette.primary, fontSize: 18, fontWeight: '700' }}>←</Text>
        </TouchableOpacity>
        <Text variant="h3" color={theme.text.primary} style={{ flex: 1, marginLeft: spacing.sm }}>
          Task Detail
        </Text>
        <TouchableOpacity
          onPress={handleDelete}
          style={styles.deleteBtn}
          accessibilityRole="button"
          accessibilityLabel="Delete task"
        >
          <Text style={{ fontSize: 20 }}>🗑️</Text>
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        style={{ opacity, transform: [{ translateY }] }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
      >
        {/* Title + Status */}
        <View style={styles.titleRow}>
          <Text variant="h2" color={theme.text.primary} style={{ flex: 1, marginRight: spacing.md }}>
            {task.title}
          </Text>
          <Badge label={sm.label} variant={sm.variant} size="md" />
        </View>

        {/* Priority bar */}
        <View style={[styles.priorityBanner, { backgroundColor: `${pm.color}15`, borderColor: `${pm.color}40` }]}>
          <Text style={{ fontSize: 20 }}>{pm.icon}</Text>
          <Text variant="label" color={pm.color}>{pm.label}</Text>
        </View>

        {/* Description */}
        <Card style={styles.section}>
          <Text variant="label" color={theme.text.muted} style={styles.sectionLabel}>📄 Description</Text>
          <Text variant="body" color={theme.text.primary} style={{ lineHeight: 24, marginTop: spacing.xs }}>
            {task.description}
          </Text>
        </Card>

        {/* Details Grid */}
        <Card style={styles.section}>
          <Text variant="label" color={theme.text.muted} style={styles.sectionLabel}>📊 Details</Text>
          <View style={styles.detailGrid}>
            {[
              {
                icon: '👤', label: 'Assignee',
                value: task.assignee,
                extra: <Avatar initials={task.assignee.split(' ').map(w => w[0]).join('')} size={32} />,
              },
              {
                icon: '📅', label: 'Due Date',
                value: task.dueDate,
                extra: (
                  <Text
                    variant="caption"
                    color={daysLeft < 0 ? palette.error : daysLeft === 0 ? palette.warning : theme.text.muted}
                  >
                    {task.status === 'done'
                      ? '✅ Completed'
                      : daysLeft < 0
                      ? `${Math.abs(daysLeft)}d overdue`
                      : daysLeft === 0
                      ? 'Due today'
                      : `${daysLeft}d remaining`}
                  </Text>
                ),
              },
              {
                icon: '🗓️', label: 'Created',
                value: task.createdAt,
              },
              ...(task.completedAt
                ? [{ icon: '✅', label: 'Completed', value: task.completedAt }]
                : []),
            ].map(d => (
              <View key={d.label} style={[styles.detailItem, { borderBottomColor: theme.divider }]}>
                <Text variant="caption" color={theme.text.muted}>
                  {d.icon} {d.label}
                </Text>
                <View style={styles.detailRight}>
                  {d.extra}
                  <Text variant="label" color={theme.text.primary} style={{ marginLeft: d.extra ? spacing.xs : 0 }}>
                    {d.value}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Card>

        {/* Tags */}
        {task.tags.length > 0 && (
          <Card style={styles.section}>
            <Text variant="label" color={theme.text.muted} style={styles.sectionLabel}>🏷️ Tags</Text>
            <View style={styles.tagsRow}>
              {task.tags.map(tag => (
                <View key={tag} style={[styles.tag, { backgroundColor: theme.input.background }]}>
                  <Text variant="caption" color={palette.primary}>#{tag}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Status Timeline */}
        <Card style={styles.section}>
          <Text variant="label" color={theme.text.muted} style={styles.sectionLabel}>📈 Progress</Text>
          <View style={styles.timeline}>
            {(['todo', 'in-progress', 'done'] as TaskStatus[]).map((s, i) => {
              const order = ['todo', 'in-progress', 'done'].indexOf(task.status);
              const stepOrder = i;
              const isCompleted = stepOrder <= order;
              const isCurrent = s === task.status;
              return (
                <View key={s} style={styles.timelineStep}>
                  <View
                    style={[
                      styles.timelineDot,
                      {
                        backgroundColor: isCompleted ? palette.primary : theme.border,
                        borderColor: isCurrent ? palette.primary : 'transparent',
                        borderWidth: isCurrent ? 3 : 0,
                        width: isCurrent ? 20 : 16,
                        height: isCurrent ? 20 : 16,
                        borderRadius: 10,
                      },
                    ]}
                  />
                  {i < 2 && (
                    <View
                      style={[
                        styles.timelineLine,
                        { backgroundColor: stepOrder < order ? palette.primary : theme.border },
                      ]}
                    />
                  )}
                  <Text
                    variant="caption"
                    color={isCompleted ? palette.primary : theme.text.muted}
                    style={{ textAlign: 'center', width: 70, marginTop: 4 }}
                  >
                    {STATUS_META[s].label}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Action Button */}
        {sf.next && (
          <Button
            label={sf.label}
            onPress={() => updateTaskStatus(task.id, sf.next!)}
            fullWidth
            size="lg"
            style={{ marginTop: spacing.sm }}
          />
        )}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    paddingBottom: spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  priorityBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  section: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  sectionLabel: {
    marginBottom: spacing.sm,
  },
  detailGrid: {},
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  detailRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  timeline: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  timelineStep: {
    alignItems: 'center',
    flex: 1,
  },
  timelineDot: {},
  timelineLine: {
    position: 'absolute',
    top: 8,
    left: '60%',
    right: '-60%',
    height: 2,
  },
});
