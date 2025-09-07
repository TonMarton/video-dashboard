import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { CursorData } from '../types/cursor';

class CursorService {
  private static readonly CURSOR_VERSION = 1;

  encodeCursor(data: CursorData): string {
    const cursorData = {
      ...data,
      cursor_version: CursorService.CURSOR_VERSION,
    };
    const jsonString = JSON.stringify(cursorData);
    return Buffer.from(jsonString).toString('base64');
  }

  decodeCursor(cursor: string): CursorData {
    try {
      const jsonString = Buffer.from(cursor, 'base64').toString('utf-8');
      const data = JSON.parse(jsonString);

      if (data.cursor_version !== CursorService.CURSOR_VERSION) {
        throw new Error('Invalid cursor version');
      }

      return data;
    } catch (error) {
      throw new Error('Invalid cursor format');
    }
  }

  createFiltersHash(filters?: string): string {
    if (!filters) return '';
    return crypto
      .createHash('md5')
      .update(filters)
      .digest('hex')
      .substring(0, 8);
  }

  createCursorFromVideo(
    video: any,
    sortBy: string,
    filtersHash?: string
  ): string {
    const cursorData: CursorData = {
      last_id: video.id,
      filters_hash: filtersHash,
      issued_at: Math.floor(Date.now() / 1000),
    };

    switch (sortBy) {
      case 'created_at':
        cursorData.last_created_at = video.created_at.toISOString();
        break;
      case 'title':
        cursorData.last_title = video.title;
        break;
      case 'views':
        cursorData.last_views = video.views;
        break;
      case 'duration':
        cursorData.last_duration = video.duration;
        break;
    }

    return this.encodeCursor(cursorData);
  }
}

const cursorService = new CursorService();

export const decodeCursor = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response<any, Record<string, any>> => {
  if (req.query.cursor) {
    try {
      res.locals.decodedCursor = cursorService.decodeCursor(
        req.query.cursor as string
      );
    } catch (error) {
      return res.status(400).json({
        error: 'Invalid cursor',
        details: ['The provided cursor is malformed or expired'],
      });
    }
  }
  next();
};

export const encodeCursor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = res.locals.responseData || {};
  const limit = parseInt((req.query.limit as string) || '30');

  if (
    data &&
    data.items &&
    Array.isArray(data.items) &&
    data.items.length > 0
  ) {
    const hasMore = data.items.length === limit;

    if (hasMore) {
      const lastItem = data.items[data.items.length - 1];
      const sortBy = (req.query.sortBy as string) || 'created_at';
      const filtersHash = cursorService.createFiltersHash(
        req.query.filters as string
      );

      data.next_cursor = cursorService.createCursorFromVideo(
        lastItem,
        sortBy,
        filtersHash
      );
    } else {
      data.next_cursor = null;
    }

    data.has_more = hasMore;
    data.cursor_version = 1;
  } else {
    data.next_cursor = null;
    data.has_more = false;
    data.cursor_version = 1;
  }

  res.json(data);
};
