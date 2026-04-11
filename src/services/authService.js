import { Platform } from 'react-native';

const DEFAULT_API_BASE_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:9000/api' : 'http://localhost:9000/api';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_BASE_URL;

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      body: options.body,
    });
  } catch {
    throw new Error(
      `Cannot connect to API at ${API_BASE_URL}. If testing on a phone/emulator, set EXPO_PUBLIC_API_URL to your Mac IP (example: http://192.168.1.10:9000/api).`
    );
  }

  const payload = await parseResponse(response);
  const message = payload?.message || `Request failed (${response.status})`;

  if (!response.ok || payload?.success === false) {
    throw new Error(message);
  }

  if (!payload && response.status !== 204) {
    throw new Error(`Invalid API response from ${API_BASE_URL}`);
  }

  return payload?.data ?? payload;
}

export const authService = {
  async login({ email, password }) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async signup({ fullName, email, password }) {
    try {
      return await request('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ fullName, email, password, role: 'paramedical' }),
      });
    } catch (error) {
      if (!String(error?.message || '').toLowerCase().includes('route not found')) {
        throw error;
      }

      return request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ fullName, email, password, role: 'paramedical' }),
      });
    }
  },

  async getMe(token) {
    return request('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
