-- =============================================
-- AI Insight Calendar - Database Schema
-- Vercel Postgres
-- =============================================

-- insights 테이블: AI가 생성한 일일 인사이트
CREATE TABLE IF NOT EXISTS insights (
  id SERIAL PRIMARY KEY,
  date DATE UNIQUE NOT NULL,
  insight_text TEXT NOT NULL,
  keywords JSONB NOT NULL DEFAULT '[]',
  context TEXT,
  question TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- notes 테이블: 사용자 노트/메모
CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  insight_date DATE NOT NULL,
  user_id TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(insight_date, user_id)
);

-- 인덱스: 조회 성능 최적화
CREATE INDEX IF NOT EXISTS idx_insights_date ON insights(date);
CREATE INDEX IF NOT EXISTS idx_notes_user_date ON notes(user_id, insight_date);

-- =============================================
-- 실행 방법:
-- 1. Vercel Dashboard → Storage → Postgres 선택
-- 2. Query 탭으로 이동
-- 3. 위 SQL을 복사하여 실행
-- =============================================
