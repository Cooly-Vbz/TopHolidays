export type SupportedLocale = 'en-US' | 'es-ES' | 'fr-FR' | 'de-DE' | 'it-IT' | 'pt-BR'
export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'BRL'

export interface LocaleData {
  code: SupportedLocale
  name: string
  flag: string
  currency: SupportedCurrency
}

export const LOCALES: Record<SupportedLocale, LocaleData> = {
  'en-US': { code: 'en-US', name: 'English (US)', flag: '🇺🇸', currency: 'USD' },
  'es-ES': { code: 'es-ES', name: 'Español', flag: '🇪🇸', currency: 'EUR' },
  'fr-FR': { code: 'fr-FR', name: 'Français', flag: '🇫🇷', currency: 'EUR' },
  'de-DE': { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪', currency: 'EUR' },
  'it-IT': { code: 'it-IT', name: 'Italiano', flag: '🇮🇹', currency: 'EUR' },
  'pt-BR': { code: 'pt-BR', name: 'Português (BR)', flag: '🇧🇷', currency: 'BRL' },
}

export async function detectLocale(): Promise<SupportedLocale> {
  // Try geolocation API
  if ('geolocation' in navigator) {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })

      // Reverse geocode to get country
      const country = await reverseGeocode(position.coords)
      return mapCountryToLocale(country)
    } catch (error) {
      // Fall back to navigator.language
    }
  }

  // Use browser language
  const browserLang = navigator.language as SupportedLocale
  if (browserLang in LOCALES) {
    return browserLang
  }

  // Default to English
  return 'en-US'
}

async function reverseGeocode(coords: GeolocationCoordinates): Promise<string> {
  // Use free geocoding API
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`
  )
  const data = await response.json()
  return data.address.country_code.toUpperCase()
}

function mapCountryToLocale(countryCode: string): SupportedLocale {
  const countryToLocale: Record<string, SupportedLocale> = {
    'US': 'en-US',
    'GB': 'en-US', // UK uses USD for this demo
    'ES': 'es-ES',
    'FR': 'fr-FR',
    'DE': 'de-DE',
    'IT': 'it-IT',
    'BR': 'pt-BR',
    'PT': 'pt-BR',
  }

  return countryToLocale[countryCode] || 'en-US'
}
