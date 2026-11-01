import { Product, Vendor, Review, Coupon, Order } from '../types';

/**
 * Production-safe marketplace data boundary.
 *
 * This module intentionally contains NO seeded/demo marketplace records.
 * Real products, vendors, reviews, coupons, and orders must come from
 * authenticated server-side sources. Keep demo fixtures outside production.
 */
export const INITIAL_PRODUCTS: Product[] = [];
export const MOCK_VENDORS: Vendor[] = [];
export const MOCK_REVIEWS: Review[] = [];
export const MOCK_COUPONS: Coupon[] = [];
export const SAMPLE_ORDERS: Order[] = [];
