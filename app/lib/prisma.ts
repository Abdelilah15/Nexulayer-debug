import { PrismaClient } from '@prisma/client';
import { PrismaNeonHttp } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';

// Réutilise les connexions HTTP → réduit l'impact des cold starts
neonConfig.fetchConnectionCache = true;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  // DIRECT_URL pour le driver HTTP (sans pooler)
  const rawUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? '';
  const dbUrl = rawUrl.replace(/^["']|["']$/g, '').trim();

  if (!dbUrl || !dbUrl.startsWith('postgres')) {
    throw new Error(
      `[Prisma] URL invalide. Reçu : "${rawUrl}". Vérifiez DIRECT_URL dans .env.local`
    );
  }

  const adapter = new PrismaNeonHttp(dbUrl, {});
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
