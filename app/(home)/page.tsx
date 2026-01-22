import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { getInsightsByMonth } from '@/lib/db';
import { HomeClient } from '@/components/home';
import type { InsightCalendarItem } from '@/types/insight';

export default async function HomePage() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // 1-indexed
  const formattedDate = format(today, 'yyyy년 M월 d일 EEEE', { locale: ko });

  // Fetch insights for current month
  let insights: InsightCalendarItem[] = [];
  try {
    insights = await getInsightsByMonth(currentYear, currentMonth);
  } catch (error) {
    // DB connection might not be available in development
    console.error('Failed to fetch insights:', error);
  }

  return (
    <div className="flex flex-1 flex-col px-5 py-8">
      {/* Header */}
      <header className="w-full max-w-[600px] mx-auto text-center mb-8">
        <h1 className="text-large-title font-bold mb-2">
          AI Insight Calendar
        </h1>
        <p className="text-secondary text-subheadline">
          {formattedDate}
        </p>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-[600px] mx-auto flex-1">
        {/* Today's Insight Banner */}
        <section className="mb-8">
          <div className="rounded-xl bg-bg-secondary p-5">
            <p className="text-headline font-semibold mb-2">
              오늘의 인사이트
            </p>
            <p className="text-body text-secondary leading-relaxed">
              매일 하나의 AI 큐레이션 마케팅 인사이트로
              <br />
              트렌드 소비를 사고 습관으로 전환하세요.
            </p>
          </div>
        </section>

        {/* Calendar */}
        <HomeClient 
          initialInsights={insights}
          initialYear={currentYear}
          initialMonth={currentMonth}
        />
      </main>

      {/* Footer */}
      <footer className="mt-8 text-center">
        <p className="text-caption text-secondary">
          날짜를 선택하면 해당 날짜의 인사이트를 확인할 수 있습니다
        </p>
      </footer>
    </div>
  );
}
