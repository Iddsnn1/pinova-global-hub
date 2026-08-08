import { Product, Order, MerchantStore } from '../../types';

export type TimePeriod = '7d' | '30d' | '90d' | '1y' | 'all';
export type ViewPerspective = 'marketplace' | 'merchant' | 'admin';

export interface RevenueTrendPoint {
  date: string;
  grossSalesPi: number;
  netRevenuePi: number;
  ordersCount: number;
  completedOrdersCount: number;
  avgOrderValuePi: number;
}

export interface FinancialSummary {
  grossMarketplaceSalesPi: number;
  netMarketplaceRevenuePi: number;
  totalOrders: number;
  completedOrders: number;
  averageOrderValuePi: number;
  dailyRevenuePi: number;
  weeklyRevenuePi: number;
  monthlyRevenuePi: number;
  annualRevenuePi: number;
  revenueTrends: RevenueTrendPoint[];
  currencySymbol: string; // 'π'
}

export interface ProductPerformanceItem {
  productId: string;
  title: string;
  category: string;
  unitsSold: number;
  revenuePi: number;
  stockQty: number;
  rating: number;
  returnRatePercent: number;
}

export interface MerchantFinancialMetrics {
  merchantId: string;
  merchantName: string;
  totalSalesPi: number;
  netPayoutPi: number;
  pendingEscrowPi: number;
  totalOrders: number;
  orderCompletionRatePercent: number;
  refundRequestsCount: number;
  refundsApprovedCount: number;
  refundsTotalPi: number;
  repeatCustomerRatePercent: number;
  customerGrowthRatePercent: number;
  totalInventoryValuePi: number;
  bestSellingProducts: ProductPerformanceItem[];
  storePerformanceList: {
    storeId: string;
    storeName: string;
    salesPi: number;
    ordersCount: number;
    completionRatePercent: number;
  }[];
}

export interface CategoryAnalytics {
  category: string;
  label: string;
  grossSalesPi: number;
  ordersCount: number;
  growthRatePercent: number;
  demandIndex: number; // 0-100 scale
}

export interface SearchTrendItem {
  keyword: string;
  searchVolume: number;
  conversionRatePercent: number;
  trendingDirection: 'up' | 'down' | 'stable';
}

export interface CustomerBehaviorMetrics {
  cartAbandonmentRatePercent: number;
  avgSessionDurationMinutes: number;
  pagesPerSession: number;
  repeatPurchaseCycleDays: number;
  activePioneersCount: number;
  newPioneersThisMonth: number;
}

export interface TrafficSourceItem {
  source: string;
  visitors: number;
  sharePercent: number;
  conversionRatePercent: number;
}

export interface GeographicDistItem {
  region: string;
  activeBuyers: number;
  volumePi: number;
  percentage: number;
}

export interface DeviceDistItem {
  deviceType: string;
  sharePercent: number;
  ordersCount: number;
}

export interface MarketplaceAnalyticsData {
  categoryPerformance: CategoryAnalytics[];
  searchTrends: SearchTrendItem[];
  customerBehavior: CustomerBehaviorMetrics;
  trafficSources: TrafficSourceItem[];
  geographicDistribution: GeographicDistItem[];
  deviceDistribution: DeviceDistItem[];
  marketplaceGrowthRatePercent: number;
  activeSellerCount: number;
  activeBuyerCount: number;
  topSellersByVolume: {
    sellerId: string;
    sellerName: string;
    volumePi: number;
    ordersCount: number;
    rating: number;
  }[];
}

export interface ForecastPoint {
  periodLabel: string;
  projectedRevenuePi: number;
  confidenceLowerPi: number;
  confidenceUpperPi: number;
}

export interface DemandForecastItem {
  categoryOrProduct: string;
  currentDemandIndex: number;
  predictedDemand30d: number;
  recommendedStockBuffer: number;
  surgeProbabilityPercent: number;
}

export interface InventoryForecastItem {
  productId: string;
  productTitle: string;
  currentStock: number;
  estimatedDaysUntilStockout: number;
  recommendedReorderQty: number;
  urgency: 'high' | 'medium' | 'low';
}

