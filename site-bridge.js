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
    if (path === 'service-logo-design.html') return 'service_logo_design';
    if (path === 'service-brand-identity.html') return 'service_brand_identity';
    if (path === 'service-website-development.html') return 'service_website_development';
    if (path === 'service-digital-marketing.html') return 'service_digital_marketing';
    if (path === 'service-content-creation.html') return 'service_content_creation';
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
      // Preserve the bespoke 3-row 60-logo marquee inside #brands-driver
      if (track.closest('#brands-driver')) return;

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
      const heroBlogs = (curation.heroTickerIds || []).map(id => blogs.find(b => b.id === id)).filter(Boolean);
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

      const cdbSlider = document.getElementById('cdbSlider');
      if (cdbSlider && tickerItems.length > 1) {
        if (window._cdbSliderTimer) {
          clearInterval(window._cdbSliderTimer);
          window._cdbSliderTimer = null;
        }
        let currentWordIdx = 0;
        window._cdbSliderTimer = setInterval(() => {
          const currentWords = cdbSlider.querySelectorAll('.cdb-word');
          if (!currentWords.length) return;
          if (currentWordIdx >= currentWords.length) currentWordIdx = 0;
          currentWords[currentWordIdx]?.classList.remove('active');
          currentWords[currentWordIdx]?.classList.add('exit');
          const prevIdx = currentWordIdx;
          currentWordIdx = (currentWordIdx + 1) % currentWords.length;
          currentWords[currentWordIdx]?.classList.remove('exit');
          currentWords[currentWordIdx]?.classList.add('active');
          setTimeout(() => {
            currentWords[prevIdx]?.classList.remove('exit');
          }, 500);
        }, 2800);
      }
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
  function renderPortfolioHero() {
    const heroSec = document.getElementById('portfolio-hero');
    if (!heroSec || !window.CMSStore) return;
    const heroData = window.CMSStore.getPortfolioHero ? window.CMSStore.getPortfolioHero() : null;
    if (!heroData) return;

    const allPills = heroSec.querySelectorAll('.hero-rounded-media');
    const pill1 = document.getElementById('heroPill1Media') || allPills[0];
    const pill2 = document.getElementById('heroPill2Media') || allPills[1];

    if (pill1) {
      const p1Id = heroData.pill1ProjectId || 'vibee';
      const proj1 = (typeof window.CMSStore.getPortfolioById === 'function' ? window.CMSStore.getPortfolioById(p1Id) : null) || (typeof window.CMSStore.getProjectById === 'function' ? window.CMSStore.getProjectById(p1Id) : null);
      const img1 = proj1 ? (proj1.bannerImage || proj1.coverImage || heroData.pill1Img || 'img/Selected Work Case Study Cards (Portfolio Showcase)-01.jpg') : (heroData.pill1Img || 'img/Selected Work Case Study Cards (Portfolio Showcase)-01.jpg');
      const imgEl = pill1.querySelector('img') || document.getElementById('heroPill1Img');
      if (imgEl) imgEl.src = img1;
      pill1.setAttribute('data-project-id', p1Id);
      if (proj1) pill1.setAttribute('title', `Explore ${proj1.title}`);
      pill1.onclick = () => {
        if (typeof window.openProjectModal === 'function') window.openProjectModal(p1Id);
        else if (typeof window.openModal === 'function') window.openModal(p1Id);
      };
    }

    if (pill2) {
      const p2Id = heroData.pill2ProjectId || 'veloce';
      const proj2 = (typeof window.CMSStore.getPortfolioById === 'function' ? window.CMSStore.getPortfolioById(p2Id) : null) || (typeof window.CMSStore.getProjectById === 'function' ? window.CMSStore.getProjectById(p2Id) : null);
      const img2 = proj2 ? (proj2.bannerImage || proj2.coverImage || heroData.pill2Img || 'img/port-veloce.jpg') : (heroData.pill2Img || 'img/port-veloce.jpg');
      const imgEl = pill2.querySelector('img') || document.getElementById('heroPill2Img');
      if (imgEl) imgEl.src = img2;
      pill2.setAttribute('data-project-id', p2Id);
      if (proj2) pill2.setAttribute('title', `Explore ${proj2.title}`);
      pill2.onclick = () => {
        if (typeof window.openProjectModal === 'function') window.openProjectModal(p2Id);
        else if (typeof window.openModal === 'function') window.openModal(p2Id);
      };
    }
  }

  function renderPortfolioProjects() {
    renderPortfolioHero();
    if (!window.CMSStore) return;
    const projects = window.CMSStore.getPortfolio();
    if (!projects.length) return;

    // A. Main Matrix Grid on portfolio.html
    const matrixGrid = document.getElementById('matrixGrid');
    if (matrixGrid) {
      let html = '';
      projects.forEach((p, idx) => {
        const pairIndex = Math.floor(idx / 2);
        const isFirstInPair = (idx % 2 === 0);
        const spanClass = (pairIndex % 2 === 0)
          ? (isFirstInPair ? 'bento-wide' : 'bento-compact')
          : (isFirstInPair ? 'bento-compact' : 'bento-wide');
        html += `
          <div class="dzinr-project-card ${spanClass}" data-category="${p.category || 'brand-identity'}" data-project-id="${p.id}" style="cursor:pointer;" onclick="if(typeof window.openProjectModal==='function'){window.openProjectModal('${p.id}');}else if(typeof window.openModal==='function'){window.openModal('${p.id}');}">
            <div class="dpc-img-wrap">
              <span class="dpc-tag-pill">${p.tagPill || p.categoryDisplay || 'Case Study'}</span>
              <img src="${p.bannerImage || p.coverImage || 'img/port-chronos.jpg'}" alt="${p.title}" loading="lazy" onerror="this.src='img/port-chronos.jpg';" />
            </div>
            <div class="dpc-body">
              <div class="dpc-info">
                <h3 class="dpc-title">${p.title}</h3>
                <p class="dpc-category-sub">${p.subheading || p.categoryDisplay || p.client || ''}</p>
              </div>
              <div class="dpc-arrow-circle" aria-label="Explore project">
                <svg viewBox="0 0 24 24"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </div>
            </div>
          </div>
        `;
      });
      matrixGrid.innerHTML = html;
      if (typeof window.reapplyPortfolioFilter === 'function') {
        window.reapplyPortfolioFilter();
      }
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
        const title = p.title || 'FEATURED WORK';
        const subtitle = p.subheading || p.categoryDisplay || p.tagPill || p.client || subStr || 'Brand Identity & Digital';
        const img = p.bannerImage || p.coverImage || 'img/port-chronos.jpg';
        return `
          <a href="portfolio.html?project=${p.id || ''}" class="work-duo-card">
            <div class="work-card-media">
              <img src="${img}" alt="${title}" class="work-card-img" onerror="this.src='img/port-chronos.jpg';" />
            </div>
            <div class="work-card-content">
              <div class="work-top-meta">
                <span class="work-num">${numStr}</span>
              </div>
              <div class="work-mid-body">
                <h3 class="work-title">${title}</h3>
                <div class="work-subtitle">${subtitle}</div>
              </div>
              <div class="work-bottom-meta">
                <div class="work-cta-wrap">
                  <span>View Case Study</span>
                  <div class="work-cta-arrow">
                    <svg viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H7M17 7V17" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </div>
                </div>
              </div>
            </div>
          </a>
        `;
      }

      if (p1.title) worksSet1.innerHTML = makeWorkCard(p1, '01 / GLOBAL ICON', 'Brand Identity & Vault') + makeWorkCard(p2, '02 / HYPERCRAFT', 'Automotive Platform & 3D');
      if (p3.title) worksSet2.innerHTML = makeWorkCard(p3, '03 / ATELIER', 'Packaging & 3D Architecture') + makeWorkCard(p4, '04 / MONOLITH', 'Spatial Architecture & Flagship');
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

    // D. Homepage Parallax Showcase (6 Curated Work Cards on index.html)
    const portCardsFlow = document.getElementById('portCardsFlow');
    if (portCardsFlow) {
      const selectedIds = (typeof window.CMSStore.getHomeSelectedProjects === 'function')
        ? window.CMSStore.getHomeSelectedProjects()
        : ['vibee', 'infyli', 'mudra-school', 'awards-plus', 'last-mile-analytics', 'alda'];

      const selectedWorkImages = [
        'img/Selected Work Case Study Cards (Portfolio Showcase)-01.jpg',
        'img/Selected Work Case Study Cards (Portfolio Showcase)-02.jpg',
        'img/Selected Work Case Study Cards (Portfolio Showcase)-03.jpg',
        'img/Selected Work Case Study Cards (Portfolio Showcase)-04.jpg',
        'img/Selected Work Case Study Cards (Portfolio Showcase)-05.jpg',
        'img/Selected Work Case Study Cards (Portfolio Showcase)-06.jpg'
      ];

      let cardsHtml = '';
      for (let i = 0; i < 6; i++) {
        const slotNum = i + 1;
        const targetId = selectedIds[i] || projects[i]?.id || projects[0]?.id;
        const proj = projects.find(p => p.id === targetId) || projects[i % projects.length];
        if (!proj) continue;

        const numStr = slotNum < 10 ? `0${slotNum}` : `${slotNum}`;
        const clientStr = (proj.client || proj.title || 'CASE STUDY').toUpperCase();
        const img = proj.coverImage || proj.bannerImage || selectedWorkImages[i] || 'img/Selected Work Case Study Cards (Portfolio Showcase)-01.jpg';
        const titleText = proj.summary || proj.subheading || proj.title;

        // Parse 2 tags cleanly
        let tag1 = 'Branding';
        let tag2 = 'Digital';
        if (proj.tagPill) {
          const parts = proj.tagPill.split(/[\/&,·]/).map(s => s.trim()).filter(Boolean);
          if (parts[0]) tag1 = parts[0];
          if (parts[1]) tag2 = parts[1];
        } else if (proj.categoryDisplay) {
          const parts = proj.categoryDisplay.split(/[\/&,·]/).map(s => s.trim()).filter(Boolean);
          if (parts[0]) tag1 = parts[0];
          if (parts[1]) tag2 = parts[1];
        }

        cardsHtml += `
          <!-- CARD ${slotNum} (SLOT ${slotNum}) -->
          <article class="p-flow-item p-item-${slotNum}">
            <a href="portfolio.html?project=${proj.id}" class="p-card-v p-card-${slotNum}">
              <div class="pcv-media">
                <img src="${img}" alt="${proj.title}" style="width:100%;height:100%;object-fit:cover;transition:transform .7s cubic-bezier(0.16,1,0.3,1);" onerror="this.src='img/port-chronos.jpg';" />
                <div class="pcv-badge-top"><span class="pcv-num">${numStr}</span><span class="pcv-client">${clientStr}</span></div>
              </div>
              <div class="pcv-info">
                <div class="pcv-tags"><span>${tag1}</span><span>${tag2}</span></div>
                <h3 class="pcv-title">${titleText}</h3>
                <div class="pcv-cta">Explore Case Study <span class="pcv-arrow">→</span></div>
              </div>
            </a>
          </article>
        `;
      }
      portCardsFlow.innerHTML = cardsHtml;
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
                <span class="val-exp-num">${p.num} /</span>
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
              <span class="proc-card-phase">${(s.phase || `PHASE 0${idx + 1}`).replace('//', '/')}</span>
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
      if (typeof window.initProcessSerpentine === 'function') {
        window.initProcessSerpentine();
      }
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
  function getServiceSculptureHTML(idx, num) {
    switch (idx % 5) {
      case 0:
        return `
          <div class="motion-sculpture sculpture-1">
            <div class="ring-outer"></div>
            <div class="ring-inner"></div>
            <div class="core-mark">1928</div>
          </div>`;
      case 1:
        return `
          <div class="motion-sculpture sculpture-2">
            <div class="prism-layer layer-1"></div>
            <div class="prism-layer layer-2"></div>
            <div class="prism-layer layer-3"></div>
          </div>`;
      case 2:
        return `
          <div class="motion-sculpture sculpture-3">
            <div class="code-sphere">
              <div class="sphere-meridian"></div>
              <div class="sphere-equator"></div>
              <div class="sphere-core"></div>
            </div>
          </div>`;
      case 3:
        return `
          <div class="motion-sculpture sculpture-4">
            <div class="wave-circle w1"></div>
            <div class="wave-circle w2"></div>
            <div class="wave-circle w3"></div>
          </div>`;
      case 4:
        return `
          <div class="motion-sculpture sculpture-5">
            <div class="aperture-box">
              <div class="rec-badge"><span class="rec-dot"></span> REC</div>
              <div class="aperture-lens">
                <div class="aperture-dot"></div>
              </div>
            </div>
          </div>`;
      default:
        return `
          <div class="motion-sculpture sculpture-1">
            <div class="ring-outer"></div>
            <div class="ring-inner"></div>
            <div class="core-mark">${num || '1928'}</div>
          </div>`;
    }
  }

  function renderServicesPage() {
    if (!window.CMSStore) return;

    // A. Update Sticky Section Header
    const headerData = (typeof window.CMSStore.getServicesHeader === 'function') ? window.CMSStore.getServicesHeader() : {
      headline: 'OUR CORE SERVICES',
      description: 'From the first visual impression to the way your brand grows in the market, we bring strategy, creativity and execution together under one roof.'
    };

    const stickyHeader = document.querySelector('.services-sticky-header');
    if (stickyHeader) {
      const headingEl = stickyHeader.querySelector('.sec-heading');
      if (headingEl && headerData.headline) {
        const words = headerData.headline.trim().split(' ');
        if (words.length > 1) {
          const lastWord = words.pop();
          headingEl.innerHTML = `${words.join(' ')} <span>${lastWord}</span>`;
        } else {
          headingEl.textContent = headerData.headline;
        }
      }
      const descEl = stickyHeader.querySelector('.sec-desc');
      if (descEl && headerData.description) {
        descEl.textContent = headerData.description;
      }
    }

    const services = window.CMSStore.getServices();
    if (!services || !services.length) return;

    // B. Revolving Orbit Icons (#heroOrbitIcons)
    const orbitContainer = document.getElementById('heroOrbitIcons');
    if (orbitContainer && !orbitContainer.children.length) {
      orbitContainer.innerHTML = services.map((s, idx) => `
        <a href="#service-0${idx + 1}" class="orbit-icon-node" data-service="${(s.title || '').toUpperCase()}" data-idx="${idx}" aria-label="${s.title}">
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

    // C. Pinned Paged Deck (#servicesStackDeck)
    const deck = document.getElementById('servicesStackDeck');
    if (deck) {
      const existingCards = deck.querySelectorAll('.svc-card');
      if (existingCards.length === services.length) {
        // Update in-place to preserve DOM nodes, listeners and pristine 3D sculptures
        existingCards.forEach((card, idx) => {
          const s = services[idx];
          const tagEl = card.querySelector('.svc-num-label');
          if (tagEl) {
            const num = s.num || `0${idx + 1}`;
            const rawTag = (s.tagline || 'PRACTICE').replace(/^\s*—?\s*/, '').replace(/^\s*0\d\s*[\/·-]?\s*/, '').replace('//', '/');
            tagEl.textContent = `${num} / ${rawTag.toUpperCase()}`;
          }
          const titleEl = card.querySelector('.svc-title-main');
          if (titleEl && s.title) titleEl.innerHTML = s.title.toUpperCase();
          const descEl = card.querySelector('.svc-card-desc');
          if (descEl && s.desc) descEl.textContent = s.desc;
          const chipsRow = card.querySelector('.svc-chips-row');
          if (chipsRow && s.deliverables && s.deliverables.length) {
            chipsRow.innerHTML = s.deliverables.map(d => `
              <span class="svc-chip-item"><span class="svc-chip-dot"></span> ${d}</span>
            `).join('');
          }
          const rightEl = card.querySelector('.svc-card-right');
          if (rightEl) {
            if (s.image) {
              rightEl.innerHTML = `<img src="${s.image}" alt="${s.title}" style="width:100%;height:100%;object-fit:cover;object-position:center center;border-radius:18px;display:block;" />`;
            } else {
              rightEl.innerHTML = getServiceSculptureHTML(idx, s.num || `0${idx + 1}`);
            }
          }
        });
      } else {
        // Render dynamically with accurate sculptures or custom image
        deck.innerHTML = services.map((s, idx) => {
          const num = s.num || `0${idx + 1}`;
          const rawTag = (s.tagline || 'PRACTICE').replace(/^\s*—?\s*/, '').replace(/^\s*0\d\s*[\/·-]?\s*/, '').replace('//', '/');
          return `
            <article class="svc-card" id="service-0${idx + 1}">
              <div class="svc-card-left">
                <div class="svc-card-top-row">
                  <span class="svc-num-label">${num} / ${rawTag.toUpperCase()}</span>
                </div>
                <h3 class="svc-title-main">${(s.title || '').toUpperCase()}</h3>
                <p class="svc-card-desc">${s.desc}</p>
                <div class="svc-deliv-wrap">
                  <span class="svc-deliv-title">Deliverables &amp; Scope</span>
                  <div class="svc-chips-row">
                    ${(s.deliverables || []).map(d => `
                      <span class="svc-chip-item"><span class="svc-chip-dot"></span> ${d}</span>
                    `).join('')}
                  </div>
                </div>
                <div class="svc-card-actions">
                  <a href="contact.html" class="svc-btn-action">Inquire About This Service</a>
                </div>
              </div>
              <div class="svc-card-right">
                ${s.image ? `<img src="${s.image}" alt="${s.title}" style="width:100%;height:100%;object-fit:cover;object-position:center center;border-radius:18px;display:block;" />` : getServiceSculptureHTML(idx, s.num || `0${idx + 1}`)}
              </div>
            </article>
          `;
        }).join('');
      }

      if (typeof window.updateStackDeckPhysics === 'function') {
        window.updateStackDeckPhysics();
      }
    }
  }

  // ═══════════════════════════════════════════════════════════
  // 7. CONTACT & MULTI-STEP BRIEF RENDERER (CONTACT.HTML)
  // ═══════════════════════════════════════════════════════════
  function renderContactPage() {
    if (!window.CMSStore || typeof window.CMSStore.getContactBrief !== 'function') return;
    const brief = window.CMSStore.getContactBrief();
    if (!brief) return;

    // Header & Badge
    const headerTitle = document.querySelector('#start-project-sec .fs-sec-title');
    if (headerTitle && brief.header?.title) headerTitle.textContent = brief.header.title;

    const headerDesc = document.querySelector('#start-project-sec .fs-sec-desc');
    if (headerDesc && brief.header?.desc) headerDesc.textContent = brief.header.desc;

    const headerBadge = document.querySelector('#start-project-sec .fs-right-badge span:last-child');
    if (headerBadge && brief.header?.badge) headerBadge.textContent = brief.header.badge;

    // Left Rail Step Words (01 to 05)
    const railTabs = document.querySelectorAll('.integrated-left-rail .rail-step-tab');
    if (railTabs.length >= 5) {
      if (brief.step1?.railWord) {
        const rw1 = railTabs[0].querySelector('.rail-step-word');
        if (rw1) rw1.textContent = brief.step1.railWord;
      }
      if (brief.step2?.railWord) {
        const rw2 = railTabs[1].querySelector('.rail-step-word');
        if (rw2) rw2.textContent = brief.step2.railWord;
      }
      if (brief.step3?.railWord) {
        const rw3 = railTabs[2].querySelector('.rail-step-word');
        if (rw3) rw3.textContent = brief.step3.railWord;
      }
      if (brief.step4?.railWord) {
        const rw4 = railTabs[3].querySelector('.rail-step-word');
        if (rw4) rw4.textContent = brief.step4.railWord;
      }
      if (brief.step5?.railWord) {
        const rw5 = railTabs[4].querySelector('.rail-step-word');
        if (rw5) rw5.textContent = brief.step5.railWord;
      }
    }

    // ── STEP 1: Scope ──
    const p1 = document.getElementById('stepPane1');
    if (p1) {
      const h1 = p1.querySelector('.pane-headline');
      if (h1 && brief.step1?.headline) h1.textContent = brief.step1.headline;
      const c1 = p1.querySelector('.pane-caption');
      if (c1 && brief.step1?.caption) c1.textContent = brief.step1.caption;

      const grid = document.getElementById('scopeGrid');
      if (grid && Array.isArray(brief.step1?.cards) && brief.step1.cards.length) {
        const currentActive = grid.querySelector('.scope-option-card.active')?.getAttribute('data-mandate');
        grid.innerHTML = brief.step1.cards.map((c, i) => {
          const isActive = currentActive ? (c.mandate === currentActive || c.title === currentActive) : (i === 0);
          return `
            <div class="scope-option-card${isActive ? ' active' : ''}" data-mandate="${c.mandate || c.title}">
              <div class="soc-left-group">
                <div class="soc-index">${c.index || `0${i + 1} / PRACTICE`}</div>
                <div class="soc-title">${c.title}</div>
              </div>
              <div class="soc-keywords">
                ${(c.keywords || []).map((k, ki) => `<span>${k}</span>${ki < c.keywords.length - 1 ? '<span class="soc-kw-dot"></span>' : ''}`).join('')}
              </div>
              <div class="soc-status-icon">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor">
                  <polyline points="3.5 8.5 6.5 11.5 12.5 4.5"></polyline>
                </svg>
              </div>
            </div>
          `;
        }).join('');

        grid.querySelectorAll('.scope-option-card').forEach(card => {
          card.addEventListener('click', () => {
            grid.querySelectorAll('.scope-option-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
          });
        });
      }
    }

    // ── STEP 2: Disciplines ──
    const p2 = document.getElementById('stepPane2');
    if (p2) {
      const h2 = p2.querySelector('.pane-headline');
      if (h2 && brief.step2?.headline) h2.textContent = brief.step2.headline;
      const c2 = p2.querySelector('.pane-caption');
      if (c2 && brief.step2?.caption) c2.textContent = brief.step2.caption;

      const discGrid = document.getElementById('discGrid');
      if (discGrid && Array.isArray(brief.step2?.disciplines) && brief.step2.disciplines.length) {
        discGrid.innerHTML = brief.step2.disciplines.map(d => `
          <div class="disc-item-chip${d.defaultSelected ? ' selected' : ''}" data-disc="${d.label}">
            <span>${d.label}</span>
            <span class="disc-dot-check">✓</span>
          </div>
        `).join('');

        discGrid.querySelectorAll('.disc-item-chip').forEach(chip => {
          chip.addEventListener('click', () => {
            chip.classList.toggle('selected');
          });
        });
      }
    }

    // ── STEP 3: Capital Allocation ──
    const p3 = document.getElementById('stepPane3');
    if (p3) {
      const h3 = p3.querySelector('.pane-headline');
      if (h3 && brief.step3?.headline) h3.textContent = brief.step3.headline;
      const c3 = p3.querySelector('.pane-caption');
      if (c3 && brief.step3?.caption) c3.textContent = brief.step3.caption;

      const tierGrid = document.getElementById('tierGrid');
      if (tierGrid && Array.isArray(brief.step3?.tiers) && brief.step3.tiers.length) {
        tierGrid.innerHTML = brief.step3.tiers.map((t, idx) => `
          <div class="tier-option-box${t.defaultSelected || idx === 1 ? ' active' : ''}" data-tier="${t.amount}">
            <div class="tob-amount">${t.amount}</div>
            <div class="tob-tier-name">${t.name}</div>
          </div>
        `).join('');

        tierGrid.querySelectorAll('.tier-option-box').forEach(tier => {
          tier.addEventListener('click', () => {
            tierGrid.querySelectorAll('.tier-option-box').forEach(t => t.classList.remove('active'));
            tier.classList.add('active');
          });
        });
      }

      const tlLabel = p3.querySelector('.timeline-label-title');
      if (tlLabel && brief.step3?.timelineTitle) tlLabel.textContent = brief.step3.timelineTitle;

      const tlPills = document.getElementById('timelinePills');
      if (tlPills && Array.isArray(brief.step3?.timelines) && brief.step3.timelines.length) {
        tlPills.innerHTML = brief.step3.timelines.map((tl, idx) => `
          <button type="button" class="timeline-pill${tl.defaultSelected || idx === 0 ? ' active' : ''}">${tl.label}</button>
        `).join('');

        tlPills.querySelectorAll('.timeline-pill').forEach(pill => {
          pill.addEventListener('click', () => {
            tlPills.querySelectorAll('.timeline-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
          });
        });
      }
    }

    // ── STEP 4: Strategy Session Window (Calendar & Configurable Month) ──
    const p4 = document.getElementById('stepPane4');
    if (p4) {
      const h4 = p4.querySelector('.pane-headline');
      if (h4 && brief.step4?.headline) h4.textContent = brief.step4.headline;
      const c4 = p4.querySelector('.pane-caption');
      if (c4 && brief.step4?.caption) c4.textContent = brief.step4.caption;

      const tzBadge = p4.querySelector('.sbi-tz-badge span:last-child');
      if (tzBadge && brief.step4?.timezone) tzBadge.textContent = brief.step4.timezone;

      const now = new Date();
      const s4 = brief.step4 || {};
      const targetYear = (s4.defaultYear !== undefined && s4.defaultYear !== null) ? parseInt(s4.defaultYear, 10) : now.getFullYear();
      const targetMonth = (s4.defaultMonth !== undefined && s4.defaultMonth !== null) ? parseInt(s4.defaultMonth, 10) : now.getMonth();
      const defaultDay = (s4.defaultDay !== undefined && s4.defaultDay !== null) ? parseInt(s4.defaultDay, 10) : now.getDate();
      const bookedList = Array.isArray(s4.bookedDays) ? s4.bookedDays.map(d => parseInt(d, 10)) : [8, 9];

      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const monthShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const weekdaysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      const monthTitleEl = document.getElementById('stepCalMonthTitle');
      if (monthTitleEl) {
        monthTitleEl.textContent = `${monthNames[targetMonth] || 'September'} ${targetYear}`;
      }

      const daysGrid = document.getElementById('stepSbDaysGrid');
      const summaryText = document.getElementById('stepSlotSummaryText');
      const slotsCount = document.getElementById('stepSlotsCount');
      const timesGrid = document.getElementById('stepSbTimesGrid');

      const customSlots = Array.isArray(s4.slots) && s4.slots.length ? s4.slots : [
        '11:00 AM IST', '02:30 PM IST', '04:30 PM IST', '06:00 PM IST', '08:00 PM IST'
      ];

      let selectedDay = defaultDay;
      let selectedWeekday = 'Monday';
      let selectedTime = customSlots[0] || '02:30 PM IST';

      function updateSummary() {
        if (summaryText) {
          summaryText.textContent = `${selectedWeekday}, ${monthShortNames[targetMonth]} ${selectedDay}, ${targetYear} · ${selectedTime}`;
        }
      }

      function renderSlots(dayNum) {
        if (!timesGrid) return;
        const availableCount = customSlots.length;
        if (slotsCount) {
          slotsCount.textContent = `${availableCount} Slots Open`;
        }

        timesGrid.innerHTML = '';
        customSlots.forEach((tStr, idx) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'sb-time-chip' + (tStr === selectedTime || (!customSlots.includes(selectedTime) && idx === 0) ? ' active' : '');
          btn.setAttribute('data-time', tStr);
          btn.textContent = tStr;

          if (!customSlots.includes(selectedTime) && idx === 0) {
            selectedTime = tStr;
            updateSummary();
          }

          btn.addEventListener('click', () => {
            timesGrid.querySelectorAll('.sb-time-chip').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            selectedTime = tStr;
            updateSummary();
          });

          timesGrid.appendChild(btn);
        });
      }

      if (daysGrid) {
        daysGrid.innerHTML = '';

        // 1st day of target month (0=Sun, 1=Mon, ..., 6=Sat)
        const firstDayObj = new Date(targetYear, targetMonth, 1);
        let firstDayOfWeek = firstDayObj.getDay();
        let leadCount = (firstDayOfWeek === 0) ? 6 : firstDayOfWeek - 1;

        // Days in previous month
        const prevMonthLastDate = new Date(targetYear, targetMonth, 0).getDate();
        for (let i = leadCount - 1; i >= 0; i--) {
          const cell = document.createElement('div');
          cell.className = 'sb-day-cell disabled';
          cell.textContent = prevMonthLastDate - i;
          daysGrid.appendChild(cell);
        }

        // Days in target month
        const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
        const isCurrentMonthYear = (targetYear === now.getFullYear() && targetMonth === now.getMonth());
        if (isCurrentMonthYear && selectedDay < now.getDate()) {
          selectedDay = now.getDate();
        } else if (selectedDay > daysInMonth) {
          selectedDay = isCurrentMonthYear ? now.getDate() : 1;
        }

        const selDayObj = new Date(targetYear, targetMonth, selectedDay);
        selectedWeekday = weekdaysMap[selDayObj.getDay()];

        for (let day = 1; day <= daysInMonth; day++) {
          const dObj = new Date(targetYear, targetMonth, day);
          const dow = dObj.getDay();
          const isSun = dow === 0;
          const isPast = isCurrentMonthYear ? (day < now.getDate()) : (targetYear < now.getFullYear() || (targetYear === now.getFullYear() && targetMonth < now.getMonth()));
          const isToday = isCurrentMonthYear && (day === now.getDate());
          const isBooked = bookedList.includes(day);
          const isSelected = day === selectedDay;

          const cell = document.createElement('button');
          cell.type = 'button';

          let classes = ['sb-day-cell'];
          if (isSelected) classes.push('active');
          if (isToday) classes.push('today');
          if (isSun || isPast) classes.push('disabled');
          if (isBooked) classes.push('booked');

          cell.className = classes.join(' ');
          cell.textContent = day;
          cell.setAttribute('data-day', day);
          cell.setAttribute('data-weekday', weekdaysMap[dow]);
          if (isBooked) {
            cell.setAttribute('title', `${monthNames[targetMonth]} ${day}, ${targetYear} · Fully Booked`);
          }

          if (!isSun && !isPast) {
            cell.addEventListener('click', () => {
              if (isBooked) return;
              daysGrid.querySelectorAll('.sb-day-cell').forEach(c => c.classList.remove('active'));
              cell.classList.add('active');
              selectedDay = day;
              selectedWeekday = weekdaysMap[dow];
              updateSummary();
              renderSlots(day);
            });
          }

          daysGrid.appendChild(cell);
        }

        const totalFilled = leadCount + daysInMonth;
        const remainder = totalFilled % 7;
        const trailCount = remainder === 0 ? 0 : 7 - remainder;
        for (let t = 1; t <= trailCount; t++) {
          const cell = document.createElement('div');
          cell.className = 'sb-day-cell disabled';
          cell.textContent = t;
          daysGrid.appendChild(cell);
        }

        renderSlots(selectedDay);
        updateSummary();
      }

      // Consultation Focus Topics
      const focusLabel = p4.querySelector('.sbi-focus-select-wrap label');
      if (focusLabel && s4.focusLabel) focusLabel.textContent = s4.focusLabel;

      const topicDropdown = document.getElementById('stepSelectTopicDropdown');
      const topicLabel = document.getElementById('stepSelectTopicLabel');
      const hiddenTopic = document.getElementById('stepSbTopic');
      const topicList = Array.isArray(s4.focusTopics) && s4.focusTopics.length ? s4.focusTopics : [
        'Logo Design & Visual Identity',
        'Brand Identity Development',
        'Website Design & Development',
        'Social Media & Digital Marketing',
        'Content Creation & Influencer Marketing',
        'Full 360° Studio Creative Partnership'
      ];

      if (topicDropdown) {
        topicDropdown.innerHTML = topicList.map((top, idx) => `
          <div class="luxury-select-opt${idx === 0 ? ' active' : ''}" data-value="${top}">
            <span class="lso-text">${top}</span>
            <span class="lso-check">✓</span>
          </div>
        `).join('');

        if (topicLabel) topicLabel.textContent = topicList[0];
        if (hiddenTopic) hiddenTopic.value = topicList[0];

        topicDropdown.querySelectorAll('.luxury-select-opt').forEach(opt => {
          opt.addEventListener('click', (e) => {
            e.stopPropagation();
            const val = opt.getAttribute('data-value');
            if (hiddenTopic) hiddenTopic.value = val;
            if (topicLabel) topicLabel.textContent = val;

            topicDropdown.querySelectorAll('.luxury-select-opt').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');

            const trigger = document.getElementById('stepSelectTopicTrigger');
            if (trigger) {
              trigger.classList.remove('open');
              trigger.setAttribute('aria-expanded', 'false');
            }
            topicDropdown.classList.remove('open');
          });
        });
      }
    }

    // ── STEP 5: Credentials & Success Overlay ──
    const p5 = document.getElementById('stepPane5');
    if (p5) {
      const h5 = p5.querySelector('.pane-headline');
      if (h5 && brief.step5?.headline) h5.textContent = brief.step5.headline;
      const c5 = p5.querySelector('.pane-caption');
      if (c5 && brief.step5?.caption) c5.textContent = brief.step5.caption;

      const s5 = brief.step5 || {};
      const lblName = p5.querySelector('#grpName label');
      if (lblName && s5.nameLabel) lblName.textContent = s5.nameLabel;
      const inName = document.getElementById('fName');
      if (inName && s5.namePlaceholder) inName.placeholder = s5.namePlaceholder;

      const lblEmail = p5.querySelector('#grpEmail label');
      if (lblEmail && s5.emailLabel) lblEmail.textContent = s5.emailLabel;
      const inEmail = document.getElementById('fEmail');
      if (inEmail && s5.emailPlaceholder) inEmail.placeholder = s5.emailPlaceholder;

      const lblOrg = p5.querySelector('#grpOrg label');
      if (lblOrg && s5.orgLabel) lblOrg.textContent = s5.orgLabel;
      const inOrg = document.getElementById('fOrg');
      if (inOrg && s5.orgPlaceholder) inOrg.placeholder = s5.orgPlaceholder;

      const lblPhone = p5.querySelector('#grpPhone label');
      if (lblPhone && s5.phoneLabel) lblPhone.textContent = s5.phoneLabel;
      const inPhone = document.getElementById('fPhone');
      if (inPhone && s5.phonePlaceholder) inPhone.placeholder = s5.phonePlaceholder;

      const lblVision = p5.querySelector('#grpVision label');
      if (lblVision && s5.visionLabel) lblVision.textContent = s5.visionLabel;
      const inVision = document.getElementById('fVision');
      if (inVision && s5.visionPlaceholder) inVision.placeholder = s5.visionPlaceholder;

      const ndaLine = document.getElementById('ndaCheck');
      if (ndaLine && s5.ndaText) {
        const textDiv = ndaLine.querySelector('div:last-child');
        if (textDiv) textDiv.innerHTML = s5.ndaText;
      }
    }

    // Success Overlay
    const s5 = brief.step5 || {};
    const successTitle = document.querySelector('#monolithSuccessOverlay .mso-title');
    if (successTitle && s5.successTitle) successTitle.textContent = s5.successTitle;

    const successDesc = document.querySelector('#monolithSuccessOverlay .mso-desc');
    if (successDesc && s5.successDesc) successDesc.textContent = s5.successDesc;

    const btnReset = document.getElementById('btnResetBrief');
    if (btnReset && s5.resetBtnText) {
      const spanTxt = btnReset.querySelector('span:first-child');
      if (spanTxt) spanTxt.textContent = s5.resetBtnText;
    }
  }

  // ═══════════════════════════════════════════════════════════
  // 8. MASTER INITIALIZATION & MULTI-TAB BROADCAST
  // ═══════════════════════════════════════════════════════════
  function initDynamicCMS() {
    applySEOMetadata();
    renderClientLogos();
    renderPerspectivesPage();
    renderPortfolioProjects();
    renderAboutPage();
    renderServicesPage();
    renderContactPage();
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

  // Real-Time Live Code & Asset Sync via Server-Sent Events
  if (typeof EventSource !== 'undefined') {
    try {
      const liveSource = new EventSource('/api/live-sync');
      liveSource.addEventListener('code_change', (e) => {
        try {
          const payload = JSON.parse(e.data);
          const changedFile = payload.file || '';
          console.log('⚡ [SITE LIVE SYNC] Change detected:', changedFile);

          if (changedFile.includes('data-store.js')) {
            const s = document.createElement('script');
            s.src = `data-store.js?t=${Date.now()}`;
            s.onload = () => {
              if (window.CMSStore && window.CMSStore.reloadFromCode) {
                window.CMSStore.reloadFromCode();
              }
              initDynamicCMS();
            };
            document.head.appendChild(s);
          } else {
            if (window.CMSStore && window.CMSStore.reloadFromCode) {
              window.CMSStore.reloadFromCode();
            }
            initDynamicCMS();
          }
        } catch (err) {}
      });
    } catch (e) {}
  }

})();
