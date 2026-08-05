// Shared announcement type metadata. Mirrors the web app's typeMap
// (templates/index_simple.html) and the admin badges (templates/news_admin.html).
export const NEWS_TYPES = {
  info: {
    key: 'info',
    icon: 'info-circle',
    color: '#0c63e4',
    tint: 'rgba(12,99,228,0.08)',
    label: 'ℹ️ Info',
    badgeBg: '#0dcaf0',
    badgeText: '#212529',
  },
  update: {
    key: 'update',
    icon: 'sync-alt',
    color: '#0d6efd',
    tint: 'rgba(13,110,253,0.08)',
    label: '🔄 Update',
    badgeBg: '#0d6efd',
    badgeText: '#ffffff',
  },
  warning: {
    key: 'warning',
    icon: 'exclamation-triangle',
    color: '#b45309',
    tint: 'rgba(180,83,9,0.08)',
    label: '⚠️ Important',
    badgeBg: '#ffc107',
    badgeText: '#212529',
  },
  success: {
    key: 'success',
    icon: 'check-circle',
    color: '#198754',
    tint: 'rgba(25,135,84,0.08)',
    label: '✅ Good News',
    badgeBg: '#198754',
    badgeText: '#ffffff',
  },
};

export const NEWS_TYPE_ORDER = ['info', 'update', 'warning', 'success'];

export const getNewsType = type => NEWS_TYPES[type] || NEWS_TYPES.info;
