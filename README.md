# Zoltraak

Zoltraak is a full-stack quick-commerce platform built as a TypeScript monorepo. It includes a customer storefront, an admin/seller dashboard, authentication, inventory and order management, S3-based media uploads, and Razorpay payments.

## 1) Project Overview

### What this project does

Zoltraak enables users to browse grocery products, add items to a cart, and place orders, while giving admins/sellers tools to manage:

- Products
- Warehouses
- Inventories
- Delivery persons
- Orders

### Problem it solves

Quick-commerce systems are operationally complex: product cataloging, stock reservation, delivery assignment, and payment processing all need to work together reliably.
Zoltraak solves this by combining customer and operations workflows in one platform with clear role-based access and transactional backend logic.

### Key features

- Role-based authentication (user/admin) with Better Auth + Google provider
- Customer storefront with category/sort filtering and cart persistence
- Admin dashboard for managing products, warehouses, inventory, delivery partners, and orders
- Direct-to-S3 product image uploads via presigned URLs
- Transactional order creation with inventory reservation and delivery assignment
- Razorpay checkout + server-side payment signature verification
- Shared packages for database schema, auth, env validation, and UI components

## 2) Tech Stack

### Frontend

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- TanStack Query
- Zustand (persisted cart state)
- React Hook Form + Zod

### Backend

- Express 5 + TypeScript
- Better Auth
- Drizzle ORM + Drizzle Kit
- PostgreSQL
- AWS SDK (S3 presigned uploads)
- Razorpay SDK

### Monorepo / Tooling

- pnpm workspaces
- Turborepo
- Biome

## 3) Architecture / Code Flow

### Monorepo structure

- `apps/web`: Next.js frontend (customer + admin UI)
- `apps/server`: Express API (auth/session + domain modules)
- `packages/db`: Drizzle database client + schema
- `packages/auth`: Better Auth config and integration
- `packages/env`: Runtime env validation (`@t3-oss/env-core` / `env-nextjs`)
- `packages/ui`: Shared UI components/styles

### End-to-end flow

1. **Frontend (Next.js)** calls API using Axios (`/api/*`) with credentials.
2. **Server (Express)** attaches session using Better Auth and enforces access with `requireAuth` / `requireAdmin`.
3. **Domain modules** (`products`, `orders`, `warehouses`, `inventories`, `delivery-persons`) handle business logic.
4. **Database layer** uses Drizzle with PostgreSQL for relational data and transactions.
5. **External services**:
   - S3 for media upload via presigned URLs
   - Razorpay for payment order creation and signature verification

### Key module responsibilities

- **Products module**: create/search/list products, generate S3 presigned URLs, persist image metadata
- **Orders module**: validate cart, reserve stock atomically, assign delivery partner, create payment order, verify payment
- **Warehouses / Inventories / Delivery persons modules**: operational data creation and paginated listing
- **Auth package**: central auth config, role field management, trusted origins, Google OAuth setup
- **Env package**: strict runtime validation for server/client env vars

## 4) Key Learnings

- Designing a **modular monorepo architecture** with shared packages across apps
- Implementing **role-based access control** end-to-end (UI + API middleware)
- Building a **transactional order workflow** to safely reserve inventory and assign delivery partners
- Integrating **third-party services** (S3, Razorpay, OAuth provider) in a production-style flow
- Applying **schema validation** with Zod on both frontend and backend for safer APIs
- Managing frontend server-state and local-state with **TanStack Query + Zustand**

## 5) Reusable Concepts

- **Shared package boundaries** (`auth`, `db`, `env`, `ui`) for scalable multi-app repos
- **Typed environment validation** as a first-class safety layer
- **Presigned upload pipeline** (request URLs → upload files directly → persist filenames)
- **Transactional stock reservation pattern** with row locking for concurrent order safety
- **Consistent list screens** using reusable table, pagination, empty-state, and error-state patterns

## 6) Setup Instructions

### Prerequisites

- Node.js 20+
- pnpm 10+
- PostgreSQL instance
- AWS S3 bucket + credentials
- Razorpay account keys
- Google OAuth credentials

### Run locally

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Create env files:
   - `apps/server/.env`
   - `apps/web/.env`
3. Add required variables (see next section).
4. Push schema to your database:
   ```bash
   pnpm db:push
   ```
5. Start all apps in dev mode:
   ```bash
   pnpm dev
   ```
6. Open:
   - Web: `http://localhost:3001`
   - API: `http://localhost:3000`

### Helpful scripts

- `pnpm dev` – run all apps
- `pnpm dev:web` – run only web app
- `pnpm dev:server` – run only server app
- `pnpm build` – build all packages/apps
- `pnpm check-types` – TypeScript checks
- `pnpm check` – Biome lint/format checks
- `pnpm db:push | db:generate | db:migrate | db:studio` – DB workflows
- `pnpm auth:generate` – auth schema generation

## 7) Environment Variables

### `apps/server/.env`

- `DATABASE_URL`: PostgreSQL connection string
- `BETTER_AUTH_SECRET`: secret used by Better Auth (min 32 chars)
- `BETTER_AUTH_URL`: auth base URL (usually server URL)
- `CORS_ORIGIN`: allowed frontend origin
- `NODE_ENV`: `development` | `production` | `test`
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `S3_BUCKET_NAME`: target bucket for product images
- `AWS_ACCESS_KEY`: AWS access key for S3
- `AWS_SECRET_ACCESS_KEY`: AWS secret access key for S3
- `RAZORPAY_KEY_ID`: Razorpay public key ID (server-side usage)
- `RAZORPAY_KEY_SECRET`: Razorpay secret key (signature/payment verification)

### `apps/web/.env`

- `NEXT_PUBLIC_SERVER_URL`: backend base URL (e.g. `http://localhost:3000`)
- `NEXT_PUBLIC_DISTRIBUTION_DOMAIN_NAME`: image CDN/domain used by Next Image
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`: Razorpay publishable key for checkout

## 8) Future Improvements

- Replace hardcoded checkout address/pincode with a real address management flow
- Add automated test coverage (unit, integration, and E2E)
- Implement webhook-based payment reconciliation and stronger idempotency handling
- Improve onboarding flow for transitioning users to seller/admin roles
- Add CI pipeline for lint, type-check, tests, and migrations
- Add structured logging/monitoring and remove debug console logs
