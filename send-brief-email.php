<?php
/**
 * 1928 CREATIVE STUDIO — Project Brief Email Dispatcher Helper
 * 
 * Demonstrates how to load email-template.html, replace placeholders,
 * and send HTML emails via PHP mail() or modern SMTP/API (Resend, SendGrid, Postmark, etc.)
 */

function generateBriefEmailHtml(array $briefData): string {
    $templatePath = __DIR__ . '/email-template.html';
    if (!file_exists($templatePath)) {
        throw new Exception("Template file not found: email-template.html");
    }

    $html = file_get_contents($templatePath);

    // Extraction with clean fallbacks
    $fullName = trim($briefData['name'] ?? $briefData['first_name'] ?? 'Partner');
    $nameParts = explode(' ', $fullName);
    $firstName = htmlspecialchars($nameParts[0], ENT_QUOTES, 'UTF-8');

    $replacements = [
        '{{first_name}}'          => $firstName,
        '{{company_name}}'        => htmlspecialchars($briefData['company'] ?? $briefData['company_name'] ?? 'Independent Project', ENT_QUOTES, 'UTF-8'),
        '{{selected_service}}'     => htmlspecialchars($briefData['service'] ?? $briefData['selected_service'] ?? 'Creative Direction & Strategy', ENT_QUOTES, 'UTF-8'),
        '{{selected_budget}}'      => htmlspecialchars($briefData['budget'] ?? $briefData['selected_budget'] ?? 'Undisclosed Allocation', ENT_QUOTES, 'UTF-8'),
        '{{engagement_timeline}}'  => htmlspecialchars($briefData['timeline'] ?? $briefData['engagement_timeline'] ?? 'Q1 / Flexible', ENT_QUOTES, 'UTF-8'),
        '{{selected_date}}'        => htmlspecialchars($briefData['date'] ?? $briefData['selected_date'] ?? date('l, M j, Y'), ENT_QUOTES, 'UTF-8'),
        '{{selected_time}}'        => htmlspecialchars($briefData['time'] ?? $briefData['selected_time'] ?? '11:00 AM', ENT_QUOTES, 'UTF-8'),
        '{{logo_url}}'             => htmlspecialchars($briefData['logo_url'] ?? 'img/1928-logo-white-email.png', ENT_QUOTES, 'UTF-8'),
    ];

    return str_replace(array_keys($replacements), array_values($replacements), $html);
}

/**
 * Standard PHP mail() dispatch with proper MIME HTML headers
 */
function sendBriefConfirmationMail(string $toEmail, array $briefData, string $fromEmail = 'briefs@1928.studio'): bool {
    $subject = "Brief Received — 1928 Creative Studio";
    $messageHtml = generateBriefEmailHtml($briefData);

    $headers   = [];
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-type: text/html; charset=UTF-8';
    $headers[] = 'From: 1928 Creative Studio <' . $fromEmail . '>';
    $headers[] = 'Reply-To: 1928 Creative Studio <' . $fromEmail . '>';
    $headers[] = 'X-Mailer: PHP/' . phpversion();

    return mail($toEmail, $subject, $messageHtml, implode("\r\n", $headers));
}
