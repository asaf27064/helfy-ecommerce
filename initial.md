# initial.md — Bootstrap Prompt

You are a senior full-stack engineer generating a **production-grade eCommerce platform**
end-to-end. Before writing any code, **load and obey** these two files as hard constraints:

- `ai/guidelines/01-engineering-guidelines.md` — conventions & constraints (the constitution)
- `ai/capabilities/02-capabilities.md` — the reusable building blocks to assemble

If anything you are about to do would violate the **Prime Directive (zero-touch
runnability)** in the guidelines, stop and choose a different approach.

---

## Mission
Generate a complete, runnable monorepo for **"Helfy Shop"**, a modern eCommerce store, that
starts with a single command and is immediately usable in the browser.

## Stack (fixed)
- **Frontend:** React + Vite + **Tailwind CSS** + **Framer Motion** + React Router + axios.
- **Backend:** Node.js + **Express** (ES modules), `mysql2/promise`, `jsonwebtoken`,
  `bcrypt`, `zod`, `helmet`, `cors`.
- **Database:** **MySQL 8**, schema + seed auto-loaded from `db/init/*.sql`.
- **Orchestration:** Docker Compose (`db`, `server`, `client`), client served by nginx
  which also proxies `/api` to the server.

## Build Order (do them in this sequence, verifying runnability as you go)
1. **Compose & infra first.** Write `docker-compose.yml`, both `Dockerfile`s,
   `client/nginx.conf`, and `.env.example`. Compose must work **with no `.env`** using
   `${VAR:-default}` fallbacks. `db` has a healthcheck; `server` `depends_on` db healthy;
   `client` depends on `server`. Expose the app on **`localhost:8080`**.
2. **Database.** `db/init/01_schema.sql` (tables: `users`, `categories`, `products`,
   `product_images`, `cart_items`, `orders`, `order_items`, `addresses` — with FKs,
   indexes, `DECIMAL(10,2)` money) and `db/init/02_seed.sql` (≥ 5 categories, ≥ 24
   realistic products with image URLs, one demo user
   `demo@helfy.shop` / `Password123!`).
3. **Backend.** Build the layered API per the capabilities: config/env + db pool, auth
   utils + `requireAuth`, error middleware + `asyncHandler` + `validate(zod)`, then
   repositories → services → controllers → routes for **auth, products, categories, cart,
   orders, profile, health**. Seed-aware, parameterized SQL only.
4. **Frontend.** Vite app with Tailwind theme (premium tokens), `AuthContext` +
   `CartContext`, axios client + interceptors, the UI composition kit, and pages:
   - **Home/Catalog** (search, category + price filters, sort, responsive product grid,
     skeleton loaders)
   - **Product Detail** (gallery, add-to-cart, quantity stepper)
   - **Cart** (persistent, live totals, quantity edit/remove)
   - **Checkout** (multi-step wizard: Shipping → Payment(mock) → Review → place order)
   - **Auth** (login + signup, validation, friendly errors)
   - **Account** (profile edit + order history with detail)
   - **Navbar** with live cart badge + auth state, animated route transitions.
5. **Polish & verify.** Run `docker compose up` from clean, click the full happy path
   (browse → filter → add to cart → checkout → see order in history), fix anything that
   breaks zero-touch, and ensure empty/loading/error states look intentional.

## Acceptance Criteria (self-check before declaring done — see guidelines §8)
- [ ] Fresh clone + `docker compose up` → working store at `http://localhost:8080`, **zero**
      manual steps beyond the optional `.env` copy.
- [ ] Register/login works; protected routes reject unauthenticated requests with `401`.
- [ ] Catalog search/filter/sort/pagination all function against seeded data.
- [ ] Cart persists across refresh for a logged-in user; guest cart merges on login.
- [ ] Multi-step checkout creates an order that then appears in account order history.
- [ ] All errors use the standard `{ error: { message, code } }` shape and a friendly UI.
- [ ] The UI looks **premium**: cohesive theme, motion, responsive, polished empty states.

## Output Discipline
- Generate real, complete files (no `// ...` placeholders, no TODOs left in code paths).
- Keep each file consistent with the naming/structure/error rules in the guidelines.
- When a decision is genuinely ambiguous, pick the option that best protects zero-touch
  runnability and note it in `README.md`.
