#!/usr/bin/env node
/**
 * Non-destructive, idempotent Neon importer.
 *
 * Input JSON shape:
 * {
 *   "products": [],
 *   "orders": [],
 *   "vendorApplications": [],
 *   "orderFulfillment": []
 * }
 *
 * This script NEVER deletes source data and NEVER truncates Neon tables.
 * It is intentionally separate from normal API reads so catalog GETs stay side-effect free.
 *
 * Usage:
 *   DATABASE_URL="..." node scripts/import-neon-backup.mjs ./backup/pinova-export.json
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { neon } from '@neondatabase/serverless';

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: node scripts/import-neon-backup.mjs <backup.json>');
  process.exit(1);
}

const databaseUrl = String(process.env.DATABASE_URL || '').trim();
if (!databaseUrl) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

const resolved = path.resolve(inputPath);
if (!fs.existsSync(resolved)) {
  console.error(`Backup file not found: ${resolved}`);
  process.exit(1);
}

const parsed = JSON.parse(fs.readFileSync(resolved, 'utf8'));
const asArray = (value, name) => {
  if (value == null) return [];
  if (!Array.isArray(value)) throw new Error(`${name} must be an array`);
  return value;
};

const products = asArray(parsed.products, 'products');
const orders = asArray(parsed.orders, 'orders');
const vendorApplications = asArray(
  parsed.vendorApplications ?? parsed.vendor_applications,
  'vendorApplications'
);
const orderFulfillment = asArray(
  parsed.orderFulfillment ?? parsed.order_fulfillment,
  'orderFulfillment'
);

const sql = neon(databaseUrl);
const requiredString = (value, field, index, collection) => {
  const v = String(value ?? '').trim();
  if (!v) throw new Error(`${collection}[${index}].${field} is required`);
  return v;
};
const json = (value) => JSON.stringify(value ?? {});
const decimalString = (value, field) => {
  if (typeof value === 'string') {
    const v = value.trim();
    if (!/^\d+(?:\.\d+)?$/.test(v)) throw new Error(`${field} must be a non-negative decimal string`);
    return v;
  }
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) return String(value);
  throw new Error(`${field} must be a non-negative decimal value`);
};

// Validate the entire payload before the first write.
for (let i = 0; i < products.length; i += 1) {
  const p = products[i];
  requiredString(p.id, 'id', i, 'products');
  requiredString(p.sellerId, 'sellerId', i, 'products');
  requiredString(p.title, 'title', i, 'products');
  const pricePi = decimalString(p.pricePi, `products[${i}].pricePi`);
  const stock = Number(p.stock);
  void pricePi;
  if (!Number.isInteger(stock) || stock < 0) throw new Error(`products[${i}].stock invalid`);
}
for (let i = 0; i < orders.length; i += 1) {
  const o = orders[i];
  requiredString(o.id, 'id', i, 'orders');
  requiredString(o.buyerUsername, 'buyerUsername', i, 'orders');
  const totalPi = decimalString(o.totalPi, `orders[${i}].totalPi`);
  void totalPi;
  if (!Array.isArray(o.items) || o.items.length === 0) throw new Error(`orders[${i}].items required`);
}
for (let i = 0; i < vendorApplications.length; i += 1) {
  const a = vendorApplications[i];
  requiredString(a.id, 'id', i, 'vendorApplications');
  requiredString(a.pioneerUsername, 'pioneerUsername', i, 'vendorApplications');
}
for (let i = 0; i < orderFulfillment.length; i += 1) {
  requiredString(orderFulfillment[i].orderId ?? orderFulfillment[i].order_id, 'orderId', i, 'orderFulfillment');
}

const productQueries = [];
const orderQueries = [];
const vendorApplicationQueries = [];
const fulfillmentQueries = [];

let counts = {
  products: 0,
  orders: 0,
  vendorApplications: 0,
  orderFulfillment: 0
};

for (let i = 0; i < products.length; i += 1) {
  const p = products[i];
  const id = requiredString(p.id, 'id', i, 'products');
  const sellerId = requiredString(p.sellerId, 'sellerId', i, 'products');
  const title = requiredString(p.title, 'title', i, 'products');
  const pricePi = decimalString(p.pricePi, `products[${i}].pricePi`);
  const stock = Number(p.stock);
  void pricePi;
  if (!Number.isInteger(stock) || stock < 0) throw new Error(`products[${i}].stock invalid`);
  productQueries.push(sql`
    INSERT INTO products
      (id,seller_id,title,marketplace_category,category,price_pi,stock,availability_status,
       is_active,is_deleted,moderation_status,data,created_at,updated_at)
    VALUES
      (${id},${sellerId},${title},${p.marketplaceCategory ?? null},${p.category ?? null},
       ${pricePi},${stock},${p.availabilityStatus ?? null},${p.isActive === true},
       ${p.isDeleted === true},${p.moderationStatus ?? 'PENDING_REVIEW'},${json(p)}::jsonb,
       ${p.createdAt ?? new Date().toISOString()},${p.updatedAt ?? new Date().toISOString()})
    ON CONFLICT (id) DO NOTHING
  `);
  counts.products += 1;
}
if (productQueries.length) await sql.transaction(productQueries);

for (let i = 0; i < orders.length; i += 1) {
  const o = orders[i];
  const id = requiredString(o.id, 'id', i, 'orders');
  const buyerUsername = requiredString(o.buyerUsername, 'buyerUsername', i, 'orders');
  const totalPi = decimalString(o.totalPi, `orders[${i}].totalPi`);
  void totalPi;
  if (!Array.isArray(o.items) || o.items.length === 0) throw new Error(`orders[${i}].items required`);
  orderQueries.push(sql`
    INSERT INTO orders
      (id,buyer_username,total_pi,escrow_status,pstp_status,pi_payment_id,pi_txid,server_verified,
       tracking_number,carrier,is_deleted,data,created_at,updated_at)
    VALUES
      (${id},${buyerUsername},${totalPi},${o.escrowStatus ?? 'pending'},${o.pstpStatus ?? 'Pending'},
       ${o.piPaymentId ?? null},${o.piTxid ?? null},${o.serverVerified === true},
       ${o.trackingNumber ?? null},${o.carrier ?? null},${o.isDeleted === true},${json(o)}::jsonb,
       ${o.createdAt ?? new Date().toISOString()},${o.updatedAt ?? new Date().toISOString()})
    ON CONFLICT (id) DO NOTHING
  `);
  counts.orders += 1;
}
if (orderQueries.length) await sql.transaction(orderQueries);

for (let i = 0; i < vendorApplications.length; i += 1) {
  const a = vendorApplications[i];
  const id = requiredString(a.id, 'id', i, 'vendorApplications');
  const username = requiredString(a.pioneerUsername, 'pioneerUsername', i, 'vendorApplications');
  vendorApplicationQueries.push(sql`
    INSERT INTO vendor_applications
      (id,pioneer_username,pioneer_uid,status,data,created_at,updated_at)
    VALUES
      (${id},${username},${a.pioneerUid ?? null},${a.status ?? null},${json(a)}::jsonb,
       ${a.createdAt ?? new Date().toISOString()},${a.updatedAt ?? new Date().toISOString()})
    ON CONFLICT (id) DO NOTHING
  `);
  counts.vendorApplications += 1;
}
if (vendorApplicationQueries.length) await sql.transaction(vendorApplicationQueries);

for (let i = 0; i < orderFulfillment.length; i += 1) {
  const f = orderFulfillment[i];
  const orderId = requiredString(f.orderId ?? f.order_id, 'orderId', i, 'orderFulfillment');
  fulfillmentQueries.push(sql`
    INSERT INTO order_fulfillment
      (order_id,status,carrier,tracking_number,data,updated_at)
    VALUES
      (${orderId},${f.status ?? null},${f.carrier ?? null},${f.trackingNumber ?? f.tracking_number ?? null},
       ${json(f)}::jsonb,${f.updatedAt ?? f.updated_at ?? new Date().toISOString()})
    ON CONFLICT (order_id) DO NOTHING
  `);
  counts.orderFulfillment += 1;
}
if (fulfillmentQueries.length) await sql.transaction(fulfillmentQueries);

const actualCounts = {
  products: Number((await sql`SELECT COUNT(*)::int AS count FROM products`)[0].count),
  orders: Number((await sql`SELECT COUNT(*)::int AS count FROM orders`)[0].count),
  vendorApplications: Number((await sql`SELECT COUNT(*)::int AS count FROM vendor_applications`)[0].count),
  orderFulfillment: Number((await sql`SELECT COUNT(*)::int AS count FROM order_fulfillment`)[0].count)
};

console.log(JSON.stringify({
  ok: true,
  source: resolved,
  imported: counts,
  actualNeonCounts: actualCounts,
  destructiveOperations: false
}, null, 2));
