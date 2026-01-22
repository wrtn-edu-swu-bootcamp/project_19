'use client';

import { format, isToday } from 'date-fns';
import { ko } from 'date-fns/locale';
import Link from 'next/link';
import { BookmarkButton } from '@/components/ui';
import { useTranslation } from '@/lib/i18n';
import type { InsightPreview as InsightPreviewType } from '@/types/insight';

type InsightPreviewProps = {
  insight: InsightPreviewType;
  onClose?: () => void;
};

export function InsightPreview({ insight, onClose }: InsightPreviewProps) {
  const { ts } = useTranslation();
  
  const insightDate = new Date(insight.date);
  const formattedDate = format(insightDate, 'M월 d일 EEEE', { locale: ko });
  const isTodayInsight = isToday(insightDate);
  const detailPath = `/insight/${insight.date}`;

  return (
    <div className="space-y-5">
      {/* Header with Date Badge and Bookmark */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isTodayInsight && (
            <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-600 dark:text-violet-400 text-caption font-medium">
              {ts('preview.today')}
            </span>
          )}
          <p className="text-footnote text-secondary font-medium">
            {formattedDate}
          </p>
        </div>
        <BookmarkButton date={insight.date} insightText={insight.insight_text} size="sm" />
      </div>

      {/* Insight Text - 카드 스타일 */}
      <div className="relative py-4">
        {/* 배경 장식 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl opacity-50" />
        
        <div className="relative px-4">
          <h3 className="text-body font-bold leading-relaxed text-center">
            "{insight.insight_text}"
          </h3>
        </div>
      </div>

      {/* Keywords - 태그 스타일 */}
      <div className="flex flex-wrap justify-center gap-2">
        {insight.keywords.map((kw) => (
          <span 
            key={kw.keyword}
            className="px-2.5 py-1 rounded-full bg-bg-secondary text-footnote font-medium text-label/55"
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
          w-full py-2.5 rounded-lg
          bg-label text-bg
          text-footnote font-semibold
          hover:opacity-90 active:scale-[0.98]
          transition-all duration-quick
          mb-2
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

export default InsightPreview;
