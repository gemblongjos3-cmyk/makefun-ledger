import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, normalize, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('./app/', import.meta.url));
const args = process.argv.slice(2);
const portIndex = args.indexOf('--port');
const port = portIndex >= 0 && args[portIndex + 1] ? Number(args[portIndex + 1]) : 8080;
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'cache-control': 'no-store' });
    res.end('Method Not Allowed');
    return;
  }
  try {
    const pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
    const target = normalize(join(root, pathname === '/' ? 'index.html' : pathname.slice(1)));
    if (target !== root.slice(0, -1) && !target.startsWith(root)) {
      res.writeHead(403, { 'cache-control': 'no-store' });
      res.end('Forbidden');
      return;
    }
    const info = await stat(target);
    if (!info.isFile()) throw new Error('Not a file');
    const body = await readFile(target);
    res.writeHead(200, {
      'content-type': mime[extname(target).toLowerCase()] ?? 'application/octet-stream',
      'cache-control': 'no-store',
      'content-length': body.byteLength,
    });
    if (req.method === 'HEAD') res.end();
    else res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' });
    res.end('Not Found');
  }
}).listen(port, () => console.log(`Ledger serving app/ on http://localhost:${port}`));
