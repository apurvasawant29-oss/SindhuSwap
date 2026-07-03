const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const fs = require("fs");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const { API_PREFIX } = require("./constants");
const { errorHandler, notFound } = require("./middlewares/error.middleware");
const routes = require("./routes");
const logger = require("./utils/logger");

const app = express();

const accessLogStream = fs.createWriteStream(path.join(logger.logDirectory, "access.log"), {
  flags: "a",
});

const configuredClientUrls = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);
const allowedOrigins = new Set([
  ...configuredClientUrls,
  "http://127.0.0.1:5173",
  "http://localhost:5173",
]);

app.use(
  helmet({
    // Allow the React dev server (and other client origins) to load uploaded product images.
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(morgan("combined", { stream: accessLogStream }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(API_PREFIX, routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

