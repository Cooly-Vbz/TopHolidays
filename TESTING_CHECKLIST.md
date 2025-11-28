# Top Holidays - Comprehensive Testing Checklist

## Test Environment Setup
- [ ] Dev server running at `http://localhost:5173`
- [ ] Browser DevTools open (F12)
- [ ] Test on multiple browsers (Chrome, Firefox, Edge, Safari)
- [ ] Test on multiple devices (Desktop, Tablet, Mobile)

---

## 1. Theme Switching Tests

### Light/Dark Mode Toggle
- [ ] Open sidebar (click ☰ menu button)
- [ ] Click theme toggle button
- [ ] **Verify:** Navbar background changes (white → dark slate)
- [ ] **Verify:** Navbar text changes (dark → light)
- [ ] **Verify:** Sidebar background adapts to theme
- [ ] **Verify:** Account overlay adapts to theme
- [ ] **Verify:** Connection banner adapts to theme
- [ ] **Verify:** All buttons and inputs have proper contrast
- [ ] **Verify:** Theme persists after page reload
- [ ] **Verify:** Theme persists across navigation

### Theme Consistency
- [ ] Navigate to Products page - verify theme applies
- [ ] Navigate to Cart page - verify theme applies
- [ ] Navigate to Favorites page - verify theme applies
- [ ] Navigate to Orders page - verify theme applies
- [ ] Open Account overlay - verify theme applies
- [ ] Check EULA page - verify theme applies
- [ ] Check Privacy Policy page - verify theme applies

---

## 2. Sidebar Tests

### Title Positioning
- [ ] Open sidebar
- [ ] **Verify:** "TOP HOLIDAYS" title is in technological font (Orbitron)
- [ ] **Verify:** Title is positioned at same height as navbar title (64px)
- [ ] **Verify:** Title stays on one line at all screen sizes
- [ ] **Verify:** Title doesn't overflow or get cut off
- [ ] **Verify:** Title has proper glow effect in dark mode

### Digital Coins Display
- [ ] **Verify:** Coin explanation is concise and visual
- [ ] **Verify:** Coins and Cash displayed in separate boxes
- [ ] **Verify:** Explanation text is readable
- [ ] **Verify:** Icon (💰) is visible
- [ ] **Verify:** Promoted items explanation is clear

### Scrollable Content
- [ ] Resize browser to short height (< 600px)
- [ ] **Verify:** Sidebar content is scrollable
- [ ] **Verify:** Title header stays fixed at top
- [ ] **Verify:** Footer (EULA/Privacy) stays fixed at bottom
- [ ] **Verify:** Middle content scrolls smoothly
- [ ] **Verify:** Scroll works on touch devices

### Navigation Links
- [ ] Click "Browse Products" - **Verify:** navigates and sidebar closes
- [ ] Click "See the Cart" - **Verify:** navigates and sidebar closes
- [ ] Click "Your Favorites" - **Verify:** navigates and sidebar closes
- [ ] Click "All Orders" - **Verify:** navigates and sidebar closes
- [ ] Click "Customer Care" - **Verify:** navigates and sidebar closes
- [ ] Click "About Us" - **Verify:** navigates and sidebar closes

### Footer Links
- [ ] Click "EULA" - **Verify:** navigates to EULA page
- [ ] Click "Privacy Policy" - **Verify:** navigates to Privacy page
- [ ] **Verify:** Footer is always visible (not scrolled off)

---

## 3. Responsive Design Tests

### Mobile (320px - 767px)
- [ ] Resize to 375px width (iPhone SE)
- [ ] **Verify:** Navbar title readable and doesn't overflow
- [ ] **Verify:** Sidebar title readable and doesn't overflow
- [ ] **Verify:** All buttons are tappable (min 44px)
- [ ] **Verify:** Text doesn't overflow containers
- [ ] **Verify:** Product cards stack vertically
- [ ] **Verify:** Forms are usable
- [ ] **Verify:** Modals fit on screen

### Tablet (768px - 1023px)
- [ ] Resize to 768px width (iPad)
- [ ] **Verify:** Layout adapts appropriately
- [ ] **Verify:** Sidebar width is appropriate
- [ ] **Verify:** Product grid shows 2-3 columns
- [ ] **Verify:** All interactive elements accessible

