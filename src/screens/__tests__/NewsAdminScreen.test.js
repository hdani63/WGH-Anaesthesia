import React from 'react';
import { Alert } from 'react-native';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react-native';

jest.mock('../../services/newsService', () => ({
  getAllNews: jest.fn(),
  addNews: jest.fn(),
  updateNews: jest.fn(),
  toggleNews: jest.fn(),
  deleteNews: jest.fn(),
  adminLogin: jest.fn(),
  clearAdminToken: jest.fn(),
  formatDate: jest.requireActual('../../services/newsService').formatDate,
  todayIso: jest.fn(() => '2026-08-05'),
}));

import NewsAdminScreen from '../NewsAdminScreen';
import {
  addNews,
  adminLogin,
  clearAdminToken,
  deleteNews,
  getAllNews,
  toggleNews,
  updateNews,
} from '../../services/newsService';

// The password is verified by POST /admin/news/login, so the screen never
// compares it locally — any non-blank string reaches the endpoint, and what the
// user sees on failure is whatever message the server sent back.
const ADMIN_PASSWORD = 'the-admin-password';

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
  await fireEvent.changeText(screen.getByPlaceholderText('••••••••'), ADMIN_PASSWORD);
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
  // Default: the endpoint accepts and returns a token. Tests that exercise a
  // rejection override this with the message the server would have sent.
  adminLogin.mockImplementation(password =>
    password === ADMIN_PASSWORD
      ? Promise.resolve({ token: 'test-token', expiresIn: 28800 })
      : Promise.reject(new Error('Wrong password.'))
  );
});

