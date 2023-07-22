import logger from "src/logger";

export const sleep = (ms: number): Promise<void> =>
  logger.benchmark(
    `Sleeping`,
    new Promise((resolve) => setTimeout(resolve, ms)),
  );