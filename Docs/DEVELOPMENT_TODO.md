# AI 인사이트 캘린더 개발 체크리스트 (간소화 버전)

> 마지막 업데이트: 2026-01-22  
> 변경사항: Supabase → Vercel Postgres, OpenAI → Gemini AI

---

## Phase 1: 프로젝트 초기 설정 ✅ 완료

### 1-1. Next.js 프로젝트 설정
- [x] package.json 의존성 확인 (Vercel Postgres + Gemini로 업데이트)
- [x] npm install 실행
- [x] 폴더 구조 생성
- [x] next.config.ts 설정
- [ ] .env.local 환경변수 생성 (로컬에서 직접 설정 필요)

```bash
# .env.local 템플릿
DATABASE_URL="postgres://..."           # Vercel Postgres
GEMINI_API_KEY="..."                    # Google AI Studio
CRON_SECRET="..."                       # Vercel Cron 인증
```

### 1-2. Tailwind CSS 설정
- [x] app/globals.css 생성 (다크/라이트 모드 포함)

### 1-3. TypeScript 타입 정의
- [x] types/insight.ts (Insight 타입 - Vercel Postgres용으로 수정됨)
- [x] types/note.ts (Note 타입)

---

## Phase 2: 데이터베이스 설정 (Vercel Postgres)

### 2-1. Vercel Postgres 연결
- [ ] Vercel Dashboard → Storage → Create Database → Postgres
- [ ] 프로젝트에 연결 (자동으로 DATABASE_URL 환경변수 추가됨)
- [x] `npm install @vercel/postgres` 설치

### 2-2. 스키마 생성
- [x] lib/db/schema.sql 작성

```sql
-- Vercel Postgres SQL Editor에서 실행
CREATE TABLE insights (
  id SERIAL PRIMARY KEY,
  date DATE UNIQUE NOT NULL,
  insight_text TEXT NOT NULL,
  keywords JSONB NOT NULL DEFAULT '[]',
  context TEXT,
  question TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  insight_date DATE NOT NULL,
  user_id TEXT NOT NULL,
  content TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_insights_date ON insights(date);
CREATE INDEX idx_notes_user_date ON notes(user_id, insight_date);
```

### 2-3. DB 헬퍼 함수
- [x] lib/db/index.ts 생성

```typescript
import { sql } from '@vercel/postgres';

export async function getInsightByDate(date: string) {
  const { rows } = await sql`
    SELECT * FROM insights WHERE date = ${date}
  `;
  return rows[0] || null;
}

export async function saveInsight(insight: Insight) {
  await sql`
    INSERT INTO insights (date, insight_text, keywords, context, question)
    VALUES (${insight.date}, ${insight.insight_text}, ${JSON.stringify(insight.keywords)}, ${insight.context}, ${insight.question})
    ON CONFLICT (date) DO UPDATE SET
      insight_text = ${insight.insight_text},
      keywords = ${JSON.stringify(insight.keywords)},
      context = ${insight.context},
      question = ${insight.question}
  `;
}
```

---

## Phase 3: AI 인사이트 생성 (Gemini)

