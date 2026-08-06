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

---

## Project Structure

```
pizza-delivery/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Page components
│   │   ├── services/          # API client
│   │   ├── store/             # Redux store
│   │   └── styles/            # Global styles
│   └── index.html
├── server/                    # Express backend
│   ├── src/
│   │   ├── config/            # Database and env config
│   │   ├── middleware/        # Express middleware
│   │   ├── routes/            # API routes
│   │   └── utils/             # Utilities
│   └── server.js
├── shared/                    # Shared constants
└── package.json               # Root scripts
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

### Current (Phase 6 — Complete)

**Interactive Pizza Builder**

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

### Coming (Phase 7-12)

- Shopping cart with server-side price recalculation
- Checkout flow with order creation
- Payment integration (Razorpay)
- Order management and status tracking
- Admin dashboard with inventory and analytics
- Real-time order tracking via WebSocket

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
