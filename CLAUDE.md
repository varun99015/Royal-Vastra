# CLAUDE.md — Architecture & Development Conventions

## Project Overview
**Royal Vastra** is a premium, full-stack Indian men's ethnic wear e-commerce platform built with **React 18 + Vite + Tailwind CSS** on the frontend and **Node.js + Express.js** on the backend with atomic local JSON storage.

---

## Architecture & Directory Structure

```text
royal-vastra/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components (Header, Footer, ProductCard, CartDrawer, etc.)
│   │   ├── pages/              # Routed pages (HomePage, ShopPage, ProductDetailPage, CheckoutPage, etc.)
│   │   ├── context/            # React Contexts (CartContext, WishlistContext, AuthContext)
│   │   ├── hooks/              # Custom hooks (useProductList)
│   │   ├── services/           # API interaction layer (api.js, products.js)
│   │   ├── utils/              # Pure utilities & helpers (helpers.js, whatsapp.js)
│   │   ├── App.jsx             # Top-level routing & layout shell
│   │   ├── index.css           # Tailwind base, utilities, royal color system
│   │   └── main.jsx            # React root mount
│   ├── tailwind.config.js      # Royal color tokens & typography configuration
│   ├── vite.config.js          # Vite config with /api proxy to port 5000
│   └── package.json
├── backend/
│   ├── routes/                 # Express route handlers (products.js, orders.js, admin.js)
│   ├── services/               # Data-access & business logic layer (product, order, admin, file)
│   ├── middleware/             # Validation, rate limiting, and JWT auth middleware
│   ├── data/                   # Persistent JSON files (products.json, settings.json, orders.json, admin_users.json)
│   ├── utils/                  # Config, logger (with sensitive redaction), errors
│   ├── scripts/                # Database seed & init scripts (seed.js)
│   ├── server.js               # Express application entrypoint
│   └── package.json
├── run-dev.js                  # Zero-dependency cross-platform concurrent dev runner
├── .env.example                # Example environment variables
├── .gitignore
├── CLAUDE.md                   # This document
├── README.md                   # Complete installation, setup & API documentation
└── package.json                # Root package with monorepo npm scripts
```

---

## Development Conventions & Rules

### 1. Technology Constraints
- **Frontend**: Strictly React + Vite + Tailwind CSS + Lucide React + React Router.
- **Backend**: Strictly Node.js + Express.js REST API.
- **Database**: Local JSON storage in `backend/data/` without external database or cloud storage dependencies.
- **No external paid SaaS required**: The application operates in full without third-party API keys.

### 2. Data Access Layer
- All file reads and writes MUST go through `backend/services/file.service.js`.
- File writes use an atomic temporary file rename strategy (`.tmp` -> rename) to avoid file corruption on concurrency.
- Concurrency on orders uses a safe merge queue (`safeMergeOrders`) to prevent simultaneous order race conditions.
- Stock reductions occur server-side during order placement.

### 3. Server-Side Price & Stock Revalidation
- **Never trust client-supplied totals**: The client sends only `productId`, `size`, `color`, and `quantity`.
- `order.service.js` fetches current price and available stock from `products.json` directly and recalculates subtotal, shipping tier, and final total before saving.

### 4. Authentication & Security
- Admin passwords are never stored plain-text; they are hashed with `bcryptjs` (salt rounds: 10).
- Admin endpoints require `Authorization: Bearer <token>` validated with `jsonwebtoken`.
- Admin auth routes have strict rate limiting (`express-rate-limit`).
- Express applies `helmet` security headers and safe CORS origin checks.
- Logger automatically redacts sensitive keywords (`password`, `token`, `authorization`, `signature`).

### 5. Styling & Visual Language
- **Brand Palette**:
  - Burgundy (`#722F37` / `#541A21`)
  - Ivory (`#FAF6F0` / `#FAF8F5`)
  - Warm Beige (`#D4C5A9`)
  - Muted Gold (`#C5A572` / `#D4AF37`)
  - Charcoal (`#1A1A2E`)
- **Typography**:
  - Headings & Accents: `Playfair Display` (editorial serif)
  - Body & UI: `Plus Jakarta Sans` / `Inter` (high-readability sans)

---

## Running the Application Locally

```bash
# 1. Install all dependencies across root, backend, and frontend
npm run install:all

# 2. Seed initial admin user and settings
npm run seed

# 3. Start both backend (Port 5000) and frontend (Port 5173) simultaneously
npm run dev

# Or start services separately in individual terminals:
npm run server   # Backend on http://localhost:5000
npm run client   # Frontend on http://localhost:5173
```
