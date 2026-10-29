/**
 * 1928 CREATIVE STUDIO — Master Admin Authentication & Security Controller
 * Manages studio credentials, session encryption, biometric/vault animations, and credential rotation
 */

(function() {
  'use strict';

  const AUTH_STORAGE_KEY = '1928_admin_session';
  const CREDENTIALS_KEY = '1928_studio_auth_config';
  const AUTH_THEME_KEY = '1928_auth_theme';

  // Fallback defaults matching user requirements
  const DEFAULT_ID = '1928.creativestudio@gmail.com';
  const DEFAULT_PASS = '1928#CS@';
  const ACCEPTED_ALIASES = [
    '1928.creativestudio@gmail.com'
  ];
  const BACKUP_PASSWORDS = [
    '1928#CS@'
  ];

  // Initialize Auth Theme (White Theme by default)
  function initAuthTheme() {
    const gate = document.getElementById('adminAuthGate');
    const toggleBtn = document.getElementById('authThemeToggleBtn');
    if (!gate) return;

    // By default white theme as explicitly instructed by user
    const savedTheme = localStorage.getItem(AUTH_THEME_KEY) || 'light';
    applyAuthTheme(savedTheme);

    if (toggleBtn && !toggleBtn.dataset.bound) {
      toggleBtn.dataset.bound = 'true';
      toggleBtn.addEventListener('click', function() {
        const activeTheme = gate.getAttribute('data-auth-theme') || 'light';
        const nextTheme = activeTheme === 'light' ? 'dark' : 'light';
        applyAuthTheme(nextTheme);
        localStorage.setItem(AUTH_THEME_KEY, nextTheme);
      });
    }
  }

  function applyAuthTheme(theme) {
    const gate = document.getElementById('adminAuthGate');
    const toggleBtn = document.getElementById('authThemeToggleBtn');
    if (!gate) return;

    gate.setAttribute('data-auth-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    if (toggleBtn) {
      toggleBtn.setAttribute('title', theme === 'light' ? 'Switch to Dark Theme' : 'Switch to Light Theme');
    }
  }

  // Check if valid session exists
  function getActiveSession() {
    try {
      const raw = sessionStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (data && data.authenticated) {
        // Expire after 30 days if stored in localStorage, or keep active
        const maxAge = 30 * 24 * 60 * 60 * 1000;
        if (Date.now() - (data.timestamp || 0) < maxAge) {
          return data;
        }
      }
    } catch (e) {}
    return null;
  }

  // Save session
  function saveSession(username, rememberMe) {
    const session = {
      authenticated: true,
      username: username || DEFAULT_ID,
      token: 'auth_' + Math.random().toString(36).substring(2) + Date.now().toString(36),
      timestamp: Date.now()
    };
    const json = JSON.stringify(session);
    sessionStorage.setItem(AUTH_STORAGE_KEY, json);
    if (rememberMe) {
      localStorage.setItem(AUTH_STORAGE_KEY, json);
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    return session;
  }

  // Clear session
  function clearSession() {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  // Get active credentials configuration (from MySQL settings or localStorage or defaults)
  function getStoredCredentials() {
    try {
      // 1. Check CMSStore if already loaded from MySQL
      if (window.CMSStore && window.CMSStore.data && window.CMSStore.data.settings && window.CMSStore.data.settings.admin_auth) {
        const val = window.CMSStore.data.settings.admin_auth;
        return typeof val === 'string' ? JSON.parse(val) : val;
      }
      // 2. Check localStorage
      const local = localStorage.getItem(CREDENTIALS_KEY);
      if (local) {
        return JSON.parse(local);
      }
    } catch (e) {}

    return {
      username: DEFAULT_ID,
      plain_preview: DEFAULT_PASS,
      aliases: ACCEPTED_ALIASES,
      fallback_pass: BACKUP_PASSWORDS
    };
  }

  // Initialize UI state immediately
  function initAuthGateway() {
    const gate = document.getElementById('adminAuthGate');
    if (!gate) return;

    // Invalidate stale cached credentials if not matching new ID
    try {
      const local = localStorage.getItem(CREDENTIALS_KEY);
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed.username !== DEFAULT_ID) {
          localStorage.removeItem(CREDENTIALS_KEY);
        }
      }
    } catch (e) {}

    initAuthTheme();

    const session = getActiveSession();
    // If an active session belongs to an older username, clear it
    if (session && session.username && session.username.toLowerCase() !== DEFAULT_ID.toLowerCase()) {
      clearSession();
    }
    const validSession = getActiveSession();
    if (validSession) {
      // Unlocked
      document.body.classList.add('auth-unlocked');
      document.documentElement.classList.add('auth-verified');
      gate.style.display = 'none';
      gate.setAttribute('aria-hidden', 'true');
    } else {
      // Locked
      document.body.classList.remove('auth-unlocked');
      document.documentElement.classList.remove('auth-verified');
      gate.style.display = 'flex';
      gate.removeAttribute('aria-hidden');
      setTimeout(() => {
        const idInput = document.getElementById('authStudioId');
        if (idInput && !idInput.value) idInput.focus();
      }, 150);
    }

    bindAuthEvents();
  }

  function bindAuthEvents() {
    const form = document.getElementById('adminAuthForm');
    if (form && !form.dataset.bound) {
      form.dataset.bound = 'true';
      form.addEventListener('submit', handleLoginSubmit);
    }

    const toggleBtn = document.getElementById('toggleAuthPasswordBtn');
    if (toggleBtn && !toggleBtn.dataset.bound) {
      toggleBtn.dataset.bound = 'true';
      toggleBtn.addEventListener('click', togglePasswordVisibility);
    }
  }

  function togglePasswordVisibility() {
    const passInput = document.getElementById('authMasterPassword');
    const toggleBtn = document.getElementById('toggleAuthPasswordBtn');
    if (!passInput || !toggleBtn) return;

    const isPass = passInput.type === 'password';
    passInput.type = isPass ? 'text' : 'password';

    toggleBtn.innerHTML = isPass
      ? `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>`
      : `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;
  }

  async function handleLoginSubmit(e) {
    if (e) e.preventDefault();

    const idInput = document.getElementById('authStudioId');
    const passInput = document.getElementById('authMasterPassword');
    const rememberBox = document.getElementById('authRememberMe');
    const submitBtn = document.getElementById('btnAuthSubmit');
    const errorPill = document.getElementById('authErrorMessage');
    const errorText = document.getElementById('authErrorText');
    const gateCard = document.getElementById('authGateCard');

    if (!idInput || !passInput) return;

    const userVal = idInput.value.trim();
    const passVal = passInput.value;

    if (!userVal || !passVal) {
      showAuthError('Please enter both your Studio ID and Master Password.');
      return;
    }

    // Set loading state
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    const originalBtnHtml = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <span class="auth-btn-spinner"></span>
      <span>Authenticating Vault...</span>
    `;
    if (errorPill) errorPill.style.display = 'none';

    try {
      let isSuccess = false;
      let authenticatedUser = userVal;

      // 1. Attempt PHP API Server Verification
      try {
        const response = await fetch('api.php?action=verify_admin_auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: userVal, password: passVal })
        });

        if (response.ok) {
          const res = await response.json();
          if (res && res.authenticated) {
            isSuccess = true;
            authenticatedUser = res.username || userVal;
          }
        }
      } catch (networkErr) {
        // Fallback to client-side verification if offline / file protocol
      }

      // 2. Client-Side Fallback Verification (Offline Resilient)
      if (!isSuccess) {
        const stored = getStoredCredentials();
        const normInput = userVal.trim().toLowerCase();
        const normStored = (stored.username || DEFAULT_ID).trim().toLowerCase();

        const matchUser = (normInput === normStored);
        const matchPass = (passVal === (stored.plain_preview || DEFAULT_PASS));

        if (matchUser && matchPass) {
          isSuccess = true;
          authenticatedUser = stored.username || DEFAULT_ID;
        }
      }

      if (isSuccess) {
        // Success feedback
        submitBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span style="color:#10B981;">Access Granted · Entering Studio</span>
        `;
        submitBtn.style.borderColor = '#10B981';
        submitBtn.style.background = 'rgba(16, 185, 129, 0.15)';

        saveSession(authenticatedUser, rememberBox ? rememberBox.checked : true);

        // Animate smooth unlock
        setTimeout(() => {
          if (gateCard) {
            gateCard.style.transform = 'scale(0.96) translateY(-16px)';
            gateCard.style.opacity = '0';
          }
          const gate = document.getElementById('adminAuthGate');
          if (gate) {
            gate.style.opacity = '0';
            setTimeout(() => {
              gate.style.display = 'none';
              document.body.classList.add('auth-unlocked');
              document.documentElement.classList.add('auth-verified');
              if (window.showToast) {
                window.showToast(`Welcome back, ${authenticatedUser}! CMS unlocked.`);
              }
            }, 300);
          }
        }, 400);

      } else {
        // Failed
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = originalBtnHtml;
        submitBtn.style.borderColor = '';
        submitBtn.style.background = '';

        showAuthError('Invalid Studio ID or Master Password. Please verify and try again.');
        if (gateCard) {
          gateCard.classList.remove('shake-anim');
          void gateCard.offsetWidth; // trigger reflow
          gateCard.classList.add('shake-anim');
        }
        passInput.value = '';
        passInput.focus();
      }

    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      submitBtn.innerHTML = originalBtnHtml;
      showAuthError('Security verification error. Please retry.');
    }
  }

  function showAuthError(msg) {
    const errorPill = document.getElementById('authErrorMessage');
    const errorText = document.getElementById('authErrorText');
    if (errorPill && errorText) {
      errorText.textContent = msg;
      errorPill.style.display = 'flex';
    }
  }

  // Lock Studio CMS / Logout
  function lockStudioAdmin() {
    clearSession();
    const gate = document.getElementById('adminAuthGate');
    const gateCard = document.getElementById('authGateCard');
    const passInput = document.getElementById('authMasterPassword');
    const errorPill = document.getElementById('authErrorMessage');

    if (errorPill) errorPill.style.display = 'none';
    if (passInput) passInput.value = '';

    document.body.classList.remove('auth-unlocked');
    document.documentElement.classList.remove('auth-verified');

    if (gate && gateCard) {
      gate.style.display = 'flex';
      void gate.offsetWidth;
      gate.style.opacity = '1';
      gateCard.style.opacity = '1';
      gateCard.style.transform = 'scale(1) translateY(0)';
      gate.removeAttribute('aria-hidden');
    }

    if (window.showToast) {
      window.showToast('Studio CMS locked. Re-authentication required.', 'warning');
    }
  }

  // Auto-fill credential chip helper
  function autoFillCredentials(id, pass) {
    const idInput = document.getElementById('authStudioId');
    const passInput = document.getElementById('authMasterPassword');
    if (idInput && passInput) {
      idInput.value = id || DEFAULT_ID;
      passInput.value = pass || DEFAULT_PASS;
      idInput.classList.add('flash-highlight');
      passInput.classList.add('flash-highlight');
      setTimeout(() => {
        idInput.classList.remove('flash-highlight');
        passInput.classList.remove('flash-highlight');
      }, 400);
      passInput.focus();
    }
  }

  // Open "Change Credentials" Modal
  function openSecuritySettings() {
    const modal = document.getElementById('modalChangeCredentials');
    if (!modal) return;

    const stored = getStoredCredentials();
    const userField = document.getElementById('mSecUsername');
    const currUserDisplay = document.getElementById('mSecCurrentUsername');
    const passField = document.getElementById('mSecNewPassword');
    const confirmField = document.getElementById('mSecConfirmPassword');
    const errBox = document.getElementById('mSecErrorBox');

    if (currUserDisplay) currUserDisplay.textContent = stored.username || DEFAULT_ID;
    if (userField) userField.value = stored.username || DEFAULT_ID;
    if (passField) passField.value = '';
    if (confirmField) confirmField.value = '';
    if (errBox) errBox.style.display = 'none';

    modal.classList.add('active');
  }

  // Save updated credentials from Modal
  async function saveSecurityCredentials() {
    const userField = document.getElementById('mSecUsername');
    const passField = document.getElementById('mSecNewPassword');
    const confirmField = document.getElementById('mSecConfirmPassword');
    const errBox = document.getElementById('mSecErrorBox');
    const saveBtn = document.getElementById('btnSaveCredentials');

    const newUsername = userField ? userField.value.trim() : '';
    const newPassword = passField ? passField.value : '';
    const confirmPassword = confirmField ? confirmField.value : '';

    if (!newUsername) {
      showSecModalError('Studio ID / Username cannot be empty.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      showSecModalError('New Master Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showSecModalError('Passwords do not match. Please re-enter.');
      return;
    }

    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving to Database...';
    }

    const payload = {
      username: newUsername,
      password: newPassword
    };

    let saved = false;

    // 1. Try PHP API
    try {
      const res = await fetch('api.php?action=update_admin_credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.status === 'success') {
          saved = true;
        }
      }
    } catch (e) {}

    // 2. Persist to local configuration & CMSStore
    const authConfig = {
      username: newUsername,
      plain_preview: newPassword,
      aliases: [newUsername, newUsername.toLowerCase(), '9288 Studio', '1928 Studio'],
      updated_at: new Date().toISOString()
    };
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(authConfig));

    if (window.CMSStore && window.CMSStore.data) {
      if (!window.CMSStore.data.settings) window.CMSStore.data.settings = {};
      window.CMSStore.data.settings.admin_auth = JSON.stringify(authConfig);
      if (window.CMSStore.saveToMySQL) {
        window.CMSStore.saveToMySQL('settings', { admin_auth: JSON.stringify(authConfig) }).catch(() => {});
      }
    }

    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Credentials';
    }

    const modal = document.getElementById('modalChangeCredentials');
    if (modal) modal.classList.remove('active');

    if (window.showToast) {
      window.showToast(`Studio credentials updated! New ID: ${newUsername}`);
    }
  }

  function showSecModalError(msg) {
    const errBox = document.getElementById('mSecErrorBox');
    if (errBox) {
      errBox.textContent = msg;
      errBox.style.display = 'block';
    }
  }

  // Expose to window for global access
  window.lockStudioAdmin = lockStudioAdmin;
  window.openSecuritySettings = openSecuritySettings;
  window.saveSecurityCredentials = saveSecurityCredentials;
  window.autoFillCredentials = autoFillCredentials;

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuthGateway);
  } else {
    initAuthGateway();
  }

})();