### Desktop (1024px+)
- [ ] Resize to 1440px width
- [ ] **Verify:** Content is centered and readable
- [ ] **Verify:** Sidebar max-width is respected (320px)
- [ ] **Verify:** Product grid shows 3-4 columns
- [ ] **Verify:** No excessive whitespace

### Font Consistency
- [ ] Test on Chrome - **Verify:** fonts render consistently
- [ ] Test on Firefox - **Verify:** fonts render consistently
- [ ] Test on Edge - **Verify:** fonts render consistently
- [ ] Test on Safari (if available) - **Verify:** fonts render consistently
- [ ] **Verify:** Navbar cursive font (Pacifico) loads
- [ ] **Verify:** Sidebar tech font (Orbitron) loads
- [ ] **Verify:** Font sizes scale appropriately

---

## 4. Product Browsing Flow

### Homepage
- [ ] Load homepage
- [ ] **Verify:** Product cards display correctly
- [ ] **Verify:** Images load properly
- [ ] **Verify:** Prices are visible
- [ ] **Verify:** "View Details" buttons work

### Product Details
- [ ] Click on a product
- [ ] **Verify:** Product details page loads
- [ ] **Verify:** Product image displays
- [ ] **Verify:** Product name, price, description visible
- [ ] **Verify:** "Add to Cart" button works
- [ ] **Verify:** "Add to Favorites" button works
- [ ] **Verify:** Quantity selector works

---

## 5. Cart Management Flow

### Adding to Cart
- [ ] Add product from homepage
- [ ] **Verify:** Cart count badge updates
- [ ] **Verify:** Success feedback shown
- [ ] Add product from details page
- [ ] **Verify:** Cart count increments

### Cart Page
- [ ] Navigate to cart
- [ ] **Verify:** All cart items display
- [ ] **Verify:** Quantities are correct
- [ ] **Verify:** Prices are correct
- [ ] **Verify:** Subtotal calculates correctly
- [ ] **Verify:** Increase quantity button works
- [ ] **Verify:** Decrease quantity button works
- [ ] **Verify:** Remove item button works
- [ ] **Verify:** "Proceed to Checkout" button visible

### Empty Cart
- [ ] Remove all items
- [ ] **Verify:** Empty cart message displays
- [ ] **Verify:** Cart count badge disappears or shows 0

---

## 6. Favorites Flow

### Adding Favorites
- [ ] Click heart icon on product
- [ ] **Verify:** Heart fills/changes color
- [ ] **Verify:** Product added to favorites

### Favorites Page
- [ ] Navigate to Favorites
- [ ] **Verify:** All favorited products display
- [ ] **Verify:** Remove button works
- [ ] **Verify:** "Add to Cart" from favorites works
- [ ] **Verify:** Empty favorites message (if no favorites)

---

## 7. Account Management

### Account Overlay
- [ ] Click account icon
- [ ] **Verify:** Overlay opens
- [ ] **Verify:** Sign in form displays (if not logged in)
- [ ] **Verify:** Profile tab displays (if logged in)

### Sign In/Sign Up
- [ ] Test sign in form
- [ ] **Verify:** Email validation works
- [ ] **Verify:** Password validation works
- [ ] **Verify:** Error messages display
- [ ] Switch to sign up mode
- [ ] **Verify:** Display name field appears
- [ ] **Verify:** Form submission works

### Profile Management
- [ ] Update display name
- [ ] **Verify:** Changes save
- [ ] **Verify:** Success message displays
- [ ] Test sign out
- [ ] **Verify:** Returns to guest state

### Settings Tabs
- [ ] Click Security tab - **Verify:** 2FA toggle works
- [ ] Click Payment Methods tab - **Verify:** can add/remove cards
- [ ] Click Addresses tab - **Verify:** can add/remove addresses
- [ ] Click Privacy tab - **Verify:** preferences toggles work

---

## 8. Legal Pages

### EULA Page
- [ ] Navigate to EULA
- [ ] **Verify:** All sections display correctly
- [ ] **Verify:** Content is readable
- [ ] **Verify:** Theme applies correctly
- [ ] **Verify:** Scrollable on short screens
- [ ] **Verify:** Date displays correctly
- [ ] **Verify:** All 12 sections present

