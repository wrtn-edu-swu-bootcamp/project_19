'use client';

import { useEffect } from 'react';
import { useSettingsStore } from '@/stores/settings-store';

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { fontSize } = useSettingsStore();

  // 컴포넌트 마운트 시 및 설정 변경 시 적용
  useEffect(() => {
    document.documentElement.dataset.fontSize = fontSize;
    // 언어는 항상 한국어로 고정
    document.documentElement.lang = 'ko';
  }, [fontSize]);

  return <>{children}</>;
}

export default SettingsProvider;
