const mongoose = require('mongoose')

let cachedConnection = global.mongooseConnection

if (!cachedConnection) {
  cachedConnection = global.mongooseConnection = {
    conn: null,
    promise: null,
  }
}

const connectDb = async () => {
  if (cachedConnection.conn) {
    return cachedConnection.conn.connection.host
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined.')
  }

  if (!cachedConnection.promise) {
    cachedConnection.promise = mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    })
  }

  cachedConnection.conn = await cachedConnection.promise
  return cachedConnection.conn.connection.host
}

module.exports = connectDb
