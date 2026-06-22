import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const globalForPrisma = global as unknown as { prisma: PrismaClient };


const createPrismaClient = () => {
  const dbUrl = process.env.DATABASE_URL;

  console.log("🔥 URL NEON TROUVÉE DANS LE .ENV :", dbUrl ? "OUI ✅" : "NON ❌");

  // Sécurité anti-crash
  if (!dbUrl) {
    throw new Error("🚨 CRASH : DATABASE_URL est introuvable !");
  }

  // 1. Le Pool prend votre URL Neon et gère tout
  const pool = new Pool({ connectionString: dbUrl });
  const adapter = new PrismaNeon(pool as any);

  // 2. On donne UNIQUEMENT l'adaptateur à Prisma, sans aucune option supplémentaire
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;