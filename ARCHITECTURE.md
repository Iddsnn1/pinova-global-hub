# PiNova Global Marketplace — Technical Architecture & Compliance Specification

## Executive Overview
PiNova Global Marketplace is an enterprise multi-vendor commerce platform built for the Pi Network ecosystem. The platform supports physical goods, digital assets, mobile airtime, and utility bill settlements utilizing official Pi SDK v2 integration, Marketplace Order Protection & Trust System, and 23-language localization.

> **Permanent Transparency & Operational Notices:**
> - **Transparency Notice:** PiNova Global Marketplace is built on a non-custodial marketplace architecture. Payment processing relies on the Official Pi SDK v2 and Pi Platform API. PiNova never stores or manages Pi wallet private keys, recovery phrases, passphrases, blockchain infrastructure, or official Pi Network services.
> - **Operational Notice:** Certain marketplace capabilities rely on external service providers and official Pi Platform services. Feature availability, response times, and service outcomes may vary depending on provider availability, network connectivity, and Official Pi Platform service status.

---

## 1. Provider Validation Architecture
- **API Abstraction Layer**: Provider validation operates via `IProviderValidationAdapter` interfaces implemented in `/src/modules/utility/providerValidation.ts`.
- **Validation Adapters**:
  - `DirectApiValidationAdapter`: Invokes live provider API gateways (`/api/v1/utility/validate`) for application-level service availability checks and transaction verification.
  - `ManualVerificationAdapter`: Queues transactions for manual fulfillment verification when direct lookups are unavailable.
- **Zero Simulation Compliance**: The platform never outputs synthetic customer verification names or fake registry responses. If a direct lookup API is not configured, customer accounts are marked `requiresManualVerification: true` and routed to fulfillment operations.

---

## 2. Pricing & Conversion Terminology Architecture
- **Neutral Terminology**: All pricing logic uses neutral enterprise terms:
  - `Platform Pricing Configuration`
  - `Platform Conversion Configuration`
  - `Marketplace Pricing Rules`
  - `Pricing Configuration`
- **Governance**: Pricing parameters are configured solely by marketplace platform administrators.
- **Pi Network Disclaimer**: The platform explicitly communicates that Pi Network does not establish, publish, or guarantee exchange rates.

---

## 3. Payment Settlement Architecture & Pi SDK v2 Workflow
- **SDK v2 Payment Flow**: Payments execute via official Pi Platform SDK v2 calls (`Pi.createPayment`) paired with server-to-server endpoints (`/api/v2/payments/approve` and `/api/v2/payments/complete`). Payment approval and completion are processed through the Official Pi SDK v2 payment workflow and Pi Platform API according to their documented integration flow. PiNova never performs wallet custody, settlement, blockchain validation, or transaction finality.
- **Protected Checkout Experience**: All checkout transactions route through the Protected Checkout Experience modal with non-custodial order protection metadata.
- **Compliant Settlement Terms**:
  - `Payment Authorized`
  - `Payment Verified`
  - `Payment Recorded`
  - `Transaction Recorded`
  - `Order Confirmed`
  - `Order Completed`
  - `Digital Receipt Generated`
- **Custody Compliance**: PiNova maintains strictly non-custodial operations and never stores or manages Pi wallet private keys, passphrases, or blockchain consensus infrastructure.

---

## 4. Localization Architecture
- **23 Language Engines**: Complete coverage across 23 global languages (English, Hausa, Arabic, French, Spanish, Simplified Chinese, Traditional Chinese, Vietnamese, Indonesian, Korean, Japanese, Portuguese, Hindi, German, Italian, Turkish, Russian, Thai, Dutch, Polish, Tagalog, Romanian, Ukrainian).
- **Fallback Hierarchy**:
  1. Active runtime dynamic translation store (`customDicts`).
  2. Pre-bundled locale dictionary (`LOCALES[langCode]`).
  3. Master English dictionary fallback (`LOCALES['en']`).
  4. Raw translation key.
- **Bidirectional Layout (RTL & LTR)**: Native CSS direction switching (`dir="rtl"`) for Arabic and Hebrew.

---

