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
  isSameDay,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarCell } from './CalendarCell';

type CalendarProps = {
  insightDates: string[]; // Array of dates with insights (YYYY-MM-DD format)
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onMonthChange?: (year: number, month: number) => void; // 월 변경 콜백
  isLoading?: boolean; // 데이터 로딩 중 상태
};

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export function Calendar({ 
  insightDates, 
  selectedDate, 
  onDateSelect,
  onMonthChange,
  isLoading = false,
}: CalendarProps) {
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
    <div className="w-full max-w-[343px] mx-auto">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={goToPreviousMonth}
          className="touch-target flex items-center justify-center w-11 h-11 rounded-full hover:bg-bg-secondary active:scale-95 transition-all"
          aria-label="이전 달"
        >
          <ChevronLeftIcon />
        </button>

        <h2 className="text-title-1 font-bold">
          {format(currentMonth, 'yyyy년 M월', { locale: ko })}
        </h2>

        <button
          type="button"
          onClick={goToNextMonth}
          className="touch-target flex items-center justify-center w-11 h-11 rounded-full hover:bg-bg-secondary active:scale-95 transition-all"
          aria-label="다음 달"
        >
          <ChevronRightIcon />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-0 mb-2">
        {WEEKDAYS.map((day, index) => (
          <div
            key={day}
            className={`
              flex items-center justify-center h-8 text-footnote font-medium
              ${index === 0 ? 'text-error' : index === 6 ? 'text-link' : 'text-secondary'}
            `}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentMonth.toISOString()}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className={`grid grid-cols-7 gap-0 ${isLoading ? 'opacity-50' : ''}`}
          >
            {calendarDays.map((day) => (
              <CalendarCell
                key={day.toISOString()}
                date={day}
                currentMonth={currentMonth}
                selectedDate={selectedDate}
                hasInsight={hasInsight(day)}
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
