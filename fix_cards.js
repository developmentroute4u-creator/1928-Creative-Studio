const fs = require('fs');

let html = fs.readFileSync('blogs.html', 'utf8');

// ── 1. Update Card CSS ──
const cssMarkerStart = '/* ── Editorial Codex Card: Top Icon, Heading, Brief Description, Footer ── */\n    .codex-card {';
const cssMarkerEnd = '    /* Empty Search State */';
const idxS = html.indexOf(cssMarkerStart);
const idxE = html.indexOf(cssMarkerEnd);

if (idxS === -1 || idxE === -1) {
  console.error('Card CSS markers not found!', idxS, idxE);
  process.exit(1);
}

const newCardCSS = `/* ── Editorial Codex Card: 16:9 Image Box with Image Icon & Size, Heading, Brief Description, Footer ── */
    .codex-card {
      width: clamp(340px, 28vw, 410px);
      height: clamp(480px, 56vh, 530px);
      flex-shrink: 0;
      background: var(--card-bg);
      border: 1px solid var(--rule-m);
      border-radius: clamp(18px, 1.8vw, 24px);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      padding: clamp(18px, 1.8vw, 22px);
      box-sizing: border-box;
      cursor: pointer;
      text-decoration: none;
      transition: transform 0.4s var(--sp), border-color 0.4s var(--sp), box-shadow 0.4s var(--sp);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.22);
    }

    .codex-card:hover {
      transform: translateY(-6px);
      border-color: var(--rule-heavy);
      box-shadow: 0 20px 48px rgba(0, 0, 0, 0.45), 0 0 24px rgba(255, 255, 255, 0.04);
    }

    [data-theme="light"] .codex-card {
      box-shadow: 0 10px 28px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.03);
    }

    [data-theme="light"] .codex-card:hover {
      border-color: var(--rule-heavy);
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.03);
    }

    /* ── Top: Image Box (16:9 Ratio with Image Icon & Dimensions) ── */
    .card-image-box {
      width: 100%;
      aspect-ratio: 16 / 9;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px dashed var(--rule-heavy);
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-bottom: 14px;
      transition: border-color 0.35s var(--sp), background 0.35s var(--sp);
    }

    [data-theme="light"] .card-image-box {
      background: rgba(0, 0, 0, 0.025);
      border-color: rgba(0, 0, 0, 0.16);
    }

    .codex-card:hover .card-image-box {
      border-color: var(--cr);
      background: rgba(230, 57, 70, 0.04);
    }

    .cib-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      pointer-events: none;
      user-select: none;
    }

    .cib-icon-wrap {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--rule-m);
      display: grid;
      place-items: center;
      color: var(--ink-mid);
      transition: color 0.3s, border-color 0.3s, transform 0.3s;
    }

    [data-theme="light"] .cib-icon-wrap {
      background: rgba(0, 0, 0, 0.04);
      border-color: rgba(0, 0, 0, 0.08);
    }

    .codex-card:hover .cib-icon-wrap {
      color: var(--cr-bright);
      border-color: var(--cr);
      transform: scale(1.06);
    }

    .cib-image-icon {
      width: 22px;
      height: 22px;
      stroke: currentColor;
    }

    .cib-meta {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .cib-ratio-badge {
      font-family: var(--font-mono);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--ink-dim);
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--rule);
      padding: 3px 8px;
      border-radius: 4px;
    }

    [data-theme="light"] .cib-ratio-badge {
      background: rgba(0, 0, 0, 0.04);
    }

    .cib-dims {
      font-family: var(--font-mono);
      font-size: 10.5px;
      font-weight: 600;
      letter-spacing: 0.06em;
      color: var(--ink-dim);
    }

    .card-image-box img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 14px;
      z-index: 2;
    }

    /* ── Middle: Body with Title + Brief Description ── */
    .card-body-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .cbc-title {
      font-family: var(--font-primary);
      font-weight: 800;
      font-size: clamp(17px, 1.4vw, 20px);
      line-height: 1.25;
      letter-spacing: -0.025em;
      color: var(--ink);
      margin: 0;
    }

    .cbc-desc {
      font-family: var(--font-secondary);
      font-size: clamp(12px, 1vw, 13px);
      line-height: 1.55;
      color: var(--ink-mid);
      margin: 10px 0 0;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* ── Bottom: Footer Row (City + Arrow) ── */
    .card-footer-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding-top: 14px;
      border-top: 1px solid var(--rule);
      margin-top: auto;
    }

    .card-city {
      font-family: var(--font-mono);
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--ink-dim);
      display: flex;
      align-items: center;
      gap: 7px;
    }

    .card-city::before {
      content: "";
      display: inline-block;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--ink-dim);
      transition: background 0.3s, transform 0.3s;
    }

    .codex-card:hover .card-city::before {
      background: var(--cr);
      transform: scale(1.4);
    }

    .card-action-arrow {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 1px solid var(--rule-m);
      background: rgba(255, 255, 255, 0.03);
      display: grid;
      place-items: center;
      color: var(--ink);
      transition: all 0.3s var(--sp);
      flex-shrink: 0;
    }

    [data-theme="light"] .card-action-arrow {
      background: rgba(0, 0, 0, 0.03);
    }

    .codex-card:hover .card-action-arrow {
      border-color: var(--cr);
      background: var(--cr);
      color: #fff;
      transform: scale(1.08) rotate(-45deg);
    }

    `;

