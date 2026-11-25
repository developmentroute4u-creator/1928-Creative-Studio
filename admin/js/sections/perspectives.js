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
            <img src="${b.coverImage || 'assets/img/portfolio/port-chronos.jpg'}" alt="${b.title}" onerror="this.onerror=null; this.src='assets/img/portfolio/port-chronos.jpg';" />
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

    // ── Blog editor: contents list is automatic (built from the article's Headings) ──
    // Kept for compatibility with older code paths: refreshes the live contents preview.
    function autoDetectTOCFromContent() {
      updateEditorWordCount();
    }

    // ── "Suggested blogs" dropdowns (empty = Automatic: the website picks from the same category) ──
    function populateRelatedDropdowns(currentBlogId, selectedRel1, selectedRel2) {
      const allBlogs = window.CMSStore.getBlogs();
      const others = allBlogs.filter(b => b.id !== currentBlogId);

      ['blogRelated1', 'blogRelated2'].forEach((prefix, pIdx) => {
        const selectedId = (pIdx === 0 ? selectedRel1 : selectedRel2) || '';
        const input = document.getElementById(`${prefix}Input`);
        const valEl = document.getElementById(`${prefix}Val`);
        const list = document.getElementById(`${prefix}List`);
        const selectedBlog = allBlogs.find(b => b.id === selectedId);

        if (input) input.value = selectedBlog ? selectedId : '';
        if (valEl) valEl.textContent = selectedBlog ? selectedBlog.title : 'Automatic';

        if (list) {
          const autoItem = `
            <div class="custom-dropdown-item ${!selectedBlog ? 'active' : ''}" data-id="" data-title="${encodeURIComponent('Automatic')}" onclick="selectRelatedDropdownOption('${prefix}', '')">
              <span class="custom-dropdown-item-title">Automatic</span>
              <span class="custom-dropdown-item-tag">SAME CATEGORY</span>
              <svg class="custom-dropdown-item-check" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>`;
          list.innerHTML = autoItem + others.map(b => `
            <div class="custom-dropdown-item ${b.id === selectedId ? 'active' : ''}" data-id="${b.id}" data-title="${encodeURIComponent(b.title || '')}" onclick="selectRelatedDropdownOption('${prefix}', '${b.id}')">
              <span class="custom-dropdown-item-title">${b.title}</span>
              <span class="custom-dropdown-item-tag">${b.category || ''}</span>
              <svg class="custom-dropdown-item-check" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
          `).join('');
        }
      });
    }

    function selectRelatedDropdownOption(prefix, blogId) {
      const input = document.getElementById(`${prefix}Input`);
      if (input) input.value = blogId || '';

      const blog = blogId ? window.CMSStore.getBlogs().find(b => b.id === blogId) : null;
      const valEl = document.getElementById(`${prefix}Val`);
      if (valEl) valEl.textContent = blog ? blog.title : 'Automatic';

      const menu = document.getElementById(`${prefix}Menu`);
      if (menu) {
        menu.querySelectorAll('.custom-dropdown-item').forEach(item => {
          item.classList.toggle('active', (item.dataset.id || '') === (blogId || ''));
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
        item.style.display = (!q || title.includes(q) || tag.includes(q)) ? 'flex' : 'none';
      });
    }

    // ── Blog editor open / fill ──
    let currentEditingBlog = null;   // the blog as it was when the editor opened (null for a new blog)
    let blogSlugTouched = false;     // stop auto-filling the link once the user edits it

    function blogInitials(name) {
      return (name || '').trim().split(/\s+/).filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase() || '19';
    }

    function blogCurrentMonthText() {
      return new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase(); // e.g. NOV 2026
    }

    function setBlogSaveStatus(text, kind) {
      const el = document.getElementById('blogSaveStatus');
      if (!el) return;
      el.textContent = text || '';
      el.classList.toggle('is-error', kind === 'error');
      el.classList.toggle('is-ok', kind === 'ok');
    }

    function refreshAuthorAvatarPreview() {
      const avatar = document.getElementById('blogAuthorAvatarPreview');
      if (avatar) avatar.textContent = blogInitials(document.getElementById('blogAuthorInput').value);
    }

    function blogLiveUrl(slug) {
      const base = (typeof getLocalBaseUrl === 'function') ? getLocalBaseUrl() : window.location.origin;
      return `${base}/perspectives/${slug}`;
    }

    function openBlogModal(blogData = null) {
      currentEditingBlog = blogData ? { ...blogData } : null;
      blogSlugTouched = !!blogData;
      setBlogSaveStatus('');
      document.querySelectorAll('#blogModal .be-field.is-invalid').forEach(f => f.classList.remove('is-invalid'));

      document.getElementById('blogModalTitle').textContent = blogData ? 'Edit blog' : 'New blog';
      document.getElementById('blogIdInput').value = blogData ? blogData.id : '';
      document.getElementById('blogTitleInput').value = blogData ? (blogData.title || '') : '';
      document.getElementById('blogSlugInput').value = blogData ? (blogData.slug || '') : '';
      document.getElementById('blogExcerptInput').value = blogData ? (blogData.excerpt || '') : '';

      // Category suggestions come from the categories already used on the website
      const categories = Array.from(new Set(window.CMSStore.getBlogs().map(b => (b.category || '').trim()).filter(Boolean))).sort();
      const datalist = document.getElementById('blogCategoriesList');
      if (datalist) datalist.innerHTML = categories.map(c => `<option value="${c.replace(/"/g, '&quot;')}"></option>`).join('');
      document.getElementById('blogCategoryInput').value = blogData ? (blogData.category || '') : '';

      document.getElementById('blogDateInput').value = blogData ? (blogData.date || '') : blogCurrentMonthText();
      document.getElementById('blogCityInput').value = blogData ? (blogData.city || '') : '';

      document.getElementById('blogAuthorInput').value = blogData ? (blogData.author || '') : 'Jay Thaker';
      document.getElementById('blogRoleInput').value = blogData ? (blogData.role || '') : 'Studio Principal & Brand Architect';
      document.getElementById('blogBioInput').value = blogData ? (blogData.bio || '') : '';
      refreshAuthorAvatarPreview();

      // Images
      document.getElementById('blogCoverInput').value = blogData ? (blogData.coverImage || '') : '';
      if (blogUploader) blogUploader.refreshUI();
      document.getElementById('blogSpecimenInput').value = blogData ? (blogData.specimenImage || '') : '';
      if (blogSpecimenUploader) blogSpecimenUploader.refreshUI();
      // "More options" (page link, contents list, suggested blogs) stays closed until clicked
      const more = document.getElementById('blogMoreOptions');
      if (more) more.open = false;

      // Article
      const contentVal = blogData ? (blogData.content || blogData.contentHtml || '') : '';
      const visualEditor = document.getElementById('blogVisualEditor');
      const codeEditor = document.getElementById('blogContentInput');
      if (visualEditor) {
        visualEditor.innerHTML = contentVal || '';
        visualEditor.style.display = 'block';
      }
      if (codeEditor) {
        codeEditor.value = contentVal || '';
        codeEditor.style.display = 'none';
      }
      const toolbar = document.getElementById('blogEditorToolbar');
      if (toolbar) {
        toolbar.style.display = '';
        toolbar.querySelectorAll('.is-active, .is-on').forEach(b => b.classList.remove('is-active', 'is-on'));
      }
      const codeBtn = document.getElementById('btnToggleEditorCode');
      if (codeBtn) { codeBtn.classList.remove('active'); codeBtn.textContent = 'Edit as HTML'; }

      // Read time: empty means automatic (from the word count)
      const savedRT = blogData ? (blogData.readTime || '') : '';
      document.getElementById('blogReadTimeInput').value = savedRT;
      updateEditorWordCount();
      const autoRT = `${beAutoReadTime().minutes} MIN READ`;
      if (savedRT && savedRT.toUpperCase() === autoRT) document.getElementById('blogReadTimeInput').value = '';

      // Suggested blogs
      const rel1 = (blogData && Array.isArray(blogData.related)) ? blogData.related[0] : '';
      const rel2 = (blogData && Array.isArray(blogData.related)) ? blogData.related[1] : '';
      populateRelatedDropdowns(blogData ? blogData.id : '', rel1, rel2);

      // "View on website" for existing blogs
      const viewLink = document.getElementById('blogViewLiveLink');
      if (viewLink) {
        if (blogData && blogData.slug) { viewLink.href = blogLiveUrl(blogData.slug); viewLink.style.display = ''; }
        else viewLink.style.display = 'none';
      }

      document.getElementById('blogModal').classList.add('active');
      const body = document.querySelector('#blogModal .modal-body');
      if (body) body.scrollTop = 0;
      if (!blogData) setTimeout(() => document.getElementById('blogTitleInput').focus(), 50);
    }

    // Link follows the title for new blogs until the user edits the link themselves
    document.getElementById('blogTitleInput').addEventListener('input', (e) => {
      e.target.closest('.be-field')?.classList.remove('is-invalid');
      if (!blogSlugTouched) document.getElementById('blogSlugInput').value = beSlugify(e.target.value);
    });
    document.getElementById('blogSlugInput').addEventListener('input', () => { blogSlugTouched = true; });
    document.getElementById('blogSlugInput').addEventListener('blur', (e) => { e.target.value = beSlugify(e.target.value); });
    document.getElementById('blogAuthorInput').addEventListener('input', refreshAuthorAvatarPreview);
    // Once the person starts fixing things, clear the old "Please add…" message
    document.getElementById('blogForm').addEventListener('input', () => {
      const status = document.getElementById('blogSaveStatus');
      if (status && status.classList.contains('is-error')) setBlogSaveStatus('');
    });
    document.getElementById('blogExcerptInput').addEventListener('input', (e) => e.target.closest('.be-field')?.classList.remove('is-invalid'));

    function editBlog(id) {
      const blog = window.CMSStore.getBlogById(id);
      if (blog) openBlogModal(blog);
    }

    function deleteBlog(id) {
      const blog = window.CMSStore.getBlogById(id);
      if (!confirm(`Delete "${blog ? blog.title : 'this blog'}"? This cannot be undone.`)) return;
      if (blog) {
        if (blog.coverImage) fetch('api.php?action=delete_asset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filePath: blog.coverImage }) }).catch(() => {});
        if (blog.specimenImage) fetch('api.php?action=delete_asset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filePath: blog.specimenImage }) }).catch(() => {});
      }
      window.CMSStore.deleteBlog(id);
      renderBlogsGrid();
      showToast('Blog deleted.');
    }

    // ── Save ──
    let blogSaving = false;
    document.getElementById('blogForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      if (blogSaving) return;
      syncVisualEditorToInput();

      // Check the essentials
      const title = document.getElementById('blogTitleInput').value.trim();
      const excerpt = document.getElementById('blogExcerptInput').value.trim();
      const rawContent = document.getElementById('blogContentInput').value.trim();
      const problems = [];
      if (!title) { problems.push('a title'); document.getElementById('blogTitleInput').closest('.be-field').classList.add('is-invalid'); }
      if (!excerpt) { problems.push('a short summary'); document.getElementById('blogExcerptInput').closest('.be-field').classList.add('is-invalid'); }
      if (!rawContent.replace(/<[^>]*>/g, '').trim() && !/<img/i.test(rawContent)) problems.push('the article text');
      if (problems.length) {
        setBlogSaveStatus(`Please add ${problems.join(', ')}.`, 'error');
        document.querySelector('#blogModal .modal-body').scrollTop = 0;
        return;
      }

      const { html: contentWithIds, sections } = beHeadingsAndIds(rawContent);
      const id = document.getElementById('blogIdInput').value;
      const authorName = document.getElementById('blogAuthorInput').value.trim() || 'Jay Thaker';
      const readTimeInput = document.getElementById('blogReadTimeInput').value.trim();
      const related = [document.getElementById('blogRelated1Input').value.trim(), document.getElementById('blogRelated2Input').value.trim()].filter(Boolean);
      const wantedSlug = beSlugify(document.getElementById('blogSlugInput').value || title);

      const data = {
        title,
        category: (document.getElementById('blogCategoryInput').value.trim() || 'PERSPECTIVES').toUpperCase(),
        readTime: readTimeInput ? readTimeInput.toUpperCase() : `${beAutoReadTime().minutes} MIN READ`,
        date: document.getElementById('blogDateInput').value.trim().toUpperCase() || blogCurrentMonthText(),
        city: document.getElementById('blogCityInput').value.trim(),
        author: authorName,
        role: document.getElementById('blogRoleInput').value.trim(),
        initials: blogInitials(authorName),
        bio: document.getElementById('blogBioInput').value.trim(),
        coverImage: document.getElementById('blogCoverInput').value.trim() || 'assets/img/portfolio/port-chronos.jpg',
        specimenImage: document.getElementById('blogSpecimenInput').value.trim(),
        specimenCaption: (currentEditingBlog && currentEditingBlog.specimenCaption) || '',
        excerpt,
        content: contentWithIds,
        sections,
        related
      };
      if (id) data.id = id; else data.slug = wantedSlug;

      blogSaving = true;
      const saveBtn = document.getElementById('blogSaveBtn');
      if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Saving…'; }
      setBlogSaveStatus('Saving…');

      try {
        const result = await window.CMSStore.saveBlogChecked(data);
        if (!result || result.status !== 'success') {
          setBlogSaveStatus((result && result.message) || 'Could not save. Please try again.', 'error');
          return;
        }

        // Existing blog with a changed link: update it (the old link keeps redirecting)
        if (id && currentEditingBlog && wantedSlug && wantedSlug !== currentEditingBlog.slug) {
          const r = await window.CMSStore.updateBlogSlug(id, wantedSlug);
          if (!r || r.status !== 'success') {
            setBlogSaveStatus(`Saved, but the link was not changed: ${(r && r.message) || 'please try again.'}`, 'error');
            document.getElementById('blogSlugInput').value = currentEditingBlog.slug || '';
            // Show the link field so the problem is visible
            const more = document.getElementById('blogMoreOptions');
            if (more) more.open = true;
            document.getElementById('blogSlugInput').focus();
            renderBlogsGrid();
            return;
          }
        }

        closeModal('blogModal');
        renderBlogsGrid();
        populatePerspectivesCurationUI();
        showToast(id ? 'Blog saved. The changes are live.' : 'Blog published. It is now live on the website.');
      } finally {
        blogSaving = false;
        if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Save blog'; }
      }
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
          <img class="curation-preview-img" id="slotThumb_${section}_${slotIndex}" src="${currentBlog.coverImage || 'assets/img/portfolio/port-chronos.jpg'}" alt="${currentBlog.title || ''}" onerror="this.onerror=null; this.src='assets/img/portfolio/port-chronos.jpg';" />
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
        document.querySelectorAll('.dropdown-active').forEach(card => {
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
      document.querySelectorAll('.dropdown-active').forEach(card => card.classList.remove('dropdown-active'));
      
      if (!isOpen && el) {
        el.classList.add('open');
        let parent = el.parentElement;
        while (parent && parent !== document.body) {
          if (parent.classList.contains('hero-pill-card') ||
              parent.classList.contains('curation-slot-card') ||
              parent.classList.contains('hero-pill-selection-grid') ||
              parent.classList.contains('hero-sim-banner') ||
              parent.classList.contains('form-group') ||
              parent.id === 'homeShowcaseGrid') {
            parent.classList.add('dropdown-active');
          }
          parent = parent.parentElement;
        }
        const searchInput = el.querySelector('.custom-dropdown-search');
        if (searchInput) {
          searchInput.value = '';
          const match = containerId.match(/\d+/);
          if (match && containerId.includes('homeSlot') && typeof filterHomeSlotDropdown === 'function') {
            filterHomeSlotDropdown(parseInt(match[0], 10), '');
          } else if (match && containerId.includes('heroPill') && typeof filterHeroPillDropdown === 'function') {
            filterHeroPillDropdown(parseInt(match[0], 10), '');
          } else if (match && containerId.includes('serviceWork') && typeof filterServiceWorkDropdown === 'function') {
            filterServiceWorkDropdown(parseInt(match[0], 10), '');
          }
          setTimeout(() => searchInput.focus(), 60);
        }
      }
    }
    window.toggleGenericDropdown = toggleGenericDropdown;

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
        document.querySelectorAll('.dropdown-active').forEach(card => card.classList.remove('dropdown-active'));
      }
    }
    window.selectGenericDropdownOption = selectGenericDropdownOption;

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
    window.setCustomDropdownValue = setCustomDropdownValue;

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
