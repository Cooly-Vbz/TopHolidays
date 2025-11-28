import { useEffect, useRef } from 'react'
import { getThemeColors } from '../lib/theme-colors'
import { useTheme } from './ThemeProvider'

export type LocaleOption = { code: string; label: string; currency: string }

const LOCALES: LocaleOption[] = [
  { code: 'en-US', label: 'English (US)', currency: 'USD $' },
  { code: 'en-GB', label: 'English (UK)', currency: 'GBP £' },
  { code: 'fr-FR', label: 'Français (FR)', currency: 'EUR €' },
  { code: 'de-DE', label: 'Deutsch (DE)', currency: 'EUR €' },
  { code: 'es-ES', label: 'Español (ES)', currency: 'EUR €' },
  { code: 'it-IT', label: 'Italiano (IT)', currency: 'EUR €' },
]

export function LocaleSelector({ isOpen, onClose, currentLocale, onLocaleChange }: {
  isOpen: boolean
  onClose: () => void
  currentLocale: string
  onLocaleChange: (locale: LocaleOption) => void
}) {
  const { theme } = useTheme()
  const colors = getThemeColors(theme)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', onEsc)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const resolved = Intl.DateTimeFormat().resolvedOptions().locale
  const effectiveLocale = LOCALES.find(l => l.code === currentLocale) || LOCALES.find(l => l.code === resolved) || LOCALES[0]

  return (
    <div ref={ref} style={{
      position: 'absolute',
      top: 48,
      left: 12,
      zIndex: 1002,
      background: colors.bg.primary,
      border: `1px solid ${colors.border.default}`,
      borderRadius: 10,
      boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
      minWidth: 240,
      animation: 'localeFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      <div style={{ position: 'absolute', top: -8, left: 20, width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: `8px solid ${colors.border.default}` }} />
      <div style={{ position: 'absolute', top: -7, left: 20, width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: `8px solid ${colors.bg.primary}` }} />
      <div style={{ padding: 10 }}>
        <div style={{ fontSize: 12, color: colors.text.tertiary, marginBottom: 8 }}>Select locale and currency</div>
        {LOCALES.map(opt => (
          <button key={opt.code}
            onClick={() => onLocaleChange(opt)}
            style={{
              width: '100%',
              padding: 10,
              background: opt.code === effectiveLocale.code ? colors.bg.secondary : 'transparent',
              border: 'none',
              borderRadius: 8,
              color: colors.text.primary,
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = colors.bg.secondary}
            onMouseOut={(e) => e.currentTarget.style.background = opt.code === effectiveLocale.code ? colors.bg.secondary : 'transparent'}
          >
            <span>{opt.label}</span>
            <span style={{ color: colors.text.tertiary }}>{opt.currency}</span>
          </button>
        ))}
      </div>
      <style>{`
        @keyframes localeFadeIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}