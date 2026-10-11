/* ================================================================
   1928 CREATIVE STUDIO — main.js
   GSAP + Lenis + All Motion Logic
================================================================ */

gsap.registerPlugin(ScrollTrigger);

/* ── SMOOTH SCROLL (Lenis) ──────────────────────────────────────── */
const lenis = new Lenis({
  duration: 1.25,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 0.85,
  touchMultiplier: 2,
});

function lenisRAF(t) {
  lenis.raf(t);
  ScrollTrigger.update();
  requestAnimationFrame(lenisRAF);
}
requestAnimationFrame(lenisRAF);

gsap.defaults({ ease: 'power3.out' });

/* ── CUSTOM CURSOR ──────────────────────────────────────────────── */
const cDot = document.getElementById('cDot');
const cRing = document.getElementById('cRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  gsap.to(cDot, { x: mx, y: my, duration: 0.08 });
});

(function ringFollow() {
  rx += (mx - rx) * 0.09;
  ry += (my - ry) * 0.09;
  gsap.set(cRing, { x: rx, y: ry });
  requestAnimationFrame(ringFollow);
})();

document.querySelectorAll('a, button, .svc-card, .wk-card, .testi-btn, .testi-dot, .ms-item').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-lg'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-lg'));
});

/* ── PRELOADER ──────────────────────────────────────────────────── */
const preBar = document.getElementById('preBar');
const preCnt = document.getElementById('preCnt');
let pct = 0;

const preInt = setInterval(() => {
  pct += Math.random() * 3.5 + 0.5;
  if (pct >= 100) { pct = 100; clearInterval(preInt); endPreloader(); }
  preBar.style.width = pct + '%';
  preCnt.textContent = Math.round(pct) + '%';
}, 40);

/* Animate logo letters in */
gsap.fromTo('.pre-char',
  { y: '110%', opacity: 0 },
  { y: '0%', opacity: 1, duration: 1, stagger: 0.14, ease: 'power4.out', delay: 0.25 }
);
gsap.to('.pre-sub', { opacity: 1, duration: 0.7, delay: 0.9 });

function endPreloader() {
  gsap.timeline({
    onComplete() {
      document.getElementById('preloader').style.display = 'none';
      initPage();
    }
  })
    .to('.pre-char', { y: '-110%', stagger: 0.07, duration: 0.7, ease: 'power4.in', delay: 0.35 })
    .to('.pre-sub', { opacity: 0, duration: 0.3 }, '<')
    .to('#preReveal', { scaleY: 1, transformOrigin: 'bottom', duration: 0.6, ease: 'power4.inOut' }, '-=.15')
    .to('#preloader', { opacity: 0, duration: 0.3 });
}

/* ── PAGE INIT (after preloader) ────────────────────────────────── */
function initPage() {
  /* Nav reveal */
  gsap.to('#navLogo', { opacity: 1, x: 0, duration: 1, delay: 0.1 });
  gsap.to('#navLinks li', { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, delay: 0.25 });
  gsap.to('#navCta', { opacity: 1, y: 0, duration: 0.7, delay: 0.6 });

  /* Hero orbs */
  gsap.to('.orb', { opacity: 1, duration: 2.5, delay: 0.2 });

  /* Hero eyebrow */
  gsap.to('#hEyebrow', { opacity: 1, x: 0, duration: 1, delay: 0.3 });

  /* Hero headline */
  gsap.to('.h1-word', { y: '0%', duration: 1.3, stagger: 0.1, delay: 0.35, ease: 'power4.out' });

  /* Hero desc + actions */
  gsap.to(['#hDesc', '#hActs'], { opacity: 1, y: 0, duration: 0.9, stagger: 0.18, delay: 0.9 });

  /* Scroll indicator */
  gsap.to('#hScroll', { opacity: 1, duration: 1, delay: 1.5 });

  initScrollAnimations();
}

