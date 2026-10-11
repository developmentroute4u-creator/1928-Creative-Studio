<?php
/**
 * 1928 CREATIVE STUDIO — Project Brief & Contact Form Acknowledgment Dispatcher
 * 
 * Handles incoming contact form submissions from contact.html,
 * connects via SMTP using PHPMailer, and sends a luxury HTML acknowledgment
 * email to the submitter confirming receipt and promising a response within 72 hours.
 */

// ── JSON Response & CORS Headers ──
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');

$requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// Handle preflight OPTIONS request
if ($requestMethod === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only permit POST requests
if ($requestMethod !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Method Not Allowed. Please submit form via POST.'
    ]);
    exit;
}

// ══════════════════════════════════════════════════════════════════════════════
// 1. SMTP & SENDER CONFIGURATION
// ══════════════════════════════════════════════════════════════════════════════

// Optional external config loader (e.g. smtp-config.php)
if (file_exists(__DIR__ . '/smtp-config.php')) {
    require_once __DIR__ . '/smtp-config.php';
}

/**
 * Configure your SMTP mail credentials below.
 * You can also set these using environment variables or a separate smtp-config.php file.
 * 
 * Popular Providers:
 * - Gmail:          Host = 'smtp.gmail.com', Port = 587, Secure = 'tls' (Use a 16-char App Password)
 * - Brevo / Sendinblue: Host = 'smtp-relay.brevo.com', Port = 587, Secure = 'tls'
 * - Hostinger:      Host = 'smtp.hostinger.com', Port = 465, Secure = 'ssl'
 * - SendGrid:       Host = 'smtp.sendgrid.net', Port = 587, Secure = 'tls', User = 'apikey'
 * - Local Laragon / Mailpit: Host = 'localhost', Port = 1025, Auth = false
 */
if (!defined('SMTP_HOST')) {
    define('SMTP_HOST', getenv('SMTP_HOST') ?: 'smtp.gmail.com');
}
if (!defined('SMTP_PORT')) {
    define('SMTP_PORT', (int)(getenv('SMTP_PORT') ?: 587));
}
if (!defined('SMTP_AUTH')) {
    define('SMTP_AUTH', filter_var(getenv('SMTP_AUTH') !== false ? getenv('SMTP_AUTH') : true, FILTER_VALIDATE_BOOLEAN));
}
if (!defined('SMTP_USER')) {
    define('SMTP_USER', getenv('SMTP_USER') ?: 'your-email@gmail.com'); // Enter your SMTP username / email
}
if (!defined('SMTP_PASS')) {
    define('SMTP_PASS', getenv('SMTP_PASS') ?: 'your-app-password');   // Enter your SMTP password / app password
}
if (!defined('SMTP_SECURE')) {
    define('SMTP_SECURE', getenv('SMTP_SECURE') ?: 'tls');             // 'tls', 'ssl', or ''
}
if (!defined('SMTP_FROM_EMAIL')) {
    define('SMTP_FROM_EMAIL', getenv('SMTP_FROM_EMAIL') ?: 'no-reply@1928creativestudio.com');
}
if (!defined('SMTP_FROM_NAME')) {
    define('SMTP_FROM_NAME', getenv('SMTP_FROM_NAME') ?: '1928 Creative Studio');
}
if (!defined('SMTP_REPLY_TO')) {
    define('SMTP_REPLY_TO', getenv('SMTP_REPLY_TO') ?: 'hello@1928.studio');
}
if (!defined('ADMIN_NOTIFICATION_EMAIL')) {
    define('ADMIN_NOTIFICATION_EMAIL', getenv('ADMIN_NOTIFICATION_EMAIL') ?: ''); // Set to your studio email to get a copy
}

// ══════════════════════════════════════════════════════════════════════════════
// 2. PARSE & VALIDATE INCOMING FORM SUBMISSION
// ══════════════════════════════════════════════════════════════════════════════

// Accept JSON body or FormData / $_POST
$rawPayload = file_get_contents('php://input');
$requestData = json_decode($rawPayload, true);

if (!is_array($requestData) || empty($requestData)) {
    $requestData = $_POST;
}

