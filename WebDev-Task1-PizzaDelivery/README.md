<div align="center">

# PizzaCraft

A production-grade pizza delivery platform built with React, Express, and MongoDB.

</div>

---

## Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| React 18 | Component-based UI library |
| Vite 5 | Build tool and dev server |
| Tailwind CSS 3 | Utility-first styling with design tokens |
| Framer Motion 11 | Animation and page transitions |
| Redux Toolkit | State management |
| React Router 6 | Client-side routing |
| Axios | HTTP client |
| React Hot Toast | Toast notifications |
| React Hook Form | Form state management |
| Zod | Client-side runtime validation |

### Backend

| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime |
| Express 4 | HTTP framework |
| Mongoose 8 | MongoDB ODM |
| Socket.io 4 | Real-time communication |
| Zod | Runtime type validation |
| Winston | Structured logging |
| Helmet | Security headers |
| express-rate-limit | Rate limiting |
| multer | File upload (avatar) |

---

## Project Structure

```
pizza-delivery/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/          # AuthLayout, ProtectedRoute
│   │   │   ├── builder/       # Pizza Builder (5-step wizard, preview, toppings)
│   │   │   ├── cart/          # CartDrawer, CartItem, CartEmpty
│   │   │   ├── checkout/      # AddressSelector, OrderSummary, CouponInput
│   │   │   ├── layout/        # Navbar, Footer, Layout
│   │   │   ├── pizza/         # PizzaCard, PizzaDetailModal, PizzaImage
│   │   │   └── ui/            # Design system components + ErrorBoundary
│   │   ├── data/              # images.js, pizzaBuilder.js
│   │   ├── hooks/             # useDarkMode, useMediaQuery, useScrollPosition, useDebounce
│   │   ├── pages/             # Home, Menu, Cart, Checkout, PizzaBuilder, Profile, Auth
│   │   ├── services/          # API client, auth, pizza, cart
│   │   ├── store/slices/      # auth, ui, pizza, builder, profile, cart
│   │   └── utils/             # helpers.js, constants.js
│   └── index.html
├── server/                    # Express backend
│   ├── src/
│   │   ├── config/            # database.js, env.js
│   │   ├── controllers/       # auth, pizza, profile, cart
│   │   ├── middleware/        # auth, errorHandler, upload, validate
│   │   ├── models/            # User, Pizza, Cart
│   │   ├── routes/v1/         # auth, pizza, profile, cart, health
│   │   ├── services/          # authService, emailService
│   │   ├── templates/email/   # HTML email templates
│   │   ├── utils/             # logger.js
│   │   └── validations/       # auth, pizza, cart
│   └── server.js
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- MongoDB 6.0+ (local or Atlas)
- npm 9.0+

### Installation

```bash
# Clone the repository
git clone https://github.com/AbdullahShahid156/OIBSIP.git
cd OIBSIP/WebDev-Task1-PizzaDelivery

# Install all dependencies
npm run install:all

# Configure environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Edit `server/.env` with your MongoDB URI and JWT secret.

### Development

```bash
# Start both servers
npm run dev

# Client: http://localhost:3000
# Server: http://localhost:5000
```

---

## Features

### Current (Phase 9 — Complete)

**Cart & Checkout Foundation**

| Feature | Description |
|---------|-------------|
| Cart Slice | Redux Toolkit slice with localStorage persistence, summary calculations |
| Cart Drawer | Premium slide-in drawer with backdrop blur, scrollable items, sticky checkout |
| Cart Page | Dedicated page with cart items, order summary, free delivery progress |
| Cart Item | Customized pizza item with image, customization tags, quantity controls |
| Cart Empty | Animated empty state with bouncing cart illustration and CTA |
| Add to Cart | Builder integrates with cart — creates fully customized pizza entries |
| Quantity Controls | Per-item −/+ with animated number transitions, min 1, max 10 |
| Cart Persistence | localStorage saves/restores cart across sessions |
| Free Delivery Progress | Animated progress bar toward $35 free delivery threshold |
| Checkout Page | Multi-section checkout with address, coupon, notes, payment placeholder |
| Address Selector | Select from saved profile addresses, add new, edit existing |
| Order Summary | Dynamic price breakdown: subtotal, delivery fee, tax, discount, grand total |
| Coupon Input | UI with apply/remove, success/error states, validation placeholder |
| Payment Placeholder | Ready for Razorpay integration in Phase 10 |
| Backend Cart API | Full CRUD with configuration dedup, price validation, coupon support |

