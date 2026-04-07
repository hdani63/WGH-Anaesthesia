export const COLORS = {
  primary: '#0066cc',
  secondary: '#004499',
  success: '#28a745',
  warning: '#ffc107',
  danger: '#dc3545',
  info: '#17a2b8',
  light: '#f8f9fa',
  dark: '#343a40',
  medicalBlue: '#1e4d8e',
  medicalGreen: '#0d7e83',
  medicalRed: '#d63384',
  white: '#ffffff',
  background: '#f5f7fa',
  cardBg: '#ffffff',
  text: '#343a40',
  textMuted: '#6c757d',
  border: '#dee2e6',
  headerGradientStart: '#1e4d8e',
  headerGradientEnd: '#0066cc',
};

export const FONTS = {
  regular: { fontSize: 14, color: COLORS.text },
  bold: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  title: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  subtitle: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  small: { fontSize: 12, color: COLORS.textMuted },
  header: { fontSize: 24, fontWeight: '700', color: COLORS.white },
  headerSub: { fontSize: 14, fontWeight: '300', color: 'rgba(255,255,255,0.9)' },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const BORDER_RADIUS = 8;
export const SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
};
