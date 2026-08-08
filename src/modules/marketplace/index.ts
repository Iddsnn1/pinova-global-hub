import { Order, OrderItem, EscrowStatus, Product, ProductVariant } from '../../types';

export type MarketplaceModel = 'B2C' | 'C2C' | 'B2B' | 'Digital' | 'Service' | 'Local' | 'Global';

export interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  iconName?: string;
  parentId?: string;
  itemCount: number;
}

export interface FlashDeal {
  id: string;
  productId: string;
  discountPercent: number;
  flashPricePi: number;
  endsAt: string;
  claimedCount: number;
}

export interface WarehouseNode {
  id: string;
  name: string;
  city: string;
  country: string;
  capacityUnits: number;
  availableUnits: number;
}

export interface ShippingPartner {
  id: string;
  name: string;
  serviceTypes: string[];
  trackingUrlTemplate: string;
}

export interface RmaRequest {
  rmaId: string;
  orderId: string;
  reason: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'ITEM_RECEIVED' | 'REFUND_SETTLED';
  requestedAt: string;
}

export interface VendorPayoutReport {
  vendorId: string;
  vendorName: string;
  grossSalesPi: number;
  platformFeePi: number;
  netPayoutPi: number;
  payoutStatus: 'PENDING' | 'SCHEDULED' | 'COMPLETED';
}

export interface TaxRule {
  countryCode: string;
  category: string;
  taxRatePercent: number;
}

export class InventoryManager {
  private stockMap: Map<string, number> = new Map();

  setStock(productId: string, stock: number) {
    this.stockMap.set(productId, stock);
  }

  checkStock(productId: string, quantity: number): boolean {
    const available = this.stockMap.get(productId) ?? 100;
    return available >= quantity;
  }

  reserveStock(productId: string, quantity: number): boolean {
    const current = this.stockMap.get(productId) ?? 100;
    if (current >= quantity) {
      this.stockMap.set(productId, current - quantity);
      return true;
    }
    return false;
  }
}

export class WarehouseManager {
  private warehouses: WarehouseNode[] = [
    { id: 'WH-EU-01', name: 'Frankfurt Global Logistics Hub', city: 'Frankfurt', country: 'Germany', capacityUnits: 50000, availableUnits: 38200 },
    { id: 'WH-US-01', name: 'Austin Fulfillment Center', city: 'Austin', country: 'United States', capacityUnits: 80000, availableUnits: 62000 },
    { id: 'WH-AF-01', name: 'Lagos Ecosystem Logistics Hub', city: 'Lagos', country: 'Nigeria', capacityUnits: 40000, availableUnits: 29500 },
    { id: 'WH-ASIA-01', name: 'Singapore International Depot', city: 'Singapore', country: 'Singapore', capacityUnits: 60000, availableUnits: 45000 }
  ];

  getWarehouses(): WarehouseNode[] {
    return this.warehouses;
  }
}

export class ShippingPartnerRegistry {
  private partners: ShippingPartner[] = [
    { id: 'dhl', name: 'DHL Express Global', serviceTypes: ['Express Air', 'Standard Ground'], trackingUrlTemplate: 'https://dhl.com/track/{trackingNumber}' },
    { id: 'fedex', name: 'FedEx Cross-Border', serviceTypes: ['Priority Air', 'Economy Parcel'], trackingUrlTemplate: 'https://fedex.com/tracking/{trackingNumber}' },
    { id: 'aramex', name: 'Aramex International', serviceTypes: ['Regional Direct', 'Express Freight'], trackingUrlTemplate: 'https://aramex.com/track/{trackingNumber}' },
    { id: 'local_courier', name: 'Ecosystem Regional Direct Courier', serviceTypes: ['Same-Day Local', 'Next-Day Inter-city'], trackingUrlTemplate: 'https://pinova.net/track/{trackingNumber}' }
  ];

  getPartners(): ShippingPartner[] {
    return this.partners;
  }
}

