import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
} from 'react';
import { NavigationRoute, ScreenName } from '../types';



interface NavigationState {
  stack: NavigationRoute[];
}

type NavigationAction =
  | { type: 'PUSH'; route: NavigationRoute }
  | { type: 'POP' }
  | { type: 'REPLACE'; route: NavigationRoute }
  | { type: 'RESET'; route: NavigationRoute };

function navigationReducer(
  state: NavigationState,
  action: NavigationAction,
): NavigationState {
  switch (action.type) {
    case 'PUSH':
      return { stack: [...state.stack, action.route] };
    case 'POP':
      if (state.stack.length <= 1) return state;
      return { stack: state.stack.slice(0, -1) };
    case 'REPLACE':
      return { stack: [...state.stack.slice(0, -1), action.route] };
    case 'RESET':
      return { stack: [action.route] };
    default:
      return state;
  }
}



interface NavigationContextValue {
  currentRoute: NavigationRoute;
  stack: NavigationRoute[];
  canGoBack: boolean;
  navigate: (name: ScreenName, params?: Record<string, unknown>) => void;
  goBack: () => void;
  replace: (name: ScreenName, params?: Record<string, unknown>) => void;
  reset: (name: ScreenName, params?: Record<string, unknown>) => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);



interface NavigationProviderProps {
  children: React.ReactNode;
  initialRoute: ScreenName;
}

export function NavigationProvider({
  children,
  initialRoute,
}: NavigationProviderProps) {
  const [state, dispatch] = useReducer(navigationReducer, {
    stack: [{ name: initialRoute }],
  });

  const navigate = useCallback(
    (name: ScreenName, params?: Record<string, unknown>) =>
      dispatch({ type: 'PUSH', route: { name, params } }),
    [],
  );

  const goBack = useCallback(() => dispatch({ type: 'POP' }), []);

  const replace = useCallback(
    (name: ScreenName, params?: Record<string, unknown>) =>
      dispatch({ type: 'REPLACE', route: { name, params } }),
    [],
  );

  const reset = useCallback(
    (name: ScreenName, params?: Record<string, unknown>) =>
      dispatch({ type: 'RESET', route: { name, params } }),
    [],
  );

  const value = useMemo<NavigationContextValue>(
    () => ({
      currentRoute: state.stack[state.stack.length - 1],
      stack: state.stack,
      canGoBack: state.stack.length > 1,
      navigate,
      goBack,
      replace,
      reset,
    }),
    [state, navigate, goBack, replace, reset],
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}



export function useNavigation(): NavigationContextValue {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation must be used within NavigationProvider');
  return ctx;
}
