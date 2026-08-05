# News & Announcements — Backend API Spec

What the backend must provide for the News & Updates tab and the News Admin screen.
The UI is built and tested; only the network layer is missing. Wiring it up means
replacing the bodies of the functions in [`src/services/newsService.js`](../src/services/newsService.js)
— nothing else in the app needs to change.

**Screens that consume this API**

| Screen | File | Endpoints used |
| --- | --- | --- |
| Home → News & Updates tab | [`src/components/NewsFeed.js`](../src/components/NewsFeed.js) | `GET /news` |
| News Admin | [`src/screens/NewsAdminScreen.js`](../src/screens/NewsAdminScreen.js) | everything under `/admin/news` |

Reference implementation to port from: the Replit Flask app — `app.py`
(`/news`, `/admin/news`), `models.py` (`Announcement`), `templates/news_admin.html`.

---

## 0. Status — implemented

All seven endpoints are live in `WGH-Anaesthesia-backend`, and `newsService.js`
now calls them. Three things ended up differing from the spec below; everything
else matches.

1. **`id` is a 24-character ObjectId string, not an integer.** The backend is
   MongoDB via Prisma, where every model keys off `_id`. Nothing in the app
   depends on `id` being numeric — it is used as a React key and compared with
   `===` — so no screen changed. Example: `"6a7306c9462bbffed285458d"`.
2. **Toggle is the flip, `PATCH /admin/news/{id}/toggle`** (§3.6), not the
   explicit-set alternative.
3. **A title over 200 characters returns `Title must be 200 characters or fewer.`**
   rather than `Title and body are required.`, which would be misleading to
   someone who typed a long title. One line in `news.service.js` if you disagree.

Backend files: `src/routes/news.routes.js`, `src/routes/newsAdmin.routes.js`,
`src/controllers/news.controller.js`, `src/services/news.service.js`,
`src/middleware/newsAdmin.middleware.js`, `Announcement` in `prisma/schema.prisma`.
`npm run seed:news` loads the six announcements that used to live in `newsMock.js`.

---

## 1. Transport conventions

These are set by the existing client, [`src/services/apiClient.js`](../src/services/apiClient.js);
new endpoints must follow them.

- **Base URL**: `EXPO_PUBLIC_API_URL`, falling back to `https://wgh-api.projectco.space/api`
  (see [`env.ts`](../env.ts)). The client appends `/api` if the configured value doesn't end with it,
  so every path below is relative to `<base>/api`.
- **Content type**: request and response bodies are JSON. A response without
  `Content-Type: application/json` is treated as empty.
- **Response envelope**: the same shape the auth endpoints already use.

  ```json
  { "success": true, "message": "OK", "data": { } }
  ```

  The client returns `data` when present, otherwise the whole payload — so a bare
  array also works, but prefer the envelope for consistency with `/auth/*`.
- **Errors**: return a non-2xx status **or** `"success": false`, with a human-readable
  `message`. That `message` is what the user sees in the red alert banner, so write it
  for a clinician, not a developer.

  ```json
  { "success": false, "message": "Title and body are required." }
  ```
- **Auth**: `Authorization: Bearer <token>` on every `/admin/news` route, matching
  [`authService.js`](../src/services/authService.js).
- **204 No Content** is accepted for deletes.

---

## 2. Data model

From `models.py` (`announcements` table). Keep the columns; only the JSON names change.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | ~~integer~~ ObjectId, PK | Built as `_id` on MongoDB — see §0. |
| `title` | varchar(200), required | |
| `body` | text, required | Plain text. **Newlines must be preserved** — the app renders them as-is. |
| `ann_type` | varchar(20), default `info` | One of `info`, `update`, `warning`, `success`. |
| `is_pinned` | boolean, default false | Pinned items sort above everything else. |
| `is_active` | boolean, default true | False = hidden from the public feed, still visible in admin. |
| `published_date` | date, required | The date shown to users; not the creation timestamp. |
| `created_at` | datetime | Server-set, not returned. |

### JSON representation

The app uses camelCase and expects both a machine date and a display date:

```json
{
  "id": "6a7306c9462bbffed285458d",
  "title": "ROTEM Major Haemorrhage Pathway updated",
  "body": "The pathway has been revised.\nReview the fibrinogen triggers.",
  "type": "update",
  "pinned": true,
  "active": true,
  "publishedDate": "2026-08-02",
  "date": "02 Aug 2026"
}
```

| JSON field | Column | Format | Required in response |
| --- | --- | --- | --- |
| `id` | `id` | ~~integer~~ 24-char ObjectId string | yes |
| `title` | `title` | string | yes |
| `body` | `body` | string, `\n` preserved | yes |
| `type` | `ann_type` | `info` \| `update` \| `warning` \| `success` | yes — unknown values fall back to `info` in the UI |
| `pinned` | `is_pinned` | boolean | yes |
| `active` | `is_active` | boolean | admin responses; optional on the public feed |
| `publishedDate` | `published_date` | `YYYY-MM-DD` | yes — the admin edit form binds to this |
| `date` | `published_date` | `DD Mon YYYY`, e.g. `02 Aug 2026` | preferred; the client can derive it with `formatDate()` if omitted |

