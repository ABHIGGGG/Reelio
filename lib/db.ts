import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define mongo_uri in env variables");
}

// cached connection across hot reloads in development
let cached = global.mongoose;

//if no cached connection, create one and set it to global
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  // return cached connection if it exists
  if (cached.conn) {
    return cached.conn;
  }
  
  // create new connection promise if it doesn't exist
  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
    };
    mongoose.connect(MONGODB_URI, opts).then(() => mongoose.connection);
  }
  
  // await the connection promise and cache the connection
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
  
  //return the cached connection
  return cached.conn;
}
