// ── TAB SWITCHING ──
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

// Beim Laden: kein Tab vorausgewählt
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.leistung-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.leistung-tab').forEach(t => t.classList.remove('active'));
  const placeholder = document.getElementById('tab-placeholder');
  if (placeholder) placeholder.style.display = 'block';
});

// ── SCROLL FADE-IN ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ── HIDE-ON-SCROLL NAVBAR ──
// Beim Runterscrollen: Navbar ausbleden. Bei auch nur 1px nach oben: sofort einblenden.
const navbar = document.querySelector('.navbar');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  if (currentScrollY <= 0) {
    // Ganz oben: immer sichtbar
    navbar.classList.remove('navbar-hidden');
  } else if (currentScrollY < lastScrollY) {
    // Nach oben (auch 1px): sofort einblenden
    navbar.classList.remove('navbar-hidden');
  } else if (currentScrollY > lastScrollY) {
    // Nach unten: sofort ausblenden
    navbar.classList.add('navbar-hidden');
  }
  lastScrollY = currentScrollY;
}, { passive: true });

// ── ACTIVE NAV ON SCROLL ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 130) current = s.getAttribute('id'); });
  navLinks.forEach(l => {
    l.classList.remove('active');
    if (l.getAttribute('href') === '#' + current) l.classList.add('active');
  });
}, { passive: true });
