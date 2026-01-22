'use client';

import { memo } from 'react';
import { isToday, isSameMonth, isSameDay } from 'date-fns';

type CalendarCellProps = {
  date: Date;
  currentMonth: Date;
  selectedDate: Date | null;
  hasInsight: boolean;
  onClick: (date: Date) => void;
};

export const CalendarCell = memo(function CalendarCell({
  date,
  currentMonth,
  selectedDate,
  hasInsight,
  onClick,
}: CalendarCellProps) {
  const isCurrentMonth = isSameMonth(date, currentMonth);
  const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
  const isTodayDate = isToday(date);

  const handleClick = () => {
    if (isCurrentMonth) {
      onClick(date);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!isCurrentMonth}
      aria-label={`${date.getDate()}일${hasInsight ? ', 인사이트 있음' : ''}${isTodayDate ? ', 오늘' : ''}`}
      aria-selected={isSelected}
      className={`
        relative flex flex-col items-center justify-center
        w-11 h-11 touch-target
        rounded-full
        transition-all duration-quick ease-smooth
        ${!isCurrentMonth 
          ? 'text-label-tertiary cursor-default' 
          : 'cursor-pointer hover:bg-bg-secondary active:scale-95'
        }
        ${isSelected 
          ? 'bg-label text-bg' 
          : ''
        }
        ${isTodayDate && !isSelected 
          ? 'ring-2 ring-label ring-inset' 
          : ''
        }
      `}
    >
      {/* Date Number */}
      <span className={`
        text-body font-medium
        ${isSelected ? 'text-bg' : ''}
      `}>
        {date.getDate()}
      </span>

      {/* Insight Indicator Dot */}
      {hasInsight && !isSelected && (
        <span 
          className="absolute bottom-1.5 w-1 h-1 rounded-full bg-link"
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
