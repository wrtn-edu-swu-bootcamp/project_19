'use client';

import { memo } from 'react';
import { isToday, isSameMonth, isSameDay, getDay } from 'date-fns';

type CalendarCellProps = {
  date: Date;
  currentMonth: Date;
  selectedDate: Date | null;
  hasInsight: boolean;
  isHoliday: boolean;
  onClick: (date: Date) => void;
};

export const CalendarCell = memo(function CalendarCell({
  date,
  currentMonth,
  selectedDate,
  hasInsight,
  isHoliday,
  onClick,
}: CalendarCellProps) {
  const isCurrentMonth = isSameMonth(date, currentMonth);
  const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
  const isTodayDate = isToday(date);
  const isSunday = getDay(date) === 0;
  const isSaturday = getDay(date) === 6;

  // 일요일 또는 공휴일은 빨간색, 토요일은 파란색
  const isRedDay = isSunday || isHoliday;

  const handleClick = () => {
    if (isCurrentMonth) {
      onClick(date);
    }
  };

  // 날짜 숫자 색상 결정
  const getDateColor = () => {
    if (isSelected) return 'text-white';
    if (!isCurrentMonth) return 'text-label-tertiary';
    if (isRedDay) return 'text-error';
    if (isSaturday) return 'text-link';
    return '';
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!isCurrentMonth}
      aria-label={`${date.getDate()}일${hasInsight ? ', 인사이트 있음' : ''}${isTodayDate ? ', 오늘' : ''}${isHoliday ? ', 공휴일' : ''}`}
      aria-selected={isSelected}
      className={`
        relative flex flex-col items-center justify-center
        aspect-square w-full max-w-[44px] mx-auto
        rounded-full
        transition-all duration-quick ease-smooth
        ${!isCurrentMonth 
          ? 'cursor-default' 
          : 'cursor-pointer hover:bg-violet-500/10 active:scale-95'
        }
        ${isSelected 
          ? 'bg-violet-600 text-white' 
          : ''
        }
        ${isTodayDate && !isSelected 
          ? 'bg-violet-500/20' 
          : ''
        }
      `}
    >
      {/* Date Number */}
      <span className={`text-callout sm:text-body font-medium ${getDateColor()}`}>
        {date.getDate()}
      </span>

      {/* Insight Indicator Dot - 인사이트가 있는 날짜 표시 */}
      {hasInsight && !isSelected && (
        <span 
          className="absolute bottom-0.5 sm:bottom-1 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-violet-500 shadow-sm"
          aria-hidden="true"
          title="인사이트 있음"
        />
      )}
      {hasInsight && isSelected && (
        <span 
          className="absolute bottom-0.5 sm:bottom-1 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white/90"
          aria-hidden="true"
          title="인사이트 있음"
        />
      )}
    </button>
  );
});

export default CalendarCell;
