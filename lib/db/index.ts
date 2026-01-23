/**
 * Database Helper Functions
 * Vercel Postgres client and query utilities
 * 
 * 로컬 개발 환경에서 DB 연결이 없을 경우 샘플 데이터를 사용합니다.
 */

import type { Insight, InsightInsert, InsightCalendarItem } from '@/types/insight';
import type { Note, NoteInsert } from '@/types/note';

// DB 연결이 있을 때만 sql 객체 import (초기화 오류 방지)
let sql: any = null;

// Lazy import를 위한 함수
function getSql() {
  if (sql !== null) {
    return sql;
  }
  
  if (!hasDbConnection()) {
    return null;
  }
  
  try {
    // 동적 import로 오류 방지
    const postgres = require('@vercel/postgres');
    sql = postgres.sql;
    return sql;
  } catch (error) {
    console.warn('[DB] @vercel/postgres 초기화 실패, Mock 모드로 작동합니다:', error);
    sql = false; // 재시도 방지
    return null;
  }
}

// =============================================
// Mock Data for Development (DB 연결 없을 때 사용)
// =============================================

// Mock 데이터를 동적으로 생성하는 함수
function getMockInsights(): Insight[] {
  return [
  {
    id: 1,
    date: getTodayString(),
    insight_text: "요즘 브랜드는 혜택보다 선택 이유를 설계한다",
    keywords: [
      { keyword: "브랜드 스토리텔링", description: "단순한 제품 기능을 넘어 가치로 전달" },
      { keyword: "선택 피로감", description: "명확한 이유가 많은 옵션보다 중요함" },
      { keyword: "가치 기반 소비", description: "Z세대는 가격에서 의미로 전환 중" }
    ],
    context: "최근 소비자들은 제품 기능이나 할인보다 '왜 이 브랜드를 선택해야 하는가'에 더 민감하게 반응합니다. 특히 Z세대는 브랜드의 가치관과 자신의 정체성이 일치하는지를 중요하게 생각합니다.",
    question: "우리 브랜드가 제공하는 선택 이유는 명확한가? 고객에게 어떤 가치를 전달하고 있는가?",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    date: getDateString(-1),
    insight_text: "Z세대는 광고를 콘텐츠로 소비한다",
    keywords: [
      { keyword: "광고 네이티브", description: "광고와 콘텐츠의 경계가 흐려짐" },
      { keyword: "숏폼 크리에이티브", description: "15초 안에 브랜드 메시지 전달" },
      { keyword: "밈 마케팅", description: "공유 가능한 형태의 브랜드 커뮤니케이션" }
    ],
    context: "Z세대에게 광고는 더 이상 '스킵해야 할 것'이 아닙니다. 재미있고 공유할 만한 광고는 오히려 적극적으로 찾아보고 친구들과 나눕니다. 이는 광고의 형식보다 콘텐츠의 질이 중요해졌음을 의미합니다.",
    question: "우리 브랜드의 광고는 사람들이 자발적으로 공유하고 싶어하는가?",
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    date: getDateString(-2),
    insight_text: "짧은 영상이 길어지고, 긴 글이 짧아진다",
    keywords: [
      { keyword: "콘텐츠 역설", description: "숏폼 플랫폼에서 롱폼 콘텐츠 수요 증가" },
      { keyword: "깊이 있는 숏폼", description: "짧지만 정보 밀도가 높은 콘텐츠" },
      { keyword: "스낵형 롱폼", description: "긴 콘텐츠도 쉽게 소비할 수 있게 구성" }
    ],
    context: "틱톡이 10분 영상을 지원하고, 유튜브 쇼츠가 3분으로 확장되는 등 플랫폼들이 콘텐츠 길이 제한을 완화하고 있습니다. 동시에 뉴스레터와 블로그는 더 짧고 임팩트 있게 변화하고 있습니다.",
    question: "우리 콘텐츠의 적정 길이는 무엇이며, 어떻게 밀도를 높일 수 있을까?",
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    date: getDateString(-3),
    insight_text: "개인화를 넘어 '맥락화'가 승부를 가른다",
    keywords: [
      { keyword: "상황 인식 마케팅", description: "고객의 현재 상황과 맥락을 파악" },
      { keyword: "마이크로 모먼트", description: "결정적 순간에 적절한 메시지 전달" },
      { keyword: "예측적 개인화", description: "필요를 미리 예측하여 제안" }
    ],
    context: "이름과 구매 이력 기반 개인화는 이제 기본입니다. 진정한 차별화는 고객이 '지금 무엇이 필요한지'를 상황과 맥락에서 파악하여 적절한 타이밍에 제안하는 것입니다.",
    question: "우리는 고객의 상황과 맥락을 얼마나 이해하고 활용하고 있는가?",
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    date: getDateString(-4),
    insight_text: "커뮤니티가 곧 브랜드다",
    keywords: [
      { keyword: "팬덤 이코노미", description: "열성 팬이 브랜드 성장을 주도" },
      { keyword: "사용자 생성 콘텐츠", description: "고객이 만드는 브랜드 스토리" },
      { keyword: "소속감 마케팅", description: "제품을 넘어 정체성과 연결" }
    ],
    context: "성공하는 브랜드들은 제품을 파는 것을 넘어 커뮤니티를 만들고 있습니다. 애플, 나이키, 레고처럼 고객들이 스스로 브랜드의 일부라고 느끼게 만드는 것이 핵심입니다.",
    question: "우리 브랜드 주변에 커뮤니티가 형성되어 있는가? 고객들이 소속감을 느끼는가?",
    created_at: new Date().toISOString(),
  },
  {
    id: 6,
    date: getDateString(-5),
    insight_text: "AI가 만들수록 '인간다움'이 프리미엄이 된다",
    keywords: [
      { keyword: "휴먼 터치", description: "AI 시대에 인간적 요소의 가치 상승" },
      { keyword: "진정성 마케팅", description: "완벽함보다 진실함이 신뢰를 얻음" },
      { keyword: "크래프트맨십", description: "수공예적 가치와 스토리의 중요성" }
    ],
    context: "AI가 콘텐츠를 대량 생산하면서 역설적으로 '인간이 만든 것'에 대한 가치가 높아지고 있습니다. 소비자들은 브랜드 뒤에 있는 사람들의 이야기와 진정성에 더 끌립니다.",
    question: "우리 브랜드에서 '인간다움'은 어떻게 표현되고 있는가?",
    created_at: new Date().toISOString(),
  },
  {
    id: 7,
    date: getDateString(-6),
    insight_text: "검색보다 발견이 구매를 이끈다",
    keywords: [
      { keyword: "디스커버리 커머스", description: "원하는 걸 몰랐는데 발견하는 쇼핑" },
      { keyword: "알고리즘 큐레이션", description: "AI가 취향을 파악해 제안" },
      { keyword: "세렌디피티 마케팅", description: "우연한 발견의 즐거움 설계" }
    ],
    context: "인스타그램 쇼핑, 틱톡 숍, 핀터레스트 등에서 '구경하다가 사는' 경험이 늘고 있습니다. 소비자들은 적극적으로 검색하기보다 피드를 스크롤하다 발견하는 것을 선호합니다.",
    question: "우리 제품이 고객에게 '발견'되는 순간을 어떻게 설계하고 있는가?",
    created_at: new Date().toISOString(),
  },
  ];
}

