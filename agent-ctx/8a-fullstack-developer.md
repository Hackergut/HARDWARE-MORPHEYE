# Task 8a - Mini Cart Dropdown + Theme Toggle

## Summary
Added mini cart dropdown/popover and dark/light theme toggle to the Morpheye e-commerce project.

## Files Created
1. `/src/components/store/mini-cart.tsx` - Full popover dropdown with:
   - Cart items list (image thumbnail, name, price, quantity +/- controls, remove button)
   - Cart subtotal display with free shipping indicator ($150 threshold)
   - "View Cart" and "Checkout" buttons
   - Empty state with "Your cart is empty" message and "Browse Shop" CTA
   - Max height with scroll for many items (max-h-72)
   - Smooth Framer Motion animations (slide down, scale, fade, layout)
   - Dark/light theme responsive styling

2. `/src/components/store/theme-toggle.tsx` - Sun/Moon toggle with:
   - useTheme() from next-themes
   - Smooth icon transition animation (rotate ±90° + scale)
   - Mounted state guard for hydration safety

## Files Updated
3. `/src/app/globals.css` - Split `:root` (light) and `.dark` (dark) CSS variables
4. `/src/app/layout.tsx` - ThemeProvider with attribute="class" defaultTheme="dark"
5. `/src/components/store/store-header.tsx` - Popover cart + theme toggle + dual-theme styling
6. `/src/app/page.tsx` - bg-background/text-foreground wrappers
7. `/src/components/store/product-card.tsx` - Dual-theme bg, borders, text
8. `/src/components/store/shop-page.tsx` - Dual-theme bg, text, category pills

## Verification
- ESLint: 0 errors
- Dev server: GET / 200, all API endpoints responding
- Both dark (default) and light themes functional
