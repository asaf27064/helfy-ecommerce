# AI Interactions Log

This document records the full AI-assisted process used to produce this project: the
tools, the models (and *why* each was chosen at each step), and the prompts / planning /
architecture inquiries. It is maintained by hand because it spans tools that can't see
each other (the agent, the strategy advisor, web searches).

---

## Tools & Extensions Used
| Tool | Role in this project |
|------|----------------------|
| **Cline** (VS Code extension) | Primary autonomous coding agent — generated the application code. |
| **OpenRouter** (provider inside Cline) | Model gateway; gave access to multiple models through one key. |
| **Claude Code** (Anthropic CLI) | Strategy / architecture advisor — used to *design the AI Blueprint* (the `initial.md`, engineering guidelines, capability definitions, `.clinerules`) and to make tooling/model decisions before driving Cline. Did **not** generate the application code. |
| Docker / Docker Compose | Runtime for the zero-touch `docker compose up` deliverable. |

## Models Used — and Why
| Model | Where it was used | Why this model |
|-------|-------------------|----------------|
| **Claude Opus 4.8** | (a) Designing the AI Blueprint with Claude Code; (b) Cline **Plan Mode** for the execution plan; (c) reserved for hard architecture/debugging walls. | Strongest reasoning — best for system design and tracing zero-touch/Docker failures. Used sparingly because it's the most expensive. |
| **Claude Sonnet 4.6** | Cline **Act Mode** — the default workhorse for all bulk code generation (routes, components, SQL, etc.). | ~Frontier coding quality at a fraction of Opus's token cost — the right default under a fixed token budget. |
| **Claude Haiku 4.5** | Trivial filler (seed data text, repetitive boilerplate) where applicable. | Cheapest; quality is irrelevant for trivial generation, so it preserves budget. |

**Extended thinking policy:** ON for Plan Mode and stubborn debugging (reasoning-heavy);
OFF for routine code generation to conserve the token budget.

**Language decision (deliberate, not an oversight):** chose **JavaScript over TypeScript**
even though the brief's example mentioned TS. Rationale: under a hard 3-hour budget, plain
JS removes a class of compile/type-config failures and keeps generation deterministic and
zero-touch. Type-safety is instead enforced at the API boundary via **Zod** runtime
validation.

---

## Chronological Log

### Step 0 — Assignment intake
- Received the assignment + a Cline API key pre-loaded on OpenRouter.
- Decided to do the real generation **in Cline on their key** (observable process, matches
  their instructions, produces clean prompt/model logs) rather than in another tool.

### Step 1 — Blueprint design (advisor: Claude Code, model: Opus 4.8)
Planning/architecture inquiry. Designed the "engine" before any code:
- `ai/guidelines/01-engineering-guidelines.md` — conventions & constraints (zero-touch
  prime directive, layered backend, naming, uniform error shape, security baseline, DoD).
- `ai/capabilities/02-capabilities.md` — reusable building blocks (auth, repositories,
  catalog, persistent cart w/ guest-merge, transactional checkout, UI kit).
- `initial.md` — bootstrap prompt: fixed stack, build order, acceptance checklist.
- `.clinerules` — auto-loaded rules pointing Cline at the engine + Plan/Act discipline.

### Step 2 — Tooling setup
- Cline → API Provider: OpenRouter → pasted provided key.
- Default model set to **Claude Sonnet 4.6**; model-switching strategy decided (table above).

### Step 3 — Plan Mode (model: Opus 4.8, thinking ON)
Prompt given to Cline:
> Read `initial.md`, `.clinerules`, and the files in `ai/`. Don't write any code yet. Give
> me your execution plan: the phase breakdown, the full folder/file tree you intend to
> create, your Docker/compose strategy for zero-touch `docker compose up`, and any
> decisions you need from me.

Cline returned a 5-phase plan (~70 files) and asked 5 decisions. My answers:
1. Accent: emerald/teal + deep-slate neutral scale (premium contrast).
2. Product domain: Health & Wellness (on-brand for "Helfy").
3. JWT expiry: 7d (fewer re-logins during review).
4. Images: Picsum seeded URLs first (guaranteed to load → protects zero-touch & design),
   optionally hand-upgrade hero images to Unsplash.
5. Phase gating: verify `docker compose up` after Phase 1 (infra) and Phase 3 (backend),
   not blind-build all 5.

