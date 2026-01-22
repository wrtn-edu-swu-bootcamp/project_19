'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  getEffectiveTheme: () => 'light' | 'dark';
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'system',

      setTheme: (theme: Theme) => {
        set({ theme });
      },

      getEffectiveTheme: () => {
        const { theme } = get();
        if (theme === 'system') {
          // 서버 사이드에서는 기본값 light 반환
          if (typeof window === 'undefined') return 'light';
          return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
        }
        return theme;
      },
    }),
    {
      name: 'insight-theme', // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
