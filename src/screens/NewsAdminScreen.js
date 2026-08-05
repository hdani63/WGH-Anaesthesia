import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';
import { NEWS_TYPES, NEWS_TYPE_ORDER, getNewsType } from '../data/newsTypes';
import {
  addNews,
  adminLogin,
  clearAdminToken,
  deleteNews,
  getAllNews,
  todayIso,
  toggleNews,
  updateNews,
} from '../services/newsService';

const ADMIN_NAVY = '#1e3a5f';

// ── Shared form pieces ────────────────────────────────────────────────────────

function FieldLabel({ children, required }) {
  return (
    <Text style={styles.label}>
      {children}
      {required ? <Text style={styles.required}> *</Text> : null}
    </Text>
  );
}

function TypeSelector({ value, onChange }) {
  return (
    <View style={styles.typeRow}>
      {NEWS_TYPE_ORDER.map(key => {
        const type = NEWS_TYPES[key];
        const selected = value === key;
        return (
          <TouchableOpacity
            key={key}
            style={[
              styles.typeChip,
              selected && { backgroundColor: type.badgeBg, borderColor: type.badgeBg },
            ]}
            onPress={() => onChange(key)}
            activeOpacity={0.8}
          >
            <Text style={[styles.typeChipText, selected && { color: type.badgeText }]}>
              {type.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function Checkbox({ checked, label, onToggle }) {
  return (
    <TouchableOpacity style={styles.checkRow} onPress={onToggle} activeOpacity={0.75}>
      <View style={[styles.checkBox, checked && styles.checkBoxOn]}>
        {checked && <FontAwesome5 name="check" size={9} color={COLORS.white} />}
      </View>
      <Text style={styles.checkLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function AnnouncementForm({ draft, setDraft, pinLabel = '📌 Pin to top (always shows first)' }) {
  const update = patch => setDraft({ ...draft, ...patch });

  return (
    <>
      <FieldLabel required>Title</FieldLabel>
      <TextInput
        style={styles.input}
        value={draft.title}
        onChangeText={title => update({ title })}
        placeholder="e.g. Sepsis Protocol Updated — August 2026"
        placeholderTextColor={COLORS.textMuted}
      />

      <FieldLabel>Type</FieldLabel>
      <TypeSelector value={draft.type} onChange={type => update({ type })} />

      <FieldLabel>Date</FieldLabel>
      <TextInput
        style={styles.input}
        value={draft.publishedDate}
        onChangeText={publishedDate => update({ publishedDate })}
        placeholder="YYYY-MM-DD"
        placeholderTextColor={COLORS.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <FieldLabel required>Body</FieldLabel>
      <TextInput
        style={[styles.input, styles.textarea]}
        value={draft.body}
        onChangeText={body => update({ body })}
        placeholder="Write the announcement content here. Plain text is fine — line breaks are preserved."
        placeholderTextColor={COLORS.textMuted}
        multiline
        textAlignVertical="top"
      />
      <Text style={styles.helpText}>
        Plain text. Line breaks are shown as-is on the home screen.
      </Text>

      <Checkbox
        checked={draft.pinned}
        label={pinLabel}
        onToggle={() => update({ pinned: !draft.pinned })}
      />
    </>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

const emptyDraft = () => ({
  title: '',
  body: '',
  type: 'info',
  publishedDate: todayIso(),
  pinned: false,
});

export default function NewsAdminScreen({ navigation }) {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [newDraft, setNewDraft] = useState(emptyDraft);
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState(emptyDraft);

  // In-flight requests, keyed by action — 'add', or `${action}:${id}` for a row.
  // Each key drives the spinner inside its own button, so two rows can be busy
  // at once without one blocking the other.
  const [busy, setBusy] = useState({});
  const isBusy = key => !!busy[key];
  const rowBusy = id => isBusy(`save:${id}`) || isBusy(`toggle:${id}`) || isBusy(`delete:${id}`);

  const runBusy = (key, work) => {
    setBusy(prev => ({ ...prev, [key]: true }));
    return work().finally(() =>
      setBusy(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      })
    );
  };

  const load = useCallback(() => {
    setIsLoading(true);
    return getAllNews()
      .then(data => setItems(Array.isArray(data) ? data : []))
      .catch(() => setError('Could not load announcements.'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (authed) load();
  }, [authed, load]);

  // Drop the admin token when the screen goes away, so returning to it requires
  // signing in again rather than inheriting a session left open on the device.
  useEffect(() => clearAdminToken, []);

  const notify = (message, isError = false) => {
    setError(isError ? message : null);
    setSuccess(isError ? null : message);
  };

  // The password is checked by the server (POST /admin/news/login), which hands
  // back a bearer token the admin calls then carry. Failure messages come from
  // the server so the user sees the real reason ("Wrong password.", a rate-limit
  // notice, or a connection error).
  const handleLogin = () => {
    if (!password.trim()) {
      setError('Please enter the admin password.');
      return;
    }

    setIsAuthenticating(true);
    adminLogin(password)
      .then(() => {
        setError(null);
        setPassword('');
        setAuthed(true);
      })
      .catch(err => setError(err?.message || 'Could not sign in.'))
      .finally(() => setIsAuthenticating(false));
  };

  const handleAdd = () => {
    if (!newDraft.title.trim() || !newDraft.body.trim()) {
      notify('Title and body are required.', true);
      return;
    }
    runBusy('add', () =>
      addNews({ ...newDraft, title: newDraft.title.trim(), body: newDraft.body.trim() })
        .then(() => {
          setNewDraft(emptyDraft());
          notify('Announcement added!');
          return load();
        })
        .catch(() => notify('Could not add the announcement.', true))
    );
  };

  const startEdit = item => {
    setEditingId(editingId === item.id ? null : item.id);
    setEditDraft({
      title: item.title,
      body: item.body,
      type: item.type,
      publishedDate: item.publishedDate,
      pinned: item.pinned,
    });
  };

  const handleSaveEdit = id => {
    if (!editDraft.title.trim() || !editDraft.body.trim()) {
      notify('Title and body are required.', true);
      return;
    }
    runBusy(`save:${id}`, () =>
      updateNews(id, { ...editDraft, title: editDraft.title.trim(), body: editDraft.body.trim() })
        .then(() => {
          setEditingId(null);
          notify('Updated!');
          return load();
        })
        .catch(() => notify('Could not save changes.', true))
    );
  };

  const handleToggle = id => {
    runBusy(`toggle:${id}`, () =>
      toggleNews(id)
        .then(() => {
          notify('Status toggled.');
          return load();
        })
        .catch(() => notify('Could not change the status.', true))
    );
  };

  const handleDelete = id => {
    Alert.alert('Delete this announcement?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          runBusy(`delete:${id}`, () =>
            deleteNews(id)
              .then(() => {
                if (editingId === id) setEditingId(null);
                notify('Deleted.');
                return load();
              })
              .catch(() => notify('Could not delete the announcement.', true))
          ),
      },
    ]);
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={ADMIN_NAVY} />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <FontAwesome5 name="bullhorn" size={17} color={COLORS.white} />
          <Text style={styles.headerTitle} numberOfLines={1}>
            News & Announcements — Admin
          </Text>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <FontAwesome5 name="home" size={11} color={COLORS.white} />
            <Text style={styles.homeButtonText}>Home</Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
        >
          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            keyboardShouldPersistTaps="handled"
          >
            {!authed ? (
              // ── LOGIN ──
              <View style={styles.loginWrap}>
                <View style={[styles.card, SHADOW]}>
                  <View style={styles.cardPad}>
                    <View style={styles.loginTitleRow}>
                      <FontAwesome5 name="lock" size={14} color={COLORS.primary} />
                      <Text style={styles.loginTitle}>Admin Login</Text>
                    </View>

                    {error && (
                      <View style={[styles.alert, styles.alertDanger]}>
                        <Text style={styles.alertDangerText}>{error}</Text>
                      </View>
                    )}

                    <FieldLabel>Password</FieldLabel>
                    <TextInput
                      style={styles.input}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="••••••••"
                      placeholderTextColor={COLORS.textMuted}
                      secureTextEntry
                      autoFocus
                      autoCapitalize="none"
                      autoCorrect={false}
                      onSubmitEditing={handleLogin}
                      returnKeyType="go"
                      editable={!isAuthenticating}
                    />

                    <TouchableOpacity
                      style={[styles.primaryButton, isAuthenticating && styles.buttonBusy]}
                      onPress={handleLogin}
                      activeOpacity={0.85}
                      disabled={isAuthenticating}
                    >
                      {isAuthenticating ? (
                        <ActivityIndicator size="small" color={COLORS.white} />
                      ) : (
                        <FontAwesome5 name="sign-in-alt" size={12} color={COLORS.white} />
                      )}
                      <Text style={styles.primaryButtonText}>
                        {isAuthenticating ? 'Signing in…' : 'Login'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ) : (
              // ── AUTHENTICATED ──
              <>
                {error && (
                  <View style={[styles.alert, styles.alertDanger]}>
                    <Text style={styles.alertDangerText}>{error}</Text>
                  </View>
                )}
                {success && (
                  <View style={[styles.alert, styles.alertSuccess]}>
                    <Text style={styles.alertSuccessText}>{success}</Text>
                  </View>
                )}

                {/* Add new announcement */}
                <View style={[styles.card, SHADOW, styles.addCard]}>
                  <View style={styles.cardHeader}>
                    <FontAwesome5 name="plus-circle" size={13} color={COLORS.white} />
                    <Text style={styles.cardHeaderText}>Add New Announcement</Text>
                  </View>
                  <View style={styles.cardPad}>
                    <AnnouncementForm draft={newDraft} setDraft={setNewDraft} />
                    <TouchableOpacity
                      style={[
                        styles.primaryButton,
                        styles.publishButton,
                        isBusy('add') && styles.buttonBusy,
                      ]}
                      onPress={handleAdd}
                      activeOpacity={0.85}
                      disabled={isBusy('add')}
                    >
                      {isBusy('add') ? (
                        <ActivityIndicator testID="publish-spinner" size="small" color={COLORS.white} />
                      ) : (
                        <FontAwesome5 name="paper-plane" size={12} color={COLORS.white} />
                      )}
                      <Text style={styles.primaryButtonText}>
                        {isBusy('add') ? 'Publishing…' : 'Publish'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Existing announcements */}
                <Text style={styles.sectionHeading}>ALL ANNOUNCEMENTS ({items.length})</Text>

                {isLoading && items.length === 0 && (
                  <View style={styles.loadingWrap}>
                    <ActivityIndicator color={COLORS.medicalBlue} />
                  </View>
                )}

                {!isLoading && items.length === 0 && (
                  <View style={styles.emptyBox}>
                    <Text style={styles.emptyText}>No announcements yet — add one above.</Text>
                  </View>
                )}

                {items.map(item => {
                  const type = getNewsType(item.type);
                  const isEditing = editingId === item.id;
                  return (
                    <View
                      key={item.id}
                      style={[styles.card, SHADOW, styles.itemCard, !item.active && styles.itemHidden]}
                    >
                      <View style={styles.itemRow}>
                        <View style={styles.itemMain}>
                          <View style={styles.badgeRow}>
                            <View style={[styles.badge, { backgroundColor: type.badgeBg }]}>
                              <Text style={[styles.badgeText, { color: type.badgeText }]}>
                                {type.label}
                              </Text>
                            </View>
                            {item.pinned && (
                              <View style={[styles.badge, { backgroundColor: COLORS.textMuted }]}>
                                <Text style={[styles.badgeText, { color: COLORS.white }]}>
                                  📌 Pinned
                                </Text>
                              </View>
                            )}
                            {!item.active && (
                              <View style={[styles.badge, { backgroundColor: COLORS.dark }]}>
                                <Text style={[styles.badgeText, { color: COLORS.white }]}>Hidden</Text>
                              </View>
                            )}
                            <Text style={styles.itemDate}>{item.date}</Text>
                          </View>

                          <Text style={styles.itemTitle}>{item.title}</Text>
                          <Text style={styles.itemBody} numberOfLines={3}>
                            {item.body}
                          </Text>
                        </View>

                        <View style={styles.actionCol}>
                          <TouchableOpacity
                            style={[
                              styles.actionButton,
                              styles.actionSecondary,
                              rowBusy(item.id) && styles.buttonBusy,
                            ]}
                            onPress={() => handleToggle(item.id)}
                            activeOpacity={0.75}
                            accessibilityLabel={item.active ? 'Hide' : 'Show'}
                            disabled={rowBusy(item.id)}
                          >
                            {isBusy(`toggle:${item.id}`) ? (
                              <ActivityIndicator
                                testID={`toggle-spinner-${item.id}`}
                                size="small"
                                color={COLORS.textMuted}
                              />
                            ) : (
                              <FontAwesome5
                                name={item.active ? 'eye-slash' : 'eye'}
                                size={12}
                                color={COLORS.textMuted}
                              />
                            )}
                          </TouchableOpacity>
                          {/* Edit opens the form locally — nothing to wait for, but
                              it stays disabled while the row has a request in flight. */}
                          <TouchableOpacity
                            style={[
                              styles.actionButton,
                              styles.actionPrimary,
                              rowBusy(item.id) && styles.buttonBusy,
                            ]}
                            onPress={() => startEdit(item)}
                            activeOpacity={0.75}
                            accessibilityLabel="Edit"
                            disabled={rowBusy(item.id)}
                          >
                            <FontAwesome5 name="edit" size={12} color={COLORS.primary} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.actionButton,
                              styles.actionDanger,
                              rowBusy(item.id) && styles.buttonBusy,
                            ]}
                            onPress={() => handleDelete(item.id)}
                            activeOpacity={0.75}
                            accessibilityLabel="Delete"
                            disabled={rowBusy(item.id)}
                          >
                            {isBusy(`delete:${item.id}`) ? (
                              <ActivityIndicator
                                testID={`delete-spinner-${item.id}`}
                                size="small"
                                color={COLORS.danger}
                              />
                            ) : (
                              <FontAwesome5 name="trash" size={12} color={COLORS.danger} />
                            )}
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* Inline edit form */}
                      {isEditing && (
                        <View style={styles.editWrap}>
                          <AnnouncementForm
                            draft={editDraft}
                            setDraft={setEditDraft}
                            pinLabel="📌 Pinned"
                          />
                          <View style={styles.editActions}>
                            <TouchableOpacity
                              style={[
                                styles.primaryButton,
                                styles.editSaveButton,
                                isBusy(`save:${item.id}`) && styles.buttonBusy,
                              ]}
                              onPress={() => handleSaveEdit(item.id)}
                              activeOpacity={0.85}
                              disabled={isBusy(`save:${item.id}`)}
                            >
                              {isBusy(`save:${item.id}`) ? (
                                <ActivityIndicator
                                  testID={`save-spinner-${item.id}`}
                                  size="small"
                                  color={COLORS.white}
                                />
                              ) : (
                                <FontAwesome5 name="save" size={12} color={COLORS.white} />
                              )}
                              <Text style={styles.primaryButtonText}>
                                {isBusy(`save:${item.id}`) ? 'Saving…' : 'Save Changes'}
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[
                                styles.cancelButton,
                                isBusy(`save:${item.id}`) && styles.buttonBusy,
                              ]}
                              onPress={() => setEditingId(null)}
                              activeOpacity={0.85}
                              disabled={isBusy(`save:${item.id}`)}
                            >
                              <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                    </View>
                  );
                })}
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: ADMIN_NAVY },
  // Navy runs up behind the status bar; the page background starts below the header.
  safeArea: { flex: 1, backgroundColor: ADMIN_NAVY },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: ADMIN_NAVY,
    paddingHorizontal: SPACING.md,
    paddingVertical: 14,
  },
  headerTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: COLORS.white },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  homeButtonText: { fontSize: 12, fontWeight: '600', color: COLORS.white },

  body: { flex: 1, backgroundColor: '#f8fafc' },
  bodyContent: { padding: SPACING.md, paddingBottom: 48 },

  loginWrap: { paddingTop: SPACING.lg },
  loginTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: SPACING.md },
  loginTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text },

  // No overflow:'hidden' here — on iOS it clips the view's own shadow. The header
  // rounds its own top corners instead.
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS,
  },
  addCard: { marginBottom: SPACING.lg },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: ADMIN_NAVY,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderTopLeftRadius: BORDER_RADIUS,
    borderTopRightRadius: BORDER_RADIUS,
  },
  cardHeaderText: { fontSize: 13.5, fontWeight: '600', color: COLORS.white },
  cardPad: { padding: SPACING.md },

  label: { fontSize: 12, fontWeight: '600', color: COLORS.text, marginBottom: 5, marginTop: 10 },
  required: { color: COLORS.danger },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 9 : 6,
    fontSize: 13.5,
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },
  textarea: { minHeight: 96, paddingTop: 9 },
  helpText: { fontSize: 11, color: COLORS.textMuted, marginTop: 5 },

  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  typeChip: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: COLORS.white,
  },
  typeChipText: { fontSize: 12, fontWeight: '600', color: COLORS.textMuted },

  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 },
  checkBox: {
    width: 17,
    height: 17,
    borderRadius: 3.5,
    borderWidth: 1,
    borderColor: '#adb5bd',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  checkBoxOn: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  checkLabel: { fontSize: 12.5, color: COLORS.text },

  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    paddingVertical: 11,
    marginTop: SPACING.md,
  },
  primaryButtonText: { fontSize: 13.5, fontWeight: '600', color: COLORS.white },
  publishButton: { alignSelf: 'flex-start', paddingHorizontal: 28 },
  buttonBusy: { opacity: 0.7 },

  alert: {
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: SPACING.md,
  },
  alertDanger: { backgroundColor: '#f8d7da', borderColor: '#f5c2c7' },
  alertDangerText: { fontSize: 12.5, color: '#842029' },
  alertSuccess: { backgroundColor: '#d1e7dd', borderColor: '#badbcc' },
  alertSuccessText: { fontSize: 12.5, color: '#0f5132' },

  sectionHeading: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.6,
    marginBottom: SPACING.sm,
  },
  loadingWrap: { paddingVertical: SPACING.lg },
  emptyBox: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS,
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  emptyText: { fontSize: 12.5, color: COLORS.textMuted },

  itemCard: { marginBottom: SPACING.sm, padding: 12 },
  itemHidden: { opacity: 0.5 },
  itemRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  itemMain: { flex: 1, minWidth: 0 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 5, marginBottom: 5 },
  badge: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  badgeText: { fontSize: 10.5, fontWeight: '700' },
  itemDate: { fontSize: 11.5, color: COLORS.textMuted },
  itemTitle: { fontSize: 13.5, fontWeight: '600', color: COLORS.text },
  itemBody: { fontSize: 12, color: COLORS.textMuted, marginTop: 3, lineHeight: 17 },

  actionCol: { flexDirection: 'row', gap: 5, flexShrink: 0, marginTop: 2 },
  actionButton: {
    width: 30,
    height: 30,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  actionSecondary: { borderColor: COLORS.textMuted },
  actionPrimary: { borderColor: COLORS.primary },
  actionDanger: { borderColor: COLORS.danger },

  editWrap: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  editActions: { flexDirection: 'row', gap: 8, marginTop: SPACING.md },
  editSaveButton: { marginTop: 0, paddingHorizontal: 18 },
  cancelButton: {
    backgroundColor: COLORS.textMuted,
    borderRadius: 6,
    paddingVertical: 11,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: { fontSize: 13.5, fontWeight: '600', color: COLORS.white },
});
