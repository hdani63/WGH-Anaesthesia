import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: effect => require('react').useEffect(effect, [effect]),
}));

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { fullName: 'Dr Test' },
    logout: jest.fn(),
    deleteAccount: jest.fn(),
    isLoading: false,
  }),
}));

jest.mock('../../services/newsService', () => ({ getNews: jest.fn() }));

import HomeScreen from '../HomeScreen';
import { getNews } from '../../services/newsService';

const ITEMS = [
  {
    id: 1,
    title: 'ROTEM pathway updated',
    body: 'Fibrinogen triggers revised.',
    type: 'update',
    pinned: true,
    active: true,
    publishedDate: '2026-08-02',
    date: '02 Aug 2026',
  },
];

const navigation = { navigate: jest.fn() };

beforeEach(() => {
  jest.clearAllMocks();
  getNews.mockResolvedValue(ITEMS);
});

describe('tabs', () => {
  it('opens on the Tools tab with the search bar and tool grid', async () => {
    await render(<HomeScreen navigation={navigation} />);

    expect(screen.getByPlaceholderText('Search tools, drugs, protocols…')).toBeTruthy();
    expect(screen.getByText('Preoperative Assessment')).toBeTruthy();
    expect(screen.queryByText('ROTEM pathway updated')).toBeNull();
  });

  it('shows both tab labels', async () => {
    await render(<HomeScreen navigation={navigation} />);
    expect(screen.getByText('Tools')).toBeTruthy();
    expect(screen.getByText('News & Updates')).toBeTruthy();
  });

  it('switches to the news feed and hides the tools search', async () => {
    await render(<HomeScreen navigation={navigation} />);
    await fireEvent.press(screen.getByText('News & Updates'));

    await waitFor(() => expect(screen.getByText('ROTEM pathway updated')).toBeTruthy());
    expect(screen.queryByPlaceholderText('Search tools, drugs, protocols…')).toBeNull();
    expect(screen.queryByText('Preoperative Assessment')).toBeNull();
  });

  it('switches back to the tools grid', async () => {
    await render(<HomeScreen navigation={navigation} />);
    await fireEvent.press(screen.getByText('News & Updates'));
    await waitFor(() => expect(screen.getByText('ROTEM pathway updated')).toBeTruthy());

    await fireEvent.press(screen.getByText('Tools'));
    expect(screen.getByText('Preoperative Assessment')).toBeTruthy();
    expect(screen.queryByText('ROTEM pathway updated')).toBeNull();
  });
});

describe('footer', () => {
  it('stays on screen on both tabs, pushed down by a growing spacer', async () => {
    const { toJSON } = await render(<HomeScreen navigation={navigation} />);
    expect(screen.getByText('© 2025 Anaesthesia Companion App')).toBeTruthy();

    await fireEvent.press(screen.getByText('News & Updates'));
    await waitFor(() => expect(screen.getByText('ROTEM pathway updated')).toBeTruthy());
    expect(screen.getByText('© 2025 Anaesthesia Companion App')).toBeTruthy();
    expect(screen.getByText('For medical professional use only')).toBeTruthy();

    // The ScrollView content must be able to fill the viewport, otherwise the
    // footer floats mid-screen when a tab's content is short.
    const scrollView = JSON.stringify(toJSON());
    expect(scrollView).toContain('"flexGrow":1');
  });
});

describe('new-announcement badge', () => {
  it('flags unread announcements on the News tab', async () => {
    await render(<HomeScreen navigation={navigation} />);
    await waitFor(() => expect(screen.getByText('New')).toBeTruthy());
  });

  it('clears the badge once the News tab has been opened', async () => {
    await render(<HomeScreen navigation={navigation} />);
    await waitFor(() => expect(screen.getByText('New')).toBeTruthy());

    await fireEvent.press(screen.getByText('News & Updates'));
    await waitFor(() => expect(screen.queryByText('New')).toBeNull());
  });

  it('shows no badge when there are no announcements', async () => {
    getNews.mockResolvedValue([]);
    await render(<HomeScreen navigation={navigation} />);

    await waitFor(() => expect(getNews).toHaveBeenCalled());
    expect(screen.queryByText('New')).toBeNull();
  });
});

describe('admin navigation', () => {
  it('opens the news admin screen from the news tab', async () => {
    await render(<HomeScreen navigation={navigation} />);
    await fireEvent.press(screen.getByText('News & Updates'));

    await waitFor(() =>
      expect(screen.getByText('Admin — Add / Edit / Remove Announcements')).toBeTruthy()
    );
    await fireEvent.press(screen.getByText('Admin — Add / Edit / Remove Announcements'));
    expect(navigation.navigate).toHaveBeenCalledWith('NewsAdmin');
  });
});

describe('tool search', () => {
  it('still filters the tool grid', async () => {
    await render(<HomeScreen navigation={navigation} />);

    await fireEvent.changeText(
      screen.getByPlaceholderText('Search tools, drugs, protocols…'),
      'rotem'
    );

    expect(screen.getByText('Massive Transfusion & ROTEM')).toBeTruthy();
    expect(screen.queryByText('Preoperative Assessment')).toBeNull();
  });
});
