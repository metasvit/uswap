import getConfig from "src/config";
import BaseQueue, { BaseQueueOptions } from "../BaseQueue";
import { Job } from "bullmq";

export const TIMEZONE = 'Etc/UTC';

export type RepeatableQueueOptions = BaseQueueOptions & {
  pattern?: string;
  disabled?: boolean;
  every?: number; // This value is in milliseconds, good to use if job needs to run more often than every minute
};

export default class RepeatableQueue extends BaseQueue<Record<string, never>> {
  readonly pattern?: string;
  readonly disabled: boolean;
  readonly every?: number;

  constructor(name: string, options: RepeatableQueueOptions) {
    options.notifyAfterAttempt = options.notifyAfterAttempt || 2;

    super(name, options as BaseQueueOptions);

    if (options.pattern) {
      this.pattern = options.pattern;
    } else if (options.every) {
      this.every = options.every;
    }

    this.disabled =
      (options?.disabled ?? !getConfig().BULL.REPEATABLE_JOBS_ENABLE) ||
      (!options.pattern && !options.every);
  }

  add(...args: unknown[]): never {
    throw new Error(`Jobs can not be added to repeatable queue ${this.name}`);
  }

  async launch(): Promise<void> {
    this.ensureHandler();

    // Remove all jobs before start. It allows to clean redundent jobs.
    const jobs = await this.getRepeatableJobs();
    await Promise.all(jobs.map((job) => this.removeRepeatableByKey(job.key)));

    if (this.disabled) {
      await this.clean(0, 0, 'active');
      await this.clean(0, 0, 'delayed');
      await this.clean(0, 0, 'wait');
      return;
    }
    await this.buildWorker();

    await this.logger.benchmark(
      (result) =>
        `Scheduled ${this.logId(result)} [${this.pattern}] ${this.serialize(
          result,
        )}`,
      super.add(
        this.name,
        {},
        {
          repeat: {
            pattern: this.pattern,
            every: this.every,
            tz: TIMEZONE,
          },
        },
      ),
    );
  }

  traceId(job: Job<Record<string, never>>): string {
    // The main motivation for overriding the method is being able to filter
    // logs from repeatable jobs just by their name. We don't usually need to
    // filter just by one specific run of a job.
    return this.name;
  }
}
