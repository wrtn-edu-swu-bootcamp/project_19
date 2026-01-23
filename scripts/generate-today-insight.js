/**
 * 오늘 날짜 인사이트를 수동으로 생성하는 스크립트
 * 
 * 사용법:
 *   node scripts/generate-today-insight.js
 * 
 * 또는 개발 서버가 실행 중일 때:
 *   curl -X POST http://localhost:3000/api/insights/generate
 */

const http = require('http');

const PORT = process.env.PORT || 3000;
const HOST = 'localhost';

/**
 * KST 기준 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 */
function getKSTDateString() {
  const now = new Date();
  // KST는 UTC+9
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffset);
  
  const isoString = kstDate.toISOString();
  const datePart = isoString.split('T')[0];
  return datePart || isoString.slice(0, 10);
}

function generateTodayInsight() {
  return new Promise((resolve, reject) => {
    const today = getKSTDateString();
    console.log(`\n📅 오늘 날짜 (KST): ${today}\n`);
    console.log('🚀 인사이트 생성 요청 전송 중...\n');

    const options = {
      hostname: HOST,
      port: PORT,
      path: '/api/insights/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          
          if (res.statusCode === 200 || res.statusCode === 201) {
            if (result.skipped) {
              console.log(`✅ ${today} 인사이트가 이미 존재합니다.\n`);
              if (result.insight_preview) {
                console.log(`인사이트 미리보기: ${result.insight_preview}...\n`);
              }
            } else {
              console.log(`✅ ${today} 인사이트 생성 완료!\n`);
              if (result.insight_preview) {
                console.log(`인사이트 미리보기: ${result.insight_preview}...\n`);
              }
              if (result.duration_ms) {
                console.log(`⏱️  소요 시간: ${result.duration_ms}ms\n`);
              }
            }
            resolve(result);
          } else {
            console.error(`❌ 오류 발생 (${res.statusCode}):`, result);
            reject(new Error(result.message || 'Unknown error'));
          }
        } catch (error) {
          console.error('❌ 응답 파싱 실패:', error);
          console.error('원본 응답:', data);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      if (error.code === 'ECONNREFUSED') {
        console.error(`\n❌ 연결 실패: 개발 서버가 실행 중이지 않습니다.`);
        console.error(`\n다음 중 하나를 실행하세요:\n`);
        console.error(`1. 개발 서버 실행:`);
        console.error(`   npm run dev\n`);
        console.error(`2. 개발 서버 실행 후 다른 터미널에서:`);
        console.error(`   curl -X POST http://localhost:3000/api/insights/generate\n`);
      } else {
        console.error(`❌ 요청 실패:`, error.message);
      }
      reject(error);
    });

    req.end();
  });
}

// 스크립트 실행
generateTodayInsight()
  .then(() => {
    console.log('✨ 완료!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n예상치 못한 오류:', error.message);
    process.exit(1);
  });
