-- 1928 CREATIVE STUDIO — Pure Database-Driven Master Schema & Initial Data
-- Database: `1928_studio_cms`
-- Generated: 2026-10-25 18:30:40

SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------
-- Table structure for `seo_meta`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `seo_meta`;
CREATE TABLE `seo_meta` (
  `id` int NOT NULL AUTO_INCREMENT,
  `page_key` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `keywords` text COLLATE utf8mb4_unicode_ci,
  `og_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'img/hero-luxury.jpg',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `page_key` (`page_key`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for `seo_meta`
INSERT INTO `seo_meta` (`id`, `page_key`, `title`, `description`, `keywords`, `og_image`, `updated_at`) VALUES
(1, 'global', '1928 Creative Studio', '1928 Creative Studio sculpts iconic visual identities, immersive digital platforms, spatial environments, and transformative brand campaigns.', 'brand engineering, luxury identity, webgl digital platforms, spatial design, strategy, creative studio', 'assets/img/branding/1928-logo.png', '2026-10-25 19:49:08'),
(2, 'home', '1928 Creative Studio · Independent Brand Engineering & Digital Architecture', '1928 Creative Studio sculpts iconic visual identities, immersive digital platforms, spatial environments, and transformative brand campaigns.', '1928 creative studio, brand architecture, luxury branding agency, high-end web design, digital experiences, ahmedabad branding studio', 'assets/img/branding/1928-logo.png', '2026-10-25 19:49:08'),
(3, 'about', 'About · 1928 Creative Studio — Origins, Philosophy & Principles', '1928 Creative Studio is an independent brand engineering practice sculpting iconic visual identities, spatial environments, and digital platforms.', 'about 1928 studio, brand philosophy, studio origins, strategic design practice, creative direction, design team', 'assets/img/branding/1928-logo.png', '2026-10-25 19:49:08'),
(4, 'services', 'Services & Capabilities · 1928 Creative Studio', 'Comprehensive creative capabilities: Brand Strategy, Visual Identity Systems, WebGL Digital Architecture, Spatial Design, and High-Impact Content Creation.', 'brand identity services, web design services, packaging design, digital marketing, corporate branding, webgl development', 'assets/img/branding/1928-logo.png', '2026-10-25 19:49:08'),
(5, 'portfolio', 'Work & Archives · 1928 Creative Studio', 'A curated selection of branding, digital experiences, content, and spatial work created to solve real business challenges and build market leaders.', '1928 portfolio, luxury case studies, brand identity projects, web design portfolio, packaging design showcase', 'assets/img/branding/1928-logo.png', '2026-10-25 19:49:08'),
(6, 'blogs', 'Perspectives · 1928 Creative Studio — Strategic Design Research & Cultural Theorems', 'A provocative research laboratory and editorial codex exploring mathematical brand geometry, computational spatial physics, and luxury market dominance.', 'design perspectives, brand research, typography theorems, digital architecture insights, creative strategy blog', 'assets/img/branding/1928-logo.png', '2026-10-25 19:49:08'),
(7, 'contact', 'Start a Project · 1928 Creative Studio', 'Connect with 1928 Creative Studio to engineer your next iconic visual identity, digital flagship, or transformative brand expansion.', 'contact 1928, hire branding agency, project inquiry, luxury studio contact, creative consultation', 'assets/img/branding/1928-logo.png', '2026-10-25 19:49:08');

-- --------------------------------------------------------
-- Table structure for `studio_profile`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `studio_profile`;
CREATE TABLE `studio_profile` (
  `id` int NOT NULL AUTO_INCREMENT,
  `story_headline` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `story_description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `pillars_json` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for `studio_profile`
INSERT INTO `studio_profile` (`id`, `story_headline`, `story_description`, `pillars_json`, `updated_at`) VALUES
(1, 'WE TURN AMBITION INTO MOMENTUM.', 'Founded in 2026, 1928 Creative Studio operates at the bleeding edge of luxury brand architecture, WebGL digital engineering, and cultural semiotics. We partner exclusively with visionary founders, global luxury houses, and high-growth innovators.', '[{\"num\":\"01\",\"tag\":\"FOUNDATION\",\"text\":\"1928 Creative Studio was founded by Ami and Tushar, bringing together creative thinking, strategic direction and digital expertise under one roof.\",\"sub\":\"STRATEGY + CRAFT\"},{\"num\":\"02\",\"tag\":\"EXPERIENCE\",\"text\":\"With 10+ years of experience, we work with businesses to shape how they look, how they communicate, and how they grow.\",\"sub\":\"10+ YEARS EXPERTISE\"},{\"num\":\"03\",\"tag\":\"INTEGRATION\",\"text\":\"From identity and digital experiences to content, marketing and influence, we help businesses move closer to their goals, with every part of the brand working together.\",\"sub\":\"COMPLETE LIFECYCLE\"}]', '2026-10-25 21:15:45');

-- --------------------------------------------------------
-- Table structure for `studio_principles`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `studio_principles`;
CREATE TABLE `studio_principles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `principle_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `num` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pill` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `tags_json` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_order` int DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `principle_id` (`principle_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for `studio_principles`
INSERT INTO `studio_principles` (`id`, `principle_id`, `num`, `pill`, `title`, `description`, `tags_json`, `display_order`) VALUES
(1, 'p1', '01', 'Think With Purpose', 'STRATEGIC THINKING', 'We start with the bigger picture. Your goals, audience, market and ambition shape every creative decision we make.', '[\"BUSINESS FIRST\",\"CLEAR DIRECTION\",\"PURPOSEFUL IDEAS\"]', 1),
(2, 'p2', '02', 'Make It Matter', 'DISTINCTIVE CRAFT', 'Every detail has a role. We create identities and experiences with clarity, character and a visual point of view that people remember.', '[\"DETAIL\", \"CHARACTER\", \"RECOGNITION\"]', 2),
(3, 'p3', '03', 'Create Real Connection', 'HUMAN CONNECTION', 'Great brands connect before they convert. We build stories, content and experiences that feel relevant, natural and human.', '[\"STORY\", \"CULTURE\", \"CONNECTION\"]', 3),
(4, 'p4', '04', 'Create Lasting Value', 'BUILT FOR GROWTH', 'A stronger brand should create opportunities for a stronger business. We design every touchpoint with growth, relevance and long-term value in mind.', '[\"BRAND\", \"BUSINESS\", \"GROWTH\"]', 4);

-- --------------------------------------------------------
-- Table structure for `team_members`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `team_members`;
CREATE TABLE `team_members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `member_key` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `photo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_order` int DEFAULT '1',
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `member_key` (`member_key`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for `team_members`
INSERT INTO `team_members` (`id`, `member_key`, `name`, `role`, `photo`, `display_order`, `active`, `created_at`) VALUES
(1, 'ami', 'Ami Panchal', 'Founder & Creative + Strategy Head', 'assets/img/team/team-ami.jpg', 1, 1, '2026-10-25 21:15:45'),
(2, 'tushar', 'Tushar Panchal', 'Founder & Marketing Head', 'assets/img/team/team-tusar.jpg', 2, 1, '2026-10-25 21:15:45'),
(3, 'trusha', 'Trusha Panchal', 'Senior Graphic Designer', 'assets/img/team/team-elena.jpg', 3, 1, '2026-10-25 21:15:45'),
(4, 'harsh', 'Harsh Patel', 'Senior Video Editor', 'assets/img/team/team-kaito.jpg', 4, 1, '2026-10-25 21:15:45'),
(5, 'urvish', 'Urvish Mistry', 'Junior Video Editor + Community Manager', 'assets/img/team/team-urvish.jpg', 5, 1, '2026-10-25 21:15:45'),
(6, 'priyal', 'Priyal Lunkar', 'Social Media Manager', 'assets/img/team/team-priyal.jpg', 6, 1, '2026-10-25 21:15:45');

-- --------------------------------------------------------
-- Table structure for `services`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `services`;
CREATE TABLE `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `service_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `num` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tagline` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `deliverables_json` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_order` int DEFAULT '1',
  `active` tinyint(1) DEFAULT '1',
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `service_id` (`service_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for `services`
INSERT INTO `services` (`id`, `service_id`, `num`, `title`, `tagline`, `description`, `deliverables_json`, `display_order`, `active`, `image_url`) VALUES
(1, 'svc-logo', '01', 'Logo Design', 'VISUAL IDENTITY · FIRST IMPRESSION', 'A distinctive mark that gives your business a memorable identity. We create thoughtful logos that capture your brand\'s character and give it a strong visual presence across every touchpoint.', '[\"Custom Logos\",\"Wordmarks\",\"Monograms\",\"Symbols\",\"Typography\"]', 1, 1, 'assets/services/svc_1.jpg'),
(2, 'svc-brand', '02', 'Brand Identity Development', 'STRATEGY · GUIDELINE · SYSTEM', 'A complete identity built around what makes your business different. We turn your story, positioning and personality into a cohesive brand system designed to build recognition and lasting value.', '[\"Brand Strategy\",\"Visual Identity\",\"Colour\",\"Typography\",\"Guidelines\"]', 2, 1, 'assets/services/svc_2.jpg'),
(3, 'svc-web', '03', 'Website Design & Development', 'DIGITAL · EXPERIENCE · MOTION', 'Digital experiences that make your brand feel as good as it looks. We design and develop purposeful websites that bring your story to life, create meaningful interactions and turn attention into action.', '[\"UI\\/UX\",\"Web Design\",\"Development\",\"E-commerce\",\"Motion\"]', 3, 1, 'assets/services/svc_3.jpg'),
(4, 'svc-social', '04', 'Social Media & Digital Marketing', 'VISIBILITY · CONNECTION · GROWTH', 'A digital presence designed to keep your brand moving forward. We combine creative thinking with strategic marketing to build visibility, meaningful engagement and stronger connections with your audience.', '[\"Social Strategy\",\"Content\",\"Meta Ads\",\"Google Ads\",\"SEO\"]', 4, 1, 'assets/services/svc_4.jpg'),
(5, 'svc-content', '05', 'Content Creation & Influencer Marketing', 'STORY · CREATORS · CONNECTION', 'We create stories worth seeing and partnerships worth remembering. From original content to carefully chosen creator collaborations, we build campaigns that give your brand a stronger voice, wider reach, and lasting audience connection.', '[\"Content Strategy\",\"Creative Production\",\"Creator Partnerships\",\"Campaigns\",\"Social Content\"]', 5, 1, 'assets/services/svc_5.jpg');

-- --------------------------------------------------------
-- Table structure for `clients`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `clients`;
CREATE TABLE `clients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `client_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtitle` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '#',
  `logo_type` enum('svg','image') COLLATE utf8mb4_unicode_ci DEFAULT 'svg',
  `svg_code` mediumtext COLLATE utf8mb4_unicode_ci,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_order` int DEFAULT '1',
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `client_id` (`client_id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for `clients`
INSERT INTO `clients` (`id`, `client_id`, `name`, `subtitle`, `website_url`, `logo_type`, `svg_code`, `image_url`, `display_order`, `active`) VALUES
(1, 'client-01', 'Client Partner 01', 'Brand Partner · Sector 01', '#', 'image', NULL, 'assets/img/clients/Client Logos-01.jpg', 1, 1),
(2, 'client-02', 'Client Partner 02', 'Brand Partner · Sector 02', '#', 'image', NULL, 'assets/img/clients/Client Logos-02.jpg', 2, 1),
(3, 'client-03', 'Client Partner 03', 'Brand Partner · Sector 03', '#', 'image', NULL, 'assets/img/clients/Client Logos-03.jpg', 3, 1),
(4, 'client-04', 'Client Partner 04', 'Brand Partner · Sector 04', '#', 'image', NULL, 'assets/img/clients/Client Logos-04.jpg', 4, 1),
(5, 'client-05', 'Client Partner 05', 'Brand Partner · Sector 05', '#', 'image', NULL, 'assets/img/clients/Client Logos-05.jpg', 5, 1),
(6, 'client-06', 'Client Partner 06', 'Brand Partner · Sector 06', '#', 'image', NULL, 'assets/img/clients/Client Logos-06.jpg', 6, 1),
(7, 'client-07', 'Client Partner 07', 'Brand Partner · Sector 07', '#', 'image', NULL, 'assets/img/clients/Client Logos-07.jpg', 7, 1),
(8, 'client-08', 'Client Partner 08', 'Brand Partner · Sector 08', '#', 'image', NULL, 'assets/img/clients/Client Logos-08.jpg', 8, 1),
(9, 'client-09', 'Client Partner 09', 'Brand Partner · Sector 09', '#', 'image', NULL, 'assets/img/clients/Client Logos-09.jpg', 9, 1),
(10, 'client-10', 'Client Partner 10', 'Brand Partner · Sector 10', '#', 'image', NULL, 'assets/img/clients/Client Logos-10.jpg', 10, 1),
(11, 'client-11', 'Client Partner 11', 'Brand Partner · Sector 11', '#', 'image', NULL, 'assets/img/clients/Client Logos-11.jpg', 11, 1),
(12, 'client-12', 'Client Partner 12', 'Brand Partner · Sector 12', '#', 'image', NULL, 'assets/img/clients/Client Logos-12.jpg', 12, 1),
(13, 'client-13', 'Client Partner 13', 'Brand Partner · Sector 13', '#', 'image', NULL, 'assets/img/clients/Client Logos-13.jpg', 13, 1),
(14, 'client-14', 'Client Partner 14', 'Brand Partner · Sector 14', '#', 'image', NULL, 'assets/img/clients/Client Logos-14.jpg', 14, 1),
(15, 'client-15', 'Client Partner 15', 'Brand Partner · Sector 15', '#', 'image', NULL, 'assets/img/clients/Client Logos-15.jpg', 15, 1),
(16, 'client-16', 'Client Partner 16', 'Brand Partner · Sector 16', '#', 'image', NULL, 'assets/img/clients/Client Logos-16.jpg', 16, 1),
(17, 'client-17', 'Client Partner 17', 'Brand Partner · Sector 17', '#', 'image', NULL, 'assets/img/clients/Client Logos-17.jpg', 17, 1),
(18, 'client-18', 'Client Partner 18', 'Brand Partner · Sector 18', '#', 'image', NULL, 'assets/img/clients/Client Logos-18.jpg', 18, 1),
(19, 'client-19', 'Client Partner 19', 'Brand Partner · Sector 19', '#', 'image', NULL, 'assets/img/clients/Client Logos-19.jpg', 19, 1),
(20, 'client-20', 'Client Partner 20', 'Brand Partner · Sector 20', '#', 'image', NULL, 'assets/img/clients/Client Logos-20.jpg', 20, 1),
(21, 'client-21', 'Client Partner 21', 'Brand Partner · Sector 21', '#', 'image', NULL, 'assets/img/clients/Client Logos-21.jpg', 21, 1),
(22, 'client-22', 'Client Partner 22', 'Brand Partner · Sector 22', '#', 'image', NULL, 'assets/img/clients/Client Logos-22.jpg', 22, 1),
(23, 'client-23', 'Client Partner 23', 'Brand Partner · Sector 23', '#', 'image', NULL, 'assets/img/clients/Client Logos-23.jpg', 23, 1),
(24, 'client-24', 'Client Partner 24', 'Brand Partner · Sector 24', '#', 'image', NULL, 'assets/img/clients/Client Logos-24.jpg', 24, 1),
(25, 'client-25', 'Client Partner 25', 'Brand Partner · Sector 25', '#', 'image', NULL, 'assets/img/clients/Client Logos-25.jpg', 25, 1),
(26, 'client-26', 'Client Partner 26', 'Brand Partner · Sector 26', '#', 'image', NULL, 'assets/img/clients/Client Logos-26.jpg', 26, 1),
(27, 'client-27', 'Client Partner 27', 'Brand Partner · Sector 27', '#', 'image', NULL, 'assets/img/clients/Client Logos-27.jpg', 27, 1),
(28, 'client-28', 'Client Partner 28', 'Brand Partner · Sector 28', '#', 'image', NULL, 'assets/img/clients/Client Logos-28.jpg', 28, 1),
(29, 'client-29', 'Client Partner 29', 'Brand Partner · Sector 29', '#', 'image', NULL, 'assets/img/clients/Client Logos-29.jpg', 29, 1),
(30, 'client-30', 'Client Partner 30', 'Brand Partner · Sector 30', '#', 'image', NULL, 'assets/img/clients/Client Logos-30.jpg', 30, 1),
(31, 'client-31', 'Client Partner 31', 'Brand Partner · Sector 31', '#', 'image', NULL, 'assets/img/clients/Client Logos-31.jpg', 31, 1),
(32, 'client-32', 'Client Partner 32', 'Brand Partner · Sector 32', '#', 'image', NULL, 'assets/img/clients/Client Logos-32.jpg', 32, 1),
(33, 'client-33', 'Client Partner 33', 'Brand Partner · Sector 33', '#', 'image', NULL, 'assets/img/clients/Client Logos-33.jpg', 33, 1),
(34, 'client-34', 'Client Partner 34', 'Brand Partner · Sector 34', '#', 'image', NULL, 'assets/img/clients/Client Logos-34.jpg', 34, 1),
(35, 'client-35', 'Client Partner 35', 'Brand Partner · Sector 35', '#', 'image', NULL, 'assets/img/clients/Client Logos-35.jpg', 35, 1),
(36, 'client-36', 'Client Partner 36', 'Brand Partner · Sector 36', '#', 'image', NULL, 'assets/img/clients/Client Logos-36.jpg', 36, 1),
(37, 'client-37', 'Client Partner 37', 'Brand Partner · Sector 37', '#', 'image', NULL, 'assets/img/clients/Client Logos-37.jpg', 37, 1),
(38, 'client-38', 'Client Partner 38', 'Brand Partner · Sector 38', '#', 'image', NULL, 'assets/img/clients/Client Logos-38.jpg', 38, 1),
(39, 'client-39', 'Client Partner 39', 'Brand Partner · Sector 39', '#', 'image', NULL, 'assets/img/clients/Client Logos-39.jpg', 39, 1),
(40, 'client-40', 'Client Partner 40', 'Brand Partner · Sector 40', '#', 'image', NULL, 'assets/img/clients/Client Logos-40.jpg', 40, 1),
(41, 'client-41', 'Client Partner 41', 'Brand Partner · Sector 41', '#', 'image', NULL, 'assets/img/clients/Client Logos-41.jpg', 41, 1),
(42, 'client-42', 'Client Partner 42', 'Brand Partner · Sector 42', '#', 'image', NULL, 'assets/img/clients/Client Logos-42.jpg', 42, 1),
(43, 'client-43', 'Client Partner 43', 'Brand Partner · Sector 43', '#', 'image', NULL, 'assets/img/clients/Client Logos-43.jpg', 43, 1),
(44, 'client-44', 'Client Partner 44', 'Brand Partner · Sector 44', '#', 'image', NULL, 'assets/img/clients/Client Logos-44.jpg', 44, 1),
(45, 'client-45', 'Client Partner 45', 'Brand Partner · Sector 45', '#', 'image', NULL, 'assets/img/clients/Client Logos-45.jpg', 45, 1),
(46, 'client-46', 'Client Partner 46', 'Brand Partner · Sector 46', '#', 'image', NULL, 'assets/img/clients/Client Logos-46.jpg', 46, 1),
(47, 'client-47', 'Client Partner 47', 'Brand Partner · Sector 47', '#', 'image', NULL, 'assets/img/clients/Client Logos-47.jpg', 47, 1),
(48, 'client-48', 'Client Partner 48', 'Brand Partner · Sector 48', '#', 'image', NULL, 'assets/img/clients/Client Logos-48.jpg', 48, 1),
(49, 'client-49', 'Client Partner 49', 'Brand Partner · Sector 49', '#', 'image', NULL, 'assets/img/clients/Client Logos-49.jpg', 49, 1),
(50, 'client-50', 'Client Partner 50', 'Brand Partner · Sector 50', '#', 'image', NULL, 'assets/img/clients/Client Logos-50.jpg', 50, 1),
(51, 'client-51', 'Client Partner 51', 'Brand Partner · Sector 51', '#', 'image', NULL, 'assets/img/clients/Client Logos-51.jpg', 51, 1),
(52, 'client-52', 'Client Partner 52', 'Brand Partner · Sector 52', '#', 'image', NULL, 'assets/img/clients/Client Logos-52.jpg', 52, 1),
(53, 'client-53', 'Client Partner 53', 'Brand Partner · Sector 53', '#', 'image', NULL, 'assets/img/clients/Client Logos-53.jpg', 53, 1),
(54, 'client-54', 'Client Partner 54', 'Brand Partner · Sector 54', '#', 'image', NULL, 'assets/img/clients/Client Logos-54.jpg', 54, 1),
(55, 'client-55', 'Client Partner 55', 'Brand Partner · Sector 55', '#', 'image', NULL, 'assets/img/clients/Client Logos-55.jpg', 55, 1),
(56, 'client-56', 'Client Partner 56', 'Brand Partner · Sector 56', '#', 'image', NULL, 'assets/img/clients/Client Logos-56.jpg', 56, 1),
(57, 'client-57', 'Client Partner 57', 'Brand Partner · Sector 57', '#', 'image', NULL, 'assets/img/clients/Client Logos-57.jpg', 57, 1),
(58, 'client-58', 'Client Partner 58', 'Brand Partner · Sector 58', '#', 'image', NULL, 'assets/img/clients/Client Logos-58.jpg', 58, 1),
(59, 'client-59', 'Client Partner 59', 'Brand Partner · Sector 59', '#', 'image', NULL, 'assets/img/clients/Client Logos-59.jpg', 59, 1),
(60, 'client-60', 'Client Partner 60', 'Brand Partner · Sector 60', '#', 'image', NULL, 'assets/img/clients/Client Logos-60.jpg', 60, 1);

-- --------------------------------------------------------
-- Table structure for `portfolio`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `portfolio`;
CREATE TABLE `portfolio` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `client` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_keys` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_display` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tag_pill` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `grid_span` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'bento-compact',
  `year` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT '2025',
  `cover_image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `summary` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `challenge` text COLLATE utf8mb4_unicode_ci,
  `approach` text COLLATE utf8mb4_unicode_ci,
  `impact` text COLLATE utf8mb4_unicode_ci,
  `metrics_json` text COLLATE utf8mb4_unicode_ci,
  `featured` tinyint(1) DEFAULT '1',
  `display_order` int DEFAULT '1',
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_id` (`project_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for `portfolio`
INSERT INTO `portfolio` (`id`, `project_id`, `title`, `client`, `category_keys`, `category_display`, `tag_pill`, `grid_span`, `year`, `cover_image`, `summary`, `challenge`, `approach`, `impact`, `metrics_json`, `featured`, `display_order`, `active`, `created_at`) VALUES
(1, 'aurora', 'Aurora Chronometer Systems', 'Aurora Horology Geneva', 'brand-identity web-design logo-design', 'Swiss Luxury Brand Identity & 3D Vault', 'Horology & WebGL', 'bento-wide', '2026', 'assets/img/portfolio/port-chronos.jpg', 'Aurora Horology commissioned 1928 Creative Studio to architect an enduring brand ecosystem that honors Swiss horological precision while establishing commanding digital authority for the next generation of luxury collectors.', NULL, NULL, NULL, NULL, 1, 1, 1, '2026-10-25 21:15:45'),
(2, 'vertex', 'Vertex Architects', 'Vertex Architectural Studio', 'logo-design brand-identity spatial-packaging', 'Geometric Logo Architecture', 'Spatial System', 'bento-compact', '2026', 'assets/img/portfolio/port-spectra.jpg', 'A monumental typographic brand identity rooted in modernist architectural geometries, structural balance, and tactile print applications.', NULL, NULL, NULL, NULL, 1, 2, 1, '2026-10-25 21:15:45'),
(3, 'solstice', 'Solstice Haute Parfumerie', 'Maison Solstice Paris', 'logo-design brand-identity spatial-packaging', 'Fluted Monolithic Glass Vessel', 'Packaging Craft', 'bento-compact', '2026', 'assets/img/portfolio/port-lumina.jpg', 'Fluted crystal bottle engineering, bespoke magnetic closures, and sensory semiotics for a Parisian boutique fragrance maison.', NULL, NULL, NULL, NULL, 1, 3, 1, '2026-10-25 21:15:45'),
(4, 'aetherion', 'Aetherion Cyber Telemetry', 'Aetherion Hypercraft', 'web-design brand-identity', 'Real-Time WebGL Automotive Cockpit', 'Cyber Cockpit', 'bento-wide', '2026', 'assets/img/portfolio/port-veloce.jpg', 'Next-generation automotive digital telemetry platform and WebGL configurator built for high-performance electric hypercars.', NULL, NULL, NULL, NULL, 1, 4, 1, '2026-10-25 21:15:45'),
(5, 'quantum', 'Quantum Chrome Engine', 'Quantum Design Systems', 'web-design logo-design brand-identity', 'Generative AI Shaders & Design System', 'Neural Platform', 'bento-wide', '2026', 'assets/img/portfolio/port-kroma.jpg', 'Real-time GPU accelerated shaders, mathematical type animations, and a cohesive design system for creative technology studios.', NULL, NULL, NULL, NULL, 1, 5, 1, '2026-10-25 21:15:45'),
(6, 'milan', 'Milan Runway Momentum', 'Milan Fashion Week FW24', 'social-marketing spatial-packaging', 'Global Omnichannel Social Campaign', 'Runway Takeover', 'bento-compact', '2026', 'assets/img/portfolio/port-zenith.jpg', 'A global digital campaign synchronized across physical architectural projection mapping and virally coordinated editorial reels.', NULL, NULL, NULL, NULL, 1, 6, 1, '2026-10-25 21:15:45'),
(7, 'lofy', 'LOFY Spatial Environments', 'LOFY Modular Living', 'brand-identity social-marketing', 'Sustainable Architectural Brand System', 'Modular Flagship', 'bento-compact', '2026', 'assets/services/svc_1.jpg', 'Modular architectural identity and sustainable packaging system designed for high-density metropolitan spaces.', NULL, NULL, NULL, NULL, 1, 7, 1, '2026-10-25 21:15:45'),
(8, 'stregis', 'St. Regis Spatial Monogram', 'St. Regis Luxury Hospitality', 'brand-identity spatial-packaging social-marketing', 'Sensory Hospitality Suite & Print Architecture', 'Luxury Hospitality', 'bento-wide', '2026', 'assets/services/svc_2.jpg', 'Prestige hospitality branding and bespoke editorial print architecture for ultra-luxury penthouses.', NULL, NULL, NULL, NULL, 1, 8, 1, '2026-10-25 21:15:45'),
(9, 'vibee', 'Vibee — Youth Culture & Apparel Identity', 'Vibee Apparel Co.', 'brand-identity logo-design', 'Youth Culture & Apparel Identity', 'Apparel Identity', 'bento-compact', '2026', 'assets/img/portfolio/Selected Work Case Study Cards (Portfolio Showcase)-01.jpg', 'Bold typographic street brand system with reactive apparel motion graphics and viral drop marketing.', NULL, NULL, NULL, NULL, 1, 9, 1, '2026-10-25 21:15:45'),
(10, 'infyli', 'Infyli — Minimalist Luxury Home Aromatics', 'Infyli Paris & Mumbai', 'spatial-packaging brand-identity', 'Minimalist Luxury Home Aromatics', 'Luxury Aromatics', 'bento-compact', '2026', 'assets/img/portfolio/Selected Work Case Study Cards (Portfolio Showcase)-02.jpg', 'Bespoke ceramic vessel packaging and sensory digital storytelling for artisanal fragrance diffuser collections.', NULL, NULL, NULL, NULL, 1, 10, 1, '2026-10-25 21:15:45'),
(11, 'mudra', 'Mudra School — Classical Arts Digital Presence', 'Mudra Performing Arts Trust', 'web-design brand-identity', 'Classical Arts Digital Presence', 'Classical Arts', 'bento-compact', '2026', 'assets/img/portfolio/Selected Work Case Study Cards (Portfolio Showcase)-03.jpg', 'An elegant responsive digital presence celebrating tradition through fluid micro-interactions and archival clarity.', NULL, NULL, NULL, NULL, 1, 11, 1, '2026-10-25 21:15:45'),
(12, 'awards-plus', 'Awards Plus — Prestige Corporate Identity', 'Awards Plus International', 'brand-identity logo-design', 'Prestige Corporate Identity', 'Prestige Corporate', 'bento-compact', '2026', 'assets/img/portfolio/Selected Work Case Study Cards (Portfolio Showcase)-04.jpg', 'High-status corporate identity and ceremonial trophy catalog architecture for international accolades.', NULL, NULL, NULL, NULL, 1, 12, 1, '2026-10-25 21:15:45'),
(13, 'last-mile', 'Last Mile Analytics — Fintech Platform Architecture', 'Last Mile Global Markets', 'web-design brand-identity', 'Fintech Platform Architecture', 'Fintech Platform', 'bento-compact', '2026', 'assets/img/portfolio/Selected Work Case Study Cards (Portfolio Showcase)-05.jpg', 'Data-dense financial terminal UI design and enterprise brand authority for institutional crypto analytics.', NULL, NULL, NULL, NULL, 1, 13, 1, '2026-10-25 21:15:45'),
(14, 'alda', 'Alda — Precision Stainless Steel Spatial Identity', 'Alda Cookware & Architectural Steel', 'spatial-packaging brand-identity', 'Precision Stainless Steel Spatial Identity', 'Spatial Identity', 'bento-compact', '2026', 'assets/img/portfolio/Selected Work Case Study Cards (Portfolio Showcase)-06.jpg', 'Industrial product photography, brushed metal brand packaging, and high-precision spatial showroom displays.', NULL, NULL, NULL, NULL, 1, 14, 1, '2026-10-25 21:15:45');

-- --------------------------------------------------------
-- Table structure for `blogs`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `blogs`;
CREATE TABLE `blogs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `blog_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'London, UK',
  `author` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `author_role` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT 'Studio Principal & Brand Architect',
  `author_bio` text COLLATE utf8mb4_unicode_ci,
  `initials` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT '19',
  `date_text` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `read_time` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cover_image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `specimen_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `specimen_caption` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `excerpt` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_html` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `sections_json` longtext COLLATE utf8mb4_unicode_ci,
  `related_json` text COLLATE utf8mb4_unicode_ci,
  `published` tinyint(1) DEFAULT '1',
  `display_order` int DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `blog_id` (`blog_id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for `blogs`
INSERT INTO `blogs` (`id`, `blog_id`, `slug`, `title`, `category`, `category_slug`, `city`, `author`, `author_role`, `author_bio`, `initials`, `date_text`, `read_time`, `cover_image`, `specimen_image`, `specimen_caption`, `excerpt`, `content_html`, `sections_json`, `related_json`, `published`, `display_order`, `created_at`, `updated_at`) VALUES
(1, 'art-monogram', 'monolithic-luxury-monogram', 'New The Monolithic Luxury Monogram as an Enduring Landmark', 'BRAND ARCHITECTURE', 'brand-architecture', 'Milan, Italy', 'Jiya Thaker', 'Studio Principal & Brand Architect', '', 'PD', 'SEP 2026', '6 MIN READ', 'assets/uploads/1928_1790272451_Findade-Logo.png', '', '1928 EDITORIAL PROVENANCE CAPTURE', 'How high-growth luxury houses engineer mathematically rigorous marks to command enduring global authority.', '<div class=\"reader-pullquote\"><p>“Highlight a key perspective or architectural takeaway quote here...”</p></div><p></p><p>Real-time dynamic content reflection across live website</p><p></p>', '[{\"id\":\"sec-shift\",\"title\":\"01. The Strategic Shift\"},{\"id\":\"sec-geometry\",\"title\":\"02. Mathematical Geometry\"},{\"id\":\"sec-takeaways\",\"title\":\"03. Strategic Takeaways\"}]', '[\"art-spatial\",\"art-webgl\"]', 1, 1, '2026-09-23 22:27:53', '2026-09-25 21:40:08'),
(2, 'art-spatial', 'spatial-choreography-flagship-retail', 'Spatial Choreography Across Modern Architectural Luxury Flagship Retail', 'SPATIAL DESIGN', 'spatial-design', 'Milan, Italy', 'Elena Vance', 'Spatial Design Director', NULL, 'EV', 'AUG 2026', '6 MIN READ', 'assets/img/portfolio/port-veloce.jpg', NULL, NULL, 'Choreographing visitor trajectories through brutalist travertine monoliths, directional acoustics, and negative-space compression.', '<h2>01. The Sensory Environment</h2><p>Physical retail in 2026 is no longer about inventory distribution; it is sensory brand communion. When a client crosses the threshold into a physical flagship, every sensory input—the acoustic reverberation time of polished concrete, the color temperature of 2700K recessed spotlights, and the scent of custom cedarwood—instantly primes their valuation perception.</p><div class=\"reader-pullquote\"><p>\"The space itself is the most powerful salesperson. When architecture radiates permanence, price resistance dissipates.\"</p></div><h2>02. Monolithic Material Physics</h2><p>We specify raw split-face travertine, blackened brushed steel, and acoustic felt panels to establish a temple-like reverence. Clients spend 3.2x longer inside acoustically damped private VIP suites than open retail floors.</p>', NULL, NULL, 1, 2, '2026-09-23 22:27:53', '2026-10-25 19:49:08'),
(3, 'art-webgl', 'computational-raytracing-webgl', 'Zero Latency Computational Raytracing in WebGL Interactive Ecosystems', 'COMPUTATIONAL WEBGL', 'computational-webgl', 'Tokyo, Japan', 'Kaito Tanaka', 'Lead Shader Engineer', NULL, 'KT', 'AUG 2026', '5 MIN READ', 'assets/img/portfolio/port-lumina.jpg', NULL, NULL, 'Synthesizing custom GLSL physically-based surface shaders for real-time metallic reflections at native 120 FPS.', '<h2>01. Beyond the Flat 2D Web</h2><p>Static JPEG mockups and auto-playing video loops are remnants of a bygone digital era. The contemporary luxury buyer demands agency—the power to inspect sub-millimeter stitching on an automotive interior or rotate a tourbillon watch under real-time procedural lighting.</p><div class=\"reader-pullquote\"><p>\"Interactive 3D WebGL is not a gimmick; it is the closest digital surrogate to physical touch.\"</p></div><h2>02. Custom GLSL Fragment Shaders</h2><p>By compiling custom GLSL fragment shaders and implementing procedural normal map decompression, we achieve buttery 120fps performance across mobile Safari and desktop Chrome without draining device thermals.</p>', NULL, NULL, 1, 3, '2026-09-23 22:27:53', '2026-10-25 19:49:08'),
(4, 'art-fluted', 'tactile-acoustic-snaps-travertine', 'Tactile Acoustic Snaps and Travertine in Bespoke Packaging', 'PACKAGING & SPATIAL', 'packaging-spatial', 'Paris, France', 'Ami Patel', 'Materials & Packaging Specialist', NULL, 'AP', 'JUL 2026', '8 MIN READ', 'assets/img/portfolio/port-kroma.jpg', NULL, NULL, 'The psychophysics of 45-decibel acoustic closures, haptic friction coefficients, and unboxing rituals in ultra-luxury design.', '<h2>01. The Tactile Physics of Glass</h2><p>Weight is perceived as quality. A perfume vessel weighing 480 grams with an internal magnetic snap rated at 1.2 Newtons immediately communicates $300+ value before the atomizer is ever depressed.</p><div class=\"reader-pullquote\"><p>\"The tactile sensation of opening a luxury package triggers dopamine pathways faster than visual advertising.\"</p></div><h2>02. Light Refraction &amp; Fluting Tolerances</h2><p>Precision micro-fluting cut into lead-free crystal glass bends ambient gallery spotlights into vertical prismatic rays, transforming the fragrance liquid into a radiant glowing beacon.</p>', NULL, NULL, 1, 4, '2026-09-23 22:27:53', '2026-10-25 19:49:08'),
(5, 'art-monochrome', '99-percent-black-spectrum', 'The 99% Black Spectrum: Chromatic Precision in Semiotics', 'LUXURY SEMIOTICS', 'luxury-semiotics', 'Zurich, Switzerland', 'Jay Thaker', 'Studio Principal & Brand Architect', NULL, 'JT', 'JUL 2026', '6 MIN READ', 'assets/img/portfolio/port-zenith.jpg', NULL, NULL, 'Why restrained monochrome palettes with solitary crimson accents create an impenetrable aura of institutional prestige.', '<h2>01. Monochromatic Discipline</h2><p>Restraint is the ultimate form of luxury. By confining brand color palettes to deep carbon blacks, neutral zincs, and an uncompromising solitary crimson accent, the brand radiates supreme confidence and timeless elegance.</p><div class=\"reader-pullquote\"><p>\"Color attracts attention; pure contrast commands reverence.\"</p></div><h2>02. 99% Black Hierarchy</h2><p>We work with 5 distinct shades of black: Carbon (#070709), Onyx (#0E0E12), Gunmetal (#14141A), Zinc (#181820), and Obsidian (#000000). Layering these values creates depth without chromatic clutter.</p>', NULL, NULL, 1, 5, '2026-09-23 22:27:53', '2026-10-25 19:49:08'),
(6, 'art-kinetic', 'kinetic-identity-systems', 'Kinetic Identity Systems and Mathematical Precision in Modern Typography', 'CULTURAL CRITIQUE', 'cultural-critique', 'Milan, Italy', 'Jay Thaker', 'Studio Principal', NULL, 'JT', 'JUN 2026', '4 MIN READ', 'assets/img/why-choose/wc-top.jpg', NULL, NULL, 'Deconstructing our viral runway takeover that synchronized architectural projection mapping with high-velocity motion graphics.', '<h2>01. High-Velocity Typography</h2><p>In the noise of Milan Fashion Week, static billboards are invisible. By treating typography as physical kinetic particles that react to model runway pacing, we turned the entire venue into an immersive living typographic ecosystem.</p><div class=\"reader-pullquote\"><p>\"Type in motion is the heartbeat of digital culture. If your letters don\'t breathe, your brand is already obsolete.\"</p></div>', NULL, NULL, 1, 6, '2026-09-23 22:27:53', '2026-10-25 19:49:08'),
(7, 'art-neural', 'neural-aesthetics-liquid-interfaces', 'Neural Aesthetics and Liquid Interfaces for Next Generation Platforms', 'COMPUTATIONAL WEBGL', 'computational-webgl', 'Seoul, South Korea', 'Kaito Tanaka', 'Lead Shader Engineer', NULL, 'KT', 'JUN 2026', '7 MIN READ', 'assets/img/why-choose/wc-bot.jpg', NULL, NULL, 'Moving beyond sterile flat SaaS dashboards into dynamic, organic liquid chrome shaders that visualize real-time state transitions.', '<h2>01. Fluid Computational States</h2><p>As artificial intelligence systems become more complex, human operators need intuitive qualitative feedback. Procedural liquid metal shaders provide instant visual comprehension of neural confidence metrics and data flow densities.</p><div class=\"reader-pullquote\"><p>\"We are replacing rigid rectangles with fluid computational matter that breathes in rhythm with machine reasoning.\"</p></div>', NULL, NULL, 1, 7, '2026-09-23 22:27:53', '2026-10-25 19:49:08'),
(8, 'art-sensory', 'hospitality-onboarding-architecture', 'Architecture of Hospitality Onboarding: High-Touch Conversion', 'BRAND ARCHITECTURE', 'brand-architecture', 'Mumbai, India', 'Tushar Panchal', 'Founder & Marketing Head', NULL, 'TP', 'MAY 2026', '7 MIN READ', 'assets/img/why-choose/wc-bot.jpg', NULL, NULL, 'Translating five-star European boutique hotel rituals into high-touch luxury digital onboarding flows that eliminate buyer remorse and accelerate client retention.', '<h2>01. The Art of the Concierge Welcome</h2><p>When high-net-worth clients engage with a premium brand, the initial 48-hour onboarding ceremony establishes the entire lifetime relationship value. Automated plain-text confirmation emails destroy anticipation. Instead, choreography of digital tactile invitations and dedicated client dashboards anchors loyalty.</p>', NULL, NULL, 1, 8, '2026-09-23 22:27:53', '2026-10-25 19:49:08'),
(9, 'art-quiet', 'anti-algorithmic-luxury-paradigm', 'The Anti-Algorithmic Luxury Paradigm: Why Scarcity Drives Brand Equity', 'CULTURAL CRITIQUE', 'cultural-critique', 'Kyoto, Japan', 'Jay Thaker', 'Studio Principal & Brand Architect', NULL, 'JT', 'MAY 2026', '9 MIN READ', 'assets/img/portfolio/port-chronos.jpg', NULL, NULL, 'Why high-growth luxury maisons reject relentless social output in favor of intentional friction, mystery, and physical artifact supremacy.', '<h2>01. The Myth of Ubiquity</h2><p>Algorithmic content engines demand endless feeding. But luxury is defined by distance. When a brand is available everywhere, it means nothing. Intentional scarcity and cryptographic gating preserve the essential mystique that commands 10x price premiums.</p><div class=\"reader-pullquote\"><p>\"If your brand is everywhere, it is already nowhere. Real luxury lives in the shadows of intentional scarcity.\"</p></div>', NULL, NULL, 1, 9, '2026-09-23 22:27:53', '2026-10-25 19:49:08'),
(10, 'art-typographic-grid', 'mathematical-grids-kinetic-symmetry', 'Mathematical Grids and Kinetic Symmetry in Modernist Identity Systems', 'BRAND ARCHITECTURE', 'brand-architecture', 'Basel, Switzerland', 'Jay Thaker', 'Studio Principal & Brand Architect', NULL, 'JT', 'APR 2026', '6 MIN READ', 'assets/img/portfolio/port-veloce.jpg', NULL, NULL, 'Applying rational Swiss modernist proportion systems to responsive multi-device digital identity ecosystems.', '<h2>01. The Rationality of the Grid</h2><p>Swiss modernist typography was never about rigidity—it was about creating an invisible harmonious scaffolding where content commands absolute focus. We translate Josef Müller-Brockmann\'s modular principles into dynamic CSS subgrid architectures.</p><div class=\"reader-pullquote\"><p>\"The grid does not constrain creativity; it liberates form from arbitrary visual noise.\"</p></div>', NULL, NULL, 1, 10, '2026-09-23 22:27:53', '2026-10-25 19:49:08'),
(11, 'art-haptic-luxury', 'psychophysics-haptic-resistance', 'The Psychophysics of Haptic Resistance in Ultra Luxury Hardware', 'PACKAGING & SPATIAL', 'packaging-spatial', 'Munich, Germany', 'Ami Patel', 'Materials & Packaging Specialist', NULL, 'AP', 'MAR 2026', '8 MIN READ', 'assets/img/portfolio/port-kroma.jpg', NULL, NULL, 'Calibrating rotary dial torque and magnetic tactile detents to instill subconscious trust in high-end devices.', '<h2>01. Micro-Newton Calibration</h2><p>When an automotive volume rotary switch possesses 0.08 Newton-meters of hydraulic damping resistance, human tactile receptors instantly signal mechanical precision, transforming an electronic volume knob into horological luxury.</p>', NULL, NULL, 1, 11, '2026-09-23 22:27:53', '2026-10-25 19:49:08'),
(12, 'art-chromatic-void', 'photonic-contrast-atmospheric-lighting', 'Photonic Contrast and Atmospheric Lighting in Modern Gallery Flagships', 'SPATIAL DESIGN', 'spatial-design', 'New York, USA', 'Elena Vance', 'Spatial Design Director', NULL, 'EV', 'MAR 2026', '5 MIN READ', 'assets/img/portfolio/port-lumina.jpg', NULL, NULL, 'Utilizing 90% ambient spatial darkness with focused narrow-beam illumination to amplify product valuation.', '<h2>01. Darkness as a Frame</h2><p>Bright retail environments wash out product drama. By plunging 90% of the room into controlled shadow and deploying high-CRI 98+ spotlights with surgical cutoff snoots, every exhibited object takes on the sacred aura of a museum relic.</p>', NULL, NULL, 1, 12, '2026-09-23 22:27:53', '2026-10-25 19:49:08'),
(13, 'art-stealth-wealth', 'sub-surface-brand-semiotics', 'Sub-Surface Brand Semiotics in High Horology and Private Aviation', 'LUXURY SEMIOTICS', 'luxury-semiotics', 'Geneva, Switzerland', 'Jay Thaker', 'Studio Principal & Brand Architect', NULL, 'JT', 'FEB 2026', '7 MIN READ', 'assets/img/portfolio/port-zenith.jpg', NULL, NULL, 'How ultra-high-net-worth brands engineer covert visual codes discernible only to initiated cultural connoisseurs.', '<h2>01. The Cryptographic Code of Luxury</h2><p>Overt logos attract mass attention, but alienate connoisseurs. In high horology and private aviation interiors, status is communicated through stealth finishes: hand-anglage chamfering, hidden guilloché dials, and subtle micro-perforations.</p>', NULL, NULL, 1, 13, '2026-09-23 22:27:53', '2026-10-25 19:49:08'),
(14, 'art-digital-twins', 'physical-digital-twin-fidelity', 'Physical to Digital Twin Fidelity in Bespoke Automotive Configurator Design', 'COMPUTATIONAL WEBGL', 'computational-webgl', 'Stuttgart, Germany', 'Kaito Tanaka', 'Lead Shader Engineer', NULL, 'KT', 'JAN 2026', '6 MIN READ', 'assets/img/portfolio/port-chronos.jpg', NULL, NULL, 'Raymarched anisotropic carbon fiber weaves and multi-coat candy paint shaders for online bespoke luxury customization.', '<h2>01. Sub-Surface Flake Simulation</h2><p>Simulating metallic flake distribution under dynamic orbital HDRI lighting gives buyers absolute confidence when specifying $50,000 bespoke paint options on 8-figure hypercars.</p>', NULL, NULL, 1, 14, '2026-09-23 22:27:53', '2026-10-25 19:49:08'),
(15, 'art-monolith-arch', 'brutalist-travertine-monoliths', 'Brutalist Travertine Monoliths and Negative Space in High-End Boutiques', 'SPATIAL DESIGN', 'spatial-design', 'Stockholm, Sweden', 'Elena Vance', 'Spatial Design Director', NULL, 'EV', 'JAN 2026', '7 MIN READ', 'assets/img/why-choose/wc-bot.jpg', NULL, NULL, 'Carving monumental stone blocks to sculpt intimate sensory chambers within vast luxury architecture.', '<h2>01. The Weight of Silence</h2><p>When monumental 4-ton unpolished Roman travertine blocks anchor a boutique interior, the weight of the physical rock silences ambient noise and demands contemplative deceleration.</p>', NULL, NULL, 1, 15, '2026-09-23 22:27:53', '2026-10-25 19:49:08'),
(16, 'art-tactile-unbox', 'ritual-of-the-unboxing', 'The Ritual of the Unboxing: Micro Tolerances in Rigid Presentation Cases', 'PACKAGING & SPATIAL', 'packaging-spatial', 'London, UK', 'Ami Patel', 'Materials & Packaging Specialist', NULL, 'AP', 'DEC 2025', '8 MIN READ', 'assets/img/portfolio/port-kroma.jpg', NULL, NULL, 'Engineering 3.5-second air-cushion lid descent rates for an unforgettable tactile brand reveal ceremony.', '<h2>01. Air-Piston Resistance</h2><p>When a rigid telescoping box lid drops under its own weight at a calibrated 3.5-second glide, the client experiences sensory suspense before laying eyes on the timepiece.</p>', NULL, NULL, 1, 16, '2026-09-23 22:27:53', '2026-10-25 19:49:08'),
(17, 'art-cultural-resonance', 'cultural-resonance-timeless-dominance', 'Cultural Resonance and Timeless Dominance in Modern Architectural Practice', 'CULTURAL CRITIQUE', 'cultural-critique', 'Paris, France', 'Jay Thaker', 'Studio Principal & Brand Architect', NULL, 'JT', 'NOV 2025', '5 MIN READ', 'assets/img/why-choose/wc-top.jpg', NULL, NULL, 'Synthesizing architectural permanence with high-speed digital agility to build brands that outlive generational cycles.', '<h2>01. The 100-Year Vision</h2><p>Trends disappear within quarters; architectural geometry endures across centuries. By treating branding as physical architecture, we forge institutional equity that stands immune to seasonal aesthetic volatility.</p>', NULL, NULL, 1, 17, '2026-09-23 22:27:53', '2026-10-25 19:49:08');

-- --------------------------------------------------------
-- Table structure for `contact_inquiries`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `contact_inquiries`;
CREATE TABLE `contact_inquiries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'Independent Project',
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Not Specified',
  `service` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT 'Creative Direction & Strategy',
  `budget` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'Undisclosed Allocation',
  `timeline` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '< 1 Month (Immediate)',
  `session_date` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `session_time` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `session_summary` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vision` text COLLATE utf8mb4_unicode_ci,
  `nda` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'Standard Review',
  `status` enum('new','in_review','contacted','archived') COLLATE utf8mb4_unicode_ci DEFAULT 'new',
  `admin_notes` text COLLATE utf8mb4_unicode_ci,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `studio_settings`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `studio_settings`;
CREATE TABLE `studio_settings` (
  `setting_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting_value` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for `studio_settings`
INSERT INTO `studio_settings` (`setting_key`, `setting_value`) VALUES
('behance', 'https://behance.net'),
('contact_brief', '{\"header\":{\"title\":\"Start a Project.\",\"badge\":\"Confidential Brief \\u00b7 Partner Review\",\"desc\":\"Specify your engagement parameters to initiate a confidential studio brief.\"},\"step1\":{\"railWord\":\"Scope\",\"headline\":\"Engagement Classification\",\"caption\":\"Select the primary service for this project.\",\"cards\":[{\"id\":\"scope-1\",\"index\":\"01 \\/ VISUAL IDENTITY\",\"title\":\"Logo Design\",\"keywords\":[\"Logos\",\"Wordmarks\",\"Direction\"],\"mandate\":\"Logo Design\"},{\"id\":\"scope-2\",\"index\":\"02 \\/ BRAND SYSTEM\",\"title\":\"Brand Identity Development\",\"keywords\":[\"Strategy\",\"Guidelines\",\"Systems\"],\"mandate\":\"Brand Identity Development\"},{\"id\":\"scope-3\",\"index\":\"03 \\/ DIGITAL EXPERIENCE\",\"title\":\"Website Design & Development\",\"keywords\":[\"UI\\/UX\",\"Websites\",\"E-Commerce\"],\"mandate\":\"Website Design & Development\"},{\"id\":\"scope-4\",\"index\":\"04 \\/ DIGITAL GROWTH\",\"title\":\"Social Media & Digital Marketing\",\"keywords\":[\"Social Media\",\"Meta Ads\",\"SEO\"],\"mandate\":\"Social Media & Digital Marketing\"},{\"id\":\"scope-5\",\"index\":\"05 \\/ CONTENT & INFLUENCE\",\"title\":\"Content Creation & Influencer Marketing\",\"keywords\":[\"Reels\",\"Video\",\"Campaigns\"],\"mandate\":\"Content Creation & Influencer Marketing\"}]},\"step2\":{\"railWord\":\"Disciplines\",\"headline\":\"Specialized Disciplines\",\"caption\":\"Choose all deliverables and capabilities required for this engagement.\",\"disciplines\":[{\"id\":\"disc-1\",\"label\":\"Logo & Symbol Design\",\"defaultSelected\":true},{\"id\":\"disc-2\",\"label\":\"Brand Guidelines & Systems\",\"defaultSelected\":true},{\"id\":\"disc-3\",\"label\":\"UI\\/UX & Web Design\",\"defaultSelected\":false},{\"id\":\"disc-4\",\"label\":\"WordPress & E-Commerce\",\"defaultSelected\":false},{\"id\":\"disc-5\",\"label\":\"Social Media Management\",\"defaultSelected\":false},{\"id\":\"disc-6\",\"label\":\"Meta Ads & Performance\",\"defaultSelected\":false},{\"id\":\"disc-7\",\"label\":\"Reels & Video Production\",\"defaultSelected\":false},{\"id\":\"disc-8\",\"label\":\"Influencer Collaborations\",\"defaultSelected\":false}]},\"step3\":{\"railWord\":\"Allocation\",\"headline\":\"Capital Allocation (INR \\u20b9)\",\"caption\":\"Select your target budget tier and optional consultation window.\",\"tiers\":[{\"id\":\"tier-1\",\"amount\":\"< \\u20b915 Lakhs\",\"name\":\"Targeted Sprint\",\"defaultSelected\":false},{\"id\":\"tier-2\",\"amount\":\"\\u20b915L \\u2013 \\u20b930 Lakhs\",\"name\":\"Core Evolution\",\"defaultSelected\":true},{\"id\":\"tier-3\",\"amount\":\"\\u20b930L \\u2013 \\u20b960 Lakhs\",\"name\":\"Flagship Venture\",\"defaultSelected\":false},{\"id\":\"tier-4\",\"amount\":\"\\u20b960 Lakhs+\",\"name\":\"Comprehensive\",\"defaultSelected\":false}],\"timelineTitle\":\"Target Engagement Timeline\",\"timelines\":[{\"id\":\"tl-1\",\"label\":\"< 1 Month (Immediate)\",\"defaultSelected\":true},{\"id\":\"tl-2\",\"label\":\"1 \\u2013 3 Months (Standard)\",\"defaultSelected\":false},{\"id\":\"tl-3\",\"label\":\"3 \\u2013 6 Months (Strategic)\",\"defaultSelected\":false},{\"id\":\"tl-4\",\"label\":\"Flexible \\/ Exploring\",\"defaultSelected\":false}]},\"step4\":{\"railWord\":\"Session\",\"headline\":\"Strategy Session Window\",\"caption\":\"Select your preferred 30-minute consultation window with our design leadership.\",\"defaultYear\":2026,\"defaultMonth\":9,\"defaultDay\":28,\"timezone\":\"Asia\\/Kolkata (GMT+5:30)\",\"slots\":[\"11:00 AM IST\",\"02:30 PM IST\",\"04:30 PM IST\",\"06:00 PM IST\",\"08:00 PM IST\",\"03:00 PM IST\"],\"dateSlots\":{\"25\":[\"11:00 AM IST\",\"02:30 PM IST\",\"04:30 PM IST\",\"06:00 PM IST\",\"08:00 PM IST\",\"03:00 PM IST\"],\"26\":[\"11:00 AM IST\",\"02:30 PM IST\",\"04:30 PM IST\",\"06:00 PM IST\",\"08:00 PM IST\",\"03:00 PM IST\"],\"27\":[\"11:00 AM IST\",\"02:30 PM IST\",\"04:30 PM IST\",\"06:00 PM IST\",\"08:00 PM IST\",\"03:00 PM IST\"],\"28\":[\"11:00 AM IST\",\"02:30 PM IST\",\"04:30 PM IST\",\"06:00 PM IST\",\"08:00 PM IST\",\"03:00 PM IST\"],\"29\":[\"11:00 AM IST\",\"02:30 PM IST\",\"04:30 PM IST\",\"06:00 PM IST\",\"08:00 PM IST\",\"03:00 PM IST\"]},\"bookedDays\":[8,9],\"focusLabel\":\"Consultation Focus Area\",\"focusTopics\":[\"Logo Design & Visual Identity\",\"Brand Identity Development\",\"Website Design & Development\",\"Social Media & Digital Marketing\",\"Content Creation & Influencer Marketing\",\"Full 360\\u00b0 Studio Creative Partnership\"]},\"step5\":{\"railWord\":\"Credentials\",\"headline\":\"Credentials & Brief\",\"caption\":\"Your particulars and project brief.\",\"nameLabel\":\"Full Name *\",\"namePlaceholder\":\"e.g. Alexander Vance\",\"emailLabel\":\"Corporate Email *\",\"emailPlaceholder\":\"e.g. example@gmail.com\",\"orgLabel\":\"Enterprise \\/ Brand *\",\"orgPlaceholder\":\"e.g. 1928 Creative Studio\",\"phoneLabel\":\"Contact Number *\",\"phonePlaceholder\":\"98765 00000\",\"visionLabel\":\"Project Vision & Strategic Ambition *\",\"visionPlaceholder\":\"Describe the strategic objectives, core challenges, and architectural scale...\",\"ndaText\":\"Execute Bilateral Non-Disclosure Agreement (NDA) prior to review.\",\"submitBtnText\":\"Submit Project Brief\",\"successTitle\":\"BRIEF SUBMITTED.\",\"successDesc\":\"Thank you. Your confidential brief has been received by our leadership. We will review your scope parameters and respond within 24 hours.\",\"resetBtnText\":\"Submit Another Brief\"}}'),
('cta_primary_text', 'Start a Project'),
('cta_secondary_text', 'Tell us what you\'re building'),
('email', 'studio@1928creativestudio.com'),
('established', '1928'),
('home_services', '{\"cover\":{\"title\":\"Capabilities Index\",\"sub\":\"06 CORE DISCIPLINES - ONE CREATIVE PARTNER\",\"jacketBtnText\":\"Explore our capabilities\",\"jacketBtnLink\":\"services.html\"},\"cards\":[{\"id\":\"home-card-1\",\"num\":\"01\",\"watermark\":\"01\",\"sheetTitle\":\"Logo Design\",\"sheetSub\":\"VISUAL IDENTITY \\u00b7 FIRST IMPRESSION\",\"badge\":\"VISUAL IDENTITY \\u00b7 FIRST IMPRESSION\",\"title\":\"01. Logo Design\",\"leadDesc\":\"A distinctive mark that gives your business a memorable identity.\",\"bodyDesc\":\"We create thoughtful logos that capture your brand\\u2019s character and give it a strong visual presence across every touchpoint.\",\"deliverables\":[\"Custom Logos\",\"Wordmarks\",\"Monograms\",\"Symbols\",\"Typography\"],\"actionLink\":\"service-logo-design.html\",\"actionText\":\"Explore Service\",\"pagination\":\"01 \\/ 05\",\"mediaUrl\":\"assets\\/uploads\\/1928_1792831281_Screen-Recording-2026-09-23-164649.mp4\"},{\"id\":\"home-card-2\",\"num\":\"02\",\"watermark\":\"02\",\"sheetTitle\":\"Brand Identity\",\"sheetSub\":\"STRATEGY \\u00b7 GUIDELINE \\u00b7 SYSTEM\",\"badge\":\"BRAND STRATEGY \\u00b7 IDENTITY SYSTEM\",\"title\":\"02. Brand Identity Development\",\"leadDesc\":\"A complete identity built around what makes your business different.\",\"bodyDesc\":\"We turn your story, positioning and personality into a cohesive brand system designed to build recognition and lasting value.\",\"deliverables\":[\"Brand Strategy\",\"Visual Identity\",\"Colour\",\"Typography\",\"Guidelines\"],\"actionLink\":\"service-brand-identity.html\",\"actionText\":\"Explore Service\",\"pagination\":\"02 \\/ 05\",\"mediaUrl\":\"\"},{\"id\":\"home-card-3\",\"num\":\"03\",\"watermark\":\"03\",\"sheetTitle\":\"Website Design\",\"sheetSub\":\"DIGITAL \\u00b7 EXPERIENCE \\u00b7 MOTION\",\"badge\":\"DIGITAL EXPERIENCE \\u00b7 DESIGN & DEVELOPMENT\",\"title\":\"03. Website Design & Development\",\"leadDesc\":\"Digital experiences that make your brand feel as good as it looks.\",\"bodyDesc\":\"We design and develop purposeful websites that bring your story to life, create meaningful interactions and turn attention into action.\",\"deliverables\":[\"UI\\/UX\",\"Web Design\",\"Development\",\"E-commerce\",\"Motion\"],\"actionLink\":\"service-website-development.html\",\"actionText\":\"Explore Service\",\"pagination\":\"03 \\/ 05\",\"mediaUrl\":\"\"},{\"id\":\"home-card-4\",\"num\":\"04\",\"watermark\":\"04\",\"sheetTitle\":\"Social & Digital\",\"sheetSub\":\"VISIBILITY \\u00b7 CONNECTION \\u00b7 GROWTH\",\"badge\":\"DIGITAL PRESENCE \\u00b7 STRATEGY & GROWTH\",\"title\":\"04. Social Media & Digital Marketing\",\"leadDesc\":\"A digital presence designed to keep your brand moving forward.\",\"bodyDesc\":\"We combine creative thinking with strategic marketing to build visibility, meaningful engagement and stronger connections with your audience.\",\"deliverables\":[\"Social Strategy\",\"Content\",\"Meta Ads\",\"Google Ads\",\"SEO\"],\"actionLink\":\"service-digital-marketing.html\",\"actionText\":\"Explore Service\",\"pagination\":\"04 \\/ 05\",\"mediaUrl\":\"\"},{\"id\":\"home-card-5\",\"num\":\"05\",\"watermark\":\"05\",\"sheetTitle\":\"Content & Influence\",\"sheetSub\":\"STORY \\u00b7 CREATORS \\u00b7 CONNECTION\",\"badge\":\"CAMPAIGNS \\u00b7 PRODUCTION \\u00b7 CREATOR NETWORK\",\"title\":\"05. Content Creation & Influencer Marketing\",\"leadDesc\":\"We create stories worth seeing and partnerships worth remembering.\",\"bodyDesc\":\"From original content to carefully chosen creator collaborations, we build campaigns that give your brand a stronger voice, wider reach, and lasting audience connection.\",\"deliverables\":[\"Content Strategy\",\"Creative Production\",\"Creator Partnerships\",\"Campaigns\",\"Social Content\"],\"actionLink\":\"service-content-creation.html\",\"actionText\":\"Explore Service\",\"pagination\":\"05 \\/ 05\",\"mediaUrl\":\"\"}]}'),
('instagram', 'https://instagram.com'),
('linkedin', 'https://linkedin.com'),
('location', 'Ahmedabad, India · Global Practice'),
('perspectives_curation', '{\"heroTickerIds\":[\"art-monogram\",\"art-spatial\",\"art-webgl\",\"art-fluted\",\"art-monochrome\",\"art-kinetic\",\"art-neural\",\"art-sensory\"],\"featuredCarouselIds\":[\"art-monogram\",\"art-spatial\",\"art-webgl\",\"art-fluted\"],\"codexGridIds\":[\"art-spatial\",\"art-webgl\",\"art-fluted\",\"art-kinetic\",\"art-monochrome\",\"art-quiet\"],\"codexCount\":6}'),
('phone', '+91 98250 19280'),
('studio_name', '1928 Creative Studio'),
('twitter', 'https://twitter.com');

SET FOREIGN_KEY_CHECKS = 1;
