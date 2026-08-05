import { MOCK_NEWS } from '../data/newsMock';

// UI-only for now: an in-memory copy of the mock announcements stands in for the
// database, so add / edit / delete / hide in the admin screen behave realistically
// while the screens are being built. Replace each function body with the matching
// API call once the backend is wired up (see the notes on each one).

let store = MOCK_NEWS.map(item => ({ ...item }));

const delay = (value, ms = 400) =>
  new Promise(resolve => setTimeout(() => resolve(value), ms));

function nextId() {
  return store.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

// Server order (app.py): pinned first, then most recent published date.
function sorted(list) {
  return [...list].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.publishedDate.localeCompare(a.publishedDate);
  });
}

export function formatDate(isoDate) {
  const [year, month, day] = String(isoDate).split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthName = months[Number(month) - 1];
  if (!monthName) return String(isoDate);
  return `${day} ${monthName} ${year}`;
}

export function todayIso() {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

// Public feed — active announcements only. An announcement counts as active
// unless it is explicitly switched off, matching the model default (models.py:
// is_active defaults to True), so a record without the field still shows.
// Later: request('/news')
export function getNews() {
  return delay(sorted(store.filter(item => item.active !== false)), 600);
}

// Admin list — everything, including hidden. Later: request('/admin/news')
export function getAllNews() {
  return delay(sorted(store));
}

// Later: request('/admin/news', { method: 'POST', body: ... })
export function addNews(fields) {
  const item = {
    id: nextId(),
    title: fields.title,
    body: fields.body,
    type: fields.type || 'info',
    pinned: !!fields.pinned,
    active: true,
    publishedDate: fields.publishedDate,
    date: formatDate(fields.publishedDate),
  };
  store = [item, ...store];
  return delay(item);
}

export function updateNews(id, fields) {
  store = store.map(item =>
    item.id === id
      ? {
          ...item,
          title: fields.title,
          body: fields.body,
          type: fields.type,
          pinned: !!fields.pinned,
          publishedDate: fields.publishedDate,
          date: formatDate(fields.publishedDate),
        }
      : item
  );
  return delay(true);
}

export function toggleNews(id) {
  store = store.map(item => (item.id === id ? { ...item, active: !item.active } : item));
  return delay(true);
}

export function deleteNews(id) {
  store = store.filter(item => item.id !== id);
  return delay(true);
}
