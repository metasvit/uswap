import pino from "pino";
import { PossibleFunction } from "./types";
import axios from "axios";

type BenchmarkLabel<T> = string | ((result: T) => string);
type BenchmarkCallback<T> = PossibleFunction<Promise<T>>;

interface LoggerExtras {
  benchmark<T>(
    label: BenchmarkLabel<T>,
    promise: BenchmarkCallback<T>
  ): Promise<T>;
}

export type Logger = pino.Logger & LoggerExtras;

const logger: Logger = pino({
  transport: {
    pipeline: [
      {
        // Use target: 'pino/file' to write to stdout
        // without any change.
        target: "pino-pretty",
      },
    ],
  },
}) as any;

logger.benchmark = async function <T>(
  label: BenchmarkLabel<T>,
  promise: BenchmarkCallback<T>
): Promise<T> {
  const profiler = process.hrtime();
  if (promise instanceof Function) {
    promise = promise();
  }
  const result = await promise;
  const message = typeof label === "string" ? label : label(result);
  const elapsed = process.hrtime(profiler);
  logger.info(
    `[${Math.round(elapsed[0] * 1000 + elapsed[1] / 1000000)} ms] ${message}`
  );
  return result;
};

export default logger;

// Axios logger
axios.interceptors.request.use((config) => {
  config.headers["request-startTime"] = process.hrtime();
  return config;
});

axios.interceptors.response.use((response) => {
  const start = response.config.headers["request-startTime"];
  const elapsed = process.hrtime(start);
  logger.info(
    `[Axios][${Math.round(elapsed[0] * 1000 + elapsed[1] / 1000000)} ms] ${
      response.request.method
    } ${response.config.url}`
  );
  return response;
});
