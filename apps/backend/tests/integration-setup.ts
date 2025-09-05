import { beforeEach, afterAll } from 'vitest';
import { db } from '../src/data/db';

beforeEach(async () => {
  await db.videoTag.deleteMany();
  await db.video.deleteMany();
  await db.tag.deleteMany();
});

afterAll(async () => {
  await db.videoTag.deleteMany();
  await db.video.deleteMany();
  await db.tag.deleteMany();
  await db.$disconnect();
});