### Step 4 — Act Mode: Phase 1 (Infra) — model: Sonnet 4.6, thinking OFF
Prompt (paraphrased): _"Execute Phase 1 (compose + infra) per the approved plan, using my
confirmed decisions (emerald/teal + deep-slate, Health & Wellness, JWT 7d, Picsum seeded
images). Enforce .clinerules/initial.md/ai/ as binding; zero-touch on :8080; compose must
work with no .env via ${VAR:-default}; complete files only; don't touch
docs/ai-interactions.md; stop and give verification steps after Phase 1."_

Result: **17 files** generated (the full project skeleton, no app logic yet):
- Root: `docker-compose.yml`, `.env.example`, `README.md`
- DB: `db/init/.gitkeep` (SQL deferred to Phase 2)
- Server: `Dockerfile`, `package.json`, `src/config/env.js`, `src/index.js`
  (Node 20 Alpine; retries DB connect up to 30× before binding; `GET /api/health → {status:"ok"}`)
- Client: `Dockerfile`, `nginx.conf`, `package.json`, `index.html`, `vite.config.js`,
  `tailwind.config.js`, `postcss.config.js`, `src/index.css`, `src/main.jsx`, `src/App.jsx`
  (multi-stage Vite build → nginx 1.27 Alpine; SPA fallback + `/api` proxy to `server:3000`; exposes `:8080`)
- Compose uses `${VAR:-default}` fallbacks → no `.env` required.

Verification requested by Cline (to run before Phase 2):
- `docker compose up --build`
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:8080` → expect `200`
- `curl -s http://localhost:8080/api/health` → expect `{"status":"ok"}`
- Browser `http://localhost:8080` → dark Helfy loading screen (three bouncing emerald dots).

Verification outcome: **Build FAILED on first attempt** — `server` image build errored at
`RUN npm ci --omit=dev` with `EUSAGE: npm ci ... requires an existing package-lock.json`.
Root cause: Cline used `npm ci` but generated `package.json` without committing a lockfile;
the `COPY package-lock.json*` glob silently copied nothing, masking the missing file until
build time. (See README "Manual Interventions / AI-Gap" — AI-Gap #1.)

Corrective prompt to Cline (model: Sonnet 4.6):
> The build failed: `npm ci` requires a committed package-lock.json... Replace `npm ci`
> with `npm install` in BOTH server/Dockerfile and client/Dockerfile, add a README AI-Gap
> entry, and re-give the verify commands.

Re-verification outcome: **PASS** — after switching `npm ci` → `npm install` in both
Dockerfiles, `docker compose up --build` came up clean; `:8080` served the React loading
screen and `/api/health` returned `{"status":"ok"}`.

_Budget checkpoint:_ ~1M tokens consumed through Phase 1 + planning. Adopted token-saving
measures for Phases 2–5: a fresh Cline task per phase (drops accumulated context;
`.clinerules` re-anchors cheaply), thinking OFF for Act-mode generation, minimal back-and-forth.

### Step 5 — Phase 2 (Database) — model: Sonnet 4.6 (fresh Cline task to reset context)
Prompt (paraphrased): _"Phase 2 (Database) only: 01_schema.sql (8 tables — users,
categories, products, product_images, addresses, cart_items, orders, order_items — InnoDB,
utf8mb4, FKs, indexes, DECIMAL(10,2) money, snapshot columns on orders/order_items);
02_seed.sql (6 H&W categories, 25 products, 50 Picsum images, demo user). Init scripts run
on fresh volume only — remind me to `docker compose down -v`."_

**Sub-step — verified bcrypt hash (avoided a likely AI-Gap):** rather than let the model
hallucinate a bcrypt hash for the demo user (a common failure that breaks login), I had it
generate a *real* one with the bcrypt library:
`node --input-type=module -e 'import bcrypt from "bcrypt"; console.log(await bcrypt.hash("Password123!", 10));'`
→ `$2b$10$X9n6QBZ...` then fed that exact string back to Cline to embed verbatim in the seed.
- _Shell gotcha (host issue, not the AI):_ first attempt failed with `bash: !': event not
  found` — bash history-expansion on the `!` in the password inside double quotes. Fixed by
  flipping to single-quoted `-e` script.
- _Tooling note:_ Cline split the demo email via `CONCAT('demo','@','helfy.shop')` and set
  `first_name/last_name` via a follow-up `UPDATE` to dodge an over-eager PII redaction filter
  on the provider — a quirk worth noting but harmless (resolves to `demo@helfy.shop`).

