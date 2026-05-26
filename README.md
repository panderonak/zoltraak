# Zoltraak

A full-stack quick-commerce platform built as a TypeScript monorepo with Next.js, Express, PostgreSQL, Drizzle ORM, Better Auth, S3 uploads, and Razorpay payments.

## Overview

Zoltraak is a quick-commerce application for selling grocery and daily-need products online. It combines a customer storefront with an admin/seller operations dashboard so the product catalog, warehouse stock, delivery assignment, checkout, and payment flow can work together in one system.

The project is useful for:

- Customers who want to browse products, manage a cart, and place paid orders.
- Sellers/admins who need to manage products, warehouses, inventory, delivery persons, and orders.
- Developers reviewing a production-style full-stack TypeScript monorepo with real operational workflows.

High-level workflow:

1. Users sign in through Better Auth with Google OAuth.
2. Customers browse products, filter/sort by category and price, and add items to a persisted cart.
3. The frontend calls the Express API with session cookies.
4. The API validates requests with Zod, checks auth/role middleware, and uses Drizzle to read/write PostgreSQL.
5. Admins create products with direct-to-S3 image uploads through presigned URLs.
6. Checkout creates an order, reserves inventory, assigns a delivery person, creates a Razorpay order, and verifies payment signatures.

## Demo / Screenshots

No public deployment URL or screenshots are committed yet.

Suggested additions:

- `docs/screenshots/storefront.png`
- `docs/screenshots/cart.png`
- `docs/screenshots/admin-products.png`
- `docs/screenshots/admin-orders.png`
- Live demo URL after deployment

## Features

- Google OAuth sign-in with Better Auth.
- Role-based access for regular users and admins.
- Customer storefront with product listing, product detail pages, category filtering, sorting, and image carousel support.
- Persisted cart state with quantity management.
- Checkout flow with pincode-based warehouse lookup and Razorpay payment initialization.
- Server-side Razorpay HMAC signature verification.
- Admin dashboard for products, warehouses, inventories, delivery persons, and orders.
- Product image uploads using AWS S3 presigned URLs.
- Paginated admin tables and list views.
- Transactional order creation with inventory reservation and delivery-person assignment.
- Shared monorepo packages for database schema, auth, env validation, UI components, and TypeScript config.

## Tech Stack

### Frontend

