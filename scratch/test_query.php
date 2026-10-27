<?php
require_once __DIR__ . '/../db.php';
$db = getDB();

try {
    $cleanSlug = 'test';
    $pageKey = 'about';
    
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
    echo "Query succeeded!\n";
    $row = $db->query("SELECT * FROM `site_routes` WHERE `route_key` = 'about'")->fetch(PDO::FETCH_ASSOC);
    print_r($row);
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
