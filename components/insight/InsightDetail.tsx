'use client';

import { useTranslation } from '@/lib/i18n';
import type { Insight } from '@/types/insight';

type InsightDetailProps = {
  insight: Insight;
};

export function InsightDetail({ insight }: InsightDetailProps) {
  const { ts } = useTranslation();

  return (
    <article className="space-y-6">
      {/* Main Insight - 카드 스타일 */}
      <section className="rounded-xl bg-bg p-5">
        {/* 오늘의 인사이트 라벨 */}
        <p className="text-caption font-medium text-violet-500 uppercase tracking-widest mb-3 text-center">
          {ts('detail.todayInsight')}
        </p>
        
        {/* 인사이트 텍스트 */}
        <h1 className="text-body font-extrabold leading-relaxed text-center">
          "{insight.insight_text}"
        </h1>
      </section>

      {/* Trend Signal Section */}
      <section className="space-y-3">
        <SectionHeadline>{ts('detail.trendSignal')}</SectionHeadline>
        <div className="rounded-xl bg-bg p-4">
          <ul className="space-y-4">
            {insight.keywords.map((kw) => (
              <li key={kw.keyword} className="space-y-1">
                <h3 className="text-footnote font-semibold">
                  {kw.keyword}
                </h3>
                <p className="text-footnote text-secondary leading-relaxed">
                  {kw.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Why it matters Section */}
      <section className="space-y-3">
        <SectionHeadline>{ts('detail.whyItMatters')}</SectionHeadline>
        <div className="rounded-xl bg-bg p-4">
          <p className="text-footnote text-label leading-relaxed">
            {insight.context}
          </p>
        </div>
      </section>

      {/* Key Question Section */}
      <section className="space-y-3">
        <SectionHeadline>{ts('detail.keyQuestion')}</SectionHeadline>
        <div className="rounded-xl bg-bg p-4">
          <QuestionList question={insight.question} />
        </div>
      </section>
    </article>
  );
}

/**
 * 섹션 헤드라인 컴포넌트
 * 설정 페이지와 동일한 스타일
 */
function SectionHeadline({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-caption font-normal text-secondary uppercase tracking-wide px-1">
      {children}
    </h2>
  );
}

/**
 * 질문 리스트 컴포넌트
 * 물음표(?)를 기준으로 질문을 분리하여 한 줄씩 표시
 */
function QuestionList({ question }: { question: string }) {
  // 물음표를 기준으로 질문 분리 (물음표 포함)
  const questions = question
    .split(/(?<=\?)/)  // 물음표 뒤에서 분리 (물음표 포함)
    .map(q => q.trim())
    .filter(q => q.length > 0);

  return (
    <ul className="space-y-3">
      {questions.map((q, index) => (
        <li key={index} className="flex items-baseline gap-2.5">
          {/* 미니멀 숫자 인디케이터 */}
          <span className="flex-shrink-0 text-caption font-medium text-secondary tabular-nums">
            {String(index + 1).padStart(2, '0')}
          </span>
          
          {/* 질문 텍스트 */}
          <p className="text-footnote font-medium leading-relaxed">
            {q}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default InsightDetail;