> `active` is treated as true unless it is explicitly `false`, mirroring the
> `is_active` default — so omitting it on the public feed is safe.

As built, the server always sends every field in this table, `active` and `date`
included, on both the public and admin responses. The client still tolerates
either being absent (§5), so a leaner payload would not break anything.

---

## 3. Endpoints

### 3.1 `GET /news` — public feed

Powers the News & Updates tab. No auth.

**Rules**
1. Return **active announcements only** (`is_active = true`).
2. Sort **pinned first**, then `published_date` descending.

This is the existing Flask query in `app.py`:

```python
Announcement.query.filter_by(is_active=True).order_by(
    Announcement.is_pinned.desc(),
    Announcement.published_date.desc(),
).all()
```

**200 Response**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "ROTEM Major Haemorrhage Pathway updated",
      "body": "The pathway has been revised.\nReview the fibrinogen triggers.",
      "type": "update",
      "pinned": true,
      "publishedDate": "2026-08-02",
      "date": "02 Aug 2026"
    }
  ]
}
```

An empty array is a valid, expected response — the app shows
"No announcements yet. Check back soon."

---

### 3.2 `POST /admin/news/login` — admin sign-in

The current web admin compares a password against `ADMIN_PASSWORD` and sets a cookie.
The app needs a token instead.

> **Done:** the interim gate is gone. `ADMIN_PASSWORD` and
> `EXPO_PUBLIC_ADMIN_PASSWORD` have been removed from [`env.ts`](../env.ts), so no
> password ships in the bundle. The value now lives only in the backend's
> environment (`ADMIN_PASSWORD`, defaulting to `Askme1plz` — change it in the
> deployed environment).

**Request**

```json
{ "password": "…" }
```

**200 Response**

```json
{ "success": true, "data": { "token": "…", "expiresIn": 28800 } }
```

**401 Response**

```json
{ "success": false, "message": "Wrong password." }
```

Notes:
- ✅ 8-hour session, matching the web admin (`ADMIN_TOKEN_EXPIRES_IN`, seconds).
- ✅ Rate-limited by IP: 10 failed attempts per 15 minutes; successful sign-ins
  don't count toward it. Over the limit returns 429 with
  `Too many sign-in attempts. Please try again later.`, which the login card shows.
- The token is a JWT carrying `scope: "news-admin"`, kept separate from normal
  user tokens: a `/auth/login` token on `/admin/news` gets 403, and a news-admin
  token on `/auth/me` gets 401. Both directions are covered by the backend tests.
- The `isAdmin`-claim alternative was not taken — the shared-password endpoint is
  what shipped, so the admin screen keeps its login step.

---

### 3.3 `GET /admin/news` — admin list

Auth required.

**Rules**
1. Return **all** announcements, hidden ones included.
2. Same sort order as the public feed (pinned first, then newest).
3. `active` is required here — the admin list renders a "Hidden" badge from it.

**200 Response**

```json
{
  "success": true,
  "data": [
    {
      "id": 6,
      "title": "Study day registration closes Friday",
      "body": "…",
      "type": "info",
      "pinned": false,
      "active": false,
      "publishedDate": "2026-06-30",
      "date": "30 Jun 2026"
    }
  ]
}
```

---

### 3.4 `POST /admin/news` — publish

Auth required.

**Request**

```json
{
  "title": "Theatre 3 out of service",
  "body": "Planned servicing until Friday.\nLists moved to Theatre 2.",
  "type": "warning",
  "pinned": true,
  "publishedDate": "2026-08-05"
}
```

**Validation**

| Field | Rule | Message on failure |
| --- | --- | --- |
| `title` | required, non-blank after trimming, ≤ 200 chars | `Title and body are required.` |
| `body` | required, non-blank after trimming | `Title and body are required.` |
| `type` | one of the four values; default `info` if absent | `Unknown announcement type.` |
| `pinned` | boolean; default `false` | — |
| `publishedDate` | `YYYY-MM-DD`; defaults to today if absent | `Date must be in YYYY-MM-DD format.` |

`is_active` is always `true` on create.

**201 Response** — the created announcement, in the same shape as the list.

```json
{ "success": true, "message": "Announcement added!", "data": { "id": 7, "…": "…" } }
```

**400 Response** on validation failure.

---

### 3.5 `PUT /admin/news/{id}` — edit

Auth required. Body is the same as create; all five fields are sent every time
(the inline edit form is prefilled, so this is a full replace, not a patch).
`active` is **not** part of this call — use the toggle endpoint.

**200 Response**

```json
{ "success": true, "message": "Updated!", "data": { "id": 1, "…": "…" } }
```

**404** if the id doesn't exist. **400** on the same validation rules as create.

---

### 3.6 `PATCH /admin/news/{id}/toggle` — hide / show

Auth required. No body. Flips `is_active` and returns the new state — this is what
the eye / eye-slash button calls.

**200 Response**

```json
{ "success": true, "message": "Status toggled.", "data": { "id": 1, "active": false } }
```

**404** if the id doesn't exist.

> **Chosen: the flip.** `PATCH /admin/news/{id}/toggle`, no body, returning the
> new state. The explicit-set variant is not implemented.

---

### 3.7 `DELETE /admin/news/{id}` — remove

Auth required. Hard delete, as the web admin does. The app asks the user to confirm
before calling this.

**200 Response**

```json
{ "success": true, "message": "Deleted." }
```

**204 No Content** is also fine. **404** if the id doesn't exist.

---

## 4. Endpoint summary

| Method | Path | Auth | Used by |
| --- | --- | --- | --- |
| `GET` | `/news` | none | News tab |
| `POST` | `/admin/news/login` | none | Admin login card |
| `GET` | `/admin/news` | Bearer | Admin list |
| `POST` | `/admin/news` | Bearer | Publish button |
| `PUT` | `/admin/news/{id}` | Bearer | Save Changes |
| `PATCH` | `/admin/news/{id}/toggle` | Bearer | Hide / Show button |
| `DELETE` | `/admin/news/{id}` | Bearer | Delete button |

---

## 5. Client wiring

Every function in `src/services/newsService.js` currently reads from an in-memory
mock. Once the endpoints exist, the file becomes:

```js
import { request } from './apiClient';

