import { IVideoRepository } from '../../src/data/videoRepository';
import { Prisma } from '../../src/generated/prisma';

export class MockVideoRepository implements IVideoRepository {
  async create(
    data: Prisma.VideoCreateInput
  ): Promise<Prisma.VideoGetPayload<{}>> {
    return {
      id: 'mock-video-id',
      title: data.title,
      thumbnail_url: data.thumbnail_url,
      duration: data.duration,
      views: 0,
      created_at: new Date(),
    };
  }
}
