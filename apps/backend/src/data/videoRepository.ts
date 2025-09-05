import { PrismaClient, Prisma } from '../generated/prisma';

const prisma = new PrismaClient();

export class VideoRepository {
  async create(data: Prisma.VideoCreateInput): Promise<Prisma.VideoGetPayload<{}>> {
    return await prisma.video.create({
      data,
    });
  }
}

export const videoRepository = new VideoRepository();
