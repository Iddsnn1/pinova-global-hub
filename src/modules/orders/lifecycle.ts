import type { PstpOrderStatus } from '../../types';

export const SELLER_FULFILLMENT_TRANSITIONS: Partial<Record<PstpOrderStatus, PstpOrderStatus[]>> = {
  'Payment Verified': ['Seller Accepted'],
  'Seller Accepted': ['Preparing Order'],
  'Preparing Order': ['Packed'],
  'Packed': ['Shipped'],
};

export const CARRIER_FULFILLMENT_TRANSITIONS: Partial<Record<PstpOrderStatus, PstpOrderStatus>> = {
  'Shipped': 'In Transit',
  'In Transit': 'Out for Delivery',
  'Out for Delivery': 'Delivered',
};

export const ORDER_LIFECYCLE_TRANSITIONS: Partial<Record<PstpOrderStatus, PstpOrderStatus[]>> = {
  'Draft': ['Pending Payment', 'Cancelled'],
  'Pending Payment': ['Payment Authorized', 'Cancelled'],
  'Payment Authorized': ['Payment Verified', 'Cancelled'],
  'Payment Verified': ['Transaction Recorded', 'Seller Accepted', 'Refunded', 'Cancelled'],
  'Transaction Recorded': ['Order Confirmed', 'Refunded', 'Cancelled'],
  'Order Confirmed': ['Seller Accepted', 'Processing', 'Preparing Shipment', 'Refunded', 'Cancelled'],
  'Seller Accepted': ['Preparing Order'],
  'Processing': ['Preparing Order', 'Preparing Shipment'],
  'Preparing Order': ['Packed'],
  'Preparing Shipment': ['Packed'],
  'Packed': ['Shipped'],
  'Shipped': ['In Transit'],
  'In Transit': ['Out for Delivery'],
  'Out for Delivery': ['Delivered'],
  'Delivered': ['Buyer Confirmation', 'Refund Requested', 'Disputed'],
  'Buyer Confirmation': ['Completed', 'Disputed', 'Refunded'],
  'Completed': ['Closed', 'Refunded', 'Disputed'],
  'Cancelled': ['Closed'],
  'Refund Requested': ['Refund Completed', 'Refunded', 'Disputed'],
  'Refund Completed': ['Closed'],
  'Refunded': ['Closed'],
  'Disputed': ['Resolved', 'Completed', 'Refunded', 'Closed'],
  'Resolved': ['Closed'],
  'Closed': [],
};

export function isAllowedOrderTransition(
  currentStatus: PstpOrderStatus,
  nextStatus: PstpOrderStatus
): boolean {
  return (ORDER_LIFECYCLE_TRANSITIONS[currentStatus] || []).includes(nextStatus);
}

export function isAllowedSellerTransition(
  currentStatus: PstpOrderStatus,
  nextStatus: PstpOrderStatus
): boolean {
  return (SELLER_FULFILLMENT_TRANSITIONS[currentStatus] || []).includes(nextStatus);
}

export function expectedCarrierTransition(
  currentStatus: PstpOrderStatus
): PstpOrderStatus | null {
  return CARRIER_FULFILLMENT_TRANSITIONS[currentStatus] || null;
}
