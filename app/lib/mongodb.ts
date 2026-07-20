import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

const uri = process.env.MONGODB_URI;

const options = {
  tlsAllowInvalidCertificates: true,
  serverSelectionTimeoutMS: 10000,
  family: 4,
};

const client = new MongoClient(uri, options);
const clientPromise = client.connect();

export default clientPromise;
