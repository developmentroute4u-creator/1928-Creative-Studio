<?php
/**
 * 1928 CREATIVE STUDIO — Master Core PHP CMS API Controller
 * Handles all CRUD operations, MySQL queries, auto-seeding, and real-time synchronization
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
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

            // A. SEO Metadata
            $seoStmt = $db->query("SELECT * FROM `seo_meta`");
            $seoRows = $seoStmt->fetchAll();
            $seoMap = [];
            foreach ($seoRows as $row) {
                $seoMap[$row['page_key']] = [
                    'title' => $row['title'],
                    'description' => $row['description'],
                    'keywords' => $row['keywords'],
                    'ogImage' => $row['og_image']
                ];
            }
            $response['seo'] = $seoMap;

            // B. Profile & Story
            $profileStmt = $db->query("SELECT * FROM `studio_profile` LIMIT 1");
            $profileRow = $profileStmt->fetch();
            $pillars = $profileRow ? json_decode($profileRow['pillars_json'], true) : [];

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
                    'tags' => json_decode($p['tags_json'], true) ?: []
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
                    'deliverables' => json_decode($s['deliverables_json'], true) ?: [],
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
                    'metrics' => json_decode($p['metrics_json'], true) ?: [],
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
            $ogImage = $inputData['og_image'] ?? 'img/hero-luxury.jpg';

            $stmt = $db->prepare("
                INSERT INTO `seo_meta` (`page_key`, `title`, `description`, `keywords`, `og_image`)
                VALUES (:pk, :title, :desc, :kw, :og)
                ON DUPLICATE KEY UPDATE
                    `title` = VALUES(`title`),
                    `description` = VALUES(`description`),
                    `keywords` = VALUES(`keywords`),
                    `og_image` = VALUES(`og_image`)
            ");
            $stmt->execute([
                ':pk' => $pageKey,
                ':title' => $title,
                ':desc' => $desc,
                ':kw' => $keywords,
                ':og' => $ogImage
            ]);

            echo json_encode(['status' => 'success', 'message' => "SEO for '$pageKey' updated in MySQL."]);
            break;


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
            $coverImage = $inputData['coverImage'] ?? 'img/port-chronos.jpg';
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
            $coverImage = $inputData['coverImage'] ?? 'img/port-chronos.jpg';
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
            $photo = $inputData['photo'] ?? 'img/team-ami.jpg';
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
        // 7. CORE SERVICES CRUD
        // ═══════════════════════════════════════════════════════════
        case 'save_service':
            $serviceId = $inputData['id'] ?? ('svc-' . substr(md5(uniqid()), 0, 8));
            $num = $inputData['num'] ?? '01';
            $title = $inputData['title'] ?? '';
            $tagline = $inputData['tagline'] ?? '';
            $desc = $inputData['desc'] ?? '';
            $delivJson = json_encode($inputData['deliverables'] ?? []);
            $order = isset($inputData['order']) ? (int)$inputData['order'] : 1;

            $stmt = $db->prepare("
                INSERT INTO `services` (`service_id`, `num`, `title`, `tagline`, `description`, `deliverables_json`, `display_order`, `active`)
                VALUES (:sid, :num, :title, :tagline, :desc, :deliv, :ord, 1)
                ON DUPLICATE KEY UPDATE
                    `num` = VALUES(`num`),
                    `title` = VALUES(`title`),
                    `tagline` = VALUES(`tagline`),
                    `description` = VALUES(`description`),
                    `deliverables_json` = VALUES(`deliverables_json`),
                    `display_order` = VALUES(`display_order`)
            ");
            $stmt->execute([
                ':sid' => $serviceId,
                ':num' => $num,
                ':title' => $title,
                ':tagline' => $tagline,
                ':desc' => $desc,
                ':deliv' => $delivJson,
                ':ord' => $order
            ]);

            echo json_encode(['status' => 'success', 'message' => 'Service capability saved to MySQL.']);
            break;


        // ═══════════════════════════════════════════════════════════
        // 8. ASSET & MEDIA UPLOAD CONTROLLER (ASSETS/UPLOADS/)
        // ═══════════════════════════════════════════════════════════
        case 'upload_asset':
            $targetDir = __DIR__ . '/assets/uploads/';
            if (!is_dir($targetDir)) {
                mkdir($targetDir, 0777, true);
            }

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
                    echo json_encode([
                        'status' => 'success',
                        'message' => 'Asset successfully uploaded to assets directory.',
                        'filePath' => $relPath,
                        'url' => $relPath,
                        'fileName' => $uniqueName,
                        'fileSize' => $file['size'],
                        'extension' => $ext
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
                    echo json_encode([
                        'status' => 'success',
                        'message' => 'Base64 asset saved to assets directory.',
                        'filePath' => $relPath,
                        'url' => $relPath,
                        'fileName' => $uniqueName
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
            $relPath = $inputData['filePath'] ?? '';
            if ($relPath && strpos($relPath, 'assets/uploads/') === 0) {
                $fullPath = __DIR__ . '/' . $relPath;
                if (file_exists($fullPath) && is_file($fullPath)) {
                    unlink($fullPath);
                    echo json_encode(['status' => 'success', 'message' => 'Asset removed from assets folder.']);
                    exit;
                }
            }
            echo json_encode(['status' => 'success', 'message' => 'Asset reference cleared.']);
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
