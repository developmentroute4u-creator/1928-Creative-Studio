<?php
/**
 * 1928 CREATIVE STUDIO — Master Core PHP CMS API Controller
 * Handles all CRUD operations, MySQL queries, auto-seeding, and real-time synchronization
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/db.php';

$action = $_GET['action'] ?? 'get_all';
$db = getDB();

// Helper to auto-seed if tables are empty and run safe column migrations
function checkAndAutoSeed(PDO $db) {
    try {
        $check = $db->query("SHOW TABLES LIKE 'blogs'")->fetch();
        if (!$check) {
            $sqlFile = __DIR__ . '/database.sql';
            if (file_exists($sqlFile)) {
                $sql = file_get_contents($sqlFile);
                $db->exec($sql);
            }
            return;
        }
        $blogCount = $db->query("SELECT COUNT(*) as cnt FROM `blogs`")->fetch()['cnt'] ?? 0;
        if ($blogCount < 10) {
            $sqlFile = __DIR__ . '/database.sql';
            if (file_exists($sqlFile)) {
                $sql = file_get_contents($sqlFile);
                $db->exec($sql);
            }
        }

        // Safe auto-migration for additional detail fields in blogs table
        $cols = $db->query("SHOW COLUMNS FROM `blogs`")->fetchAll(PDO::FETCH_COLUMN);
        if (!in_array('sections_json', $cols)) {
            $db->exec("ALTER TABLE `blogs` ADD COLUMN `sections_json` LONGTEXT NULL AFTER `content_html`");
        }
        if (!in_array('related_json', $cols)) {
            $db->exec("ALTER TABLE `blogs` ADD COLUMN `related_json` TEXT NULL AFTER `sections_json`");
        }
        if (!in_array('author_bio', $cols)) {
            $db->exec("ALTER TABLE `blogs` ADD COLUMN `author_bio` TEXT NULL AFTER `author_role`");
        }
        if (!in_array('specimen_image', $cols)) {
            $db->exec("ALTER TABLE `blogs` ADD COLUMN `specimen_image` VARCHAR(255) NULL AFTER `cover_image`");
        }
        if (!in_array('specimen_caption', $cols)) {
            $db->exec("ALTER TABLE `blogs` ADD COLUMN `specimen_caption` VARCHAR(255) NULL AFTER `specimen_image`");
        }

        // Auto-migration & auto-seeding for contact_inquiries table
        $inqTableCheck = $db->query("SHOW TABLES LIKE 'contact_inquiries'")->fetch();
        if (!$inqTableCheck) {
            $db->exec("
                CREATE TABLE IF NOT EXISTS `contact_inquiries` (
                  `id` INT AUTO_INCREMENT PRIMARY KEY,
                  `name` VARCHAR(150) NOT NULL,
                  `email` VARCHAR(191) NOT NULL,
                  `company` VARCHAR(191) DEFAULT 'Independent Project',
                  `phone` VARCHAR(50) DEFAULT 'Not Specified',
                  `service` VARCHAR(150) DEFAULT 'Creative Direction & Strategy',
                  `budget` VARCHAR(100) DEFAULT 'Undisclosed Allocation',
                  `timeline` VARCHAR(100) DEFAULT '< 1 Month (Immediate)',
                  `session_date` VARCHAR(100) DEFAULT NULL,
                  `session_time` VARCHAR(50) DEFAULT NULL,
                  `session_summary` VARCHAR(255) DEFAULT NULL,
                  `vision` TEXT DEFAULT NULL,
                  `nda` VARCHAR(100) DEFAULT 'Standard Review',
                  `status` ENUM('new', 'in_review', 'contacted', 'archived') DEFAULT 'new',
                  `admin_notes` TEXT DEFAULT NULL,
                  `ip_address` VARCHAR(45) DEFAULT NULL,
                  `user_agent` VARCHAR(255) DEFAULT NULL,
                  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                  INDEX `idx_status` (`status`),
                  INDEX `idx_created_at` (`created_at`),
                  INDEX `idx_email` (`email`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            ");
        }

        // Auto-migration for site_routes table and route_slug in seo_meta
        $seoCols = $db->query("SHOW COLUMNS FROM `seo_meta`")->fetchAll(PDO::FETCH_COLUMN);
        if (!in_array('route_slug', $seoCols)) {
            $db->exec("ALTER TABLE `seo_meta` ADD COLUMN `route_slug` VARCHAR(150) NULL AFTER `page_key`");
        }

        $routesTableCheck = $db->query("SHOW TABLES LIKE 'site_routes'")->fetch();
        if (!$routesTableCheck) {
            $db->exec("
                CREATE TABLE IF NOT EXISTS `site_routes` (
                  `id` INT NOT NULL AUTO_INCREMENT,
                  `route_key` VARCHAR(100) NOT NULL UNIQUE,
                  `slug` VARCHAR(150) NOT NULL UNIQUE,
                  `target_type` VARCHAR(50) NOT NULL DEFAULT 'service',
                  `target_file` VARCHAR(150) NOT NULL,
                  `target_id` VARCHAR(100) DEFAULT NULL,
                  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
                  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                  PRIMARY KEY (`id`),
                  KEY `idx_slug` (`slug`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            ");
            $defaultRoutes = [
                ['service_logo_design', 'logo-design', 'service', 'service-logo-design.html', 'svc-logo'],
                ['service_brand_identity', 'brand-identity', 'service', 'service-brand-identity.html', 'svc-brand'],
                ['service_website_development', 'website-development', 'service', 'service-website-development.html', 'svc-web'],
                ['service_digital_marketing', 'digital-marketing', 'service', 'service-digital-marketing.html', 'svc-social'],
                ['service_content_creation', 'content-creation', 'service', 'service-content-creation.html', 'svc-content'],
                ['blogs', 'perspectives', 'page', 'blogs.html', 'page-blogs'],
                ['services', 'services', 'page', 'services.html', 'page-services'],
                ['portfolio', 'portfolio', 'page', 'portfolio.html', 'page-portfolio'],
                ['about', 'about', 'page', 'about.html', 'page-about'],
                ['contact', 'contact', 'page', 'contact.html', 'page-contact']
            ];
            $rStmt = $db->prepare("INSERT IGNORE INTO `site_routes` (`route_key`, `slug`, `target_type`, `target_file`, `target_id`, `is_active`) VALUES (?, ?, ?, ?, ?, 1)");
            foreach ($defaultRoutes as $dr) {
                $rStmt->execute($dr);
            }
        }

    } catch (Exception $e) {
        // Continue
    }
}

checkAndAutoSeed($db);

// Parse incoming JSON body
$rawInput = file_get_contents('php://input');
$inputData = json_decode($rawInput, true) ?? $_POST;

try {
    switch ($action) {

        // ═══════════════════════════════════════════════════════════
        // 0. HEALTH CHECK & DATABASE STATUS
        // ═══════════════════════════════════════════════════════════
        case 'check_status':
            $counts = [
                'blogs' => (int)$db->query("SELECT COUNT(*) as c FROM `blogs`")->fetch()['c'] ?? 0,
                'portfolio' => (int)$db->query("SELECT COUNT(*) as c FROM `portfolio`")->fetch()['c'] ?? 0,
                'clients' => (int)$db->query("SELECT COUNT(*) as c FROM `clients`")->fetch()['c'] ?? 0,
                'team' => (int)$db->query("SELECT COUNT(*) as c FROM `team_members`")->fetch()['c'] ?? 0,
                'services' => (int)$db->query("SELECT COUNT(*) as c FROM `services`")->fetch()['c'] ?? 0,
                'seo' => (int)$db->query("SELECT COUNT(*) as c FROM `seo_meta`")->fetch()['c'] ?? 0,
                'inquiries' => (int)($db->query("SELECT COUNT(*) as c FROM `contact_inquiries`")->fetch()['c'] ?? 0),
                'new_inquiries' => (int)($db->query("SELECT COUNT(*) as c FROM `contact_inquiries` WHERE `status` = 'new'")->fetch()['c'] ?? 0),
            ];

            echo json_encode([
                'status' => 'success',
                'connected' => true,
                'engine' => 'Core PHP / PDO MySQL',
                'database' => DB_NAME,
                'host' => DB_HOST,
                'counts' => $counts
            ]);
            break;


        // ═══════════════════════════════════════════════════════════
        // 1. GET COMPLETE CMS DATA (FOR ADMIN & FRONTEND)
        // ═══════════════════════════════════════════════════════════
        case 'get_all_data':
        case 'get_all':
            $response = [];

            // A. SEO Metadata & Dynamic Routes
            $routesStmt = $db->query("SELECT * FROM `site_routes` ORDER BY `id` ASC");
            $routeRows = $routesStmt ? $routesStmt->fetchAll() : [];
            $routesMap = [];
            foreach ($routeRows as $rt) {
                $routesMap[$rt['route_key']] = [
                    'id' => (int)$rt['id'],
                    'routeKey' => $rt['route_key'],
                    'slug' => $rt['slug'],
                    'targetType' => $rt['target_type'],
                    'targetFile' => $rt['target_file'],
                    'targetId' => $rt['target_id'],
                    'isActive' => (int)$rt['is_active']
                ];
            }
            $response['routes'] = $routesMap;

            $seoStmt = $db->query("SELECT * FROM `seo_meta`");
            $seoRows = $seoStmt->fetchAll();
            $seoMap = [];
            foreach ($seoRows as $row) {
                $seoMap[$row['page_key']] = [
                    'title' => $row['title'],
                    'description' => $row['description'],
                    'keywords' => $row['keywords'],
                    'ogImage' => $row['og_image'],
                    'routeSlug' => $row['route_slug'] ?? ($routesMap[$row['page_key']]['slug'] ?? '')
                ];
            }
            $response['seo'] = $seoMap;

            // B. Profile & Story
            $profileStmt = $db->query("SELECT * FROM `studio_profile` LIMIT 1");
            $profileRow = $profileStmt->fetch();
            $pillars = (!empty($profileRow['pillars_json'])) ? (json_decode($profileRow['pillars_json'], true) ?: []) : [];

            // Team Members
            $teamStmt = $db->query("SELECT * FROM `team_members` WHERE `active` = 1 ORDER BY `display_order` ASC");
            $teamRows = $teamStmt->fetchAll();
            $team = array_map(function($m) {
                return [
                    'id' => $m['member_key'],
                    'memberKey' => $m['member_key'],
                    'name' => $m['name'],
                    'role' => $m['role'],
                    'photo' => $m['photo'],
                    'order' => (int)$m['display_order']
                ];
            }, $teamRows);

            // Principles
            $principlesStmt = $db->query("SELECT * FROM `studio_principles` ORDER BY `display_order` ASC");
            $principlesRows = $principlesStmt->fetchAll();
            $principles = array_map(function($p) {
                return [
                    'id' => $p['principle_id'],
                    'num' => $p['num'],
                    'pill' => $p['pill'],
                    'title' => $p['title'],
                    'desc' => $p['description'],
                    'tags' => !empty($p['tags_json']) ? (json_decode($p['tags_json'], true) ?: []) : []
                ];
            }, $principlesRows);

            $response['profile'] = [
                'storyHeadline' => $profileRow['story_headline'] ?? 'WE TURN AMBITION INTO MOMENTUM.',
                'storyDescription' => $profileRow['story_description'] ?? '',
                'pillars' => $pillars,
                'principles' => $principles,
                'team' => $team
            ];

            // C. Services
            $svcStmt = $db->query("SELECT * FROM `services` WHERE `active` = 1 ORDER BY `display_order` ASC");
            $svcRows = $svcStmt->fetchAll();
            $response['services'] = array_map(function($s) {
                return [
                    'id' => $s['service_id'],
                    'num' => $s['num'],
                    'title' => $s['title'],
                    'tagline' => $s['tagline'],
                    'desc' => $s['description'],
                    'image' => (!empty($s['image_url']) && file_exists(__DIR__ . '/' . $s['image_url'])) ? $s['image_url'] : '',
                    'deliverables' => !empty($s['deliverables_json']) ? (json_decode($s['deliverables_json'], true) ?: []) : [],
                    'order' => (int)$s['display_order']
                ];
            }, $svcRows);

            // D. Clients
            $clientStmt = $db->query("SELECT * FROM `clients` WHERE `active` = 1 ORDER BY `display_order` ASC");
            $clientRows = $clientStmt->fetchAll();
            $response['clients'] = array_map(function($c) {
                return [
                    'id' => $c['client_id'],
                    'name' => $c['name'],
                    'subtitle' => $c['subtitle'],
                    'websiteUrl' => $c['website_url'],
                    'type' => $c['logo_type'],
                    'svgCode' => $c['svg_code'],
                    'imageUrl' => $c['image_url'],
                    'order' => (int)$c['display_order'],
                    'active' => (bool)$c['active']
                ];
            }, $clientRows);

            // E. Portfolio
            $portStmt = $db->query("SELECT * FROM `portfolio` WHERE `active` = 1 ORDER BY `display_order` ASC");
            $portRows = $portStmt->fetchAll();
            $response['portfolio'] = array_map(function($p) {
                return [
                    'id' => $p['project_id'],
                    'title' => $p['title'],
                    'client' => $p['client'],
                    'category' => $p['category_keys'],
                    'categoryDisplay' => $p['category_display'],
                    'tagPill' => $p['tag_pill'],
                    'gridSpan' => $p['grid_span'],
                    'year' => $p['year'],
                    'coverImage' => $p['cover_image'],
                    'summary' => $p['summary'],
                    'challenge' => $p['challenge'],
                    'approach' => $p['approach'],
                    'impact' => $p['impact'],
                    'metrics' => !empty($p['metrics_json']) ? (json_decode($p['metrics_json'], true) ?: []) : [],
                    'featured' => (bool)$p['featured'],
                    'order' => (int)$p['display_order']
                ];
            }, $portRows);

            // F. Complete 17 Live Blogs
            $blogsStmt = $db->query("SELECT * FROM `blogs` WHERE `published` = 1 ORDER BY `display_order` ASC");
            $blogsRows = $blogsStmt->fetchAll();
            $response['blogs'] = array_map(function($b) {
                return [
                    'id' => $b['blog_id'],
                    'slug' => $b['slug'],
                    'title' => $b['title'],
                    'category' => $b['category'],
                    'categorySlug' => $b['category_slug'],
                    'city' => $b['city'],
                    'author' => $b['author'],
                    'role' => $b['author_role'],
                    'initials' => $b['initials'],
                    'bio' => $b['author_bio'] ?? '',
                    'date' => $b['date_text'],
                    'readTime' => $b['read_time'],
                    'coverImage' => $b['cover_image'],
                    'specimenImage' => $b['specimen_image'] ?? '',
                    'specimenCaption' => $b['specimen_caption'] ?? '',
                    'excerpt' => $b['excerpt'],
                    'content' => $b['content_html'],
                    'sections' => !empty($b['sections_json']) ? (json_decode($b['sections_json'], true) ?: []) : [],
                    'related' => !empty($b['related_json']) ? (json_decode($b['related_json'], true) ?: []) : [],
                    'published' => (bool)$b['published'],
                    'order' => (int)$b['display_order']
                ];
            }, $blogsRows);

            // G. Settings
            $setStmt = $db->query("SELECT * FROM `studio_settings`");
            $setRows = $setStmt->fetchAll();
            $settings = [];
            foreach ($setRows as $s) {
                $settings[$s['setting_key']] = $s['setting_value'];
            }
            $response['settings'] = $settings;

            // H. Contact Brief Form Configuration
            if (isset($settings['contact_brief'])) {
                $cb = json_decode($settings['contact_brief'], true);
                if (is_array($cb)) {
                    $response['contactBrief'] = $cb;
                }
            }

            // I. Inquiries Summary Stats
            $response['inquiriesStats'] = [
                'total' => (int)($db->query("SELECT COUNT(*) as c FROM `contact_inquiries`")->fetch()['c'] ?? 0),
                'new' => (int)($db->query("SELECT COUNT(*) as c FROM `contact_inquiries` WHERE `status` = 'new'")->fetch()['c'] ?? 0),
            ];

            echo json_encode(['status' => 'success', 'data' => $response]);
            break;


        // ═══════════════════════════════════════════════════════════
        // 2. SEO UPDATE
        // ═══════════════════════════════════════════════════════════
        case 'save_seo':
            $pageKey = $inputData['page_key'] ?? 'home';
            $title = $inputData['title'] ?? '';
            $desc = $inputData['description'] ?? '';
            $keywords = $inputData['keywords'] ?? '';
            $ogImage = $inputData['og_image'] ?? 'assets/img/branding/1928-logo.png';
            $routeSlug = isset($inputData['route_slug']) ? trim((string)$inputData['route_slug']) : (isset($inputData['slug']) ? trim((string)$inputData['slug']) : null);

            $cleanSlug = null;
            if ($routeSlug !== null && $routeSlug !== '') {
                $cleanSlug = strtolower(preg_replace('/[^a-zA-Z0-9\/-]+/', '-', $routeSlug));
                $cleanSlug = trim($cleanSlug, '/-');
            }

            // Handle blog article specific SEO/Slug update
            if (str_starts_with($pageKey, 'blog_')) {
                $blogId = substr($pageKey, 5);
                if (!empty($cleanSlug)) {
                    $bStmt = $db->prepare("UPDATE `blogs` SET `slug` = :slug WHERE `blog_id` = :bid");
                    $bStmt->execute([':slug' => $cleanSlug, ':bid' => $blogId]);
                }
                echo json_encode([
                    'status' => 'success',
                    'page_key' => $pageKey,
                    'slug' => $cleanSlug,
                    'message' => "Perspective route updated to '/perspectives/{$cleanSlug}'."
                ]);
                break;
            }

            $stmt = $db->prepare("
                INSERT INTO `seo_meta` (`page_key`, `route_slug`, `title`, `description`, `keywords`, `og_image`)
                VALUES (:pk, :rslug, :title, :desc, :kw, :og)
                ON DUPLICATE KEY UPDATE
                    `title` = VALUES(`title`),
                    `description` = VALUES(`description`),
                    `keywords` = VALUES(`keywords`),
                    `og_image` = VALUES(`og_image`),
                    `route_slug` = COALESCE(VALUES(`route_slug`), `route_slug`)
            ");
            $stmt->execute([
                ':pk' => $pageKey,
                ':rslug' => $cleanSlug,
                ':title' => $title,
                ':desc' => $desc,
                ':kw' => $keywords,
                ':og' => $ogImage
            ]);

            // Sync with site_routes table if a slug was provided
            if (!empty($cleanSlug)) {
                $rStmt = $db->prepare("
                    INSERT INTO `site_routes` (`route_key`, `slug`, `target_type`, `target_file`, `is_active`)
                    VALUES (:rk, :slug, 'page', CONCAT(:tf, '.html'), 1)
                    ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`)
                ");
                $rStmt->execute([
                    ':rk' => $pageKey,
                    ':slug' => $cleanSlug,
                    ':tf' => str_replace('_', '-', $pageKey)
                ]);
            }

            echo json_encode([
                'status' => 'success', 
                'page_key' => $pageKey, 
                'slug' => $cleanSlug,
                'message' => "SEO settings and URL route for '{$pageKey}' saved and synchronized with PHP router."
            ]);
            break;

        case 'get_routes':
            $routesStmt = $db->query("SELECT * FROM `site_routes` ORDER BY `id` ASC");
            $routeRows = $routesStmt ? $routesStmt->fetchAll() : [];

            $blogsStmt = $db->query("SELECT `blog_id`, `slug`, `title` FROM `blogs` ORDER BY `display_order` ASC");
            $blogRows = $blogsStmt ? $blogsStmt->fetchAll() : [];

            echo json_encode([
                'status' => 'success',
                'routes' => $routeRows,
                'blogs' => $blogRows
            ]);
            break;

        case 'save_route':
            $routeKey = trim((string)($inputData['route_key'] ?? ''));
            $newSlug = trim((string)($inputData['slug'] ?? ''));
            $isBlog = !empty($inputData['is_blog']) || str_starts_with($routeKey, 'blog_') || !empty($inputData['blog_id']);
            $blogId = $inputData['blog_id'] ?? ($isBlog ? str_replace('blog_', '', $routeKey) : '');

            $cleanSlug = strtolower(preg_replace('/[^a-zA-Z0-9\/-]+/', '-', $newSlug));
            $cleanSlug = trim($cleanSlug, '/-');

            if (empty($cleanSlug)) {
                echo json_encode(['status' => 'error', 'message' => 'Route URL slug cannot be empty.']);
                break;
            }

            if ($isBlog && !empty($blogId)) {
                $check = $db->prepare("SELECT `id` FROM `blogs` WHERE `slug` = :slug AND `blog_id` != :bid LIMIT 1");
                $check->execute([':slug' => $cleanSlug, ':bid' => $blogId]);
                if ($check->fetch()) {
                    echo json_encode(['status' => 'error', 'message' => "The slug '{$cleanSlug}' is already assigned to another perspective."]);
                    break;
                }

                $stmt = $db->prepare("UPDATE `blogs` SET `slug` = :slug WHERE `blog_id` = :bid");
                $stmt->execute([':slug' => $cleanSlug, ':bid' => $blogId]);

                echo json_encode([
                    'status' => 'success',
                    'route_key' => $routeKey,
                    'slug' => $cleanSlug,
                    'message' => "Perspective URL route updated to '/perspectives/{$cleanSlug}'."
                ]);
                break;
            } else {
                $check = $db->prepare("SELECT `id` FROM `site_routes` WHERE `slug` = :slug AND `route_key` != :rk LIMIT 1");
                $check->execute([':slug' => $cleanSlug, ':rk' => $routeKey]);
                if ($check->fetch()) {
                    echo json_encode(['status' => 'error', 'message' => "The route slug '{$cleanSlug}' is already assigned to another page."]);
                    break;
                }

                $stmt = $db->prepare("UPDATE `site_routes` SET `slug` = :slug WHERE `route_key` = :rk");
                $stmt->execute([':slug' => $cleanSlug, ':rk' => $routeKey]);

                $stmtSeo = $db->prepare("UPDATE `seo_meta` SET `route_slug` = :slug WHERE `page_key` = :pk");
                $stmtSeo->execute([':slug' => $cleanSlug, ':pk' => $routeKey]);

                echo json_encode([
                    'status' => 'success',
                    'route_key' => $routeKey,
                    'slug' => $cleanSlug,
                    'message' => "Page URL route updated to '/{$cleanSlug}' and synchronized with PHP router."
                ]);
                break;
            }


        // ═══════════════════════════════════════════════════════════
        // 3. BLOGS CRUD
        // ═══════════════════════════════════════════════════════════
        case 'save_blog':
            $blogId = $inputData['id'] ?? ('art-' . substr(md5(uniqid()), 0, 8));
            $slug = $inputData['slug'] ?? strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $inputData['title'] ?? 'perspective')));
            $title = $inputData['title'] ?? 'Untitled Perspective';
            $category = $inputData['category'] ?? 'BRAND ARCHITECTURE';
            $categorySlug = $inputData['categorySlug'] ?? strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $category)));
            $city = $inputData['city'] ?? 'London, UK';
            $author = $inputData['author'] ?? 'Jay Thaker';
            $authorRole = $inputData['role'] ?? 'Studio Principal & Brand Architect';
            $initials = $inputData['initials'] ?? (empty($author) ? 'JT' : strtoupper(implode('', array_map(function($w){ return $w[0] ?? ''; }, explode(' ', trim($author))))));
            if (empty($initials)) $initials = '19';
            $authorBio = $inputData['bio'] ?? ($inputData['authorBio'] ?? '');
            $dateText = $inputData['date'] ?? date('M Y');
            $readTime = $inputData['readTime'] ?? '6 MIN READ';
            $coverImage = $inputData['coverImage'] ?? 'assets/img/portfolio/port-chronos.jpg';
            $specimenImage = $inputData['specimenImage'] ?? '';
            $specimenCaption = $inputData['specimenCaption'] ?? '';
            $excerpt = $inputData['excerpt'] ?? '';
            $contentHtml = $inputData['content'] ?? ($inputData['contentHtml'] ?? '');
            $sectionsJson = json_encode($inputData['sections'] ?? []);
            $relatedJson = json_encode($inputData['related'] ?? []);
            $published = isset($inputData['published']) ? (int)$inputData['published'] : 1;
            $order = isset($inputData['order']) ? (int)$inputData['order'] : 1;

            $stmt = $db->prepare("
                INSERT INTO `blogs` 
                (`blog_id`, `slug`, `title`, `category`, `category_slug`, `city`, `author`, `author_role`, `initials`, `author_bio`, `date_text`, `read_time`, `cover_image`, `specimen_image`, `specimen_caption`, `excerpt`, `content_html`, `sections_json`, `related_json`, `published`, `display_order`)
                VALUES 
                (:bid, :slug, :title, :cat, :catslug, :city, :author, :role, :init, :bio, :dt, :rt, :cover, :specimg, :speccap, :exc, :content, :secs, :rel, :pub, :ord)
                ON DUPLICATE KEY UPDATE
                    `title` = VALUES(`title`),
                    `category` = VALUES(`category`),
                    `category_slug` = VALUES(`category_slug`),
                    `city` = VALUES(`city`),
                    `author` = VALUES(`author`),
                    `author_role` = VALUES(`author_role`),
                    `initials` = VALUES(`initials`),
                    `author_bio` = VALUES(`author_bio`),
                    `date_text` = VALUES(`date_text`),
                    `read_time` = VALUES(`read_time`),
                    `cover_image` = VALUES(`cover_image`),
                    `specimen_image` = VALUES(`specimen_image`),
                    `specimen_caption` = VALUES(`specimen_caption`),
                    `excerpt` = VALUES(`excerpt`),
                    `content_html` = VALUES(`content_html`),
                    `sections_json` = VALUES(`sections_json`),
                    `related_json` = VALUES(`related_json`),
                    `published` = VALUES(`published`),
                    `display_order` = VALUES(`display_order`)
            ");
            $stmt->execute([
                ':bid' => $blogId,
                ':slug' => $slug,
                ':title' => $title,
                ':cat' => $category,
                ':catslug' => $categorySlug,
                ':city' => $city,
                ':author' => $author,
                ':role' => $authorRole,
                ':init' => $initials,
                ':bio' => $authorBio,
                ':dt' => $dateText,
                ':rt' => $readTime,
                ':cover' => $coverImage,
                ':specimg' => $specimenImage,
                ':speccap' => $specimenCaption,
                ':exc' => $excerpt,
                ':content' => $contentHtml,
                ':secs' => $sectionsJson,
                ':rel' => $relatedJson,
                ':pub' => $published,
                ':ord' => $order
            ]);

            echo json_encode(['status' => 'success', 'message' => 'Perspective saved to MySQL.', 'blog_id' => $blogId]);
            break;

        case 'delete_blog':
            $blogId = $inputData['id'] ?? '';
            $stmt = $db->prepare("DELETE FROM `blogs` WHERE `blog_id` = :bid");
            $stmt->execute([':bid' => $blogId]);
            echo json_encode(['status' => 'success', 'message' => 'Perspective deleted from MySQL.']);
            break;


        // ═══════════════════════════════════════════════════════════
        // 4. PORTFOLIO CRUD
        // ═══════════════════════════════════════════════════════════
        case 'save_portfolio':
            $projectId = $inputData['id'] ?? ('proj-' . substr(md5(uniqid()), 0, 8));
            $title = $inputData['title'] ?? 'New Project';
            $client = $inputData['client'] ?? '';
            $categoryKeys = $inputData['category'] ?? 'brand-identity';
            $categoryDisplay = $inputData['categoryDisplay'] ?? 'Brand Identity & WebGL';
            $tagPill = $inputData['tagPill'] ?? 'Case Study';
            $gridSpan = $inputData['gridSpan'] ?? 'bento-compact';
            $year = $inputData['year'] ?? date('Y');
            $coverImage = $inputData['coverImage'] ?? 'assets/img/portfolio/port-chronos.jpg';
            $summary = $inputData['summary'] ?? '';
            $challenge = $inputData['challenge'] ?? '';
            $approach = $inputData['approach'] ?? '';
            $impact = $inputData['impact'] ?? '';
            $metricsJson = json_encode($inputData['metrics'] ?? []);
            $featured = isset($inputData['featured']) ? (int)$inputData['featured'] : 1;
            $order = isset($inputData['order']) ? (int)$inputData['order'] : 1;

            $stmt = $db->prepare("
                INSERT INTO `portfolio`
                (`project_id`, `title`, `client`, `category_keys`, `category_display`, `tag_pill`, `grid_span`, `year`, `cover_image`, `summary`, `challenge`, `approach`, `impact`, `metrics_json`, `featured`, `display_order`, `active`)
                VALUES
                (:pid, :title, :client, :cat, :catdisp, :pill, :span, :yr, :cover, :sum, :chal, :appr, :imp, :metrics, :feat, :ord, 1)
                ON DUPLICATE KEY UPDATE
                    `title` = VALUES(`title`),
                    `client` = VALUES(`client`),
                    `category_keys` = VALUES(`category_keys`),
                    `category_display` = VALUES(`category_display`),
                    `tag_pill` = VALUES(`tag_pill`),
                    `grid_span` = VALUES(`grid_span`),
                    `year` = VALUES(`year`),
                    `cover_image` = VALUES(`cover_image`),
                    `summary` = VALUES(`summary`),
                    `challenge` = VALUES(`challenge`),
                    `approach` = VALUES(`approach`),
                    `impact` = VALUES(`impact`),
                    `metrics_json` = VALUES(`metrics_json`),
                    `featured` = VALUES(`featured`),
                    `display_order` = VALUES(`display_order`)
            ");
            $stmt->execute([
                ':pid' => $projectId,
                ':title' => $title,
                ':client' => $client,
                ':cat' => $categoryKeys,
                ':catdisp' => $categoryDisplay,
                ':pill' => $tagPill,
                ':span' => $gridSpan,
                ':yr' => $year,
                ':cover' => $coverImage,
                ':sum' => $summary,
                ':chal' => $challenge,
                ':appr' => $approach,
                ':imp' => $impact,
                ':metrics' => $metricsJson,
                ':feat' => $featured,
                ':ord' => $order
            ]);

            echo json_encode(['status' => 'success', 'message' => 'Portfolio saved to MySQL.', 'project_id' => $projectId]);
            break;

        case 'delete_portfolio':
            $projectId = $inputData['id'] ?? '';
            $stmt = $db->prepare("DELETE FROM `portfolio` WHERE `project_id` = :pid");
            $stmt->execute([':pid' => $projectId]);
            echo json_encode(['status' => 'success', 'message' => 'Project deleted from MySQL.']);
            break;


        // ═══════════════════════════════════════════════════════════
        // 5. CLIENT LOGOS CRUD
        // ═══════════════════════════════════════════════════════════
        case 'save_client':
            $clientId = $inputData['id'] ?? ('client-' . substr(md5(uniqid()), 0, 8));
            $name = $inputData['name'] ?? 'Partner Brand';
            $subtitle = $inputData['subtitle'] ?? '';
            $websiteUrl = $inputData['websiteUrl'] ?? '#';
            $logoType = $inputData['type'] ?? 'svg';
            $svgCode = $inputData['svgCode'] ?? '';
            $imageUrl = $inputData['imageUrl'] ?? '';
            $order = isset($inputData['order']) ? (int)$inputData['order'] : 1;
            $active = isset($inputData['active']) ? (int)$inputData['active'] : 1;

            $stmt = $db->prepare("
                INSERT INTO `clients`
                (`client_id`, `name`, `subtitle`, `website_url`, `logo_type`, `svg_code`, `image_url`, `display_order`, `active`)
                VALUES
                (:cid, :name, :sub, :url, :type, :svg, :img, :ord, :act)
                ON DUPLICATE KEY UPDATE
                    `name` = VALUES(`name`),
                    `subtitle` = VALUES(`subtitle`),
                    `website_url` = VALUES(`website_url`),
                    `logo_type` = VALUES(`logo_type`),
                    `svg_code` = VALUES(`svg_code`),
                    `image_url` = VALUES(`image_url`),
                    `display_order` = VALUES(`display_order`),
                    `active` = VALUES(`active`)
            ");
            $stmt->execute([
                ':cid' => $clientId,
                ':name' => $name,
                ':sub' => $subtitle,
                ':url' => $websiteUrl,
                ':type' => $logoType,
                ':svg' => $svgCode,
                ':img' => $imageUrl,
                ':ord' => $order,
                ':act' => $active
            ]);

            echo json_encode(['status' => 'success', 'message' => 'Client logo saved to MySQL.', 'client_id' => $clientId]);
            break;

        case 'delete_client':
            $clientId = $inputData['id'] ?? '';
            $stmt = $db->prepare("DELETE FROM `clients` WHERE `client_id` = :cid");
            $stmt->execute([':cid' => $clientId]);
            echo json_encode(['status' => 'success', 'message' => 'Client logo deleted from MySQL.']);
            break;


        // ═══════════════════════════════════════════════════════════
        // 6. TEAM MINDS CRUD
        // ═══════════════════════════════════════════════════════════
        case 'save_team':
            $memberKey = $inputData['id'] ?? $inputData['memberKey'] ?? ('team-' . substr(md5(uniqid()), 0, 8));
            $name = $inputData['name'] ?? '';
            $role = $inputData['role'] ?? '';
            $photo = $inputData['photo'] ?? 'assets/img/team/team-ami.jpg';
            $order = isset($inputData['order']) ? (int)$inputData['order'] : 1;

            $stmt = $db->prepare("
                INSERT INTO `team_members` (`member_key`, `name`, `role`, `photo`, `display_order`, `active`)
                VALUES (:mkey, :name, :role, :photo, :ord, 1)
                ON DUPLICATE KEY UPDATE
                    `name` = VALUES(`name`),
                    `role` = VALUES(`role`),
                    `photo` = VALUES(`photo`),
                    `display_order` = VALUES(`display_order`)
            ");
            $stmt->execute([
                ':mkey' => $memberKey,
                ':name' => $name,
                ':role' => $role,
                ':photo' => $photo,
                ':ord' => $order
            ]);

            echo json_encode(['status' => 'success', 'message' => 'Team member saved to MySQL.']);
            break;

        case 'delete_team':
            $memberKey = $inputData['id'] ?? '';
            $stmt = $db->prepare("DELETE FROM `team_members` WHERE `member_key` = :mkey");
            $stmt->execute([':mkey' => $memberKey]);
            echo json_encode(['status' => 'success', 'message' => 'Team member deleted from MySQL.']);
            break;

        // ═══════════════════════════════════════════════════════════
        // 6B. STUDIO PRINCIPLES CRUD
        // ═══════════════════════════════════════════════════════════
        case 'save_principle':
            $principleId = $inputData['id'] ?? $inputData['principleId'] ?? ('p' . time());
            $num = $inputData['num'] ?? '01';
            $pill = $inputData['pill'] ?? 'Think With Purpose';
            $title = $inputData['title'] ?? 'Strategic Thinking';
            $desc = $inputData['desc'] ?? ($inputData['description'] ?? '');
            $tags = is_array($inputData['tags'] ?? null) ? $inputData['tags'] : (explode(',', $inputData['tags'] ?? ''));
            $tagsClean = array_values(array_filter(array_map('trim', $tags)));
            $tagsJson = json_encode($tagsClean);
            $order = isset($inputData['order']) ? (int)$inputData['order'] : (int)preg_replace('/\D/', '', $num);
            if ($order <= 0) $order = 1;

            $stmt = $db->prepare("
                INSERT INTO `studio_principles` (`principle_id`, `num`, `pill`, `title`, `description`, `tags_json`, `display_order`)
                VALUES (:pid, :num, :pill, :title, :desc, :tags, :ord)
                ON DUPLICATE KEY UPDATE
                    `num` = VALUES(`num`),
                    `pill` = VALUES(`pill`),
                    `title` = VALUES(`title`),
                    `description` = VALUES(`description`),
                    `tags_json` = VALUES(`tags_json`),
                    `display_order` = VALUES(`display_order`)
            ");
            $stmt->execute([
                ':pid' => $principleId,
                ':num' => $num,
                ':pill' => $pill,
                ':title' => $title,
                ':desc' => $desc,
                ':tags' => $tagsJson,
                ':ord' => $order
            ]);

            echo json_encode(['status' => 'success', 'message' => 'Studio principle saved to MySQL.', 'principle_id' => $principleId]);
            break;

        case 'delete_principle':
            $principleId = $inputData['id'] ?? '';
            $stmt = $db->prepare("DELETE FROM `studio_principles` WHERE `principle_id` = :pid");
            $stmt->execute([':pid' => $principleId]);
            echo json_encode(['status' => 'success', 'message' => 'Studio principle deleted from MySQL.']);
            break;

        // ═══════════════════════════════════════════════════════════
        // 6C. STUDIO PROFILE & STORY
        // ═══════════════════════════════════════════════════════════
        case 'save_profile':
        case 'update_profile':
        case 'save_profile_story':
            $headline = $inputData['storyHeadline'] ?? ($inputData['story_headline'] ?? 'WE TURN AMBITION INTO MOMENTUM.');
            $desc = $inputData['storyDescription'] ?? ($inputData['story_description'] ?? '');
            $pillars = $inputData['pillars'] ?? ($inputData['pillars_json'] ?? []);
            $pillarsJson = is_array($pillars) ? json_encode($pillars) : (string)$pillars;

            $stmt = $db->prepare("
                INSERT INTO `studio_profile` (`id`, `story_headline`, `story_description`, `pillars_json`)
                VALUES (1, :hl, :desc, :pj)
                ON DUPLICATE KEY UPDATE
                    `story_headline` = VALUES(`story_headline`),
                    `story_description` = VALUES(`story_description`),
                    `pillars_json` = VALUES(`pillars_json`)
            ");
            $stmt->execute([
                ':hl'   => $headline,
                ':desc' => $desc,
                ':pj'   => $pillarsJson
            ]);
            echo json_encode(['status' => 'success', 'message' => 'Studio profile saved to MySQL.']);
            break;


        // ═══════════════════════════════════════════════════════════
        // 7. CORE SERVICES CRUD
        // ═══════════════════════════════════════════════════════════
        case 'save_service':
            $serviceId = $inputData['id'] ?? ('svc-' . substr(md5(uniqid()), 0, 8));
            $num = $inputData['num'] ?? '01';
            $title = $inputData['title'] ?? '';
            $tagline = $inputData['tagline'] ?? '';
            $desc = $inputData['desc'] ?? '';
            $image = $inputData['image'] ?? ($inputData['image_url'] ?? '');
            $deliv = is_array($inputData['deliverables'] ?? null) ? $inputData['deliverables'] : explode(',', $inputData['deliverables'] ?? '');
            $delivClean = array_values(array_filter(array_map('trim', $deliv)));
            $delivJson = json_encode($delivClean);
            $order = isset($inputData['order']) ? (int)$inputData['order'] : (int)preg_replace('/\D/', '', $num);
            if ($order <= 0) $order = 1;

            try {
                $db->exec("ALTER TABLE `services` ADD COLUMN `image_url` VARCHAR(255) DEFAULT NULL");
            } catch (Exception $e) {}

            $stmt = $db->prepare("
                INSERT INTO `services` (`service_id`, `num`, `title`, `tagline`, `description`, `deliverables_json`, `image_url`, `display_order`, `active`)
                VALUES (:sid, :num, :title, :tagline, :desc, :deliv, :img, :ord, 1)
                ON DUPLICATE KEY UPDATE
                    `num` = VALUES(`num`),
                    `title` = VALUES(`title`),
                    `tagline` = VALUES(`tagline`),
                    `description` = VALUES(`description`),
                    `deliverables_json` = VALUES(`deliverables_json`),
                    `image_url` = VALUES(`image_url`),
                    `display_order` = VALUES(`display_order`)
            ");
            $stmt->execute([
                ':sid' => $serviceId,
                ':num' => $num,
                ':title' => $title,
                ':tagline' => $tagline,
                ':desc' => $desc,
                ':deliv' => $delivJson,
                ':img' => $image,
                ':ord' => $order
            ]);

            echo json_encode(['status' => 'success', 'message' => 'Service capability saved to MySQL.', 'service_id' => $serviceId]);
            break;

        case 'delete_service':
            $serviceId = $inputData['id'] ?? '';
            $stmt = $db->prepare("DELETE FROM `services` WHERE `service_id` = :sid");
            $stmt->execute([':sid' => $serviceId]);
            echo json_encode(['status' => 'success', 'message' => 'Service capability deleted from MySQL.']);
            break;


        // ═══════════════════════════════════════════════════════════
        // 8. ASSET & MEDIA UPLOAD CONTROLLER (ASSETS/UPLOADS/)
        // ═══════════════════════════════════════════════════════════
        case 'upload_asset':
            $targetDir = __DIR__ . '/assets/uploads/';
            if (!is_dir($targetDir)) {
                mkdir($targetDir, 0777, true);
            }

            $safeDeleteOld = function($oldPath) {
                if (empty($oldPath) || !is_string($oldPath)) return false;
                if (strpos($oldPath, 'http://') === 0 || strpos($oldPath, 'https://') === 0 || strpos($oldPath, 'data:') === 0) return false;
                $cleanRel = ltrim(explode('?', explode('#', $oldPath)[0])[0], '/\\');
                $fullPath = realpath(__DIR__ . '/' . $cleanRel);
                $baseDir = realpath(__DIR__);
                if (!$fullPath || strpos($fullPath, $baseDir) !== 0) return false;
                $baseName = strtolower(basename($fullPath));
                if ($baseName === 'favicon.svg' || $baseName === 'logo.svg') return false;
                $relDir = strtolower(substr($fullPath, strlen($baseDir) + 1));
                if (strpos($relDir, 'img') !== 0 && strpos($relDir, 'assets') !== 0 && strpos($relDir, 'video') !== 0) return false;
                if (file_exists($fullPath) && is_file($fullPath)) {
                    @unlink($fullPath);
                    return true;
                }
                return false;
            };

            // Handle standard multipart form upload
            if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
                $file = $_FILES['file'];
                $origName = basename($file['name']);
                $ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
                
                $allowed = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif', 'avif', 'mp4', 'webm', 'mov', 'pdf'];
                if (!in_array($ext, $allowed)) {
                    http_response_code(400);
                    echo json_encode(['status' => 'error', 'message' => "Invalid file format '.$ext'. Allowed: " . implode(', ', $allowed)]);
                    exit;
                }

                // Sanitize base name
                $rawBase = pathinfo($origName, PATHINFO_FILENAME);
                $cleanBase = preg_replace('/[^a-zA-Z0-9_-]/', '-', $rawBase);
                $cleanBase = trim(preg_replace('/-+/', '-', $cleanBase), '-');
                if (empty($cleanBase)) $cleanBase = 'asset';

                $uniqueName = '1928_' . time() . '_' . $cleanBase . '.' . $ext;
                $destPath = $targetDir . $uniqueName;

                if (move_uploaded_file($file['tmp_name'], $destPath)) {
                    $relPath = 'assets/uploads/' . $uniqueName;
                    
                    // Automatically delete replaced previous image or video
                    $prevImg = $_POST['previousImage'] ?? ($_POST['previousVideo'] ?? ($_POST['oldFilePath'] ?? ($_POST['previous_image'] ?? null)));
                    $deletedPrev = $prevImg ? $safeDeleteOld($prevImg) : false;

                    echo json_encode([
                        'status' => 'success',
                        'message' => 'Asset successfully uploaded to assets directory.',
                        'filePath' => $relPath,
                        'url' => $relPath,
                        'fileName' => $uniqueName,
                        'fileSize' => $file['size'],
                        'extension' => $ext,
                        'deletedPrevious' => $deletedPrev ? $prevImg : null
                    ]);
                } else {
                    http_response_code(500);
                    echo json_encode(['status' => 'error', 'message' => 'Failed to save uploaded file to assets/uploads/']);
                }
                exit;
            }

            // Handle base64 upload if provided in JSON body
            if (!empty($inputData['base64'])) {
                $base64Data = $inputData['base64'];
                $fileName = $inputData['fileName'] ?? ('asset_' . time() . '.jpg');
                $ext = strtolower(pathinfo($fileName, PATHINFO_EXTENSION)) ?: 'jpg';
                
                if (preg_match('/^data:image\/(\w+);base64,/', $base64Data, $type)) {
                    $base64Data = substr($base64Data, strpos($base64Data, ',') + 1);
                    $ext = strtolower($type[1]);
                    if ($ext === 'jpeg') $ext = 'jpg';
                }
                $decoded = base64_decode($base64Data);
                if ($decoded === false) {
                    http_response_code(400);
                    echo json_encode(['status' => 'error', 'message' => 'Invalid base64 payload.']);
                    exit;
                }

                $cleanBase = preg_replace('/[^a-zA-Z0-9_-]/', '-', pathinfo($fileName, PATHINFO_FILENAME));
                $uniqueName = '1928_' . time() . '_' . ($cleanBase ?: 'upload') . '.' . $ext;
                $destPath = $targetDir . $uniqueName;

                if (file_put_contents($destPath, $decoded) !== false) {
                    $relPath = 'assets/uploads/' . $uniqueName;
                    $prevImg = $inputData['previousImage'] ?? ($inputData['previousVideo'] ?? ($inputData['oldFilePath'] ?? null));
                    $deletedPrev = $prevImg ? $safeDeleteOld($prevImg) : false;

                    echo json_encode([
                        'status' => 'success',
                        'message' => 'Base64 asset saved to assets directory.',
                        'filePath' => $relPath,
                        'url' => $relPath,
                        'fileName' => $uniqueName,
                        'deletedPrevious' => $deletedPrev ? $prevImg : null
                    ]);
                } else {
                    http_response_code(500);
                    echo json_encode(['status' => 'error', 'message' => 'Failed to write file to assets/uploads/']);
                }
                exit;
            }

            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'No file or base64 payload provided in request.']);
            break;

        case 'delete_asset':
            $targetPath = $inputData['filePath'] ?? ($inputData['path'] ?? ($_GET['filePath'] ?? ''));
            $deleted = false;
            if ($targetPath && is_string($targetPath)) {
                $cleanRel = ltrim(explode('?', explode('#', $targetPath)[0])[0], '/\\');
                $fullPath = realpath(__DIR__ . '/' . $cleanRel);
                $baseDir = realpath(__DIR__);
                if ($fullPath && strpos($fullPath, $baseDir) === 0) {
                    $baseName = strtolower(basename($fullPath));
                    if ($baseName !== 'favicon.svg' && $baseName !== 'logo.svg') {
                        $relDir = strtolower(substr($fullPath, strlen($baseDir) + 1));
                        if (strpos($relDir, 'img') === 0 || strpos($relDir, 'assets') === 0) {
                            if (file_exists($fullPath) && is_file($fullPath)) {
                                $deleted = @unlink($fullPath);
                            }
                        }
                    }
                }
            }
            echo json_encode(['status' => 'success', 'deleted' => $deleted, 'path' => $targetPath]);
            break;


        // ═══════════════════════════════════════════════════════════
        // 8. PERSPECTIVES SECTION CURATION & SETTINGS
        // ═══════════════════════════════════════════════════════════
        case 'save_perspectives_curation':
            $curationJson = is_string($inputData) ? $inputData : json_encode($inputData);
            $stmt = $db->prepare("
                INSERT INTO `studio_settings` (`setting_key`, `setting_value`)
                VALUES ('perspectives_curation', :val)
                ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`)
            ");
            $stmt->execute([':val' => $curationJson]);
            echo json_encode(['status' => 'success', 'message' => 'Perspectives section curation saved to MySQL.']);
            break;

        case 'save_settings':
            foreach ($inputData as $k => $v) {
                $valStr = is_array($v) ? json_encode($v) : (string)$v;
                $stmt = $db->prepare("
                    INSERT INTO `studio_settings` (`setting_key`, `setting_value`)
                    VALUES (:k, :v)
                    ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`)
                ");
                $stmt->execute([':k' => $k, ':v' => $valStr]);
            }
            echo json_encode(['status' => 'success', 'message' => 'Settings saved to MySQL.']);
            break;


        // ═══════════════════════════════════════════════════════════
        // 8.5 CONTACT INQUIRIES & LEADS MANAGEMENT
        // ═══════════════════════════════════════════════════════════
        case 'get_contact_inquiries':
            $statusFilter = $_GET['status'] ?? 'all';
            $search = trim($_GET['search'] ?? '');

            $whereClauses = [];
            $params = [];

            if ($statusFilter !== 'all' && in_array($statusFilter, ['new', 'in_review', 'contacted', 'archived'])) {
                $whereClauses[] = "`status` = :status";
                $params[':status'] = $statusFilter;
            }

            if (!empty($search)) {
                $whereClauses[] = "(`name` LIKE :search OR `email` LIKE :search OR `company` LIKE :search OR `service` LIKE :search OR `phone` LIKE :search)";
                $params[':search'] = '%' . $search . '%';
            }

            $whereSql = !empty($whereClauses) ? "WHERE " . implode(" AND ", $whereClauses) : "";
            $stmt = $db->prepare("SELECT * FROM `contact_inquiries` {$whereSql} ORDER BY `created_at` DESC");
            $stmt->execute($params);
            $inquiries = $stmt->fetchAll();

            // Status counts breakdown
            $counts = [
                'total'      => (int)($db->query("SELECT COUNT(*) as c FROM `contact_inquiries`")->fetch()['c'] ?? 0),
                'new'        => (int)($db->query("SELECT COUNT(*) as c FROM `contact_inquiries` WHERE `status` = 'new'")->fetch()['c'] ?? 0),
                'in_review'  => (int)($db->query("SELECT COUNT(*) as c FROM `contact_inquiries` WHERE `status` = 'in_review'")->fetch()['c'] ?? 0),
                'contacted'  => (int)($db->query("SELECT COUNT(*) as c FROM `contact_inquiries` WHERE `status` = 'contacted'")->fetch()['c'] ?? 0),
                'archived'   => (int)($db->query("SELECT COUNT(*) as c FROM `contact_inquiries` WHERE `status` = 'archived'")->fetch()['c'] ?? 0),
            ];

            echo json_encode([
                'status'    => 'success',
                'inquiries' => $inquiries,
                'counts'    => $counts
            ]);
            break;

        case 'get_inquiry_detail':
            $id = (int)($_GET['id'] ?? $inputData['id'] ?? 0);
            $stmt = $db->prepare("SELECT * FROM `contact_inquiries` WHERE `id` = :id LIMIT 1");
            $stmt->execute([':id' => $id]);
            $inquiry = $stmt->fetch();
            if (!$inquiry) {
                http_response_code(404);
                echo json_encode(['status' => 'error', 'message' => 'Inquiry not found']);
                exit;
            }
            echo json_encode(['status' => 'success', 'data' => $inquiry]);
            break;

        case 'update_inquiry_status':
            $id = (int)($inputData['id'] ?? $_GET['id'] ?? 0);
            $newStatus = trim($inputData['status'] ?? '');
            $notes = isset($inputData['admin_notes']) ? trim($inputData['admin_notes']) : null;

            if (!$id) {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'Missing inquiry ID']);
                exit;
            }

            if (!in_array($newStatus, ['new', 'in_review', 'contacted', 'archived'])) {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'Invalid status value']);
                exit;
            }

            if ($notes !== null) {
                $stmt = $db->prepare("UPDATE `contact_inquiries` SET `status` = :st, `admin_notes` = :notes WHERE `id` = :id");
                $stmt->execute([':st' => $newStatus, ':notes' => $notes, ':id' => $id]);
            } else {
                $stmt = $db->prepare("UPDATE `contact_inquiries` SET `status` = :st WHERE `id` = :id");
                $stmt->execute([':st' => $newStatus, ':id' => $id]);
            }

            echo json_encode(['status' => 'success', 'message' => 'Inquiry status updated successfully']);
            break;

        case 'save_inquiry_notes':
            $id = (int)($inputData['id'] ?? 0);
            $notes = trim($inputData['admin_notes'] ?? '');
            if (!$id) {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'Missing inquiry ID']);
                exit;
            }
            $stmt = $db->prepare("UPDATE `contact_inquiries` SET `admin_notes` = :notes WHERE `id` = :id");
            $stmt->execute([':notes' => $notes, ':id' => $id]);
            echo json_encode(['status' => 'success', 'message' => 'Admin notes saved successfully']);
            break;

        case 'delete_inquiry':
            $id = (int)($inputData['id'] ?? $_GET['id'] ?? 0);
            if (!$id) {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'Missing inquiry ID']);
                exit;
            }
            $stmt = $db->prepare("DELETE FROM `contact_inquiries` WHERE `id` = :id");
            $stmt->execute([':id' => $id]);
            echo json_encode(['status' => 'success', 'message' => 'Inquiry deleted successfully']);
            break;

        case 'export_inquiries_csv':
            $stmt = $db->query("SELECT * FROM `contact_inquiries` ORDER BY `created_at` DESC");
            $rows = $stmt->fetchAll();

            header('Content-Type: text/csv; charset=utf-8');
            header('Content-Disposition: attachment; filename="1928_studio_inquiries_' . date('Y-m-d_His') . '.csv"');
            header('Pragma: no-cache');
            header('Expires: 0');

            // UTF-8 BOM for Microsoft Excel compatibility
            echo "\xEF\xBB\xBF";

            $out = fopen('php://output', 'w');
            fputcsv($out, [
                'ID',
                'Status',
                'Date Received',
                'Client Name',
                'Corporate Email',
                'Enterprise / Brand',
                'Contact Phone',
                'Service / Mandate',
                'Capital Allocation / Budget',
                'Target Timeline',
                'Session Date',
                'Session Time',
                'Session Summary',
                'Confidential Project Vision',
                'NDA Protocol',
                'Admin Notes',
                'IP Address'
            ]);

            foreach ($rows as $r) {
                fputcsv($out, [
                    $r['id'],
                    strtoupper($r['status']),
                    $r['created_at'],
                    $r['name'],
                    $r['email'],
                    $r['company'],
                    $r['phone'],
                    $r['service'],
                    $r['budget'],
                    $r['timeline'],
                    $r['session_date'],
                    $r['session_time'],
                    $r['session_summary'],
                    $r['vision'],
                    $r['nda'],
                    $r['admin_notes'],
                    $r['ip_address']
                ]);
            }
            fclose($out);
            exit;

        case 'get_studio_settings':
            $stmt = $db->query("SELECT `setting_key`, `setting_value` FROM `studio_settings`");
            $rows = $stmt->fetchAll();
            $settings = [];
            foreach ($rows as $r) {
                $settings[$r['setting_key']] = $r['setting_value'];
            }
            echo json_encode(['status' => 'success', 'settings' => $settings]);
            break;

        case 'save_studio_contact_settings':
            $allowedKeys = [
                'studio_name', 'email', 'phone', 'location', 'established',
                'response_sla', 'instagram', 'facebook', 'linkedin', 'youtube',
                'behance', 'cta_primary_text', 'cta_secondary_text'
            ];
            foreach ($inputData as $key => $val) {
                if (in_array($key, $allowedKeys)) {
                    $stmt = $db->prepare("
                        INSERT INTO `studio_settings` (`setting_key`, `setting_value`)
                        VALUES (:k, :v)
                        ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`)
                    ");
                    $stmt->execute([':k' => $key, ':v' => (string)$val]);
                }
            }
            echo json_encode(['status' => 'success', 'message' => 'Studio contact channels updated successfully.']);
            break;


        // ═══════════════════════════════════════════════════════════
        // 9. DATABASE FACTORY RESET / SEED
        // ═══════════════════════════════════════════════════════════
        case 'reset_database':
            $sqlFile = __DIR__ . '/database.sql';
            if (file_exists($sqlFile)) {
                $sqlContent = file_get_contents($sqlFile);
                $db->exec($sqlContent);
                echo json_encode(['status' => 'success', 'message' => 'MySQL database restored to factory seeds.']);
            } else {
                http_response_code(500);
                echo json_encode(['status' => 'error', 'message' => 'database.sql not found on server.']);
            }
            break;

        default:
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => "Unknown action: '$action'"]);
            break;
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
