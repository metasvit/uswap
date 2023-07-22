import * as Queues from "./queues";
import BaseQueue from "./queues/BaseQueue";
import logger from "./logger";
import getConfig from "./config";

const bull = {
  async launch() {
    const queues = Object.values(Queues).filter(
      (q) => q instanceof BaseQueue
    ) as unknown as BaseQueue<any>[]; // eslint-disable-line @typescript-eslint/no-explicit-any
    logger.info(`Launching Redis Bull queues`);
    await Promise.all(queues.map((q) => q.launch()));
    logger.info(`Launched Redis Bull queues: ${getConfig().REDIS_URL}`);
  },

  async stop() {
    const queues = Object.values(Queues).filter(
      (q) => q instanceof BaseQueue
    ) as unknown as BaseQueue<any>[]; // eslint-disable-line @typescript-eslint/no-explicit-any
    logger.info(`Stopping Redis Bull queues`);
    await Promise.all(queues.map((q) => q.close()));
    logger.info(`Stopped Redis Bull queues`);
  },
};

export default bull;