**Pizza Discovery Dashboard (Phase 5)**

| Feature | Description |
|---------|-------------|
| Pizza Model | Name, description, category, price, rating, prep time, tags, availability, featured/popular flags |
| GET /pizzas | List all pizzas with search, category filter, sort, pagination |
| GET /pizzas/:id | Single pizza details |
| GET /pizzas/categories | Categories with counts |
| Pizza Cards | Image, name, description, price, rating stars, prep time, category badge, hover animation |
| Quick View Modal | Full pizza details with tags, rating, description, CTA |
| Search | Debounced real-time search across names, descriptions, tags |
| Category Filters | Horizontal filter chips with counts |
| Sorting | Top Rated, Most Popular, Price, Newest, A to Z |
| Pagination | Page navigation with current page indicator |
| Loading Skeletons | Shimmer loading states for cards |
| Empty States | No results, no pizzas, clear filters |
| Error States | Dismissible error banner with retry |
| Featured Section | Curated featured pizzas on dashboard |
| Quick Start CTA | Promotional banner with build pizza CTA |
| Welcome Header | Personalized greeting for authenticated users |

**Pizza Data (15 seeded)**

| Category | Pizzas |
|----------|--------|
| Classic | Margherita, Pepperoni Supreme, Hawaiian Classic |
| Premium | Truffle Mushroom, Prosciutto & Arugula, Four Cheese |
| Vegetarian | Garden Fresh, Mediterranean, Veggie Deluxe |
| Specialty | Spicy Diavola, BBQ Chicken, Pesto Chicken, Buffalo Blaze |
| Meat-Lovers | Meat Feast |
| Signature | The Artisan |

**Authentication (Phase 4)**

| Feature | Description |
|---------|-------------|
| Registration | Name, email, password with Zod validation and strength requirements |
| Email Verification | HTML email with branded verification link (Nodemailer + Gmail SMTP) |
| Login | Email/password with JWT access token + HTTP-only refresh token cookie |
| Forgot Password | Rate-limited email with reset link (3 requests/hour) |
| Reset Password | Token-validated password update |
| Protected Routes | Client-side (ProtectedRoute) and server-side (auth middleware) |
| Logout | Token invalidation and cookie clearing |

**Security**

- bcrypt password hashing (12 rounds)
- JWT access tokens with configurable expiry
- HTTP-only refresh token cookies (30 day expiry)
- Rate limiting on auth endpoints (10 req/15min, 3 resets/hour)
- Zod input validation on all endpoints
- Helmet security headers
- CORS with credentials
- Password strength requirements (uppercase, lowercase, number)

**Premium UI**

- AuthLayout with split-screen design
- Password visibility toggle
- Password strength indicator
- Animated form transitions
- Loading states with spinners
- Error/success toasts
- Responsive across all devices

### Previous Phases

**Premium Landing Page**

| Section | Description |
|---------|-------------|
| Hero | Large headline, gradient text, animated underline, parallax floating elements, scroll indicator |
| Stats Bar | Animated counters (10K+ customers, 50+ varieties, 30min delivery, 4.9 rating) |
| Featured Pizzas | 4-card showcase with hover lift, rating badges, star icons |
| Why Choose Us | 6 feature cards with icons, hover glow effects |
| How It Works | 4-step horizontal timeline with accent gradient icons |
| Categories | 6-card grid with gradient icons, pizza counts |
| Testimonials | 3-card testimonial section with star ratings, avatars |
| CTA | Full-width gradient section with dual CTAs, noise texture, glow orbs |

