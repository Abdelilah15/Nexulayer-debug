import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Veuillez définir la variable MONGODB_URI dans .env');
}

const uri = process.env.MONGODB_URI;

// 🔥 L'ANTIDOTE : On force le passage du pare-feu 4G de Maroc Telecom ici
const options = {
  tlsAllowInvalidCertificates: true,
  serverSelectionTimeoutMS: 10000, // Empêche l'application de charger dans le vide pendant 30 secondes
  family: 4,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;