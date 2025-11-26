// Stub Vite SSR helper used by plugin-react transforms so tests don't error
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).__vite_ssr_exportName__ = () => {}

import '@testing-library/jest-dom/vitest'