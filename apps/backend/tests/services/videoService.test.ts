import { describe, test, expect } from 'vitest';
import { VideoService } from '../../src/services/videoService';
import { MockVideoRepository } from '../mocks/videoRepository.mock';
import { MockTagRepository } from '../mocks/tagRepository.mock';
import { TagService } from '../../src/services/tagService';

describe('VideoService', () => {
  describe('createVideo', () => {
    test.each([
      {
        input: {
          title: 'Test Video With Empty Tags',
          thumbnail_url: 'https://example.com/thumb2.jpg',
          duration: 90,
          tags: []
        },
        description: 'should create video with empty tags array'
      },
      {
        input: {
          title: 'Test Video With Tags',
          thumbnail_url: 'https://example.com/thumb3.jpg',
          duration: 180,
          tags: ['Tutorial', 'COOKING!', 'Cooking', 'tech_nology']
        },
        description: 'should create video with tags and normalize them'
      },
    ])('$description', async ({ input }) => {
      const mockVideoRepository = new MockVideoRepository();
      const mockTagRepository = new MockTagRepository();
      const mockTagService = new TagService(mockTagRepository);
      const videoService = new VideoService(mockVideoRepository, mockTagService);

      const result = await videoService.createVideo(input);

      expect(result).toEqual({
        id: 'mock-video-id',
        title: input.title,
        thumbnail_url: input.thumbnail_url,
        duration: input.duration,
        views: 0,
        created_at: expect.any(Date)
      });
    });
  });
});
