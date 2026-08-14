# PiNova Global Hub — Enterprise Security & PSTP Compliance

## Permanent Transparency & Operational Notices
> - **Transparency Notice:** PiNova Global Hub is built on a non-custodial platform architecture. Payment processing relies on the Official Pi SDK v2 and Pi Platform API. PiNova never stores or manages Pi wallet private keys, recovery phrases, passphrases, blockchain infrastructure, or official Pi Network services. Payment approval and completion are processed through the Official Pi SDK v2 payment workflow and Pi Platform API according to their documented integration flow; PiNova never performs wallet custody, settlement, blockchain validation, or transaction finality.
> - **Operational Notice:** Certain marketplace capabilities rely on external service providers and official Pi Platform services. Feature availability, response times, and service outcomes may vary depending on provider availability, network connectivity, and Official Pi Platform service status.

---

## Executive Security Model
PiNova applies defense-in-depth principles through the **Marketplace Order Protection & Trust System** and **PiNova Security & Trust Framework (PSTP)**.

---

## 1. Security Architecture Components

### A. Role-Based Access Control (RBAC)
- **Roles**: `buyer`, `seller`, `admin`.
- **Enforcement**: Handled via `SecurityModule.getRolePermissions()`.

### B. Pi SDK v2 Non-Custodial Approval Workflow
- Payments pass server-side approval verification at `/api/v2/payments/approve` via the official Pi Platform API.
- Secret API key `PI_API_KEY` is kept strictly server-side inside `server.ts`.
- Protected Checkout Experience guarantees user authorization inside official Pi Browser wallets.

### C. Session & Device Trust Management
- Fingerprinting and token expiration tracking via `UserSessionManager` and `DeviceTrustEngine`.
- Anomaly alerts logged for unknown device access.

### D. Marketplace Dispute Management & Seller Metrics
- AI-assisted dispute management workflow for photo return pre-screening.
- Seller performance metrics and verified seller ratings tracked transparently.

### E. Backup & Disaster Recovery
- Hourly automated database snapshot backup targets (RPO 5 mins, RTO 15 mins).

---

## 2. PSTP Compliance Rules
1. Zero client-side API key exposure.
2. Mandatory non-exchange rate neutral pricing terminology.
3. Strict provider validation adapter checks (application-level service availability checks).
4. Non-custodial operation: zero wallet private key custody or seed phrase storage.

