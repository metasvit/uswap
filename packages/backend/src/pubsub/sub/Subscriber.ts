import { Network } from "src/config/types";
import logger, { Logger } from "src/logger";

export default abstract class Subscriber {
  logger: Logger;
  redis: any;
  chainId: number;

  abstract start(): Promise<void>;
  abstract stop(): Promise<void>;

  constructor(redis: any, network: Network) {
    this.logger = logger.child(
      {},
      { msgPrefix: `[${this.constructor.name}] ` }
    ) as Logger;
    this.redis = redis;
    this.chainId = network;
  }
}
