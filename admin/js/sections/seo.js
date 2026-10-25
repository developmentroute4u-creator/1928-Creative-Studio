    // ── 2. SEO ENGINE ──
    function loadSEOForm() {
      const pageKey = document.getElementById('seoPageSelector').value;
      const seo = window.CMSStore.getSEO(pageKey);

      const titleInput = document.getElementById('seoTitleInput');
      const descInput = document.getElementById('seoDescInput');
      const kwInput = document.getElementById('seoKeywordsInput');

      titleInput.value = seo.title || '';
      descInput.value = seo.description || '';
      kwInput.value = seo.keywords || '';

      updateSERPPreview();
    }

    function updateSERPPreview() {
      const title = document.getElementById('seoTitleInput').value || '1928 Creative Studio';
      const desc = document.getElementById('seoDescInput').value || 'Luxury brand architecture and digital systems.';
      const pageKey = document.getElementById('seoPageSelector').value;

      const urlMap = {
        home: '',
        about: 'about.html',
        services: 'services.html',
        service_logo_design: 'service-logo-design.html',
        service_brand_identity: 'service-brand-identity.html',
        service_website_development: 'service-website-development.html',
        service_digital_marketing: 'service-digital-marketing.html',
        service_content_creation: 'service-content-creation.html',
        portfolio: 'portfolio.html',
        blogs: 'blogs.html',
        contact: 'contact.html'
      };
      const pagePath = urlMap[pageKey] !== undefined ? urlMap[pageKey] : (pageKey + '.html');

      document.getElementById('serpPreviewTitle').textContent = title;
      document.getElementById('serpPreviewDesc').textContent = desc;
      document.getElementById('serpPreviewUrl').textContent = `https://1928creativestudio.com/${pagePath}`;

      document.getElementById('titleCharCount').textContent = title.length;
      document.getElementById('descCharCount').textContent = desc.length;
    }

    document.getElementById('seoTitleInput').addEventListener('input', updateSERPPreview);
    document.getElementById('seoDescInput').addEventListener('input', updateSERPPreview);

    document.getElementById('seoForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const pageKey = document.getElementById('seoPageSelector').value;
      window.CMSStore.updateSEO(pageKey, {
        title: document.getElementById('seoTitleInput').value.trim(),
        description: document.getElementById('seoDescInput').value.trim(),
        keywords: document.getElementById('seoKeywordsInput').value.trim()
      });
      showToast(`SEO settings for ${pageKey.toUpperCase()} saved successfully!`);
    });
