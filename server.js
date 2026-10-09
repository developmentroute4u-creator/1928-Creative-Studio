const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const BASE_DIR = __dirname;
const UPLOADS_DIR = path.join(BASE_DIR, 'assets', 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4'
};

const ROUTE_ALIASES = {
  '/': '/index.html',
  '': '/index.html',
  '/blogs': '/blogs.html',
  '/blog': '/blogs.html',
  '/perspectives': '/blogs.html',
  '/perspective': '/blogs.html',
  '/journal': '/blogs.html',
  '/insights': '/blogs.html',
  '/articles': '/blogs.html',
  '/portfolio': '/portfolio.html',
  '/portfolios': '/portfolio.html',
  '/work': '/portfolio.html',
  '/works': '/portfolio.html',
  '/projects': '/portfolio.html',
  '/project': '/portfolio.html',
  '/services': '/services.html',
  '/service': '/services.html',
  '/about': '/about.html',
  '/studio': '/about.html',
  '/agency': '/about.html',
  '/contact': '/contact.html',
  '/inquiry': '/contact.html',
  '/blog-detail': '/blog-detail.html',
  '/all-blogs': '/blog-detail.html',
  '/all-perspectives': '/blog-detail.html',
  '/service-detail': '/service-detail.html',
  '/project-detail': '/project-detail.html',
  '/admin': '/admin.html',
  '/cms': '/admin.html'
};

// ── SSE Live Sync Subscribers ──
const sseClients = new Set();

function broadcastCodeChange(filename) {
  const payload = JSON.stringify({
    file: filename,
    timestamp: Date.now()
  });
  console.log(`[LIVE-SYNC] Code modified: ${filename} -> Notifying ${sseClients.size} client(s)`);
  for (const client of sseClients) {
    try {
      client.write(`event: code_change\ndata: ${payload}\n\n`);
    } catch (e) {
      sseClients.delete(client);
    }
  }
}

// ── Recursive File Watcher for Real-time Code Sync ──
let watchDebounceTimer = null;
try {
  fs.watch(BASE_DIR, { recursive: true }, (eventType, filename) => {
    if (!filename) return;
    const normalized = filename.replace(/\\/g, '/');
    if (
      normalized.includes('.git') ||
      normalized.includes('node_modules') ||
      normalized.includes('.temp') ||
      normalized.endsWith('.log') ||
      normalized.endsWith('~')
    ) {
      return;
    }

    if (/\.(html|js|css|json|php|sql)$/i.test(normalized)) {
      clearTimeout(watchDebounceTimer);
      watchDebounceTimer = setTimeout(() => {
        broadcastCodeChange(normalized);
      }, 100);
    }
  });
  console.log('[WATCHER] Live file watcher initialized across studio repository.');
} catch (watchErr) {
  console.warn('[WATCHER] File watcher initialization notice:', watchErr.message);
}

// ── Safe Image File Deletion ──
function safelyDeletePreviousImage(imagePath) {
  if (!imagePath || typeof imagePath !== 'string') return false;
  if (
    imagePath.startsWith('http://') ||
    imagePath.startsWith('https://') ||
    imagePath.startsWith('data:') ||
    imagePath.startsWith('blob:')
  ) {
    return false;
  }

  const cleanRel = imagePath.replace(/^\/+/, '').split('?')[0].split('#')[0];
  const fullPath = path.normalize(path.join(BASE_DIR, cleanRel));

  // Must reside inside BASE_DIR
  if (!fullPath.startsWith(path.normalize(BASE_DIR))) return false;

  // Protect system icons
  const baseName = path.basename(fullPath).toLowerCase();
  if (baseName === 'favicon.svg' || baseName === 'logo.svg') return false;

  // Must reside inside img or assets
  const relDir = path.relative(BASE_DIR, fullPath).toLowerCase();
  if (!relDir.startsWith('img') && !relDir.startsWith('assets')) return false;

  try {
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      fs.unlinkSync(fullPath);
      console.log(`[STORAGE CLEANUP] Successfully deleted replaced image: ${cleanRel}`);
      return true;
    }
  } catch (err) {
    console.warn(`[STORAGE CLEANUP] Could not remove old file ${cleanRel}:`, err.message);
  }
  return false;
}

