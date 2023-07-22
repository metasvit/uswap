import wtfnode from "wtfnode";
import getConfig, { loadConfig } from "./config";
import logger from "./logger";
import prisma from "./prisma";

void (async function () {
  try {
    // Ensure config is loaded before importing any other app modules so that getConfig()
    // is accessible everywhere
    await loadConfig();

    // Start server
    const server = await import("./server");
    logger.info("Starting server...");
    await server.start();

    // Connect to Redis
    const redis = (await import("./redis")).default;
    logger.info("Connecting to Redis...");
    await redis.connect();

    // Launch Bull queues
    const bull = (await import("./bull")).default;
    if (getConfig().BULL.ENABLE) {
      await bull.launch();
    }

    // Start PubSub
    const PubSub = (await import("./pubsub")).default;
    const pubSub = new PubSub();
    await pubSub.start();

    // Graceful shutdown
    const shutdownHandler = async () => {
      logger.info("Shutting down server...");
      await server.shutdown();
      logger.info("Server was successfully shutdown");

      logger.info("Redis disconnecting...");
      try {
        await redis.quit();
      } catch (e) {
        logger.warn("Redis error: " + e.message);
      }
      logger.info("Redis disconnected");

      // Stop Bull queues
      if (getConfig().BULL.ENABLE) {
        await bull.stop();
      }

      await pubSub.stop();

      prisma.$disconnect();
      logger.info("Prisma disconnected");

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
