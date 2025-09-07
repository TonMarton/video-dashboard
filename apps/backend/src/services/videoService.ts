import { tagService, ITagService } from './tagService';
import { Prisma } from '../generated/prisma';
import { videoRepository, IVideoRepository } from '../data/videoRepository';
import {
  CreateVideoRequest,
  GetVideosQueryParams,
  VideoSortField,
  SortOrder,
} from '@video-dashboard/shared-types';
import { CursorData } from '../types/cursor';

const DEFAULT_THUMBNAIL_URL = 'https://picsum.photos/seed/video2/300/200';

export class VideoService {
  constructor(
    private repository: IVideoRepository,
    private tagService: ITagService
  ) {}

  async createVideo(
    input: CreateVideoRequest
  ): Promise<Prisma.VideoGetPayload<{}>> {
    const { tags = [], ...videoData } = input;
    const upsertedTags = await this.tagService.upsertTags(tags);

    const thumbnailUrl =
      videoData.thumbnail_url && videoData.thumbnail_url.trim() !== ''
        ? videoData.thumbnail_url
        : DEFAULT_THUMBNAIL_URL;

    const videoCreateData: Prisma.VideoCreateInput = {
      ...videoData,
      thumbnail_url: thumbnailUrl,
      tags: {
        create: upsertedTags.map(tag => ({
          tag: {
            connect: { id: tag.id },
          },
        })),
      },
    };
    return await this.repository.create(videoCreateData);
  }

  async getVideos(
    params: GetVideosQueryParams,
    cursor?: CursorData
  ): Promise<
    Prisma.VideoGetPayload<{ include: { tags: { include: { tag: true } } } }>[]
  > {
    const {
      limit = 30,
      sortBy = VideoSortField.CREATED_AT,
      sortOrder = SortOrder.DESC,
      filters,
    } = params;

    let lastValue: string | number | Date | undefined;
    let lastId: string | undefined;

    if (cursor) {
      lastId = cursor.last_id;
      switch (sortBy) {
        case VideoSortField.CREATED_AT:
          lastValue = cursor.last_created_at
            ? new Date(cursor.last_created_at)
            : undefined;
          break;
        case VideoSortField.TITLE:
          lastValue = cursor.last_title;
          break;
        case VideoSortField.VIEWS:
          lastValue = cursor.last_views;
          break;
        case VideoSortField.DURATION:
          lastValue = cursor.last_duration;
          break;
      }
    }

    return await this.repository.findMany({
      limit,
      sortBy,
      sortOrder,
      lastValue,
      lastId,
      filters,
    });
  }
}

export const videoService = new VideoService(videoRepository, tagService);
