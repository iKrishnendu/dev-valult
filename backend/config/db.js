const mongoose = require("mongoose");

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDb = async () => {
  if (cached.conn) return cached.conn.connection.host;

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false
    });
  }

  cached.conn = await cached.promise;
  return cached.conn.connection.host;
};

module.exports = connectDb;