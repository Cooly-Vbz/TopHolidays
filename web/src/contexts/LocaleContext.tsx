import { createContext, useState, useEffect } from 'react'
import { LOCALES, detectLocale } from '../lib/locales'
import type { SupportedLocale, SupportedCurrency } from '../lib/locales'

const LocaleContext = createContext<{
  locale: SupportedLocale
  currency: SupportedCurrency
  setLocale: (locale: SupportedLocale) => void
}>({
  locale: 'en-US',
  currency: 'USD',
  setLocale: () => {}
})

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>('en-US')
  const [currency, setCurrency] = useState<SupportedCurrency>('USD')

  useEffect(() => {
    // Auto-detect on mount
    detectLocale().then(detected => {
      const saved = localStorage.getItem('locale') as SupportedLocale
      const final = saved || detected
      setLocale(final)
    })
  }, [])

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale)
    setCurrency(LOCALES[newLocale].currency)
    localStorage.setItem('locale', newLocale)
  }

  return (
    <LocaleContext.Provider value={{ locale, currency, setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export { LocaleContext }
