-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 24, 2026 at 08:30 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `1928_studio_cms`
--

-- --------------------------------------------------------

--
-- Table structure for table `blogs`
--

CREATE TABLE `blogs` (
  `id` int NOT NULL,
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
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `blogs`
--

INSERT INTO `blogs` (`id`, `blog_id`, `slug`, `title`, `category`, `category_slug`, `city`, `author`, `author_role`, `author_bio`, `initials`, `date_text`, `read_time`, `cover_image`, `specimen_image`, `specimen_caption`, `excerpt`, `content_html`, `sections_json`, `related_json`, `published`, `display_order`, `created_at`, `updated_at`) VALUES
(1, 'art-monogram', 'monolithic-luxury-monogram', 'New The Monolithic Luxury Monogram as an Enduring Landmark', 'BRAND ARCHITECTURE', 'brand-architecture', 'Milan, Italy', 'Jiya Thaker', 'Studio Principal & Brand Architect', '', 'PD', 'SEP 2026', '6 MIN READ', 'assets/uploads/1928_1790272451_Findade-Logo.png', '', '1928 EDITORIAL PROVENANCE CAPTURE', 'How high-growth luxury houses engineer mathematically rigorous marks to command enduring global authority.', '<div class=\"reader-pullquote\"><p>“Highlight a key perspective or architectural takeaway quote here...”</p></div><p></p><p>Real-time dynamic content reflection across live website</p><p></p>', '[{\"id\":\"sec-shift\",\"title\":\"01. The Strategic Shift\"},{\"id\":\"sec-geometry\",\"title\":\"02. Mathematical Geometry\"},{\"id\":\"sec-takeaways\",\"title\":\"03. Strategic Takeaways\"}]', '[\"art-spatial\",\"art-webgl\"]', 1, 1, '2026-09-23 16:57:53', '2026-09-25 16:10:08'),
(2, 'art-spatial', 'spatial-choreography-flagship-retail', 'Spatial Choreography Across Modern Architectural Luxury Flagship Retail', 'SPATIAL DESIGN', 'spatial-design', 'Milan, Italy', 'Elena Vance', 'Spatial Design Director', NULL, 'EV', 'AUG 2026', '6 MIN READ', 'img/port-veloce.jpg', NULL, NULL, 'Choreographing visitor trajectories through brutalist travertine monoliths, directional acoustics, and negative-space compression.', '<h2>01. The Sensory Environment</h2><p>Physical retail in 2026 is no longer about inventory distribution; it is sensory brand communion. When a client crosses the threshold into a physical flagship, every sensory input—the acoustic reverberation time of polished concrete, the color temperature of 2700K recessed spotlights, and the scent of custom cedarwood—instantly primes their valuation perception.</p><div class=\"reader-pullquote\"><p>\"The space itself is the most powerful salesperson. When architecture radiates permanence, price resistance dissipates.\"</p></div><h2>02. Monolithic Material Physics</h2><p>We specify raw split-face travertine, blackened brushed steel, and acoustic felt panels to establish a temple-like reverence. Clients spend 3.2x longer inside acoustically damped private VIP suites than open retail floors.</p>', NULL, NULL, 1, 2, '2026-09-23 16:57:53', '2026-09-23 16:57:53'),
(3, 'art-webgl', 'computational-raytracing-webgl', 'Zero Latency Computational Raytracing in WebGL Interactive Ecosystems', 'COMPUTATIONAL WEBGL', 'computational-webgl', 'Tokyo, Japan', 'Kaito Tanaka', 'Lead Shader Engineer', NULL, 'KT', 'AUG 2026', '5 MIN READ', 'img/port-lumina.jpg', NULL, NULL, 'Synthesizing custom GLSL physically-based surface shaders for real-time metallic reflections at native 120 FPS.', '<h2>01. Beyond the Flat 2D Web</h2><p>Static JPEG mockups and auto-playing video loops are remnants of a bygone digital era. The contemporary luxury buyer demands agency—the power to inspect sub-millimeter stitching on an automotive interior or rotate a tourbillon watch under real-time procedural lighting.</p><div class=\"reader-pullquote\"><p>\"Interactive 3D WebGL is not a gimmick; it is the closest digital surrogate to physical touch.\"</p></div><h2>02. Custom GLSL Fragment Shaders</h2><p>By compiling custom GLSL fragment shaders and implementing procedural normal map decompression, we achieve buttery 120fps performance across mobile Safari and desktop Chrome without draining device thermals.</p>', NULL, NULL, 1, 3, '2026-09-23 16:57:53', '2026-09-23 16:57:53'),
(4, 'art-fluted', 'tactile-acoustic-snaps-travertine', 'Tactile Acoustic Snaps and Travertine in Bespoke Packaging', 'PACKAGING & SPATIAL', 'packaging-spatial', 'Paris, France', 'Ami Patel', 'Materials & Packaging Specialist', NULL, 'AP', 'JUL 2026', '8 MIN READ', 'img/port-elysian.jpg', NULL, NULL, 'The psychophysics of 45-decibel acoustic closures, haptic friction coefficients, and unboxing rituals in ultra-luxury design.', '<h2>01. The Tactile Physics of Glass</h2><p>Weight is perceived as quality. A perfume vessel weighing 480 grams with an internal magnetic snap rated at 1.2 Newtons immediately communicates $300+ value before the atomizer is ever depressed.</p><div class=\"reader-pullquote\"><p>\"The tactile sensation of opening a luxury package triggers dopamine pathways faster than visual advertising.\"</p></div><h2>02. Light Refraction &amp; Fluting Tolerances</h2><p>Precision micro-fluting cut into lead-free crystal glass bends ambient gallery spotlights into vertical prismatic rays, transforming the fragrance liquid into a radiant glowing beacon.</p>', NULL, NULL, 1, 4, '2026-09-23 16:57:53', '2026-09-23 16:57:53'),
(5, 'art-monochrome', '99-percent-black-spectrum', 'The 99% Black Spectrum: Chromatic Precision in Semiotics', 'LUXURY SEMIOTICS', 'luxury-semiotics', 'Zurich, Switzerland', 'Jay Thaker', 'Studio Principal & Brand Architect', NULL, 'JT', 'JUL 2026', '6 MIN READ', 'img/port-noir.jpg', NULL, NULL, 'Why restrained monochrome palettes with solitary crimson accents create an impenetrable aura of institutional prestige.', '<h2>01. Monochromatic Discipline</h2><p>Restraint is the ultimate form of luxury. By confining brand color palettes to deep carbon blacks, neutral zincs, and an uncompromising solitary crimson accent, the brand radiates supreme confidence and timeless elegance.</p><div class=\"reader-pullquote\"><p>\"Color attracts attention; pure contrast commands reverence.\"</p></div><h2>02. 99% Black Hierarchy</h2><p>We work with 5 distinct shades of black: Carbon (#070709), Onyx (#0E0E12), Gunmetal (#14141A), Zinc (#181820), and Obsidian (#000000). Layering these values creates depth without chromatic clutter.</p>', NULL, NULL, 1, 5, '2026-09-23 16:57:53', '2026-09-23 16:57:53'),
(6, 'art-kinetic', 'kinetic-identity-systems', 'Kinetic Identity Systems and Mathematical Precision in Modern Typography', 'CULTURAL CRITIQUE', 'cultural-critique', 'Milan, Italy', 'Jay Thaker', 'Studio Principal', NULL, 'JT', 'JUN 2026', '4 MIN READ', 'img/wc-top.jpg', NULL, NULL, 'Deconstructing our viral runway takeover that synchronized architectural projection mapping with high-velocity motion graphics.', '<h2>01. High-Velocity Typography</h2><p>In the noise of Milan Fashion Week, static billboards are invisible. By treating typography as physical kinetic particles that react to model runway pacing, we turned the entire venue into an immersive living typographic ecosystem.</p><div class=\"reader-pullquote\"><p>\"Type in motion is the heartbeat of digital culture. If your letters don\'t breathe, your brand is already obsolete.\"</p></div>', NULL, NULL, 1, 6, '2026-09-23 16:57:53', '2026-09-23 16:57:53'),
(7, 'art-neural', 'neural-aesthetics-liquid-interfaces', 'Neural Aesthetics and Liquid Interfaces for Next Generation Platforms', 'COMPUTATIONAL WEBGL', 'computational-webgl', 'Seoul, South Korea', 'Kaito Tanaka', 'Lead Shader Engineer', NULL, 'KT', 'JUN 2026', '7 MIN READ', 'img/wc-mid.jpg', NULL, NULL, 'Moving beyond sterile flat SaaS dashboards into dynamic, organic liquid chrome shaders that visualize real-time state transitions.', '<h2>01. Fluid Computational States</h2><p>As artificial intelligence systems become more complex, human operators need intuitive qualitative feedback. Procedural liquid metal shaders provide instant visual comprehension of neural confidence metrics and data flow densities.</p><div class=\"reader-pullquote\"><p>\"We are replacing rigid rectangles with fluid computational matter that breathes in rhythm with machine reasoning.\"</p></div>', NULL, NULL, 1, 7, '2026-09-23 16:57:53', '2026-09-23 16:57:53'),
(8, 'art-sensory', 'hospitality-onboarding-architecture', 'Architecture of Hospitality Onboarding: High-Touch Conversion', 'BRAND ARCHITECTURE', 'brand-architecture', 'Mumbai, India', 'Tushar Panchal', 'Founder & Marketing Head', NULL, 'TP', 'MAY 2026', '7 MIN READ', 'img/wc-bot.jpg', NULL, NULL, 'Translating five-star European boutique hotel rituals into high-touch luxury digital onboarding flows that eliminate buyer remorse and accelerate client retention.', '<h2>01. The Art of the Concierge Welcome</h2><p>When high-net-worth clients engage with a premium brand, the initial 48-hour onboarding ceremony establishes the entire lifetime relationship value. Automated plain-text confirmation emails destroy anticipation. Instead, choreography of digital tactile invitations and dedicated client dashboards anchors loyalty.</p>', NULL, NULL, 1, 8, '2026-09-23 16:57:53', '2026-09-23 16:57:53'),
(9, 'art-quiet', 'anti-algorithmic-luxury-paradigm', 'The Anti-Algorithmic Luxury Paradigm: Why Scarcity Drives Brand Equity', 'CULTURAL CRITIQUE', 'cultural-critique', 'Kyoto, Japan', 'Jay Thaker', 'Studio Principal & Brand Architect', NULL, 'JT', 'MAY 2026', '9 MIN READ', 'img/port-chronos.jpg', NULL, NULL, 'Why high-growth luxury maisons reject relentless social output in favor of intentional friction, mystery, and physical artifact supremacy.', '<h2>01. The Myth of Ubiquity</h2><p>Algorithmic content engines demand endless feeding. But luxury is defined by distance. When a brand is available everywhere, it means nothing. Intentional scarcity and cryptographic gating preserve the essential mystique that commands 10x price premiums.</p><div class=\"reader-pullquote\"><p>\"If your brand is everywhere, it is already nowhere. Real luxury lives in the shadows of intentional scarcity.\"</p></div>', NULL, NULL, 1, 9, '2026-09-23 16:57:53', '2026-09-23 16:57:53'),
(10, 'art-typographic-grid', 'mathematical-grids-kinetic-symmetry', 'Mathematical Grids and Kinetic Symmetry in Modernist Identity Systems', 'BRAND ARCHITECTURE', 'brand-architecture', 'Basel, Switzerland', 'Jay Thaker', 'Studio Principal & Brand Architect', NULL, 'JT', 'APR 2026', '6 MIN READ', 'img/port-veloce.jpg', NULL, NULL, 'Applying rational Swiss modernist proportion systems to responsive multi-device digital identity ecosystems.', '<h2>01. The Rationality of the Grid</h2><p>Swiss modernist typography was never about rigidity—it was about creating an invisible harmonious scaffolding where content commands absolute focus. We translate Josef Müller-Brockmann\'s modular principles into dynamic CSS subgrid architectures.</p><div class=\"reader-pullquote\"><p>\"The grid does not constrain creativity; it liberates form from arbitrary visual noise.\"</p></div>', NULL, NULL, 1, 10, '2026-09-23 16:57:53', '2026-09-23 16:57:53'),
(11, 'art-haptic-luxury', 'psychophysics-haptic-resistance', 'The Psychophysics of Haptic Resistance in Ultra Luxury Hardware', 'PACKAGING & SPATIAL', 'packaging-spatial', 'Munich, Germany', 'Ami Patel', 'Materials & Packaging Specialist', NULL, 'AP', 'MAR 2026', '8 MIN READ', 'img/port-elysian.jpg', NULL, NULL, 'Calibrating rotary dial torque and magnetic tactile detents to instill subconscious trust in high-end devices.', '<h2>01. Micro-Newton Calibration</h2><p>When an automotive volume rotary switch possesses 0.08 Newton-meters of hydraulic damping resistance, human tactile receptors instantly signal mechanical precision, transforming an electronic volume knob into horological luxury.</p>', NULL, NULL, 1, 11, '2026-09-23 16:57:53', '2026-09-23 16:57:53'),
(12, 'art-chromatic-void', 'photonic-contrast-atmospheric-lighting', 'Photonic Contrast and Atmospheric Lighting in Modern Gallery Flagships', 'SPATIAL DESIGN', 'spatial-design', 'New York, USA', 'Elena Vance', 'Spatial Design Director', NULL, 'EV', 'MAR 2026', '5 MIN READ', 'img/port-lumina.jpg', NULL, NULL, 'Utilizing 90% ambient spatial darkness with focused narrow-beam illumination to amplify product valuation.', '<h2>01. Darkness as a Frame</h2><p>Bright retail environments wash out product drama. By plunging 90% of the room into controlled shadow and deploying high-CRI 98+ spotlights with surgical cutoff snoots, every exhibited object takes on the sacred aura of a museum relic.</p>', NULL, NULL, 1, 12, '2026-09-23 16:57:53', '2026-09-23 16:57:53'),
(13, 'art-stealth-wealth', 'sub-surface-brand-semiotics', 'Sub-Surface Brand Semiotics in High Horology and Private Aviation', 'LUXURY SEMIOTICS', 'luxury-semiotics', 'Geneva, Switzerland', 'Jay Thaker', 'Studio Principal & Brand Architect', NULL, 'JT', 'FEB 2026', '7 MIN READ', 'img/port-noir.jpg', NULL, NULL, 'How ultra-high-net-worth brands engineer covert visual codes discernible only to initiated cultural connoisseurs.', '<h2>01. The Cryptographic Code of Luxury</h2><p>Overt logos attract mass attention, but alienate connoisseurs. In high horology and private aviation interiors, status is communicated through stealth finishes: hand-anglage chamfering, hidden guilloché dials, and subtle micro-perforations.</p>', NULL, NULL, 1, 13, '2026-09-23 16:57:53', '2026-09-23 16:57:53'),
(14, 'art-digital-twins', 'physical-digital-twin-fidelity', 'Physical to Digital Twin Fidelity in Bespoke Automotive Configurator Design', 'COMPUTATIONAL WEBGL', 'computational-webgl', 'Stuttgart, Germany', 'Kaito Tanaka', 'Lead Shader Engineer', NULL, 'KT', 'JAN 2026', '6 MIN READ', 'img/f-brand-3.jpg', NULL, NULL, 'Raymarched anisotropic carbon fiber weaves and multi-coat candy paint shaders for online bespoke luxury customization.', '<h2>01. Sub-Surface Flake Simulation</h2><p>Simulating metallic flake distribution under dynamic orbital HDRI lighting gives buyers absolute confidence when specifying $50,000 bespoke paint options on 8-figure hypercars.</p>', NULL, NULL, 1, 14, '2026-09-23 16:57:53', '2026-09-23 16:57:53'),
(15, 'art-monolith-arch', 'brutalist-travertine-monoliths', 'Brutalist Travertine Monoliths and Negative Space in High-End Boutiques', 'SPATIAL DESIGN', 'spatial-design', 'Stockholm, Sweden', 'Elena Vance', 'Spatial Design Director', NULL, 'EV', 'JAN 2026', '7 MIN READ', 'img/wc-mid.jpg', NULL, NULL, 'Carving monumental stone blocks to sculpt intimate sensory chambers within vast luxury architecture.', '<h2>01. The Weight of Silence</h2><p>When monumental 4-ton unpolished Roman travertine blocks anchor a boutique interior, the weight of the physical rock silences ambient noise and demands contemplative deceleration.</p>', NULL, NULL, 1, 15, '2026-09-23 16:57:53', '2026-09-23 16:57:53'),
(16, 'art-tactile-unbox', 'ritual-of-the-unboxing', 'The Ritual of the Unboxing: Micro Tolerances in Rigid Presentation Cases', 'PACKAGING & SPATIAL', 'packaging-spatial', 'London, UK', 'Ami Patel', 'Materials & Packaging Specialist', NULL, 'AP', 'DEC 2025', '8 MIN READ', 'img/port-elysian.jpg', NULL, NULL, 'Engineering 3.5-second air-cushion lid descent rates for an unforgettable tactile brand reveal ceremony.', '<h2>01. Air-Piston Resistance</h2><p>When a rigid telescoping box lid drops under its own weight at a calibrated 3.5-second glide, the client experiences sensory suspense before laying eyes on the timepiece.</p>', NULL, NULL, 1, 16, '2026-09-23 16:57:53', '2026-09-23 16:57:53'),
(17, 'art-cultural-resonance', 'cultural-resonance-timeless-dominance', 'Cultural Resonance and Timeless Dominance in Modern Architectural Practice', 'CULTURAL CRITIQUE', 'cultural-critique', 'Paris, France', 'Jay Thaker', 'Studio Principal & Brand Architect', NULL, 'JT', 'NOV 2025', '5 MIN READ', 'img/wc-top.jpg', NULL, NULL, 'Synthesizing architectural permanence with high-speed digital agility to build brands that outlive generational cycles.', '<h2>01. The 100-Year Vision</h2><p>Trends disappear within quarters; architectural geometry endures across centuries. By treating branding as physical architecture, we forge institutional equity that stands immune to seasonal aesthetic volatility.</p>', NULL, NULL, 1, 17, '2026-09-23 16:57:53', '2026-09-23 16:57:53');

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `id` int NOT NULL,
  `client_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtitle` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '#',
  `logo_type` enum('svg','image') COLLATE utf8mb4_unicode_ci DEFAULT 'svg',
  `svg_code` mediumtext COLLATE utf8mb4_unicode_ci,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_order` int DEFAULT '1',
  `active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `client_id`, `name`, `subtitle`, `website_url`, `logo_type`, `svg_code`, `image_url`, `display_order`, `active`) VALUES
