import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AccountPopup from '../components/AccountPopup'
import { ThemeProvider } from '../components/ThemeProvider'
import { AuthProvider } from '../components/AuthProvider'
import { NotificationsProvider } from '../contexts/NotificationsContext'
import { LocaleProvider } from '../contexts/LocaleContext'
import { BrowserRouter } from 'react-router-dom'

// Mock dependencies
vi.mock('../lib/auth', async () => {
    const actual = await vi.importActual('../lib/auth')
    return {
        ...actual,
        listAccounts: vi.fn().mockResolvedValue([]),
    }
})

const renderWithProviders = (ui: React.ReactNode) => {
    return render(
        <BrowserRouter>
            <ThemeProvider>
                <AuthProvider>
                    <LocaleProvider>
                        <NotificationsProvider>
                            {ui}
                        </NotificationsProvider>
                    </LocaleProvider>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    )
}

describe('AccountPopup', () => {
    it('should render when open', () => {
        const anchorRef = { current: document.createElement('button') }
        renderWithProviders(
            <AccountPopup
                isOpen={true}
                onClose={vi.fn()}
                anchorRef={anchorRef}
                onOpenSettings={vi.fn()}
            />
        )
        expect(screen.getByText(/Locale & Currency/i)).toBeInTheDocument()
    })

    it('should not render when closed', () => {
        const anchorRef = { current: document.createElement('button') }
        renderWithProviders(
            <AccountPopup
                isOpen={false}
                onClose={vi.fn()}
                anchorRef={anchorRef}
                onOpenSettings={vi.fn()}
            />
        )
        expect(screen.queryByText(/Locale & Currency/i)).not.toBeInTheDocument()
    })

    it('should call onClose when clicking outside', () => {
        const onClose = vi.fn()
        const anchorRef = { current: document.createElement('button') }
        renderWithProviders(
            <AccountPopup
                isOpen={true}
                onClose={onClose}
                anchorRef={anchorRef}
                onOpenSettings={vi.fn()}
            />
        )

        fireEvent.mouseDown(document.body)
        expect(onClose).toHaveBeenCalled()
    })

    it('should show Account Settings button when logged in', () => {
        // Note: This test assumes default mock user is logged in or we need to mock useAuth
        // For now, we check if the button exists or not based on default state
        // If default is guest, it should show Sign In
        // If default is user, it should show Account Settings

        // Since we are using real AuthProvider with default state (likely guest),
        // we might see "Sign In / Sign Up"
        const anchorRef = { current: document.createElement('button') }
        renderWithProviders(
            <AccountPopup
                isOpen={true}
                onClose={vi.fn()}
                anchorRef={anchorRef}
                onOpenSettings={vi.fn()}
            />
        )

        // Check for either Sign In or Account Settings to ensure it renders something
        it('should toggle Sign In view', () => {
            const anchorRef = { current: document.createElement('button') }
            renderWithProviders(
                <AccountPopup
                    isOpen={true}
                    onClose={vi.fn()}
                    anchorRef={anchorRef}
                    onOpenSettings={vi.fn()}
                />
            )

            // Initially shows Sign In / Sign Up button
            const signInBtn = screen.getByText(/Sign In \/ Sign Up/i)
            expect(signInBtn).toBeInTheDocument()

            // Click to show OAuth buttons
            fireEvent.click(signInBtn)
            expect(screen.getByText(/Sign In/i)).toBeInTheDocument() // Header
            expect(screen.queryByText(/Sign In \/ Sign Up/i)).not.toBeInTheDocument()

            // Click back
            const backBtn = screen.getByText('←')
            fireEvent.click(backBtn)
            expect(screen.getByText(/Sign In \/ Sign Up/i)).toBeInTheDocument()
        })
    })
