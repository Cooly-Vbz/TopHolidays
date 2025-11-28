import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import OAuthButtons from '../components/OAuthButtons'
import { ThemeProvider } from '../components/ThemeProvider'
import { handleOAuthCallback } from '../lib/oauth-providers'

// Mock dependencies
vi.mock('../lib/oauth-providers', async () => {
    const actual = await vi.importActual('../lib/oauth-providers')
    return {
        ...actual,
        handleOAuthCallback: vi.fn().mockResolvedValue({
            id: 'mock_id',
            email: 'test@example.com',
            displayName: 'Test User',
            provider: 'google'
        })
    }
})

// Mock Google Login
vi.mock('@react-oauth/google', () => ({
    GoogleLogin: ({ onSuccess }: any) => (
        <button onClick={() => onSuccess({ credential: 'mock_token' })}>
            Mock Google Login
        </button>
    )
}))

// Mock Facebook Login
vi.mock('react-facebook-login/dist/facebook-login-render-props', () => ({
    default: ({ render, callback }: any) => render({ onClick: () => callback({ status: 'connected' }) })
}))

// Mock Apple Login
vi.mock('react-apple-login', () => ({
    default: () => <button>Mock Apple Login</button>
}))

const renderWithTheme = (ui: React.ReactNode) => {
    return render(
        <ThemeProvider>
            {ui}
        </ThemeProvider>
    )
}

describe('OAuthButtons', () => {
    it('renders all provider buttons', () => {
        renderWithTheme(<OAuthButtons onSuccess={vi.fn()} onError={vi.fn()} />)

        expect(screen.getByText('Mock Google Login')).toBeInTheDocument()
        expect(screen.getByText('Continue with Facebook')).toBeInTheDocument()
        expect(screen.getByText('Continue with Apple')).toBeInTheDocument()
        expect(screen.getByText('Continue with GitHub')).toBeInTheDocument()
    })

    it('calls onSuccess when Google login succeeds', async () => {
        const onSuccess = vi.fn()
        renderWithTheme(<OAuthButtons onSuccess={onSuccess} onError={vi.fn()} />)

        fireEvent.click(screen.getByText('Mock Google Login'))

        await waitFor(() => {
            expect(handleOAuthCallback).toHaveBeenCalledWith('google', expect.anything())
            expect(onSuccess).toHaveBeenCalled()
        })
    })

    it('calls onSuccess when Facebook login succeeds', async () => {
        const onSuccess = vi.fn()
        renderWithTheme(<OAuthButtons onSuccess={onSuccess} onError={vi.fn()} />)

        fireEvent.click(screen.getByText('Continue with Facebook'))

        await waitFor(() => {
            expect(handleOAuthCallback).toHaveBeenCalledWith('facebook', expect.anything())
            expect(onSuccess).toHaveBeenCalled()
        })
    })

    it('calls onSuccess when GitHub login is clicked', async () => {
        const onSuccess = vi.fn()
        renderWithTheme(<OAuthButtons onSuccess={onSuccess} onError={vi.fn()} />)

        fireEvent.click(screen.getByText('Continue with GitHub'))

        await waitFor(() => {
            expect(handleOAuthCallback).toHaveBeenCalledWith('github', expect.anything())
            expect(onSuccess).toHaveBeenCalled()
        })
    })
})
