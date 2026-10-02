# 1928 Creative Studio — Core PHP & MySQL (Laragon / phpMyAdmin) Setup Guide

This backend architecture connects **Core PHP**, **PDO**, and **MySQL** with your **Studio Admin Panel** and live website.

---

## 1. Quick Setup in Laragon / phpMyAdmin

### Step 1: Open Laragon & phpMyAdmin
1. Start Laragon (click **Start All**).
2. Click **Database** or open phpMyAdmin at `http://localhost/phpmyadmin`.

### Step 2: Import the Database
1. In phpMyAdmin, click **Import** in the top navigation bar.
2. Click **Choose File** and select `database.sql` from your project folder (`j:\1982 Work\database.sql`).
3. Click **Go / Import** at the bottom.
4. It will automatically create the database `1928_studio_cms` with all 9 tables and pre-populate all 17 live blogs, 10 portfolio projects, 12 client logos, 6 team members, and SEO records!

---

## 2. Backend Files Structure

| File | Purpose |
|---|---|
| `database.sql` | Complete MySQL schema + 100% factory dataset dump. |
| `db.php` | Core PHP singleton database connection using **PDO** with UTF8mb4 and prepared statements. |
| `api.php` | RESTful Core PHP API controller that handles SQL CRUD queries (`get_all`, `save_blog`, `delete_blog`, `save_portfolio`, `save_seo`, etc.). |
| `data-store.js` | Frontend CMS store with automatic hybrid MySQL synchronization and offline fallback. |
| `admin.html` | Left Sidebar Admin Panel connected to PHP API & MySQL. |

---

## 3. Database Credentials Configuration (`db.php`)
The default settings match standard Laragon installations:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', '1928_studio_cms');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');
```
If you change your MySQL root password or database name, update these constants in [db.php](file:///j:/1982%20Work/db.php).

---

## 4. SQL Queries & API Endpoints Reference

### A. Fetch Full Website State
```http
GET api.php?action=get_all
```
**SQL Query:**
```sql
SELECT * FROM seo_meta;
SELECT * FROM studio_profile LIMIT 1;
SELECT * FROM team_members WHERE active = 1 ORDER BY display_order ASC;
SELECT * FROM studio_principles ORDER BY display_order ASC;
SELECT * FROM services WHERE active = 1 ORDER BY display_order ASC;
SELECT * FROM clients WHERE active = 1 ORDER BY display_order ASC;
SELECT * FROM portfolio WHERE active = 1 ORDER BY display_order ASC;
SELECT * FROM blogs WHERE published = 1 ORDER BY display_order ASC;
SELECT * FROM studio_settings;
```

### B. Save / Update Blog
```http
POST api.php?action=save_blog
Content-Type: application/json
```
**SQL Query (Prepared PDO Statement):**
```sql
INSERT INTO `blogs` 
(`blog_id`, `slug`, `title`, `category`, `category_slug`, `city`, `author`, `author_role`, `initials`, `date_text`, `read_time`, `cover_image`, `excerpt`, `content_html`, `published`, `display_order`)
VALUES 
(:bid, :slug, :title, :cat, :catslug, :city, :author, :role, :init, :dt, :rt, :cover, :exc, :content, :pub, :ord)
ON DUPLICATE KEY UPDATE
    `title` = VALUES(`title`),
    `category` = VALUES(`category`),
    `category_slug` = VALUES(`category_slug`),
    `city` = VALUES(`city`),
    `author` = VALUES(`author`),
    `author_role` = VALUES(`author_role`),
    `date_text` = VALUES(`date_text`),
    `read_time` = VALUES(`read_time`),
    `cover_image` = VALUES(`cover_image`),
    `excerpt` = VALUES(`excerpt`),
    `content_html` = VALUES(`content_html`),
    `published` = VALUES(`published`),
    `display_order` = VALUES(`display_order`);
```

### C. Delete Blog
```http
POST api.php?action=delete_blog
{"id": "art-monogram"}
```
**SQL Query:**
```sql
DELETE FROM `blogs` WHERE `blog_id` = :bid;
```

### D. Save / Update SEO Metadata
```http
POST api.php?action=save_seo
{"page_key": "home", "title": "...", "description": "...", "keywords": "..."}
```
**SQL Query:**
```sql
INSERT INTO `seo_meta` (`page_key`, `title`, `description`, `keywords`, `og_image`)
VALUES (:pk, :title, :desc, :kw, :og)
ON DUPLICATE KEY UPDATE
    `title` = VALUES(`title`),
    `description` = VALUES(`description`),
    `keywords` = VALUES(`keywords`),
    `og_image` = VALUES(`og_image`);
```

### E. Save / Update Portfolio Case Study
```http
POST api.php?action=save_portfolio
```
**SQL Query:**
```sql
INSERT INTO `portfolio`
(`project_id`, `title`, `client`, `category_keys`, `category_display`, `tag_pill`, `grid_span`, `year`, `cover_image`, `summary`, `challenge`, `approach`, `impact`, `metrics_json`, `featured`, `display_order`, `active`)
VALUES
(:pid, :title, :client, :cat, :catdisp, :pill, :span, :yr, :cover, :sum, :chal, :appr, :imp, :metrics, :feat, :ord, 1)
ON DUPLICATE KEY UPDATE
    `title` = VALUES(`title`),
    `client` = VALUES(`client`),
    `category_keys` = VALUES(`category_keys`),
    `category_display` = VALUES(`category_display`),
    `tag_pill` = VALUES(`tag_pill`),
    `grid_span` = VALUES(`grid_span`),
    `year` = VALUES(`year`),
    `cover_image` = VALUES(`cover_image`),
    `summary` = VALUES(`summary`),
    `challenge` = VALUES(`challenge`),
    `approach` = VALUES(`approach`),
    `impact` = VALUES(`impact`),
    `metrics_json` = VALUES(`metrics_json`),
    `featured` = VALUES(`featured`),
    `display_order` = VALUES(`display_order`);
```

### F. Save / Update Client Logo
```http
POST api.php?action=save_client
```
**SQL Query:**
```sql
INSERT INTO `clients`
(`client_id`, `name`, `subtitle`, `website_url`, `logo_type`, `svg_code`, `image_url`, `display_order`, `active`)
VALUES
(:cid, :name, :sub, :url, :type, :svg, :img, :ord, :act)
ON DUPLICATE KEY UPDATE
    `name` = VALUES(`name`),
    `subtitle` = VALUES(`subtitle`),
    `website_url` = VALUES(`website_url`),
    `logo_type` = VALUES(`logo_type`),
    `svg_code` = VALUES(`svg_code`),
    `image_url` = VALUES(`image_url`),
    `display_order` = VALUES(`display_order`),
    `active` = VALUES(`active`);
```
