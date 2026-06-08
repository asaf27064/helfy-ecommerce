# Capability Definitions

> The reusable building blocks the AI may assemble when generating features. Think of
> these as the "standard library" of this project. Prefer composing these over inventing
> new patterns. Each capability lists its **contract** so features stay consistent.

## A. Authentication & Identity
- **Strategy:** stateless **JWT**. `bcrypt` for password hashing.
- **Capabilities:**
  - `hashPassword(plain)` / `verifyPassword(plain, hash)` — `utils/password.js`
  - `signToken(payload)` / `verifyToken(token)` — `utils/jwt.js`
  - `requireAuth` middleware → attaches `req.user = { id, email }`, else `401`.
- **Endpoints:** `POST /api/auth/register`, `POST /api/auth/login`,
  `GET /api/auth/me`.
- **Frontend contract:** `AuthContext` exposes `{ user, token, login, register, logout }`,
  persists token to `localStorage`, and hydrates `user` on load via `/auth/me`.

## B. Data Access Layer (Repositories)
- One repository module per aggregate (`productRepo`, `cartRepo`, `orderRepo`,
  `userRepo`). Repositories own **all** SQL and map `snake_case` rows → `camelCase`.
- Shared helpers: `db/pool.js` (singleton `mysql2` pool), `query(sql, params)`,
  `withTransaction(fn)` for multi-statement writes (checkout uses this).
- **Contract:** repositories return plain JS objects/arrays, never raw driver rows or
  `req`/`res`.

## C. Product Catalog
- **Search/filter capability:** `GET /api/products?search=&category=&minPrice=&maxPrice=
  &sort=&page=&limit=` → `{ data, page, limit, total }`. Built by composing safe,
  parameterized `WHERE` fragments.
- `GET /api/products/:id` → product + images + category.
- `GET /api/categories` → for filter UI.
- Seed catalog must be **visually rich** (real-looking names, prices, image URLs) so the
  premium UI has something to show.

## D. Cart (Persistent)
- **Logged-in:** server-persisted in `cart_items` keyed by `user_id` → survives refresh
  and device change.
- **Guest:** mirrored in `localStorage`; on login the guest cart **merges** into the
  server cart.
- **Endpoints:** `GET /api/cart`, `POST /api/cart/items`, `PATCH /api/cart/items/:id`,
  `DELETE /api/cart/items/:id`.
- **Frontend contract:** `CartContext` exposes `{ items, count, subtotal, add, update,
  remove, clear }` and is the single source of truth for cart UI.

## E. Checkout & Orders
- **Multi-step checkout** (Shipping → Payment(mock) → Review) — client wizard, single
  submit at the end.
- `POST /api/orders` runs inside a **transaction**: snapshot cart → create `order` +
  `order_items` with price-at-purchase → clear cart → return order. Mock payment always
  "succeeds" (clearly labelled, no real PSP).
- `GET /api/orders` (history for `req.user`), `GET /api/orders/:id` (detail, ownership-
  checked).

## F. Account / Profile
- `GET /api/profile`, `PATCH /api/profile` (name, address). Order history reuses (E).

## G. UI Composition Kit (Frontend)
- **Design system primitives** (presentational, reusable): `Button`, `Input`, `Badge`,
  `Card`, `Modal`, `Skeleton`, `Toast`, `EmptyState`, `Price`, `QuantityStepper`.
- **Layout:** `Navbar` (with live cart badge + auth state), `Footer`, `Container`,
  `PageTransition` (Framer Motion fade/slide between routes).
- **Premium aesthetic rules:** generous whitespace, one accent color + neutral scale,
  rounded-2xl cards, soft shadows, hover/tap micro-interactions via Framer Motion,
  responsive grid, skeleton loaders instead of spinners, accessible focus states.
- **Data fetching:** thin `api/` modules wrap axios; pages own loading/error/empty states
  using `Skeleton`/`EmptyState`.

## H. Cross-Cutting
- **Validation:** Zod schema per write endpoint via a `validate(schema)` middleware.
- **Config:** all tunables (ports, DB creds, JWT secret/expiry, CORS origin) read from
  env with safe defaults in `config/env.js`.
- **Health:** `GET /api/health` returns `{ status: 'ok' }`; used by the client/compose to
  know the API is ready.
