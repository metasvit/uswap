import logger from "src/logger";
import { sleep } from "./misc";

export type RetryOptions = {
  attempts?: number;
  errors?: string[];
  wait?: number; // ms
};

const DefaultRetryOptions: RetryOptions = {
  attempts: 3,
  errors: undefined,
  wait: 0,
};

const Exceptions = {
  async retry<T>(
    options: RetryOptions,
    callback: () => Promise<T>
  ): Promise<T> {
    let failReason: Error | undefined;
    const { errors, wait, attempts } = { ...DefaultRetryOptions, ...options };
    for (let i = 0; i < attempts!; i++) {
      try {
        return await callback();
      } catch (error) {
        if (typeof error !== "object") {
          throw error;
        }
        if (!errors || errors.some((v) => error.name === v)) {
          logger.error(`#Retry attempt ${i} ${error.stack}`);
          if (wait) {
            await sleep(wait);
          }
        } else {
          throw error;
        }
        failReason = error as Error;
      }
    }
    throw failReason;
  },
};

export default Exceptions;
