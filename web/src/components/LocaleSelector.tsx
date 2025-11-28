import { useContext } from 'react'
import { LocaleContext } from '../contexts/LocaleContext'
import { LOCALES } from '../lib/locales'
import type { SupportedLocale } from '../lib/locales'
import { useTheme } from './ThemeProvider'
import { getThemeColors } from '../lib/theme-colors'

interface LocaleSelectorProps {
  isOpen: boolean
  onClose: () => void
  anchorRef: React.RefObject<HTMLElement | null>
}

export function LocaleSelector({ isOpen, onClose, anchorRef }: LocaleSelectorProps) {
  const { locale, setLocale } = useContext(LocaleContext)
  const { theme } = useTheme()
  const colors = getThemeColors(theme)

  if (!isOpen) return null

  const handleLocaleSelect = (selectedLocale: SupportedLocale) => {
    setLocale(selectedLocale)
    onClose()
  }

  // Position the selector below the account button
  const position = { top: 0, right: 0 }
  if (anchorRef.current) {
    const rect = anchorRef.current.getBoundingClientRect()
    position.top = rect.bottom + 8
    position.right = window.innerWidth - rect.right
  }

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          background: 'transparent'
        }}
        onClick={onClose}
      />

      {/* Locale Selector */}
      <div
        style={{
          position: 'fixed',
          top: position.top,
          right: position.right,
          zIndex: 1001,
          background: colors.bg.primary,
          border: `1px solid ${colors.border.default}`,
          borderRadius: 12,
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          minWidth: 200,
          maxWidth: 280,
          padding: 8,
          animation: 'localeSelectorFadeIn 0.3s ease-out'
        }}
      >
        {/* Arrow pointing up */}
        <div style={{
          position: 'absolute',
          top: -8,
          right: 16,
          width: 0,
          height: 0,
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderBottom: `8px solid ${colors.bg.primary}`,
        }} />

        <div style={{ fontSize: 14, fontWeight: 600, color: colors.text.primary, marginBottom: 8, textAlign: 'center' }}>
          Select Locale & Currency
        </div>

        <div style={{ display: 'grid', gap: 4 }}>
          {Object.values(LOCALES).map((localeData) => (
            <button
              key={localeData.code}
              onClick={() => handleLocaleSelect(localeData.code)}
              style={{
                width: '100%',
                padding: 10,
                background: locale === localeData.code ? colors.brand.primary : 'transparent',
                border: locale === localeData.code ? 'none' : `1px solid ${colors.border.default}`,
                borderRadius: 8,
                color: locale === localeData.code ? '#FFFFFF' : colors.text.primary,
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: 16 }}>{localeData.flag}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>
                  {localeData.name}
                </div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  {localeData.currency}
                </div>
              </div>
              {locale === localeData.code && (
                <span style={{ fontSize: 14 }}>✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes localeSelectorFadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}