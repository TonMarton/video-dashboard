import { Prisma } from '../generated/prisma';
import { db } from './db';
import { SortOrder } from '@video-dashboard/shared-types';

export interface IVideoRepository {
  create(data: Prisma.VideoCreateInput): Promise<Prisma.VideoGetPayload<{}>>;
  findMany(params: {
    limit: number;
    sortBy: string;
    sortOrder: SortOrder;
    lastValue?: string | number | Date;
    lastId?: string;
    filters?: string;
  }): Promise<
    Prisma.VideoGetPayload<{ include: { tags: { include: { tag: true } } } }>[]
  >;
}

export class VideoRepository implements IVideoRepository {
  async create(
    data: Prisma.VideoCreateInput
  ): Promise<Prisma.VideoGetPayload<{}>> {
    return await db.video.create({
      data,
    });
  }

  async findMany(params: {
    limit: number;
    sortBy: string;
    sortOrder: SortOrder;
    lastValue?: string | number | Date;
    lastId?: string;
    filters?: string;
  }): Promise<
    Prisma.VideoGetPayload<{ include: { tags: { include: { tag: true } } } }>[]
  > {
    const { limit, sortBy, sortOrder, lastValue, lastId } = params;

    const orderBy = this.buildOrderBy(sortBy, sortOrder);
    const where =
      lastValue && lastId
        ? this.buildWhereClause(lastValue, lastId, sortBy, sortOrder)
        : {};

    return await db.video.findMany({
      where,
      orderBy,
      take: limit,
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  private buildOrderBy(
    sortBy: string,
    sortOrder: SortOrder
  ): Prisma.VideoOrderByWithRelationInput[] {
    const direction = sortOrder as 'asc' | 'desc';

    return [{ [sortBy]: direction }, { id: direction }];
  }

  private buildWhereClause(
    lastValue: string | number | Date,
    lastId: string,
    sortBy: string,
    sortOrder: SortOrder
  ): Prisma.VideoWhereInput {
    const isDesc = sortOrder === SortOrder.DESC;
    const operator = isDesc ? 'lt' : 'gt';
    
    const processedValue = sortBy === 'created_at' ? new Date(lastValue) : lastValue;
    
    return {
      OR: [
        { [sortBy]: { [operator]: processedValue } },
        {
          [sortBy]: processedValue,
          id: { [operator]: lastId },
        },
      ],
    };
  }
}

export const videoRepository = new VideoRepository();
