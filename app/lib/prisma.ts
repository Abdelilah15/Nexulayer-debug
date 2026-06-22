import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

// 1. Nettoyage de l'URL
const dbUrl = (process.env.DATABASE_URL || "").replace(/^"|"$/g, '').trim();

if (!dbUrl.startsWith("postgres")) {
  throw new Error("🚨 L'URL de la base de données est invalide.");
}

// 2. Création du Singleton pour Next.js (Évite l'erreur de connexion multiple)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 3. Initialisation de Prisma avec l'adaptateur
export const prisma = globalForPrisma.prisma ?? (() => {
  const pool = new Pool({ connectionString: dbUrl });
  const adapter = new PrismaNeon(pool as any); // Cast nécessaire pour l'adaptateur Neon
  
  // Dans la v7, l'URL n'étant plus dans le schéma, on la gère ici via l'adaptateur
  return new PrismaClient({ adapter });
})();

// 4. Sauvegarde dans le contexte global en développement
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}