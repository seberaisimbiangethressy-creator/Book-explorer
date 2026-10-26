// Renders the shared navbar + footer (Lab 1.1) and keeps the favorites badge in sync.
import { getFavorites, FAVORITES_CHANGED } from './favorites.js';

const LINKS = [
  { href: 'index.html', label: 'Home' },
  { href: 'favorite.html', label: 'Favorites', badge: true },
  { href: 'about.html', label: 'About' },
];

function currentPage() {
  const file = location.pathname.split('/').pop();
  return file || 'index.html';
}

function renderNavbar() {
  const page = currentPage();
  const linkClasses = (href) =>
    href === page
      ? 'text-indigo-600 font-semibold'
      : 'text-slate-600 hover:text-indigo-600';

  const items = LINKS.map(
    ({ href, label, badge }) => `
      <a href="${href}" class="${linkClasses(href)} flex items-center gap-2 py-2 md:py-0">
        ${label}
        ${badge ? '<span id="fav-count" class="rounded-full bg-indigo-600 px-2 py-0.5 text-xs text-white">0</span>' : ''}
      </a>`
  ).join('');

  document.getElementById('site-header').innerHTML = `
    <nav class="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="index.html" class="text-xl font-bold text-indigo-600">📚 Book Explorer</a>
        <button id="menu-toggle" class="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
                aria-label="Toggle menu" aria-expanded="false" aria-controls="menu">☰</button>
        <div id="menu" class="hidden w-full flex-col md:flex md:w-auto md:flex-row md:gap-6">${items}</div>
      </div>
    </nav>`;

  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('menu');
  menu.classList.add('absolute', 'left-0', 'top-full', 'bg-white', 'px-4', 'pb-3', 'shadow', 'md:static', 'md:bg-transparent', 'md:p-0', 'md:shadow-none');
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('hidden') === false;
    menu.classList.toggle('flex', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
}

function renderFooter() {
  document.getElementById('site-footer').innerHTML = `
    <div class="mt-16 border-t border-slate-200 bg-white">
      <div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row">
        <p>© ${new Date().getFullYear()} Book Explorer</p>
        <p>Data from <a class="text-indigo-600 hover:underline" href="https://openlibrary.org" target="_blank" rel="noopener">Open Library</a></p>
      </div>
    </div>`;
}

function updateBadge() {
  const badge = document.getElementById('fav-count');
  if (badge) badge.textContent = String(getFavorites().length);
}

renderNavbar();
renderFooter();
updateBadge();
window.addEventListener(FAVORITES_CHANGED, updateBadge);
window.addEventListener('storage', updateBadge);