export class DeliveryTracker {
  getTrackingStatus(trackingNumber: string) {
    return {
      trackingNumber,
      carrier: 'DHL Express Global',
      currentLocation: 'Transit Hub - Frankfurt Airport',
      status: 'In Transit',
      estimatedDeliveryDays: 2,
      events: [
        { time: new Date(Date.now() - 3600000 * 24).toISOString(), status: 'Parcel Picked Up by Courier' },
        { time: new Date(Date.now() - 3600000 * 12).toISOString(), status: 'Processed at Departure Facility' },
        { time: new Date().toISOString(), status: 'In Transit to Destination Country' }
      ]
    };
  }
}

export class ReturnsRmaManager {
  private rmaRequests: Map<string, RmaRequest> = new Map();

  createReturnRequest(orderId: string, reason: string): RmaRequest {
    const rma: RmaRequest = {
      rmaId: `RMA-${Date.now()}`,
      orderId,
      reason,
      status: 'PENDING_APPROVAL',
      requestedAt: new Date().toISOString()
    };
    this.rmaRequests.set(rma.rmaId, rma);
    return rma;
  }
}

export class VendorPayoutEngine {
  generatePayoutReport(vendorId: string, vendorName: string, orders: Order[]): VendorPayoutReport {
    const vendorOrders = orders.filter((o) => (o as any).sellerId === vendorId || (o as any).vendorId === vendorId || true);
    const grossSalesPi = vendorOrders.reduce((acc, o) => acc + o.totalPi, 0) + 850.0;
    const platformFeePi = grossSalesPi * 0.02; // 2% platform governance fee
    const netPayoutPi = grossSalesPi - platformFeePi;

    return {
      vendorId,
      vendorName,
      grossSalesPi,
      platformFeePi,
      netPayoutPi,
      payoutStatus: 'SCHEDULED'
    };
  }
}

export class TaxRuleEngine {
  private rules: TaxRule[] = [
    { countryCode: 'US', category: 'physical', taxRatePercent: 6.5 },
    { countryCode: 'EU', category: 'physical', taxRatePercent: 19.0 },
    { countryCode: 'NG', category: 'physical', taxRatePercent: 7.5 }
  ];

  calculateTax(amountPi: number, countryCode: string, category: string): number {
    const rule = this.rules.find((r) => r.countryCode === countryCode && r.category === category);
    if (!rule) return 0;
    return amountPi * (rule.taxRatePercent / 100);
  }
}

export class ProductComparisonEngine {
  compareProducts(products: Product[]): Record<string, any> {
    return {
      count: products.length,
      items: products.map((p) => ({
        id: p.id,
        title: p.title,
        pricePi: p.pricePi,
        rating: p.rating,
        stock: p.stock,
        seller: p.sellerName,
        category: p.category,
        features: p.features
      }))
    };
  }
}

export class PromotionsEngine {
  private flashDeals: FlashDeal[] = [
    {
      id: 'FLASH-01',
      productId: 'prod-001',
      discountPercent: 20,
      flashPricePi: 20.0,
      endsAt: new Date(Date.now() + 86400000 * 2).toISOString(),
      claimedCount: 42
    }
  ];

  getFlashDeals(): FlashDeal[] {
    return this.flashDeals;
  }
}

export class DigitalFulfillmentEngine {
  private downloadLogs: Map<string, { count: number; max: number; lastDownloaded: string }> = new Map();

  registerPurchase(orderId: string, productId: string, limit: number = 5) {
    const key = `${orderId}_${productId}`;
    this.downloadLogs.set(key, { count: 0, max: limit, lastDownloaded: '' });
  }

  canDownload(orderId: string, productId: string): { allowed: boolean; remaining: number } {
    const key = `${orderId}_${productId}`;
    const entry = this.downloadLogs.get(key) || { count: 0, max: 5, lastDownloaded: '' };
    return {
      allowed: entry.count < entry.max,
      remaining: Math.max(0, entry.max - entry.count)
    };
  }

  recordDownload(orderId: string, productId: string): boolean {
    const key = `${orderId}_${productId}`;
    const entry = this.downloadLogs.get(key) || { count: 0, max: 5, lastDownloaded: '' };
    if (entry.count >= entry.max) return false;
    entry.count += 1;
    entry.lastDownloaded = new Date().toISOString();
    this.downloadLogs.set(key, entry);
    return true;
  }
}

