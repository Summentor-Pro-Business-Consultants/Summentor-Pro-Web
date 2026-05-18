import cors from "cors";
import express, { Application } from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";

import { originUrl } from "./config.ts";
import logger from "./infrastructure/logger/logger.service.ts";
import { errorHandler } from "./middlewares/error.middleware.ts";
import router from "./routes.ts";
import { NotFoundError } from "./shared/errors/api-error.class.ts";
import { generateOpenAPIDocument } from "./swagger/index.ts";

type BigIntWithToJSON = bigint & {
  toJSON(): string;
};

(BigInt.prototype as BigIntWithToJSON).toJSON = function () {
  return this.toString();
};

const app: Application = express();

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use((req, _res, next) => {
  logger.info(`INCOMING REQUEST: ${req.method} ${req.originalUrl} - ${req.ip}`);
  logger.info("Cookies:", req.cookies);
  next();
});

app.use(
  express.urlencoded({
    limit: "10mb",
    extended: true,
    parameterLimit: 50000,
  }),
);

app.use(
  cors({
    origin: originUrl,
    optionsSuccessStatus: 200,
    credentials: true,
  }),
);

app.use(helmet());

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(generateOpenAPIDocument(), {
    swaggerOptions: {
      persistAuthorization: true,
      tryItOutEnabled: true,
      displayRequestDuration: true,
    },
  }),
);

app.use("/api/v1", router);

app.use((_req, _res, next) => next(new NotFoundError()));
app.use(errorHandler);

export default app;
