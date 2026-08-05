import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react-native';

// NewsFeed reloads on screen focus; outside a navigator, run the effect on mount.
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: effect => require('react').useEffect(effect, [effect]),
}));

jest.mock('../../services/newsService', () => ({ getNews: jest.fn() }));

import NewsFeed from '../NewsFeed';
import { getNews } from '../../services/newsService';

const ITEMS = [
  {
    id: 1,
    title: 'ROTEM pathway updated',
    body: 'First line\nSecond line',
    type: 'update',
    pinned: true,
    active: true,
    publishedDate: '2026-08-02',
    date: '02 Aug 2026',
  },
  {
    id: 2,
    title: 'Teaching on Wednesday',
    body: 'Paediatric airway management.',
    type: 'info',
    pinned: false,
    active: true,
    publishedDate: '2026-07-28',
    date: '28 Jul 2026',
  },
];

const ADMIN_LABEL = 'Admin — Add / Edit / Remove Announcements';

beforeEach(() => {
  jest.clearAllMocks();
  getNews.mockResolvedValue(ITEMS);
});

describe('loading state', () => {
  it('shows the loading message until the announcements arrive', async () => {
    let resolve;
    getNews.mockReturnValue(new Promise(r => { resolve = r; }));

    await render(<NewsFeed />);
    expect(screen.getByText('Loading news…')).toBeTruthy();

    await act(async () => resolve(ITEMS));
    expect(screen.queryByText('Loading news…')).toBeNull();
    expect(screen.getByText('ROTEM pathway updated')).toBeTruthy();
  });

  it('keeps the admin button reachable while loading', async () => {
    getNews.mockReturnValue(new Promise(() => {}));
    await render(<NewsFeed />);
    expect(screen.getByText(ADMIN_LABEL)).toBeTruthy();
  });
});

describe('announcement list', () => {
  it('renders a card for every announcement with title, body and date', async () => {
    await render(<NewsFeed />);

    await waitFor(() => expect(screen.getByText('ROTEM pathway updated')).toBeTruthy());
    expect(screen.getByTestId('news-card-1')).toBeTruthy();
    expect(screen.getByTestId('news-card-2')).toBeTruthy();
    expect(screen.getByText('First line\nSecond line')).toBeTruthy();
    expect(screen.getByText('02 Aug 2026')).toBeTruthy();
    expect(screen.getByText('Teaching on Wednesday')).toBeTruthy();
    expect(screen.getByText('28 Jul 2026')).toBeTruthy();
  });

  it('marks pinned announcements only', async () => {
    await render(<NewsFeed />);
    await waitFor(() => expect(screen.getByTestId('news-pin-1')).toBeTruthy());
    expect(screen.queryByTestId('news-pin-2')).toBeNull();
  });

  it('colours each card by announcement type', async () => {
    await render(<NewsFeed />);
    await waitFor(() => expect(screen.getByTestId('news-card-1')).toBeTruthy());

    const borderOf = id => {
      const styles = [screen.getByTestId(`news-card-${id}`).props.style]
        .flat(Infinity)
        .filter(Boolean);
      return styles.find(s => s.borderLeftColor).borderLeftColor;
    };

    expect(borderOf(1)).toBe('#0d6efd'); // update
    expect(borderOf(2)).toBe('#0c63e4'); // info
  });

  it('reports the loaded announcements to the parent', async () => {
    const onLoaded = jest.fn();
    await render(<NewsFeed onLoaded={onLoaded} />);
    await waitFor(() => expect(onLoaded).toHaveBeenCalledWith(ITEMS));
  });
});

describe('empty state', () => {
  it('shows the empty message when there are no announcements', async () => {
    getNews.mockResolvedValue([]);
    await render(<NewsFeed />);

    await waitFor(() =>
      expect(screen.getByText('No announcements yet. Check back soon.')).toBeTruthy()
    );
    expect(screen.getByText(ADMIN_LABEL)).toBeTruthy();
  });
});

describe('error state', () => {
  it('shows the error message and retries on demand', async () => {
    getNews.mockRejectedValueOnce(new Error('offline'));
    await render(<NewsFeed />);

    await waitFor(() =>
      expect(screen.getByText('Could not load news. Try again later.')).toBeTruthy()
    );

    getNews.mockResolvedValue(ITEMS);
    await fireEvent.press(screen.getByText('Retry'));

    await waitFor(() => expect(screen.getByText('ROTEM pathway updated')).toBeTruthy());
    expect(screen.queryByText('Could not load news. Try again later.')).toBeNull();
  });
});

describe('admin entry point', () => {
  it('opens the admin screen when pressed', async () => {
    const onAdminPress = jest.fn();
    await render(<NewsFeed onAdminPress={onAdminPress} />);

    await waitFor(() => expect(screen.getByText('ROTEM pathway updated')).toBeTruthy());
    await fireEvent.press(screen.getByText(ADMIN_LABEL));
    expect(onAdminPress).toHaveBeenCalledTimes(1);
  });
});
