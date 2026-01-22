'use client';

import { format, isToday } from 'date-fns';
import { ko } from 'date-fns/locale';
import { BookmarkButton } from '@/components/ui';
import type { Insight } from '@/types/insight';

type InsightDetailProps = {
  insight: Insight;
};

export function InsightDetail({ insight }: InsightDetailProps) {
  const insightDate = new Date(insight.date);
  const formattedDate = format(insightDate, 'yyyy년 M월 d일', { locale: ko });
  const isTodayInsight = isToday(insightDate);

  return (
    <article className="space-y-8">
      {/* Header with Date and Bookmark */}
      <header className="flex items-center justify-between">
        <p className="text-subheadline text-secondary">
          {formattedDate}
          {isTodayInsight && (
            <span className="ml-2 text-link">오늘</span>
          )}
        </p>
        <BookmarkButton date={insight.date} size="md" />
      </header>

      {/* Main Insight */}
      <section>
        <h1 className="text-title-1 font-bold leading-tight">
          "{insight.insight_text}"
        </h1>
      </section>

      <Divider />

      {/* Trend Signal Section */}
      <section className="space-y-4">
        <h2 className="text-title-3 font-semibold">
          Trend Signal
        </h2>
        <ul className="space-y-5">
          {insight.keywords.map((kw) => (
            <li key={kw.keyword} className="space-y-1">
              <h3 className="text-body font-medium">
                {kw.keyword}
              </h3>
              <p className="text-subheadline text-secondary leading-relaxed">
                {kw.description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <Divider />

      {/* Why it matters Section */}
      <section className="space-y-4">
        <h2 className="text-title-3 font-semibold">
          Why it matters
        </h2>
        <p className="text-body text-label leading-relaxed">
          {insight.context}
        </p>
      </section>

      <Divider />

      {/* Key Question Section */}
      <section className="space-y-4">
        <h2 className="text-title-3 font-semibold">
          Key Question
        </h2>
        <div className="p-5 bg-bg-secondary rounded-md">
          <p className="text-body font-medium leading-relaxed">
            {insight.question}
          </p>
        </div>
      </section>
    </article>
  );
}

function Divider() {
  return (
    <hr className="border-0 h-px bg-separator opacity-30" />
  );
}

export default InsightDetail;
