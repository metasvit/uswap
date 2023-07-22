import express from "express";
import http from "http";
import httpShutdown from "http-shutdown";
import logger from "./logger";
import getConfig from "./config";
import ArenaRouter from "./routes/ArenaRouter";
import QuotesRouter from "./routes/quote";
import TokensRouter from "./routes/token";
import IdentitiesRouter from "./routes/id";

const app = express();
const server = httpShutdown(new http.Server(app));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(ArenaRouter);
app.use("/api/v1", QuotesRouter);
app.use("/api/v1", TokensRouter);
app.use("/api/v1", IdentitiesRouter);

export const start = (): Promise<http.Server> => {
  logger.info(`Starting Express server [${getConfig().APP_ENV}]`);
  return new Promise((resolve) => {
    server.listen(getConfig().PORT, () => {
      logger.info("Express server listening on port " + getConfig().PORT);
      resolve(server);
    });
  });
};

export const shutdown = (): Promise<void> => {
  logger.info("Stopping Express server");
  return new Promise((resolve) => {
    if (server) {
      return server.shutdown(() => {
        logger.info("Express server stopped");
        resolve();
      });
    }
    resolve();
  });
};
