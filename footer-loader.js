/* ================================================================
   1928 CREATIVE STUDIO — footer-loader.js
   Dynamically loads footer.html into #footer-placeholder across pages
   and injects authoritative, pixel-perfect footer styles for:
   - Web view (> 768px): Matches User Reference Image 1
   - Phone view (<= 768px): Matches User Reference Image 2
   NOTE: Header/Navigation is completely untouched on phone and web.
================================================================ */
(function () {
  'use strict';

  function ensureUnifiedFooterStyles() {
    if (typeof document === 'undefined' || document.getElementById('footer-unified-styles')) return;
    const style = document.createElement('style');
    style.id = 'footer-unified-styles';
    style.textContent = `
/* ═══════════════════════════════════════════════════════════
   WEB VIEW (> 768px) — LUXURY CARD FOOTER (Reference Image 1)
   ═══════════════════════════════════════════════════════════ */
#footer-driver {
  position: relative !important;
  background: var(--bg) !important;
  min-height: 100vh !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  padding: clamp(32px, 4.5vh, 56px) clamp(24px, 3.5vw, 52px) clamp(24px, 3.5vh, 40px) !important;
  box-sizing: border-box !important;
  z-index: 10 !important;
  width: 100% !important;
}

.footer-luxury-card {
  background: var(--card-bg) !important;
  border: 1px solid var(--rule) !important;
  border-radius: clamp(36px, 5vw, 64px) !important;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.05) !important;
  padding: clamp(48px, 6vh, 68px) clamp(40px, 5vw, 72px) 0px !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
  width: 100% !important;
  max-width: 1640px !important;
  min-height: clamp(500px, 68vh, 640px) !important;
  margin: 0 auto !important;
  gap: clamp(48px, 7vh, 80px) !important;
  overflow: hidden !important;
  position: relative !important;
  box-sizing: border-box !important;
}

.f-outer-bar {
  width: 100% !important;
  max-width: 1640px !important;
  margin: clamp(28px, 4vh, 44px) auto 0 !important;
  padding: 0 clamp(16px, 2.5vw, 36px) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 16px !important;
  box-sizing: border-box !important;
}

.f-outer-copyright,
.f-outer-dev {
  font-family: var(--font-primary, 'Montserrat', sans-serif) !important;
  font-size: 0.76rem !important;
  color: var(--ink-dim) !important;
  font-weight: 400 !important;
  line-height: 1.4 !important;
}

.f-outer-dev a {
  color: var(--ink-dim) !important;
  text-decoration: none !important;
  font-weight: 400 !important;
  transition: color 0.2s !important;
}

.f-outer-dev a:hover {
  color: var(--cr, #C8102E) !important;
}

.f-header-grid {
  display: grid !important;
  grid-template-columns: 1.6fr 1fr 1fr 1.4fr !important;
  gap: clamp(28px, 3.5vw, 52px) !important;
  align-items: flex-start !important;
  width: 100% !important;
}

.f-desc-col {
  display: flex !important;
  flex-direction: column !important;
  align-items: flex-start !important;
  text-align: left !important;
}

.f-desc-col .f-statement-title {
  font-family: var(--font-primary, 'Montserrat', sans-serif) !important;
  font-weight: 800 !important;
  font-size: clamp(1.4rem, 1.85vw, 1.9rem) !important;
  line-height: 1.18 !important;
  letter-spacing: -0.025em !important;
  color: var(--ink) !important;
  margin: 0 0 12px 0 !important;
  max-width: 380px !important;
  text-align: left !important;
}

.f-title-br-mobile {
  display: none !important;
}

.f-desc-line {
  display: inline !important;
}

.f-desc-col .f-desc-text {
  font-family: var(--font-secondary, 'Raleway', sans-serif) !important;
  font-weight: 400 !important;
  font-size: 0.88rem !important;
  line-height: 1.6 !important;
  color: var(--ink-mid) !important;
  max-width: 340px !important;
  margin: 0 0 12px 0 !important;
  text-align: left !important;
}

.f-desc-col .f-location-tag {
  font-family: var(--font-mono, monospace) !important;
  font-size: 0.72rem !important;
  font-weight: 500 !important;
  letter-spacing: 0.12em !important;
  color: var(--ink-dim, var(--ink-mid)) !important;
  margin: 0 0 18px 0 !important;
  text-transform: uppercase !important;
  text-align: left !important;
}

.f-col-label {
  font-family: var(--font-primary, 'Montserrat', sans-serif) !important;
  font-weight: 700 !important;
  font-size: 0.72rem !important;
  letter-spacing: 0.16em !important;
  text-transform: uppercase !important;
  color: var(--ink-dim) !important;
  margin-bottom: 20px !important;
}

.f-links-clean {
  list-style: none !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 12px !important;
  padding: 0 !important;
  margin: 0 !important;
}

.f-links-clean li {
  margin: 0 !important;
  padding: 0 !important;
}

.f-links-clean a {
  font-family: var(--font-primary, 'Montserrat', sans-serif) !important;
  font-weight: 500 !important;
  font-size: 0.94rem !important;
  color: var(--ink-mid) !important;
  text-decoration: none !important;
  transition: color .2s, transform .2s !important;
  display: inline-block !important;
}

.f-links-clean a:hover {
  color: var(--cr, #C8102E) !important;
  transform: translateX(4px) !important;
}

.f-social-circles {
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
  flex-wrap: wrap !important;
}

.f-circle-btn {
  width: 44px !important;
  height: 44px !important;
  border-radius: 50% !important;
  background: var(--bg) !important;
  border: 1px solid var(--rule) !important;
  color: var(--ink) !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  text-decoration: none !important;
  transition: all 0.25s var(--sp, ease) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03) !important;
}

.f-circle-btn:hover {
  background: var(--ink) !important;
  color: var(--bg) !important;
  border-color: var(--ink) !important;
  transform: translateY(-3px) scale(1.06) !important;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12) !important;
}

.f-cta-column {
  display: flex !important;
  flex-direction: column !important;
  gap: 16px !important;
}

.f-desc-col .f-social-circles {
  display: flex !important;
  margin-top: 10px !important;
  justify-content: flex-start !important;
}

.f-cta-column .f-social-circles {
  display: none !important;
}

.f-action-pill {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 18px 22px !important;
  border-radius: 20px !important;
  text-decoration: none !important;
  transition: transform .25s var(--sp, ease), box-shadow .25s !important;
  box-sizing: border-box !important;
}

.f-action-pill:hover {
  transform: translateY(-3px) !important;
}

.f-action-pill.cta-primary {
  background: var(--cr, #C8102E) !important;
  color: #ffffff !important;
  box-shadow: 0 10px 28px rgba(200, 16, 46, 0.22) !important;
}

.f-action-pill.cta-secondary {
  background: var(--bg) !important;
  border: 1px solid var(--rule) !important;
  color: var(--ink) !important;
}

.f-action-pill.cta-secondary:hover {
  border-color: var(--ink) !important;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.06) !important;
}

.f-action-txt {
  display: flex !important;
  flex-direction: column !important;
  gap: 3px !important;
}

.f-action-heading {
  font-family: var(--font-primary, 'Montserrat', sans-serif) !important;
  font-weight: 700 !important;
  font-size: 0.96rem !important;
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
}

.f-action-sub {
  font-family: var(--font-primary, 'Montserrat', sans-serif) !important;
  font-size: 0.74rem !important;
  opacity: 0.78 !important;
}

.f-action-arrow {
  width: 32px !important;
  height: 32px !important;
  border-radius: 50% !important;
  display: grid !important;
  place-items: center !important;
  font-size: 0.95rem !important;
  font-weight: 700 !important;
  flex-shrink: 0 !important;
}

.cta-primary .f-action-arrow {
  background: rgba(255, 255, 255, 0.25) !important;
  color: #ffffff !important;
}

.cta-secondary .f-action-arrow {
  background: var(--ink) !important;
  color: var(--bg) !important;
}

.f-bottom-cluster {
  width: 100% !important;
  display: flex !important;
  flex-direction: column !important;
  margin-top: clamp(32px, 5vh, 60px) !important;
  margin-bottom: 0 !important;
  position: relative !important;
}

.f-brand-title-wrap {
  width: 100% !important;
  overflow: hidden !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  padding: clamp(12px, 2vw, 24px) 0 clamp(18px, 2.8vh, 32px) 0 !important;
  user-select: none !important;
  box-sizing: border-box !important;
}

.f-brand-giant-text {
  font-family: var(--font-primary, 'Montserrat', sans-serif) !important;
  font-weight: 900 !important;
  font-size: clamp(26px, 6.85vw, 110px) !important;
  line-height: 0.95 !important;
  letter-spacing: -0.03em !important;
  color: var(--ink) !important;
  text-transform: uppercase !important;
  text-align: center !important;
  margin: 0 !important;
  padding: 0 !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  flex-wrap: nowrap !important;
  white-space: nowrap !important;
  width: 100% !important;
  transform: scaleY(1.22) !important;
  transform-origin: center bottom !important;
}

.f-char-word {
  display: inline-flex !important;
  align-items: center !important;
}

.f-char-space {
  display: inline-block !important;
  width: 0.32em !important;
}

.f-char {
  display: inline-block !important;
  opacity: 0 !important;
  transform: translateY(85%) !important;
  transition-property: transform, opacity !important;
  transition-duration: 0.85s, 0.65s !important;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1), cubic-bezier(0.22, 1, 0.36, 1) !important;
  will-change: transform, opacity !important;
}

.f-brand-giant-text.revealed .f-char {
  transform: translateY(0%) !important;
  opacity: 1 !important;
}

.f-bottom-line {
  width: 100% !important;
  height: 1.5px !important;
  background: var(--rule) !important;
  margin: 0 !important;
  transition: background 0.3s !important;
}

@media (max-width: 1024px) and (min-width: 769px) {
  .f-header-grid {
    grid-template-columns: 1fr 1fr !important;
    gap: 36px !important;
  }
}

/* ═══════════════════════════════════════════════════════════
   PHONE VIEW (<= 768px) — LUXURY CARD FOOTER (Reference Image 2)
   ═══════════════════════════════════════════════════════════ */
@media (max-width: 1024px) {
  #footer-driver {
    position: relative !important;
    background: var(--bg) !important;
    min-height: 100vh !important;
    min-height: 100dvh !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    align-items: center !important;
    padding: 20px 16px !important;
    box-sizing: border-box !important;
    width: 100% !important;
  }
  .footer-luxury-card {
    flex: 0 0 auto !important;
    width: 100% !important;
    max-width: 100% !important;
    min-height: auto !important;
    height: auto !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: flex-start !important;
    padding: 28px 20px 22px 20px !important;
    gap: 16px !important;
    border-radius: 28px !important;
    border: 1px solid var(--rule) !important;
    overflow: hidden !important;
    position: relative !important;
    box-sizing: border-box !important;
  }
  .f-header-grid {
    display: grid !important;
    grid-template-columns: auto auto !important;
    justify-content: center !important;
    column-gap: clamp(24px, 8vw, 42px) !important;
    row-gap: 16px !important;
    width: 100% !important;
    margin-bottom: 0 !important;
  }
  .f-desc-col {
    grid-column: 1 / -1 !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
    width: 100% !important;
    margin: 0 auto !important;
  }
  .f-statement-title {
    text-align: center !important;
    font-size: 21px !important;
    line-height: 1.25 !important;
    margin: 0 auto 8px auto !important;
    width: 100% !important;
    max-width: 290px !important;
  }
  .f-title-br-mobile {
    display: block !important;
  }
  .f-desc-text {
    text-align: center !important;
    font-size: 0.81rem !important;
    line-height: 1.48 !important;
    max-width: 380px !important;
    margin: 0 auto 10px auto !important;
    width: 100% !important;
  }
  .f-desc-line {
    display: block !important;
  }
  .f-location-tag {
    font-size: 0.66rem !important;
    letter-spacing: 0.12em !important;
    margin: 0 auto 12px auto !important;
    text-align: center !important;
    width: 100% !important;
    display: block !important;
  }
  .f-desc-col .f-social-circles {
    display: none !important;
  }
  .f-social-circles {
    justify-content: center !important;
    margin: 0 auto !important;
    gap: 9px !important;
  }
  .f-cta-column .f-social-circles {
    display: flex !important;
    margin: 6px auto 0 auto !important;
  }
  .f-social-circles .f-circle-btn {
    width: 34px !important;
    height: 34px !important;
  }
  .f-nav-col {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
    padding: 0 4px !important;
    box-sizing: border-box !important;
  }
  .f-col-label {
    font-size: 0.70rem !important;
    letter-spacing: 0.12em !important;
    margin-bottom: 8px !important;
    color: var(--cr, #C8102E) !important;
    font-weight: 700 !important;
    text-align: center !important;
    width: 100% !important;
  }
  .f-links-clean {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
    gap: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
    list-style: none !important;
  }
  .f-links-clean li {
    margin-bottom: 6px !important;
    text-align: center !important;
    width: 100% !important;
  }
  .f-links-clean a {
    font-size: 0.84rem !important;
    line-height: 1.25 !important;
    color: var(--ink-mid) !important;
    text-align: center !important;
    display: inline-block !important;
  }
  .f-cta-column {
    grid-column: 1 / -1 !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    width: 100% !important;
    gap: 10px !important;
    margin-top: 4px !important;
  }
  .f-action-pill {
    width: 100% !important;
    max-width: 360px !important;
    box-sizing: border-box !important;
    padding: 12px 16px !important;
    border-radius: 16px !important;
  }
  .f-action-heading {
    font-size: 0.86rem !important;
  }
  .f-action-sub {
    font-size: 0.68rem !important;
  }
  .f-action-arrow {
    width: 28px !important;
    height: 28px !important;
    font-size: 0.80rem !important;
  }
  .f-bottom-cluster {
    overflow: hidden !important;
    width: 100% !important;
    max-width: 100% !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    margin-top: 14px !important;
    margin-bottom: 0 !important;
    padding: 0 !important;
    position: relative !important;
  }
  .f-brand-title-wrap {
    overflow: hidden !important;
    width: 100% !important;
    max-width: 100% !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    padding: 4px 0 2px 0 !important;
    margin-bottom: 0 !important;
    box-sizing: border-box !important;
  }
  .f-brand-giant-text {
    font-family: var(--font-primary, 'Montserrat', sans-serif) !important;
    font-weight: 900 !important;
    font-size: clamp(18px, 6.2vw, 29px) !important;
    white-space: nowrap !important;
    letter-spacing: -0.02em !important;
    line-height: 1 !important;
    width: 100% !important;
    max-width: 100% !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    transform: none !important;
    box-sizing: border-box !important;
  }
  .f-brand-giant-text .f-char {
    display: inline-block !important;
    transform: translateY(85%) !important;
    opacity: 0 !important;
    transition-property: transform, opacity !important;
    transition-duration: 0.80s, 0.60s !important;
    transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1), cubic-bezier(0.22, 1, 0.36, 1) !important;
    will-change: transform, opacity !important;
  }
  .f-brand-giant-text.revealed .f-char {
    transform: translateY(0%) !important;
    opacity: 1 !important;
  }
  .f-bottom-line {
    display: none !important;
  }
  .f-outer-bar {
    margin: 14px auto 0 auto !important;
    padding: 0 !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
    gap: 3px !important;
    box-sizing: border-box !important;
  }
  .f-outer-copyright span,
  .f-outer-dev span,
  .f-outer-copyright,
  .f-outer-dev {
    text-align: center !important;
    font-size: 0.70rem !important;
    line-height: 1.3 !important;
  }
}
`;
    (document.head || document.documentElement).appendChild(style);
  }
  ensureUnifiedFooterStyles();

  try {
    sessionStorage.setItem('1928_site_visited', 'true');
  } catch (e) { }

  const FOOTER_HTML = `<!-- §7 — MODERN EDITORIAL LUXURY FOOTER -->
<footer id="footer-driver">
  <div class="footer-luxury-card">

    <!-- Top Grid: Statement + Socials, Explore Links, Legal & Policy, CTA -->
    <div class="f-header-grid">
      <div class="f-desc-col">
        <h3 class="f-statement-title">We build brands <br class="f-title-br-mobile" />that create value.</h3>
        <p class="f-desc-text">
          <span class="f-desc-line">1928 Creative Studio is an independent creative studio</span>
          <span class="f-desc-line">helping ambitious businesses shape distinctive brands,</span>
          <span class="f-desc-line">digital experiences, and meaningful connections.</span>
        </p>
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
          <li><a href="privacy-policy.html">Privacy Policy</a></li>
          <li><a href="studio-terms.html">Studio Terms</a></li>
          <li><a href="cookie-policy.html">Cookies Policy</a></li>
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

        <a href="https://wa.me/918160931928?text=Hello%201928%20Creative%20Studio%2C%20I%20would%20like%20to%20talk%20about%20a%20project." target="_blank" rel="noopener noreferrer" class="f-action-pill cta-secondary" aria-label="Chat on WhatsApp">
          <div class="f-action-txt">
            <span class="f-action-heading">Let’s talk about your project</span>
            <span class="f-action-sub">Tell us what you're building</span>
          </div>
          <div class="f-action-arrow" aria-label="WhatsApp">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
        </a>

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

  function initFooterAnimation() {
    const footerDriver = document.getElementById('footer-driver');
    const luxuryCard = footerDriver ? (footerDriver.querySelector('.footer-luxury-card') || footerDriver) : null;
    const footerGiantText = document.getElementById('footerGiantText') || (footerDriver ? footerDriver.querySelector('.f-brand-giant-text') : null);
    if (!footerDriver || !footerGiantText || !luxuryCard) return;

    // Prevent duplicate registrations while allowing re-checks
    if (footerGiantText._animInitialized) {
      if (typeof footerGiantText._checkFooterScroll === 'function') {
        footerGiantText._checkFooterScroll();
      }
      return;
    }
    footerGiantText._animInitialized = true;

    const chars = footerGiantText.querySelectorAll('.f-char');
    // Pure unbroken left-to-right character-by-character soft wave (1 -> 9 -> 2 -> 8 -> C -> R...)
    const delayStep = 0.026; // 26ms per character for an ultra-soft, minimal wave
    chars.forEach((char, index) => {
      const delay = `${(index * delayStep).toFixed(3)}s`;
      char.style.setProperty('transition-delay', delay, 'important');
    });

    function revealFooter() {
      if (!footerGiantText.classList.contains('revealed')) {
        footerGiantText.classList.add('revealed');
      }
    }

    function unrevealFooter() {
      if (footerGiantText.classList.contains('revealed')) {
        footerGiantText.classList.remove('revealed');
      }
    }

    function checkFooterScroll() {
      const cardRect = luxuryCard.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const cardCenterY = cardRect.top + (cardRect.height * 0.5);
      const viewportCenterY = vh * 0.5;
      const scrollY = window.pageYOffset || window.scrollY || document.documentElement.scrollTop || 0;
      const docHeight = Math.max(
        document.body.scrollHeight || 0,
        document.documentElement.scrollHeight || 0,
        document.body.offsetHeight || 0,
        document.documentElement.offsetHeight || 0
      );
      const isAtBottom = (scrollY + vh) >= (docHeight - 40);

      // Trigger ONLY when the footer luxury card reaches the center of the viewport (or at bottom of page)
      if (cardCenterY <= viewportCenterY + 40 || isAtBottom) {
        revealFooter();
      } else if (cardCenterY > viewportCenterY + 120) {
        unrevealFooter();
      }
    }
    footerGiantText._checkFooterScroll = checkFooterScroll;

    window.addEventListener('scroll', checkFooterScroll, { passive: true });
    window.addEventListener('resize', checkFooterScroll, { passive: true });
    window.addEventListener('orientationchange', checkFooterScroll, { passive: true });
    window.addEventListener('load', checkFooterScroll, { passive: true });

    // Initial checks (handles dynamic hero load, fonts, images)
    checkFooterScroll();
    setTimeout(checkFooterScroll, 60);
    setTimeout(checkFooterScroll, 250);
    setTimeout(checkFooterScroll, 800);
    setTimeout(checkFooterScroll, 2000);
  }

  // Expose globally for site-bridge or inline calls
  window.initFooterAnimation = initFooterAnimation;

  function injectFooterHTML(html) {
    const placeholder = document.getElementById('footer-placeholder');
    if (placeholder) {
      placeholder.outerHTML = html;
      initFooterAnimation();
      window.dispatchEvent(new Event('footerLoaded'));
      return true;
    }
    return false;
  }

  function loadFooterComponent() {
    if (document.getElementById('footer-driver')) {
      initFooterAnimation();
      window.dispatchEvent(new Event('footerLoaded'));
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
        injectFooterHTML(FOOTER_HTML);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFooterComponent);
  } else {
    loadFooterComponent();
  }
})();
