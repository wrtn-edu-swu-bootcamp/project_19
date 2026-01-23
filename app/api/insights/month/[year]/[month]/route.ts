/**
 * Monthly Insights API
 * 특정 월의 인사이트 목록 조회
 */

import { NextRequest, NextResponse } from 'next/server';
import { getInsightsByMonth } from '@/lib/db';

type RouteParams = {
  params: Promise<{ year: string; month: string }>;
};

/**
 * GET /api/insights/month/[year]/[month]
 * 특정 연도/월의 인사이트 목록 조회
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { year, month } = await params;
    
    // Validate year and month
    const yearNum = parseInt(year, 10);
    const monthNum = parseInt(month, 10);
    
    if (isNaN(yearNum) || yearNum < 2020 || yearNum > 2100) {
      return NextResponse.json(
        { error: 'Invalid year. Must be between 2020 and 2100' },
        { status: 400 }
      );
    }
    
    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return NextResponse.json(
        { error: 'Invalid month. Must be between 1 and 12' },
        { status: 400 }
      );
    }

    const insights = await getInsightsByMonth(yearNum, monthNum);
    
    return NextResponse.json({
      year: yearNum,
      month: monthNum,
      count: insights.length,
      insights,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[API] Failed to fetch monthly insights:', errorMessage);
    
    // Vercel 로그에 더 자세한 정보 제공
    if (process.env.NODE_ENV === 'production') {
      console.error('[API] Error details:', {
        year: yearNum,
        month: monthNum,
        has_db_url: !!(process.env.POSTGRES_URL || process.env.DATABASE_URL),
      });
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
