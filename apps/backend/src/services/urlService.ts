import { nanoid } from 'nanoid';
import prisma from '../db/index.js';

export async function createUrl(originalUrl: string) {
  const code = nanoid(7);
  return prisma.url.create({
    data: { code, originalUrl },
  });
}

export async function findByCode(code: string) {
  return prisma.url.findUnique({ where: { code } });
}

export async function incrementClicks(code: string): Promise<void> {
  await prisma.url.update({
    where: { code },
    data: { clicks: { increment: 1 } },
  });
}

export async function getStats(code: string) {
  return prisma.url.findUnique({
    where: { code },
    select: { code: true, originalUrl: true, clicks: true, createdAt: true },
  });
}
