# Helfy Shop

A production-grade Health & Wellness eCommerce store built as a Docker-first monorepo.

## Quick Start

```bash
# Optional — defaults are baked into docker-compose.yml
cp .env.example .env

# Start everything (db + server + client/nginx)
docker compose up
```

Open **http://localhost:8080** — the store is ready.

> **No** `npm install`, no manual migrations, no seed commands needed.
> MySQL auto-runs `db/init/*.sql` on first boot.

---

## Demo Credentials

| Field    | Value                   |
|----------|-------------------------|
| Email    | demo@helfy.shop         |
| Password | Password123!            |

---

## Stack

| Layer     | Technology                                          |
|-----------|-----------------------------------------------------|
| Frontend  | React 18 + Vite + Tailwind CSS + Framer Motion      |
| Backend   | Node.js 20 + Express (ES Modules) + Zod validation  |
| Database  | MySQL 8                                             |
| Proxy     | nginx (serves SPA + proxies `/api` to Express)      |
| Auth      | JWT (stateless) + bcrypt                            |

---

## Project Structure

```
helfy-ecommerce/
├─ docker-compose.yml      # 3 services: db, server, client
├─ .env.example            # all tunables documented; compose works without it
├─ db/init/                # *.sql auto-run by MySQL on first boot
├─ server/                 # Express API — layered: route -> controller -> service -> db
└─ client/                 # Vite React SPA — served by nginx
```

---

## Development (without Docker)

```bash
# Terminal 1 — start MySQL locally or point DB_* env vars at an existing instance
cd server && npm install && npm run dev

# Terminal 2
cd client && npm install && npm run dev
```

The Vite dev server proxies `/api` to `localhost:3000`.

---

## Environment Variables

See `.env.example` for the full list. All variables have safe defaults so the
app starts with `docker compose up` and no `.env` file.

---

## Architecture Decisions Log

| Decision | Choice | Reason |
|----------|--------|--------|
| Language | JavaScript (ES Modules), no TypeScript | Zero compile-config failures under a tight build budget; runtime safety via Zod |
| Auth | Stateless JWT | No server session store; horizontally scalable |
| Cart persistence | Server DB for auth users, localStorage for guests | Survives refresh & device change; guest cart merges on login |
| Money precision | `DECIMAL(10,2)` in MySQL, no float arithmetic | Avoids floating-point rounding errors |
| Image source | Picsum (`https://picsum.photos/seed/<slug>/800/800`) | No API key, deterministic per slug, zero setup |
| DB-wait strategy | Server-side retry loop (30 x 1 s) in `index.js` | No shell dependency (`wait-for-it.sh`); works on any base image |

---

## Manual Interventions / AI-Gap Log

| # | What broke | Fix applied | Why the AI missed it |
|---|-----------|-------------|----------------------|
| 1 | `docker compose up --build` failed with **EUSAGE: `npm ci` requires a `package-lock.json`** in both `server/Dockerfile` and `client/Dockerfile`. | Replaced `npm ci --omit=dev` with `npm install --omit=dev` (server) and `npm ci` with `npm install` (client build stage). | The AI generated `package.json` files in isolation without materialising a `package-lock.json` alongside them. The `COPY package-lock.json* ./` glob in the original Dockerfiles silently succeeded (a glob matching zero files is not an error), masking the missing lockfile until `npm ci` ran and hard-errored at runtime. The AI should have either committed a lockfile or unconditionally used `npm install`. |
| 2 | `GET /api/products` (list with filters) returned **500 `Incorrect arguments to mysqld_stmt_execute`** (errno 1210). | Changed the shared `query()` helper in `server/src/db/pool.js` from `pool.execute(...)` to `pool.query(...)`. | A cross-file inconsistency the AI introduced: it wrote the shared DB helper to use `pool.execute()` (MySQL **prepared** protocol) while writing `productRepo.listProducts` with `LIMIT ? OFFSET ?` bound parameters. The prepared protocol rejects bound LIMIT/OFFSET values (it sends them as strings), so the statement only fails at runtime on the list endpoint — not on any of the non-paginated queries. Generating the two files independently, the AI never reconciled the protocol choice with the LIMIT placeholders. |

> **Note on backend generation (Phase 3).** The Express service/controller/route layer, a
> clean rewrite of `orderRepo.js`, and the `pool.js` fix above were generated with a
> secondary AI tool (Claude Code) after the provided Cline token budget ran low during the
> backend phase. This was a deliberate, time-boxed decision to protect the zero-touch
> guarantee and keep budget for the frontend; the generated code follows the same
> `ai/` guidelines and was verified end-to-end via the API smoke test (register, login,
> catalog filters, cart, checkout, order history). See `docs/ai-interactions.md` for the
> full tool/model breakdown.
