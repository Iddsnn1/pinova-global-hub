import React from 'react';
import { Vendor, Product, Review } from '../types';
import { MerchantStorefrontView } from './merchant/MerchantStorefrontView';

interface SellerStorefrontModalProps {
  vendor: Vendor;
  products: Product[];
  reviews?: Review[];
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onToggleWishlist: (product: Product, e: React.MouseEvent) => void;
  wishlistProductIds: string[];
  onInstantBuy: (product: Product, e: React.MouseEvent) => void;
  onContactSeller: (sellerUsername: string) => void;
  onQuickView?: (product: Product, e: React.MouseEvent) => void;
}

export const SellerStorefrontModal: React.FC<SellerStorefrontModalProps> = ({
  vendor,
  products,
  reviews = [],
  onClose,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  wishlistProductIds,
  onInstantBuy,
  onContactSeller,
  onQuickView
}) => {
  return (
    <MerchantStorefrontView
      vendor={vendor}
      products={products}
      reviews={reviews}
      onClose={onClose}
      onSelectProduct={onSelectProduct}
      onAddToCart={onAddToCart}
      onToggleWishlist={onToggleWishlist}
      wishlistProductIds={wishlistProductIds}
      onInstantBuy={onInstantBuy}
      onContactSeller={onContactSeller}
      onQuickView={onQuickView}
      isModal={true}
    />
  );
};

