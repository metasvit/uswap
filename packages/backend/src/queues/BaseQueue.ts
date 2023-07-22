import { Job, Queue, QueueOptions, Worker, WorkerOptions } from "bullmq";
import tracer from "dd-trace";

import getConnection from "./connection";
import AsyncStorage from "src/utils/AsyncStorage";
import { Serializable } from "src/types";
import logger, { Logger } from "src/logger";
import getConfig from "src/config";

export type QueueHandler<T> = (job: Job<T, void>) => Promise<void>;

type Handler<T> = (job: Job<T, void>) => Promise<void>;

export type BaseQueueOptions = WorkerOptions &
  QueueOptions & {
    notifyAfterAttempt?: number;
  };

export default abstract class BaseQueue<T extends Serializable> extends Queue<
  T,
  void
> {
  logger: Logger;
  protected worker?: Worker;
  protected _handler?: Handler<T>;

  constructor(name: string, options: BaseQueueOptions) {
    options.defaultJobOptions = {
      attempts: 5,
      removeOnComplete: 1000,
      removeOnFail: 1000,
      ...options.defaultJobOptions,
    };
    options.connection = getConnection(getConfig().REDIS_URL);

    super(name, options);

    this.logger = logger.child({}, { msgPrefix: `[${name}] ` }) as Logger;
  }

  abstract launch(): Promise<void>;

  handler(callback: QueueHandler<T>) {
    this._handler = (job: Job<T, void>): Promise<void> => {
      return tracer.trace("bull.process", { resource: this.name }, async () => {
        return this.handle(job, callback);
      });
    };
    return this;
  }

  logId(job: Job<T, void>): string {
    return `${this.name}#${job.id}`;
  }

  // This is overridden by `RepeatableQueue`.
  traceId(job: Job<T, void>): string {
    return this.logId(job);
  }

  async inspect(): Promise<void> {
    const counts = await this.getJobCounts(
      "waiting",
      "active",
      "delayed",
      "completed",
      "failed"
    );
    this.logger.info(`${this.name} jobs: ${JSON.stringify(counts)}`);
  }

  async close(): Promise<void> {
    await this.worker?.close();
    await super.close();
  }

  protected buildWorker(): Worker {
    this.worker =
      this.worker ?? new Worker(this.name, this._handler, this.opts);

    this.worker.on("failed", this.onFailed.bind(this));
    this.worker.on("failed", (job) => {
      this.logger.warn(
        `Failed Job: ${this.name} ${job?.id} ${JSON.stringify(job)}`,
        job
      );
    });
    this.worker.on("active", (job) => {
      this.log(job, "Active");
    });
    this.worker.on("completed", (job, result) => {
      this.log(job, `Completed with result ${JSON.stringify(result)}`);
    });
    this.worker.on("stalled", (jobId: string) =>
      this.logger.info(`${this.name}#${jobId} is Stalled`)
    );

    this.on("removed", (job) => {
      this.log(job, "Removed");
    });

    return this.worker;
  }

  protected async onFailed(job: Job<T, void> | undefined, error: Error) {
    if (job) {
      this.log(job, `Failed on ${job.attemptsMade} attempt: ${error.stack}`);
    } else {
      this.logger.error(`Failed: ${error.stack}`);
    }
  }

  protected log(job: Job<T, void>, message: string, durationMs?: number): void {
    this.logger.info(`${message} ${this.serialize(job)}`, {
      durationMs,
      requestId: this.traceId(job),
    });
  }

  protected handle(
    job: Job<T, void>,
    callback: QueueHandler<T>
  ): Promise<void> {
    return this.runWithTraceId(job, callback);
  }

  protected runWithTraceId(
    job: Job<T, void>,
    callback: QueueHandler<T>
  ): Promise<void> {
    return AsyncStorage.run({ traceId: this.traceId(job) }, async () => {
      return await callback(job);
    });
  }

  protected ensureHandler() {
    if (!this._handler) {
      throw new Error(`Handler is not defined for queue ${this.name}`);
    }
  }

  protected serialize(job: Job<T, void>): string {
    return JSON.stringify(job.data);
  }
}
