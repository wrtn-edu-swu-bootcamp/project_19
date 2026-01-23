# 자동 인사이트 생성 가이드

## ✅ 설정 완료 상태

### 1. Cron Job 설정 (`vercel.json`)
```json
{
  "crons": [
    {
      "path": "/api/insights/generate",
      "schedule": "0 21 * * *"  // 매일 UTC 21:00 = 한국시간 오전 6:00
    }
  ],
  "regions": ["icn1"]
}
```

### 2. API 엔드포인트 (`/api/insights/generate`)
- ✅ POST 메서드 구현
- ✅ KST 기준 날짜 계산
- ✅ 기존 인사이트 확인 로직
- ✅ AI 인사이트 생성
- ✅ 데이터베이스 저장
- ✅ Cron 인증 검증

## 🔄 작동 방식

### 자동 생성 프로세스

1. **매일 오전 6시 (한국시간)**
   - Vercel Cron Job이 자동으로 `/api/insights/generate` 엔드포인트를 호출합니다.

2. **오늘 날짜 확인**
   - KST 기준으로 오늘 날짜를 계산합니다.
   - 예: 2026-01-23

3. **기존 인사이트 확인**
   - 데이터베이스에서 오늘 날짜의 인사이트가 있는지 확인합니다.
   - 있으면: 건너뜀 (중복 생성 방지)
   - 없으면: 새로 생성

4. **AI 인사이트 생성**
   - Google Gemini AI를 사용하여 마케팅 인사이트를 생성합니다.
   - API 키가 없으면 샘플 인사이트를 사용합니다.

5. **데이터베이스 저장**
   - 생성된 인사이트를 데이터베이스에 저장합니다.

## 📋 확인 방법

### 로컬 개발 환경

#### 1. 수동 생성 테스트
```bash
# 오늘 인사이트 생성
npm run generate:today

# 또는 curl 사용
curl -X POST http://localhost:3000/api/insights/generate
```

#### 2. 자동 생성 테스트
```bash
# 오늘, 내일, 모레 날짜 테스트
node scripts/test-auto-generation.js
```

#### 3. 설정 검증
```bash
# Cron Job 설정 확인
node scripts/verify-cron-setup.js
```

#### 4. 오늘 인사이트 확인
```bash
# 오늘 날짜 인사이트 확인
node scripts/check-today-insight.js
```

### 프로덕션 환경 (Vercel)

#### 1. Cron Job 상태 확인
- Vercel Dashboard → Settings → Cron Jobs
- `/api/insights/generate`가 활성화되어 있는지 확인
- 마지막 실행 시간과 상태 확인

#### 2. 로그 확인
- Vercel Dashboard → Logs
- `[CRON]` 태그로 필터링하여 실행 로그 확인
- 성공: `Insight generated successfully`
- 실패: 에러 메시지 확인

#### 3. 수동 실행 (테스트용)
```bash
curl -X POST https://your-domain.vercel.app/api/insights/generate \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## ⚠️ 주의사항

### 1. 날짜 기준
- **항상 오늘 날짜만 생성**: API는 `getKSTDateString()`을 사용하여 항상 오늘 날짜의 인사이트만 생성합니다.
- 내일이나 모레 날짜의 인사이트는 생성되지 않습니다.
- 이는 정상적인 동작입니다. 매일 자동으로 실행되면 그날의 인사이트를 생성합니다.

### 2. 중복 생성 방지
- 같은 날짜의 인사이트가 이미 있으면 새로 생성하지 않습니다.
- 이는 데이터 중복을 방지하기 위한 안전장치입니다.

### 3. 환경 변수
프로덕션 배포 시 다음 환경 변수가 필요합니다:
- `GEMINI_API_KEY`: Google AI Studio API 키
- `CRON_SECRET`: Cron Job 인증용 랜덤 문자열
- `DATABASE_URL`: Vercel Postgres 연결 URL (자동 설정)

## 🐛 문제 해결

### 인사이트가 생성되지 않는 경우

1. **Cron Job이 실행되지 않음**
   - Vercel Dashboard에서 Cron Job 상태 확인
   - `vercel.json` 파일이 제대로 배포되었는지 확인

2. **인증 실패**
   - `CRON_SECRET` 환경 변수가 설정되었는지 확인
   - Vercel Dashboard → Settings → Environment Variables

3. **API 키 오류**
   - `GEMINI_API_KEY`가 유효한지 확인
   - API 키가 없으면 샘플 인사이트가 사용됩니다

4. **데이터베이스 연결 오류**
   - `DATABASE_URL`이 설정되었는지 확인
   - Vercel Postgres가 프로젝트에 연결되어 있는지 확인

### 로그 확인

Vercel Dashboard → Logs에서 다음을 확인하세요:
- `[CRON]` 태그로 필터링
- 성공 메시지: `Insight generated successfully`
- 실패 메시지: 에러 상세 정보

## 📅 예상 동작

### 정상 동작 시나리오

**1월 23일 오전 6시 (한국시간)**
- Cron Job 실행
- 오늘 날짜: 2026-01-23
- 인사이트 확인 → 없음
- AI 인사이트 생성
- 데이터베이스 저장
- ✅ 완료

**1월 24일 오전 6시 (한국시간)**
- Cron Job 실행
- 오늘 날짜: 2026-01-24
- 인사이트 확인 → 없음
- AI 인사이트 생성
- 데이터베이스 저장
- ✅ 완료

**1월 23일 오후 2시 (수동 실행)**
- 수동으로 API 호출
- 오늘 날짜: 2026-01-23
- 인사이트 확인 → 이미 존재
- ⏭️ 건너뜀 (중복 방지)

## ✨ 요약

- ✅ Cron Job 설정 완료
- ✅ API 엔드포인트 구현 완료
- ✅ 자동 생성 로직 구현 완료
- ✅ 매일 오전 6시 (한국시간) 자동 실행
- ✅ 중복 생성 방지
- ✅ 에러 처리 및 로깅

**Vercel에 배포하면 매일 자동으로 인사이트가 생성됩니다!**
