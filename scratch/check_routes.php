<?php
require_once __DIR__ . '/../db.php';
$db = getDB();
$rows = $db->query("SELECT * FROM seo_meta")->fetchAll(PDO::FETCH_ASSOC);
echo "=== SEO_META ROWS ===\n";
foreach ($rows as $r) {
    echo "ID: {$r['id']} | page_key: {$r['page_key']} | title: {$r['title']}\n";
}

$services = $db->query("SELECT id, service_id, num, title FROM services")->fetchAll(PDO::FETCH_ASSOC);
echo "\n=== SERVICES ROWS ===\n";
foreach ($services as $s) {
    echo "ID: {$s['id']} | service_id: {$s['service_id']} | num: {$s['num']} | title: {$s['title']}\n";
}

$blogs = $db->query("SELECT id, blog_id, slug, title FROM blogs LIMIT 5")->fetchAll(PDO::FETCH_ASSOC);
echo "\n=== BLOGS (FIRST 5) ===\n";
foreach ($blogs as $b) {
    echo "ID: {$b['id']} | blog_id: {$b['blog_id']} | slug: {$b['slug']} | title: {$b['title']}\n";
}
