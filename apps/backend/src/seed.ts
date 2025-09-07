import { videoService } from './services/videoService';
import { PrismaClient } from '@prisma/client';
import videosData from '../videos.json';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  for (const videoData of videosData.videos) {
    const { id, created_at, ...videoCreateData } = videoData;

    const video = await videoService.createVideo(videoCreateData);
    console.log(`Created video: ${video.title}`);
  }

  console.log(
    `Database seeding completed! Created ${videosData.videos.length} videos.`
  );
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
