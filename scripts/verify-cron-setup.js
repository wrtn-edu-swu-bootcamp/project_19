/**
 * Cron Job 설정 검증 스크립트
 * vercel.json과 API 엔드포인트 설정을 확인합니다.
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Cron Job 설정 검증\n');
console.log('='.repeat(50));

// 1. vercel.json 확인
console.log('\n1️⃣ vercel.json 파일 확인:');
const vercelJsonPath = path.join(__dirname, '..', 'vercel.json');

if (fs.existsSync(vercelJsonPath)) {
  try {
    const vercelJson = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf-8'));
    
    if (vercelJson.crons && Array.isArray(vercelJson.crons)) {
      const insightCron = vercelJson.crons.find(cron => 
        cron.path === '/api/insights/generate'
      );
      
      if (insightCron) {
        console.log('   ✅ Cron Job 설정 발견');
        console.log(`   📍 Path: ${insightCron.path}`);
        console.log(`   ⏰ Schedule: ${insightCron.schedule}`);
        console.log(`   📝 설명: 매일 UTC 21:00 (한국시간 오전 6:00)에 실행`);
        
        // Schedule 파싱
        const scheduleParts = insightCron.schedule.split(' ');
        if (scheduleParts.length === 5) {
          const [minute, hour, day, month, weekday] = scheduleParts;
          console.log(`   🔢 상세: 분=${minute}, 시=${hour}, 일=${day}, 월=${month}, 요일=${weekday}`);
        }
      } else {
        console.log('   ❌ /api/insights/generate Cron Job이 설정되지 않았습니다.');
      }
    } else {
      console.log('   ❌ crons 배열이 없습니다.');
    }
    
    if (vercelJson.regions) {
      console.log(`   🌍 Regions: ${vercelJson.regions.join(', ')}`);
    }
  } catch (error) {
    console.log(`   ❌ JSON 파싱 오류: ${error.message}`);
  }
} else {
  console.log('   ❌ vercel.json 파일이 없습니다.');
}

// 2. API 엔드포인트 확인
console.log('\n2️⃣ API 엔드포인트 확인:');
const apiRoutePath = path.join(__dirname, '..', 'app', 'api', 'insights', 'generate', 'route.ts');

if (fs.existsSync(apiRoutePath)) {
  const routeContent = fs.readFileSync(apiRoutePath, 'utf-8');
  
  const checks = [
    { name: 'POST 메서드 존재', pattern: /export async function POST/ },
    { name: 'KST 날짜 계산', pattern: /getKSTDateString/ },
    { name: '기존 인사이트 확인', pattern: /getInsightByDate/ },
    { name: '인사이트 생성', pattern: /generateInsightWithRetry/ },
    { name: '인사이트 저장', pattern: /saveInsight/ },
    { name: 'Cron 인증 검증', pattern: /CRON_SECRET/ },
  ];
  
  checks.forEach(check => {
    if (check.pattern.test(routeContent)) {
      console.log(`   ✅ ${check.name}`);
    } else {
      console.log(`   ⚠️  ${check.name} - 확인 필요`);
    }
  });
} else {
  console.log('   ❌ API 라우트 파일이 없습니다.');
}

// 3. 환경 변수 확인 (가이드)
console.log('\n3️⃣ 환경 변수 설정 가이드:');
console.log('   📋 프로덕션 배포 시 필요한 환경 변수:');
console.log('      - GEMINI_API_KEY: Google AI Studio API 키');
console.log('      - CRON_SECRET: Cron Job 인증용 랜덤 문자열');
console.log('      - DATABASE_URL: Vercel Postgres 연결 URL (자동 설정)');

// 4. 자동 생성 로직 요약
console.log('\n4️⃣ 자동 생성 로직 요약:');
console.log('   📅 매일 UTC 21:00 (한국시간 오전 6:00)');
console.log('   🔄 Vercel Cron → POST /api/insights/generate');
console.log('   ✅ 오늘 날짜 인사이트 확인');
console.log('   🤖 없으면 AI로 생성 → DB 저장');
console.log('   ⏭️  있으면 건너뜀');

// 5. 테스트 방법
console.log('\n5️⃣ 테스트 방법:');
console.log('   로컬: npm run generate:today');
console.log('   또는: curl -X POST http://localhost:3000/api/insights/generate');
console.log('   자동 테스트: node scripts/test-auto-generation.js');

console.log('\n' + '='.repeat(50));
console.log('\n✨ 검증 완료!\n');
