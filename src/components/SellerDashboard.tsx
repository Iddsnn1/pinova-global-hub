import React from 'react';
import { Product, Order, Vendor, Coupon } from '../types';
import { MerchantEcosystemHub } from './merchant/MerchantEcosystemHub';

interface SellerDashboardProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (newProduct: Product) => void;
  onUpdateFulfillment: (orderId: string, trackingNumber: string, carrier: string) => void;
  vendorProfile: Vendor;
  coupons: Coupon[];
  onCreateCoupon: (newCoupon: Coupon) => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({
  products,
  orders,
  onAddProduct,
  onUpdateFulfillment,
  vendorProfile,
  coupons,
  onCreateCoupon
}) => {
  return (
    <MerchantEcosystemHub
      products={products}
      orders={orders}
      coupons={coupons}
      vendorProfile={vendorProfile}
      onAddProduct={onAddProduct}
      onUpdateFulfillment={onUpdateFulfillment}
      onCreateCoupon={onCreateCoupon}
    />
  );
};
