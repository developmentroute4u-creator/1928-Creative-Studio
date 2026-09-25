/**
 * 1928 CREATIVE STUDIO — Master CMS Data Store & State Engine
 * Manages 100% of website content: SEO metadata, team profiles, studio philosophy,
 * creative workflow process, core services, portfolio case studies, blogs/perspectives, and client logos.
 */
(function (global) {
  'use strict';

  const STORAGE_KEY = '1928_cms_data_v3';
  const EVENT_NAME = '1928_cms_updated';

  // ═══════════════════════════════════════════════════════════
  // 1. MASTER STUDIO FACTORY DATASET (100% OF SITE CONTENT)
  // ═══════════════════════════════════════════════════════════
  const DEFAULT_CMS_DATA = {
    // ── 1. SEO & METADATA ──
    seo: {
      global: {
        siteName: '1928 Creative Studio',
        titleSuffix: ' · 1928 Creative Studio',
        defaultKeywords: 'brand engineering, luxury identity, webgl digital platforms, spatial design, strategy, creative studio',
        ogImage: 'img/hero-luxury.jpg'
      },
      home: {
        title: '1928 Creative Studio · Independent Brand Engineering & Digital Architecture',
        description: '1928 Creative Studio sculpts iconic visual identities, immersive digital platforms, spatial environments, and transformative brand campaigns.',
        keywords: '1928 creative studio, brand architecture, luxury branding agency, high-end web design, digital experiences, ahmedabad branding studio'
      },
      about: {
        title: 'About · 1928 Creative Studio — Origins, Philosophy & Principles',
        description: '1928 Creative Studio is an independent brand engineering practice sculpting iconic visual identities, spatial environments, and digital platforms.',
        keywords: 'about 1928 studio, brand philosophy, studio origins, strategic design practice, creative direction, design team'
      },
      services: {
        title: 'Services & Capabilities · 1928 Creative Studio',
        description: 'Comprehensive creative capabilities: Brand Strategy, Visual Identity Systems, WebGL Digital Architecture, Spatial Design, and High-Impact Content Creation.',
        keywords: 'brand identity services, web design services, packaging design, digital marketing, corporate branding, webgl development'
      },
      portfolio: {
        title: 'Work & Archives · 1928 Creative Studio',
        description: 'A curated selection of branding, digital experiences, content, and spatial work created to solve real business challenges and build market leaders.',
        keywords: '1928 portfolio, luxury case studies, brand identity projects, web design portfolio, packaging design showcase'
      },
      blogs: {
        title: 'Perspectives · 1928 Creative Studio — Strategic Design Research & Cultural Theorems',
        description: 'A provocative research laboratory and editorial codex exploring mathematical brand geometry, computational spatial physics, and luxury market dominance.',
        keywords: 'design perspectives, brand research, typography theorems, digital architecture insights, creative strategy blog'
      },
      contact: {
        title: 'Start a Project · 1928 Creative Studio',
        description: 'Connect with 1928 Creative Studio to engineer your next iconic visual identity, digital flagship, or transformative brand expansion.',
        keywords: 'contact 1928, hire branding agency, project inquiry, luxury studio contact, creative consultation'
      }
    },

    // ── 2. STUDIO PROFILE, TEAM, PRINCIPLES & PROCESS ──
    profile: {
      storyHeadline: "WE TURN AMBITION INTO MOMENTUM.",
      storyDescription: "Built by people who believe every business has the potential to become a meaningful brand.",
      pillars: [
        { num: '01', tag: 'FOUNDATION', text: '1928 Creative Studio was founded by Ami and Tushar, bringing together creative thinking, strategic direction and digital expertise under one roof.', sub: 'STRATEGY + CRAFT' },
        { num: '02', tag: 'EXPERIENCE', text: 'With 10+ years of experience, we work with businesses to shape how they look, how they communicate, and how they grow.', sub: '10+ YEARS EXPERTISE' },
        { num: '03', tag: 'INTEGRATION', text: 'From identity and digital experiences to content, marketing and influence, we help businesses move closer to their goals, with every part of the brand working together.', sub: 'COMPLETE LIFECYCLE' }
      ],
      principles: [
        { id: 'p1', num: '01', pill: 'Think With Purpose', title: 'STRATEGIC THINKING', desc: 'We start with the bigger picture. Your goals, audience, market and ambition shape every creative decision we make.', tags: ['BUSINESS FIRST', 'CLEAR DIRECTION', 'PURPOSEFUL IDEAS'] },
        { id: 'p2', num: '02', pill: 'Make It Matter', title: 'DISTINCTIVE CRAFT', desc: 'Every detail has a role. We create identities and experiences with clarity, character and a visual point of view that people remember.', tags: ['DETAIL', 'CHARACTER', 'RECOGNITION'] },
        { id: 'p3', num: '03', pill: 'Create Real Connection', title: 'HUMAN CONNECTION', desc: 'Great brands connect before they convert. We build stories, content and experiences that feel relevant, natural and human.', tags: ['STORY', 'CULTURE', 'CONNECTION'] },
        { id: 'p4', num: '04', pill: 'Create Lasting Value', title: 'BUILT FOR GROWTH', desc: 'A stronger brand should create opportunities for a stronger business. We design every touchpoint with growth, relevance and long-term value in mind.', tags: ['BRAND', 'BUSINESS', 'GROWTH'] }
      ],
      team: [
        { id: 'team-ami', memberKey: 'ami', name: 'Ami Panchal', role: 'Founder & Creative + Strategy Head', photo: 'img/team-ami.jpg', order: 1 },
        { id: 'team-tushar', memberKey: 'tushar', name: 'Tushar Panchal', role: 'Founder & Marketing Head', photo: 'img/team-tusar.jpg', order: 2 },
        { id: 'team-trusha', memberKey: 'trusha', name: 'Trusha Panchal', role: 'Senior Graphic Designer', photo: 'img/team-elena.jpg', order: 3 },
        { id: 'team-harsh', memberKey: 'harsh', name: 'Harsh Patel', role: 'Senior Video Editor', photo: 'img/team-kaito.jpg', order: 4 },
        { id: 'team-urvish', memberKey: 'urvish', name: 'Urvish Mistry', role: 'Junior Video Editor + Community Manager', photo: 'img/team-ami.jpg', order: 5 },
        { id: 'team-priyal', memberKey: 'priyal', name: 'Priyal Lunkar', role: 'Social Media Manager', photo: 'img/team-elena.jpg', order: 6 }
      ],
      process: [
        { step: '01', phase: 'PHASE 01 // DISCOVER', title: 'Understand Before We Build', desc: 'We get close to your business, audience, market and ambitions to understand what makes your opportunity unique.', tags: ['BUSINESS DISCOVERY', 'AUDIENCE', 'MARKET', 'GOALS'] },
        { step: '02', phase: 'PHASE 02 // DEFINE', title: 'Shape the Direction', desc: 'We turn insights into a clear creative and strategic direction that gives your brand a strong foundation.', tags: ['POSITIONING', 'BRAND DIRECTION', 'CREATIVE STRATEGY'] },
        { step: '03', phase: 'PHASE 03 // CREATE', title: 'Bring the Brand to Life', desc: 'This is where ideas become identities, digital experiences, content and campaigns designed around your brand.', tags: ['IDENTITY', 'DIGITAL', 'CONTENT', 'CAMPAIGNS'] },
        { step: '04', phase: 'PHASE 04 // DELIVER', title: 'Launch With Impact', desc: 'We deploy every asset with precision, ensuring consistent excellence across all physical and digital brand touchpoints.', tags: ['EXECUTION', 'GUIDELINES', 'FLAGSHIPS', 'ACTIVATION'] },
        { step: '05', phase: 'PHASE 05 // GROW', title: 'Iterate & Expand', desc: 'A brand is living architecture. We continue collaborating to scale your reach and maximize market equity over time.', tags: ['SCALING', 'ANALYTICS', 'CULTURE', 'MOMENTUM'] }
      ]
    },

    // ── 3. CORE SERVICES ──
    services: [
      {
        id: 'svc-logo',
        num: '01',
        title: 'Logo Design & Systems',
        tagline: 'Distinctive Marks with Structural Precision',
        desc: 'We design enduring logos and visual hallmarks that anchor brand recognition and scale effortlessly across physical and digital mediums.',
        deliverables: ['Primary & Secondary Marks', 'Monogram Architecture', 'Vector Master Codex', 'Usage Guidelines'],
        order: 1
      },
      {
        id: 'svc-brand',
        num: '02',
        title: 'Brand Identity Development',
        tagline: 'End-to-End Visual & Strategic Universes',
        desc: 'From custom typography and color chemistry to tactile collateral and brand books, we build complete identities that command prestige.',
        deliverables: ['Full Identity Guidelines', 'Custom Typography Systems', 'Packaging Direction', 'Collateral Suite'],
        order: 2
      },
      {
        id: 'svc-web',
        num: '03',
        title: 'Website Design & Development',
        tagline: 'High-Performance WebGL & Digital Flagships',
        desc: 'Interactive digital platforms engineered with kinetic physics, fluid responsiveness, and conversion architecture to turn visitors into advocates.',
        deliverables: ['Custom UI/UX Architecture', 'WebGL & Kinetic Micro-Interactions', 'CMS Integration', 'Ultra-Fast Optimization'],
        order: 3
      },
      {
        id: 'svc-social',
        num: '04',
        title: 'Social Media & Digital Marketing',
        tagline: 'High-Frequency Cultural Relevance & Growth',
        desc: 'Strategic campaign direction, algorithmic content distribution, and brand narrative engineering to drive sustained engagement.',
        deliverables: ['Content Strategy & Calendar', 'Performance Ad Creatives', 'Grid Architecture', 'Community Growth Playbook'],
        order: 4
      },
      {
        id: 'svc-content',
        num: '05',
        title: 'Content Creation & Influencer Marketing',
        tagline: 'Cinema-Grade Storytelling & Strategic Partnerships',
        desc: 'Editorial video production, 3D visual effects, and curated influencer collaborations that place your brand in the cultural conversation.',
        deliverables: ['4K Video Production', '3D Motion Graphics', 'Talent Curation & Briefing', 'Campaign Telemetry'],
        order: 5
      }
    ],

    // ── 4. CLIENT & PARTNER LOGOS ──
    clients: [
      {
        id: 'client-oberoi',
        name: 'The Oberoi Group',
        subtitle: 'Luxury Hospitality & Leisure',
        websiteUrl: '#',
        type: 'svg',
        svgCode: '<svg viewBox="0 0 160 40" class="brand-logo-svg"><path d="M 25 20 C 25 12, 35 12, 35 20 C 35 28, 25 28, 25 20 Z M 20 20 C 20 8, 40 8, 40 20 C 40 32, 20 32, 20 20 Z" fill="#E51937"/><text x="48" y="26" font-family="\'Montserrat\', sans-serif" font-weight="700" font-size="15" fill="currentColor" letter-spacing="3px">OBEROI</text></svg>',
        active: true,
        order: 1
      },
      {
        id: 'client-taj',
        name: 'Taj Hotels & Palaces',
        subtitle: 'Heritage Luxury & Resorts',
        websiteUrl: '#',
        type: 'svg',
        svgCode: '<svg viewBox="0 0 160 40" class="brand-logo-svg"><path d="M 20 28 L 30 10 L 40 28 Z M 27 22 L 33 22" stroke="#E51937" stroke-width="2" fill="none"/><text x="50" y="26" font-family="\'Montserrat\', sans-serif" font-weight="800" font-size="16" fill="currentColor" letter-spacing="4px">TAJ</text></svg>',
        active: true,
        order: 2
      },
      {
        id: 'client-leela',
        name: 'The Leela Palaces',
        subtitle: 'Palaces, Hotels & Resorts',
        websiteUrl: '#',
        type: 'svg',
        svgCode: '<svg viewBox="0 0 160 40" class="brand-logo-svg"><circle cx="28" cy="20" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="28" cy="20" r="4" fill="#E51937"/><text x="46" y="25" font-family="\'Montserrat\', sans-serif" font-weight="700" font-size="14" fill="currentColor" letter-spacing="2.5px">THE LEELA</text></svg>',
        active: true,
        order: 3
      },
      {
        id: 'client-itc',
        name: 'ITC Luxury Collection',
        subtitle: 'Sustainable Hospitality',
        websiteUrl: '#',
        type: 'svg',
        svgCode: '<svg viewBox="0 0 160 40" class="brand-logo-svg"><rect x="18" y="12" width="22" height="16" fill="none" stroke="#E51937" stroke-width="2"/><text x="23" y="25" font-family="\'Montserrat\', sans-serif" font-weight="900" font-size="12" fill="currentColor">ITC</text><text x="48" y="25" font-family="\'Montserrat\', sans-serif" font-weight="600" font-size="13" fill="currentColor" letter-spacing="2px">HOTELS</text></svg>',
        active: true,
        order: 4
      },
      {
        id: 'client-sotheby',
        name: "Sotheby's Realty",
        subtitle: 'International Realty & Estates',
        websiteUrl: '#',
        type: 'svg',
        svgCode: '<svg viewBox="0 0 160 40" class="brand-logo-svg"><text x="10" y="25" font-family="\'Montserrat\', sans-serif" font-weight="700" font-size="13.5" fill="currentColor" letter-spacing="1px">SOTHEBY\'S</text><circle cx="120" cy="18" r="3" fill="#E51937"/></svg>',
        active: true,
        order: 5
      },
      {
        id: 'client-crest',
        name: 'Crest Luxury Assets',
        subtitle: 'Private Equity & Assets',
        websiteUrl: '#',
        type: 'svg',
        svgCode: '<svg viewBox="0 0 160 40" class="brand-logo-svg"><polygon points="30,8 42,32 18,32" stroke="#E51937" stroke-width="2" fill="none"/><text x="50" y="26" font-family="\'Montserrat\', sans-serif" font-weight="800" font-size="16" fill="currentColor" letter-spacing="2px">CREST</text></svg>',
        active: true,
        order: 6
      },
      {
        id: 'client-kinesis',
        name: 'Kinesis',
        subtitle: 'Spatial Identity',
        websiteUrl: '#',
        type: 'svg',
        svgCode: '<svg viewBox="0 0 160 40" class="brand-logo-svg"><path d="M 25 20 Q 35 10 45 20 T 65 20" stroke="#E51937" stroke-width="3" fill="none"/><text x="75" y="25" font-family="\'Montserrat\', sans-serif" font-weight="800" font-size="16" fill="currentColor">KINESIS</text></svg>',
        active: true,
        order: 7
      },
      {
        id: 'client-aura',
        name: 'Aura Systems',
        subtitle: 'Visual Systems',
        websiteUrl: '#',
        type: 'svg',
        svgCode: '<svg viewBox="0 0 160 40" class="brand-logo-svg"><circle cx="40" cy="20" r="8" fill="none" stroke="currentColor" stroke-width="2"/><text x="60" y="26" font-family="\'Montserrat\', sans-serif" font-weight="800" font-size="18" fill="currentColor" letter-spacing="1px">AURA</text></svg>',
        active: true,
        order: 8
      },
      {
        id: 'client-jukku',
        name: 'Jukku Digital',
        subtitle: 'Digital Growth',
        websiteUrl: '#',
        type: 'svg',
        svgCode: '<svg viewBox="0 0 160 40" class="brand-logo-svg"><text x="80" y="26" text-anchor="middle" font-family="\'Montserrat\', sans-serif" font-weight="900" font-size="20" fill="#C8102E" letter-spacing="1px">JUKKU</text></svg>',
        active: true,
        order: 9
      },
      {
        id: 'client-synapse',
        name: 'Synapse',
        subtitle: 'Product Architecture',
        websiteUrl: '#',
        type: 'svg',
        svgCode: '<svg viewBox="0 0 160 40" class="brand-logo-svg"><circle cx="30" cy="20" r="6" fill="#E51937"/><circle cx="45" cy="20" r="6" fill="currentColor"/><text x="60" y="26" font-family="\'Montserrat\', sans-serif" font-weight="800" font-size="16" fill="currentColor">SYNAPSE</text></svg>',
        active: true,
        order: 10
      },
      {
        id: 'client-monolith',
        name: 'Monolith',
        subtitle: 'Spatial Design',
        websiteUrl: '#',
        type: 'svg',
        svgCode: '<svg viewBox="0 0 160 40" class="brand-logo-svg"><rect x="25" y="10" width="18" height="20" fill="currentColor"/><text x="52" y="26" font-family="\'Montserrat\', sans-serif" font-weight="900" font-size="16" fill="currentColor">MONOLITH</text></svg>',
        active: true,
        order: 11
      },
      {
        id: 'client-solaris',
        name: 'Solaris Energy',
        subtitle: 'Energy & Innovation',
        websiteUrl: '#',
        type: 'svg',
        svgCode: '<svg viewBox="0 0 160 40" class="brand-logo-svg"><polygon points="35,12 45,20 35,28" fill="#E51937"/><text x="55" y="26" font-family="\'Montserrat\', sans-serif" font-weight="800" font-size="16" fill="currentColor" letter-spacing="1.5px">SOLARIS</text></svg>',
        active: true,
        order: 12
      }
    ],

    // ── 5. PORTFOLIO CASE STUDIES ──
    portfolio: [
      {
        id: 'aurora',
        title: 'Aurora Chronometer Systems',
        client: 'Aurora Horology Geneve',
        category: 'brand-identity web-design logo-design',
        categoryDisplay: 'Swiss Luxury Brand Identity & 3D Vault',
        tagPill: 'Horology & WebGL',
        gridSpan: 'bento-wide',
        year: '2025',
        coverImage: 'img/port-chronos.jpg',
        featured: true,
        order: 1,
        summary: 'A complete haute horlogerie visual identity system, architectural physical packaging, and custom WebGL timekeeper showcase.',
        metrics: [
          { label: 'Market Valuation Uplift', value: '+340%' },
          { label: 'Private Vault Inquiries', value: '4.8k' },
          { label: 'Global Design Accolades', value: '04' }
        ],
        challenge: 'Positioning an independent Geneva watchmaker against century-old heritage conglomerates without diluting precision credentials.',
        approach: 'Designed a monolithic titanium-grade visual identity system paired with an interactive 120fps WebGL virtual tourbillon configurator.',
        impact: 'Sold out the inaugural 100-piece production run within 72 hours of global digital launch.'
      },
      {
        id: 'veloce',
        title: 'Veloce Hypercraft Platforms',
        client: 'Veloce Automobili Modena',
        category: 'web-design brand-identity',
        categoryDisplay: 'Automotive Digital Flagship & Raytraced Configurator',
        tagPill: 'Automotive & 3D',
        gridSpan: 'bento-compact',
        year: '2025',
        coverImage: 'img/port-veloce.jpg',
        featured: true,
        order: 2,
        summary: 'Digital ecosystem engineered for electric hypercar customization with real-time shader material simulation.',
        metrics: [
          { label: 'Avg Interactive Duration', value: '6.4 Min' },
          { label: 'VIP Allocations Reserved', value: '100%' },
          { label: 'Frame-Rate Target', value: '120 FPS' }
        ],
        challenge: 'Overcoming web browser rendering bottlenecks to showcase real-time carbon-fiber weave finishes.',
        approach: 'Developed custom GLSL fragment shaders simulating accurate photonic refractions across curved hypercar body panels.',
        impact: 'Acquired 18 qualified bespoke hypercar custom orders prior to physical prototype reveals.'
      },
      {
        id: 'elysian',
        title: 'Elysian High Jewelry & Fragrance',
        client: 'Maison Elysian Paris',
        category: 'spatial-packaging brand-identity',
        categoryDisplay: 'Haute Parfumerie Flacon & Travertine Flagship',
        tagPill: 'Packaging & Spatial',
        gridSpan: 'bento-compact',
        year: '2025',
        coverImage: 'img/port-elysian.jpg',
        featured: true,
        order: 3,
        summary: 'Fluted lead-free crystal flacon architecture, weighted magnetic closures, and Milan flagship sensory environment.',
        metrics: [
          { label: 'Retail Revenue per Sq.Ft', value: '€4,200' },
          { label: 'Packaging Retention Rate', value: '96%' }
        ],
        challenge: 'Transforming high perfumery into a sculptural tactile artifact that commands heirloom status.',
        approach: 'Engineered a 480-gram crystal monolith with 1.2N acoustic magnetic snaps and brutalist travertine store fixtures.',
        impact: 'Expanded across 14 premier luxury department stores in Paris, Tokyo, and New York.'
      },
      {
        id: 'noir-atelier',
        title: 'Noir Spatial Architecture & Flagship',
        client: 'Noir Fashion Group Milan',
        category: 'spatial-packaging brand-identity',
        categoryDisplay: 'Brutalist Travertine Flagship Architecture',
        tagPill: 'Spatial Architecture',
        gridSpan: 'bento-wide',
        year: '2024',
        coverImage: 'img/port-noir.jpg',
        featured: true,
        order: 4,
        summary: 'Monolithic interior architecture, directional soundscapes, and negative-space lighting choreography.',
        metrics: [
          { label: 'Footfall Dwell Duration', value: '+210%' },
          { label: 'Conversion Velocity', value: '38%' }
        ],
        challenge: 'Eliminating the commercial feel of traditional retail to create an immersive museum-grade sanctum.',
        approach: 'Incorporated unpolished split-face Roman travertine walls, 2700K surgical beam spotlights, and acoustic felt baffles.',
        impact: 'Won Milan Retail Architecture Design of the Year.'
      },
      {
        id: 'lumina',
        title: 'Lumina Neural Aesthetics Platform',
        client: 'Lumina AI Zurich',
        category: 'web-design brand-identity',
        categoryDisplay: 'Liquid Metal UI & Generative Research Interface',
        tagPill: 'AI Interface & WebGL',
        gridSpan: 'bento-wide',
        year: '2024',
        coverImage: 'img/port-lumina.jpg',
        featured: true,
        order: 5,
        summary: 'Generative liquid chrome shader interfaces representing deep neural state transformations.',
        metrics: [
          { label: 'Series A Raised', value: '$24M' },
          { label: 'User Retention Rate', value: '88%' }
        ],
        challenge: 'Making complex deep learning workflows feel human, organic, and visually captivating.',
        approach: 'Replaced sterile SaaS dashboard widgets with dynamic fluid simulations that adapt to computational confidence.',
        impact: 'Positioned Lumina as the definitive luxury interface in enterprise artificial intelligence.'
      },
      {
        id: 'bugatti',
        title: 'Bugatti Centodieci Collector Codex',
        client: 'Bugatti Automobiles Molsheim',
        category: 'spatial-packaging brand-identity',
        categoryDisplay: 'Aerospace Carbon Fiber Presentation Codex',
        tagPill: 'Collector Codex',
        gridSpan: 'bento-compact',
        year: '2024',
        coverImage: 'img/port-spectra.jpg',
        featured: true,
        order: 6,
        summary: 'Limited-edition bespoke carbon-bound hardcover monograph and archival collector packaging.',
        metrics: [
          { label: 'Limited Edition Print Run', value: '110 Copies' },
          { label: 'Collector Satisfaction', value: '100%' }
        ],
        challenge: 'Designing an archival asset worthy of a multi-million dollar hypercar acquisition.',
        approach: 'Handcrafted binding using aerospace carbon fiber weaves, silver-foil typography, and custom milled aluminum case.',
        impact: 'Catalogued into premier private automotive archives globally.'
      },
      {
        id: 'juventus',
        title: 'Juventus Brand System',
        client: 'Juventus Football Club',
        category: 'brand-identity logo-design',
        categoryDisplay: 'Global Iconic Identity & Sensory Stadium Experience',
        tagPill: 'Global Icon',
        gridSpan: 'bento-compact',
        year: '2024',
        coverImage: 'img/wc-top.jpg',
        featured: true,
        order: 7,
        summary: 'Global visual identity system, brand guidelines, and sensory stadium experience touchpoints.',
        metrics: [
          { label: 'Global Merchandise Uplift', value: '+42%' },
          { label: 'Brand Value Growth', value: '€180M' }
        ],
        challenge: 'Reinventing a century-old heritage sports club into a global lifestyle and entertainment brand.',
        approach: 'Stripped away legacy shields to introduce an iconic minimalist J-monogram and black/white architectural identity.',
        impact: 'Became the most recognized contemporary sports rebrand of the decade.'
      },
      {
        id: 'balenciaga',
        title: 'Balenciaga Couture Spatial Architecture',
        client: 'Balenciaga Paris',
        category: 'spatial-packaging brand-identity',
        categoryDisplay: 'Monolithic Retail Fixtures & Runway Scenography',
        tagPill: 'Couture Spatial',
        gridSpan: 'bento-compact',
        year: '2024',
        coverImage: 'img/wc-mid.jpg',
        featured: true,
        order: 8,
        summary: 'Architectural spatial system, monolithic raw-concrete retail fixtures, and kinetic runway scenography.',
        metrics: [
          { label: 'Flagship Footfall Increase', value: '+65%' },
          { label: 'Runway Live Impressions', value: '18M' }
        ],
        challenge: 'Translating post-luxury couture aesthetics into visceral physical and retail spaces.',
        approach: 'Raw industrial concrete monoliths contrasted with razor-sharp dynamic LED grids and brushed steel display cases.',
        impact: 'Implemented across premier flagships in Paris, New York, and Seoul.'
      },
      {
        id: 'polene',
        title: 'Polène Paris Leather Goods',
        client: 'Polène Paris',
        category: 'spatial-packaging brand-identity',
        categoryDisplay: 'Sculptural Leather Goods Packaging & 3D Assets',
        tagPill: 'Luxury Atelier',
        gridSpan: 'bento-compact',
        year: '2024',
        coverImage: 'img/wc-bot.jpg',
        featured: true,
        order: 9,
        summary: 'Sculptural leather goods packaging, tactile materiality, and 3D architectural campaign assets.',
        metrics: [
          { label: 'D2C Global Conversion', value: '+28%' },
          { label: 'Organic Viral Reach', value: '5.4M' }
        ],
        challenge: 'Crafting unboxing rituals that honor organic curves and leather artisanry.',
        approach: 'Sculpted organic box architectures with hidden magnetic pivots and debossed metallic signatures.',
        impact: 'Elevated brand perception into premier tier luxury leather goods.'
      },
      {
        id: 'rimowa',
        title: 'Rimowa Monolith Archive',
        client: 'Rimowa Cologne',
        category: 'web-design brand-identity',
        categoryDisplay: 'Monolithic Digital Flagship & 3D WebGL Configurator',
        tagPill: 'Industrial Luxury',
        gridSpan: 'bento-compact',
        year: '2024',
        coverImage: 'img/f-brand-3.jpg',
        featured: true,
        order: 10,
        summary: 'Monolithic digital flagship, aluminum 3D configurator, and high-velocity global checkout experience.',
        metrics: [
          { label: 'Configurator Engagement', value: '4.8 Min' },
          { label: 'Mobile Checkout Speed', value: '1.2s' }
        ],
        challenge: 'Building a digital flagship reflecting the precision grooves and lifetime durability of aluminum travel cases.',
        approach: 'Engineered real-time WebGL grooved aluminum reflections with personalized laser-engraving simulations.',
        impact: 'Highest online customizer engagement rate in brand history.'
      }
    ],

    // ── 6. COMPLETE 17 LIVE PERSPECTIVES & MONOGRAPHS (100% SITE MATCH) ──
    blogs: [
      {
        id: 'art-monogram',
        title: 'The Monolithic Luxury Monogram as an Enduring Landmark',
        slug: 'monolithic-luxury-monogram',
        category: 'BRAND ARCHITECTURE',
        categorySlug: 'brand-architecture',
        date: 'SEP 2026',
        readTime: '7 MIN READ',
        city: 'London, UK',
        author: 'Jay Thaker',
        initials: 'JT',
        role: 'Studio Principal & Brand Architect',
        coverImage: 'img/port-chronos.jpg',
        published: true,
        order: 1,
        excerpt: 'How high-growth luxury houses engineer mathematically rigorous marks to command enduring global authority.',
        content: `<h2>01. The Strategic Shift</h2>
<p>For over two centuries, luxury identity was anchored in typographic ornamentation: delicate high-contrast Didone serifs, hand-engraved filigree, and intricate crests meant to signify aristocratic provenance. Today, that aesthetic vocabulary is encountering severe friction in a computational world governed by high-density digital micro-surfaces and monolithic physical environments.</p>
<div class="reader-pullquote">
  <p>"A modern luxury monogram is no longer an emblem of aristocracy; it is an architectural mathematical vector engineered for zero-latency cognitive recognition."</p>
</div>
<h2>02. Mathematical Geometry &amp; Reductive Precision</h2>
<p>When 1928 Creative Studio engineers an enduring monogram, we adhere to strict proportion physics: optical stroke compensation, bespoke grid alignments, and modular counter-space balances. A mark must retain commanding presence whether machined at 3mm on a surgical titanium horology crown or laser-projected 100 meters wide across an airport terminal facade.</p>`
      },
      {
        id: 'art-spatial',
        title: 'Spatial Choreography Across Modern Architectural Luxury Flagship Retail',
        slug: 'spatial-choreography-flagship-retail',
        category: 'SPATIAL DESIGN',
        categorySlug: 'spatial-design',
        date: 'AUG 2026',
        readTime: '6 MIN READ',
        city: 'Milan, Italy',
        author: 'Elena Vance',
        initials: 'EV',
        role: 'Spatial Design Director',
        coverImage: 'img/port-veloce.jpg',
        published: true,
        order: 2,
        excerpt: 'Choreographing visitor trajectories through brutalist travertine monoliths, directional acoustics, and negative-space compression.',
        content: `<h2>01. The Sensory Environment</h2>
<p>Physical retail in 2026 is no longer about inventory distribution; it is sensory brand communion. When a client crosses the threshold into a physical flagship, every sensory input—the acoustic reverberation time of polished concrete, the color temperature of 2700K recessed spotlights, and the scent of custom cedarwood—instantly primes their valuation perception.</p>
<div class="reader-pullquote">
  <p>"The space itself is the most powerful salesperson. When architecture radiates permanence, price resistance dissipates."</p>
</div>
<h2>02. Monolithic Material Physics</h2>
<p>We specify raw split-face travertine, blackened brushed steel, and acoustic felt panels to establish a temple-like reverence. Clients spend 3.2x longer inside acoustically damped private VIP suites than open retail floors.</p>`
      },
      {
        id: 'art-webgl',
        title: 'Zero Latency Computational Raytracing in WebGL Interactive Ecosystems',
        slug: 'computational-raytracing-webgl',
        category: 'COMPUTATIONAL WEBGL',
        categorySlug: 'computational-webgl',
        date: 'AUG 2026',
        readTime: '5 MIN READ',
        city: 'Tokyo, Japan',
        author: 'Kaito Tanaka',
        initials: 'KT',
        role: 'Lead Shader Engineer',
        coverImage: 'img/port-lumina.jpg',
        published: true,
        order: 3,
        excerpt: 'Synthesizing custom GLSL physically-based surface shaders for real-time metallic reflections at native 120 FPS.',
        content: `<h2>01. Beyond the Flat 2D Web</h2>
<p>Static JPEG mockups and auto-playing video loops are remnants of a bygone digital era. The contemporary luxury buyer demands agency—the power to inspect sub-millimeter stitching on an automotive interior or rotate a tourbillon watch under real-time procedural lighting.</p>
<div class="reader-pullquote">
  <p>"Interactive 3D WebGL is not a gimmick; it is the closest digital surrogate to physical touch."</p>
</div>
<h2>02. Custom GLSL Fragment Shaders</h2>
<p>By compiling custom GLSL fragment shaders and implementing procedural normal map decompression, we achieve buttery 120fps performance across mobile Safari and desktop Chrome without draining device thermals.</p>`
      },
      {
        id: 'art-fluted',
        title: 'Tactile Acoustic Snaps and Travertine in Bespoke Packaging',
        slug: 'tactile-acoustic-snaps-travertine',
        category: 'PACKAGING & SPATIAL',
        categorySlug: 'packaging-spatial',
        date: 'JUL 2026',
        readTime: '8 MIN READ',
        city: 'Paris, France',
        author: 'Ami Patel',
        initials: 'AP',
        role: 'Materials & Packaging Specialist',
        coverImage: 'img/port-elysian.jpg',
        published: true,
        order: 4,
        excerpt: 'The psychophysics of 45-decibel acoustic closures, haptic friction coefficients, and unboxing rituals in ultra-luxury design.',
        content: `<h2>01. The Tactile Physics of Glass</h2>
<p>Weight is perceived as quality. A perfume vessel weighing 480 grams with an internal magnetic snap rated at 1.2 Newtons immediately communicates $300+ value before the atomizer is ever depressed.</p>
<div class="reader-pullquote">
  <p>"The tactile sensation of opening a luxury package triggers dopamine pathways faster than visual advertising."</p>
</div>
<h2>02. Light Refraction &amp; Fluting Tolerances</h2>
<p>Precision micro-fluting cut into lead-free crystal glass bends ambient gallery spotlights into vertical prismatic rays, transforming the fragrance liquid into a radiant glowing beacon.</p>`
      },
      {
        id: 'art-monochrome',
        title: 'The 99% Black Spectrum: Chromatic Precision in Semiotics',
        slug: '99-percent-black-spectrum',
        category: 'LUXURY SEMIOTICS',
        categorySlug: 'luxury-semiotics',
        date: 'JUL 2026',
        readTime: '6 MIN READ',
        city: 'Zurich, Switzerland',
        author: 'Jay Thaker',
        initials: 'JT',
        role: 'Studio Principal & Brand Architect',
        coverImage: 'img/port-noir.jpg',
        published: true,
        order: 5,
        excerpt: 'Why restrained monochrome palettes with solitary crimson accents create an impenetrable aura of institutional prestige.',
        content: `<h2>01. Monochromatic Discipline</h2>
<p>Restraint is the ultimate form of luxury. By confining brand color palettes to deep carbon blacks, neutral zincs, and an uncompromising solitary crimson accent, the brand radiates supreme confidence and timeless elegance.</p>
<div class="reader-pullquote">
  <p>"Color attracts attention; pure contrast commands reverence."</p>
</div>
<h2>02. 99% Black Hierarchy</h2>
<p>We work with 5 distinct shades of black: Carbon (#070709), Onyx (#0E0E12), Gunmetal (#14141A), Zinc (#181820), and Obsidian (#000000). Layering these values creates depth without chromatic clutter.</p>`
      },
      {
        id: 'art-kinetic',
        title: 'Kinetic Identity Systems and Mathematical Precision in Modern Typography',
        slug: 'kinetic-identity-systems',
        category: 'CULTURAL CRITIQUE',
        categorySlug: 'cultural-critique',
        date: 'JUN 2026',
        readTime: '4 MIN READ',
        city: 'Milan, Italy',
        author: 'Jay Thaker',
        initials: 'JT',
        role: 'Studio Principal',
        coverImage: 'img/wc-top.jpg',
        published: true,
        order: 6,
        excerpt: 'Deconstructing our viral runway takeover that synchronized architectural projection mapping with high-velocity motion graphics.',
        content: `<h2>01. High-Velocity Typography</h2>
<p>In the noise of Milan Fashion Week, static billboards are invisible. By treating typography as physical kinetic particles that react to model runway pacing, we turned the entire venue into an immersive living typographic ecosystem.</p>
<div class="reader-pullquote">
  <p>"Type in motion is the heartbeat of digital culture. If your letters don't breathe, your brand is already obsolete."</p>
</div>`
      },
      {
        id: 'art-neural',
        title: 'Neural Aesthetics and Liquid Interfaces for Next Generation Platforms',
        slug: 'neural-aesthetics-liquid-interfaces',
        category: 'COMPUTATIONAL WEBGL',
        categorySlug: 'computational-webgl',
        date: 'JUN 2026',
        readTime: '7 MIN READ',
        city: 'Seoul, South Korea',
        author: 'Kaito Tanaka',
        initials: 'KT',
        role: 'Lead Shader Engineer',
        coverImage: 'img/wc-mid.jpg',
        published: true,
        order: 7,
        excerpt: 'Moving beyond sterile flat SaaS dashboards into dynamic, organic liquid chrome shaders that visualize real-time state transitions.',
        content: `<h2>01. Fluid Computational States</h2>
<p>As artificial intelligence systems become more complex, human operators need intuitive qualitative feedback. Procedural liquid metal shaders provide instant visual comprehension of neural confidence metrics and data flow densities.</p>
<div class="reader-pullquote">
  <p>"We are replacing rigid rectangles with fluid computational matter that breathes in rhythm with machine reasoning."</p>
</div>`
      },
      {
        id: 'art-sensory',
        title: 'Architecture of Hospitality Onboarding: High-Touch Conversion',
        slug: 'hospitality-onboarding-architecture',
        category: 'BRAND ARCHITECTURE',
        categorySlug: 'brand-architecture',
        date: 'MAY 2026',
        readTime: '7 MIN READ',
        city: 'Mumbai, India',
        author: 'Tushar Panchal',
        initials: 'TP',
        role: 'Founder & Marketing Head',
        coverImage: 'img/wc-bot.jpg',
        published: true,
        order: 8,
        excerpt: 'Translating five-star European boutique hotel rituals into high-touch luxury digital onboarding flows that eliminate buyer remorse and accelerate client retention.',
        content: `<h2>01. The Art of the Concierge Welcome</h2>
<p>When high-net-worth clients engage with a premium brand, the initial 48-hour onboarding ceremony establishes the entire lifetime relationship value. Automated plain-text confirmation emails destroy anticipation. Instead, choreography of digital tactile invitations and dedicated client dashboards anchors loyalty.</p>`
      },
      {
        id: 'art-quiet',
        title: 'The Anti-Algorithmic Luxury Paradigm: Why Scarcity Drives Brand Equity',
        slug: 'anti-algorithmic-luxury-paradigm',
        category: 'CULTURAL CRITIQUE',
        categorySlug: 'cultural-critique',
        date: 'MAY 2026',
        readTime: '9 MIN READ',
        city: 'Kyoto, Japan',
        author: 'Jay Thaker',
        initials: 'JT',
        role: 'Studio Principal & Brand Architect',
        coverImage: 'img/port-chronos.jpg',
        published: true,
        order: 9,
        excerpt: 'Why high-growth luxury maisons reject relentless social output in favor of intentional friction, mystery, and physical artifact supremacy.',
        content: `<h2>01. The Myth of Ubiquity</h2>
<p>Algorithmic content engines demand endless feeding. But luxury is defined by distance. When a brand is available everywhere, it means nothing. Intentional scarcity and cryptographic gating preserve the essential mystique that commands 10x price premiums.</p>
<div class="reader-pullquote">
  <p>"If your brand is everywhere, it is already nowhere. Real luxury lives in the shadows of intentional scarcity."</p>
</div>`
      },
      {
        id: 'art-typographic-grid',
        title: 'Mathematical Grids and Kinetic Symmetry in Modernist Identity Systems',
        slug: 'mathematical-grids-kinetic-symmetry',
        category: 'BRAND ARCHITECTURE',
        categorySlug: 'brand-architecture',
        date: 'APR 2026',
        readTime: '6 MIN READ',
        city: 'Basel, Switzerland',
        author: 'Jay Thaker',
        initials: 'JT',
        role: 'Studio Principal & Brand Architect',
        coverImage: 'img/port-veloce.jpg',
        published: true,
        order: 10,
        excerpt: 'Applying rational Swiss modernist proportion systems to responsive multi-device digital identity ecosystems.',
        content: `<h2>01. The Rationality of the Grid</h2>
<p>Swiss modernist typography was never about rigidity—it was about creating an invisible harmonious scaffolding where content commands absolute focus. We translate Josef Müller-Brockmann\'s modular principles into dynamic CSS subgrid architectures.</p>
<div class="reader-pullquote">
  <p>"The grid does not constrain creativity; it liberates form from arbitrary visual noise."</p>
</div>`
      },
      {
        id: 'art-haptic-luxury',
        title: 'The Psychophysics of Haptic Resistance in Ultra Luxury Hardware',
        slug: 'psychophysics-haptic-resistance',
        category: 'PACKAGING & SPATIAL',
        categorySlug: 'packaging-spatial',
        date: 'MAR 2026',
        readTime: '8 MIN READ',
        city: 'Munich, Germany',
        author: 'Ami Patel',
        initials: 'AP',
        role: 'Materials & Packaging Specialist',
        coverImage: 'img/port-elysian.jpg',
        published: true,
        order: 11,
        excerpt: 'Calibrating rotary dial torque and magnetic tactile detents to instill subconscious trust in high-end devices.',
        content: `<h2>01. Micro-Newton Calibration</h2>
<p>When an automotive volume rotary switch possesses 0.08 Newton-meters of hydraulic damping resistance, human tactile receptors instantly signal mechanical precision, transforming an electronic volume knob into horological luxury.</p>`
      },
      {
        id: 'art-chromatic-void',
        title: 'Photonic Contrast and Atmospheric Lighting in Modern Gallery Flagships',
        slug: 'photonic-contrast-atmospheric-lighting',
        category: 'SPATIAL DESIGN',
        categorySlug: 'spatial-design',
        date: 'MAR 2026',
        readTime: '5 MIN READ',
        city: 'New York, USA',
        author: 'Elena Vance',
        initials: 'EV',
        role: 'Spatial Design Director',
        coverImage: 'img/port-lumina.jpg',
        published: true,
        order: 12,
        excerpt: 'Utilizing 90% ambient spatial darkness with focused narrow-beam illumination to amplify product valuation.',
        content: `<h2>01. Darkness as a Frame</h2>
<p>Bright retail environments wash out product drama. By plunging 90% of the room into controlled shadow and deploying high-CRI 98+ spotlights with surgical cutoff snoots, every exhibited object takes on the sacred aura of a museum relic.</p>`
      },
      {
        id: 'art-stealth-wealth',
        title: 'Sub-Surface Brand Semiotics in High Horology and Private Aviation',
        slug: 'sub-surface-brand-semiotics',
        category: 'LUXURY SEMIOTICS',
        categorySlug: 'luxury-semiotics',
        date: 'FEB 2026',
        readTime: '7 MIN READ',
        city: 'Geneva, Switzerland',
        author: 'Jay Thaker',
        initials: 'JT',
        role: 'Studio Principal & Brand Architect',
        coverImage: 'img/port-noir.jpg',
        published: true,
        order: 13,
        excerpt: 'How ultra-high-net-worth brands engineer covert visual codes discernible only to initiated cultural connoisseurs.',
        content: `<h2>01. The Cryptographic Code of Luxury</h2>
<p>Overt logos attract mass attention, but alienate connoisseurs. In high horology and private aviation interiors, status is communicated through stealth finishes: hand-anglage chamfering, hidden guilloché dials, and subtle micro-perforations.</p>`
      },
      {
        id: 'art-digital-twins',
        title: 'Physical to Digital Twin Fidelity in Bespoke Automotive Configurator Design',
        slug: 'physical-digital-twin-fidelity',
        category: 'COMPUTATIONAL WEBGL',
        categorySlug: 'computational-webgl',
        date: 'JAN 2026',
        readTime: '6 MIN READ',
        city: 'Stuttgart, Germany',
        author: 'Kaito Tanaka',
        initials: 'KT',
        role: 'Lead Shader Engineer',
        coverImage: 'img/f-brand-3.jpg',
        published: true,
        order: 14,
        excerpt: 'Raymarched anisotropic carbon fiber weaves and multi-coat candy paint shaders for online bespoke luxury customization.',
        content: `<h2>01. Sub-Surface Flake Simulation</h2>
<p>Simulating metallic flake distribution under dynamic orbital HDRI lighting gives buyers absolute confidence when specifying $50,000 bespoke paint options on 8-figure hypercars.</p>`
      },
      {
        id: 'art-monolith-arch',
        title: 'Brutalist Travertine Monoliths and Negative Space in High-End Boutiques',
        slug: 'brutalist-travertine-monoliths',
        category: 'SPATIAL DESIGN',
        categorySlug: 'spatial-design',
        date: 'JAN 2026',
        readTime: '7 MIN READ',
        city: 'Stockholm, Sweden',
        author: 'Elena Vance',
        initials: 'EV',
        role: 'Spatial Design Director',
        coverImage: 'img/wc-mid.jpg',
        published: true,
        order: 15,
        excerpt: 'Carving monumental stone blocks to sculpt intimate sensory chambers within vast luxury architecture.',
        content: `<h2>01. The Weight of Silence</h2>
<p>When monumental 4-ton unpolished Roman travertine blocks anchor a boutique interior, the weight of the physical rock silences ambient noise and demands contemplative deceleration.</p>`
      },
      {
        id: 'art-tactile-unbox',
        title: 'The Ritual of the Unboxing: Micro Tolerances in Rigid Presentation Cases',
        slug: 'ritual-of-the-unboxing',
        category: 'PACKAGING & SPATIAL',
        categorySlug: 'packaging-spatial',
        date: 'DEC 2025',
        readTime: '8 MIN READ',
        city: 'London, UK',
        author: 'Ami Patel',
        initials: 'AP',
        role: 'Materials & Packaging Specialist',
        coverImage: 'img/port-elysian.jpg',
        published: true,
        order: 16,
        excerpt: 'Engineering 3.5-second air-cushion lid descent rates for an unforgettable tactile brand reveal ceremony.',
        content: `<h2>01. Air-Piston Resistance</h2>
<p>When a rigid telescoping box lid drops under its own weight at a calibrated 3.5-second glide, the client experiences sensory suspense before laying eyes on the timepiece.</p>`
      },
      {
        id: 'art-cultural-resonance',
        title: 'Cultural Resonance and Timeless Dominance in Modern Architectural Practice',
        slug: 'cultural-resonance-timeless-dominance',
        category: 'CULTURAL CRITIQUE',
        categorySlug: 'cultural-critique',
        date: 'NOV 2025',
        readTime: '5 MIN READ',
        city: 'Paris, France',
        author: 'Jay Thaker',
        initials: 'JT',
        role: 'Studio Principal & Brand Architect',
        coverImage: 'img/wc-top.jpg',
        published: true,
        order: 17,
        excerpt: 'Synthesizing architectural permanence with high-speed digital agility to build brands that outlive generational cycles.',
        content: `<h2>01. The 100-Year Vision</h2>
<p>Trends disappear within quarters; architectural geometry endures across centuries. By treating branding as physical architecture, we forge institutional equity that stands immune to seasonal aesthetic volatility.</p>`
      }
    ],

    // ── 7. STUDIO SETTINGS & TELEMETRY ──
    settings: {
      studioName: '1928 Creative Studio',
      established: '1928',
      location: 'Ahmedabad, India · Global Practice',
      email: 'studio@1928creativestudio.com',
      phone: '+91 98250 19280',
      socials: {
        instagram: 'https://instagram.com',
        linkedin: 'https://linkedin.com',
        behance: 'https://behance.net',
        twitter: 'https://twitter.com'
      },
      ctaPrimaryText: 'Start a Project',
      ctaSecondaryText: 'Tell us what you\'re building'
    }
  };

  // ═══════════════════════════════════════════════════════════
  // 2. MASTER CMS CONTROLLER CLASS (HYBRID MYSQL + LOCALSTORE)
  // ═══════════════════════════════════════════════════════════
  class CMSStore {
    constructor() {
      this.apiAvailable = false;
      this.data = this._loadData();
      this._initSync();
      this._checkAndSyncDatabase();
    }

    async _checkAndSyncDatabase() {
      try {
        const res = await fetch('api.php?action=get_all', { method: 'GET' });
        if (res.ok) {
          const json = await res.json();
          if (json && json.status === 'success' && json.data) {
            this.apiAvailable = true;
            this.data = {
              seo: { ...DEFAULT_CMS_DATA.seo, ...(json.data.seo || {}) },
              profile: {
                ...DEFAULT_CMS_DATA.profile,
                ...(json.data.profile || {}),
                team: Array.isArray(json.data.profile?.team) ? json.data.profile.team : DEFAULT_CMS_DATA.profile.team,
                principles: Array.isArray(json.data.profile?.principles) ? json.data.profile.principles : DEFAULT_CMS_DATA.profile.principles
              },
              services: Array.isArray(json.data.services) && json.data.services.length ? json.data.services : DEFAULT_CMS_DATA.services,
              clients: Array.isArray(json.data.clients) && json.data.clients.length ? json.data.clients : DEFAULT_CMS_DATA.clients,
              portfolio: Array.isArray(json.data.portfolio) && json.data.portfolio.length ? json.data.portfolio : DEFAULT_CMS_DATA.portfolio,
              blogs: Array.isArray(json.data.blogs) && json.data.blogs.length ? json.data.blogs : DEFAULT_CMS_DATA.blogs,
              settings: { ...DEFAULT_CMS_DATA.settings, ...(json.data.settings || {}) }
            };
            this._saveLocalOnly();
            this._notify();
            console.log('✅ [1928 CMS] Synchronized with MySQL database via Core PHP API.');
          }
        }
      } catch (e) {
        // PHP / MySQL not running or static environment; gracefully running in browser storage mode
      }
    }

    _loadData() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const blogsList = (Array.isArray(parsed.blogs) && parsed.blogs.length >= 15) ? parsed.blogs : DEFAULT_CMS_DATA.blogs;
          return {
            seo: { ...DEFAULT_CMS_DATA.seo, ...(parsed.seo || {}) },
            profile: {
              ...DEFAULT_CMS_DATA.profile,
              ...(parsed.profile || {}),
              team: Array.isArray(parsed.profile?.team) ? parsed.profile.team : DEFAULT_CMS_DATA.profile.team,
              principles: Array.isArray(parsed.profile?.principles) ? parsed.profile.principles : DEFAULT_CMS_DATA.profile.principles,
              process: Array.isArray(parsed.profile?.process) ? parsed.profile.process : DEFAULT_CMS_DATA.profile.process
            },
            services: Array.isArray(parsed.services) ? parsed.services : DEFAULT_CMS_DATA.services,
            clients: Array.isArray(parsed.clients) ? parsed.clients : DEFAULT_CMS_DATA.clients,
            portfolio: Array.isArray(parsed.portfolio) ? parsed.portfolio : DEFAULT_CMS_DATA.portfolio,
            blogs: blogsList,
            settings: { ...DEFAULT_CMS_DATA.settings, ...(parsed.settings || {}) }
          };
        }
      } catch (err) {
        console.warn('[1928 CMS] LocalStorage error, using defaults:', err);
      }
      return JSON.parse(JSON.stringify(DEFAULT_CMS_DATA));
    }

    _saveLocalOnly() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      } catch (err) {}
    }

    _saveData() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        this._notify();
      } catch (err) {
        console.error('[1928 CMS] Failed to save data:', err);
      }
    }

    async _sendToAPI(action, payload) {
      try {
        await fetch(`api.php?action=${encodeURIComponent(action)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        // Silently handled if PHP server is offline
      }
    }

    _notify() {
      const event = new CustomEvent(EVENT_NAME, { detail: this.data });
      window.dispatchEvent(event);
    }

    loadFromStorage() {
      this.data = this._loadData();
      this._notify();
      return this.data;
    }

    async reload() {
      await this._fetchFromAPI();
      this._notify();
      return this.data;
    }

    _initSync() {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY || (e.key && e.key.includes('1928_cms'))) {
          this.data = this._loadData();
          this._notify();
        }
      });
    }

    // ── SEO Methods ──
    getSEO(pageKey = 'global') {
      return this.data.seo[pageKey] || this.data.seo.global || {};
    }
    getAllSEO() {
      return this.data.seo;
    }
    updateSEO(pageKey, seoData) {
      if (!this.data.seo[pageKey]) this.data.seo[pageKey] = {};
      this.data.seo[pageKey] = { ...this.data.seo[pageKey], ...seoData };
      this._saveData();
      this._sendToAPI('save_seo', {
        page_key: pageKey,
        title: this.data.seo[pageKey].title || '',
        description: this.data.seo[pageKey].description || '',
        keywords: this.data.seo[pageKey].keywords || '',
        og_image: this.data.seo[pageKey].ogImage || 'img/hero-luxury.jpg'
      });
      return this.data.seo[pageKey];
    }

    // ── Profile, Team, Principles & Process Methods ──
    getProfile() {
      return this.data.profile;
    }
    updateProfileStory(storyData) {
      this.data.profile = { ...this.data.profile, ...storyData };
      this._saveData();
      return this.data.profile;
    }
    getTeam() {
      return [...(this.data.profile.team || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    saveTeamMember(memberData) {
      if (!memberData.id) {
        memberData.id = 'team-' + Date.now().toString(36);
      }
      const existingIdx = this.data.profile.team.findIndex(m => m.id === memberData.id);
      if (existingIdx >= 0) {
        this.data.profile.team[existingIdx] = { ...this.data.profile.team[existingIdx], ...memberData };
      } else {
        if (!memberData.order) memberData.order = this.data.profile.team.length + 1;
        this.data.profile.team.push(memberData);
      }
      this._saveData();
      this._sendToAPI('save_team', memberData);
      return memberData;
    }
    deleteTeamMember(id) {
      this.data.profile.team = this.data.profile.team.filter(m => m.id !== id);
      this._saveData();
      this._sendToAPI('delete_team', { id });
      return true;
    }
    getPrinciples() {
      return this.data.profile.principles || [];
    }
    savePrinciple(principleData) {
      const idx = this.data.profile.principles.findIndex(p => p.id === principleData.id);
      if (idx >= 0) {
        this.data.profile.principles[idx] = { ...this.data.profile.principles[idx], ...principleData };
      } else {
        this.data.profile.principles.push(principleData);
      }
      this._saveData();
      return principleData;
    }
    getProcess() {
      return this.data.profile.process || [];
    }
    saveProcessStep(stepData) {
      const idx = this.data.profile.process.findIndex(p => p.step === stepData.step);
      if (idx >= 0) {
        this.data.profile.process[idx] = { ...this.data.profile.process[idx], ...stepData };
      } else {
        this.data.profile.process.push(stepData);
      }
      this._saveData();
      return stepData;
    }

    // ── Services Methods ──
    getServices() {
      return [...(this.data.services || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    saveService(serviceData) {
      if (!serviceData.id) {
        serviceData.id = 'svc-' + Date.now().toString(36);
      }
      const idx = this.data.services.findIndex(s => s.id === serviceData.id);
      if (idx >= 0) {
        this.data.services[idx] = { ...this.data.services[idx], ...serviceData };
      } else {
        if (!serviceData.order) serviceData.order = this.data.services.length + 1;
        this.data.services.push(serviceData);
      }
      this._saveData();
      this._sendToAPI('save_service', serviceData);
      return serviceData;
    }
    deleteService(id) {
      this.data.services = this.data.services.filter(s => s.id !== id);
      this._saveData();
      return true;
    }

    // ── Clients Methods ──
    getClients(onlyActive = false) {
      const list = [...(this.data.clients || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
      return onlyActive ? list.filter(c => c.active !== false) : list;
    }
    getClientById(id) {
      return this.data.clients.find(c => c.id === id) || null;
    }
    saveClient(clientData) {
      if (!clientData.id) {
        clientData.id = 'client-' + Date.now().toString(36);
      }
      const existingIdx = this.data.clients.findIndex(c => c.id === clientData.id);
      if (existingIdx >= 0) {
        this.data.clients[existingIdx] = { ...this.data.clients[existingIdx], ...clientData };
      } else {
        if (!clientData.order) clientData.order = this.data.clients.length + 1;
        if (clientData.active === undefined) clientData.active = true;
        this.data.clients.push(clientData);
      }
      this._saveData();
      this._sendToAPI('save_client', clientData);
      return clientData;
    }
    deleteClient(id) {
      this.data.clients = this.data.clients.filter(c => c.id !== id);
      this._saveData();
      this._sendToAPI('delete_client', { id });
      return true;
    }

    // ── Portfolio Methods ──
    getPortfolio(onlyFeatured = false) {
      const list = [...(this.data.portfolio || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
      return onlyFeatured ? list.filter(p => p.featured) : list;
    }
    getProjectById(id) {
      return this.data.portfolio.find(p => p.id === id) || null;
    }
    saveProject(projectData) {
      if (!projectData.id) {
        projectData.id = (projectData.title || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || ('proj-' + Date.now().toString(36));
      }
      const existingIdx = this.data.portfolio.findIndex(p => p.id === projectData.id);
      if (existingIdx >= 0) {
        this.data.portfolio[existingIdx] = { ...this.data.portfolio[existingIdx], ...projectData };
      } else {
        if (!projectData.order) projectData.order = this.data.portfolio.length + 1;
        this.data.portfolio.push(projectData);
      }
      this._saveData();
      this._sendToAPI('save_portfolio', projectData);
      return projectData;
    }
    deleteProject(id) {
      this.data.portfolio = this.data.portfolio.filter(p => p.id !== id);
      this._saveData();
      this._sendToAPI('delete_portfolio', { id });
      return true;
    }

    // ── Blogs / Perspectives Methods ──
    getBlogs(onlyPublished = false) {
      const list = [...(this.data.blogs || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
      return onlyPublished ? list.filter(b => b.published !== false) : list;
    }
    getBlogById(id) {
      return this.data.blogs.find(b => b.id === id || b.slug === id) || null;
    }
    saveBlog(blogData) {
      if (!blogData.id) {
        blogData.id = 'art-' + Date.now().toString(36);
      }
      if (!blogData.slug) {
        blogData.slug = (blogData.title || 'perspective').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      const existingIdx = this.data.blogs.findIndex(b => b.id === blogData.id);
      if (existingIdx >= 0) {
        this.data.blogs[existingIdx] = { ...this.data.blogs[existingIdx], ...blogData };
      } else {
        if (!blogData.order) blogData.order = this.data.blogs.length + 1;
        if (blogData.published === undefined) blogData.published = true;
        this.data.blogs.unshift(blogData);
      }
      this._saveData();
      this._sendToAPI('save_blog', blogData);
      return blogData;
    }
    deleteBlog(id) {
      this.data.blogs = this.data.blogs.filter(b => b.id !== id);
      this._saveData();
      this._sendToAPI('delete_blog', { id });
      return true;
    }

    // ── Settings & Section Curation Methods ──
    getSettings() {
      return this.data.settings || {};
    }
    saveSettings(settingsData) {
      this.data.settings = { ...this.data.settings, ...settingsData };
      this._saveData();
      this._sendToAPI('save_settings', settingsData);
      return this.data.settings;
    }

    getPerspectivesCuration() {
      const allBlogs = this.getBlogs(true);
      const defaultIds = allBlogs.map(b => b.id);
      
      let raw = this.data.settings?.perspectives_curation;
      if (typeof raw === 'string') {
        try { raw = JSON.parse(raw); } catch (e) { raw = null; }
      }

      const heroTickerIds = (Array.isArray(raw?.heroTickerIds) && raw.heroTickerIds.length >= 8) 
        ? raw.heroTickerIds 
        : defaultIds.slice(0, 8);

      const featuredCarouselIds = (Array.isArray(raw?.featuredCarouselIds) && raw.featuredCarouselIds.length >= 4)
        ? raw.featuredCarouselIds
        : defaultIds.slice(0, 4);

      const codexGridIds = (Array.isArray(raw?.codexGridIds) && raw.codexGridIds.length >= 6)
        ? raw.codexGridIds
        : defaultIds.slice(0, 6);

      const codexCount = parseInt(raw?.codexCount, 10) || 6;

      return {
        heroTickerIds,
        featuredCarouselIds,
        codexGridIds,
        codexCount
      };
    }

    savePerspectivesCuration(curationData) {
      if (!this.data.settings) this.data.settings = {};
      this.data.settings.perspectives_curation = curationData;
      this._saveData();
      this._sendToAPI('save_perspectives_curation', curationData);
      return curationData;
    }

    // ── Backup, Export & Reset ──
    exportData() {
      return JSON.stringify(this.data, null, 2);
    }
    importData(jsonString) {
      try {
        const parsed = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
        if (!parsed || typeof parsed !== 'object') throw new Error('Invalid data format');
        this.data = {
          seo: { ...DEFAULT_CMS_DATA.seo, ...(parsed.seo || {}) },
          profile: {
            ...DEFAULT_CMS_DATA.profile,
            ...(parsed.profile || {}),
            team: Array.isArray(parsed.profile?.team) ? parsed.profile.team : DEFAULT_CMS_DATA.profile.team,
            principles: Array.isArray(parsed.profile?.principles) ? parsed.profile.principles : DEFAULT_CMS_DATA.profile.principles,
            process: Array.isArray(parsed.profile?.process) ? parsed.profile.process : DEFAULT_CMS_DATA.profile.process
          },
          services: Array.isArray(parsed.services) ? parsed.services : DEFAULT_CMS_DATA.services,
          clients: Array.isArray(parsed.clients) ? parsed.clients : DEFAULT_CMS_DATA.clients,
          portfolio: Array.isArray(parsed.portfolio) ? parsed.portfolio : DEFAULT_CMS_DATA.portfolio,
          blogs: Array.isArray(parsed.blogs) ? parsed.blogs : DEFAULT_CMS_DATA.blogs,
          settings: { ...DEFAULT_CMS_DATA.settings, ...(parsed.settings || {}) }
        };
        this._saveData();
        return { success: true };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }
    resetToDefaults() {
      this.data = JSON.parse(JSON.stringify(DEFAULT_CMS_DATA));
      this._saveData();
      this._sendToAPI('reset_database', {});
      return true;
    }
  }

  global.CMSStore = new CMSStore();
  global.DEFAULT_1928_DATA = DEFAULT_CMS_DATA;

})(typeof window !== 'undefined' ? window : this);
