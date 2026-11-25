-- =============================================================================
-- 1928 CREATIVE STUDIO — Migration: editable page links for portfolio projects
-- Date: 2026-11-25
--
-- WHAT IT DOES (safe for the LIVE database — nothing is deleted or overwritten):
--   • Adds ONE column, `slug`, to the `portfolio` table (the project's page link,
--     e.g. /portfolio/awardsplus), plus a unique index on it.
--   • Gives every existing project its current ID as its starting link, so
--     today's links keep pointing to the same projects (aurora stays aurora).
--   • Creates `route_redirects` only if it does not exist yet (keeps old links
--     working after you change a link in the admin).
--
-- HOW TO RUN (phpMyAdmin on the live server):
--   1. Select the live database (e.g. u165532389_uat) → "SQL" tab.
--   2. Paste this whole file → "Go".
--
-- NOTE: the updated api.php also creates this column automatically the first time
-- the site or admin loads. If you already uploaded api.php, step 1 will report
-- "Duplicate column name 'slug'" — that only means it is already done; run
-- steps 2–4 on their own.
-- =============================================================================

-- 1) Add the link column
ALTER TABLE `portfolio`
  ADD COLUMN `slug` VARCHAR(150) COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL AFTER `project_id`;

-- 2) Starting link = the project's current ID (only fills empty ones)
UPDATE `portfolio`
   SET `slug` = LOWER(`project_id`)
 WHERE `slug` IS NULL OR `slug` = '';

-- 3) Links must be unique
ALTER TABLE `portfolio`
  ADD UNIQUE KEY `uniq_portfolio_slug` (`slug`);

-- 4) Old-link redirects table (skipped automatically if it already exists)
CREATE TABLE IF NOT EXISTS `route_redirects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `route_key` VARCHAR(64) NOT NULL,
  `old_slug` VARCHAR(191) NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_old_slug` (`old_slug`),
  INDEX `idx_route_key` (`route_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- CHECK (optional): lists every project and its link
-- SELECT `project_id`, `slug`, `title` FROM `portfolio` ORDER BY `display_order`;
--
-- CHANGE A LINK BY SQL (optional — normally do it in Admin → SEO & Metadata,
-- which also keeps the old link redirecting). Example:
-- UPDATE `portfolio` SET `slug` = 'awardsplus' WHERE `project_id` = 'aurora';
-- -----------------------------------------------------------------------------