describe('login gate', () => {
  it('shows the login card and hides the admin tools until logged in', async () => {
    await render(<NewsAdminScreen navigation={navigation} />);

    expect(screen.getByText('Admin Login')).toBeTruthy();
    expect(screen.getByPlaceholderText('••••••••')).toBeTruthy();
    expect(screen.queryByText('Add New Announcement')).toBeNull();
    expect(getAllNews).not.toHaveBeenCalled();
  });

  it('rejects an empty password without calling the endpoint', async () => {
    await render(<NewsAdminScreen navigation={navigation} />);
    await fireEvent.press(screen.getByText('Login'));

    expect(screen.getByText('Please enter the admin password.')).toBeTruthy();
    expect(screen.queryByText('Add New Announcement')).toBeNull();
    expect(adminLogin).not.toHaveBeenCalled();
  });

  it('rejects a wrong password without loading anything', async () => {
    await render(<NewsAdminScreen navigation={navigation} />);
    await fireEvent.changeText(screen.getByPlaceholderText('••••••••'), 'not-the-password');
    await fireEvent.press(screen.getByText('Login'));

    await waitFor(() => expect(screen.getByText('Wrong password.')).toBeTruthy());
    expect(screen.queryByText('Add New Announcement')).toBeNull();
    expect(getAllNews).not.toHaveBeenCalled();
  });

  it('shows whatever message the server sent, so rate limiting reads clearly', async () => {
    adminLogin.mockRejectedValue(
      new Error('Too many sign-in attempts. Please try again later.')
    );

    await render(<NewsAdminScreen navigation={navigation} />);
    await fireEvent.changeText(screen.getByPlaceholderText('••••••••'), 'anything');
    await fireEvent.press(screen.getByText('Login'));

    await waitFor(() =>
      expect(screen.getByText('Too many sign-in attempts. Please try again later.')).toBeTruthy()
    );
    expect(screen.queryByText('Add New Announcement')).toBeNull();
  });

  it('sends the typed password to the endpoint and opens on success', async () => {
    await renderLoggedIn();

    expect(adminLogin).toHaveBeenCalledWith(ADMIN_PASSWORD);
    expect(screen.queryByText('Wrong password.')).toBeNull();
    expect(screen.queryByPlaceholderText('••••••••')).toBeNull(); // login card gone
  });

  it('drops the admin token when the screen unmounts', async () => {
    await render(<NewsAdminScreen navigation={navigation} />);
    await waitFor(() => expect(screen.getByText('Admin Login')).toBeTruthy());

    // act() so React flushes the effect cleanup before the assertion.
    await act(async () => {
      screen.unmount();
    });

    expect(clearAdminToken).toHaveBeenCalled();
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

describe('button loading states', () => {
  // Each button shows its own spinner while its request is in flight, so the
  // user can see which action is running and cannot fire it twice.
  const deferred = () => {
    let resolve;
    const promise = new Promise(r => { resolve = r; });
    return { promise, resolve };
  };

  it('spins the Login button while signing in', async () => {
    const login = deferred();
    adminLogin.mockReturnValue(login.promise);

    await render(<NewsAdminScreen navigation={navigation} />);
    await fireEvent.changeText(screen.getByPlaceholderText('••••••••'), ADMIN_PASSWORD);
    await fireEvent.press(screen.getByText('Login'));

    expect(screen.getByText('Signing in…')).toBeTruthy();
    await fireEvent.press(screen.getByText('Signing in…'));
    expect(adminLogin).toHaveBeenCalledTimes(1); // disabled, so no second call

    await act(async () => login.resolve({ token: 't' }));
    await waitFor(() => expect(screen.getByText('Add New Announcement')).toBeTruthy());
  });

  it('spins the Publish button while publishing', async () => {
    const add = deferred();
    addNews.mockReturnValue(add.promise);
    await renderLoggedIn();

    await fireEvent.changeText(screen.getByPlaceholderText(TITLE_PLACEHOLDER), 'Title');
    await fireEvent.changeText(screen.getByPlaceholderText(BODY_PLACEHOLDER), 'Body');
    await fireEvent.press(screen.getByText('Publish'));

    expect(screen.getByTestId('publish-spinner')).toBeTruthy();
    expect(screen.getByText('Publishing…')).toBeTruthy();

    await fireEvent.press(screen.getByText('Publishing…'));
    expect(addNews).toHaveBeenCalledTimes(1); // no double submit

    await act(async () => add.resolve({ id: 9 }));
    await waitFor(() => expect(screen.getByText('Publish')).toBeTruthy());
    expect(screen.queryByTestId('publish-spinner')).toBeNull();
  });

  it('spins the Save Changes button while saving', async () => {
    const save = deferred();
    updateNews.mockReturnValue(save.promise);
    await renderLoggedIn();

    await fireEvent.press(screen.getAllByLabelText('Edit')[0]);
    await fireEvent.press(screen.getByText('Save Changes'));

    expect(screen.getByTestId('save-spinner-1')).toBeTruthy();
    expect(screen.getByText('Saving…')).toBeTruthy();

    await fireEvent.press(screen.getByText('Saving…'));
    expect(updateNews).toHaveBeenCalledTimes(1);

    await act(async () => save.resolve(true));
    await waitFor(() => expect(screen.getByText('Updated!')).toBeTruthy());
  });

  it('spins the hide/show button and locks the rest of that row', async () => {
    const toggle = deferred();
    toggleNews.mockReturnValue(toggle.promise);
    await renderLoggedIn();

    await fireEvent.press(screen.getByLabelText('Hide'));
    expect(screen.getByTestId('toggle-spinner-1')).toBeTruthy();

    // Edit and Delete on the same row are disabled while it runs...
    await fireEvent.press(screen.getAllByLabelText('Edit')[0]);
    expect(screen.queryByText('Save Changes')).toBeNull();

    // ...but the other row is untouched.
    await fireEvent.press(screen.getAllByLabelText('Edit')[1]);
    expect(screen.getByText('Save Changes')).toBeTruthy();

    await act(async () => toggle.resolve(true));
    await waitFor(() => expect(screen.queryByTestId('toggle-spinner-1')).toBeNull());
  });

  it('spins the Delete button while deleting', async () => {
    const del = deferred();
    deleteNews.mockReturnValue(del.promise);
    const spy = jest
      .spyOn(Alert, 'alert')
      .mockImplementation((title, message, buttons) =>
        buttons.find(b => b.text === 'Delete').onPress()
      );

    await renderLoggedIn();
    await fireEvent.press(screen.getAllByLabelText('Delete')[0]);

    expect(screen.getByTestId('delete-spinner-1')).toBeTruthy();

    await act(async () => del.resolve(true));
    await waitFor(() => expect(screen.queryByTestId('delete-spinner-1')).toBeNull());
    expect(screen.getByText('Deleted.')).toBeTruthy();
    spy.mockRestore();
  });

  it('clears the spinner when the request fails', async () => {
    addNews.mockRejectedValue(new Error('offline'));
    await renderLoggedIn();

    await fireEvent.changeText(screen.getByPlaceholderText(TITLE_PLACEHOLDER), 'Title');
    await fireEvent.changeText(screen.getByPlaceholderText(BODY_PLACEHOLDER), 'Body');
    await fireEvent.press(screen.getByText('Publish'));

    await waitFor(() =>
      expect(screen.getByText('Could not add the announcement.')).toBeTruthy()
    );
    expect(screen.queryByTestId('publish-spinner')).toBeNull();
    expect(screen.getByText('Publish')).toBeTruthy();
  });
});

describe('header', () => {
  it('goes back from the Home button', async () => {
    await render(<NewsAdminScreen navigation={navigation} />);
    await fireEvent.press(screen.getByText('Home'));
    expect(navigation.goBack).toHaveBeenCalled();
  });
});