/**
 * KST(한국 표준시) 기준 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 */
function getTodayString(): string {
  const now = new Date();
  // KST는 UTC+9
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffset);
  
  const isoString = kstDate.toISOString();
  const datePart = isoString.split('T')[0];
  return datePart ?? isoString.slice(0, 10);
}

/**
 * KST 기준 N일 전/후 날짜 문자열
 */
function getDateString(daysOffset: number): string {
  const now = new Date();
  // KST는 UTC+9
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffset);
  kstDate.setDate(kstDate.getDate() + daysOffset);
  
  const isoString = kstDate.toISOString();
  const datePart = isoString.split('T')[0];
  return datePart ?? isoString.slice(0, 10);
}

// DB 연결 여부 확인
function hasDbConnection(): boolean {
  return !!(process.env.POSTGRES_URL || process.env.DATABASE_URL);
}

// =============================================
// Insight Queries
// =============================================

/**
 * 특정 날짜의 인사이트 조회
 */
export async function getInsightByDate(date: string): Promise<Insight | null> {
  // DB 연결이 없으면 Mock 데이터 사용
  if (!hasDbConnection()) {
    console.log('[DEV] Using mock data for getInsightByDate:', date);
    const insight = getMockInsights().find(i => i.date === date);
    return insight || null;
  }

  const dbSql = getSql();
  if (!dbSql) {
    throw new Error('Database connection not available');
  }
  
  const { rows } = await dbSql<Insight>`
    SELECT id, date, insight_text, keywords, context, question, created_at
    FROM insights
    WHERE date = ${date}
  `;
  
  const row = rows[0];
  if (!row) return null;
  
  return {
    id: row.id,
    date: formatDate(row.date),
    insight_text: row.insight_text,
    keywords: typeof row.keywords === 'string' 
      ? JSON.parse(row.keywords) 
      : row.keywords,
    context: row.context,
    question: row.question,
    created_at: row.created_at,
  };
}

