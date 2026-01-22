/**
 * Insight Types
 * Core data types for AI-generated marketing insights
 */

export type InsightKeyword = {
  keyword: string;
  description: string;
};

export type Insight = {
  id: number; // PostgreSQL SERIAL
  date: string; // ISO 8601 format (YYYY-MM-DD)
  insight_text: string;
  keywords: InsightKeyword[];
  context: string; // "Why it matters" section
  question: string; // Practical question for reflection
  created_at: string;
};

// For list display (lighter payload)
export type InsightPreview = Pick<Insight, 'id' | 'date' | 'insight_text' | 'keywords'>;

// For calendar cell display (minimal)
export type InsightCalendarItem = Pick<Insight, 'date' | 'insight_text'> & {
  hasInsight: boolean;
};

// Database insert type (without auto-generated fields)
export type InsightInsert = Omit<Insight, 'id' | 'created_at'>;

// Database update type
export type InsightUpdate = Partial<Omit<Insight, 'id' | 'date' | 'created_at'>>;
