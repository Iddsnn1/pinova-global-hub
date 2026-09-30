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
  const pricePi = Number(p.pricePi);
  const stock = Number(p.stock);
  if (!Number.isFinite(pricePi) || pricePi < 0) throw new Error(`products[${i}].pricePi invalid`);
  if (!Number.isInteger(stock) || stock < 0) throw new Error(`products[${i}].stock invalid`);
  await sql`
    INSERT INTO products
      (id,seller_id,title,marketplace_category,category,price_pi,stock,availability_status,
       is_active,is_deleted,moderation_status,data,created_at,updated_at)
    VALUES
      (${id},${sellerId},${title},${p.marketplaceCategory ?? null},${p.category ?? null},
       ${pricePi},${stock},${p.availabilityStatus ?? null},${p.isActive === true},
       ${p.isDeleted === true},${p.moderationStatus ?? 'PENDING_REVIEW'},${json(p)}::jsonb,
       ${p.createdAt ?? new Date().toISOString()},${p.updatedAt ?? new Date().toISOString()})
    ON CONFLICT (id) DO UPDATE SET
      seller_id=EXCLUDED.seller_id,title=EXCLUDED.title,marketplace_category=EXCLUDED.marketplace_category,
      category=EXCLUDED.category,price_pi=EXCLUDED.price_pi,stock=EXCLUDED.stock,
      availability_status=EXCLUDED.availability_status,is_active=EXCLUDED.is_active,
      is_deleted=EXCLUDED.is_deleted,moderation_status=EXCLUDED.moderation_status,
      data=EXCLUDED.data,updated_at=EXCLUDED.updated_at
  `;
  counts.products += 1;
}

for (let i = 0; i < orders.length; i += 1) {
  const o = orders[i];
  const id = requiredString(o.id, 'id', i, 'orders');
  const buyerUsername = requiredString(o.buyerUsername, 'buyerUsername', i, 'orders');
  const totalPi = Number(o.totalPi);
  if (!Number.isFinite(totalPi) || totalPi < 0) throw new Error(`orders[${i}].totalPi invalid`);
  if (!Array.isArray(o.items) || o.items.length === 0) throw new Error(`orders[${i}].items required`);
  await sql`
    INSERT INTO orders
      (id,buyer_username,total_pi,escrow_status,pstp_status,pi_payment_id,pi_txid,server_verified,
       tracking_number,carrier,is_deleted,data,created_at,updated_at)
    VALUES
      (${id},${buyerUsername},${totalPi},${o.escrowStatus ?? 'pending'},${o.pstpStatus ?? 'Pending'},
       ${o.piPaymentId ?? null},${o.piTxid ?? null},${o.serverVerified === true},
       ${o.trackingNumber ?? null},${o.carrier ?? null},${o.isDeleted === true},${json(o)}::jsonb,
       ${o.createdAt ?? new Date().toISOString()},${o.updatedAt ?? new Date().toISOString()})
    ON CONFLICT (id) DO UPDATE SET
      buyer_username=EXCLUDED.buyer_username,total_pi=EXCLUDED.total_pi,
      escrow_status=EXCLUDED.escrow_status,pstp_status=EXCLUDED.pstp_status,
      pi_payment_id=EXCLUDED.pi_payment_id,pi_txid=EXCLUDED.pi_txid,
      server_verified=EXCLUDED.server_verified,tracking_number=EXCLUDED.tracking_number,
      carrier=EXCLUDED.carrier,is_deleted=EXCLUDED.is_deleted,data=EXCLUDED.data,
      updated_at=EXCLUDED.updated_at
  `;
  counts.orders += 1;
}

for (let i = 0; i < vendorApplications.length; i += 1) {
  const a = vendorApplications[i];
  const id = requiredString(a.id, 'id', i, 'vendorApplications');
  const username = requiredString(a.pioneerUsername, 'pioneerUsername', i, 'vendorApplications');
  await sql`
    INSERT INTO vendor_applications
      (id,pioneer_username,pioneer_uid,status,data,created_at,updated_at)
    VALUES
      (${id},${username},${a.pioneerUid ?? null},${a.status ?? null},${json(a)}::jsonb,
       ${a.createdAt ?? new Date().toISOString()},${a.updatedAt ?? new Date().toISOString()})
    ON CONFLICT (id) DO UPDATE SET
      pioneer_username=EXCLUDED.pioneer_username,pioneer_uid=EXCLUDED.pioneer_uid,
      status=EXCLUDED.status,data=EXCLUDED.data,updated_at=EXCLUDED.updated_at
  `;
  counts.vendorApplications += 1;
}

for (let i = 0; i < orderFulfillment.length; i += 1) {
  const f = orderFulfillment[i];
  const orderId = requiredString(f.orderId ?? f.order_id, 'orderId', i, 'orderFulfillment');
  await sql`
    INSERT INTO order_fulfillment
      (order_id,status,carrier,tracking_number,data,updated_at)
    VALUES
      (${orderId},${f.status ?? null},${f.carrier ?? null},${f.trackingNumber ?? f.tracking_number ?? null},
       ${json(f)}::jsonb,${f.updatedAt ?? f.updated_at ?? new Date().toISOString()})
    ON CONFLICT (order_id) DO UPDATE SET
      status=EXCLUDED.status,carrier=EXCLUDED.carrier,tracking_number=EXCLUDED.tracking_number,
      data=EXCLUDED.data,updated_at=EXCLUDED.updated_at
  `;
  counts.orderFulfillment += 1;
}

console.log(JSON.stringify({
  ok: true,
  source: resolved,
  imported: counts,
  destructiveOperations: false
}, null, 2));
