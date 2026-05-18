console.log("INDEX.TS STARTING");
import "dotenv/config";

import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import app from "./app.ts";
import { port } from "./config.ts";
import { connectDB } from "./infrastructure/db/prisma.client.ts";
import logger from "./infrastructure/logger/logger.service.ts";

extendZodWithOpenApi(z);

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection", { reason });
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception", { error: err });
  process.exit(1);
});

(async () => {
  try {
    await connectDB();
    logger.info("Database Connected");

    logger.info("App loaded");

    const server = app.listen(port, () => {
      logger.info(`Server running on PORT: ${port}`);
      logger.info(`Swagger UI: http://localhost:${port}/api-docs`);
    });

    server.on("error", (err: Error) => {
      logger.error("Server failed to start", { error: err });
      process.exit(1);
    });
  } catch (err) {
    logger.error("Startup error", { error: err });
    process.exit(1);
  }
})();