(1, 'client-oberoi', 'The Oberoi Group', 'Luxury Hospitality & Leisure', '#', 'svg', '<svg viewBox=\"0 0 160 40\" class=\"brand-logo-svg\"><path d=\"M 25 20 C 25 12, 35 12, 35 20 C 35 28, 25 28, 25 20 Z M 20 20 C 20 8, 40 8, 40 20 C 40 32, 20 32, 20 20 Z\" fill=\"#E51937\"/><text x=\"48\" y=\"26\" font-family=\"\'Montserrat\', sans-serif\" font-weight=\"700\" font-size=\"15\" fill=\"currentColor\" letter-spacing=\"3px\">OBEROI</text></svg>', NULL, 1, 1),
(2, 'client-taj', 'Taj Hotels & Palaces', 'Heritage Luxury & Resorts', '#', 'svg', '<svg viewBox=\"0 0 160 40\" class=\"brand-logo-svg\"><path d=\"M 20 28 L 30 10 L 40 28 Z M 27 22 L 33 22\" stroke=\"#E51937\" stroke-width=\"2\" fill=\"none\"/><text x=\"50\" y=\"26\" font-family=\"\'Montserrat\', sans-serif\" font-weight=\"800\" font-size=\"16\" fill=\"currentColor\" letter-spacing=\"4px\">TAJ</text></svg>', NULL, 2, 1),
(3, 'client-leela', 'The Leela Palaces', 'Palaces, Hotels & Resorts', '#', 'svg', '<svg viewBox=\"0 0 160 40\" class=\"brand-logo-svg\"><circle cx=\"28\" cy=\"20\" r=\"10\" stroke=\"currentColor\" stroke-width=\"1.5\" fill=\"none\"/><circle cx=\"28\" cy=\"20\" r=\"4\" fill=\"#E51937\"/><text x=\"46\" y=\"25\" font-family=\"\'Montserrat\', sans-serif\" font-weight=\"700\" font-size=\"14\" fill=\"currentColor\" letter-spacing=\"2.5px\">THE LEELA</text></svg>', NULL, 3, 1),
(4, 'client-itc', 'ITC Luxury Collection', 'Sustainable Hospitality', '#', 'svg', '<svg viewBox=\"0 0 160 40\" class=\"brand-logo-svg\"><rect x=\"18\" y=\"12\" width=\"22\" height=\"16\" fill=\"none\" stroke=\"#E51937\" stroke-width=\"2\"/><text x=\"23\" y=\"25\" font-family=\"\'Montserrat\', sans-serif\" font-weight=\"900\" font-size=\"12\" fill=\"currentColor\">ITC</text><text x=\"48\" y=\"25\" font-family=\"\'Montserrat\', sans-serif\" font-weight=\"600\" font-size=\"13\" fill=\"currentColor\" letter-spacing=\"2px\">HOTELS</text></svg>', NULL, 4, 1),
(5, 'client-sotheby', 'Sotheby\'s Realty', 'International Realty & Estates', '#', 'svg', '<svg viewBox=\"0 0 160 40\" class=\"brand-logo-svg\"><text x=\"10\" y=\"25\" font-family=\"\'Montserrat\', sans-serif\" font-weight=\"700\" font-size=\"13.5\" fill=\"currentColor\" letter-spacing=\"1px\">SOTHEBY\'S</text><circle cx=\"120\" cy=\"18\" r=\"3\" fill=\"#E51937\"/></svg>', NULL, 5, 1),
(6, 'client-crest', 'Crest Luxury Assets', 'Private Equity & Assets', '#', 'svg', '<svg viewBox=\"0 0 160 40\" class=\"brand-logo-svg\"><polygon points=\"30,8 42,32 18,32\" stroke=\"#E51937\" stroke-width=\"2\" fill=\"none\"/><text x=\"50\" y=\"26\" font-family=\"\'Montserrat\', sans-serif\" font-weight=\"800\" font-size=\"16\" fill=\"currentColor\" letter-spacing=\"2px\">CREST</text></svg>', NULL, 6, 1),
(7, 'client-kinesis', 'Kinesis', 'Spatial Identity', '#', 'svg', '<svg viewBox=\"0 0 160 40\" class=\"brand-logo-svg\"><path d=\"M 25 20 Q 35 10 45 20 T 65 20\" stroke=\"#E51937\" stroke-width=\"3\" fill=\"none\"/><text x=\"75\" y=\"25\" font-family=\"\'Montserrat\', sans-serif\" font-weight=\"800\" font-size=\"16\" fill=\"currentColor\">KINESIS</text></svg>', NULL, 7, 1),
(8, 'client-aura', 'Aura Systems', 'Visual Systems', '#', 'svg', '<svg viewBox=\"0 0 160 40\" class=\"brand-logo-svg\"><circle cx=\"40\" cy=\"20\" r=\"8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"60\" y=\"26\" font-family=\"\'Montserrat\', sans-serif\" font-weight=\"800\" font-size=\"18\" fill=\"currentColor\" letter-spacing=\"1px\">AURA</text></svg>', NULL, 8, 1),
(9, 'client-jukku', 'Jukku Digital', 'Digital Growth', '#', 'svg', '<svg viewBox=\"0 0 160 40\" class=\"brand-logo-svg\"><text x=\"80\" y=\"26\" text-anchor=\"middle\" font-family=\"\'Montserrat\', sans-serif\" font-weight=\"900\" font-size=\"20\" fill=\"#C8102E\" letter-spacing=\"1px\">JUKKU</text></svg>', NULL, 9, 1),
(10, 'client-synapse', 'Synapse', 'Product Architecture', '#', 'svg', '<svg viewBox=\"0 0 160 40\" class=\"brand-logo-svg\"><circle cx=\"30\" cy=\"20\" r=\"6\" fill=\"#E51937\"/><circle cx=\"45\" cy=\"20\" r=\"6\" fill=\"currentColor\"/><text x=\"60\" y=\"26\" font-family=\"\'Montserrat\', sans-serif\" font-weight=\"800\" font-size=\"16\" fill=\"currentColor\">SYNAPSE</text></svg>', NULL, 10, 1),
(11, 'client-monolith', 'Monolith', 'Spatial Design', '#', 'svg', '<svg viewBox=\"0 0 160 40\" class=\"brand-logo-svg\"><rect x=\"25\" y=\"10\" width=\"18\" height=\"20\" fill=\"currentColor\"/><text x=\"52\" y=\"26\" font-family=\"\'Montserrat\', sans-serif\" font-weight=\"900\" font-size=\"16\" fill=\"currentColor\">MONOLITH</text></svg>', NULL, 11, 1),
(12, 'client-solaris', 'Solaris Energy', 'Energy & Innovation', '#', 'svg', '<svg viewBox=\"0 0 160 40\" class=\"brand-logo-svg\"><polygon points=\"35,12 45,20 35,28\" fill=\"#E51937\"/><text x=\"55\" y=\"26\" font-family=\"\'Montserrat\', sans-serif\" font-weight=\"800\" font-size=\"16\" fill=\"currentColor\" letter-spacing=\"1.5px\">SOLARIS</text></svg>', NULL, 12, 1);

