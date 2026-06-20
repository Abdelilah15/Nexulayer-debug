import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// On force la lecture du fichier d'environnement de gré ou de force
import 'dotenv/config'; 

neonConfig.webSocketConstructor = ws;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prisma: PrismaClient;

if (globalForPrisma.prisma) {
  prisma = globalForPrisma.prisma;
} else {
  // On récupère le lien
  const connectionString = process.env.DATABASE_URL as string;

  // Si Next.js est toujours aveugle, on crashe proprement avec un message en français
  if (!connectionString || connectionString === "") {
    throw new Error("❌ NEXT.JS EST AVEUGLE : Il ne trouve pas la variable DATABASE_URL ! Vérifiez votre fichier .env.local.");
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool as any);
  prisma = new PrismaClient({ adapter });
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export { prisma };