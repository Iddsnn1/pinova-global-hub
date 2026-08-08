# PiNova Global Marketplace — API Specification

> **Permanent Transparency & Operational Notices:**
> - **Transparency Notice:** PiNova Global Marketplace is built on a non-custodial marketplace architecture. Payment processing relies on the Official Pi SDK v2 and Pi Platform API. PiNova never stores or manages Pi wallet private keys, recovery phrases, passphrases, blockchain infrastructure, or official Pi Network services. Payment approval and completion are processed through the Official Pi SDK v2 payment workflow and Pi Platform API according to their documented integration flow; PiNova never performs wallet custody, settlement, blockchain validation, or transaction finality.
> - **Operational Notice:** Certain marketplace capabilities rely on external service providers and official Pi Platform services. Feature availability, response times, and service outcomes may vary depending on provider availability, network connectivity, and Official Pi Platform service status.

## Base URL
- Production / Container: `http://0.0.0.0:3000`
- API Route Prefix: `/api/v1` and `/api/v2`

---

## 1. Authentication & Pi Network Platform SDK v2 Endpoints

### `POST /api/v2/payments/approve`
Approves a pending Pi payment with the official Pi Network Platform API.
- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "paymentId": "pi_payment_981247192"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "paymentId": "pi_payment_981247192",
    "status": "APPROVED",
    "message": "Payment approved by PiNova Order Protection Server"
  }
  ```

### `POST /api/v2/payments/complete`
Completes a verified Pi payment after blockchain transaction submission.
- **Request Body**:
  ```json
  {
    "paymentId": "pi_payment_981247192",
    "txid": "0x8a7f9b...12c4"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "paymentId": "pi_payment_981247192",
    "txid": "0x8a7f9b...12c4",
    "status": "COMPLETED",
    "message": "Payment completed & Order Recorded in PiNova Ledger"
  }
  ```

---

## 2. Utility & Provider Validation Endpoints

### `POST /api/v1/utility/validate`
Validates customer account number using direct provider adapter or queues for manual verification.
- **Request Body**:
  ```json
  {
    "providerId": "safaricom",
    "accountNumber": "0712345678"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "valid": true,
    "accountNumber": "0712345678",
    "accountName": "Verified Account (5678)",
    "providerId": "safaricom",
    "requiresManualVerification": false,
    "verificationMethod": "DIRECT_API",
    "statusMessage": "Account structure validated via provider API gateway.",
    "disclaimer": "Direct provider API validation."
  }
  ```

### `GET /api/v1/utility/config`
Retrieves current marketplace platform pricing configuration and audit log.
- **Response**:
  ```json
  {
    "success": true,
    "config": {
      "piRateUsd": 10.0,
      "minPurchasePi": 0.1,
      "maxPurchasePi": 1000.0,
      "currencySymbol": "$",
      "autoRateUpdateEnabled": true,
      "autoUpdateSource": "Platform Pricing Administration Rule",
      "lastUpdated": "2026-08-03T15:35:00.000Z",
      "updatedBy": "Platform Governance Engine",
      "disclaimer": "Pricing configuration established by marketplace administration."
    },
    "logs": []
  }
  ```

---

## 3. AI Concierge Endpoints

### `POST /api/v1/ai/search`
Queries Gemini 3.6 Flash / OpenAI abstraction layer for natural language product matching.
- **Request Body**:
  ```json
  {
    "query": "Solar powered charger",
    "provider": "gemini",
    "catalog": []
  }
  ```
- **Response**:
  ```json
  {
    "aiInsights": "Found 2 matching solar energy items in catalog.",
    "recommendedProductIds": ["prod-001", "prod-004"],
    "suggestedCategory": "physical",
    "providerUsed": "Gemini 3.6 Flash"
  }
  ```

---

## 4. PSTP Security & Audit Endpoints

### `GET /api/v1/pstp/audit-logs`
Fetches immutable security audit log.

### `POST /api/v1/pstp/audit-logs`
Appends a security audit entry.
