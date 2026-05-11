import * as FileSystem from 'expo-file-system/legacy';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const AUTH_STORE_FILE = `${FileSystem.documentDirectory}wgh_auth_store_v1.json`;

const fileStorage = {
  getItem: async () => {
    try {
      const info = await FileSystem.getInfoAsync(AUTH_STORE_FILE);
      if (!info.exists) return null;
      return await FileSystem.readAsStringAsync(AUTH_STORE_FILE);
    } catch {
      return null;
    }
  },
  setItem: async (_, value) => {
    await FileSystem.writeAsStringAsync(AUTH_STORE_FILE, value);
  },
  removeItem: async () => {
    await FileSystem.deleteAsync(AUTH_STORE_FILE, { idempotent: true });
  },
};

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      isGuest: false,
      hasHydrated: false,
      setSession: ({ token, user }) => set({ token: token || null, user: user || null, isGuest: false }),
      clearSession: () => set({ token: null, user: null, isGuest: false }),
      setGuestMode: (value) => set({ isGuest: Boolean(value), token: null, user: null }),
      setHydrated: (value) => set({ hasHydrated: Boolean(value) }),
    }),
    {
      name: 'wgh-auth-store',
      storage: createJSONStorage(() => fileStorage),
      partialize: (state) => ({ token: state.token, user: state.user, isGuest: state.isGuest }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
