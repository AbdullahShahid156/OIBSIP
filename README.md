<div align="center">

<img src="client/public/favicon.svg" alt="PizzaCraft" width="72" />

# PizzaCraft

**A production-grade pizza delivery platform built with React, Express, and MongoDB.**

[![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite_5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express_4-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB_8-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-00D26A?style=for-the-badge)](LICENSE)

</div>

---

## Overview

PizzaCraft is a full-stack food delivery application engineered with the same architectural patterns used in production systems. The codebase emphasizes clean separation of concerns, type-safe runtime validation, and a design system built for scale.

This repository tracks the incremental development of the platform through 9 completed phases, delivering a production-grade pizza delivery platform with cart, checkout, and user management.

---

## Current Status

| Metric | Value |
|--------|-------|
| **Phase** | 10 — Elite UI Redesign |
| **Build** | Passing |
| **Client** | 530 modules, zero errors |
| **Server** | Syntax verified, all deps installed |
| **License** | MIT |

---

## What's Built

### Phase 1 — Foundation

- Project architecture (monorepo, client/server separation)
- Design system tokens (colors, spacing, shadows, typography)
- Layout components (Navbar, Footer, Layout)
- API server with health check
- Environment validation, error handling, middleware pipeline

### Phase 2 — Design System & UI

- Complete color token system (brand, accent, success, warning, danger, info, neutral)
- 18 reusable UI components (Button, Input, Card, Badge, Modal, Avatar, etc.)
- 12 animation presets with Framer Motion
- Responsive design across all breakpoints (480px → 1536px+)
- Dark/light theme with localStorage persistence
- Accessibility: ARIA labels, keyboard navigation, focus-visible states, skip-to-content

### Phase 3 — Premium Landing Experience

| Section | Description |
|---------|-------------|
| **Hero** | Large headline, gradient text, animated underline, parallax floating elements, scroll indicator |
| **Stats Bar** | Animated counters (10K+ customers, 50+ varieties, 30min delivery, 4.9 rating) |
| **Featured Pizzas** | 4-card showcase with hover lift, rating badges, star icons, add-to-cart |
| **Why Choose Us** | 6 feature cards with icons, hover glow effects |
| **How It Works** | 4-step horizontal timeline with accent gradient icons |
| **Categories** | 6-card grid with gradient icons, pizza counts |
| **Testimonials** | 3-card testimonial section with star ratings, avatars |
| **CTA** | Full-width gradient section with dual CTAs, noise texture, glow orbs |

#### Landing Page Features

- **Animations**: Page entrance, section reveal, stagger, hover, button interactions, card lifts, parallax, scroll indicators
- **Responsive**: Mobile, tablet, laptop, desktop, ultrawide
- **Accessibility**: Keyboard friendly, focus states, proper contrast, semantic HTML, ARIA labels
- **Performance**: Lazy-load ready, optimized rendering, no layout shifts
- **Design Quality**: Premium typography, perfect spacing, professional color theory, consistent border radius

### Phase 4 — Authentication System

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

### Phase 5 — Pizza Discovery Dashboard

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

### Phase 6 — Interactive Pizza Builder

| Feature | Description |
|---------|-------------|
| 5-Step Wizard | Base → Sauce → Cheese → Toppings → Review with step indicator |
| Live Pizza Preview | Real-time CSS pizza visualization with photorealistic layers |
| Drag-and-Drop Toppings | Framer Motion drag with circular boundary clamping and overlap avoidance |
| Quantity Stepper | Per-topping −/+ controls with animated number transitions (1–5 levels) |
| Topping Levels | Light, Regular, Extra, Double, Loaded with color-coded labels |
| Price Calculation | Live price breakdown updating as selections change |
| Size Selection | Small (10"), Medium (12"), Large (14"), Family (16") with pricing |
| Base Options | Classic Hand-Tossed, Thin Crust, Stuffed Crust, Whole Wheat, Gluten-Free |
| Sauce Options | Classic Tomato, Pesto, BBQ, Garlic White, Buffalo |
| Cheese Options | Mozzarella, Four Cheese, Vegan, Ricotta, Blue Cheese |
| Topping Density | Multiple visual instances per topping based on quantity |
| Review Screen | Full breakdown with size, ingredients, quantities, total, prep time |

