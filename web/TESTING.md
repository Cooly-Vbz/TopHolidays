# Testing Guide

## Test Setup

The project uses Vitest with React Testing Library for component testing. Tests are located in `src/__tests__/`.

## Known Issues

There is a compatibility issue between rolldown-vite (used in this project) and default exports in the test environment. The test files have been created but may need adjustments to work with rolldown-vite's module system.

## Test Files Created

1. **Home.test.tsx** - Tests for the home page including:
   - Welcome message display
   - Holiday message functionality
   - Navigation links

2. **Products.test.tsx** - Tests for the products page including:
   - Loading states
   - Product display
   - Add to cart functionality
   - Favorite toggling
   - Error handling

3. **Cart.test.tsx** - Tests for the cart page including:
   - Empty cart state
   - Item display
   - Quantity management
   - Price calculations (subtotal, shipping, tax, total)
   - Item removal
   - Cart clearing

4. **Favorites.test.tsx** - Tests for the favorites page including:
   - Empty state
   - Favorite product display
   - Remove functionality
   - Move to cart functionality

5. **Navbar.test.tsx** - Tests for the navbar including:
   - Brand display
   - Cart count badge
   - Navigation functionality
   - Menu and account button handlers

6. **ProductDetails.test.tsx** - Tests for product details page including:
   - Product display
   - Add to cart
   - Favorite toggling
   - Product information display

## Running Tests

```bash
npm test
```

## Fixing the Module Export Issue

To fix the default export issue with rolldown-vite, you can:

1. Add named exports alongside default exports in component files
2. Update test imports to use named exports
3. Or configure vitest to use a different transformer for test files

Example fix:
```typescript
// In component file
export function Home() { ... }
export default Home

// In test file
import { Home } from '../pages/Home'
```

## Test Coverage

The tests cover:
- ✅ Component rendering
- ✅ User interactions (clicks, form inputs)
- ✅ State management (localStorage)
- ✅ Event handling (custom events)
- ✅ Navigation
- ✅ Calculations (cart totals)
- ✅ Error states
- ✅ Loading states


