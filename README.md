# Royal Vastra — Premium Men's Ethnic Wear E-Commerce Platform

![Royal Vastra](https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&q=80)

**Royal Vastra** is a complete, production-quality Indian men's ethnic wear e-commerce website built with **React 18 + Vite + Tailwind CSS** on the frontend and **Node.js + Express.js** on the backend.

Designed with inspiration from high-end Indian fashion editorials (deep burgundy, warm ivory, muted gold, charcoal) while remaining accessible to customers looking for honest, affordable traditional menswear.

---

## Key Features

### 👑 Customer Experience
- **Editorial Homepage**:
  - Full-width hero banner with high-fashion Indian groom photography and dual CTAs.
  - 6 Curated Category Tiles (Kurtas & Sets, Sherwanis & Wedding Wear, Traditional Formal Wear, Indo-Western Outfits, Festive Essentials, New Arrivals).
  - Responsive Best Sellers product grid with badges, wishlist toggle, and quick add.
  - Shop by Occasion visual tiles (Wedding Ceremonies, Sangeet & Reception, Festivals, Pooja, Casual, Evening Formals).
  - Affordable Style Section (< ₹999, ₹999–₹1,999, ₹2,000–₹3,999, Above ₹4,000).
  - Editorial feature banner ("Made for Moments That Matter").
  - Configurable benefits bar (Handcrafted heritage, Free shipping above ₹999, 7-Day doorstep exchange, Honest direct pricing).
- **Comprehensive Shop Experience (`/shop`)**:
  - Multi-criteria filtering by category, subcategory, occasion, fabric, color, size, and price range.
  - Search by garment name, description, fabric, and tags.
  - Sorting (Featured, Newest Arrivals, Price Low-to-High, Price High-to-Low).
  - Mobile slide-out filter drawer and desktop sidebar.
  - Active filter tags with single-click removal and "Clear All".
- **Product Details (`/product/:id`)**:
  - Multi-image gallery with thumbnail switcher and hover preview.
  - Interactive color selection and size buttons with live stock counters.
  - Interactive Size Guide modal with standard Indian chest, shoulder, length measurements.
  - 6-digit Indian PIN code delivery checker.
  - Fabric, weave specifications, and care instructions tabs.
  - Similar products and recently viewed items recommendation strips.
  - Mobile sticky "Add to Bag" bar.
- **Cart & Slide-over Drawer**:
  - Global slide-over cart drawer on item addition and dedicated `/cart` page.
  - Dynamic Free Shipping progress bar ("Add ₹X more for Complimentary Delivery").
  - Coupon code engine (`ROYAL10` for 10% off, `VASTRA500` for orders > ₹2,999, `WELCOME`).
  - One-click "Share Cart on WhatsApp" generating prefilled order summary.
- **Checkout & Order Creation (`/checkout`)**:
  - Multi-step address and customer detail validation.
  - **Mode A: Cash on Delivery / Pay on Delivery** (Awaiting Confirmation).
  - **Mode B: Online Payment** (Integration interface ready; order placed in awaiting payment).
  - Server-side inventory decrement and server-side price recalculation.
  - Order confirmation screen with unique order ID (e.g. `RV-XXXXX-XXXX`) and WhatsApp receipt link.
- **Order Lookup & Tracking (`/track-order`)**:
  - Track orders by ID and verified mobile number or email.
  - Visual 4-step dispatch progress timeline (Placed -> Confirmed -> Dispatched -> Delivered).
- **Interactive Wishlist & Style Matcher (`/wishlist`)**:
  - Persistent wishlist with Move to Bag.
  - Interactive Style Matcher wizard recommending outfits based on budget, occasion, category, and style.
- **WhatsApp Concierge Integration**:
  - Universal click-to-chat links (`wa.me`) for general inquiries, product-specific questions with prefilled garment details, sizing help, and cart sharing.

### 🛡️ Atelier Administration Console (`/admin`)
- **Admin Authentication**: Secure JWT-based login with bcrypt password hashing and rate limiting.
- **Product CRUD**: Add new garments with image URLs, update prices, manage sizes, colors, fabric, and toggle active/inactive status.
- **Order Management**: View all incoming orders, filter by status, update status (`pending_confirmation` -> `confirmed` -> `shipped` -> `delivered` -> `cancelled`).
- **Store Settings**: Live configuration of store name, WhatsApp number, contact email, phone, physical address, and free shipping thresholds.

---

## Technology Stack

- **Frontend**: React 18, Vite 6, Tailwind CSS 3.4, React Router 6, Lucide React icons.
- **Backend**: Node.js, Express.js 4, Helmet security headers, CORS, Express Rate Limit, Express Validator.
- **Storage**: Safe atomic local JSON files (`products.json`, `orders.json`, `settings.json`, `admin_users.json`) with serialized write queue and stock updates.

---

## Quick Start & Installation

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### 1. Clone & Install Dependencies

```bash
cd "Royal Vastra"

# Install all root, backend, and frontend packages with a single command:
npm run install:all
```

