<?php
require_once __DIR__ . '/../db.php';

// Simulate POST request to api.php?action=save_seo
$postData = json_encode([
    'page_key' => 'about',
    'title' => 'About · 1928 Creative Studio',
    'description' => 'Test description',
    'keywords' => 'test, keywords',
    'og_image' => 'assets/img/branding/1928-logo.png',
    'route_slug' => 'test'
]);

$ch = curl_init('http://1928.test/api.php?action=save_seo');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: $httpCode\n";
echo "Response: $response\n";

// Now check get_all
$ch2 = curl_init('http://1928.test/api.php?action=get_all');
curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
$res2 = curl_exec($ch2);
curl_close($ch2);
$json = json_decode($res2, true);
echo "\n--- api.php?action=get_all for 'about' ---\n";
echo "routes['about']: " . json_encode($json['data']['routes']['about'] ?? null) . "\n";
echo "seo['about']: " . json_encode($json['data']['seo']['about'] ?? null) . "\n";
