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

This repository tracks the incremental development of the platform. Phase 5 delivers the Pizza Discovery Dashboard and Pizza Model API.

---

## Current Status

| Metric | Value |
|--------|-------|
| **Phase** | 5 — Pizza Discovery Dashboard |
| **Build** | Passing |
| **Client** | 501 modules, zero errors |
| **Server** | Syntax verified |
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

---

## Roadmap

```
Phase 1  ✅  Foundation architecture, design system, layout components, API server
Phase 2  ✅  Design system tokens, UI component library, animation system, accessibility
Phase 3  ✅  Premium landing page experience
Phase 4  ✅  Authentication system (JWT, email verification, password reset)
Phase 5  ✅  Pizza model, API endpoints, Pizza Discovery Dashboard
Phase 6  ⬜  Interactive pizza builder with live inventory
Phase 7  ⬜  Shopping cart with server-side price recalculation
Phase 8  ⬜  Checkout flow with order creation
Phase 9  ⬜  Payment integration (Razorpay)
Phase 10 ⬜  Order management and status tracking
Phase 11 ⬜  Admin dashboard with inventory and analytics
Phase 12 ⬜  Real-time order tracking via WebSocket
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
│   │   │   ├── layout/              # Navbar, Footer, Layout
│   │   │   ├── pizza/               # PizzaCard, PizzaDetailModal, PizzaCardSkeleton
│   │   │   └── ui/                  # Design system components
│   │   │       ├── index.jsx        # All UI components
│   │   │       └── AnimationWrapper.jsx
│   │   ├── hooks/                   # useDarkMode, useMediaQuery, useScrollPosition, useDebounce
│   │   ├── pages/                   # Home, Menu (Dashboard), Orders, Auth pages, NotFound
│   │   ├── services/                # API client, auth, pizza
│   │   ├── store/                   # Redux store and slices (auth, ui, pizza)
│   │   ├── styles/                  # Global CSS and design tokens
│   │   ├── utils/                   # Constants and helper functions
│   │   ├── App.jsx                  # Route definitions
│   │   └── main.jsx                 # Application entry point
│   ├── index.html                   # HTML shell with font loading
│   ├── package.json
│   ├── tailwind.config.js           # Extended design system
│   └── vite.config.js
│
├── server/                          # Express backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js          # MongoDB connection with retry
│   │   │   └── env.js               # Zod-validated environment
│   │   ├── controllers/
│   │   │   ├── authController.js    # Auth endpoints
│   │   │   └── pizzaController.js   # Pizza CRUD + search + filter
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT protect middleware
│   │   │   ├── errorHandler.js      # Global error handler + AppError class
│   │   │   └── index.js             # Helmet, CORS, rate limiting, Morgan
│   │   ├── models/
│   │   │   ├── Pizza.js             # Pizza schema (15 seeded documents)
│   │   │   └── User.js              # User schema with bcrypt
│   │   ├── routes/
│   │   │   ├── v1/
│   │   │   │   ├── auth.js          # Auth routes with rate limiting
│   │   │   │   ├── health.js        # Health check endpoint
│   │   │   │   └── pizza.js         # Pizza routes (public)
│   │   │   └── index.js             # Route aggregator
│   │   ├── seed.js                  # Database seed script
│   │   ├── services/
│   │   │   ├── authService.js       # JWT generation/verification
│   │   │   └── emailService.js      # Nodemailer transport
│   │   ├── templates/
│   │   │   └── email/               # HTML email templates
│   │   ├── validations/
│   │   │   ├── auth.js              # Auth Zod schemas
│   │   │   └── pizza.js             # Pizza Zod schemas
│   │   ├── utils/
│   │   │   └── logger.js            # Winston logger configuration
│   │   └── server.js                # Express + Socket.io entry
│   ├── .env
│   ├── package.json
│   └── .gitignore
│
├── shared/                          # Cross-project constants
│   └── constants.js
│
├── .gitignore
├── LICENSE
├── README.md
└── package.json                     # Root scripts and concurrently
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
