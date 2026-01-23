import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { format, subDays, addDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { getInsightByDate } from '@/lib/db';
import { InsightHeader, InsightDetail, InsightNavigationArrows } from '@/components/insight';
import { NoteEditor } from '@/components/note';

type PageProps = {
  params: Promise<{ date: string }>;
};

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { date } = await params;
  
  try {
    const insight = await getInsightByDate(date);
    
    if (!insight) {
      return {
        title: '인사이트를 찾을 수 없습니다',
      };
    }

    const formattedDate = format(new Date(date), 'yyyy년 M월 d일', { locale: ko });
    
    return {
      title: `${formattedDate} 인사이트`,
      description: insight.insight_text,
      openGraph: {
        title: `${formattedDate} - AI Insight Calendar`,
        description: insight.insight_text,
      },
    };
  } catch {
    return {
      title: '인사이트',
    };
  }
}

export default async function InsightPage({ params }: PageProps) {
  const { date } = await params;
  
  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    notFound();
  }

  // Fetch insight data
  let insight;
  try {
    insight = await getInsightByDate(date);
  } catch (error) {
    console.error('Failed to fetch insight:', error);
    // Show error state instead of crashing
    return (
      <div className="min-h-screen flex flex-col bg-bg-secondary">
        <InsightHeader date={date} />
        <main className="flex-1 flex items-center justify-center px-5">
          <div className="text-center">
            <p className="text-body text-secondary mb-2">
              인사이트를 불러오는 중 오류가 발생했습니다
            </p>
            <p className="text-footnote text-secondary">
              잠시 후 다시 시도해주세요
            </p>
          </div>
        </main>
      </div>
    );
  }

  // If no insight found for this date
  if (!insight) {
    return (
      <div className="min-h-screen flex flex-col bg-bg-secondary">
        <InsightHeader date={date} />
        <main className="flex-1 flex items-center justify-center px-5">
          <EmptyInsightState date={date} />
        </main>
      </div>
    );
  }

  // Check if prev/next dates have insights
  const currentDateObj = new Date(date);
  const prevDate = subDays(currentDateObj, 1);
  const nextDate = addDays(currentDateObj, 1);
  const prevDateStr = format(prevDate, 'yyyy-MM-dd');
  const nextDateStr = format(nextDate, 'yyyy-MM-dd');

  let hasPrevInsight = false;
  let hasNextInsight = false;

  try {
    const prevInsight = await getInsightByDate(prevDateStr);
    hasPrevInsight = !!prevInsight;
  } catch {
    hasPrevInsight = false;
  }

  try {
    const nextInsight = await getInsightByDate(nextDateStr);
    hasNextInsight = !!nextInsight;
  } catch {
    hasNextInsight = false;
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg-secondary relative">
      <InsightHeader date={date} insightText={insight.insight_text} />
      
      <main className="flex-1 px-5 py-6 max-w-[600px] mx-auto w-full">
        {/* Insight Content */}
        <InsightDetail insight={insight} />

        {/* Note Editor */}
        <div className="mt-8">
          <NoteEditor insightDate={date} />
        </div>
      </main>

      {/* Navigation Arrows */}
      <InsightNavigationArrows 
        currentDate={date} 
        hasPrevInsight={hasPrevInsight}
        hasNextInsight={hasNextInsight}
      />
    </div>
  );
}

function EmptyInsightState({ date }: { date: string }) {
  const formattedDate = format(new Date(date), 'M월 d일', { locale: ko });

  return (
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-bg-secondary flex items-center justify-center">
        <CalendarIcon />
      </div>
      <h2 className="text-title-3 font-semibold mb-2">
        {formattedDate} 인사이트가 없습니다
      </h2>
      <p className="text-body text-secondary">
        해당 날짜에는 아직 인사이트가 생성되지 않았습니다
      </p>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg 
      width="32" 
      height="32" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="text-secondary"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