- [Next.js](https://nextjs.org/) 16 App Router for the web app.
- [React](https://react.dev/) 19 with TypeScript.
- [Tailwind CSS](https://tailwindcss.com/) 4 for styling.
- [TanStack Query](https://tanstack.com/query/latest) for server state.
- [TanStack Table](https://tanstack.com/table/latest) for admin tables.
- [Zustand](https://zustand-demo.pmnd.rs/) for persisted cart state.
- [React Hook Form](https://react-hook-form.com/) and [Zod](https://zod.dev/) for form validation.
- Shared UI package built with shadcn-style components, Radix primitives, and Lucide/Tabler icons.

### Backend

- [Express](https://expressjs.com/) 5 API server.
- [Better Auth](https://www.better-auth.com/) for authentication and session handling.
- [Drizzle ORM](https://orm.drizzle.team/) and Drizzle Kit for database access and migrations.
- [PostgreSQL](https://www.postgresql.org/) as the relational database.
- [AWS SDK for JavaScript](https://aws.amazon.com/sdk-for-javascript/) for S3 presigned uploads.
- [Razorpay](https://razorpay.com/) SDK for payment orders and verification.

### Monorepo / Tooling

- [pnpm](https://pnpm.io/) workspaces.
- [Turborepo](https://turbo.build/repo) for task orchestration.
- [Biome](https://biomejs.dev/) for formatting/linting.
- TypeScript project references and shared config package.

## Project Structure

```txt
.
├── apps
│   ├── server              # Express API, auth middleware, domain modules
│   └── web                 # Next.js storefront and admin dashboard
├── packages
│   ├── auth                # Better Auth configuration
│   ├── config              # Shared TypeScript config
│   ├── db                  # Drizzle client, schema, migrations
│   ├── env                 # Server/client env validation
│   └── ui                  # Shared UI components and global styles
├── biome.json              # Biome lint/format config
├── pnpm-workspace.yaml     # Workspace package definitions
├── turbo.json              # Turborepo pipeline
└── package.json            # Root scripts
```

Where to look first:

- `apps/web/src/app` for pages and routing.
- `apps/web/src/components` for app-level components.
- `apps/server/src/modules` for API route modules and business logic.
- `apps/server/src/middlewares` for auth/session/role enforcement.
- `packages/db/src/schema` for database tables and relationships.
- `packages/env/src` for required environment variables.

## Installation

### Prerequisites

- Node.js 20+.
- pnpm 11.2.2 or compatible.
- PostgreSQL database.
- Google OAuth credentials.
- AWS S3 bucket and credentials.
- Razorpay account keys.

### Local Setup

```bash
git clone https://github.com/panderonak/zoltraak.git
cd zoltraak
pnpm install
```

Create environment files:

```bash
touch apps/server/.env
touch apps/web/.env
```

Add the required variables listed below, then push or migrate the schema:

```bash
pnpm db:push
```

Start both apps:

```bash
pnpm dev
```

Default local URLs:

- Web app: `http://localhost:3001`
- API server: `http://localhost:3000`
- API health check: `http://localhost:3000/`

## Environment Variables

### `apps/server/.env`

```env
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3001
NODE_ENV=development
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
S3_BUCKET_NAME=
AWS_ACCESS_KEY=
AWS_SECRET_ACCESS_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string used by Drizzle. |
| `BETTER_AUTH_SECRET` | Better Auth secret. Must be at least 32 characters. |
| `BETTER_AUTH_URL` | Base URL for the auth server. |
| `CORS_ORIGIN` | Allowed frontend origin for credentialed API requests. |
| `NODE_ENV` | Runtime environment: `development`, `production`, or `test`. |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID. |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret. |
| `S3_BUCKET_NAME` | S3 bucket for product images. |
| `AWS_ACCESS_KEY` | AWS access key for S3 writes/presigned URLs. |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key for S3 writes/presigned URLs. |
| `RAZORPAY_KEY_ID` | Razorpay key ID. |
| `RAZORPAY_KEY_SECRET` | Razorpay secret used for payment signature verification. |

### `apps/web/.env`

```env
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
NEXT_PUBLIC_URL=http://localhost:3001
NEXT_PUBLIC_DISTRIBUTION_DOMAIN_NAME=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
```

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SERVER_URL` | Backend API origin used by the frontend. |
| `NEXT_PUBLIC_URL` | Frontend app URL. |
| `NEXT_PUBLIC_DISTRIBUTION_DOMAIN_NAME` | Public image/CDN domain used by Next Image. |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay publishable key for browser checkout. |

## Available Scripts

Run these from the repository root.

```bash
pnpm dev              # Run all dev tasks through Turborepo
pnpm dev:web          # Run only the Next.js app on port 3001
pnpm dev:server       # Run only the Express API on port 3000
pnpm build            # Build all apps/packages
pnpm check-types      # Run TypeScript checks
pnpm check            # Run Biome checks with auto-fixes
pnpm db:push          # Push Drizzle schema to the database
pnpm db:generate      # Generate Drizzle migrations
pnpm db:migrate       # Apply Drizzle migrations
pnpm db:studio        # Open Drizzle Studio
pnpm auth:generate    # Generate Better Auth schema artifacts
```

App/package-local scripts also exist in `apps/web/package.json`, `apps/server/package.json`, and `packages/db/package.json`.

## API Documentation

Base API URL in development: `http://localhost:3000/api`

Auth routes are mounted at:

```txt
/api/auth/*
```

Most application routes use the Better Auth session cookie. Routes marked `Admin` also require `req.user.role === "admin"`.

### Products

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/products` | User | List products with pagination, optional `category`, and `sort`. |
| `GET` | `/api/products/:id` | User | Get a single product with images. |
| `GET` | `/api/products/admin` | Admin | List products owned by the current seller/admin. |
| `POST` | `/api/products/admin` | Admin | Create a product and image records. |
| `POST` | `/api/products/presigned-urls` | Admin | Create S3 presigned upload URLs. |
| `GET` | `/api/products/search` | Admin | Search products by name. |

Create product example:

```json
{
  "name": "Organic Apples",
  "description": "Fresh apples",
  "price": "120.00",
  "category": "Fresh",
  "images": ["generated-file-name.jpg"]
}
```

### Warehouses

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/warehouses` | User | List warehouses. |
| `POST` | `/api/warehouses` | Admin | Create a warehouse. |
| `GET` | `/api/warehouses/search` | Admin | Search warehouses. |

### Inventories

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/inventories` | Admin | List inventory records. |
| `POST` | `/api/inventories` | Admin | Create stock for a product/warehouse. |
| `DELETE` | `/api/inventories/:id` | Admin | Delete an inventory record. |

### Delivery Persons

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/delivery-persons` | User | List delivery persons. |
| `POST` | `/api/delivery-persons` | Admin | Create a delivery person. |
| `PATCH` | `/api/delivery-persons/:id` | Admin | Update a delivery person. |
| `DELETE` | `/api/delivery-persons/:id` | Admin | Delete a delivery person. |
| `GET` | `/api/delivery-persons/:id/orders` | User | View orders assigned to a delivery person. |
| `POST` | `/api/delivery-persons/complete-delivery` | User | Mark a delivery as completed. |

### Orders

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/orders/history` | User | List orders with line-item summaries. |
| `POST` | `/api/orders` | User | Create an order and initialize Razorpay checkout. |
| `POST` | `/api/orders/payments/verify` | Public/client callback | Verify Razorpay payment signature and mark order as paid. |
| `POST` | `/api/orders/status` | Admin | Update order status. |

Create order example:

```json
{
  "items": [
    {
      "productId": "product-uuid",
      "quantity": 2
    }
  ],
  "pincode": "400001",
  "address": "Customer delivery address"
}
```

Payment verification example:

```json
{
  "razorpay_order_id": "order_...",
  "razorpay_payment_id": "pay_...",
  "razorpay_signature": "hmac_signature"
}
```

### Users

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/users/become-seller` | User | Promote or transition a user into seller/admin capabilities. |

## Database Schema / Models

The database schema lives in `packages/db/src/schema`.

Core tables:

- `user`: Better Auth user record with `role` enum: `user` or `admin`.
- `session`, `account`, `verification`: Better Auth session/OAuth tables.
- `products`: Seller-owned product catalog records.
- `product_images`: Image filenames linked to products.
- `warehouses`: Admin-owned fulfillment locations keyed by pincode.
- `inventories`: Product stock records by warehouse.
- `delivery_persons`: Delivery partner records assigned to warehouses and orders.
- `orders`: Customer orders with payment/status fields.
- `order_items`: Line items for each order.

Important relationships:

- A user can own many products, warehouses, inventories, and delivery persons.
- A product can have many images, inventory records, and order items.
- A warehouse can have many inventory records and delivery persons.
- An order belongs to a user and can have many order items.
- An order can be assigned one delivery person.
- Inventory rows can be temporarily linked to an order during checkout reservation.

Order statuses:

```txt
received -> reserved -> payment_pending -> paid -> delivered
                              └──────────-> failed
```

Delivery person statuses:

```txt
available | busy | offline
```

Product categories:

```txt
Fresh | Dairy | Snacks | Beverages | Staples | Instant Food | Personal Care | Household
```

## Authentication & Authorization

Authentication is handled by Better Auth in `packages/auth/src/auth.ts` and mounted on the Express server at `/api/auth/*`.

Session handling flow:

1. Better Auth stores the session in HTTP-only cookies.
2. `attachSession` reads the session from request headers.
3. The middleware attaches `req.session`, `req.user`, and `req.isAdmin`.
4. `requireAuth` blocks unauthenticated requests.
5. `requireAdmin` blocks non-admin users.

Roles:

- `user`: Can browse products, manage cart, place orders, and access authenticated customer routes.
- `admin`: Can create/manage products, warehouses, inventories, delivery persons, and order statuses.

## Architecture Decisions

- **Monorepo layout:** Keeps the web app, API, database schema, auth config, env validation, and UI kit in one workspace while preserving clear package boundaries.
- **Shared schema package:** Both API and supporting packages import Drizzle schema from `@zoltraak/db`, keeping models consistent.
- **Typed env validation:** `@zoltraak/env` fails fast when required runtime configuration is missing.
- **Cookie-based auth:** Better Auth sessions integrate cleanly with the Next.js app and Express API through credentialed requests.
- **Admin middleware:** Role checks live on the server so admin screens are backed by real API authorization, not just hidden UI.
- **Direct-to-S3 uploads:** Product images upload through presigned URLs so large files do not need to pass through the API server.
- **Transactional checkout:** Order creation reserves inventory and assigns a delivery person inside a database transaction before payment initialization.
- **External payment call after commit:** Razorpay order creation happens after database locks are released, reducing lock time around inventory and delivery resources.

## Key Technical Challenges

- **Concurrent checkout safety:** Inventory reservation uses database transactions and row locking to avoid selling the same stock to multiple users.
- **Payment consistency:** Razorpay payment IDs and signatures are verified server-side before marking an order as paid.
- **Cleanup after payment initialization failure:** If Razorpay fails after resources are reserved, the server releases inventory and delivery-person assignments and marks the order as failed.
- **Operational role separation:** Customer and admin workflows share one app while API middleware enforces the permission boundary.
- **Media pipeline:** Admin product creation separates file upload from product persistence using presigned S3 URLs and stored image filenames.
- **Monorepo package boundaries:** Shared auth, DB, env, and UI packages reduce duplication but require careful imports and workspace scripts.

## Performance / Scalability Notes

- Paginated list endpoints for products, admin resources, and orders.
- Batched product lookup during order creation instead of fetching cart items one by one inside the transaction.
- Batched order-item inserts during checkout.
- Short database transactions that avoid external network calls while locks are held.
- Product filtering and sorting happen at the database query level.
- Admin search uses PostgreSQL text matching/similarity logic.
- Next.js image configuration can use a distribution/CDN domain through `NEXT_PUBLIC_DISTRIBUTION_DOMAIN_NAME`.

Potential future scaling work:

- Add explicit indexes for high-traffic query paths such as product category, order status, warehouse pincode, and inventory product/warehouse pairs.
- Add background reconciliation for stale payment-pending or reserved orders.
- Add caching for read-heavy catalog data.
- Add observability around checkout failures and payment verification.

## Testing

Automated tests are not currently configured in the repository.

Recommended testing plan:

- Unit tests for Zod schemas, price calculations, and utility functions.
- Integration tests for API modules using a test PostgreSQL database.
- Transaction tests for concurrent inventory reservation and delivery assignment.
- E2E tests for sign-in, product browsing, cart checkout, admin product creation, and order status updates.
- Payment verification tests with known Razorpay signature fixtures.

Until tests are added, run:

```bash
pnpm check-types
pnpm check
pnpm build
```

## Deployment

No deployment configuration is committed yet.

Expected deployment shape:

- Web app: Vercel, Netlify, or another Next.js-capable platform.
- API server: Railway, Render, Fly.io, AWS, or a Node.js container host.
- Database: Neon, Supabase, Railway PostgreSQL, AWS RDS, or another managed PostgreSQL provider.
- Images: AWS S3, optionally behind CloudFront or another CDN.
- Payments: Razorpay live keys in production env.

Production checklist:

- Set `BETTER_AUTH_URL` to the deployed API/auth URL.
- Set `CORS_ORIGIN` to the deployed frontend URL.
- Set `NEXT_PUBLIC_SERVER_URL` to the deployed API URL.
- Use production Google OAuth callback URLs.
- Use production Razorpay keys.
- Use secure cookie settings for HTTPS production deployments.
- Apply migrations with `pnpm db:migrate`.

## Security Considerations

Implemented:

- HTTP-only Better Auth session cookies.
- Server-side `requireAuth` and `requireAdmin` middleware.
- Zod validation for request payloads and env vars.
- Drizzle ORM query building to reduce SQL injection risk.
- Server-side product price lookup during checkout instead of trusting client prices.
- Razorpay HMAC signature verification with `crypto.timingSafeEqual`.
- CORS configured to a specific frontend origin with credentials.
- S3 uploads through presigned URLs instead of exposing broad bucket access to clients.

Needs review before production:

- Enable secure cookie attributes for HTTPS production.
- Add API rate limiting.
- Add webhook-based payment reconciliation.
- Add request logging, audit trails, and monitoring.
- Review S3 bucket policy and allowed file types.
- Add CSRF strategy if cross-site cookie behavior changes.
- Add automated tests for auth, checkout, and payment verification.

## Roadmap

- Add screenshots and a hosted live demo.
- Add `.env.example` files for the web and server apps.
- Add unit, integration, and E2E test suites.
- Add CI for linting, type-checking, builds, and migrations.
- Add Razorpay webhook handling and payment reconciliation.
- Add order cancellation and refund flows.
- Add customer address management instead of a single checkout address field.
- Add seller onboarding and admin approval flow.
- Add inventory adjustment history.
- Add dashboard analytics for sales, stock, delivery performance, and failed payments.
- Add structured logging and error monitoring.

## Contributing

This is currently a private/portfolio-style project, but the recommended workflow for teammates is:

1. Create a feature branch from the main branch.
2. Use clear branch names such as `feature/product-search`, `fix/payment-verification`, or `chore/db-indexes`.
3. Keep changes focused and include migration files when schema changes are made.
4. Run checks before opening a PR:

```bash
pnpm check-types
pnpm check
pnpm build
```

Suggested commit style:

```txt
feat: add order status filters
fix: release delivery person after failed payment
chore: add database indexes
docs: update setup instructions
```

PRs should include:

- What changed.
- Why it changed.
- Screenshots for UI changes.
- Notes about migrations, env vars, or deployment steps.
- Test coverage or manual verification steps.

## License

No license file is currently included. Until a license is added, all rights are reserved by the repository owner.

Recommended next step: add an explicit license such as MIT if this project should be reusable by others.

## Author / Contact

Built by Ronak Pandey.

- GitHub: [panderonak](https://github.com/panderonak)
- Repository: [panderonak/zoltraak](https://github.com/panderonak/zoltraak)
