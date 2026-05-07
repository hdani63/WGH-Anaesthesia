import { request } from './apiClient';

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

  async deleteUser(userId, token) {
    return request(`/users/${userId}`, {
      method: 'DELETE',
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    });
  },
};
