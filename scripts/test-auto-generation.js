/**
 * 자동 인사이트 생성 테스트 스크립트
 * 오늘, 내일, 모레 날짜로 인사이트 생성 테스트
 */

const http = require('http');

const PORT = process.env.PORT || 3000;
const HOST = 'localhost';

/**
 * KST 기준 날짜 문자열 생성
 */
function getKSTDateString(daysOffset = 0) {
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffset);
  kstDate.setDate(kstDate.getDate() + daysOffset);
  
  const isoString = kstDate.toISOString();
  const datePart = isoString.split('T')[0];
  return datePart || isoString.slice(0, 10);
}

/**
 * 특정 날짜의 인사이트 확인
 */
function checkInsight(date) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: HOST,
      port: PORT,
      path: `/api/insights/${date}`,
      method: 'GET',
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          const insight = JSON.parse(data);
          resolve({ exists: true, insight });
        } else {
          resolve({ exists: false });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

/**
 * 인사이트 생성 요청
 */
function generateInsight(date) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: HOST,
      port: PORT,
      path: '/api/insights/generate',
      method: 'POST',
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({ status: res.statusCode, result });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function testAutoGeneration() {
  console.log('\n🧪 자동 인사이트 생성 테스트\n');
  console.log('=' .repeat(50));

  const testDates = [
    { label: '오늘', offset: 0 },
    { label: '내일', offset: 1 },
    { label: '모레', offset: 2 },
  ];

  for (const { label, offset } of testDates) {
    const date = getKSTDateString(offset);
    console.log(`\n📅 ${label} (${date}) 테스트:`);
    console.log('-'.repeat(50));

    // 1. 기존 인사이트 확인
    console.log('1️⃣ 기존 인사이트 확인 중...');
    const existing = await checkInsight(date);
    
    if (existing.exists) {
      console.log(`   ✅ 인사이트 이미 존재: "${existing.insight.insight_text.slice(0, 40)}..."`);
    } else {
      console.log(`   ⚠️  인사이트 없음`);
    }

    // 2. 인사이트 생성 시도
    console.log('2️⃣ 인사이트 생성 시도 중...');
    try {
      const generateResult = await generateInsight(date);
      
      if (generateResult.status === 200) {
        if (generateResult.result.skipped) {
          console.log(`   ℹ️  이미 존재하여 건너뜀`);
        } else {
          console.log(`   ✅ 생성 성공!`);
          console.log(`   📝 내용: "${generateResult.result.insight_preview}..."`);
          if (generateResult.result.duration_ms) {
            console.log(`   ⏱️  소요 시간: ${generateResult.result.duration_ms}ms`);
          }
        }
      } else {
        console.log(`   ❌ 생성 실패 (${generateResult.status})`);
        if (generateResult.result) {
          console.log(`   오류: ${generateResult.result.error || JSON.stringify(generateResult.result)}`);
        }
      }
    } catch (error) {
      console.log(`   ❌ 오류 발생: ${error.message}`);
    }

    // 3. 생성 후 확인
    console.log('3️⃣ 생성 후 확인 중...');
    const afterCheck = await checkInsight(date);
    
    if (afterCheck.exists) {
      console.log(`   ✅ 인사이트 확인됨: "${afterCheck.insight.insight_text.slice(0, 40)}..."`);
    } else {
      console.log(`   ❌ 인사이트가 여전히 없음`);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('\n📋 Cron Job 설정 확인:');
  console.log('   - vercel.json에 Cron 설정이 되어 있는지 확인');
  console.log('   - Vercel에 배포 후 자동으로 매일 UTC 21:00 (한국시간 06:00)에 실행됩니다');
  console.log('\n💡 로컬 개발 환경에서는:');
  console.log('   - 개발 서버가 실행 중일 때 수동으로 생성 가능');
  console.log('   - 프로덕션에서는 Vercel Cron이 자동 실행');
  console.log('\n✨ 테스트 완료!\n');
}

// 연결 확인
const testConnection = http.request({
  hostname: HOST,
  port: PORT,
  path: '/',
  method: 'GET',
  timeout: 2000,
}, () => {
  testAutoGeneration()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('\n❌ 테스트 실패:', error.message);
      process.exit(1);
    });
});

testConnection.on('error', (error) => {
  if (error.code === 'ECONNREFUSED') {
    console.error('\n❌ 연결 실패: 개발 서버가 실행 중이지 않습니다.');
    console.error('\n다음 명령어로 개발 서버를 실행하세요:\n');
    console.error('   npm run dev\n');
  } else {
    console.error('\n❌ 오류:', error.message);
  }
  process.exit(1);
});

testConnection.end();
