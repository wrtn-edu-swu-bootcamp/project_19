/**
 * 오늘 날짜 인사이트 확인 스크립트
 */

const http = require('http');

const PORT = process.env.PORT || 3000;
const HOST = 'localhost';

function getKSTDateString() {
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffset);
  const isoString = kstDate.toISOString();
  const datePart = isoString.split('T')[0];
  return datePart || isoString.slice(0, 10);
}

function checkTodayInsight() {
  return new Promise((resolve, reject) => {
    const today = getKSTDateString();
    console.log(`\n📅 오늘 날짜 (KST): ${today}\n`);

    // 1. 특정 날짜 인사이트 확인
    console.log('1️⃣ 특정 날짜 인사이트 확인 중...');
    const dateOptions = {
      hostname: HOST,
      port: PORT,
      path: `/api/insights/${today}`,
      method: 'GET',
    };

    const dateReq = http.request(dateOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          const insight = JSON.parse(data);
          console.log(`✅ 오늘 날짜 인사이트 발견!`);
          console.log(`   내용: ${insight.insight_text}\n`);
        } else {
          console.log(`❌ 오늘 날짜 인사이트 없음 (${res.statusCode})\n`);
        }

        // 2. 월별 인사이트 확인
        console.log('2️⃣ 월별 인사이트 목록 확인 중...');
        const now = new Date();
        const kstOffset = 9 * 60 * 60 * 1000;
        const kstDate = new Date(now.getTime() + kstOffset);
        const year = kstDate.getFullYear();
        const month = kstDate.getMonth() + 1;

        const monthOptions = {
          hostname: HOST,
          port: PORT,
          path: `/api/insights/month/${year}/${month}`,
          method: 'GET',
        };

        const monthReq = http.request(monthOptions, (res) => {
          let monthData = '';
          res.on('data', (chunk) => { monthData += chunk; });
          res.on('end', () => {
            if (res.statusCode === 200) {
              const result = JSON.parse(monthData);
              console.log(`✅ ${year}년 ${month}월 인사이트 ${result.count}개 발견`);
              const todayInsight = result.insights.find(i => i.date === today);
              if (todayInsight) {
                console.log(`✅ 오늘 날짜(${today}) 인사이트가 목록에 포함되어 있습니다!`);
                console.log(`   내용: ${todayInsight.insight_text}\n`);
              } else {
                console.log(`❌ 오늘 날짜(${today}) 인사이트가 목록에 없습니다.\n`);
                console.log('📋 현재 목록:');
                result.insights.forEach(i => {
                  console.log(`   - ${i.date}: ${i.insight_text.slice(0, 30)}...`);
                });
                console.log();
              }
            } else {
              console.log(`❌ 월별 인사이트 조회 실패 (${res.statusCode})\n`);
            }
            resolve();
          });
        });

        monthReq.on('error', (error) => {
          console.error('❌ 월별 인사이트 조회 오류:', error.message);
          reject(error);
        });

        monthReq.end();
      });
    });

    dateReq.on('error', (error) => {
      if (error.code === 'ECONNREFUSED') {
        console.error(`\n❌ 연결 실패: 개발 서버가 실행 중이지 않습니다.`);
        console.error(`\n다음 명령어로 개발 서버를 실행하세요:\n`);
        console.error(`   npm run dev\n`);
      } else {
        console.error('❌ 오류:', error.message);
      }
      reject(error);
    });

    dateReq.end();
  });
}

checkTodayInsight()
  .then(() => {
    console.log('✨ 확인 완료!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n예상치 못한 오류:', error.message);
    process.exit(1);
  });
