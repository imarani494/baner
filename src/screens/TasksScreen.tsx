import React, { useState, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store/AppContext';
import { useNavigation } from '../navigation/NavigationContext';
import { useTheme } from '../hooks/useTheme';
import { useFadeIn } from '../hooks/useFadeIn';
import { Text } from '../components/ui/Text';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { palette, spacing, radius, shadow } from '../theme';
import { Task, TaskPriority, TaskStatus } from '../types';

type FilterTab = 'All' | 'Todo' | 'Active' | 'Done';

const TABS: FilterTab[] = ['All', 'Todo', 'Active', 'Done'];

const priorityMeta: Record<
  TaskPriority,
  { color: string; label: string; icon: string }
> = {
  high: { color: palette.error, label: 'High', icon: '🔴' },
  medium: { color: palette.warning, label: 'Medium', icon: '🟡' },
  low: { color: palette.success, label: 'Low', icon: '🟢' },
};

const statusMeta: Record<
  TaskStatus,
  { label: string; variant: 'primary' | 'success' | 'neutral' }
> = {
  todo: { label: 'Todo', variant: 'neutral' },
  'in-progress': { label: 'In Progress', variant: 'primary' },
  done: { label: 'Done', variant: 'success' },
};

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onStatusChange: (s: TaskStatus) => void;
  onDelete: () => void;
}

function TaskCard({ task, onPress, onStatusChange, onDelete }: TaskCardProps) {
  const theme = useTheme();
  const { opacity, translateY } = useFadeIn(0);
  const meta = priorityMeta[task.priority];
  const sm = statusMeta[task.status];

  const daysLeft = Math.ceil(
    (new Date(task.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );

  const nextStatus: Record<TaskStatus, TaskStatus | null> = {
    todo: 'in-progress',
    'in-progress': 'done',
    done: null,
  };

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.taskCard,
          {
            backgroundColor: theme.surface,
            borderLeftColor: meta.color,
            borderLeftWidth: 4,
          },
          shadow.sm,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Task: ${task.title}`}
        activeOpacity={0.9}
      >
        <View style={styles.taskHeader}>
          <View style={styles.taskTitleRow}>
            <Text style={styles.priorityIcon}>{meta.icon}</Text>
            <Text
              variant="label"
              color={
                task.status === 'done' ? theme.text.muted : theme.text.primary
              }
              style={[
                { flex: 1 },
                task.status === 'done' && styles.strikethrough,
              ]}
              numberOfLines={2}
            >
              {task.title}
            </Text>
          </View>
          <Badge label={sm.label} variant={sm.variant} />
        </View>

       
        <Text
          variant="bodySmall"
          color={theme.text.secondary}
          numberOfLines={2}
          style={styles.taskDesc}
        >
          {task.description}
        </Text>

        {/* Tags */}
        {task.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {task.tags.slice(0, 3).map(t => (
              <View
                key={t}
                style={[
                  styles.tag,
                  { backgroundColor: theme.input.background },
                ]}
              >
                <Text variant="caption" color={theme.text.secondary}>
                  #{t}
                </Text>
              </View>
            ))}
          </View>
        )}

     
        <View style={styles.taskFooter}>
          <View style={styles.taskMeta}>
            <Text
              variant="caption"
              color={theme.text.muted}
              style={styles.metaItem}
            >
              👤 {task.assignee.split(' ')[0]}
            </Text>
            <Text
              variant="caption"
              color={
                daysLeft < 0
                  ? palette.error
                  : daysLeft === 0
                  ? palette.warning
                  : theme.text.muted
              }
            >
              {task.status === 'done'
                ? `✅ ${task.completedAt}`
                : daysLeft < 0
                ? `⚠️ ${Math.abs(daysLeft)}d overdue`
                : daysLeft === 0
                ? '🔥 Due today'
                : `📅 ${daysLeft}d left`}
            </Text>
          </View>

          <View style={styles.taskActions}>
            {nextStatus[task.status] && (
              <TouchableOpacity
                onPress={() => onStatusChange(nextStatus[task.status]!)}
                style={[
                  styles.progressBtn,
                  { backgroundColor: `${palette.primary}15` },
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Mark as ${nextStatus[task.status]}`}
              >
                <Text variant="caption" color={palette.primary}>
                  {task.status === 'todo' ? '▶ Start' : '✓ Complete'}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={onDelete}
              style={styles.deleteBtn}
              accessibilityRole="button"
              accessibilityLabel="Delete task"
            >
              <Text style={{ fontSize: 16 }}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}



interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}

