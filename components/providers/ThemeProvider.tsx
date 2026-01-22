'use client';

import { useEffect, useState } from 'react';
import { useThemeStore } from '@/stores';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    // Remove existing theme classes
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      // Let the CSS media query handle it
      // No class needed - uses prefers-color-scheme
    } else {
      // Apply manual theme class
      root.classList.add(theme);
    }
  }, [theme, mounted]);

  // Listen to system theme changes when in 'system' mode
  useEffect(() => {
    if (!mounted || theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      // Force re-render by toggling a class (triggers CSS update)
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  return <>{children}</>;
}

export default ThemeProvider;