/* ── SCROLL ANIMATIONS ──────────────────────────────────────────── */
function initScrollAnimations() {

  /* Nav sticky */
  lenis.on('scroll', () => {
    document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 80);
  });

  /* Hero parallax */
  gsap.to('.orb-1', {
    y: -220,
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.2 }
  });
  gsap.to('.hero-grid', {
    y: 120,
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.8 }
  });
  gsap.to('#heroH1', {
    y: -100,
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 2 }
  });

  /* Generic .rUp reveals */
  gsap.utils.toArray('.rUp').forEach(el => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.9,
      scrollTrigger: { trigger: el, start: 'top 87%' }
    });
  });
  /* Generic .rRight reveals */
  gsap.utils.toArray('.rRight').forEach(el => {
    gsap.to(el, {
      opacity: 1, x: 0, duration: 0.9,
      scrollTrigger: { trigger: el, start: 'top 87%' }
    });
  });
  /* Generic .rFade reveals */
  gsap.utils.toArray('.rFade').forEach(el => {
    gsap.to(el, {
      opacity: 1, duration: 0.9,
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  /* Section labels */
  gsap.utils.toArray('.s-label').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, x: -16 },
      { opacity: 1, x: 0, duration: 0.7, scrollTrigger: { trigger: el, start: 'top 88%' } }
    );
  });

  /* Section titles */
  gsap.utils.toArray('.s-title').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.9, scrollTrigger: { trigger: el, start: 'top 86%' } }
    );
  });

  /* About statement */
  gsap.fromTo('#aboutStmt',
    { opacity: 0, y: 70 },
    { opacity: 1, y: 0, duration: 1.1, scrollTrigger: { trigger: '#aboutStmt', start: 'top 82%' } }
  );

  /* Service cards stagger */
  gsap.fromTo('.svc-card',
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, scrollTrigger: { trigger: '.svc-grid', start: 'top 82%' } }
  );

  /* ── Horizontal Portfolio Scroll (GSAP Pin) ── */
  const wkTrack = document.getElementById('wkTrack');
  gsap.to(wkTrack, {
    x: () => -(wkTrack.scrollWidth - window.innerWidth + 128),
    ease: 'none',
    scrollTrigger: {
      trigger: '#works',
      start: 'top top',
      end: () => '+=' + wkTrack.scrollWidth,
      pin: true,
      scrub: 1.4,
      invalidateOnRefresh: true,
      anticipatePin: 1,
    }
  });

  /* ── Counter Animations ── */
  gsap.utils.toArray('.cnt').forEach(el => {
    const target = +el.dataset.t;
    ScrollTrigger.create({
      trigger: el, start: 'top 92%', once: true,
      onEnter() {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target, duration: 2.2, ease: 'power2.out',
          onUpdate() { el.textContent = Math.round(obj.val); }
        });
      }
    });
  });

  /* Stats section stagger */
  gsap.fromTo('.stat-cell',
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, scrollTrigger: { trigger: '#stats', start: 'top 80%' } }
  );

  /* Process steps */
  document.querySelectorAll('.proc-step').forEach((step, i) => {
    ScrollTrigger.create({
      trigger: step, start: 'top 80%', once: true,
      onEnter() {
        gsap.to(step, { opacity: 1, x: 0, duration: 0.75, delay: i * 0.08 });
        step.classList.add('vis');
      }
    });
  });

  /* Process spine progress bar */
  gsap.to('#procProg', {
    height: '100%', ease: 'none',
    scrollTrigger: {
      trigger: '.proc-list', start: 'top 68%', end: 'bottom 80%', scrub: 1
    }
  });

  /* Testimonials cards */
  gsap.fromTo('.testi-card',
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, scrollTrigger: { trigger: '#testimonials', start: 'top 78%' } }
  );

  /* CTA title */
  gsap.fromTo('#ctaTitle',
    { opacity: 0, y: 80 },
    { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out', scrollTrigger: { trigger: '#cta', start: 'top 75%' } }
  );

  /* Footer fade */
  gsap.fromTo('#footer',
    { opacity: 0 },
    { opacity: 1, duration: 1, scrollTrigger: { trigger: '#footer', start: 'top 92%' } }
  );

  /* Orb follows mouse */
  document.addEventListener('mousemove', e => {
    const x = (e.clientX / innerWidth - 0.5) * 30;
    const y = (e.clientY / innerHeight - 0.5) * 30;
    gsap.to('.orb-1', { x, y, duration: 2.5, ease: 'power2.out' });
  });
}

