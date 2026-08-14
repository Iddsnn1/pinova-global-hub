# PiNova Global Hub — Developer Guide

> **Permanent Transparency & Operational Notices:**
> - **Transparency Notice:** PiNova Global Hub is built on a non-custodial platform architecture. Payment processing relies on the Official Pi SDK v2 and Pi Platform API. PiNova never stores or manages Pi wallet private keys, recovery phrases, passphrases, blockchain infrastructure, or official Pi Network services.
> - **Operational Notice:** Certain marketplace capabilities rely on external service providers and official Pi Platform services. Feature availability, response times, and service outcomes may vary depending on provider availability, network connectivity, and Official Pi Platform service status.

## Architecture Summary
PiNova is organized into 15 decoupled business modules under `/src/modules/` spanning all implemented modules:

1. `ai`: AI Provider Abstraction Layer (Gemini 3.6 Flash) for automated recommendations and operational assistance only (verified marketplace content displayed separately).
2. `analytics`: Platform metrics calculation and Marketplace dispute management workflow analytics.
3. `catalog`: Search indexing, vendor cataloging, and product filtering.
4. `developer_platform`: Enterprise API Gateway, Webhook Engine, and Integration Sandbox.
5. `finance_analytics`: Financial reporting and BI analytics engine.
6. `localization`: 23-language translation context engine.
7. `marketplace`: Logistics, inventory, RMA returns, vendor payouts, and tax rules.
8. `notification`: Multi-channel adapter dispatcher (In-App, Push, Email, SMS, WhatsApp, Webhook).
9. `orders`: Order processing, fulfillment routing, and AI-assisted dispute management.
10. `pi`: Official Pi SDK v2 authentication and payment pipeline wrapper. Payment approval and completion are processed through the Official Pi SDK v2 payment workflow and Pi Platform API according to their documented integration flow; PiNova never performs wallet custody, settlement, blockchain validation, or transaction finality.
11. `platform_admin`: System configuration, feature flags, and administrative controls.
12. `pricing`: Platform pricing rules engine.
13. `security`: RBAC, user sessions, device trust, API key management, audit logs, and Marketplace Order Protection & Trust System.
14. `trust`: Seller performance metrics, verified seller ratings, and review moderation.
15. `utility`: Utility provider validation adapter registry for application-level service availability checks.

---

## Coding Standards
- Use TypeScript standard named imports.
- Place all UI components in `/src/components/`.
- Ensure all API endpoints handle errors gracefully and write audit logs for sensitive operations.

