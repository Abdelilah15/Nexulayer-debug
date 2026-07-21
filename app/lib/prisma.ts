import { PrismaClient } from '@prisma/client';
import { PrismaNeonHttp } from '@prisma/adapter-neon';

// neonConfig.fetchConnectionCache n'existe plus en @neondatabase/serverless v1.x → supprimé

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  // Priorité : DATABASE_URL (pooler Neon) pour les requêtes runtime serverless
  // DIRECT_URL sert uniquement aux migrations (prisma.config.ts)
  const rawUrl =
    process.env.DATABASE_URL ??
    process.env.DIRECT_URL ??
    '';

  const dbUrl = rawUrl.replace(/^["']|["']$/g, '').trim();

  if (!dbUrl || !dbUrl.startsWith('postgres')) {
    throw new Error(
      `[Prisma] URL invalide. Reçu : "${rawUrl}". Vérifiez DATABASE_URL dans .env.local`
    );
  }

  const adapter = new PrismaNeonHttp(dbUrl, {});
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
