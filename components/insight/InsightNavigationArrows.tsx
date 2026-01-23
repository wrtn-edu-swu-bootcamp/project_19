'use client';

import { useRouter } from 'next/navigation';
import { subDays, addDays, format } from 'date-fns';

type InsightNavigationArrowsProps = {
  currentDate: string;
};

export function InsightNavigationArrows({ currentDate }: InsightNavigationArrowsProps) {
  const router = useRouter();
  
  const currentDateObj = new Date(currentDate);
  const prevDate = subDays(currentDateObj, 1);
  const nextDate = addDays(currentDateObj, 1);
  
  const prevDateStr = format(prevDate, 'yyyy-MM-dd');
  const nextDateStr = format(nextDate, 'yyyy-MM-dd');

  const handlePrevDate = () => {
    router.push(`/insight/${prevDateStr}`);
  };

  const handleNextDate = () => {
    router.push(`/insight/${nextDateStr}`);
  };

  return (
    <>
      {/* 이전 날짜 화살표 버튼 - 왼쪽 끝 (여백 살짝) */}
      <button
        type="button"
        id="insight-nav-arrow-prev"
        onClick={handlePrevDate}
        style={{ 
          position: 'fixed !important',
          left: '1px !important',
          top: '50% !important',
          transform: 'translateY(-50%) !important',
          zIndex: '50 !important',
          width: '2.5rem !important',
          height: '2.5rem !important',
          display: 'flex !important',
          alignItems: 'center !important',
          justifyContent: 'center !important',
          margin: '0 !important',
          padding: '0 !important'
        }}
        className="
          text-secondary hover:text-label
          active:scale-95
          transition-all duration-quick
        "
        aria-label="이전 날짜"
      >
        <ChevronLeftIcon />
      </button>

      {/* 다음 날짜 화살표 버튼 - 오른쪽 끝 (여백 살짝) */}
      <button
        type="button"
        id="insight-nav-arrow-next"
        onClick={handleNextDate}
        style={{ 
          position: 'fixed !important',
          right: '1px !important',
          top: '50% !important',
          transform: 'translateY(-50%) !important',
          zIndex: '50 !important',
          width: '2.5rem !important',
          height: '2.5rem !important',
          display: 'flex !important',
          alignItems: 'center !important',
          justifyContent: 'center !important',
          margin: '0 !important',
          padding: '0 !important'
        }}
        className="
          text-secondary hover:text-label
          active:scale-95
          transition-all duration-quick
        "
        aria-label="다음 날짜"
      >
        <ChevronRightIcon />
      </button>
    </>
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
