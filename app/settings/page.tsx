'use client';

import Link from 'next/link';
import { useThemeStore } from '@/stores/theme-store';
import { useSettingsStore, type FontSize } from '@/stores/settings-store';
import { useTranslation } from '@/lib/i18n';

export default function SettingsPage() {
  const { theme, setTheme } = useThemeStore();
  const { fontSize, setFontSize } = useSettingsStore();
  const { ts } = useTranslation();
  const isDark = theme === 'dark';

  const handleThemeToggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const fontSizeOptions: { value: FontSize; labelKey: 'settings.fontSmall' | 'settings.fontMedium' | 'settings.fontLarge' }[] = [
    { value: 'small', labelKey: 'settings.fontSmall' },
    { value: 'medium', labelKey: 'settings.fontMedium' },
    { value: 'large', labelKey: 'settings.fontLarge' },
  ];

  return (
    <div className="flex flex-1 flex-col bg-bg-secondary min-h-screen">
      {/* Header - iOS 스타일 */}
      <header className="sticky top-0 z-10 bg-bg-secondary/80 backdrop-blur-xl border-b border-separator/30">
        <div className="w-full max-w-[600px] mx-auto px-5 py-3">
          <div className="relative flex items-center justify-center h-8">
            {/* 뒤로가기 - 왼쪽 고정 */}
            <Link 
              href="/"
              className="absolute left-0 flex items-center gap-0.5 text-label font-medium hover:opacity-80 transition-opacity"
            >
              <BackIcon />
              <span className="text-footnote">{ts('settings.back')}</span>
            </Link>
            
            {/* 타이틀 - 정확히 가운데 */}
            <h1 className="text-subheadline font-semibold">
              {ts('settings.title')}
            </h1>
          </div>
        </div>
      </header>

      {/* Settings Content */}
      <main className="w-full max-w-[600px] mx-auto px-5 py-6 space-y-7">
        
        {/* 화면 설정 섹션 */}
        <section>
          <h2 className="text-caption font-normal text-secondary uppercase tracking-wide px-4 mb-2">
            {ts('settings.display')}
          </h2>
          <div className="rounded-xl bg-bg overflow-hidden divide-y divide-separator/30">
            {/* 다크 모드 */}
            <div className="flex items-center justify-between px-4 py-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <ThemeIcon />
                </div>
                <span className="text-footnote">{ts('settings.darkMode')}</span>
              </div>
              <ToggleSwitch isOn={isDark} onToggle={handleThemeToggle} />
            </div>

            {/* 글씨 크기 */}
            <div className="px-4 py-2.5">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                  <FontSizeIcon />
                </div>
                <span className="text-footnote">{ts('settings.fontSize')}</span>
              </div>
              <div className="flex gap-1.5 ml-[38px]">
                {fontSizeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFontSize(option.value)}
                    className={`
                      flex-1 py-1.5 rounded-md text-caption font-medium transition-all
                      ${fontSize === option.value 
                        ? 'bg-link text-white' 
                        : 'bg-bg-secondary text-secondary hover:bg-separator/50'
                      }
                    `}
                  >
                    {ts(option.labelKey)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 알림 설정 섹션 */}
        <section>
          <h2 className="text-caption font-normal text-secondary uppercase tracking-wide px-4 mb-2">
            {ts('settings.notification')}
          </h2>
          <div className="rounded-xl bg-bg overflow-hidden">
            {/* 푸시 알림 */}
            <div className="flex items-center justify-between px-4 py-2.5 opacity-50">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                  <NotificationIcon />
                </div>
                <div>
                  <span className="text-footnote">{ts('settings.pushNotification')}</span>
                  <p className="text-caption text-secondary">{ts('settings.comingSoon')}</p>
                </div>
              </div>
              <ToggleSwitch isOn={false} onToggle={() => {}} disabled />
            </div>
          </div>
        </section>

        {/* 정보 섹션 */}
        <section>
          <h2 className="text-caption font-normal text-secondary uppercase tracking-wide px-4 mb-2">
            {ts('settings.info')}
          </h2>
          <div className="rounded-xl bg-bg overflow-hidden divide-y divide-separator/30">
            {/* 버전 */}
            <div className="flex items-center justify-between px-4 py-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                  <InfoIcon />
                </div>
                <span className="text-footnote">{ts('settings.version')}</span>
              </div>
              <span className="text-footnote text-secondary">1.0.0</span>
            </div>
            
            {/* 개발자 */}
            <div className="flex items-center justify-between px-4 py-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                  <CodeIcon />
                </div>
                <span className="text-footnote">{ts('settings.developer')}</span>
              </div>
              <span className="text-footnote text-secondary">AI Insight Team</span>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 text-center">
        <p className="text-caption text-label-tertiary">
          {ts('settings.footer')}
        </p>
      </footer>
    </div>
  );
}

// 토글 스위치 컴포넌트 - 더 작게
function ToggleSwitch({ 
  isOn, 
  onToggle, 
  disabled = false 
}: { 
  isOn: boolean; 
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      disabled={disabled}
      onClick={onToggle}
      className={`
        relative w-[44px] h-[26px] rounded-full transition-colors duration-200
        ${isOn ? 'bg-green-500' : 'bg-separator'}
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <span 
        className={`
          absolute top-[2px] left-[2px]
          w-[22px] h-[22px] rounded-full bg-white shadow-md
          transition-transform duration-200
          ${isOn ? 'translate-x-[18px]' : 'translate-x-0'}
        `}
      />
    </button>
  );
}

// 아이콘 컴포넌트들 - 깔끔한 SF Symbols 스타일
function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

// 다크모드 - 심플한 달
function ThemeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

// 글씨 크기 - 심플한 텍스트 크기
function FontSizeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7V4h16v3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 4v16" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 20h8" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// 알림 - 심플한 벨
function NotificationIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden="true">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// 버전 - 심플한 정보 아이콘
function InfoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

// 개발 - 심플한 코드 브라켓
function CodeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
