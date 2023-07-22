import redis from "src/redis";
import Publisher from "./pub/Publisher";
import Subscriber from "./sub/Subscriber";
import logger, { Logger } from "src/logger";

export default class PubSub {
  pubClient: any;
  subClient: any;
  logger: Logger;
  publishers: Publisher[];
  subscribers: Subscriber[];

  constructor() {
    this.pubClient = redis.duplicate();
    this.subClient = redis.duplicate();
    this.logger = logger.child(
      {},
      { msgPrefix: `[${this.constructor.name}] ` }
    ) as Logger;

    this.publishers = [];
    this.subscribers = [];
  }

  async start(): Promise<void> {
    await this.pubClient.connect();
    await this.subClient.connect();

    this.publishers.forEach(async (publisher) => {
      await publisher.start();
    });

    this.subscribers.forEach(async (subscriber) => {
      await subscriber.start();
    });
  }

  async stop(): Promise<void> {
    try {
      await this.pubClient.quit();
    } catch (e) {
      this.logger.warn("Redis error: " + e.message);
    }
    try {
      await this.subClient.quit();
    } catch (e) {
      this.logger.warn("Redis error: " + e.message);
    }

    this.publishers.forEach(async (publisher) => {
      await publisher.stop();
    });

    this.subscribers.forEach(async (subscriber) => {
      await subscriber.stop();
    });
  }
}
