import { PrismaClient } from '@prisma/client';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? (() => {
  // 1. Récupération de l'URL brute
  const rawUrl = process.env.DATABASE_URL || "";
  
  // 2. NETTOYAGE CRUCIAL : On enlève les guillemets (simples ou doubles) et les espaces
  const dbUrl = rawUrl.replace(/^["']|["']$/g, '').trim();
  
  if (!dbUrl || !dbUrl.startsWith("postgres")) {
    throw new Error(`🚨 CRITIQUE : L'URL de la base de données est invalide. Reçu : ${rawUrl}`);
  }

  // 3. Initialisation avec l'URL propre
  const pool = new Pool({ connectionString: dbUrl });
  const adapter = new PrismaNeon(pool as any); 
  
  return new PrismaClient({ adapter });
})();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}