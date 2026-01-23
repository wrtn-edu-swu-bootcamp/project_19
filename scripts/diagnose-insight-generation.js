/**
 * 인사이트 생성 시스템 진단 스크립트
 * 오류 원인을 파악하기 위한 상세 진단
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

async function diagnose() {
  const today = getKSTDateString();
  console.log('\n🔍 인사이트 생성 시스템 진단\n');
  console.log('='.repeat(50));
  console.log(`📅 오늘 날짜 (KST): ${today}\n`);

  // 1. 서버 연결 확인
  console.log('1️⃣ 서버 연결 확인...');
  try {
    await new Promise((resolve, reject) => {
      const req = http.request({
        hostname: HOST,
        port: PORT,
        path: '/',
        method: 'GET',
      }, (res) => {
        console.log(`   ✅ 서버 연결 성공 (${res.statusCode})`);
        resolve();
      });
      
      req.on('error', (error) => {
        console.log(`   ❌ 서버 연결 실패: ${error.message}`);
        reject(error);
      });
      
      req.end();
    });
  } catch (error) {
    console.log('\n❌ 서버가 실행 중이지 않습니다.');
    console.log('   다음 명령어로 서버를 실행하세요: npm run dev\n');
    process.exit(1);
  }

  // 2. 오늘 날짜 인사이트 확인
  console.log('\n2️⃣ 오늘 날짜 인사이트 확인...');
  try {
    const insight = await new Promise((resolve, reject) => {
      const req = http.request({
        hostname: HOST,
        port: PORT,
        path: `/api/insights/${today}`,
        method: 'GET',
      }, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          if (res.statusCode === 200) {
            try {
              const result = JSON.parse(data);
              console.log(`   ✅ 오늘 날짜 인사이트 존재`);
              console.log(`   내용: ${result.insight_text.slice(0, 50)}...`);
              resolve(result);
            } catch (e) {
              console.log(`   ⚠️  응답 파싱 실패: ${data}`);
              resolve(null);
            }
          } else if (res.statusCode === 404) {
            console.log(`   ℹ️  오늘 날짜 인사이트 없음 (404)`);
            resolve(null);
          } else {
            console.log(`   ❌ 오류 발생 (${res.statusCode}): ${data}`);
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      });
      
      req.on('error', reject);
      req.end();
    });
    
    if (insight) {
      console.log('\n✅ 오늘 날짜 인사이트가 이미 생성되어 있습니다!');
      console.log('   자동 생성 시스템이 정상적으로 작동하고 있습니다.\n');
      process.exit(0);
    }
  } catch (error) {
    console.log(`   ❌ 확인 실패: ${error.message}`);
  }

  // 3. 인사이트 생성 시도 (GET - 테스트 모드)
  console.log('\n3️⃣ 인사이트 생성 테스트 (GET - 저장 안 함)...');
  try {
    const testResult = await new Promise((resolve, reject) => {
      const req = http.request({
        hostname: HOST,
        port: PORT,
        path: '/api/insights/generate',
        method: 'GET',
      }, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          if (res.statusCode === 200) {
            try {
              const result = JSON.parse(data);
              console.log(`   ✅ 인사이트 생성 성공 (테스트)`);
              console.log(`   내용: ${result.insight?.insight_text?.slice(0, 50) || 'N/A'}...`);
              resolve(result);
            } catch (e) {
              console.log(`   ⚠️  응답 파싱 실패: ${data}`);
              reject(new Error('Parse error'));
            }
          } else {
            console.log(`   ❌ 생성 실패 (${res.statusCode}): ${data}`);
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      });
      
      req.on('error', reject);
      req.end();
    });
    
    console.log('   ✅ AI 인사이트 생성 기능이 정상 작동합니다.');
  } catch (error) {
    console.log(`   ❌ 생성 테스트 실패: ${error.message}`);
    console.log('\n   💡 가능한 원인:');
    console.log('      - GEMINI_API_KEY가 설정되지 않음 (샘플 인사이트 사용)');
    console.log('      - AI 생성 로직 오류');
    console.log('      - 네트워크 문제\n');
  }

  // 4. 실제 인사이트 생성 및 저장 시도
  console.log('\n4️⃣ 인사이트 생성 및 저장 시도 (POST)...');
  try {
    const saveResult = await new Promise((resolve, reject) => {
      const req = http.request({
        hostname: HOST,
        port: PORT,
        path: '/api/insights/generate',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          if (res.statusCode === 200 || res.statusCode === 201) {
            try {
              const result = JSON.parse(data);
              console.log(`   ✅ 인사이트 생성 및 저장 성공!`);
              if (result.skipped) {
                console.log(`   ℹ️  이미 존재하여 건너뜀`);
              } else {
                console.log(`   내용: ${result.insight_preview || 'N/A'}...`);
              }
              resolve(result);
            } catch (e) {
              console.log(`   ⚠️  응답 파싱 실패: ${data}`);
              reject(new Error('Parse error'));
            }
          } else {
            console.log(`   ❌ 저장 실패 (${res.statusCode}): ${data}`);
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      });
      
      req.on('error', reject);
      req.end();
    });
    
    console.log('\n✅ 인사이트 생성 및 저장이 성공했습니다!');
    console.log('   자동 생성 시스템이 정상적으로 작동하고 있습니다.\n');
  } catch (error) {
    console.log(`   ❌ 저장 실패: ${error.message}`);
    console.log('\n   💡 가능한 원인:');
    console.log('      - 데이터베이스 연결 문제');
    console.log('      - DB 스키마 문제');
    console.log('      - 저장 로직 오류');
    console.log('      - 환경 변수 설정 문제 (DATABASE_URL, POSTGRES_URL)\n');
  }

  // 5. 환경 변수 확인 가이드
  console.log('\n5️⃣ 환경 변수 확인 가이드:');
  console.log('   📋 필요한 환경 변수:');
  console.log('      - GEMINI_API_KEY: AI 인사이트 생성용 (선택사항, 없으면 샘플 사용)');
  console.log('      - DATABASE_URL 또는 POSTGRES_URL: DB 연결용');
  console.log('      - CRON_SECRET: 프로덕션 크론 인증용\n');

  console.log('='.repeat(50));
  console.log('\n✨ 진단 완료!\n');
}

diagnose()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ 진단 중 오류 발생:', error.message);
    process.exit(1);
  });
