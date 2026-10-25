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
    const clients = window.CMSStore.getClients(true);
    if (!clients.length) return;

    // A. 3-Row Infinite Dual-Direction Logo Marquee Stages (Home index.html & About about.html)
    const marqueeStages = document.querySelectorAll('.brands-marquee-stage');
    if (marqueeStages.length) {
      function renderLogoCard(c) {
        let logoContent = '';
        if (c.type === 'svg' && c.svgCode) {
          logoContent = c.svgCode;
        } else if (c.imageUrl) {
          logoContent = `<img src="${c.imageUrl}" alt="${c.name || 'Client Logo'}" class="brand-logo-img" loading="lazy" />`;
        } else {
          logoContent = `<span style="font-family:'Montserrat',sans-serif;font-weight:800;font-size:15px;letter-spacing:1px;color:currentColor;">${c.name}</span>`;
        }
        const linkStart = c.websiteUrl && c.websiteUrl !== '#' ? `<a href="${c.websiteUrl}" target="_blank" rel="noopener" class="brand-logo-card" title="${c.name}">` : `<div class="brand-logo-card">`;
        const linkEnd = c.websiteUrl && c.websiteUrl !== '#' ? `</a>` : `</div>`;
        return `${linkStart}${logoContent}${linkEnd}`;
      }

      function buildGroupHtml(clientSlice) {
        return clientSlice.map(renderLogoCard).join('');
      }

      marqueeStages.forEach(stage => {
        const rows = stage.querySelectorAll('.brand-row-wrap');
        if (rows.length >= 3) {
          // Exactly 20 unique logos per row, perfectly synchronized across Home and About
          const rowSlices = [
            clients.slice(0, 20),
            clients.slice(20, 40),
            clients.slice(40, 60)
          ];

          rows.forEach((row, rIdx) => {
            const track = row.querySelector('.marquee-track');
            if (track && rowSlices[rIdx] && rowSlices[rIdx].length) {
              const groupContent = buildGroupHtml(rowSlices[rIdx]);
              track.innerHTML = `
                <div class="marquee-group">${groupContent}</div>
                <div class="marquee-group" aria-hidden="true">${groupContent}</div>
              `;
            }
          });
        }
      });
    }

    // B. Generic client tracks on any other page (excluding .brands-marquee-stage)
    const otherTracks = document.querySelectorAll('.brand-logo-track, .client-marquee-track, #clientLogoGrid, .clients-track');
    if (otherTracks.length) {
      otherTracks.forEach(track => {
        if (track.closest('.brands-marquee-stage') || track.closest('#brands-driver') || track.closest('#clients-section')) return;
        const items = [...clients, ...clients];
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
          const linkStart = c.websiteUrl && c.websiteUrl !== '#' ? `<a href="${c.websiteUrl}" target="_blank" rel="noopener" class="brand-logo-card" title="${c.name}">` : `<div class="brand-logo-card">`;
          const linkEnd = c.websiteUrl && c.websiteUrl !== '#' ? `</a>` : `</div>`;
          html += `${linkStart}${logoContent}${linkEnd}`;
        });
        track.innerHTML = html;
      });
    }
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
          const current = currentWords[currentWordIdx];
          const prevIdx = currentWordIdx;
          currentWordIdx = (currentWordIdx + 1) % currentWords.length;
          const next = currentWords[currentWordIdx];
          current?.classList.remove('active');
          current?.classList.add('exit');
          next?.classList.remove('exit');
          next?.classList.add('active');
          setTimeout(() => {
            currentWords[prevIdx]?.classList.remove('exit');
          }, 320);
        }, 3200);
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
      if (el.id === 'exploreBlogBtn' || el.id === 'exploreBlogBtnMobile' || el.closest('#exploreBlogBtn, #exploreBlogBtnMobile')) return;

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

    const pills1 = heroSec.querySelectorAll('#heroPill1Media, .hero-pill-1');
    const pills2 = heroSec.querySelectorAll('#heroPill2Media, .hero-pill-2');

    const p1Id = heroData.pill1ProjectId || 'vibee';
    const proj1 = (typeof window.CMSStore.getPortfolioById === 'function' ? window.CMSStore.getPortfolioById(p1Id) : null) || (typeof window.CMSStore.getProjectById === 'function' ? window.CMSStore.getProjectById(p1Id) : null);
    const img1 = proj1 ? (proj1.bannerImage || proj1.coverImage || heroData.pill1Img || 'img/Selected Work Case Study Cards (Portfolio Showcase)-01.jpg') : (heroData.pill1Img || 'img/Selected Work Case Study Cards (Portfolio Showcase)-01.jpg');

    pills1.forEach(pill1 => {
      const imgEl = pill1.querySelector('img') || document.getElementById('heroPill1Img');
      if (imgEl) imgEl.src = img1;
      pill1.setAttribute('data-project-id', p1Id);
      if (proj1) pill1.setAttribute('title', `Explore ${proj1.title}`);
      pill1.onclick = () => {
        if (typeof window.openProjectModal === 'function') window.openProjectModal(p1Id);
        else if (typeof window.openModal === 'function') window.openModal(p1Id);
      };
    });

    const p2Id = heroData.pill2ProjectId || 'veloce';
    const proj2 = (typeof window.CMSStore.getPortfolioById === 'function' ? window.CMSStore.getPortfolioById(p2Id) : null) || (typeof window.CMSStore.getProjectById === 'function' ? window.CMSStore.getProjectById(p2Id) : null);
    const img2 = proj2 ? (proj2.bannerImage || proj2.coverImage || heroData.pill2Img || 'img/port-veloce.jpg') : (heroData.pill2Img || 'img/port-veloce.jpg');

    pills2.forEach(pill2 => {
      const imgEl = pill2.querySelector('img') || document.getElementById('heroPill2Img');
      if (imgEl) imgEl.src = img2;
      pill2.setAttribute('data-project-id', p2Id);
      if (proj2) pill2.setAttribute('title', `Explore ${proj2.title}`);
      pill2.onclick = () => {
        if (typeof window.openProjectModal === 'function') window.openProjectModal(p2Id);
        else if (typeof window.openModal === 'function') window.openModal(p2Id);
      };
    });
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

      function makeWorkCard(p, numStr, subStr, cardId) {
        const title = p.title || 'FEATURED WORK';
        const img = p.bannerImage || p.coverImage || 'img/port-chronos.jpg';
        return `
          <a href="portfolio.html?project=${p.id || ''}" class="work-duo-card"${cardId ? ` id="${cardId}"` : ''}>
            <div class="work-card-media">
              <img src="${img}" alt="${title}" class="work-card-img" onerror="this.src='img/port-chronos.jpg';" />
            </div>
            <div class="work-card-content">
              <div class="work-top-meta">
                <span class="work-num">
                  <svg class="work-globe-icon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                  ${numStr}
                </span>
              </div>
              <div class="work-bottom-block">
                <h3 class="work-title">${title}</h3>
                <div class="work-bottom-meta">
                  <div class="work-cta-wrap">
                    <span>View Case Study</span>
                    <div class="work-cta-arrow">
                      <svg viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H7M17 7V17" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a>
        `;
      }

      if (p1.title) worksSet1.innerHTML = makeWorkCard(p1, '01 / GLOBAL ICON', '', 'workCard1') + makeWorkCard(p2, '02 / GLOBAL ICON', '', 'workCard2');
      if (p3.title) worksSet2.innerHTML = makeWorkCard(p3, '03 / GLOBAL ICON', '', 'workCard3') + makeWorkCard(p4, '04 / GLOBAL ICON', '', 'workCard4');
      if (typeof window.updateWorksOnScroll === 'function') {
        window.updateWorksOnScroll();
      }
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

        const objPos = proj.objectPosition || (slotNum === 6 || proj.id === 'alda' || img.includes('-06') ? 'left center' : 'center center');

        cardsHtml += `
          <!-- CARD ${slotNum} (SLOT ${slotNum}) -->
          <article class="p-flow-item p-item-${slotNum}">
            <a href="portfolio.html?project=${proj.id}" class="p-card-v p-card-${slotNum}">
              <div class="pcv-media">
                <img src="${img}" alt="${proj.title}" style="width:100%;height:100%;object-fit:cover;object-position:${objPos};transition:transform .7s cubic-bezier(0.16,1,0.3,1);" onerror="this.src='img/port-chronos.jpg';" />
                <div class="pcv-badge-top"><span class="pcv-num">${numStr}</span><span class="pcv-client">${clientStr}</span></div>
              </div>
              <div class="pcv-info">
                <div class="pcv-tags"><span>${tag1}</span><span>${tag2}</span></div>
                <h3 class="pcv-title">${titleText}</h3>
                <div class="pcv-cta">Explore Case Study <span class="pcv-arrow"><svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" fill="none" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg></span></div>
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
      const cleanHeadline = profile.storyHeadline.replace(/\.+$/, '').replace(/^"+|"+$/g, '').trim();
      statementEl.innerHTML = `"${cleanHeadline.replace(/MOMENTUM/g, '<span>MOMENTUM.</span>')}"`;
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
      // 1. Desktop Minimalist Editorial List (> 860px)
      const desktopHtml = team.map((m) => {
        const photoSrc = (m.photo && m.photo.trim()) ? m.photo : 'img/team-ami.jpg';
        return `
        <div class="team-index-row" data-member="${m.memberKey || m.id}" data-name="${m.name}" data-role="${m.role}" data-photo="${photoSrc}">
          <div class="team-row-main">
            <div class="team-row-left">
              <span class="team-row-name">${m.name}</span>
            </div>
            <div class="team-row-right">
              <span class="team-row-role team-desktop-role">${m.role}</span>
            </div>
          </div>
        </div>
      `;
      }).join('');

      // 2. Mobile 2-Column Photo Card Grid (<= 860px)
      const mobileHtml = team.map((m, idx) => {
        const photoSrc = (m.photo && m.photo.trim()) ? m.photo : 'img/team-ami.jpg';
        const numStr = String(idx + 1).padStart(2, '0');
        return `
        <div class="team-card" data-member="${m.memberKey || m.id}" data-name="${m.name}" data-role="${m.role}" data-photo="${photoSrc}">
          <div class="team-card-media">
            <img src="${photoSrc}" alt="${m.name}" loading="lazy" class="team-card-img" onerror="this.onerror=null; this.src='img/team-ami.jpg';" />
            <div class="team-card-badge">${numStr}</div>
          </div>
          <div class="team-card-info">
            <h3 class="team-card-name">${m.name}</h3>
            <p class="team-card-role">${m.role}</p>
          </div>
        </div>
      `;
      }).join('');

      teamIndex.innerHTML = `
        <div class="team-desktop-list">${desktopHtml}</div>
        <div class="team-mobile-grid">${mobileHtml}</div>
      `;

      // Re-bind floating circle interaction for desktop
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
    const serviceUrls = [
      'service-logo-design.html',
      'service-brand-identity.html',
      'service-website-development.html',
      'service-digital-marketing.html',
      'service-content-creation.html'
    ];
    if (orbitContainer && !orbitContainer.children.length) {
      orbitContainer.innerHTML = services.map((s, idx) => `
        <a href="${serviceUrls[idx] || s.pageUrl || `service-logo-design.html`}" class="orbit-icon-node" data-service="${(s.title || '').toUpperCase()}" data-idx="${idx}" aria-label="${s.title}">
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
          const isVidAsset = (url) => !!(url && (/\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url) || url.startsWith('data:video/')));
          const renderServiceVisual = (imgUrl, title, idx, num) => {
            if (!imgUrl) return getServiceSculptureHTML(idx, num);
            if (isVidAsset(imgUrl)) {
              return `<video class="svc-card-media-video" autoplay loop muted playsinline preload="auto" onloadedmetadata="this.muted=true;this.play();" style="width:100%;height:100%;object-fit:cover;object-position:center center;border-radius:18px;display:block;"><source src="${imgUrl}" type="video/mp4"></video>`;
            }
            return `<img src="${imgUrl}" alt="${title || ''}" onerror="this.parentElement.innerHTML=getServiceSculptureHTML(${idx}, '${num}');" style="width:100%;height:100%;object-fit:cover;object-position:center center;border-radius:18px;display:block;" />`;
          };

          const rightEl = card.querySelector('.svc-card-right');
          if (rightEl) {
            rightEl.innerHTML = renderServiceVisual(s.image, s.title, idx, s.num || `0${idx + 1}`);
          }
        });
      } else {
        // Render dynamically with accurate sculptures or custom image/video
        const isVidAsset = (url) => !!(url && (/\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url) || url.startsWith('data:video/')));
        const renderServiceVisual = (imgUrl, title, idx, num) => {
          if (!imgUrl) return getServiceSculptureHTML(idx, num);
          if (isVidAsset(imgUrl)) {
            return `<video class="svc-card-media-video" autoplay loop muted playsinline preload="auto" onloadedmetadata="this.muted=true;this.play();" style="width:100%;height:100%;object-fit:cover;object-position:center center;border-radius:18px;display:block;"><source src="${imgUrl}" type="video/mp4"></video>`;
          }
          return `<img src="${imgUrl}" alt="${title || ''}" onerror="this.parentElement.innerHTML=getServiceSculptureHTML(${idx}, '${num}');" style="width:100%;height:100%;object-fit:cover;object-position:center center;border-radius:18px;display:block;" />`;
        };

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
                  <a href="contact.html?service=${encodeURIComponent(s.title || '')}#start-project-sec" class="svc-btn-action">Inquire About This Service</a>
                </div>
              </div>
              <div class="svc-card-right">
                ${renderServiceVisual(s.image, s.title, idx, num)}
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
  // 6.5 HOME PAGE SERVICES & POCKET DOSSIER RENDERER (INDEX.HTML)
  // ═══════════════════════════════════════════════════════════
  function renderHomePageServices() {
    if (!window.CMSStore || typeof window.CMSStore.getHomeServices !== 'function') return;
    const homeServices = window.CMSStore.getHomeServices();
    if (!homeServices) return;

    // A. Pocket Jacket & Default Sheet
    if (homeServices.cover) {
      const defaultSheet = document.getElementById('svcSheetDefault');
      if (defaultSheet) {
        const titleEl = defaultSheet.querySelector('.svc-sheet-title');
        const subEl = defaultSheet.querySelector('.svc-sheet-sub');
        if (titleEl && homeServices.cover.title) titleEl.textContent = homeServices.cover.title;
        if (subEl && homeServices.cover.sub) subEl.textContent = homeServices.cover.sub;
      }
      const jacketBtn = document.querySelector('.svc-jacket-btn');
      if (jacketBtn) {
        if (homeServices.cover.jacketBtnLink) jacketBtn.setAttribute('href', homeServices.cover.jacketBtnLink);
        if (homeServices.cover.jacketBtnText) {
          const svg = jacketBtn.querySelector('svg');
          if (svg) {
            jacketBtn.childNodes[0].textContent = homeServices.cover.jacketBtnText + ' ';
          } else {
            jacketBtn.innerHTML = `${homeServices.cover.jacketBtnText} <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" fill="none" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>`;
          }
        }
      }
    }

    // B. Pocket Sheets & Showcase Cards (index 0 to 4)
    if (Array.isArray(homeServices.cards)) {
      homeServices.cards.forEach((card, idx) => {
        // 1. Pocket Sheet (#svcSheet0 ... #svcSheet4)
        const sheet = document.getElementById(`svcSheet${idx}`);
        if (sheet) {
          const sTitle = sheet.querySelector('.svc-sheet-title');
          const sSub = sheet.querySelector('.svc-sheet-sub');
          if (sTitle && (card.sheetTitle || card.title)) {
            sTitle.textContent = (card.sheetTitle || card.title).replace(/^\d{2}\.\s*/, '');
          }
          if (sSub && (card.sheetSub || card.badge)) {
            sSub.textContent = card.sheetSub || card.badge;
          }
        }

        // 2. Showcase Card (#svcCard0 ... #svcCard4)
        const showcaseCard = document.getElementById(`svcCard${idx}`);
        if (showcaseCard) {
          const watermarkEl = showcaseCard.querySelector('.svc-card-num-watermark');
          if (watermarkEl && (card.watermark || card.num)) {
            watermarkEl.textContent = card.watermark || card.num;
          }

          const badgeEl = showcaseCard.querySelector('.svc-badge');
          if (badgeEl && card.badge) {
            badgeEl.textContent = card.badge;
          }

          const titleEl = showcaseCard.querySelector('h3');
          if (titleEl && card.title) {
            titleEl.textContent = card.title;
          }

          const descEl = showcaseCard.querySelector('p');
          if (descEl) {
            if (card.leadDesc || card.bodyDesc) {
              const lead = card.leadDesc ? `<strong>${card.leadDesc}</strong> ` : '';
              const body = card.bodyDesc || '';
              descEl.innerHTML = lead + body;
            } else if (card.desc) {
              descEl.innerHTML = card.desc;
            }
          }

          const delivWrap = showcaseCard.querySelector('.svc-deliverables');
          if (delivWrap && Array.isArray(card.deliverables)) {
            delivWrap.innerHTML = card.deliverables.map(d => `<span class="svc-deliv-pill">${d}</span>`).join('');
          }

          const serviceLinks = [
            'service-logo-design.html',
            'service-brand-identity.html',
            'service-website-development.html',
            'service-digital-marketing.html',
            'service-content-creation.html'
          ];
          const actionLinkEl = showcaseCard.querySelector('.svc-action-link');
          if (actionLinkEl) {
            const fallbackLink = serviceLinks[idx] || 'services.html';
            const targetHref = (card.actionLink && card.actionLink !== 'service-detail.html' && card.actionLink.trim())
              ? card.actionLink.trim()
              : fallbackLink;
            actionLinkEl.setAttribute('href', targetHref);
            if (card.actionText) {
              actionLinkEl.innerHTML = `${card.actionText} <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>`;
            }
            actionLinkEl.style.pointerEvents = 'auto';
            actionLinkEl.style.cursor = 'pointer';
            actionLinkEl.onclick = function (e) {
              e.stopPropagation();
              const dest = actionLinkEl.getAttribute('href');
              if (dest && dest !== '#' && !dest.startsWith('javascript:')) {
                window.location.href = dest;
              }
            };
          }

          const pagEl = showcaseCard.querySelector('.svc-pagination');
          if (pagEl && card.pagination) {
            pagEl.textContent = card.pagination;
          }

          const coreServices = (typeof window.CMSStore?.getServices === 'function') ? window.CMSStore.getServices() : [];
          const matchingCoreSvc = coreServices[idx] || coreServices.find(s => parseInt(s.num, 10) === (idx + 1));
          const effectiveMediaUrl = (card.mediaUrl && card.mediaUrl.trim()) || (matchingCoreSvc && matchingCoreSvc.image && matchingCoreSvc.image.trim()) || '';

          if (effectiveMediaUrl) {
            const artFrame = showcaseCard.querySelector('.svc-s3-art-frame');
            if (artFrame) {
              const url = effectiveMediaUrl;
              if (url.endsWith('.mp4') || url.endsWith('.webm') || url.includes('.mp4?') || url.startsWith('data:video/')) {
                artFrame.innerHTML = `
                  <video class="svc-art-video" autoplay loop muted playsinline preload="auto" onloadedmetadata="this.muted=true;this.play();" style="width:100%;height:100%;object-fit:cover;">
                    <source src="${url}" type="video/mp4">
                  </video>
                `;
              } else {
                artFrame.innerHTML = `
                  <img src="${url}" alt="${card.title || 'Service'}" style="width:100%;height:100%;object-fit:cover;display:block;" />
                `;
              }
            }
          }
        }
      });
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
          const rawTitle = (c.title || '').replace(/<br[^>]*>/gi, ' ').replace(/\s+/g, ' ').trim();
          const formattedTitle = (rawTitle === 'Content Creation & Influencer Marketing' || c.mandate === 'Content Creation & Influencer Marketing' || rawTitle.includes('Content Creation & Influencer'))
            ? 'Content Creation &amp; Influencer <br class="soc-mobile-br">Marketing'
            : rawTitle;
          return `
            <div class="scope-option-card${isActive ? ' active' : ''}" data-mandate="${c.mandate || c.title}">
              <div class="soc-left-group">
                <div class="soc-index">${c.index || `0${i + 1} / PRACTICE`}</div>
                <div class="soc-title">${formattedTitle}</div>
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

    // ── STEP 2: Capital Allocation ──
    const p2 = document.getElementById('stepPane2');
    const allocConfig = (brief.step2 && brief.step2.tiers) ? brief.step2 : (brief.step3 || {});
    if (p2) {
      const h2 = p2.querySelector('.pane-headline');
      if (h2 && allocConfig.headline) h2.textContent = allocConfig.headline;
      const c2 = p2.querySelector('.pane-caption');
      if (c2 && allocConfig.caption) {
        if (allocConfig.caption.includes(' and ')) {
          const parts = allocConfig.caption.split(' and ');
          c2.innerHTML = `<span class="desc-line">${parts[0]}</span><span class="desc-line">and ${parts.slice(1).join(' and ')}</span>`;
        } else {
          c2.innerHTML = `<span class="desc-line">${allocConfig.caption}</span>`;
        }
      }

      const tierGrid = document.getElementById('tierGrid');
      if (tierGrid && Array.isArray(allocConfig.tiers) && allocConfig.tiers.length) {
        tierGrid.innerHTML = allocConfig.tiers.map((t, idx) => `
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

      const tlLabel = p2.querySelector('.timeline-label-title');
      if (tlLabel && allocConfig.timelineTitle) tlLabel.textContent = allocConfig.timelineTitle;

      const tlPills = document.getElementById('timelinePills');
      if (tlPills && Array.isArray(allocConfig.timelines) && allocConfig.timelines.length) {
        tlPills.innerHTML = allocConfig.timelines.map((tl, idx) => `
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

    // ── STEP 3: Strategy Session Window (Calendar & Configurable Month) ──
    const p3 = document.getElementById('stepPane3') || document.getElementById('stepPane4');
    const sessionConfig = (brief.step3 && brief.step3.defaultYear !== undefined) ? brief.step3 : (brief.step4 || {});
    if (p3) {
      const h3 = p3.querySelector('.pane-headline');
      if (h3 && sessionConfig.headline) h3.textContent = sessionConfig.headline;
      const c3 = p3.querySelector('.pane-caption');
      if (c3 && sessionConfig.caption) c3.textContent = sessionConfig.caption;

      const tzBadge = p3.querySelector('.sbi-tz-badge span:last-child');
      if (tzBadge && sessionConfig.timezone) tzBadge.textContent = sessionConfig.timezone;

      const now = new Date();
      const s3 = sessionConfig;
      const isLegacySep29 = (s3.defaultYear === 2026 && s3.defaultMonth === 8 && s3.defaultDay === 29);
      const isPastMonth = (s3.defaultYear !== undefined && s3.defaultMonth !== undefined && (s3.defaultYear < now.getFullYear() || (s3.defaultYear === now.getFullYear() && s3.defaultMonth < now.getMonth())));

      const targetYear = (isLegacySep29 || isPastMonth || s3.defaultYear === undefined || s3.defaultYear === null) ? now.getFullYear() : parseInt(s3.defaultYear, 10);
      const targetMonth = (isLegacySep29 || isPastMonth || s3.defaultMonth === undefined || s3.defaultMonth === null) ? now.getMonth() : parseInt(s3.defaultMonth, 10);

      // Booked list: configured via admin panel/backend
      let bookedList = [];
      if (Array.isArray(s3.bookedDays)) {
        bookedList = s3.bookedDays.map(d => parseInt(d, 10)).filter(d => !isNaN(d));
      }

      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const monthShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const weekdaysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      const monthTitleEl = document.getElementById('stepCalMonthTitle');
      if (monthTitleEl) {
        monthTitleEl.textContent = `${monthNames[targetMonth] || 'October'} ${targetYear}`;
      }

      const daysGrid = document.getElementById('stepSbDaysGrid');
      const summaryText = document.getElementById('stepSlotSummaryText');
      const slotsCount = document.getElementById('stepSlotsCount');
      const timesGrid = document.getElementById('stepSbTimesGrid');

      const customSlots = Array.isArray(s3.slots) && s3.slots.length ? s3.slots : [
        '11:00 AM IST', '02:30 PM IST', '04:30 PM IST', '06:00 PM IST', '08:00 PM IST'
      ];

      const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
      const isCurrentMonthYear = (targetYear === now.getFullYear() && targetMonth === now.getMonth());

      // Base default day: live today (now.getDate() = 9) or s3.defaultDay
      let baseDay = isCurrentMonthYear ? now.getDate() : (parseInt(s3.defaultDay, 10) || 1);
      if (isLegacySep29 || isPastMonth) {
        baseDay = now.getDate();
      }
      if (baseDay > daysInMonth) baseDay = 1;

      // Selection logic: Start at baseDay (9th).
      // If that date is booked through backend/admin OR is a Sunday, search forward for next available open date!
      let selectedDay = baseDay;
      while (selectedDay <= daysInMonth) {
        const testDate = new Date(targetYear, targetMonth, selectedDay);
        const isSun = testDate.getDay() === 0;
        const isBkd = bookedList.includes(selectedDay);
        const isPastDay = isCurrentMonthYear && (selectedDay < now.getDate());
        if (!isSun && !isBkd && !isPastDay) {
          break; // Found next available open date!
        }
        selectedDay++;
      }
      if (selectedDay > daysInMonth) {
        selectedDay = baseDay;
      }

      const selDayObj = new Date(targetYear, targetMonth, selectedDay);
      let selectedWeekday = weekdaysMap[selDayObj.getDay()];
      let selectedTime = customSlots[0] || '11:00 AM IST';

      function updateSummary() {
        if (summaryText) {
          const dateStr = `${selectedWeekday}, ${monthShortNames[targetMonth]} ${selectedDay}, ${targetYear}`;
          summaryText.textContent = `${dateStr} · ${selectedTime}`;
          summaryText.setAttribute('data-selected-date', dateStr);
          summaryText.setAttribute('data-selected-time', selectedTime);
          window._studioSelectedDate = dateStr;
          window._studioSelectedTime = selectedTime;
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
    }

    // ── STEP 4: Credentials & Success Overlay ──
    const p4 = document.getElementById('stepPane4') || document.getElementById('stepPane5');
    const credsConfig = (brief.step4 && (brief.step4.nameLabel || brief.step4.namePlaceholder)) ? brief.step4 : (brief.step5 || {});
    if (p4) {
      const h4 = p4.querySelector('.pane-headline');
      if (h4 && credsConfig.headline) h4.textContent = credsConfig.headline;
      const c4 = p4.querySelector('.pane-caption');
      if (c4 && credsConfig.caption) c4.textContent = credsConfig.caption;

      const lblName = p4.querySelector('#grpName label');
      if (lblName && credsConfig.nameLabel) lblName.textContent = credsConfig.nameLabel;
      const inName = document.getElementById('fName');
      if (inName && credsConfig.namePlaceholder) inName.placeholder = credsConfig.namePlaceholder;

      const lblEmail = p4.querySelector('#grpEmail label');
      if (lblEmail && credsConfig.emailLabel) lblEmail.textContent = credsConfig.emailLabel;
      const inEmail = document.getElementById('fEmail');
      if (inEmail && credsConfig.emailPlaceholder) inEmail.placeholder = credsConfig.emailPlaceholder;

      const lblOrg = p4.querySelector('#grpOrg label');
      if (lblOrg && credsConfig.orgLabel) lblOrg.textContent = credsConfig.orgLabel;
      const inOrg = document.getElementById('fOrg');
      if (inOrg && credsConfig.orgPlaceholder) inOrg.placeholder = credsConfig.orgPlaceholder;

      const lblPhone = p4.querySelector('#grpPhone label');
      if (lblPhone && credsConfig.phoneLabel) lblPhone.textContent = credsConfig.phoneLabel;
      const inPhone = document.getElementById('fPhone');
      if (inPhone && credsConfig.phonePlaceholder) inPhone.placeholder = credsConfig.phonePlaceholder;

      const lblVision = p4.querySelector('#grpVision label');
      if (lblVision && credsConfig.visionLabel) lblVision.textContent = credsConfig.visionLabel;
      const inVision = document.getElementById('fVision');
      if (inVision && credsConfig.visionPlaceholder) inVision.placeholder = credsConfig.visionPlaceholder;

      const ndaLine = document.getElementById('ndaCheck');
      if (ndaLine && credsConfig.ndaText) {
        const textDiv = ndaLine.querySelector('div:last-child');
        if (textDiv) textDiv.innerHTML = credsConfig.ndaText;
      }
    }

    // Success Overlay
    const successTitle = document.querySelector('#monolithSuccessOverlay .mso-title');
    if (successTitle && credsConfig.successTitle) successTitle.textContent = credsConfig.successTitle;

    const successDesc = document.querySelector('#monolithSuccessOverlay .mso-desc');
    if (successDesc && credsConfig.successDesc) successDesc.textContent = credsConfig.successDesc;

    const btnReset = document.getElementById('btnResetBrief');
    if (btnReset && credsConfig.resetBtnText) {
      const spanTxt = btnReset.querySelector('span:first-child');
      if (spanTxt) spanTxt.textContent = credsConfig.resetBtnText;
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
    renderHomePageServices();
    renderContactPage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDynamicCMS);
  } else {
    initDynamicCMS();
  }

  // Authoritative reaction when MySQL Database finishes loading via PHP
  if (window.CMSStore && typeof window.CMSStore.ready === 'function') {
    window.CMSStore.ready().then(initDynamicCMS).catch(() => {});
  }

  // Real-time reactive updates across tabs and local events
  window.addEventListener('1928_cms_updated', initDynamicCMS);
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
        } catch (err) { }
      });
    } catch (e) { }
  }

  /* ============================================================
     MOBILE RESPONSIVENESS SYSTEM (PHONE SCREENS ONLY: <= 768px)
     DESKTOP / WEB SCREENS (> 768px) REMAIN 100% UNTOUCHED
     ============================================================ */
  function initMobileResponsivenessSystem() {
    // 1. Inject scoped styles: Default hides mobile elements; @media (max-width: 768px) applies phone styles
    if (!document.getElementById('mobile-responsive-system-css')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'mobile-responsive-system-css';
      styleEl.textContent = `
        /* Strictly Hidden on Desktop / Web Screens (> 768px) */
        .nav-hamburger {
          display: none;
        }
        .nav-mobile-drawer {
          display: none;
        }

        /* Completely remove all decorative dots and bullets beside text everywhere on phone & web */
        .sec-dot,
        .hpc-dot,
        .bph-dot,
        .cdb-indicator,
        .hero-dot-pulse,
        .hl-dot,
        .svc-why-dot,
        .smb-dot,
        .pdh-dot,
        .nem-dot,
        .sb-tz-dot,
        .ssp-dot,
        .toast-dot,
        .bfb-dot,
        .ram-pulse-dot,
        .card-loc-dot,
        .sfw-pulse-dot,
        .brand-dot,
        .pulse-dot {
          display: none !important;
        }

        /* ------------------------------------------------------------
           PHONE SCREEN RULES (<= 860px ONLY)
           ------------------------------------------------------------ */
        @media (max-width: 860px), (hover: none) and (pointer: coarse) {
          html, body {
            overflow-x: clip !important;
            max-width: 100vw !important;
          }

          html, body, * {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }

          /* Hide scrolling sidebar / scrollbar completely on phone view across all pages */
          html::-webkit-scrollbar,
          body::-webkit-scrollbar,
          *::-webkit-scrollbar,
          ::-webkit-scrollbar,
          ::-webkit-scrollbar-thumb,
          ::-webkit-scrollbar-track,
          *::-webkit-scrollbar-thumb,
          *::-webkit-scrollbar-track {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
            background: transparent !important;
          }

          /* Hide custom cursor dot & expanding hover ring completely on phone */
          .c-dot,
          .c-ring,
          #cDot,
          #cRing {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }

          /* --- Global Phone Navigation CSS Variables --- */
          :root {
            --nav-mobile-h: 68px;
            --nav-mobile-px: 20px;
            --nav-btn-size: 42px;
          }

          /* --- Header on Phone --- */
          #nav {
            height: var(--nav-mobile-h, 68px) !important;
            padding: 0 var(--nav-mobile-px, 20px) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            box-sizing: border-box !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
          }
          [data-theme="light"] #nav {
            border-bottom: 1px solid rgba(0, 0, 0, 0.07) !important;
          }
          #nav .nav-logo {
            display: inline-flex !important;
            align-items: center !important;
            line-height: 0 !important;
          }
          #nav .nav-logo-img {
            height: 30px !important;
            max-width: 140px !important;
            width: auto !important;
            object-fit: contain !important;
          }
          #nav .nav-links,
          .nav-links {
            display: none !important;
          }
          #nav .nav-right {
            display: flex !important;
            align-items: center !important;
            margin: 0 !important;
            padding: 0 !important;
            gap: 0 !important;
          }
          #nav .nav-cta {
            display: none !important;
          }

          /* --- Hamburger Button on Phone --- */
          .nav-hamburger {
            display: inline-flex !important;
            width: var(--nav-btn-size, 42px) !important;
            height: var(--nav-btn-size, 42px) !important;
            border-radius: 50% !important;
            background: rgba(255, 255, 255, 0.08) !important;
            border: 1px solid rgba(255, 255, 255, 0.15) !important;
            color: var(--ink, #fff) !important;
            cursor: pointer !important;
            align-items: center !important;
            justify-content: center !important;
            flex-direction: column !important;
            gap: 4.5px !important;
            padding: 0 !important;
            z-index: 100001 !important;
            box-sizing: border-box !important;
            transition: background 0.25s, border-color 0.25s, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
            -webkit-tap-highlight-color: transparent !important;
            position: relative !important;
          }
          [data-theme="light"] .nav-hamburger {
            background: rgba(0, 0, 0, 0.04) !important;
            border-color: rgba(0, 0, 0, 0.12) !important;
            color: #0A0A0C !important;
          }
          .nav-hamburger:hover {
            border-color: var(--cr, #C8102E) !important;
          }
          .nav-hamburger:active {
            transform: scale(0.88) !important;
          }
          .nav-hamburger .nh-bar {
            width: 18px !important;
            height: 2px !important;
            background: currentColor !important;
            border-radius: 2px !important;
            transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease, width 0.25s !important;
            transform-origin: center !important;
            display: block !important;
          }
          /* When clicked / opened: morph lines cleanly */
          .nav-hamburger.is-active .nh-bar-1,
          .nav-hamburger[aria-expanded="true"] .nh-bar-1 {
            transform: translateY(6.5px) rotate(45deg) !important;
          }
          .nav-hamburger.is-active .nh-bar-2,
          .nav-hamburger[aria-expanded="true"] .nh-bar-2 {
            opacity: 0 !important;
            transform: scaleX(0) !important;
          }
          .nav-hamburger.is-active .nh-bar-3,
          .nav-hamburger[aria-expanded="true"] .nh-bar-3 {
            transform: translateY(-6.5px) rotate(-45deg) !important;
          }

          /* --- Fullscreen Luxury Mobile Drawer with Circular Expand & Morph --- */
          .nav-mobile-drawer {
            position: fixed !important;
            inset: 0 !important;
            z-index: 100005 !important;
            display: block !important;
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
            transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.4s ease !important;
          }
          .nav-mobile-drawer.is-open {
            opacity: 1 !important;
            visibility: visible !important;
            pointer-events: auto !important;
          }
          .nav-mobile-drawer.is-closing {
            opacity: 0 !important;
            visibility: visible !important;
            pointer-events: none !important;
          }

          .nmd-backdrop {
            position: absolute !important;
            inset: 0 !important;
            background: rgba(0, 0, 0, 0.72) !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            opacity: 0 !important;
            transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
          }
          [data-theme="light"] .nmd-backdrop {
            background: rgba(10, 10, 12, 0.45) !important;
          }
          .nav-mobile-drawer.is-open .nmd-backdrop {
            opacity: 1 !important;
          }
          .nav-mobile-drawer.is-closing .nmd-backdrop {
            opacity: 0 !important;
          }

          /* Panel: Fills 100% of phone screen, expanding directly from the button click point */
          .nmd-panel {
            position: absolute !important;
            top: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            left: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            background: #0A0A0C !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: flex-start !important;
            padding: 0 !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
            /* Expand outwards in a circular ripple from the button */
            clip-path: circle(21px at var(--btn-x, calc(100% - 41px)) var(--btn-y, 34px)) !important;
            transform: scale(0.98) !important;
            transform-origin: var(--btn-x, calc(100% - 41px)) var(--btn-y, 34px) !important;
            transition: clip-path 0.48s cubic-bezier(0.16, 1, 0.3, 1), transform 0.48s cubic-bezier(0.16, 1, 0.3, 1) !important;
            will-change: clip-path, transform !important;
          }
          [data-theme="light"] .nmd-panel {
            background: #F8F8FA !important;
          }
          .nav-mobile-drawer.is-open .nmd-panel {
            clip-path: circle(160% at var(--btn-x, calc(100% - 41px)) var(--btn-y, 34px)) !important;
            transform: scale(1) !important;
          }
          .nav-mobile-drawer.is-closing .nmd-panel {
            clip-path: circle(0px at var(--btn-x, calc(100% - 41px)) var(--btn-y, 34px)) !important;
            transform: scale(0.96) !important;
            transition: clip-path 0.38s cubic-bezier(0.16, 1, 0.3, 1), transform 0.38s cubic-bezier(0.16, 1, 0.3, 1) !important;
          }

          /* Drawer Header: Exactly matches #nav height (68px), horizontal padding (20px), alignment and logo */
          .nmd-header {
            height: var(--nav-mobile-h, 68px) !important;
            padding: 0 var(--nav-mobile-px, 20px) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            box-sizing: border-box !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
            flex-shrink: 0 !important;
            margin: 0 !important;
          }
          [data-theme="light"] .nmd-header {
            border-bottom: 1px solid rgba(0, 0, 0, 0.07) !important;
          }
          .nmd-logo {
            display: inline-flex !important;
            align-items: center !important;
            line-height: 0 !important;
          }
          .nmd-logo img {
            height: 30px !important;
            max-width: 140px !important;
            width: auto !important;
            object-fit: contain !important;
          }

          /* Close Button in Open Menu Bar: Exactly aligned with hamburger */
          .nmd-close-btn {
            width: var(--nav-btn-size, 42px) !important;
            height: var(--nav-btn-size, 42px) !important;
            border-radius: 50% !important;
            border: 1px solid rgba(255, 255, 255, 0.15) !important;
            background: rgba(255, 255, 255, 0.08) !important;
            color: #ffffff !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            padding: 0 !important;
            box-sizing: border-box !important;
            transition: background 0.25s, border-color 0.25s, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), color 0.25s !important;
            -webkit-tap-highlight-color: transparent !important;
            position: relative !important;
          }
          [data-theme="light"] .nmd-close-btn {
            border-color: rgba(0, 0, 0, 0.12) !important;
            background: rgba(0, 0, 0, 0.04) !important;
            color: #0A0A0C !important;
          }
          .nmd-close-btn:hover {
            border-color: var(--cr, #C8102E) !important;
            color: var(--cr, #C8102E) !important;
          }
          .nmd-close-btn:active {
            transform: scale(0.88) !important;
          }

          /* Cross icon inside the close button: Smooth rotation & scale reduction on click */
          .nmd-close-btn svg {
            width: 18px !important;
            height: 18px !important;
            transform: rotate(-90deg) scale(0.35) !important;
            opacity: 0 !important;
            transform-origin: center center !important;
            transition: transform 0.42s cubic-bezier(0.34, 1.56, 0.64, 1) 0.08s, opacity 0.3s ease 0.08s !important;
          }
          .nav-mobile-drawer.is-open .nmd-close-btn svg {
            transform: rotate(0deg) scale(1) !important;
            opacity: 1 !important;
          }
          /* When clicking the close button or closing: reduce the cross effect (shrinks down with rotation) */
          .nmd-close-btn:active svg,
          .nmd-close-btn.is-closing svg,
          .nav-mobile-drawer.is-closing .nmd-close-btn svg {
            transform: rotate(90deg) scale(0.35) !important;
            opacity: 0 !important;
            transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease !important;
          }

          /* Menu Links Body: Flows elegantly from the top down, leaving intentional open white space below */
          .nmd-body {
            flex: 1 1 auto !important;
            padding: clamp(24px, 4vh, 36px) var(--nav-mobile-px, 20px) 40px !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: flex-start !important;
            gap: 0 !important;
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch !important;
          }
          .nmd-nav-list {
            list-style: none !important;
            padding: 0 !important;
            margin: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            gap: clamp(4px, 0.9vh, 8px) !important;
          }
          .nmd-nav-list li {
            opacity: 0;
            transform: translateY(12px);
            transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .nav-mobile-drawer.is-open .nmd-nav-list li {
            opacity: 1;
            transform: translateY(0);
          }
          .nav-mobile-drawer.is-open .nmd-nav-list li:nth-child(1) { transition-delay: 0.08s; }
          .nav-mobile-drawer.is-open .nmd-nav-list li:nth-child(2) { transition-delay: 0.13s; }
          .nav-mobile-drawer.is-open .nmd-nav-list li:nth-child(3) { transition-delay: 0.18s; }
          .nav-mobile-drawer.is-open .nmd-nav-list li:nth-child(4) { transition-delay: 0.23s; }
          .nav-mobile-drawer.is-open .nmd-nav-list li:nth-child(5) { transition-delay: 0.28s; }
          .nav-mobile-drawer.is-open .nmd-nav-list li:nth-child(6) { transition-delay: 0.33s; }

          .nmd-link {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            padding: 11px 16px !important;
            border-radius: 12px !important;
            font-family: var(--font-primary, 'Gotham', 'Montserrat', sans-serif) !important;
            font-size: clamp(1.14rem, 4.8vw, 1.32rem) !important;
            font-weight: 800 !important;
            letter-spacing: 0.05em !important;
            text-transform: uppercase !important;
            color: rgba(245, 244, 240, 0.92) !important;
            text-decoration: none !important;
            transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease !important;
            -webkit-tap-highlight-color: transparent !important;
          }
          [data-theme="light"] .nmd-link {
            color: #0A0A0C !important;
          }
          .nmd-link:hover {
            color: var(--cr, #C8102E) !important;
            background: rgba(200, 16, 46, 0.05) !important;
            transform: translateX(4px) !important;
          }
          .nmd-link.active {
            background: rgba(200, 16, 46, 0.08) !important;
            color: var(--cr, #C8102E) !important;
          }
          [data-theme="light"] .nmd-link.active {
            background: rgba(200, 16, 46, 0.06) !important;
            color: var(--cr, #C8102E) !important;
          }
          .nmd-link-inner {
            display: inline-flex !important;
            align-items: baseline !important;
          }
          .nmd-num {
            font-family: 'Space Mono', monospace !important;
            font-size: 0.72rem !important;
            font-weight: 700 !important;
            color: var(--cr, #C8102E) !important;
            margin-right: 14px !important;
            letter-spacing: 0.12em !important;
            display: inline-block !important;
          }
          .nmd-chevron {
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
          }
          .nmd-submenu-toggle.is-open .nmd-chevron {
            transform: rotate(180deg) !important;
          }
          .nmd-submenu {
            display: none;
            flex-direction: column !important;
            gap: 2px !important;
            padding: 4px 0 6px 36px !important;
            transition: all 0.25s ease !important;
          }
          .nmd-submenu.is-open {
            display: flex !important;
          }
          .nmd-sublink {
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
            padding: 8px 12px !important;
            border-radius: 10px !important;
            font-family: var(--font-primary, 'Gotham', 'Montserrat', sans-serif) !important;
            font-size: 0.84rem !important;
            font-weight: 700 !important;
            letter-spacing: 0.04em !important;
            color: rgba(245, 244, 240, 0.65) !important;
            text-decoration: none !important;
            transition: all 0.2s ease !important;
            -webkit-tap-highlight-color: transparent !important;
          }
          [data-theme="light"] .nmd-sublink {
            color: rgba(10, 10, 10, 0.62) !important;
          }
          .nmd-sublink:hover, .nmd-sublink.active {
            color: var(--cr, #C8102E) !important;
            background: rgba(200, 16, 46, 0.06) !important;
            transform: translateX(3px) !important;
          }
          .nmd-sublink span {
            font-family: 'Space Mono', monospace !important;
            font-size: 0.65rem !important;
            color: var(--cr, #C8102E) !important;
          }

          /* --- Mobile Page Layout Optimizations --- */
          /* index.html */
          .hero-title h1 {
            font-size: clamp(28px, 7.5vw, 44px) !important;
            line-height: 1.05 !important;
          }
          .hero-reel {
            width: min(90vw, 400px) !important;
            height: min(54vw, 240px) !important;
          }
          .hero-story-wrap {
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: min(90vw, 400px) !important;
            max-width: 90vw !important;
            text-align: center !important;
          }
          .story-tag {
            margin-left: auto !important;
            margin-right: auto !important;
          }
          .story-words-block {
            font-size: clamp(16px, 4.4vw, 20px) !important;
            line-height: 1.48 !important;
          }
          .port-cards-flow {
            padding: 0 16px !important;
          }
          .p-flow-item {
            padding-left: 0 !important;
            padding-right: 0 !important;
            justify-content: center !important;
            margin-top: 24px !important;
          }
          .p-card-v {
            max-width: 100% !important;
            transform: none !important;
            border-radius: 18px !important;
          }
          .svc-stage {
            max-width: 100vw !important;
            transform: scale(clamp(0.65, 0.9vw, 1)) !important;
            transform-origin: center center !important;
          }
          .svc-hero-right-content {
            flex: 1 1 auto !important;
            min-width: 0 !important;
            max-width: 100% !important;
            width: auto !important;
            padding-left: 16px !important;
          }
          .fbc-header {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            width: 100% !important;
          }
          .fbc-header > div {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            width: 100% !important;
          }
          .fbc-tag {
            display: none !important;
          }
          .fbc-header h2 {
            display: block !important;
            font-family: var(--font-primary) !important;
            font-weight: 700 !important;
            font-size: clamp(30px, 8.2vw, 38px) !important;
            line-height: 1.04 !important;
            text-align: center !important;
            letter-spacing: -0.035em !important;
            text-transform: uppercase !important;
            color: var(--ink) !important;
            margin: 0 auto 10px auto !important;
          }
          .fbc-header h2 em {
            font-family: var(--font-primary) !important;
            font-style: italic !important;
            font-weight: 300 !important;
            color: var(--cr) !important;
            text-transform: uppercase !important;
            display: inline !important;
          }
          .fbc-header p {
            text-align: center !important;
            margin: 0 auto !important;
            font-size: 0.88rem !important;
            line-height: 1.5 !important;
            color: var(--ink-mid) !important;
            max-width: 330px !important;
          }
          .fbc-header {
            margin-bottom: 28px !important;
          }
          .fbc-header .fbc-all {
            display: none !important;
          }
          .fbc-footer-cta {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            margin-top: 26px !important;
            width: 100% !important;
          }
          .fbc-more-btn {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 8px !important;
            padding: 9px 20px !important;
            background: rgba(255, 255, 255, 0.05) !important;
            border: 1px solid rgba(255, 255, 255, 0.14) !important;
            border-radius: 999px !important;
            color: var(--ink) !important;
            font-family: var(--font-primary) !important;
            font-size: 0.72rem !important;
            font-weight: 700 !important;
            letter-spacing: 0.08em !important;
            text-transform: uppercase !important;
            text-decoration: none !important;
            transition: all 0.25s ease !important;
          }
          .fbc-more-btn .fbc-more-arrow {
            color: var(--cr) !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            line-height: 1 !important;
            transition: transform 0.25s ease !important;
          }
          .fbc-more-btn .fbc-more-arrow svg {
            display: block !important;
            width: 15px !important;
            height: 15px !important;
          }
          .fbc-more-btn:hover .fbc-more-arrow {
            transform: translateX(4px) !important;
          }
          .fbc-more-btn:active {
            transform: scale(0.97) !important;
            border-color: var(--cr) !important;
          }
          [data-theme="light"] .fbc-more-btn {
            background: rgba(0, 0, 0, 0.03) !important;
            border-color: rgba(0, 0, 0, 0.12) !important;
            color: #0A0A0C !important;
          }
          .fbc-cards-row {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            width: 100% !important;
            gap: 20px !important;
          }
          .fbc-card {
            width: 100% !important;
            max-width: 380px !important;
            margin: 0 auto !important;
            box-sizing: border-box !important;
          }

          /* Global Luxury Footer across all pages on Phone */
          .bph-label {
            display: none !important;
          }
          #footer-driver {
            position: relative !important;
            background: var(--bg) !important;
            min-height: 100vh !important;
            min-height: 100dvh !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            padding: 20px 16px !important;
            box-sizing: border-box !important;
            width: 100% !important;
          }
          .footer-luxury-card {
            flex: 0 0 auto !important;
            width: 100% !important;
            max-width: 100% !important;
            min-height: auto !important;
            height: auto !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: flex-start !important;
            padding: 28px 20px 22px 20px !important;
            gap: 16px !important;
            border-radius: 28px !important;
            border: 1px solid var(--rule) !important;
            overflow: hidden !important;
            position: relative !important;
            box-sizing: border-box !important;
          }
          .f-header-grid {
            display: grid !important;
            grid-template-columns: auto auto !important;
            justify-content: center !important;
            column-gap: clamp(24px, 8vw, 42px) !important;
            row-gap: 16px !important;
            width: 100% !important;
            margin-bottom: 0 !important;
          }
          .f-desc-col {
            grid-column: 1 / -1 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            width: 100% !important;
            margin: 0 auto !important;
          }
          .f-desc-col .f-statement-title,
          .f-statement-title {
            text-align: center !important;
            font-size: 21px !important;
            line-height: 1.25 !important;
            margin: 0 auto 8px auto !important;
            width: 100% !important;
            max-width: 290px !important;
          }
          .f-title-br-mobile {
            display: block !important;
          }
          .f-desc-col .f-desc-text,
          .f-desc-text {
            text-align: center !important;
            font-size: 0.81rem !important;
            line-height: 1.48 !important;
            max-width: 380px !important;
            margin: 0 auto 10px auto !important;
            width: 100% !important;
          }
          .f-desc-line {
            display: block !important;
          }
          .f-desc-col .f-location-tag,
          .f-location-tag {
            font-size: 0.66rem !important;
            letter-spacing: 0.12em !important;
            margin: 0 auto 12px auto !important;
            text-align: center !important;
            width: 100% !important;
            display: block !important;
          }
          .f-desc-col .f-social-circles {
            display: none !important;
          }
          .f-social-circles {
            justify-content: center !important;
            margin: 0 auto !important;
            gap: 9px !important;
          }
          .f-cta-column .f-social-circles {
            display: flex !important;
            margin: 6px auto 0 auto !important;
          }
          .f-social-circles .f-circle-btn {
            width: 34px !important;
            height: 34px !important;
          }
          .f-nav-col {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            padding: 0 4px !important;
            box-sizing: border-box !important;
          }
          .f-col-label {
            font-size: 0.70rem !important;
            letter-spacing: 0.12em !important;
            margin-bottom: 8px !important;
            color: var(--cr, #C8102E) !important;
            font-weight: 700 !important;
            text-align: center !important;
            width: 100% !important;
          }
          .f-links-clean {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            gap: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            list-style: none !important;
          }
          .f-links-clean li {
            margin-bottom: 6px !important;
            text-align: center !important;
            width: 100% !important;
          }
          .f-links-clean a {
            font-size: 0.84rem !important;
            line-height: 1.25 !important;
            color: var(--ink-mid) !important;
            text-align: center !important;
            display: inline-block !important;
          }
          .f-cta-column {
            grid-column: 1 / -1 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            width: 100% !important;
            gap: 10px !important;
            margin-top: 4px !important;
          }
          .f-action-pill {
            width: 100% !important;
            max-width: 360px !important;
            box-sizing: border-box !important;
            padding: 12px 16px !important;
            border-radius: 16px !important;
          }
          .f-action-heading {
            font-size: 0.86rem !important;
          }
          .f-action-sub {
            font-size: 0.68rem !important;
          }
          .f-action-arrow {
            width: 28px !important;
            height: 28px !important;
            font-size: 0.80rem !important;
          }
          .f-bottom-cluster {
            overflow: hidden !important;
            width: 100% !important;
            max-width: 100% !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
            margin-top: 14px !important;
            margin-bottom: 0 !important;
            padding: 0 !important;
            position: relative !important;
          }
          .f-brand-title-wrap {
            overflow: hidden !important;
            width: 100% !important;
            max-width: 100% !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            padding: 4px 0 2px 0 !important;
            margin-bottom: 0 !important;
            box-sizing: border-box !important;
          }
          .f-brand-giant-text {
            font-family: var(--font-primary) !important;
            font-weight: 900 !important;
            font-size: clamp(18px, 6.2vw, 29px) !important;
            white-space: nowrap !important;
            letter-spacing: -0.02em !important;
            line-height: 1 !important;
            width: 100% !important;
            max-width: 100% !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            transform: none !important;
            box-sizing: border-box !important;
          }
          .f-brand-giant-text .f-char {
            display: inline-block !important;
            transform: translateY(85%) !important;
            opacity: 0 !important;
            transition-property: transform, opacity !important;
            transition-duration: 0.80s, 0.60s !important;
            transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1), cubic-bezier(0.22, 1, 0.36, 1) !important;
            will-change: transform, opacity !important;
          }
          .f-brand-giant-text.revealed .f-char {
            transform: translateY(0%) !important;
            opacity: 1 !important;
          }
          .f-bottom-line {
            display: none !important;
          }
          .f-outer-bar {
            margin: 14px auto 0 auto !important;
            padding: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            gap: 3px !important;
            box-sizing: border-box !important;
          }
          .f-outer-copyright span,
          .f-outer-dev span,
          .f-outer-copyright,
          .f-outer-dev {
            text-align: center !important;
            font-size: 0.70rem !important;
            line-height: 1.3 !important;
          }

          /* about.html */
          .hero-headline {
            font-size: clamp(24px, 6.8vw, 44px) !important;
            white-space: normal !important;
            line-height: 1.08 !important;
          }
          .hero-line-1, .hero-line-2 {
            white-space: normal !important;
          }

          /* contact.html */
          #contact-hero {
            width: 100% !important;
            max-width: 100% !important;
          }
          #start-project-sec {
            width: 100% !important;
            max-width: 100% !important;
            padding: clamp(38px, 6vh, 52px) 16px 60px !important;
          }
          #start-project-sec .fs-sec-header {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            gap: 8px !important;
            border-bottom: 1px solid var(--rule) !important;
            padding-bottom: 20px !important;
            margin-bottom: 24px !important;
          }
          #start-project-sec .header-left-group {
            width: 100% !important;
            align-items: center !important;
            text-align: center !important;
            gap: 8px !important;
          }
          #start-project-sec .fs-sec-title {
            text-align: center !important;
            margin: 0 auto !important;
          }
          #start-project-sec .fs-sec-desc {
            text-align: center !important;
            margin: 0 auto !important;
            max-width: 440px !important;
          }
          #start-project-sec .fs-right-badge {
            display: none !important;
          }
          .alloc-header-group {
            display: grid !important;
            grid-template-columns: 1fr auto !important;
            grid-template-rows: auto auto !important;
            align-items: center !important;
            column-gap: 12px !important;
            row-gap: 8px !important;
            margin-bottom: 20px !important;
          }
          .alloc-header-group #allocHeadline {
            grid-column: 1 / -1 !important;
            grid-row: 1 !important;
            font-size: clamp(20px, 5.2vw, 24px) !important;
            line-height: 1.15 !important;
            margin-bottom: 2px !important;
          }
          .alloc-header-group .alloc-desc {
            grid-column: 1 !important;
            grid-row: 2 !important;
            font-size: clamp(12px, 3.2vw, 13px) !important;
            line-height: 1.4 !important;
            margin-bottom: 0 !important;
            color: var(--ink-mid) !important;
          }
          .alloc-header-group .alloc-desc .desc-line {
            display: block !important;
            margin-left: 0 !important;
          }
          .alloc-header-group .currency-toggle-wrap {
            grid-column: 2 !important;
            grid-row: 2 !important;
            justify-self: end !important;
            align-self: center !important;
            flex-shrink: 0 !important;
            padding: 2.5px !important;
            gap: 2.5px !important;
          }
          .alloc-header-group .currency-toggle-btn {
            font-size: 0.7rem !important;
            padding: 5px 11px !important;
          }
          .btn-step-next {
            white-space: nowrap !important;
            padding: 12px 26px !important;
            font-size: 0.86rem !important;
          }
          .btn-step-prev {
            white-space: nowrap !important;
            padding: 12px 20px !important;
            font-size: 0.82rem !important;
          }
          .integrated-left-rail {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          .integrated-left-rail::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
          }
          .rail-step-tab,
          .rail-step-tab:hover,
          .rail-step-tab.active {
            transform: none !important;
          }
          .hero-main-title em {
            white-space: normal !important;
          }

          /* portfolio.html */
          .filter-bar-inner {
            overflow-x: auto !important;
            justify-content: flex-start !important;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
          }

          /* blogs.html */
          .critical-dispatch-bar {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            width: min(390px, calc(100vw - 36px)) !important;
            max-width: 420px !important;
            padding: 12px 20px 11px !important;
            gap: 8px !important;
            border-radius: 18px !important;
            box-sizing: border-box !important;
            margin: 0 auto clamp(20px, 3vh, 32px) !important;
          }
          .critical-dispatch-bar:hover,
          [data-theme="light"] .critical-dispatch-bar:hover {
            transform: none !important;
            border-color: rgba(255, 255, 255, 0.08) !important;
            box-shadow: 0 8px 28px rgba(0, 0, 0, 0.22) !important;
          }
          [data-theme="light"] .critical-dispatch-bar:hover {
            border-color: rgba(0, 0, 0, 0.08) !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.03) !important;
          }
          .cdb-left {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 6px !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
            padding-right: 0 !important;
            padding-bottom: 7px !important;
            width: 100% !important;
            flex-shrink: 0 !important;
            font-size: 10.5px !important;
            letter-spacing: 0.16em !important;
          }
          [data-theme="light"] .cdb-left {
            border-bottom-color: rgba(0, 0, 0, 0.08) !important;
          }
          .cdb-indicator,
          .cdb-arrow {
            display: none !important;
          }
          .cdb-right {
            flex: none !important;
            width: 100% !important;
            height: 26px !important;
            min-height: 26px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: flex-start !important;
            overflow: hidden !important;
            position: relative !important;
            box-sizing: border-box !important;
          }
          .cdb-slider {
            width: 100% !important;
            height: 26px !important;
            min-height: 26px !important;
            position: relative !important;
            overflow: hidden !important;
          }
          .cdb-word {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 26px !important;
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: flex-start !important;
            text-align: left !important;
            font-size: 11px !important;
            box-sizing: border-box !important;
            opacity: 0 !important;
            visibility: hidden !important;
            transform: translateY(12px) !important;
            transition: opacity 0.28s ease, transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.28s !important;
            pointer-events: none !important;
          }
          .cdb-word.active {
            opacity: 1 !important;
            visibility: visible !important;
            transform: translateY(0) !important;
            pointer-events: auto !important;
            z-index: 2 !important;
          }
          .cdb-word.exit {
            opacity: 0 !important;
            visibility: hidden !important;
            transform: translateY(-12px) !important;
            pointer-events: none !important;
            z-index: 1 !important;
          }
          .cdb-cat-tag {
            display: none !important;
          }
          .cdb-num {
            font-size: 10.5px !important;
            font-weight: 800 !important;
            color: var(--cr) !important;
            margin-right: 8px !important;
            flex-shrink: 0 !important;
          }
          .cdb-topic-name {
            font-size: 11px !important;
            font-weight: 700 !important;
            color: var(--ink) !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
            flex: 1 1 auto !important;
            min-width: 0 !important;
            max-width: 100% !important;
            text-align: left !important;
          }
          [data-theme="light"] .cdb-topic-name {
            color: #0c0c0f !important;
          }

          /* Perspectives Codex Horizontal Reel on Mobile */
          #perspectives-grid-sec {
            --pga-inset: 20px !important;
            --pga-gap: 16px !important;
            min-height: auto !important;
            padding: clamp(32px, 4.5vh, 48px) 0 16px !important;
          }
          .pga-header-bar {
            padding: 0 var(--pga-inset) 14px !important;
            margin: 0 0 10px !important;
          }
          .pga-header-bar::after {
            left: var(--pga-inset) !important;
          }
          .pga-header-meta {
            display: none !important;
          }
          .pga-sticky-wrap {
            position: static !important;
            height: auto !important;
            padding: 0 !important;
          }
          .pga-track-viewport {
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
            scroll-snap-type: x mandatory !important;
            scroll-padding-left: var(--pga-inset) !important;
            scroll-padding-right: var(--pga-inset) !important;
            scrollbar-width: none !important;
          }
          .pga-track-viewport::-webkit-scrollbar {
            display: none !important;
          }
          .pga-editorial-matrix {
            transform: none !important;
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            gap: var(--pga-gap) !important;
            padding: 16px var(--pga-inset) 28px var(--pga-inset) !important;
            width: max-content !important;
            box-sizing: content-box !important;
          }
          .pga-editorial-matrix::after {
            content: "" !important;
            display: block !important;
            flex: 0 0 1px !important;
            width: 1px !important;
            margin-left: -1px !important;
            pointer-events: none !important;
          }
          .codex-card {
            scroll-snap-align: start !important;
            width: 82vw !important;
            max-width: 340px !important;
            height: auto !important;
            min-height: 480px !important;
            margin: 0 !important;
            flex-shrink: 0 !important;
          }
          .pga-mobile-cta-wrap {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            width: 100% !important;
            padding: 8px var(--pga-inset) 16px !important;
            box-sizing: border-box !important;
          }
          .pga-mobile-cta-btn {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 10px !important;
            font-family: var(--font-secondary) !important;
            font-size: 12.5px !important;
            font-weight: 700 !important;
            letter-spacing: 0.08em !important;
            text-transform: uppercase !important;
            color: var(--ink) !important;
            background: rgba(255, 255, 255, 0.04) !important;
            border: 1px solid var(--rule-m) !important;
            border-radius: 999px !important;
            padding: 12px 28px !important;
            text-decoration: none !important;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12) !important;
            transition: all 0.3s ease !important;
          }
          [data-theme="light"] .pga-mobile-cta-btn {
            background: rgba(0, 0, 0, 0.04) !important;
            border-color: rgba(0, 0, 0, 0.1) !important;
            color: #0c0c0f !important;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04) !important;
          }
          .pga-mobile-cta-btn:hover,
          .pga-mobile-cta-btn:active {
            background: var(--cr) !important;
            border-color: var(--cr) !important;
            color: #ffffff !important;
            box-shadow: 0 6px 20px rgba(200, 16, 46, 0.35) !important;
            transform: translateY(-2px) !important;
          }
          .pga-mobile-cta-btn:hover .pdh-dot,
          .pga-mobile-cta-btn:active .pdh-dot {
            background: #ffffff !important;
            box-shadow: 0 0 8px #ffffff !important;
          }
          .pga-mobile-cta-btn:hover .pdh-icon,
          .pga-mobile-cta-btn:active .pdh-icon {
            transform: translateX(3px) !important;
          }

          /* ═══════════════════════════════════════════════════════════
             SERVICE PAGES - MOBILE SECTION HEADERS & BEST WORK
             ═══════════════════════════════════════════════════════════ */
          .service-hero-section {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }

          /* Centered Section Subheadings / Tag Pills on Phone View */
          .service-hero-section .sec-tag-pill,
          .sfw-header-left .sec-tag-pill,
          .section-pillars .sec-tag-pill,
          .section-process .sec-tag-pill,
          .section-featured-works .sec-tag-pill,
          .section-faq .sec-tag-pill {
            display: flex !important;
            width: -moz-fit-content !important;
            width: fit-content !important;
            margin-left: auto !important;
            margin-right: auto !important;
            margin-bottom: 12px !important;
            justify-content: center !important;
            align-items: center !important;
            text-align: center !important;
          }

          .section-pillars .sec-heading,
          .section-process .sec-heading,
          .section-featured-works .sec-heading,
          .section-faq .sec-heading {
            text-align: center !important;
            margin: 0 auto 10px auto !important;
            width: 100% !important;
            display: block !important;
          }

          .section-pillars .sec-desc,
          .section-process .sec-desc,
          .section-featured-works .sec-desc,
          .section-faq .sec-desc {
            text-align: center !important;
            margin: 0 auto 24px auto !important;
            max-width: 480px !important;
            width: 100% !important;
            display: block !important;
          }

          /* Ensure cards inside remain strictly left-aligned per user instruction */
          .pillar-card,
          .process-card,
          .sfw-card {
            text-align: left !important;
          }
          .pillar-title,
          .pillar-desc,
          .pillar-points,
          .process-title,
          .process-desc,
          .sfw-work-title,
          .sfw-bottom-meta,
          .sfw-top-meta {
            text-align: left !important;
          }

          /* Our Best Work (Featured Works) Section on Mobile */
          .section-featured-works {
            padding: 38px 0 32px !important;
          }

          .sfw-header-row {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            width: 100% !important;
            margin-bottom: 20px !important;
          }

          .sfw-header-left {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            width: 100% !important;
          }

          /* Hide top View All Work button in header on mobile */
          .sfw-header-right {
            display: none !important;
          }

          /* Natural & Organic Cards in Our Best Work with Breathing Room */
          .sfw-grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 16px !important;
          }

          .sfw-card {
            min-height: clamp(285px, 35vh, 330px) !important;
            height: auto !important;
            aspect-ratio: 16 / 11 !important;
            padding: 22px 20px !important;
            border-radius: 20px !important;
          }

          .sfw-work-title {
            font-size: 19px !important;
            line-height: 1.25 !important;
            margin: 0 0 6px 0 !important;
          }

          .sfw-bottom-block {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 8px !important;
          }

          .sfw-bottom-meta {
            width: 100% !important;
            justify-content: flex-end !important;
          }

          /* Clean View All Work button at bottom between cards margins, removing prompt */
          .sfw-footer-bar {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            padding: 16px 0 0 0 !important;
            margin-top: 8px !important;
            width: 100% !important;
          }

          .sfw-footer-prompt {
            display: none !important;
          }

          .sfw-footer-cta {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 8px !important;
            padding: 11px 24px !important;
            font-size: 0.78rem !important;
            font-weight: 700 !important;
            letter-spacing: 0.06em !important;
            text-transform: uppercase !important;
            border-radius: 999px !important;
            background: var(--card-alt, rgba(255, 255, 255, 0.05)) !important;
            border: 1.5px solid var(--rule-m, rgba(255, 255, 255, 0.15)) !important;
            color: var(--ink, #fff) !important;
            margin: 0 auto !important;
            text-decoration: none !important;
          }

          /* Single-line button text on mobile */
          .btn-hero-primary,
          .btn-hero-secondary,
          .fcta-actions-row .btn-hero-primary,
          .fcta-actions-row .btn-hero-secondary {
            white-space: nowrap !important;
            text-wrap: nowrap !important;
          }
          .btn-hero-primary span,
          .btn-hero-secondary span,
          .fcta-actions-row .btn-hero-primary span,
          .fcta-actions-row .btn-hero-secondary span {
            white-space: nowrap !important;
            text-wrap: nowrap !important;
          }
          .fcta-actions-row .btn-hero-primary {
            padding: 13px 26px !important;
            font-size: 0.82rem !important;
            width: auto !important;
            max-width: 100% !important;
          }

          .fcta-actions .btn-primary,
          .fcta-actions .btn-ghost {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 8px !important;
            white-space: nowrap !important;
            text-wrap: nowrap !important;
          }
          /* ═══════════════════════════════════════════════════════════
             WORK & PERSPECTIVES PAGES - MOBILE VIEW (<= 768px)
             ═══════════════════════════════════════════════════════════ */
          /* 1. Modal Top Elements & Subheading Left-Aligned */
          .modal-hero-overlay,
          .reader-drawer-panel,
          .reader-body-container {
            text-align: left !important;
          }

          .modal-hero-overlay .sec-tag-pill,
          .modal-subheading-tag,
          #mHeroCat {
            margin-left: 0 !important;
            margin-right: auto !important;
            text-align: left !important;
            justify-content: flex-start !important;
            align-self: flex-start !important;
            display: inline-flex !important;
          }

          /* In-Drawer Reader Panel Header - Fix Top Cutoff / Overlap */
          .reader-drawer-panel {
            width: 100% !important;
            max-width: 100% !important;
            height: 100% !important;
            height: 100dvh !important;
          }

          .reader-header-bar {
            height: auto !important;
            min-height: 64px !important;
            padding: max(16px, env(safe-area-inset-top)) 20px 14px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            box-sizing: border-box !important;
            border-bottom: 1px solid var(--rule-m) !important;
            background: var(--bg) !important;
            flex-shrink: 0 !important;
          }

          .reader-header-left {
            display: flex !important;
            align-items: center !important;
            align-self: center !important;
            gap: 10px !important;
            margin: 0 !important;
          }

          .reader-header-left .rhl-cat-pill,
          #rdrCat {
            margin: 0 !important;
            font-family: var(--font-mono) !important;
            font-size: 11px !important;
            font-weight: 800 !important;
            color: var(--cr) !important;
            letter-spacing: 0.12em !important;
            text-transform: uppercase !important;
          }

          .rhl-sep {
            color: var(--rule-heavy) !important;
          }

          .rhl-read-time,
          #rdrReadTime {
            font-family: var(--font-mono) !important;
            font-size: 11px !important;
            color: var(--ink-dim) !important;
            letter-spacing: 0.08em !important;
            text-transform: uppercase !important;
          }

          .reader-scroll-viewport {
            padding: 24px 20px 48px !important;
            box-sizing: border-box !important;
          }

          /* Left-to-Right Horizontal Scrolling Filter on all-blogs / blog-detail */
          .bah-filter-pills-row {
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            width: 100% !important;
            box-sizing: border-box !important;
            padding: 4px 2px 8px !important;
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
            -webkit-overflow-scrolling: touch !important;
          }

          .bah-filter-pills-row::-webkit-scrollbar {
            display: none !important;
          }

          .bah-filter-btn {
            flex-shrink: 0 !important;
            white-space: nowrap !important;
          }

          /* Hide results summary bar */
          .bah-results-bar {
            display: none !important;
          }

          /* Scope Option Cards (contact.html) - allow title wrapping on phone only */
          .soc-mobile-br {
            display: inline !important;
          }
          .soc-title {
            white-space: normal !important;
            line-height: 1.25 !important;
          }

          /* Portfolio Filter Bar - Flush directly below header with zero overlap */
          #filter-bar-wrap {
            top: var(--nav-mobile-h, 68px) !important;
          }
          #nav.visible ~ #portfolio-archive-wrapper #filter-bar-wrap,
          body.nav-visible #filter-bar-wrap {
            top: var(--nav-mobile-h, 68px) !important;
          }
          #nav.hidden ~ #portfolio-archive-wrapper #filter-bar-wrap,
          body.nav-hidden #filter-bar-wrap {
            top: 0px !important;
          }

          /* 2. Top Reader Bar: Share & Copy Link on Left with Icons, Close on Right */
          .reader-top-bar {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            padding: 12px 16px !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }

          .reader-top-bar #mReaderCat,
          .reader-top-bar .reader-cat-pill {
            display: none !important;
          }

          .reader-top-actions {
            display: flex !important;
            align-items: center !important;
            justify-content: flex-start !important;
            gap: 8px !important;
            width: 100% !important;
          }

          .reader-share-btn {
            display: inline-flex !important;
            align-items: center !important;
            gap: 6px !important;
            padding: 7px 12px !important;
            font-size: 11px !important;
            font-weight: 700 !important;
            border-radius: 999px !important;
            flex-shrink: 0 !important;
          }

          .reader-share-btn .rsb-icon,
          .reader-share-btn svg {
            width: 13px !important;
            height: 13px !important;
            flex-shrink: 0 !important;
            stroke-width: 2.2 !important;
          }

          .reader-close-btn,
          #readerCloseBtn {
            margin-left: auto !important;
            flex-shrink: 0 !important;
            width: 36px !important;
            height: 36px !important;
          }

          /* 3. Author Block & Meta Row Below Image */
          .reader-hero-box {
            margin-bottom: 0 !important;
          }

          .reader-hero-meta {
            display: flex !important;
            align-items: center !important;
            padding-bottom: 0 !important;
            border-bottom: none !important;
            margin-bottom: 0 !important;
            width: 100% !important;
          }

          .rhm-author-pill {
            width: 100% !important;
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
          }

          /* 4. Specimen Banner: Only Centered Image Icon & Equal Top/Bottom Spacing */
          #mReaderSpecimenBanner {
            height: 200px !important;
            min-height: 200px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            margin-top: 24px !important;
            margin-bottom: 24px !important;
          }

          /* 5. Date & Read Time Row Positioned Below Image */
          .reader-meta-row-below-image {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            width: 100% !important;
            box-sizing: border-box !important;
            padding-bottom: 18px !important;
            border-bottom: 1px solid var(--rule-m) !important;
            margin-bottom: 26px !important;
          }

          #mReaderDate {
            text-align: left !important;
            font-family: var(--font-mono) !important;
            font-size: 11px !important;
            font-weight: 700 !important;
            letter-spacing: 0.08em !important;
            text-transform: uppercase !important;
            color: var(--ink-mid) !important;
            padding: 0 !important;
            background: transparent !important;
            border: none !important;
            display: inline-block !important;
          }

          #mReaderReadTime {
            text-align: right !important;
            font-family: var(--font-mono) !important;
            font-size: 11px !important;
            font-weight: 700 !important;
            letter-spacing: 0.08em !important;
            text-transform: uppercase !important;
            color: var(--ink-mid) !important;
            padding: 0 !important;
            background: transparent !important;
            border: none !important;
            display: inline-block !important;
          }

          #mReaderSpecimenBanner .hfs-badge,
          #mReaderSpecimenBanner .hfs-prompt,
          #mReaderSpecimenBadge,
          #mReaderSpecimenPrompt,
          .hfs-radar-ring {
            display: none !important;
          }

          #mReaderSpecimenGlyph {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            width: 100% !important;
            height: 100% !important;
          }

          #mReaderSpecimenGlyph .hfs-svg-icon {
            width: 52px !important;
            height: 52px !important;
            display: block !important;
            margin: 0 auto !important;
            opacity: 0.65 !important;
          }

          /* 5. Bottom Section: Remove Commission & Inquiry All-Caps Subheading */
          .reader-cta-deck .sec-tag-pill,
          .reader-cta-deck .modal-subheading-tag,
          .modal-cta-deck .sec-tag-pill,
          .modal-cta-deck .modal-subheading-tag {
            display: none !important;
          }

          .modal-cta-title,
          .reader-cta-title,
          .rcd-title {
            text-align: left !important;
            margin-left: 0 !important;
            margin-right: auto !important;
            margin-bottom: 8px !important;
            font-size: clamp(20px, 4.8vw, 24px) !important;
            line-height: 1.22 !important;
          }

          .modal-cta-sub,
          .reader-cta-sub,
          .rcd-sub {
            text-align: left !important;
            margin-left: 0 !important;
            margin-right: auto !important;
            margin-bottom: 4px !important;
            font-size: 14px !important;
            line-height: 1.55 !important;
          }

          /* CTA Spanning Full Width From Left to Right with Horizontal Arrow */
          .modal-cta-btn,
          .reader-cta-btn,
          .rcd-btn {
            width: 100% !important;
            max-width: 100% !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            padding: 16px 24px !important;
            box-sizing: border-box !important;
            text-align: center !important;
            border-radius: 999px !important;
            background: var(--cr, #C8102E) !important;
            color: #ffffff !important;
            gap: 10px !important;
            font-size: 11.5px !important;
            font-weight: 700 !important;
            letter-spacing: 0.12em !important;
            text-transform: uppercase !important;
            text-decoration: none !important;
            box-shadow: 0 12px 35px var(--cr-glow) !important;
          }

          .modal-cta-btn svg,
          .reader-cta-btn svg,
          .rcd-btn svg,
          .mcb-arrow-svg,
          .rcd-arrow-svg {
            width: 16px !important;
            height: 16px !important;
            flex-shrink: 0 !important;
            stroke-width: 2.4 !important;
            display: inline-block !important;
            vertical-align: middle !important;
            transform: none !important;
            transition: transform 0.25s var(--sp) !important;
          }

          .modal-cta-btn:hover svg,
          .reader-cta-btn:hover svg,
          .rcd-btn:hover svg {
            transform: translateX(4px) !important;
          }

          /* 6. Detail Page Arrow Button Improvements */
          .bah-back-btn {
            display: inline-flex !important;
            align-items: center !important;
            gap: 9px !important;
            padding: 10px 18px !important;
            font-size: 11px !important;
            border-radius: 999px !important;
            background: var(--card-bg, #111116) !important;
            border: 1px solid var(--rule-m, rgba(255, 255, 255, 0.12)) !important;
            color: var(--ink, #fff) !important;
          }

          .bah-back-btn .bbb-arrow {
            width: 14px !important;
            height: 14px !important;
            color: var(--cr, #C8102E) !important;
            stroke-width: 2.4 !important;
          }

          .card-arrow-btn,
          .card-action-arrow {
            display: inline-flex !important;
            align-items: center !important;
            gap: 6px !important;
            padding: 6px 14px !important;
            border-radius: 999px !important;
            background: var(--card-alt, rgba(255, 255, 255, 0.05)) !important;
            border: 1px solid var(--rule-m, rgba(255, 255, 255, 0.12)) !important;
            color: var(--ink, #fff) !important;
          }

          .card-arrow-btn svg,
          .card-action-arrow svg {
            width: 13px !important;
            height: 13px !important;
            stroke-width: 2.4 !important;
            flex-shrink: 0 !important;
          }
        }
      `;
      document.head.appendChild(styleEl);

      if (!document.getElementById('desktopScopeTitleStyles')) {
        const dStyle = document.createElement('style');
        dStyle.id = 'desktopScopeTitleStyles';
        dStyle.textContent = `
          @media (min-width: 861px) {
            .soc-mobile-br {
              display: none !important;
            }
            .soc-title {
              white-space: nowrap !important;
            }
          }
          @media (min-width: 769px) {
            .f-desc-col .f-social-circles {
              display: flex !important;
              margin-top: 14px !important;
              justify-content: flex-start !important;
            }
            .f-cta-column .f-social-circles {
              display: none !important;
            }
          }
        `;
        document.head.appendChild(dStyle);
      }

      // Upgrade any CTA buttons to have horizontal right-pointing arrow (starts left, points right)
      function upgradeCTAArrows() {
        const svgArrow = `<svg class="rcd-arrow-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
        document.querySelectorAll('.modal-cta-btn, .reader-cta-btn, .rcd-btn').forEach(btn => {
          const oldSvg = btn.querySelector('svg');
          if (oldSvg) {
            oldSvg.outerHTML = svgArrow;
          } else {
            const txt = btn.textContent.replace(/[↗→]/g, '').trim();
            btn.innerHTML = `<span>${txt}</span>${svgArrow}`;
          }
        });
      }
      upgradeCTAArrows();
      window.addEventListener('DOMContentLoaded', upgradeCTAArrows);
    }

    // Completely hide and disable custom cursor dot & hover ring on phone / touch screens
    function disableMobileCursor() {
      if (window.innerWidth <= 860 || ('ontouchstart' in window && window.innerWidth <= 1024)) {
        document.querySelectorAll('.c-dot, .c-ring, #cDot, #cRing').forEach(el => {
          el.style.setProperty('display', 'none', 'important');
          el.style.setProperty('visibility', 'hidden', 'important');
          el.style.setProperty('opacity', '0', 'important');
          el.style.setProperty('pointer-events', 'none', 'important');
        });
      }
    }
    disableMobileCursor();
    window.addEventListener('resize', disableMobileCursor, { passive: true });

    // 2. Add Hamburger Button to #nav .nav-right
    const navRight = document.querySelector('#nav .nav-right');
    if (navRight && !document.getElementById('navHamburgerBtn')) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'navHamburgerBtn';
      btn.className = 'nav-hamburger';
      btn.setAttribute('aria-label', 'Toggle Navigation Menu');
      btn.innerHTML = '<span class="nh-bar nh-bar-1"></span><span class="nh-bar nh-bar-2"></span><span class="nh-bar nh-bar-3"></span>';
      navRight.appendChild(btn);
    }

    // 3. Add Drawer to body
    let drawer = document.getElementById('navMobileDrawer');
    if (!drawer) {
      drawer = document.createElement('div');
      drawer.id = 'navMobileDrawer';
      drawer.className = 'nav-mobile-drawer';
      drawer.setAttribute('aria-hidden', 'true');
      drawer.innerHTML = `
        <div class="nmd-backdrop" id="nmdBackdrop"></div>
        <div class="nmd-panel" id="nmdPanel">
          <div class="nmd-header">
            <a href="index.html" class="nmd-logo" aria-label="1928 Creative Studio">
              <img src="img/1928-logo.png" alt="1928 Creative Studio">
            </a>
            <button type="button" class="nmd-close-btn" id="nmdCloseBtn" aria-label="Close Navigation">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="nmd-body">
            <ul class="nmd-nav-list">
              <li>
                <a href="index.html" class="nmd-link" id="nmdLinkHome">
                  <span class="nmd-link-inner"><span class="nmd-num">01</span>Home</span>
                </a>
              </li>
              <li>
                <a href="about.html" class="nmd-link" id="nmdLinkAbout">
                  <span class="nmd-link-inner"><span class="nmd-num">02</span>About</span>
                </a>
              </li>
              <li>
                <a href="services.html" class="nmd-link nmd-submenu-toggle" id="nmdLinkServices">
                  <span class="nmd-link-inner"><span class="nmd-num">03</span>Services</span>
                  <svg class="nmd-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </a>
                <div class="nmd-submenu" id="nmdSubmenuServices">
                  <a href="service-logo-design.html" class="nmd-sublink"><span>01</span> Logo Design</a>
                  <a href="service-brand-identity.html" class="nmd-sublink"><span>02</span> Brand Identity</a>
                  <a href="service-website-development.html" class="nmd-sublink"><span>03</span> Website Development</a>
                  <a href="service-digital-marketing.html" class="nmd-sublink"><span>04</span> Digital Marketing</a>
                  <a href="service-content-creation.html" class="nmd-sublink"><span>05</span> Content Creation</a>
                </div>
              </li>
              <li>
                <a href="portfolio.html" class="nmd-link" id="nmdLinkWork">
                  <span class="nmd-link-inner"><span class="nmd-num">04</span>Work</span>
                </a>
              </li>
              <li>
                <a href="blogs.html" class="nmd-link" id="nmdLinkPerspectives">
                  <span class="nmd-link-inner"><span class="nmd-num">05</span>Perspectives</span>
                </a>
              </li>
              <li>
                <a href="contact.html" class="nmd-link" id="nmdLinkContact">
                  <span class="nmd-link-inner"><span class="nmd-num">06</span>Contact</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      `;
      document.body.appendChild(drawer);
    }

    // 4. Highlight active page link
    const currPath = window.location.pathname.toLowerCase();
    const currFile = currPath.substring(currPath.lastIndexOf('/') + 1) || 'index.html';
    const allLinks = drawer.querySelectorAll('.nmd-link, .nmd-sublink');
    allLinks.forEach(a => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      if (href === currFile || (currFile === '' && href === 'index.html')) {
        a.classList.add('active');
        if (a.classList.contains('nmd-sublink')) {
          const sub = document.getElementById('nmdSubmenuServices');
          const toggle = document.getElementById('nmdLinkServices');
          if (sub) sub.classList.add('is-open');
          if (toggle) toggle.classList.add('is-open');
        }
      }
    });

    // 5. Drawer open / close event listeners
    const hamburgerBtn = document.getElementById('navHamburgerBtn');
    const closeBtn = document.getElementById('nmdCloseBtn');
    const backdrop = document.getElementById('nmdBackdrop');

    function openDrawer() {
      if (hamburgerBtn) {
        const rect = hamburgerBtn.getBoundingClientRect();
        const originX = rect.left + rect.width / 2;
        const originY = rect.top + rect.height / 2;
        drawer.style.setProperty('--btn-x', `${originX}px`);
        drawer.style.setProperty('--btn-y', `${originY}px`);
        hamburgerBtn.classList.add('is-active');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
      }
      drawer.classList.remove('is-closing');
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      if (closeBtn) closeBtn.classList.add('is-closing');
      drawer.classList.add('is-closing');
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      if (hamburgerBtn) {
        hamburgerBtn.classList.remove('is-active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
      document.body.style.overflow = '';
      setTimeout(() => {
        drawer.classList.remove('is-closing');
        if (closeBtn) closeBtn.classList.remove('is-closing');
      }, 450);
    }

    if (hamburgerBtn) {
      hamburgerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (drawer.classList.contains('is-open')) closeDrawer();
        else openDrawer();
      });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);

    // Auto close drawer when tapping any link that navigates
    allLinks.forEach(a => {
      if (!a.classList.contains('nmd-submenu-toggle')) {
        a.addEventListener('click', () => {
          closeDrawer();
        });
      }
    });

    // Accordion submenu toggle
    const servicesToggle = document.getElementById('nmdLinkServices');
    const servicesSub = document.getElementById('nmdSubmenuServices');
    if (servicesToggle && servicesSub) {
      servicesToggle.addEventListener('click', (e) => {
        if (e.target.closest('.nmd-chevron') || e.target.closest('.nmd-link-inner')) {
          e.preventDefault();
          servicesSub.classList.toggle('is-open');
          servicesToggle.classList.toggle('is-open');
        }
      });
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        closeDrawer();
      }
    });
    // ── Global Footer WhatsApp Binding (Direct 8160931928 WhatsApp) ──
    function ensureFooterWhatsAppLinks() {
      const waUrl = 'https://wa.me/918160931928?text=Hello%201928%20Creative%20Studio%2C%20I%20would%20like%20to%20talk%20about%20a%20project.';
      const svgWhatsApp = '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
      document.querySelectorAll('.f-action-pill.cta-secondary, a.f-action-pill').forEach(pill => {
        const text = pill.textContent || '';
        if (text.includes('talk about your project') || pill.classList.contains('cta-secondary')) {
          pill.href = waUrl;
          pill.target = '_blank';
          pill.rel = 'noopener noreferrer';
          pill.setAttribute('aria-label', 'Chat on WhatsApp');
          const arrow = pill.querySelector('.f-action-arrow');
          if (arrow && !arrow.querySelector('svg path[d^="M17.472"]')) {
            arrow.setAttribute('aria-label', 'WhatsApp');
            arrow.innerHTML = svgWhatsApp;
          }
        }
      });
    }
    ensureFooterWhatsAppLinks();
    window.addEventListener('DOMContentLoaded', ensureFooterWhatsAppLinks);
    window.addEventListener('load', ensureFooterWhatsAppLinks);
    window.addEventListener('footerLoaded', ensureFooterWhatsAppLinks);

    function ensureFooterSocialPlacement() {
      document.querySelectorAll('#footer-driver').forEach(footer => {
        const descCol = footer.querySelector('.f-desc-col');
        const ctaCol = footer.querySelector('.f-cta-column');
        if (!descCol || !ctaCol) return;
        const existingDescSocial = descCol.querySelector('.f-social-circles');
        const ctaSocial = ctaCol.querySelector('.f-social-circles');
        if (!existingDescSocial && ctaSocial) {
          const clone = ctaSocial.cloneNode(true);
          const locTag = descCol.querySelector('.f-location-tag');
          if (locTag) {
            locTag.insertAdjacentElement('afterend', clone);
          } else {
            descCol.appendChild(clone);
          }
        }
      });
    }
    ensureFooterSocialPlacement();
    window.addEventListener('DOMContentLoaded', ensureFooterSocialPlacement);
    window.addEventListener('load', ensureFooterSocialPlacement);
    window.addEventListener('footerLoaded', ensureFooterSocialPlacement);

    function applyPhoneScrollbarPolicy() {
      if (window.innerWidth <= 768) {
        document.documentElement.classList.add('hide-scrollbar');
        document.body.classList.add('hide-scrollbar');
      }
    }
    applyPhoneScrollbarPolicy();
    window.addEventListener('resize', applyPhoneScrollbarPolicy, { passive: true });
    window.addEventListener('orientationchange', applyPhoneScrollbarPolicy, { passive: true });

    function triggerFooterAnimationSafety() {
      if (typeof window.initFooterAnimation === 'function') {
        window.initFooterAnimation();
      }
    }
    triggerFooterAnimationSafety();
    window.addEventListener('DOMContentLoaded', triggerFooterAnimationSafety);
    window.addEventListener('load', triggerFooterAnimationSafety);
    window.addEventListener('footerLoaded', triggerFooterAnimationSafety);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileResponsivenessSystem);
  } else {
    initMobileResponsivenessSystem();
  }

})();

