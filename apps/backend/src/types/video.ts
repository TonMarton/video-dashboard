export interface CreateVideoRequest {
  title: string;
  thumbnail_url: string;
  duration: number;
  views?: number;
  tags?: string[];
}