html = html.slice(0, idxS) + newCardCSS + html.slice(idxE);
console.log('Card CSS replaced successfully.');

// ── 2. Standard Image Placeholder HTML (Identical for all cards, no different icons!) ──
const imageBoxHTML = `<div class="card-image-box">
          <div class="cib-placeholder">
            <div class="cib-icon-wrap">
              <svg class="cib-image-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="3" ry="3"></rect>
                <circle cx="8.5" cy="8.5" r="1.8"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
            <div class="cib-meta">
              <span class="cib-ratio-badge">16 : 9 Ratio</span>
              <span class="cib-dims">800 × 450 px</span>
            </div>
          </div>
        </div>`;

const arrowSVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>';

const cards = [
  {
    id: 'art-spatial',
    cat: 'spatial-design',
    title: 'Spatial Choreography in Flagship Retail',
    desc: 'Analyzing the psychological impact of atmospheric lighting, tactile monolithic stone surfaces, and acoustically isolated consultation chambers on high-ticket luxury conversion.',
    city: 'MILAN, ITALY'
  },
  {
    id: 'art-webgl',
    cat: 'computational-webgl',
    title: 'Real-Time Generative Three.js Dimensions',
    desc: 'Why modern luxury consumers demand interactive WebGL digital twins over pre-rendered marketing video renders, and how GLSL shaders deliver emotional brand depth.',
    city: 'TOKYO, JAPAN'
  },
  {
    id: 'art-fluted',
    cat: 'spatial-design',
    title: 'Tactile Physics of Luxury Glass',
    desc: 'An empirical investigation into fluted crystal glass tolerances, brushed brass collar engineering, and the acoustic snap of weighted magnetic closures.',
    city: 'PARIS, FRANCE'
  },
  {
    id: 'art-kinetic',
    cat: 'cultural-critique',
    title: 'Kinetic Typography as Omnichannel Authority',
    desc: 'Deconstructing our viral runway takeover that synchronized architectural projection mapping with high-velocity social motion graphics to capture 18.4M impressions.',
    city: 'MILAN, ITALY'
  },
  {
    id: 'art-neural',
    cat: 'computational-webgl',
    title: 'Neural Aesthetics &amp; Liquid Interfaces',
    desc: 'Moving beyond sterile flat SaaS dashboards into dynamic, organic liquid chrome shaders that visualize deep neural network state transitions in real time.',
    city: 'ZURICH, SWITZERLAND'
  },
  {
    id: 'art-monochrome',
    cat: 'luxury-semiotics',
    title: 'The 99% Black Spectrum',
    desc: 'Why restrained monochrome palettes with solitary crimson accents create an impenetrable aura of institutional prestige that multi-color brand systems cannot replicate.',
    city: 'LONDON, UK'
  },
  {
    id: 'art-sensory',
    cat: 'brand-architecture',
    title: 'Architecture of Hospitality Onboarding',
    desc: 'Translating five-star European boutique hotel rituals into high-touch luxury digital onboarding flows that eliminate buyer remorse and accelerate client retention.',
    city: 'MUMBAI, INDIA'
  }
];

function makeCard(card) {
  return `<article class="codex-card" data-category="${card.cat}" data-article-id="${card.id}">
        ${imageBoxHTML}

        <div class="card-body-content">
          <h4 class="cbc-title">${card.title}</h4>
          <p class="cbc-desc">${card.desc}</p>
        </div>

        <div class="card-footer-row">
          <span class="card-city">${card.city}</span>
          <div class="card-action-arrow" title="Read Monograph">
            ${arrowSVG}
          </div>
        </div>
      </article>`;
}

// Find the articles grid open tag and the empty state, replace all cards in between
const gridStart = html.indexOf('<div class="pga-editorial-matrix" id="articlesGrid">');
const emptyState = html.indexOf('<!-- Empty State Card -->');
if (gridStart === -1 || emptyState === -1) {
  console.error('Grid markers not found!', gridStart, emptyState);
  process.exit(1);
}

const afterGridOpen = html.indexOf('\n', gridStart) + 1;
const newCardsBlock = '\n' + cards.map(makeCard).join('\n\n      ') + '\n\n      ';
html = html.slice(0, afterGridOpen) + newCardsBlock + html.slice(emptyState);

fs.writeFileSync('blogs.html', html);
console.log('blogs.html updated successfully with image box and standard image icon! Length:', html.length);
