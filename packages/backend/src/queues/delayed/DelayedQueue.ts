import { v4 as uuid } from "uuid";
import { Job, JobsOptions, WorkerOptions } from "bullmq";
import { Serializable } from "src/types";
import BaseQueue, { BaseQueueOptions } from "../BaseQueue";
import { backoffStrategies } from "../BackoffStrategies";

export type JobIdGenerator<T> = (data: T) => string;
export type DelayedQueueOptions<T> = WorkerOptions &
  BaseQueueOptions & {
    jobIdGenerator?: JobIdGenerator<T>;
  };

const JOB_ID_PREFIX = "id_";
const MAX_STALLED_COUNT = 10;

export default class DelayedQueue<T extends Serializable> extends BaseQueue<T> {
  static DefaultBackoff = { type: "exponential", delay: 1 * 1000 } as const;
  readonly jobIdGenerator: JobIdGenerator<T>;

  constructor(name: string, options?: DelayedQueueOptions<T>) {
    options = options || ({} as DelayedQueueOptions<T>);
    options.settings = options.settings || {};
    options.maxStalledCount = options.maxStalledCount || MAX_STALLED_COUNT;
    options.defaultJobOptions = {
      attempts: 30,
      backoff: DelayedQueue.DefaultBackoff,
      stackTraceLimit: 5,
      ...options.defaultJobOptions,
    };
    options.settings.backoffStrategy = backoffStrategies;

    super(name, options as BaseQueueOptions);

    this.jobIdGenerator =
      options.jobIdGenerator || (() => DelayedQueue.addJobIdPrefix(uuid()));
  }

  static addJobIdPrefix(id: string | number): string {
    return JOB_ID_PREFIX + id;
  }

  /* Removes the necessity to specify a job name compared to #add method */
  async enqueue(data: T, opts?: JobsOptions): Promise<Job<T>> {
    return this.add(JSON.stringify(data), data, opts);
  }

  async add(name: string, data: T, opts?: JobsOptions): Promise<Job<T, void>> {
    opts = opts || {};
    if (!opts.jobId) {
      opts.jobId = this.jobIdGenerator(data as T).toString();
    }

    this.verifyJobId(opts.jobId);

    const job: Job<T> = await this.logger.benchmark(
      (result) => `Enqueued ${this.logId(result)} ${name}`,
      super.add(name, data as T, opts)
    );

    return job;
  }

  async removeJob(jobId: string | number): Promise<boolean> {
    const job = await this.getJob(jobId.toString());
    await job?.remove();
    return !!job;
  }

  async launch(): Promise<void> {
    this.ensureHandler();
    this.buildWorker();
  }

  private verifyJobId(id: string) {
    if (`${parseInt(id, 10)}` === id) {
      // this check will become redundant after bull-mq throw an error on their side. Probably after bull-mq upgrade to v4.*
      throw new Error(
        "Custom Ids should not be integers: https://github.com/taskforcesh/bullmq/pull/1569"
      );
    }
  }
}
