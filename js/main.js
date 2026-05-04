/* CLEMASA — main.js */

// ── MENU MOBILE ──────────────────────────────
const menuToggle = document.getElementById('menuToggle');
const navMenu    = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  menuToggle.classList.toggle('active', open);
  menuToggle.setAttribute('aria-expanded', open);
});

function closeNav() {
  navMenu.classList.remove('open');
  menuToggle.classList.remove('active');
  menuToggle.setAttribute('aria-expanded', 'false');
}

document.addEventListener('click', (e) => {
  if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) closeNav();
});

// ── SCROLL: PROGRESSO + HEADER ───────────────
const header      = document.getElementById('header');
const progressBar = document.getElementById('scroll-progress');
const navDesktop  = document.querySelector('.nav-desktop');

function onScroll() {
  const scrollY = window.scrollY;
  const docH    = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.width = (docH > 0 ? scrollY / docH * 100 : 0) + '%';

  const scrolled = scrollY > 60;
  header.classList.toggle('scrolled', scrolled);
  if (navDesktop) navDesktop.style.height = scrolled ? '62px' : '';
}

window.addEventListener('scroll', onScroll, { passive: true });

// ── CONTADOR COM EASING ───────────────────────
function easeOutQuad(t) { return t * (2 - t); }

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const start  = performance.now();
  const dur    = 2000;
  const tick   = (now) => {
    const p = easeOutQuad(Math.min((now - start) / dur, 1));
    el.textContent = Math.round(p * target);
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  };
  requestAnimationFrame(tick);
}

new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
      entry.target._statsDone = true;
    }
  });
}, { threshold: 0.5 }).observe(document.getElementById('stats') || document.body);

// ── REVEAL ────────────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.10 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObs.observe(el));

// ── TILT 3D EM CARDS ─────────────────────────
function enableTilt() {
  if (window.matchMedia('(hover: none)').matches) return;
  const cards = document.querySelectorAll(
    '.produto-card:not(.produto-card--cta), .mvv-card, .diferencial-card'
  );
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r  = card.getBoundingClientRect();
      const dx = ((e.clientX - r.left) / r.width  - 0.5) * 2;
      const dy = ((e.clientY - r.top)  / r.height - 0.5) * 2;
      card.style.transform   = `perspective(900px) rotateY(${dx * 5}deg) rotateX(${-dy * 5}deg) translateY(-5px)`;
      card.style.boxShadow   = `${-dx * 10}px ${dy * 6}px 32px rgba(53,53,197,0.15)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
}
enableTilt();

// ── TYPED SLOGAN ─────────────────────────────
(function typedSlogan() {
  const el = document.querySelector('.hero-slogan');
  if (!el) return;
  const text   = el.textContent.trim();
  const cursor = document.createElement('span');
  cursor.textContent = '|';
  const style = document.createElement('style');
  style.textContent = '@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}';
  document.head.appendChild(style);
  cursor.style.cssText = 'animation:blink 0.8s step-end infinite;color:#7B7BFF';
  el.textContent = '';
  el.appendChild(cursor);
  let i = 0;
  const type = () => {
    if (i < text.length) {
      el.insertBefore(document.createTextNode(text[i++]), cursor);
      setTimeout(type, 55);
    } else {
      setTimeout(() => cursor.remove(), 1200);
    }
  };
  setTimeout(type, 700);
})();

// ── ACTIVE NAV ───────────────────────────────
const navLinks = document.querySelectorAll('.nav-desktop a:not(.nav-btn-contato)');
new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${entry.target.id}` ? 'var(--azul)' : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' }).observe(
  ...Array.from(document.querySelectorAll('section[id]'))
);