**Builder Architecture**

| File | Purpose |
|------|---------|
| `pizzaBuilder.js` | Constants: steps, options, max limits, topping levels |
| `builderSlice.js` | Redux state: size, base, sauce, cheese, veggies `{id: qty}` |
| `SelectionCard.jsx` | Premium option card with animated checkmark and layout ring |
| `StepIndicator.jsx` | 5-step progress bar with icons, glow, fill animation |
| `PricePanel.jsx` | Animated price breakdown with per-item breakdown |
| `PizzaPreview.jsx` | CSS pizza with crust/sauce/cheese layers, draggable topping components |
| `BaseStep.jsx` | Size grid + base option cards |
| `SauceStep.jsx` | Sauce selection with pairing tip |
| `CheeseStep.jsx` | Cheese selection grid |
| `VeggieStep.jsx` | Topping cards with premium quantity stepper |
| `ReviewStep.jsx` | Full order summary with ingredient chips and price breakdown |

**CSS Topping Components (12)**

MushroomSlice, BellPepperSlice, RedOnionRing, OliveSlice, TomatoSlice, JalapenoSlice, SpinachLeaf, ArtichokePiece, ArugulaLeaf, CaramelizedOnionStrip, SunDriedTomato, TruffleOilDrop — each with realistic gradients, inner shadows, specular highlights, and natural food shapes.

### Phase 7 — Premium Visual Assets & Brand Identity

**Real Food Photography**

All food visuals use high-quality, real photographs from Unsplash with professional food photography.

| Component | Description |
|-----------|-------------|
| `PizzaCard.jsx` | Real pizza photographs with lazy loading, skeleton shimmer, error fallback |
| `PizzaDetailModal.jsx` | Large hero pizza photograph with eager loading |
| `Home.jsx` FeaturedPizzas | Real pizza photographs in 4-card showcase |
| `SelectionCard.jsx` | Real ingredient photographs (base/sauce/cheese/toppings) |
| `VeggieStep.jsx` | Real topping photographs with quantity stepper |
| `ReviewStep.jsx` | Real ingredient photographs in chips and price breakdown |
| `PizzaPreview.jsx` | Real ingredient photographs in animated chips |

**Image Asset System**

| Feature | Description |
|---------|-------------|
| `PizzaImage.jsx` | Reusable lazy-loading component with shimmer placeholder, error fallback, responsive srcSet |
| `images.js` | Centralized Unsplash photo URLs for all pizzas and ingredients |
| Category Mapping | `PIZZA_BY_CATEGORY` maps each pizza category to its real photograph |
| Name Mapping | `PIZZA_BY_NAME` maps specific pizza names to their real photographs |
| Ingredient Mapping | `INGREDIENT_PHOTOS` maps all ingredient IDs to their real photographs |
| Fallback System | All components fall back to 🍕 emoji if image fails to load |

**Image Optimization**

- Lazy loading via `loading="lazy"` attribute
- Responsive sizes via `srcSet` for different viewports
- Skeleton shimmer placeholders during load
- Graceful error fallback to gradient + emoji
- `object-cover` for consistent aspect ratios
- Decoding async for non-blocking render

### Phase 8 — User Profile & Address Management

**Profile Dashboard**

| Feature | Description |
|---------|-------------|
| Profile Header | Large gradient banner, avatar with initials fallback, verified badge, member since date |
| Account Overview | 5 stat cards (Favorite Pizza, Total Orders, Total Spent, Loyalty Tier, Saved Addresses) |
| Account Details | Name, email, phone, email status, member since |
| Quick Actions | Order Pizza, Browse Menu, Logout |

**Profile Management**

| Feature | Description |
|---------|-------------|
| Edit Profile | Update full name and phone number with Zod validation |
| Avatar Upload | Upload/replace/remove profile picture, JPEG/PNG/WebP, 5MB max, base64 storage |
| Change Password | Current + new password, show/hide toggle, strength indicator (6 levels), validation |
| Toast Notifications | Success/error feedback with auto-dismiss |

**Address Management**

