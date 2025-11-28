import { GoogleLogin } from '@react-oauth/google'
import { handleOAuthCallback } from '../lib/oauth-providers'
import type { UserProfile } from '../lib/auth'
import { useTheme } from './ThemeProvider'
import { getThemeColors } from '../lib/theme-colors'

interface OAuthButtonsProps {
    onSuccess: (user: UserProfile) => void
    onError: (error: string) => void
}

export default function OAuthButtons({ onSuccess, onError }: OAuthButtonsProps) {
    const { theme } = useTheme()
    const colors = getThemeColors(theme)

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Google */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <GoogleLogin
                    onSuccess={credentialResponse => {
                        handleOAuthCallback('google', credentialResponse)
                            .then(onSuccess)
                            .catch(err => onError(err.message))
                    }}
                    onError={() => onError('Google login failed')}
                    useOneTap
                    theme={theme === 'dark' ? 'filled_black' : 'outline'}
                    shape="pill"
                    width="280" // Match popup width roughly
                />
            </div>

            {/* Other providers - placeholders for now */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                <button
                    onClick={() => onError('Facebook login coming soon')}
                    style={{
                        padding: '10px',
                        borderRadius: '8px',
                        border: `1px solid ${colors.border.default}`,
                        background: 'transparent',
                        color: colors.text.primary,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px'
                    }}
                    title="Facebook (Coming Soon)"
                >
                    📘
                </button>
                <button
                    onClick={() => onError('Apple login coming soon')}
                    style={{
                        padding: '10px',
                        borderRadius: '8px',
                        border: `1px solid ${colors.border.default}`,
                        background: 'transparent',
                        color: colors.text.primary,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px'
                    }}
                    title="Apple (Coming Soon)"
                >
                    🍎
                </button>
                <button
                    onClick={() => onError('GitHub login coming soon')}
                    style={{
                        padding: '10px',
                        borderRadius: '8px',
                        border: `1px solid ${colors.border.default}`,
                        background: 'transparent',
                        color: colors.text.primary,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px'
                    }}
                    title="GitHub (Coming Soon)"
                >
                    🐙
                </button>
            </div>
        </div>
    )
}
