'use client';

import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import Link from 'next/link';
import { Calendar } from '@/components/calendar';
import { BottomSheet } from '@/components/ui';
import { InsightPreview } from '@/components/insight';
import { useTranslation } from '@/lib/i18n';
import type { InsightPreview as InsightPreviewType, InsightCalendarItem } from '@/types/insight';

type HomeClientProps = {
  initialInsights: InsightCalendarItem[];
  initialYear: number;
  initialMonth: number;
};

export function HomeClient({ 
  initialInsights, 
  initialYear, 
  initialMonth 
}: HomeClientProps) {
  const { ts } = useTranslation();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<InsightPreviewType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // 현재 보고 있는 연도/월과 해당 월의 인사이트 목록
  const [currentYear, setCurrentYear] = useState(initialYear);
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [insights, setInsights] = useState<InsightCalendarItem[]>(initialInsights);
  const [isMonthLoading, setIsMonthLoading] = useState(false);

  // Convert insights to date strings for calendar
  const insightDates = insights.map(item => item.date);

  // 오늘 날짜 포맷
  const today = new Date();
  const formattedDate = format(today, 'M월 d일 EEEE', { locale: ko });

  // 월 변경 시 해당 월의 인사이트 페칭
  const handleMonthChange = useCallback(async (year: number, month: number) => {
    setCurrentYear(prevYear => {
      setCurrentMonth(prevMonth => {
        // 같은 월이면 무시
        if (prevYear === year && prevMonth === month) {
          return prevMonth;
        }
        
        // 비동기로 인사이트 페칭
        setIsMonthLoading(true);
        fetch(`/api/insights/month/${year}/${month}`)
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            return { insights: [] };
          })
          .then(data => {
            setInsights(data.insights || []);
          })
          .catch(error => {
            console.error('Failed to fetch monthly insights:', error);
            setInsights([]);
          })
          .finally(() => {
            setIsMonthLoading(false);
          });
        
        return month;
      });
      return year;
    });
  }, []);

  // Fetch insight preview when date is selected
  const handleDateSelect = useCallback(async (date: Date) => {
    setSelectedDate(date);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    setIsLoading(true);
    setIsSheetOpen(true);
    
    try {
      const response = await fetch(`/api/insights/${dateStr}`);
      if (response.ok) {
        const insight = await response.json();
        setSelectedInsight(insight);
      } else {
        // API에서 404 등 반환 시 빈 상태
        setSelectedInsight(null);
      }
    } catch (error) {
      console.error('Failed to fetch insight:', error);
      setSelectedInsight(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCloseSheet = useCallback(() => {
    setIsSheetOpen(false);
    setSelectedInsight(null);
  }, []);

  return (
    <div className="flex flex-1 flex-col px-5 pt-8 pb-4 min-h-screen">
      {/* Header - 미니멀 애플 스타일 */}
      <header className="w-full max-w-[600px] mx-auto mb-8 flex-shrink-0">
        <div className="flex items-center justify-between">
          {/* 로고 & 타이틀 */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
              <InsightIcon />
            </div>
            <div>
              <h1 className="text-headline font-semibold tracking-tight">
                {ts('home.title')}
              </h1>
              <p className="text-caption text-secondary -mt-0.5">
                {ts('home.subtitle')}
              </p>
            </div>
          </div>

          {/* 오늘 날짜 뱃지 + 북마크 + 설정 버튼 */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-full bg-bg-secondary">
              <p className="text-footnote font-medium text-secondary">
                {formattedDate}
              </p>
            </div>
            <Link 
              href="/bookmarks"
              className="w-9 h-9 rounded-full bg-bg-secondary flex items-center justify-center hover:bg-separator/30 active:scale-95 transition-all"
              aria-label="북마크"
            >
              <BookmarkIcon />
            </Link>
            <Link 
              href="/settings"
              className="w-9 h-9 rounded-full bg-bg-secondary flex items-center justify-center hover:bg-separator/30 active:scale-95 transition-all"
              aria-label="설정"
            >
              <SettingsIcon />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content - 캘린더를 헤더와 푸터 중간에 배치 */}
      <main className="w-full max-w-[600px] mx-auto flex-1 flex items-center justify-center">
        {/* Calendar Section */}
        <section className="w-full flex justify-center">
          <Calendar
            insightDates={insightDates}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onMonthChange={handleMonthChange}
            isLoading={isMonthLoading}
          />
        </section>
      </main>

      {/* Footer - 미니멀 힌트 - 페이지 하단 고정 */}
      <footer className="w-full max-w-[600px] mx-auto mb-6 text-center flex-shrink-0">
        <p className="text-caption text-label-tertiary">
          {ts('home.footer')}
        </p>
      </footer>

      {/* Bottom Sheet for Insight Preview */}
      <BottomSheet isOpen={isSheetOpen} onClose={handleCloseSheet}>
        {isLoading ? (
          <LoadingState />
        ) : selectedInsight ? (
          <InsightPreview 
            insight={selectedInsight} 
            onClose={handleCloseSheet}
          />
        ) : (
          <EmptyState selectedDate={selectedDate} />
        )}
      </BottomSheet>
    </div>
  );
}

function LoadingState() {
  const { ts } = useTranslation();
  
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-4">
        {/* 로딩 애니메이션 - 그라데이션 링 */}
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-spin" 
               style={{ 
                 mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), black calc(100% - 3px))',
                 WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), black calc(100% - 3px))'
               }} 
          />
        </div>
        <p className="text-footnote text-secondary">{ts('preview.loading')}</p>
      </div>
    </div>
  );
}

function EmptyState({ selectedDate }: { selectedDate: Date | null }) {
  const { ts } = useTranslation();
  
  const formattedDate = selectedDate 
    ? format(selectedDate, 'M월 d일', { locale: ko })
    : '';

  const descLines = ts('preview.noInsightDesc').split('\n');

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      {/* 빈 상태 아이콘 - 그라데이션 배경 */}
      <div className="w-16 h-16 mb-5 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
        <EmptyIcon />
      </div>
      <p className="text-body font-semibold mb-1">
        {formattedDate}의 인사이트
      </p>
      <p className="text-footnote text-secondary leading-relaxed">
        {descLines.map((line, i) => (
          <span key={i}>
            {line}
            {i < descLines.length - 1 && <br />}
          </span>
        ))}
      </p>
    </div>
  );
}

function EmptyIcon() {
  return (
    <svg 
      width="28" 
      height="28" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="text-secondary"
      aria-hidden="true"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

function InsightIcon() {
  return (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 0-4 12.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3A7 7 0 0 0 12 2z" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg 
      width="18" 
      height="18" 
      viewBox="0 0 24 24" 
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-secondary"
      aria-hidden="true"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg 
      width="18" 
      height="18" 
      viewBox="0 0 24 24" 
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-secondary"
      aria-hidden="true"
    >
      {/* 기어 아이콘 */}
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export default HomeClient;
