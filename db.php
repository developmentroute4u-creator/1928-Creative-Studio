<?php

/**
 * 1928 CREATIVE STUDIO — Database Connection Engine (Core PHP & PDO)
 * Foolproof PDO connection for Laragon, XAMPP, and Production MySQL servers
 */

// Detect the current environment
$hostName = strtolower($_SERVER['HTTP_HOST'] ?? 'localhost');
$hostName = preg_replace('/:\d+$/', '', $hostName);

if (
    $hostName === 'localhost' ||
    $hostName === '127.0.0.1' ||
    $hostName === '1928.test' ||
    str_ends_with($hostName, '.test') ||
    str_ends_with($hostName, '.local')
) {
    // LOCALHOST DATABASE CONFIGURATION

    define('DB_HOST', 'localhost');
    define('DB_NAME', '1928_studio_cms');
    define('DB_USER', 'root');
    define('DB_PASS', '');
    define('DB_CHARSET', 'utf8mb4');
} elseif (
    $hostName === 'uat.1928creativestudio.com' ||
    $hostName === '1928creativestudio.com' ||
    $hostName === 'www.1928creativestudio.com'
) {
    // HOSTING / UAT DATABASE CONFIGURATION
    define('DB_HOST', 'localhost');
    define('DB_NAME', 'u165532389_uat');
    define('DB_USER', 'u165532389_uat_root');
    define('DB_PASS', '4U^tQB$/dF$C');
    define('DB_CHARSET', 'utf8mb4');
} else {
    // Reject unknown environments
    http_response_code(403);
    exit('Database configuration is not available for this environment.');
}



class Database
{
    private static ?PDO $instance = null;

    public static function getConnection(): PDO
    {
        if (self::$instance === null) {
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];

            try {
                // Try direct connection to target database
                $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
                self::$instance = new PDO($dsn, DB_USER, DB_PASS, $options);
            } catch (PDOException $e) {
                // If database does not exist yet (Error 1049), auto-create it
                if ($e->getCode() == 1049 || strpos($e->getMessage(), 'Unknown database') !== false) {
                    try {
                        $rootDsn = "mysql:host=" . DB_HOST . ";charset=" . DB_CHARSET;
                        $rootPdo = new PDO($rootDsn, DB_USER, DB_PASS, $options);
                        $rootPdo->exec("CREATE DATABASE IF NOT EXISTS `" . DB_NAME . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");

                        // Connect now to the newly created database
                        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
                        self::$instance = new PDO($dsn, DB_USER, DB_PASS, $options);

                        // Auto-seed schema from database.sql
                        $sqlFile = __DIR__ . '/database.sql';
                        if (file_exists($sqlFile)) {
                            $sql = file_get_contents($sqlFile);
                            self::$instance->exec($sql);
                        }
                    } catch (PDOException $err2) {
                        http_response_code(500);
                        echo json_encode([
                            'status' => 'error',
                            'message' => 'Failed to initialize database: ' . $err2->getMessage()
                        ]);
                        exit;
                    }
                } else {
                    http_response_code(500);
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Database connection failed: ' . $e->getMessage()
                    ]);
                    exit;
                }
            }
        }
        return self::$instance;
    }
}

function getDB(): PDO
{
    return Database::getConnection();
}
