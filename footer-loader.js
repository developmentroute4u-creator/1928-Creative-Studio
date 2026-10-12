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
        <h3 class="f-statement-title">We build brands that create value.</h3>
        <p class="f-desc-text">1928 Creative Studio is an independent creative studio helping ambitious businesses shape distinctive brands, digital experiences, and meaningful connections.</p>
        <div class="f-location-tag">India · Global</div>
        <div class="f-social-circles">
          <a href="https://www.instagram.com/1928creativestudio" target="_blank" rel="noopener" class="f-circle-btn" aria-label="Instagram">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a href="https://www.facebook.com/1928Creativestudio/" target="_blank" rel="noopener" class="f-circle-btn" aria-label="Facebook">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a href="https://www.linkedin.com/company/1928-creative-studio/" target="_blank" rel="noopener" class="f-circle-btn" aria-label="LinkedIn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.39 9.74v-8.37H5.07v8.37h2.78z"/>
            </svg>
          </a>
          <a href="https://www.youtube.com/@1928creativestudio" target="_blank" rel="noopener" class="f-circle-btn" aria-label="YouTube">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
          <a href="https://www.behance.net/1928Creativestudio" target="_blank" rel="noopener" class="f-circle-btn" aria-label="Behance">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-4.084 0-5.625-3.003-5.625-6 0-3.328 1.979-6 5.625-6 3.747 0 5.154 2.662 4.943 5.485h-7.697c.071 1.626.966 3.515 3.013 3.515 1.554 0 2.457-.866 2.842-1.5h2zm-2.884-5c-.073-1.04-.694-2.515-2.217-2.515-1.572 0-2.22 1.378-2.348 2.515h4.565zm-14.842 8h-6v-16h6.732c3.489 0 5.268 1.705 5.268 4.398 0 1.616-.867 2.889-2.027 3.559 1.547.625 2.527 2.057 2.527 3.864 0 2.825-2.037 4.179-5.5 4.179zm-3.5-13.5v4.5h3.048c1.556 0 2.452-.697 2.452-2.25 0-1.553-.896-2.25-2.452-2.25h-3.048zm0 7v4.5h3.297c1.785 0 2.703-.787 2.703-2.25 0-1.463-.918-2.25-2.703-2.25h-3.297z"/>
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
        <a href="contact.html#start-project-sec" class="f-action-pill cta-primary">
          <div class="f-action-txt">
            <span class="f-action-heading">Have a brand to build?</span>
            <span class="f-action-sub">START A PROJECT</span>
          </div>
          <div class="f-action-arrow" aria-label="Message">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
        </a>

        <a href="contact.html#start-project-sec" class="f-action-pill cta-secondary">
          <div class="f-action-txt">
            <span class="f-action-heading">Let’s talk about your project</span>
            <span class="f-action-sub">Tell us what you're building</span>
          </div>
          <div class="f-action-arrow" aria-label="Call">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </div>
        </a>
      </div>
    </div>

    <!-- Bottom Cluster: Full Brand Headline with Staggered Character Emergence -->
    <div class="f-bottom-cluster">
      <div class="f-brand-title-wrap" id="footerBrandWrap">
        <h2 class="f-brand-giant-text" id="footerGiantText" aria-label="1928 CREATIVE STUDIO">
          <span class="f-char-word">
            <span class="f-char">1</span><span class="f-char">9</span><span class="f-char">2</span><span class="f-char">8</span>
          </span>
          <span class="f-char-space">&nbsp;</span>
          <span class="f-char-word">
            <span class="f-char">C</span><span class="f-char">R</span><span class="f-char">E</span><span class="f-char">A</span><span class="f-char">T</span><span class="f-char">I</span><span class="f-char">V</span><span class="f-char">E</span>
          </span>
          <span class="f-char-space">&nbsp;</span>
          <span class="f-char-word">
            <span class="f-char">S</span><span class="f-char">T</span><span class="f-char">U</span><span class="f-char">D</span><span class="f-char">I</span><span class="f-char">O</span>
          </span>
        </h2>
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
    const luxuryCard = footerDriver ? (footerDriver.querySelector('.footer-luxury-card') || footerDriver) : null;
    const footerGiantText = document.getElementById('footerGiantText') || document.querySelector('.f-brand-giant-text');
    if (!footerDriver || !footerGiantText || !luxuryCard) return;

    // Apply soft staggered transition delays character-by-character for a fast, ultra-soft wave
    const chars = footerGiantText.querySelectorAll('.f-char');
    chars.forEach((char, index) => {
      char.style.transitionDelay = `${(index * 0.026).toFixed(3)}s`;
    });

    function checkFooterScroll() {
      const cardRect = luxuryCard.getBoundingClientRect();
      const cardCenterY = cardRect.top + (cardRect.height * 0.5);
      const viewportCenterY = window.innerHeight * 0.5;

      // Trigger ONLY when the white section (card center) reaches the center of the viewport
      if (cardCenterY <= viewportCenterY + 40) {
        footerGiantText.classList.add('revealed');
      } else {
        footerGiantText.classList.remove('revealed');
      }
    }

    window.addEventListener('scroll', checkFooterScroll, { passive: true });
    window.addEventListener('resize', checkFooterScroll, { passive: true });
    checkFooterScroll();
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
