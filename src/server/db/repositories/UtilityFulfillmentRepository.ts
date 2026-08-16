import { StorageEngine } from '../StorageEngine';
import { UtilityFulfillmentEntity } from '../types';

export class UtilityFulfillmentRepository {
  private engine: StorageEngine<UtilityFulfillmentEntity>;

  constructor() {
    this.engine = new StorageEngine<UtilityFulfillmentEntity>('utility_fulfillments', 'key');
  }

  public recordTransaction(key: string, tx: Omit<UtilityFulfillmentEntity, 'id' | 'key'> & { id?: string }): UtilityFulfillmentEntity {
    const record: UtilityFulfillmentEntity = {
      id: tx.id || `UTIL-REC-${Date.now()}`,
      key,
      transactionId: tx.transactionId,
      paymentId: tx.paymentId,
      txid: tx.txid,
      status: tx.status,
      message: tx.message,
      category: tx.category,
      providerId: tx.providerId,
      accountNumber: tx.accountNumber,
      fiatAmount: tx.fiatAmount,
      piAmount: tx.piAmount,
      packageName: tx.packageName,
      timestamp: tx.timestamp || new Date().toISOString(),
      providerReference: tx.providerReference,
      metadata: tx.metadata
    };

    this.engine.set(key, record);
    return record;
  }

  public findByKey(key: string): UtilityFulfillmentEntity | null {
    return this.engine.get(key);
  }

  public findByPaymentId(paymentId: string): UtilityFulfillmentEntity | null {
    return this.engine.find((u) => u.paymentId === paymentId);
  }

  public getAll(): UtilityFulfillmentEntity[] {
    return this.engine.getAll();
  }

  public count(): number {
    return this.engine.count();
  }
}
