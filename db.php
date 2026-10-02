<?php
/**
 * 1928 CREATIVE STUDIO — Database Connection Engine (Core PHP & PDO)
 * Foolproof PDO connection for Laragon, XAMPP, and Production MySQL servers
 */

define('DB_HOST', 'localhost');
define('DB_NAME', '1928_studio_cms');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
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

function getDB(): PDO {
    return Database::getConnection();
}