-- --------------------------------------------------------

--
-- Table structure for table `contact_inquiries`
--

CREATE TABLE `contact_inquiries` (
  `id` int NOT NULL,
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
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contact_inquiries`
--

INSERT INTO `contact_inquiries` (`id`, `name`, `email`, `company`, `phone`, `service`, `budget`, `timeline`, `session_date`, `session_time`, `session_summary`, `vision`, `nda`, `status`, `admin_notes`, `ip_address`, `user_agent`, `created_at`, `updated_at`) VALUES
(1, 'Alexander Vance', 'alexander@vanceholdings.com', 'Vance Luxury Group', '+91 98250 88210', 'Brand Identity Development', '1 Lakh to 2 Lakh (Flagship Venture)', '< 1 Month (Immediate)', 'Monday, Oct 19, 2026', '02:30 PM IST', 'Monday, Oct 19, 2026 · 02:30 PM IST', 'We are preparing to launch a high-end luxury lifestyle maison and require an end-to-end visual identity, bespoke packaging system, and digital flagship.', 'Bilateral NDA Requested', 'new', 'Initial inquiry from contact form. Requested bilateral NDA prior to creative review.', NULL, NULL, '2026-10-15 16:19:27', '2026-10-15 16:19:27'),
(2, 'Meera Singhania', 'meera@singhaniacouture.in', 'Singhania Haute Couture', '+91 97123 45678', 'Website Design & Development', '2 Lakh + (Comprehensive)', '1 – 3 Months (Standard)', 'Wednesday, Oct 21, 2026', '11:00 AM IST', 'Wednesday, Oct 21, 2026 · 11:00 AM IST', 'Complete overhaul of our international couture digital flagship with WebGL interactive runway storytelling and private client salon ordering.', 'Standard Review', 'in_review', 'Ami reviewed portfolio references. Scheduled for strategy session.', NULL, NULL, '2026-10-15 16:19:27', '2026-10-15 16:19:27'),
(3, 'Vikramaditya Oberoi', 'vikram@oberoigroup.com', 'Oberoi Heritage Resorts', '+91 99887 76655', 'Website Design & Development', '2 Lakh + (Comprehensive)', '< 1 Month (Immediate)', 'Friday, Oct 23, 2026', '04:30 PM IST', 'Friday, Oct 23, 2026 · 04:30 PM IST', 'We require an iconic ultra-luxury digital flagship showcasing private palace suites with 3D WebGL panoramic room tour physics.', 'Bilateral NDA Requested', 'new', NULL, '127.0.0.1', 'PHP Test Agent', '2026-10-15 16:27:59', '2026-10-15 16:27:59'),
(4, 'Sophia Laurent', 'sophia@laurent-maison.com', 'Maison Laurent Paris', '33 1 42 68 55 00', 'Brand Identity Development', '2 Lakh   (Comprehensive)', '< 1 Month (Immediate)', 'Thursday, Oct 15, 2026', '11:00 AM IST', 'Thursday, Oct 15, 2026 · 11:00 AM IST', '', 'on', 'new', NULL, '::1', 'curl/8.21.0', '2026-10-15 16:52:18', '2026-10-15 16:52:18'),
(5, 'Elena Rostova', 'elena@rostovadesign.com', 'Rostova Architectural Atelier', '+91 98765 43210', 'Full 360° Studio Creative Partnership', '₹30L – ₹60 Lakhs (Flagship Venture)', '1 – 3 Months (Standard)', 'Tuesday, Oct 27, 2026', '02:30 PM IST', 'Tuesday, Oct 27, 2026 · 02:30 PM IST', 'Comprehensive identity, spatial environmental branding, and custom 3D WebGL showcase for our flagship architectural studio in Milan.', 'Bilateral NDA Requested', 'in_review', '', '::1', '', '2026-10-15 18:01:05', '2026-10-15 19:28:26'),
(6, 'Jay Test', 'jaythakur1928@gmail.com', '1928 Creative Studio Test', '7048892006', 'Brand Identity Development', '2 Lakh + (Comprehensive)', '< 1 Month (Immediate)', 'Friday, Oct 23, 2026', '04:30 PM IST', 'Friday, Oct 23, 2026 · 04:30 PM IST', 'Automated test brief verification.', 'Standard Review', 'new', NULL, '::1', '', '2026-10-16 16:19:20', '2026-10-16 16:19:20');

-- --------------------------------------------------------

--
-- Table structure for table `portfolio`
--

CREATE TABLE `portfolio` (
  `id` int NOT NULL,
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
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `portfolio`
--

INSERT INTO `portfolio` (`id`, `project_id`, `title`, `client`, `category_keys`, `category_display`, `tag_pill`, `grid_span`, `year`, `cover_image`, `summary`, `challenge`, `approach`, `impact`, `metrics_json`, `featured`, `display_order`, `active`, `created_at`) VALUES
(1, 'aurora', 'Main Aurora Chronometer Systems', 'Aurora Horology Genevesfg', 'brand-identity web-design logo-design', 'Swiss Luxury Brand Identity & 3D Vaultsfd dz f', 'Horology & WebGL', 'bento-compact', '2026', 'assets/uploads/1928_1790665408_Findade-Logo.png', 'Aurora Horology commissioned 1928 Creative Studio to architect an enduring brand ecosystem that honors Swiss horological precision while establishing commanding digital authority for the next generation of luxury collectors. Through monolithic typographic architecture, bespoke crimson color physics, and a zero-latency 3D WebGL boutique vault, we transformed the brand into an iconic collector centerpiece that sold out its inaugural batch within minutes.', '', '', '', '[]', 1, 1, 1, '2026-09-23 16:57:53'),
(2, 'veloce', 'Veloce Hypercraft Platforms', 'Veloce Automobili Modena', 'web-design brand-identity', 'Automotive Digital Flagship & Raytraced Configurator', 'Automotive & 3D', 'bento-compact', '2025', 'img/port-veloce.jpg', 'Digital ecosystem engineered for electric hypercar customization with real-time shader material simulation.', 'Overcoming web browser rendering bottlenecks to showcase real-time carbon-fiber weave finishes.', 'Developed custom GLSL fragment shaders simulating accurate photonic refractions across curved hypercar body panels.', 'Acquired 18 qualified bespoke hypercar custom orders prior to physical prototype reveals.', '[{\"label\":\"Avg Interactive Duration\",\"value\":\"6.4 Min\"},{\"label\":\"VIP Allocations Reserved\",\"value\":\"100%\"},{\"label\":\"Frame-Rate Target\",\"value\":\"120 FPS\"}]', 1, 2, 1, '2026-09-23 16:57:53'),
(3, 'elysian', 'Elysian High Jewelry & Fragrance', 'Maison Elysian Paris', 'spatial-packaging brand-identity', 'Haute Parfumerie Flacon & Travertine Flagship', 'Packaging & Spatial', 'bento-compact', '2025', 'img/port-elysian.jpg', 'Fluted lead-free crystal flacon architecture, weighted magnetic closures, and Milan flagship sensory environment.', 'Transforming high perfumery into a sculptural tactile artifact that commands heirloom status.', 'Engineered a 480-gram crystal monolith with 1.2N acoustic magnetic snaps and brutalist travertine store fixtures.', 'Expanded across 14 premier luxury department stores in Paris, Tokyo, and New York.', '[{\"label\":\"Retail Revenue per Sq.Ft\",\"value\":\"€4,200\"},{\"label\":\"Packaging Retention Rate\",\"value\":\"96%\"}]', 1, 3, 1, '2026-09-23 16:57:53'),
(4, 'noir-atelier', 'Noir Spatial Architecture & Flagship', 'Noir Fashion Group Milan', 'spatial-packaging brand-identity', 'Brutalist Travertine Flagship Architecture', 'Spatial Architecture', 'bento-wide', '2024', 'img/port-noir.jpg', 'Monolithic interior architecture, directional soundscapes, and negative-space lighting choreography.', 'Eliminating the commercial feel of traditional retail to create an immersive museum-grade sanctum.', 'Incorporated unpolished split-face Roman travertine walls, 2700K surgical beam spotlights, and acoustic felt baffles.', 'Won Milan Retail Architecture Design of the Year.', '[{\"label\":\"Footfall Dwell Duration\",\"value\":\"+210%\"},{\"label\":\"Conversion Velocity\",\"value\":\"38%\"}]', 1, 4, 1, '2026-09-23 16:57:53'),
(5, 'lumina', 'Lumina Neural Aesthetics Platform', 'Lumina AI Zurich', 'web-design brand-identity', 'Liquid Metal UI & Generative Research Interface', 'AI Interface & WebGL', 'bento-wide', '2024', 'img/port-lumina.jpg', 'Generative liquid chrome shader interfaces representing deep neural state transformations.', 'Making complex deep learning workflows feel human, organic, and visually captivating.', 'Replaced sterile SaaS dashboard widgets with dynamic fluid simulations that adapt to computational confidence.', 'Positioned Lumina as the definitive luxury interface in enterprise artificial intelligence.', '[{\"label\":\"Series A Raised\",\"value\":\"$24M\"},{\"label\":\"User Retention Rate\",\"value\":\"88%\"}]', 1, 5, 1, '2026-09-23 16:57:53'),
(6, 'bugatti', 'Bugatti Centodieci Collector Codex', 'Bugatti Automobiles Molsheim', 'spatial-packaging brand-identity', 'Aerospace Carbon Fiber Presentation Codex', 'Collector Codex', 'bento-compact', '2024', 'img/port-spectra.jpg', 'Limited-edition bespoke carbon-bound hardcover monograph and archival collector packaging.', 'Designing an archival asset worthy of a multi-million dollar hypercar acquisition.', 'Handcrafted binding using aerospace carbon fiber weaves, silver-foil typography, and custom milled aluminum case.', 'Catalogued into premier private automotive archives globally.', '[{\"label\":\"Limited Edition Print Run\",\"value\":\"110 Copies\"},{\"label\":\"Collector Satisfaction\",\"value\":\"100%\"}]', 1, 6, 1, '2026-09-23 16:57:53'),
(7, 'juventus', 'Juventus Brand System', 'Juventus Football Club', 'brand-identity logo-design', 'Global Iconic Identity & Sensory Stadium Experience', 'Global Icon', 'bento-compact', '2024', 'img/wc-top.jpg', 'Global visual identity system, brand guidelines, and sensory stadium experience touchpoints.', 'Reinventing a century-old heritage sports club into a global lifestyle and entertainment brand.', 'Stripped away legacy shields to introduce an iconic minimalist J-monogram and black/white architectural identity.', 'Became the most recognized contemporary sports rebrand of the decade.', '[{\"label\":\"Global Merchandise Uplift\",\"value\":\"+42%\"},{\"label\":\"Brand Value Growth\",\"value\":\"€180M\"}]', 1, 7, 1, '2026-09-23 16:57:53'),
(8, 'balenciaga', 'Balenciaga Couture Spatial Architecture', 'Balenciaga Paris', 'spatial-packaging brand-identity', 'Monolithic Retail Fixtures & Runway Scenography', 'Couture Spatial', 'bento-compact', '2024', 'img/wc-mid.jpg', 'Architectural spatial system, monolithic raw-concrete retail fixtures, and kinetic runway scenography.', 'Translating post-luxury couture aesthetics into visceral physical and retail spaces.', 'Raw industrial concrete monoliths contrasted with razor-sharp dynamic LED grids and brushed steel display cases.', 'Implemented across premier flagships in Paris, New York, and Seoul.', '[{\"label\":\"Flagship Footfall Increase\",\"value\":\"+65%\"},{\"label\":\"Runway Live Impressions\",\"value\":\"18M\"}]', 1, 8, 1, '2026-09-23 16:57:53'),
(9, 'polene', 'Polène Paris Leather Goods', 'Polène Paris', 'spatial-packaging brand-identity', 'Sculptural Leather Goods Packaging & 3D Assets', 'Luxury Atelier', 'bento-compact', '2024', 'img/wc-bot.jpg', 'Sculptural leather goods packaging, tactile materiality, and 3D architectural campaign assets.', 'Crafting unboxing rituals that honor organic curves and leather artisanry.', 'Sculpted organic box architectures with hidden magnetic pivots and debossed metallic signatures.', 'Elevated brand perception into premier tier luxury leather goods.', '[{\"label\":\"D2C Global Conversion\",\"value\":\"+28%\"},{\"label\":\"Organic Viral Reach\",\"value\":\"5.4M\"}]', 1, 9, 1, '2026-09-23 16:57:53'),
(10, 'rimowa', 'Rimowa Monolith Archive', 'Rimowa Cologne', 'web-design brand-identity', 'Monolithic Digital Flagship & 3D WebGL Configurator', 'Industrial Luxury', 'bento-compact', '2024', 'img/f-brand-3.jpg', 'Monolithic digital flagship, aluminum 3D configurator, and high-velocity global checkout experience.', 'Building a digital flagship reflecting the precision grooves and lifetime durability of aluminum travel cases.', 'Engineered real-time WebGL grooved aluminum reflections with personalized laser-engraving simulations.', 'Highest online customizer engagement rate in brand history.', '[{\"label\":\"Configurator Engagement\",\"value\":\"4.8 Min\"},{\"label\":\"Mobile Checkout Speed\",\"value\":\"1.2s\"}]', 1, 10, 1, '2026-09-23 16:57:53');

-- --------------------------------------------------------

--
-- Table structure for table `seo_meta`
--

CREATE TABLE `seo_meta` (
  `id` int NOT NULL,
  `page_key` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `keywords` text COLLATE utf8mb4_unicode_ci,
  `og_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'img/hero-luxury.jpg',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `seo_meta`
--

INSERT INTO `seo_meta` (`id`, `page_key`, `title`, `description`, `keywords`, `og_image`, `updated_at`) VALUES
(1, 'global', '1928 Creative Studio', '1928 Creative Studio sculpts iconic visual identities, immersive digital platforms, spatial environments, and transformative brand campaigns.', 'brand engineering, luxury identity, webgl digital platforms, spatial design, strategy, creative studio', 'img/hero-luxury.jpg', '2026-09-23 16:57:52'),
(2, 'home', '1928 Creative Studio · Independent Brand Engineering & Digital Architecture', '1928 Creative Studio sculpts iconic visual identities, immersive digital platforms, spatial environments, and transformative brand campaigns.', '1928 creative studio, brand architecture, luxury branding agency, high-end web design, digital experiences, ahmedabad branding studio', 'img/hero-luxury.jpg', '2026-09-23 16:57:52'),
(3, 'about', 'About · 1928 Creative Studio — Origins, Philosophy & Principles', '1928 Creative Studio is an independent brand engineering practice sculpting iconic visual identities, spatial environments, and digital platforms.', 'about 1928 studio, brand philosophy, studio origins, strategic design practice, creative direction, design team', 'img/hero-luxury.jpg', '2026-09-23 16:57:52'),
(4, 'services', 'Services & Capabilities · 1928 Creative Studio', 'Comprehensive creative capabilities: Brand Strategy, Visual Identity Systems, WebGL Digital Architecture, Spatial Design, and High-Impact Content Creation.', 'brand identity services, web design services, packaging design, digital marketing, corporate branding, webgl development', 'img/hero-luxury.jpg', '2026-09-23 16:57:52'),
(5, 'portfolio', 'Work & Archives · 1928 Creative Studio', 'A curated selection of branding, digital experiences, content, and spatial work created to solve real business challenges and build market leaders.', '1928 portfolio, luxury case studies, brand identity projects, web design portfolio, packaging design showcase', 'img/hero-luxury.jpg', '2026-09-23 16:57:52'),
(6, 'blogs', 'Perspectives · 1928 Creative Studio — Strategic Design Research & Cultural Theorems', 'A provocative research laboratory and editorial codex exploring mathematical brand geometry, computational spatial physics, and luxury market dominance.', 'design perspectives, brand research, typography theorems, digital architecture insights, creative strategy blog', 'img/hero-luxury.jpg', '2026-09-23 16:57:52'),
(7, 'contact', 'Start a Project · 1928 Creative Studio', 'Connect with 1928 Creative Studio to engineer your next iconic visual identity, digital flagship, or transformative brand expansion.', 'contact 1928, hire branding agency, project inquiry, luxury studio contact, creative consultation', 'img/hero-luxury.jpg', '2026-09-23 16:57:52');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int NOT NULL,
  `service_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `num` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tagline` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `deliverables_json` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_order` int DEFAULT '1',
  `active` tinyint(1) DEFAULT '1',
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `service_id`, `num`, `title`, `tagline`, `description`, `deliverables_json`, `display_order`, `active`, `image_url`) VALUES
(1, 'svc-logo', '01', 'Logo Design new', 'Testing chnages', 'We design enduring logos and visual hallmarks that anchor brand recognition and scale effortlessly across physical and digital mediums.', '[\"Primary & Secondary Marks\",\"Monogram Architecture\",\"Vector Master Codex\",\"Usage Guidelines\"]', 1, 1, 'assets/uploads/1928_1792788123_UX-Design-That-Converts.png'),
(2, 'svc-brand', '02', 'Brand Identity Development', 'End-to-End Visual & Strategic Universes', 'From custom typography and color chemistry to tactile collateral and brand books, we build complete identities that command prestige.', '[\"Full Identity Guidelines\", \"Custom Typography Systems\", \"Packaging Direction\", \"Collateral Suite\"]', 2, 1, NULL),
(3, 'svc-web', '03', 'Website Design & Development', 'High-Performance WebGL & Digital Flagships', 'Interactive digital platforms engineered with kinetic physics, fluid responsiveness, and conversion architecture to turn visitors into advocates.', '[\"Custom UI/UX Architecture\", \"WebGL & Kinetic Micro-Interactions\", \"CMS Integration\", \"Ultra-Fast Optimization\"]', 3, 1, NULL),
(4, 'svc-social', '04', 'Social Media & Digital Marketing', 'High-Frequency Cultural Relevance & Growth', 'Strategic campaign direction, algorithmic content distribution, and brand narrative engineering to drive sustained engagement.', '[\"Content Strategy & Calendar\", \"Performance Ad Creatives\", \"Grid Architecture\", \"Community Growth Playbook\"]', 4, 1, NULL),
(5, 'svc-content', '05', 'Content Creation & Influencer Marketing', 'Cinema-Grade Storytelling & Strategic Partnerships', 'Editorial video production, 3D visual effects, and curated influencer collaborations that place your brand in the cultural conversation.', '[\"4K Video Production\", \"3D Motion Graphics\", \"Talent Curation & Briefing\", \"Campaign Telemetry\"]', 5, 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `studio_principles`
--

CREATE TABLE `studio_principles` (
  `id` int NOT NULL,
  `principle_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `num` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pill` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `tags_json` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_order` int DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `studio_principles`
--

INSERT INTO `studio_principles` (`id`, `principle_id`, `num`, `pill`, `title`, `description`, `tags_json`, `display_order`) VALUES
(1, 'p1', '01', 'Think With Purpose', 'STRATEGIC THINKING', 'We start with the bigger picture. Your goals, audience, market and ambition shape every creative decision we make.', '[\"BUSINESS FIRST\",\"CLEAR DIRECTION\",\"PURPOSEFUL IDEAS\"]', 1),
(2, 'p2', '02', 'Make It Matter', 'DISTINCTIVE CRAFT', 'Every detail has a role. We create identities and experiences with clarity, character and a visual point of view that people remember.', '[\"DETAIL\", \"CHARACTER\", \"RECOGNITION\"]', 2),
(3, 'p3', '03', 'Create Real Connection', 'HUMAN CONNECTION', 'Great brands connect before they convert. We build stories, content and experiences that feel relevant, natural and human.', '[\"STORY\", \"CULTURE\", \"CONNECTION\"]', 3),
(4, 'p4', '04', 'Create Lasting Value', 'BUILT FOR GROWTH', 'A stronger brand should create opportunities for a stronger business. We design every touchpoint with growth, relevance and long-term value in mind.', '[\"BRAND\", \"BUSINESS\", \"GROWTH\"]', 4);

-- --------------------------------------------------------

--
-- Table structure for table `studio_profile`
--

CREATE TABLE `studio_profile` (
  `id` int NOT NULL,
  `story_headline` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `story_description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `pillars_json` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `studio_profile`
--

INSERT INTO `studio_profile` (`id`, `story_headline`, `story_description`, `pillars_json`, `updated_at`) VALUES
(1, 'WE TURN AMBITION INTO MOMENTUM.', 'Built by people who believe every business has the potential to become a meaningful brand.', '[{\"num\":\"01\",\"tag\":\"FOUNDATION\",\"text\":\"1928 Creative Studio was founded by Ami and Tushar, bringing together creative thinking, strategic direction and digital expertise under one roof.\",\"sub\":\"STRATEGY + CRAFT\"},{\"num\":\"02\",\"tag\":\"EXPERIENCE\",\"text\":\"With 10+ years of experience, we work with businesses to shape how they look, how they communicate, and how they grow.\",\"sub\":\"10+ YEARS EXPERTISE\"},{\"num\":\"03\",\"tag\":\"INTEGRATION\",\"text\":\"From identity and digital experiences to content, marketing and influence, we help businesses move closer to their goals, with every part of the brand working together.\",\"sub\":\"COMPLETE LIFECYCLE\"}]', '2026-09-23 16:57:52');

-- --------------------------------------------------------

--
-- Table structure for table `studio_settings`
--

CREATE TABLE `studio_settings` (
  `setting_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting_value` text COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `studio_settings`
--

INSERT INTO `studio_settings` (`setting_key`, `setting_value`) VALUES
('behance', 'https://behance.net'),
('contact_brief', '{\"header\":{\"title\":\"Start a Project.\",\"badge\":\"Confidential Brief \\u00b7 Partner Review\",\"desc\":\"Specify your engagement parameters to initiate a confidential studio brief.\"},\"step1\":{\"railWord\":\"Scope\",\"headline\":\"Engagement Classification\",\"caption\":\"Select the primary service for this project.\",\"cards\":[{\"id\":\"scope-1\",\"index\":\"01 \\/ VISUAL IDENTITY\",\"title\":\"Logo Design\",\"keywords\":[\"Logos\",\"Wordmarks\",\"Direction\"],\"mandate\":\"Logo Design\"},{\"id\":\"scope-2\",\"index\":\"02 \\/ BRAND SYSTEM\",\"title\":\"Brand Identity Development\",\"keywords\":[\"Strategy\",\"Guidelines\",\"Systems\"],\"mandate\":\"Brand Identity Development\"},{\"id\":\"scope-3\",\"index\":\"03 \\/ DIGITAL EXPERIENCE\",\"title\":\"Website Design & Development\",\"keywords\":[\"UI\\/UX\",\"Websites\",\"E-Commerce\"],\"mandate\":\"Website Design & Development\"},{\"id\":\"scope-4\",\"index\":\"04 \\/ DIGITAL GROWTH\",\"title\":\"Social Media & Digital Marketing\",\"keywords\":[\"Social Media\",\"Meta Ads\",\"SEO\"],\"mandate\":\"Social Media & Digital Marketing\"},{\"id\":\"scope-5\",\"index\":\"05 \\/ CONTENT & INFLUENCE\",\"title\":\"Content Creation & Influencer Marketing\",\"keywords\":[\"Reels\",\"Video\",\"Campaigns\"],\"mandate\":\"Content Creation & Influencer Marketing\"}]},\"step2\":{\"railWord\":\"Disciplines\",\"headline\":\"Specialized Disciplines\",\"caption\":\"Choose all deliverables and capabilities required for this engagement.\",\"disciplines\":[{\"id\":\"disc-1\",\"label\":\"Logo & Symbol Design\",\"defaultSelected\":true},{\"id\":\"disc-2\",\"label\":\"Brand Guidelines & Systems\",\"defaultSelected\":true},{\"id\":\"disc-3\",\"label\":\"UI\\/UX & Web Design\",\"defaultSelected\":false},{\"id\":\"disc-4\",\"label\":\"WordPress & E-Commerce\",\"defaultSelected\":false},{\"id\":\"disc-5\",\"label\":\"Social Media Management\",\"defaultSelected\":false},{\"id\":\"disc-6\",\"label\":\"Meta Ads & Performance\",\"defaultSelected\":false},{\"id\":\"disc-7\",\"label\":\"Reels & Video Production\",\"defaultSelected\":false},{\"id\":\"disc-8\",\"label\":\"Influencer Collaborations\",\"defaultSelected\":false}]},\"step3\":{\"railWord\":\"Allocation\",\"headline\":\"Capital Allocation (INR \\u20b9)\",\"caption\":\"Select your target budget tier and optional consultation window.\",\"tiers\":[{\"id\":\"tier-1\",\"amount\":\"< \\u20b915 Lakhs\",\"name\":\"Targeted Sprint\",\"defaultSelected\":false},{\"id\":\"tier-2\",\"amount\":\"\\u20b915L \\u2013 \\u20b930 Lakhs\",\"name\":\"Core Evolution\",\"defaultSelected\":true},{\"id\":\"tier-3\",\"amount\":\"\\u20b930L \\u2013 \\u20b960 Lakhs\",\"name\":\"Flagship Venture\",\"defaultSelected\":false},{\"id\":\"tier-4\",\"amount\":\"\\u20b960 Lakhs+\",\"name\":\"Comprehensive\",\"defaultSelected\":false}],\"timelineTitle\":\"Target Engagement Timeline\",\"timelines\":[{\"id\":\"tl-1\",\"label\":\"< 1 Month (Immediate)\",\"defaultSelected\":true},{\"id\":\"tl-2\",\"label\":\"1 \\u2013 3 Months (Standard)\",\"defaultSelected\":false},{\"id\":\"tl-3\",\"label\":\"3 \\u2013 6 Months (Strategic)\",\"defaultSelected\":false},{\"id\":\"tl-4\",\"label\":\"Flexible \\/ Exploring\",\"defaultSelected\":false}]},\"step4\":{\"railWord\":\"Session\",\"headline\":\"Strategy Session Window\",\"caption\":\"Select your preferred 30-minute consultation window with our design leadership.\",\"defaultYear\":2026,\"defaultMonth\":10,\"defaultDay\":7,\"timezone\":\"Asia\\/Kolkata (GMT+5:30)\",\"slotsCountTemplate\":\"{count} Slots Open\",\"slots\":[\"11:00 AM IST\",\"02:30 PM IST\",\"04:30 PM IST\",\"06:00 PM IST\",\"08:00 PM IST\"],\"bookedDays\":[8,9],\"focusLabel\":\"Consultation Focus Area\",\"focusTopics\":[\"Logo Design & Visual Identity\",\"Brand Identity Development\",\"Website Design & Development\",\"Social Media & Digital Marketing\",\"Content Creation & Influencer Marketing\",\"Full 360\\u00b0 Studio Creative Partnership\"]},\"step5\":{\"railWord\":\"Credentials\",\"headline\":\"Credentials & Brief\",\"caption\":\"Your particulars and project brief.\",\"nameLabel\":\"Full Name *\",\"namePlaceholder\":\"e.g. Alexander Vance\",\"emailLabel\":\"Corporate Email *\",\"emailPlaceholder\":\"e.g. example@gmail.com\",\"orgLabel\":\"Enterprise \\/ Brand *\",\"orgPlaceholder\":\"e.g. 1928 Creative Studio\",\"phoneLabel\":\"Contact Number *\",\"phonePlaceholder\":\"98765 00000\",\"visionLabel\":\"Project Vision & Strategic Ambition *\",\"visionPlaceholder\":\"Describe the strategic objectives, core challenges, and architectural scale...\",\"ndaText\":\"Execute Bilateral Non-Disclosure Agreement (NDA) prior to review.\",\"submitBtnText\":\"Submit Project Brief\",\"successTitle\":\"BRIEF SUBMITTED.\",\"successDesc\":\"Thank you. Your confidential brief has been received by our leadership. We will review your scope parameters and respond within 24 hours.\",\"resetBtnText\":\"Submit Another Brief\"}}'),
('cta_primary_text', 'Start a Project'),
('cta_secondary_text', 'Tell us what you\'re building'),
('email', 'studio@1928creativestudio.com'),
('established', '1928'),
('instagram', 'https://instagram.com'),
('linkedin', 'https://linkedin.com'),
('location', 'Ahmedabad, India · Global Practice'),
('perspectives_curation', '{\"heroTickerIds\":[\"art-monogram\",\"art-spatial\",\"art-webgl\",\"art-fluted\",\"art-monochrome\",\"art-kinetic\",\"art-neural\",\"art-sensory\"],\"featuredCarouselIds\":[\"art-monogram\",\"art-spatial\",\"art-webgl\",\"art-fluted\"],\"codexGridIds\":[\"art-spatial\",\"art-webgl\",\"art-fluted\",\"art-kinetic\",\"art-monochrome\",\"art-quiet\"],\"codexCount\":6}'),
('phone', '+91 98250 19280'),
('studio_name', '1928 Creative Studio'),
('twitter', 'https://twitter.com');

-- --------------------------------------------------------

--
-- Table structure for table `team_members`
--

CREATE TABLE `team_members` (
  `id` int NOT NULL,
  `member_key` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `photo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_order` int DEFAULT '1',
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `team_members`
--

INSERT INTO `team_members` (`id`, `member_key`, `name`, `role`, `photo`, `display_order`, `active`, `created_at`) VALUES
(1, 'ami', 'Ami Panchal h', 'Founder & Creative + Strategy Head h', 'assets/uploads/1928_1790697564_Findade-Logo.png', 1, 1, '2026-09-23 16:57:53'),
(2, 'tushar', 'Tushar Panchal', 'Founder & Marketing Head', 'img/team-tusar.jpg', 2, 1, '2026-09-23 16:57:53'),
(3, 'trusha', 'Trusha Panchal', 'Senior Graphic Designer', 'img/team-elena.jpg', 3, 1, '2026-09-23 16:57:53'),
(4, 'harsh', 'Harsh Patel', 'Senior Video Editor', 'img/team-kaito.jpg', 4, 1, '2026-09-23 16:57:53'),
(5, 'urvish', 'Urvish Mistry', 'Junior Video Editor + Community Manager', 'img/team-ami.jpg', 5, 1, '2026-09-23 16:57:53'),
(6, 'priyal', 'Priyal Lunkar', 'Social Media Manager', 'img/team-elena.jpg', 6, 1, '2026-09-23 16:57:53');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `blog_id` (`blog_id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `client_id` (`client_id`);

--
-- Indexes for table `contact_inquiries`
--
ALTER TABLE `contact_inquiries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_email` (`email`);

--
-- Indexes for table `portfolio`
--
ALTER TABLE `portfolio`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `project_id` (`project_id`);

--
-- Indexes for table `seo_meta`
--
ALTER TABLE `seo_meta`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `page_key` (`page_key`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `service_id` (`service_id`);

--
-- Indexes for table `studio_principles`
--
ALTER TABLE `studio_principles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `principle_id` (`principle_id`);

--
-- Indexes for table `studio_profile`
--
ALTER TABLE `studio_profile`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `studio_settings`
--
ALTER TABLE `studio_settings`
  ADD PRIMARY KEY (`setting_key`);

--
-- Indexes for table `team_members`
--
ALTER TABLE `team_members`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `member_key` (`member_key`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blogs`
--
ALTER TABLE `blogs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `contact_inquiries`
--
ALTER TABLE `contact_inquiries`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `portfolio`
--
ALTER TABLE `portfolio`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `seo_meta`
--
ALTER TABLE `seo_meta`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `studio_principles`
--
ALTER TABLE `studio_principles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `studio_profile`
--
ALTER TABLE `studio_profile`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `team_members`
--
ALTER TABLE `team_members`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
