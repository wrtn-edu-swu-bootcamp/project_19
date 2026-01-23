/**
 * 오늘 날짜 인사이트를 수동으로 생성하는 스크립트
 * 
 * 사용법:
 *   npm run generate:today
 *   또는
 *   npx tsx scripts/generate-today-insight.ts
 */

import { generateInsightWithRetry } from '../lib/ai/gemini';
import { saveInsight, getInsightByDate } from '../lib/db';

/**
 * KST 기준 오늘 날짜를 YYYY-MM-DD 형식으로 반환
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

async function generateTodayInsight() {
  const today = getKSTDateString();
  console.log(`\n📅 오늘 날짜 (KST): ${today}\n`);

  try {
    // 이미 오늘 인사이트가 있는지 확인
    console.log('🔍 기존 인사이트 확인 중...');
    const existingInsight = await getInsightByDate(today);
    
    if (existingInsight) {
      console.log(`✅ ${today} 인사이트가 이미 존재합니다.`);
      console.log(`\n인사이트 내용:\n${existingInsight.insight_text}\n`);
      return;
    }

    // AI로 인사이트 생성
    console.log('🤖 AI 인사이트 생성 중...');
    const startTime = Date.now();
    const generatedInsight = await generateInsightWithRetry(today);
    const duration = Date.now() - startTime;
    
    console.log(`✅ AI 인사이트 생성 완료 (${duration}ms)`);
    console.log(`\n생성된 인사이트:\n${generatedInsight.insight_text}\n`);

    // DB에 저장
    console.log('💾 데이터베이스에 저장 중...');
    await saveInsight({
      date: today,
      ...generatedInsight,
    });
    
    console.log(`✅ ${today} 인사이트 생성 및 저장 완료!`);
    console.log(`\n키워드:`);
    generatedInsight.keywords.forEach((kw, i) => {
      console.log(`  ${i + 1}. ${kw.keyword}: ${kw.description}`);
    });
    console.log();
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`\n❌ 인사이트 생성 실패: ${errorMessage}\n`);
    
    if (error instanceof Error && error.stack) {
      console.error('스택 트레이스:', error.stack);
    }
    
    process.exit(1);
  }
}

// 스크립트 실행
generateTodayInsight()
  .then(() => {
    console.log('✨ 완료!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('예상치 못한 오류:', error);
    process.exit(1);
  });
