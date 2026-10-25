    // ── 4. PORTFOLIO ENGINE ──
    function renderProjectsGrid() {
      const grid = document.getElementById('projectsGrid');
      const search = (document.getElementById('searchProjectsInput').value || '').toLowerCase();
      const projects = window.CMSStore.getPortfolio();

      const filtered = projects.filter(p => (p.title || '').toLowerCase().includes(search) || (p.client || '').toLowerCase().includes(search));

      document.getElementById('statProjectsNum').textContent = projects.length;
      document.getElementById('badgeProjectsCount').textContent = projects.length;

      if (!filtered.length) {
        grid.innerHTML = `<div style="grid-column:1/-1;padding:48px;text-align:center;color:var(--ink-mid);">No projects found matching your search.</div>`;
        return;
      }

      grid.innerHTML = filtered.map(p => `
        <div class="cms-card" style="cursor:pointer;" onclick="editProject('${p.id}')">
          <div class="cms-card-media">
            <span class="cms-card-tag">${p.tagPill || p.categoryDisplay || 'CASE STUDY'}</span>
            <img src="${p.coverImage || 'assets/img/portfolio/port-chronos.jpg'}" alt="${p.title}" onerror="this.src='assets/img/portfolio/port-chronos.jpg';" />
          </div>
          <div class="cms-card-body">
            <div>
              <h3 class="cms-card-title">${p.title}</h3>
              <p class="cms-card-desc">${p.client} — ${p.summary || ''}</p>
            </div>
            <div class="cms-card-footer" onclick="event.stopPropagation();">
              <span class="cms-card-meta">${p.gridSpan || 'bento-compact'}</span>
              <div class="cms-card-btns">
                <button class="btn-action-secondary" style="padding:6px 12px;font-size:11px;" onclick="editProject('${p.id}')">Edit</button>
                <button class="btn-action-danger" onclick="deleteProject('${p.id}')">Delete</button>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }

    document.getElementById('searchProjectsInput').addEventListener('input', renderProjectsGrid);

    let currentGalleryImages = [];

    function renderGalleryReorderList() {
      const container = document.getElementById('projectGalleryReorderList');
      if (!container) return;

      while (currentGalleryImages.length < 6) {
        currentGalleryImages.push('assets/img/portfolio/port-chronos.jpg');
      }
      currentGalleryImages = currentGalleryImages.slice(0, 6);

      container.innerHTML = currentGalleryImages.map((imgUrl, idx) => `
        <div class="gallery-drag-item" draggable="true" data-index="${idx}">
          <div class="gallery-drag-handle" title="Drag to reorder showcase">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="9" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>
          </div>
          <span class="gallery-order-badge">0${idx + 1}</span>
          <div class="gallery-thumb-wrap">
            <img src="${imgUrl || 'assets/img/portfolio/port-chronos.jpg'}" alt="Gallery ${idx + 1}" id="galThumb_${idx}" onerror="this.src='assets/img/portfolio/port-chronos.jpg';" />
          </div>
          <div class="gallery-input-wrap">
            <input type="text" class="form-input" style="height:38px;padding:6px 12px;font-size:12px;" value="${imgUrl || ''}" placeholder="e.g. assets/img/portfolio/port-chronos.jpg" oninput="updateGalleryThumb(${idx}, this.value)" />
            <label class="btn-action-secondary" style="padding:7px 12px;font-size:11px;margin:0;cursor:pointer;flex-shrink:0;height:38px;display:inline-flex;align-items:center;">
              <span>Upload</span>
              <input type="file" accept="image/*" style="display:none;" onchange="uploadGalleryFile(${idx}, event)" />
            </label>
          </div>
          <div class="gallery-btn-group">
            <button type="button" class="gallery-icon-btn" onclick="moveGalleryItem(${idx}, -1)" title="Move Up" ${idx === 0 ? 'disabled style="opacity:0.25;cursor:not-allowed;"' : ''}>▲</button>
            <button type="button" class="gallery-icon-btn" onclick="moveGalleryItem(${idx}, 1)" title="Move Down" ${idx === 5 ? 'disabled style="opacity:0.25;cursor:not-allowed;"' : ''}>▼</button>
            <button type="button" class="gallery-icon-btn btn-delete" onclick="clearGalleryItem(${idx})" title="Reset image">✕</button>
          </div>
        </div>
      `).join('');

      initGalleryDragAndDrop();
    }

    function updateGalleryThumb(idx, val) {
      currentGalleryImages[idx] = val.trim();
      const thumb = document.getElementById(`galThumb_${idx}`);
      if (thumb) thumb.src = val.trim() || 'assets/img/portfolio/port-chronos.jpg';
    }

    function moveGalleryItem(idx, direction) {
      const targetIdx = idx + direction;
      if (targetIdx < 0 || targetIdx >= currentGalleryImages.length) return;
      const temp = currentGalleryImages[idx];
      currentGalleryImages[idx] = currentGalleryImages[targetIdx];
      currentGalleryImages[targetIdx] = temp;
      renderGalleryReorderList();
    }

    function clearGalleryItem(idx) {
      const prev = currentGalleryImages[idx];
      if (prev && !prev.includes('port-chronos.jpg')) {
        fetch('api.php?action=delete_asset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filePath: prev })
        }).catch(() => {});
      }
      currentGalleryImages[idx] = 'assets/img/portfolio/port-chronos.jpg';
      renderGalleryReorderList();
    }

    async function uploadGalleryFile(idx, event) {
      const file = event.target.files[0];
      if (!file) return;
      const previousImage = currentGalleryImages[idx];
      showToast(`Uploading Image 0${idx + 1}...`, 'info');

      try {
        const formData = new FormData();
        formData.append('file', file);
        if (previousImage && !previousImage.includes('port-chronos.jpg')) {
          formData.append('previousImage', previousImage);
        }
        const res = await fetch('api.php?action=upload_asset', { method: 'POST', body: formData });
        const data = await res.json();
        if (data && data.status === 'success' && data.filePath) {
          currentGalleryImages[idx] = data.filePath;
          renderGalleryReorderList();
          showToast(`✅ Image 0${idx + 1} updated and previous image removed!`);
          return;
        }
      } catch (err) {}

      const reader = new FileReader();
      reader.onload = (e) => {
        currentGalleryImages[idx] = e.target.result;
        renderGalleryReorderList();
        showToast(`Image 0${idx + 1} updated.`);
      };
      reader.readAsDataURL(file);
    }

    function initGalleryDragAndDrop() {
      const container = document.getElementById('projectGalleryReorderList');
      if (!container) return;
      const items = container.querySelectorAll('.gallery-drag-item');
      let draggedIdx = null;

      items.forEach(item => {
        item.addEventListener('dragstart', (e) => {
          draggedIdx = parseInt(item.getAttribute('data-index'));
          item.classList.add('dragging');
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', draggedIdx);
        });

        item.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          item.classList.add('drag-over');
        });

        item.addEventListener('dragleave', () => {
          item.classList.remove('drag-over');
        });

        item.addEventListener('drop', (e) => {
          e.preventDefault();
          item.classList.remove('drag-over');
          const targetIdx = parseInt(item.getAttribute('data-index'));
          if (draggedIdx !== null && draggedIdx !== targetIdx && !isNaN(targetIdx)) {
            const movedItem = currentGalleryImages.splice(draggedIdx, 1)[0];
            currentGalleryImages.splice(targetIdx, 0, movedItem);
            renderGalleryReorderList();
            showToast(`Reordered gallery images.`);
          }
        });

        item.addEventListener('dragend', () => {
          item.classList.remove('dragging');
          items.forEach(it => it.classList.remove('drag-over'));
          draggedIdx = null;
        });
      });
    }

    function getGalleryImagesFromUI() {
      const container = document.getElementById('projectGalleryReorderList');
      if (!container) return currentGalleryImages;
      const inputs = container.querySelectorAll('.gallery-input-wrap input');
      const res = [];
      inputs.forEach(inp => {
        if (inp.value.trim()) res.push(inp.value.trim());
      });
      return res.length ? res : currentGalleryImages;
    }

    function openProjectModal(pData = null) {
      document.getElementById('projectModalTitle').textContent = pData ? 'Edit Portfolio Item' : 'Add New Portfolio Item';
      document.getElementById('projectIdInput').value = pData ? pData.id : '';
      document.getElementById('projectTitleInput').value = pData ? pData.title : '';
      document.getElementById('projectCategoryDisplayInput').value = pData ? (pData.subheading || pData.categoryDisplay || '') : '';
      document.getElementById('projectTagPillInput').value = pData ? (pData.tagPill || '') : '';
      document.getElementById('projectClientInput').value = pData ? (pData.client || '') : '';
      document.getElementById('projectSectorInput').value = pData ? (pData.sector || '') : '';
      document.getElementById('projectDeliverablesInput').value = pData ? (pData.deliverables || '') : '';
      document.getElementById('projectTimelineInput').value = pData ? (pData.timeline || (pData.year ? `${pData.year} · Complete Archive` : '2025 · Global Reveal')) : '';
      document.getElementById('projectCategoryKeysInput').value = pData ? (pData.category || '') : 'brand-identity';
      
      const coverVal = pData ? (pData.bannerImage || pData.coverImage || 'assets/img/portfolio/port-chronos.jpg') : 'assets/img/portfolio/port-chronos.jpg';
      document.getElementById('projectCoverInput').value = coverVal;
      if (projectUploader) projectUploader.refreshUI();

      // Overview Heading & Narrative Description
      document.getElementById('projectOverviewTitleInput').value = pData ? (pData.overviewTitle || pData.strategicOverviewTitle || 'Strategic Overview') : 'Strategic Overview';

      const rawOverview = pData ? (pData.overview || pData.strategicOverview || pData.description || pData.summary || '') : '';
      let defaultOverview = '';
      if (pData && pData.id && window.DEFAULT_1928_DATA && window.DEFAULT_1928_DATA.portfolio) {
        const dItem = window.DEFAULT_1928_DATA.portfolio.find(x => x.id === pData.id);
        if (dItem) defaultOverview = dItem.overview || dItem.strategicOverview || dItem.description || dItem.summary || '';
      }
      document.getElementById('projectOverviewInput').value = rawOverview || defaultOverview || '';

      // Set up 6 gallery images
      if (pData && pData.galleryImages && Array.isArray(pData.galleryImages) && pData.galleryImages.length) {
        currentGalleryImages = [...pData.galleryImages];
      } else if (pData && pData.id) {
        const fallbacks = {
          aurora: ['assets/img/portfolio/port-chronos.jpg', 'assets/img/portfolio/port-spectra.jpg', 'assets/img/portfolio/port-lumina.jpg', 'assets/img/why-choose/wc-l1.jpg', 'assets/img/why-choose/wc-r1.jpg', 'assets/img/portfolio/port-veloce.jpg'],
          vertex: ['assets/img/portfolio/port-spectra.jpg', 'assets/img/why-choose/wc-l1.jpg', 'assets/img/why-choose/wc-r1.jpg', 'assets/img/portfolio/port-lumina.jpg', 'assets/img/why-choose/wc-r2.jpg', 'assets/img/portfolio/port-chronos.jpg'],
          solstice: ['assets/img/portfolio/port-lumina.jpg', 'assets/img/portfolio/port-chronos.jpg', 'assets/services/svc_3.jpg', 'assets/img/why-choose/wc-l2.jpg', 'assets/services/svc_1.jpg', 'assets/img/why-choose/wc-r1.jpg'],
          veloce: ['assets/img/portfolio/port-veloce.jpg', 'assets/img/portfolio/port-kroma.jpg', 'assets/img/why-choose/wc-r2.jpg', 'assets/img/portfolio/port-zenith.jpg', 'assets/img/why-choose/wc-top.jpg', 'assets/services/svc_4.jpg'],
          aetherion: ['assets/img/portfolio/port-veloce.jpg', 'assets/img/portfolio/port-kroma.jpg', 'assets/img/why-choose/wc-r2.jpg', 'assets/img/portfolio/port-zenith.jpg', 'assets/img/why-choose/wc-top.jpg', 'assets/services/svc_4.jpg'],
          quantum: ['assets/img/portfolio/port-kroma.jpg', 'assets/img/portfolio/port-veloce.jpg', 'assets/img/why-choose/wc-top.jpg', 'assets/services/svc_5.jpg', 'assets/img/why-choose/wc-r1.jpg', 'assets/img/why-choose/wc-l2.jpg'],
          milan: ['assets/img/portfolio/port-zenith.jpg', 'assets/services/svc_4.jpg', 'assets/img/why-choose/wc-bot.jpg', 'assets/services/svc_1.jpg', 'assets/services/svc_2.jpg', 'assets/img/why-choose/wc-r2.jpg'],
          lofy: ['assets/services/svc_1.jpg', 'assets/services/svc_3.jpg', 'assets/services/svc_2.jpg', 'assets/img/why-choose/wc-l1.jpg', 'assets/services/svc_5.jpg', 'assets/img/portfolio/port-spectra.jpg'],
          stregis: ['assets/services/svc_2.jpg', 'assets/services/svc_5.jpg', 'assets/img/portfolio/port-lumina.jpg', 'assets/img/why-choose/wc-r1.jpg', 'assets/services/svc_3.jpg', 'assets/services/svc_1.jpg']
        };
        currentGalleryImages = fallbacks[pData.id] || [
          pData.coverImage || 'assets/img/portfolio/port-chronos.jpg',
          'assets/img/portfolio/port-spectra.jpg',
          'assets/img/portfolio/port-lumina.jpg',
          'assets/img/why-choose/wc-l1.jpg',
          'assets/img/why-choose/wc-r1.jpg',
          'assets/img/portfolio/port-veloce.jpg'
        ];
      } else {
        currentGalleryImages = [
          'assets/img/portfolio/port-chronos.jpg',
          'assets/img/portfolio/port-spectra.jpg',
          'assets/img/portfolio/port-lumina.jpg',
          'assets/img/why-choose/wc-l1.jpg',
          'assets/img/why-choose/wc-r1.jpg',
          'assets/img/portfolio/port-veloce.jpg'
        ];
      }
      renderGalleryReorderList();

      document.getElementById('projectModal').classList.add('active');
    }

    function editProject(id) {
      const proj = window.CMSStore.getProjectById(id) || (window.CMSStore.getPortfolioById ? window.CMSStore.getPortfolioById(id) : null);
      if (proj) openProjectModal(proj);
    }

    function deleteProject(id) {
      if (confirm('Are you sure you want to delete this case study?')) {
        const proj = window.CMSStore.getProjectById(id) || (window.CMSStore.getPortfolioById ? window.CMSStore.getPortfolioById(id) : null);
        if (proj) {
          if (proj.coverImage && !proj.coverImage.includes('port-chronos.jpg')) {
            fetch('api.php?action=delete_asset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filePath: proj.coverImage }) }).catch(() => {});
          }
          if (proj.bannerImage && proj.bannerImage !== proj.coverImage && !proj.bannerImage.includes('port-chronos.jpg')) {
            fetch('api.php?action=delete_asset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filePath: proj.bannerImage }) }).catch(() => {});
          }
        }
        window.CMSStore.deleteProject(id);
        renderProjectsGrid();
        showToast('Portfolio item deleted.');
      }
    }

    function switchPortfolioSubnav(subpaneId) {
      document.querySelectorAll('#portfolioSubnavTabs .subnav-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-subpane') === subpaneId);
      });
      const gridPane = document.getElementById('portfolioSubpaneGrid');
      const heroPane = document.getElementById('portfolioSubpaneHero');
      if (gridPane) gridPane.style.display = (subpaneId === 'portfolioSubpaneGrid') ? 'block' : 'none';
      if (heroPane) heroPane.style.display = (subpaneId === 'portfolioSubpaneHero') ? 'block' : 'none';
      if (subpaneId === 'portfolioSubpaneHero') {
        loadPortfolioHeroForm();
      }
    }

    function updateHeroPillCardPreview(pillNum, proj) {
      if (!proj) return;
      const thumb = document.getElementById(`heroPill${pillNum}CardThumb`);
      const title = document.getElementById(`heroPill${pillNum}CardTitle`);
      const client = document.getElementById(`heroPill${pillNum}CardClient`);
      const simImg = document.getElementById(`heroSimPill${pillNum}Img`);
      const simLabel = document.getElementById(`heroSimPill${pillNum}Label`);
      const img = proj.bannerImage || proj.coverImage || 'assets/img/portfolio/port-chronos.jpg';

      if (thumb) thumb.src = img;
      if (title) title.textContent = proj.title || 'Case Study';
      if (client) client.textContent = proj.client || proj.categoryDisplay || 'Brand Architecture';
      if (simImg) simImg.src = img;
      if (simLabel) {
        const words = (proj.title || 'Case Study').split(' ');
        simLabel.textContent = words.slice(0, 2).join(' ');
      }
    }

    function loadPortfolioHeroForm() {
      if (!window.CMSStore || typeof window.CMSStore.getPortfolioHero !== 'function') return;
      const h = window.CMSStore.getPortfolioHero() || {};
      const projects = window.CMSStore.getPortfolio();
      if (!projects || !projects.length) return;

      const p1Id = h.pill1ProjectId || projects[0]?.id || 'vibee';
      const p2Id = h.pill2ProjectId || projects[1]?.id || 'infyli';

      const p1Proj = projects.find(p => p.id === p1Id) || projects[0];
      const p2Proj = projects.find(p => p.id === p2Id) || (projects[1] || projects[0]);

      function renderHeroPillOptions(pillNum, activeId) {
        const listEl = document.getElementById(`heroPill${pillNum}CustomOptionsList`);
        if (!listEl) return;
        listEl.innerHTML = projects.map(p => {
          const isActive = (p.id === activeId);
          const safeTitle = (p.title || '').replace(/'/g, "\\'");
          const clientLabel = p.client ? ` (${p.client})` : '';
          const displayLabel = `${p.title}${clientLabel}`.replace(/'/g, "\\'");
          const img = p.bannerImage || p.coverImage || 'assets/img/portfolio/port-chronos.jpg';
          const searchText = `${p.title} ${p.client || ''}`.toLowerCase();
          return `
            <div class="custom-dropdown-item ${isActive ? 'active' : ''}" data-value="${p.id}" data-search="${searchText}" onclick="selectHeroPillOption(${pillNum}, '${p.id}', '${displayLabel}')">
              <div style="display:flex;align-items:center;gap:9px;min-width:0;flex:1;">
                <img src="${img}" style="width:24px;height:24px;border-radius:5px;object-fit:cover;flex-shrink:0;border:1px solid var(--rule-m);" />
                <div style="min-width:0;flex:1;">
                  <div class="custom-dropdown-item-title" style="font-weight:700;font-size:12px;">${p.title}</div>
                  <div style="font-size:10px;color:var(--ink-dim);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.client || 'Case Study'}</div>
                </div>
              </div>
              <svg class="custom-dropdown-item-check" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
          `;
        }).join('');
      }

      renderHeroPillOptions(1, p1Proj.id);
      renderHeroPillOptions(2, p2Proj.id);

      setCustomDropdownValue('customDropdown_heroPill1', p1Proj.id, `${p1Proj.title}${p1Proj.client ? ' (' + p1Proj.client + ')' : ''}`);
      setCustomDropdownValue('customDropdown_heroPill2', p2Proj.id, `${p2Proj.title}${p2Proj.client ? ' (' + p2Proj.client + ')' : ''}`);

      updateHeroPillCardPreview(1, p1Proj);
      updateHeroPillCardPreview(2, p2Proj);
    }

    function selectHeroPillOption(pillNum, val, label) {
      selectGenericDropdownOption(`customDropdown_heroPill${pillNum}`, `heroPortfolioPill${pillNum}Select`, val, label);
      const proj = (window.CMSStore.getPortfolioById ? window.CMSStore.getPortfolioById(val) : null) || (window.CMSStore.getProjectById ? window.CMSStore.getProjectById(val) : null);
      if (proj) {
        updateHeroPillCardPreview(pillNum, proj);
      }
    }

    function filterHeroPillDropdown(pillNum, query) {
      const listEl = document.getElementById(`heroPill${pillNum}CustomOptionsList`);
      if (!listEl) return;
      const q = (query || '').toLowerCase().trim();
      listEl.querySelectorAll('.custom-dropdown-item').forEach(item => {
        const s = (item.dataset.search || '').toLowerCase();
        item.style.display = (!q || s.includes(q)) ? 'flex' : 'none';
      });
    }

    function savePortfolioHeroFromUI() {
      const sel1 = document.getElementById('heroPortfolioPill1Select');
      const sel2 = document.getElementById('heroPortfolioPill2Select');
      const p1Id = sel1?.value || 'aurora';
      const p2Id = sel2?.value || 'veloce';
      const proj1 = window.CMSStore.getPortfolioById(p1Id) || window.CMSStore.getProjectById(p1Id);
      const proj2 = window.CMSStore.getPortfolioById(p2Id) || window.CMSStore.getProjectById(p2Id);

      const heroData = {
        pill1ProjectId: p1Id,
        pill1Img: proj1 ? (proj1.bannerImage || proj1.coverImage || 'assets/img/portfolio/port-chronos.jpg') : 'assets/img/portfolio/port-chronos.jpg',
        pill2ProjectId: p2Id,
        pill2Img: proj2 ? (proj2.bannerImage || proj2.coverImage || 'assets/img/portfolio/port-veloce.jpg') : 'assets/img/portfolio/port-veloce.jpg'
      };
      window.CMSStore.savePortfolioHero(heroData);
      showToast('🎉 Hero media pills saved & synchronized with live website!');
    }

    function updateHomeSlotCardPreview(slotNum, proj) {
      if (!proj) return;
      const card = document.getElementById(`homeSlotCard_${slotNum}`);
      const thumb = document.getElementById(`homeSlotThumb_${slotNum}`);
      const cat = document.getElementById(`homeSlotCategory_${slotNum}`);
      const client = document.getElementById(`homeSlotClient_${slotNum}`);
      const title = document.getElementById(`homeSlotTitle_${slotNum}`);
      const img = proj.bannerImage || proj.coverImage || 'assets/img/portfolio/port-chronos.jpg';

      if (thumb) thumb.src = img;
      if (cat) cat.textContent = (proj.tagPill || proj.categoryDisplay || proj.category || 'CASE STUDY').toUpperCase();
      if (client) client.textContent = proj.client || '1928 Client';
      if (title) title.textContent = proj.title || 'Untitled Case Study';

      if (card) {
        card.classList.remove('slot-updated-pulse');
        void card.offsetWidth;
        card.classList.add('slot-updated-pulse');
      }
    }

    function loadHomeShowcaseForm() {
      if (!window.CMSStore || typeof window.CMSStore.getPortfolio !== 'function') return;
      const projects = window.CMSStore.getPortfolio();
      if (!projects || !projects.length) return;

      const selectedIds = (typeof window.CMSStore.getHomeSelectedProjects === 'function')
        ? window.CMSStore.getHomeSelectedProjects()
        : ['vibee', 'infyli', 'mudra-school', 'awards-plus', 'last-mile-analytics', 'alda'];

      for (let i = 1; i <= 6; i++) {
        const slotIndex = i - 1;
        const targetId = selectedIds[slotIndex] || projects[slotIndex]?.id || projects[0]?.id;
        const activeProj = projects.find(p => p.id === targetId) || projects[slotIndex % projects.length];

        const listEl = document.getElementById(`homeSlot${i}CustomOptionsList`);
        if (listEl) {
          listEl.innerHTML = projects.map(p => {
            const isActive = (p.id === activeProj.id);
            const safeTitle = (p.title || '').replace(/'/g, "\\'");
            const clientLabel = p.client ? ` (${p.client})` : '';
            const displayLabel = `${p.title}${clientLabel}`.replace(/'/g, "\\'");
            const img = p.bannerImage || p.coverImage || 'assets/img/portfolio/port-chronos.jpg';
            const searchText = `${p.title} ${p.client || ''}`.toLowerCase();
            return `
              <div class="custom-dropdown-item ${isActive ? 'active' : ''}" data-value="${p.id}" data-search="${searchText}" onclick="selectHomeSlotOption(${i}, '${p.id}', '${displayLabel}')">
                <div style="display:flex;align-items:center;gap:9px;min-width:0;flex:1;">
                  <img src="${img}" style="width:24px;height:24px;border-radius:5px;object-fit:cover;flex-shrink:0;border:1px solid var(--rule-m);" />
                  <div style="min-width:0;flex:1;">
                    <div class="custom-dropdown-item-title" style="font-weight:700;font-size:12px;">${p.title}</div>
                    <div style="font-size:10px;color:var(--ink-dim);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.client || 'Case Study'}</div>
                  </div>
                </div>
                <svg class="custom-dropdown-item-check" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
            `;
          }).join('');
        }

        setCustomDropdownValue(`customDropdown_homeSlot${i}`, activeProj.id, `${activeProj.title}${activeProj.client ? ' (' + activeProj.client + ')' : ''}`);
        updateHomeSlotCardPreview(i, activeProj);
      }
    }

    function selectHomeSlotOption(slotNum, val, label) {
      selectGenericDropdownOption(`customDropdown_homeSlot${slotNum}`, `homeSlot${slotNum}Select`, val, label);
      const proj = (window.CMSStore.getPortfolioById ? window.CMSStore.getPortfolioById(val) : null) || (window.CMSStore.getProjectById ? window.CMSStore.getProjectById(val) : null);
      if (proj) {
        updateHomeSlotCardPreview(slotNum, proj);
      }
    }

    function filterHomeSlotDropdown(slotNum, query) {
      const listEl = document.getElementById(`homeSlot${slotNum}CustomOptionsList`);
      if (!listEl) return;
      const q = (query || '').toLowerCase().trim();
      listEl.querySelectorAll('.custom-dropdown-item').forEach(item => {
        const s = (item.dataset.search || '').toLowerCase();
        item.style.display = (!q || s.includes(q)) ? 'flex' : 'none';
      });
    }

    function applyHomeShowcasePreset(presetType) {
      const projects = window.CMSStore.getPortfolio();
      if (!projects || !projects.length) return;

      const curatedIds = ['vibee', 'infyli', 'mudra-school', 'awards-plus', 'last-mile-analytics', 'alda'];
      let targetIds = [];

      if (presetType === 'latest') {
        targetIds = projects.slice(0, 6).map(p => p.id);
      } else if (presetType === 'curated') {
        targetIds = curatedIds;
      } else if (presetType === 'shuffle') {
        targetIds = [...projects].sort(() => 0.5 - Math.random()).slice(0, 6).map(p => p.id);
      } else {
        targetIds = curatedIds;
      }

      for (let i = 1; i <= 6; i++) {
        const slotIdx = i - 1;
        const targetId = targetIds[slotIdx] || projects[slotIdx % projects.length]?.id;
        const proj = projects.find(p => p.id === targetId) || projects[slotIdx % projects.length];
        if (proj) {
          const clientLabel = proj.client ? ` (${proj.client})` : '';
          const displayLabel = `${proj.title}${clientLabel}`;
          selectHomeSlotOption(i, proj.id, displayLabel);
        }
      }

      showToast(`⚡ Homepage showcase preset (${presetType.toUpperCase()}) applied! Click "Save Homepage Showcase" to publish live.`);
    }

    function saveHomeSelectedProjectsFromUI() {
      if (!window.CMSStore || typeof window.CMSStore.saveHomeSelectedProjects !== 'function') return;
      const selectedIds = [];
      for (let i = 1; i <= 6; i++) {
        const hiddenInput = document.getElementById(`homeSlot${i}Select`);
        selectedIds.push(hiddenInput ? hiddenInput.value : '');
      }
      window.CMSStore.saveHomeSelectedProjects(selectedIds);
      showToast('🎉 Homepage showcase (6 cards) saved & synchronized live with website!');
    }

    document.getElementById('projectForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('projectIdInput').value;
      const bannerImg = document.getElementById('projectCoverInput').value.trim() || 'assets/img/portfolio/port-chronos.jpg';
      const galleryList = getGalleryImagesFromUI();
      const overviewTitle = document.getElementById('projectOverviewTitleInput').value.trim() || 'Strategic Overview';
      const overviewText = document.getElementById('projectOverviewInput').value.trim();

      const data = {
        title: document.getElementById('projectTitleInput').value.trim(),
        subheading: document.getElementById('projectCategoryDisplayInput').value.trim(),
        categoryDisplay: document.getElementById('projectCategoryDisplayInput').value.trim(),
        tagPill: document.getElementById('projectTagPillInput').value.trim() || 'Case Study',
        category: document.getElementById('projectCategoryKeysInput').value.trim(),
        overviewTitle: overviewTitle,
        strategicOverviewTitle: overviewTitle,
        overview: overviewText,
        strategicOverview: overviewText,
        description: overviewText,
        summary: overviewText,
        client: document.getElementById('projectClientInput').value.trim(),
        sector: document.getElementById('projectSectorInput').value.trim(),
        deliverables: document.getElementById('projectDeliverablesInput').value.trim(),
        timeline: document.getElementById('projectTimelineInput').value.trim(),
        coverImage: bannerImg,
        bannerImage: bannerImg,
        galleryImages: galleryList
      };
      if (id) data.id = id;

      window.CMSStore.saveProject(data);
      closeModal('projectModal');
      renderProjectsGrid();
      loadPortfolioHeroForm();
      loadHomeShowcaseForm();
      showToast('🎉 Portfolio project saved & live website synchronized!');
    });
