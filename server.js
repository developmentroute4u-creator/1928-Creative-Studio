const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const BASE_DIR = __dirname;

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
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4'
};

// Aliases for clean navigation
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
  '/start-project': '/contact.html',
  '/blog-detail': '/blog-detail.html',
  '/service-detail': '/service-detail.html',
  '/project-detail': '/project-detail.html'
};

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
  const rawUrl = req.url.split('?')[0];
  let reqPath = decodeURIComponent(rawUrl);

  // Normalize trailing slashes (except root)
  if (reqPath.length > 1 && reqPath.endsWith('/')) {
    reqPath = reqPath.slice(0, -1);
  }

  // Check route aliases
  if (ROUTE_ALIASES[reqPath.toLowerCase()]) {
    reqPath = ROUTE_ALIASES[reqPath.toLowerCase()];
  }

  const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(BASE_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      console.log(`[200] ${req.method} ${req.url} -> ${path.basename(filePath)}`);
      serveFile(res, filePath);
      return;
    }

    if (!err && stats.isDirectory()) {
      const indexCandidate = path.join(filePath, 'index.html');
      if (fs.existsSync(indexCandidate)) {
        console.log(`[200 DIR] ${req.method} ${req.url} -> ${indexCandidate}`);
        serveFile(res, indexCandidate);
        return;
      }
    }

    // Clean URL fallback: try appending .html
    const htmlCandidate = filePath + '.html';
    if (fs.existsSync(htmlCandidate) && fs.statSync(htmlCandidate).isFile()) {
      console.log(`[200 CLEAN-URL] ${req.method} ${req.url} -> ${path.basename(htmlCandidate)}`);
      serveFile(res, htmlCandidate);
      return;
    }

    // Monograph/Perspectives Fallback: if user asked for anything starting with /blog or /perspective
    if (reqPath.startsWith('/blog') || reqPath.startsWith('/perspective')) {
      const blogCandidate = path.join(BASE_DIR, 'blogs.html');
      if (fs.existsSync(blogCandidate)) {
        console.log(`[200 BLOG-FALLBACK] ${req.method} ${req.url} -> blogs.html`);
        serveFile(res, blogCandidate);
        return;
      }
    }

    // Not found: serve branded 404 with instant redirect to /blogs.html
    console.warn(`[404] ${req.method} ${req.url} -> Not Found`);
    res.writeHead(404, {
      'Content-Type': 'text/html; charset=UTF-8',
      'Cache-Control': 'no-cache'
    });
    res.end(renderBranded404(req.url));
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`1928 Creative Studio Server running at:`);
  console.log(`  http://localhost:${PORT}/blogs.html`);
  console.log(`  http://localhost:${PORT}/blogs`);
  console.log(`  http://localhost:${PORT}/`);
  console.log(`====================================================`);
});
