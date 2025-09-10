import { Prisma } from '@prisma/client';
import { IVideoRepository } from '../../src/data/videoRepository';
import { SortOrder } from '@video-dashboard/shared-types';

export class MockVideoRepository implements IVideoRepository {
  findMany(params: {
    limit: number;
    sortBy: string;
    sortOrder: SortOrder;
    lastValue?: string | number | Date;
    lastId?: string;
    filters?: string;
  }): Promise<
    Prisma.VideoGetPayload<{ include: { tags: { include: { tag: true } } } }>[]
  > {
    throw new Error('Method not implemented.');
  }

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
