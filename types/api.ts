/**
 * API Types
 * Request/Response types for API routes
 */

// Generic API response wrapper
export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
};

// Paginated response
export type PaginatedResponse<T> = ApiResponse<T> & {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
  };
};

// Feedback types
export type FeedbackType = 'positive' | 'negative';

export type FeedbackRequest = {
  insight_id: string;
  feedback_type: FeedbackType;
  user_id: string;
};

export type FeedbackResponse = {
  success: boolean;
  positive_count: number;
  negative_count: number;
};

// Insight generation (AI pipeline)
export type GenerateInsightRequest = {
  date: string;
  retry_count?: number;
};

export type GenerateInsightResponse = {
  success: boolean;
  insight_id: string | null;
  message: string;
};

// Error types
export type ApiErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMIT_EXCEEDED'
  | 'INTERNAL_ERROR'
  | 'AI_GENERATION_FAILED'
  | 'DATABASE_ERROR';

export type ApiError = {
  code: ApiErrorCode;
  message: string;
  details?: unknown;
};

// Bookmark types
export type BookmarkRequest = {
  insight_id: string;
  user_id: string;
};

export type Bookmark = {
  id: string;
  insight_id: string;
  user_id: string;
  created_at: string;
};