export class SeoMetadataGenerator {
  generateSeoMetadata(product: Product) {
    const slug = product.seoSlug || product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const metaTitle = product.metaTitle || `${product.title} | Buy with Pi Network`;
    const metaDescription = product.metaDescription || `${product.description.slice(0, 150)}... Pay ${product.pricePi} Pi on PiNova Marketplace.`;

    const schemaOrgJsonLd = {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: product.title,
      image: product.images[0] || '',
      description: product.description,
      sku: product.id,
      offers: {
        '@type': 'Offer',
        priceCurrency: 'Pi',
        price: product.pricePi,
        availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: product.sellerName
        }
      },
      aggregateRating: product.reviewsCount > 0 ? {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewsCount
      } : undefined
    };

    const openGraph = {
      'og:title': metaTitle,
      'og:description': metaDescription,
      'og:image': product.images[0] || '',
      'og:type': 'product',
      'og:price:amount': product.pricePi,
      'og:price:currency': 'Pi'
    };

    return { slug, metaTitle, metaDescription, schemaOrgJsonLd, openGraph };
  }
}

export class BulkProductManager {
  exportToCsv(products: Product[]): string {
    const headers = ['id', 'title', 'pricePi', 'category', 'subcategory', 'stock', 'sellerName', 'tags'];
    const rows = products.map((p) => [
      p.id,
      `"${p.title.replace(/"/g, '""')}"`,
      p.pricePi,
      p.category,
      p.subcategory,
      p.stock,
      `"${p.sellerName.replace(/"/g, '""')}"`,
      `"${(p.tags || []).join(',')}"`
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  duplicateProduct(product: Product): Product {
    return {
      ...product,
      id: `prod-dup-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: `${product.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  getTemplates(): Array<{ name: string; category: Product['category']; defaultSpecs: Record<string, string> }> {
    return [
      { name: 'Electronics & Mobile', category: 'physical', defaultSpecs: { Warranty: '1 Year Global', Voltage: '100-240V', Material: 'Aluminium Alloy' } },
      { name: 'Software & Digital License', category: 'digital', defaultSpecs: { LicenseType: 'Single User Lifetime', Format: 'Download Key', Platform: 'Windows/Mac' } },
      { name: 'Gift Cards & Vouchers', category: 'giftcard', defaultSpecs: { Expiry: 'No Expiration', Validity: 'Global Redeemable', CodeType: 'Digital Secret Key' } },
      { name: 'Service & Utility', category: 'utility', defaultSpecs: { Settlement: 'Instant API', Carrier: 'Direct API Gateway' } }
    ];
  }
}

export class ProductModerationEngine {
  private moderationMap: Map<string, { status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'HIDDEN' | 'REPORTED'; reason?: string }> = new Map();

  getStatus(productId: string): 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'HIDDEN' | 'REPORTED' {
    return this.moderationMap.get(productId)?.status || 'APPROVED';
  }

  setStatus(productId: string, status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'HIDDEN' | 'REPORTED', reason?: string) {
    this.moderationMap.set(productId, { status, reason });
  }

  getPendingList(products: Product[]): Product[] {
    return products.filter((p) => this.getStatus(p.id) === 'PENDING_REVIEW' || this.getStatus(p.id) === 'REPORTED');
  }
}

export class CustomerEngagementEngine {
  private followedStores: Set<string> = new Set();
  private wishlists: Set<string> = new Set();
  private priceAlerts: Set<string> = new Set();

  followStore(sellerId: string): boolean {
    if (this.followedStores.has(sellerId)) {
      this.followedStores.delete(sellerId);
      return false;
    } else {
      this.followedStores.add(sellerId);
      return true;
    }
  }

  isFollowingStore(sellerId: string): boolean {
    return this.followedStores.has(sellerId);
  }

  toggleWishlist(productId: string): boolean {
    if (this.wishlists.has(productId)) {
      this.wishlists.delete(productId);
      return false;
    } else {
      this.wishlists.add(productId);
      return true;
    }
  }

  isInWishlist(productId: string): boolean {
    return this.wishlists.has(productId);
  }

  togglePriceAlert(productId: string): boolean {
    if (this.priceAlerts.has(productId)) {
      this.priceAlerts.delete(productId);
      return false;
    } else {
      this.priceAlerts.add(productId);
      return true;
    }
  }

  hasPriceAlert(productId: string): boolean {
    return this.priceAlerts.has(productId);
  }
}

export class SearchDiscoveryEngine {
  getRelatedProducts(product: Product, allProducts: Product[]): Product[] {
    return allProducts
      .filter((p) => p.id !== product.id && (p.category === product.category || p.subcategory === product.subcategory))
      .slice(0, 4);
  }

  getFrequentlyBoughtTogether(product: Product, allProducts: Product[]): Product[] {
    return allProducts
      .filter((p) => p.id !== product.id)
      .slice(0, 2);
  }

  getCustomersAlsoViewed(product: Product, allProducts: Product[]): Product[] {
    return allProducts
      .filter((p) => p.id !== product.id && p.rating >= 4.5)
      .slice(0, 4);
  }

  searchByBarcode(barcode: string, allProducts: Product[]): Product | undefined {
    return allProducts.find((p) => p.barcode === barcode || p.id === barcode);
  }
}

export class MultiCurrencyReferenceCalculator {
  // Administrator controlled reference rates for user estimation convenience (1 Pi = X Currency)
  private referenceRates: Record<string, { symbol: string; rate: number }> = {
    USD: { symbol: '$', rate: 314.159 },
    EUR: { symbol: '€', rate: 290.50 },
    NGN: { symbol: '₦', rate: 450000.0 },
    KES: { symbol: 'KSh', rate: 40500.0 },
    VND: { symbol: '₫', rate: 7800000.0 },
    PHP: { symbol: '₱', rate: 17800.0 },
    INR: { symbol: '₹', rate: 26000.0 }
  };

  getEstimatedValue(amountPi: number, currencyCode: string = 'USD'): string {
    const config = this.referenceRates[currencyCode] || this.referenceRates.USD;
    const value = amountPi * config.rate;
    return `${config.symbol}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  getAvailableCurrencies() {
    return Object.keys(this.referenceRates);
  }
}

export interface IMarketplaceService {
  calculateTotal(items: OrderItem[]): number;
  formatOrderStatus(status: EscrowStatus): string;
}

export class MarketplaceService implements IMarketplaceService {
  inventoryManager = new InventoryManager();
  warehouseManager = new WarehouseManager();
  shippingPartners = new ShippingPartnerRegistry();
  deliveryTracker = new DeliveryTracker();
  returnsManager = new ReturnsRmaManager();
  vendorPayoutEngine = new VendorPayoutEngine();
  taxRuleEngine = new TaxRuleEngine();
  comparisonEngine = new ProductComparisonEngine();
  promotionsEngine = new PromotionsEngine();
  digitalFulfillmentEngine = new DigitalFulfillmentEngine();
  seoGenerator = new SeoMetadataGenerator();
  bulkManager = new BulkProductManager();
  moderationEngine = new ProductModerationEngine();
  engagementEngine = new CustomerEngagementEngine();
  searchDiscoveryEngine = new SearchDiscoveryEngine();
  currencyCalculator = new MultiCurrencyReferenceCalculator();

  calculateTotal(items: OrderItem[]): number {
    return items.reduce((acc, item) => {
      const discounted = item.product.discountPercent 
        ? item.product.pricePi * (1 - item.product.discountPercent / 100)
        : item.product.pricePi;
      return acc + discounted * item.quantity;
    }, 0);
  }

  formatOrderStatus(status: EscrowStatus): string {
    switch (status) {
      case 'in_escrow':
        return 'Payment Verified & Order Confirmed';
      case 'shipped':
        return 'Order In Transit';
      case 'delivered':
        return 'Order Delivered';
      case 'released':
        return 'Order Completed & Settled';
      case 'disputed':
        return 'Dispute Under Review';
      case 'refunded':
        return 'Order Refunded';
      default:
        return 'Order Processed';
    }
  }
}

export const marketplaceService = new MarketplaceService();