**Design System**

- Complete color token system (brand, accent, success, warning, danger, info, neutral)
- Typography: Clash Display for headings, Inter for body, JetBrains Mono for code
- 18 reusable UI components (Button, Input, Card, Badge, Modal, and more)
- 12 animation presets with Framer Motion

**Layout & Accessibility**

- Glass morphism navbar with section anchors (landing page)
- Responsive footer with social links
- Skip-to-content link, ARIA labels, keyboard navigation
- Dark/light theme with localStorage persistence
- Responsive across all breakpoints (480px → 1536px+)

**Real Food Photography (Phase 7)**

| Feature | Description |
|---------|-------------|
| Pizza Images | Real high-quality pizza photographs from Unsplash |
| Ingredient Images | Real ingredient photographs for all toppings, bases, sauces, cheeses |
| Lazy Loading | `PizzaImage` component with `loading="lazy"`, shimmer placeholders, error fallback |
| Responsive Images | `srcSet` for different viewport sizes, `object-cover` for consistent ratios |
| Image Registry | Centralized `images.js` with `PIZZA_PHOTOS`, `INGREDIENT_PHOTOS`, `PIZZA_BY_CATEGORY`, `PIZZA_BY_NAME` |
| Fallback System | All components fall back to emoji if image fails to load |

**Image Optimization**

- Lazy loading via `loading="lazy"` attribute
- Responsive sizes via `srcSet` for different viewports
- Skeleton shimmer placeholders during load
- Graceful error fallback to gradient + emoji
- `object-cover` for consistent aspect ratios
- Decoding async for non-blocking render

**User Profile & Address Management (Phase 8)**

| Feature | Description |
|---------|-------------|
| Profile Dashboard | Gradient banner, avatar, verified badge, member since, 5 stat cards, account details, quick actions |
| Edit Profile | Update full name and phone number with validation |
| Avatar Upload | Upload/replace/remove profile picture, JPEG/PNG/WebP, 5MB max |
| Change Password | Current + new password, show/hide toggle, strength indicator |
| Address Management | Add/edit/delete addresses, set default, label selector (Home/Office/Other) |
| Address Cards | Recipient, phone, full address, label badge, default indicator, animated selection |
| Empty State | Elegant empty state with CTA for no addresses |
| Toast Notifications | Success/error feedback with auto-dismiss |
| Profile APIs | GET/PATCH profile, POST/DELETE avatar, PATCH password, full address CRUD |
| Security | JWT auth, bcrypt hashing, Zod validation, file type/size validation |

### Coming (Phase 10-14)

- Payment integration (Razorpay)
- Order creation and management
- Order status tracking
- Admin dashboard with inventory and analytics
- Real-time order tracking via WebSocket

### Premium UI Polish (Phase 9b)

- Complete dark mode audit — all components use semantic tokens
- Fixed hardcoded colors in Badge, Profile checkboxes, password toggles
- Enhanced scrollbar (transparent track, smooth hover)
- Reduced motion support via `prefers-reduced-motion`
- Premium animation keyframes (slide-in-up, scale-bounce, blur-in, count-up)
- Dark mode shadow tokens for proper depth perception
- Font feature settings for premium typography
- Checkout empty cart UX improvement (spinner instead of blank flash)
- Memory leak fix in VerifyEmail timeout
- Global shimmer keyframe for skeleton loading

### Elite UI Redesign (Phase 10)

- Replaced `alert()` in Checkout with animated toast notification
- Replaced `window.confirm()` in Profile with custom confirmation modal
- Removed dead footer links, replaced with working anchors
- Added real pizza photography to auth page left panel with floating glass badges
- Added focus trap and escape handling to Modal component
- Fixed ScrollProgress to use real scroll tracking via `useScroll`
- Added swipe-to-dismiss gesture to CartDrawer on mobile
- Enhanced PizzaCard hover shadows for deeper elevation
- Fixed Navbar hardcoded dark class to use `cn()` with `isDark`
- Fixed aggressive `* { border-color }` override in global CSS
- Added noise texture, card-premium, img-zoom, btn-glow CSS utilities
- Fixed PricePanel white-on-white text in light mode

