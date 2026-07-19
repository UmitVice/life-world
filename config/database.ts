import mongoose from 'mongoose';

const mongoDB_URI = process.env.MONGODB_URI;

// Singleton pattern: Next.js HMR + serverless both reconnect on every
// invocation without this, which exhausts the Mongo connection pool.
// We stash the cached connection on `globalThis` so it survives module
// reloads in dev and is reused across serverless invocations.
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongo = globalThis as unknown as { _mongooseCache?: MongooseCache };
const cache: MongooseCache = globalForMongo._mongooseCache ?? {
  conn: null,
  promise: null,
};
globalForMongo._mongooseCache = cache;

mongoose.set('strictQuery', true);

const connectDB = async (): Promise<typeof mongoose> => {
  if (!mongoDB_URI) {
    throw new Error('MONGODB_URI is not defined. Set it in .env (or .env.local) before using persistent features.');
  }
  if (cache.conn) return cache.conn;
  if (!cache.promise) {
    cache.promise = mongoose.connect(mongoDB_URI).then((m) => m);
  }
  try {
    cache.conn = await cache.promise;
  } catch (error) {
    // Reset the promise so the next call can retry instead of returning
    // the rejected promise forever.
    cache.promise = null;
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
  return cache.conn;
};

export default connectDB;
