const dotenv = require("dotenv");

dotenv.config();

const app = require("./app");
const connectDb = require("./config/db");

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const host = await connectDb();
    app.listen(port, () => {
      console.log(`DevVault API listening on port ${port}`);
      console.log(`MongoDB connected: ${host}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
