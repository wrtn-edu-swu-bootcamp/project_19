'use client';

import { useState, useCallback } from 'react';
import { format, subDays, addDays } from 'date-fns';
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
    // 같은 월이면 무시
    if (currentYear === year && currentMonth === month) {
      return;
    }
    
    // 상태 업데이트
    setCurrentYear(year);
    setCurrentMonth(month);
    
    // 비동기로 인사이트 페칭
    setIsMonthLoading(true);
    
    try {
      // API 요청
      const response = await fetch(`/api/insights/month/${year}/${month}`);
      
      if (!response.ok) {
        // 에러 응답 처리
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // JSON 파싱 실패 시 기본 에러 메시지 사용
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      // 응답 데이터 검증
      if (data && Array.isArray(data.insights)) {
        setInsights(data.insights);
      } else {
        console.warn('Invalid response format:', data);
        setInsights([]);
      }
    } catch (error) {
      console.error('Failed to fetch monthly insights:', error);
      // 에러 발생 시에도 빈 배열로 설정하여 UI가 깨지지 않도록
      setInsights([]);
    } finally {
      setIsMonthLoading(false);
    }
  }, [currentYear, currentMonth]);

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
    <div className="flex flex-1 flex-col px-4 sm:px-5 pt-6 sm:pt-8 pb-4 min-h-screen">
      {/* Header - 미니멀 애플 스타일 */}
      <header className="w-full max-w-[600px] mx-auto mb-6 sm:mb-8 flex-shrink-0">
        <div className="flex items-center justify-between gap-2">
          {/* 로고 & 타이틀 */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
              <InsightIcon />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-body sm:text-headline font-semibold tracking-tight truncate">
                {ts('home.title')}
              </h1>
              <p className="text-caption text-secondary -mt-0.5 truncate">
                {ts('home.subtitle')}
              </p>
            </div>
          </div>

          {/* 오늘 날짜 뱃지 + 북마크 + 설정 버튼 */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <div className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-bg-secondary">
              <p className="text-caption sm:text-footnote font-medium text-secondary whitespace-nowrap">
                {formattedDate}
              </p>
            </div>
            <Link 
              href="/bookmarks"
              className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0 rounded-full bg-bg-secondary flex items-center justify-center hover:bg-separator/30 active:scale-95 transition-all"
              aria-label="북마크"
            >
              <BookmarkIcon />
            </Link>
            <Link 
              href="/settings"
              className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0 rounded-full bg-bg-secondary flex items-center justify-center hover:bg-separator/30 active:scale-95 transition-all"
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
      <footer className="w-full max-w-[600px] mx-auto mb-4 sm:mb-6 text-center flex-shrink-0">
        <p className="text-caption text-label-tertiary leading-relaxed">
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
            onNavigateDate={handleDateSelect}
          />
        ) : (
          <EmptyState selectedDate={selectedDate} onNavigateDate={handleDateSelect} />
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

function EmptyState({ 
  selectedDate, 
  onNavigateDate 
}: { 
  selectedDate: Date | null;
  onNavigateDate?: (date: Date) => void;
}) {
  const { ts } = useTranslation();
  
  const formattedDate = selectedDate 
    ? format(selectedDate, 'M월 d일', { locale: ko })
    : '';

  const descLines = ts('preview.noInsightDesc').split('\n');

  // 이전/다음 날짜 계산
  const prevDate = selectedDate ? subDays(selectedDate, 1) : null;
  const nextDate = selectedDate ? addDays(selectedDate, 1) : null;

  const handlePrevDate = () => {
    if (prevDate && onNavigateDate) {
      onNavigateDate(prevDate);
    }
  };

  const handleNextDate = () => {
    if (nextDate && onNavigateDate) {
      onNavigateDate(nextDate);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center relative px-12">
      {/* 이전 날짜 화살표 버튼 - 왼쪽 */}
      {selectedDate && (
        <button
          type="button"
          onClick={handlePrevDate}
          className="
            absolute left-0 top-1/2 -translate-y-1/2
            w-10 h-10
            flex items-center justify-center
            text-secondary hover:text-label
            active:scale-95
            transition-all duration-quick
            z-10
          "
          aria-label="이전 날짜"
        >
          <ChevronLeftIcon />
        </button>
      )}

      {/* 다음 날짜 화살표 버튼 - 오른쪽 */}
      {selectedDate && (
        <button
          type="button"
          onClick={handleNextDate}
          className="
            absolute right-0 top-1/2 -translate-y-1/2
            w-10 h-10
            flex items-center justify-center
            text-secondary hover:text-label
            active:scale-95
            transition-all duration-quick
            z-10
          "
          aria-label="다음 날짜"
        >
          <ChevronRightIcon />
        </button>
      )}

      {/* 빈 상태 아이콘 - 회색으로 아직 생성 안된 느낌 */}
      <div className="w-14 h-14 mb-5 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center shadow-sm">
        <EmptyInsightIcon />
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

function ChevronLeftIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function EmptyInsightIcon() {
  return (
    <svg 
      width="18" 
      height="18" 
      viewBox="0 0 24 24" 
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gray-500 dark:text-gray-400"
      aria-hidden="true"
    >
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 0-4 12.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3A7 7 0 0 0 12 2z" />
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
