import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { LocaleProvider, LocaleContext } from '../contexts/LocaleContext'
import { LocaleSelector } from '../components/LocaleSelector'
import { detectLocale } from '../lib/locales'

// Mock fetch for reverse geocoding
global.fetch = vi.fn()

// Mock navigator.geolocation
const mockGeolocation = {
    getCurrentPosition: vi.fn()
}
global.navigator.geolocation = mockGeolocation as any

describe('Locale System', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        localStorage.clear()
    })

    describe('detectLocale', () => {
        it('should default to en-US if geolocation is not available', async () => {
            // @ts-ignore
            delete global.navigator.geolocation
            const locale = await detectLocale()
            expect(locale).toBe('en-US')
        })

        it('should detect locale from coordinates', async () => {
            global.navigator.geolocation = mockGeolocation as any
            mockGeolocation.getCurrentPosition.mockImplementation((success) => {
                success({
                    coords: { latitude: 48.8566, longitude: 2.3522 }
                })
            })

                // Mock OpenStreetMap response for Paris, France
                ; (global.fetch as any).mockResolvedValue({
                    json: () => Promise.resolve({
                        address: { country_code: 'fr' }
                    })
                })

            const locale = await detectLocale()
            expect(locale).toBe('fr-FR')
        })

        it('should fallback to en-US on error', async () => {
            global.navigator.geolocation = mockGeolocation as any
            mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
                error(new Error('User denied geolocation'))
            })

            const locale = await detectLocale()
            expect(locale).toBe('en-US')
        })
    })

    describe('LocaleContext', () => {
        it('should provide default locale', () => {
            render(
                <LocaleProvider>
                    <LocaleContext.Consumer>
                        {({ locale }) => <span>Current: {locale}</span>}
                    </LocaleContext.Consumer>
                </LocaleProvider>
            )
            // Initial state is en-US before effect runs
            expect(screen.getByText('Current: en-US')).toBeInTheDocument()
        })

        it('should update locale', async () => {
            render(
                <LocaleProvider>
                    <LocaleContext.Consumer>
                        {({ locale, setLocale }) => (
                            <button onClick={() => setLocale('es-ES')}>
                                {locale}
                            </button>
                        )}
                    </LocaleContext.Consumer>
                </LocaleProvider>
            )

            const button = screen.getByRole('button')
            fireEvent.click(button)
            expect(button).toHaveTextContent('es-ES')
            expect(localStorage.getItem('locale')).toBe('es-ES')
        })
    })

    describe('LocaleSelector', () => {
        it('should render when open', () => {
            const anchorRef = { current: document.createElement('div') }
            render(
                <LocaleProvider>
                    <LocaleSelector
                        isOpen={true}
                        onClose={vi.fn()}
                        anchorRef={anchorRef}
                    />
                </LocaleProvider>
            )
            expect(screen.getByText('Select Locale & Currency')).toBeInTheDocument()
            expect(screen.getByText('English (US)')).toBeInTheDocument()
            expect(screen.getByText('Français')).toBeInTheDocument()
        })

        it('should change locale when clicked', () => {
            const onClose = vi.fn()
            const anchorRef = { current: document.createElement('div') }

            render(
                <LocaleProvider>
                    <LocaleSelector
                        isOpen={true}
                        onClose={onClose}
                        anchorRef={anchorRef}
                    />
                </LocaleProvider>
            )

            fireEvent.click(screen.getByText('Français'))
            expect(localStorage.getItem('locale')).toBe('fr-FR')
            expect(onClose).toHaveBeenCalled()
        })
    })
})
