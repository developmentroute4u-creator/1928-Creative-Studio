    // ── 0. DASHBOARD MASTER CONTROLLER ──
    function renderDashboard() {
      if (!window.CMSStore) return;

      const blogs = (typeof window.CMSStore.getBlogs === 'function') ? window.CMSStore.getBlogs() : [];
      const portfolio = (typeof window.CMSStore.getPortfolio === 'function') ? window.CMSStore.getPortfolio() : [];
      const profile = (typeof window.CMSStore.getProfile === 'function') ? window.CMSStore.getProfile() : {};
      const clients = (typeof window.CMSStore.getClients === 'function') ? window.CMSStore.getClients() : [];
      const services = (typeof window.CMSStore.getServices === 'function') ? window.CMSStore.getServices() : [];

      const teamCount = (profile.team || []).length || 6;
      const blogsCount = blogs.length || 0;
      const portfolioCount = portfolio.length || 0;
      const clientsCount = clients.length || 0;
      const servicesCount = services.length || 5;

      // Update Metric Numbers
      const statBlogs = document.getElementById('statBlogsNum');
      const statProjects = document.getElementById('statProjectsNum');
      const statTeam = document.getElementById('statTeamNum');
      const statClients = document.getElementById('statClientsNum');
      const statServices = document.getElementById('statServicesNum');

      if (statBlogs) statBlogs.textContent = blogsCount;
      if (statProjects) statProjects.textContent = portfolioCount;
      if (statTeam) statTeam.textContent = teamCount;
      if (statClients) statClients.textContent = clientsCount;
      if (statServices) statServices.textContent = (servicesCount < 10 ? '0' : '') + servicesCount;

      // Update Sidebar Badges
      const badgeB = document.getElementById('badgeBlogsCount');
      const badgeP = document.getElementById('badgeProjectsCount');
      const badgeT = document.getElementById('badgeTeamCount');
      const badgeC = document.getElementById('badgeClientsCount');
      const badgeS = document.getElementById('badgeServicesCount');
      if (badgeB) badgeB.textContent = blogsCount;
      if (badgeP) badgeP.textContent = portfolioCount;
      if (badgeT) badgeT.textContent = teamCount;
      if (badgeC) badgeC.textContent = clientsCount;

      // Update Inquiries Metric & Sidebar
      const badgeInq = document.getElementById('badgeInquiriesCount');
      if (allInquiriesList && allInquiriesList.length > 0) {
        const newCount = allInquiriesList.filter(i => i.status === 'new').length;
        if (badgeInq) {
          badgeInq.textContent = newCount > 0 ? `${newCount} New` : allInquiriesList.length;
          badgeInq.style.background = newCount > 0 ? 'var(--cr)' : 'var(--rule-heavy)';
        }
        const statInq = document.getElementById('statInquiriesNum');
        const statInqSub = document.getElementById('statNewInquiriesSub');
        if (statInq) statInq.textContent = allInquiriesList.length;
        if (statInqSub) {
          statInqSub.textContent = newCount > 0 ? `${newCount} New / Unread Brief${newCount === 1 ? '' : 's'}` : 'All caught up';
        }
      }
    }
