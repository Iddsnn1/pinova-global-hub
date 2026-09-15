import fs from 'node:fs';
import path from 'node:path';

const serverPath = path.resolve('server.ts');
const source = fs.readFileSync(serverPath, 'utf8');

const oldBlock = `function getVendorBrandingDir(): string {
  const base = process.env.PINOVA_DATA_DIR
    ? path.resolve(process.env.PINOVA_DATA_DIR, 'vendor-branding')
    : path.resolve(process.cwd(), 'data', 'vendor-branding');
  try {
    if (!fs.existsSync(base)) {
      fs.mkdirSync(base, { recursive: true, mode: 0o755 });
    }
  } catch {
    const fallback = path.resolve('/tmp', 'pinova_data', 'vendor-branding');
    if (!fs.existsSync(fallback)) {
      fs.mkdirSync(fallback, { recursive: true, mode: 0o755 });
    }
    return fallback;
  }
  return base;
}`;

const newBlock = `function getVendorBrandingDir(): string {
  // Vercel serverless functions have a read-only deployed filesystem; only /tmp is writable.
  // Prefer configured storage outside Vercel, but actively verify write access before using it.
  const configured = process.env.PINOVA_DATA_DIR
    ? path.resolve(process.env.PINOVA_DATA_DIR, 'vendor-branding')
    : path.resolve(process.cwd(), 'data', 'vendor-branding');
  const fallback = path.resolve('/tmp', 'pinova_data', 'vendor-branding');
  const candidates = process.env.VERCEL === '1' ? [fallback] : [configured, fallback];

  for (const candidate of candidates) {
    try {
      fs.mkdirSync(candidate, { recursive: true, mode: 0o755 });
      const probe = path.join(candidate, \\`.write-probe-\\${process.pid}-\\${Date.now()}\\`);
      fs.writeFileSync(probe, 'ok', { encoding: 'utf8', mode: 0o600 });
      fs.unlinkSync(probe);
      return candidate;
    } catch (err: any) {
      console.warn(\\`[Vendor Branding] Storage candidate unavailable: \\${candidate} (\\${err?.code || err?.message || 'unknown'})\\`);
    }
  }

  throw new Error('No writable storage directory is available for merchant branding assets.');
}`;

if (source.includes(newBlock)) {
  console.log('[Vendor Branding] Runtime storage patch already present.');
  process.exit(0);
}

if (!source.includes(oldBlock)) {
  console.error('[Vendor Branding] Expected storage function was not found; refusing unsafe rewrite.');
  process.exit(1);
}

fs.writeFileSync(serverPath, source.replace(oldBlock, newBlock), 'utf8');
console.log('[Vendor Branding] Applied Vercel-aware writable storage patch.');
