# PiNova Global Hub — Seller Studio Experience Blueprint

## Product direction

Seller Studio is the authenticated merchant command center for operating one or more stores on PiNova Global Hub. It is mobile-first, Pi Browser-compatible, server-authoritative, and designed for international commerce. It must never present sample, cached, or another seller's records as the current merchant's business data.

## Experience principles

1. **Truth before decoration:** every metric is sourced from an authenticated server response; unavailable data is shown as unavailable, never as zero or a fabricated trend.
2. **Merchant isolation:** all seller reads and writes are scoped server-side to the authenticated Pioneer identity and selected store. Client-side filtering is presentation only, never an authorization boundary.
3. **Progressive onboarding:** merchants can save incomplete profile details, upload private KYC documents, and see exact verification state without duplicate applications.
4. **Mobile-first operation:** compact navigation, large touch targets, sticky primary actions, responsive tables/cards, and no forced full-page navigation for module switching.
5. **Safe commerce:** product publishing, stock changes, fulfillment, refunds, and Pi payment actions are guarded by server-side permissions and explicit state transitions.
6. **Accessible and global:** clear contrast, keyboard/focus states, readable currency/date formatting, country-aware address/phone inputs, and language-ready copy.

## Information architecture

### Command Center
- Overview
- Store switcher / Multi-Store
- Notifications and action queue

### Commerce Operations
- Products & Catalog
- Inventory & Warehouses
- Orders & Fulfillment
- Bulk CSV Import/Export

### Finance
- Payments & PSTP Escrow
- Payouts / Settlements
- Refunds & Disputes
- Financial Reports

### Growth
- Sales Analytics
- Customers & CRM
- Marketing & Promotions

### Store & Trust
- Store Profile / Storefront
- KYC & Verification
- Branding & Media
- Policies, Shipping & Returns
- Staff & Roles
- Security & Sessions
- Help & Support

## Overview layout

1. Header: greeting, verified Pioneer identity, active store selector, server sync indicator, help.
2. Store readiness panel: application status, KYC checklist, branding status, policy completion, publish eligibility.
3. KPI cards: gross sales, orders, average order value, products live. Each card includes a time range and source timestamp; unavailable values use an explicit unavailable state.
4. Action queue: pending orders, low-stock products, KYC requests, disputes and failed uploads.
5. Sales trend and order status distribution, only when the API returns sufficient real data.
6. Recent orders and top products, scoped to the active store.
7. Quick actions: add product, view orders, update inventory, edit storefront.

## Module requirements

- **Products:** seller-owned catalog only; draft/pending/active/rejected states; search, category, stock and moderation filters; product editor with media upload, variants, pricing, shipping/fulfillment and preview.
- **Inventory:** per-product stock, SKU, low-stock threshold, stock movements, warehouse/location support, adjustment reason and audit history.
- **Orders:** seller-owned order line items; split/partial fulfillment when an order contains multiple sellers; order timeline, buyer-safe details, tracking, returns and dispute workflow.
- **Payments:** payment verification status, escrow state, fees, settlement ledger, refund/dispute references. Never imply funds were received without server verification.
- **Analytics:** date filters, gross/net sales, order conversion, top products and export. Empty datasets must render an onboarding prompt, not demo charts.
- **Customers:** only buyers with an actual transaction or consented relationship; privacy-safe contact controls and order history.
- **Marketing:** coupons, campaigns and promotion scheduling with eligibility, budget and expiry validation.
- **KYC:** private document upload, file validation, encrypted/private storage, review state, reviewer notes safe for the merchant, and retry guidance.
- **Branding:** logo/banner upload, preview, alt text, image constraints and verified durable-storage health.
- **Policies:** shipping, returns, refunds, privacy and terms with version history and acceptance records.
- **Staff/RBAC:** invitations, least-privilege roles, store-scoped permissions and audit events.
- **Security:** active sessions, sign-in events, permission changes, suspicious activity and account recovery guidance.
- **Support:** searchable help, support tickets, linked order/application references and status tracking.

## Visual system

- Premium, calm commerce workspace; dark and light themes supported.
- Neutral surfaces with one restrained PiNova accent, clear status colors, consistent spacing and typography.
- Desktop: persistent left navigation, compact top bar, content grid.
- Mobile/Pi Browser: collapsible module directory, sticky page actions, card-based data views, no horizontal overflow.
- Use skeletons only while loading; use explicit empty/error/retry states after requests finish.
- Tables become stacked cards on narrow screens; important actions remain reachable with one hand.

## Required API/data contracts before UI metrics are enabled

- Authenticated identity endpoint returns canonical Pioneer username/UID and session expiry.
- Merchant status endpoint distinguishes UNREGISTERED, PENDING_REVIEW, ACTION_REQUIRED, APPROVED, SUSPENDED, and STATUS_UNAVAILABLE.
- Store list and active-store selection are server-authorized.
- Seller product list accepts no trusted seller ID from the client; server derives owner from session.
- Seller order list queries order line-item ownership, supports mixed-seller orders, and returns only the seller's lines and permitted buyer fields.
- Dashboard aggregates are computed from durable seller-scoped records and include generatedAt and a date range.
- Storage health verifies actual bucket access with a safe operation; configuration-variable presence alone is not a healthy status.
- KYC documents use a separate private bucket and must never be exposed through public media URLs.

## Release gates

1. No sample/cache records in Seller Studio metrics or seller lists.
2. Cross-seller product/order access tests pass, including mixed-seller orders.
3. Server derives seller identity; client-supplied seller IDs cannot widen access.
4. Pi session renewal works across Vercel serverless instances and Pi Browser.
5. Branding and private KYC upload/read-back tests pass against Preview Neon storage configuration.
6. TypeScript, build, security workflows and seller-specific API tests pass.
7. Preview is verified before any production promotion. Production and legacy Blob stores remain untouched until separately approved.
