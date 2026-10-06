'use strict';
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* Loader */
function initLoader() {
  const hide = () => setTimeout(() => $('#loader').classList.add('done'), prefersReduced ? 0 : 600);
  document.readyState === 'complete' ? hide() : window.addEventListener('load', hide);
}

/* Mobile menu */
function initMenu() {
  const toggle = $('#nav-toggle'), menu = $('#nav-menu');
  const set = open => { menu.classList.toggle('open', open); toggle.setAttribute('aria-expanded', open); };
  toggle.addEventListener('click', () => set(!menu.classList.contains('open')));
  $$('.nav__link', menu).forEach(a => a.addEventListener('click', () => set(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
  document.addEventListener('click', e => { if (!e.target.closest('.nav')) set(false); });
}

/* Scroll-dependent UI: nav blur + back-to-top */
function initScrollUI() {
  const nav = $('#nav'), top = $('#to-top');
  const update = () => {
    nav.classList.toggle('scrolled', scrollY > 20);
    top.classList.toggle('show', scrollY > 600);
  };
  update();
  addEventListener('scroll', update, { passive: true });
  top.addEventListener('click', () => scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' }));
}

/* Scroll reveal */
function initReveal() {
  const items = $$('.reveal');
  if (!('IntersectionObserver' in window) || prefersReduced) return items.forEach(i => i.classList.add('revealed'));
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach(i => io.observe(i));
}

/* Active nav link */
function initActiveNav() {
  const links = $$('.nav__link');
  const map = new Map(links.map(l => [l.getAttribute('href').slice(1), l]));
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(l => l.classList.remove('active'));
      map.get(e.target.id)?.classList.add('active');
    }
  }), { rootMargin: '-45% 0px -50% 0px' });
  map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
}

/* Animated counters */
function initCounters() {
  const els = $$('[data-count]');
  const run = el => {
    const target = +el.dataset.count;
    if (prefersReduced) { el.textContent = target; return; }
    const start = performance.now(), dur = 1200;
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (!('IntersectionObserver' in window)) return els.forEach(e => e.textContent = e.dataset.count);
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } }), { threshold: 0.6 });
  els.forEach(e => io.observe(e));
}

/* Typing effect */
function initTyping() {
  const el = $('#typing');
  if (!el || prefersReduced) return;
  const words = JSON.parse(el.dataset.words);
  let w = 0, c = words[0].length, del = true;
  const step = () => {
    const word = words[w];
    el.textContent = word.slice(0, c);
    let delay = del ? 45 : 90;
    if (del) c--; else c++;
    if (!del && c > word.length) { del = true; delay = 1800; c = word.length; }
    else if (del && c < 0) { del = false; w = (w + 1) % words.length; c = 0; delay = 300; }
    setTimeout(step, delay);
  };
  setTimeout(step, 2200);
}

/* Lightweight particle background */
function initParticles() {
  const canvas = $('#bg-canvas');
  if (!canvas || prefersReduced) return;
  const ctx = canvas.getContext('2d');
  let w, h, pts = [], raf;
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth; h = innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(Math.floor(w / 22), 60);
    pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25 }));
  };
  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.fillStyle = 'rgba(34,211,238,.55)';
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.4, 0, 6.283); ctx.fill();
    }
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = dx * dx + dy * dy;
      if (d < 14400) { ctx.strokeStyle = `rgba(139,92,246,${.22 * (1 - d / 14400)})`; ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke(); }
    }
    raf = requestAnimationFrame(draw);
  };
  resize(); draw();
  addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => { document.hidden ? cancelAnimationFrame(raf) : draw(); });
}

function initFooter() { const y = $('#year'); if (y) y.textContent = new Date().getFullYear(); }

document.addEventListener('DOMContentLoaded', () => {
  [initLoader, initMenu, initScrollUI, initReveal, initActiveNav, initCounters, initTyping, initParticles, initFooter].forEach(f => f());
});
