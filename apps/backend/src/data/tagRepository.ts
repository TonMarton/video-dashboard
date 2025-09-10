import { Prisma } from '@prisma/client';
import { db } from './db';

export interface ITagRepository {
  upsertMany(names: string[]): Promise<Prisma.TagGetPayload<{}>[]>;
}

export class TagRepository implements ITagRepository {
  async upsertMany(names: string[]): Promise<Prisma.TagGetPayload<{}>[]> {
    return await db.$transaction(
      names.map(name =>
        db.tag.upsert({
          where: { name },
          update: {},
          create: { name },
        })
      )
    );
  }
}

export const tagRepository = new TagRepository();
