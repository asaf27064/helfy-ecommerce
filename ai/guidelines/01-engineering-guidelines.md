# Engineering Guidelines & Constraints

> These are the non-negotiable conventions the AI MUST follow for **every** file it
> generates in this project. When a prompt and these guidelines conflict, **these win**.
> Treat this file as the project's constitution.

## 0. Prime Directive: Zero-Touch Runnability
The single most important constraint. After `git clone`, the **only** commands a human runs are:

```bash
cp .env.example .env   # optional – sane defaults are already baked into docker-compose
docker compose up
```

Then the app is fully usable at `http://localhost:8080`. No `npm install`, no manual
migrations, no manual seeding, no extra config. If a generated change would break this,
the change is wrong. **Optimize every decision for this guarantee.**

## 1. Language & Runtime
- **JavaScript (ES Modules)** across the whole stack. No TypeScript.
  - *Rationale (documented decision, not an oversight):* under a hard 3-hour budget,
    plain JS removes a whole class of compile/type-config failures and keeps the
    generation **zero-touch and deterministic**. Type safety is instead enforced at the
    boundaries via **runtime validation (Zod)** on every API input.
- Node.js `20-alpine` in Docker. React via **Vite**.
- `"type": "module"` in every `package.json`; use `import`/`export`, never `require`.

## 2. Repository / Folder Structure (authoritative)
```
helfy-ecommerce/
├─ docker-compose.yml          # 3 services: db, server, client
├─ .env.example                # documented; compose works WITHOUT it via defaults
├─ initial.md                  # the bootstrap prompt
├─ README.md                   # manual-intervention / AI-Gap log
├─ ai/                         # the "engine" — guidelines + capabilities
├─ docs/ai-interactions.md     # prompt + model log
├─ db/
│  └─ init/                    # *.sql auto-run by MySQL on first boot (schema + seed)
├─ server/
│  ├─ Dockerfile
│  └─ src/
│     ├─ index.js              # app bootstrap + graceful shutdown
│     ├─ config/               # env, db pool
│     ├─ middleware/           # auth, error handler, validate
│     ├─ routes/               # thin: wire url -> controller
│     ├─ controllers/          # request/response only
│     ├─ services/             # business logic (no req/res here)
│     ├─ db/                   # query helpers / repositories
│     └─ utils/                # jwt, password, http errors
└─ client/
   ├─ Dockerfile               # multi-stage: vite build -> nginx
   ├─ nginx.conf               # serve SPA + proxy /api -> server
   └─ src/
      ├─ main.jsx, App.jsx
      ├─ api/                  # axios client + endpoint modules
      ├─ context/             # AuthContext, CartContext
      ├─ components/          # reusable, presentational
      ├─ pages/               # route-level screens
      ├─ hooks/
      └─ lib/                 # formatting, constants
```

## 3. Architectural Patterns
- **Backend = layered**: `route → controller → service → db`. A layer may only call the
  layer directly below it. Controllers never contain SQL; services never touch `req`/`res`.
- **Parameterized SQL only** via `mysql2/promise` pooled connections. **Never** string-
  concatenate user input into SQL.
- **Frontend = feature-grouped, container/presentational split.** Global state only for
  cross-cutting concerns (auth, cart) via Context; everything else is local/props.
- **Stateless API + JWT.** No server session store needed → horizontally scalable.

## 4. Naming Conventions
- Files: React components `PascalCase.jsx`; everything else `camelCase.js`.
- Variables/functions `camelCase`; constants `UPPER_SNAKE`; DB tables/columns
  `snake_case`; JSON API fields `camelCase` (map at the repository layer).
- REST: plural nouns, kebab where needed — `/api/products`, `/api/orders/:id`,
  `/api/cart/items`.

## 5. Error Handling Strategy (uniform)
- One custom `ApiError(status, message, code?)` class. Services throw it; never `res.send`
  from a service.
- A single Express **error-handling middleware** is the only place that formats error
  responses. Shape is always:
  ```json
  { "error": { "message": "Human readable", "code": "OPTIONAL_CODE" } }
  ```
- `asyncHandler` wrapper around every async controller so rejected promises reach the
  error middleware (no unhandled rejections).
- Validation failures → `400`; auth → `401`; forbidden → `403`; missing → `404`.
- Frontend: a single axios response interceptor surfaces `error.message` to a toast and
  redirects to `/login` on `401`.

## 6. Security Baseline (always on)
- Passwords hashed with **bcrypt** (cost ≥ 10). Never stored or logged in plaintext.
- JWT signed with `JWT_SECRET`, short-ish expiry; sent as `Authorization: Bearer`.
- `helmet`, `cors` (locked to client origin), and per-route input validation (Zod).
- Secrets only via env vars. **No secret is ever hard-coded** in source.

## 7. Coding Standards
- Small, single-responsibility functions. Early returns over nested `if`.
- No dead code, no commented-out blocks, no `console.log` in committed server code
  (use a tiny logger util). Meaningful names over comments; comment only the *why*.
- Every list endpoint supports `page`, `limit`, and returns
  `{ data, page, limit, total }`.
- Money stored as `DECIMAL(10,2)`; never float arithmetic for prices on the server.

## 8. Definition of Done (the AI self-checks before declaring a feature complete)
1. `docker compose up` from a clean clone serves a working app.
2. The happy path of the feature works end-to-end in the browser.
3. Errors return the standard error shape; the UI shows a friendly message.
4. No new manual setup step was introduced.
