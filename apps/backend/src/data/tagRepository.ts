import { PrismaClient, Prisma } from '../generated/prisma';

const prisma = new PrismaClient();

export interface ITagRepository {
  upsertMany(names: string[]): Promise<Prisma.TagGetPayload<{}>[]>;
}

export class TagRepository implements ITagRepository {
  async upsertMany(names: string[]): Promise<Prisma.TagGetPayload<{}>[]> {
    return await prisma.$transaction(
      names.map(name =>
        prisma.tag.upsert({
          where: { name },
          update: {},
          create: { name },
        })
      )
    );
  }
}

export const tagRepository = new TagRepository();
