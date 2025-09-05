import { Prisma } from '../generated/prisma';
import { db } from './db';

export interface IVideoRepository {
  create(data: Prisma.VideoCreateInput): Promise<Prisma.VideoGetPayload<{}>>;
}

export class VideoRepository implements IVideoRepository {
  async create(data: Prisma.VideoCreateInput): Promise<Prisma.VideoGetPayload<{}>> {
    return await db.video.create({
      data,
    });
  }
}

export const videoRepository = new VideoRepository();
