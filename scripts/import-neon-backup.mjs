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
import { createHash } from 'node:crypto';
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
if (parsed.schemaVersion !== 2) {
  throw new Error(`UNSUPPORTED_BACKUP_SCHEMA: expected schemaVersion 2, got ${parsed.schemaVersion ?? 'missing'}`);
}
if (!Array.isArray(parsed.manifest)) throw new Error('BACKUP_MANIFEST_REQUIRED: manifest must be an array');
const manifest = parsed.manifest;
const manifestByKey = new Map();
const manifestKey = (bucket, recordId) => `${bucket}:${recordId}`;
for (const entry of manifest) {
  if (!entry || typeof entry !== 'object' || !entry.bucket || !entry.pathname || !entry.recordId || !entry.sha256 || !entry.sourceSha256 || entry.status !== 'exported') {
    throw new Error(`BACKUP_MANIFEST_INVALID_ENTRY: ${JSON.stringify(entry)}`);
  }
  const key = manifestKey(entry.bucket, String(entry.recordId));
  if (manifestByKey.has(key)) throw new Error(`BACKUP_MANIFEST_DUPLICATE: ${key}`);
  manifestByKey.set(key, entry);
}
const normalizedSha256 = (value) =>
  createHash('sha256').update(JSON.stringify(value), 'utf8').digest('hex');
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

const assertNoExistingConflicts = async (table, records, idField) => {
  if (!records.length) return;
  const ids = records.map((record) => String(record[idField]));
  const payload = JSON.stringify(ids);
  let rows = [];
  if (table === 'products') {
    rows = await sql`SELECT p.id, p.data FROM products p JOIN jsonb_array_elements_text(${payload}::jsonb) x(id) ON x.id=p.id`;
  } else if (table === 'orders') {
    rows = await sql`SELECT o.id, o.data FROM orders o JOIN jsonb_array_elements_text(${payload}::jsonb) x(id) ON x.id=o.id`;
  } else if (table === 'vendor_applications') {
    rows = await sql`SELECT a.id, a.data FROM vendor_applications a JOIN jsonb_array_elements_text(${payload}::jsonb) x(id) ON x.id=a.id`;
  }
  const sourceById = new Map(records.map((record) => [String(record[idField]), record]));
  for (const row of rows) {
    const source = sourceById.get(String(row.id));
    if (!source) continue;
    if (normalizedSha256(source) !== normalizedSha256(row.data)) {
      throw new Error(`NEON_EXISTING_CONFLICT: ${table} id=${row.id} already exists with different data`);
    }
  }
};

const requiredString = (value, field, index, collection) => {
  const v = String(value ?? '').trim();
  if (!v) throw new Error(`${collection}[${index}].${field} is required`);
  return v;
};
const json = (value) => JSON.stringify(value ?? {});
const requireManifestRecord = (bucket, record, index) => {
  const id = requiredString(record.id, 'id', index, bucket);
  const entry = manifestByKey.get(manifestKey(bucket, id));
  if (!entry) throw new Error(`MANIFEST_RECORD_MISSING: ${bucket}[${index}] id=${id}`);
  if (normalizedSha256(record) !== entry.sha256) {
    throw new Error(`MANIFEST_HASH_MISMATCH: ${bucket}[${index}] id=${id}`);
  }
  return entry;
};
const decimalString = (value, field) => {
  if (typeof value === 'string') {
    const v = value.trim();
    if (!/^\d+(?:\.\d+)?$/.test(v)) throw new Error(`${field} must be a non-negative decimal string`);
    return v;
  }
  throw new Error(`${field} must be a non-negative decimal string`);
};

// Validate the entire payload and existing-ID conflicts before the first write.
if (manifest.length !== products.length + orders.length + vendorApplications.length + orderFulfillment.length) {
  throw new Error(`BACKUP_MANIFEST_COUNT_MISMATCH: manifest=${manifest.length}, records=${products.length + orders.length + vendorApplications.length + orderFulfillment.length}`);
}
for (const entry of manifest) {
  if (!['products', 'orders', 'vendorApplications'].includes(entry.bucket)) {
    throw new Error(`BACKUP_MANIFEST_UNEXPECTED_BUCKET: ${entry.bucket}`);
  }
}
await assertNoExistingConflicts('products', products, 'id');
await assertNoExistingConflicts('orders', orders, 'id');
await assertNoExistingConflicts('vendor_applications', vendorApplications, 'id');

