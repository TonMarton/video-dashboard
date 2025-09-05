import { videoRepository, IVideoRepository } from '../data/videoRepository';
import { tagService, ITagService } from './tagService';
import { Prisma } from '../generated/prisma';

type CreateVideoInput = Omit<Prisma.VideoCreateInput, 'tags'> & { tags?: string[] };

export class VideoService {
  constructor(
    private repository: IVideoRepository,
    private tagService: ITagService
  ) {}

  async createVideo(
    input: CreateVideoInput
  ): Promise<Prisma.VideoGetPayload<{}>> {
    const { tags = [], ...videoData } = input;

    const upsertedTags = await this.tagService.upsertTags(tags);

    const videoCreateData: Prisma.VideoCreateInput = {
      ...videoData,
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
}

export const videoService = new VideoService(videoRepository, tagService);