export interface BIRecommendation {
  id: string;
  title: string;
  category: 'inventory' | 'pricing' | 'protection' | 'marketing' | 'logistics' | 'compliance';
  impact: 'HIGH_REVENUE' | 'COST_SAVING' | 'RISK_MITIGATION' | 'CUSTOMER_RETENTION';
  confidencePercent: number;
  description: string;
  actionText: string;
  applied: boolean;
  createdAt: string;
}

export interface BusinessIntelligenceData {
  kpiScorecard: {
    grossSalesTargetProgressPercent: number;
    netMarginPercent: number;
    disputeRatePercent: number;
    fulfillmentSlaPercent: number;
    customerSatisfactionScore: number;
    operationalHealthScore: number;
    marketplacePerformanceScore: number;
  };
  demandForecasts: DemandForecastItem[];
  inventoryForecasts: InventoryForecastItem[];
  revenueForecasts: ForecastPoint[];
  customerInsights: {
    topCohort: string;
    avgLtvPi: number;
    churnRiskPercent: number;
    primaryPaymentCurrency: string;
  };
  merchantInsights: {
    topPerformingStoreType: string;
    avgVerificationTimeHours: number;
    orderVerificationSpeedAvgDays: number;
  };
  operationalRecommendations: BIRecommendation[];
}

export type DataSourceProvenance = 'verified_marketplace_ledger' | 'ai_generated_estimate' | 'calculated_marketplace_metric';

export interface AnalyticsAuditRecord {
  id: string;
  timestamp: string;
  actor: string;
  userRole: string;
  module: 'finance_analytics';
  actionType: 'EXPORT_CSV' | 'EXPORT_PDF' | 'CALCULATE_BI_FORECAST' | 'VIEW_FINANCIAL_SUMMARY' | 'APPLY_BI_RECOMMENDATION' | 'RBAC_PERMISSION_CHANGE';
  reportType: string;
  exportFormat?: string;
  dataProvenance: DataSourceProvenance;
  metadata?: string;
}

export type RBACRole = 'Admin' | 'Merchant' | 'Analyst' | 'Auditor';

export interface ModulePermissionConfig {
  financialSummary: RBACRole[];
  salesAnalytics: RBACRole[];
  biForecasting: RBACRole[];
  auditGovernance: RBACRole[];
}

export type DashboardPresetRole = 'Administrator' | 'Merchant' | 'Business Manager' | 'Finance Officer' | 'Auditor' | 'Analyst';


export interface WidgetConfig {
  id: string;
  title: string;
  visible: boolean;
  order: number;
  size: 'small' | 'medium' | 'large' | 'full';
  category: 'kpi' | 'chart' | 'table' | 'forecasting' | 'insights';
}

export interface DashboardLayoutProfile {
  id: string;
  name: string;
  rolePreset: DashboardPresetRole;
  widgets: WidgetConfig[];
  isDefault?: boolean;
}

export interface SavedReport {
  id: string;
  title: string;
  description: string;
  perspective: ViewPerspective;
  timePeriod: TimePeriod;
  categoryFilter: string;
  createdAt: string;
  createdBy: string;
  isFavorite: boolean;
  sharedWithRoles: RBACRole[];
  lastOpenedAt?: string;
  isTemplate?: boolean;
}

export type ScheduleFrequency = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';

export interface ScheduledReportConfig {
  id: string;
  reportId: string;
  reportTitle: string;
  frequency: ScheduleFrequency;
  recipientRoles: RBACRole[];
  exportFormat: 'CSV' | 'PDF';
  enabled: boolean;
  nextRunAt: string;
  lastRunAt?: string;
  deliveryChannel: 'In-App Notification' | 'Configured Webhook Integrations' | 'External System Integrations';
}

export interface UserAnalyticsPreferences {
  activePreset: DashboardPresetRole;
  comparisonPeriod: 'previous_period' | 'year_over_year' | 'none';
  defaultTimePeriod: TimePeriod;
  defaultPerspective: ViewPerspective;
  chartStyle: 'area' | 'bar' | 'line';
  layoutProfileId: string;
}

