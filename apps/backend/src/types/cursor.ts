export interface CursorData {
  last_created_at?: string;
  last_title?: string;
  last_views?: number;
  last_duration?: number;
  last_id: string;
  filters_hash?: string;
  issued_at: number;
}

export interface DecodedCursor extends CursorData {
  cursor_version: number;
}
