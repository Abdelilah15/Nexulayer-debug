import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? (() => {
  const rawUrl = process.env.DATABASE_URL || "";
  const dbUrl = rawUrl.replace(/^["']|["']$/g, '').trim();

  if (!dbUrl || !dbUrl.startsWith("postgres")) {
    throw new Error(`CRITICAL: Database URL is invalid. Received: ${rawUrl}`);
  }

 process.env.DATABASE_URL = dbUrl;

  return new PrismaClient();
})();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
