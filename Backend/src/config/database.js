const mongoose = require("mongoose");
const dns = require("dns");
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}
const logger = require("../utils/logger");

const buildMongoUri = () => {
  const configuredUri = process.env.MONGO_URI?.trim();
  const databaseName = process.env.MONGODB_DB_NAME || "SindhuSwap";

  if (configuredUri && !configuredUri.includes("<YOUR_MONGODB_PASSWORD>")) {
    const queryIndex = configuredUri.indexOf("?");
    const basePart = queryIndex >= 0 ? configuredUri.slice(0, queryIndex) : configuredUri;
    const queryPart = queryIndex >= 0 ? configuredUri.slice(queryIndex) : "";
    const hasDatabaseName = /\/[^/?]+$/.test(basePart);

    return hasDatabaseName ? configuredUri : `${basePart.replace(/\/$/, "")}/${databaseName}${queryPart}`;
  }

  const username = process.env.MONGODB_USERNAME || "apurvasawant29_db_user";
  const password = process.env.MONGODB_PASSWORD;
  if (password) {
    return `mongodb+srv://${encodeURIComponent(username)}:${encodeURIComponent(password)}@apurva.axohqc8.mongodb.net/${databaseName}?retryWrites=true&w=majority&appName=apurva`;
  }
  return "mongodb://127.0.0.1:27017/sindhuswap";
};

const connectDatabase = async (retryCount = 0) => {
  const maxRetries = Number(process.env.DB_MAX_RETRIES || 5);
  const retryDelayMs = Number(process.env.DB_RETRY_DELAY_MS || 5000);
  const mongoUri = buildMongoUri();

  logger.info(`Attempting MongoDB connection (attempt ${retryCount + 1}) to host: ${mongoUri.split("@")[1]?.split("/")[0] || "unknown"}`);

  try {
    const connection = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    logger.info(`MongoDB connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.name} - ${error.message}`);
    console.error("FULL MONGO ERROR:", error);

    if (retryCount >= maxRetries) {
      if (mongoUri !== "mongodb://127.0.0.1:27017/sindhuswap") {
        logger.warn("Falling back to local MongoDB instance: mongodb://127.0.0.1:27017/sindhuswap");
        try {
          const localConnection = await mongoose.connect("mongodb://127.0.0.1:27017/sindhuswap", {
            serverSelectionTimeoutMS: 5000,
          });
          logger.info(`MongoDB connected (Fallback Local): ${localConnection.connection.host}`);
          return localConnection;
        } catch (localError) {
          logger.error(`Local MongoDB fallback also failed: ${localError.message}`);
          throw localError;
        }
      }
      throw error;
    }
    await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
    return connectDatabase(retryCount + 1);
  }
};

const disconnectDatabase = async () => {
  await mongoose.connection.close();
  logger.info("MongoDB disconnected");
};

mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB connection disconnected");
});
mongoose.connection.on("error", (error) => {
  logger.error(`MongoDB connection error: ${error.message}`);
});

module.exports = {
  connectDatabase,
  disconnectDatabase,
};
