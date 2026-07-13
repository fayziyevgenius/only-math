import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;

if (!uri) {
  throw new Error("Please add MONGODB_URI to .env.local");
}

const client = new MongoClient(uri);

let clientPromise: Promise<MongoClient>;

clientPromise = client.connect();

export async function connectDB() {
  const client = await clientPromise;
  return client.db("onlymath");
}