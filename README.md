# AI Insight Calendar

AI 기반 일일 마케팅 인사이트 캘린더 서비스

## 🚀 빠른 시작

### 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```bash
# Google Gemini API (필수)
GEMINI_API_KEY=your-gemini-api-key

# Vercel Postgres (배포 시 자동 설정됨)
DATABASE_URL=postgres://...

# Cron Job 인증 (프로덕션 필수)
CRON_SECRET=your-random-secret-string
```

## 📅 자동 인사이트 생성 설정

이 프로젝트는 **매일 자동으로** 새로운 인사이트를 생성하도록 설정되어 있습니다.

### 작동 방식

1. **Vercel Cron Job**이 매일 UTC 21:00 (한국시간 오전 6시)에 `/api/insights/generate` 엔드포인트를 호출합니다.
2. API는 오늘 날짜의 인사이트가 이미 있는지 확인합니다.
3. 없으면 Google Gemini AI를 사용하여 새로운 인사이트를 생성하고 데이터베이스에 저장합니다.

### 설정 확인

`vercel.json` 파일에 Cron Job이 설정되어 있습니다:

```json
{
  "crons": [
    {
      "path": "/api/insights/generate",
      "schedule": "0 21 * * *"  // 매일 UTC 21:00 = KST 06:00
    }
  ]
}
```

## 🚢 Vercel 배포 가이드

### 1. Vercel에 프로젝트 연결

```bash
# Vercel CLI 설치 (선택사항)
npm i -g vercel

# 프로젝트 배포
vercel --prod
```

또는 [Vercel Dashboard](https://vercel.com)에서 GitHub 저장소를 연결하세요.

### 2. 환경 변수 설정 (Vercel Dashboard)

Vercel 프로젝트 설정 → Environment Variables에서 다음 변수들을 추가하세요:

| 변수명 | 설명 | 필수 |
|--------|------|------|
| `GEMINI_API_KEY` | Google AI Studio에서 발급받은 API 키 | ✅ |
| `CRON_SECRET` | Cron Job 인증용 랜덤 문자열 | ✅ |
| `DATABASE_URL` | Vercel Postgres 연결 시 자동 설정됨 | ✅ |

**CRON_SECRET 생성 방법:**
```bash
# 터미널에서 실행
openssl rand -hex 32
```

### 3. Vercel Postgres 설정

1. Vercel Dashboard → Storage → Create Database → Postgres 선택
2. 데이터베이스 생성 후 프로젝트에 연결
3. `DATABASE_URL` 환경 변수가 자동으로 추가됩니다
4. 데이터베이스 스키마 실행:
   - Storage → Postgres → Query 탭
   - `supabase/migrations/001_initial_schema.sql` 파일의 내용을 복사하여 실행

### 4. Cron Job 활성화 확인

배포 후 Vercel Dashboard → Settings → Cron Jobs에서 다음이 활성화되어 있는지 확인하세요:

- **Path**: `/api/insights/generate`
- **Schedule**: `0 21 * * *` (매일 UTC 21:00)
- **Status**: Active

### 5. 수동 실행 (테스트용)

프로덕션에서 수동으로 인사이트를 생성하려면:

```bash
curl -X POST https://your-domain.vercel.app/api/insights/generate \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## 🧪 로컬에서 테스트

### 개발 환경에서 수동 생성

개발 서버 실행 중 (`npm run dev`):

```bash
# GET 요청 (테스트용, 저장 안 됨)
curl http://localhost:3000/api/insights/generate

# POST 요청 (실제 저장)
curl -X POST http://localhost:3000/api/insights/generate
```

개발 환경에서는 인증이 필요 없습니다.

## 📊 Cron Job 모니터링

Vercel Dashboard → Logs에서 Cron Job 실행 로그를 확인할 수 있습니다:

- 성공: `Insight generated successfully`
- 이미 존재: `Insight already exists for today`
- 실패: 에러 메시지 확인

## 🔧 문제 해결

### 인사이트가 생성되지 않는 경우

1. **환경 변수 확인**
   - Vercel Dashboard에서 `GEMINI_API_KEY`, `CRON_SECRET`, `DATABASE_URL` 확인
   
2. **Cron Job 상태 확인**
   - Vercel Dashboard → Settings → Cron Jobs에서 활성화 여부 확인
   
3. **로그 확인**
   - Vercel Dashboard → Logs에서 에러 메시지 확인
   
4. **수동 실행 테스트**
   ```bash
   curl -X POST https://your-domain.vercel.app/api/insights/generate \
     -H "Authorization: Bearer YOUR_CRON_SECRET"
   ```

### 데이터베이스 연결 오류

- Vercel Postgres가 프로젝트에 연결되어 있는지 확인
- `DATABASE_URL` 환경 변수가 설정되어 있는지 확인
- 데이터베이스 스키마가 실행되었는지 확인

## 📝 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 4.1
- **Database**: Vercel Postgres
- **AI**: Google Gemini 2.0 Flash
- **Deployment**: Vercel
- **Cron Jobs**: Vercel Cron

## 📄 라이선스

MIT
