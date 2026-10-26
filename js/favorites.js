// Lab 2.2 / 2.4 – Favorites module with localStorage persistence.
const STORAGE_KEY = 'bookExplorer.favorites';
export const FAVORITES_CHANGED = 'favorites:changed';

export function getFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isFavorite(id) {
  return getFavorites().some((book) => book.id === id);
}

export function addFavorite(book) {
  const favorites = getFavorites();
  if (favorites.some((b) => b.id === book.id)) return favorites;
  const updated = [...favorites, book];
  save(updated);
  return updated;
}

export function removeFavorite(id) {
  const updated = getFavorites().filter((book) => book.id !== id);
  save(updated);
  return updated;
}

/** Adds the book if missing, removes it if present. Returns true if now a favorite. */
export function toggleFavorite(book) {
  if (isFavorite(book.id)) {
    removeFavorite(book.id);
    return false;
  }
  addFavorite(book);
  return true;
}

export function clearFavorites() {
  save([]);
}

function save(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Could not save favorites', err);
  }
  window.dispatchEvent(new CustomEvent(FAVORITES_CHANGED, { detail: list }));
}
