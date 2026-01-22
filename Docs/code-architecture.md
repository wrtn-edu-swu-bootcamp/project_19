# AI 인사이트 캘린더 - 코드 아키텍처 설계

## 목표
Vercel에 배포 가능한 Next.js 기반 PWA로 AI 인사이트 캘린더를 구현하기 위한 완전한 기술 아키텍처 문서 작성

## 기술 스택 선택 (2026년 최신 안정화 버전)

### Frontend
- **Next.js 15.x** (2024년 10월 안정화)
  - App Router (Server Components 기본)
  - Turbopack 번들러 (10배 빠른 빌드)
  - Partial Prerendering (PPR) 지원
- **React 19** (2024년 12월 안정화)
  - Server Actions
  - useActionState, useOptimistic, useFormStatus 훅
  - React Compiler 자동 최적화
- **TypeScript 5.9.x** (최신 안정화)
- **Tailwind CSS 4.1** (2025년 4월)
  - CSS-first 설정
  - 100배 빠른 증분 빌드
  - P3 컬러 팔레트

### 상태 관리
- **Zustand 5.0** (React 19 최적화)
  - 클라이언트 전역 상태 (북마크, 테마 등)
  - 1.16KB 경량
- **TanStack Query v5** (React Query)
  - 서버 데이터 캐싱 및 동기화

### PWA & 오프라인
- **next-pwa** (Next.js 15 호환)
- Service Worker 자동 생성
- 오프라인 캐싱 전략

### 데이터베이스
- **Supabase PostgreSQL**
  - 무료 티어: 무제한 API 요청, 50K MAU
  - 실시간 구독, 인증, 스토리지 통합
  - Vercel보다 4-5배 저렴

### AI & 데이터 수집
- **OpenAI GPT-4o** (또는 Claude 3.5 Sonnet)
  - 인사이트 생성 LLM
- **Cheerio** - HTML 파싱
- **Axios** - HTTP 요청
- **RSS Parser** - 뉴스레터 피드

### 배포 & 인프라
- **Vercel** (서버리스 호스팅)
- **Vercel Cron Jobs** (일일 AI 생성 스케줄링)
- **Vercel Edge Functions** (글로벌 저지연)

## 프로젝트 구조

```
PROJECT/
├── app/                        # Next.js 15 App Router
│   ├── (home)/                 # 홈 그룹 라우트
│   │   ├── page.tsx            # 메인 캘린더 페이지
│   │   └── layout.tsx          # 레이아웃
│   ├── insight/
│   │   └── [date]/
│   │       └── page.tsx        # 인사이트 상세 페이지
│   ├── bookmarks/
│   │   └── page.tsx            # 북마크 페이지
│   ├── api/                    # API Routes
│   │   ├── insights/
│   │   │   ├── generate/       # AI 생성 Cron
│   │   │   ├── [date]/         # 날짜별 조회
│   │   │   └── route.ts
│   │   ├── feedback/
│   │   │   └── route.ts        # 피드백 제출
│   │   └── notes/
│   │       └── route.ts        # 노트 CRUD
│   ├── manifest.ts             # PWA Manifest
│   ├── layout.tsx              # 루트 레이아웃
│   └── globals.css             # Tailwind 진입점
├── components/                 # React 컴포넌트
│   ├── calendar/
│   │   ├── Calendar.tsx        # 메인 캘린더
│   │   └── CalendarCell.tsx    # 날짜 셀
│   ├── insight/
│   │   ├── InsightPreview.tsx  # 바텀 시트
│   │   ├── InsightDetail.tsx   # 상세 뷰
│   │   └── FeedbackPopup.tsx   # 피드백 모달
│   ├── note/
│   │   └── NoteEditor.tsx      # 노트 입력기
│   └── ui/                     # 재사용 UI 컴포넌트
│       ├── BottomSheet.tsx
│       ├── Modal.tsx
│       └── Button.tsx
├── lib/                        # 유틸리티 & 로직
│   ├── ai/
│   │   ├── openai.ts           # OpenAI 클라이언트
│   │   ├── prompts.ts          # 프롬프트 템플릿
│   │   └── generate-insight.ts # 인사이트 생성 로직
│   ├── data-collection/
│   │   ├── google-trends.ts    # Google Trends API
│   │   ├── news-api.ts         # 뉴스 수집
│   │   ├── rss-parser.ts       # RSS 피드
│   │   └── scraper.ts          # 웹 스크래핑
│   ├── db/
│   │   ├── supabase.ts         # Supabase 클라이언트
│   │   └── queries.ts          # DB 쿼리 함수
│   ├── storage/
│   │   └── local-storage.ts    # 로컬 스토리지 헬퍼
│   └── utils/
│       ├── date.ts             # 날짜 유틸
│       └── validation.ts       # 검증 로직
├── stores/                     # Zustand 스토어
│   ├── bookmark-store.ts       # 북마크 상태
│   ├── theme-store.ts          # 다크모드 상태
│   └── language-store.ts       # 언어 설정
├── types/                      # TypeScript 타입
│   ├── insight.ts
│   ├── note.ts
│   └── api.ts
├── public/                     # 정적 파일
│   ├── icons/                  # PWA 아이콘
│   ├── sw.js                   # Service Worker
│   └── offline.html            # 오프라인 폴백
├── scripts/                    # 스크립트
│   └── generate-icons.js       # PWA 아이콘 생성
├── supabase/                   # Supabase 설정
│   └── migrations/             # DB 마이그레이션
├── .env.local                  # 환경 변수
├── next.config.ts              # Next.js 설정
├── tailwind.config.ts          # Tailwind 설정
├── tsconfig.json               # TypeScript 설정
├── package.json
└── vercel.json                 # Vercel 배포 설정
```

