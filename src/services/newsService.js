import { BACKEND_URL } from '../../env';
import { normalizeApiBase, request } from './apiClient';

// News & Announcements network layer — see docs/NEWS_API.md for the contract.
//   GET    /news                     public feed (active only, pinned first)
//   POST   /admin/news/login         shared-password sign-in -> bearer token
//   GET    /admin/news               everything, hidden included
//   POST   /admin/news               publish
//   POST   /admin/news/upload        image/flyer attachment -> { url }
//   PUT    /admin/news/:id           full replace
//   PATCH  /admin/news/:id/toggle    hide / show
//   DELETE /admin/news/:id           hard delete

const MAX_IMAGE_BYTES = 16 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
]);

// Held in memory only, so it never reaches disk and dies with the process.
// NewsAdminScreen clears it on unmount.
let adminToken = null;

const auth = () => ({ Authorization: `Bearer ${adminToken}` });

export function clearAdminToken() {
  adminToken = null;
}

// Client-side pre-flight checks — the server enforces the real limits, this
// just gives an immediate, specific message instead of waiting on a request
// that's certain to fail (and avoids uploading a file we already know is bad).
export function validateImageAsset(asset) {
  if (!asset) return null;

  const type = asset.mimeType || asset.type;
  if (type && !ALLOWED_IMAGE_TYPES.has(type)) {
    return 'Unsupported file type. Use JPG, PNG, GIF, WEBP or PDF.';
  }

  if (typeof asset.size === 'number' && asset.size > MAX_IMAGE_BYTES) {
    return 'File is too large. Maximum size is 16MB.';
  }

  return null;
}

// Uploads a picked document/image and returns its public URL. Bypasses the
// JSON-only request() helper — a multipart body needs its own boundary, which
// fetch sets automatically as long as we don't specify Content-Type ourselves.
export function uploadImage(asset) {
  const invalidReason = validateImageAsset(asset);
  if (invalidReason) {
    return Promise.reject(new Error(invalidReason));
  }

  const formData = new FormData();
  formData.append('file', {
    uri: asset.uri,
    name: asset.name || 'upload',
    type: asset.mimeType || asset.type || 'application/octet-stream',
  });

  const url = `${normalizeApiBase(BACKEND_URL)}/admin/news/upload`;

  return fetch(url, {
    method: 'POST',
    headers: auth(),
    body: formData,
  })
    .catch(() => {
      throw new Error(`Cannot connect to API at ${url}.`);
    })
    .then(async response => {
      let payload = null;
      try {
        payload = await response.json();
      } catch {
        // ignore — handled by the checks below
      }

      if (!response.ok || payload?.success === false) {
        throw new Error(payload?.message || `Upload failed (${response.status})`);
      }

      return payload?.data ?? payload;
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

// The server sends `date` and `active`, but the spec marks both optional:
// `date` is derivable from publishedDate, and a missing `active` means visible
// (the is_active column defaults to true). Filling them in here keeps the
// screens from having to care.
function normalize(item) {
  if (!item || typeof item !== 'object') return item;
  return {
    ...item,
    active: item.active !== false,
    date: item.date || formatDate(item.publishedDate),
  };
}

const normalizeList = data => (Array.isArray(data) ? data.map(normalize) : []);

// Ordering is the server's job — the list is rendered as received.
export function getNews() {
  return request('/news').then(normalizeList);
}

export function adminLogin(password) {
  return request('/admin/news/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  }).then(data => {
    adminToken = data?.token ?? null;
    return data;
  });
}

export function getAllNews() {
  return request('/admin/news', { headers: auth() }).then(normalizeList);
}

export function addNews(fields) {
  return request('/admin/news', {
    method: 'POST',
    headers: auth(),
    body: JSON.stringify(fields),
  }).then(normalize);
}

export function updateNews(id, fields) {
  return request(`/admin/news/${id}`, {
    method: 'PUT',
    headers: auth(),
    body: JSON.stringify(fields),
  }).then(normalize);
}

export function toggleNews(id) {
  return request(`/admin/news/${id}/toggle`, { method: 'PATCH', headers: auth() });
}

export function deleteNews(id) {
  return request(`/admin/news/${id}`, { method: 'DELETE', headers: auth() });
}
