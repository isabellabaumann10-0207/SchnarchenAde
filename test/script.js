// =========================================================
// SCHNARCHEN ADE — vanilla JS interactions
// No Three.js, no GSAP, no build step.
// =========================================================

// ── TAB SWITCHING ────────────────────────────────────────
function showTab(name) {
  document.querySelectorAll('.leistung-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.leistung-tab').forEach(t => t.classList.remove('active'));

  const panel = document.getElementById('panel-' + name);
  if (panel) panel.classList.add('active');

  document.querySelectorAll('.leistung-tab').forEach(t => {
    if (t.dataset.tab === name) t.classList.add('active');
  });

  const placeholder = document.getElementById('tab-placeholder');
  if (placeholder) placeholder.style.display = 'none';
}

// ── PAGE INIT ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.leistung-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.leistung-tab').forEach(t => t.classList.remove('active'));

  const placeholder = document.getElementById('tab-placeholder');
  if (placeholder) placeholder.style.display = 'block';

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const id = link.getAttribute('href');
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      const menu = document.querySelector('.navbar-collapse.show');
      if (menu && window.bootstrap) {
        const collapse = bootstrap.Collapse.getInstance(menu) ||
          new bootstrap.Collapse(menu, { toggle: false });
        collapse.hide();
      }
    });
  });
});

// ── SCROLL REVEAL ────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px' });

document.querySelectorAll('.fade-in').forEach(el => revealObserver.observe(el));

// ── HIDE / SHOW NAVBAR ──────────────────────────────────
const navbar = document.querySelector('.navbar');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY <= 4 || currentScrollY < lastScrollY) {
    navbar.classList.remove('navbar-hidden');
  } else if (currentScrollY > lastScrollY + 2) {
    navbar.classList.add('navbar-hidden');
  }

  lastScrollY = currentScrollY;
}, { passive: true });

// ── ACTIVE NAV ───────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link:not(.btn-primary-green)');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.remove('active'));
    const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
    if (active) active.classList.add('active');
  });
}, { threshold: 0.2, rootMargin: '-20% 0px -65% 0px' });

sections.forEach(section => navObserver.observe(section));

// ── SUBTLE 3D CARD TILT ─────────────────────────────────
// Pure CSS transform + pointer events. Disabled on touch devices
// and when the user prefers reduced motion.
const canTilt =
  window.matchMedia('(hover: hover)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canTilt) {
  document.querySelectorAll('.js-tilt-card').forEach(card => {
    let raf = null;

    const reset = () => {
      card.style.transform = '';
    };

    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      const rotateY = (x - 0.5) * 3.5;
      const rotateX = (0.5 - y) * 3.5;

      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.transform =
          `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
    });

    card.addEventListener('pointerleave', reset);
  });
}

// ── HERO 3D RESPONSE TO MOUSE ───────────────────────────
// A very small parallax layer on the CSS-only object.
const hero = document.querySelector('.hero-visual-wrap');
const heroCard = document.querySelector('.hero-3d-card');

if (hero && heroCard && canTilt) {
  hero.addEventListener('pointermove', event => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    heroCard.style.animationPlayState = 'paused';
    heroCard.style.transform =
      `rotateX(${8 - y * 8}deg) rotateY(${-18 + x * 10}deg) rotateZ(${2 + x * 2}deg) translate3d(${x * 8}px, ${y * 8}px, 20px)`;
  });

  hero.addEventListener('pointerleave', () => {
    heroCard.style.animationPlayState = '';
    heroCard.style.transform = '';
  });
}
