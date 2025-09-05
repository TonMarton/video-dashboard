import { PrismaClient, Prisma } from '../generated/prisma';

const prisma = new PrismaClient();

export class TagRepository {
  async create(data: Prisma.TagCreateInput): Promise<Prisma.TagGetPayload<{}>> {
    return await prisma.tag.create({
      data,
    });
  }

  async upsert(name: string): Promise<Prisma.TagGetPayload<{}>> {
    return await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
}

export const tagRepository = new TagRepository();
