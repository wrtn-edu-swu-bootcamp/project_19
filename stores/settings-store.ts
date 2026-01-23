/**
 * Settings Store
 * 글씨 크기 등 사용자 설정 관리
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type FontSize = 'small' | 'medium' | 'large';

type SettingsState = {
  fontSize: FontSize;
};

type SettingsActions = {
  setFontSize: (size: FontSize) => void;
};

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      fontSize: 'medium',
      
      setFontSize: (size) => {
        set({ fontSize: size });
        // HTML에 data-font-size 속성 적용 (클라이언트 사이드에서만)
        if (typeof window !== 'undefined' && typeof document !== 'undefined') {
          document.documentElement.dataset.fontSize = size;
        }
      },
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => {
        // 서버 사이드에서는 메모리 스토리지 사용
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
            clear: () => {},
            key: () => null,
            length: 0,
          } as unknown as Storage;
        }
        return localStorage;
      }),
      onRehydrateStorage: () => (state) => {
        // 페이지 로드 시 저장된 설정 적용 (클라이언트 사이드에서만)
        if (state && typeof window !== 'undefined' && typeof document !== 'undefined') {
          document.documentElement.dataset.fontSize = state.fontSize;
        }
      },
    }
  )
);
