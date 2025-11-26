# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project layout

- Root: repository workspace; primary frontend lives under `web/`.
- `web/`: React + TypeScript single-page app built with Vite (see `web/package.json`, `web/vite.config.ts`).
- `web/public/`: static assets and PWA files (`manifest.json`, `sw.js`, product data in `products.json`, icons, `offline.html`).
- `web/src/`:
  - `main.tsx`: React root; wires up React Query, React Router, `AuthProvider`, and installs the offline request queue listener.
  - `App.tsx`: top-level layout, navigation, and route definitions.
  - `components/`: shared UI shell components (`Navbar`, `Sidebar`, `AccountOverlay`, `ConnectionBanner`, `InstallPrompt`, `LoadingScreen`, `AuthProvider`).
  - `pages/`: route-level screens (`Home`, `Products`, `ProductDetails`, `Cart`, `Favorites`, `Orders`, `CustomerCare`, `About`).
  - `lib/`: browser-side domain and persistence utilities (`auth`, `crypto`, `indexeddb`, `offlineQueue`, `orders`, `products`, `supabase`).
  - `__tests__/`: Vitest + Testing Library tests and a shared `test-utils` wrapper.

## Commands (from repo root)

All app commands are run inside `web/` using npm (there is a `package-lock.json`). From the repository root:

- Install dependencies:
  - `cd web && npm install`
- Start dev server (Vite + React Fast Refresh):
  - `cd web && npm run dev`
- Type-check and build for production:
  - `cd web && npm run build`
- Lint the codebase with ESLint 9 (flat config expected) over the project:
  - `cd web && npm run lint`
- Run the configured Vitest test set (currently limited to selected files via the script):
  - `cd web && npm test`
- Run a specific test file or pattern with Vitest (bypassing the script’s hard-coded file list):
  - `cd web && npx vitest src/__tests__/Cart.test.tsx`
  - `cd web && npx vitest src/__tests__/Cart.test.tsx -t "renders cart items"`
- Preview the production build with Vite’s preview server (after `npm run build`):
  - `cd web && npm run preview`

When editing or running tests, prefer calling tools from within `web/` so relative paths and Vite/Vitest configuration resolve correctly.

## High-level architecture

### Application shell and routing

- Entry point: `web/src/main.tsx` creates a `QueryClient`, installs the offline queue listener, and renders the app into `#root` with:
  - `QueryClientProvider` from `@tanstack/react-query` for data fetching and caching.
  - `BrowserRouter` from `react-router-dom` for client-side routing.
  - `AuthProvider` (`components/AuthProvider`) for local-auth state and user context.
- `web/src/App.tsx` defines the top-level layout:
  - Persistent `Navbar`, `ConnectionBanner`, `Sidebar`, `AccountOverlay`, and `InstallPrompt` (on the `/` route).
  - Route transitions via `Routes`/`Route` and `lazy`-loaded page components to keep the initial bundle small.
  - Simple fade-in animation for route content.

### State, persistence, and domain utilities (`web/src/lib`)

- `auth.ts`:
  - Implements a **device-local auth model** using `localStorage`.
  - Passwords are hashed with `crypto.subtle.digest` and combined with a per-email salt.
  - User profiles are encrypted and decrypted via helpers in `crypto.ts`, with only encrypted blobs stored.
  - Exposes `signUp`, `signIn`, `signOut`, `getCurrentUser`, `updateProfile`, and settings helpers.
- `orders.ts`:
  - Models order types and statuses and persists orders in `localStorage` under a single key.
  - Provides helpers for loading/saving orders and generating stable, readable order IDs.
- `products.ts`:
  - Fetches product data from the static `public/products.json` file.
  - Delegates caching behavior to the service worker (static asset caching), keeping the client logic simple.
- `indexeddb.ts`:
  - Tiny IndexedDB wrapper that exposes `openDB`, `dbPut`, and `dbGet` around a `kv` object store.
  - Used for key–value style persistence that’s more robust than `localStorage` when needed.
- `offlineQueue.ts`:
  - Implements a simple **offline request queue** persisted in `localStorage`.
  - `enqueue` stores pending requests; `flushOnReconnect` attempts to send them when online; `installQueueListener` hooks into the `online` event to automatically flush.
- `supabase.ts`:
  - Stubbed `getSupabase` that intentionally avoids exposing any keys in the client.
  - Signals that sensitive Supabase operations should be handled via server-side / Edge Functions instead.

### UI components and UX patterns

- `Navbar.tsx`:
  - Uses `react-router-dom` for navigation and derives a **seasonal theme** (Christmas, New Year, Valentine’s, Halloween) based on the current date for subtle branding variations.
  - Listens to `localStorage` and a custom `cart-updated` event to maintain a live cart item count badge.
  - Integrates with `AuthProvider` to show the user’s display name or email inline.
- `InstallPrompt.tsx`:
  - Listens for the browser’s `beforeinstallprompt` event to implement a custom PWA install banner.
  - Stores the deferred prompt and presents an inline install UI when appropriate.
- Other components (`Sidebar`, `AccountOverlay`, `ConnectionBanner`, `LoadingScreen`) cooperate to provide an app-shell UX suitable for mobile and desktop PWA use.

### Testing strategy

- Testing stack:
  - **Runner**: Vitest (see `devDependencies` in `web/package.json`).
  - **DOM environment**: jsdom.
  - **Helpers**: `@testing-library/react` and `@testing-library/jest-dom`.
- Test setup:
  - `web/src/__tests__/test-utils.tsx` exports a custom `render` that wraps components with `QueryClientProvider` and `BrowserRouter`, mirroring the runtime setup in `main.tsx`.
  - For component/page tests, import from `./test-utils` and use its `render` function instead of the raw Testing Library render.
- Test organization:
  - All tests live under `web/src/__tests__/` (e.g., `Cart.test.tsx`, `Favorites.test.tsx`, `Navbar.test.tsx`, `installPrompt.test.tsx`, `productDetails.test.tsx`, `smoke.test.tsx`).

## PWA and offline behavior

- Service worker and manifest:
  - `web/public/manifest.json` and associated icons define installable app metadata.
  - `web/public/sw.js` is expected to handle static asset caching (`products.json`, HTML shell, CSS/JS) and possibly offline fallbacks (`offline.html`).
- Install experience:
  - `InstallPrompt` coordinates with the browser’s install events to present an in-app install banner.
- Offline data & queueing:
  - `offlineQueue.ts` works with the `online` event; network calls that should be retried later can be routed through `enqueue` in new code.
  - `indexeddb.ts` and `orders.ts` provide persistence for user-specific data (orders, other key–value data) so that the app remains functional without constant connectivity.

## Security and backend notes

- `web/security/supabase-policies.sql` describes **row-level security policies** intended for a Supabase backend:
  - Users: can view and update only their own rows.
  - Orders, favorites, cart items, and digital wallet tables: users can view or manipulate only rows tied to their own `user_id`.
- Frontend `supabase.ts` is intentionally not wired up with a Supabase client to avoid leaking keys; treat this file as a placeholder when adding secure backend integrations.

## Deployment

- When automating deployment steps that push this code to GitHub, use the repository `https://github.com/Cooly-Vbz/speech-browser.git` unless project-specific instructions override this in the future.
