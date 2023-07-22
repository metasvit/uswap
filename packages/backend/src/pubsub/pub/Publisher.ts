import logger, { Logger } from "src/logger";
import { Config, Network } from "src/config/types";
import getConfig from "src/config";

export default abstract class Publisher {
  logger: Logger;
  redis: any;
  chainId: number;
  config: Config;

  abstract start(): Promise<void>;
  abstract stop(): Promise<void>;

  constructor(redis: any, network: Network) {
    this.logger = logger.child(
      {},
      { msgPrefix: `[${this.constructor.name}(${network})] ` }
    ) as Logger;
    this.redis = redis;
    this.chainId = network;
    this.config = getConfig();
  }
}