## 데이터베이스 스키마 (Supabase)

```sql
-- insights 테이블
CREATE TABLE insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE UNIQUE NOT NULL,
  insight_text TEXT NOT NULL,
  keywords JSONB NOT NULL,
  context TEXT NOT NULL,
  question TEXT NOT NULL,
  positive_feedback INT DEFAULT 0,
  negative_feedback INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- notes 테이블 (로컬 우선, 선택적 동기화)
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  user_id TEXT NOT NULL, -- 익명 세션 ID
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date, user_id)
);

-- feedback 테이블
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  insight_id UUID REFERENCES insights(id),
  feedback_type TEXT CHECK(feedback_type IN ('positive', 'negative')),
  user_id TEXT, -- 익명
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- data_sources 테이블 (AI 생성 소스 추적)
CREATE TABLE data_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  source_type TEXT, -- 'google_trends', 'news', 'reddit', etc.
  raw_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 핵심 기능 구현 계획

### 1. AI 인사이트 자동 생성 파이프라인
- Vercel Cron (매일 오전 6:00 KST)
- 데이터 수집 → AI 분석 → 품질 검증 → DB 저장
- 실패 시 자동 재시도 (최대 3회)

### 2. PWA 설정
- manifest.ts: 홈 화면 추가, 아이콘, 테마 설정
- Service Worker: 오프라인 캐싱, Push 알림
- Runtime caching: 폰트, 이미지, API 응답

### 3. 반응형 레이아웃
- Mobile-first (375px)
- Tablet (768px)
- Desktop (1024px+, 2컬럼)

### 4. 다크모드 & 언어 전환
- Tailwind dark: 클래스 기반
- Zustand로 전역 상태 관리
- 로컬 스토리지 지속성

### 5. 성능 최적화
- React Server Components (기본 SSR)
- Turbopack 빌드
- ISR (Incremental Static Regeneration)
- 이미지 최적화 (Next.js Image)

## 환경 변수 (.env.local)

```
# OpenAI
OPENAI_API_KEY=sk-...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Data Sources
GOOGLE_TRENDS_API_KEY=...
NEWS_API_KEY=...

# Vercel Cron 보안
CRON_SECRET=...
```

## 배포 설정 (vercel.json)

```json
{
  "crons": [
    {
      "path": "/api/insights/generate",
      "schedule": "0 21 * * *"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "regions": ["icn1"]
}
```

## 개발 워크플로우

1. **로컬 개발**
   ```bash
   npm install
   npm run dev
   ```

2. **타입 체크**
   ```bash
   npm run type-check
   ```

3. **빌드 & 배포**
   ```bash
   vercel --prod
   ```

4. **DB 마이그레이션**
   ```bash
   supabase db push
   ```

## 다음 단계

이 아키텍처 문서를 기반으로:
1. package.json 의존성 설정
2. 핵심 유틸리티 함수 작성
3. 컴포넌트 구현
4. API 라우트 개발
5. AI 파이프라인 구축
6. 배포 및 테스트
