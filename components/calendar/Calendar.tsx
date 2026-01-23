'use client';

import { useState, useCallback, useMemo } from 'react';
import { 
  startOfMonth, 
  endOfMonth,
  startOfWeek, 
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  format,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarCell } from './CalendarCell';
import { useTranslation } from '@/lib/i18n';

type CalendarProps = {
  insightDates: string[]; // Array of dates with insights (YYYY-MM-DD format)
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onMonthChange?: (year: number, month: number) => void; // 월 변경 콜백
  isLoading?: boolean; // 데이터 로딩 중 상태
};

// 한국 공휴일 (고정 공휴일 + 2026년 음력 공휴일)
// 형식: 'MM-DD' (고정) 또는 'YYYY-MM-DD' (특정 연도)
const KOREAN_HOLIDAYS: Record<string, string> = {
  // 고정 공휴일 (매년 동일)
  '01-01': '신정',
  '03-01': '삼일절',
  '05-05': '어린이날',
  '06-06': '현충일',
  '08-15': '광복절',
  '10-03': '개천절',
  '10-09': '한글날',
  '12-25': '성탄절',
  
  // 2026년 설날 (음력 1월 1일 = 2026년 2월 17일)
  '2026-02-16': '설날 연휴',
  '2026-02-17': '설날',
  '2026-02-18': '설날 연휴',
  
  // 2026년 부처님 오신 날 (음력 4월 8일 = 2026년 5월 24일)
  '2026-05-24': '부처님 오신 날',
  
  // 2026년 추석 (음력 8월 15일 = 2026년 10월 5일)
  '2026-10-04': '추석 연휴',
  '2026-10-05': '추석',
  '2026-10-06': '추석 연휴',
  
  // 2025년 설날
  '2025-01-28': '설날 연휴',
  '2025-01-29': '설날',
  '2025-01-30': '설날 연휴',
  
  // 2025년 부처님 오신 날
  '2025-05-05': '부처님 오신 날',
  
  // 2025년 추석
  '2025-10-05': '추석 연휴',
  '2025-10-06': '추석',
  '2025-10-07': '추석 연휴',
};

// 공휴일 체크 함수
function isKoreanHoliday(date: Date): boolean {
  const fullDateStr = format(date, 'yyyy-MM-dd');
  const monthDayStr = format(date, 'MM-dd');
  
  return fullDateStr in KOREAN_HOLIDAYS || monthDayStr in KOREAN_HOLIDAYS;
}

export function Calendar({ 
  insightDates, 
  selectedDate, 
  onDateSelect,
  onMonthChange,
  isLoading = false,
}: CalendarProps) {
  const { ta } = useTranslation();
  const weekdays = ta('calendar.weekdays');
  const dateLocale = ko;

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [direction, setDirection] = useState(0);

  // Generate calendar days for the current month view
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  // Convert insight dates to a Set for O(1) lookup
  const insightDateSet = useMemo(() => {
    return new Set(insightDates);
  }, [insightDates]);

  const hasInsight = useCallback((date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return insightDateSet.has(dateStr);
  }, [insightDateSet]);

  const goToPreviousMonth = () => {
    setDirection(-1);
    setCurrentMonth(prev => {
      const newMonth = subMonths(prev, 1);
      // 월 변경 콜백 호출
      onMonthChange?.(newMonth.getFullYear(), newMonth.getMonth() + 1);
      return newMonth;
    });
  };

  const goToNextMonth = () => {
    setDirection(1);
    setCurrentMonth(prev => {
      const newMonth = addMonths(prev, 1);
      // 월 변경 콜백 호출
      onMonthChange?.(newMonth.getFullYear(), newMonth.getMonth() + 1);
      return newMonth;
    });
  };

  const handleDateClick = (date: Date) => {
    onDateSelect(date);
  };

  // Animation variants for month transition
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <div className="w-full max-w-[400px] sm:max-w-[343px] mx-auto px-2 sm:px-0">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <button
          type="button"
          onClick={goToPreviousMonth}
          className="touch-target flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full hover:bg-bg-secondary active:scale-95 transition-all flex-shrink-0"
          aria-label="이전 달"
        >
          <ChevronLeftIcon />
        </button>

        <h2 className="text-title-3 sm:text-title-2 font-semibold whitespace-nowrap">
          {format(currentMonth, 'yyyy년 M월', { locale: ko })}
        </h2>

        <button
          type="button"
          onClick={goToNextMonth}
          className="touch-target flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full hover:bg-bg-secondary active:scale-95 transition-all flex-shrink-0"
          aria-label="다음 달"
        >
          <ChevronRightIcon />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((day, index) => (
          <div
            key={day}
            className={`
              flex items-center justify-center h-7 sm:h-8 text-caption sm:text-footnote font-medium
              ${index === 0 ? 'text-error' : index === 6 ? 'text-link' : 'text-secondary'}
            `}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid - 최소 높이 고정으로 레이아웃 일관성 유지 */}
      <div className="relative min-h-[240px] sm:min-h-[264px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentMonth.toISOString()}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className={`grid grid-cols-7 gap-1 ${isLoading ? 'opacity-50' : ''}`}
          >
            {calendarDays.map((day) => (
              <CalendarCell
                key={day.toISOString()}
                date={day}
                currentMonth={currentMonth}
                selectedDate={selectedDate}
                hasInsight={hasInsight(day)}
                isHoliday={isKoreanHoliday(day)}
                onClick={handleDateClick}
              />
            ))}
          </motion.div>
        </AnimatePresence>
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-link border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}

// Icon Components
function ChevronLeftIcon() {
  return (
    <svg 
      width="24" 
      height="24" 
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
      width="24" 
      height="24" 
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

export default Calendar;
