// Behaviour of the news network layer, against mocked fetch responses.
// The contract is docs/NEWS_API.md:
//   GET    /news                     active announcements, pinned first
//   POST   /admin/news/login         shared password -> bearer token
//   GET    /admin/news               everything, hidden included
//   POST   /admin/news               publish
//   PUT    /admin/news/:id           full replace
//   PATCH  /admin/news/:id/toggle    hide / show
//   DELETE /admin/news/:id           hard delete
//
// Ordering and the active filter are the server's job, so they are not
// re-tested here — what matters is that the client calls the right URL with the
// right method, headers and body, and passes the payload through untouched.
import { BACKEND_URL } from '../../../env';

let service;

const BASE = String(BACKEND_URL).replace(/\/+$/, '').endsWith('/api')
  ? String(BACKEND_URL).replace(/\/+$/, '')
  : `${String(BACKEND_URL).replace(/\/+$/, '')}/api`;

const ANNOUNCEMENT = {
  id: '6a7306c9462bbffed285458d',
  title: 'ROTEM Major Haemorrhage Pathway updated',
  body: 'The pathway has been revised.\nReview the fibrinogen triggers.',
  type: 'update',
  pinned: true,
  active: true,
  publishedDate: '2026-08-02',
  date: '02 Aug 2026',
};

// Mimics the envelope the backend sends and the headers apiClient inspects.
function jsonResponse(payload, { status = 200 } = {}) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    headers: { get: () => 'application/json' },
    json: () => Promise.resolve(payload),
  });
}

const ok = (data, message = 'OK') => jsonResponse({ success: true, message, data });
const fail = (message, status = 400) =>
  jsonResponse({ success: false, message, data: null }, { status });

const lastCall = () => global.fetch.mock.calls[global.fetch.mock.calls.length - 1];
const urlOf = () => lastCall()[0];
const optsOf = () => lastCall()[1];

beforeEach(() => {
  jest.resetModules(); // fresh in-memory admin token per test
  service = require('../newsService');
  global.fetch = jest.fn();
});

afterEach(() => {
  delete global.fetch;
});

// Signs in so the admin calls have a token to attach.
async function signIn() {
  global.fetch.mockReturnValueOnce(ok({ token: 'test-token', expiresIn: 28800 }, 'Signed in.'));
  await service.adminLogin('Askme1plz');
}

describe('formatDate', () => {
  it('renders the ISO date the way the web app does', () => {
    expect(service.formatDate('2026-08-02')).toBe('02 Aug 2026');
    expect(service.formatDate('2026-01-09')).toBe('09 Jan 2026');
    expect(service.formatDate('2026-12-31')).toBe('31 Dec 2026');
  });

  it('passes through anything it cannot parse', () => {
    expect(service.formatDate('not-a-date')).toBe('not-a-date');
  });
});

