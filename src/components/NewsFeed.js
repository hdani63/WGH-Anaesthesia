import React, { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';
import { getNewsType } from '../data/newsTypes';
import { getNews } from '../services/newsService';

export default function NewsFeed({ onLoaded, onAdminPress }) {
  const [items, setItems] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getNews()
      .then(data => {
        if (cancelled) return;
        const list = Array.isArray(data) ? data : [];
        setItems(list);
        onLoaded?.(list);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load news. Try again later.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [onLoaded]);

  // Reload whenever Home regains focus, so edits made in the admin screen show up.
  useFocusEffect(load);

  let content;

  if (isLoading) {
    content = (
      <View style={styles.stateWrap}>
        <ActivityIndicator size="large" color={COLORS.medicalBlue} />
        <Text style={styles.stateText}>Loading news…</Text>
      </View>
    );
  } else if (error) {
    content = (
      <View style={styles.stateWrap}>
        <Text style={styles.stateText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={load} activeOpacity={0.75}>
          <FontAwesome5 name="redo" size={12} color={COLORS.medicalBlue} />
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  } else if (!items || items.length === 0) {
    content = (
      <View style={styles.stateWrap}>
        <FontAwesome5 name="bullhorn" size={34} color={COLORS.textMuted} style={styles.emptyIcon} />
        <Text style={styles.stateText}>No announcements yet. Check back soon.</Text>
      </View>
    );
  } else {
    content = (
      <View style={styles.list}>
        {items.map(item => {
          const type = getNewsType(item.type);
          return (
            <View
              key={item.id}
              testID={`news-card-${item.id}`}
              style={[styles.card, SHADOW, { borderLeftColor: type.color }]}
            >
              <View style={styles.cardRow}>
                <View style={[styles.iconWrap, { backgroundColor: type.tint }]}>
                  <FontAwesome5 name={type.icon} size={15} color={type.color} />
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.titleRow}>
                    {item.pinned && (
                      <FontAwesome5
                        testID={`news-pin-${item.id}`}
                        name="thumbtack"
                        size={11}
                        color={COLORS.textMuted}
                        style={styles.pinIcon}
                      />
                    )}
                    <Text style={styles.title}>{item.title}</Text>
                  </View>

                  <Text style={styles.body}>{item.body}</Text>

                  <View style={styles.dateRow}>
                    <FontAwesome5 name="calendar-alt" size={10} color={COLORS.textMuted} />
                    <Text style={styles.date}>{item.date}</Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <View>
      {content}

      {/* Admin entry point — same placement as the web news pane. */}
      <View style={styles.adminWrap}>
        <TouchableOpacity style={styles.adminButton} onPress={onAdminPress} activeOpacity={0.75}>
          <FontAwesome5 name="cog" size={12} color={COLORS.textMuted} />
          <Text style={styles.adminText}>Admin — Add / Edit / Remove Announcements</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: SPACING.sm, paddingTop: SPACING.md },
  stateWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 56,
    paddingHorizontal: SPACING.lg,
  },
  stateText: {
    marginTop: SPACING.md,
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  emptyIcon: { opacity: 0.25 },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  retryText: { fontSize: 12, fontWeight: '600', color: COLORS.medicalBlue },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS,
    borderLeftWidth: 4,
    padding: 12,
    marginBottom: SPACING.md,
  },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start' },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  cardBody: { flex: 1, minWidth: 0 },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  pinIcon: { marginRight: 6, transform: [{ rotate: '30deg' }] },
  title: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '600',
    color: COLORS.text,
    lineHeight: 20,
  },
  body: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 20,
    marginBottom: 8,
  },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  date: { fontSize: 11, color: COLORS.textMuted },
  adminWrap: {
    paddingHorizontal: SPACING.sm,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    marginTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    width: '100%',
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    borderColor: COLORS.textMuted,
    backgroundColor: COLORS.white,
  },
  adminText: { fontSize: 12.5, fontWeight: '600', color: COLORS.textMuted },
});
