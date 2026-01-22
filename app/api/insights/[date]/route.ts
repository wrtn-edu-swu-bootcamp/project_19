import { NextRequest, NextResponse } from 'next/server';
import { getInsightByDate } from '@/lib/db';

type RouteParams = {
  params: Promise<{ date: string }>;
};

/**
 * GET /api/insights/[date]
 * 특정 날짜의 인사이트 조회
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { date } = await params;
    
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    const insight = await getInsightByDate(date);
    
    if (!insight) {
      return NextResponse.json(
        { error: 'Insight not found' },
        { status: 404 }
      );
    }

    // Return preview format for bottom sheet
    return NextResponse.json({
      id: insight.id,
      date: insight.date,
      insight_text: insight.insight_text,
      keywords: insight.keywords,
    });
  } catch (error) {
    console.error('Failed to fetch insight:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
