import { describe, test, expect, beforeEach } from 'vitest';
import { VideoRepository } from '../../src/data/videoRepository';
import { TagRepository } from '../../src/data/tagRepository';
import { db } from '../../src/data/db';
import { VideoSortField, SortOrder } from '@video-dashboard/shared-types';

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

  describe('findMany', () => {
    let testVideos: any[];

    beforeEach(async () => {
      const videoData = [
        {
          title: 'Video A',
          thumbnail_url: 'https://example.com/a.jpg',
          duration: 100,
          views: 1000,
        },
        {
          title: 'Video B',
          thumbnail_url: 'https://example.com/b.jpg',
          duration: 200,
          views: 500,
        },
        {
          title: 'Video C',
          thumbnail_url: 'https://example.com/c.jpg',
          duration: 150,
          views: 2000,
        },
      ];

      testVideos = [];
      for (const data of videoData) {
        const video = await videoRepository.create(data);
        testVideos.push(video);
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    });

    describe('without cursor', () => {
      test('should sort by created_at DESC', async () => {
        const result = await videoRepository.findMany({
          limit: 10,
          sortBy: VideoSortField.CREATED_AT,
          sortOrder: SortOrder.DESC,
        });

        expect(result).toHaveLength(3);
        expect(result.map(v => v.title)).toEqual(['Video C', 'Video B', 'Video A']);
      });

      test('should sort by views ASC', async () => {
        const result = await videoRepository.findMany({
          limit: 10,
          sortBy: VideoSortField.VIEWS,
          sortOrder: SortOrder.ASC,
        });

        expect(result).toHaveLength(3);
        expect(result.map(v => v.title)).toEqual(['Video B', 'Video A', 'Video C']);
      });

      test('should sort by title DESC', async () => {
        const result = await videoRepository.findMany({
          limit: 10,
          sortBy: VideoSortField.TITLE,
          sortOrder: SortOrder.DESC,
        });

        expect(result).toHaveLength(3);
        expect(result.map(v => v.title)).toEqual(['Video C', 'Video B', 'Video A']);
      });

      test('should sort by duration ASC', async () => {
        const result = await videoRepository.findMany({
          limit: 10,
          sortBy: VideoSortField.DURATION,
          sortOrder: SortOrder.ASC,
        });

        expect(result).toHaveLength(3);
        expect(result.map(v => v.title)).toEqual(['Video A', 'Video C', 'Video B']);
      });
    });

    describe('with cursor', () => {
      test('should paginate with created_at DESC cursor', async () => {
        const firstPage = await videoRepository.findMany({
          limit: 2,
          sortBy: VideoSortField.CREATED_AT,
          sortOrder: SortOrder.DESC,
        });

        expect(firstPage).toHaveLength(2);
        expect(firstPage.map(v => v.title)).toEqual(['Video C', 'Video B']);

        const secondPage = await videoRepository.findMany({
          limit: 2,
          sortBy: VideoSortField.CREATED_AT,
          sortOrder: SortOrder.DESC,
          lastValue: firstPage[1].created_at,
          lastId: firstPage[1].id,
        });

        expect(secondPage).toHaveLength(1);
        expect(secondPage.map(v => v.title)).toEqual(['Video A']);
      });

      test('should paginate with views ASC cursor', async () => {
        const firstPage = await videoRepository.findMany({
          limit: 1,
          sortBy: VideoSortField.VIEWS,
          sortOrder: SortOrder.ASC,
        });

        expect(firstPage).toHaveLength(1);
        expect(firstPage[0].title).toBe('Video B');

        const secondPage = await videoRepository.findMany({
          limit: 2,
          sortBy: VideoSortField.VIEWS,
          sortOrder: SortOrder.ASC,
          lastValue: firstPage[0].views,
          lastId: firstPage[0].id,
        });

        expect(secondPage).toHaveLength(2);
        expect(secondPage.map(v => v.title)).toEqual(['Video A', 'Video C']);
      });

      test('should paginate with title DESC cursor', async () => {
        const firstPage = await videoRepository.findMany({
          limit: 1,
          sortBy: VideoSortField.TITLE,
          sortOrder: SortOrder.DESC,
        });

        expect(firstPage).toHaveLength(1);
        expect(firstPage[0].title).toBe('Video C');

        const secondPage = await videoRepository.findMany({
          limit: 2,
          sortBy: VideoSortField.TITLE,
          sortOrder: SortOrder.DESC,
          lastValue: firstPage[0].title,
          lastId: firstPage[0].id,
        });

        expect(secondPage).toHaveLength(2);
        expect(secondPage.map(v => v.title)).toEqual(['Video B', 'Video A']);
      });
    });

    test('should include tags in results', async () => {
      const tags = await tagRepository.upsertMany(['test', 'integration']);
      
      const videoWithTags = await videoRepository.create({
        title: 'Tagged Video',
        thumbnail_url: 'https://example.com/tagged.jpg',
        duration: 180,
        views: 300,
        tags: {
          create: tags.map(tag => ({
            tag: {
              connect: { id: tag.id },
            },
          })),
        },
      });

      const result = await videoRepository.findMany({
        limit: 10,
        sortBy: VideoSortField.CREATED_AT,
        sortOrder: SortOrder.DESC,
      });

      const taggedVideo = result.find(v => v.id === videoWithTags.id);
      expect(taggedVideo).toBeTruthy();
      expect(taggedVideo?.tags).toHaveLength(2);
      expect(taggedVideo?.tags.map((vt: any) => vt.tag.name).sort()).toEqual(['integration', 'test']);
    });

  });
});
