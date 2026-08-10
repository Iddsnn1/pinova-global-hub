import type { IncomingMessage, ServerResponse } from 'http';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const reqUrl = req.url || '';

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

  try {
    const serverModule = await import('../server');
    const app = serverModule.default;
    return app(req, res);
  } catch (err: any) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.statusCode = 500;
    res.end(JSON.stringify({
      success: false,
      error: 'Server Module Initialization Exception',
      message: err?.message || String(err),
      stack: err?.stack || null
    }));
  }
}