## 5. Modular Software Architecture
The codebase is structured into 15 decoupled modules under `/src/modules/` spanning all implemented modules:
1. **Marketplace Module** (`/src/modules/marketplace`): Cart calculation, order status formatting, order tracking.
2. **Catalog Module** (`/src/modules/catalog`): Multi-criteria product filtering, search indexing, vendor cataloging.
3. **Pricing Module** (`/src/modules/pricing`): Rule calculation, admin thresholds, non-exchange rate terminology enforcement.
4. **Utility Module** (`/src/modules/utility`): Provider validation abstraction, package resolution, application-level service availability checks.
5. **Pi Integration Module** (`/src/modules/pi`): Official Pi SDK v2 authentication, payment lifecycle wrapper.
6. **Localization Module** (`/src/modules/localization`): Language context hooks, translation loaders, number/currency formatters.
7. **Notification Module** (`/src/modules/notification`): Real-time alert dispatching, order status notifications.
8. **AI Module** (`/src/modules/ai`): Gemini 3.6 Flash search assistant and shopping concierge providing automated recommendations and operational assistance only (verified marketplace information is displayed separately).
9. **Analytics Module** (`/src/modules/analytics`): Volume metrics, order delivery metrics, Marketplace dispute management workflow ratios.
10. **Security Module** (`/src/modules/security`): Role-Based Access Control (RBAC), immutable audit logging, PSTP verification, Marketplace Order Protection & Trust System.
11. **Developer Platform Module** (`/src/modules/developer_platform`): API Gateway, Webhook Engine, Integration Sandbox.
12. **Finance Analytics Module** (`/src/modules/finance_analytics`): Financial reporting and BI analytics.
13. **Platform Admin Module** (`/src/modules/platform_admin`): System settings, feature flags, user management.
14. **Trust Module** (`/src/modules/trust`): Seller performance metrics, verified seller ratings, review moderation.
15. **Orders Module** (`/src/modules/orders`): Fulfillment routing, AI-assisted dispute management, return requests.

---

## 6. API Layer Architecture
- **Versioned Endpoints**:
  - `/api/v1/utility/config` & `/api/v1/utility/validate`
  - `/api/v2/payments/approve` & `/api/v2/payments/complete`
  - `/api/v1/ai/search`
  - `/api/v1/pstp/audit-logs`
  - `/api/v1/pstp/disputes`
  - `/api/v1/pstp/security-events`
- **Middleware Infrastructure**:
  - Request logging middleware (URL, method, IP, timestamp).
  - Global error handling middleware returning standardized `{ success: false, error: string }` JSON bodies.

---

## 7. Security Architecture & Marketplace Order Protection
- **Role-Based Access Control (RBAC)**: Enforces permissions for `buyer`, `seller`, and `admin`.
- **Server Validation**: Mandatory server-side payment approval verification with Pi Platform API using `PI_API_KEY`.
- **Marketplace Order Protection & Trust System**: Guarantees non-custodial order verification, AI-assisted dispute management, seller performance metrics, and verified seller ratings.
- **Immutable Audit Logging**: Every critical action (payment approval, dispute resolution, pricing rule adjustment) appends an immutable log entry.

---

## 8. Performance & Mobile Readiness
- **Vite & React 18**: Fast compilation and Hot Module Replacement compatibility.
- **Pi Browser Mobile Optimizations**: Responsive touch targets, mobile bottom navigation bar, low-memory footprint styling.

---

## 9. Scalability & Extension Points
- **Provider Adapters**: New utility providers can be added by implementing `IProviderValidationAdapter`.
- **Locale Extensions**: New languages can be added dynamically via the Admin Language Console or statically in `/src/data/locales/`.
- **Microservices Migration**: API endpoints are versioned and structured for straightforward migration to distributed cloud containers.

---

## 10. Compliance Verification Matrix
| Requirement | Status | Verification Method |
| :--- | :--- | :--- |
| Provider Validation Abstraction | Compliant | `ProviderValidationFactory` adapter layer in `/src/modules/utility` with application-level service availability checks |
| Neutral Pricing Terminology | Compliant | Removed "Exchange Rate/Market Rate"; enforced administrative rule terms |
| Non-Custodial Pi SDK v2 Workflow | Compliant | Payment approval via Pi Platform API; zero wallet key custody |
| Protected Checkout Experience | Compliant | Integrated non-custodial checkout flow with order protection metadata |
| AI Assistant Disclosure | Compliant | Automated recommendations separated from verified marketplace content |
| 23-Language Localization | Compliant | Fallback to English, RTL support, dynamic dictionary overrides |
| Modular Code Architecture | Compliant | 15 independent modules across all implemented modules |
| Versioned REST API Layer | Compliant | `/api/v1/...` and `/api/v2/...` routes with error middleware |
| Official Pi SDK v2 & Pi Browser | Compliant | `Pi.authenticate()`, `Pi.createPayment()`, `/api/v2/payments/approve` |

