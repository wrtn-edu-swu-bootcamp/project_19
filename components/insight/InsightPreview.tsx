'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import Link from 'next/link';
import { BookmarkButton } from '@/components/ui';
import type { InsightPreview as InsightPreviewType } from '@/types/insight';

type InsightPreviewProps = {
  insight: InsightPreviewType;
  onClose?: () => void;
};

export function InsightPreview({ insight, onClose }: InsightPreviewProps) {
  const formattedDate = format(new Date(insight.date), 'M월 d일', { locale: ko });
  const detailPath = `/insight/${insight.date}`;

  // Truncate insight text to 2 lines (approximately 50 characters for Korean)
  const truncatedText = insight.insight_text.length > 50 
    ? insight.insight_text.slice(0, 47) + '...'
    : insight.insight_text;

  return (
    <div className="space-y-4">
      {/* Header with Date and Bookmark */}
      <div className="flex items-center justify-between">
        <p className="text-footnote text-secondary">
          {formattedDate}
        </p>
        <BookmarkButton date={insight.date} size="sm" />
      </div>

      {/* Insight Text */}
      <h3 className="text-title-3 font-semibold leading-snug">
        "{truncatedText}"
      </h3>

      {/* Keywords */}
      <div className="flex flex-wrap gap-1 text-subheadline text-secondary">
        {insight.keywords.map((kw, index) => (
          <span key={kw.keyword}>
            {kw.keyword}
            {index < insight.keywords.length - 1 && (
              <span className="mx-1.5">·</span>
            )}
          </span>
        ))}
      </div>

      {/* CTA Button */}
      <Link 
        href={detailPath}
        onClick={onClose}
        className="
          inline-flex items-center gap-1 
          text-body font-medium text-link
          touch-target
          hover:opacity-80 active:opacity-60
          transition-opacity duration-quick
        "
      >
        자세히 보기
        <ArrowRightIcon />
      </Link>
    </div>
  );
}

function ArrowRightIcon() {
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
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default InsightPreview;
