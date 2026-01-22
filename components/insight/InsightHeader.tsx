'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { BookmarkButton } from '@/components/ui';
import { useTranslation } from '@/lib/i18n';

type InsightHeaderProps = {
  date: string; // YYYY-MM-DD format
  insightText?: string;
};

export function InsightHeader({ date, insightText = '' }: InsightHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { ts } = useTranslation();
  const [backLabel, setBackLabel] = useState(ts('detail.back'));
  const [backPath, setBackPath] = useState('/');
  
  const formattedDate = format(new Date(date), 'M월 d일 EEEE', { locale: ko });

  useEffect(() => {
    // 이전 페이지가 북마크 페이지인지 확인
    if (typeof window !== 'undefined') {
      const referrer = document.referrer;
      if (referrer.includes('/bookmarks')) {
        setBackLabel('북마크');
        setBackPath('/bookmarks');
      } else {
        setBackLabel(ts('detail.back'));
        setBackPath('/');
      }
    }
  }, [ts]);

  const handleBack = () => {
    router.push(backPath);
  };

  return (
    <header className="sticky top-0 z-10 bg-bg-secondary/80 backdrop-blur-xl border-b border-separator/30">
      <div className="w-full max-w-[600px] mx-auto px-5 py-3">
        <div className="relative flex items-center justify-center h-8">
          {/* Back Button - 왼쪽 고정 */}
          <button
            type="button"
            onClick={handleBack}
            className="absolute left-0 flex items-center gap-0.5 text-label font-medium hover:opacity-80 transition-opacity"
            aria-label="뒤로 가기"
          >
            <ChevronLeftIcon />
            <span className="text-footnote">{backLabel}</span>
          </button>

          {/* Date - 가운데 */}
          <h1 className="text-subheadline font-semibold">
            {formattedDate}
          </h1>

          {/* Bookmark Button - 오른쪽 고정 */}
          <div className="absolute right-0">
            <BookmarkButton date={date} insightText={insightText} size="sm" />
          </div>
        </div>
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
