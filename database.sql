-- ══════════════════════════════════════════════════════════════════════════
-- 1928 CREATIVE STUDIO — Master MySQL Database Schema & Initial Data Dump
-- Designed for Core PHP, MySQL, Laragon & phpMyAdmin
-- ══════════════════════════════════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS `1928_studio_cms` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `1928_studio_cms`;

-- --------------------------------------------------------
-- Table 1: `seo_meta` (Page-specific SEO Titles, Descriptions & Keywords)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `seo_meta`;
CREATE TABLE `seo_meta` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `page_key` VARCHAR(50) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `keywords` TEXT DEFAULT NULL,
  `og_image` VARCHAR(255) DEFAULT 'img/hero-luxury.jpg',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `seo_meta` (`page_key`, `title`, `description`, `keywords`, `og_image`) VALUES
('global', '1928 Creative Studio', '1928 Creative Studio sculpts iconic visual identities, immersive digital platforms, spatial environments, and transformative brand campaigns.', 'brand engineering, luxury identity, webgl digital platforms, spatial design, strategy, creative studio', 'img/hero-luxury.jpg'),
('home', '1928 Creative Studio · Independent Brand Engineering & Digital Architecture', '1928 Creative Studio sculpts iconic visual identities, immersive digital platforms, spatial environments, and transformative brand campaigns.', '1928 creative studio, brand architecture, luxury branding agency, high-end web design, digital experiences, ahmedabad branding studio', 'img/hero-luxury.jpg'),
('about', 'About · 1928 Creative Studio — Origins, Philosophy & Principles', '1928 Creative Studio is an independent brand engineering practice sculpting iconic visual identities, spatial environments, and digital platforms.', 'about 1928 studio, brand philosophy, studio origins, strategic design practice, creative direction, design team', 'img/hero-luxury.jpg'),
('services', 'Services & Capabilities · 1928 Creative Studio', 'Comprehensive creative capabilities: Brand Strategy, Visual Identity Systems, WebGL Digital Architecture, Spatial Design, and High-Impact Content Creation.', 'brand identity services, web design services, packaging design, digital marketing, corporate branding, webgl development', 'img/hero-luxury.jpg'),
('portfolio', 'Work & Archives · 1928 Creative Studio', 'A curated selection of branding, digital experiences, content, and spatial work created to solve real business challenges and build market leaders.', '1928 portfolio, luxury case studies, brand identity projects, web design portfolio, packaging design showcase', 'img/hero-luxury.jpg'),
('blogs', 'Perspectives · 1928 Creative Studio — Strategic Design Research & Cultural Theorems', 'A provocative research laboratory and editorial codex exploring mathematical brand geometry, computational spatial physics, and luxury market dominance.', 'design perspectives, brand research, typography theorems, digital architecture insights, creative strategy blog', 'img/hero-luxury.jpg'),
('contact', 'Start a Project · 1928 Creative Studio', 'Connect with 1928 Creative Studio to engineer your next iconic visual identity, digital flagship, or transformative brand expansion.', 'contact 1928, hire branding agency, project inquiry, luxury studio contact, creative consultation', 'img/hero-luxury.jpg');

-- --------------------------------------------------------
-- Table 2: `studio_profile` (Origins, Pillars & Story)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `studio_profile`;
CREATE TABLE `studio_profile` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `story_headline` VARCHAR(255) NOT NULL,
  `story_description` TEXT NOT NULL,
  `pillars_json` LONGTEXT NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `studio_profile` (`story_headline`, `story_description`, `pillars_json`) VALUES
('WE TURN AMBITION INTO MOMENTUM.', 'Built by people who believe every business has the potential to become a meaningful brand.', '[{"num":"01","tag":"FOUNDATION","text":"1928 Creative Studio was founded by Ami and Tushar, bringing together creative thinking, strategic direction and digital expertise under one roof.","sub":"STRATEGY + CRAFT"},{"num":"02","tag":"EXPERIENCE","text":"With 10+ years of experience, we work with businesses to shape how they look, how they communicate, and how they grow.","sub":"10+ YEARS EXPERTISE"},{"num":"03","tag":"INTEGRATION","text":"From identity and digital experiences to content, marketing and influence, we help businesses move closer to their goals, with every part of the brand working together.","sub":"COMPLETE LIFECYCLE"}]');

-- --------------------------------------------------------
-- Table 3: `team_members` (Studio Minds & Leadership Roster)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `team_members`;
CREATE TABLE `team_members` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `member_key` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `role` VARCHAR(150) NOT NULL,
  `photo` VARCHAR(255) NOT NULL,
  `display_order` INT DEFAULT 1,
  `active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `team_members` (`member_key`, `name`, `role`, `photo`, `display_order`, `active`) VALUES
('ami', 'Ami Panchal', 'Founder & Creative + Strategy Head', 'img/team-ami.jpg', 1, 1),
('tushar', 'Tushar Panchal', 'Founder & Marketing Head', 'img/team-tusar.jpg', 2, 1),
('trusha', 'Trusha Panchal', 'Senior Graphic Designer', 'img/team-elena.jpg', 3, 1),
('harsh', 'Harsh Patel', 'Senior Video Editor', 'img/team-kaito.jpg', 4, 1),
('urvish', 'Urvish Mistry', 'Junior Video Editor + Community Manager', 'img/team-ami.jpg', 5, 1),
('priyal', 'Priyal Lunkar', 'Social Media Manager', 'img/team-elena.jpg', 6, 1);

-- --------------------------------------------------------
-- Table 4: `studio_principles` (Beliefs & Core Methodologies)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `studio_principles`;
CREATE TABLE `studio_principles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `principle_id` VARCHAR(50) NOT NULL UNIQUE,
  `num` VARCHAR(10) NOT NULL,
  `pill` VARCHAR(100) NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `description` TEXT NOT NULL,
  `tags_json` TEXT NOT NULL,
  `display_order` INT DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `studio_principles` (`principle_id`, `num`, `pill`, `title`, `description`, `tags_json`, `display_order`) VALUES
