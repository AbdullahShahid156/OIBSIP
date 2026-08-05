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

### Current (Phase 2 — Complete)

- **Design System** — Complete token system with colors, spacing, shadows, animations
- **Typography** — Clash Display for headings, Inter for body, JetBrains Mono for code
- **UI Components** — Button, Input, Card, Badge, Modal, and 15+ reusable components
- **Animation System** — 12 animation presets with Framer Motion
- **Layout** — Glass morphism navbar, responsive footer, scroll-to-top
- **Responsive** — Mobile, tablet, laptop, and desktop layouts
- **Accessibility** — ARIA labels, keyboard navigation, focus-visible states
- **Dark/Light Theme** — Automatic detection with manual toggle

### Coming (Phase 3-11)

- User authentication (JWT, email verification)
- Interactive pizza builder
- Shopping cart with price recalculation
- Checkout and order management
- Payment integration (Razorpay)
- Real-time order tracking
- Admin dashboard

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
