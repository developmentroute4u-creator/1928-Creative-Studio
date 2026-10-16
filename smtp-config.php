<?php

/**
 * 1928 CREATIVE STUDIO — SMTP Configuration Settings (Optional Override)
 * 
 * If you create a file named "smtp-config.php" in this directory,
 * send-contact-form_ack.php will automatically load its definitions.
 */

// 1. GMAIL SMTP EXAMPLE (Requires a 16-character Google App Password):
// define('SMTP_HOST', 'smtp.gmail.com');
// define('SMTP_PORT', 587);
// define('SMTP_AUTH', true);
// define('SMTP_SECURE', 'tls'); // or 465 with 'ssl'
// define('SMTP_USER', 'your-studio@gmail.com');
// define('SMTP_PASS', 'xxxx xxxx xxxx xxxx'); // 16-character App Password (not standard account password)
// define('SMTP_FROM_EMAIL', 'your-studio@gmail.com');
// define('SMTP_FROM_NAME', '1928 Creative Studio');
// define('SMTP_REPLY_TO', 'hello@1928.studio');
// define('ADMIN_NOTIFICATION_EMAIL', 'admin@1928.studio'); // Optional BCC copy to studio lead

// 2. BREVO / SENDINBLUE EXAMPLE:
// define('SMTP_HOST', 'smtp-relay.brevo.com');
// define('SMTP_PORT', 587);
// define('SMTP_AUTH', true);
// define('SMTP_SECURE', 'tls');
// define('SMTP_USER', 'your-brevo-login@domain.com');
// define('SMTP_PASS', 'your-brevo-smtp-key');
// define('SMTP_FROM_EMAIL', 'contact@yourdomain.com');
// define('SMTP_FROM_NAME', '1928 Creative Studio');

// 3. HOSTINGER / CPANEL WEBMAIL EXAMPLE:
define('SMTP_HOST', 'smtp.hostinger.com');
define('SMTP_PORT', 465);
define('SMTP_AUTH', true);
define('SMTP_SECURE', 'ssl');
define('SMTP_USER', 'no-reply@1928creativestudio.com');
define('SMTP_PASS', 'hL9^8q9@');
define('SMTP_FROM_EMAIL', 'no-reply@1928creativestudio.com');
define('SMTP_FROM_NAME', '1928 Creative Studio');

if (!defined('ADMIN_NOTIFICATION_EMAIL')) {
    define('ADMIN_NOTIFICATION_EMAIL', 'vanshmistry2001@gmail.com'); // Admin email recipient (change later for production)
}

if (!defined('WHATSAPP_API_URL')) {
    define(
        'WHATSAPP_API_URL',
        'http://127.0.0.1:3000/send-form-notifications'
    );
}

if (!defined('WHATSAPP_API_SECRET')) {
    define('WHATSAPP_API_SECRET', 'akgsaqcwkuisebsdxpzwqswasogzhlsdlibetpugrjqruckv');
}

// 4. LARAGON LOCAL TESTING (Mail Catcher / Mailpit on localhost:1025):
// define('SMTP_HOST', 'localhost');
// define('SMTP_PORT', 1025);
// define('SMTP_AUTH', false);
// define('SMTP_SECURE', '');
// define('SMTP_USER', '');
// define('SMTP_PASS', '');
// define('SMTP_FROM_EMAIL', 'no-reply@1928creativestudio.com');
// define('SMTP_FROM_NAME', '1928 Creative Studio');

// 5. CLOUDFLARE TURNSTILE CAPTCHA (Optional Backend Verification):
// Once your friend gets the live Secret Key from Cloudflare Dashboard -> Turnstile,
// uncomment and paste it below:
// define('CLOUDFLARE_TURNSTILE_SECRET_KEY', 'your-cloudflare-turnstile-secret-key-here');
// define('ENABLE_TURNSTILE_VERIFY', true);