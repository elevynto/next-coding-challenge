# Michael's Amazing Web Store Improved

### View deployment here

[https://next-coding-challenge-green.vercel.app](https://next-coding-challenge-green.vercel.app/)

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
- Full-viewport-height layout — the page fills the screen on all content lengths, avoiding a blank gap below short product lists
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
- 50 tests covering key user journeys, locale variants, quantity controls, and async product loading states

### CI/CD & deployment
- GitHub Actions workflow triggers on every push to `main` — installs dependencies, runs the full test suite, and blocks the deploy if any test fails
- Automated deployment to Vercel on a successful test run, keeping the live site always in sync with `main`
- Node.js 20 with npm caching for fast CI runs

### Git workflow
- Husky git hooks enforce quality gates locally before a commit lands: the full test suite must pass (`pre-commit`) and the commit message must follow Conventional Commits format (`commit-msg`)
- commitlint with `@commitlint/config-conventional` ensures a clean, machine-readable commit history (e.g. `feat:`, `fix:`, `chore:`)

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

### Engineering & tooling
- **lint-staged** — scope the pre-commit hook to only lint and test files staged for the current commit, making local commits significantly faster on large codebases
- **Code coverage thresholds** — add `--coverage` to the Jest script and enforce a minimum threshold (e.g. 80%) in CI so coverage regressions fail the build automatically
- **Type-checking in CI** — add a dedicated `tsc --noEmit` step so TypeScript errors are surfaced independently of the build, with clearer error output
- **CI on pull requests** — the current workflow only triggers on pushes to `main`; adding a `pull_request` trigger would catch failures before merge rather than after
- **Prettier** — enforced, auto-formatted code style would eliminate formatting debates in code review and keep diffs focused on logic changes
- **End-to-end tests** — Playwright or Cypress for testing full user journeys (add to basket → checkout → confirm) in a real browser, complementing the unit/integration tests already in place
- **Lighthouse CI** — automated performance, accessibility, and SEO scoring on every deploy to catch regressions introduced by new features
- **Dependabot** — automated pull requests for dependency updates, keeping security patches applied without manual effort
- **Bundle analysis** — `@next/bundle-analyzer` to track and visualise client-side JS weight over time
- **React Error Boundaries** — wrap the product grid and checkout sections in error boundaries so a rendering failure in one subtree doesn't crash the whole page (complements the existing `ProductsError` component, which only handles the API layer)
- **Security headers** — add a `headers()` block in `next.config.js` to set `Content-Security-Policy`, `X-Frame-Options`, and `Strict-Transport-Security`; currently the app ships with no HTTP security headers

### Analytics & observability

- **Vercel Analytics** (`@vercel/analytics`) — drop-in `<Analytics />` component added to the root layout; tracks page views and unique visitors with zero configuration and no cookie consent requirement for basic metrics
- **Vercel Speed Insights** (`@vercel/speed-insights`) — companion package that collects real-user Core Web Vitals (LCP, CLS, FID) broken down per route, surfaced directly in the Vercel dashboard
- **Custom conversion events** — instrument key funnel actions (add to basket, begin checkout, remove item) with `track()` calls so drop-off rates can be measured and optimised over time
- **Error monitoring** — integrate Sentry (or Vercel's built-in error tracking) to capture unhandled exceptions and failed API calls in production; the current setup has no runtime visibility into errors
- **Session recording / heatmaps** — tools like Microsoft Clarity (free) or Hotjar to understand how users navigate the product grid and where they abandon the checkout flow

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
- Have a delete button for each item

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
- `robots.txt` / `sitemap.xml` — Next.js 13 supports these as special files natively; currently absent, which limits search engine crawling and indexing
- **PWA manifest** — a `manifest.json` so the store can be saved to the home screen on mobile with an app icon and a splash screen, giving it an app-like feel without a separate native build

### Backend Improvements
- The `more-products` endpoint returns some of the same products as the other endpoint. The presumption was made that usually these would be different sets of products. (The only reason I bring this up is because the Qty value/controls that have been built will show up on the other duplicate product when you click on one of them which looks odd. A backend change would be required to fix this)
