// Lab 3.1 – API module: fetch + async/await against the Open Library search API.
const BASE_URL = 'https://openlibrary.org/search.json';
const FIELDS = 'key,title,author_name,first_publish_year,cover_i';

/**
 * Fetch books matching a query and return them in a normalized shape.
 * @param {string} query  Free-text query (e.g. a title) or "subject:fiction".
 * @param {{limit?: number, signal?: AbortSignal}} options
 * @returns {Promise<Array<{id:string,title:string,author:string,year:number|null,cover:string|null}>>}
 */
export async function fetchBooks(query = 'subject:fiction', { limit = 24, signal } = {}) {
  const params = new URLSearchParams({ q: query, limit: String(limit), fields: FIELDS });
  const response = await fetch(`${BASE_URL}?${params}`, { signal });

  if (!response.ok) {
    throw new Error(`Open Library request failed (${response.status})`);
  }

  const data = await response.json();
  return (data.docs ?? []).map(normalizeBook);
}

/** Search by title specifically (Lab 3.3). */
export function searchBooksByTitle(title, options) {
  return fetchBooks(`title:${title}`, options);
}

function normalizeBook(doc) {
  return {
    id: doc.key,
    title: doc.title ?? 'Untitled',
    author: doc.author_name?.[0] ?? 'Unknown author',
    year: doc.first_publish_year ?? null,
    cover: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : null,
  };
}