('p1', '01', 'Think With Purpose', 'STRATEGIC THINKING', 'We start with the bigger picture. Your goals, audience, market and ambition shape every creative decision we make.', '["BUSINESS FIRST", "CLEAR DIRECTION", "PURPOSEFUL IDEAS"]', 1),
('p2', '02', 'Make It Matter', 'DISTINCTIVE CRAFT', 'Every detail has a role. We create identities and experiences with clarity, character and a visual point of view that people remember.', '["DETAIL", "CHARACTER", "RECOGNITION"]', 2),
('p3', '03', 'Create Real Connection', 'HUMAN CONNECTION', 'Great brands connect before they convert. We build stories, content and experiences that feel relevant, natural and human.', '["STORY", "CULTURE", "CONNECTION"]', 3),
('p4', '04', 'Create Lasting Value', 'BUILT FOR GROWTH', 'A stronger brand should create opportunities for a stronger business. We design every touchpoint with growth, relevance and long-term value in mind.', '["BRAND", "BUSINESS", "GROWTH"]', 4);

-- --------------------------------------------------------
-- Table 5: `services` (Core Studio Capabilities & Deliverables)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `services`;
CREATE TABLE `services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `service_id` VARCHAR(50) NOT NULL UNIQUE,
  `num` VARCHAR(10) NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `tagline` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `deliverables_json` TEXT NOT NULL,
  `display_order` INT DEFAULT 1,
  `active` TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `services` (`service_id`, `num`, `title`, `tagline`, `description`, `deliverables_json`, `display_order`, `active`) VALUES
('svc-logo', '01', 'Logo Design & Systems', 'Distinctive Marks with Structural Precision', 'We design enduring logos and visual hallmarks that anchor brand recognition and scale effortlessly across physical and digital mediums.', '["Primary & Secondary Marks", "Monogram Architecture", "Vector Master Codex", "Usage Guidelines"]', 1, 1),
('svc-brand', '02', 'Brand Identity Development', 'End-to-End Visual & Strategic Universes', 'From custom typography and color chemistry to tactile collateral and brand books, we build complete identities that command prestige.', '["Full Identity Guidelines", "Custom Typography Systems", "Packaging Direction", "Collateral Suite"]', 2, 1),
('svc-web', '03', 'Website Design & Development', 'High-Performance WebGL & Digital Flagships', 'Interactive digital platforms engineered with kinetic physics, fluid responsiveness, and conversion architecture to turn visitors into advocates.', '["Custom UI/UX Architecture", "WebGL & Kinetic Micro-Interactions", "CMS Integration", "Ultra-Fast Optimization"]', 3, 1),
('svc-social', '04', 'Social Media & Digital Marketing', 'High-Frequency Cultural Relevance & Growth', 'Strategic campaign direction, algorithmic content distribution, and brand narrative engineering to drive sustained engagement.', '["Content Strategy & Calendar", "Performance Ad Creatives", "Grid Architecture", "Community Growth Playbook"]', 4, 1),
('svc-content', '05', 'Content Creation & Influencer Marketing', 'Cinema-Grade Storytelling & Strategic Partnerships', 'Editorial video production, 3D visual effects, and curated influencer collaborations that place your brand in the cultural conversation.', '["4K Video Production", "3D Motion Graphics", "Talent Curation & Briefing", "Campaign Telemetry"]', 5, 1);

-- --------------------------------------------------------
-- Table 6: `clients` (Client & Partner Logos / Vector SVG)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `clients`;
CREATE TABLE `clients` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `client_id` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `subtitle` VARCHAR(150) DEFAULT NULL,
  `website_url` VARCHAR(255) DEFAULT '#',
  `logo_type` ENUM('svg', 'image') DEFAULT 'svg',
  `svg_code` MEDIUMTEXT DEFAULT NULL,
  `image_url` VARCHAR(255) DEFAULT NULL,
  `display_order` INT DEFAULT 1,
  `active` TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `clients` (`client_id`, `name`, `subtitle`, `website_url`, `logo_type`, `svg_code`, `image_url`, `display_order`, `active`) VALUES
('client-oberoi', 'The Oberoi Group', 'Luxury Hospitality & Leisure', '#', 'svg', '<svg viewBox=\"0 0 160 40\" class=\"brand-logo-svg\"><path d=\"M 25 20 C 25 12, 35 12, 35 20 C 35 28, 25 28, 25 20 Z M 20 20 C 20 8, 40 8, 40 20 C 40 32, 20 32, 20 20 Z\" fill=\"#E51937\"/><text x=\"48\" y=\"26\" font-family=\"\'Montserrat\', sans-serif\" font-weight=\"700\" font-size=\"15\" fill=\"currentColor\" letter-spacing=\"3px\">OBEROI</text></svg>', NULL, 1, 1),
('client-taj', 'Taj Hotels & Palaces', 'Heritage Luxury & Resorts', '#', 'svg', '<svg viewBox=\"0 0 160 40\" class=\"brand-logo-svg\"><path d=\"M 20 28 L 30 10 L 40 28 Z M 27 22 L 33 22\" stroke=\"#E51937\" stroke-width=\"2\" fill=\"none\"/><text x=\"50\" y=\"26\" font-family=\"\'Montserrat\', sans-serif\" font-weight=\"800\" font-size=\"16\" fill=\"currentColor\" letter-spacing=\"4px\">TAJ</text></svg>', NULL, 2, 1),
('client-leela', 'The Leela Palaces', 'Palaces, Hotels & Resorts', '#', 'svg', '<svg viewBox=\"0 0 160 40\" class=\"brand-logo-svg\"><circle cx=\"28\" cy=\"20\" r=\"10\" stroke=\"currentColor\" stroke-width=\"1.5\" fill=\"none\"/><circle cx=\"28\" cy=\"20\" r=\"4\" fill=\"#E51937\"/><text x=\"46\" y=\"25\" font-family=\"\'Montserrat\', sans-serif\" font-weight=\"700\" font-size=\"14\" fill=\"currentColor\" letter-spacing=\"2.5px\">THE LEELA</text></svg>', NULL, 3, 1),
('client-itc', 'ITC Luxury Collection', 'Sustainable Hospitality', '#', 'svg', '<svg viewBox=\"0 0 160 40\" class=\"brand-logo-svg\"><rect x=\"18\" y=\"12\" width=\"22\" height=\"16\" fill=\"none\" stroke=\"#E51937\" stroke-width=\"2\"/><text x=\"23\" y=\"25\" font-family=\"\'Montserrat\', sans-serif\" font-weight=\"900\" font-size=\"12\" fill=\"currentColor\">ITC</text><text x=\"48\" y=\"25\" font-family=\"\'Montserrat\', sans-serif\" font-weight=\"600\" font-size=\"13\" fill=\"currentColor\" letter-spacing=\"2px\">HOTELS</text></svg>', NULL, 4, 1),
('client-sotheby', 'Sotheby\'s Realty', 'International Realty & Estates', '#', 'svg', '<svg viewBox=\"0 0 160 40\" class=\"brand-logo-svg\"><text x=\"10\" y=\"25\" font-family=\"\'Montserrat\', sans-serif\" font-weight=\"700\" font-size=\"13.5\" fill=\"currentColor\" letter-spacing=\"1px\">SOTHEBY\'S</text><circle cx=\"120\" cy=\"18\" r=\"3\" fill=\"#E51937\"/></svg>', NULL, 5, 1),
('client-crest', 'Crest Luxury Assets', 'Private Equity & Assets', '#', 'svg', '<svg viewBox=\"0 0 160 40\" class=\"brand-logo-svg\"><polygon points=\"30,8 42,32 18,32\" stroke=\"#E51937\" stroke-width=\"2\" fill=\"none\"/><text x=\"50\" y=\"26\" font-family=\"\'Montserrat\', sans-serif\" font-weight=\"800\" font-size=\"16\" fill=\"currentColor\" letter-spacing=\"2px\">CREST</text></svg>', NULL, 6, 1),
('client-kinesis', 'Kinesis', 'Spatial Identity', '#', 'svg', '<svg viewBox=\"0 0 160 40\" class=\"brand-logo-svg\"><path d=\"M 25 20 Q 35 10 45 20 T 65 20\" stroke=\"#E51937\" stroke-width=\"3\" fill=\"none\"/><text x=\"75\" y=\"25\" font-family=\"\'Montserrat\', sans-serif\" font-weight=\"800\" font-size=\"16\" fill=\"currentColor\">KINESIS</text></svg>', NULL, 7, 1),
('client-aura', 'Aura Systems', 'Visual Systems', '#', 'svg', '<svg viewBox=\"0 0 160 40\" class=\"brand-logo-svg\"><circle cx=\"40\" cy=\"20\" r=\"8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"60\" y=\"26\" font-family=\"\'Montserrat\', sans-serif\" font-weight=\"800\" font-size=\"18\" fill=\"currentColor\" letter-spacing=\"1px\">AURA</text></svg>', NULL, 8, 1),
('client-jukku', 'Jukku Digital', 'Digital Growth', '#', 'svg', '<svg viewBox=\"0 0 160 40\" class=\"brand-logo-svg\"><text x=\"80\" y=\"26\" text-anchor=\"middle\" font-family=\"\'Montserrat\', sans-serif\" font-weight=\"900\" font-size=\"20\" fill=\"#C8102E\" letter-spacing=\"1px\">JUKKU</text></svg>', NULL, 9, 1),
('client-synapse', 'Synapse', 'Product Architecture', '#', 'svg', '<svg viewBox=\"0 0 160 40\" class=\"brand-logo-svg\"><circle cx=\"30\" cy=\"20\" r=\"6\" fill=\"#E51937\"/><circle cx=\"45\" cy=\"20\" r=\"6\" fill=\"currentColor\"/><text x=\"60\" y=\"26\" font-family=\"\'Montserrat\', sans-serif\" font-weight=\"800\" font-size=\"16\" fill=\"currentColor\">SYNAPSE</text></svg>', NULL, 10, 1),
('client-monolith', 'Monolith', 'Spatial Design', '#', 'svg', '<svg viewBox=\"0 0 160 40\" class=\"brand-logo-svg\"><rect x=\"25\" y=\"10\" width=\"18\" height=\"20\" fill=\"currentColor\"/><text x=\"52\" y=\"26\" font-family=\"\'Montserrat\', sans-serif\" font-weight=\"900\" font-size=\"16\" fill=\"currentColor\">MONOLITH</text></svg>', NULL, 11, 1),
('client-solaris', 'Solaris Energy', 'Energy & Innovation', '#', 'svg', '<svg viewBox=\"0 0 160 40\" class=\"brand-logo-svg\"><polygon points=\"35,12 45,20 35,28\" fill=\"#E51937\"/><text x=\"55\" y=\"26\" font-family=\"\'Montserrat\', sans-serif\" font-weight=\"800\" font-size=\"16\" fill=\"currentColor\" letter-spacing=\"1.5px\">SOLARIS</text></svg>', NULL, 12, 1);

-- --------------------------------------------------------
-- Table 7: `portfolio` (Case Studies & Bento Matrix)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `portfolio`;
CREATE TABLE `portfolio` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` VARCHAR(50) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `client` VARCHAR(255) NOT NULL,
  `category_keys` VARCHAR(255) NOT NULL,
  `category_display` VARCHAR(255) NOT NULL,
  `tag_pill` VARCHAR(100) NOT NULL,
  `grid_span` VARCHAR(50) DEFAULT 'bento-compact',
  `year` VARCHAR(10) DEFAULT '2025',
  `cover_image` VARCHAR(255) NOT NULL,
  `summary` TEXT NOT NULL,
  `challenge` TEXT DEFAULT NULL,
  `approach` TEXT DEFAULT NULL,
  `impact` TEXT DEFAULT NULL,
  `metrics_json` TEXT DEFAULT NULL,
  `featured` TINYINT(1) DEFAULT 1,
  `display_order` INT DEFAULT 1,
  `active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `portfolio` (`project_id`, `title`, `client`, `category_keys`, `category_display`, `tag_pill`, `grid_span`, `year`, `cover_image`, `summary`, `challenge`, `approach`, `impact`, `metrics_json`, `featured`, `display_order`, `active`) VALUES
('aurora', 'Aurora Chronometer Systems', 'Aurora Horology Geneve', 'brand-identity web-design logo-design', 'Swiss Luxury Brand Identity & 3D Vault', 'Horology & WebGL', 'bento-wide', '2025', 'img/port-chronos.jpg', 'A complete haute horlogerie visual identity system, architectural physical packaging, and custom WebGL timekeeper showcase.', 'Positioning an independent Geneva watchmaker against century-old heritage conglomerates without diluting precision credentials.', 'Designed a monolithic titanium-grade visual identity system paired with an interactive 120fps WebGL virtual tourbillon configurator.', 'Sold out the inaugural 100-piece production run within 72 hours of global digital launch.', '[{"label":"Market Valuation Uplift","value":"+340%"},{"label":"Private Vault Inquiries","value":"4.8k"},{"label":"Global Design Accolades","value":"04"}]', 1, 1, 1),
('veloce', 'Veloce Hypercraft Platforms', 'Veloce Automobili Modena', 'web-design brand-identity', 'Automotive Digital Flagship & Raytraced Configurator', 'Automotive & 3D', 'bento-compact', '2025', 'img/port-veloce.jpg', 'Digital ecosystem engineered for electric hypercar customization with real-time shader material simulation.', 'Overcoming web browser rendering bottlenecks to showcase real-time carbon-fiber weave finishes.', 'Developed custom GLSL fragment shaders simulating accurate photonic refractions across curved hypercar body panels.', 'Acquired 18 qualified bespoke hypercar custom orders prior to physical prototype reveals.', '[{"label":"Avg Interactive Duration","value":"6.4 Min"},{"label":"VIP Allocations Reserved","value":"100%"},{"label":"Frame-Rate Target","value":"120 FPS"}]', 1, 2, 1),
('elysian', 'Elysian High Jewelry & Fragrance', 'Maison Elysian Paris', 'spatial-packaging brand-identity', 'Haute Parfumerie Flacon & Travertine Flagship', 'Packaging & Spatial', 'bento-compact', '2025', 'img/port-elysian.jpg', 'Fluted lead-free crystal flacon architecture, weighted magnetic closures, and Milan flagship sensory environment.', 'Transforming high perfumery into a sculptural tactile artifact that commands heirloom status.', 'Engineered a 480-gram crystal monolith with 1.2N acoustic magnetic snaps and brutalist travertine store fixtures.', 'Expanded across 14 premier luxury department stores in Paris, Tokyo, and New York.', '[{"label":"Retail Revenue per Sq.Ft","value":"€4,200"},{"label":"Packaging Retention Rate","value":"96%"}]', 1, 3, 1),
('noir-atelier', 'Noir Spatial Architecture & Flagship', 'Noir Fashion Group Milan', 'spatial-packaging brand-identity', 'Brutalist Travertine Flagship Architecture', 'Spatial Architecture', 'bento-wide', '2024', 'img/port-noir.jpg', 'Monolithic interior architecture, directional soundscapes, and negative-space lighting choreography.', 'Eliminating the commercial feel of traditional retail to create an immersive museum-grade sanctum.', 'Incorporated unpolished split-face Roman travertine walls, 2700K surgical beam spotlights, and acoustic felt baffles.', 'Won Milan Retail Architecture Design of the Year.', '[{"label":"Footfall Dwell Duration","value":"+210%"},{"label":"Conversion Velocity","value":"38%"}]', 1, 4, 1),
('lumina', 'Lumina Neural Aesthetics Platform', 'Lumina AI Zurich', 'web-design brand-identity', 'Liquid Metal UI & Generative Research Interface', 'AI Interface & WebGL', 'bento-wide', '2024', 'img/port-lumina.jpg', 'Generative liquid chrome shader interfaces representing deep neural state transformations.', 'Making complex deep learning workflows feel human, organic, and visually captivating.', 'Replaced sterile SaaS dashboard widgets with dynamic fluid simulations that adapt to computational confidence.', 'Positioned Lumina as the definitive luxury interface in enterprise artificial intelligence.', '[{"label":"Series A Raised","value":"$24M"},{"label":"User Retention Rate","value":"88%"}]', 1, 5, 1),
('bugatti', 'Bugatti Centodieci Collector Codex', 'Bugatti Automobiles Molsheim', 'spatial-packaging brand-identity', 'Aerospace Carbon Fiber Presentation Codex', 'Collector Codex', 'bento-compact', '2024', 'img/port-spectra.jpg', 'Limited-edition bespoke carbon-bound hardcover monograph and archival collector packaging.', 'Designing an archival asset worthy of a multi-million dollar hypercar acquisition.', 'Handcrafted binding using aerospace carbon fiber weaves, silver-foil typography, and custom milled aluminum case.', 'Catalogued into premier private automotive archives globally.', '[{"label":"Limited Edition Print Run","value":"110 Copies"},{"label":"Collector Satisfaction","value":"100%"}]', 1, 6, 1),
('juventus', 'Juventus Brand System', 'Juventus Football Club', 'brand-identity logo-design', 'Global Iconic Identity & Sensory Stadium Experience', 'Global Icon', 'bento-compact', '2024', 'img/wc-top.jpg', 'Global visual identity system, brand guidelines, and sensory stadium experience touchpoints.', 'Reinventing a century-old heritage sports club into a global lifestyle and entertainment brand.', 'Stripped away legacy shields to introduce an iconic minimalist J-monogram and black/white architectural identity.', 'Became the most recognized contemporary sports rebrand of the decade.', '[{"label":"Global Merchandise Uplift","value":"+42%"},{"label":"Brand Value Growth","value":"€180M"}]', 1, 7, 1),
('balenciaga', 'Balenciaga Couture Spatial Architecture', 'Balenciaga Paris', 'spatial-packaging brand-identity', 'Monolithic Retail Fixtures & Runway Scenography', 'Couture Spatial', 'bento-compact', '2024', 'img/wc-mid.jpg', 'Architectural spatial system, monolithic raw-concrete retail fixtures, and kinetic runway scenography.', 'Translating post-luxury couture aesthetics into visceral physical and retail spaces.', 'Raw industrial concrete monoliths contrasted with razor-sharp dynamic LED grids and brushed steel display cases.', 'Implemented across premier flagships in Paris, New York, and Seoul.', '[{"label":"Flagship Footfall Increase","value":"+65%"},{"label":"Runway Live Impressions","value":"18M"}]', 1, 8, 1),
('polene', 'Polène Paris Leather Goods', 'Polène Paris', 'spatial-packaging brand-identity', 'Sculptural Leather Goods Packaging & 3D Assets', 'Luxury Atelier', 'bento-compact', '2024', 'img/wc-bot.jpg', 'Sculptural leather goods packaging, tactile materiality, and 3D architectural campaign assets.', 'Crafting unboxing rituals that honor organic curves and leather artisanry.', 'Sculpted organic box architectures with hidden magnetic pivots and debossed metallic signatures.', 'Elevated brand perception into premier tier luxury leather goods.', '[{"label":"D2C Global Conversion","value":"+28%"},{"label":"Organic Viral Reach","value":"5.4M"}]', 1, 9, 1),
('rimowa', 'Rimowa Monolith Archive', 'Rimowa Cologne', 'web-design brand-identity', 'Monolithic Digital Flagship & 3D WebGL Configurator', 'Industrial Luxury', 'bento-compact', '2024', 'img/f-brand-3.jpg', 'Monolithic digital flagship, aluminum 3D configurator, and high-velocity global checkout experience.', 'Building a digital flagship reflecting the precision grooves and lifetime durability of aluminum travel cases.', 'Engineered real-time WebGL grooved aluminum reflections with personalized laser-engraving simulations.', 'Highest online customizer engagement rate in brand history.', '[{"label":"Configurator Engagement","value":"4.8 Min"},{"label":"Mobile Checkout Speed","value":"1.2s"}]', 1, 10, 1);

-- --------------------------------------------------------
-- Table 8: `blogs` (Complete 17 Editorial Perspectives & Monographs)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `blogs`;
CREATE TABLE `blogs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `blog_id` VARCHAR(50) NOT NULL UNIQUE,
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `category_slug` VARCHAR(100) NOT NULL,
  `city` VARCHAR(100) DEFAULT 'London, UK',
  `author` VARCHAR(100) NOT NULL,
  `author_role` VARCHAR(150) DEFAULT 'Studio Principal & Brand Architect',
  `initials` VARCHAR(10) DEFAULT '19',
  `date_text` VARCHAR(50) NOT NULL,
  `read_time` VARCHAR(50) NOT NULL,
  `cover_image` VARCHAR(255) NOT NULL,
  `excerpt` TEXT NOT NULL,
  `content_html` LONGTEXT NOT NULL,
  `published` TINYINT(1) DEFAULT 1,
  `display_order` INT DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `blogs` (`blog_id`, `slug`, `title`, `category`, `category_slug`, `city`, `author`, `author_role`, `initials`, `date_text`, `read_time`, `cover_image`, `excerpt`, `content_html`, `published`, `display_order`) VALUES
