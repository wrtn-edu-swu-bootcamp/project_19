import { getInsightsByMonth } from '@/lib/db';
import { HomeClient } from '@/components/home';
import type { InsightCalendarItem } from '@/types/insight';

export default async function HomePage() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // 1-indexed

  // Fetch insights for current month
  let insights: InsightCalendarItem[] = [];
  try {
    insights = await getInsightsByMonth(currentYear, currentMonth);
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
