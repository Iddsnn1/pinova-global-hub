export type UtilityCategoryType =
  | 'airtime'
  | 'data'
  | 'electricity'
  | 'cable'
  | 'internet'
  | 'water'
  | 'exam'
  | 'education'
  | 'giftcard'
  | 'voucher'
  | 'betting'
  | 'gaming'
  | 'streaming'
  | 'insurance'
  | 'government'
  | 'transport'
  | 'events'
  | 'ecommerce';

export interface UtilityProviderPackage {
  id: string;
  name: string;
  description: string;
  fiatPrice: number;
  currency: string; // e.g. USD, NGN, KSh, EUR
  validity?: string; // e.g. 30 Days, Instant, Lifetime
  badge?: string; // e.g. Popular, Best Value, Hot
}

export interface UtilityServiceProvider {
  id: string;
  name: string;
  category: UtilityCategoryType;
  logo: string;
  country: string;
  countryCode?: string;
  dialCode?: string;
  supportsCustomAmount: boolean;
  supportsFixedPackages: boolean;
  accountLabel: string; // e.g. "Phone Number", "Meter Number", "IUC / Smartcard Number", "Customer Ref ID"
  accountPlaceholder: string;
  accountValidationRegex?: string;
  minCustomFiat?: number;
  maxCustomFiat?: number;
  currency: string; // e.g. "USD"
  enabled: boolean;
  hasDirectValidationApi?: boolean;
  packages: UtilityProviderPackage[];
}

export interface PiConversionConfig {
  piRateUsd: number; // e.g. 10.00 ($10.00 USD per 1 Pi)
  minPurchasePi: number; // e.g. 0.05 Pi
  maxPurchasePi: number; // e.g. 1000.00 Pi
  currencyCode: string; // "USD"
  currencySymbol: string; // "$"
  autoRateUpdateEnabled: boolean;
  autoUpdateSource?: string; // e.g. "Pi Market Index Oracle API"
  lastUpdated: string;
  updatedBy: string;
}

export interface ConversionRateLog {
  id: string;
  previousRateUsd: number;
  newRateUsd: number;
  reason: string;
  updatedBy: string;
  timestamp: string;
}

export interface AccountValidationResult {
  valid: boolean;
  accountName?: string;
  accountNumber: string;
  providerId: string;
  statusMessage: string;
  details?: Record<string, any>;
}

export interface UtilityTransactionReceipt {
  transactionId: string;
  piPaymentId?: string;
  piTxid?: string;
  category: UtilityCategoryType;
  providerId: string;
  providerName: string;
  accountNumber: string;
  accountName?: string;
  fiatAmount: number;
  fiatCurrency: string;
  appliedPiRateUsd: number;
  piAmount: number;
  packageName?: string;
  tokenOrCode?: string; // e.g. Electricity Recharge Token, WAEC PIN, Voucher Code
  serialNumber?: string;
  status: 'SUCCESS' | 'PROCESSING' | 'FAILED' | 'REFUNDED';
  timestamp: string;
  orderProtectionGuaranteed: boolean;
  buyerUsername: string;
}
