import { useApp } from '../store/AppContext';
import { lightTheme, darkTheme, Theme } from '../theme';

export function useTheme(): Theme {
  const { state } = useApp();
  return state.theme === 'dark' ? darkTheme : lightTheme;
}
