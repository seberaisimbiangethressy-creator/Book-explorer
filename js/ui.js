// Shared DOM helpers: book cards, spinner, status messages.
import { isFavorite } from './favorites.js';

export function createBookCard(book, { mode = 'browse' } = {}) {
  const card = document.createElement('article');
  card.className =
    'flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-md';
  card.dataset.id = book.id;

  const cover = document.createElement('div');
  cover.className = 'aspect-[2/3] w-full bg-slate-100';
  if (book.cover) {
    const img = document.createElement('img');
    img.src = book.cover;
    img.alt = `Cover of ${book.title}`;
    img.loading = 'lazy';
    img.className = 'h-full w-full object-cover';
    cover.append(img);
  } else {
    cover.className += ' flex items-center justify-center text-5xl';
    cover.textContent = '📖';
  }

  const body = document.createElement('div');
  body.className = 'flex flex-1 flex-col gap-1 p-4';

  const title = document.createElement('h3');
  title.className = 'line-clamp-2 font-semibold text-slate-900';
  title.textContent = book.title;

  const meta = document.createElement('p');
  meta.className = 'text-sm text-slate-500';
  meta.textContent = book.year ? `${book.author} · ${book.year}` : book.author;

  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.action = mode === 'favorites' ? 'remove' : 'toggle';
  button.className =
    'mt-auto rounded-lg px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500';
  applyButtonState(button, mode === 'favorites' ? true : isFavorite(book.id), mode);

  body.append(title, meta, button);
  card.append(cover, body);
  return card;
}

const BASE =
  'mt-auto rounded-lg px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500';

export function applyButtonState(button, favorited, mode = 'browse') {
  if (mode === 'favorites') {
    button.textContent = 'Remove';
    button.className = `${BASE} bg-rose-50 text-rose-700 hover:bg-rose-100`;
    return;
  }
  button.setAttribute('aria-pressed', String(favorited));
  button.textContent = favorited ? '♥ Favorited' : '♡ Add to favorites';
  button.className = `${BASE} ${
    favorited
      ? 'bg-amber-700 text-white hover:bg-amber-800'
      : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
  }`;
}


export function showSpinner(container) {
  container.innerHTML = `
    <div class="col-span-full flex flex-col items-center gap-3 py-16 text-slate-500" role="status">
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-amber-600"></div>
      <span>Loading books…</span>
    </div>`;
}

export function showMessage(container, message, tone = 'neutral') {
  const color = tone === 'error' ? 'text-rose-600' : 'text-slate-500';
  container.innerHTML = `
    <div class="col-span-full py-16 text-center ${color}" role="status">${message}</div>`;
}
