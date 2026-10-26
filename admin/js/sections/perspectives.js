    // ── 3. BLOGS / PERSPECTIVES ENGINE ──
    function renderBlogsGrid() {
      const grid = document.getElementById('blogsGrid');
      const search = (document.getElementById('searchBlogsInput').value || '').toLowerCase();
      const blogs = window.CMSStore.getBlogs();

      const filtered = blogs.filter(b => 
        (b.title || '').toLowerCase().includes(search) || 
        (b.category || '').toLowerCase().includes(search) ||
        (b.author || '').toLowerCase().includes(search) ||
        (b.city || '').toLowerCase().includes(search)
      );

      document.getElementById('statBlogsNum').textContent = blogs.length;
      document.getElementById('badgeBlogsCount').textContent = blogs.length;
      
      const countBadge = document.getElementById('searchBlogsCountBadge');
      if (countBadge) {
        countBadge.textContent = search ? `${filtered.length} of ${blogs.length} Articles` : `${blogs.length} Articles`;
      }

      if (!filtered.length) {
        grid.innerHTML = `<div style="grid-column:1/-1;padding:60px 24px;text-align:center;color:var(--ink-mid);background:var(--card-bg);border:1px solid var(--rule);border-radius:14px;">No perspectives found matching your search. Try adjusting the query.</div>`;
        return;
      }

      grid.innerHTML = filtered.map(b => `
        <div class="cms-card" style="cursor:pointer;" onclick="editBlog('${b.id}')">
          <div class="cms-card-media">
            <span class="cms-card-tag">${b.category || 'THEORY'}</span>
            <img src="${b.coverImage || 'assets/img/portfolio/port-chronos.jpg'}" alt="${b.title}" onerror="this.src='assets/img/portfolio/port-chronos.jpg';" />
          </div>
          <div class="cms-card-body">
            <div>
              <div class="cms-card-location-badge">${b.city ? b.city.toUpperCase() : 'STUDIO EDITORIAL'}</div>
              <h3 class="cms-card-title">${b.title}</h3>
              <p class="cms-card-desc">${b.excerpt || ''}</p>
            </div>
            <div class="cms-card-footer" onclick="event.stopPropagation();">
              <span class="cms-card-meta" title="${b.author || ''} · ${b.date || '2026'}">${b.author ? b.author + ' · ' : ''}${b.date || '2026'} · ${b.readTime || '5 MIN'}</span>
              <div class="cms-card-btns">
                <button class="btn-card-edit" onclick="editBlog('${b.id}')" title="Edit Perspective">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                  <span>Edit</span>
                </button>
                <button class="btn-card-delete" onclick="deleteBlog('${b.id}')" title="Delete Perspective">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }

    document.getElementById('searchBlogsInput').addEventListener('input', renderBlogsGrid);

    // ── Table of Contents (TOC) Dynamic Manager ──
    function addTOCRow(title = '', anchorId = '') {
      const container = document.getElementById('blogTOCRowsContainer');
      if (!container) return;
      const row = document.createElement('div');
      row.className = 'toc-editor-row';
      row.style.cssText = 'display:grid;grid-template-columns:minmax(0, 1fr) minmax(0, 1fr) 36px;gap:8px;align-items:center;background:var(--card-alt);padding:8px 10px;border:1px solid var(--rule);border-radius:6px;width:100%;box-sizing:border-box;';
      const cleanTitle = (title || '').replace(/"/g, '&quot;');
      const cleanAnchor = (anchorId || '').replace(/"/g, '&quot;');
      row.innerHTML = `
        <div style="min-width:0;width:100%;">
          <input type="text" class="form-input toc-title-input" placeholder="Section Title (e.g. 01. The Strategic Shift)" value="${cleanTitle}" style="font-size:12px;padding:7px 10px;width:100%;box-sizing:border-box;" />
        </div>
        <div style="min-width:0;width:100%;">
          <input type="text" class="form-input toc-anchor-input" placeholder="Anchor ID (e.g. sec-shift)" value="${cleanAnchor}" style="font-size:12px;padding:7px 10px;font-family:var(--font-mono);width:100%;box-sizing:border-box;" />
        </div>
        <button type="button" class="btn-icon-square" onclick="this.closest('.toc-editor-row').remove()" style="width:32px;height:32px;border-color:transparent;color:var(--cr);flex-shrink:0;" title="Remove Section Anchor">✕</button>
      `;
      container.appendChild(row);
    }

    function autoDetectTOCFromContent() {
      syncVisualEditorToInput();
      const html = document.getElementById('blogContentInput').value || '';
      const parser = new DOMParser();
      const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
      const headings = doc.querySelectorAll('h2, h3, [id^="sec-"]');
      
      const detected = [];
      headings.forEach((h, idx) => {
        const text = h.textContent.trim();
        if (!text) return;
        let anchorId = h.id || h.closest('[id]')?.id || '';
        if (!anchorId) {
          const cleanSlug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          anchorId = cleanSlug ? `sec-${cleanSlug}` : `sec-${idx + 1}`;
        }
        detected.push({ title: text, id: anchorId });
      });

      if (!detected.length) {
        showToast('No headings found in HTML content to detect.', 'info');
        return;
      }

      const container = document.getElementById('blogTOCRowsContainer');
      if (container) container.innerHTML = '';
      detected.forEach(d => addTOCRow(d.title, d.id));
      showToast(`⚡ Detected ${detected.length} sections from article HTML!`);
    }

    function getTOCRowsData() {
      const container = document.getElementById('blogTOCRowsContainer');
      if (!container) return [];
      const rows = container.querySelectorAll('.toc-editor-row');
      const result = [];
      rows.forEach((r, idx) => {
        const title = r.querySelector('.toc-title-input')?.value.trim() || '';
        let anchorId = r.querySelector('.toc-anchor-input')?.value.trim() || '';
        if (title) {
          if (!anchorId) {
            anchorId = `sec-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || (idx + 1)}`;
          }
          result.push({ id: anchorId, title: title });
        }
      });
      return result;
    }

    function setTOCRowsData(sections) {
      const container = document.getElementById('blogTOCRowsContainer');
      if (!container) return;
      container.innerHTML = '';
      if (Array.isArray(sections) && sections.length) {
        sections.forEach(s => {
          addTOCRow(s.title || s.name || '', s.id || s.target || '');
        });
      } else {
        addTOCRow('01. The Strategic Shift', 'sec-shift');
        addTOCRow('02. Mathematical Geometry', 'sec-geometry');
        addTOCRow('03. Strategic Takeaways', 'sec-takeaways');
      }
    }

    // ── Related Monographs Dropdowns Manager ──
    function populateRelatedDropdowns(currentBlogId, selectedRel1, selectedRel2) {
      const allBlogs = window.CMSStore.getBlogs();
      const filteredBlogs = allBlogs.filter(b => b.id !== currentBlogId);

      if (!selectedRel1 && filteredBlogs.length > 0) selectedRel1 = filteredBlogs[0].id;
      if (!selectedRel2 && filteredBlogs.length > 1) selectedRel2 = filteredBlogs[1].id;

      ['blogRelated1', 'blogRelated2'].forEach((prefix, pIdx) => {
        const selectedId = pIdx === 0 ? selectedRel1 : selectedRel2;
        const input = document.getElementById(`${prefix}Input`);
        const valEl = document.getElementById(`${prefix}Val`);
        const list = document.getElementById(`${prefix}List`);
        
        if (input) input.value = selectedId || '';
        
        const selectedBlog = allBlogs.find(b => b.id === selectedId);
        if (valEl) valEl.textContent = selectedBlog ? selectedBlog.title : 'Select Related Perspective...';

        if (list) {
          list.innerHTML = filteredBlogs.map(b => `
            <div class="custom-dropdown-item ${b.id === selectedId ? 'active' : ''}" data-id="${b.id}" data-title="${encodeURIComponent(b.title || '')}" onclick="selectRelatedDropdownOption('${prefix}', '${b.id}')">
              <span class="custom-dropdown-item-title">${b.title}</span>
              <span class="custom-dropdown-item-tag">${b.category || 'THEORY'}</span>
              <svg class="custom-dropdown-item-check" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
          `).join('');
        }
      });
    }

    function selectRelatedDropdownOption(prefix, blogId) {
      const input = document.getElementById(`${prefix}Input`);
      if (input) input.value = blogId;

      const allBlogs = window.CMSStore.getBlogs();
      const blog = allBlogs.find(b => b.id === blogId);
      const valEl = document.getElementById(`${prefix}Val`);
      if (valEl) valEl.textContent = blog ? blog.title : 'Select Related Perspective...';

      const menu = document.getElementById(`${prefix}Menu`);
      if (menu) {
        menu.querySelectorAll('.custom-dropdown-item').forEach(item => {
          item.classList.toggle('active', item.dataset.id === blogId);
        });
      }

      const container = document.getElementById(`${prefix}Dropdown`);
      if (container) container.classList.remove('open');
    }

    function filterRelatedDropdown(prefix, query) {
      const list = document.getElementById(`${prefix}List`);
      if (!list) return;
      const q = (query || '').toLowerCase().trim();
      list.querySelectorAll('.custom-dropdown-item').forEach(item => {
        const title = decodeURIComponent(item.dataset.title || '').toLowerCase();
        const tag = (item.querySelector('.custom-dropdown-item-tag')?.textContent || '').toLowerCase();
        if (!q || title.includes(q) || tag.includes(q)) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    }

    function openBlogModal(blogData = null) {
      document.getElementById('blogModalTitle').textContent = blogData ? 'Edit Perspective' : 'Add New Perspective';
      document.getElementById('blogIdInput').value = blogData ? blogData.id : '';
      document.getElementById('blogTitleInput').value = blogData ? blogData.title : '';
      document.getElementById('blogSlugInput').value = blogData ? (blogData.slug || '') : '';
      document.getElementById('blogCategoryInput').value = blogData ? blogData.category : 'TYPOGRAPHIC THEORY';
      document.getElementById('blogReadTimeInput').value = blogData ? (blogData.readTime || '') : '6 MIN READ';
      document.getElementById('blogDateInput').value = blogData ? (blogData.date || '') : 'SEP 2026';
      document.getElementById('blogCityInput').value = blogData ? (blogData.city || '') : 'Milan, Italy';
      
      const authorName = blogData ? (blogData.author || '') : 'Jay Thaker';
      document.getElementById('blogAuthorInput').value = authorName;
      document.getElementById('blogRoleInput').value = blogData ? (blogData.role || '') : 'Studio Principal & Brand Architect';
      
      let initials = blogData ? (blogData.initials || '') : '';
      if (!initials && authorName) {
        initials = authorName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
      }
      document.getElementById('blogInitialsInput').value = initials || 'JT';

      document.getElementById('blogBioInput').value = blogData ? (blogData.bio || '') : 'Founder & Principal Brand Strategist at 1928 Creative Studio. Advising luxury maisons and deep-tech founders on enduring visual systems.';

      // Cover Image
      const coverVal = blogData ? (blogData.coverImage || '') : 'assets/img/portfolio/port-chronos.jpg';
      document.getElementById('blogCoverInput').value = coverVal;
      if (blogUploader) blogUploader.refreshUI();

      // Specimen Asset Image & Caption
      const specimenVal = blogData ? (blogData.specimenImage || '') : '';
      document.getElementById('blogSpecimenInput').value = specimenVal;
      if (blogSpecimenUploader) blogSpecimenUploader.refreshUI();
      document.getElementById('blogSpecimenCaptionInput').value = blogData ? (blogData.specimenCaption || '') : '1928 EDITORIAL PROVENANCE CAPTURE';

      document.getElementById('blogExcerptInput').value = blogData ? (blogData.excerpt || '') : '';
      
      // Visual WYSIWYG Content Loader
      const contentVal = blogData ? (blogData.content || blogData.contentHtml || '') : '';
      const visualEditor = document.getElementById('blogVisualEditor');
      const codeEditor = document.getElementById('blogContentInput');
      if (visualEditor) {
        visualEditor.innerHTML = contentVal || '<p></p>';
        visualEditor.style.display = 'block';
      }
      if (codeEditor) {
        codeEditor.value = contentVal || '';
        codeEditor.style.display = 'none';
      }
      const codeBtn = document.getElementById('btnToggleEditorCode');
      if (codeBtn) codeBtn.classList.remove('active');
      updateEditorWordCount();

      // Table of Contents
      setTOCRowsData(blogData ? blogData.sections : null);

      // Related Monographs
      const rel1 = (blogData && Array.isArray(blogData.related)) ? blogData.related[0] : '';
      const rel2 = (blogData && Array.isArray(blogData.related)) ? blogData.related[1] : '';
      populateRelatedDropdowns(blogData ? blogData.id : '', rel1, rel2);

      document.getElementById('blogModal').classList.add('active');
    }

    function editBlog(id) {
      const blog = window.CMSStore.getBlogById(id);
      if (blog) openBlogModal(blog);
    }

    function deleteBlog(id) {
      if (confirm('Are you sure you want to delete this perspective?')) {
        const blog = window.CMSStore.getBlogById(id);
        if (blog) {
          if (blog.coverImage) fetch('api.php?action=delete_asset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filePath: blog.coverImage }) }).catch(() => {});
          if (blog.specimenImage) fetch('api.php?action=delete_asset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filePath: blog.specimenImage }) }).catch(() => {});
        }
        window.CMSStore.deleteBlog(id);
        renderBlogsGrid();
        showToast('Perspective deleted.');
      }
    }

    document.getElementById('blogForm').addEventListener('submit', (e) => {
      e.preventDefault();
      syncVisualEditorToInput();
      const id = document.getElementById('blogIdInput').value;
      const authorName = document.getElementById('blogAuthorInput').value.trim();
      let initials = document.getElementById('blogInitialsInput').value.trim();
      if (!initials && authorName) {
        initials = authorName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
      }

      const related1 = document.getElementById('blogRelated1Input').value.trim();
      const related2 = document.getElementById('blogRelated2Input').value.trim();
      const related = [related1, related2].filter(Boolean);

      const slugVal = document.getElementById('blogSlugInput').value.trim();
      const data = {
        title: document.getElementById('blogTitleInput').value.trim(),
        slug: slugVal ? slugVal.toLowerCase().replace(/[^a-z0-9\/-]+/g, '-').replace(/^\/+|\/+$/g, '') : undefined,
        category: document.getElementById('blogCategoryInput').value.trim(),
        readTime: document.getElementById('blogReadTimeInput').value.trim(),
        date: document.getElementById('blogDateInput').value.trim(),
        city: document.getElementById('blogCityInput').value.trim(),
        author: authorName,
        role: document.getElementById('blogRoleInput').value.trim(),
        initials: initials || '19',
        bio: document.getElementById('blogBioInput').value.trim(),
        coverImage: document.getElementById('blogCoverInput').value.trim() || 'assets/img/portfolio/port-chronos.jpg',
        specimenImage: document.getElementById('blogSpecimenInput').value.trim(),
        specimenCaption: document.getElementById('blogSpecimenCaptionInput').value.trim() || '1928 EDITORIAL PROVENANCE CAPTURE',
        excerpt: document.getElementById('blogExcerptInput').value.trim(),
        content: document.getElementById('blogContentInput').value.trim(),
        sections: getTOCRowsData(),
        related: related
      };
      if (id) data.id = id;

      window.CMSStore.saveBlog(data);
      closeModal('blogModal');
      renderBlogsGrid();
      populatePerspectivesCurationUI();
      showToast('🎉 Perspective, TOC, and Related Monographs successfully saved to MySQL database!');
    });

    // ── 3.1 PERSPECTIVES DEDICATED SECTIONS & CURATION CONTROLLER ──
    function switchPerspectivesSubTab(tabKey) {
      const tabs = [
        { id: 'master', btn: 'tabBtnAllPerspectives', pane: 'blogsSubpaneMaster' },
        { id: 'hero', btn: 'tabBtnHeroTicker', pane: 'blogsSubpaneHero' },
        { id: 'featured', btn: 'tabBtnFeaturedCarousel', pane: 'blogsSubpaneFeatured' },
        { id: 'codex', btn: 'tabBtnCodexReel', pane: 'blogsSubpaneCodex' }
      ];

      tabs.forEach(t => {
        const btnEl = document.getElementById(t.btn);
        const paneEl = document.getElementById(t.pane);
        if (btnEl) btnEl.classList.toggle('active', t.id === tabKey);
        if (paneEl) paneEl.classList.toggle('active', t.id === tabKey);
      });

      if (tabKey !== 'master') {
        populatePerspectivesCurationUI();
      }
    }

    function renderCurationSlotCard(section, slotIndex, currentId, allBlogs) {
      const currentBlog = allBlogs.find(b => b.id === currentId) || allBlogs[slotIndex % allBlogs.length] || allBlogs[0] || {};
      const slotNumFormatted = String(slotIndex + 1).padStart(2, '0');
      
      let slotLabel = '';
      if (section === 'hero') slotLabel = `Ticker Slot ${slotNumFormatted}`;
      else if (section === 'featured') slotLabel = `Spotlight Slide ${slotNumFormatted}`;
      else slotLabel = `Codex Block ${slotNumFormatted}`;

      const itemsHtml = allBlogs.map(b => `
        <div class="custom-dropdown-item ${b.id === currentBlog.id ? 'active' : ''}" data-id="${b.id}" data-title="${encodeURIComponent(b.title || '')}" onclick="selectCustomDropdownOption('${section}', ${slotIndex}, '${b.id}')">
          <span class="custom-dropdown-item-title">${b.title}</span>
          <span class="custom-dropdown-item-tag">${b.category || 'THEORY'}</span>
          <svg class="custom-dropdown-item-check" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
      `).join('');

      return `
        <div class="curation-slot-card" id="slotCard_${section}_${slotIndex}">
          <div class="curation-slot-header">
            <span class="curation-slot-num">${slotLabel}</span>
            <span id="slotCity_${section}_${slotIndex}" style="font-family:var(--font-mono);font-size:10px;color:var(--ink-mid);">${currentBlog.city || 'Editorial'}</span>
          </div>
          <img class="curation-preview-img" id="slotThumb_${section}_${slotIndex}" src="${currentBlog.coverImage || 'assets/img/portfolio/port-chronos.jpg'}" alt="${currentBlog.title || ''}" onerror="this.src='assets/img/portfolio/port-chronos.jpg';" />
          <div class="curation-preview-meta">
            <span id="slotCategory_${section}_${slotIndex}" style="color:var(--cr);font-weight:700;">${currentBlog.category || 'THEORY'}</span>
            <span id="slotDate_${section}_${slotIndex}">${currentBlog.date || '2026'} · ${currentBlog.readTime || '5 MIN'}</span>
          </div>
          <div class="curation-preview-title" id="slotTitle_${section}_${slotIndex}">${currentBlog.title || 'Untitled Perspective'}</div>
          
          <!-- Custom Themed Dropdown Component -->
          <div class="custom-dropdown-container" id="customDropdown_${section}_${slotIndex}">
            <button type="button" class="custom-dropdown-trigger" id="customDropdownTrigger_${section}_${slotIndex}" onclick="toggleCustomDropdown('${section}', ${slotIndex}, event)">
              <span class="custom-dropdown-val" id="customDropdownVal_${section}_${slotIndex}">${currentBlog.title || 'Untitled Perspective'}</span>
              <svg class="custom-dropdown-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <div class="custom-dropdown-menu" id="customDropdownMenu_${section}_${slotIndex}">
              <div class="custom-dropdown-search-wrap" onclick="event.stopPropagation()">
                <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" class="custom-dropdown-search" placeholder="Search monographs..." oninput="filterCustomDropdownOptions('${section}', ${slotIndex}, this.value)" onclick="event.stopPropagation()" />
              </div>
              <div class="custom-dropdown-list" id="customDropdownList_${section}_${slotIndex}">
                ${itemsHtml}
              </div>
            </div>
            <input type="hidden" id="slotSelect_${section}_${slotIndex}" value="${currentBlog.id || ''}" />
          </div>
        </div>
      `;
    }

    function toggleCustomDropdown(section, slotIndex, event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      const targetId = `customDropdown_${section}_${slotIndex}`;
      const targetEl = document.getElementById(targetId);
      const parentCard = document.getElementById(`slotCard_${section}_${slotIndex}`);
      const isOpen = targetEl && targetEl.classList.contains('open');

      // Close any other open dropdowns and reset card z-index
      document.querySelectorAll('.custom-dropdown-container.open').forEach(el => {
        el.classList.remove('open');
      });
      document.querySelectorAll('.curation-slot-card.dropdown-active').forEach(card => {
        card.classList.remove('dropdown-active');
      });

      if (!isOpen && targetEl) {
        targetEl.classList.add('open');
        if (parentCard) parentCard.classList.add('dropdown-active');
        const searchInput = targetEl.querySelector('.custom-dropdown-search');
        if (searchInput) {
          searchInput.value = '';
          filterCustomDropdownOptions(section, slotIndex, '');
          setTimeout(() => searchInput.focus(), 60);
        }
      }
    }

    function selectCustomDropdownOption(section, slotIndex, blogId) {
      const hiddenInput = document.getElementById(`slotSelect_${section}_${slotIndex}`);
      if (hiddenInput) {
        hiddenInput.value = blogId;
      }
      
      const allBlogs = window.CMSStore.getBlogs();
      const blog = allBlogs.find(b => b.id === blogId) || {};
      
      const valEl = document.getElementById(`customDropdownVal_${section}_${slotIndex}`);
      if (valEl) valEl.textContent = blog.title || 'Untitled Perspective';

      const menu = document.getElementById(`customDropdownMenu_${section}_${slotIndex}`);
      if (menu) {
        menu.querySelectorAll('.custom-dropdown-item').forEach(item => {
          item.classList.toggle('active', item.dataset.id === blogId);
        });
      }

      const targetEl = document.getElementById(`customDropdown_${section}_${slotIndex}`);
      if (targetEl) targetEl.classList.remove('open');
      const parentCard = document.getElementById(`slotCard_${section}_${slotIndex}`);
      if (parentCard) parentCard.classList.remove('dropdown-active');

      // Reset active preset buttons in that banner when manually editing a slot
      const subpane = document.getElementById(
        section === 'hero' ? 'blogsSubpaneHero' :
        section === 'featured' ? 'blogsSubpaneFeatured' : 'blogsSubpaneCodex'
      );
      if (subpane) {
        subpane.querySelectorAll('.btn-preset-pill').forEach(btn => btn.classList.remove('active'));
      }

      updateSlotPreview(section, slotIndex, blogId);
    }

    function filterCustomDropdownOptions(section, slotIndex, query) {
      const list = document.getElementById(`customDropdownList_${section}_${slotIndex}`);
      if (!list) return;
      const q = (query || '').toLowerCase().trim();
      list.querySelectorAll('.custom-dropdown-item').forEach(item => {
        const title = decodeURIComponent(item.dataset.title || '').toLowerCase();
        const tag = (item.querySelector('.custom-dropdown-item-tag')?.textContent || '').toLowerCase();
        if (!q || title.includes(q) || tag.includes(q)) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    }

    // Global listener to close open dropdowns when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.custom-dropdown-container')) {
        document.querySelectorAll('.custom-dropdown-container.open').forEach(el => {
          el.classList.remove('open');
        });
        document.querySelectorAll('.curation-slot-card.dropdown-active, .hero-pill-card.dropdown-active').forEach(card => {
          card.classList.remove('dropdown-active');
        });
      }
    });

    function toggleGenericDropdown(containerId, event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      const el = document.getElementById(containerId);
      const isOpen = el && el.classList.contains('open');
      document.querySelectorAll('.custom-dropdown-container.open').forEach(c => c.classList.remove('open'));
      document.querySelectorAll('.curation-slot-card.dropdown-active, .hero-pill-card.dropdown-active').forEach(card => card.classList.remove('dropdown-active'));
      
      if (!isOpen && el) {
        el.classList.add('open');
        const parentCard = el.closest('.curation-slot-card, .hero-pill-card');
        if (parentCard) parentCard.classList.add('dropdown-active');
        const searchInput = el.querySelector('.custom-dropdown-search');
        if (searchInput) {
          searchInput.value = '';
          const match = containerId.match(/\d+/);
          if (match && containerId.includes('homeSlot') && typeof filterHomeSlotDropdown === 'function') {
            filterHomeSlotDropdown(parseInt(match[0], 10), '');
          } else if (match && containerId.includes('heroPill') && typeof filterHeroPillDropdown === 'function') {
            filterHeroPillDropdown(parseInt(match[0], 10), '');
          }
          setTimeout(() => searchInput.focus(), 60);
        }
      }
    }

    function selectGenericDropdownOption(containerId, hiddenInputId, value, label) {
      const hiddenInput = document.getElementById(hiddenInputId);
      if (hiddenInput) {
        hiddenInput.value = value;
      }
      const container = document.getElementById(containerId);
      if (container) {
        const valEl = container.querySelector('.custom-dropdown-val');
        if (valEl) valEl.textContent = label || value;
        const menu = container.querySelector('.custom-dropdown-menu');
        if (menu) {
          menu.querySelectorAll('.custom-dropdown-item').forEach(item => {
            item.classList.toggle('active', item.dataset.value === String(value));
          });
        }
        container.classList.remove('open');
        const parentCard = container.closest('.curation-slot-card, .hero-pill-card');
        if (parentCard) parentCard.classList.remove('dropdown-active');
      }
    }

    function toggleCodexCountDropdown(event) {
      toggleGenericDropdown('customDropdown_codexCount', event);
    }

    function selectCodexCountOption(val, label) {
      selectGenericDropdownOption('customDropdown_codexCount', 'codexCountSelect', val, label);
      updateCodexSlotsCount();
    }

    function setCustomDropdownValue(containerId, value, label) {
      const container = document.getElementById(containerId);
      if (!container) return;
      const hiddenInput = container.querySelector('input[type="hidden"]');
      if (hiddenInput) hiddenInput.value = value;
      const valSpan = container.querySelector('.custom-dropdown-val');
      if (valSpan) valSpan.textContent = label || value;
      const menu = container.querySelector('.custom-dropdown-menu');
      if (menu) {
        menu.querySelectorAll('.custom-dropdown-item').forEach(item => {
          item.classList.toggle('active', item.dataset.value === String(value));
        });
      }
    }

    function updateSlotPreview(section, slotIndex, blogId) {
      const allBlogs = window.CMSStore.getBlogs();
      const blog = allBlogs.find(b => b.id === blogId) || {};
      
      const thumb = document.getElementById(`slotThumb_${section}_${slotIndex}`);
      const cat = document.getElementById(`slotCategory_${section}_${slotIndex}`);
      const dt = document.getElementById(`slotDate_${section}_${slotIndex}`);
      const ttl = document.getElementById(`slotTitle_${section}_${slotIndex}`);
      const city = document.getElementById(`slotCity_${section}_${slotIndex}`);
      const valEl = document.getElementById(`customDropdownVal_${section}_${slotIndex}`);
      const hiddenInput = document.getElementById(`slotSelect_${section}_${slotIndex}`);

      if (hiddenInput) hiddenInput.value = blog.id || blogId;
      if (thumb) thumb.src = blog.coverImage || 'assets/img/portfolio/port-chronos.jpg';
      if (cat) cat.textContent = blog.category || 'THEORY';
      if (dt) dt.textContent = `${blog.date || '2026'} · ${blog.readTime || '5 MIN'}`;
      if (ttl) ttl.textContent = blog.title || 'Untitled Perspective';
      if (city) city.textContent = blog.city || 'Editorial';
      if (valEl) valEl.textContent = blog.title || 'Untitled Perspective';

      const menu = document.getElementById(`customDropdownMenu_${section}_${slotIndex}`);
      if (menu) {
        menu.querySelectorAll('.custom-dropdown-item').forEach(item => {
          item.classList.toggle('active', item.dataset.id === blogId);
        });
      }

      // Add visual feedback pulse
      const card = document.getElementById(`slotCard_${section}_${slotIndex}`);
      if (card) {
        card.classList.remove('slot-updated-pulse');
        void card.offsetWidth;
        card.classList.add('slot-updated-pulse');
      }
    }

    function populatePerspectivesCurationUI() {
      const allBlogs = window.CMSStore.getBlogs();
      if (!allBlogs.length) return;

      const curation = window.CMSStore.getPerspectivesCuration ? window.CMSStore.getPerspectivesCuration() : {
        heroTickerIds: allBlogs.slice(0, 8).map(b => b.id),
        featuredCarouselIds: allBlogs.slice(0, 4).map(b => b.id),
        codexGridIds: allBlogs.slice(0, 6).map(b => b.id),
        codexCount: 6
      };

      // 1. Hero Ticker (8 Slots)
      const heroGrid = document.getElementById('heroSlotsGrid');
      if (heroGrid) {
        let heroHtml = '';
        for (let i = 0; i < 8; i++) {
          const slotId = (curation.heroTickerIds && curation.heroTickerIds[i]) ? curation.heroTickerIds[i] : (allBlogs[i % allBlogs.length]?.id || 'art-monogram');
          heroHtml += renderCurationSlotCard('hero', i, slotId, allBlogs);
        }
        heroGrid.innerHTML = heroHtml;
      }

      // 2. Featured Carousel (4 Slides)
      const featGrid = document.getElementById('featuredSlotsGrid');
      if (featGrid) {
        let featHtml = '';
        for (let i = 0; i < 4; i++) {
          const slotId = (curation.featuredCarouselIds && curation.featuredCarouselIds[i]) ? curation.featuredCarouselIds[i] : (allBlogs[i % allBlogs.length]?.id || 'art-monogram');
          featHtml += renderCurationSlotCard('featured', i, slotId, allBlogs);
        }
        featGrid.innerHTML = featHtml;
      }

      // 3. Editorial Codex Reel
      const codexCount = parseInt(curation.codexCount, 10) || 6;
      setCustomDropdownValue('customDropdown_codexCount', codexCount, codexCount === 6 ? '6 (Rec.)' : String(codexCount));

      const codexGrid = document.getElementById('codexSlotsGrid');
      if (codexGrid) {
        let codexHtml = '';
        for (let i = 0; i < codexCount; i++) {
          const slotId = (curation.codexGridIds && curation.codexGridIds[i]) ? curation.codexGridIds[i] : (allBlogs[i % allBlogs.length]?.id || 'art-spatial');
          codexHtml += renderCurationSlotCard('codex', i, slotId, allBlogs);
        }
        codexGrid.innerHTML = codexHtml;
      }
    }

    function updateCodexSlotsCount() {
      const allBlogs = window.CMSStore.getBlogs();
      const count = parseInt(document.getElementById('codexCountSelect').value, 10) || 6;
      const codexGrid = document.getElementById('codexSlotsGrid');
      if (!codexGrid || !allBlogs.length) return;

      const currentCuration = window.CMSStore.getPerspectivesCuration ? window.CMSStore.getPerspectivesCuration() : {};
      let codexHtml = '';
      for (let i = 0; i < count; i++) {
        const slotSelect = document.getElementById(`slotSelect_codex_${i}`);
        const slotId = slotSelect ? slotSelect.value : (currentCuration.codexGridIds?.[i] || allBlogs[i % allBlogs.length]?.id);
        codexHtml += renderCurationSlotCard('codex', i, slotId, allBlogs);
      }
      codexGrid.innerHTML = codexHtml;
    }

    function applyCurationPreset(section, presetType) {
      const allBlogs = window.CMSStore.getBlogs();
      if (!allBlogs.length) return;

      // Update active state on preset pill buttons
      const subpane = document.getElementById(
        section === 'hero' ? 'blogsSubpaneHero' :
        section === 'featured' ? 'blogsSubpaneFeatured' : 'blogsSubpaneCodex'
      );
      if (subpane) {
        subpane.querySelectorAll('.btn-preset-pill').forEach(btn => {
          const isMatch = btn.getAttribute('onclick')?.includes(`'${presetType}'`);
          btn.classList.toggle('active', !!isMatch);
        });
      }

      const curatedHeroIds = ['art-monogram', 'art-spatial', 'art-webgl', 'art-fluted', 'art-kinetic', 'art-quiet', 'art-monochrome', 'art-typographic-grid'];
      const curatedFeaturedIds = ['art-monogram', 'art-spatial', 'art-webgl', 'art-fluted'];
      const curatedCodexIds = ['art-spatial', 'art-webgl', 'art-fluted', 'art-kinetic', 'art-monochrome', 'art-quiet', 'art-typographic-grid', 'art-brutalist'];

      if (section === 'hero') {
        let selectedIds = [];
        if (presetType === 'latest') {
          selectedIds = allBlogs.slice(0, 8).map(b => b.id);
        } else if (presetType === 'curated') {
          selectedIds = curatedHeroIds;
        } else if (presetType === 'shuffle') {
          selectedIds = [...allBlogs].sort(() => 0.5 - Math.random()).slice(0, 8).map(b => b.id);
        } else {
          selectedIds = curatedHeroIds;
        }

        for (let i = 0; i < 8; i++) {
          const targetId = selectedIds[i] || allBlogs[i % allBlogs.length].id;
          updateSlotPreview('hero', i, targetId);
        }
        showToast(`Hero 8 slots preset (${presetType.toUpperCase()}) applied. Click "Save Hero Slots" to publish.`);
      } else if (section === 'featured') {
        let selectedIds = [];
        if (presetType === 'latest') {
          selectedIds = allBlogs.slice(0, 4).map(b => b.id);
        } else if (presetType === 'curated') {
          selectedIds = curatedFeaturedIds;
        } else if (presetType === 'shuffle') {
          selectedIds = [...allBlogs].sort(() => 0.5 - Math.random()).slice(0, 4).map(b => b.id);
        } else {
          selectedIds = curatedFeaturedIds;
        }

        for (let i = 0; i < 4; i++) {
          const targetId = selectedIds[i] || allBlogs[i % allBlogs.length].id;
          updateSlotPreview('featured', i, targetId);
        }
        showToast(`Featured 4 slides preset (${presetType.toUpperCase()}) applied. Click "Save Featured Slides" to publish.`);
      } else if (section === 'codex') {
        const count = parseInt(document.getElementById('codexCountSelect').value, 10) || 6;
        let selectedIds = [];
        if (presetType === 'latest') {
          selectedIds = allBlogs.slice(0, count).map(b => b.id);
        } else if (presetType === 'curated') {
          selectedIds = curatedCodexIds.slice(0, count);
        } else if (presetType === 'shuffle') {
          selectedIds = [...allBlogs].sort(() => 0.5 - Math.random()).slice(0, count).map(b => b.id);
        } else {
          selectedIds = curatedCodexIds.slice(0, count);
        }

        for (let i = 0; i < count; i++) {
          const targetId = selectedIds[i] || allBlogs[i % allBlogs.length].id;
          updateSlotPreview('codex', i, targetId);
        }
        showToast(`Editorial Codex ${count} blocks preset (${presetType.toUpperCase()}) applied. Click "Save Editorial Codex" to publish.`);
      }
    }

    function savePerspectivesCurationFromUI(section = 'all') {
      const allBlogs = window.CMSStore.getBlogs();
      const currentCuration = window.CMSStore.getPerspectivesCuration ? window.CMSStore.getPerspectivesCuration() : {};

      // Gather Hero IDs
      let heroIds = currentCuration.heroTickerIds || allBlogs.slice(0, 8).map(b => b.id);
      if (section === 'hero' || section === 'all') {
        heroIds = [];
        for (let i = 0; i < 8; i++) {
          const sel = document.getElementById(`slotSelect_hero_${i}`);
          if (sel && sel.value) heroIds.push(sel.value);
          else if (currentCuration.heroTickerIds && currentCuration.heroTickerIds[i]) heroIds.push(currentCuration.heroTickerIds[i]);
          else heroIds.push(allBlogs[i % allBlogs.length]?.id || 'art-monogram');
        }
      }

      // Gather Featured IDs
      let featIds = currentCuration.featuredCarouselIds || allBlogs.slice(0, 4).map(b => b.id);
      if (section === 'featured' || section === 'all') {
        featIds = [];
        for (let i = 0; i < 4; i++) {
          const sel = document.getElementById(`slotSelect_featured_${i}`);
          if (sel && sel.value) featIds.push(sel.value);
          else if (currentCuration.featuredCarouselIds && currentCuration.featuredCarouselIds[i]) featIds.push(currentCuration.featuredCarouselIds[i]);
          else featIds.push(allBlogs[i % allBlogs.length]?.id || 'art-monogram');
        }
      }

      // Gather Codex IDs & count
      const codexCount = parseInt(document.getElementById('codexCountSelect')?.value, 10) || currentCuration.codexCount || 6;
      let codexIds = currentCuration.codexGridIds || allBlogs.slice(0, codexCount).map(b => b.id);
      if (section === 'codex' || section === 'all') {
        codexIds = [];
        for (let i = 0; i < codexCount; i++) {
          const sel = document.getElementById(`slotSelect_codex_${i}`);
          if (sel && sel.value) codexIds.push(sel.value);
          else if (currentCuration.codexGridIds && currentCuration.codexGridIds[i]) codexIds.push(currentCuration.codexGridIds[i]);
          else codexIds.push(allBlogs[i % allBlogs.length]?.id || 'art-spatial');
        }
      }

      const newCuration = {
        heroTickerIds: heroIds,
        featuredCarouselIds: featIds,
        codexGridIds: codexIds,
        codexCount: codexCount
      };

      window.CMSStore.savePerspectivesCuration(newCuration);
      
      let sectionName = 'Perspectives layout';
      if (section === 'hero') sectionName = 'Hero Dispatch 8-slot selection';
      else if (section === 'featured') sectionName = 'Featured 4-monograph carousel';
      else if (section === 'codex') sectionName = `Editorial Codex (${codexCount} blocks)`;

      showToast(`🎉 ${sectionName} successfully saved & synced with live website!`);
    }
