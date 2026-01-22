'use client';

import type { Insight } from '@/types/insight';

type InsightDetailProps = {
  insight: Insight;
};

export function InsightDetail({ insight }: InsightDetailProps) {
  return (
    <article className="space-y-8">
      {/* Main Insight */}
      <section className="py-6">
        {/* 오늘의 인사이트 라벨 */}
        <p className="text-footnote font-medium text-link uppercase tracking-widest mb-4 text-center">
          Today's Insight
        </p>
        
        {/* 인사이트 텍스트 - 인용구 스타일 */}
        <div className="relative px-4">
          {/* 왼쪽 인용 부호 */}
          <span className="absolute -left-1 -top-2 text-4xl text-secondary opacity-30 font-serif leading-none select-none" aria-hidden="true">
            "
          </span>
          
          <h1 className="text-title-3 font-semibold leading-relaxed text-center">
            {insight.insight_text}
          </h1>
          
          {/* 오른쪽 인용 부호 */}
          <span className="absolute -right-1 bottom-0 text-4xl text-secondary opacity-30 font-serif leading-none select-none" aria-hidden="true">
            "
          </span>
        </div>
      </section>

      {/* Trend Signal Section */}
      <section className="space-y-5">
        <SectionHeadline>Trend Signal</SectionHeadline>
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

      {/* Why it matters Section */}
      <section className="space-y-5">
        <SectionHeadline>Why it matters</SectionHeadline>
        <p className="text-body text-label leading-relaxed">
          {insight.context}
        </p>
      </section>

      {/* Key Question Section */}
      <section className="space-y-5">
        <SectionHeadline>Key Question</SectionHeadline>
        <QuestionList question={insight.question} />
      </section>
    </article>
  );
}

/**
 * 섹션 헤드라인 컴포넌트
 * 가운데 정렬 + 양쪽 구분선으로 헤드라인임을 시각적으로 표현
 */
function SectionHeadline({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 py-2">
      {/* 왼쪽 구분선 */}
      <div className="flex-1 h-px bg-separator opacity-30" />
      
      {/* 헤드라인 텍스트 */}
      <h2 className="text-footnote font-semibold text-secondary uppercase tracking-widest">
        {children}
      </h2>
      
      {/* 오른쪽 구분선 */}
      <div className="flex-1 h-px bg-separator opacity-30" />
    </div>
  );
}

/**
 * 질문 리스트 컴포넌트
 * 물음표(?)를 기준으로 질문을 분리하여 한 줄씩 표시
 * 애플 스타일 미니멀 디자인
 */
function QuestionList({ question }: { question: string }) {
  // 물음표를 기준으로 질문 분리 (물음표 포함)
  const questions = question
    .split(/(?<=\?)/)  // 물음표 뒤에서 분리 (물음표 포함)
    .map(q => q.trim())
    .filter(q => q.length > 0);

  return (
    <ul className="space-y-4">
      {questions.map((q, index) => (
        <li key={index} className="flex items-baseline gap-3">
          {/* 미니멀 숫자 인디케이터 */}
          <span className="flex-shrink-0 text-footnote font-medium text-secondary tabular-nums">
            {String(index + 1).padStart(2, '0')}
          </span>
          
          {/* 질문 텍스트 */}
          <p className="text-body font-medium leading-relaxed">
            {q}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default InsightDetail;
