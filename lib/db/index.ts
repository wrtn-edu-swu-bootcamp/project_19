/**
 * Database Helper Functions
 * Vercel Postgres client and query utilities
 */

import { sql } from '@vercel/postgres';
import type { Insight, InsightInsert, InsightCalendarItem } from '@/types/insight';
import type { Note, NoteInsert } from '@/types/note';

// =============================================
// Insight Queries
// =============================================

/**
 * 특정 날짜의 인사이트 조회
 */
export async function getInsightByDate(date: string): Promise<Insight | null> {
  const { rows } = await sql<Insight>`
    SELECT id, date, insight_text, keywords, context, question, created_at
    FROM insights
    WHERE date = ${date}
  `;
  
  if (rows.length === 0) return null;
  
  return {
    ...rows[0],
    date: formatDate(rows[0].date),
    keywords: typeof rows[0].keywords === 'string' 
      ? JSON.parse(rows[0].keywords) 
      : rows[0].keywords,
  };
}

/**
 * 인사이트 저장 (Upsert)
 */
export async function saveInsight(insight: InsightInsert): Promise<void> {
  const keywordsJson = JSON.stringify(insight.keywords);
  
  await sql`
    INSERT INTO insights (date, insight_text, keywords, context, question)
    VALUES (${insight.date}, ${insight.insight_text}, ${keywordsJson}::jsonb, ${insight.context}, ${insight.question})
    ON CONFLICT (date) DO UPDATE SET
      insight_text = EXCLUDED.insight_text,
      keywords = EXCLUDED.keywords,
      context = EXCLUDED.context,
      question = EXCLUDED.question
  `;
}

/**
 * 월별 인사이트 목록 조회 (캘린더용)
 */
export async function getInsightsByMonth(
  year: number,
  month: number
): Promise<InsightCalendarItem[]> {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month).padStart(2, '0')}-31`;
  
  const { rows } = await sql<Pick<Insight, 'date' | 'insight_text'>>`
    SELECT date, insight_text
    FROM insights
    WHERE date >= ${startDate} AND date <= ${endDate}
    ORDER BY date ASC
  `;
  
  return rows.map(row => ({
    date: formatDate(row.date),
    insight_text: row.insight_text,
    hasInsight: true,
  }));
}

/**
 * 최근 인사이트 조회
 */
export async function getRecentInsights(limit: number = 7): Promise<Insight[]> {
  const { rows } = await sql<Insight>`
    SELECT id, date, insight_text, keywords, context, question, created_at
    FROM insights
    ORDER BY date DESC
    LIMIT ${limit}
  `;
  
  return rows.map(row => ({
    ...row,
    date: formatDate(row.date),
    keywords: typeof row.keywords === 'string' 
      ? JSON.parse(row.keywords) 
      : row.keywords,
  }));
}

// =============================================
// Note Queries
// =============================================

/**
 * 특정 날짜와 사용자의 노트 조회
 */
export async function getNoteByDate(
  date: string,
  userId: string
): Promise<Note | null> {
  const { rows } = await sql<Note>`
    SELECT id, insight_date, user_id, content, created_at, updated_at
    FROM notes
    WHERE insight_date = ${date} AND user_id = ${userId}
  `;
  
  if (rows.length === 0) return null;
  
  return {
    ...rows[0],
    insight_date: formatDate(rows[0].insight_date),
  };
}

/**
 * 노트 저장 (Upsert)
 */
export async function saveNote(note: NoteInsert): Promise<Note> {
  const { rows } = await sql<Note>`
    INSERT INTO notes (insight_date, user_id, content, updated_at)
    VALUES (${note.insight_date}, ${note.user_id}, ${note.content}, NOW())
    ON CONFLICT (insight_date, user_id) DO UPDATE SET
      content = EXCLUDED.content,
      updated_at = NOW()
    RETURNING id, insight_date, user_id, content, created_at, updated_at
  `;
  
  return {
    ...rows[0],
    insight_date: formatDate(rows[0].insight_date),
  };
}

/**
 * 사용자의 모든 노트 조회
 */
export async function getNotesByUser(userId: string): Promise<Note[]> {
  const { rows } = await sql<Note>`
    SELECT id, insight_date, user_id, content, created_at, updated_at
    FROM notes
    WHERE user_id = ${userId}
    ORDER BY insight_date DESC
  `;
  
  return rows.map(row => ({
    ...row,
    insight_date: formatDate(row.insight_date),
  }));
}

/**
 * 노트 삭제
 */
export async function deleteNote(id: number): Promise<void> {
  await sql`DELETE FROM notes WHERE id = ${id}`;
}

// =============================================
// Utility Functions
// =============================================

/**
 * Date 객체를 YYYY-MM-DD 형식으로 변환
 */
function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    // 이미 문자열이면 날짜 부분만 추출
    return date.split('T')[0];
  }
  return date.toISOString().split('T')[0];
}

/**
 * DB 연결 테스트
 */
export async function testConnection(): Promise<boolean> {
  try {
    await sql`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}
