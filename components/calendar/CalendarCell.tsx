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
        w-11 h-11 touch-target
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
      <span className={`text-body font-medium ${getDateColor()}`}>
        {date.getDate()}
      </span>

      {/* Insight Indicator Dot */}
      {hasInsight && !isSelected && (
        <span 
          className="absolute bottom-1.5 w-1 h-1 rounded-full bg-violet-500"
          aria-hidden="true"
        />
      )}
      {hasInsight && isSelected && (
        <span 
          className="absolute bottom-1.5 w-1 h-1 rounded-full bg-bg"
          aria-hidden="true"
        />
      )}
    </button>
  );
});

export default CalendarCell;
