import { getInsightsByMonth } from '@/lib/db';
import { HomeClient } from '@/components/home';
import type { InsightCalendarItem } from '@/types/insight';

export default async function HomePage() {
  // KST 기준 오늘 날짜 계산
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffset);
  const currentYear = kstDate.getFullYear();
  const currentMonth = kstDate.getMonth() + 1; // 1-indexed

  // Fetch insights for current month
  let insights: InsightCalendarItem[] = [];
  try {
    insights = await getInsightsByMonth(currentYear, currentMonth);
    console.log(`[HomePage] Loaded ${insights.length} insights for ${currentYear}-${currentMonth}`);
  } catch (error) {
    // DB connection might not be available in development
    console.error('Failed to fetch insights:', error);
  }

  return (
    <HomeClient 
      initialInsights={insights}
      initialYear={currentYear}
      initialMonth={currentMonth}
    />
  );
}