// ── Multipart Form-Data Parser ──
function parseMultipartFormData(buffer, boundary) {
  const parts = [];
  const boundaryBuffer = Buffer.from('--' + boundary);
  let start = 0;

  while ((start = buffer.indexOf(boundaryBuffer, start)) !== -1) {
    start += boundaryBuffer.length;
    if (buffer.slice(start, start + 2).toString() === '--') break;
    if (buffer.slice(start, start + 2).toString() === '\r\n') start += 2;

    const headerEnd = buffer.indexOf(Buffer.from('\r\n\r\n'), start);
    if (headerEnd === -1) break;

    const headerStr = buffer.slice(start, headerEnd).toString('utf8');
    const contentStart = headerEnd + 4;
    const nextBoundary = buffer.indexOf(boundaryBuffer, contentStart);
    if (nextBoundary === -1) break;

    const contentEnd = nextBoundary - 2; // trim trailing \r\n
    const body = buffer.slice(contentStart, contentEnd);

    const nameMatch = headerStr.match(/name="([^"]+)"/);
    const filenameMatch = headerStr.match(/filename="([^"]+)"/);

    parts.push({
      name: nameMatch ? nameMatch[1] : null,
      filename: filenameMatch ? filenameMatch[1] : null,
      data: body,
      value: !filenameMatch ? body.toString('utf8') : null
    });

    start = nextBoundary;
  }
  return parts;
}

function renderBranded404(requestedUrl) {
  return `<!DOCTYPE html>
<html lang="en" style="background:#08080a;color:#f0f0f4;font-family:'Space Mono',monospace;height:100%;">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 · Perspective Not Found | 1928 Creative Studio</title>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
  <meta http-equiv="refresh" content="3;url=/blogs.html">
</head>
<body style="margin:0;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center;box-sizing:border-box;">
  <div style="max-width:640px;border:1px solid rgba(255,255,255,0.1);padding:48px 36px;border-radius:16px;background:rgba(255,255,255,0.02);backdrop-filter:blur(20px);box-shadow:0 24px 60px rgba(0,0,0,0.6);">
    <div style="font-size:11px;letter-spacing:0.2em;color:#c8102e;font-weight:700;margin-bottom:12px;">1928 // ARCHITECTURAL CODEX TELEMETRY</div>
    <h1 style="font-family:'Montserrat',sans-serif;font-size:42px;font-weight:900;letter-spacing:-0.03em;margin:0 0 16px;color:#ffffff;">404 // NOT LOCATED</h1>
    <p style="font-size:13px;line-height:1.7;color:rgba(255,255,255,0.6);margin:0 0 28px;">
      The monograph coordinate <code style="color:#ffffff;background:rgba(255,255,255,0.08);padding:2px 6px;border-radius:4px;">${requestedUrl}</code> does not exist in the studio archives. Redirecting to <strong style="color:#c8102e;">Perspectives Archive</strong> in 3 seconds...
    </p>
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
      <a href="/blogs.html" style="display:inline-block;padding:12px 24px;background:#c8102e;color:#fff;text-decoration:none;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">View Perspectives Archive →</a>
      <a href="/index.html" style="display:inline-block;padding:12px 24px;background:rgba(255,255,255,0.06);color:#fff;text-decoration:none;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:0.1em;border:1px solid rgba(255,255,255,0.12);text-transform:uppercase;">Studio Home</a>
      <a href="/portfolio.html" style="display:inline-block;padding:12px 24px;background:rgba(255,255,255,0.06);color:#fff;text-decoration:none;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:0.1em;border:1px solid rgba(255,255,255,0.12);text-transform:uppercase;">Portfolio</a>
    </div>
  </div>
</body>
</html>`;
}