/**
 * 인사이트 저장 (Upsert)
 */
export async function saveInsight(insight: InsightInsert): Promise<void> {
  // DB 연결이 없으면 콘솔에 로그만
  if (!hasDbConnection()) {
    console.log('[DEV] Would save insight:', insight);
    return;
  }

  const dbSql = getSql();
  if (!dbSql) {
    throw new Error('Database connection not available');
  }
  
  const keywordsJson = JSON.stringify(insight.keywords);
  
  await dbSql`
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
  // DB 연결이 없으면 Mock 데이터 사용
  if (!hasDbConnection()) {
    console.log('[DEV] Using mock data for getInsightsByMonth:', year, month);
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`;
    
    return getMockInsights()
      .filter(i => i.date >= startDate && i.date <= endDate)
      .map(i => ({
        date: i.date,
        insight_text: i.insight_text,
        hasInsight: true,
      }));
  }

  if (!sql) {
    throw new Error('Database connection not available');
  }
  
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
  // DB 연결이 없으면 Mock 데이터 사용
  if (!hasDbConnection()) {
    console.log('[DEV] Using mock data for getRecentInsights:', limit);
    return getMockInsights().slice(0, limit);
  }

  const dbSql = getSql();
  if (!dbSql) {
    throw new Error('Database connection not available');
  }
  
  const { rows } = await dbSql<Insight>`
    SELECT id, date, insight_text, keywords, context, question, created_at
    FROM insights
    ORDER BY date DESC
    LIMIT ${limit}
  `;
  
  return rows.map(row => ({
    id: row.id,
    date: formatDate(row.date),
    insight_text: row.insight_text,
    keywords: typeof row.keywords === 'string' 
      ? JSON.parse(row.keywords) 
      : row.keywords,
    context: row.context,
    question: row.question,
    created_at: row.created_at,
  }));
}

// =============================================
// Note Queries
// =============================================

// Mock Notes storage (개발용 메모리 저장소)
const mockNotes: Map<string, Note> = new Map();

/**
 * 특정 날짜와 사용자의 노트 조회
 */
