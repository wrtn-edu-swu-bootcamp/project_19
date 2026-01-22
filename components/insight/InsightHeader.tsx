'use client';

import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

type InsightHeaderProps = {
  date: string; // YYYY-MM-DD format
};

export function InsightHeader({ date }: InsightHeaderProps) {
  const router = useRouter();
  const formattedDate = format(new Date(date), 'M월 d일 EEEE', { locale: ko });

  const handleBack = () => {
    router.back();
  };

  return (
    <header className="sticky top-0 z-10 bg-bg/80 backdrop-blur-md border-b border-separator">
      <div className="flex items-center justify-between px-4 h-14 max-w-[600px] mx-auto">
        {/* Back Button */}
        <button
          type="button"
          onClick={handleBack}
          className="
            flex items-center gap-1
            text-link text-body font-medium
            touch-target
            hover:opacity-80 active:opacity-60
            transition-opacity duration-quick
          "
          aria-label="뒤로 가기"
        >
          <ChevronLeftIcon />
          <span>캘린더</span>
        </button>

        {/* Date */}
        <h1 className="text-headline font-semibold">
          {formattedDate}
        </h1>

        {/* Placeholder for right side (bookmark button can go here in future) */}
        <div className="w-11 h-11" aria-hidden="true" />
      </div>
    </header>
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
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

export default InsightHeader;
