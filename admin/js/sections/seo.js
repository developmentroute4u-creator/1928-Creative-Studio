    // ── 2. SEO & DYNAMIC ROUTE ENGINE ──
    const DEFAULT_SYSTEM_ROUTES = {
      home: { slug: '', label: 'Home Page', file: 'index.html', type: 'page' },
      about: { slug: 'about', label: 'About Page', file: 'about.html', type: 'page' },
      services: { slug: 'services', label: 'Main Services Page', file: 'services.html', type: 'page' },
      service_logo_design: { slug: 'logo-design', label: 'Service 01: Logo Design', file: 'service-logo-design.html', type: 'service' },
      service_brand_identity: { slug: 'brand-identity', label: 'Service 02: Brand Identity', file: 'service-brand-identity.html', type: 'service' },
      service_website_development: { slug: 'website-development', label: 'Service 03: Website Design & Dev', file: 'service-website-development.html', type: 'service' },
      service_digital_marketing: { slug: 'digital-marketing', label: 'Service 04: Digital Marketing', file: 'service-digital-marketing.html', type: 'service' },
      service_content_creation: { slug: 'content-creation', label: 'Service 05: Content Creation', file: 'service-content-creation.html', type: 'service' },
      portfolio: { slug: 'portfolio', label: 'Portfolio Page', file: 'portfolio.html', type: 'page' },
      blogs: { slug: 'perspectives', label: 'Perspectives Master Page', file: 'blogs.html', type: 'page' },
      contact: { slug: 'contact', label: 'Contact Page', file: 'contact.html', type: 'page' }
    };

    function getLocalBaseUrl() {
      const loc = window.location;
      if (loc.hostname === '1928.test') {
        return 'http://1928.test';
      }
      if (loc.pathname.includes('/1928/')) {
        return `${loc.origin}/1928`;
      }
      return loc.origin;
    }

    function loadSEOForm() {
      const pageKey = document.getElementById('seoPageSelector').value;
      const titleInput = document.getElementById('seoTitleInput');
      const descInput = document.getElementById('seoDescInput');
      const kwInput = document.getElementById('seoKeywordsInput');
      const slugInput = document.getElementById('seoSlugInput');
      const prefixEl = document.getElementById('seoRoutePrefix');
      const visitBtn = document.getElementById('btnVisitLiveSlug');

      if (pageKey.startsWith('blog_')) {
        const blogId = pageKey.replace('blog_', '');
        const blogs = window.CMSStore.getBlogs ? window.CMSStore.getBlogs() : [];
        const blog = blogs.find(b => b.id === blogId || b.blog_id === blogId) || {};

        titleInput.value = blog.title ? `${blog.title} · 1928 Perspectives` : '';
        descInput.value = blog.excerpt || (blog.content ? blog.content.replace(/<[^>]*>/g, '').slice(0, 160) : '');
        kwInput.value = blog.category || 'perspective, luxury architecture';
        slugInput.value = blog.slug || '';
        if (prefixEl) prefixEl.textContent = 'https://1928creativestudio.com/perspectives/';
      } else {
        const seo = window.CMSStore.getSEO(pageKey);
        const storedRoute = (window.CMSStore.getRoute ? window.CMSStore.getRoute(pageKey) : null) || seo.routeSlug || (DEFAULT_SYSTEM_ROUTES[pageKey]?.slug ?? '');

        let pageTitle = (seo && seo.title) ? seo.title : '';
        let pageDesc = (seo && seo.description) ? seo.description : '';
        let pageKw = (seo && seo.keywords) ? seo.keywords : '';

        if (pageKey === 'home' && !pageTitle) {
          pageTitle = '1928 Creative Studio · Independent Brand Engineering & Digital Architecture';
          pageDesc = pageDesc || '1928 Creative Studio sculpts iconic visual identities, immersive digital platforms, spatial environments, and transformative brand campaigns.';
          pageKw = pageKw || '1928 creative studio, brand architecture, luxury branding agency, high-end web design, digital experiences, ahmedabad branding studio';
        }

        titleInput.value = pageTitle;
        descInput.value = pageDesc;
        kwInput.value = pageKw;
        slugInput.value = storedRoute || '';
        if (prefixEl) prefixEl.textContent = 'https://1928creativestudio.com/';
      }

      updateSERPPreview();
    }

    function updateSERPPreview() {
      const pageKey = document.getElementById('seoPageSelector').value;
      const title = document.getElementById('seoTitleInput').value || '1928 Creative Studio';
      const desc = document.getElementById('seoDescInput').value || 'Luxury brand architecture and digital systems.';
      const slugVal = document.getElementById('seoSlugInput').value.trim();

      let livePath = '';
      if (pageKey.startsWith('blog_')) {
        livePath = slugVal ? `perspectives/${slugVal}` : 'perspectives';
      } else if (slugVal) {
        livePath = slugVal;
      } else if (pageKey === 'home') {
        livePath = '';
      } else {
        livePath = DEFAULT_SYSTEM_ROUTES[pageKey]?.slug || (pageKey + '.html');
      }

      document.getElementById('serpPreviewTitle').textContent = title;
      document.getElementById('serpPreviewDesc').textContent = desc;
      document.getElementById('serpPreviewUrl').textContent = `https://1928creativestudio.com/${livePath}`;

      document.getElementById('titleCharCount').textContent = title.length;
      document.getElementById('descCharCount').textContent = desc.length;

      // Update Live Visit Link
      const visitBtn = document.getElementById('btnVisitLiveSlug');
      if (visitBtn) {
        const localBase = getLocalBaseUrl();
        visitBtn.href = `${localBase}/${livePath}`;
      }
    }

    function renderRouteRegistry() {
      // Registry table removed per user design request
    }

    function populateBlogOptionsInDropdown() {
      const menu = document.getElementById('seoDropdownMenu');
      if (!menu) return;

      const blogs = window.CMSStore.getBlogs ? window.CMSStore.getBlogs() : [];
      if (!blogs.length) return;

      // Remove existing blog options if re-populating
      menu.querySelectorAll('.custom-option-blog').forEach(el => el.remove());

      // Add a clean visual divider
      let divider = menu.querySelector('.custom-option-divider');
      if (!divider) {
        divider = document.createElement('div');
        divider.className = 'custom-option-divider';
        divider.style.padding = '8px 14px 4px';
        divider.style.fontFamily = 'var(--font-mono)';
        divider.style.fontSize = '9px';
        divider.style.letterSpacing = '0.14em';
        divider.style.textTransform = 'uppercase';
        divider.style.color = 'var(--gold, #C9A96E)';
        divider.style.borderTop = '1px solid var(--rule, rgba(255,255,255,0.08))';
        divider.style.marginTop = '4px';
        divider.textContent = 'Perspectives / Blog Articles';
        menu.appendChild(divider);
      }

      blogs.forEach(b => {
        const opt = document.createElement('div');
        opt.className = 'custom-option custom-option-sub custom-option-blog';
        opt.setAttribute('data-value', `blog_${b.id || b.blog_id}`);
        
        const arrowSpan = document.createElement('span');
        arrowSpan.className = 'opt-sub-arrow';
        arrowSpan.innerHTML = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12"></line><polyline points="14 6 20 12 14 18"></polyline></svg>';

        const labelSpan = document.createElement('span');
        labelSpan.textContent = `Article: ${b.title}`;

        opt.appendChild(arrowSpan);
        opt.appendChild(labelSpan);

        opt.addEventListener('click', (e) => {
          e.stopPropagation();
          const val = opt.getAttribute('data-value');
          document.getElementById('seoPageSelector').value = val;
          document.getElementById('seoDropdownSelectedText').innerHTML = opt.innerHTML;

          menu.querySelectorAll('.custom-option').forEach(o => o.classList.remove('selected'));
          opt.classList.add('selected');
          document.getElementById('seoCustomDropdown').classList.remove('open');

          loadSEOForm();
        });
        menu.appendChild(opt);
      });
    }

    function selectSEOPage(pageKey) {
      const hiddenInput = document.getElementById('seoPageSelector');
      const selectedText = document.getElementById('seoDropdownSelectedText');
      const menu = document.getElementById('seoDropdownMenu');
      if (!hiddenInput || !menu) return;

      hiddenInput.value = pageKey;

      const opt = menu.querySelector(`.custom-option[data-value="${pageKey}"]`);
      if (opt) {
        menu.querySelectorAll('.custom-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        selectedText.innerHTML = opt.innerHTML;
      } else {
        selectedText.textContent = pageKey;
      }

      loadSEOForm();

      // Scroll smoothly to form
      const formGroup = document.getElementById('seoSlugFormGroup');
      if (formGroup) {
        formGroup.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    // Event Listeners for Live Inputs
    document.getElementById('seoTitleInput')?.addEventListener('input', updateSERPPreview);
    document.getElementById('seoDescInput')?.addEventListener('input', updateSERPPreview);
    document.getElementById('seoSlugInput')?.addEventListener('input', updateSERPPreview);

    // Copy Route URL Button
    document.getElementById('btnCopyLiveSlug')?.addEventListener('click', () => {
      const slugVal = document.getElementById('seoSlugInput').value.trim();
      const pageKey = document.getElementById('seoPageSelector').value;
      let fullUrl = '';
      if (pageKey.startsWith('blog_')) {
        fullUrl = `https://1928creativestudio.com/perspectives/${slugVal}`;
      } else {
        fullUrl = `https://1928creativestudio.com/${slugVal}`;
      }

      if (navigator.clipboard) {
        navigator.clipboard.writeText(fullUrl).then(() => {
          showToast(`Live URL copied: ${fullUrl}`);
        });
      } else {
        showToast(`URL: ${fullUrl}`);
      }
    });

    // Form Submit (Save SEO & URL Route)
    let isSavingSEO = false;
    async function handleSEOSubmit(e) {
      if (e) e.preventDefault();
      if (isSavingSEO) return;
      isSavingSEO = true;

      const saveBtn = document.getElementById('btnSaveSEO');
      const origBtnHtml = saveBtn ? saveBtn.innerHTML : '';
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.style.opacity = '0.7';
        saveBtn.style.pointerEvents = 'none';
      }

      try {
        const pageKey = document.getElementById('seoPageSelector').value;
        const title = document.getElementById('seoTitleInput').value.trim();
        const desc = document.getElementById('seoDescInput').value.trim();
        const keywords = document.getElementById('seoKeywordsInput').value.trim();
        let slug = document.getElementById('seoSlugInput').value.trim();

        // If the user removed the link, automatically default back to system standard slug
        if (!slug && DEFAULT_SYSTEM_ROUTES[pageKey] && pageKey !== 'home') {
          slug = DEFAULT_SYSTEM_ROUTES[pageKey].slug;
          document.getElementById('seoSlugInput').value = slug;
        }

        if (pageKey.startsWith('blog_')) {
          const blogId = pageKey.replace('blog_', '');
          await window.CMSStore.updateRoute(pageKey, slug, true, blogId);
          showToast(`Perspective route updated to '/perspectives/${slug}'!`);
        } else {
          await window.CMSStore.updateSEO(pageKey, {
            title,
            description: desc,
            keywords,
            route_slug: slug
          });
          await window.CMSStore.updateRoute(pageKey, slug);
          const displaySlug = slug ? `/${slug}` : '/';
          showToast(`SEO & Route '${displaySlug}' saved and synchronized successfully!`);
        }

        renderRouteRegistry();
        updateSERPPreview();
      } catch (err) {
        console.error('Error saving SEO:', err);
        showToast('Error saving SEO settings. Please try again.');
      } finally {
        isSavingSEO = false;
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.style.opacity = '';
          saveBtn.style.pointerEvents = '';
          saveBtn.innerHTML = origBtnHtml;
        }
      }
    }

    document.getElementById('seoForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSEOSubmit(e);
    });
    document.getElementById('btnSaveSEO')?.addEventListener('click', (e) => {
      e.preventDefault();
      handleSEOSubmit(e);
    });

    // Expose functions globally for admin router and core reactivity
    window.loadSEOForm = loadSEOForm;
    window.updateSERPPreview = updateSERPPreview;

    // Reactively refresh SEO form whenever MySQL data updates or reloads
    window.addEventListener('1928_cms_updated', () => {
      populateBlogOptionsInDropdown();
      loadSEOForm();
    });

    // Initial load when CMSStore is ready
    if (window.CMSStore && typeof window.CMSStore.ready === 'function') {
      window.CMSStore.ready().then(() => {
        populateBlogOptionsInDropdown();
        loadSEOForm();
        renderRouteRegistry();
      });
    } else {
      populateBlogOptionsInDropdown();
      loadSEOForm();
      renderRouteRegistry();
    }