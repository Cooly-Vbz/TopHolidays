import { GoogleLogin } from '@react-oauth/google'
import { handleOAuthCallback } from '../lib/oauth-providers'
import type { UserProfile } from '../lib/auth'
import { useTheme } from './ThemeProvider'

interface OAuthButtonsProps {
    onSuccess: (user: UserProfile) => void
    onError: (error: string) => void
}

export default function OAuthButtons({ onSuccess, onError }: OAuthButtonsProps) {
    const { theme } = useTheme()

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

            {/* Note: Other OAuth providers (Facebook, Apple, GitHub) require additional setup
                with their respective APIs and are available in production with proper configuration */}
        </div>
    )
}