describe('todayIso', () => {
  it('returns a zero-padded YYYY-MM-DD string', () => {
    expect(service.todayIso()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('getNews (public feed)', () => {
  it('GETs /news with no auth header', async () => {
    global.fetch.mockReturnValueOnce(ok([ANNOUNCEMENT]));

    await service.getNews();

    expect(urlOf()).toBe(`${BASE}/news`);
    expect(optsOf().method).toBe('GET');
    expect(optsOf().headers.Authorization).toBeUndefined();
  });

  it('returns the announcements in the order the server sent them', async () => {
    const second = { ...ANNOUNCEMENT, id: 'b', pinned: false, publishedDate: '2026-07-28' };
    global.fetch.mockReturnValueOnce(ok([ANNOUNCEMENT, second]));

    const feed = await service.getNews();

    expect(feed.map(i => i.id)).toEqual([ANNOUNCEMENT.id, 'b']);
  });

  it('preserves newlines in the body', async () => {
    global.fetch.mockReturnValueOnce(ok([ANNOUNCEMENT]));

    const [item] = await service.getNews();

    expect(item.body).toContain('\n');
    expect(item.body).toBe(ANNOUNCEMENT.body);
  });

  it('treats an announcement with no active flag as visible', async () => {
    const { active, ...withoutFlag } = ANNOUNCEMENT;
    global.fetch.mockReturnValueOnce(ok([withoutFlag]));

    const [item] = await service.getNews();

    expect(item.active).toBe(true);
  });

  it('derives the display date when the server omits it', async () => {
    const { date, ...withoutDate } = ANNOUNCEMENT;
    global.fetch.mockReturnValueOnce(ok([withoutDate]));

    const [item] = await service.getNews();

    expect(item.date).toBe('02 Aug 2026');
  });

  it('returns an empty list rather than throwing when there is no news', async () => {
    global.fetch.mockReturnValueOnce(ok([]));

    await expect(service.getNews()).resolves.toEqual([]);
  });

  it('surfaces the server message so the feed can show it', async () => {
    global.fetch.mockReturnValueOnce(fail('Announcements are unavailable.', 500));

    await expect(service.getNews()).rejects.toThrow('Announcements are unavailable.');
  });
});

describe('adminLogin', () => {
  it('POSTs the password and returns the token', async () => {
    global.fetch.mockReturnValueOnce(ok({ token: 'test-token', expiresIn: 28800 }, 'Signed in.'));

    const result = await service.adminLogin('Askme1plz');

    expect(urlOf()).toBe(`${BASE}/admin/news/login`);
    expect(optsOf().method).toBe('POST');
    expect(JSON.parse(optsOf().body)).toEqual({ password: 'Askme1plz' });
    expect(result.token).toBe('test-token');
  });

  it('raises the server message on a wrong password', async () => {
    global.fetch.mockReturnValueOnce(fail('Wrong password.', 401));

    await expect(service.adminLogin('nope')).rejects.toThrow('Wrong password.');
  });

  it('does not leave a token behind after a failed sign-in', async () => {
    global.fetch.mockReturnValueOnce(fail('Wrong password.', 401));
    await expect(service.adminLogin('nope')).rejects.toThrow();

    global.fetch.mockReturnValueOnce(ok([]));
    await service.getAllNews();

    expect(optsOf().headers.Authorization).toBe('Bearer null');
  });

  it('clearAdminToken drops the token', async () => {
    await signIn();
    service.clearAdminToken();

    global.fetch.mockReturnValueOnce(ok([]));
    await service.getAllNews();

    expect(optsOf().headers.Authorization).toBe('Bearer null');
  });
});

describe('getAllNews (admin list)', () => {
  it('GETs /admin/news with the bearer token', async () => {
    await signIn();
    global.fetch.mockReturnValueOnce(ok([ANNOUNCEMENT]));

    await service.getAllNews();

    expect(urlOf()).toBe(`${BASE}/admin/news`);
    expect(optsOf().headers.Authorization).toBe('Bearer test-token');
  });

  it('keeps hidden announcements, which the admin list badges', async () => {
    await signIn();
    const hidden = { ...ANNOUNCEMENT, id: 'hidden', active: false };
    global.fetch.mockReturnValueOnce(ok([ANNOUNCEMENT, hidden]));

    const all = await service.getAllNews();

    expect(all.find(i => i.id === 'hidden').active).toBe(false);
  });
});

describe('addNews', () => {
  it('POSTs the five form fields and returns the created announcement', async () => {
    await signIn();
    const created = { ...ANNOUNCEMENT, id: 'new', title: 'Theatre 3 out of service' };
    global.fetch.mockReturnValueOnce(ok(created, 'Announcement added!'));

    const fields = {
      title: 'Theatre 3 out of service',
      body: 'Planned servicing.\nLists moved.',
      type: 'warning',
      pinned: true,
      publishedDate: '2026-08-05',
    };
    const result = await service.addNews(fields);

    expect(urlOf()).toBe(`${BASE}/admin/news`);
    expect(optsOf().method).toBe('POST');
    expect(optsOf().headers.Authorization).toBe('Bearer test-token');
    expect(JSON.parse(optsOf().body)).toEqual(fields);
    expect(result.id).toBe('new');
  });

  it('raises the validation message the server returned', async () => {
    await signIn();
    global.fetch.mockReturnValueOnce(fail('Title and body are required.'));

    await expect(service.addNews({ title: '', body: '' })).rejects.toThrow(
      'Title and body are required.'
    );
  });
});

describe('updateNews', () => {
  it('PUTs to /admin/news/:id with the full replacement body', async () => {
    await signIn();
    global.fetch.mockReturnValueOnce(ok({ ...ANNOUNCEMENT, title: 'Edited' }, 'Updated!'));

    const fields = {
      title: 'Edited',
      body: 'Edited body',
      type: 'success',
      pinned: false,
      publishedDate: '2026-01-09',
    };
    const result = await service.updateNews(ANNOUNCEMENT.id, fields);

    expect(urlOf()).toBe(`${BASE}/admin/news/${ANNOUNCEMENT.id}`);
    expect(optsOf().method).toBe('PUT');
    expect(JSON.parse(optsOf().body)).toEqual(fields);
    expect(result.title).toBe('Edited');
  });

  it('raises on an id the server does not know', async () => {
    await signIn();
    global.fetch.mockReturnValueOnce(fail('Announcement not found.', 404));

    await expect(service.updateNews('missing', {})).rejects.toThrow('Announcement not found.');
  });
});

describe('toggleNews', () => {
  it('PATCHes /admin/news/:id/toggle with no body and returns the new state', async () => {
    await signIn();
    global.fetch.mockReturnValueOnce(
      ok({ id: ANNOUNCEMENT.id, active: false }, 'Status toggled.')
    );

    const result = await service.toggleNews(ANNOUNCEMENT.id);

    expect(urlOf()).toBe(`${BASE}/admin/news/${ANNOUNCEMENT.id}/toggle`);
    expect(optsOf().method).toBe('PATCH');
    expect(optsOf().body).toBeUndefined();
    expect(result.active).toBe(false);
  });
});

describe('deleteNews', () => {
  it('DELETEs /admin/news/:id', async () => {
    await signIn();
    global.fetch.mockReturnValueOnce(ok(null, 'Deleted.'));

    await service.deleteNews(ANNOUNCEMENT.id);

    expect(urlOf()).toBe(`${BASE}/admin/news/${ANNOUNCEMENT.id}`);
    expect(optsOf().method).toBe('DELETE');
    expect(optsOf().headers.Authorization).toBe('Bearer test-token');
  });

  it('accepts a 204 No Content response', async () => {
    await signIn();
    global.fetch.mockReturnValueOnce(
      Promise.resolve({
        ok: true,
        status: 204,
        headers: { get: () => '' }, // no JSON body
        json: () => Promise.reject(new Error('no body')),
      })
    );

    await expect(service.deleteNews(ANNOUNCEMENT.id)).resolves.toBeNull();
  });

  it('raises on an id the server does not know', async () => {
    await signIn();
    global.fetch.mockReturnValueOnce(fail('Announcement not found.', 404));

    await expect(service.deleteNews('missing')).rejects.toThrow('Announcement not found.');
  });
});