for (let i = 0; i < products.length; i += 1) {
  const p = products[i];
  requireManifestRecord('products', p, i);
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
  requireManifestRecord('orders', o, i);
  requiredString(o.id, 'id', i, 'orders');
  requiredString(o.buyerUsername, 'buyerUsername', i, 'orders');
  const totalPi = decimalString(o.totalPi, `orders[${i}].totalPi`);
  void totalPi;
  if (!Array.isArray(o.items) || o.items.length === 0) throw new Error(`orders[${i}].items required`);
}
for (let i = 0; i < vendorApplications.length; i += 1) {
  const a = vendorApplications[i];
  requireManifestRecord('vendorApplications', a, i);
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

let queuedCounts = {
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
       ${requiredString(p.createdAt, 'createdAt', i, 'products')},${requiredString(p.updatedAt, 'updatedAt', i, 'products')})
    ON CONFLICT (id) DO NOTHING
  `);
  queuedCounts.products += 1;
}
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
       ${requiredString(o.createdAt, 'createdAt', i, 'orders')},${requiredString(o.updatedAt, 'updatedAt', i, 'orders')})
    ON CONFLICT (id) DO NOTHING
  `);
  queuedCounts.orders += 1;
}
for (let i = 0; i < vendorApplications.length; i += 1) {
  const a = vendorApplications[i];
  const id = requiredString(a.id, 'id', i, 'vendorApplications');
  const username = requiredString(a.pioneerUsername, 'pioneerUsername', i, 'vendorApplications');
  vendorApplicationQueries.push(sql`
    INSERT INTO vendor_applications
      (id,pioneer_username,pioneer_uid,status,data,created_at,updated_at)
    VALUES
      (${id},${username},${a.pioneerUid ?? null},${a.status ?? null},${json(a)}::jsonb,
       ${requiredString(a.createdAt, 'createdAt', i, 'vendorApplications')},${requiredString(a.updatedAt, 'updatedAt', i, 'vendorApplications')})
    ON CONFLICT (id) DO NOTHING
  `);
  queuedCounts.vendorApplications += 1;
}
for (let i = 0; i < orderFulfillment.length; i += 1) {
  const f = orderFulfillment[i];
  const orderId = requiredString(f.orderId ?? f.order_id, 'orderId', i, 'orderFulfillment');
  fulfillmentQueries.push(sql`
    INSERT INTO order_fulfillment
      (order_id,status,carrier,tracking_number,data,updated_at)
    VALUES
      (${orderId},${f.status ?? null},${f.carrier ?? null},${f.trackingNumber ?? f.tracking_number ?? null},
       ${json(f)}::jsonb,${requiredString(f.updatedAt ?? f.updated_at, 'updatedAt', i, 'orderFulfillment')})
    ON CONFLICT (order_id) DO NOTHING
  `);
  queuedCounts.orderFulfillment += 1;
}
const allMigrationQueries = [
  ...productQueries,
  ...orderQueries,
  ...vendorApplicationQueries,
  ...fulfillmentQueries,
];
if (allMigrationQueries.length) {
  await sql.transaction(allMigrationQueries);
}

const countExistingByIds = async (table, ids) => {
  if (!ids.length) return 0;
  const payload = JSON.stringify(ids);
  if (table === 'products') {
    return Number((await sql`SELECT COUNT(*)::int AS count FROM products p JOIN jsonb_array_elements_text(${payload}::jsonb) x(id) ON x.id=p.id`)[0].count);
  }
  if (table === 'orders') {
    return Number((await sql`SELECT COUNT(*)::int AS count FROM orders o JOIN jsonb_array_elements_text(${payload}::jsonb) x(id) ON x.id=o.id`)[0].count);
  }
  if (table === 'vendor_applications') {
    return Number((await sql`SELECT COUNT(*)::int AS count FROM vendor_applications a JOIN jsonb_array_elements_text(${payload}::jsonb) x(id) ON x.id=a.id`)[0].count);
  }
  return 0;
};

const sourceIds = {
  products: products.map((p) => String(p.id)),
  orders: orders.map((o) => String(o.id)),
  vendorApplications: vendorApplications.map((a) => String(a.id)),
};
const existingSourceIds = {
  products: await countExistingByIds('products', sourceIds.products),
  orders: await countExistingByIds('orders', sourceIds.orders),
  vendorApplications: await countExistingByIds('vendor_applications', sourceIds.vendorApplications),
};

const actualCounts = {
  products: Number((await sql`SELECT COUNT(*)::int AS count FROM products`)[0].count),
  orders: Number((await sql`SELECT COUNT(*)::int AS count FROM orders`)[0].count),
  vendorApplications: Number((await sql`SELECT COUNT(*)::int AS count FROM vendor_applications`)[0].count),
  orderFulfillment: Number((await sql`SELECT COUNT(*)::int AS count FROM order_fulfillment`)[0].count)
};

console.log(JSON.stringify({
  ok: true,
  source: resolved,
  queuedForInsert: queuedCounts,
  sourceIdsPresentInNeon: existingSourceIds,
  actualNeonCounts: actualCounts,
  destructiveOperations: false
}, null, 2));
