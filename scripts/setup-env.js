/**
 * 환경 변수 자동 설정 스크립트
 * .env.local 파일을 생성하거나 업데이트합니다.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const envPath = path.join(__dirname, '..', '.env.local');

// .env.local 파일이 이미 있는지 확인
const existingEnv = fs.existsSync(envPath) 
  ? fs.readFileSync(envPath, 'utf-8')
  : '';

// 기존 환경 변수 파싱
const envVars = {};
existingEnv.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  console.log('\n🔧 환경 변수 설정\n');
  console.log('이 스크립트는 .env.local 파일을 설정합니다.\n');

  // GEMINI_API_KEY 확인
  if (!envVars.GEMINI_API_KEY) {
    console.log('📝 Google Gemini API 키가 필요합니다.');
    console.log('   1. https://aistudio.google.com 접속');
    console.log('   2. "Get API Key" 클릭');
    console.log('   3. API 키 생성 후 복사\n');
    
    const apiKey = await question('Gemini API 키를 입력하세요 (엔터로 건너뛰기): ');
    if (apiKey.trim()) {
      envVars.GEMINI_API_KEY = apiKey.trim();
      console.log('✅ API 키가 설정되었습니다.\n');
    } else {
      console.log('⚠️  API 키를 건너뛰었습니다. 샘플 인사이트가 사용됩니다.\n');
    }
  } else {
    console.log('✅ GEMINI_API_KEY가 이미 설정되어 있습니다.\n');
  }

  // DATABASE_URL 확인 (선택사항)
  if (!envVars.DATABASE_URL && !envVars.POSTGRES_URL) {
    console.log('💾 데이터베이스 연결 (선택사항)');
    console.log('   로컬 개발 시 데이터베이스 없이도 작동합니다.\n');
    
    const dbUrl = await question('DATABASE_URL을 입력하세요 (엔터로 건너뛰기): ');
    if (dbUrl.trim()) {
      envVars.DATABASE_URL = dbUrl.trim();
      console.log('✅ 데이터베이스 URL이 설정되었습니다.\n');
    }
  } else {
    console.log('✅ DATABASE_URL이 이미 설정되어 있습니다.\n');
  }

  // .env.local 파일 작성
  const envContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n') + '\n';

  fs.writeFileSync(envPath, envContent, 'utf-8');
  console.log(`✅ .env.local 파일이 생성되었습니다: ${envPath}\n`);

  if (!envVars.GEMINI_API_KEY) {
    console.log('💡 팁: 나중에 API 키를 설정하려면 .env.local 파일을 직접 편집하세요.\n');
  }

  rl.close();
}

setup().catch(error => {
  console.error('❌ 오류 발생:', error);
  rl.close();
  process.exit(1);
});
