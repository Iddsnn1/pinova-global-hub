import type { Product, ProductCategory, AvailabilityStatus } from '../../types';
import { getNeonSql, neonDatabaseEnabled } from '../db/NeonDatabase';
import { piDecimalForStorage } from './piDecimal';

function normalize(product: Product, existing?: Product): Product {
  const now = new Date().toISOString();
  const p: Product = {...product,title:String(product.title||'').trim(),description:String(product.description||'').trim(),sellerId:String(product.sellerId||'').trim(),sellerName:String(product.sellerName||'').trim(),sellerDisplayName:String(product.sellerDisplayName||'').trim()||undefined,images:Array.isArray(product.images)?product.images.filter(Boolean):[],features:Array.isArray(product.features)?product.features.filter(Boolean):[],tags:Array.isArray(product.tags)?product.tags.filter(Boolean):[],isActive:product.isActive??false,isDeleted:product.isDeleted??false,moderationStatus:product.moderationStatus??'PENDING_REVIEW',createdAt:existing?.createdAt??product.createdAt??now,updatedAt:now};
  if(!p.id||!p.sellerId||!p.title)throw new Error('PRODUCT_ID_SELLER_ID_AND_TITLE_REQUIRED');
  if(!Number.isFinite(p.pricePi)||p.pricePi<0)throw new Error('INVALID_PRODUCT_PRICE');
  if(!Number.isInteger(p.stock)||p.stock<0)throw new Error('INVALID_PRODUCT_STOCK');
  return p;
}
function rowToProduct(row:any):Product{return(row?.data||{})as Product;}
export function durableProductStorageEnabled(){return neonDatabaseEnabled();}
export async function getDurableProduct(id:string):Promise<Product|null>{if(!id?.trim()||!neonDatabaseEnabled())return null;const sql=getNeonSql();const rows=(await sql`SELECT data FROM products WHERE id=${id.trim()} AND is_deleted=FALSE LIMIT 1`) as unknown as Array<Record<string, any>>;return rows.length?rowToProduct(rows[0]):null;}
export async function listDurableProducts(options?:{includeDeleted?:boolean;activeOnly?:boolean;sellerId?:string;category?:ProductCategory;q?:string;}):Promise<Product[]>{if(!neonDatabaseEnabled())return[];const sql=getNeonSql();const rows=(options?.includeDeleted?await sql`SELECT data FROM products ORDER BY created_at DESC`:await sql`SELECT data FROM products WHERE is_deleted=FALSE ORDER BY created_at DESC`) as unknown as Array<Record<string, any>>;const q=String(options?.q||'').trim().toLowerCase();return rows.map(rowToProduct).filter(p=>{if(options?.activeOnly&&p.isActive!==true)return false;if(options?.sellerId&&p.sellerId!==options.sellerId)return false;if(options?.category){const c=String(options.category).trim().toLowerCase();if(String(p.marketplaceCategory||'').trim().toLowerCase()!==c&&String(p.category||'').trim().toLowerCase()!==c)return false;}if(q&&! [p.title,p.description,p.subcategory,p.sellerName,...(p.features||[]),...(p.tags||[])].join(' ').toLowerCase().includes(q))return false;return true;});}
export async function saveDurableProduct(product:Product):Promise<Product>{if(!neonDatabaseEnabled())throw new Error('DURABLE_PRODUCT_STORAGE_UNAVAILABLE');const existing=await getDurableProduct(product.id);const p=normalize(product,existing||undefined);const sql=getNeonSql();const pricePiDb=piDecimalForStorage(p.pricePi);const data=JSON.stringify(p);await sql`INSERT INTO products(id,seller_id,title,marketplace_category,category,price_pi,stock,availability_status,is_active,is_deleted,moderation_status,data,created_at,updated_at) VALUES(${p.id},${p.sellerId},${p.title},${p.marketplaceCategory||null},${p.category||null},${pricePiDb},${p.stock},${p.availabilityStatus||null},${p.isActive},${p.isDeleted},${p.moderationStatus},${data}::jsonb,${p.createdAt},${p.updatedAt}) ON CONFLICT(id) DO UPDATE SET seller_id=EXCLUDED.seller_id,title=EXCLUDED.title,marketplace_category=EXCLUDED.marketplace_category,category=EXCLUDED.category,price_pi=EXCLUDED.price_pi,stock=EXCLUDED.stock,availability_status=EXCLUDED.availability_status,is_active=EXCLUDED.is_active,is_deleted=EXCLUDED.is_deleted,moderation_status=EXCLUDED.moderation_status,data=EXCLUDED.data,updated_at=EXCLUDED.updated_at`;return p;}
export async function updateDurableProductAvailability(id:string,status:AvailabilityStatus,stock:number):Promise<Product|null>{if(!Number.isInteger(stock)||stock<0)throw new Error('INVALID_PRODUCT_STOCK');const p=await getDurableProduct(id);if(!p||p.isDeleted)return null;return saveDurableProduct({...p,stock,availabilityStatus:status,isActive:status!=='out_of_stock'&&p.isActive!==false});}
export async function softDeleteDurableProduct(id:string):Promise<boolean>{const p=await getDurableProduct(id);if(!p)return false;await saveDurableProduct({...p,isDeleted:true,isActive:false});return true;}
export async function reserveDurableProductStockBatch(requests:Array<{id:string;quantity:number}>):Promise<Product[]|undefined>{
  if(!neonDatabaseEnabled())throw new Error('DURABLE_PRODUCT_STORAGE_UNAVAILABLE');
  const merged=new Map<string,number>();
  for(const r of requests){if(!r.id||!Number.isInteger(r.quantity)||r.quantity<1)throw new Error('INVALID_STOCK_RESERVATION_QUANTITY');merged.set(r.id,(merged.get(r.id)||0)+r.quantity);}
  if(merged.size===0)return [];
  const payload=JSON.stringify(Array.from(merged,([id,quantity])=>({id,quantity})));
  const sql=getNeonSql();
  const rows=(await sql`WITH requested AS (
    SELECT id, quantity::integer AS quantity FROM jsonb_to_recordset(${payload}::jsonb) AS x(id text, quantity integer)
  ), eligible AS (
    SELECT p.id,p.stock,COALESCE(p.data->>'fulfillmentType','') AS fulfillment_type,r.quantity FROM products p JOIN requested r ON r.id=p.id WHERE p.is_deleted=FALSE AND p.is_active=TRUE
  ), physical AS (SELECT * FROM eligible WHERE fulfillment_type NOT IN ('digital_download','instant_key')),
  reservation_guard AS (SELECT (SELECT COUNT(*) FROM eligible)=(SELECT COUNT(*) FROM requested) AS all_found, NOT EXISTS (SELECT 1 FROM physical WHERE stock < quantity) AS stock_ok)
  UPDATE products p SET stock=p.stock-r.quantity,availability_status=CASE WHEN p.stock-r.quantity<=0 THEN 'out_of_stock' ELSE p.availability_status END,is_active=CASE WHEN p.stock-r.quantity>0 THEN p.is_active ELSE FALSE END,updated_at=NOW(),data=jsonb_set(jsonb_set(p.data,'{stock}',to_jsonb(p.stock-r.quantity),true),'{availabilityStatus}',to_jsonb(CASE WHEN p.stock-r.quantity<=0 THEN 'out_of_stock' ELSE p.availability_status END),true)
  FROM requested r,reservation_guard g WHERE p.id=r.id AND COALESCE(p.data->>'fulfillmentType','') NOT IN ('digital_download','instant_key') AND g.all_found AND g.stock_ok RETURNING p.data`) as unknown as Array<Record<string, any>>;
  const all=(await sql`SELECT data FROM products WHERE id IN (SELECT id FROM jsonb_to_recordset(${payload}::jsonb) AS x(id text, quantity integer)) AND is_deleted=FALSE`) as unknown as Array<Record<string, any>>;
  if(all.length!==merged.size)throw new Error('STOCK_RESERVATION_FAILED');
  const physicalCount=all.filter(r=>!['digital_download','instant_key'].includes(String((r.data as Product)?.fulfillmentType||''))).length;
  if(rows.length!==physicalCount)throw new Error('STOCK_RESERVATION_FAILED');
  return all.map(rowToProduct);
}
export async function deleteDurableProductBlob(id:string){return softDeleteDurableProduct(id);}
