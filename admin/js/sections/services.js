    // ── 6. CORE SERVICES & HOME PAGE SERVICES ENGINE ──
    function switchServicesSubTab(subTab) {
      const btnHome = document.getElementById('tabBtnHomeServices');
      const btnDedicated = document.getElementById('tabBtnDedicatedServices');
      const secHome = document.getElementById('sectionHomeServices');
      const secDedicated = document.getElementById('sectionDedicatedServices');
      const panelTitle = document.getElementById('servicesPanelTitle');
      const panelSub = document.getElementById('servicesPanelSub');
      const headerAction = document.getElementById('servicesHeaderAction');

      if (btnHome) btnHome.classList.remove('active');
      if (btnDedicated) btnDedicated.classList.remove('active');

      if (subTab === 'dedicated') {
        if (btnDedicated) btnDedicated.classList.add('active');
        if (panelTitle) panelTitle.textContent = 'Core Capability and Core Service';
        if (panelSub) panelSub.textContent = 'Manage studio offerings and disciplines for the dedicated services page.';
        if (headerAction) headerAction.style.display = 'flex';
        if (secHome) secHome.style.display = 'none';
        if (secDedicated) secDedicated.style.display = 'block';
      } else {
        if (btnHome) btnHome.classList.add('active');
        if (panelTitle) panelTitle.textContent = 'Home Page Services';
        if (panelSub) panelSub.textContent = 'Manage studio offerings for the interactive Home Page showcase.';
        if (headerAction) headerAction.style.display = 'none';
        if (secHome) secHome.style.display = 'block';
        if (secDedicated) secDedicated.style.display = 'none';
        renderHomeServicesGrid();
      }
    }

    function renderHomeServicesGrid() {
      const grid = document.getElementById('homeServicesGrid');
      if (!grid) return;
      const homeServices = (typeof window.CMSStore?.getHomeServices === 'function') 
        ? window.CMSStore.getHomeServices() 
        : { cards: [] };
      const cards = (homeServices && Array.isArray(homeServices.cards) && homeServices.cards.length > 0)
        ? homeServices.cards
        : [];

      // Update data in-place on the static HTML cards
      cards.forEach((c, idx) => {
        const cardEl = document.getElementById(`homeCard_${idx}`);
        if (!cardEl) return;

        const deliv = Array.isArray(c.deliverables) ? c.deliverables : [];
        const subheading = (c.badge || c.sheetSub || c.sheetTitle || 'VISUAL IDENTITY').toUpperCase();

        const badgeEl = cardEl.querySelector('.home-card-badge');
        if (badgeEl) badgeEl.textContent = subheading;

        const titleEl = cardEl.querySelector('.home-card-title');
        if (titleEl && c.title) titleEl.textContent = c.title;

        const leadEl = cardEl.querySelector('.home-card-lead');
        if (leadEl) leadEl.textContent = c.leadDesc || '';

        const bodyEl = cardEl.querySelector('.home-card-body');
        if (bodyEl) bodyEl.textContent = (c.bodyDesc || c.desc || '');

        const delivEl = cardEl.querySelector('.home-card-deliverables');
        if (delivEl && deliv.length > 0) {
          delivEl.innerHTML = deliv.map(d => `<span style="font-size:11px;background:var(--card-alt);padding:4px 9px;border-radius:6px;color:var(--ink-mid);border:1px solid var(--rule);font-weight:500;">${d}</span>`).join('');
        }

        const linkEl = cardEl.querySelector('.home-card-link');
        if (linkEl && c.actionLink) linkEl.textContent = c.actionLink;

        const actionTextEl = cardEl.querySelector('.home-card-action-text');
        if (actionTextEl && c.actionText) actionTextEl.textContent = c.actionText;

        const mediaWrap = cardEl.querySelector('.home-card-media-wrap');
        if (mediaWrap) {
          if (c.mediaUrl) {
            mediaWrap.style.display = 'flex';
            const isVid = (/\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(c.mediaUrl) || c.mediaUrl.startsWith('data:video/'));
            mediaWrap.innerHTML = `
              ${isVid 
                ? `<video src="${c.mediaUrl}#t=0.1" muted playsinline style="width:28px;height:28px;object-fit:cover;border-radius:6px;flex-shrink:0;background:#000;"></video>`
                : `<img src="${c.mediaUrl}" alt="media" style="width:28px;height:28px;object-fit:cover;border-radius:6px;flex-shrink:0;" onerror="this.style.display='none';" />`
              }
              <span style="font-size:11px;color:var(--ink-mid);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${c.mediaUrl}</span>
            `;
          } else {
            mediaWrap.style.display = 'none';
            mediaWrap.innerHTML = '';
          }
        }
      });
    }

    function editHomeServiceCard(index) {
      const homeServices = (typeof window.CMSStore.getHomeServices === 'function') 
        ? window.CMSStore.getHomeServices() 
        : { cards: [] };
      const card = (homeServices.cards && homeServices.cards[index]) || null;
      if (!card) return;

      document.getElementById('homeCardIndex').value = index;
      document.getElementById('homeCardNum').value = card.num || ('0' + (index + 1));
      document.getElementById('homeCardWatermark').value = card.watermark || card.num || ('0' + (index + 1));
      document.getElementById('homeCardSheetTitle').value = card.sheetTitle || card.title || '';
      document.getElementById('homeCardSheetSub').value = card.sheetSub || card.badge || '';
      document.getElementById('homeCardBadge').value = card.badge || '';
      document.getElementById('homeCardTitle').value = card.title || '';
      document.getElementById('homeCardLead').value = card.leadDesc || '';
      document.getElementById('homeCardBody').value = card.bodyDesc || card.desc || '';
      document.getElementById('homeCardDeliverables').value = Array.isArray(card.deliverables) ? card.deliverables.join(', ') : (card.deliverables || '');
      document.getElementById('homeCardActionText').value = card.actionText || 'Explore Service';
      document.getElementById('homeCardActionLink').value = card.actionLink || 'service-logo-design.html';
      
      const mediaVal = card.mediaUrl || '';
      document.getElementById('homeCardMediaUrl').value = mediaVal;
      if (homeCardUploader && typeof homeCardUploader.refreshUI === 'function') {
        homeCardUploader.refreshUI();
      }

      document.getElementById('homeServiceModalTitle').textContent = `Edit Home Service Card ${card.num || (index + 1)}`;
      document.getElementById('homeServiceModal').classList.add('active');
    }

    document.getElementById('homeServiceForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const index = parseInt(document.getElementById('homeCardIndex').value, 10);
      const delivRaw = document.getElementById('homeCardDeliverables').value;
      const deliverables = delivRaw.split(',').map(d => d.trim()).filter(Boolean);
      const mediaUrl = document.getElementById('homeCardMediaUrl').value.trim();

      if (!mediaUrl) {
        showToast('⚠️ Visual media asset is required. Please select or drag & drop a file.', 'error');
        return;
      }

      const numVal = document.getElementById('homeCardNum').value.trim();
      const cardData = {
        num: numVal,
        watermark: numVal,
        sheetTitle: document.getElementById('homeCardSheetTitle').value.trim(),
        sheetSub: document.getElementById('homeCardSheetSub').value.trim(),
        badge: document.getElementById('homeCardBadge').value.trim(),
        title: document.getElementById('homeCardTitle').value.trim(),
        leadDesc: document.getElementById('homeCardLead').value.trim(),
        bodyDesc: document.getElementById('homeCardBody').value.trim(),
        deliverables: deliverables,
        actionText: document.getElementById('homeCardActionText').value.trim(),
        actionLink: document.getElementById('homeCardActionLink').value.trim(),
        mediaUrl: mediaUrl
      };

      if (typeof window.CMSStore.saveHomeServiceCard === 'function') {
        window.CMSStore.saveHomeServiceCard(index, cardData);
      }
      closeModal('homeServiceModal');
      renderHomeServicesGrid();
      showToast('🎉 Home service card saved & index.html synchronized!');
    });

    function renderServicesGrid() {
      renderHomeServicesGrid();
      const grid = document.getElementById('servicesGrid');
      const services = window.CMSStore.getServices();

      const statNum = document.getElementById('statServicesNum');
      if (statNum) statNum.textContent = services.length;
      const badgeCount = document.getElementById('badgeServicesCount');
      if (badgeCount) badgeCount.textContent = services.length;

      grid.innerHTML = services.map(s => {
        const deliv = Array.isArray(s.deliverables) ? s.deliverables : [];
        const subheading = (s.tagline || 'CORE CAPABILITY · STRATEGIC SCOPE').toUpperCase();
        return `
          <div class="cms-card" style="padding:24px;border-radius:16px;background:var(--card-bg);border:1px solid var(--rule);position:relative;display:flex;flex-direction:column;justify-content:space-between;cursor:pointer;transition:all 0.25s cubic-bezier(0.16, 1, 0.3, 1);box-shadow:0 4px 16px -2px rgba(0,0,0,0.03);" onclick="editService('${s.id}')">
            <div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;gap:12px;">
                <span style="font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--cr);letter-spacing:0.06em;text-transform:uppercase;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                  ${subheading}
                </span>
                <button type="button" class="btn-action-secondary" style="display:inline-flex;align-items:center;gap:5px;padding:5px 12px;font-size:11px;font-weight:700;border-radius:7px;border:1px solid var(--rule);background:var(--card-bg);color:var(--ink);cursor:pointer;flex-shrink:0;" onclick="event.stopPropagation(); editService('${s.id}')">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  <span>EDIT</span>
                </button>
              </div>

              <h3 style="font-family:var(--font-primary);font-size:18px;font-weight:800;margin:0 0 8px;color:var(--ink);line-height:1.3;">${s.title}</h3>
              
              <p style="font-size:13px;color:var(--ink-mid);margin:0 0 16px;line-height:1.55;">${s.desc}</p>

              ${s.image ? `
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;padding:6px 10px;background:var(--card-alt);border-radius:8px;border:1px solid var(--rule);">
                  ${(/\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(s.image) || s.image.startsWith('data:video/'))
                    ? `<video src="${s.image}#t=0.1" muted playsinline style="width:28px;height:28px;object-fit:cover;border-radius:6px;flex-shrink:0;background:#000;"></video>`
                    : `<img src="${s.image}" alt="visual" style="width:28px;height:28px;object-fit:cover;border-radius:6px;flex-shrink:0;" onerror="this.style.display='none';" />`
                  }
                  <span style="font-size:11px;color:var(--ink-mid);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${s.image}</span>
                </div>
              ` : ''}
            </div>

            <div>
              <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px;">
                ${deliv.map(d => `<span style="font-size:11px;background:var(--card-alt);padding:4px 9px;border-radius:6px;color:var(--ink-mid);border:1px solid var(--rule);font-weight:500;">${d}</span>`).join('')}
              </div>

              <div style="display:flex;align-items:center;justify-content:space-between;padding-top:12px;border-top:1px solid var(--rule);font-size:11px;color:var(--ink-mid);">
                <span style="display:inline-flex;align-items:center;gap:5px;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  <strong style="color:var(--ink);font-weight:600;">services.html#service-${s.num}</strong>
                </span>
                <span style="color:var(--cr);font-weight:700;display:inline-flex;align-items:center;gap:4px;">
                  Configure
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    let currentServicePortfolioList = [];

    function renderServiceWorkOptions(slotNum, activeId, portfolioList) {
      const listEl = document.getElementById(`serviceWork${slotNum}CustomOptionsList`);
      if (!listEl) return;
      const list = portfolioList || currentServicePortfolioList;
      listEl.innerHTML = list.map(p => {
        const isActive = (p.id === activeId);
        const safeTitle = (p.title || '').replace(/'/g, "\\'");
        const clientLabel = p.client ? ` (${p.client})` : '';
        const displayLabel = `${p.title}${clientLabel}`.replace(/'/g, "\\'");
        const img = p.bannerImage || p.coverImage || 'assets/img/portfolio/Selected Work Case Study Cards (Portfolio Showcase)-01.jpg';
        const searchText = `${p.title} ${p.client || ''}`.toLowerCase();
        return `
          <div class="custom-dropdown-item ${isActive ? 'active' : ''}" data-value="${p.id}" data-search="${searchText}" onclick="selectServiceWorkOption(${slotNum}, '${p.id}', '${displayLabel}')">
            <div style="display:flex;align-items:center;gap:9px;min-width:0;flex:1;">
              <img src="${img}" style="width:26px;height:26px;border-radius:5px;object-fit:cover;flex-shrink:0;border:1px solid var(--rule-m);" onerror="this.onerror=null; this.src='assets/img/portfolio/Selected Work Case Study Cards (Portfolio Showcase)-01.jpg';" />
              <div style="min-width:0;flex:1;">
                <div class="custom-dropdown-item-title" style="font-weight:700;font-size:12px;">${p.title}</div>
                <div style="font-size:10px;color:var(--ink-dim);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.client || 'Case Study'}</div>
              </div>
            </div>
            ${isActive ? '<svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:var(--cr);fill:none;stroke-width:2.5;flex-shrink:0;"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
          </div>
        `;
      }).join('');
    }

    window.selectServiceWorkOption = function(slotNum, pId, label) {
      if (typeof window.selectGenericDropdownOption === 'function') {
        window.selectGenericDropdownOption(`customDropdown_serviceWork${slotNum}`, `serviceWork${slotNum}Project`, pId, label);
      } else {
        const hidden = document.getElementById(`serviceWork${slotNum}Project`);
        if (hidden) hidden.value = pId;
        const valSpan = document.getElementById(`customDropdownVal_serviceWork${slotNum}`);
        if (valSpan) valSpan.textContent = label;
      }
      const container = document.getElementById(`customDropdown_serviceWork${slotNum}`);
      if (container) container.classList.remove('open');
      renderServiceWorkOptions(slotNum, pId, currentServicePortfolioList);
    };

    window.filterServiceWorkDropdown = function(slotNum, query) {
      const listEl = document.getElementById(`serviceWork${slotNum}CustomOptionsList`);
      if (!listEl) return;
      const q = (query || '').toLowerCase().trim();
      listEl.querySelectorAll('.custom-dropdown-item').forEach(item => {
        const s = (item.dataset.search || '').toLowerCase();
        item.style.display = (!q || s.includes(q)) ? 'flex' : 'none';
      });
    };

    function populateServiceCaseStudyDropdowns(sData) {
      const p1Hidden = document.getElementById('serviceWork1Project');
      const p2Hidden = document.getElementById('serviceWork2Project');
      if (!p1Hidden || !p2Hidden) return;

      const portfolio = (window.CMSStore && typeof window.CMSStore.getPortfolio === 'function')
        ? window.CMSStore.getPortfolio()
        : [];

      const defaultOptions = [
        { id: 'vibee', title: 'Vibee — Youth Culture & Apparel Identity', client: 'Vibee Apparel Co.', coverImage: 'assets/img/portfolio/Selected Work Case Study Cards (Portfolio Showcase)-01.jpg' },
        { id: 'aurora', title: 'AWARDSPLUS / Awards Plus — Prestige Corporate Identity', client: 'Awardsplus GmbH', coverImage: 'assets/uploads/1928_1794828463_P1-Awardsplus-01.jpg' },
        { id: 'infyli', title: 'Infyli — Minimalist Luxury Home Aromatics', client: 'Infyli Paris & Mumbai', coverImage: 'assets/img/portfolio/Selected Work Case Study Cards (Portfolio Showcase)-02.jpg' },
        { id: 'mudra', title: 'Mudra School — Classical Arts Digital Presence', client: 'Mudra Performing Arts Trust', coverImage: 'assets/img/portfolio/Selected Work Case Study Cards (Portfolio Showcase)-03.jpg' },
        { id: 'last-mile', title: 'Last Mile Analytics — Fintech Platform Architecture', client: 'Last Mile Global Markets', coverImage: 'assets/img/portfolio/Selected Work Case Study Cards (Portfolio Showcase)-05.jpg' },
        { id: 'alda', title: 'Alda — Precision Stainless Steel Spatial Identity', client: 'Alda Cookware Global', coverImage: 'assets/img/portfolio/Selected Work Case Study Cards (Portfolio Showcase)-06.jpg' }
      ];

      const allProjectsMap = new Map();
      portfolio.forEach(p => allProjectsMap.set(p.id, p));
      defaultOptions.forEach(p => {
        if (!allProjectsMap.has(p.id)) allProjectsMap.set(p.id, p);
      });

      currentServicePortfolioList = Array.from(allProjectsMap.values());

      const sNum = sData?.num || '01';
      let def1 = 'vibee', def2 = 'aurora';
      if (sNum === '02') { def1 = 'vibee'; def2 = 'infyli'; }
      else if (sNum === '03') { def1 = 'mudra'; def2 = 'last-mile'; }
      else if (sNum === '04') { def1 = 'vibee'; def2 = 'mudra'; }
      else if (sNum === '05') { def1 = 'infyli'; def2 = 'alda'; }

      const fw = sData?.featuredWorks || [];
      const p1Id = fw[0]?.projectId || def1;
      const p2Id = fw[1]?.projectId || def2;

      const p1Proj = currentServicePortfolioList.find(p => p.id === p1Id) || currentServicePortfolioList[0];
      const p2Proj = currentServicePortfolioList.find(p => p.id === p2Id) || currentServicePortfolioList[1] || currentServicePortfolioList[0];

      const p1Label = p1Proj ? `${p1Proj.title}${p1Proj.client ? ` (${p1Proj.client})` : ''}` : p1Id;
      const p2Label = p2Proj ? `${p2Proj.title}${p2Proj.client ? ` (${p2Proj.client})` : ''}` : p2Id;

      const p1Val = document.getElementById('customDropdownVal_serviceWork1');
      const p2Val = document.getElementById('customDropdownVal_serviceWork2');

      p1Hidden.value = p1Id;
      p2Hidden.value = p2Id;
      if (p1Val) p1Val.textContent = p1Label;
      if (p2Val) p2Val.textContent = p2Label;

      renderServiceWorkOptions(1, p1Id, currentServicePortfolioList);
      renderServiceWorkOptions(2, p2Id, currentServicePortfolioList);

      const w1Tag = document.getElementById('serviceWork1Tag');
      const w1Title = document.getElementById('serviceWork1Title');
      const w2Tag = document.getElementById('serviceWork2Tag');
      const w2Title = document.getElementById('serviceWork2Title');

      if (w1Tag) w1Tag.value = fw[0]?.tag || '01 / GLOBAL ICON';
      if (w1Title) w1Title.value = fw[0]?.customTitle || '';
      if (w2Tag) w2Tag.value = fw[1]?.tag || '02 / GLOBAL ICON';
      if (w2Title) w2Title.value = fw[1]?.customTitle || '';
    }

    function openServiceModal(sData = null) {
      document.getElementById('serviceModalTitle').textContent = sData ? `Edit Service ${sData.num || ''}` : 'Add Service Capability';
      document.getElementById('serviceIdInput').value = sData ? sData.id : '';
      document.getElementById('serviceNumInput').value = sData ? sData.num : (`0${(window.CMSStore.getServices().length + 1)}`);
      document.getElementById('serviceTaglineInput').value = sData ? (sData.tagline || '') : '';
      document.getElementById('serviceTitleInput').value = sData ? sData.title : '';
      document.getElementById('serviceDescInput').value = sData ? sData.desc : '';
      document.getElementById('serviceDeliverablesInput').value = sData && Array.isArray(sData.deliverables) ? sData.deliverables.join(', ') : '';
      
      const imgVal = sData ? (sData.image || '') : '';
      document.getElementById('serviceImageInput').value = imgVal;
      if (serviceUploader) serviceUploader.refreshUI();

      populateServiceCaseStudyDropdowns(sData);

      document.getElementById('serviceModal').classList.add('active');
    }

    function editService(id) {
      const service = window.CMSStore.getServices().find(s => s.id === id);
      if (service) openServiceModal(service);
    }

    document.getElementById('serviceForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('serviceIdInput').value;
      const delivRaw = document.getElementById('serviceDeliverablesInput').value;
      const deliverables = delivRaw.split(',').map(d => d.trim()).filter(Boolean);
      const imgVal = document.getElementById('serviceImageInput').value.trim();

      if (!imgVal) {
        showToast('⚠️ Service visual asset is required. Please select or drag & drop a file.', 'error');
        return;
      }

      const featuredWorks = [
        {
          projectId: document.getElementById('serviceWork1Project')?.value || 'vibee',
          tag: document.getElementById('serviceWork1Tag')?.value.trim() || '01 / GLOBAL ICON',
          customTitle: document.getElementById('serviceWork1Title')?.value.trim() || ''
        },
        {
          projectId: document.getElementById('serviceWork2Project')?.value || 'aurora',
          tag: document.getElementById('serviceWork2Tag')?.value.trim() || '02 / GLOBAL ICON',
          customTitle: document.getElementById('serviceWork2Title')?.value.trim() || ''
        }
      ];

      const data = {
        num: document.getElementById('serviceNumInput').value.trim(),
        tagline: document.getElementById('serviceTaglineInput').value.trim(),
        title: document.getElementById('serviceTitleInput').value.trim(),
        desc: document.getElementById('serviceDescInput').value.trim(),
        deliverables: deliverables,
        image: imgVal,
        featuredWorks: featuredWorks
      };
      if (id) data.id = id;

      window.CMSStore.saveService(data);

      // Keep home services cards in sync if matching service num (01 to 05)
      try {
        const sNum = parseInt(data.num, 10);
        if (!isNaN(sNum) && sNum >= 1 && sNum <= 5) {
          const cardIdx = sNum - 1;
          const homeData = (typeof window.CMSStore.getHomeServices === 'function') ? window.CMSStore.getHomeServices() : null;
          if (homeData && Array.isArray(homeData.cards) && homeData.cards[cardIdx]) {
            const card = homeData.cards[cardIdx];
            card.sheetTitle = data.title;
            card.title = `${data.num}. ${data.title}`;
            if (data.desc) card.bodyDesc = data.desc;
            if (data.image) card.mediaUrl = data.image;
            if (data.deliverables && data.deliverables.length) card.deliverables = data.deliverables;
            if (typeof window.CMSStore.saveHomeServiceCard === 'function') {
              window.CMSStore.saveHomeServiceCard(cardIdx, card);
            }
          }
        }
      } catch (err) {}

      closeModal('serviceModal');
      renderServicesGrid();
      showToast('🎉 Service saved & synchronized across live pages!');
    });
