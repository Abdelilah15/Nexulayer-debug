import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon'; // C'est ici le changement principal
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

// 1. Nettoyage de l'URL
const dbUrl = (process.env.DATABASE_URL || "").replace(/^"|"$/g, '').trim();

if (!dbUrl.startsWith("postgres")) {
  throw new Error("🚨 L'URL de la base de données est invalide.");
}

// 2. Configuration du Pool
const pool = new Pool({ connectionString: dbUrl });

// 3. Utilisation de l'adaptateur standard (compatible v7.8.0)
const adapter = new PrismaNeon(pool as any);

// 4. Initialisation
export const prisma = new PrismaClient({ adapter });