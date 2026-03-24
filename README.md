# Michael's Amazing Web Store Improved

### View Deployment here



---

## What was improved

### Cart & product interactions
- Fixed broken cart logic — adding the same item now increments quantity rather than doing nothing
- Basket counter shows unique item types, not total add-clicks
- Per-card quantity display so users can see what they've already added at a glance
- Quantity stepper controls (`−` / `+`) on product cards and checkout items — decrementing to zero removes the item entirely
- Once a product is in the basket the card becomes non-interactive; only the stepper buttons are clickable

### UI & accessibility
- Full responsive layout — single column on mobile, two columns on tablet, four on desktop
- Professional card design with clear visual hierarchy, colour contrast meeting WCAG AA, and ecommerce-standard CTAs
- Every interactive element has a descriptive `aria-label` naming the specific product and action (e.g. "Add Wireless Headphones to basket")
- Semantic HTML throughout — landmarks, headings, and correct button roles
- Dark mode support across all components
- No horizontal scroll at any viewport width

### Data & performance
- Products fetched server-side — no loading spinners on first paint, content is immediately indexable
- A second batch of products streams in progressively without blocking the initial load
- SWR client-side caching with a 15-minute deduplication window — navigating back to the store is instant
- Skeleton placeholders shown while the secondary product batch loads
- Graceful error states for failed API calls — the page never crashes

### Checkout
- Checkout page at `/checkout` (UK) and `/us/checkout` (US) listing all basket items with quantities and per-item prices
- Running total shown in the correct locale currency
- Quantity steppers on checkout items mirror the behaviour on the store page
- Empty basket state with a link back to the shop

### Multi-region & localisation
- Dynamic `/[locale]` routing — `/us` serves USD pricing and US copy ("Cart" not "Basket")
- All prices formatted with `Intl.NumberFormat` for correct locale-specific symbol placement
- New regions can be added with a single config entry

### Code quality
- Replaced hardcoded product blocks with a live API and `array.map`
- Extracted reusable components, a shared `formatPrice` utility, and a centralised locale config
- Consistent `@/` import alias used throughout
- 27 tests covering key user journeys, locale variants, quantity controls, and async product loading states

### Architecture

Next.js 13 App Router with TypeScript. All source lives under `src/`.

- **`src/app/`** — pages and layouts (App Router)
- **`src/app/components/`** — shared UI components (`StorePage`, `CheckoutPage`, `ProductsError`)
- **`src/app/context/`** — cart state via React Context
- **`src/lib/`** — shared utilities (`api.ts`, `locales.ts`, `formatPrice.ts`)
- **`src/types.ts`** — TypeScript interfaces for API contracts

The UK store is served at `/` and `/checkout`. The US store is served at `/us` and `/us/checkout` via a dynamic `[locale]` route segment. Adding a new region requires a single entry in `src/lib/locales.ts`.

Cart state is managed client-side with React Context. Products are fetched server-side for the initial render, then kept fresh client-side via SWR.

---

## Further improvements

### Product discovery
- Product detail page — clicking a card should navigate to `/products/[id]` with full description, images, and variant options
- Search bar on the store page to find products by name
- Category filtering and sort options (price, popularity, newest)
- "You might also like" / related products section for cross-selling

### Product cards
- Product images — cards are currently text-only
- Stock level indicator ("Only 3 left") — the API already returns a `stock` field but it is not displayed
- "Out of stock" / "Low stock" badge with the add button disabled when stock is zero
- Text truncation with a tooltip for long product names to prevent layout breaks

### Checkout & payments
- Connect the Checkout button to a real payment flow — it currently does nothing
- Shipping address form and delivery options (standard / express) before payment
- Promo / discount code input
- Order confirmation / thank-you page after a successful purchase
- Trust signals — secure payment icons and a returns policy summary near the checkout button

### Cart & retention
- Persist the cart to `localStorage` so it survives a page refresh or accidental tab close
- Wishlist / save for later so users can bookmark items without adding them to the basket
- Recently viewed products section

### Stock & freshness
- Reduce the SWR deduplication interval from 15 minutes for stores where stock levels change frequently
- Optimistic UI updates so quantity changes feel instant even on slow connections

### Accounts & order history
- User accounts — sign in, saved addresses, and past order history
- Email order confirmation after purchase

### SEO & compliance
- Per-product meta tags and Open Graph images so product links share well on social media
- Structured data (schema.org `Product` markup) for rich results in search engines
- Cookie consent banner for GDPR / CCPA compliance
