import dotenv from "dotenv";
import wtfnode from "wtfnode";
import { loadConfig } from "./config";
import logger from "./logger";

dotenv.config();

void (async function () {
  try {
    // Ensure config is loaded before importing any other app modules so that getConfig()
    // is accessible everywhere
    await loadConfig();

    // Start server
    const server = await import("./server");
    logger.info("Starting server...");
    await server.start();

    // Graceful shutdown
    const shutdownHandler = async () => {
      logger.info("Shutting down server...");
      await server.shutdown();
      logger.info("Server was successfully shutdown");

      wtfnode.dump();
    };
    process.on("SIGTERM", shutdownHandler);
    process.on("SIGINT", shutdownHandler);
  } catch (err) {
    // eslint-disable-next-line no-console -- logger depends on config, so we can't use logger here
    console.error(err);
    process.exit(1);
  }
})();
