import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  // Pointe vers votre fichier schema
  schema: 'prisma/schema.prisma',
  
  // Définit l'URL de la base de données pour les migrations Prisma
  datasource: {
    url: env('DATABASE_URL'),
  },
});