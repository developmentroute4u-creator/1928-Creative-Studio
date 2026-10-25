<?php
require_once __DIR__ . '/../db.php';
$db = getDB();

$tables = [
    'seo_meta',
    'studio_profile',
    'studio_principles',
    'team_members',
    'services',
    'clients',
    'portfolio',
    'blogs',
    'contact_inquiries',
    'studio_settings'
];

$sqlDump = "-- 1928 CREATIVE STUDIO — Pure Database-Driven Master Schema & Initial Data\n";
$sqlDump .= "-- Database: `1928_studio_cms`\n";
$sqlDump .= "-- Generated: " . date('Y-m-d H:i:s') . "\n\n";
$sqlDump .= "SET FOREIGN_KEY_CHECKS = 0;\n\n";

foreach ($tables as $table) {
    $create = $db->query("SHOW CREATE TABLE `$table`")->fetch(PDO::FETCH_ASSOC);
    $createSql = $create['Create Table'] ?? '';
    
    $sqlDump .= "-- --------------------------------------------------------\n";
    $sqlDump .= "-- Table structure for `$table`\n";
    $sqlDump .= "-- --------------------------------------------------------\n";
    $sqlDump .= "DROP TABLE IF EXISTS `$table`;\n";
    $sqlDump .= $createSql . ";\n\n";

    $rows = $db->query("SELECT * FROM `$table`")->fetchAll(PDO::FETCH_ASSOC);
    if (!empty($rows)) {
        $sqlDump .= "-- Dumping data for `$table`\n";
        $cols = array_keys($rows[0]);
        $colList = '`' . implode('`, `', $cols) . '`';
        
        $valueRows = [];
        foreach ($rows as $row) {
            $vals = [];
            foreach ($row as $val) {
                if ($val === null) {
                    $vals[] = "NULL";
                } elseif (is_numeric($val) && !is_string($val)) {
                    $vals[] = $val;
                } else {
                    $vals[] = $db->quote($val);
                }
            }
            $valueRows[] = "(" . implode(", ", $vals) . ")";
        }

        $sqlDump .= "INSERT INTO `$table` ($colList) VALUES\n" . implode(",\n", $valueRows) . ";\n\n";
    }
}

$sqlDump .= "SET FOREIGN_KEY_CHECKS = 1;\n";

file_put_contents(__DIR__ . '/../database.sql', $sqlDump);
echo "✓ database.sql updated.\n";
