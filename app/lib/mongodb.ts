import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Veuillez ajouter votre MONGODB_URI dans le fichier .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // En mode développement, on utilise une variable globale pour ne pas saturer les connexions MongoDB lors des rechargements (Hot Reload)
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // En production, on crée une connexion classique
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;