// Extract fields with clean sanitization
$name     = trim($requestData['name'] ?? $requestData['fullName'] ?? '');
$email    = trim($requestData['email'] ?? $requestData['corporateEmail'] ?? '');
$company  = trim($requestData['company'] ?? $requestData['org'] ?? $requestData['enterprise'] ?? 'Independent Project');
$phone    = trim($requestData['phone'] ?? $requestData['contactNumber'] ?? 'Not Specified');
$service  = trim($requestData['service'] ?? $requestData['scope'] ?? 'Creative Direction & Strategy');
$budget   = trim($requestData['budget'] ?? $requestData['allocation'] ?? 'Undisclosed Allocation');
$timeline = trim($requestData['timeline'] ?? '< 1 Month (Immediate)');
$date     = trim($requestData['date'] ?? date('l, M j, Y'));
$time     = trim($requestData['time'] ?? '11:00 AM IST');
$session  = trim($requestData['session'] ?? "$date · $time");
$vision   = trim($requestData['vision'] ?? $requestData['projectVision'] ?? '');
$nda      = trim($requestData['nda'] ?? 'Standard Review');

// Validation: Require Name
if (empty($name)) {
    http_response_code(422);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Please provide your full name.'
    ]);
    exit;
}

// Validation: Require Valid Corporate Email
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Please provide a valid corporate email address.'
    ]);
    exit;
}

// ══════════════════════════════════════════════════════════════════════════════
// 3. LOAD PHPMAILER
// ══════════════════════════════════════════════════════════════════════════════

$autoloadFile = __DIR__ . '/vendor/autoload.php';
if (!file_exists($autoloadFile)) {
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => 'PHPMailer dependency is missing. Please run composer install on the server.'
    ]);
    exit;
}

require_once $autoloadFile;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// ══════════════════════════════════════════════════════════════════════════════
// 4. GENERATE LUXURY HTML EMAIL CONTENT
// ══════════════════════════════════════════════════════════════════════════════

