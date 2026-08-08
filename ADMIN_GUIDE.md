# PiNova Global Marketplace — Administrator Guide

> **Permanent Transparency & Operational Notices:**
> - **Transparency Notice:** PiNova Global Marketplace is built on a non-custodial marketplace architecture. Payment processing relies on the Official Pi SDK v2 and Pi Platform API. PiNova never stores or manages Pi wallet private keys, recovery phrases, passphrases, blockchain infrastructure, or official Pi Network services.
> - **Operational Notice:** Certain marketplace capabilities rely on external service providers and official Pi Platform services. Feature availability, response times, and service outcomes may vary depending on provider availability, network connectivity, and Official Pi Platform service status.

## Administrative Features

### 1. Platform Pricing Administration Panel
- Navigate to **Utility Console -> Admin Console** or **Platform Pricing Rules**.
- Adjust `piRateUsd` baseline pricing rules, minimum/maximum purchase amounts, and pricing disclaimers.
- All updates append an audit log entry visible in the audit history tab.

### 2. Provider Management & Real-Time Verification Modes
- Toggle providers between Direct API Lookup (`hasDirectValidationApi: true`) for application-level service availability checks and Operations Manual Verification.
- Monitor active provider packages and custom input fields.

### 3. Marketplace Order Protection & Dispute Management Console
- Review incoming buyer/seller claims via the **Marketplace dispute management workflow**.
- Utilize **AI-assisted dispute management** to review return photo evidence automatically.
- Execute compliant dispute resolutions (`RELEASE_TO_SELLER`, `REFUND_TO_BUYER`).
- Inspect security events, seller performance metrics, verified seller ratings, and system audit logs.

### 4. 23-Language Localization Console
- Add or modify dynamic translation keys across all 23 supported languages.
- Export or import JSON locale overrides.

