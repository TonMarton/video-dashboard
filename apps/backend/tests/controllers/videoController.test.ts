import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import app from '../../src/app';
import { videoService } from '../../src/services/videoService';
import { Prisma } from '../../src/generated/prisma';

vi.mock('../../src/services/videoService');

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
});