### 3-1. Gemini 클라이언트 설정
- [ ] Google AI Studio에서 API 키 발급 (https://aistudio.google.com)
- [x] `npm install @google/generative-ai` 설치
- [ ] lib/ai/gemini.ts 생성

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateInsight(date: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  
  const prompt = `오늘 날짜: ${date}
마케터를 위한 트렌드 인사이트 1개를 생성해주세요.

조건:
1. 최근 2주 내 실제 트렌드 기반
2. 구체적이고 실용적
3. 주니어 마케터가 바로 활용 가능

JSON 형식으로 응답:
{
  "insight_text": "핵심 인사이트 (1-2문장)",
  "keywords": [{"keyword": "키워드1", "description": "설명"}],
  "context": "왜 지금 중요한지 배경 설명",
  "question": "마케터가 생각해볼 질문"
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  
  // JSON 파싱
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Invalid response format');
  
  return JSON.parse(jsonMatch[0]);
}
```

### 3-2. Cron API 라우트
- [ ] app/api/insights/generate/route.ts 생성

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { generateInsight } from '@/lib/ai/gemini';
import { saveInsight } from '@/lib/db';

export async function POST(request: NextRequest) {
  // Cron 인증
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const today = new Date().toISOString().split('T')[0];
  const insight = await generateInsight(today);
  await saveInsight({ ...insight, date: today });

  return NextResponse.json({ success: true, date: today });
}
```

---

## Phase 4: UI 컴포넌트 (최소 필수) ✅ 완료

### 4-1. 기본 컴포넌트
- [x] components/ui/Button.tsx
- [x] components/ui/BottomSheet.tsx (모바일 인사이트 프리뷰)

### 4-2. 캘린더
- [x] components/calendar/Calendar.tsx (월간 뷰)
- [x] components/calendar/CalendarCell.tsx (날짜 셀)

### 4-3. 인사이트
- [x] components/insight/InsightPreview.tsx (바텀시트 내용)
- [x] components/insight/InsightDetail.tsx (상세 페이지)

### 4-4. 노트
- [x] components/note/NoteEditor.tsx (자동저장 textarea)

---

## Phase 5: 페이지 개발 ✅ 완료

### 5-1. 메인 페이지
- [x] app/(home)/page.tsx - 캘린더 표시
- [x] 날짜 클릭 시 바텀시트로 인사이트 프리뷰
- [x] components/home/HomeClient.tsx - 클라이언트 상태 관리
- [x] app/api/insights/[date]/route.ts - 인사이트 조회 API

### 5-2. 인사이트 상세
- [x] app/insight/[date]/page.tsx
- [x] 인사이트 전체 내용 + 노트 에디터
- [x] components/insight/InsightHeader.tsx - 뒤로가기 헤더

### 5-3. 레이아웃
- [x] app/layout.tsx - 메타데이터, 폰트, 다크모드 (Phase 1에서 완료)

---

## Phase 6: 상태 관리 (Zustand) ✅ 완료

- [x] stores/bookmark-store.ts (북마크 저장, localStorage persist)
- [x] stores/theme-store.ts (다크/라이트 모드)
- [x] stores/index.ts (Store export 통합)
- [x] components/providers/ThemeProvider.tsx (테마 적용 Provider)
- [x] components/ui/BookmarkButton.tsx (북마크 토글 버튼)
- [x] components/ui/ThemeToggle.tsx (테마 전환 UI)
- [x] globals.css 수정 (.dark 클래스 기반 다크모드 지원)
- [x] layout.tsx 수정 (ThemeProvider 적용)
- [x] InsightPreview.tsx에 북마크 버튼 추가
- [x] InsightDetail.tsx에 북마크 버튼 추가

---

## Phase 7: 배포 (Vercel)

### 7-1. Vercel 설정
- [ ] vercel.json 생성

```json
{
  "crons": [{
    "path": "/api/insights/generate",
    "schedule": "0 21 * * *"
  }]
}
```

### 7-2. 환경변수 설정 (Vercel Dashboard)
- [ ] DATABASE_URL (Postgres 연결 시 자동 추가)
- [ ] GEMINI_API_KEY
- [ ] CRON_SECRET

### 7-3. 배포
- [ ] `vercel --prod` 실행
- [ ] Cron Job 작동 확인

---

## 진행 상황

### 완료율
**36 / 45 항목 완료 (80%)**

### 핵심 의존성
```json
{
  "@vercel/postgres": "latest",
  "@google/generative-ai": "latest",
  "zustand": "^5.0.0"
}
```

---

## 간소화 변경 사항

| 기존 | 변경 | 이유 |
|------|------|------|
| Supabase | Vercel Postgres | Vercel 통합으로 설정 간소화 |
| OpenAI GPT-4o | Gemini 2.5 Flash | 무료 티어 제공, 빠른 응답 |
| 10개 Phase | 7개 Phase | 불필요한 단계 통합 |
| 100+ 항목 | 35 항목 | MVP에 집중 |
| PWA + Service Worker | 기본 웹앱 | 1차 배포 후 추가 |
| 다국어 지원 | 한글만 | MVP 스코프 축소 |

---

## 빠른 시작 가이드

```bash
# 1. 의존성 설치
npm install @vercel/postgres @google/generative-ai zustand

# 2. Vercel Postgres 연결
# Vercel Dashboard → Storage → Postgres → Connect to Project

# 3. 환경변수 설정 (.env.local)
DATABASE_URL="postgres://..."
GEMINI_API_KEY="your-gemini-key"
CRON_SECRET="your-random-secret"

# 4. DB 스키마 실행
# Vercel Dashboard → Storage → Postgres → Query → 위의 SQL 실행

# 5. 개발 서버 시작
npm run dev
```