// Token from POST /admin/news/login — hold it in memory or SecureStore, and
// clear it when the admin screen unmounts.
let adminToken = null;
const auth = () => ({ Authorization: `Bearer ${adminToken}` });

export function getNews() {
  return request('/news');
}

export function adminLogin(password) {
  return request('/admin/news/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  }).then(data => { adminToken = data.token; return data; });
}

export function getAllNews() {
  return request('/admin/news', { headers: auth() });
}

export function addNews(fields) {
  return request('/admin/news', {
    method: 'POST',
    headers: auth(),
    body: JSON.stringify(fields),
  });
}

export function updateNews(id, fields) {
  return request(`/admin/news/${id}`, {
    method: 'PUT',
    headers: auth(),
    body: JSON.stringify(fields),
  });
}

export function toggleNews(id) {
  return request(`/admin/news/${id}/toggle`, { method: 'PATCH', headers: auth() });
}

export function deleteNews(id) {
  return request(`/admin/news/${id}`, { method: 'DELETE', headers: auth() });
}
```

`formatDate()` and `todayIso()` stay as they are — the admin form uses them for the
date field's default value and for optimistic display.

**Done, with two additions to the sketch above.** `newsService` also exports
`clearAdminToken()`, and each response passes through a small `normalize()` that
fills in `date` from `publishedDate` when the server omits it and treats a missing
`active` as `true` — the two fields §2 marks optional. `formatDate()` and
`todayIso()` are unchanged.

`NewsAdminScreen.handleLogin` now awaits `adminLogin(password)`, sets `authed`
only on success, and shows the server's message on failure; the button shows a
spinner and "Signing in…" while the request is in flight. The screen calls
`clearAdminToken()` on unmount, so leaving and returning requires signing in
again. `ADMIN_PASSWORD` is gone from `env.ts`.

---

## 6. Behaviour the UI depends on

Worth checking against the backend once it's live:

- **Ordering is the server's job.** The app renders the array as received.
- **`\n` in `body` must survive** the round trip — announcements are written as
  short paragraphs and the app renders line breaks literally.
- **The list reloads after every admin action** (add, edit, toggle, delete), so
  each of those may be followed immediately by `GET /admin/news`.
- **The public feed reloads whenever Home regains focus**, including on returning
  from the admin screen. Cache accordingly if that traffic matters.
- **Errors are shown verbatim** in the alert banner or the feed's error state.

---

## 7. Tests

The UI contract is covered by 65 tests (`npm test`), all passing:

| Suite | Covers |
| --- | --- |
| `src/services/__tests__/newsService.test.js` | URL / method / headers / body per endpoint, token attach + clear, `\n` preservation, optional `date` and `active`, 204 delete, server error messages — all against `fetch` mocks |
| `src/components/__tests__/NewsFeed.test.js` | Loading, list, pinned, type colours, empty, error + retry, admin button |
| `src/screens/__tests__/NewsAdminScreen.test.js` | Login gate via `adminLogin`, server message passthrough, token cleared on unmount, validation, publish, edit, toggle, delete confirmation |
| `src/screens/__tests__/HomeScreen.test.js` | Tab switching, "New" badge, admin navigation, footer |

The screen and component suites mock `newsService`, so they check the shape the
screens expect rather than the network. The service suite was rewritten against
`fetch` mocks when the network layer landed; ordering and the active filter are no
longer asserted there because they are the server's job, and the backend is tested
for them directly.

Ordering, filtering, validation, auth scoping and the full admin round trip were
also verified against a running backend before this was called done.
