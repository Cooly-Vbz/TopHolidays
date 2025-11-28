import { GoogleLogin } from '@react-oauth/google'
// @ts-ignore - No types available for this package
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
// @ts-ignore - No types available
import AppleLogin from 'react-apple-login'
import { oauthConfig, handleOAuthCallback, UserProfile } from '../lib/oauth-providers'
import { useTheme } from './ThemeProvider'
import { getThemeColors } from '../lib/theme-colors'

interface OAuthButtonsProps {
    onSuccess: (user: UserProfile) => void
    onError: (error: string) => void
}

export default function OAuthButtons({ onSuccess, onError }: OAuthButtonsProps) {
    const { theme } = useTheme()
    const colors = getThemeColors(theme)

    const buttonStyle = {
        width: '100%',
        padding: '10px',
        borderRadius: '8px',
        border: `1px solid ${colors.border.default}`,
        background: 'transparent',
        color: colors.text.primary,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        fontWeight: 500,
        fontSize: '14px',
        marginBottom: '8px'
    }

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

            {/* Facebook */}
            <FacebookLogin
                appId={oauthConfig.facebook.appId}
                autoLoad={false}
                fields="name,email,picture"
                callback={(response: any) => {
                    if (response.status !== 'unknown') {
                        handleOAuthCallback('facebook', response)
                            .then(onSuccess)
                            .catch(err => onError(err.message))
                    }
                }}
                render={(renderProps: any) => (
                    <button onClick={renderProps.onClick} style={{ ...buttonStyle, borderColor: '#1877F2', color: '#1877F2' }}>
                        <span style={{ fontSize: 18 }}>f</span>
                        Continue with Facebook
                    </button>
                )}
            />

            {/* Apple */}
            <button style={{ ...buttonStyle, borderColor: colors.text.primary }}>
                <span style={{ fontSize: 18 }}></span>
                Continue with Apple
            </button>

            {/* GitHub */}
            <button
                onClick={() => {
                    // Simulate GitHub flow
                    handleOAuthCallback('github', { code: 'mock-code' })
                        .then(onSuccess)
                        .catch(err => onError(err.message))
                }}
                style={{ ...buttonStyle, background: '#24292e', color: '#ffffff', border: 'none' }}
            >
                <span style={{ fontSize: 18 }}>🐙</span>
                Continue with GitHub
            </button>
        </div>
    )
}
