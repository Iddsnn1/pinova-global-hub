import { randomUUID } from 'crypto';
import type { Order } from '../../types';
import { getNeonSql, neonDatabaseEnabled } from '../db/NeonDatabase';
import { piDecimalForStorage } from './piDecimal';
export function durableOrderStorageEnabled(){return neonDatabaseEnabled();}
function rowToOrder(row:any):Order{const data:any={...(row?.data||{})};if(typeof data.totalPi==='string')data.totalPi=Number(data.totalPi);if(Array.isArray(data.items))data.items=data.items.map((item:any)=>({...item,product:item?.product&&typeof item.product.pricePi==='string'?{...item.product,pricePi:Number(item.product.pricePi),variants:Array.isArray(item.product.variants)?item.product.variants.map((v:any)=>typeof v?.priceDeltaPi==='string'?{...v,priceDeltaPi:Number(v.priceDeltaPi)}:v):item.product.variants}:item?.product}));return data as Order;}
function storageSnapshot(order:Order){const data:any=JSON.parse(JSON.stringify(order));data.totalPi=piDecimalForStorage(order.totalPi);if(Array.isArray(data.items))data.items=data.items.map((item:any)=>({...item,product:item?.product&&typeof item.product.pricePi==='number'?{...item.product,pricePi:piDecimalForStorage(item.product.pricePi),variants:Array.isArray(item.product.variants)?item.product.variants.map((v:any)=>typeof v?.priceDeltaPi==='number'?{...v,priceDeltaPi:piDecimalForStorage(v.priceDeltaPi)}:v):item.product.variants}:item?.product}));return data;}
export async function getDurableOrder(id:string):Promise<Order|null>{if(!id?.trim()||!neonDatabaseEnabled())return null;const sql=getNeonSql();const rows=(await sql`SELECT data FROM orders WHERE id=${id.trim()} AND is_deleted=FALSE LIMIT 1`) as unknown as Array<Record<string, any>>;return rows.length?rowToOrder(rows[0]):null;}
export async function listDurableOrders(buyerUsername?:string):Promise<Order[]>{if(!neonDatabaseEnabled())return[];const sql=getNeonSql();const rows=(buyerUsername?await sql`SELECT data FROM orders WHERE is_deleted=FALSE AND buyer_username=${buyerUsername} ORDER BY created_at DESC`:await sql`SELECT data FROM orders WHERE is_deleted=FALSE ORDER BY created_at DESC`) as unknown as Array<Record<string, any>>;return rows.map(rowToOrder);}
export async function softDeleteDurableOrder(id:string):Promise<Order|null>{const p=await getDurableOrder(id);if(!p)return null;return saveDurableOrder({...p,isDeleted:true});}
export async function saveDurableOrder(order:Order):Promise<Order>{if(!neonDatabaseEnabled())throw new Error('DURABLE_ORDER_STORAGE_UNAVAILABLE');const existing=await getDurableOrder(order.id);const expectedUpdatedAt=existing?.updatedAt??null;const now=new Date().toISOString();const p:Order={...order,buyerUsername:String(order.buyerUsername||'').trim(),totalPi:Number(order.totalPi),items:Array.isArray(order.items)?order.items:[],timeline:Array.isArray(order.timeline)?order.timeline:[],isDeleted:order.isDeleted??false,createdAt:existing?.createdAt??order.createdAt??now,updatedAt:now};if(!p.id||!p.buyerUsername)throw new Error('ORDER_ID_AND_BUYER_REQUIRED');if(!Number.isFinite(p.totalPi)||p.totalPi<0)throw new Error('INVALID_ORDER_TOTAL');if(!p.items.length)throw new Error('ORDER_ITEMS_REQUIRED');const sql=getNeonSql();const totalPiDb=piDecimalForStorage(p.totalPi);const data=JSON.stringify(storageSnapshot(p));let rows:Array<Record<string, any>>;try{rows=(await sql`INSERT INTO orders(id,buyer_username,total_pi,escrow_status,pstp_status,pi_payment_id,pi_txid,server_verified,tracking_number,carrier,is_deleted,data,created_at,updated_at) VALUES(${p.id},${p.buyerUsername},${totalPiDb},${p.escrowStatus},${p.pstpStatus},${p.piPaymentId||null},${p.piTxid||null},${p.serverVerified===true},${p.trackingNumber||null},${p.carrier||null},${p.isDeleted},${data}::jsonb,${p.createdAt},${p.updatedAt}) ON CONFLICT(id) DO UPDATE SET buyer_username=EXCLUDED.buyer_username,total_pi=EXCLUDED.total_pi,escrow_status=EXCLUDED.escrow_status,pstp_status=EXCLUDED.pstp_status,pi_payment_id=EXCLUDED.pi_payment_id,pi_txid=EXCLUDED.pi_txid,server_verified=EXCLUDED.server_verified,tracking_number=EXCLUDED.tracking_number,carrier=EXCLUDED.carrier,is_deleted=EXCLUDED.is_deleted,data=EXCLUDED.data,updated_at=EXCLUDED.updated_at WHERE orders.updated_at=${expectedUpdatedAt} RETURNING id`) as unknown as Array<Record<string, any>>;}catch(error){const code=String((error as any)?.code||'');const constraint=String((error as any)?.constraint||'');if(code==='23505'&&constraint==='orders_pi_txid_unique_idx')throw new Error('PI_TXID_REPLAY_CONFLICT');if(code==='23505'&&constraint==='orders_pi_payment_id_unique_idx')throw new Error('PI_PAYMENT_ID_REPLAY_CONFLICT');throw error;}if(!rows.length)throw new Error('ORDER_WRITE_CONFLICT');return p;}
let orderIdempotencyTableReady = false;
async function ensureOrderIdempotencyTable(): Promise<void> {
  if (orderIdempotencyTableReady) return;
  const sql = getNeonSql();
  await sql`CREATE TABLE IF NOT EXISTS order_idempotency (
    idempotency_key text PRIMARY KEY,
    operation_fingerprint text NOT NULL,
    request_hash text NOT NULL,
    reservation_token text NOT NULL,
    status text NOT NULL,
    result jsonb,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    expires_at timestamptz NOT NULL,
    CONSTRAINT order_idempotency_status_check CHECK (status IN ('PENDING','RESOLVED'))
  )`;
  orderIdempotencyTableReady = true;
}

