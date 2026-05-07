---
Task ID: 5
Agent: full-stack-developer (New Features)
Task: Add product image gallery, delivery badges, FAQ section, enhance recently viewed

Work Log:
- Read worklog.md and all existing component files (product-detail.tsx, product-card.tsx, recently-viewed-section.tsx)
- Feature 1: Enhanced product image gallery in product-detail.tsx
  - Added AnimatePresence with fade/scale transitions when switching between main images (key={activeImage})
  - Enhanced thumbnails with motion.button (whileHover scale, whileTap scale)
  - Added opacity dimming on inactive thumbnails (opacity-70 hover:opacity-100)
  - Added animated bottom indicator line on active thumbnail using layoutId="thumbnail-indicator"
  - Added custom-scrollbar class and shadow-md on active thumbnail border
- Feature 2a: Added delivery estimate badge to product cards
  - Added Truck icon import from lucide-react
  - Created getDeliveryDate() utility function calculating midpoint of 5-7 business days
  - Added small delivery line below stock indicator: "🚚 Free delivery by [Date]" with cyan accent
  - Only shows for in-stock items
- Feature 2b: Enhanced delivery info section on product detail page
  - Replaced simple delivery line with rich delivery info card (rounded-xl, border, overflow-hidden)
  - Standard Delivery section with FREE badge and date range
  - Free Shipping Threshold row showing $150 minimum with qualification status
  - Express Shipping row with $9.99 badge and 2-3 business day estimate
  - Separator lines between sections (mx-4 h-px bg-neutral-800/60)
  - CheckCircle2 and Zap icons for visual hierarchy
- Feature 3: Added "Customers Ask" FAQ section below product reviews
  - Created getProductFAQs() function generating category/brand-specific questions
  - Hardware wallet FAQs: crypto compatibility, warranty, setup, online safety, lost device, multi-device
  - Seed storage FAQs: what is seed backup, setup, fire/water proof, word capacity, vs hardware wallet
  - Accessory FAQs: compatibility, warranty, package contents
  - Generic FAQs for all: return policy, shipping times
  - Created ProductFAQ component with Accordion (type="multiple" for multiple open items)
  - Styled with cyan/teal theme: cyan-500/60 HelpCircle icons, hover:text-cyan-400, bg-cyan-500/10 header
  - Added MessageCircleQuestion and HelpCircle icon imports
  - Positioned after ProductReviews component
- Feature 4: Enhanced recently viewed section
  - Rewrote recently-viewed-section.tsx with major improvements
  - Added cart integration (useCartStore, useNotificationStore)
  - Added "Add to Cart" quick action button on each card (full-width, cyan outline style)
  - Added "Clear" button with Trash2 icon in header
  - Added scroll position tracking (canScrollLeft/canScrollRight state)
  - Arrow buttons change style based on scroll availability (cyan when active, neutral when disabled)
  - Added left/right fade gradients at scroll edges
  - Increased card width from w-52 to w-60 for better appearance
  - Added rating badge on product image (★ with amber color)
  - Added stock field to Product interface
  - Better cursor-pointer on clickable areas
- All lint checks passed with zero errors
- Dev server running correctly with no errors

Stage Summary:
- Image Gallery: AnimatePresence fade/scale transitions, enhanced thumbnails with layoutId indicator, opacity states
- Product Cards: Delivery estimate badge ("Free delivery by [Date]") with Truck icon, business day calculation
- Product Detail Delivery: Rich delivery card with standard/free threshold/express shipping sections, qualification status
- FAQ Section: Category-aware FAQ generation (hardware wallet/seed storage/accessory), Accordion with cyan theme
- Recently Viewed: Add to Cart button, Clear All, scroll position tracking, fade gradients, rating badges, wider cards
