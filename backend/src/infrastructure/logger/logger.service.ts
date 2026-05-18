import fs from "fs";
import path from "path";
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

import { isProduction, logDirectory } from "../../config.ts";

let dir = logDirectory;
if (!dir) {
  dir = path.resolve("logs");
}

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const logLevel = isProduction ? "info" : "debug";

const dailyRotateFile = new DailyRotateFile({
  level: logLevel,
  filename: dir + "/%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  handleExceptions: true,
  maxSize: "20m",
  maxFiles: "14d",
  format: format.combine(format.errors({ stack: true }), format.timestamp(), format.json()),
});

export default createLogger({
  transports: [
    new transports.Console({
      level: logLevel,
      format: format.combine(format.errors({ stack: true }), format.prettyPrint()),
    }),
    dailyRotateFile,
  ],
  exceptionHandlers: [dailyRotateFile],
  exitOnError: false,
});
