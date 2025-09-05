import { describe, test, expect } from 'vitest';
import { TagService } from '../../src/services/tagService';
import { MockTagRepository } from '../mocks/tagRepository.mock';

describe('TagService', () => {
  describe('upsertTags', () => {
    test.each([
      {
        input: ['Tutorial', 'COOKING!', 'tech_nology', 'Music & Sound', '   travel   ', 'duplicate', 'DUPLICATE'],
        expected: [
          { id: 'mock-id-1', name: 'tutorial' },
          { id: 'mock-id-2', name: 'cooking' },
          { id: 'mock-id-3', name: 'technology' },
          { id: 'mock-id-4', name: 'musicsound' },
          { id: 'mock-id-5', name: 'travel' },
          { id: 'mock-id-6', name: 'duplicate' }
        ],
        description: 'should normalise and upsert tags correctly'
      },
      {
        input: ['valid', '!!!', '   ', '_-_', 'another'],
        expected: [
          { id: 'mock-id-1', name: 'valid' },
          { id: 'mock-id-2', name: 'another' }
        ],
        description: 'should remove empty tags after normalisation'
      },
      {
        input: ['tag1', 'TAG1', 'tag-1', 'tag_1', 'tag2'],
        expected: [
          { id: 'mock-id-1', name: 'tag1' },
          { id: 'mock-id-2', name: 'tag2' }
        ],
        description: 'should deduplicate tags'
      },
      {
        input: [],
        expected: [],
        description: 'should handle empty array'
      },
      {
        input: ['123', 'abc123', 'test123test'],
        expected: [
          { id: 'mock-id-1', name: '123' },
          { id: 'mock-id-2', name: 'abc123' },
          { id: 'mock-id-3', name: 'test123test' }
        ],
        description: 'should preserve alphanumeric characters'
      },
      {
        input: ['!!!', '   ', '_-_'],
        expected: [],
        description: 'should return empty array when all tags are filtered out'
      }
    ])('$description', async ({ input, expected }) => {
      const mockRepository = new MockTagRepository();
      const tagService = new TagService(mockRepository);
      const result = await tagService.upsertTags(input);
      expect(result).toEqual(expected);
    });
  });
});
