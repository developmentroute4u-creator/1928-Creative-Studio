/* ================================================================
   1928 CREATIVE STUDIO — footer-loader.js
   Dynamically loads footer.html into #footer-placeholder across all pages
   and initializes full interactive logo emergence & physics choreography.
================================================================ */
(function () {
  'use strict';

  try {
    sessionStorage.setItem('1928_site_visited', 'true');
  } catch (e) {}

  const FOOTER_HTML = `<!-- §7 — MODERN EDITORIAL LUXURY FOOTER -->
<footer id="footer-driver">
  <div class="footer-luxury-card">

    <!-- Top Grid: Statement + Socials, Explore Links, Legal & Policy, CTA -->
    <div class="f-header-grid">
      <div class="f-desc-col">
        <h3 class="f-statement-title" style="font-family:var(--font-primary);font-size:1.15rem;font-weight:700;margin-bottom:8px;color:var(--ink);letter-spacing:-0.01em;">We build brands that create value.</h3>
        <p class="f-desc-text">1928 Creative Studio is an independent creative studio helping ambitious businesses shape distinctive brands, digital experiences, and meaningful connections.</p>
        <div class="f-location-tag" style="font-family:var(--font-mono);font-size:0.75rem;letter-spacing:1px;color:var(--ink-mid);margin:12px 0 16px;text-transform:uppercase;">India · Global</div>
        <div class="f-social-circles">
          <a href="https://instagram.com" target="_blank" rel="noopener" class="f-circle-btn" aria-label="Instagram">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener" class="f-circle-btn" aria-label="LinkedIn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.39 9.74v-8.37H5.07v8.37h2.78z"/>
            </svg>
          </a>
          <a href="https://behance.net" target="_blank" rel="noopener" class="f-circle-btn" aria-label="Behance">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-4.084 0-5.625-3.003-5.625-6 0-3.328 1.979-6 5.625-6 3.747 0 5.154 2.662 4.943 5.485h-7.697c.071 1.626.966 3.515 3.013 3.515 1.554 0 2.457-.866 2.842-1.5h2zm-2.884-5c-.073-1.04-.694-2.515-2.217-2.515-1.572 0-2.22 1.378-2.348 2.515h4.565zm-14.842 8h-6v-16h6.732c3.489 0 5.268 1.705 5.268 4.398 0 1.616-.867 2.889-2.027 3.559 1.547.625 2.527 2.057 2.527 3.864 0 2.825-2.037 4.179-5.5 4.179zm-3.5-13.5v4.5h3.048c1.556 0 2.452-.697 2.452-2.25 0-1.553-.896-2.25-2.452-2.25h-3.048zm0 7v4.5h3.297c1.785 0 2.703-.787 2.703-2.25 0-1.463-.918-2.25-2.703-2.25h-3.297z"/>
            </svg>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener" class="f-circle-btn" aria-label="X (Twitter)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </div>
      </div>

      <div class="f-nav-col">
        <div class="f-col-label">Explore</div>
        <ul class="f-links-clean">
          <li><a href="index.html">Home</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="portfolio.html">Work</a></li>
          <li><a href="blogs.html">Perspectives</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>

      <div class="f-nav-col">
        <div class="f-col-label">Studio &amp; Legal</div>
        <ul class="f-links-clean">
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Studio Terms</a></li>
          <li><a href="#">Client Agreement</a></li>
          <li><a href="#">Cookie Policy</a></li>
        </ul>
      </div>

      <div class="f-cta-column">
        <a href="contact.html" class="f-action-pill cta-primary">
          <div class="f-action-txt">
            <span class="f-action-heading">Have a brand to build?</span>
            <span class="f-action-sub">START A PROJECT →</span>
          </div>
          <div class="f-action-arrow">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </a>

        <a href="contact.html" class="f-action-pill cta-secondary">
          <div class="f-action-txt">
            <span class="f-action-heading">Let’s talk about your project</span>
            <span class="f-action-sub">Tell us what you're building →</span>
          </div>
          <div class="f-action-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </a>
      </div>
    </div>

    <!-- Bottom Cluster: Full-Bleed 50% Sliced Headline reaching the very bottom of the card -->
    <div class="f-bottom-cluster">
      <div class="f-giant-cut-wrap" id="footerCutWrap">
        <svg class="f-giant-cut-svg" id="footerCutSvg" viewBox="0 0 1600 65" preserveAspectRatio="none">
          <text x="0" y="115" font-family="'Gotham', 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900"
            font-size="140" fill="currentColor" textLength="1600" lengthAdjust="spacingAndGlyphs"
            letter-spacing="-0.03em">1928 CREATIVE STUDIO</text>
        </svg>
      </div>
      <div class="f-bottom-line"></div>
    </div>

  </div>

  <!-- Below/outside the luxury card: Copyright on left, Developer attribution on right -->
  <div class="f-outer-bar">
    <div class="f-outer-copyright">
      <span>1928 Creative Studio © 2026</span>
    </div>
    <div class="f-outer-dev">
      <span>Design and developed by <a href="https://uxwithjaythaker.vercel.app/" target="_blank" rel="noopener" class="f-outer-author">UXWITHJAYTHAKER</a></span>
    </div>
  </div>
</footer>`;

  function initLiveClock() {
    // Location removed per design requirements
  }

  function initFooterAnimation() {
    const footerDriver = document.getElementById('footer-driver');
    const footerCutWrap = document.querySelector('.f-giant-cut-wrap') || document.getElementById('footerCutWrap');
    const footerCutSvg = document.querySelector('.f-giant-cut-svg') || document.getElementById('footerCutSvg');
    const footerCutText = footerCutSvg ? footerCutSvg.querySelector('text') : null;
    const luxuryCard = document.querySelector('.footer-luxury-card');
    const bottomCluster = document.querySelector('.f-bottom-cluster');
    const bottomLine = document.querySelector('.f-bottom-line');

    if (!footerDriver || !footerCutWrap || !footerCutSvg) return;

    let logoPull = 0; // 0 to 1.0
    let logoVelocity = 0;
    let isInteractingLogo = false;
    let logoWheelTimer = null;
    let springRunning = false;
    let tensionPhase = 0;

    function applyLogoPhysics(p, isStruggling = false) {
      if (!footerCutWrap || !footerCutSvg) return;

      const baseH = footerCutWrap.offsetWidth * 0.052;
      const safeBaseH = Math.max(34, Math.min(88, baseH));

      if (p > 0.001) {
        // Emerges upwards towards the Contact item in Explore with smooth, stable elevation
        const targetH = safeBaseH * (1 + p * 2.15);
        footerCutWrap.style.height = `${targetH}px`;
        footerCutSvg.style.height = `${targetH}px`;

        const targetVbH = 65 + p * 130;
        footerCutSvg.setAttribute('viewBox', `0 0 1600 ${targetVbH}`);

        const liftY = p * 12;
        if (footerCutText) {
          footerCutText.style.transform = `translateY(${liftY}px)`;
        }

        if (isStruggling && p > 0.08) {
          // Progressive tension vibration: subtle at low stretch, escalating smoothly towards the peak
          tensionPhase += 0.28;
          const tension = Math.min(1, Math.max(0, p));
          const intensity = Math.pow(tension, 2.2);

          const shakeX = Math.sin(tensionPhase * 15.0) * 1.35 * intensity;
          const shakeY = Math.cos(tensionPhase * 20.0) * 0.85 * intensity;
          const shakeRot = Math.sin(tensionPhase * 11.0) * 0.18 * intensity;

          footerCutWrap.style.transformOrigin = 'center bottom';
          footerCutWrap.style.transform = `translate3d(${shakeX.toFixed(2)}px, ${shakeY.toFixed(2)}px, 0) rotate(${shakeRot.toFixed(2)}deg) scale(1)`;

          if (bottomLine) {
            const linePulse = Math.sin(tensionPhase * 14.0) * 0.12 * intensity;
            bottomLine.style.transform = `scaleY(${1 + p * 1.2 + linePulse})`;
            bottomLine.style.background = 'var(--cr)';
            bottomLine.style.boxShadow = `0 0 ${8 + p * 12}px var(--cr)`;
          }
        } else {
          footerCutWrap.style.transformOrigin = 'center bottom';
          footerCutWrap.style.transform = `translate3d(0, 0, 0) rotate(0deg) scale(1)`;

          if (bottomLine) {
            bottomLine.style.transform = `scaleY(${1 + p * 1.2})`;
            bottomLine.style.background = 'var(--cr)';
            bottomLine.style.boxShadow = `0 0 ${8 + p * 12}px var(--cr)`;
          }
        }
      } else {
        // Original half-cut resting state (exact 50% sliced logo & word on the bottom line)
        footerCutWrap.style.height = `${safeBaseH}px`;
        footerCutSvg.style.height = `${safeBaseH}px`;
        footerCutSvg.setAttribute('viewBox', '0 0 1600 65');
        footerCutWrap.style.transform = 'translate3d(0, 0, 0) rotate(0deg) scale(1)';
        if (footerCutText) {
          footerCutText.style.transform = 'translateY(0)';
        }
        if (bottomLine) {
          bottomLine.style.transform = 'none';
          bottomLine.style.background = 'var(--rule)';
          bottomLine.style.boxShadow = 'none';
        }
      }
    }

    function stepLogoSpring() {
      if (!isInteractingLogo) {
        // Soft, smooth deceleration return to resting position
        const stiffness = 0.12;
        const damping = 0.82;
        const force = -stiffness * logoPull;
        logoVelocity = (logoVelocity + force) * damping;
        logoPull += logoVelocity;

        if (Math.abs(logoPull) < 0.001 && Math.abs(logoVelocity) < 0.001) {
          logoPull = 0;
          logoVelocity = 0;
          applyLogoPhysics(0, false);
          springRunning = false;
          return;
        }
        applyLogoPhysics(logoPull, false);
      } else {
        applyLogoPhysics(logoPull, true);
      }

      requestAnimationFrame(stepLogoSpring);
    }

    function triggerLogoSpring() {
      if (!springRunning) {
        springRunning = true;
        requestAnimationFrame(stepLogoSpring);
      }
    }

    // Initial resting state (exact 50% sliced logo)
    applyLogoPhysics(0, false);

    // ── Touchpad Scroll vs. Mouse Wheel Listener ─────────────────────
    window.addEventListener('wheel', (e) => {
      if (!footerDriver) return;
      const rect = footerDriver.getBoundingClientRect();
      const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 70);
      const isCenterScreen = rect.top <= window.innerHeight * 0.52 || isAtBottom;

      // Only starts when footer reaches the center of the screen
      if (isCenterScreen) {
        const isDiscreteWheel = e.deltaMode !== 0 || Math.abs(e.deltaY) >= 80 || (Math.abs(e.deltaY) % 100 === 0 && Math.abs(e.deltaY) > 0);

        if (e.deltaY > 0 || (e.deltaY < 0 && logoPull > 0.02)) {
          if (e.cancelable && isAtBottom) e.preventDefault();
        }

        isInteractingLogo = true;

        if (e.deltaY > 0) {
          logoPull = Math.min(1.0, logoPull + Math.abs(e.deltaY) * (isDiscreteWheel ? 0.08 : 0.0035));
        } else if (e.deltaY < 0) {
          logoPull = Math.max(0, logoPull - Math.abs(e.deltaY) * (isDiscreteWheel ? 0.08 : 0.0035));
        }

        triggerLogoSpring();

        clearTimeout(logoWheelTimer);
        const timeoutMs = isDiscreteWheel ? 180 : 350;
        logoWheelTimer = setTimeout(() => {
          isInteractingLogo = false;
          triggerLogoSpring();
        }, timeoutMs);
      }
    }, { passive: false });

    // ── Touchscreen & Touchpad Touch Gestures ────────────────────────
    const targets = [footerCutWrap, bottomCluster, luxuryCard].filter(Boolean);

    let touchStartY = 0;
    targets.forEach(target => {
      target.addEventListener('touchstart', (e) => {
        if (!e.target.closest('a, button, input, textarea')) {
          touchStartY = e.touches[0].clientY;
          isInteractingLogo = true;
          triggerLogoSpring();
        }
      }, { passive: true });

      target.addEventListener('mousedown', (e) => {
        if (e.button === 0 && !e.target.closest('a, button, input, textarea')) {
          isInteractingLogo = true;
          touchStartY = e.clientY;
          triggerLogoSpring();
        }
      });
    });

    window.addEventListener('touchmove', (e) => {
      if (!isInteractingLogo || !e.touches.length) return;
      const deltaY = touchStartY - e.touches[0].clientY;
      if (deltaY > 0) {
        logoPull = Math.min(1.0, deltaY * 0.006);
      } else {
        logoPull = Math.max(-0.35, deltaY * 0.005);
      }
      triggerLogoSpring();
    }, { passive: true });

    window.addEventListener('touchend', () => {
      if (isInteractingLogo) {
        clearTimeout(logoWheelTimer);
        logoWheelTimer = setTimeout(() => {
          isInteractingLogo = false;
          triggerLogoSpring();
        }, 140);
      }
    }, { passive: true });

    window.addEventListener('touchcancel', () => {
      if (isInteractingLogo) {
        isInteractingLogo = false;
        triggerLogoSpring();
      }
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
      if (!isInteractingLogo || e.buttons !== 1) return;
      const deltaY = touchStartY - e.clientY;
      if (deltaY > 0) {
        logoPull = Math.min(1.0, deltaY * 0.006);
      } else {
        logoPull = Math.max(-0.35, deltaY * 0.005);
      }
      triggerLogoSpring();
    });

    window.addEventListener('mouseup', () => {
      if (isInteractingLogo) {
        clearTimeout(logoWheelTimer);
        logoWheelTimer = setTimeout(() => {
          isInteractingLogo = false;
          triggerLogoSpring();
        }, 140);
      }
    });
  }

  function initActiveNavLinks() {
    const currentPath = window.location.pathname.toLowerCase().split('/').pop() || 'index.html';
    const isHomePage = currentPath === '' || currentPath === 'index.html' || currentPath.endsWith('index.html');
    const navLinks = document.querySelectorAll('.nav-links a');
    if (!navLinks.length) return;

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = (link.getAttribute('href') || '').toLowerCase().split('/').pop();

      if (isHomePage && (href === 'index.html' || href === '')) {
        link.classList.add('active');
      } else if (!isHomePage && href && currentPath === href) {
        link.classList.add('active');
      } else if (currentPath.includes('service') && href === 'services.html') {
        link.classList.add('active');
      } else if ((currentPath.includes('portfolio') || currentPath.includes('project')) && (href === 'portfolio.html' || href === 'work.html')) {
        link.classList.add('active');
      } else if ((currentPath.includes('blog') || currentPath.includes('perspective')) && href === 'blogs.html') {
        link.classList.add('active');
      } else if (currentPath.includes('about') && href === 'about.html') {
        link.classList.add('active');
      } else if (currentPath.includes('contact') && href === 'contact.html') {
        link.classList.add('active');
      }
    });
  }

  function injectFooterHTML(html) {
    const placeholder = document.getElementById('footer-placeholder');
    if (placeholder) {
      placeholder.outerHTML = html;
      initLiveClock();
      initFooterAnimation();
      initActiveNavLinks();
      window.dispatchEvent(new Event('footerLoaded'));
      return true;
    }
    return false;
  }

  function loadFooterComponent() {
    initActiveNavLinks();

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
