import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

export function createRateLimiter(options: {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: Request) => string;
  message?: string;
}) {
  const hits = new Map<string, RateLimitRecord>();

  // Cleanup old records periodically
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of hits.entries()) {
      if (now > record.resetTime) {
        hits.delete(key);
      }
    }
  }, Math.max(60000, options.windowMs));

  if (cleanupTimer && typeof cleanupTimer.unref === 'function') {
    cleanupTimer.unref();
  }

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const key = options.keyGenerator ? options.keyGenerator(req) : `${ip}:${req.baseUrl || ''}${req.path}`;
    const now = Date.now();

    let record = hits.get(key);
    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + options.windowMs
      };
      hits.set(key, record);
    } else {
      record.count++;
    }

    const remaining = Math.max(0, options.maxRequests - record.count);
    const retryAfterSec = Math.ceil((record.resetTime - now) / 1000);

    res.setHeader('X-RateLimit-Limit', options.maxRequests);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

    if (record.count > options.maxRequests) {
      res.setHeader('Retry-After', retryAfterSec);
      res.status(429).json({
        success: false,
        error: 'RATE_LIMIT_EXCEEDED',
        message: options.message || 'Too many requests. Please retry later.',
        retryAfter: retryAfterSec
      });
      return;
    }

    next();
  };
}