| Feature | Description |
|---------|-------------|
| Address Cards | Recipient, phone, full address, label badge (Home/Office/Other), default indicator |
| Add Address | Modal form with all fields, label selector, set as default checkbox |
| Edit Address | Pre-filled modal form for editing |
| Delete Address | Confirmation dialog, auto-reassign default |
| Set Default Address | One-click default assignment |
| Empty State | Elegant empty state with CTA |

**Backend APIs**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/profile/me` | GET | Get full profile with addresses |
| `/api/v1/profile/me` | PATCH | Update name and phone |
| `/api/v1/profile/avatar` | POST | Upload avatar (multipart/form-data) |
| `/api/v1/profile/avatar` | DELETE | Remove avatar |
| `/api/v1/profile/change-password` | PATCH | Change password |
| `/api/v1/profile/addresses` | GET | Get all addresses |
| `/api/v1/profile/addresses` | POST | Create address |
| `/api/v1/profile/addresses/:id` | PATCH | Update address |
| `/api/v1/profile/addresses/:id` | DELETE | Delete address |
| `/api/v1/profile/addresses/:id/default` | PATCH | Set default address |

**Security**

- All profile routes protected with JWT auth middleware
- Password hashed with bcrypt (12 rounds) before save
- Avatar uploads validated (type + size)
- Zod validation on all inputs
- User can only access own profile/addresses

### Phase 9 — Cart & Checkout Foundation

**Cart System**

| Feature | Description |
|---------|-------------|
| Cart Slice | Redux Toolkit slice with localStorage persistence and summary calculations |
| Cart Drawer | Premium slide-in drawer with backdrop blur, scrollable items, sticky checkout |
| Cart Page | Dedicated page with cart items, order summary, free delivery progress |
| Cart Item | Customized pizza item with image, name, customization tags, quantity controls |
| Cart Empty | Animated empty state with bouncing cart illustration and CTA |
| Add to Cart | Builder integrates with cart — creates fully customized pizza entries |
| Quantity Controls | Per-item −/+ with animated number transitions, min 1, max 10 |
| Remove Item | Individual item removal with exit animation |
| Clear Cart | One-click cart clearing with confirmation |
| Cart Persistence | localStorage saves/restores cart across sessions |
| Free Delivery Progress | Animated progress bar toward $35 free delivery threshold |
| Mobile Sticky Bar | Fixed bottom bar on mobile with total and checkout CTA |

**Checkout System**

| Feature | Description |
|---------|-------------|
| Checkout Page | Multi-section checkout with address, coupon, notes, payment placeholder |
| Address Selector | Select from saved profile addresses, add new, edit existing |
| Address Modal | Full address form with recipient, phone, street, city, postal code, label |
| Order Summary | Dynamic price breakdown: subtotal, delivery fee, tax, discount, grand total |
| Coupon Input | UI with apply/remove, success/error states, validation placeholder |
| Delivery Notes | Textarea for special instructions |
| Estimated Delivery | Prep time + delivery time calculation |
| Payment Placeholder | Ready for Razorpay integration in Phase 10 |
| Terms Agreement | Checkbox for terms and conditions |
| Progress Steps | Visual 3-step indicator: Cart → Checkout → Payment |
| Mobile Sticky Bar | Fixed bottom bar on mobile with total and place order button |

**Backend APIs**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/cart` | GET | Get cart with items and calculated totals |
| `/api/v1/cart/items` | POST | Add item to cart (with configuration dedup) |
| `/api/v1/cart/items/:id` | PATCH | Update item quantity |
| `/api/v1/cart/items/:id` | DELETE | Remove item from cart |
| `/api/v1/cart/clear` | DELETE | Clear entire cart |
| `/api/v1/cart/coupon/apply` | POST | Apply coupon code |
| `/api/v1/cart/coupon/remove` | DELETE | Remove applied coupon |
| `/api/v1/cart/validate-checkout` | POST | Validate cart for checkout |

**Cart Data Model**

| Field | Type | Description |
|-------|------|-------------|
| pizzaId | ObjectId | Reference to Pizza (or 'custom') |
| name | String | Pizza name |
| image | String | Pizza image URL |
| size | String | small/medium/large/extra_large |
| base | String | Base type ID |
| sauce | String | Sauce type ID |
| cheese | String | Cheese type ID |
| veggies | Map | Topping quantities `{id: qty}` |
| qty | Number | Item quantity (1-10) |
| unitPrice | Number | Price per unit |
| totalPrice | Number | unitPrice × qty |
| isCustomized | Boolean | Whether this is a custom pizza |
| configurationId | String | Unique hash for config dedup |

