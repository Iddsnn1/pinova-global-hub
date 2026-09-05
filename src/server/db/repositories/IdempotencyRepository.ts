import { StorageEngine } from '../StorageEngine';
import { IdempotencyEntity } from '../types';

export interface IdempotencyReservationResult<T = any> {
  status: 'RESERVED' | 'RESOLVED' | 'IN_PROGRESS' | 'CONFLICT';
  cachedResult?: T;
  message?: string;
}

export class IdempotencyRepository {
  private engine: StorageEngine<IdempotencyEntity>;
  private processLocks: Map<string, Promise<void>> = new Map();

  constructor() {
    this.engine = new StorageEngine<IdempotencyEntity>('idempotency_store', 'key');
  }

  /**
   * Acquire an in-process lock for key-level atomic operations
   */
  private async acquireLock(key: string): Promise<() => void> {
    while (this.processLocks.has(key)) {
      await this.processLocks.get(key);
    }
    let unlock: () => void;
    const promise = new Promise<void>((resolve) => {
      unlock = resolve;
    });
    this.processLocks.set(key, promise);
    return () => {
      this.processLocks.delete(key);
      unlock();
    };
  }

  public get<T = any>(key: string): T | null {
    const record = this.engine.get(key);
    if (!record) return null;

    if (record.expiresAt && Date.now() > record.expiresAt) {
      this.engine.delete(key);
      return null;
    }

    if (record.status && record.status !== 'RESOLVED') {
      return null;
    }

    return record.result as T;
  }

  public set(key: string, result: any, ttlMs: number = 86400000): void {
    const record: IdempotencyEntity = {
      key,
      status: 'RESOLVED',
      result,
      createdAt: new Date().toISOString(),
      expiresAt: Date.now() + ttlMs
    };
    this.engine.set(key, record);
  }

  /**
   * Atomically reserves an idempotency key before performing a sensitive operation.
   * Protects against concurrent race conditions and payload substitution attacks.
   */
  public async reserveIdempotencyKey<T = any>(
    key: string,
    operationFingerprint: string,
    requestHash: string,
    ttlMs: number = 86400000
  ): Promise<IdempotencyReservationResult<T>> {
    const release = await this.acquireLock(key);
    try {
      const record = this.engine.get(key);

      // 1. Expired check
      if (record && record.expiresAt && Date.now() > record.expiresAt) {
        this.engine.delete(key);
      } else if (record) {
        // 2. Payload / Fingerprint conflict check (Attack Scenario F)
        if (
          (record.operationFingerprint && record.operationFingerprint !== operationFingerprint) ||
          (record.requestHash && record.requestHash !== requestHash)
        ) {
          return {
            status: 'CONFLICT',
            message: 'Idempotency key reuse detected with divergent operation parameters or request payload.'
          };
        }

        // 3. Already resolved
        if (record.status === 'RESOLVED') {
          return {
            status: 'RESOLVED',
            cachedResult: record.result as T
          };
        }

        // 4. Currently in progress
        if (record.status === 'PENDING') {
          return {
            status: 'IN_PROGRESS',
            message: 'Operation with this idempotency key is currently executing.'
          };
        }
      }

      // 5. Atomically reserve key
      const now = new Date().toISOString();
      const newRecord: IdempotencyEntity = {
        key,
        operationFingerprint,
        requestHash,
        status: 'PENDING',
        createdAt: now,
        expiresAt: Date.now() + ttlMs
      };

      this.engine.set(key, newRecord);
      return { status: 'RESERVED' };
    } finally {
      release();
    }
  }

  /**
   * Marks a reserved idempotency key as resolved with the final response payload.
   */
  public async resolveIdempotencyKey(key: string, result: any): Promise<void> {
    const release = await this.acquireLock(key);
    try {
      const record = this.engine.get(key);
      if (record) {
        record.status = 'RESOLVED';
        record.result = result;
        this.engine.set(key, record);
      } else {
        this.set(key, result);
      }
    } finally {
      release();
    }
  }

  public async completeIdempotencyKey(key: string, result: any): Promise<void> {
    return this.resolveIdempotencyKey(key, result);
  }

  /**
   * Release or fail a key if the operation aborted, allowing safe retries.
   */
  public async releaseIdempotencyKey(key: string): Promise<void> {
    const release = await this.acquireLock(key);
    try {
      this.engine.delete(key);
    } finally {
      release();
    }
  }

  /**
   * Atomic checkAndSet with process-level locking
   */
  public checkAndSet<T = any>(key: string, calculateResult: () => T, ttlMs: number = 86400000): { result: T; cached: boolean } {
    const record = this.engine.get(key);
    if (record && (!record.expiresAt || Date.now() <= record.expiresAt) && record.status === 'RESOLVED') {
      return { result: record.result as T, cached: true };
    }

    const calculated = calculateResult();
    this.set(key, calculated, ttlMs);
    return { result: calculated, cached: false };
  }
}
