// Home page: load books from the API, search, loading/empty/error states, favorite toggling.
import './layout.js';
import { fetchBooks, searchBooksByTitle } from './fetchbooks.js';
import { toggleFavorite, isFavorite, FAVORITES_CHANGED } from './favorites.js';
import { createBookCard, applyButtonState, showSpinner, showMessage } from './ui.js';

const grid = document.getElementById('book-grid');
const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const heading = document.getElementById('results-heading');

const booksById = new Map();
let controller = null;

async function load(query) {
  controller?.abort();
  controller = new AbortController();
  showSpinner(grid);

  try {
    const books = query
      ? await searchBooksByTitle(query, { signal: controller.signal })
      : await fetchBooks('subject:fiction', { signal: controller.signal });

    heading.textContent = query ? `Results for “${query}”` : 'Popular fiction';
    booksById.clear();

    if (books.length === 0) {
      showMessage(grid, `No results found${query ? ` for “${escapeHtml(query)}”` : ''}.`);
      return;
    }

    grid.replaceChildren(
      ...books.map((book) => {
        booksById.set(book.id, book);
        return createBookCard(book);
      })
    );
  } catch (err) {
    if (err.name === 'AbortError') return;
    console.error(err);
    showMessage(grid, 'Something went wrong while loading books. Please try again later.', 'error');
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  load(input.value.trim());
});

grid.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action="toggle"]');
  if (!button) return;
  const book = booksById.get(button.closest('article').dataset.id);
  if (book) toggleFavorite(book);
});

function syncButtons() {
  grid.querySelectorAll('article').forEach((card) => {
    const button = card.querySelector('button');
    if (button) applyButtonState(button, isFavorite(card.dataset.id));
  });
}
window.addEventListener(FAVORITES_CHANGED, syncButtons);
window.addEventListener('storage', syncButtons);

function escapeHtml(str) {
  return str.replace(/[&<>\"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

load('');
