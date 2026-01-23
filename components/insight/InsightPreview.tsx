'use client';

import { format, isToday, subDays, addDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import Link from 'next/link';
import { BookmarkButton } from '@/components/ui';
import { useTranslation } from '@/lib/i18n';
import type { InsightPreview as InsightPreviewType } from '@/types/insight';

type InsightPreviewProps = {
  insight: InsightPreviewType;
  onClose?: () => void;
  onNavigateDate?: (date: Date) => void;
};

export function InsightPreview({ insight, onClose, onNavigateDate }: InsightPreviewProps) {
  const { ts } = useTranslation();
  
  const insightDate = new Date(insight.date);
  const formattedDate = format(insightDate, 'M월 d일 EEEE', { locale: ko });
  const isTodayInsight = isToday(insightDate);
  const detailPath = `/insight/${insight.date}`;

  // 이전/다음 날짜 계산
  const prevDate = subDays(insightDate, 1);
  const nextDate = addDays(insightDate, 1);
  const prevDateStr = format(prevDate, 'yyyy-MM-dd');
  const nextDateStr = format(nextDate, 'yyyy-MM-dd');

  const handlePrevDate = () => {
    if (onNavigateDate) {
      onNavigateDate(prevDate);
    }
  };

  const handleNextDate = () => {
    if (onNavigateDate) {
      onNavigateDate(nextDate);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 relative">
      {/* 이전 날짜 화살표 버튼 - 왼쪽 완전 가장자리 */}
      <button
        type="button"
        onClick={handlePrevDate}
        className="
          fixed left-2 top-1/2 -translate-y-1/2
          w-10 h-10
          flex items-center justify-center
          text-secondary hover:text-label
          active:scale-95
          transition-all duration-quick
          z-[60]
        "
        aria-label="이전 날짜"
      >
        <ChevronLeftIcon />
      </button>

      {/* 다음 날짜 화살표 버튼 - 오른쪽 완전 가장자리 */}
      <button
        type="button"
        onClick={handleNextDate}
        className="
          fixed right-2 top-1/2 -translate-y-1/2
          w-10 h-10
          flex items-center justify-center
          text-secondary hover:text-label
          active:scale-95
          transition-all duration-quick
          z-[60]
        "
        aria-label="다음 날짜"
      >
        <ChevronRightIcon />
      </button>

      {/* Header with Date Badge and Bookmark */}
      <div className="flex items-center justify-between px-5 sm:px-2">
        <div className="flex items-center gap-2">
          {isTodayInsight && (
            <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-600 dark:text-violet-400 text-caption font-medium">
              {ts('preview.today')}
            </span>
          )}
          <p className="text-[14px] sm:text-footnote text-secondary font-medium">
            {formattedDate}
          </p>
        </div>
        <BookmarkButton date={insight.date} insightText={insight.insight_text} size="sm" />
      </div>

      {/* Insight Text - 카드 스타일 */}
      <div className="relative py-5 px-5 sm:py-4 sm:px-2">
        {/* 배경 장식 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl opacity-40 sm:opacity-50" />
        
        <div className="relative max-w-[90%] mx-auto sm:max-w-none">
          <h3 className="text-[18px] sm:text-body font-bold leading-[1.8] sm:leading-relaxed text-center text-label tracking-[-0.01em]">
            "{insight.insight_text}"
          </h3>
        </div>
      </div>

      {/* Keywords - 태그 스타일 */}
      <div className="flex flex-wrap justify-center gap-2 px-5 sm:px-2">
        {insight.keywords.map((kw) => (
          <span 
            key={kw.keyword}
            className="px-3 py-1.5 sm:px-2.5 sm:py-1 rounded-full bg-bg-secondary text-[13px] sm:text-footnote font-medium text-label/70 sm:text-label/55"
          >
            {kw.keyword}
          </span>
        ))}
      </div>

      {/* CTA Button - 컴팩트 버튼 */}
      <Link 
        href={detailPath}
        onClick={onClose}
        className="
          flex items-center justify-center gap-1.5
          w-full py-2.5 sm:py-1.5 rounded-lg
          bg-label text-bg
          text-[14px] sm:text-footnote font-semibold
          hover:opacity-90 active:scale-[0.98]
          transition-all duration-quick
          mb-2
          mx-5 sm:mx-2
        "
      >
        {ts('preview.viewDetail')}
        <ArrowRightIcon />
      </Link>
    </div>
  );
}

function ArrowRightIcon() {
  return (
    <svg 
      width="12" 
      height="12" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
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

export default InsightPreview;
