/**
 * Settings Store
 * 글씨 크기 등 사용자 설정 관리
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
        // HTML에 data-font-size 속성 적용
        if (typeof document !== 'undefined') {
          document.documentElement.dataset.fontSize = size;
        }
      },
    }),
    {
      name: 'settings-storage',
      onRehydrateStorage: () => (state) => {
        // 페이지 로드 시 저장된 설정 적용
        if (state && typeof document !== 'undefined') {
          document.documentElement.dataset.fontSize = state.fontSize;
        }
      },
    }
  )
);
