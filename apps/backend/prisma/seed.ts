import { tagRepository } from '../src/data/tagRepository';
import { videoRepository } from '../src/data/videoRepository';
import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  const tags = await Promise.all([
    tagRepository.create({ name: 'tutorial' }),
    tagRepository.create({ name: 'cooking' }),
    tagRepository.create({ name: 'technology' }),
    tagRepository.create({ name: 'music' }),
    tagRepository.create({ name: 'travel' }),
  ]);

  console.log('Created tags:', tags.map(tag => tag.name));

  const videos = [
    {
      title: 'How to Cook Perfect Pasta',
      thumbnail_url: 'https://example.com/pasta-thumb.jpg',
      duration: 480,
      views: 1250,
      tagNames: ['cooking', 'tutorial'],
    },
    {
      title: 'Introduction to TypeScript',
      thumbnail_url: 'https://example.com/typescript-thumb.jpg',
      duration: 720,
      views: 3400,
      tagNames: ['technology', 'tutorial'],
    },
    {
      title: 'Best Travel Destinations 2024',
      thumbnail_url: 'https://example.com/travel-thumb.jpg',
      duration: 600,
      views: 890,
      tagNames: ['travel'],
    },
    {
      title: 'Guitar Basics for Beginners',
      thumbnail_url: 'https://example.com/guitar-thumb.jpg',
      duration: 900,
      views: 2100,
      tagNames: ['music', 'tutorial'],
    },
    {
      title: 'Advanced React Patterns',
      thumbnail_url: 'https://example.com/react-thumb.jpg',
      duration: 1200,
      views: 5600,
      tagNames: ['technology'],
    },
  ];

  for (const videoData of videos) {
    const { tagNames, ...videoCreateData } = videoData;
    
    const video = await videoRepository.create(videoCreateData);

    for (const tagName of tagNames) {
      const tag = tags.find(t => t.name === tagName);
      if (tag) {
        await prisma.videoTag.create({
          data: {
            video_id: video.id,
            tag_id: tag.id,
          },
        });
      }
    }

    console.log(`Created video: ${video.title}`);
  }

  console.log('Database seeding completed!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
