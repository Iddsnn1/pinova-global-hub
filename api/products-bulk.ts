import crypto from 'crypto';
import { authenticateVendorRequest as authenticateRequest, getDurableVendorApplication, durableVendorStorageEnabled, ProductRepository, pstpAuditRepo } from '../dist/server.cjs';

function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cell = '', quoted = false;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i], next = input[i + 1];
    if (ch === '"') {
      if (quoted && next === '"') { cell += '"'; i++; }
      else quoted = !quoted;
    } else if (ch === ',' && !quoted) { row.push(cell); cell = ''; }
    else if ((ch === '\n' || ch === '\r') && !quoted) {
      if (ch === '\r' && next === '\n') i++;
      row.push(cell); cell = '';
      if (row.some(v => v.trim() !== '')) rows.push(row);
      row = [];
    } else cell += ch;
  }
  if (cell.length || row.length) { row.push(cell); if (row.some(v => v.trim() !== '')) rows.push(row); }
  return rows;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
  if (!durableVendorStorageEnabled()) return res.status(503).json({ ok: false, error: 'DURABLE_VENDOR_STORAGE_UNAVAILABLE' });
  const user = await authenticateRequest(req);
  if (!user?.username) return res.status(401).json({ ok: false, error: 'INVALID_SESSION' });
  const merchant = await getDurableVendorApplication(user.username);
  const canSell = merchant?.status === 'APPROVED' && merchant.verificationStatus === 'Verified' && merchant.sellerStatus === 'Active';
  if (!canSell) return res.status(403).json({ ok: false, error: 'MERCHANT_SELLER_ACCESS_REQUIRED' });

  const body = req.body || {};
  const csv = typeof body.csv === 'string' ? body.csv : '';
  if (!csv || Buffer.byteLength(csv, 'utf8') > 10 * 1024 * 1024) return res.status(400).json({ ok: false, error: 'INVALID_CSV' });

  const rows = parseCsv(csv);
  if (rows.length < 2) return res.status(400).json({ ok: false, error: 'CSV_DATA_ROWS_REQUIRED' });
  const headers = rows[0].map(h => h.trim().toLowerCase());
  const titleIndex = headers.indexOf('title');
  const descriptionIndex = headers.indexOf('description');
  const priceIndex = headers.indexOf('pricepi');
  const categoryIndex = headers.indexOf('category');
  const stockIndex = headers.indexOf('stock');
  const tagsIndex = headers.indexOf('tags');
  if (titleIndex < 0 || priceIndex < 0) return res.status(400).json({ ok: false, error: 'REQUIRED_COLUMNS_MISSING', required: ['title', 'pricePi'] });

  const repo = new ProductRepository();
  const imported: any[] = [], errors: string[] = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const title = String(r[titleIndex] || '').trim();
    const description = String(r[descriptionIndex] || '').trim();
    const pricePi = Number(r[priceIndex]);
    const stock = stockIndex >= 0 ? Number(r[stockIndex]) : 0;
    const category = String(r[categoryIndex] || 'physical').trim() || 'physical';
    const tags = tagsIndex >= 0 ? String(r[tagsIndex] || '').split(';').map(v => v.trim()).filter(Boolean) : [];
    if (!title || !description || !Number.isFinite(pricePi) || pricePi < 0 || !Number.isInteger(stock) || stock < 0) {
      errors.push(`Row ${i + 1}: invalid title, description, pricePi, or stock.`);
      continue;
    }
    const product = {
      id: `prd_${Date.now()}_${crypto.randomBytes(5).toString('hex')}`,
      title, description, pricePi, category, subcategory: 'General', images: [], stock,
      rating: 0, reviewsCount: 0, sellerId: user.username, sellerName: merchant.storeName || user.username,
      sellerVerified: true, features: ['Bulk Imported'], tags,
      availabilityStatus: stock > 0 ? 'in_stock' : 'out_of_stock',
      isActive: false, moderationStatus: 'PENDING_REVIEW'
    };
    imported.push(repo.save(product as any));
  }
  try {
    await pstpAuditRepo.append({
      actor: user.username,
      action: 'MERCHANT_BULK_PRODUCT_IMPORT',
      resourceType: 'merchant_catalog',
      resourceId: user.username,
      details: { importedCount: imported.length, errorCount: errors.length }
    });
  } catch {}
  return res.status(201).json({ ok: true, importedCount: imported.length, errorCount: errors.length, errors, products: imported });
}
