// Favorites page: render saved books and update dynamically on click.
import './layout.js';
import { getFavorites, removeFavorite, clearFavorites, FAVORITES_CHANGED } from './favorites.js';
import { createBookCard, showMessage } from './ui.js';

const grid = document.getElementById('favorites-grid');
const clearBtn = document.getElementById('clear-all');
const count = document.getElementById('favorites-count');

function render() {
  const favorites = getFavorites();
  count.textContent = `${favorites.length} saved ${favorites.length === 1 ? 'book' : 'books'}`;
  clearBtn.classList.toggle('hidden', favorites.length === 0);

  if (favorites.length === 0) {
    showMessage(
      grid,
      'Your favorites list is empty. <a href="index.html" class="text-stone-600 underline">Browse books</a> and tap "Add to favorites" on any book you like.'
    );
    return;
  }
  grid.replaceChildren(...favorites.map((book) => createBookCard(book, { mode: 'favorites' })));
}

grid.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action="remove"]');
  if (!button) return;
  removeFavorite(button.closest('article').dataset.id);
});

clearBtn.addEventListener('click', () => {
  if (confirm('Remove all favorites?')) clearFavorites();
});

window.addEventListener(FAVORITES_CHANGED, render);
window.addEventListener('storage', render);
render();
