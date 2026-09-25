/**
 * 1928 CREATIVE STUDIO — Master Website CMS Bridge & Dynamic Real-Time Renderer
 * Automatically mirrors and injects 100% of CMS data across all pages:
 * 1. SEO & Metadata (Title, Description, Keywords, OG Tags)
 * 2. Client & Partner Logos (Marquees, Grids, Infinite Carousels)
 * 3. Perspectives & Monographs (blogs.html, all-blogs.html, blog-detail.html, reader drawers)
 * 4. Portfolio & Case Studies (portfolio.html, project-detail.html, about.html best works)
 * 5. Studio Profile, Story, Team Minds, Principles & Process (about.html, index.html)
 * 6. Core Services & Capabilities (services.html, service-detail.html, index.html)
 * 7. Real-Time Multi-Tab Reactivity (Instant live sync on admin change)
 */
(function () {
  'use strict';

  if (typeof window === 'undefined') return;

  function getCurrentPageKey() {
    const path = (window.location.pathname || '').toLowerCase().split('/').pop() || 'index.html';
    if (path === '' || path === 'index.html') return 'home';
    if (path.includes('about')) return 'about';
    if (path.includes('service')) return 'services';
    if (path.includes('portfolio') || path.includes('work')) return 'portfolio';
    if (path.includes('blog') || path.includes('perspective')) return 'blogs';
    if (path.includes('contact')) return 'contact';
    return 'global';
  }

  // ═══════════════════════════════════════════════════════════
  // 1. DYNAMIC SEO & METADATA INJECTOR
  // ═══════════════════════════════════════════════════════════
  function applySEOMetadata() {
    if (!window.CMSStore) return;
    const pageKey = getCurrentPageKey();
    const seo = window.CMSStore.getSEO(pageKey);

    if (seo && seo.title) {
      document.title = seo.title;
    }

    if (seo && seo.description) {
      let descMeta = document.querySelector('meta[name="description"]');
      if (!descMeta) {
        descMeta = document.createElement('meta');
        descMeta.setAttribute('name', 'description');
        document.head.appendChild(descMeta);
      }
      descMeta.setAttribute('content', seo.description);
    }

    if (seo && seo.keywords) {
      let kwMeta = document.querySelector('meta[name="keywords"]');
      if (!kwMeta) {
        kwMeta = document.createElement('meta');
        kwMeta.setAttribute('name', 'keywords');
        document.head.appendChild(kwMeta);
      }
      kwMeta.setAttribute('content', seo.keywords);
    }

    // OpenGraph & Twitter Meta
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && seo && seo.title) ogTitle.setAttribute('content', seo.title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && seo && seo.description) ogDesc.setAttribute('content', seo.description);

    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle && seo && seo.title) twTitle.setAttribute('content', seo.title);

    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc && seo && seo.description) twDesc.setAttribute('content', seo.description);
  }

  // ═══════════════════════════════════════════════════════════
  // 2. CLIENT & PARTNER LOGOS MARQUEE RENDERER
  // ═══════════════════════════════════════════════════════════
  function renderClientLogos() {
    if (!window.CMSStore) return;
    const clientTracks = document.querySelectorAll('.brand-logo-track, .client-marquee-track, #clientLogoGrid, .clients-track, .marquee-track, .marquee-group');
    if (!clientTracks.length) return;

    const clients = window.CMSStore.getClients(true);
    if (!clients.length) return;

    clientTracks.forEach(track => {
      // If it's a marquee group inside a track, only render once per group
      const isMarquee = track.classList.contains('brand-logo-track') || track.classList.contains('client-marquee-track') || track.classList.contains('clients-track') || track.classList.contains('marquee-track');
      const isGroup = track.classList.contains('marquee-group');
      const items = (isMarquee && !isGroup) ? [...clients, ...clients] : clients;

      let html = '';
      items.forEach(c => {
        let logoContent = '';
        if (c.type === 'svg' && c.svgCode) {
          logoContent = c.svgCode;
        } else if (c.imageUrl) {
          logoContent = `<img src="${c.imageUrl}" alt="${c.name}" style="max-height:38px;width:auto;object-fit:contain;" />`;
        } else {
          logoContent = `<span style="font-family:'Montserrat',sans-serif;font-weight:800;font-size:15px;letter-spacing:1px;color:currentColor;">${c.name}</span>`;
        }

        const linkStart = c.websiteUrl && c.websiteUrl !== '#' ? `<a href="${c.websiteUrl}" target="_blank" rel="noopener" class="brand-logo-card" title="${c.name} — ${c.subtitle || ''}">` : `<div class="brand-logo-card" title="${c.name} — ${c.subtitle || ''}">`;
        const linkEnd = c.websiteUrl && c.websiteUrl !== '#' ? `</a>` : `</div>`;

        html += `${linkStart}${logoContent}${linkEnd}`;
      });

      track.innerHTML = html;
    });
  }

  // ═══════════════════════════════════════════════════════════
  // 3. PERSPECTIVES & MONOGRAPHS RENDERER (BLOGS.HTML & ALL-BLOGS)
  // ═══════════════════════════════════════════════════════════
  function renderPerspectivesPage() {
    if (!window.CMSStore) return;
    const blogs = window.CMSStore.getBlogs(true);
    if (!blogs.length) return;

    // A. Sync window.articlesData for full-screen reading modal drawer
    if (!window.articlesData) window.articlesData = {};
    blogs.forEach(b => {
      window.articlesData[b.id] = {
        id: b.id,
        slug: b.slug || b.id,
        title: b.title,
        category: b.category,
        categorySlug: b.categorySlug || (b.category || 'theory').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        author: b.author || 'Jay Thaker',
        initials: b.initials || (b.author ? b.author.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'JT'),
        role: b.role || 'Studio Principal & Brand Architect',
        date: b.date || 'SEP 2026',
        readTime: b.readTime || '6 Min Read',
        city: b.city || 'Milan, Italy',
        coverImage: b.coverImage || 'img/port-chronos.jpg',
        specimenImage: b.specimenImage || '',
        specimenCaption: b.specimenCaption || '1928 EDITORIAL PROVENANCE CAPTURE',
        excerpt: b.excerpt || '',
        contentHtml: b.content || b.contentHtml || `<p>${b.excerpt || ''}</p>`,
        bio: b.bio || `${b.author || 'Jay Thaker'} — ${b.role || 'Studio Principal & Brand Architect at 1928 Creative Studio'}. Advising luxury maisons and deep-tech founders on enduring visual systems.`,
        sections: b.sections || [
          { id: 'sec-shift', title: '01. The Strategic Shift' },
          { id: 'sec-geometry', title: '02. Mathematical Geometry' },
          { id: 'sec-takeaways', title: '03. Strategic Takeaways' }
        ],
        related: b.related || ['art-spatial', 'art-webgl']
      };
    });

    const curation = window.CMSStore.getPerspectivesCuration ? window.CMSStore.getPerspectivesCuration() : {
      heroTickerIds: blogs.slice(0, 8).map(b => b.id),
      featuredCarouselIds: blogs.slice(0, 4).map(b => b.id),
      codexGridIds: blogs.slice(0, 6).map(b => b.id),
      codexCount: 6
    };

    // B. Render Dropdown & Critical Dispatch Ticker Words (#cdbSlider, #cdbWordList)
    const tickerContainers = document.querySelectorAll('#cdbSlider, #cdbWordList');
    if (tickerContainers.length) {
      const heroBlogs = curation.heroTickerIds.map(id => blogs.find(b => b.id === id)).filter(Boolean);
      const tickerItems = heroBlogs.length ? heroBlogs : blogs.slice(0, 8);
      
      tickerContainers.forEach(container => {
        container.innerHTML = tickerItems.map((b, idx) => `
          <div class="cdb-word ${idx === 0 ? 'active' : ''}" data-article-id="${b.id}" style="cursor:pointer;">
            <span class="cdb-num">№ 0${idx + 1}</span>
            <span class="cdb-topic-name">${(b.title || '').toUpperCase()}</span>
            <span class="cdb-cat-tag">${(b.category || 'THEORY').toUpperCase()}</span>
          </div>
        `).join('');
      });
    }

    // C. Render Latest Blogs Carousel (#lbcTrack)
    const lbcTrack = document.getElementById('lbcTrack');
    if (lbcTrack) {
      const carouselBlogs = curation.featuredCarouselIds.map(id => blogs.find(b => b.id === id)).filter(Boolean);
      const topBlogs = carouselBlogs.length ? carouselBlogs : blogs.slice(0, 4);

      lbcTrack.innerHTML = topBlogs.map((b, idx) => `
        <div class="lbc-slide ${idx === 0 ? 'active' : ''}" data-index="${idx}">
          <div class="featured-monograph-spread" data-article-id="${b.id}" style="cursor:pointer;">
            <div class="fms-blueprint-visual">
              <img src="${b.coverImage || 'img/port-chronos.jpg'}" alt="${b.title}" style="width:100%;height:100%;object-fit:cover;border-radius:12px;" onerror="this.src='img/port-chronos.jpg';" />
              <div class="corner-crosshair cc-tl">+</div>
              <div class="corner-crosshair cc-tr">+</div>
              <div class="corner-crosshair cc-bl">+</div>
              <div class="corner-crosshair cc-br">+</div>
            </div>
            <div class="fms-narrative">
              <div class="fms-text-block">
                <div class="fms-top-spec">
                  <span class="fms-cat-name">${(b.category || 'BRAND ARCHITECTURE').toUpperCase()}</span>
                </div>
                <h2 class="fms-title">${b.title}</h2>
                <p class="fms-excerpt">${b.excerpt || ''}</p>
              </div>
              <div class="fms-footer-meta">
                <div class="fms-launch-btn">
                  <span>Open Monograph</span>
                  <svg class="flb-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }

    // D. Render Horizontal Codex Grid (#articlesGrid) & Archive Grid (#allBlogsGrid)
    const articlesGrid = document.getElementById('articlesGrid');
    if (articlesGrid) {
      const codexBlogs = curation.codexGridIds.map(id => blogs.find(b => b.id === id)).filter(Boolean);
      const items = codexBlogs.length ? codexBlogs.slice(0, curation.codexCount || 6) : blogs.slice(0, 6);

      articlesGrid.innerHTML = items.map(b => {
        const catSlug = (b.category || 'theory').toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return `
          <article class="codex-card" data-category="${catSlug}" data-article-id="${b.id}" style="cursor:pointer;">
            <div class="card-image-box">
              <img src="${b.coverImage || 'img/port-chronos.jpg'}" alt="${b.title}" onerror="this.style.display='none'" />
              <div class="cib-placeholder">
                <div class="cib-icon-wrap">
                  <svg class="cib-image-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="3" ry="3"></rect>
                    <circle cx="8.5" cy="8.5" r="1.8"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                </div>
                <div class="cib-meta">
                  <span class="cib-ratio-badge">16 : 9 Ratio</span>
                  <span class="cib-dims">800 × 450 px</span>
                </div>
              </div>
            </div>

            <div class="card-body-content">
              <h4 class="cbc-title">${b.title}</h4>
              <p class="cbc-desc">${b.excerpt || ''}</p>
            </div>

            <div class="card-footer-row">
              <span class="card-city">${(b.city || 'MILAN, ITALY').toUpperCase()}</span>
              <div class="card-action-arrow" title="Open Monograph">
                <span class="caa-open-text">Open</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </div>
            </div>
          </article>
        `;
      }).join('');
    }

    // D2. All-Blogs Grid on all-blogs.html
    const allBlogsGrid = document.getElementById('allBlogsGrid');
    if (allBlogsGrid) {
      allBlogsGrid.innerHTML = blogs.map(b => {
        const catSlug = (b.category || 'theory').toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return `
          <article class="codex-card" data-category="${catSlug}" data-article-id="${b.id}" style="cursor:pointer;">
            <div class="card-image-box">
              <img src="${b.coverImage || 'img/port-chronos.jpg'}" alt="${b.title}" onerror="this.style.display='none'" />
            </div>
            <div class="card-body-content">
              <h4 class="cbc-title">${b.title}</h4>
              <p class="cbc-desc">${b.excerpt || ''}</p>
            </div>
            <div class="card-footer-row">
              <span class="card-city">${(b.city || 'MILAN, ITALY').toUpperCase()}</span>
              <div class="card-action-arrow" title="Open Monograph">
                <span class="caa-open-text">Open</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </div>
            </div>
          </article>
        `;
      }).join('');
    }

    // E. Detail Page Direct Injection (blog-detail.html)
    if (window.location.pathname.includes('blog-detail')) {
      const params = new URLSearchParams(window.location.search);
      const targetId = params.get('id') || params.get('slug') || blogs[0].id;
      const currentBlog = blogs.find(b => b.id === targetId || b.slug === targetId) || blogs[0];
      if (currentBlog) {
        document.title = `${currentBlog.title} · 1928 Perspectives`;
        const detailTitle = document.querySelector('.blog-detail-title, #blogDetailTitle');
        if (detailTitle) detailTitle.textContent = currentBlog.title;
        const detailCover = document.querySelector('.blog-detail-cover, #blogDetailCover');
        if (detailCover) detailCover.src = currentBlog.coverImage;
        const detailBody = document.querySelector('.blog-detail-body, #blogDetailBody');
        if (detailBody) detailBody.innerHTML = currentBlog.content || currentBlog.contentHtml;
      }
    }

    // F. Re-bind click events for opening articles
    const isPerspectivePage = window.location.pathname.includes('blogs') && !window.location.pathname.includes('all-blogs');

    document.querySelectorAll('[data-article-id]').forEach(el => {
      if (el.id === 'exploreBlogBtn' || el.closest('#exploreBlogBtn')) return;

      el.onclick = (e) => {
        const aid = el.getAttribute('data-article-id');
        if (!aid) return;

        if (typeof window.openReader === 'function') {
          e.preventDefault();
          window.openReader(aid);
        } else if (!isPerspectivePage) {
          window.location.href = `all-blogs.html?id=${aid}`;
        }
      };
    });
  }

  // ═══════════════════════════════════════════════════════════
  // 4. PORTFOLIO MATRIX RENDERER (PORTFOLIO.HTML & ABOUT.HTML)
  // ═══════════════════════════════════════════════════════════
  function renderPortfolioProjects() {
    if (!window.CMSStore) return;
    const projects = window.CMSStore.getPortfolio();
    if (!projects.length) return;

    // A. Main Matrix Grid on portfolio.html
    const matrixGrid = document.getElementById('matrixGrid');
    if (matrixGrid) {
      let html = '';
      projects.forEach(p => {
        const spanClass = p.gridSpan || 'bento-compact';
        html += `
          <div class="dzinr-project-card ${spanClass}" data-category="${p.category || 'brand-identity'}" data-project-id="${p.id}" style="cursor:pointer;" onclick="window.location.href='project-detail.html?id=${p.id}'">
            <div class="dpc-img-wrap">
              <span class="dpc-tag-pill">${p.tagPill || p.categoryDisplay || 'Case Study'}</span>
              <img src="${p.coverImage || 'img/port-chronos.jpg'}" alt="${p.title}" loading="lazy" onerror="this.src='img/port-chronos.jpg';" />
            </div>
            <div class="dpc-body">
              <div class="dpc-info">
                <h3 class="dpc-title">${p.title}</h3>
                <p class="dpc-category-sub">${p.categoryDisplay || p.client || ''}</p>
              </div>
              <div class="dpc-arrow-circle" aria-label="Explore project">
                <svg viewBox="0 0 24 24"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </div>
            </div>
          </div>
        `;
      });
      matrixGrid.innerHTML = html;
    }

    // B. Best Works Sets on about.html (#worksSet1 and #worksSet2)
    const worksSet1 = document.getElementById('worksSet1');
    const worksSet2 = document.getElementById('worksSet2');
    if (worksSet1 && worksSet2) {
      const p1 = projects[0] || {};
      const p2 = projects[1] || {};
      const p3 = projects[2] || {};
      const p4 = projects[3] || {};

      function makeWorkCard(p, numStr, subStr) {
        return `
          <a href="project-detail.html?id=${p.id || ''}" class="work-duo-card">
            <div class="work-card-media">
              <img src="${p.coverImage || 'img/wc-top.jpg'}" alt="${p.title || 'Case Study'}" class="work-card-img" onerror="this.src='img/wc-top.jpg';" />
            </div>
            <div class="work-card-content">
              <div class="work-top-meta">
                <span class="work-num">${numStr}</span>
                <span class="work-tag-pill">${p.categoryDisplay || p.tagPill || 'BRAND IDENTITY'}</span>
              </div>
              <div class="work-mid-body">
                <h3 class="work-title">${p.title || 'FEATURED WORK'}</h3>
                <p class="work-desc">${p.summary || p.client || 'Visual identity system and spatial touchpoints.'}</p>
              </div>
              <div class="work-bottom-meta">
                <div class="work-pills">
                  <span>${p.categoryDisplay || 'Identity'}</span>
                  <span>Case Study</span>
                </div>
                <span class="work-view-link">View Case Study ↗</span>
              </div>
            </div>
          </a>
        `;
      }

      if (p1.title) worksSet1.innerHTML = makeWorkCard(p1, '01 // ICON', 'BRAND IDENTITY') + makeWorkCard(p2, '02 // SPATIAL', 'SPATIAL & DIGITAL');
      if (p3.title) worksSet2.innerHTML = makeWorkCard(p3, '03 // ATELIER', 'PACKAGING & 3D') + makeWorkCard(p4, '04 // LUXURY', 'ECOMMERCE & WEBGL');
    }

    // C. Project Detail Page Direct Injection
    if (window.location.pathname.includes('project-detail')) {
      const params = new URLSearchParams(window.location.search);
      const targetId = params.get('id') || projects[0].id;
      const currentProj = projects.find(p => p.id === targetId) || projects[0];
      if (currentProj) {
        document.title = `${currentProj.title} · 1928 Portfolio`;
        const projTitle = document.querySelector('.project-detail-title, #projectDetailTitle');
        if (projTitle) projTitle.textContent = currentProj.title;
        const projCover = document.querySelector('.project-detail-cover, #projectDetailCover');
        if (projCover) projCover.src = currentProj.coverImage;
        const projDesc = document.querySelector('.project-detail-summary, #projectDetailSummary');
        if (projDesc) projDesc.textContent = currentProj.summary;
      }
    }

    if (typeof window.rebindPortfolioInteractions === 'function') {
      window.rebindPortfolioInteractions();
    }
  }

  // ═══════════════════════════════════════════════════════════
  // 5. STUDIO PROFILE, TEAM, PRINCIPLES & PROCESS (ABOUT.HTML)
  // ═══════════════════════════════════════════════════════════
  function renderAboutPage() {
    if (!window.CMSStore) return;
    const profile = window.CMSStore.getProfile();
    if (!profile) return;

    // A. Story Statement
    const statementEl = document.querySelector('.story-statement');
    if (statementEl && profile.storyHeadline) {
      statementEl.innerHTML = `"${profile.storyHeadline.replace(/MOMENTUM/g, '<span>MOMENTUM.</span>')}"`;
    }

    // B. Story Pillars
    const pillarsGrid = document.querySelector('.story-pillars-grid');
    if (pillarsGrid && profile.pillars && profile.pillars.length) {
      pillarsGrid.innerHTML = profile.pillars.map(p => `
        <div class="story-pillar-item">
          <div class="story-pillar-head">
            <span class="story-pillar-num">${p.num}</span>
            <span class="story-pillar-tag">${p.tag}</span>
          </div>
          <p class="story-pillar-text">${p.text}</p>
          <div class="story-pillar-sub">${p.sub}</div>
        </div>
      `).join('');
    }

    // C. Team Minds Minimal Index (#teamMinimalIndex)
    const teamIndex = document.getElementById('teamMinimalIndex');
    const team = window.CMSStore.getTeam();
    if (teamIndex && team && team.length) {
      teamIndex.innerHTML = team.map((m, idx) => `
        <div class="team-index-row" data-member="${m.memberKey || m.id}" data-name="${m.name}" data-role="${m.role}" data-photo="${m.photo || 'img/team-ami.jpg'}">
          <div class="team-row-main">
            <div class="team-row-left">
              <span class="team-row-name">${m.name}</span>
            </div>
            <div class="team-row-right">
              <span class="team-row-role">${m.role}</span>
            </div>
          </div>
        </div>
      `).join('');

      // Re-bind floating circle interaction
      rebindTeamHover();
    }

    // D. Our Principles Accordion (#valuesAccordion)
    const valuesAcc = document.getElementById('valuesAccordion');
    const principles = window.CMSStore.getPrinciples();
    if (valuesAcc && principles && principles.length) {
      valuesAcc.innerHTML = principles.map((p, idx) => `
        <div class="val-panel ${idx === 0 ? 'active' : ''}" data-val="${idx + 1}">
          <div class="val-collapsed-content">
            <span class="val-col-num">${p.num}</span>
            <span class="val-col-title">${p.title}</span>
          </div>
          <div class="val-expanded-content">
            <div class="val-exp-top">
              <div class="val-exp-meta">
                <span class="val-exp-num">${p.num} // PRINCIPLE</span>
                <span class="val-exp-pill">${p.pill || 'Think With Purpose'}</span>
              </div>
            </div>
            <div class="val-exp-body">
              <h3 class="val-exp-title">${p.title}</h3>
              <p class="val-exp-desc">${p.desc}</p>
            </div>
            <div class="val-exp-bottom">
              ${(p.tags || []).map(t => `<span class="val-exp-tag">${t}</span>`).join('')}
            </div>
          </div>
        </div>
      `).join('');

      rebindAccordionHover();
    }

    // E. Creative Process Track (#processTrack)
    const processTrack = document.getElementById('processTrack');
    const processSteps = window.CMSStore.getProcess();
    if (processTrack && processSteps && processSteps.length) {
      const svgHeader = `
        <svg class="process-svg-canvas" id="processSvgCanvas" aria-hidden="true">
          <defs>
            <linearGradient id="laserGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="var(--cr)" stop-opacity="1" />
              <stop offset="50%" stop-color="#ff3b5c" stop-opacity="1" />
              <stop offset="100%" stop-color="var(--cr)" stop-opacity="1" />
            </linearGradient>
            <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="0.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path class="process-bg-path" id="processBgPath" d="" />
          <path class="process-active-path" id="processActivePath" d="" />
        </svg>
      `;

      const stepsHtml = processSteps.map((s, idx) => {
        const isLeft = idx % 2 === 0;
        const sideClass = isLeft ? 'proc-item-left' : 'proc-item-right';
        const nodeHtml = `
          <div class="proc-node-wrapper">
            <div class="proc-node-circle">
              <span class="proc-node-num">${s.step}</span>
              <div class="proc-node-pulse"></div>
            </div>
          </div>
        `;
        const cardHtml = `
          <div class="proc-step-card">
            <div class="proc-card-header">
              <span class="proc-card-phase">${s.phase || `PHASE 0${idx + 1}`}</span>
              <h3 class="proc-card-title">${s.title}</h3>
            </div>
            <p class="proc-card-desc">${s.desc}</p>
            <div class="proc-card-tags">
              ${(s.tags || []).map(t => `<span>${t}</span>`).join('')}
            </div>
          </div>
        `;

        return `
          <div class="proc-step-item ${sideClass} ${idx === 0 ? 'active' : ''}" data-step="${idx + 1}">
            ${isLeft ? nodeHtml + cardHtml : cardHtml + nodeHtml}
          </div>
        `;
      }).join('');

      processTrack.innerHTML = svgHeader + stepsHtml;
    }
  }

  function rebindTeamHover() {
    const teamRows = document.querySelectorAll('.team-index-row');
    const teamFloatCard = document.getElementById('teamFloatingCard');
    const tfcImg = document.getElementById('tfcImg');
    if (!teamRows.length || !teamFloatCard || !tfcImg) return;

    teamRows.forEach(row => {
      row.addEventListener('mouseenter', () => {
        const photo = row.getAttribute('data-photo');
        if (photo) {
          tfcImg.src = photo;
          teamFloatCard.classList.add('active');
        }
      });
      row.addEventListener('mouseleave', () => {
        teamFloatCard.classList.remove('active');
      });
      row.addEventListener('mousemove', (e) => {
        teamFloatCard.style.left = e.clientX + 'px';
        teamFloatCard.style.top = e.clientY + 'px';
      });
    });
  }

  function rebindAccordionHover() {
    const valPanels = document.querySelectorAll('.val-panel');
    if (!valPanels.length) return;
    valPanels.forEach(panel => {
      panel.addEventListener('mouseenter', () => {
        valPanels.forEach(p => p.classList.remove('active'));
        panel.classList.add('active');
      });
      panel.addEventListener('click', () => {
        valPanels.forEach(p => p.classList.remove('active'));
        panel.classList.add('active');
      });
    });
  }

  // ═══════════════════════════════════════════════════════════
  // 6. CORE SERVICES RENDERER (SERVICES.HTML)
  // ═══════════════════════════════════════════════════════════
  function renderServicesPage() {
    if (!window.CMSStore) return;
    const services = window.CMSStore.getServices();
    if (!services || !services.length) return;

    // A. Revolving Orbit Icons (#heroOrbitIcons)
    const orbitContainer = document.getElementById('heroOrbitIcons');
    if (orbitContainer) {
      orbitContainer.innerHTML = services.map((s, idx) => `
        <a href="#service-0${idx + 1}" class="orbit-icon-node" data-service="${s.title.toUpperCase()}" data-idx="${idx}" aria-label="${s.title}">
          <span class="oin-tag">0${idx + 1}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
          </svg>
        </a>
      `).join('');
    }

    // B. Pinned Paged Deck (#servicesStackDeck)
    const deck = document.getElementById('servicesStackDeck');
    if (deck) {
      deck.innerHTML = services.map((s, idx) => `
        <div class="svc-card" id="service-0${idx + 1}">
          <div class="svc-card-left">
            <div class="svc-card-top-row">
              <span class="svc-num-label">${s.num || `0${idx + 1}`} // ${s.tagline || 'PRACTICE'}</span>
            </div>
            <h3 class="svc-title-main">${s.title}</h3>
            <p class="svc-card-desc">${s.desc}</p>
            <div class="svc-deliv-wrap">
              <div class="svc-deliv-title">Core Deliverables & Capabilities</div>
              <div class="svc-chips-row">
                ${(s.deliverables || []).map(d => `
                  <div class="svc-chip-item">
                    <span class="svc-chip-dot"></span>
                    <span>${d}</span>
                  </div>
                `).join('')}
              </div>
            </div>
            <div class="svc-card-actions">
              <a href="contact.html" class="svc-btn-action">Initiate Practice →</a>
            </div>
          </div>
          <div class="svc-card-right">
            <div class="motion-sculpture sculpture-${(idx % 4) + 1}">
              <div class="ring-outer"></div>
              <div class="ring-inner"></div>
              <div class="core-mark">${s.num || `0${idx + 1}`}</div>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  // ═══════════════════════════════════════════════════════════
  // 7. MASTER INITIALIZATION & MULTI-TAB BROADCAST
  // ═══════════════════════════════════════════════════════════
  function initDynamicCMS() {
    applySEOMetadata();
    renderClientLogos();
    renderPerspectivesPage();
    renderPortfolioProjects();
    renderAboutPage();
    renderServicesPage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDynamicCMS);
  } else {
    initDynamicCMS();
  }

  // Real-time reactive updates across tabs and local events
  window.addEventListener('1928_cms_updated', initDynamicCMS);
  window.addEventListener('storage', (e) => {
    if (e.key && e.key.includes('1928_cms')) {
      if (window.CMSStore && typeof window.CMSStore.loadFromStorage === 'function') {
        window.CMSStore.loadFromStorage();
      }
      initDynamicCMS();
    }
  });
  window.addEventListener('footerLoaded', renderClientLogos);

})();
