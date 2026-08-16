import fs from 'fs';
import path from 'path';

/**
 * StorageEngine
 * Durable, crash-safe, append/update persistence engine with POSIX-atomic file writes.
 * Supports configurable storage directory (defaults to /tmp/pinova_db for serverless or ./data/db for container).
 */
export class StorageEngine<T extends { id?: string; [key: string]: any }> {
  private collectionName: string;
  private filePath: string;
  private cache: Map<string, T> = new Map();
  private isLoaded: boolean = false;
  private primaryKey: string;

  constructor(collectionName: string, primaryKey: string = 'id', initialData: T[] = []) {
    this.collectionName = collectionName;
    this.primaryKey = primaryKey;

    const baseDir = process.env.PINOVA_DATA_DIR || path.join(process.cwd(), 'data', 'db');
    
    // Ensure directory exists with fallback to /tmp/pinova_db if permissions fail
    let resolvedDir = baseDir;
    try {
      if (!fs.existsSync(resolvedDir)) {
        fs.mkdirSync(resolvedDir, { recursive: true });
      }
    } catch (e) {
      resolvedDir = path.join('/tmp', 'pinova_db');
      if (!fs.existsSync(resolvedDir)) {
        fs.mkdirSync(resolvedDir, { recursive: true });
      }
    }

    this.filePath = path.join(resolvedDir, `${collectionName}.json`);
    this.load(initialData);
  }

  private load(initialData: T[] = []): void {
    try {
      if (fs.existsSync(this.filePath)) {
        const fileContent = fs.readFileSync(this.filePath, 'utf-8');
        if (fileContent.trim()) {
          const parsed = JSON.parse(fileContent);
          if (Array.isArray(parsed)) {
            for (const item of parsed) {
              const key = String(item[this.primaryKey] || item.id || '');
              if (key) {
                this.cache.set(key, item);
              }
            }
          }
        }
      } else {
        // First-time seed load
        for (const item of initialData) {
          const key = String(item[this.primaryKey] || item.id || '');
          if (key) {
            this.cache.set(key, item);
          }
        }
        this.saveSync();
      }
      this.isLoaded = true;
    } catch (err) {
      console.warn(`[StorageEngine:${this.collectionName}] Recovery mode triggered:`, err);
      // Populate cache with seed data if file is corrupted
      for (const item of initialData) {
        const key = String(item[this.primaryKey] || item.id || '');
        if (key) {
          this.cache.set(key, item);
        }
      }
      this.saveSync();
      this.isLoaded = true;
    }
  }

  private saveSync(): boolean {
    try {
      const items = Array.from(this.cache.values());
      const tempPath = `${this.filePath}.tmp.${Date.now()}.${Math.random().toString(36).substring(2, 6)}`;
      fs.writeFileSync(tempPath, JSON.stringify(items, null, 2), 'utf-8');
      fs.renameSync(tempPath, this.filePath);
      return true;
    } catch (err) {
      console.error(`[StorageEngine:${this.collectionName}] Failed to sync to disk:`, err);
      return false;
    }
  }

  public get(key: string): T | null {
    return this.cache.get(key) || null;
  }

  public getAll(): T[] {
    return Array.from(this.cache.values());
  }

  public find(predicate: (item: T) => boolean): T | null {
    for (const item of this.cache.values()) {
      if (predicate(item)) {
        return item;
      }
    }
    return null;
  }

  public filter(predicate: (item: T) => boolean): T[] {
    const results: T[] = [];
    for (const item of this.cache.values()) {
      if (predicate(item)) {
        results.push(item);
      }
    }
    return results;
  }

  public set(key: string, value: T): boolean {
    this.cache.set(key, value);
    return this.saveSync();
  }

  public unshift(value: T): boolean {
    const key = String(value[this.primaryKey] || value.id || `key-${Date.now()}-${Math.random()}`);
    // In Map, to maintain reverse chrono order for arrays:
    const newMap = new Map<string, T>();
    newMap.set(key, value);
    for (const [k, v] of this.cache.entries()) {
      if (k !== key) {
        newMap.set(k, v);
      }
    }
    this.cache = newMap;
    return this.saveSync();
  }

  public delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.saveSync();
    }
    return deleted;
  }

  public count(): number {
    return this.cache.size;
  }
}
