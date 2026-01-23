/**
 * AI Insight Generation API Route
 * Vercel Cron Job이 매일 호출하여 새 인사이트를 생성
 * 
 * Cron 설정 (vercel.json):
 * {
 *   "crons": [{
 *     "path": "/api/insights/generate",
 *     "schedule": "0 21 * * *"  // 매일 UTC 21:00 = KST 06:00
 *   }]
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateInsightWithRetry } from '@/lib/ai/gemini';
import { saveInsight, getInsightByDate } from '@/lib/db';

/**
 * POST /api/insights/generate
 * Vercel Cron Job이 매일 호출하여 새 인사이트를 생성하는 엔드포인트
 * 
 * 실행 시간: 매일 UTC 21:00 (한국시간 오전 6:00)
 * 
 * @see https://vercel.com/docs/cron-jobs
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  // 프로덕션 환경에서만 인증 검증
  if (!isDevelopment) {
    const authHeader = request.headers.get('authorization');
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;
    
    if (!process.env.CRON_SECRET) {
      console.error('[CRON] CRON_SECRET 환경 변수가 설정되지 않았습니다.');
      return NextResponse.json(
        { error: 'Server configuration error', message: 'CRON_SECRET is not set' },
        { status: 500 }
      );
    }
    
    if (authHeader !== expectedAuth) {
      console.warn('[CRON] 인증 실패: 잘못된 Authorization 헤더');
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid authorization header' },
        { status: 401 }
      );
    }
    
    console.log('[CRON] 인증 성공 - 인사이트 생성 작업 시작');
  } else {
    console.log('[DEV] Development mode: 인증 생략');
  }
  
  // 오늘 날짜 (KST 기준)
  const today = getKSTDateString();
  console.log(`[CRON] 오늘 날짜 (KST): ${today}`);
  
  try {
    // 이미 오늘 인사이트가 있는지 확인
    const existingInsight = await getInsightByDate(today);
    if (existingInsight) {
      const duration = Date.now() - startTime;
      console.log(`[CRON] ${today} 인사이트가 이미 존재합니다. (${duration}ms)`);
      return NextResponse.json({
        success: true,
        message: 'Insight already exists for today',
        date: today,
        skipped: true,
        duration_ms: duration,
      });
    }
    
    // AI로 인사이트 생성
    console.log(`[CRON] ${today} 인사이트 생성 시작...`);
    const generatedInsight = await generateInsightWithRetry(today);
    console.log(`[CRON] AI 인사이트 생성 완료: ${generatedInsight.insight_text.slice(0, 50)}...`);
    
    // DB에 저장
    await saveInsight({
      date: today,
      ...generatedInsight,
    });
    
    const duration = Date.now() - startTime;
    console.log(`[CRON] ${today} 인사이트 생성 및 저장 완료 (${duration}ms)`);
    
    return NextResponse.json({
      success: true,
      message: 'Insight generated successfully',
      date: today,
      insight_preview: generatedInsight.insight_text.slice(0, 100),
      duration_ms: duration,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const duration = Date.now() - startTime;
    console.error(`[CRON] 인사이트 생성 실패 (${today}, ${duration}ms):`, errorMessage);
    
    // 스택 트레이스도 로깅 (개발 환경에서만)
    if (isDevelopment && error instanceof Error) {
      console.error('[CRON] Stack trace:', error.stack);
    }
    
    // Vercel 로그에 더 자세한 정보 제공
    const errorDetails: Record<string, any> = {
      error: 'Failed to generate insight',
      message: errorMessage,
      date: today,
      duration_ms: duration,
    };
    
    // 환경 변수 체크 (디버깅용)
    if (errorMessage.includes('API') || errorMessage.includes('key')) {
      errorDetails.env_check = {
        has_gemini_key: !!process.env.GEMINI_API_KEY,
        has_db_url: !!(process.env.POSTGRES_URL || process.env.DATABASE_URL),
      };
    }
    
    return NextResponse.json(errorDetails, { status: 500 });
  }
}

/**
 * GET /api/insights/generate
 * 개발 환경에서 수동 테스트용
 * 프로덕션에서는 비활성화
 */
export async function GET(request: NextRequest) {
  // 개발 환경에서만 허용
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This endpoint is not available in production. Use POST with proper authorization.' },
      { status: 405 }
    );
  }
  
  // 개발 환경에서는 간단한 테스트 가능
  const today = getKSTDateString();
  
  try {
    console.log(`[DEV] ${today} 인사이트 생성 테스트 시작...`);
    const generatedInsight = await generateInsightWithRetry(today, 2);
    
    // 개발 환경에서는 저장하지 않고 결과만 반환
    return NextResponse.json({
      success: true,
      message: 'Test generation successful (not saved)',
      date: today,
      insight: generatedInsight,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        error: 'Failed to generate insight',
        message: errorMessage,
        date: today,
      },
      { status: 500 }
    );
  }
}

/**
 * KST(한국 표준시) 기준 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 */
function getKSTDateString(): string {
  const now = new Date();
  // KST는 UTC+9
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffset);
  
  const isoString = kstDate.toISOString();
  const datePart = isoString.split('T')[0];
  return datePart ?? isoString.slice(0, 10);
}
