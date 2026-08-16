import { StorageEngine } from '../StorageEngine';
import { IdempotencyEntity } from '../types';

export class IdempotencyRepository {
  private engine: StorageEngine<IdempotencyEntity>;

  constructor() {
    this.engine = new StorageEngine<IdempotencyEntity>('idempotency_store', 'key');
  }

  public get<T = any>(key: string): T | null {
    const record = this.engine.get(key);
    if (!record) return null;

    if (record.expiresAt && Date.now() > record.expiresAt) {
      this.engine.delete(key);
      return null;
    }

    return record.result as T;
  }

  public set(key: string, result: any, ttlMs: number = 86400000): void {
    const record: IdempotencyEntity = {
      key,
      result,
      createdAt: new Date().toISOString(),
      expiresAt: Date.now() + ttlMs
    };
    this.engine.set(key, record);
  }

  public checkAndSet<T = any>(key: string, calculateResult: () => T, ttlMs: number = 86400000): { result: T; cached: boolean } {
    const existing = this.get<T>(key);
    if (existing !== null) {
      return { result: existing, cached: true };
    }

    const calculated = calculateResult();
    this.set(key, calculated, ttlMs);
    return { result: calculated, cached: false };
  }
}
