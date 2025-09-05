import { describe, test, expect } from 'vitest';
import { TagRepository } from '../../src/data/tagRepository';
import { db } from '../../src/data/db';

const tagRepository = new TagRepository();

describe('TagRepository Integration Tests', () => {
  describe('upsertMany', () => {
    test('should create new tags', async () => {
      const tagNames = ['tutorial', 'cooking', 'technology'];

      const result = await tagRepository.upsertMany(tagNames);

      expect(result).toHaveLength(3);
      expect(result.map(tag => tag.name)).toEqual([
        'tutorial',
        'cooking',
        'technology',
      ]);

      const dbTags = await db.tag.findMany();
      expect(dbTags).toHaveLength(3);
    });

    test('should upsert existing tags without duplicates', async () => {
      await tagRepository.upsertMany(['tutorial', 'cooking']);
      await tagRepository.upsertMany([
        'tutorial',
        'technology',
        'music',
      ]);

      const dbTags = await db.tag.findMany();
      expect(dbTags).toHaveLength(4);
      expect(dbTags.map(tag => tag.name).sort()).toEqual([
        'cooking',
        'music',
        'technology',
        'tutorial',
      ]);
    });
  });
});
