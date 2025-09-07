import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import app from '../../src/app';
import { VideoSortField, SortOrder } from '@video-dashboard/shared-types';

vi.mock('../../src/services/videoService', () => ({
  videoService: {
    createVideo: vi.fn(),
    getVideos: vi.fn(),
  },
}));

import { videoService } from '../../src/services/videoService';
const mockVideoService = vi.mocked(videoService);

describe('Video Controller API Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/videos', () => {
    describe('201 Created - Success Cases', () => {
      const successTestCases = [
        {
          name: 'should create video with minimal required fields',
          payload: {
            title: 'Test Video',
            thumbnail_url: 'https://example.com/thumbnail.jpg',
            duration: 300,
          },
          expected: {
            id: 'test-id',
            title: 'Test Video',
            thumbnail_url: 'https://example.com/thumbnail.jpg',
            duration: 300,
            views: 0,
            created_at: new Date('2025-01-01T00:00:00.000Z'),
            tags: [],
          },
        },
        {
          name: 'should create video with views & tags specified',
          payload: {
            title: 'Test Video with Views',
            thumbnail_url: 'https://example.com/thumbnail.jpg',
            duration: 300,
            views: 100,
            tags: ['tutorial', 'javascript'],
          },
          expected: {
            id: 'test-id',
            title: 'Test Video with Views',
            thumbnail_url: 'https://example.com/thumbnail.jpg',
            duration: 300,
            views: 100,
            created_at: new Date('2025-01-01T00:00:00.000Z'),
            tags: [
              { tag: { id: 'tag1', name: 'tutorial' } },
              { tag: { id: 'tag2', name: 'javascript' } },
            ],
          },
        },
      ];

      it.each(successTestCases)('$name', async ({ payload, expected }) => {
        mockVideoService.createVideo.mockResolvedValue(expected);

        const response = await request(app)
          .post('/api/videos')
          .send(payload)
          .expect(201);

        expect(response.body).toEqual({
          ...expected,
          created_at: expected.created_at.toISOString(),
        });
        expect(mockVideoService.createVideo).toHaveBeenCalledWith(payload);
      });
    });

    describe('400 Bad Request - Validation Error', () => {
      it('should return 400 when title is missing', async () => {
        const payload = {
          thumbnail_url: 'https://example.com/thumbnail.jpg',
          duration: 300,
        };

        const response = await request(app)
          .post('/api/videos')
          .send(payload)
          .expect(400);

        expect(response.body.error).toBe('Bad request');
        expect(response.body.details).toBeDefined();
        expect(Array.isArray(response.body.details)).toBe(true);
        expect(mockVideoService.createVideo).not.toHaveBeenCalled();
      });
    });
  });

  describe('GET /api/videos', () => {
    const mockVideos = [
      {
        id: 'video-1',
        title: 'Video A',
        thumbnail_url: 'https://example.com/a.jpg',
        duration: 100,
        views: 1000,
        created_at: new Date('2025-01-01T10:00:00.000Z'),
        tags: [
          {
            tag: { id: 'tag1', name: 'tutorial' },
            video_id: 'video-1',
            tag_id: 'tag1',
          },
        ],
      },
      {
        id: 'video-2',
        title: 'Video B',
        thumbnail_url: 'https://example.com/b.jpg',
        duration: 200,
        views: 500,
        created_at: new Date('2025-01-01T09:00:00.000Z'),
        tags: [],
      },
    ];

    describe('200 OK - Success Cases', () => {
      it('should return videos without cursor (first page)', async () => {
        mockVideoService.getVideos.mockResolvedValue(mockVideos);

        const response = await request(app).get('/api/videos').expect(200);

        expect(response.body).toMatchObject({
          items: mockVideos.map(video => ({
            ...video,
            created_at: video.created_at.toISOString(),
          })),
          has_more: false,
          cursor_version: 1,
        });

        expect(response.body.next_cursor).toBeNull();
        expect(mockVideoService.getVideos).toHaveBeenCalledWith({
          limit: 30,
          sortBy: VideoSortField.CREATED_AT,
          sortOrder: SortOrder.DESC,
          filters: undefined,
        }, undefined);
      });

      it('should return videos with cursor encoding when has_more is true', async () => {
        const fullPageVideos = Array(30)
          .fill(null)
          .map((_, i) => ({
            id: `video-${i}`,
            title: `Video ${i}`,
            thumbnail_url: `https://example.com/${i}.jpg`,
            duration: 100 + i,
            views: 1000 - i,
            created_at: new Date(`2025-01-${String(i + 1).padStart(2, '0')}T10:00:00.000Z`),
            tags: [],
          }));

        mockVideoService.getVideos.mockResolvedValue(fullPageVideos);

        const response = await request(app)
          .get('/api/videos')
          .query({ limit: 30 })
          .expect(200);

        expect(response.body.items).toHaveLength(30);
        expect(response.body.has_more).toBe(true);
        expect(response.body.next_cursor).toBeDefined();
        expect(response.body.next_cursor).not.toBeNull();
        expect(response.body.cursor_version).toBe(1);

        const cursor = response.body.next_cursor;
        expect(typeof cursor).toBe('string');
        expect(cursor.length).toBeGreaterThan(0);
      });

      it('should handle custom query parameters', async () => {
        mockVideoService.getVideos.mockResolvedValue([mockVideos[0]]);

        const response = await request(app)
          .get('/api/videos')
          .query({
            limit: 10,
            sortBy: VideoSortField.VIEWS,
            sortOrder: SortOrder.ASC,
          })
          .expect(200);

        expect(response.body.items).toHaveLength(1);
        expect(mockVideoService.getVideos).toHaveBeenCalledWith(
          {
            limit: 10,
            sortBy: VideoSortField.VIEWS,
            sortOrder: SortOrder.ASC,
            filters: undefined,
          },
          undefined
        );
      });

      it('should decode cursor and pass to service', async () => {
        const cursorData = {
          last_created_at: '2025-01-01T09:00:00.000Z',
          last_id: 'video-2',
          issued_at: Math.floor(Date.now() / 1000),
        };
        const encodedCursor = Buffer.from(
          JSON.stringify({
            ...cursorData,
            cursor_version: 1,
          })
        ).toString('base64');

        mockVideoService.getVideos.mockResolvedValue([mockVideos[1]]);

        const response = await request(app)
          .get('/api/videos')
          .query({ cursor: encodedCursor })
          .expect(200);

        expect(response.body.items).toHaveLength(1);
        expect(mockVideoService.getVideos).toHaveBeenCalledWith(
          {
            limit: 30,
            sortBy: VideoSortField.CREATED_AT,
            sortOrder: SortOrder.DESC,
            filters: undefined,
          },
          expect.objectContaining({
            last_created_at: cursorData.last_created_at,
            last_id: cursorData.last_id,
            issued_at: cursorData.issued_at,
          })
        );
      });

      it('should handle empty results', async () => {
        mockVideoService.getVideos.mockResolvedValue([]);

        const response = await request(app).get('/api/videos').expect(200);

        expect(response.body).toEqual({
          items: [],
          next_cursor: null,
          has_more: false,
          cursor_version: 1,
        });
      });
    });

    describe('400 Bad Request - Validation Errors', () => {
      it('should return 400 for invalid limit', async () => {
        const response = await request(app)
          .get('/api/videos')
          .query({ limit: 0 })
          .expect(400);

        expect(response.body.error).toBe('Bad request');
        expect(response.body.details).toBeDefined();
        expect(mockVideoService.getVideos).not.toHaveBeenCalled();
      });

      it('should return 400 for invalid sortBy', async () => {
        const response = await request(app)
          .get('/api/videos')
          .query({ sortBy: 'invalid_field' })
          .expect(400);

        expect(response.body.error).toBe('Bad request');
        expect(response.body.details).toBeDefined();
        expect(mockVideoService.getVideos).not.toHaveBeenCalled();
      });

      it('should return 400 for invalid sortOrder', async () => {
        const response = await request(app)
          .get('/api/videos')
          .query({ sortOrder: 'invalid_order' })
          .expect(400);

        expect(response.body.error).toBe('Bad request');
        expect(response.body.details).toBeDefined();
        expect(mockVideoService.getVideos).not.toHaveBeenCalled();
      });

      it('should return 400 for malformed cursor', async () => {
        const response = await request(app)
          .get('/api/videos')
          .query({ cursor: 'invalid-cursor' })
          .expect(400);

        expect(response.body.error).toBe('Invalid cursor');
        expect(response.body.details).toEqual([
          'The provided cursor is malformed or expired',
        ]);
        expect(mockVideoService.getVideos).not.toHaveBeenCalled();
      });

      it('should return 400 for cursor with wrong version', async () => {
        const invalidCursor = Buffer.from(
          JSON.stringify({
            last_created_at: '2025-01-01T09:00:00.000Z',
            last_id: 'video-2',
            cursor_version: 999,
            issued_at: Math.floor(Date.now() / 1000),
          })
        ).toString('base64');

        const response = await request(app)
          .get('/api/videos')
          .query({ cursor: invalidCursor })
          .expect(400);

        expect(response.body.error).toBe('Invalid cursor');
        expect(response.body.details).toEqual([
          'The provided cursor is malformed or expired',
        ]);
        expect(mockVideoService.getVideos).not.toHaveBeenCalled();
      });
    });

    describe('Cursor Encoding/Decoding Integration', () => {
      it('should create valid cursor that can be decoded', async () => {
        const testVideo = {
          id: 'test-video',
          title: 'Test Video',
          thumbnail_url: 'https://example.com/test.jpg',
          duration: 300,
          views: 1500,
          created_at: new Date('2025-01-01T12:00:00.000Z'),
          tags: [],
        };

        mockVideoService.getVideos.mockResolvedValue([testVideo]);

        const firstResponse = await request(app)
          .get('/api/videos')
          .query({ limit: 1 })
          .expect(200);

        expect(firstResponse.body.has_more).toBe(true);
        expect(firstResponse.body.next_cursor).toBeDefined();

        const cursor = firstResponse.body.next_cursor;
        const decodedCursor = JSON.parse(
          Buffer.from(cursor, 'base64').toString('utf-8')
        );

        expect(decodedCursor).toMatchObject({
          last_created_at: testVideo.created_at.toISOString(),
          last_id: testVideo.id,
          cursor_version: 1,
          issued_at: expect.any(Number),
        });

        mockVideoService.getVideos.mockResolvedValue([]);

        const secondResponse = await request(app)
          .get('/api/videos')
          .query({ cursor })
          .expect(200);

        expect(mockVideoService.getVideos).toHaveBeenLastCalledWith(
          {
            limit: 30,
            sortBy: VideoSortField.CREATED_AT,
            sortOrder: SortOrder.DESC,
            filters: undefined,
          },
          expect.objectContaining({
            last_created_at: testVideo.created_at.toISOString(),
            last_id: testVideo.id,
          })
        );
      });
    });
  });
});
