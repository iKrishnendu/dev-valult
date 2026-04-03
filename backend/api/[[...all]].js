require('dotenv').config()

const app = require('../src/app')
const connectDb = require('../src/config/db')

let isConnected = false;

module.exports = async (req, res) => {
  try {
    if (!isConnected) {
      await connectDb();
      isConnected = true;
      console.log("DB connected (cached)");
    }

    return app(req, res);
  } catch (error) {
    console.error("Vercel API bootstrap failed", error);
    return res.status(500).json({
      message: "Failed to connect to the database.",
    });
  }
};