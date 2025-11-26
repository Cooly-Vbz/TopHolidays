// Extend expect with jest-dom matchers for RTL
import '@testing-library/jest-dom/vitest'

// Common browser APIs stubs for JSDOM tests
if (!window.matchMedia) {
  // @ts-expect-error - JSDOM stub
  window.matchMedia = () => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })
}

// Silence router scroll in tests
if (!window.scrollTo) {
  // @ts-expect-error - JSDOM stub
  window.scrollTo = () => {}
}

// Ensure localStorage exists and is writable
try {
  window.localStorage.setItem('__vitest_init__', '1')
  window.localStorage.removeItem('__vitest_init__')
} catch {
  // JSDOM provides localStorage; ignore if unavailable
}