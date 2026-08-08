import { Product, ProductCategory } from '../../types';

export interface ICatalogFilterOptions {
  category: ProductCategory | 'all';
  searchQuery?: string;
  minPrice?: number;
  maxPrice?: number;
  country?: string;
}

export class CatalogService {
  filterProducts(products: Product[], options: ICatalogFilterOptions): Product[] {
    return products.filter((p) => {
      // Category check
      if (options.category !== 'all' && p.category !== options.category) {
        return false;
      }

      // Search query check
      if (options.searchQuery && options.searchQuery.trim() !== '') {
        const q = options.searchQuery.toLowerCase();
        const matchesTitle = (p.title || '').toLowerCase().includes(q);
        const matchesDesc = (p.description || '').toLowerCase().includes(q);
        const matchesTags = Array.isArray(p.tags) && p.tags.some((t) => typeof t === 'string' && t.toLowerCase().includes(q));
        const matchesVendor = (p.sellerName || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesTags && !matchesVendor) {
          return false;
        }
      }

      // Price check
      if (options.minPrice !== undefined && p.pricePi < options.minPrice) return false;
      if (options.maxPrice !== undefined && p.pricePi > options.maxPrice) return false;

      // Country check
      if (options.country && p.sellerName) {
        if (!(p.sellerName || '').toLowerCase().includes((options.country || '').toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }
}

export const catalogService = new CatalogService();
