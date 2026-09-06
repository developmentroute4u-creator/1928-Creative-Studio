/* ================================================================
   1928 CREATIVE STUDIO — footer-loader.js
   Dynamically loads footer.html into #footer-placeholder across all pages
   and initializes full interactive logo emergence & physics choreography.
================================================================ */
(function () {
  'use strict';

  const FOOTER_HTML = `<!-- §7 — MODERN EDITORIAL LUXURY FOOTER -->
<footer id="footer-driver">
  <div class="footer-luxury-card">

    <!-- Top Grid: Statement, Links, Socials, CTA -->
    <div class="f-header-grid">
      <div class="f-desc-col">
        <p class="f-desc-text">1928 Creative Studio is an independent branding &amp; design consultancy based in
          Ahmedabad.</p>
      </div>

      <div class="f-nav-col">
        <div class="f-col-label">Explore</div>
        <ul class="f-links-clean">
          <li><a href="index.html">Home</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="blogs.html">Perspectives</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>

      <div class="f-social-col">
        <div class="f-col-label">Follow us</div>
        <div class="f-social-chips">
          <a href="https://twitter.com" target="_blank" rel="noopener" class="f-chip">
            <span class="f-chip-icon">𝕏</span>
            <span>@1928creativestudio</span>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener" class="f-chip">
            <span class="f-chip-icon">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
                stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </span>
            <span>@1928creativestudio</span>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener" class="f-chip">
            <span class="f-chip-icon">in</span>
            <span>@1928creativestudio</span>
          </a>
          <a href="https://behance.net" target="_blank" rel="noopener" class="f-chip">
            <span class="f-chip-icon">Bē</span>
            <span>@1928creativestudio</span>
          </a>
        </div>
      </div>

      <div class="f-cta-column">
        <a href="contact.html" class="f-action-pill cta-primary">
          <div class="f-action-txt">
            <span class="f-action-heading">Call 1928 Creative Studio</span>
            <span class="f-action-sub">Let's work together</span>
          </div>
          <div class="f-action-arrow">↗</div>
        </a>

        <a href="services.html" class="f-action-pill cta-secondary">
          <div class="f-action-txt">
            <span class="f-action-heading">Studio Work &amp; Inquiry</span>
            <span class="f-action-sub">Creative capabilities</span>
          </div>
          <div class="f-action-arrow">↗</div>
        </a>
      </div>
    </div>

    <!-- Bottom Cluster: Full-Bleed 50% Sliced Headline touching the Line + Meta Bar -->
    <div class="f-bottom-cluster">
      <div class="f-giant-cut-wrap" id="footerCutWrap">
        <svg class="f-giant-cut-svg" id="footerCutSvg" viewBox="0 0 1600 65" preserveAspectRatio="none">
          <text x="0" y="115" font-family="'Gotham', 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900"
            font-size="140" fill="currentColor" textLength="1600" lengthAdjust="spacingAndGlyphs"
            letter-spacing="-0.03em">1928 CREATIVE STUDIO</text>
        </svg>
      </div>

      <!-- Sub-Footer Meta Bar with Horizontal Line Divider -->
      <div class="f-meta-bar">
        <div class="f-meta-links">
          <span>1928 Creative Studio © 2026</span>
          <span>·</span>
          <a href="#">Privacy Policy</a>
          <span>·</span>
          <a href="#">Studio Terms</a>
          <span>·</span>
          <span>Design and developed by <a href="https://uxwithjaythaker.vercel.app/" target="_blank" rel="noopener" class="f-credit-author">UXWITHJAYTHAKER</a></span>
        </div>
        <div class="f-live-status">
          <span class="f-status-dot"></span>
          <span id="footer-live-clock">Ahmedabad, India · 10:42 PM · 28°C ☀</span>
        </div>
      </div>
    </div>

  </div>
</footer>`;

  function initLiveClock() {
    function updateClock() {
      const clockEl = document.getElementById('footer-live-clock') || document.getElementById('liveClock');
      if (!clockEl) return;
      const now = new Date();
      const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true };
      const timeStr = now.toLocaleTimeString('en-US', options);
      clockEl.textContent = `Ahmedabad, India · ${timeStr} · 28°C ☀`;
    }
    updateClock();
    setInterval(updateClock, 30000);
  }

  function initFooterAnimation() {
    const footerDriver = document.getElementById('footer-driver');
    const footerCutWrap = document.querySelector('.f-giant-cut-wrap');
    const footerCutSvg = document.querySelector('.f-giant-cut-svg');
    const footerCutText = document.querySelector('.f-giant-cut-svg text');
    const luxuryCard = document.querySelector('.footer-luxury-card');

    if (!footerDriver || !footerCutWrap || !footerCutSvg) return;

    function clamp(v, lo, hi) { return Math.min(Math.max(v, lo), hi); }

    let logoPull = 0; // -0.35 to 1.0
    let logoVelocity = 0;
    let isInteractingLogo = false;
    let logoWheelTimer = null;
    let springRunning = false;

    function applyLogoPhysics(p) {
      if (!footerCutWrap || !footerCutSvg) return;

      const baseH = footerCutWrap.offsetWidth * 0.052;
      const safeBaseH = Math.max(34, Math.min(84, baseH));

      if (p >= 0) {
        // ── Scrolling More: Logo emerges out from the line to reveal 100% full text ──
        const targetH = safeBaseH * (1 + p * 1.05);
        footerCutWrap.style.height = `${targetH}px`;
        footerCutSvg.style.height = `${targetH}px`;

        const targetVbH = 65 + p * 65;
        footerCutSvg.setAttribute('viewBox', `0 0 1600 ${targetVbH}`);

        const liftY = p * 4;
        if (footerCutText) {
          footerCutText.style.transform = `translateY(${liftY}px)`;
        }
        footerCutWrap.style.transform = `scaleY(1) scaleX(1)`;
      } else {
        // ── Scrolling Up: Tightness / Tension resistance effect ──
        const absP = Math.abs(p);
        const targetH = safeBaseH * (1 - absP * 0.16);
        footerCutWrap.style.height = `${targetH}px`;
        footerCutSvg.style.height = `${targetH}px`;

        const targetVbH = 65 - absP * 10;
        footerCutSvg.setAttribute('viewBox', `0 0 1600 ${targetVbH}`);

        footerCutWrap.style.transform = `scaleY(${1 - absP * 0.10}) scaleX(${1 + absP * 0.025})`;
        if (footerCutText) {
          footerCutText.style.transform = `translateY(0)`;
        }
      }
    }

    function stepLogoSpring() {
      if (!isInteractingLogo) {
        const stiffness = 0.14;
        const damping = 0.78;
        const force = -stiffness * logoPull;
        logoVelocity = (logoVelocity + force) * damping;
        logoPull += logoVelocity;

        if (Math.abs(logoPull) < 0.001 && Math.abs(logoVelocity) < 0.001) {
          logoPull = 0;
          logoVelocity = 0;
          applyLogoPhysics(0);
          springRunning = false;
          return;
        }
      }

      applyLogoPhysics(logoPull);
      requestAnimationFrame(stepLogoSpring);
    }

    function triggerLogoSpring() {
      if (!springRunning) {
        springRunning = true;
        requestAnimationFrame(stepLogoSpring);
      }
    }

    // Scroll handler for auto-emergence when scrolling over footer
    function onScrollFooter() {
      if (!footerDriver) return;
      if (isInteractingLogo) return;

      const vh = window.innerHeight;
      const rect = footerDriver.getBoundingClientRect();
      if (rect.top <= vh) {
        const footerInViewP = clamp((vh - rect.top) / (rect.height * 0.75), 0, 1);
        const autoEmergence = clamp((footerInViewP - 0.55) / 0.45, 0, 1);
        applyLogoPhysics(autoEmergence);
      } else {
        applyLogoPhysics(0);
      }
    }

    // Bind scroll event (throttled with RAF)
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        requestAnimationFrame(() => {
          onScrollFooter();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });

    // Initial call
    onScrollFooter();

    // Wheel listener for interactive scroll over footer
    window.addEventListener('wheel', (e) => {
      if (!footerDriver) return;
      const rect = footerDriver.getBoundingClientRect();
      const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60);

      if (rect.top <= window.innerHeight * 0.35 || isAtBottom) {
        if (e.deltaY > 0 || (e.deltaY < 0 && logoPull > 0.05)) {
          if (e.cancelable) e.preventDefault();
        }

        isInteractingLogo = true;
        if (e.deltaY > 0) {
          logoPull = Math.min(1.0, logoPull + Math.abs(e.deltaY) * 0.006);
        } else if (e.deltaY < 0) {
          logoPull = Math.max(-0.35, logoPull - Math.abs(e.deltaY) * 0.005);
        }

        triggerLogoSpring();

        clearTimeout(logoWheelTimer);
        logoWheelTimer = setTimeout(() => {
          isInteractingLogo = false;
          triggerLogoSpring();
        }, 180);
      }
    }, { passive: false });

    // Touch listener for mobile devices
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!footerDriver) return;
      const rect = footerDriver.getBoundingClientRect();
      const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60);
      if (rect.top <= window.innerHeight * 0.35 || isAtBottom) {
        const deltaY = touchStartY - e.touches[0].clientY;
        if (deltaY > 0 || (deltaY < 0 && logoPull > 0.05)) {
          if (e.cancelable) e.preventDefault();
        }
        isInteractingLogo = true;
        if (deltaY > 0) {
          logoPull = Math.min(1.0, logoPull + deltaY * 0.006);
        } else {
          logoPull = Math.max(-0.35, logoPull + deltaY * 0.005);
        }
        triggerLogoSpring();
      }
    }, { passive: false });

    window.addEventListener('touchend', () => {
      clearTimeout(logoWheelTimer);
      logoWheelTimer = setTimeout(() => {
        isInteractingLogo = false;
        triggerLogoSpring();
      }, 140);
    }, { passive: true });

    // Mouse drag hold support on the footer card
    if (luxuryCard) {
      let isMouseDownCard = false;
      let dragStartY = 0;
      luxuryCard.addEventListener('mousedown', (e) => {
        isMouseDownCard = true;
        dragStartY = e.clientY;
        isInteractingLogo = true;
      });

      window.addEventListener('mousemove', (e) => {
        if (!isMouseDownCard) return;
        const deltaY = dragStartY - e.clientY;
        if (deltaY > 0) {
          logoPull = Math.min(1.0, logoPull + deltaY * 0.01);
        } else {
          logoPull = Math.max(-0.35, logoPull + deltaY * 0.01);
        }
        triggerLogoSpring();
      });

      window.addEventListener('mouseup', () => {
        if (isMouseDownCard) {
          isMouseDownCard = false;
          clearTimeout(logoWheelTimer);
          logoWheelTimer = setTimeout(() => {
            isInteractingLogo = false;
            triggerLogoSpring();
          }, 120);
        }
      });
    }
  }

  function injectFooterHTML(html) {
    const placeholder = document.getElementById('footer-placeholder');
    if (placeholder) {
      placeholder.outerHTML = html;
      initLiveClock();
      initFooterAnimation();
      window.dispatchEvent(new Event('footerLoaded'));
      return true;
    }
    return false;
  }

  function loadFooterComponent() {
    if (document.getElementById('footer-driver')) {
      initLiveClock();
      initFooterAnimation();
      return;
    }

    fetch('footer.html')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.text();
      })
      .then(html => {
        injectFooterHTML(html);
      })
      .catch(() => {
        // Fallback for file:// protocol or offline environments
        injectFooterHTML(FOOTER_HTML);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFooterComponent);
  } else {
    loadFooterComponent();
  }
})();