function AddTaskModal({ visible, onClose, onAdd }: AddTaskModalProps) {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  );
  const [titleError, setTitleError] = useState('');

  const handleAdd = () => {
    if (title.trim().length < 3) {
      setTitleError('Title must be at least 3 characters');
      return;
    }
    onAdd({
      title: title.trim(),
      description: desc.trim() || 'No description provided.',
      priority,
      status: 'todo',
      dueDate,
      assignee: 'Aryan Mehta',
      tags: [],
    });
    // Reset
    setTitle('');
    setDesc('');
    setPriority('medium');
    setTitleError('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View
            style={[styles.modalContent, { backgroundColor: theme.surface }]}
          >
            {/* Handle bar */}
            <View
              style={[styles.modalHandle, { backgroundColor: theme.border }]}
            />

            <Text
              variant="h3"
              color={theme.text.primary}
              style={styles.modalTitle}
            >
              New Task
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Input
                label="Task Title *"
                value={title}
                onChangeText={setTitle}
                placeholder="What needs to be done?"
                error={titleError}
                leftIcon={<Text style={{ fontSize: 18 }}>📝</Text>}
                autoFocus
              />
              <Input
                label="Description"
                value={desc}
                onChangeText={setDesc}
                placeholder="Add more details…"
                multiline
                numberOfLines={3}
                style={{ minHeight: 80, paddingTop: spacing.sm }}
                leftIcon={<Text style={{ fontSize: 18 }}>📄</Text>}
              />

              {/* Priority Selector */}
              <Text
                variant="label"
                color={theme.text.secondary}
                style={styles.selectorLabel}
              >
                Priority
              </Text>
              <View style={styles.priorityRow}>
                {(['low', 'medium', 'high'] as TaskPriority[]).map(p => {
                  const m = priorityMeta[p];
                  const isSelected = priority === p;
                  return (
                    <TouchableOpacity
                      key={p}
                      onPress={() => setPriority(p)}
                      style={[
                        styles.priorityBtn,
                        {
                          backgroundColor: isSelected
                            ? `${m.color}20`
                            : theme.input.background,
                          borderColor: isSelected ? m.color : theme.border,
                          borderWidth: isSelected ? 1.5 : 1,
                        },
                      ]}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: isSelected }}
                      accessibilityLabel={`Priority: ${p}`}
                    >
                      <Text>{m.icon}</Text>
                      <Text
                        variant="label"
                        color={isSelected ? m.color : theme.text.secondary}
                      >
                        {m.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Input
                label="Due Date (YYYY-MM-DD)"
                value={dueDate}
                onChangeText={setDueDate}
                placeholder="2025-06-30"
                leftIcon={<Text style={{ fontSize: 18 }}>📅</Text>}
                keyboardType="numeric"
              />

              <View style={styles.modalActions}>
                <Button
                  label="Cancel"
                  onPress={onClose}
                  variant="ghost"
                  style={{ flex: 1 }}
                />
                <Button
                  label="Add Task"
                  onPress={handleAdd}
                  style={{ flex: 2 }}
                />
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}



export function TasksScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { state, addTask, updateTaskStatus, deleteTask } = useApp();
  const { navigate } = useNavigation();

  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const { opacity, translateY } = useFadeIn(0);

  const filtered = useMemo(() => {
    switch (activeTab) {
      case 'Todo':
        return state.tasks.filter(t => t.status === 'todo');
      case 'Active':
        return state.tasks.filter(t => t.status === 'in-progress');
      case 'Done':
        return state.tasks.filter(t => t.status === 'done');
      default:
        return state.tasks;
    }
  }, [state.tasks, activeTab]);

  const taskStats = useMemo(
    () => ({
      total: state.tasks.length,
      todo: state.tasks.filter(t => t.status === 'todo').length,
      active: state.tasks.filter(t => t.status === 'in-progress').length,
      done: state.tasks.filter(t => t.status === 'done').length,
      completion: state.tasks.length
        ? Math.round(
            (state.tasks.filter(t => t.status === 'done').length /
              state.tasks.length) *
              100,
          )
        : 0,
    }),
    [state.tasks],
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            paddingTop: insets.top + spacing.md,
            backgroundColor: theme.surface,
            opacity,
            transform: [{ translateY }],
          },
          shadow.sm,
        ]}
      >
        <View style={styles.headerTop}>
          <View>
            <Text variant="h2" color={theme.text.primary}>
              Tasks
            </Text>
            <Text variant="caption" color={theme.text.muted}>
              {taskStats.completion}% complete
            </Text>
          </View>
          <Button
            label="+ New"
            onPress={() => setShowAddModal(true)}
            size="sm"
            style={styles.addBtn}
          />
        </View>

        {/* Progress bar */}
        <View style={[styles.progressBarBg, { backgroundColor: theme.border }]}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                backgroundColor: palette.primary,
                width: `${taskStats.completion}%`,
              },
            ]}
          />
        </View>

        {/* Mini stats */}
        <View style={styles.miniStats}>
          {[
            {
              label: 'Total',
              value: taskStats.total,
              color: theme.text.primary,
            },
            { label: 'Todo', value: taskStats.todo, color: palette.grey500 },
            {
              label: 'Active',
              value: taskStats.active,
              color: palette.primary,
            },
            { label: 'Done', value: taskStats.done, color: palette.success },
          ].map(s => (
            <View key={s.label} style={styles.miniStat}>
              <Text variant="h3" color={s.color}>
                {s.value}
              </Text>
              <Text variant="caption" color={theme.text.muted}>
                {s.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tab,
                activeTab === tab && {
                  backgroundColor: palette.primary,
                  borderColor: palette.primary,
                },
                activeTab !== tab && { borderColor: theme.border },
              ]}
              accessibilityRole="tab"
              accessibilityState={{ selected: activeTab === tab }}
            >
              <Text
                variant="label"
                color={activeTab === tab ? palette.white : theme.text.muted}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Task List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={activeTab === 'Done' ? '🎉' : '📋'}
          title={
            activeTab === 'Done' ? 'No completed tasks yet' : 'No tasks here'
          }
          subtitle={
            activeTab === 'All'
              ? 'Tap "+ New" to create your first task'
              : `No ${activeTab.toLowerCase()} tasks`
          }
          action={
            activeTab === 'All' ? (
              <Button
                label="Create Task"
                onPress={() => setShowAddModal(true)}
              />
            ) : undefined
          }
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onPress={() => navigate('TaskDetail', { taskId: item.id })}
              onStatusChange={s => updateTaskStatus(item.id, s)}
              onDelete={() => deleteTask(item.id)}
            />
          )}
        />
      )}

      <AddTaskModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addTask}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  addBtn: { marginTop: 4 },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  miniStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  miniStat: { alignItems: 'center', flex: 1 },
  tabs: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: 'center',
  },
  list: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: 100,
  },
  taskCard: {
    borderRadius: radius.md,
    padding: spacing.md,
    overflow: 'hidden',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  taskTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    flex: 1,
  },
  priorityIcon: { fontSize: 14, marginTop: 1 },
  taskDesc: {
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  metaItem: { marginRight: spacing.xs },
  taskActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  progressBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  deleteBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  strikethrough: { textDecorationLine: 'line-through', opacity: 0.5 },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    maxHeight: '90%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: { marginBottom: spacing.lg },
  selectorLabel: { marginBottom: spacing.sm },
  priorityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  priorityBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
});
