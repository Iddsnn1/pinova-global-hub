import type { IncomingMessage, ServerResponse } from 'http';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

function getApp() {
  try {
    const mod = require('../dist/server.cjs');
    return mod.default || mod;
  } catch (err1: any) {
    try {
      const mod = require('../server');
      return mod.default || mod;
    } catch (err2: any) {
      console.error('[Vercel Handler] Error loading server module:', { err1: err1?.message, err2: err2?.message });
      throw new Error(`Failed to load server module: ${err1?.message || String(err1)}`);
    }
  }
}

let cachedApp: any = null;

export default function handler(req: IncomingMessage, res: ServerResponse) {
  const reqUrl = req.url || '';

  // Isolated validation key endpoint
  const rawUrl = req.url || '';
  const decodedUrl = decodeURIComponent(rawUrl).toLowerCase();

  if (
    decodedUrl.includes('validation-key')
  ) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.statusCode = 200;
    res.end('8a6a4b885d34141bb2512da532760394d83de4673574b82de61c4a0895e00cb11dacc69b4618c84393a5518a75ca356597e3df7ed67a9d884baa7b8edd3f7cca');
    return;
  }

  // Isolated zero-dependency health endpoint execution
  if (
    reqUrl === '/api/health' ||
    reqUrl === '/health' ||
    reqUrl.startsWith('/api/health?') ||
    reqUrl.startsWith('/health?') ||
    reqUrl.includes('__path=/health') ||
    reqUrl.includes('__path=%2Fhealth')
  ) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.statusCode = 200;
    res.end(JSON.stringify({
      status: 'ok',
      runtime: 'vercel'
    }));
    return;
  }

  // Isolated diagnostic endpoint
  if (
    reqUrl === '/api/debug/runtime' ||
    reqUrl === '/debug/runtime' ||
    reqUrl.startsWith('/api/debug/runtime?') ||
    reqUrl.startsWith('/debug/runtime?') ||
    reqUrl.includes('__path=/debug/runtime') ||
    reqUrl.includes('__path=%2Fdebug%2Fruntime')
  ) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.statusCode = 200;
    res.end(JSON.stringify({
      ok: true,
      runtime: 'vercel',
      nodeVersion: process.version,
      requestUrl: reqUrl
    }));
    return;
  }

  // Normalize URL if Vercel rewrite passed __path query parameter
  if (req.url) {
    try {
      const parsedUrl = new URL(req.url, 'http://localhost');
      const pathQuery = parsedUrl.searchParams.get('__path');
      if (pathQuery) {
        let cleanPath = pathQuery;
        if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;
        if (!cleanPath.startsWith('/api/') && cleanPath !== '/api') {
          cleanPath = '/api' + cleanPath;
        }
        parsedUrl.searchParams.delete('__path');
        const searchStr = parsedUrl.searchParams.toString();
        req.url = cleanPath + (searchStr ? '?' + searchStr : '');
      }
    } catch (e) {
      // ignore parse error
    }
  }

  try {
    if (!cachedApp) {
      cachedApp = getApp();
    }
    return cachedApp(req, res);
  } catch (err: any) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.statusCode = 500;
    res.end(JSON.stringify({
      success: false,
      error: 'SERVER_HANDLER_EXCEPTION',
      message: err?.message || String(err),
      stack: err?.stack || null
    }));
  }
}




