import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function HomePage() {
  const today = new Date();
  const formattedDate = format(today, 'yyyy년 M월 d일 EEEE', { locale: ko });

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-5 py-10">
      {/* Header */}
      <header className="w-full max-w-[600px] text-center">
        <h1 className="text-large-title mb-2">
          AI Insight Calendar
        </h1>
        <p className="text-secondary text-subheadline">
          {formattedDate}
        </p>
      </header>

      {/* Main Content Area */}
      <section className="mt-10 w-full max-w-[600px]">
        <div className="rounded-lg bg-bg-secondary p-6 shadow-sm">
          <p className="text-headline mb-4">
            오늘의 인사이트
          </p>
          <p className="text-body text-label-secondary">
            매일 하나의 AI 큐레이션 마케팅 인사이트로
            <br />
            트렌드 소비를 사고 습관으로 전환하세요.
          </p>
        </div>
      </section>

      {/* Calendar Placeholder */}
      <section className="mt-8 w-full max-w-[600px]">
        <div className="rounded-lg border border-separator p-6 text-center">
          <p className="text-footnote text-secondary">
            캘린더 컴포넌트가 여기에 표시됩니다
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto pt-10">
        <p className="text-caption text-secondary">
          Phase 1 설정 완료 - Next.js 15 + Tailwind CSS 4.1
        </p>
      </footer>
    </div>
  );
}
