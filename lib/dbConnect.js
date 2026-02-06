import mongoose from 'mongoose';

// 👇 THIS IS THE LONG STRING THAT BYPASSES THE BLOCK 👇
const MONGODB_URI = "mongodb://abhishekkundu86_db_user:ujnnGBoss2gIBcb0@cluster0-shard-00-00.934quwi.mongodb.net:27017,cluster0-shard-00-01.934quwi.mongodb.net:27017,cluster0-shard-00-02.934quwi.mongodb.net:27017/cricket_db?ssl=true&authSource=admin&retryWrites=true&w=majority";


if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;