export type DurableOrderIdempotencyResult = {
  status: 'CREATED' | 'RESOLVED' | 'CONFLICT';
  order?: Order;
  cachedResult?: any;
};

export async function createDurableOrderWithIdempotency(
  order: Order,
  reservations: Array<{id: string; quantity: number}>,
  idempotencyKey: string,
  operationFingerprint: string,
  requestHash: string
): Promise<DurableOrderIdempotencyResult> {
  if (!neonDatabaseEnabled()) throw new Error('DURABLE_ORDER_STORAGE_UNAVAILABLE');
  const cleanKey = String(idempotencyKey || '').trim();
  const cleanFingerprint = String(operationFingerprint || '').trim();
  const cleanHash = String(requestHash || '').trim();
  if (!cleanKey || !cleanFingerprint || !cleanHash) throw new Error('INVALID_ORDER_IDEMPOTENCY');
  await ensureOrderIdempotencyTable();

  const merged = new Map<string, number>();
  for (const reservation of reservations) {
    const id = String(reservation.id || '').trim();
    const quantity = Number(reservation.quantity);
    if (!id || !Number.isInteger(quantity) || quantity < 1) throw new Error('INVALID_STOCK_RESERVATION_QUANTITY');
    merged.set(id, (merged.get(id) || 0) + quantity);
  }

  const now = new Date().toISOString();
  const p: Order = {
    ...order,
    buyerUsername: String(order.buyerUsername || '').trim(),
    totalPi: Number(order.totalPi),
    items: Array.isArray(order.items) ? order.items : [],
    timeline: Array.isArray(order.timeline) ? order.timeline : [],
    isDeleted: order.isDeleted ?? false,
    createdAt: order.createdAt ?? now,
    updatedAt: now
  };
  if (!p.id || !p.buyerUsername) throw new Error('ORDER_ID_AND_BUYER_REQUIRED');
  if (!Number.isFinite(p.totalPi) || p.totalPi < 0) throw new Error('INVALID_ORDER_TOTAL');
  if (!p.items.length) throw new Error('ORDER_ITEMS_REQUIRED');

  const reservationPayload = JSON.stringify(Array.from(merged, ([id, quantity]) => ({ id, quantity })));
  const data = JSON.stringify(storageSnapshot(p));
  const totalPiDb = piDecimalForStorage(p.totalPi);
  const reservationToken = randomUUID();
  const sql = getNeonSql();

  const results = await sql.transaction([
    sql`DELETE FROM order_idempotency WHERE idempotency_key = ${cleanKey} AND expires_at <= NOW()`,
    sql`INSERT INTO order_idempotency
      (idempotency_key, operation_fingerprint, request_hash, reservation_token, status, created_at, expires_at)
      VALUES (${cleanKey}, ${cleanFingerprint}, ${cleanHash}, ${reservationToken}, 'PENDING', NOW(), NOW() + INTERVAL '24 hours')
      ON CONFLICT (idempotency_key) DO NOTHING`,
    sql`WITH guard AS (
      SELECT idempotency_key
      FROM order_idempotency
      WHERE idempotency_key = ${cleanKey}
        AND operation_fingerprint = ${cleanFingerprint}
        AND request_hash = ${cleanHash}
        AND reservation_token = ${reservationToken}
        AND status = 'PENDING'
    ),
    requested AS (
      SELECT id, quantity::integer AS quantity
      FROM jsonb_to_recordset(${reservationPayload}::jsonb) AS x(id text, quantity integer)
    ),
    eligible AS (
      SELECT p.id, p.stock, COALESCE(p.data->>'fulfillmentType','') AS fulfillment_type, r.quantity
      FROM products p JOIN requested r ON r.id = p.id
      WHERE p.is_deleted = FALSE AND p.is_active = TRUE
    ),
    physical AS (
      SELECT * FROM eligible WHERE fulfillment_type NOT IN ('digital_download','instant_key')
    ),
    reservation_guard AS (
      SELECT
        (SELECT COUNT(*) FROM eligible) = (SELECT COUNT(*) FROM requested) AS all_found,
        NOT EXISTS (SELECT 1 FROM physical WHERE stock < quantity) AS stock_ok,
        (SELECT COUNT(*) FROM guard) = 1 AS idempotency_owned
    ),
    reserved AS (
      UPDATE products p
      SET stock = p.stock - r.quantity,
          availability_status = CASE WHEN p.stock - r.quantity <= 0 THEN 'out_of_stock' ELSE p.availability_status END,
          is_active = CASE WHEN p.stock - r.quantity > 0 THEN p.is_active ELSE FALSE END,
          updated_at = NOW(),
          data = jsonb_set(
            jsonb_set(p.data, '{stock}', to_jsonb(p.stock - r.quantity), true),
            '{availabilityStatus}',
            to_jsonb(CASE WHEN p.stock - r.quantity <= 0 THEN 'out_of_stock' ELSE p.availability_status END),
            true
          )
      FROM requested r, reservation_guard g
      WHERE p.id = r.id
        AND COALESCE(p.data->>'fulfillmentType','') NOT IN ('digital_download','instant_key')
        AND g.all_found AND g.stock_ok AND g.idempotency_owned
      RETURNING p.id
    ),
    inserted AS (
      INSERT INTO orders
        (id,buyer_username,total_pi,escrow_status,pstp_status,pi_payment_id,pi_txid,server_verified,tracking_number,carrier,is_deleted,data,created_at,updated_at)
      SELECT
        ${p.id},${p.buyerUsername},${totalPiDb},${p.escrowStatus},${p.pstpStatus},
        ${p.piPaymentId || null},${p.piTxid || null},${p.serverVerified === true},
        ${p.trackingNumber || null},${p.carrier || null},${p.isDeleted},${data}::jsonb,
        ${p.createdAt},${p.updatedAt}
      WHERE (SELECT COUNT(*) FROM guard) = 1
        AND (SELECT COUNT(*) FROM reserved) = (SELECT COUNT(*) FROM physical)
        AND (SELECT COUNT(*) FROM eligible) = (SELECT COUNT(*) FROM requested)
      RETURNING id
    ),
    finalized AS (
      UPDATE order_idempotency oi
      SET status = 'RESOLVED',
          result = jsonb_build_object('ok', true, 'order', ${data}::jsonb)
      WHERE oi.idempotency_key = ${cleanKey}
        AND oi.reservation_token = ${reservationToken}
        AND (SELECT COUNT(*) FROM inserted) = 1
      RETURNING oi.result
    )
    SELECT
      (SELECT COUNT(*) FROM guard)::integer AS owned_count,
      (SELECT COUNT(*) FROM reserved)::integer AS reserved_count,
      (SELECT COUNT(*) FROM physical)::integer AS physical_count,
      (SELECT COUNT(*) FROM eligible)::integer AS eligible_count,
      (SELECT COUNT(*) FROM requested)::integer AS requested_count,
      (SELECT COUNT(*) FROM inserted)::integer AS inserted_count,
      (SELECT result FROM finalized LIMIT 1) AS finalized_result,
      (SELECT jsonb_build_object('operationFingerprint', operation_fingerprint, 'requestHash', request_hash, 'status', status, 'result', result)
       FROM order_idempotency WHERE idempotency_key = ${cleanKey} LIMIT 1) AS existing_record`
  ], { isolationLevel: 'Serializable' });

  const row = (results?.[2]?.[0] || {}) as Record<string, any>;
  const existing = row.existing_record || null;
  if ((existing && existing.operationFingerprint !== cleanFingerprint) || (existing && existing.requestHash !== cleanHash)) {
    return { status: 'CONFLICT' };
  }
  if (existing?.status === 'RESOLVED' && existing?.result) {
    return { status: 'RESOLVED', cachedResult: existing.result };
  }
  if (Number(row.inserted_count || 0) !== 1) throw new Error('STOCK_RESERVATION_FAILED');
  return { status: 'CREATED', order: p };
}

