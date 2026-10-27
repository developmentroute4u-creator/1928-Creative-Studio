<?php
/**
 * 1928 CREATIVE STUDIO — Master PHP Dynamic Routing Engine
 * Resolves custom URL slugs, serves dedicated service and perspective pages,
 * injects SEO metadata dynamically, and handles clean URL rewriting.
 */

require_once __DIR__ . '/db.php';

// 1. Extract requested route path
$route = $_GET['route'] ?? '';

if (empty($route)) {
    $requestUri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
    $scriptDir = dirname($_SERVER['SCRIPT_NAME'] ?? '');
    $scriptDir = ($scriptDir === '/' || $scriptDir === '\\') ? '' : $scriptDir;
    
    if (!empty($scriptDir) && strpos($requestUri, $scriptDir) === 0) {
        $requestUri = substr($requestUri, strlen($scriptDir));
    }
    $route = trim($requestUri, '/');
} else {
    $route = trim($route, '/');
}

// Remove any query string remnants
if (strpos($route, '?') !== false) {
    $route = explode('?', $route)[0];
}

// 2. Default route (Home)
if ($route === '' || $route === 'index.html' || $route === 'home') {
    serveFileWithSEO(__DIR__ . '/index.html', 'home');
    exit;
}

$db = getDB();

// 3. Check for matching route in site_routes table
$routeStmt = $db->prepare("
    SELECT * FROM `site_routes` 
    WHERE `slug` = :slug AND `is_active` = 1 
    LIMIT 1
");
$routeStmt->execute([':slug' => $route]);
$matchedRoute = $routeStmt->fetch();

if ($matchedRoute) {
    $targetFile = __DIR__ . '/' . $matchedRoute['target_file'];
    if (file_exists($targetFile)) {
        serveFileWithSEO($targetFile, $matchedRoute['route_key'], $matchedRoute);
        exit;
    }
}

// 4. Check for perspective / blog article routes
// Supports both "/perspectives/article-slug", "/blogs/article-slug", and direct "/article-slug"
$blogSlug = '';
if (preg_match('/^(?:perspectives|blogs|perspective|blog)\/(.+)$/i', $route, $matches)) {
    $blogSlug = $matches[1];
} else {
    // Check if the route directly matches a blog slug in the database
    $blogCheck = $db->prepare("SELECT `blog_id` FROM `blogs` WHERE `slug` = :slug LIMIT 1");
    $blogCheck->execute([':slug' => $route]);
    if ($blogCheck->fetch()) {
        $blogSlug = $route;
    }
}

if (!empty($blogSlug)) {
    $blogStmt = $db->prepare("
        SELECT * FROM `blogs` 
        WHERE `slug` = :slug OR `blog_id` = :bid 
        LIMIT 1
    ");
    $blogStmt->execute([':slug' => $blogSlug, ':bid' => $blogSlug]);
    $blog = $blogStmt->fetch();

    if ($blog) {
        $detailFile = __DIR__ . '/blog-detail.html';
        if (file_exists($detailFile)) {
            serveBlogDetail($detailFile, $blog);
            exit;
        }
    }
}

// 5. Check if requested route matches a direct HTML file on disk
$candidateFile = __DIR__ . '/' . $route;
if (!str_ends_with($candidateFile, '.html')) {
    $candidateFile .= '.html';
}

if (file_exists($candidateFile)) {
    // Find corresponding route key if any
    $baseName = basename($candidateFile);
    $keyStmt = $db->prepare("SELECT * FROM `site_routes` WHERE `target_file` = :tf LIMIT 1");
    $keyStmt->execute([':tf' => $baseName]);
    $found = $keyStmt->fetch();
    // If there is an active custom slug and the request is not using it (e.g. legacy name or .html), 301 redirect
    if ($found && !empty($found['slug']) && $route !== $found['slug']) {
        $cleanUrl = getBaseUrl() . '/' . $found['slug'];
        header("Location: $cleanUrl", true, 301);
        exit;
    }
    
    $routeKey = $found['route_key'] ?? str_replace('.html', '', $baseName);
    serveFileWithSEO($candidateFile, $routeKey, $found ?: null);
    exit;
}

// 6. 404 Handler
http_response_code(404);
render404($route);
exit;


// ═════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═════════════════════════════════════════════════════════════════

function getBaseUrl(): string {
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $scriptDir = dirname($_SERVER['SCRIPT_NAME'] ?? '');
    $scriptDir = ($scriptDir === '/' || $scriptDir === '\\') ? '' : $scriptDir;
    return rtrim($protocol . $host . $scriptDir, '/');
}

function serveFileWithSEO(string $filePath, string $pageKey, ?array $routeData = null): void {
    if (!file_exists($filePath)) {
        http_response_code(404);
        render404($pageKey);
        return;
    }

    $html = file_get_contents($filePath);
    $db = getDB();

    // Fetch SEO metadata
    $seoStmt = $db->prepare("SELECT * FROM `seo_meta` WHERE `page_key` = :pk LIMIT 1");
    $seoStmt->execute([':pk' => $pageKey]);
    $seo = $seoStmt->fetch();

    $baseUrl = getBaseUrl();
    $currentSlug = $routeData['slug'] ?? '';
    $canonicalUrl = $baseUrl . ($currentSlug ? '/' . $currentSlug : '');

    // Dynamic Title & Meta Injection
    if ($seo) {
        if (!empty($seo['title'])) {
            $safeTitle = htmlspecialchars($seo['title'], ENT_QUOTES, 'UTF-8');
            $html = preg_replace('/<title>.*?<\/title>/is', "<title>{$safeTitle}</title>", $html);
        }
        if (!empty($seo['description'])) {
            $safeDesc = htmlspecialchars($seo['description'], ENT_QUOTES, 'UTF-8');
            if (preg_match('/<meta\s+name=["\']description["\']/i', $html)) {
                $html = preg_replace('/<meta\s+name=["\']description["\']\s+content=["\'].*?["\']/is', "<meta name=\"description\" content=\"{$safeDesc}\"", $html);
            } else {
                $html = str_ireplace('</head>', "  <meta name=\"description\" content=\"{$safeDesc}\">\n</head>", $html);
            }
        }
        if (!empty($seo['keywords'])) {
            $safeKw = htmlspecialchars($seo['keywords'], ENT_QUOTES, 'UTF-8');
            if (preg_match('/<meta\s+name=["\']keywords["\']/i', $html)) {
                $html = preg_replace('/<meta\s+name=["\']keywords["\']\s+content=["\'].*?["\']/is', "<meta name=\"keywords\" content=\"{$safeKw}\"", $html);
            } else {
                $html = str_ireplace('</head>', "  <meta name=\"keywords\" content=\"{$safeKw}\">\n</head>", $html);
            }
        }
    }

    // Base tag to guarantee all relative assets (css, js, img) resolve cleanly on all route depths
    if (!preg_match('/<base\s+href=/i', $html)) {
        $html = str_ireplace('<head>', "<head>\n  <base href=\"{$baseUrl}/\">", $html);
    }

    // Canonical link tag
    if (!empty($canonicalUrl)) {
        if (preg_match('/<link\s+rel=["\']canonical["\']/i', $html)) {
            $html = preg_replace('/<link\s+rel=["\']canonical["\']\s+href=["\'].*?["\']/is', "<link rel=\"canonical\" href=\"{$canonicalUrl}\"", $html);
        } else {
            $html = str_ireplace('</head>', "  <link rel=\"canonical\" href=\"{$canonicalUrl}\" />\n</head>", $html);
        }
    }

    // Inject server route state token into head for client-side JS
    $routeJson = json_encode([
        'pageKey' => $pageKey,
        'slug' => $currentSlug,
        'baseUrl' => $baseUrl,
        'targetFile' => basename($filePath)
    ]);
    $injectionScript = "<script>window.__1928_SERVER_ROUTE__ = {$routeJson};</script>\n";
    $html = str_ireplace('</head>', "  {$injectionScript}</head>", $html);

    header('Content-Type: text/html; charset=utf-8');
    echo $html;
}

function serveBlogDetail(string $filePath, array $blog): void {
    $html = file_get_contents($filePath);
    $baseUrl = getBaseUrl();
    $canonicalUrl = $baseUrl . '/perspectives/' . $blog['slug'];

    $safeTitle = htmlspecialchars($blog['title'] . ' · 1928 Perspectives', ENT_QUOTES, 'UTF-8');
    $safeDesc = htmlspecialchars($blog['excerpt'] ?: substr(strip_tags($blog['content_html'] ?? ''), 0, 160), ENT_QUOTES, 'UTF-8');
    $safeCover = htmlspecialchars($blog['cover_image'] ?? 'assets/img/portfolio/port-chronos.jpg', ENT_QUOTES, 'UTF-8');

    // Title & Description
    $html = preg_replace('/<title>.*?<\/title>/is', "<title>{$safeTitle}</title>", $html);
    if (preg_match('/<meta\s+name=["\']description["\']/i', $html)) {
        $html = preg_replace('/<meta\s+name=["\']description["\']\s+content=["\'].*?["\']/is', "<meta name=\"description\" content=\"{$safeDesc}\"", $html);
    } else {
        $html = str_ireplace('</head>', "  <meta name=\"description\" content=\"{$safeDesc}\">\n</head>", $html);
    }

    // Base tag to guarantee all relative assets (css, js, img) resolve cleanly on all route depths
    if (!preg_match('/<base\s+href=/i', $html)) {
        $html = str_ireplace('<head>', "<head>\n  <base href=\"{$baseUrl}/\">", $html);
    }

    // Canonical link tag
    if (preg_match('/<link\s+rel=["\']canonical["\']/i', $html)) {
        $html = preg_replace('/<link\s+rel=["\']canonical["\']\s+href=["\'].*?["\']/is', "<link rel=\"canonical\" href=\"{$canonicalUrl}\"", $html);
    } else {
        $html = str_ireplace('</head>', "  <link rel=\"canonical\" href=\"{$canonicalUrl}\" />\n</head>", $html);
    }

    // Pre-populate article identifier so site-bridge.js renders instantly without delay
    $blogPayload = json_encode([
        'id' => $blog['blog_id'],
        'slug' => $blog['slug'],
        'title' => $blog['title'],
        'category' => $blog['category'],
        'coverImage' => $blog['cover_image'],
        'author' => $blog['author'],
        'role' => $blog['author_role'],
        'date' => $blog['date_text'],
        'readTime' => $blog['read_time'],
        'city' => $blog['city'],
        'excerpt' => $blog['excerpt']
    ]);

    $injection = "<script>
      window.ACTIVE_ARTICLE_SLUG = " . json_encode($blog['slug']) . ";
      window.ACTIVE_ARTICLE_ID = " . json_encode($blog['blog_id']) . ";
      window.__PRELOADED_BLOG__ = {$blogPayload};
    </script>\n";

    $html = str_ireplace('</head>', "  {$injection}</head>", $html);

    header('Content-Type: text/html; charset=utf-8');
    echo $html;
}

function render404(string $attemptedRoute): void {
    $baseUrl = getBaseUrl();
    echo <<<HTML
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 · Landmark Not Found · 1928 Creative Studio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Raleway:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      background: #07070A;
      color: #F7F7FA;
      font-family: 'Raleway', -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      text-align: center;
    }
    .kicker {
      font-family: 'Space Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: #C9A96E;
      margin-bottom: 16px;
    }
    h1 {
      font-family: 'Montserrat', sans-serif;
      font-size: clamp(32px, 5vw, 56px);
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 16px;
      line-height: 1.1;
    }
    p {
      color: rgba(247, 247, 250, 0.65);
      font-size: 15px;
      max-width: 480px;
      line-height: 1.6;
      margin-bottom: 32px;
    }
    .route-token {
      font-family: 'Space Mono', monospace;
      font-size: 12px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 4px 10px;
      border-radius: 3px;
      color: #F7F7FA;
      display: inline-block;
      margin-top: 6px;
    }
    .btn-return {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 14px 28px;
      background: #F7F7FA;
      color: #07070A;
      font-family: 'Montserrat', sans-serif;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      text-decoration: none;
      border-radius: 2px;
      transition: all 0.3s ease;
    }
    .btn-return:hover {
      background: #C9A96E;
      color: #07070A;
      transform: translateY(-1px);
    }
  </style>
</head>
<body>
  <div class="kicker">Index Lookup Error · 404</div>
  <h1>Landmark Uncharted</h1>
  <p>The destination route does not resolve to an active practice coordinate.<br><span class="route-token">/{$attemptedRoute}</span></p>
  <a href="{$baseUrl}/" class="btn-return">Return to Studio Domain</a>
</body>
</html>
HTML;
}
