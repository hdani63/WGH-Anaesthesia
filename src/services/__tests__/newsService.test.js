// Behaviour of the news data layer, matched against the Replit backend:
//   /news        -> active announcements, pinned first, then newest (app.py)
//   /admin/news  -> everything, with add / edit / delete / toggle actions
let service;

beforeEach(() => {
  jest.resetModules(); // fresh in-memory store per test
  service = require('../newsService');
});

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
  it('returns only active announcements', async () => {
    const feed = await service.getNews();
    expect(feed.length).toBeGreaterThan(0);
    expect(feed.every(item => item.active)).toBe(true);
  });

  it('treats an announcement with no active flag as visible', async () => {
    const created = await service.addNews({
      title: 'No flag',
      body: 'Body',
      publishedDate: '2026-08-05',
    });
    delete created.active; // simulate a record that predates the field
    const feed = await service.getNews();
    expect(feed.some(i => i.id === created.id)).toBe(true);
  });

  it('hides announcements that are toggled off', async () => {
    const all = await service.getAllNews();
    const hidden = all.filter(item => !item.active);
    expect(hidden.length).toBeGreaterThan(0);

    const feed = await service.getNews();
    hidden.forEach(item => {
      expect(feed.some(i => i.id === item.id)).toBe(false);
    });
  });

  it('puts pinned announcements first', async () => {
    const feed = await service.getNews();
    const firstUnpinned = feed.findIndex(item => !item.pinned);
    const lastPinned = feed.map(item => item.pinned).lastIndexOf(true);
    expect(lastPinned).toBeLessThan(firstUnpinned);
  });

  it('orders by published date, newest first, within each pinned group', async () => {
    const feed = await service.getNews();
    const dates = group => feed.filter(i => i.pinned === group).map(i => i.publishedDate);
    [true, false].forEach(group => {
      const list = dates(group);
      expect(list).toEqual([...list].sort().reverse());
    });
  });

  it('gives every item a display date and a known type', async () => {
    const feed = await service.getNews();
    feed.forEach(item => {
      expect(item.date).toBe(service.formatDate(item.publishedDate));
      expect(['info', 'update', 'warning', 'success']).toContain(item.type);
    });
  });
});

describe('getAllNews (admin list)', () => {
  it('includes hidden announcements the public feed leaves out', async () => {
    const [feed, all] = await Promise.all([service.getNews(), service.getAllNews()]);
    expect(all.length).toBeGreaterThan(feed.length);
  });
});

describe('addNews', () => {
  it('publishes a new announcement to the top of the admin list', async () => {
    const before = await service.getAllNews();
    const created = await service.addNews({
      title: 'Theatre list change',
      body: 'Line one\nLine two',
      type: 'warning',
      pinned: false,
      publishedDate: '2026-08-05',
    });

    expect(created.id).toBeGreaterThan(0);
    expect(created.date).toBe('05 Aug 2026');
    expect(created.active).toBe(true);

    const after = await service.getAllNews();
    expect(after.length).toBe(before.length + 1);
    expect(after.some(i => i.id === created.id)).toBe(true);
  });

  it('shows the new announcement in the public feed straight away', async () => {
    const created = await service.addNews({
      title: 'New',
      body: 'Body',
      type: 'info',
      pinned: false,
      publishedDate: '2026-08-05',
    });
    const feed = await service.getNews();
    expect(feed.some(i => i.id === created.id)).toBe(true);
  });

  it('defaults the type to info and never collides on id', async () => {
    const a = await service.addNews({ title: 'A', body: 'A', publishedDate: '2026-08-05' });
    const b = await service.addNews({ title: 'B', body: 'B', publishedDate: '2026-08-05' });
    expect(a.type).toBe('info');
    expect(b.id).not.toBe(a.id);
  });

  it('places a pinned announcement above unpinned ones', async () => {
    const created = await service.addNews({
      title: 'Pinned notice',
      body: 'Body',
      type: 'update',
      pinned: true,
      publishedDate: '2020-01-01', // old on purpose — pinning must still win
    });
    const feed = await service.getNews();
    const position = feed.findIndex(i => i.id === created.id);
    const firstUnpinned = feed.findIndex(i => !i.pinned);
    expect(position).toBeLessThan(firstUnpinned);
  });
});

describe('updateNews', () => {
  it('saves every edited field and reformats the date', async () => {
    const [target] = await service.getAllNews();
    await service.updateNews(target.id, {
      title: 'Edited title',
      body: 'Edited body',
      type: 'success',
      pinned: !target.pinned,
      publishedDate: '2026-01-09',
    });

    const updated = (await service.getAllNews()).find(i => i.id === target.id);
    expect(updated.title).toBe('Edited title');
    expect(updated.body).toBe('Edited body');
    expect(updated.type).toBe('success');
    expect(updated.pinned).toBe(!target.pinned);
    expect(updated.publishedDate).toBe('2026-01-09');
    expect(updated.date).toBe('09 Jan 2026');
  });

  it('leaves other announcements untouched', async () => {
    const all = await service.getAllNews();
    const [target, other] = all;
    await service.updateNews(target.id, {
      title: 'Changed',
      body: 'Changed',
      type: 'info',
      pinned: false,
      publishedDate: '2026-02-02',
    });
    const untouched = (await service.getAllNews()).find(i => i.id === other.id);
    expect(untouched).toEqual(other);
  });
});

describe('toggleNews', () => {
  it('hides an active announcement from the public feed', async () => {
    const feed = await service.getNews();
    const target = feed[0];

    await service.toggleNews(target.id);

    const afterFeed = await service.getNews();
    expect(afterFeed.some(i => i.id === target.id)).toBe(false);

    const inAdmin = (await service.getAllNews()).find(i => i.id === target.id);
    expect(inAdmin.active).toBe(false);
  });

  it('brings a hidden announcement back', async () => {
    const hidden = (await service.getAllNews()).find(i => !i.active);
    await service.toggleNews(hidden.id);
    const feed = await service.getNews();
    expect(feed.some(i => i.id === hidden.id)).toBe(true);
  });
});

describe('deleteNews', () => {
  it('removes the announcement from both lists', async () => {
    const all = await service.getAllNews();
    const target = all[0];

    await service.deleteNews(target.id);

    const [afterAll, afterFeed] = await Promise.all([service.getAllNews(), service.getNews()]);
    expect(afterAll.length).toBe(all.length - 1);
    expect(afterAll.some(i => i.id === target.id)).toBe(false);
    expect(afterFeed.some(i => i.id === target.id)).toBe(false);
  });
});
