/**
 * 1928 CREATIVE STUDIO — Pure Database-Driven CMS Data Store & State Engine
 * 
 * 100% MySQL Database Powered via PHP Core API (api.php)
 * - Zero hardcoded data structures in client JavaScript files
 * - Zero localStorage caching of database records (prevents data conflicts)
 * - Single Source of Truth (SSOT): MySQL database `1928_studio_cms`
 * - Real-time event dispatching for instant multi-page and admin UI reactivity
 */
(function (global) {
  'use strict';

  const EVENT_NAME = '1928_cms_updated';

  // Empty initial schema state (populated directly from MySQL on load)
  const EMPTY_SCHEMA = {
    seo: {},
    profile: {
      storyHeadline: 'WE TURN AMBITION INTO MOMENTUM.',
      storyDescription: '',
      pillars: [],
      principles: [],
      team: []
    },
    services: [],
    clients: [],
    portfolio: [],
    blogs: [],
    settings: {},
    contactBrief: null,
    inquiriesStats: { total: 0, new: 0 }
  };

  class CMSStore {
    constructor() {
      this.apiAvailable = false;
      this.isLoaded = false;
      this.data = JSON.parse(JSON.stringify(EMPTY_SCHEMA));

      // Purge legacy client-side localStorage caches to prevent stale data conflicts
      this._purgeLegacyLocalStorage();

      // Listen for cross-tab database updates
      this._initSync();

      // Immediately fetch authoritative data from MySQL via PHP API
      this._readyPromise = this._fetchFromDatabase();
    }

    /**
     * Purges old browser-cached CMS data to ensure MySQL is always the sole source of truth.
     */
    _purgeLegacyLocalStorage() {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('1928_cms_data_v3');
          localStorage.removeItem('1928_cms_data_v3_code_hash');
          localStorage.removeItem('1928_contact_inquiries_cache');
          localStorage.removeItem('1928_contact_inquiries_counts');
        }
      } catch (e) {
        // LocalStorage unavailable or restricted
      }
    }

    /**
     * Expose a Promise that resolves when data has finished loading from MySQL
     */
    ready() {
      return this._readyPromise;
    }

    /**
     * Master Database Loader — Fetches 100% of CMS data from MySQL via api.php?action=get_all
     */
    async _fetchFromDatabase() {
      try {
        const res = await fetch('api.php?action=get_all', {
          method: 'GET',
          cache: 'no-cache',
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          const json = await res.json();
          if (json && json.status === 'success' && json.data) {
            this.apiAvailable = true;
            this.isLoaded = true;

            const d = json.data;
            this.data = {
              seo: d.seo || {},
              profile: {
                storyHeadline: d.profile?.storyHeadline || 'WE TURN AMBITION INTO MOMENTUM.',
                storyDescription: d.profile?.storyDescription || '',
                pillars: Array.isArray(d.profile?.pillars) ? d.profile.pillars : [],
                principles: Array.isArray(d.profile?.principles) ? d.profile.principles : [],
                team: Array.isArray(d.profile?.team) ? d.profile.team : []
              },
              services: Array.isArray(d.services) ? d.services : [],
              clients: Array.isArray(d.clients) ? d.clients : [],
              portfolio: Array.isArray(d.portfolio) ? d.portfolio : [],
              blogs: Array.isArray(d.blogs) ? d.blogs : [],
              settings: d.settings || {},
              contactBrief: d.contactBrief || null,
              inquiriesStats: d.inquiriesStats || { total: 0, new: 0 }
            };

            // Parse settings that might be stored as JSON strings
            if (this.data.settings) {
              if (typeof this.data.settings.home_services === 'string') {
                try { this.data.settings.home_services = JSON.parse(this.data.settings.home_services); } catch (e) {}
              }
              if (typeof this.data.settings.services_header === 'string') {
                try { this.data.settings.services_header = JSON.parse(this.data.settings.services_header); } catch (e) {}
              }
              if (typeof this.data.settings.perspectives_curation === 'string') {
                try { this.data.settings.perspectives_curation = JSON.parse(this.data.settings.perspectives_curation); } catch (e) {}
              }
            }

            this._notify();
            console.log('✅ [1928 CMS] Pure MySQL Database connection established via PHP API.');
            return this.data;
          }
        }
      } catch (err) {
        console.warn('⚠️ [1928 CMS] PHP Database API request failed:', err);
      }
      return this.data;
    }

    _checkAndSyncDatabase() {
      return this._fetchFromDatabase();
    }

    async reload() {
      return this._fetchFromDatabase();
    }

    loadFromStorage() {
      return this._fetchFromDatabase();
    }

    reloadFromCode() {
      return this._fetchFromDatabase();
    }

    syncWithCode() {
      return this._fetchFromDatabase();
    }

    _initSync() {
      // BroadcastChannel or storage event for multi-tab notification
      if (typeof window !== 'undefined') {
        window.addEventListener('storage', (e) => {
          if (e.key === '1928_db_sync_ping') {
            this._fetchFromDatabase();
          }
        });
      }
    }

    _notify() {
      if (typeof window !== 'undefined') {
        const event = new CustomEvent(EVENT_NAME, { detail: this.data });
        window.dispatchEvent(event);
      }
    }

    /**
     * Send mutations directly to MySQL database via api.php
     */
    async _sendToAPI(action, payload) {
      try {
        const res = await fetch(`api.php?action=${encodeURIComponent(action)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        // Notify other open browser tabs of database mutation
        try {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('1928_db_sync_ping', Date.now().toString());
          }
        } catch (e) {}

        return res.ok;
      } catch (err) {
        console.error(`[1928 CMS] Failed to execute ${action} on database:`, err);
        return false;
      }
    }

    // ═══════════════════════════════════════════════════════════
    // 1. SEO METADATA (MySQL: seo_meta)
    // ═══════════════════════════════════════════════════════════
    getSEO(pageKey = 'global') {
      return this.data.seo[pageKey] || this.data.seo.global || {};
    }

    getAllSEO() {
      return this.data.seo;
    }

    updateSEO(pageKey, seoData) {
      if (!this.data.seo[pageKey]) this.data.seo[pageKey] = {};
      this.data.seo[pageKey] = { ...this.data.seo[pageKey], ...seoData };
      this._notify();
      this._sendToAPI('save_seo', {
        page_key: pageKey,
        title: this.data.seo[pageKey].title || '',
        description: this.data.seo[pageKey].description || '',
        keywords: this.data.seo[pageKey].keywords || '',
        og_image: this.data.seo[pageKey].ogImage || 'assets/img/branding/1928-logo.png'
      });
      return this.data.seo[pageKey];
    }

    // ═══════════════════════════════════════════════════════════
    // 2. STUDIO PROFILE, TEAM, PRINCIPLES (MySQL: studio_profile, team_members, studio_principles)
    // ═══════════════════════════════════════════════════════════
    getProfile() {
      return this.data.profile;
    }

    updateProfileStory(storyData) {
      this.data.profile = { ...this.data.profile, ...storyData };
      this._notify();
      this._sendToAPI('save_profile_story', {
        storyHeadline: this.data.profile.storyHeadline,
        storyDescription: this.data.profile.storyDescription,
        pillars: this.data.profile.pillars
      });
      return this.data.profile;
    }

    getTeam() {
      return [...(this.data.profile.team || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    saveTeamMember(memberData) {
      if (!memberData.id) {
        memberData.id = 'team-' + Date.now().toString(36);
      }
      const existingIdx = this.data.profile.team.findIndex(m => m.id === memberData.id || m.memberKey === memberData.id);
      if (existingIdx >= 0) {
        this.data.profile.team[existingIdx] = { ...this.data.profile.team[existingIdx], ...memberData };
      } else {
        if (!memberData.order) memberData.order = this.data.profile.team.length + 1;
        this.data.profile.team.push(memberData);
      }
      this._notify();
      this._sendToAPI('save_team', memberData);
      return memberData;
    }

    deleteTeamMember(id) {
      this.data.profile.team = this.data.profile.team.filter(m => m.id !== id && m.memberKey !== id);
      this._notify();
      this._sendToAPI('delete_team', { id });
      return true;
    }

    getPrinciples() {
      return this.data.profile.principles || [];
    }

    savePrinciple(principleData) {
      const idx = this.data.profile.principles.findIndex(p => p.id === principleData.id);
      if (idx >= 0) {
        this.data.profile.principles[idx] = { ...this.data.profile.principles[idx], ...principleData };
      } else {
        this.data.profile.principles.push(principleData);
      }
      this._notify();
      this._sendToAPI('save_principle', principleData);
      return principleData;
    }

    deletePrinciple(id) {
      this.data.profile.principles = this.data.profile.principles.filter(p => p.id !== id);
      this._notify();
      this._sendToAPI('delete_principle', { id });
      return true;
    }

    getProcess() {
      return this.data.profile.process || [];
    }

    saveProcessStep(stepData) {
      if (!this.data.profile.process) this.data.profile.process = [];
      const idx = this.data.profile.process.findIndex(p => p.step === stepData.step);
      if (idx >= 0) {
        this.data.profile.process[idx] = { ...this.data.profile.process[idx], ...stepData };
      } else {
        this.data.profile.process.push(stepData);
      }
      this._notify();
      this._sendToAPI('save_settings', {
        studio_process: this.data.profile.process
      });
      return stepData;
    }

    // ═══════════════════════════════════════════════════════════
    // 3. CORE SERVICES (MySQL: services)
    // ═══════════════════════════════════════════════════════════
    getServices() {
      return [...(this.data.services || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    getServicesHeader() {
      return this.data.settings?.servicesHeader || this.data.settings?.services_header || {};
    }

    saveServicesHeader(headerData) {
      if (!this.data.settings) this.data.settings = {};
      this.data.settings.services_header = headerData;
      this._notify();
      this._sendToAPI('save_settings', {
        services_header: headerData
      });
      return headerData;
    }

    saveService(serviceData) {
      if (!serviceData.id) {
        serviceData.id = 'svc-' + Date.now().toString(36);
      }
      const idx = this.data.services.findIndex(s => s.id === serviceData.id);
      if (idx >= 0) {
        this.data.services[idx] = { ...this.data.services[idx], ...serviceData };
      } else {
        if (!serviceData.order) serviceData.order = this.data.services.length + 1;
        this.data.services.push(serviceData);
      }
      this._notify();
      this._sendToAPI('save_service', serviceData);
      return serviceData;
    }

    deleteService(id) {
      this.data.services = this.data.services.filter(s => s.id !== id);
      this._notify();
      this._sendToAPI('delete_service', { id });
      return true;
    }

    // ── Home Page Dossier Services (MySQL: studio_settings -> home_services) ──
    getHomeServices() {
      const raw = this.data.settings?.home_services || this.data.settings?.homeServices;
      if (raw && typeof raw === 'object' && Array.isArray(raw.cards)) {
        return raw;
      }
      if (typeof raw === 'string') {
        try {
          const parsed = JSON.parse(raw);
          if (parsed && Array.isArray(parsed.cards)) return parsed;
        } catch (e) {}
      }
      return { cover: {}, cards: [] };
    }

    saveHomeServices(homeData) {
      if (!this.data.settings) this.data.settings = {};
      this.data.settings.home_services = homeData;
      this._notify();
      this._sendToAPI('save_settings', {
        home_services: homeData
      });
      return homeData;
    }

    saveHomeServiceCard(index, cardData) {
      const current = this.getHomeServices();
      if (!Array.isArray(current.cards)) current.cards = [];
      const idx = parseInt(index, 10);
      if (idx >= 0 && idx < current.cards.length) {
        current.cards[idx] = { ...current.cards[idx], ...cardData };
      } else {
        current.cards.push(cardData);
      }
      return this.saveHomeServices(current);
    }

    saveHomeCover(coverData) {
      const current = this.getHomeServices();
      current.cover = { ...(current.cover || {}), ...coverData };
      return this.saveHomeServices(current);
    }

    // ═══════════════════════════════════════════════════════════
    // 4. CLIENT LOGOS (MySQL: clients)
    // ═══════════════════════════════════════════════════════════
    getClients(onlyActive = false) {
      const list = this.data.clients || [];
      const filtered = onlyActive ? list.filter(c => c.active !== false && c.active !== 0) : list;
      return [...filtered].sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    getClientById(id) {
      return (this.data.clients || []).find(c => c.id === id);
    }

    saveClient(clientData) {
      if (!clientData.id) {
        clientData.id = 'client-' + Date.now().toString(36);
      }
      const existingIdx = this.data.clients.findIndex(c => c.id === clientData.id);
      if (existingIdx >= 0) {
        this.data.clients[existingIdx] = { ...this.data.clients[existingIdx], ...clientData };
      } else {
        if (!clientData.order) clientData.order = this.data.clients.length + 1;
        if (clientData.active === undefined) clientData.active = true;
        this.data.clients.push(clientData);
      }
      this._notify();
      this._sendToAPI('save_client', clientData);
      return clientData;
    }

    deleteClient(id) {
      this.data.clients = this.data.clients.filter(c => c.id !== id);
      this._notify();
      this._sendToAPI('delete_client', { id });
      return true;
    }

    // ═══════════════════════════════════════════════════════════
    // 5. PORTFOLIO & CASE STUDIES (MySQL: portfolio)
    // ═══════════════════════════════════════════════════════════
    getPortfolio(onlyFeatured = false) {
      const list = this.data.portfolio || [];
      const filtered = onlyFeatured ? list.filter(p => p.featured) : list;
      return [...filtered].sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    getProjectById(id) {
      return (this.data.portfolio || []).find(p => p.id === id);
    }

    getPortfolioById(id) {
      return this.getProjectById(id);
    }

    saveProject(projectData) {
      if (!projectData.id) {
        projectData.id = 'proj-' + Date.now().toString(36);
      }
      const existingIdx = this.data.portfolio.findIndex(p => p.id === projectData.id);
      if (existingIdx >= 0) {
        this.data.portfolio[existingIdx] = { ...this.data.portfolio[existingIdx], ...projectData };
      } else {
        if (!projectData.order) projectData.order = this.data.portfolio.length + 1;
        this.data.portfolio.push(projectData);
      }
      this._notify();
      this._sendToAPI('save_portfolio', projectData);
      return projectData;
    }

    deleteProject(id) {
      this.data.portfolio = this.data.portfolio.filter(p => p.id !== id);
      this._notify();
      this._sendToAPI('delete_portfolio', { id });
      return true;
    }

    getPortfolioHero() {
      return this.data.settings?.portfolioHero || this.data.settings?.portfolio_hero || {};
    }

    savePortfolioHero(heroData) {
      if (!this.data.settings) this.data.settings = {};
      this.data.settings.portfolio_hero = heroData;
      this._notify();
      this._sendToAPI('save_settings', {
        portfolio_hero: heroData
      });
      return heroData;
    }

    getHomeSelectedProjects() {
      const saved = this.data.settings?.home_selected_projects || this.data.settings?.homeSelectedProjects;
      if (Array.isArray(saved) && saved.length > 0) return saved;
      return (this.data.portfolio || []).slice(0, 6).map(p => p.id);
    }

    saveHomeSelectedProjects(projectIdsArray) {
      if (!this.data.settings) this.data.settings = {};
      this.data.settings.home_selected_projects = projectIdsArray;
      this._notify();
      this._sendToAPI('save_settings', {
        home_selected_projects: projectIdsArray
      });
      return projectIdsArray;
    }

    // ═══════════════════════════════════════════════════════════
    // 6. PERSPECTIVES & BLOGS (MySQL: blogs)
    // ═══════════════════════════════════════════════════════════
    getBlogs(onlyPublished = false) {
      const list = this.data.blogs || [];
      const filtered = onlyPublished ? list.filter(b => b.published !== false && b.published !== 0) : list;
      return [...filtered].sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    getBlogById(id) {
      return (this.data.blogs || []).find(b => b.id === id || b.slug === id);
    }

    saveBlog(blogData) {
      if (!blogData.id) {
        blogData.id = 'art-' + Date.now().toString(36);
      }
      if (!blogData.slug) {
        blogData.slug = (blogData.title || 'perspective').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      const existingIdx = this.data.blogs.findIndex(b => b.id === blogData.id);
      if (existingIdx >= 0) {
        this.data.blogs[existingIdx] = { ...this.data.blogs[existingIdx], ...blogData };
      } else {
        if (!blogData.order) blogData.order = this.data.blogs.length + 1;
        if (blogData.published === undefined) blogData.published = true;
        this.data.blogs.unshift(blogData);
      }
      this._notify();
      this._sendToAPI('save_blog', blogData);
      return blogData;
    }

    deleteBlog(id) {
      this.data.blogs = this.data.blogs.filter(b => b.id !== id);
      this._notify();
      this._sendToAPI('delete_blog', { id });
      return true;
    }

    // ═══════════════════════════════════════════════════════════
    // 7. PERSPECTIVES SECTION CURATION (MySQL: studio_settings)
    // ═══════════════════════════════════════════════════════════
    getPerspectivesCuration() {
      const allBlogs = this.getBlogs(true);
      const defaultIds = allBlogs.map(b => b.id);
      
      let raw = this.data.settings?.perspectives_curation;
      if (typeof raw === 'string') {
        try { raw = JSON.parse(raw); } catch (e) { raw = null; }
      }

      const heroTickerIds = (Array.isArray(raw?.heroTickerIds) && raw.heroTickerIds.length > 0)
        ? raw.heroTickerIds
        : defaultIds.slice(0, 8);

      const featuredCarouselIds = (Array.isArray(raw?.featuredCarouselIds) && raw.featuredCarouselIds.length > 0)
        ? raw.featuredCarouselIds
        : defaultIds.slice(0, 4);

      const codexGridIds = (Array.isArray(raw?.codexGridIds) && raw.codexGridIds.length > 0)
        ? raw.codexGridIds
        : defaultIds.slice(0, 6);

      const codexCount = parseInt(raw?.codexCount, 10) || 6;

      return {
        heroTickerIds,
        featuredCarouselIds,
        codexGridIds,
        codexCount
      };
    }

    savePerspectivesCuration(curationData) {
      if (!this.data.settings) this.data.settings = {};
      this.data.settings.perspectives_curation = curationData;
      this._notify();
      this._sendToAPI('save_perspectives_curation', curationData);
      return curationData;
    }

    // ═══════════════════════════════════════════════════════════
    // 8. STUDIO SETTINGS & CONTACT BRIEF (MySQL: studio_settings)
    // ═══════════════════════════════════════════════════════════
    getSettings() {
      return this.data.settings || {};
    }

    saveSettings(settingsData) {
      this.data.settings = { ...this.data.settings, ...settingsData };
      this._notify();
      this._sendToAPI('save_settings', settingsData);
      return this.data.settings;
    }

    getContactBrief() {
      if (this.data.contactBrief && typeof this.data.contactBrief === 'object') {
        return this.data.contactBrief;
      }
      return {
        header: { title: 'Start a Project.', badge: 'Confidential Brief · Partner Review', desc: 'Specify your engagement parameters to initiate a confidential studio brief.' },
        step1: { railWord: 'Scope', headline: 'Engagement Classification', caption: 'Select the primary service for this project.', cards: [] },
        step2: { railWord: 'Disciplines', headline: 'Specialized Disciplines', caption: 'Choose all deliverables required.', disciplines: [] },
        step3: { railWord: 'Allocation', headline: 'Capital Allocation (INR ₹)', caption: 'Select your target budget tier.', tiers: [], timelines: [] },
        step4: { railWord: 'Session', headline: 'Strategy Session Window', caption: 'Select your preferred consultation window.', slots: [] },
        step5: { railWord: 'Credentials', headline: 'Credentials & Brief', caption: 'Your particulars and project brief.' }
      };
    }

    saveContactBrief(briefData) {
      this.data.contactBrief = {
        ...this.getContactBrief(),
        ...(briefData || {})
      };
      this._notify();
      this._sendToAPI('save_settings', {
        contact_brief: this.data.contactBrief
      });
      return this.data.contactBrief;
    }

    saveContactBriefStep(stepKey, stepData) {
      const current = this.getContactBrief();
      current[stepKey] = {
        ...(current[stepKey] || {}),
        ...(stepData || {})
      };
      this.data.contactBrief = current;
      this._notify();
      this._sendToAPI('save_settings', {
        contact_brief: this.data.contactBrief
      });
      return current[stepKey];
    }

    // ═══════════════════════════════════════════════════════════
    // 9. EXPORT & RESET (Pure MySQL)
    // ═══════════════════════════════════════════════════════════
    exportData() {
      return JSON.stringify(this.data, null, 2);
    }

    async importData(jsonString) {
      try {
        const parsed = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
        if (!parsed || typeof parsed !== 'object') throw new Error('Invalid data format');
        
        // Push all components directly to MySQL database
        if (parsed.blogs && Array.isArray(parsed.blogs)) {
          for (const b of parsed.blogs) await this._sendToAPI('save_blog', b);
        }
        if (parsed.portfolio && Array.isArray(parsed.portfolio)) {
          for (const p of parsed.portfolio) await this._sendToAPI('save_portfolio', p);
        }
        if (parsed.services && Array.isArray(parsed.services)) {
          for (const s of parsed.services) await this._sendToAPI('save_service', s);
        }
        if (parsed.clients && Array.isArray(parsed.clients)) {
          for (const c of parsed.clients) await this._sendToAPI('save_client', c);
        }
        if (parsed.profile?.team && Array.isArray(parsed.profile.team)) {
          for (const t of parsed.profile.team) await this._sendToAPI('save_team', t);
        }
        if (parsed.profile?.principles && Array.isArray(parsed.profile.principles)) {
          for (const pr of parsed.profile.principles) await this._sendToAPI('save_principle', pr);
        }
        if (parsed.profile) {
          await this._sendToAPI('save_profile_story', parsed.profile);
        }
        if (parsed.seo) {
          for (const k of Object.keys(parsed.seo)) {
            await this._sendToAPI('save_seo', { page_key: k, ...parsed.seo[k] });
          }
        }
        if (parsed.settings) {
          await this._sendToAPI('save_settings', parsed.settings);
        }

        await this._fetchFromDatabase();
        return { success: true };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }

    async resetToDefaults() {
      await this._sendToAPI('reset_database', {});
      await this._fetchFromDatabase();
      return true;
    }
  }

  // Instantiate singleton
  global.CMSStore = new CMSStore();

})(typeof window !== 'undefined' ? window : this);
