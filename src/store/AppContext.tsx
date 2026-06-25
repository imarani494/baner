import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
} from 'react';
import { AppState, AppAction, User, Task } from '../types';
import {
  MOCK_PHOTOS,
  MOCK_TASKS,
  MOCK_NOTIFICATIONS,
  MOCK_USER,
} from '../data/mockData';

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  photos: MOCK_PHOTOS,
  tasks: MOCK_TASKS,
  notifications: MOCK_NOTIFICATIONS,
  theme: 'light',
  isLoading: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: true };

    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false };

    case 'SET_PHOTOS':
      return { ...state, photos: action.payload };

    case 'TOGGLE_LIKE':
      return {
        ...state,
        photos: state.photos.map(p =>
          p.id === action.payload
            ? {
                ...p,
                isLiked: !p.isLiked,
                likes: p.isLiked ? p.likes - 1 : p.likes + 1,
              }
            : p,
        ),
      };

    case 'TOGGLE_SAVE':
      return {
        ...state,
        photos: state.photos.map(p =>
          p.id === action.payload ? { ...p, isSaved: !p.isSaved } : p,
        ),
      };

    case 'SET_TASKS':
      return { ...state, tasks: action.payload };

    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.id ? action.payload : t,
        ),
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(t => t.id !== action.payload),
      };

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, isRead: true } : n,
        ),
      };

    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Convenience action creators
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  toggleLike: (photoId: string) => void;
  toggleSave: (photoId: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  deleteTask: (taskId: string) => void;
  markNotificationRead: (id: string) => void;
  toggleTheme: () => void;
  unreadNotificationCount: number;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Simulated async login
  const login = useCallback(async (email: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    dispatch({ type: 'SET_LOADING', payload: false });
    // Accept any email containing "@" for demo
    if (email.includes('@')) {
      const user: User = { ...MOCK_USER, email };
      dispatch({ type: 'SET_USER', payload: user });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => dispatch({ type: 'LOGOUT' }), []);

  const toggleLike = useCallback(
    (photoId: string) => dispatch({ type: 'TOGGLE_LIKE', payload: photoId }),
    [],
  );

  const toggleSave = useCallback(
    (photoId: string) => dispatch({ type: 'TOGGLE_SAVE', payload: photoId }),
    [],
  );

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...taskData,
      id: `t${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    dispatch({ type: 'ADD_TASK', payload: task });
  }, []);

  const updateTaskStatus = useCallback(
    (taskId: string, status: Task['status']) => {
      const task = state.tasks.find(t => t.id === taskId);
      if (!task) return;
      dispatch({
        type: 'UPDATE_TASK',
        payload: {
          ...task,
          status,
          completedAt:
            status === 'done'
              ? new Date().toISOString().split('T')[0]
              : undefined,
        },
      });
    },
    [state.tasks],
  );

  const deleteTask = useCallback(
    (taskId: string) => dispatch({ type: 'DELETE_TASK', payload: taskId }),
    [],
  );

  const markNotificationRead = useCallback(
    (id: string) => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id }),
    [],
  );

  const toggleTheme = useCallback(() => dispatch({ type: 'TOGGLE_THEME' }), []);

  const unreadNotificationCount = useMemo(
    () => state.notifications.filter(n => !n.isRead).length,
    [state.notifications],
  );

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      dispatch,
      login,
      logout,
      toggleLike,
      toggleSave,
      addTask,
      updateTaskStatus,
      deleteTask,
      markNotificationRead,
      toggleTheme,
      unreadNotificationCount,
    }),
    [
      state,
      login,
      logout,
      toggleLike,
      toggleSave,
      addTask,
      updateTaskStatus,
      deleteTask,
      markNotificationRead,
      toggleTheme,
      unreadNotificationCount,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
