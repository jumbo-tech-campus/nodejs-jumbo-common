/* tslint:disable:no-unsafe-any:restrict-plus-operands no-unsafe-any no-var-requires no-require-imports */
import {StatsD} from 'hot-shots';
import {Measurable} from '../statsd/Measurable';
import {Retryable} from './Retryable';

const backo = require('backo');

export class Retryer {
  private readonly statsD: StatsD;
  private readonly retryable: Retryable & Measurable<unknown>;
  private readonly backo: typeof backo;
  private readonly maxAttempts: number;

  public constructor(logger: StatsD, retryable: Retryable & Measurable<unknown>, maxAttempts: number, minInterval: number, maxInterval: number, jitter: number) {
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
      const attempt = this.backo.attempts + 1;
      this.statsD.increment(`${this.retryable.measurePrefix}retries`, 1, this.retryable.tags.concat(`retryAttempt:${attempt}`));

      await this.wait(this.backo.duration());

      await this.execute();
    }
  }

  private async shouldAttempt(): Promise<boolean> {
    const attemptAllowed = this.backo.attempts <= this.maxAttempts;

    return (attemptAllowed && !await this.retryable.attempt());
  }

  private async wait(interval: number): Promise<void> {
    await new Promise((resolve: () => void) => setTimeout(resolve, interval));
  }
}