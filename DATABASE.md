# PiNova Global Hub — Database & Data Architecture

> **Permanent Transparency & Operational Notices:**
> - **Transparency Notice:** PiNova Global Hub is built on a non-custodial platform architecture. Payment processing relies on the Official Pi SDK v2 and Pi Platform API. PiNova never stores or manages Pi wallet private keys, recovery phrases, passphrases, blockchain infrastructure, or official Pi Network services.
> - **Operational Notice:** Certain marketplace capabilities rely on external service providers and official Pi Platform services. Feature availability, response times, and service outcomes may vary depending on provider availability, network connectivity, and Official Pi Platform service status.

## Schema Overview
PiNova uses a hybrid client-side reactive state combined with structured REST API persistence interfaces.

---

## 1. Entities & Data Models

### `Product`
```typescript
interface Product {
  id: string;
  title: string;
  description: string;
  pricePi: number;
  originalPriceUsd?: number;
  discountPercent?: number;
  category: 'physical' | 'digital' | 'services' | 'bills' | 'mobile_topup';
  images: string[];
  rating: number;
  reviewCount: number;
  sellerId: string;
  sellerName: string;
  sellerVerified: boolean;
  stock: number;
  tags: string[];
  featured?: boolean;
  createdAt: string;
}
```

### `Order`
```typescript
interface Order {
  id: string;
  buyerId: string;
  buyerUsername: string;
  sellerId: string;
  items: OrderItem[];
  totalPi: number;
  escrowStatus: 'in_escrow' | 'shipped' | 'delivered' | 'released' | 'disputed' | 'refunded';
  paymentTxid?: string;
  paymentId?: string;
  shippingAddress?: ShippingAddress;
  createdAt: string;
  updatedAt: string;
}
```

### `UtilityServiceProvider`
```typescript
interface UtilityServiceProvider {
  id: string;
  name: string;
  country: string;
  category: string;
  logo: string;
  accountNumberLabel: string;
  accountNumberPlaceholder: string;
  hasDirectValidationApi?: boolean;
  packages: UtilityProviderPackage[];
}
```

### `SecurityLogEntry`
```typescript
interface SecurityLogEntry {
  id: string;
  userId: string;
  eventType: 'LOGIN_SUCCESS' | 'LOGIN_FAILURE' | 'SECRET_ROTATION' | 'API_KEY_CREATED' | 'ANOMALY_DETECTED';
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}
```

---

## 2. Persistence Strategy
- **Primary Database Engine**: Firebase Firestore / Cloud SQL backend compatibility layer.
- **Cache & Offline**: LocalStorage reactive cache for active cart items and user locale preferences.
- **Audit Logging**: Append-only log storage for PSTP security events and pricing rule updates.
