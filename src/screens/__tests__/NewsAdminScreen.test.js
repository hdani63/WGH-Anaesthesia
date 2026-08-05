import React from 'react';
import { Alert } from 'react-native';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';

jest.mock('../../services/newsService', () => ({
  getAllNews: jest.fn(),
  addNews: jest.fn(),
  updateNews: jest.fn(),
  toggleNews: jest.fn(),
  deleteNews: jest.fn(),
  formatDate: jest.requireActual('../../services/newsService').formatDate,
  todayIso: jest.fn(() => '2026-08-05'),
}));

import NewsAdminScreen from '../NewsAdminScreen';
import {
  addNews,
  deleteNews,
  getAllNews,
  toggleNews,
  updateNews,
} from '../../services/newsService';

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
  {
    id: 2,
    title: 'Study day registration',
    body: 'Closes Friday.',
    type: 'info',
    pinned: false,
    active: false,
    publishedDate: '2026-06-30',
    date: '30 Jun 2026',
  },
];

const TITLE_PLACEHOLDER = 'e.g. Sepsis Protocol Updated — August 2026';
const BODY_PLACEHOLDER =
  'Write the announcement content here. Plain text is fine — line breaks are preserved.';

const navigation = { goBack: jest.fn(), navigate: jest.fn() };

async function renderLoggedIn() {
  await render(<NewsAdminScreen navigation={navigation} />);
  await fireEvent.changeText(screen.getByPlaceholderText('••••••••'), 'secret');
  await fireEvent.press(screen.getByText('Login'));
  await waitFor(() => expect(screen.getByText('Add New Announcement')).toBeTruthy());
}

beforeEach(() => {
  jest.clearAllMocks();
  getAllNews.mockResolvedValue(ITEMS);
  addNews.mockResolvedValue({ id: 9 });
  updateNews.mockResolvedValue(true);
  toggleNews.mockResolvedValue(true);
  deleteNews.mockResolvedValue(true);
});

describe('login gate', () => {
  it('shows the login card and hides the admin tools until logged in', async () => {
    await render(<NewsAdminScreen navigation={navigation} />);

    expect(screen.getByText('Admin Login')).toBeTruthy();
    expect(screen.getByPlaceholderText('••••••••')).toBeTruthy();
    expect(screen.queryByText('Add New Announcement')).toBeNull();
    expect(getAllNews).not.toHaveBeenCalled();
  });

  it('rejects an empty password', async () => {
    await render(<NewsAdminScreen navigation={navigation} />);
    await fireEvent.press(screen.getByText('Login'));

    expect(screen.getByText('Please enter the admin password.')).toBeTruthy();
    expect(screen.queryByText('Add New Announcement')).toBeNull();
  });

  it('loads the announcements once logged in', async () => {
    await renderLoggedIn();
    expect(getAllNews).toHaveBeenCalled();
    expect(screen.getByText('ROTEM pathway updated')).toBeTruthy();
  });
});

describe('announcement list', () => {
  it('shows the count, the type badge, the pinned badge and the hidden badge', async () => {
    await renderLoggedIn();

    expect(screen.getByText('ALL ANNOUNCEMENTS (2)')).toBeTruthy();
    // Each label appears twice: once as a type chip in the add form, once as the
    // badge on the matching announcement.
    expect(screen.getAllByText('🔄 Update')).toHaveLength(2);
    expect(screen.getAllByText('ℹ️ Info')).toHaveLength(2);
    expect(screen.getByText('📌 Pinned')).toBeTruthy();
    expect(screen.getByText('Hidden')).toBeTruthy();
    expect(screen.getByText('02 Aug 2026')).toBeTruthy();
    expect(screen.getByText('30 Jun 2026')).toBeTruthy();
  });

  it('shows the empty message when there is nothing to list', async () => {
    getAllNews.mockResolvedValue([]);
    await renderLoggedIn();

    await waitFor(() =>
      expect(screen.getByText('No announcements yet — add one above.')).toBeTruthy()
    );
    expect(screen.getByText('ALL ANNOUNCEMENTS (0)')).toBeTruthy();
  });
});

describe('adding an announcement', () => {
  it('requires a title and a body', async () => {
    await renderLoggedIn();
    await fireEvent.press(screen.getByText('Publish'));

    expect(screen.getByText('Title and body are required.')).toBeTruthy();
    expect(addNews).not.toHaveBeenCalled();
  });

  it('publishes the drafted announcement and confirms it', async () => {
    await renderLoggedIn();

    await fireEvent.changeText(
      screen.getByPlaceholderText(TITLE_PLACEHOLDER),
      '  Theatre 3 closed  '
    );
    await fireEvent.changeText(screen.getByPlaceholderText(BODY_PLACEHOLDER), 'Line one\nLine two');
    await fireEvent.press(screen.getByText('⚠️ Important'));
    await fireEvent.press(screen.getByText('📌 Pin to top (always shows first)'));
    await fireEvent.press(screen.getByText('Publish'));

    await waitFor(() => expect(addNews).toHaveBeenCalledTimes(1));
    expect(addNews).toHaveBeenCalledWith({
      title: 'Theatre 3 closed', // trimmed
      body: 'Line one\nLine two',
      type: 'warning',
      pinned: true,
      publishedDate: '2026-08-05', // defaults to today
    });

    await waitFor(() => expect(screen.getByText('Announcement added!')).toBeTruthy());
    expect(getAllNews).toHaveBeenCalledTimes(2); // reloaded after publishing
  });

  it('clears the form after publishing', async () => {
    await renderLoggedIn();

    await fireEvent.changeText(screen.getByPlaceholderText(TITLE_PLACEHOLDER), 'Title');
    await fireEvent.changeText(screen.getByPlaceholderText(BODY_PLACEHOLDER), 'Body');
    await fireEvent.press(screen.getByText('Publish'));

    await waitFor(() => expect(screen.getByText('Announcement added!')).toBeTruthy());
    expect(screen.getByPlaceholderText(TITLE_PLACEHOLDER).props.value).toBe('');
    expect(screen.getByPlaceholderText(BODY_PLACEHOLDER).props.value).toBe('');
  });

  it('surfaces a failure from the backend', async () => {
    addNews.mockRejectedValue(new Error('boom'));
    await renderLoggedIn();

    await fireEvent.changeText(screen.getByPlaceholderText(TITLE_PLACEHOLDER), 'Title');
    await fireEvent.changeText(screen.getByPlaceholderText(BODY_PLACEHOLDER), 'Body');
    await fireEvent.press(screen.getByText('Publish'));

    await waitFor(() =>
      expect(screen.getByText('Could not add the announcement.')).toBeTruthy()
    );
  });
});

