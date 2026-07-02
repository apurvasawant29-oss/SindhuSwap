const mongoose = require("mongoose");

let serverInstance = null;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined in environment variables.");
  }

  try {
    const connection = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

const setServerInstance = (server) => {
  serverInstance = server;
};

const gracefulShutdown = async (signal) => {
  try {
    console.log(`${signal} received. Closing server and MongoDB connection...`);

    if (serverInstance) {
      serverInstance.close(() => {
        console.log("HTTP server closed.");
      });
    }

    await mongoose.connection.close(false);
    console.log("MongoDB connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Graceful shutdown failed:", error.message);
    process.exit(1);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

module.exports = {
  connectDB,
  setServerInstance,
};