*(Alternatively, run `npm install` inside both `backend/` and `frontend/` folders).*

### 2. Configure Environment

Copy `.env.example` to `.env` in the root and in `backend/`:

```bash
# Windows PowerShell
copy .env.example .env
copy .env.example backend\.env
```

### 3. Initialize Admin & Sample Data

Run the database seed script to initialize the demo administrator account:

```bash
npm run seed
```

Default developer credentials created:
- **Email**: `admin@royalvastra.com`
- **Password**: `RoyalVastra@2026`

### 4. Run Development Servers

Start both the Express API (Port 5000) and the Vite frontend (Port 5173) simultaneously:

```bash
npm run dev
```

Visit the application in your browser:
- **Storefront**: [http://localhost:5173](http://localhost:5173)
- **Admin Portal**: [http://localhost:5173/admin](http://localhost:5173/admin)
- **Backend API Health Check**: [http://localhost:5000/health](http://localhost:5000/health)

---

## REST API Documentation

### Public Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Filter, search, and paginate catalogue (`category`, `occasion`, `fabric`, `color`, `size`, `minPrice`, `maxPrice`, `sort`, `page`, `limit`) |
| `GET` | `/api/products/featured` | Fetch curated featured garments |
| `GET` | `/api/products/new-arrivals` | Fetch newly added 2026 collection |
| `GET` | `/api/products/best-sellers` | Fetch top selling products |
| `GET` | `/api/products/categories` | Fetch all categories and subcategories |
| `GET` | `/api/products/:id` | Fetch product by ID or slug |
| `GET` | `/api/products/slug/:slug` | Fetch product by slug |
| `POST` | `/api/orders` | Submit customer order (server-side price recalculation & stock deduction) |
| `GET` | `/api/orders/:orderId?mobile=X` | Look up order status with verified mobile or email |
| `GET` | `/api/settings/public` | Public store configuration (currency, WhatsApp, policies) |

### Protected Admin Endpoints (`Authorization: Bearer <token>`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/admin/login` | Authenticate administrator and receive JWT token |
| `GET` | `/api/admin/products` | Retrieve complete catalogue including inactive items |
| `POST` | `/api/admin/products` | Add new product to catalogue |
| `PUT` | `/api/admin/products/:id` | Update product attributes, prices, stock |
| `DELETE` | `/api/admin/products/:id` | Remove product from catalogue |
| `GET` | `/api/admin/orders` | List all orders placed on store |
| `PATCH` | `/api/admin/orders/:id/status` | Update order status (`confirmed`, `shipped`, `delivered`, etc.) |
| `GET` | `/api/admin/settings` | Retrieve internal store settings |
| `PUT` | `/api/admin/settings` | Update store configuration |

---

## Credentials & Integrations Status

### Features that work 100% WITHOUT external credentials:
1. Complete product catalogue browsing, category hierarchy, and multi-filter search.
2. Full product detail pages with gallery zoom, size guide, fabric tabs, and PIN code validation.
3. Shopping bag, local storage persistence, and coupon discount engine.
4. Complete order submission workflow with server-side revalidation and unique Order ID generation.
5. Order tracking with phone/email verification and 4-stage fulfillment timeline.
6. WhatsApp click-to-chat links with prefilled messages for product inquiries and cart sharing.
7. Protected admin portal with product CRUD, inventory management, order status transitions, and store settings updates.

### Optional integrations requiring external credentials:
1. **Live Online Payment Gateway (e.g. Razorpay / Cashfree)**:
   - Interface is fully prepared. To enable live online card/UPI capturing, supply `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `.env` and verify signatures in `order.service.js`.
2. **Automated Transactional WhatsApp API (e.g. Gupshup / Twilio / Meta Cloud API)**:
   - Currently uses official `wa.me` click-to-chat protocol. For automated server-initiated outbound WhatsApp notifications, an approved Meta Business WhatsApp Cloud API key is required.
3. **Automated PIN Code Courier Tracking (e.g. Shiprocket / Delhivery API)**:
   - To query live courier waybills rather than the local status history, add courier logistics credentials.

---

## Production Limitations & Future Scaling Recommendations

1. **Local JSON Concurrency**:
   - The current data-access layer uses local file system operations with atomic renames and a serialized write queue. This works flawlessly for small-to-medium boutique shops and single-instance deployments.
   - **Recommendation for High-Traffic Scaling**: Replace `backend/services/file.service.js` with **MongoDB (Mongoose)** or **PostgreSQL (Prisma)**. Because the data access layer is completely isolated, switching to a database requires no changes to controllers or frontend components.
2. **Horizontal Scaling**:
   - Multiple backend server instances behind a load balancer will need a centralized database rather than local file persistence.
3. **Product Media Storage**:
   - Product photographs are currently loaded from remote CDN / Unsplash URLs. For production shop owners uploading custom high-res photography, an S3-compatible object store (AWS S3, Cloudflare R2) with automated WebP compression should be configured.
