/**
 * Centralized theme color palette
 * Ensures WCAG AA compliance (4.5:1 text contrast, 3:1 UI contrast)
 */

export const colors = {
    // Light theme
    light: {
        // Backgrounds
        bg: {
            primary: '#FFFFFF',
            secondary: '#F9FAFB',
            tertiary: '#F3F4F6',
            inverse: '#111827',
        },
        // Text
        text: {
            primary: '#111827',
            secondary: '#4B5563',
            tertiary: '#6B7280',
            inverse: '#FFFFFF',
            link: '#2563EB',
            linkHover: '#1D4ED8',
        },
        // Borders
        border: {
            light: '#F3F4F6',
            default: '#E5E7EB',
            medium: '#D1D5DB',
            dark: '#9CA3AF',
        },
        // Status colors
        status: {
            success: {
                bg: '#D1FAE5',
                text: '#065F46',
                border: '#10B981',
            },
            warning: {
                bg: '#FEF3C7',
                text: '#92400E',
                border: '#F59E0B',
            },
            error: {
                bg: '#FEE2E2',
                text: '#991B1B',
                border: '#EF4444',
            },
            info: {
                bg: '#DBEAFE',
                text: '#1E40AF',
                border: '#3B82F6',
            },
        },
        // Brand colors
        brand: {
            primary: '#3B82F6',
            primaryHover: '#2563EB',
            secondary: '#10B981',
            secondaryHover: '#059669',
            accent: '#F59E0B',
            accentHover: '#D97706',
        },
    },

    // Dark theme
    dark: {
        // Backgrounds
        bg: {
            primary: '#020617',
            secondary: '#0F172A',
            tertiary: '#1E293B',
            inverse: '#F9FAFB',
        },
        // Text
        text: {
            primary: '#F9FAFB',
            secondary: '#E5E7EB',
            tertiary: '#9CA3AF',
            inverse: '#111827',
            link: '#60A5FA',
            linkHover: '#93C5FD',
        },
        // Borders
        border: {
            light: '#1E293B',
            default: '#334155',
            medium: '#475569',
            dark: '#64748B',
        },
        // Status colors
        status: {
            success: {
                bg: 'rgba(16, 185, 129, 0.2)',
                text: '#34D399',
                border: '#10B981',
            },
            warning: {
                bg: 'rgba(245, 158, 11, 0.2)',
                text: '#FCD34D',
                border: '#F59E0B',
            },
            error: {
                bg: 'rgba(239, 68, 68, 0.2)',
                text: '#F87171',
                border: '#EF4444',
            },
            info: {
                bg: 'rgba(59, 130, 246, 0.2)',
                text: '#60A5FA',
                border: '#3B82F6',
            },
        },
        // Brand colors
        brand: {
            primary: '#60A5FA',
            primaryHover: '#93C5FD',
            secondary: '#34D399',
            secondaryHover: '#6EE7B7',
            accent: '#FBBF24',
            accentHover: '#FCD34D',
        },
    },
}

/**
 * Get theme-aware colors
 */
export function getThemeColors(theme: 'light' | 'dark') {
    return colors[theme]
}

/**
 * Shadow presets (theme-aware)
 */
export const shadows = {
    light: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    dark: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        default: '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 10px 10px -5px rgba(0, 0, 0, 0.5)',
    },
}

export function getThemeShadows(theme: 'light' | 'dark') {
    return shadows[theme]
}
