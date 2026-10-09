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
      service_logo_design: {
        title: 'Logo Design & Systems · 1928 Creative Studio',
        description: 'Bespoke corporate logos, distinctive wordmarks, responsive emblems, and comprehensive brand signature systems.',
        keywords: 'logo design, bespoke logo, brand mark, luxury wordmark, logo systems, brand signature, visual hallmarks'
      },
      service_brand_identity: {
        title: 'Brand Identity Development · 1928 Creative Studio',
        description: 'End-to-end visual identity systems, typography codices, packaging design, and comprehensive brand books.',
        keywords: 'brand identity, visual identity system, brand guidelines, typography systems, packaging design, corporate identity'
      },
      service_website_development: {
        title: 'Website Design & Development · 1928 Creative Studio',
        description: 'High-performance bespoke websites, headless digital architectures, and conversion-optimized web experiences.',
        keywords: 'website development, bespoke web design, ui ux design, frontend engineering, headless cms, web performance'
      },
      service_digital_marketing: {
        title: 'Social Media & Digital Marketing · 1928 Creative Studio',
        description: 'Strategic digital growth engines, paid social campaigns, performance marketing, and conversion telemetry.',
        keywords: 'digital marketing, social media marketing, meta ads, google ads, performance marketing, conversion optimization'
      },
      service_content_creation: {
        title: 'Content Creation & Influencer Marketing · 1928 Creative Studio',
        description: 'Commercial video production, high-impact social reels, editorial photography, and creator campaign management.',
        keywords: 'content creation, video production, influencer marketing, creator campaigns, brand storytelling, commercial photography'
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
        { step: '01', phase: 'PHASE 01 / DISCOVER', title: 'Understand Before We Build', desc: 'We get close to your business, audience, market and ambitions to understand what makes your opportunity unique.', tags: ['BUSINESS DISCOVERY', 'AUDIENCE', 'MARKET', 'GOALS'] },
        { step: '02', phase: 'PHASE 02 / DEFINE', title: 'Shape the Direction', desc: 'We turn insights into a clear creative and strategic direction that gives your brand a strong foundation.', tags: ['POSITIONING', 'BRAND DIRECTION', 'CREATIVE STRATEGY'] },
        { step: '03', phase: 'PHASE 03 / CREATE', title: 'Bring the Brand to Life', desc: 'This is where ideas become identities, digital experiences, content and campaigns designed around your brand.', tags: ['IDENTITY', 'DIGITAL', 'CONTENT', 'CAMPAIGNS'] },
        { step: '04', phase: 'PHASE 04 / DELIVER', title: 'Launch With Impact', desc: 'We deploy every asset with precision, ensuring consistent excellence across all physical and digital brand touchpoints.', tags: ['EXECUTION', 'GUIDELINES', 'FLAGSHIPS', 'ACTIVATION'] },
        { step: '05', phase: 'PHASE 05 / GROW', title: 'Iterate & Expand', desc: 'A brand is living architecture. We continue collaborating to scale your reach and maximize market equity over time.', tags: ['SCALING', 'ANALYTICS', 'CULTURE', 'MOMENTUM'] }
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
        id: 'client-01',
        name: 'Client Partner 01',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-01.jpg',
        active: true,
        order: 1
      },
      {
        id: 'client-02',
        name: 'Client Partner 02',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-02.jpg',
        active: true,
        order: 2
      },
      {
        id: 'client-03',
        name: 'Client Partner 03',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-03.jpg',
        active: true,
        order: 3
      },
      {
        id: 'client-04',
        name: 'Client Partner 04',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-04.jpg',
        active: true,
        order: 4
      },
      {
        id: 'client-05',
        name: 'Client Partner 05',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-05.jpg',
        active: true,
        order: 5
      },
      {
        id: 'client-06',
        name: 'Client Partner 06',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-06.jpg',
        active: true,
        order: 6
      },
      {
        id: 'client-07',
        name: 'Client Partner 07',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-07.jpg',
        active: true,
        order: 7
      },
      {
        id: 'client-08',
        name: 'Client Partner 08',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-08.jpg',
        active: true,
        order: 8
      },
      {
        id: 'client-09',
        name: 'Client Partner 09',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-09.jpg',
        active: true,
        order: 9
      },
      {
        id: 'client-10',
        name: 'Client Partner 10',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-10.jpg',
        active: true,
        order: 10
      },
      {
        id: 'client-11',
        name: 'Client Partner 11',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-11.jpg',
        active: true,
        order: 11
      },
      {
        id: 'client-12',
        name: 'Client Partner 12',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-12.jpg',
        active: true,
        order: 12
      },
      {
        id: 'client-13',
        name: 'Client Partner 13',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-13.jpg',
        active: true,
        order: 13
      },
      {
        id: 'client-14',
        name: 'Client Partner 14',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-14.jpg',
        active: true,
        order: 14
      },
      {
        id: 'client-15',
        name: 'Client Partner 15',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-15.jpg',
        active: true,
        order: 15
      },
      {
        id: 'client-16',
        name: 'Client Partner 16',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-16.jpg',
        active: true,
        order: 16
      },
      {
        id: 'client-17',
        name: 'Client Partner 17',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-17.jpg',
        active: true,
        order: 17
      },
      {
        id: 'client-18',
        name: 'Client Partner 18',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-18.jpg',
        active: true,
        order: 18
      },
      {
        id: 'client-19',
        name: 'Client Partner 19',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-19.jpg',
        active: true,
        order: 19
      },
      {
        id: 'client-20',
        name: 'Client Partner 20',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-20.jpg',
        active: true,
        order: 20
      },
      {
        id: 'client-21',
        name: 'Client Partner 21',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-21.jpg',
        active: true,
        order: 21
      },
      {
        id: 'client-22',
        name: 'Client Partner 22',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-22.jpg',
        active: true,
        order: 22
      },
      {
        id: 'client-23',
        name: 'Client Partner 23',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-23.jpg',
        active: true,
        order: 23
      },
      {
        id: 'client-24',
        name: 'Client Partner 24',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-24.jpg',
        active: true,
        order: 24
      },
      {
        id: 'client-25',
        name: 'Client Partner 25',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-25.jpg',
        active: true,
        order: 25
      },
      {
        id: 'client-26',
        name: 'Client Partner 26',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-26.jpg',
        active: true,
        order: 26
      },
      {
        id: 'client-27',
        name: 'Client Partner 27',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-27.jpg',
        active: true,
        order: 27
      },
      {
        id: 'client-28',
        name: 'Client Partner 28',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-28.jpg',
        active: true,
        order: 28
      },
      {
        id: 'client-29',
        name: 'Client Partner 29',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-29.jpg',
        active: true,
        order: 29
      },
      {
        id: 'client-30',
        name: 'Client Partner 30',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-30.jpg',
        active: true,
        order: 30
      },
      {
        id: 'client-31',
        name: 'Client Partner 31',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-31.jpg',
        active: true,
        order: 31
      },
      {
        id: 'client-32',
        name: 'Client Partner 32',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-32.jpg',
        active: true,
        order: 32
      },
      {
        id: 'client-33',
        name: 'Client Partner 33',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-33.jpg',
        active: true,
        order: 33
      },
      {
        id: 'client-34',
        name: 'Client Partner 34',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-34.jpg',
        active: true,
        order: 34
      },
      {
        id: 'client-35',
        name: 'Client Partner 35',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-35.jpg',
        active: true,
        order: 35
      },
      {
        id: 'client-36',
        name: 'Client Partner 36',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-36.jpg',
        active: true,
        order: 36
      },
      {
        id: 'client-37',
        name: 'Client Partner 37',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-37.jpg',
        active: true,
        order: 37
      },
      {
        id: 'client-38',
        name: 'Client Partner 38',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-38.jpg',
        active: true,
        order: 38
      },
      {
        id: 'client-39',
        name: 'Client Partner 39',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-39.jpg',
        active: true,
        order: 39
      },
      {
        id: 'client-40',
        name: 'Client Partner 40',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-40.jpg',
        active: true,
        order: 40
      },
      {
        id: 'client-41',
        name: 'Client Partner 41',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-41.jpg',
        active: true,
        order: 41
      },
      {
        id: 'client-42',
        name: 'Client Partner 42',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-42.jpg',
        active: true,
        order: 42
      },
      {
        id: 'client-43',
        name: 'Client Partner 43',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-43.jpg',
        active: true,
        order: 43
      },
      {
        id: 'client-44',
        name: 'Client Partner 44',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-44.jpg',
        active: true,
        order: 44
      },
      {
        id: 'client-45',
        name: 'Client Partner 45',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-45.jpg',
        active: true,
        order: 45
      },
      {
        id: 'client-46',
        name: 'Client Partner 46',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-46.jpg',
        active: true,
        order: 46
      },
      {
        id: 'client-47',
        name: 'Client Partner 47',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-47.jpg',
        active: true,
        order: 47
      },
      {
        id: 'client-48',
        name: 'Client Partner 48',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-48.jpg',
        active: true,
        order: 48
      },
      {
        id: 'client-49',
        name: 'Client Partner 49',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-49.jpg',
        active: true,
        order: 49
      },
      {
        id: 'client-50',
        name: 'Client Partner 50',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-50.jpg',
        active: true,
        order: 50
      },
      {
        id: 'client-51',
        name: 'Client Partner 51',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-51.jpg',
        active: true,
        order: 51
      },
      {
        id: 'client-52',
        name: 'Client Partner 52',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-52.jpg',
        active: true,
        order: 52
      },
      {
        id: 'client-53',
        name: 'Client Partner 53',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-53.jpg',
        active: true,
        order: 53
      },
      {
        id: 'client-54',
        name: 'Client Partner 54',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-54.jpg',
        active: true,
        order: 54
      },
      {
        id: 'client-55',
        name: 'Client Partner 55',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-55.jpg',
        active: true,
        order: 55
      },
      {
        id: 'client-56',
        name: 'Client Partner 56',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-56.jpg',
        active: true,
        order: 56
      },
      {
        id: 'client-57',
        name: 'Client Partner 57',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-57.jpg',
        active: true,
        order: 57
      },
      {
        id: 'client-58',
        name: 'Client Partner 58',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-58.jpg',
        active: true,
        order: 58
      },
      {
        id: 'client-59',
        name: 'Client Partner 59',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-59.jpg',
        active: true,
        order: 59
      },
      {
        id: 'client-60',
        name: 'Client Partner 60',
        subtitle: 'Brand & Spatial Partner',
        websiteUrl: '#',
        type: 'image',
        imageUrl: 'img/Client Logos-60.jpg',
        active: true,
        order: 60
      }
    ],

    // ── 5. PORTFOLIO CASE STUDIES (100% SYNCED WITH LIVE WEBSITE) ──
    portfolio: [
      {
        id: 'vibee',
        title: 'Vibee — Youth Culture & Apparel Identity',
        client: 'Vibee',
        subheading: 'Crafting youth culture, distinctive apparel identity and community storytelling.',
        category: 'brand-identity logo-design',
        categoryDisplay: 'Branding · Apparel & Culture',
        tagPill: 'Youth Branding',
        sector: 'Apparel & Culture',
        deliverables: 'Brand Identity, Logo System, Community Storytelling',
        timeline: 'Project Completed',
        gridSpan: 'bento-wide',
        year: '2025',
        coverImage: 'img/Selected Work Case Study Cards (Portfolio Showcase)-01.jpg',
        bannerImage: 'img/Selected Work Case Study Cards (Portfolio Showcase)-01.jpg',
        featured: true,
        order: 1,
        overview: 'Vibee is a youth-driven apparel brand rooted in culture, community, and self-expression. 1928 Creative Studio crafted a distinctive brand identity that speaks the language of its audience — bold, energetic, and unapologetically authentic.',
        description: 'Crafting youth culture, distinctive apparel identity and community storytelling.',
        summary: 'Crafting youth culture, distinctive apparel identity and community storytelling.',
        challenge: 'Creating a brand identity that resonates authentically with Gen-Z while maintaining commercial scalability.',
        approach: 'Developed a visual language drawn from street culture and music, with a flexible identity system that adapts across digital and physical touchpoints.',
        impact: 'Established Vibee as a recognizable cultural label with a loyal community following.',
        galleryImages: [
          'img/Selected Work Case Study Cards (Portfolio Showcase)-01.jpg'
        ],
        metrics: [
          { label: 'Community Reach', value: '50k+' },
          { label: 'Brand Recognition', value: '+280%' }
        ]
      },
      {
        id: 'infyli',
        title: 'Infyli — Minimalist Luxury Home Aromatics',
        client: 'Infyli',
        subheading: 'Minimalist luxury home aromatics and sensory packaging architecture.',
        category: 'spatial-packaging brand-identity',
        categoryDisplay: 'Lifestyle · Packaging & Identity',
        tagPill: 'Luxury Aromatics',
        sector: 'Lifestyle & Wellness',
        deliverables: 'Brand Identity, Packaging Design, Sensory Architecture',
        timeline: 'Project Completed',
        gridSpan: 'bento-compact',
        year: '2025',
        coverImage: 'img/Selected Work Case Study Cards (Portfolio Showcase)-02.jpg',
        bannerImage: 'img/Selected Work Case Study Cards (Portfolio Showcase)-02.jpg',
        featured: true,
        order: 2,
        overview: 'Infyli is a luxury home aromatics brand that believes in the quiet power of scent and space. 1928 Creative Studio developed a minimalist identity and sensory packaging architecture that commands attention through restraint.',
        description: 'Minimalist luxury home aromatics and sensory packaging architecture.',
        summary: 'Minimalist luxury home aromatics and sensory packaging architecture.',
        challenge: 'Communicating premium sensory experience through minimal visual language.',
        approach: 'Designed packaging around silence and negative space — letting material choice and proportion speak louder than graphics.',
        impact: 'Positioned Infyli as a sought-after luxury lifestyle brand in premium retail.',
        galleryImages: [
          'img/Selected Work Case Study Cards (Portfolio Showcase)-02.jpg'
        ],
        metrics: [
          { label: 'Premium Shelf Placement', value: '12 Stores' },
          { label: 'Brand Recall', value: '+320%' }
        ]
      },
      {
        id: 'mudra-school',
        title: 'Mudra School — Classical Arts Digital Presence',
        client: 'Mudra School',
        subheading: 'Preserving classical Indian performing arts through contemporary digital storytelling.',
        category: 'web-design brand-identity',
        categoryDisplay: 'Arts & Heritage · Digital Presence',
        tagPill: 'Heritage & Culture',
        sector: 'Arts & Education',
        deliverables: 'Brand Identity, Digital Platform, Cultural Storytelling',
        timeline: 'Project Completed',
        gridSpan: 'bento-compact',
        year: '2025',
        coverImage: 'img/Selected Work Case Study Cards (Portfolio Showcase)-03.jpg',
        bannerImage: 'img/Selected Work Case Study Cards (Portfolio Showcase)-03.jpg',
        featured: true,
        order: 3,
        overview: 'Mudra School is a classical Indian performing arts institution with a rich legacy. 1928 Creative Studio bridged tradition and modernity — creating a digital presence that honors cultural heritage while making it accessible and compelling to contemporary audiences.',
        description: 'Preserving classical Indian performing arts through contemporary digital storytelling.',
        summary: 'Preserving classical Indian performing arts through contemporary digital storytelling.',
        challenge: 'Translating centuries of living art tradition into a contemporary digital experience without losing cultural integrity.',
        approach: 'Wove classical visual motifs with modern typography and interactive digital storytelling across web and social platforms.',
        impact: 'Significantly expanded enrollment and digital reach for the institution.',
        galleryImages: [
          'img/Selected Work Case Study Cards (Portfolio Showcase)-03.jpg'
        ],
        metrics: [
          { label: 'Digital Reach Growth', value: '+450%' },
          { label: 'New Enrollments', value: '+60%' }
        ]
      },
      {
        id: 'awards-plus',
        title: 'Awards Plus — Prestige Corporate Identity',
        client: 'Awards Plus',
        subheading: 'Engineering heirloom executive recognition marks and tactile luxury seals.',
        category: 'brand-identity logo-design spatial-packaging',
        categoryDisplay: 'Corporate · Prestige Identity',
        tagPill: 'Corporate Prestige',
        sector: 'Corporate Recognition & Awards',
        deliverables: 'Identity System, Prestige Mark Design, Tactile Packaging',
        timeline: 'Project Completed',
        gridSpan: 'bento-wide',
        year: '2025',
        coverImage: 'img/Selected Work Case Study Cards (Portfolio Showcase)-04.jpg',
        bannerImage: 'img/Selected Work Case Study Cards (Portfolio Showcase)-04.jpg',
        featured: true,
        order: 4,
        overview: 'Awards Plus is a corporate recognition and awards brand. 1928 Creative Studio engineered a prestige identity system that commands respect — from heirloom executive recognition marks to tactile luxury seals worthy of the achievements they celebrate.',
        description: 'Engineering heirloom executive recognition marks and tactile luxury seals.',
        summary: 'Engineering heirloom executive recognition marks and tactile luxury seals.',
        challenge: 'Creating a brand identity that communicates prestige and permanence in the corporate recognition space.',
        approach: 'Developed a monumental identity system anchored in classical proportion, premium material selection, and architectural typography.',
        impact: 'Elevated Awards Plus to the premier corporate recognition brand in its market.',
        galleryImages: [
          'img/Selected Work Case Study Cards (Portfolio Showcase)-04.jpg'
        ],
        metrics: [
          { label: 'Corporate Clients', value: '200+' },
          { label: 'Brand Prestige Score', value: '+400%' }
        ]
      },
      {
        id: 'last-mile-analytics',
        title: 'Last Mile Analytics — Fintech Platform Architecture',
        client: 'Last Mile Analytics',
        subheading: 'Data-driven financial advisory platforms engineered with razor-sharp UX.',
        category: 'web-design brand-identity',
        categoryDisplay: 'Fintech · Platform Architecture',
        tagPill: 'Fintech & Data',
        sector: 'Financial Technology & Advisory',
        deliverables: 'Platform UI/UX, Brand System, Data Visualization',
        timeline: 'Project Completed',
        gridSpan: 'bento-compact',
        year: '2025',
        coverImage: 'img/Selected Work Case Study Cards (Portfolio Showcase)-05.jpg',
        bannerImage: 'img/Selected Work Case Study Cards (Portfolio Showcase)-05.jpg',
        featured: true,
        order: 5,
        overview: 'Last Mile Analytics is a fintech company bringing data-driven financial advisory to underserved markets. 1928 Creative Studio architected a digital platform with razor-sharp UX that makes complex financial data accessible, actionable, and trustworthy.',
        description: 'Data-driven financial advisory platforms engineered with razor-sharp UX.',
        summary: 'Data-driven financial advisory platforms engineered with razor-sharp UX.',
        challenge: 'Making complex financial analytics feel simple, trustworthy, and accessible to non-expert users.',
        approach: 'Built a clean, precision-focused UI system with intelligent data visualization that guides users from insight to action.',
        impact: 'Became the go-to analytics platform for financial advisors in tier-2 and tier-3 markets.',
        galleryImages: [
          'img/Selected Work Case Study Cards (Portfolio Showcase)-05.jpg'
        ],
        metrics: [
          { label: 'User Adoption', value: '+380%' },
          { label: 'Advisory Efficiency', value: '+65%' }
        ]
      },
      {
        id: 'alda',
        title: 'Alda — Precision Stainless Steel Spatial Identity',
        client: 'Alda',
        subheading: 'Elevating everyday living spaces through precision stainless steel industrial design.',
        category: 'brand-identity spatial-packaging web-design',
        categoryDisplay: 'Homeware · Spatial Identity',
        tagPill: 'Industrial Design',
        sector: 'Homeware & Industrial Design',
        deliverables: 'Brand Identity, Spatial Design System, Digital Presence',
        timeline: 'Project Completed',
        gridSpan: 'bento-compact',
        year: '2025',
        coverImage: 'img/Selected Work Case Study Cards (Portfolio Showcase)-06.jpg',
        bannerImage: 'img/Selected Work Case Study Cards (Portfolio Showcase)-06.jpg',
        featured: true,
        order: 6,
        overview: 'Alda crafts precision stainless steel products that elevate everyday living spaces. 1928 Creative Studio developed a spatial identity that mirrors the brand\'s industrial precision — clean, durable, and quietly beautiful.',
        description: 'Elevating everyday living spaces through precision stainless steel industrial design.',
        summary: 'Elevating everyday living spaces through precision stainless steel industrial design.',
        challenge: 'Communicating the functional beauty of industrial-grade design in a warm, aspirational lifestyle context.',
        approach: 'Created an identity system that balances engineering precision with warm spatial aesthetics — translating steel\'s character into brand language.',
        impact: 'Positioned Alda as the premium choice in the precision homeware category.',
        galleryImages: [
          'img/Selected Work Case Study Cards (Portfolio Showcase)-06.jpg'
        ],
        metrics: [
          { label: 'Market Positioning', value: 'Premium Tier' },
          { label: 'Sales Growth', value: '+220%' }
        ]
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
      ctaSecondaryText: 'Tell us what you\'re building',
      portfolioHero: {
        eyebrow: 'PORTFOLIO // 1928 STUDIO',
        titleLine1Prefix: 'WORK THAT',
        pill1ProjectId: 'vibee',
        pill1Img: 'img/Selected Work Case Study Cards (Portfolio Showcase)-01.jpg',
        titleLine1Suffix: 'MOVES',
        titleLine2Prefix: 'BRANDS',
        pill2ProjectId: 'infyli',
        pill2Img: 'img/Selected Work Case Study Cards (Portfolio Showcase)-02.jpg',
        titleLine2Suffix: 'FORWARD.',
        manifesto: 'A curated selection of branding, digital experiences, content, and marketing work created to solve real business challenges and build stronger brands.',
        ctaText: 'EXPLORE OUR WORK'
      },
      servicesHeader: {
        headline: 'OUR CORE SERVICES',
        description: 'From the first visual impression to the way your brand grows in the market, we bring strategy, creativity and execution together under one roof.'
      },
      homeSelectedProjects: ['vibee', 'infyli', 'mudra-school', 'awards-plus', 'last-mile-analytics', 'alda'],
      perspectives_curation: {
        heroTickerIds: ['art-monogram', 'art-spatial', 'art-webgl', 'art-fluted', 'art-kinetic', 'art-quiet', 'art-monochrome', 'art-typographic-grid'],
        featuredCarouselIds: ['art-monogram', 'art-spatial', 'art-webgl', 'art-fluted'],
        codexGridIds: ['art-spatial', 'art-webgl', 'art-fluted', 'art-kinetic', 'art-monochrome', 'art-quiet'],
        codexCount: 6
      }
    },

    // ── 8. CONTACT & MULTI-STEP BRIEF CONFIGURATION ──
    contactBrief: {
      header: {
        title: "Start a Project.",
        desc: "Specify your engagement parameters to initiate a confidential studio brief.",
        badge: "Confidential Brief · Partner Review"
      },
      step1: {
        railWord: "Scope",
        headline: "Engagement Classification",
        caption: "Select the primary service for this project.",
        cards: [
          {
            id: "scope-1",
            index: "01 / VISUAL IDENTITY",
            title: "Logo Design",
            keywords: ["Logos", "Wordmarks", "Direction"],
            mandate: "Logo Design"
          },
          {
            id: "scope-2",
            index: "02 / BRAND SYSTEM",
            title: "Brand Identity Development",
            keywords: ["Strategy", "Guidelines", "Systems"],
            mandate: "Brand Identity Development"
          },
          {
            id: "scope-3",
            index: "03 / DIGITAL EXPERIENCE",
            title: "Website Design & Development",
            keywords: ["UI/UX", "Websites", "E-Commerce"],
            mandate: "Website Design & Development"
          },
          {
            id: "scope-4",
            index: "04 / DIGITAL GROWTH",
            title: "Social Media & Digital Marketing",
            keywords: ["Social Media", "Meta Ads", "SEO"],
            mandate: "Social Media & Digital Marketing"
          },
          {
            id: "scope-5",
            index: "05 / CONTENT & INFLUENCE",
            title: "Content Creation & Influencer Marketing",
            keywords: ["Reels", "Video", "Campaigns"],
            mandate: "Content Creation & Influencer Marketing"
          }
        ]
      },
      step2: {
        railWord: "Disciplines",
        headline: "Specialized Disciplines",
        caption: "Choose all deliverables and capabilities required for this engagement.",
        disciplines: [
          { id: "disc-1", label: "Logo & Symbol Design", defaultSelected: true },
          { id: "disc-2", label: "Brand Guidelines & Systems", defaultSelected: true },
          { id: "disc-3", label: "UI/UX & Web Design", defaultSelected: false },
          { id: "disc-4", label: "WordPress & E-Commerce", defaultSelected: false },
          { id: "disc-5", label: "Social Media Management", defaultSelected: false },
          { id: "disc-6", label: "Meta Ads & Performance", defaultSelected: false },
          { id: "disc-7", label: "Reels & Video Production", defaultSelected: false },
          { id: "disc-8", label: "Influencer Collaborations", defaultSelected: false }
        ]
      },
      step3: {
        railWord: "Allocation",
        headline: "Capital Allocation (INR ₹)",
        caption: "Select your target budget tier and optional consultation window.",
        tiers: [
          { id: "tier-1", amount: "< ₹15 Lakhs", name: "Targeted Sprint", defaultSelected: false },
          { id: "tier-2", amount: "₹15L – ₹30 Lakhs", name: "Core Evolution", defaultSelected: true },
          { id: "tier-3", amount: "₹30L – ₹60 Lakhs", name: "Flagship Venture", defaultSelected: false },
          { id: "tier-4", amount: "₹60 Lakhs+", name: "Comprehensive", defaultSelected: false }
        ],
        timelineTitle: "Target Engagement Timeline",
        timelines: [
          { id: "tl-1", label: "< 1 Month (Immediate)", defaultSelected: true },
          { id: "tl-2", label: "1 – 3 Months (Standard)", defaultSelected: false },
          { id: "tl-3", label: "3 – 6 Months (Strategic)", defaultSelected: false },
          { id: "tl-4", label: "Flexible / Exploring", defaultSelected: false }
        ]
      },
      step4: {
        railWord: "Session",
        headline: "Strategy Session Window",
        caption: "Select your preferred 30-minute consultation window with our design leadership.",
        defaultYear: 2026,
        defaultMonth: 8, // 0 = Jan, 8 = Sep
        defaultDay: 29,
        timezone: "Asia/Kolkata (IST · GMT+5:30)",
        slots: ["11:00 AM IST", "02:30 PM IST", "04:30 PM IST", "06:00 PM IST", "08:00 PM IST"],
        bookedDays: [8, 9],
        focusLabel: "Consultation Focus Area",
        focusTopics: [
          "Logo Design & Visual Identity",
          "Brand Identity Development",
          "Website Design & Development",
          "Social Media & Digital Marketing",
          "Content Creation & Influencer Marketing",
          "Full 360° Studio Creative Partnership"
        ]
      },
      step5: {
        railWord: "Credentials",
        headline: "Credentials & Brief",
        caption: "Your particulars and project brief.",
        nameLabel: "Full Name *",
        namePlaceholder: "e.g. Alexander Vance",
        emailLabel: "Corporate Email *",
        emailPlaceholder: "e.g. example@gmail.com",
        orgLabel: "Enterprise / Brand *",
        orgPlaceholder: "e.g. 1928 Creative Studio",
        phoneLabel: "Contact Number *",
        phonePlaceholder: "98765 00000",
        visionLabel: "Project Vision & Strategic Ambition *",
        visionPlaceholder: "Describe the strategic objectives, core challenges, and architectural scale...",
        ndaText: "Execute Bilateral Non-Disclosure Agreement (NDA) prior to review.",
        submitBtnText: "Submit Project Brief",
        successTitle: "BRIEF SUBMITTED.",
        successDesc: "Thank you. Your confidential brief has been received by our leadership. We will review your scope parameters and respond within 24 hours.",
        resetBtnText: "Submit Another Brief"
      }
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
              settings: {
                ...DEFAULT_CMS_DATA.settings,
                ...(json.data.settings || {}),
                servicesHeader: {
                  ...DEFAULT_CMS_DATA.settings.servicesHeader,
                  ...(json.data.settings?.services_header || json.data.settings?.servicesHeader || {})
                }
              },
              contactBrief: json.data.contactBrief ? {
                header: { ...DEFAULT_CMS_DATA.contactBrief.header, ...(json.data.contactBrief.header || {}) },
                step1: { ...DEFAULT_CMS_DATA.contactBrief.step1, ...(json.data.contactBrief.step1 || {}) },
                step2: { ...DEFAULT_CMS_DATA.contactBrief.step2, ...(json.data.contactBrief.step2 || {}) },
                step3: { ...DEFAULT_CMS_DATA.contactBrief.step3, ...(json.data.contactBrief.step3 || {}) },
                step4: { ...DEFAULT_CMS_DATA.contactBrief.step4, ...(json.data.contactBrief.step4 || {}) },
                step5: { ...DEFAULT_CMS_DATA.contactBrief.step5, ...(json.data.contactBrief.step5 || {}) }
              } : DEFAULT_CMS_DATA.contactBrief
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

    _computeCodeChecksum() {
      try {
        const s = JSON.stringify(DEFAULT_CMS_DATA);
        let h = 5381;
        for (let i = 0; i < s.length; i++) {
          h = ((h << 5) + h) + s.charCodeAt(i);
          h |= 0;
        }
        return 'code_v4_' + Math.abs(h);
      } catch (e) {
        return 'code_v4_' + Date.now();
      }
    }

    _loadData() {
      const codeChecksum = this._computeCodeChecksum();
      try {
        const storedHash = localStorage.getItem(STORAGE_KEY + '_code_hash');
        const stored = localStorage.getItem(STORAGE_KEY);

        // If code has changed on disk, automatically synchronize with new code
        if (storedHash !== codeChecksum || !stored) {
          console.log('⚡ [1928 CMS] Code change detected. Live-syncing data store with code from backend...');
          try {
            localStorage.setItem(STORAGE_KEY + '_code_hash', codeChecksum);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CMS_DATA));
          } catch (e) {}
          return JSON.parse(JSON.stringify(DEFAULT_CMS_DATA));
        }

        if (stored) {
          const parsed = JSON.parse(stored);
          const blogsList = (Array.isArray(parsed.blogs) && parsed.blogs.length >= 15) ? parsed.blogs : DEFAULT_CMS_DATA.blogs;
          
          const portfolioList = Array.isArray(parsed.portfolio) ? parsed.portfolio.map(p => {
            const def = DEFAULT_CMS_DATA.portfolio.find(dp => dp.id === p.id) || {};
            return {
              ...def,
              ...p,
              overview: p.overview || p.strategicOverview || def.overview || p.summary || '',
              subheading: p.subheading || p.categoryDisplay || def.subheading || '',
              sector: p.sector || def.sector || 'Luxury Brand Strategy',
              deliverables: p.deliverables || def.deliverables || 'Brand Identity, Spatial System',
              timeline: p.timeline || def.timeline || '2025 · Global Reveal',
              galleryImages: (Array.isArray(p.galleryImages) && p.galleryImages.length > 0) ? p.galleryImages : (def.galleryImages || [])
            };
          }) : DEFAULT_CMS_DATA.portfolio;

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
            portfolio: portfolioList,
            blogs: blogsList,
            settings: {
              ...DEFAULT_CMS_DATA.settings,
              ...(parsed.settings || {}),
              portfolioHero: {
                ...DEFAULT_CMS_DATA.settings.portfolioHero,
                ...(parsed.settings?.portfolioHero || {})
              },
              servicesHeader: {
                ...DEFAULT_CMS_DATA.settings.servicesHeader,
                ...(parsed.settings?.services_header || parsed.settings?.servicesHeader || {})
              }
            },
            contactBrief: parsed.contactBrief ? {
              header: { ...DEFAULT_CMS_DATA.contactBrief.header, ...(parsed.contactBrief.header || {}) },
              step1: { ...DEFAULT_CMS_DATA.contactBrief.step1, ...(parsed.contactBrief.step1 || {}) },
              step2: { ...DEFAULT_CMS_DATA.contactBrief.step2, ...(parsed.contactBrief.step2 || {}) },
              step3: { ...DEFAULT_CMS_DATA.contactBrief.step3, ...(parsed.contactBrief.step3 || {}) },
              step4: { ...DEFAULT_CMS_DATA.contactBrief.step4, ...(parsed.contactBrief.step4 || {}) },
              step5: { ...DEFAULT_CMS_DATA.contactBrief.step5, ...(parsed.contactBrief.step5 || {}) }
            } : JSON.parse(JSON.stringify(DEFAULT_CMS_DATA.contactBrief))
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
        localStorage.setItem(STORAGE_KEY + '_code_hash', this._computeCodeChecksum());
      } catch (err) {}
    }

    _saveData() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        localStorage.setItem(STORAGE_KEY + '_code_hash', this._computeCodeChecksum());
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
        // Silently handled if server is offline
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

    reloadFromCode() {
      console.log('⚡ [1928 CMS] Live-reloading data store from backend code...');
      this.data = JSON.parse(JSON.stringify(DEFAULT_CMS_DATA));
      this._saveLocalOnly();
      this._notify();
      return this.data;
    }

    syncWithCode() {
      return this.reloadFromCode();
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

      window.addEventListener('1928_code_change', () => {
        this.reloadFromCode();
      });

      window.addEventListener('message', (e) => {
        if (e.data && e.data.type === '1928_CODE_RELOAD') {
          this.reloadFromCode();
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
      this._sendToAPI('save_principle', principleData);
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
    getServicesHeader() {
      return this.data.settings?.servicesHeader || DEFAULT_CMS_DATA.settings.servicesHeader;
    }
    saveServicesHeader(headerData) {
      if (!this.data.settings) this.data.settings = {};
      this.data.settings.servicesHeader = { ...this.getServicesHeader(), ...headerData };
      this._saveData();
      this._sendToAPI('save_settings', {
        services_header: this.data.settings.servicesHeader
      });
      return this.data.settings.servicesHeader;
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
    getPortfolioById(id) {
      return this.getProjectById(id);
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
    getPortfolioHero() {
      return this.data.settings?.portfolioHero || DEFAULT_CMS_DATA.settings.portfolioHero;
    }
    savePortfolioHero(heroData) {
      if (!this.data.settings) this.data.settings = {};
      this.data.settings.portfolioHero = { ...this.getPortfolioHero(), ...heroData };
      this._saveData();
      return this.data.settings.portfolioHero;
    }

    getHomeSelectedProjects() {
      const defaultSlots = ['vibee', 'infyli', 'mudra-school', 'awards-plus', 'last-mile-analytics', 'alda'];
      const saved = this.data.settings?.homeSelectedProjects;
      if (Array.isArray(saved) && saved.length >= 6) return saved.slice(0, 6);
      return defaultSlots;
    }

    saveHomeSelectedProjects(projectIdsArray) {
      if (!this.data.settings) this.data.settings = {};
      this.data.settings.homeSelectedProjects = Array.isArray(projectIdsArray) ? projectIdsArray.slice(0, 6) : ['vibee', 'infyli', 'mudra-school', 'awards-plus', 'last-mile-analytics', 'alda'];
      this._saveData();
      return this.data.settings.homeSelectedProjects;
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

      const heroTickerIds = (Array.isArray(raw?.heroTickerIds) && raw.heroTickerIds.length > 0) 
        ? raw.heroTickerIds 
        : (DEFAULT_CMS_DATA.settings?.perspectives_curation?.heroTickerIds || defaultIds.slice(0, 8));

      const featuredCarouselIds = (Array.isArray(raw?.featuredCarouselIds) && raw.featuredCarouselIds.length > 0)
        ? raw.featuredCarouselIds 
        : (DEFAULT_CMS_DATA.settings?.perspectives_curation?.featuredCarouselIds || defaultIds.slice(0, 4));

      const codexGridIds = (Array.isArray(raw?.codexGridIds) && raw.codexGridIds.length > 0)
        ? raw.codexGridIds 
        : (DEFAULT_CMS_DATA.settings?.perspectives_curation?.codexGridIds || defaultIds.slice(0, 6));

      const codexCount = parseInt(raw?.codexCount, 10) || DEFAULT_CMS_DATA.settings?.perspectives_curation?.codexCount || 6;

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
      this._sendToAPI('save_settings', {
        perspectives_curation: typeof curationData === 'object' ? JSON.stringify(curationData) : curationData
      });
      return curationData;
    }

    // ── Contact & Brief Form Configuration Methods ──
    getContactBrief() {
      if (!this.data.contactBrief) {
        this.data.contactBrief = JSON.parse(JSON.stringify(DEFAULT_CMS_DATA.contactBrief));
      }
      return this.data.contactBrief;
    }

    saveContactBrief(briefData) {
      this.data.contactBrief = {
        ...this.getContactBrief(),
        ...(briefData || {})
      };
      this._saveData();
      this._sendToAPI('save_settings', {
        contact_brief: this.data.contactBrief
      });
      return this.data.contactBrief;
    }

    saveContactBriefStep(stepKey, stepData) {
      if (!this.data.contactBrief) {
        this.data.contactBrief = JSON.parse(JSON.stringify(DEFAULT_CMS_DATA.contactBrief));
      }
      this.data.contactBrief[stepKey] = {
        ...(this.data.contactBrief[stepKey] || {}),
        ...(stepData || {})
      };
      this._saveData();
      this._sendToAPI('save_settings', {
        contact_brief: this.data.contactBrief
      });
      return this.data.contactBrief[stepKey];
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
          settings: { ...DEFAULT_CMS_DATA.settings, ...(parsed.settings || {}) },
          contactBrief: parsed.contactBrief ? {
            header: { ...DEFAULT_CMS_DATA.contactBrief.header, ...(parsed.contactBrief.header || {}) },
            step1: { ...DEFAULT_CMS_DATA.contactBrief.step1, ...(parsed.contactBrief.step1 || {}) },
            step2: { ...DEFAULT_CMS_DATA.contactBrief.step2, ...(parsed.contactBrief.step2 || {}) },
            step3: { ...DEFAULT_CMS_DATA.contactBrief.step3, ...(parsed.contactBrief.step3 || {}) },
            step4: { ...DEFAULT_CMS_DATA.contactBrief.step4, ...(parsed.contactBrief.step4 || {}) },
            step5: { ...DEFAULT_CMS_DATA.contactBrief.step5, ...(parsed.contactBrief.step5 || {}) }
          } : JSON.parse(JSON.stringify(DEFAULT_CMS_DATA.contactBrief))
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
