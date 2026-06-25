

export const palette = {
  // Brand
  primary: '#6C63FF',       // Vivid violet
  primaryLight: '#A89CFF',
  primaryDark: '#4B44CC',
  secondary: '#FF6584',     // Coral pink
  accent: '#43E97B',        // Mint green

  // Neutrals
  white: '#FFFFFF',
  black: '#0A0A0A',
  grey100: '#F7F8FC',
  grey200: '#EDEEF5',
  grey300: '#D1D3E2',
  grey400: '#9699B0',
  grey500: '#6B6F8A',
  grey600: '#3D4066',
  grey700: '#252748',
  grey800: '#151630',


  success: '#2DD36F',
  warning: '#FFB547',
  error: '#EB445A',
  info: '#3DC2FF',

  // Overlay
  overlay: 'rgba(0,0,0,0.5)',
  overlayLight: 'rgba(0,0,0,0.15)',
} as const;

export const lightTheme = {
  background: palette.grey100,
  surface: palette.white,
  surfaceElevated: palette.white,
  border: palette.grey200,
  divider: palette.grey200,
  text: {
    primary: palette.grey800,
    secondary: palette.grey500,
    muted: palette.grey400,
    inverse: palette.white,
    accent: palette.primary,
  },
  icon: {
    primary: palette.grey600,
    muted: palette.grey400,
    accent: palette.primary,
  },
  tab: {
    background: palette.white,
    active: palette.primary,
    inactive: palette.grey400,
  },
  card: {
    background: palette.white,
    shadow: palette.grey300,
  },
  input: {
    background: palette.grey100,
    border: palette.grey300,
    placeholder: palette.grey400,
  },
  badge: {
    background: palette.secondary,
    text: palette.white,
  },
} as const;

export const darkTheme = {
  background: palette.grey800,
  surface: palette.grey700,
  surfaceElevated: palette.grey600,
  border: palette.grey600,
  divider: '#2A2D4A',
  text: {
    primary: palette.white,
    secondary: palette.grey300,
    muted: palette.grey400,
    inverse: palette.grey800,
    accent: palette.primaryLight,
  },
  icon: {
    primary: palette.grey300,
    muted: palette.grey500,
    accent: palette.primaryLight,
  },
  tab: {
    background: palette.grey700,
    active: palette.primaryLight,
    inactive: palette.grey500,
  },
  card: {
    background: palette.grey700,
    shadow: 'transparent',
  },
  input: {
    background: palette.grey700,
    border: palette.grey600,
    placeholder: palette.grey500,
  },
  badge: {
    background: palette.secondary,
    text: palette.white,
  },
} as const;

export type Theme = typeof lightTheme;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 30,
  display: 38,
} as const;

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const shadow = {
  sm: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  lg: {
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
} as const;
