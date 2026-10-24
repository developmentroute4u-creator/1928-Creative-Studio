<?php

$phone = '919876543210'; // Country code + number, digits only
$message = 'Hello! This message was sent from my PHP website.';

$payload = json_encode([
    'phone' => $phone,
    'message' => $message
]);

$apiUrl = defined('WHATSAPP_API_URL') 
    ? WHATSAPP_API_URL 
    : 'https://1928creativestudioapi.vanshmistry.com/send-form-notifications';

$ch = curl_init($apiUrl);

curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json'
    ],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_TIMEOUT => 30
]);

$response = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if ($response === false) {
    echo 'API connection failed.';
} else {
    echo htmlspecialchars($response, ENT_QUOTES, 'UTF-8');
}

curl_close($ch);