export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export enum VideoSortField {
  CREATED_AT = 'created_at',
  TITLE = 'title',
  VIEWS = 'views',
  DURATION = 'duration'
}

export interface CreateVideoRequest {
  title: string;
  thumbnail_url: string;
  duration: number;
  views?: number;
  tags?: string[];
}

export interface GetVideosQueryParams {
  cursor?: string;
  limit?: number;
  sortBy?: VideoSortField;
  sortOrder?: SortOrder;
  filters?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  next_cursor: string | null;
  has_more: boolean;
  cursor_version: number;
}


export interface VideoWithTags {
  id: string;
  title: string;
  thumbnail_url: string;
  duration: number;
  views: number;
  created_at: Date;
  tags: Array<{
    tag: {
      id: string;
      name: string;
    };
  }>;
}

export type GetVideosResponse = PaginatedResponse<VideoWithTags>;