export async function createDurableOrderWithStockReservation(order:Order,reservations:Array<{id:string;quantity:number}>):Promise<Order>{
  if(!neonDatabaseEnabled())throw new Error('DURABLE_ORDER_STORAGE_UNAVAILABLE');
  const merged=new Map<string,number>();
  for(const reservation of reservations){const id=String(reservation.id||'').trim();const quantity=Number(reservation.quantity);if(!id||!Number.isInteger(quantity)||quantity<1)throw new Error('INVALID_STOCK_RESERVATION_QUANTITY');merged.set(id,(merged.get(id)||0)+quantity);}
  const now=new Date().toISOString();const p:Order={...order,buyerUsername:String(order.buyerUsername||'').trim(),totalPi:Number(order.totalPi),items:Array.isArray(order.items)?order.items:[],timeline:Array.isArray(order.timeline)?order.timeline:[],isDeleted:order.isDeleted??false,createdAt:order.createdAt??now,updatedAt:now};
  if(!p.id||!p.buyerUsername)throw new Error('ORDER_ID_AND_BUYER_REQUIRED');if(!Number.isFinite(p.totalPi)||p.totalPi<0)throw new Error('INVALID_ORDER_TOTAL');if(!p.items.length)throw new Error('ORDER_ITEMS_REQUIRED');
  const sql=getNeonSql();const reservationPayload=JSON.stringify(Array.from(merged,([id,quantity])=>({id,quantity})));const data=JSON.stringify(storageSnapshot(p));const totalPiDb=piDecimalForStorage(p.totalPi);
  const [rows]=await sql.transaction([sql`WITH requested AS(SELECT id,quantity::integer AS quantity FROM jsonb_to_recordset(${reservationPayload}::jsonb) AS x(id text,quantity integer)),eligible AS(SELECT p.id,p.stock,COALESCE(p.data->>'fulfillmentType','') AS fulfillment_type,r.quantity FROM products p JOIN requested r ON r.id=p.id WHERE p.is_deleted=FALSE AND p.is_active=TRUE),physical AS(SELECT * FROM eligible WHERE fulfillment_type NOT IN('digital_download','instant_key')),reservation_guard AS(SELECT(SELECT COUNT(*) FROM eligible)=(SELECT COUNT(*) FROM requested) AS all_found,NOT EXISTS(SELECT 1 FROM physical WHERE stock<quantity) AS stock_ok),reserved AS(UPDATE products p SET stock=p.stock-r.quantity,availability_status=CASE WHEN p.stock-r.quantity<=0 THEN 'out_of_stock' ELSE p.availability_status END,is_active=CASE WHEN p.stock-r.quantity>0 THEN p.is_active ELSE FALSE END,updated_at=NOW(),data=jsonb_set(jsonb_set(p.data,'{stock}',to_jsonb(p.stock-r.quantity),true),'{availabilityStatus}',to_jsonb(CASE WHEN p.stock-r.quantity<=0 THEN 'out_of_stock' ELSE p.availability_status END),true) FROM requested r,reservation_guard g WHERE p.id=r.id AND COALESCE(p.data->>'fulfillmentType','') NOT IN('digital_download','instant_key') AND g.all_found AND g.stock_ok RETURNING p.id),inserted AS(INSERT INTO orders(id,buyer_username,total_pi,escrow_status,pstp_status,pi_payment_id,pi_txid,server_verified,tracking_number,carrier,is_deleted,data,created_at,updated_at) SELECT ${p.id},${p.buyerUsername},${totalPiDb},${p.escrowStatus},${p.pstpStatus},${p.piPaymentId||null},${p.piTxid||null},${p.serverVerified===true},${p.trackingNumber||null},${p.carrier||null},${p.isDeleted},${data}::jsonb,${p.createdAt},${p.updatedAt} WHERE(SELECT COUNT(*) FROM reserved)=(SELECT COUNT(*) FROM physical) AND(SELECT COUNT(*) FROM eligible)=(SELECT COUNT(*) FROM requested) RETURNING id) SELECT(SELECT COUNT(*) FROM reserved)::integer AS reserved_count,(SELECT COUNT(*) FROM physical)::integer AS physical_count,(SELECT COUNT(*) FROM eligible)::integer AS eligible_count,(SELECT COUNT(*) FROM requested)::integer AS requested_count,(SELECT COUNT(*) FROM inserted)::integer AS inserted_count`],{isolationLevel:'Serializable'});
  const result=rows?.[0] as Record<string,any>|undefined;const reservedCount=Number(result?.reserved_count||0),physicalCount=Number(result?.physical_count||0),eligibleCount=Number(result?.eligible_count||0),requestedCount=Number(result?.requested_count||0),insertedCount=Number(result?.inserted_count||0);
  if(eligibleCount!==requestedCount||reservedCount!==physicalCount||insertedCount!==1)throw new Error('STOCK_RESERVATION_FAILED');
  return p;
}

export async function markDurableOrderPaymentVerified(id:string,piPaymentId:string,piTxid?:string):Promise<Order|null>{const p=await getDurableOrder(id);if(!p||p.isDeleted)return null;if(!piPaymentId.trim())throw new Error('PI_PAYMENT_ID_REQUIRED');const timestamp=new Date().toISOString();return saveDurableOrder({...p,piPaymentId:piPaymentId.trim(),piTxid:piTxid?.trim()||p.piTxid,serverVerified:true,pstpStatus:'Payment Verified',escrowStatus:'approved',updatedAt:timestamp,timeline:[...p.timeline,{status:'Payment Verified',timestamp,actor:'system',actorRole:'system',note:'Pi payment server-verified; order may proceed to PSTP protection.'}]});}
