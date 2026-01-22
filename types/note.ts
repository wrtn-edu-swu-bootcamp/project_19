/**
 * Note Types
 * User notes and reflections for insights
 */

export type Note = {
  id: number; // PostgreSQL SERIAL
  insight_date: string; // ISO 8601 format (YYYY-MM-DD)
  user_id: string; // Anonymous session ID
  content: string | null;
  created_at: string;
  updated_at: string;
};

// For local storage (before server sync)
export type LocalNote = {
  insight_date: string;
  content: string;
  last_saved: string; // Auto-save timestamp
  synced: boolean; // Server sync status
};

// Database insert type
export type NoteInsert = {
  insight_date: string;
  user_id: string;
  content: string | null;
};

// Database update type
export type NoteUpdate = Partial<Pick<Note, 'content'>>;

// Note with sync status for UI
export type NoteWithStatus = Note & {
  isSyncing: boolean;
  syncError: string | null;
};
