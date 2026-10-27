<?php
require_once __DIR__ . '/../db.php';
$db = getDB();
echo "Connected DB: " . DB_NAME . " on " . DB_HOST . "\n";

echo "\n--- seo_meta columns ---\n";
$cols = $db->query("SHOW COLUMNS FROM `seo_meta`")->fetchAll(PDO::FETCH_COLUMN);
print_r($cols);

echo "\n--- seo_meta about row ---\n";
$row = $db->query("SELECT * FROM `seo_meta` WHERE `page_key` = 'about'")->fetch(PDO::FETCH_ASSOC);
print_r($row);

echo "\n--- site_routes about row ---\n";
$rt = $db->query("SELECT * FROM `site_routes` WHERE `route_key` = 'about'")->fetch(PDO::FETCH_ASSOC);
print_r($rt);

echo "\n--- all site_routes ---\n";
$allRt = $db->query("SELECT * FROM `site_routes`")->fetchAll(PDO::FETCH_ASSOC);
print_r($allRt);