Result: 8 tables, 25 products, 50 images, 1 demo user; insert order respects FKs; column
lists match schema; demo hash matches the generated string exactly. Static review passed;
runtime verified via `docker compose down -v && up` + `SHOW TABLES` / `SELECT COUNT(*)`.

### Step 6 — Phase 3 (Backend) — split across Cline (Sonnet 4.6) + Claude Code (fallback)
Cline (Sonnet 4.6) generated the lower layers — `config/env`, `db/pool`, `utils` (ApiError,
asyncHandler, jwt, password, logger), `middleware` (requireAuth, validate, errorHandler),
and the five repositories — then the **provided token budget ran low** (≈140k of 200k
context used, ~1M+ tokens spent). To protect the zero-touch guarantee and reserve budget
for the frontend, I completed the remaining backend layer with **Claude Code (Opus 4.8)**:
- Generated: all **services** (auth, product, category, cart, order, profile), all
  **controllers**, all **routes** (with Zod validation schemas), wired `index.js`, and a
  **clean rewrite of `orderRepo.js`** (the provider's PII filter had corrupted a couple of
  identifiers in Cline's version).
- This is a deliberate "AI-Gap" call — documented in README. Same `ai/` guidelines obeyed.

**Verification (full API smoke test through nginx on :8080):**
- demo login `demo@helfy.shop / Password123!` → JWT issued ✅ (proves the seeded bcrypt hash)
- `GET /auth/me`, `GET /categories`, `GET /products/:id` ✅
- cart add → checkout (subtotal 69.98, free shipping > $50, 8% tax 5.60, total 75.58) ✅
- order history ✅; unauthenticated `GET /cart` → 401 standard error shape ✅
- **AI-Gap #2 found & fixed:** `GET /products` (paginated list) → 500
  `Incorrect arguments to mysqld_stmt_execute`. Cause: `pool.js` used `pool.execute()`
  (prepared protocol) while `productRepo` used `LIMIT ? OFFSET ?` — prepared statements
  reject bound LIMIT/OFFSET. Fix: switch the shared `query()` helper to `pool.query()`
  (text protocol). Re-tested: search/category/price/pagination filters all pass.

### Step 7 — Phase 4 (Frontend) — Claude Code (Opus 4.8), fallback (Cline budget spent)
With the Cline/OpenRouter budget effectively exhausted, the full React frontend was
generated with Claude Code, reusing the premium Tailwind theme + component classes Cline
had already defined in Phase 1 (`primary` emerald scale, deep-slate neutrals, `.btn-*`,
`.card`, `.input`, `shadow-glow`).

Generated (~30 files):
- `api/` axios client (JWT interceptor, error-shape normalization) + endpoint modules.
- `context/` AuthContext (token hydrate via `/auth/me`), CartContext (server cart for
  logged-in users, localStorage guest cart, **guest→server merge on login**), ToastContext.
- `components/` UI kit (Button, Price, Skeleton, QuantityStepper, EmptyState) + layout
  (Navbar with live cart badge + auth state, Footer, Container, PageTransition) +
  ProductCard, ProtectedRoute.
- `pages/` Home/Catalog (debounced search, category + sort filters, pagination, skeletons),
  ProductDetail (gallery + stepper), Cart, multi-step Checkout (Shipping→Payment(mock)→
  Review), Login, Register, Account (profile edit + order history), NotFound.
- Router + providers wired in `App.jsx` / `main.jsx` with Framer Motion route transitions.

**Verification:** Vite production build succeeded (no import/syntax errors, 357 KB JS).
Full stack `docker compose up` → SPA `200` on :8080, SPA deep-link fallback `200`,
`/api/products` returns 25 through the nginx proxy, all containers healthy.

### Step 8 — Phase 5 (Polish / final) — pending visual QA in browser
- Outstanding nice-to-haves (non-blocking): add `client/public/favicon.svg` (currently 404s),
  move the Inter `@import` to a `<link>` in `index.html` so the premium font loads.

---

## Web / External Queries
<Log any Google searches, ChatGPT questions, or docs lookups here as you make them, e.g.
"searched: mysql2 pool ECONNREFUSED on docker compose first boot — confirmed retry-loop
approach.">

---

## Manual Interventions (cross-reference README.md)
<Each time you fix something by hand, add a one-liner here and the full entry in README.md.>
