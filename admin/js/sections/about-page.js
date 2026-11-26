    // ── ABOUT PAGE: choose the 4 projects shown in "Work worth showing" ──
    // Cards 1–2 show first, cards 3–4 after scrolling (one by one on phones).
    // Saved as the setting "about_selected_projects" (no database changes needed).

    let aboutWorksDraft = [];      // project ids for cards 1–4, as currently chosen in the admin
    let aboutWorksDirty = false;   // true once something was changed and not saved yet

    function aboutWorksEscape(s) {
      return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function aboutWorksProjectImage(p) {
      return (p && (p.bannerImage || p.coverImage)) || 'assets/img/portfolio/port-chronos.jpg';
    }

    function aboutWorksLoadSaved() {
      aboutWorksDraft = window.CMSStore.getAboutSelectedProjects().map(p => p.id);
      aboutWorksDirty = false;
    }

    function aboutWorksUpdateSaveState() {
      const status = document.getElementById('aboutWorksStatus');
      const btn = document.getElementById('aboutWorksSaveBtn');
      if (status) {
        status.textContent = aboutWorksDirty ? 'Unsaved changes' : '';
        status.classList.toggle('is-dirty', aboutWorksDirty);
      }
      if (btn) btn.disabled = !aboutWorksDirty;
    }

    function renderAboutWorksView(reload) {
      const grid = document.getElementById('aboutWorksGrid');
      if (!grid || !window.CMSStore) return;
      if (reload || !aboutWorksDraft.length) aboutWorksLoadSaved();

      const all = window.CMSStore.getPortfolio();
      if (!all.length) {
        grid.innerHTML = '<div class="aw-empty">No projects yet. Add projects in <strong>Work &amp; Portfolio</strong> first.</div>';
        aboutWorksUpdateSaveState();
        return;
      }

      const check = '<svg class="custom-dropdown-item-check" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>';
      grid.innerHTML = [0, 1, 2, 3].map(i => {
        const n = i + 1;
        const p = all.find(x => x.id === aboutWorksDraft[i]) || {};
        const options = all.map(o => {
          const usedIn = aboutWorksDraft.indexOf(o.id);
          const tag = usedIn === i ? 'THIS CARD' : (usedIn >= 0 ? `IN CARD ${usedIn + 1}` : '');
          return `
            <div class="custom-dropdown-item ${usedIn === i ? 'active' : ''}" data-id="${aboutWorksEscape(o.id)}" data-title="${aboutWorksEscape((o.title || '').toLowerCase())}" onclick="selectAboutWork(${n}, this.dataset.id)">
              <span class="custom-dropdown-item-title">${aboutWorksEscape(o.title || o.id)}</span>
              ${tag ? `<span class="custom-dropdown-item-tag">${tag}</span>` : ''}
              ${check}
            </div>`;
        }).join('');
        return `
          <div class="aw-card">
            <div class="aw-card-head">
              <span class="aw-num">Card ${String(n).padStart(2, '0')}</span>
              <span class="aw-when">${n <= 2 ? 'Shown first' : 'After scrolling'}</span>
            </div>
            <div class="aw-thumb">
              <img src="${aboutWorksEscape(aboutWorksProjectImage(p))}" alt="" onerror="this.onerror=null; this.src='assets/img/portfolio/port-chronos.jpg';" />
            </div>
            <div class="aw-meta">
              <div class="aw-cat">${aboutWorksEscape(p.client || p.categoryDisplay || '')}</div>
              <div class="aw-title">${aboutWorksEscape(p.title || 'Choose a project')}</div>
            </div>
            <div class="custom-dropdown-container dropdown-down" id="aboutWorkDropdown_${n}">
              <button type="button" class="custom-dropdown-trigger" onclick="toggleGenericDropdown('aboutWorkDropdown_${n}', event)">
                <span class="custom-dropdown-val">Change project</span>
                <svg class="custom-dropdown-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <div class="custom-dropdown-menu">
                <div class="custom-dropdown-search-wrap" onclick="event.stopPropagation()">
                  <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  <input type="text" class="custom-dropdown-search" placeholder="Search projects..." oninput="filterAboutWorkDropdown(${n}, this.value)" onclick="event.stopPropagation()" />
                </div>
                <div class="custom-dropdown-list" id="aboutWorkList_${n}">${options}</div>
              </div>
            </div>
          </div>`;
      }).join('');
      aboutWorksUpdateSaveState();
    }

    // Picking a project that is already in another card swaps the two cards
    function selectAboutWork(cardNum, projectId) {
      const i = cardNum - 1;
      const other = aboutWorksDraft.indexOf(projectId);
      if (other === i) {
        const box = document.getElementById(`aboutWorkDropdown_${cardNum}`);
        if (box) box.classList.remove('open');
        return;
      }
      if (other >= 0) aboutWorksDraft[other] = aboutWorksDraft[i];
      aboutWorksDraft[i] = projectId;
      aboutWorksDirty = true;
      renderAboutWorksView();
      if (other >= 0) showToast(`Swapped with card ${other + 1}.`);
    }

    function filterAboutWorkDropdown(cardNum, query) {
      const list = document.getElementById(`aboutWorkList_${cardNum}`);
      if (!list) return;
      const q = (query || '').toLowerCase().trim();
      list.querySelectorAll('.custom-dropdown-item').forEach(item => {
        item.style.display = (!q || (item.dataset.title || '').includes(q)) ? 'flex' : 'none';
      });
    }

    async function saveAboutWorks() {
      if (!aboutWorksDirty) return;
      const btn = document.getElementById('aboutWorksSaveBtn');
      if (btn) { btn.disabled = true; btn.textContent = 'Saving...'; }
      const ok = await window.CMSStore.saveAboutSelectedProjects(aboutWorksDraft.slice(0, 4));
      if (btn) btn.textContent = 'Save';
      if (ok) {
        aboutWorksDirty = false;
        showToast('About page cards saved. The changes are live.');
      } else {
        showToast('Could not save. Please try again.', 'error');
      }
      aboutWorksUpdateSaveState();
    }

    function openAboutPagePreview() {
      const base = (typeof getLocalBaseUrl === 'function') ? getLocalBaseUrl() : window.location.origin;
      const slug = (window.CMSStore.getRoute && window.CMSStore.getRoute('about')) || 'about';
      window.open(`${base}/${slug}`, '_blank', 'noopener');
    }

    // Keep the cards up to date when projects change (unless there are unsaved picks)
    window.addEventListener('1928_cms_updated', () => {
      const panel = document.getElementById('view-about');
      if (panel && panel.classList.contains('active') && !aboutWorksDirty) renderAboutWorksView(true);
    });