('art-monogram', 'monolithic-luxury-monogram', 'The Monolithic Luxury Monogram as an Enduring Landmark', 'BRAND ARCHITECTURE', 'brand-architecture', 'London, UK', 'Jay Thaker', 'Studio Principal & Brand Architect', 'JT', 'SEP 2026', '7 MIN READ', 'img/port-chronos.jpg', 'How high-growth luxury houses engineer mathematically rigorous marks to command enduring global authority.', '<h2>01. The Strategic Shift</h2><p>For over two centuries, luxury identity was anchored in typographic ornamentation: delicate high-contrast Didone serifs, hand-engraved filigree, and intricate crests meant to signify aristocratic provenance. Today, that aesthetic vocabulary is encountering severe friction in a computational world governed by high-density digital micro-surfaces and monolithic physical environments.</p><div class=\"reader-pullquote\"><p>\"A modern luxury monogram is no longer an emblem of aristocracy; it is an architectural mathematical vector engineered for zero-latency cognitive recognition.\"</p></div><h2>02. Mathematical Geometry &amp; Reductive Precision</h2><p>When 1928 Creative Studio engineers an enduring monogram, we adhere to strict proportion physics: optical stroke compensation, bespoke grid alignments, and modular counter-space balances. A mark must retain commanding presence whether machined at 3mm on a surgical titanium horology crown or laser-projected 100 meters wide across an airport terminal facade.</p>', 1, 1),
('art-spatial', 'spatial-choreography-flagship-retail', 'Spatial Choreography Across Modern Architectural Luxury Flagship Retail', 'SPATIAL DESIGN', 'spatial-design', 'Milan, Italy', 'Elena Vance', 'Spatial Design Director', 'EV', 'AUG 2026', '6 MIN READ', 'img/port-veloce.jpg', 'Choreographing visitor trajectories through brutalist travertine monoliths, directional acoustics, and negative-space compression.', '<h2>01. The Sensory Environment</h2><p>Physical retail in 2026 is no longer about inventory distribution; it is sensory brand communion. When a client crosses the threshold into a physical flagship, every sensory input—the acoustic reverberation time of polished concrete, the color temperature of 2700K recessed spotlights, and the scent of custom cedarwood—instantly primes their valuation perception.</p><div class=\"reader-pullquote\"><p>\"The space itself is the most powerful salesperson. When architecture radiates permanence, price resistance dissipates.\"</p></div><h2>02. Monolithic Material Physics</h2><p>We specify raw split-face travertine, blackened brushed steel, and acoustic felt panels to establish a temple-like reverence. Clients spend 3.2x longer inside acoustically damped private VIP suites than open retail floors.</p>', 1, 2),
('art-webgl', 'computational-raytracing-webgl', 'Zero Latency Computational Raytracing in WebGL Interactive Ecosystems', 'COMPUTATIONAL WEBGL', 'computational-webgl', 'Tokyo, Japan', 'Kaito Tanaka', 'Lead Shader Engineer', 'KT', 'AUG 2026', '5 MIN READ', 'img/port-lumina.jpg', 'Synthesizing custom GLSL physically-based surface shaders for real-time metallic reflections at native 120 FPS.', '<h2>01. Beyond the Flat 2D Web</h2><p>Static JPEG mockups and auto-playing video loops are remnants of a bygone digital era. The contemporary luxury buyer demands agency—the power to inspect sub-millimeter stitching on an automotive interior or rotate a tourbillon watch under real-time procedural lighting.</p><div class=\"reader-pullquote\"><p>\"Interactive 3D WebGL is not a gimmick; it is the closest digital surrogate to physical touch.\"</p></div><h2>02. Custom GLSL Fragment Shaders</h2><p>By compiling custom GLSL fragment shaders and implementing procedural normal map decompression, we achieve buttery 120fps performance across mobile Safari and desktop Chrome without draining device thermals.</p>', 1, 3),
('art-fluted', 'tactile-acoustic-snaps-travertine', 'Tactile Acoustic Snaps and Travertine in Bespoke Packaging', 'PACKAGING & SPATIAL', 'packaging-spatial', 'Paris, France', 'Ami Patel', 'Materials & Packaging Specialist', 'AP', 'JUL 2026', '8 MIN READ', 'img/port-elysian.jpg', 'The psychophysics of 45-decibel acoustic closures, haptic friction coefficients, and unboxing rituals in ultra-luxury design.', '<h2>01. The Tactile Physics of Glass</h2><p>Weight is perceived as quality. A perfume vessel weighing 480 grams with an internal magnetic snap rated at 1.2 Newtons immediately communicates $300+ value before the atomizer is ever depressed.</p><div class=\"reader-pullquote\"><p>\"The tactile sensation of opening a luxury package triggers dopamine pathways faster than visual advertising.\"</p></div><h2>02. Light Refraction &amp; Fluting Tolerances</h2><p>Precision micro-fluting cut into lead-free crystal glass bends ambient gallery spotlights into vertical prismatic rays, transforming the fragrance liquid into a radiant glowing beacon.</p>', 1, 4),
('art-monochrome', '99-percent-black-spectrum', 'The 99% Black Spectrum: Chromatic Precision in Semiotics', 'LUXURY SEMIOTICS', 'luxury-semiotics', 'Zurich, Switzerland', 'Jay Thaker', 'Studio Principal & Brand Architect', 'JT', 'JUL 2026', '6 MIN READ', 'img/port-noir.jpg', 'Why restrained monochrome palettes with solitary crimson accents create an impenetrable aura of institutional prestige.', '<h2>01. Monochromatic Discipline</h2><p>Restraint is the ultimate form of luxury. By confining brand color palettes to deep carbon blacks, neutral zincs, and an uncompromising solitary crimson accent, the brand radiates supreme confidence and timeless elegance.</p><div class=\"reader-pullquote\"><p>\"Color attracts attention; pure contrast commands reverence.\"</p></div><h2>02. 99% Black Hierarchy</h2><p>We work with 5 distinct shades of black: Carbon (#070709), Onyx (#0E0E12), Gunmetal (#14141A), Zinc (#181820), and Obsidian (#000000). Layering these values creates depth without chromatic clutter.</p>', 1, 5),
('art-kinetic', 'kinetic-identity-systems', 'Kinetic Identity Systems and Mathematical Precision in Modern Typography', 'CULTURAL CRITIQUE', 'cultural-critique', 'Milan, Italy', 'Jay Thaker', 'Studio Principal', 'JT', 'JUN 2026', '4 MIN READ', 'img/wc-top.jpg', 'Deconstructing our viral runway takeover that synchronized architectural projection mapping with high-velocity motion graphics.', '<h2>01. High-Velocity Typography</h2><p>In the noise of Milan Fashion Week, static billboards are invisible. By treating typography as physical kinetic particles that react to model runway pacing, we turned the entire venue into an immersive living typographic ecosystem.</p><div class=\"reader-pullquote\"><p>\"Type in motion is the heartbeat of digital culture. If your letters don\'t breathe, your brand is already obsolete.\"</p></div>', 1, 6),
('art-neural', 'neural-aesthetics-liquid-interfaces', 'Neural Aesthetics and Liquid Interfaces for Next Generation Platforms', 'COMPUTATIONAL WEBGL', 'computational-webgl', 'Seoul, South Korea', 'Kaito Tanaka', 'Lead Shader Engineer', 'KT', 'JUN 2026', '7 MIN READ', 'img/wc-mid.jpg', 'Moving beyond sterile flat SaaS dashboards into dynamic, organic liquid chrome shaders that visualize real-time state transitions.', '<h2>01. Fluid Computational States</h2><p>As artificial intelligence systems become more complex, human operators need intuitive qualitative feedback. Procedural liquid metal shaders provide instant visual comprehension of neural confidence metrics and data flow densities.</p><div class=\"reader-pullquote\"><p>\"We are replacing rigid rectangles with fluid computational matter that breathes in rhythm with machine reasoning.\"</p></div>', 1, 7),
('art-sensory', 'hospitality-onboarding-architecture', 'Architecture of Hospitality Onboarding: High-Touch Conversion', 'BRAND ARCHITECTURE', 'brand-architecture', 'Mumbai, India', 'Tushar Panchal', 'Founder & Marketing Head', 'TP', 'MAY 2026', '7 MIN READ', 'img/wc-bot.jpg', 'Translating five-star European boutique hotel rituals into high-touch luxury digital onboarding flows that eliminate buyer remorse and accelerate client retention.', '<h2>01. The Art of the Concierge Welcome</h2><p>When high-net-worth clients engage with a premium brand, the initial 48-hour onboarding ceremony establishes the entire lifetime relationship value. Automated plain-text confirmation emails destroy anticipation. Instead, choreography of digital tactile invitations and dedicated client dashboards anchors loyalty.</p>', 1, 8),
('art-quiet', 'anti-algorithmic-luxury-paradigm', 'The Anti-Algorithmic Luxury Paradigm: Why Scarcity Drives Brand Equity', 'CULTURAL CRITIQUE', 'cultural-critique', 'Kyoto, Japan', 'Jay Thaker', 'Studio Principal & Brand Architect', 'JT', 'MAY 2026', '9 MIN READ', 'img/port-chronos.jpg', 'Why high-growth luxury maisons reject relentless social output in favor of intentional friction, mystery, and physical artifact supremacy.', '<h2>01. The Myth of Ubiquity</h2><p>Algorithmic content engines demand endless feeding. But luxury is defined by distance. When a brand is available everywhere, it means nothing. Intentional scarcity and cryptographic gating preserve the essential mystique that commands 10x price premiums.</p><div class=\"reader-pullquote\"><p>\"If your brand is everywhere, it is already nowhere. Real luxury lives in the shadows of intentional scarcity.\"</p></div>', 1, 9),
('art-typographic-grid', 'mathematical-grids-kinetic-symmetry', 'Mathematical Grids and Kinetic Symmetry in Modernist Identity Systems', 'BRAND ARCHITECTURE', 'brand-architecture', 'Basel, Switzerland', 'Jay Thaker', 'Studio Principal & Brand Architect', 'JT', 'APR 2026', '6 MIN READ', 'img/port-veloce.jpg', 'Applying rational Swiss modernist proportion systems to responsive multi-device digital identity ecosystems.', '<h2>01. The Rationality of the Grid</h2><p>Swiss modernist typography was never about rigidity—it was about creating an invisible harmonious scaffolding where content commands absolute focus. We translate Josef Müller-Brockmann\'s modular principles into dynamic CSS subgrid architectures.</p><div class=\"reader-pullquote\"><p>\"The grid does not constrain creativity; it liberates form from arbitrary visual noise.\"</p></div>', 1, 10),
('art-haptic-luxury', 'psychophysics-haptic-resistance', 'The Psychophysics of Haptic Resistance in Ultra Luxury Hardware', 'PACKAGING & SPATIAL', 'packaging-spatial', 'Munich, Germany', 'Ami Patel', 'Materials & Packaging Specialist', 'AP', 'MAR 2026', '8 MIN READ', 'img/port-elysian.jpg', 'Calibrating rotary dial torque and magnetic tactile detents to instill subconscious trust in high-end devices.', '<h2>01. Micro-Newton Calibration</h2><p>When an automotive volume rotary switch possesses 0.08 Newton-meters of hydraulic damping resistance, human tactile receptors instantly signal mechanical precision, transforming an electronic volume knob into horological luxury.</p>', 1, 11),
('art-chromatic-void', 'photonic-contrast-atmospheric-lighting', 'Photonic Contrast and Atmospheric Lighting in Modern Gallery Flagships', 'SPATIAL DESIGN', 'spatial-design', 'New York, USA', 'Elena Vance', 'Spatial Design Director', 'EV', 'MAR 2026', '5 MIN READ', 'img/port-lumina.jpg', 'Utilizing 90% ambient spatial darkness with focused narrow-beam illumination to amplify product valuation.', '<h2>01. Darkness as a Frame</h2><p>Bright retail environments wash out product drama. By plunging 90% of the room into controlled shadow and deploying high-CRI 98+ spotlights with surgical cutoff snoots, every exhibited object takes on the sacred aura of a museum relic.</p>', 1, 12),
('art-stealth-wealth', 'sub-surface-brand-semiotics', 'Sub-Surface Brand Semiotics in High Horology and Private Aviation', 'LUXURY SEMIOTICS', 'luxury-semiotics', 'Geneva, Switzerland', 'Jay Thaker', 'Studio Principal & Brand Architect', 'JT', 'FEB 2026', '7 MIN READ', 'img/port-noir.jpg', 'How ultra-high-net-worth brands engineer covert visual codes discernible only to initiated cultural connoisseurs.', '<h2>01. The Cryptographic Code of Luxury</h2><p>Overt logos attract mass attention, but alienate connoisseurs. In high horology and private aviation interiors, status is communicated through stealth finishes: hand-anglage chamfering, hidden guilloché dials, and subtle micro-perforations.</p>', 1, 13),
('art-digital-twins', 'physical-digital-twin-fidelity', 'Physical to Digital Twin Fidelity in Bespoke Automotive Configurator Design', 'COMPUTATIONAL WEBGL', 'computational-webgl', 'Stuttgart, Germany', 'Kaito Tanaka', 'Lead Shader Engineer', 'KT', 'JAN 2026', '6 MIN READ', 'img/f-brand-3.jpg', 'Raymarched anisotropic carbon fiber weaves and multi-coat candy paint shaders for online bespoke luxury customization.', '<h2>01. Sub-Surface Flake Simulation</h2><p>Simulating metallic flake distribution under dynamic orbital HDRI lighting gives buyers absolute confidence when specifying $50,000 bespoke paint options on 8-figure hypercars.</p>', 1, 14),
('art-monolith-arch', 'brutalist-travertine-monoliths', 'Brutalist Travertine Monoliths and Negative Space in High-End Boutiques', 'SPATIAL DESIGN', 'spatial-design', 'Stockholm, Sweden', 'Elena Vance', 'Spatial Design Director', 'EV', 'JAN 2026', '7 MIN READ', 'img/wc-mid.jpg', 'Carving monumental stone blocks to sculpt intimate sensory chambers within vast luxury architecture.', '<h2>01. The Weight of Silence</h2><p>When monumental 4-ton unpolished Roman travertine blocks anchor a boutique interior, the weight of the physical rock silences ambient noise and demands contemplative deceleration.</p>', 1, 15),
('art-tactile-unbox', 'ritual-of-the-unboxing', 'The Ritual of the Unboxing: Micro Tolerances in Rigid Presentation Cases', 'PACKAGING & SPATIAL', 'packaging-spatial', 'London, UK', 'Ami Patel', 'Materials & Packaging Specialist', 'AP', 'DEC 2025', '8 MIN READ', 'img/port-elysian.jpg', 'Engineering 3.5-second air-cushion lid descent rates for an unforgettable tactile brand reveal ceremony.', '<h2>01. Air-Piston Resistance</h2><p>When a rigid telescoping box lid drops under its own weight at a calibrated 3.5-second glide, the client experiences sensory suspense before laying eyes on the timepiece.</p>', 1, 16),
('art-cultural-resonance', 'cultural-resonance-timeless-dominance', 'Cultural Resonance and Timeless Dominance in Modern Architectural Practice', 'CULTURAL CRITIQUE', 'cultural-critique', 'Paris, France', 'Jay Thaker', 'Studio Principal & Brand Architect', 'JT', 'NOV 2025', '5 MIN READ', 'img/wc-top.jpg', 'Synthesizing architectural permanence with high-speed digital agility to build brands that outlive generational cycles.', '<h2>01. The 100-Year Vision</h2><p>Trends disappear within quarters; architectural geometry endures across centuries. By treating branding as physical architecture, we forge institutional equity that stands immune to seasonal aesthetic volatility.</p>', 1, 17);

-- --------------------------------------------------------
-- Table 9: `studio_settings` (General Key-Value Parameters)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `studio_settings`;
CREATE TABLE `studio_settings` (
  `setting_key` VARCHAR(100) PRIMARY KEY,
  `setting_value` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `studio_settings` (`setting_key`, `setting_value`) VALUES
('studio_name', '1928 Creative Studio'),
('established', '1928'),
('location', 'Ahmedabad, India · Global Practice'),
('email', 'studio@1928creativestudio.com'),
('phone', '+91 98250 19280'),
('instagram', 'https://instagram.com'),
('linkedin', 'https://linkedin.com'),
('behance', 'https://behance.net'),
('twitter', 'https://twitter.com'),
('cta_primary_text', 'Start a Project'),
('cta_secondary_text', 'Tell us what you\'re building');