**Pricing Architecture**

| Component | Calculation |
|-----------|-------------|
| Subtotal | Sum of all item totalPrices |
| Delivery Fee | Free if subtotal ≥ $35, else $4.99 |
| Tax | 8% of subtotal |
| Coupon Discount | Percentage or fixed amount |
| Grand Total | Subtotal + Delivery + Tax − Discount |

### Premium UI Polish (Phase 9b)

| Improvement | Description |
|-------------|-------------|
| Dark Mode Audit | Fixed 3 hardcoded color bugs (Badge neutral dot, Profile checkbox, password toggles) |
| Enhanced Scrollbar | Transparent track, thinner thumb, smooth hover transitions |
| Reduced Motion | Respects `prefers-reduced-motion` media query globally |
| Premium Animations | Added `slide-in-up`, `slide-in-down`, `scale-bounce`, `blur-in`, `count-up` keyframes |
| Dark Mode Shadows | New `dark-sm`, `dark-md`, `dark-lg`, `dark-xl` shadow tokens for depth |
| Focus Ring Tokens | New `ring-brand` and `ring-brand-dark` shadow tokens |
| Font Features | Added `ss01` stylistic set for premium typography rendering |
| Image Rendering | Optimized `image-rendering: auto` for all images |
| Checkout UX | Empty cart shows loading spinner instead of blank flash during redirect |
| Memory Leak Fix | VerifyEmail timeout properly cleaned up on unmount |
| Shimmer Loading | Added global `@keyframes shimmer` for skeleton loading components |

### Elite UI Redesign (Phase 10)

| Improvement | Description |
|-------------|-------------|
| Checkout UX | Replaced `alert()` with animated toast notification for payment placeholder |
| Profile UX | Replaced `window.confirm()` with custom confirmation modal for address deletion |
| Footer Cleanup | Removed dead links to nonexistent routes, replaced with working anchors |
| Auth Visual Presence | Added real pizza photography with floating glass badges to auth page left panel |
| Modal Accessibility | Added focus trap, escape key handling, and focus restoration to Modal component |
| Scroll Progress | Fixed ScrollProgress to use real `useScroll` tracking instead of fake animation |
| CartDrawer Mobile | Added swipe-to-dismiss gesture on mobile via Framer Motion drag |
| PizzaCard Polish | Enhanced hover shadows for deeper elevation effect |
| Navbar Fix | Fixed hardcoded `dark:` class to use `cn()` with `isDark` for consistency |
| Global CSS | Fixed aggressive `* { border-color }` override, added noise texture, card-premium, img-zoom, btn-glow utilities |
| Dark Mode | Fixed PricePanel white-on-white text in light mode |
| Design Tokens | Refined border-color override from `dark-800` to `surface-200` for light mode |

---

## Roadmap

```
Phase 1   ✅  Foundation architecture, design system, layout components, API server
Phase 2   ✅  Design system tokens, UI component library, animation system, accessibility
Phase 3   ✅  Premium landing page experience
Phase 4   ✅  Authentication system (JWT, email verification, password reset)
Phase 5   ✅  Pizza model, API endpoints, Pizza Discovery Dashboard
Phase 6   ✅  Interactive pizza builder with live preview and quantity controls
Phase 7   ✅  Premium visual assets, real food photography, brand identity system
Phase 8   ✅  User profile, address management, avatar upload, change password
Phase 9   ✅  Cart & checkout foundation, localStorage persistence, address selection
Phase 9b  ✅  Premium UI polish, complete dark mode audit, animation improvements
Phase 10  ✅  Elite UI redesign — commercial FoodTech quality, accessibility, micro-interactions
Phase 11  ⬜  Payment integration (Razorpay)
Phase 12  ⬜  Order creation and management
Phase 13  ⬜  Order status tracking
Phase 14  ⬜  Admin dashboard with inventory and analytics
Phase 15  ⬜  Real-time order tracking via WebSocket
```

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
| clsx | Conditional className utility |
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

### Infrastructure