/* ── TESTIMONIALS SLIDER ────────────────────────────────────────── */
let tIdx = 0;
const tCards = document.querySelectorAll('.testi-card');
const tDots = document.querySelectorAll('.testi-dot');

function goTesti(i) {
  tIdx = Math.max(0, Math.min(i, tCards.length - 1));
  const w = tCards[0].offsetWidth + 28;
  gsap.to('#testiTrack', { x: -w * tIdx, duration: 0.85, ease: 'power3.inOut' });
  tDots.forEach((d, j) => d.classList.toggle('on', j === tIdx));
}

document.getElementById('tPrev').addEventListener('click', () => goTesti(tIdx - 1));
document.getElementById('tNext').addEventListener('click', () => goTesti(tIdx + 1));
tDots.forEach(d => d.addEventListener('click', () => goTesti(+d.dataset.i)));
setInterval(() => goTesti((tIdx + 1) % tCards.length), 5200);

/* ── MOBILE MENU ────────────────────────────────────────────────── */
let menuOpen = false;
const hbBtn = document.getElementById('hbBtn');
const mobMenu = document.getElementById('mob-menu');

hbBtn.addEventListener('click', () => {
  menuOpen = !menuOpen;
  hbBtn.classList.toggle('open', menuOpen);
  mobMenu.classList.toggle('open', menuOpen);
  menuOpen ? lenis.stop() : lenis.start();
});
mobMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menuOpen = false;
  hbBtn.classList.remove('open');
  mobMenu.classList.remove('open');
  lenis.start();
}));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menuOpen) {
    menuOpen = false;
    hbBtn.classList.remove('open');
    mobMenu.classList.remove('open');
    lenis.start();
  }
});

/* ── MAGNETIC BUTTONS ───────────────────────────────────────────── */
document.querySelectorAll('.mag').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width / 2) * 0.28;
    const dy = (e.clientY - r.top - r.height / 2) * 0.28;
    gsap.to(btn, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.65, ease: 'elastic.out(1, 0.35)' });
  });
});

/* ── SMOOTH ANCHOR SCROLL ───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const tgt = document.querySelector(href);
    if (tgt) {
      e.preventDefault();
      lenis.scrollTo(tgt, { offset: -80, duration: 1.6 });
    }
    if (menuOpen) {
      menuOpen = false;
      hbBtn.classList.remove('open');
      mobMenu.classList.remove('open');
      lenis.start();
    }
  });
});

/* ── SERVICE CARD ICON HOVER ────────────────────────────────────── */
document.querySelectorAll('.svc-card').forEach(card => {
  const num = card.querySelector('.svc-num');
  card.addEventListener('mouseenter', () => gsap.to(num, { scale: 1.15, duration: 0.3, ease: 'back.out' }));
  card.addEventListener('mouseleave', () => gsap.to(num, { scale: 1, duration: 0.3 }));
});

/* ── FOOTER SOCIAL HOVER ────────────────────────────────────────── */
document.querySelectorAll('.f-soc').forEach(el => {
  el.addEventListener('mouseenter', () => gsap.to(el, { scale: 1.12, duration: 0.3, ease: 'back.out' }));
  el.addEventListener('mouseleave', () => gsap.to(el, { scale: 1, duration: 0.3 }));
});

/* ── RESIZE ─────────────────────────────────────────────────────── */
window.addEventListener('resize', () => ScrollTrigger.refresh());

/* ── EASTER EGG ─────────────────────────────────────────────────── */
console.log('%c1928 Creative Studio', 'color:#7d001e;font-size:26px;font-weight:800;font-family:sans-serif');
console.log('%cMake It Iconic. ✦', 'color:#555;font-size:13px');
