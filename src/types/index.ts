export type ScreenName =
  | 'Splash'
  | 'Login'
  | 'Register'
  | 'Home'
  | 'Gallery'
  | 'Tasks'
  | 'Profile'
  | 'PhotoDetail'
  | 'TaskDetail';

export interface NavigationRoute {
  name: ScreenName;
  params?: Record<string, unknown>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  role: 'photographer' | 'editor' | 'viewer';
  joinedAt: string;
  totalPhotos: number;
  totalTasks: number;
}

export type PhotoCategory =
  | 'Nature'
  | 'Portrait'
  | 'Architecture'
  | 'Street'
  | 'Abstract';

export interface Photo {
  id: string;
  title: string;
  description: string;
  uri: string;
  category: PhotoCategory;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
  uploadedAt: string;
  author: string;
  tags: string[];
  width: number;
  height: number;
}

// ─── Task ──────────────────────────────────────────────────────────────────

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  assignee: string;
  tags: string[];
  createdAt: string;
  completedAt?: string;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'task' | 'system';
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  photos: Photo[];
  tasks: Task[];
  notifications: Notification[];
  theme: 'light' | 'dark';
  isLoading: boolean;
}

export type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_PHOTOS'; payload: Photo[] }
  | { type: 'TOGGLE_LIKE'; payload: string }
  | { type: 'TOGGLE_SAVE'; payload: string }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_LOADING'; payload: boolean };