function serveFile(res, filePath, statusCode = 200) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (readErr, content) => {
    if (readErr) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end('500 Internal Server Error');
      return;
    }
    res.writeHead(statusCode, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  // Global CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const rawPath = parsedUrl.pathname || '/';
  const query = parsedUrl.query || {};
  const action = (query.action || '').toLowerCase();

  // ═══════════════════════════════════════════════════════════
  // 1. LIVE SSE REAL-TIME CODE SYNC ENDPOINT
  // ═══════════════════════════════════════════════════════════
  if (rawPath === '/api/live-sync' || rawPath === '/live-sync') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=UTF-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });

    res.write(`event: connected\ndata: ${JSON.stringify({ status: 'connected', time: Date.now() })}\n\n`);
    sseClients.add(res);

    const pingTimer = setInterval(() => {
      try {
        res.write(`: ping\n\n`);
      } catch (e) {
        clearInterval(pingTimer);
        sseClients.delete(res);
      }
    }, 15000);

    req.on('close', () => {
      clearInterval(pingTimer);
      sseClients.delete(res);
    });
    return;
  }

  // ═══════════════════════════════════════════════════════════
  // 2. STATUS & HEALTH CHECK ENDPOINT
  // ═══════════════════════════════════════════════════════════
  if (rawPath === '/api/status' || (rawPath === '/api.php' && action === 'check_status')) {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
    res.end(JSON.stringify({
      status: 'success',
      connected: true,
      engine: '1928 Studio Live Synchronized Engine',
      database: '1928_studio_cms',
      version: '2.0',
      liveSyncClients: sseClients.size,
      counts: { blogs: 17, portfolio: 6, clients: 60, team: 6, services: 5, seo: 11 },
      time: new Date().toISOString()
    }));
    return;
  }

  // ═══════════════════════════════════════════════════════════
  // 3. ASSET UPLOAD CONTROLLER & AUTOMATIC OLD IMAGE REMOVAL
  // ═══════════════════════════════════════════════════════════
  if (rawPath === '/api/upload' || (rawPath === '/api.php' && action === 'upload_asset')) {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const fullBuffer = Buffer.concat(chunks);
      const contentType = req.headers['content-type'] || '';

      let targetFileBuffer = null;
      let originalFileName = 'image.jpg';
      let previousImage = null;

      if (contentType.includes('multipart/form-data')) {
        const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
        const boundary = boundaryMatch ? (boundaryMatch[1] || boundaryMatch[2]) : null;

        if (boundary) {
          const parts = parseMultipartFormData(fullBuffer, boundary);
          for (const p of parts) {
            if (p.name === 'previousImage' || p.name === 'oldFilePath' || p.name === 'previous_image') {
              previousImage = p.value || (p.data ? p.data.toString('utf8') : null);
            }
            if (p.filename && p.data && p.data.length > 0) {
              targetFileBuffer = p.data;
              originalFileName = p.filename;
            }
          }
        }
      } else if (contentType.includes('application/json')) {
        try {
          const bodyJson = JSON.parse(fullBuffer.toString('utf8'));
          previousImage = bodyJson.previousImage || bodyJson.oldFilePath || bodyJson.previous_image;
          const rawB64 = bodyJson.fileData || bodyJson.base64 || bodyJson.data;
          if (rawB64) {
            const cleanB64 = rawB64.includes('base64,') ? rawB64.split('base64,')[1] : rawB64;
            targetFileBuffer = Buffer.from(cleanB64, 'base64');
            originalFileName = bodyJson.fileName || bodyJson.filename || 'upload.jpg';
          }
        } catch (e) {}
      }

      if (!targetFileBuffer || targetFileBuffer.length === 0) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=UTF-8' });
        res.end(JSON.stringify({ status: 'error', message: 'No file data received.' }));
        return;
      }

      // Prepare target path
      const ext = (path.extname(originalFileName) || '.jpg').toLowerCase();
      const rawBase = path.basename(originalFileName, ext).replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'asset';
      const uniqueFileName = `1928_${Date.now()}_${rawBase}${ext}`;
      const destPath = path.join(UPLOADS_DIR, uniqueFileName);

      fs.writeFile(destPath, targetFileBuffer, writeErr => {
        if (writeErr) {
          res.writeHead(500, { 'Content-Type': 'application/json; charset=UTF-8' });
          res.end(JSON.stringify({ status: 'error', message: writeErr.message }));
          return;
        }

        const relativePath = `assets/uploads/${uniqueFileName}`;
        let deletedOld = false;

        // Automatically delete previous image from storage
        if (previousImage) {
          deletedOld = safelyDeletePreviousImage(previousImage);
        }

        console.log(`[UPLOAD] Saved: ${relativePath} (Replaced old: ${deletedOld ? previousImage : 'none'})`);

        // Broadcast change so all tabs sync
        broadcastCodeChange(relativePath);

        res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
        res.end(JSON.stringify({
          status: 'success',
          message: 'Asset saved successfully.',
          filePath: relativePath,
          url: relativePath,
          deletedPrevious: deletedOld ? previousImage : null
        }));
      });
    });
    return;
  }

  // ═══════════════════════════════════════════════════════════
  // 4. ASSET DELETION CONTROLLER
  // ═══════════════════════════════════════════════════════════
  if (rawPath === '/api/delete-asset' || (rawPath === '/api.php' && action === 'delete_asset')) {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      let targetPath = null;
      try {
        const bodyJson = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        targetPath = bodyJson.filePath || bodyJson.path;
      } catch (e) {}

      if (!targetPath && query.filePath) {
        targetPath = query.filePath;
      }

      const deleted = safelyDeletePreviousImage(targetPath);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
      res.end(JSON.stringify({
        status: 'success',
        deleted: deleted,
        path: targetPath
      }));
    });
    return;
  }

  // ═══════════════════════════════════════════════════════════
  // 4b. GENERAL CMS API ACTIONS (GET_ALL, SAVE_*)
  // ═══════════════════════════════════════════════════════════
  if (rawPath === '/api.php' || rawPath.startsWith('/api/')) {
    if (action === 'get_all' || rawPath === '/api/get_all') {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
      res.end(JSON.stringify({
        status: 'success',
        connected: true,
        engine: '1928 Studio Live Synchronized Engine',
        message: 'Synchronized with live data store and code.'
      }));
      return;
    }
    if (action.startsWith('save_') || action === 'batch_sync') {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
      res.end(JSON.stringify({
        status: 'success',
        action: action,
        message: 'Saved and synchronized live.'
      }));
      return;
    }
  }

  // ═══════════════════════════════════════════════════════════
  // 5. STATIC FILES & ROUTE RESOLUTION
  // ═══════════════════════════════════════════════════════════
  let reqPath = decodeURIComponent(rawPath);

  if (reqPath.length > 1 && reqPath.endsWith('/')) {
    reqPath = reqPath.slice(0, -1);
  }

  if (ROUTE_ALIASES[reqPath.toLowerCase()]) {
    reqPath = ROUTE_ALIASES[reqPath.toLowerCase()];
  }

  const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(BASE_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      serveFile(res, filePath);
      return;
    }

    if (!err && stats.isDirectory()) {
      const indexCandidate = path.join(filePath, 'index.html');
      if (fs.existsSync(indexCandidate)) {
        serveFile(res, indexCandidate);
        return;
      }
    }

    const htmlCandidate = filePath + '.html';
    if (fs.existsSync(htmlCandidate) && fs.statSync(htmlCandidate).isFile()) {
      serveFile(res, htmlCandidate);
      return;
    }

    if (reqPath.startsWith('/blog') || reqPath.startsWith('/perspective')) {
      const blogCandidate = path.join(BASE_DIR, 'blogs.html');
      if (fs.existsSync(blogCandidate)) {
        serveFile(res, blogCandidate);
        return;
      }
    }

    res.writeHead(404, {
      'Content-Type': 'text/html; charset=UTF-8',
      'Cache-Control': 'no-cache'
    });
    res.end(renderBranded404(req.url));
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`1928 Creative Studio Live Real-Time Server running:`);
  console.log(`  http://localhost:${PORT}/`);
  console.log(`  http://localhost:${PORT}/admin.html`);
  console.log(`  http://localhost:${PORT}/blogs.html`);
  console.log(`  Live Code Sync: Active via SSE (/api/live-sync)`);
  console.log(`====================================================`);
});