| Technology | Purpose |
|------------|---------|
| MongoDB | Document database |
| dotenv | Environment configuration |
| ESLint | Code linting |
| Nodemon | Server auto-restart |

---

## Folder Structure

```
pizzacraft/
├── client/                          # React frontend
│   ├── public/                      # Static assets
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/                # AuthLayout, ProtectedRoute
│   │   │   ├── builder/             # Pizza Builder components
│   │   │   │   ├── steps/           # BaseStep, SauceStep, CheeseStep, VeggieStep, ReviewStep
│   │   │   │   ├── SelectionCard.jsx
│   │   │   │   ├── StepIndicator.jsx
│   │   │   │   ├── PricePanel.jsx
│   │   │   │   └── PizzaPreview.jsx
│   │   │   ├── cart/                # CartDrawer, CartItem, CartEmpty
│   │   │   ├── checkout/            # AddressSelector, OrderSummary, CouponInput
│   │   │   ├── layout/              # Navbar, Footer, Layout
│   │   │   ├── pizza/               # PizzaCard, PizzaDetailModal, PizzaCardSkeleton, PizzaImage
│   │   │   └── ui/                  # Design system components + ErrorBoundary
│   │   │       ├── index.jsx        # All UI components
│   │   │       ├── AnimationWrapper.jsx
│   │   │       └── ErrorBoundary.jsx
│   │   ├── data/                    # Static data and constants
│   │   │   ├── images.js            # Unsplash photo URLs
│   │   │   └── pizzaBuilder.js      # Builder options, steps, topping levels
│   │   ├── hooks/                   # useDarkMode, useMediaQuery, useScrollPosition, useDebounce
│   │   ├── pages/                   # Home, Menu, Cart, Checkout, PizzaBuilder, Profile, Auth pages, NotFound
│   │   ├── services/                # API client, auth, pizza, cart
│   │   ├── store/
│   │   │   ├── index.js             # Store configuration
│   │   │   └── slices/              # auth, ui, pizza, builder, profile, cart
│   │   ├── styles/                  # Global CSS and design tokens
│   │   ├── utils/                   # Constants and helper functions
│   │   ├── App.jsx                  # Route definitions
│   │   └── main.jsx                 # Application entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                          # Express backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js          # MongoDB connection with retry
│   │   │   └── env.js               # Zod-validated environment
│   │   ├── controllers/
│   │   │   ├── authController.js    # Auth endpoints
│   │   │   ├── cartController.js    # Cart CRUD + coupon + checkout validation
│   │   │   ├── pizzaController.js   # Pizza CRUD + search + filter
│   │   │   └── profileController.js # Profile + address CRUD + avatar + change password
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT protect middleware
│   │   │   ├── errorHandler.js      # Global error handler + AppError class
│   │   │   ├── index.js             # Helmet, CORS, rate limiting, Morgan
│   │   │   ├── upload.js            # Multer avatar upload (memory storage)
│   │   │   └── validate.js          # Zod validation middleware
│   │   ├── models/
│   │   │   ├── Cart.js              # Cart schema with embedded items
│   │   │   ├── Pizza.js             # Pizza schema (15 seeded documents)
│   │   │   └── User.js              # User schema with bcrypt + embedded addresses
│   │   ├── routes/
│   │   │   ├── v1/
│   │   │   │   ├── auth.js          # Auth routes with rate limiting
│   │   │   │   ├── cart.js          # Cart routes (JWT protected)
│   │   │   │   ├── health.js        # Health check endpoint
│   │   │   │   ├── pizza.js         # Pizza routes (public)
│   │   │   │   └── profile.js       # Profile routes (JWT protected)
│   │   │   └── index.js             # Route aggregator
│   │   ├── seed.js                  # Database seed script
│   │   ├── services/
│   │   │   ├── authService.js       # JWT generation/verification
│   │   │   └── emailService.js      # Nodemailer transport
│   │   ├── templates/
│   │   │   └── email/               # HTML email templates
│   │   ├── utils/
│   │   │   └── logger.js            # Winston logger configuration
│   │   ├── validations/
│   │   │   ├── auth.js              # Auth Zod schemas
│   │   │   ├── cart.js              # Cart Zod schemas
│   │   │   └── pizza.js             # Pizza Zod schemas
│   │   └── server.js                # Express + Socket.io entry
│   ├── .env
│   ├── package.json
│   └── .gitignore
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- MongoDB 6.0+ (local installation or Atlas cluster)
- npm 9.0+ or yarn 1.22+

### Installation

```bash
# Clone the repository
git clone https://github.com/AbdullahShahid156/OIBSIP.git
cd OIBSIP/WebDev-Task1-PizzaDelivery

