import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// L'initialisation est enveloppée dans une fonction
export const prisma = globalForPrisma.prisma ?? (() => {
  
  // 1. On lit l'URL ICI (au moment de l'exécution de la requête, pas au chargement du fichier)
  const dbUrl = process.env.DATABASE_URL;

  // 2. Sécurité : On fait crasher proprement si Next.js n'a pas lu le .env
  if (!dbUrl) {
    throw new Error("🚨 CRITIQUE : DATABASE_URL est introuvable. Next.js n'a pas chargé le fichier .env !");
  }

  // 3. Initialisation du Pool avec la certitude que dbUrl existe
  const pool = new Pool({ connectionString: dbUrl });
  const adapter = new PrismaNeon(pool as any);
  
  return new PrismaClient({ adapter });
})();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}