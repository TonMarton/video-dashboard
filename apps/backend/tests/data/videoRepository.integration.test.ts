import { describe, test, expect } from 'vitest';
import { VideoRepository } from '../../src/data/videoRepository';
import { TagRepository } from '../../src/data/tagRepository';
import { db } from '../../src/data/db';

const videoRepository = new VideoRepository();
const tagRepository = new TagRepository();

describe('VideoRepository Integration Tests', () => {
  describe('create', () => {
    test('should create video without tags', async () => {
      const videoData = {
        title: 'Test Video',
        thumbnail_url: 'https://example.com/thumb.jpg',
        duration: 120,
        views: 100,
      };

      const result = await videoRepository.create(videoData);

      expect(result).toMatchObject({
        id: expect.any(String),
        title: 'Test Video',
        thumbnail_url: 'https://example.com/thumb.jpg',
        duration: 120,
        views: 100,
        created_at: expect.any(Date),
      });

      const dbVideo = await db.video.findUnique({
        where: { id: result.id },
      });
      expect(dbVideo).toBeTruthy();
      expect(dbVideo?.title).toBe('Test Video');
    });

    test('should create video with tags', async () => {
      const tags = await tagRepository.upsertMany(['tutorial', 'cooking']);

      const videoData = {
        title: 'Cooking Tutorial',
        thumbnail_url: 'https://example.com/cooking.jpg',
        duration: 300,
        views: 50,
        tags: {
          create: tags.map(tag => ({
            tag: {
              connect: { id: tag.id },
            },
          })),
        },
      };

      const result = await videoRepository.create(videoData);

      expect(result).toMatchObject({
        id: expect.any(String),
        title: 'Cooking Tutorial',
        thumbnail_url: 'https://example.com/cooking.jpg',
        duration: 300,
        views: 50,
        created_at: expect.any(Date),
      });

      const videoTags = await db.videoTag.findMany({
        where: { video_id: result.id },
        include: { tag: true },
      });

      expect(videoTags).toHaveLength(2);
      expect(videoTags.map(vt => vt.tag.name).sort()).toEqual([
        'cooking',
        'tutorial',
      ]);
    });

    test('should create video with default values', async () => {
      const videoData = {
        title: 'Minimal Video',
        thumbnail_url: 'https://example.com/minimal.jpg',
        duration: 60,
      };

      const result = await videoRepository.create(videoData);

      expect(result).toMatchObject({
        id: expect.any(String),
        title: 'Minimal Video',
        thumbnail_url: 'https://example.com/minimal.jpg',
        duration: 60,
        views: 0,
        created_at: expect.any(Date),
      });
    });
  });
});
