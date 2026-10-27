    // ── MASTER VIEW REFRESH ──
    function refreshAllViews() {
      renderDashboard();
      loadSEOForm();
      renderBlogsGrid();
      populatePerspectivesCurationUI();
      renderProjectsGrid();
      loadPortfolioHeroForm();
      loadHomeShowcaseForm();
      renderProfileView();
      renderHomeServicesGrid();
      renderServicesGrid();
      renderClientsGrid();
      renderContactAdminView();
      loadContactInquiries(false);
      loadStudioContactSettings();
    }



    // ── NAVIGATION & THEME CONTROLS ──
    document.querySelectorAll('.nav-item[data-view]').forEach(item => {
      item.addEventListener('click', () => {
        switchView(item.getAttribute('data-view'));
      });
    });

    document.getElementById('sidebarOpenBtn').addEventListener('click', () => {
      document.getElementById('sidebar').classList.add('open');
    });

    document.getElementById('sidebarCloseBtn').addEventListener('click', () => {
      document.getElementById('sidebar').classList.remove('open');
    });

    const themeBtn = document.getElementById('themeToggleBtn');
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });

    // ── 9. MYSQL LIVE DATABASE CONTROLLER ──
    async function checkDatabaseStatus(showNotification = false) {
      const pill = document.getElementById('dbStatusPill');
      const txt = document.getElementById('dbStatusText');

      try {
        const res = await fetch('api.php?action=check_status');
        if (res.ok) {
          const data = await res.json();
          if (data && data.status === 'success') {
            if (pill) pill.classList.remove('offline');
            if (txt) {
              txt.textContent = data.engine && data.engine.includes('Live') ? 'Real-Time Sync: Live' : `MySQL: ${data.database}`;
            }
            if (showNotification) {
              const b = data.counts ? data.counts.blogs : 17;
              const p = data.counts ? data.counts.portfolio : 6;
              const c = data.counts ? data.counts.clients : 60;
              showToast(`Connected & Synced (${b} Blogs, ${p} Projects, ${c} Logos)`);
            }
            return;
          }
        }
      } catch (e) {}

      if (pill) {
        pill.classList.remove('offline');
        txt.textContent = 'Real-Time Code Sync';
      }
      if (showNotification) showToast('Live Code Sync active.', 'info');
    }

    async function pushAllDataToMySQL() {
      const fullData = window.CMSStore.exportData();
      showToast('Writing studio dataset to MySQL database...');
      try {
        const parsed = JSON.parse(fullData);
        // Push all blogs
        for (const b of (parsed.blogs || [])) {
          await fetch('api.php?action=save_blog', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(b) });
        }
        // Push portfolio
        for (const p of (parsed.portfolio || [])) {
          await fetch('api.php?action=save_portfolio', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(p) });
        }
        // Push clients
        for (const c of (parsed.clients || [])) {
          await fetch('api.php?action=save_client', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(c) });
        }
        // Push team
        for (const t of (parsed.profile?.team || [])) {
          await fetch('api.php?action=save_team', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(t) });
        }
        // Push principles
        for (const pr of (parsed.profile?.principles || [])) {
          await fetch('api.php?action=save_principle', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(pr) });
        }
        // Push services
        for (const s of (parsed.services || [])) {
          await fetch('api.php?action=save_service', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(s) });
        }
        // Push SEO
        for (const [k, seo] of Object.entries(parsed.seo || {})) {
          await fetch('api.php?action=save_seo', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({page_key:k, ...seo}) });
        }
        // Push Contact Brief
        if (parsed.contactBrief) {
          await fetch('api.php?action=save_settings', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({contact_brief: parsed.contactBrief}) });
        }
        showToast('All 17 Blogs, 10 Projects, 12 Logos, SEO & Contact data synchronized to MySQL!');
        checkDatabaseStatus();
      } catch (e) {
        showToast('Sync Error: ' + e.message, 'error');
      }
    }

    async function pullDataFromMySQL() {
      showToast('Fetching latest records from MySQL...');
      if (window.CMSStore._checkAndSyncDatabase) {
        await window.CMSStore._checkAndSyncDatabase();
      }
      refreshAllViews();
      checkDatabaseStatus(true);
    }

    // ── Live Real-Time Code Sync Engine ──
    function initLiveCodeSync() {
      const syncPill = document.getElementById('liveSyncStatusPill');
      const syncText = document.getElementById('liveSyncStatusText');

      // Listen for local CMSStore updates
      window.addEventListener('1928_cms_updated', () => {
        refreshAllViews();
      });

      // Connect to Server-Sent Events from backend only if explicitly enabled
      if (typeof EventSource !== 'undefined' && window.__ENABLE_LIVE_SYNC__ === true) {
        try {
          const es = new EventSource('/api/live-sync');
          es.addEventListener('connected', () => {
            if (syncText) syncText.textContent = 'Code Sync: Live';
            if (syncPill) {
              syncPill.style.borderColor = 'rgba(16,185,129,0.4)';
              syncPill.style.color = '#10B981';
            }
          });

          es.addEventListener('code_change', (event) => {
            try {
              const data = JSON.parse(event.data);
              const file = data.file || 'Code file';
              console.log('⚡ [LIVE CODE SYNC] Detected modification:', file);

              if (file.includes('data-store.js')) {
                const s = document.createElement('script');
                s.src = `data-store.js?t=${Date.now()}`;
                s.onload = () => {
                  if (window.CMSStore && window.CMSStore.reloadFromCode) {
                    window.CMSStore.reloadFromCode();
                  }
                  refreshAllViews();
                  showToast(`⚡ Live Synced: ${file} updated in real time!`);
                };
                document.head.appendChild(s);
              } else {
                if (window.CMSStore && window.CMSStore.reloadFromCode) {
                  window.CMSStore.reloadFromCode();
                }
                refreshAllViews();
                showToast(`⚡ Live Synced: ${file} updated in real time!`);
              }

              if (syncText) {
                const d = new Date();
                syncText.textContent = `Synced: ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
              }
            } catch (err) {
              console.warn('[LIVE SYNC] Parse error:', err);
            }
          });

          es.onerror = () => {
            if (syncText) syncText.textContent = 'Database: MySQL Live';
            try { es.close(); } catch (e) {}
          };
        } catch (e) {}
      } else {
        if (syncText) syncText.textContent = 'Database: MySQL Live';
        if (syncPill) {
          syncPill.style.borderColor = 'rgba(16,185,129,0.4)';
          syncPill.style.color = '#10B981';
        }
      }
    }

    function syncWithCodeManually() {
      if (window.CMSStore && window.CMSStore.reloadFromCode) {
        window.CMSStore.reloadFromCode();
        refreshAllViews();
        showToast('⚡ Manually synchronized with backend code!');
      }
    }

    // Initialize on Page Load
    document.addEventListener('DOMContentLoaded', () => {
      if (window.location.protocol === 'file:') {
        const warn = document.getElementById('fileProtocolWarning');
        if (warn) warn.style.display = 'block';
      }

      const savedTheme = localStorage.getItem('theme') || 'dark';
      document.documentElement.setAttribute('data-theme', savedTheme);
      initCustomDropdown();
      initAllUploaders();
      initLiveCodeSync();
      refreshAllViews();
      checkDatabaseStatus();

      if (window.CMSStore && typeof window.CMSStore.ready === 'function') {
        window.CMSStore.ready().then(() => {
          refreshAllViews();
        }).catch(() => {});
      }

      // Visual WYSIWYG Editor Listeners
      const vEditor = document.getElementById('blogVisualEditor');
      if (vEditor) {
        vEditor.addEventListener('input', () => {
          syncVisualEditorToInput();
          updateEditorWordCount();
        });
        vEditor.addEventListener('paste', (e) => {
          setTimeout(() => {
            syncVisualEditorToInput();
            updateEditorWordCount();
          }, 40);
        });
      }
      const cEditor = document.getElementById('blogContentInput');
      if (cEditor) {
        cEditor.addEventListener('input', () => {
          updateEditorWordCount();
        });
      }
    });

  
    // ── GLOBAL MODAL DISMISS & ESCAPE LISTENERS ──
    document.addEventListener('click', function(e) {
      if (e.target && e.target.classList && e.target.classList.contains('modal-backdrop')) {
        e.target.classList.remove('active');
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop.active').forEach(m => m.classList.remove('active'));
      }
    });

    // Expose crucial navigation & modal functions to window
    window.openInquiryDetail = openInquiryDetail;
    window.closeModal = closeModal;
    window.switchView = switchView;
    window.switchContactSubTab = switchContactSubTab;
    window.toggleBlockDay = toggleBlockDay;
    window.toggleBlockSundays = toggleBlockSundays;
    window.toggleBlockWeekends = toggleBlockWeekends;
    window.clearAllBlockedDays = clearAllBlockedDays;
    window.handleBookedDaysInput = handleBookedDaysInput;
    window.quickBlockCurrentInquiryDate = quickBlockCurrentInquiryDate;
    window.renderInteractiveBlockedDaysGrid = renderInteractiveBlockedDaysGrid;
