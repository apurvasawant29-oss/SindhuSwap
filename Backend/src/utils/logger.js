const fs = require("fs");
const path = require("path");

const logDirectory = path.join(__dirname, "..", "logs");

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const writeLog = (level, message, meta = {}) => {
  const entry = {
    level,
    message,
    meta,
    timestamp: new Date().toISOString(),
  };

  const line = `${JSON.stringify(entry)}${SystemLineBreak()}`;
  fs.appendFile(path.join(logDirectory, "app.log"), line, () => {});

  if (process.env.NODE_ENV !== "test") {
    const output = level === "error" ? console.error : console.log;
    output(`[${entry.timestamp}] ${level.toUpperCase()}: ${message}`);
  }
};

const SystemLineBreak = () => require("os").EOL;

module.exports = {
  info: (message, meta) => writeLog("info", message, meta),
  warn: (message, meta) => writeLog("warn", message, meta),
  error: (message, meta) => writeLog("error", message, meta),
  logDirectory,
};
