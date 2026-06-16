<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Anera Foods — Project Progress

## Overview

**Anera Foods** is a premium Sri Lankan food e-commerce web app built with **Next.js 16**, **React 19**, and **Tailwind CSS v4**. It targets online sales of snacks, ready-to-eat products, and specialty spices, with Cash on Delivery (COD) checkout and island-wide shipping.

---

## What Has Been Built So Far

### 1. Project scaffolding

- Next.js App Router app (`anera-foods` v0.1.0)
- Tailwind CSS v4 design system with a Sri Lankan premium brand palette (jungle green `#1E3A2F`, terracotta `#C27D38`, cream `#FDFBF7`)
- Google fonts: **Playfair Display** (serif headings) and **Outfit** (sans body)
- Shared layout with `Header`, `Footer`, and global metadata/SEO
- Reusable UI primitives in `globals.css` (buttons, cards, badges, animations)

### 2. Customer-facing storefront

| Route | Purpose |
|-------|---------|
| `/` | Home page — hero, featured products, brand story, testimonials, CTA |
| `/products` | Product catalog with search, category filters, and sort |
| `/products/[id]` | Product detail page with add-to-cart |
| `/checkout` | COD checkout form, district-based shipping, order placement |
| `/track` | Order tracking by order number + phone |
| `/about` | Brand/about page |
| `/faq` | Frequently asked questions |
| `/contact` | Contact page |
| `/privacy` | Privacy policy |
| `/login` | Login |
| `/signup` | Customer registration |

**Cart system** (`CartContext`):
- localStorage-backed cart (`anr_cart`)
- District selection for Sri Lanka shipping rates
- Subtotal, shipping, and grand total calculations
- Stock-aware quantity limits

### 3. Authentication & authorization (RBAC)

**Roles:** `superadmin`, `admin`, `customer`

**Auth stack:**
- JWT access tokens (15 min, in memory) + refresh tokens (7 days, HttpOnly cookie) via **jose**
- Password hashing with SHA-256 + salt (`src/lib/crypt.js`, Edge-compatible Web Crypto)
- `AuthContext` for client session state and silent token refresh
- Next.js middleware protecting `/admin/*` and `/my-orders/*`

**API routes:**
- `POST /api/auth/login`
- `POST /api/auth/signup`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

**Pre-seeded demo accounts** (in `src/lib/db.js`):
- `superadmin@anera.foods` — superadmin
- `staff@anera.foods` — admin
- `customer@anera.foods` — customer

### 4. Data layer

- **Firebase Firestore** via `firebase-admin` (`src/lib/db-server.js`) — no localStorage for app data
- Client components call `/api/db` through the proxy in `src/lib/db.js`
- Auto-seeds default roles, users, and products on first run
- Cart still uses `localStorage` (`anr_cart`) for client-side session only

### RBAC

- Roles in Firestore `roles` collection with granular permissions
- Super admin manages roles at **`/admin/roles`**
- Middleware + API routes enforce permissions

### 5. Admin dashboard (`/admin`)

Protected admin area with sidebar layout:

| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard — sales metrics, recent orders, low-stock alerts, pixel event counts, category sales chart |
| `/admin/products` | Product management (add/edit/delete) |
| `/admin/inventory` | Stock levels and availability |
| `/admin/orders` | Order list, status updates, filtering |
| `/admin/customers` | Customer/user list |
| `/admin/analytics` | Pixel event analytics and conversion funnel |
| `/admin/roles` | Roles & permissions management (super admin) |

### 6. Order flow & email

- Checkout creates orders in the database with auto-generated order numbers
- Stock decremented on order placement
- District-based shipping cost calculation (all 25 Sri Lanka districts supported)
- `src/lib/email.js` — order confirmation emails via **Resend** (when `RESEND_API_KEY` is set) or simulated console output in dev

### 7. Analytics / pixel tracking

- `PixelTracker` component logs page views on route changes
- Events stored in `anr_pixel_logs`: `PageView`, `AddToCart`, `InitiateCheckout`, `Purchase`
- Admin dashboard and analytics page surface funnel metrics

### 8. Shared components

- `Header.js` — navigation, cart badge, auth-aware menu
- `Footer.js` — site links and branding
- `ProductCard.js` — catalog card with stock badge
- `PixelTracker.js` — client-side event logger

---

## Tech Stack Summary

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16.2.9 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| Auth | jose (JWT), HttpOnly cookies, middleware |
| Data | localStorage (dev) / Firebase Firestore (prod-ready) |
| Email | Resend (optional) |

---

## Environment Variables (optional)

| Variable | Purpose |
|----------|---------|
| `JWT_ACCESS_SECRET` | Access token signing secret |
| `JWT_REFRESH_SECRET` | Refresh token signing secret |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase activation |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase activation |
| `RESEND_API_KEY` | Live order confirmation emails |

---

## Known Limitations / Not Yet Done

- Firebase credentials must be configured in `.env.local` before the app can read/write data
- `/my-orders` route referenced in middleware but not yet implemented as a customer page
- Payment is COD-only — no online payment gateway
- No automated tests
- Production deployment not configured

---

## How to Run

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).
