import { Prisma } from '../../src/generated/prisma';
import { ITagRepository } from '../../src/data/tagRepository';

export class MockTagRepository implements ITagRepository {
  async upsertMany(names: string[]): Promise<Prisma.TagGetPayload<{}>[]> {
    return names.map((name, index) => ({
      id: `mock-id-${index + 1}`,
      name,
    }));
  }
}
