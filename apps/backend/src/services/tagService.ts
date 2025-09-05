import { tagRepository, ITagRepository } from '../data/tagRepository';
import { Prisma } from '../generated/prisma';

export class TagService {
  constructor(private repository: ITagRepository = tagRepository) {}

  private normaliseTags(tags: string[]): string[] {
    return [...new Set(
      tags
        .map(tag => 
          tag
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '')
        )
        .filter(tag => tag.length > 0)
    )];
  }

  async upsertTags(tags: string[]): Promise<Prisma.TagGetPayload<{}>[]> {
    const normalisedTags = this.normaliseTags(tags);
    if (normalisedTags.length === 0) {
      return [];
    }
    return await this.repository.upsertMany(normalisedTags);
  }
}

export const tagService = new TagService();