---

## Environment Variables

### Server

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `NODE_ENV` | Environment | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret for tokens (min 16 chars) | Yes |
| `JWT_EXPIRE` | Token expiration | No (default: 7d) |
| `CLIENT_URL` | Frontend origin | Yes |

### Client

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | Yes |
| `VITE_APP_NAME` | Application name | No |
| `VITE_APP_VERSION` | Version string | No |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start client and server |
| `npm run dev:client` | Start client only |
| `npm run dev:server` | Start server only |
| `npm run build` | Production build |
| `npm run install:all` | Install all dependencies |

---

## API Endpoints

### Health Check

```
GET /api/v1/health
Response: { status: "OK", timestamp: "...", uptime: ... }
```

### Authentication

```
POST   /api/v1/auth/register      — Create account
POST   /api/v1/auth/login         — Sign in
POST   /api/v1/auth/logout        — Sign out
GET    /api/v1/auth/me             — Get current user
POST   /api/v1/auth/verify-email   — Verify email address
POST   /api/v1/auth/forgot-password — Request password reset
POST   /api/v1/auth/reset-password  — Reset password with token
POST   /api/v1/auth/refresh-token   — Refresh access token
```

### Pizzas

```
GET    /api/v1/pizzas              — List pizzas (search, filter, sort, paginate)
GET    /api/v1/pizzas/categories   — List categories with counts
GET    /api/v1/pizzas/:id          — Get single pizza
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| search | string | Search across name, description, tags |
| category | string | Filter by category (classic, premium, vegetarian, specialty, meat-lovers, signature) |
| sort | string | Sort by: rating, -rating, price, -price, popular, -popular, newest, -newest, name, -name |
| page | number | Page number (default: 1) |
| limit | number | Results per page (default: 12) |
| isAvailable | boolean | Filter by availability |
| isFeatured | boolean | Filter featured pizzas |
| isPopular | boolean | Filter popular pizzas |

### Profile (JWT Required)

```
GET    /api/v1/profile/me                    — Get profile with addresses
PATCH  /api/v1/profile/me                    — Update name and phone
POST   /api/v1/profile/avatar                — Upload avatar
DELETE /api/v1/profile/avatar                — Remove avatar
PATCH  /api/v1/profile/change-password       — Change password
GET    /api/v1/profile/addresses             — Get all addresses
POST   /api/v1/profile/addresses             — Create address
PATCH  /api/v1/profile/addresses/:id         — Update address
DELETE /api/v1/profile/addresses/:id         — Delete address
PATCH  /api/v1/profile/addresses/:id/default — Set default address
```

### Cart (JWT Required)

```
GET    /api/v1/cart                  — Get cart with totals
POST   /api/v1/cart/items            — Add item (dedup by configurationId)
PATCH  /api/v1/cart/items/:id        — Update item quantity
DELETE /api/v1/cart/items/:id        — Remove item
DELETE /api/v1/cart/clear            — Clear cart
POST   /api/v1/cart/coupon/apply     — Apply coupon code
DELETE /api/v1/cart/coupon/remove    — Remove coupon
POST   /api/v1/cart/validate-checkout — Validate cart for checkout
```

**Coupon Codes:** `WELCOME10` (10% off), `SAVE5` ($5 off), `PIZZA20` (20% off)

---

## Development Principles

- **Clean Architecture** — Clear separation of concerns
- **Reusable Components** — DRY, composable UI components
- **Responsive UI** — Mobile-first design approach
- **Accessibility** — WCAG 2.1 AA compliance
- **Performance** — Optimized builds and lazy loading
- **Security** — Helmet, CORS, rate limiting, input validation

---

## License

MIT License — see [LICENSE](../LICENSE) for details.
