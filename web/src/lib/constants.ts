// UI Constants for consistent styling across components

// Z-index hierarchy to prevent conflicts
export const Z_INDEX = {
  navbar: 900,
  sidebar: 950,
  connectionBanner: 975,
  modal: 1000,
  tooltip: 1050,
  overlay: 1100,
  loading: 1200
} as const

// Breakpoints for responsive design
export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  large: 1440
} as const

// Spacing scale
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64
} as const

// Border radius scale
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  full: 9999
} as const

// Animation durations
export const ANIMATION = {
  fast: 150,
  normal: 250,
  slow: 350
} as const

// Color palette
export const COLORS = {
  primary: '#10B981',
  secondary: '#065F46',
  accent: '#14B8A6',
  warning: '#F59E0B',
  error: '#EF4444',
  success: '#10B981',
  info: '#3B82F6'
} as const