function buildAcknowledgmentHtml(array $d): string
{
    $nameParts = explode(' ', trim($d['name']));
    $firstName = htmlspecialchars($nameParts[0], ENT_QUOTES, 'UTF-8');
    $fullName  = htmlspecialchars($d['name'], ENT_QUOTES, 'UTF-8');
    $company   = htmlspecialchars($d['company'], ENT_QUOTES, 'UTF-8');
    $service   = htmlspecialchars($d['service'], ENT_QUOTES, 'UTF-8');
    $budget    = htmlspecialchars($d['budget'], ENT_QUOTES, 'UTF-8');
    $timeline  = htmlspecialchars($d['timeline'], ENT_QUOTES, 'UTF-8');
    $date      = htmlspecialchars($d['date'], ENT_QUOTES, 'UTF-8');
    $time      = htmlspecialchars($d['time'], ENT_QUOTES, 'UTF-8');
    $phone     = htmlspecialchars($d['phone'], ENT_QUOTES, 'UTF-8');
    $nda       = htmlspecialchars($d['nda'], ENT_QUOTES, 'UTF-8');
    $vision    = htmlspecialchars($d['vision'], ENT_QUOTES, 'UTF-8');

    $templatePath = __DIR__ . '/email-template.html';

    if (file_exists($templatePath)) {
        $html = file_get_contents($templatePath);

        // Replace template placeholders
        $replacements = [
            '{{first_name}}'         => $firstName,
            '{{full_name}}'          => $fullName,
            '{{company_name}}'       => $company,
            '{{selected_service}}'    => $service,
            '{{selected_budget}}'     => $budget,
            '{{engagement_timeline}}' => $timeline,
            '{{selected_date}}'       => $date,
            '{{selected_time}}'       => $time,
            '{{contact_phone}}'       => $phone,
            '{{nda_status}}'          => $nda,
            '{{logo_url}}'            => 'https://1928creativestudio.com/img/1928-logo-white-email.png',
        ];

        return str_replace(array_keys($replacements), array_values($replacements), $html);
    }

    // High-fidelity standalone fallback HTML template if email-template.html is not present
    return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Brief Received — 1928 Creative Studio</title>
  <style>
    body { margin: 0; padding: 0; background-color: #0A0A0D; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111116; }
    .wrap { max-width: 600px; margin: 30px auto; background: #FAF8F5; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.12); }
    .header { background: #0C0C10; padding: 36px 32px 26px; border-bottom: 2px solid #C8102E; color: #fff; }
    .header h2 { margin: 0 0 6px; font-size: 20px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #FFF; }
    .tagline { margin: 0; font-size: 11px; color: #9A9AB0; letter-spacing: 0.12em; text-transform: uppercase; }
    .body { padding: 36px 32px; background: #FAF8F5; }
    .title { font-size: 24px; font-weight: 800; color: #0C0C10; margin: 0 0 16px; }
    .p { font-size: 14.5px; line-height: 24px; color: #3A3A46; margin: 0 0 16px; }
    .callout { background: #FFFFFF; border: 1px solid #E5E1D8; border-radius: 8px; padding: 20px; margin: 24px 0 28px; }
    .callout-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #F0ECE4; font-size: 13.5px; }
    .callout-row:last-child { border-bottom: none; }
    .c-label { color: #7A7670; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.08em; }
    .c-val { color: #0C0C10; font-weight: 700; text-align: right; }
    .guarantee-box { background: #0C0C10; color: #FAF8F5; border-radius: 6px; padding: 18px 20px; margin: 24px 0; border-left: 4px solid #C8102E; }
    .guarantee-box h4 { margin: 0 0 4px; color: #C8102E; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; }
    .guarantee-box p { margin: 0; font-size: 13.5px; line-height: 21px; color: #ECEAE4; }
    .footer { background: #0C0C10; padding: 24px 32px; color: #7A7670; font-size: 11.5px; text-align: center; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h2>1928 CREATIVE STUDIO</h2>
      <p class="tagline">Designing with intent. Building with purpose.</p>
    </div>
    <div class="body">
      <h1 class="title">Brief Received.</h1>
      <p class="p">Hi <strong>{$firstName}</strong>,</p>
      <p class="p">Thank you for submitting your project brief to 1928 Creative Studio. We have successfully received your particulars and requirements.</p>
      
      <div class="guarantee-box">
        <h4>Acknowledgment &amp; Response Horizon</h4>
        <p>Our creative directors and strategy team are currently reviewing your project mandate. <strong>We will get back to you within 72 hours.</strong></p>
      </div>

      <div class="callout">
        <div class="callout-row"><span class="c-label">Brand / Client</span><span class="c-val">{$company} ({$fullName})</span></div>
        <div class="callout-row"><span class="c-label">Mandate</span><span class="c-val" style="color:#C8102E;">{$service}</span></div>
        <div class="callout-row"><span class="c-label">Allocation</span><span class="c-val">{$budget}</span></div>
        <div class="callout-row"><span class="c-label">Timeline</span><span class="c-val">{$timeline}</span></div>
        <div class="callout-row"><span class="c-label">Session Slot</span><span class="c-val">{$date} &middot; {$time}</span></div>
        <div class="callout-row"><span class="c-label">Contact Line</span><span class="c-val">{$phone}</span></div>
        <div class="callout-row"><span class="c-label">Confidentiality</span><span class="c-val">{$nda}</span></div>
      </div>

      <p class="p">If you have additional references, pitch decks, or assets to attach, simply reply directly to this email.</p>
      <p class="p" style="margin-top:24px;">Warm regards,<br /><strong>Team 1928</strong><br /><span style="font-size:12px; color:#7A7670;">1928 Creative Studio</span></p>
    </div>
    <div class="footer">
      &copy; 1928 Creative Studio &middot; All Rights Reserved
    </div>
  </div>
</body>
</html>
HTML;
}

function buildAcknowledgmentPlainText(array $d): string
{
    $nameParts = explode(' ', trim($d['name']));
    $firstName = $nameParts[0];

    return <<<TEXT
1928 CREATIVE STUDIO — BRIEF RECEIVED
Designing with intent. Building with purpose.
------------------------------------------------------------

Hi {$firstName},

Thank you for submitting your project brief to 1928 Creative Studio.
We have received your form submission.

Our creative leads and strategy team are currently reviewing your details,
and we will get back to you within 72 hours.

YOUR PROJECT AT A GLANCE:
- Brand / Client: {$d['company']} ({$d['name']})
- Selected Mandate: {$d['service']}
- Capital Allocation: {$d['budget']}
- Engagement Timeline: {$d['timeline']}
- Requested Consultation: {$d['date']} · {$d['time']}
- Contact Number: {$d['phone']}
- Bilateral NDA Protocol: {$d['nda']}

PROJECT VISION:
{$d['vision']}

WHAT HAPPENS NEXT:
01. We Review (Response within 72 hours) — Detailed analysis of your requirements.
02. We Connect — Clarifying vision, deliverables, and strategic scope.
03. Direction & Strategy — Aligning on creative execution and timeline.

Have additional references or files to share? Simply reply to this email.

Warm regards,
Team 1928
1928 Creative Studio
https://1928.studio
TEXT;
}

// ══════════════════════════════════════════════════════════════════════════════
// 5. DISPATCH EMAIL VIA PHPMailer SMTP
// ══════════════════════════════════════════════════════════════════════════════

$mail = new PHPMailer(true);

try {
    // Enable SMTP debugging in server logs if desired:
    // $mail->SMTPDebug = SMTP::DEBUG_SERVER;

    $mail->isSMTP();
    $mail->Host       = SMTP_HOST;
    $mail->SMTPAuth   = SMTP_AUTH;
    $mail->Username   = SMTP_USER;
    $mail->Password   = SMTP_PASS;
    $mail->Port       = SMTP_PORT;

    // Configure SSL/TLS Encryption
    $secureMode = strtolower((string)SMTP_SECURE);
    if ($secureMode === 'ssl' || SMTP_PORT === 465) {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    } elseif ($secureMode === 'tls' || SMTP_PORT === 587) {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    } else {
        $mail->SMTPSecure = false;
        $mail->SMTPAutoTLS = false;
    }

    $mail->CharSet = 'UTF-8';
    $mail->Timeout = 20;

    // Sender details
    $mail->setFrom(SMTP_FROM_EMAIL, SMTP_FROM_NAME);
    $mail->addReplyTo(SMTP_REPLY_TO, SMTP_FROM_NAME);

    // Recipient: The person who submitted the form
    $mail->addAddress($email, $name);

    // Optional Admin Notification / BCC
    if (!empty(ADMIN_NOTIFICATION_EMAIL) && filter_var(ADMIN_NOTIFICATION_EMAIL, FILTER_VALIDATE_EMAIL)) {
        $mail->addBCC(ADMIN_NOTIFICATION_EMAIL);
    }

    // Email Subject & Payload
    $mail->isHTML(true);
    $mail->Subject = 'Brief Received — 1928 Creative Studio';
    $mail->Body    = buildAcknowledgmentHtml($requestData);
    $mail->AltBody = buildAcknowledgmentPlainText($requestData);

    // Transmit email
    $mail->send();

    // Return successful response to frontend
    echo json_encode([
        'status'  => 'success',
        'message' => 'Brief received! An acknowledgment email has been sent to ' . htmlspecialchars($email) . ' (we will get back to you within 72 hours).',
        'data'    => [
            'recipient' => $email,
            'timestamp' => date('c'),
            'company'   => $company,
            'service'   => $service
        ]
    ]);
    exit;

} catch (Exception $e) {
    error_log("1928 Studio Mailer Error: " . $mail->ErrorInfo . " | Exception: " . $e->getMessage());

    http_response_code(500);

    // Provide informative diagnosis
    $errorMsg = $mail->ErrorInfo ?: $e->getMessage();
    
    // Provide a helpful hint if SMTP credentials are still default placeholders
    if (SMTP_USER === 'your-email@gmail.com' || SMTP_PASS === 'your-app-password') {
        $errorMsg = 'SMTP credentials not configured. Please set your SMTP details in send-contact-form_ack.php or smtp-config.php.';
    }

    echo json_encode([
        'status'  => 'error',
        'message' => 'Failed to dispatch acknowledgment email: ' . $errorMsg,
        'debug'   => [
            'host' => SMTP_HOST,
            'port' => SMTP_PORT,
            'user' => SMTP_USER !== 'your-email@gmail.com' ? 'Configured' : 'Default placeholder'
        ]
    ]);
    exit;
}
