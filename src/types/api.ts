// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  code?: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface Notification {
  id: string;
  type: 'reservation' | 'stock_alert' | 'refill_reminder' | 'general';
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  meta?: Record<string, string>;
}