# Install all dependencies (root, client, server)
npm run install:all

# Configure environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Edit `server/.env` with your MongoDB connection string and a secure JWT secret (minimum 16 characters).

### Running Development Servers

```bash
# Start both client and server concurrently
npm run dev

# Or start individually
npm run dev:client    # http://localhost:3000
npm run dev:server    # http://localhost:5000
```

---

## Environment Variables

### Server

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | `5000` |
| `NODE_ENV` | Runtime environment | Yes | — |
| `MONGODB_URI` | MongoDB connection string | Yes | — |
| `JWT_SECRET` | Secret for JWT signing (min 16 chars) | Yes | — |
| `JWT_EXPIRE` | Token expiration duration | No | `7d` |
| `CLIENT_URL` | Frontend origin for CORS | Yes | — |

### Client

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API base URL | Yes |
| `VITE_APP_NAME` | Application display name | No |
| `VITE_APP_VERSION` | Application version string | No |

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start client and server concurrently |
| `npm run dev:client` | Start Vite dev server only |
| `npm run dev:server` | Start Express server only |
| `npm run build` | Create optimized production build |
| `npm run install:all` | Install dependencies for all packages |

---

## Architecture

The application follows a monorepo structure with clear separation between client and server.

**Client Architecture:**
Pages import layout components and animation wrappers. State flows through Redux store. API calls route through a centralized Axios instance with interceptors. Custom hooks abstract browser APIs and UI state.

**Server Architecture:**
Express middleware pipeline handles security, parsing, logging, and rate limiting before reaching route handlers. Environment validation runs at startup and fails fast on misconfiguration. Database connection includes automatic retry logic.

**Design System Architecture:**
All design tokens are defined in `tailwind.config.js` and extended in `styles/index.css`. Components use semantic color tokens and follow consistent patterns. Animations are powered by Framer Motion with reusable presets.

---

## Development Principles

**Clean Architecture**
Each module has a single responsibility. Components render UI, hooks manage state, services handle API communication, and utils contain pure functions.

**Reusable Components**
Layout components (Navbar, Footer, Layout) are used across all pages. AnimationWrapper provides consistent motion patterns. All UI components in `components/ui` are reusable across the application.

**Scalable Structure**
The folder structure accommodates growth. Adding a new page requires one file in `pages/`. Adding a new feature slice requires one file in `store/slices/`. Adding a new API endpoint requires one file in `routes/v1/`.

**Responsive UI**
Every component adapts to mobile, tablet, and desktop viewports. The Navbar includes a hamburger menu for small screens. Grid layouts collapse appropriately.

**Performance**
Vite provides sub-second hot module replacement. Tailwind purges unused CSS in production. Framer Motion animations use GPU-accelerated transforms.

**Security**
Helmet sets HTTP security headers. CORS restricts origins to the configured client URL. Rate limiting prevents abuse. Environment variables are validated at startup.

**Accessibility**
Skip-to-content links, ARIA labels, focus-visible rings, semantic HTML, and keyboard navigation are built into every component.

---

## Quality Standards

- Zero lint errors in production builds
- All environment variables validated at startup
- Graceful error handling with operational error class
- Consistent code style enforced by ESLint
- No hardcoded values — all configuration through environment variables
- Components tested for responsive behavior across breakpoints
- All interactive elements accessible via keyboard
- Proper ARIA labels on all interactive elements

---

## Git Workflow

This project follows conventional commits:

```
feat:      New feature
fix:       Bug fix
chore:     Maintenance tasks
refactor:  Code restructuring without behavior change
docs:      Documentation updates
style:     Formatting changes
```

Example: `feat: add user authentication with JWT`

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.

---

<div align="center">

**Abdullah Shahid** · [GitHub](https://github.com/AbdullahShahid156)

</div>
