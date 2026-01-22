'use client';

import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/calendar';
import { BottomSheet } from '@/components/ui';
import { InsightPreview } from '@/components/insight';
import type { InsightPreview as InsightPreviewType, InsightCalendarItem } from '@/types/insight';

type HomeClientProps = {
  initialInsights: InsightCalendarItem[];
  initialYear: number;
  initialMonth: number;
};

export function HomeClient({ 
  initialInsights, 
  initialYear, 
  initialMonth 
}: HomeClientProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<InsightPreviewType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Convert insights to date strings for calendar
  const insightDates = initialInsights.map(item => item.date);

  // Fetch insight preview when date is selected
  const handleDateSelect = useCallback(async (date: Date) => {
    setSelectedDate(date);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Check if this date has an insight
    const hasInsight = insightDates.includes(dateStr);
    
    if (hasInsight) {
      setIsLoading(true);
      setIsSheetOpen(true);
      
      try {
        const response = await fetch(`/api/insights/${dateStr}`);
        if (response.ok) {
          const insight = await response.json();
          setSelectedInsight(insight);
        } else {
          setSelectedInsight(null);
        }
      } catch (error) {
        console.error('Failed to fetch insight:', error);
        setSelectedInsight(null);
      } finally {
        setIsLoading(false);
      }
    } else {
      // No insight for this date - show empty state
      setSelectedInsight(null);
      setIsSheetOpen(true);
    }
  }, [insightDates]);

  const handleCloseSheet = useCallback(() => {
    setIsSheetOpen(false);
    setSelectedInsight(null);
  }, []);

  return (
    <>
      {/* Calendar Section */}
      <section className="w-full flex justify-center">
        <Calendar
          insightDates={insightDates}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />
      </section>

      {/* Bottom Sheet for Insight Preview */}
      <BottomSheet isOpen={isSheetOpen} onClose={handleCloseSheet}>
        {isLoading ? (
          <LoadingState />
        ) : selectedInsight ? (
          <InsightPreview 
            insight={selectedInsight} 
            onClose={handleCloseSheet}
          />
        ) : (
          <EmptyState selectedDate={selectedDate} />
        )}
      </BottomSheet>
    </>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-link border-t-transparent rounded-full animate-spin" />
        <p className="text-footnote text-secondary">인사이트를 불러오는 중...</p>
      </div>
    </div>
  );
}

function EmptyState({ selectedDate }: { selectedDate: Date | null }) {
  const formattedDate = selectedDate 
    ? format(selectedDate, 'M월 d일')
    : '';

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="w-12 h-12 mb-4 rounded-full bg-bg-secondary flex items-center justify-center">
        <CalendarIcon />
      </div>
      <p className="text-body font-medium mb-1">
        {formattedDate} 인사이트가 없습니다
      </p>
      <p className="text-footnote text-secondary">
        매일 새로운 마케팅 인사이트가 제공됩니다
      </p>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg 
      width="24" 
      height="24" 
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

export default HomeClient;