describe('editing an announcement', () => {
  it('opens an inline form prefilled with the announcement', async () => {
    await renderLoggedIn();
    await fireEvent.press(screen.getAllByLabelText('Edit')[0]);

    const titles = screen.getAllByPlaceholderText(TITLE_PLACEHOLDER);
    expect(titles).toHaveLength(2); // add form + inline edit form
    expect(titles[1].props.value).toBe('ROTEM pathway updated');
    expect(screen.getAllByPlaceholderText(BODY_PLACEHOLDER)[1].props.value).toBe(
      'Fibrinogen triggers revised.'
    );
    expect(screen.getByText('Save Changes')).toBeTruthy();
    expect(screen.getByText('Cancel')).toBeTruthy();
  });

  it('saves the edited fields', async () => {
    await renderLoggedIn();
    await fireEvent.press(screen.getAllByLabelText('Edit')[0]);

    await fireEvent.changeText(
      screen.getAllByPlaceholderText(TITLE_PLACEHOLDER)[1],
      'Edited title'
    );
    await fireEvent.press(screen.getByText('Save Changes'));

    await waitFor(() => expect(updateNews).toHaveBeenCalledTimes(1));
    expect(updateNews).toHaveBeenCalledWith(1, {
      title: 'Edited title',
      body: 'Fibrinogen triggers revised.',
      type: 'update',
      pinned: true,
      publishedDate: '2026-08-02',
    });
    await waitFor(() => expect(screen.getByText('Updated!')).toBeTruthy());
    expect(screen.queryByText('Save Changes')).toBeNull(); // form closed
  });

  it('closes the form on cancel without saving', async () => {
    await renderLoggedIn();
    await fireEvent.press(screen.getAllByLabelText('Edit')[0]);
    await fireEvent.press(screen.getByText('Cancel'));

    expect(screen.queryByText('Save Changes')).toBeNull();
    expect(updateNews).not.toHaveBeenCalled();
  });

  it('will not save an emptied title', async () => {
    await renderLoggedIn();
    await fireEvent.press(screen.getAllByLabelText('Edit')[0]);
    await fireEvent.changeText(screen.getAllByPlaceholderText(TITLE_PLACEHOLDER)[1], '   ');
    await fireEvent.press(screen.getByText('Save Changes'));

    expect(screen.getByText('Title and body are required.')).toBeTruthy();
    expect(updateNews).not.toHaveBeenCalled();
  });
});

describe('hiding and showing', () => {
  it('toggles an announcement and reloads the list', async () => {
    await renderLoggedIn();
    await fireEvent.press(screen.getByLabelText('Hide')); // the active one

    await waitFor(() => expect(toggleNews).toHaveBeenCalledWith(1));
    await waitFor(() => expect(screen.getByText('Status toggled.')).toBeTruthy());
    expect(getAllNews).toHaveBeenCalledTimes(2);
  });

  it('offers Show on an already hidden announcement', async () => {
    await renderLoggedIn();
    await fireEvent.press(screen.getByLabelText('Show')); // the hidden one
    await waitFor(() => expect(toggleNews).toHaveBeenCalledWith(2));
  });
});

describe('deleting an announcement', () => {
  it('asks for confirmation before deleting', async () => {
    const spy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    await renderLoggedIn();
    await fireEvent.press(screen.getAllByLabelText('Delete')[0]);

    expect(spy).toHaveBeenCalledWith(
      'Delete this announcement?',
      expect.any(String),
      expect.any(Array)
    );
    expect(deleteNews).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('deletes once confirmed', async () => {
    const spy = jest
      .spyOn(Alert, 'alert')
      .mockImplementation((title, message, buttons) =>
        buttons.find(b => b.text === 'Delete').onPress()
      );

    await renderLoggedIn();
    await fireEvent.press(screen.getAllByLabelText('Delete')[0]);

    await waitFor(() => expect(deleteNews).toHaveBeenCalledWith(1));
    await waitFor(() => expect(screen.getByText('Deleted.')).toBeTruthy());
    spy.mockRestore();
  });
});

describe('header', () => {
  it('goes back from the Home button', async () => {
    await render(<NewsAdminScreen navigation={navigation} />);
    await fireEvent.press(screen.getByText('Home'));
    expect(navigation.goBack).toHaveBeenCalled();
  });
});
