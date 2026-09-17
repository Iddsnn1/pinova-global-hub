import { Product, ProductCategory, AvailabilityStatus } from '../../../types';
import { StorageEngine } from '../StorageEngine';

export class ProductRepository {
  private engine: StorageEngine<Product>;
  private stockLocks: Map<string, Promise<void>> = new Map();

  constructor() {
    this.engine = new StorageEngine<Product>('marketplace_products', 'id', []);
  }

  public getAll(options?: { includeDeleted?: boolean; activeOnly?: boolean; sellerId?: string; category?: ProductCategory }): Product[] {
    const includeDeleted = options?.includeDeleted === true;
    const activeOnly = options?.activeOnly === true;
    return this.engine.getAll().filter((product) => {
      if (!includeDeleted && product.isDeleted === true) return false;
      if (activeOnly && product.isActive !== true) return false;
      if (options?.sellerId && product.sellerId !== options.sellerId) return false;
      if (options?.category && product.category !== options.category) return false;
      return true;
    });
  }

  public findById(id: string, includeDeleted = false): Product | undefined {
    const product = this.engine.get(id);
    if (!product || (!includeDeleted && product.isDeleted === true)) return undefined;
    return product;
  }

  public findBySeller(sellerId: string): Product[] { return this.getAll({ sellerId }); }

  public search(query: string, options?: { activeOnly?: boolean; category?: ProductCategory }): Product[] {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return this.getAll(options);
    return this.getAll(options).filter((product) => [
      product.title, product.description, product.subcategory, product.sellerName,
      ...(product.features || []), ...(product.tags || [])
    ].join(' ').toLowerCase().includes(normalized));
  }

  public save(product: Product): Product {
    const now = new Date().toISOString();
    const existing = this.engine.get(product.id);
    const normalized: Product = {
      ...product,
      title: product.title.trim(),
      description: product.description.trim(),
      sellerId: product.sellerId.trim(),
      sellerName: product.sellerName.trim(),
      images: Array.isArray(product.images) ? product.images.filter(Boolean) : [],
      features: Array.isArray(product.features) ? product.features.filter(Boolean) : [],
      tags: Array.isArray(product.tags) ? product.tags.filter(Boolean) : [],
      isActive: product.isActive ?? false,
      isDeleted: product.isDeleted ?? false,
      moderationStatus: product.moderationStatus ?? 'PENDING_REVIEW',
      createdAt: existing?.createdAt ?? product.createdAt ?? now,
      updatedAt: now
    };
    if (!normalized.id || !normalized.sellerId || !normalized.title) throw new Error('PRODUCT_ID_SELLER_ID_AND_TITLE_REQUIRED');
    if (!Number.isFinite(normalized.pricePi) || normalized.pricePi < 0) throw new Error('INVALID_PRODUCT_PRICE');
    if (!Number.isInteger(normalized.stock) || normalized.stock < 0) throw new Error('INVALID_PRODUCT_STOCK');
    this.engine.set(normalized.id, normalized);
    return normalized;
  }

  private async lockProduct(id: string): Promise<() => void> {
    while (this.stockLocks.has(id)) await this.stockLocks.get(id);
    let unlock!: () => void;
    const lock = new Promise<void>((resolve) => { unlock = resolve; });
    this.stockLocks.set(id, lock);
    return () => { this.stockLocks.delete(id); unlock(); };
  }

  /** All-or-nothing reservation for physical inventory in the current runtime. */
  public async reserveStockBatch(requests: Array<{ id: string; quantity: number }>): Promise<Product[] | undefined> {
    const merged = new Map<string, number>();
    for (const request of requests) {
      if (!request.id || !Number.isInteger(request.quantity) || request.quantity < 1) throw new Error('INVALID_STOCK_RESERVATION_QUANTITY');
      merged.set(request.id, (merged.get(request.id) || 0) + request.quantity);
    }
    const ids = [...merged.keys()].sort();
    const releases: Array<() => void> = [];
    try {
      for (const id of ids) releases.push(await this.lockProduct(id));
      const products = ids.map((id) => this.engine.get(id));
      for (let i = 0; i < ids.length; i++) {
        const product = products[i];
        const quantity = merged.get(ids[i])!;
        if (!product || product.isDeleted === true || product.isActive !== true) return undefined;
        if (product.fulfillmentType === 'digital_download' || product.fulfillmentType === 'instant_key') continue;
        if (product.stock < quantity) return undefined;
      }
      const updated: Product[] = [];
      for (let i = 0; i < ids.length; i++) {
        const product = products[i]!;
        const quantity = merged.get(ids[i])!;
        if (product.fulfillmentType === 'digital_download' || product.fulfillmentType === 'instant_key') {
          updated.push(product);
          continue;
        }
        const nextStock = product.stock - quantity;
        const next: Product = {
          ...product,
          stock: nextStock,
          availabilityStatus: nextStock <= 0 ? 'out_of_stock' : product.availabilityStatus,
          isActive: nextStock > 0,
          updatedAt: new Date().toISOString()
        };
        this.engine.set(ids[i], next);
        updated.push(next);
      }
      return updated;
    } finally {
      for (let i = releases.length - 1; i >= 0; i--) releases[i]();
    }
  }

  public updateAvailability(id: string, availabilityStatus: AvailabilityStatus, stock: number): Product | undefined {
    const existing = this.engine.get(id);
    if (!existing || existing.isDeleted === true) return undefined;
    if (!Number.isInteger(stock) || stock < 0) throw new Error('INVALID_PRODUCT_STOCK');
    const updated: Product = {
      ...existing, stock, availabilityStatus,
      isActive: availabilityStatus !== 'out_of_stock' && existing.isActive !== false,
      updatedAt: new Date().toISOString()
    };
    this.engine.set(id, updated);
    return updated;
  }

  public softDelete(id: string): boolean {
    const existing = this.engine.get(id);
    if (!existing) return false;
    this.engine.set(id, { ...existing, isDeleted: true, isActive: false, updatedAt: new Date().toISOString() });
    return true;
  }
}