export async function getNoteByDate(
  date: string,
  userId: string
): Promise<Note | null> {
  // DB 연결이 없으면 Mock 데이터 사용
  if (!hasDbConnection()) {
    const key = `${date}:${userId}`;
    console.log('[DEV] Getting note from memory:', key);
    return mockNotes.get(key) || null;
  }

  if (!sql) {
    throw new Error('Database connection not available');
  }
  
  const { rows } = await sql<Note>`
    SELECT id, insight_date, user_id, content, created_at, updated_at
    FROM notes
    WHERE insight_date = ${date} AND user_id = ${userId}
  `;
  
  const row = rows[0];
  if (!row) return null;
  
  return {
    id: row.id,
    insight_date: formatDate(row.insight_date),
    user_id: row.user_id,
    content: row.content,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

/**
 * 노트 저장 (Upsert)
 */
export async function saveNote(note: NoteInsert): Promise<Note> {
  // DB 연결이 없으면 Mock 저장
  if (!hasDbConnection()) {
    const key = `${note.insight_date}:${note.user_id}`;
    const now = new Date().toISOString();
    const existingNote = mockNotes.get(key);
    
    const savedNote: Note = {
      id: existingNote?.id || Math.floor(Math.random() * 10000),
      insight_date: note.insight_date,
      user_id: note.user_id,
      content: note.content,
      created_at: existingNote?.created_at || now,
      updated_at: now,
    };
    
    mockNotes.set(key, savedNote);
    console.log('[DEV] Saved note to memory:', key);
    return savedNote;
  }

  if (!sql) {
    throw new Error('Database connection not available');
  }
  
  const { rows } = await sql<Note>`
    INSERT INTO notes (insight_date, user_id, content, updated_at)
    VALUES (${note.insight_date}, ${note.user_id}, ${note.content}, NOW())
    ON CONFLICT (insight_date, user_id) DO UPDATE SET
      content = EXCLUDED.content,
      updated_at = NOW()
    RETURNING id, insight_date, user_id, content, created_at, updated_at
  `;
  
  const row = rows[0];
  if (!row) {
    throw new Error('Failed to save note');
  }
  
  return {
    id: row.id,
    insight_date: formatDate(row.insight_date),
    user_id: row.user_id,
    content: row.content,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

/**
 * 사용자의 모든 노트 조회
 */
export async function getNotesByUser(userId: string): Promise<Note[]> {
  // DB 연결이 없으면 Mock 데이터 사용
  if (!hasDbConnection()) {
    console.log('[DEV] Getting all notes from memory for user:', userId);
    return Array.from(mockNotes.values())
      .filter(note => note.user_id === userId)
      .sort((a, b) => b.insight_date.localeCompare(a.insight_date));
  }

  if (!sql) {
    throw new Error('Database connection not available');
  }
  
  const { rows } = await sql<Note>`
    SELECT id, insight_date, user_id, content, created_at, updated_at
    FROM notes
    WHERE user_id = ${userId}
    ORDER BY insight_date DESC
  `;
  
  return rows.map(row => ({
    id: row.id,
    insight_date: formatDate(row.insight_date),
    user_id: row.user_id,
    content: row.content,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));
}

/**
 * 노트 삭제
 */
export async function deleteNote(id: number): Promise<void> {
  // DB 연결이 없으면 Mock에서 삭제
  if (!hasDbConnection()) {
    for (const [key, note] of mockNotes.entries()) {
      if (note.id === id) {
        mockNotes.delete(key);
        console.log('[DEV] Deleted note from memory:', key);
        return;
      }
    }
    return;
  }

  const dbSql = getSql();
  if (!dbSql) {
    throw new Error('Database connection not available');
  }
  
  await dbSql`DELETE FROM notes WHERE id = ${id}`;
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
    const parts = date.split('T');
    return parts[0] ?? date.slice(0, 10);
  }
  return date.toISOString().slice(0, 10);
}

/**
 * DB 연결 테스트
 */
export async function testConnection(): Promise<boolean> {
  // DB 연결이 없으면 Mock 모드로 작동
  if (!hasDbConnection()) {
    console.log('[DEV] Running in mock mode (no DB connection)');
    return true;
  }

  const dbSql = getSql();
  if (!dbSql) {
    return false;
  }
  
  try {
    await dbSql`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

/**
 * 현재 Mock 모드인지 확인
 */
export function isMockMode(): boolean {
  return !hasDbConnection();
}