### Privacy Policy Page
- [ ] Navigate to Privacy Policy
- [ ] **Verify:** All sections display correctly
- [ ] **Verify:** Content is readable
- [ ] **Verify:** Theme applies correctly
- [ ] **Verify:** Scrollable on short screens
- [ ] **Verify:** Date displays correctly
- [ ] **Verify:** All 12 sections present
- [ ] **Verify:** Data protection info is clear

---

## 9. Navigation Tests

### Navbar
- [ ] Click logo - **Verify:** navigates to homepage
- [ ] Click menu button - **Verify:** opens sidebar
- [ ] Click cart button - **Verify:** navigates to cart
- [ ] Click account button - **Verify:** opens account overlay

### Sidebar Navigation
- [ ] Test all navigation links
- [ ] **Verify:** Each link navigates correctly
- [ ] **Verify:** Sidebar closes after clicking link
- [ ] **Verify:** Active route is highlighted (if implemented)

### Browser Navigation
- [ ] Use browser back button
- [ ] **Verify:** Navigation history works
- [ ] Use browser forward button
- [ ] **Verify:** Forward navigation works

---

## 10. Offline/PWA Tests

### Service Worker
- [ ] Check DevTools → Application → Service Workers
- [ ] **Verify:** Service worker registered
- [ ] **Verify:** Service worker activated

### Offline Mode
- [ ] Open DevTools → Network
- [ ] Set to "Offline"
- [ ] **Verify:** Connection banner appears
- [ ] **Verify:** Cached pages still load
- [ ] Set back to "Online"
- [ ] **Verify:** Connection banner disappears

### PWA Installation
- [ ] Look for install prompt/button
- [ ] **Verify:** Install button appears (if supported)
- [ ] Click install
- [ ] **Verify:** App installs successfully
- [ ] **Verify:** App opens in standalone mode

---

## 11. Performance Tests

### Load Time
- [ ] Clear cache
- [ ] Reload page
- [ ] **Verify:** Page loads in < 3 seconds
- [ ] **Verify:** Images lazy load

### Interactions
- [ ] Click buttons
- [ ] **Verify:** Responses are immediate
- [ ] Open/close sidebar
- [ ] **Verify:** Animations are smooth (60fps)
- [ ] Switch themes
- [ ] **Verify:** Transition is smooth

---

## 12. Accessibility Tests

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] **Verify:** Focus indicators visible
- [ ] **Verify:** Tab order is logical
- [ ] Press Enter on buttons
- [ ] **Verify:** Buttons activate
- [ ] Press Escape on modals
- [ ] **Verify:** Modals close

### Screen Reader
- [ ] Use screen reader (if available)
- [ ] **Verify:** ARIA labels present
- [ ] **Verify:** Content is announced correctly
- [ ] **Verify:** Navigation is clear

### Color Contrast
- [ ] Check light mode contrast
- [ ] **Verify:** Text readable (WCAG AA minimum)
- [ ] Check dark mode contrast
- [ ] **Verify:** Text readable (WCAG AA minimum)

---

## 13. Error Handling

### Network Errors
- [ ] Simulate slow network
- [ ] **Verify:** Loading states display
- [ ] **Verify:** Error messages are helpful

### Form Validation
- [ ] Submit empty forms
- [ ] **Verify:** Validation messages display
- [ ] Enter invalid data
- [ ] **Verify:** Specific error messages show

---

## 14. Cross-Browser Tests

### Chrome
- [ ] Run all critical flows
- [ ] **Verify:** Everything works

### Firefox
- [ ] Run all critical flows
- [ ] **Verify:** Everything works

### Edge
- [ ] Run all critical flows
- [ ] **Verify:** Everything works

### Safari (if available)
- [ ] Run all critical flows
- [ ] **Verify:** Everything works

---

## Test Results Summary

**Date:** _______________
**Tester:** _______________
**Browser:** _______________
**Device:** _______________

**Total Tests:** _____ / _____
**Passed:** _____
**Failed:** _____
**Blocked:** _____

### Critical Issues Found:
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

### Notes:
_____________________________________________________
_____________________________________________________
_____________________________________________________

---

## Sign-Off

**Tested By:** _______________
**Date:** _______________
**Signature:** _______________

**Approved By:** _______________
**Date:** _______________
**Signature:** _______________
