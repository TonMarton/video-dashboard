import { PrismaClient, Prisma } from '../generated/prisma';

const prisma = new PrismaClient();

export interface IVideoRepository {
  create(data: Prisma.VideoCreateInput): Promise<Prisma.VideoGetPayload<{}>>;
}

export class VideoRepository implements IVideoRepository {
  async create(data: Prisma.VideoCreateInput): Promise<Prisma.VideoGetPayload<{}>> {
    return await prisma.video.create({
      data,
    });
  }
}

export const videoRepository = new VideoRepository();
