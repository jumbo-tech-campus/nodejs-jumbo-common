import {Retryable} from './Retryable';
import {StatsD} from 'hot-shots';
import {Measurable} from '../statsd/Measurable';

const backo = require('backo');

export class Retryer {
  private readonly statsD: StatsD;
  private readonly retryable: Retryable & Measurable<any>;
  private readonly backo: any;
  private readonly maxAttempts: number;

  public constructor(logger: StatsD, retryable: Retryable & Measurable<any>, maxAttempts: number, minInterval: number, maxInterval: number, jitter: number) {
    this.statsD      = logger;
    this.retryable   = retryable;
    this.backo       = new backo({
      min:    minInterval,
      max:    maxInterval,
      jitter: jitter,
    });
    this.maxAttempts = maxAttempts - 1;
  }

  public async execute(): Promise<void> {
    if (await this.shouldAttempt()) {
      this.statsD.increment(this.retryable.measurePrefix + 'retries', 1, this.retryable.tags.concat('attempt:' + this.backo.attempt()));

      await this.wait(this.backo.duration());

      await this.execute();
    }
  }

  private async shouldAttempt(): Promise<boolean> {
    const attemptAllowed = this.backo.attempts <= this.maxAttempts;

    return (attemptAllowed && !await this.retryable.attempt());
  }

  private wait(interval: number): Promise<void> {
    return new Promise((resolve: () => void) => setTimeout(resolve, interval));
  }
}