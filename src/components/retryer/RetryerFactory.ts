import {StatsD} from 'hot-shots';
import {Measurable} from '../statsd/Measurable';
import {Retryable} from './Retryable';
import {Retryer} from './Retryer';

export class RetryerFactory {
  private readonly statsD: StatsD;
  private readonly maxAttempts: number;
  private readonly minInterval: number;
  private readonly maxInterval: number;
  private readonly jitter: number;

  public constructor(statsD: StatsD, maxAttempts: number, minInterval: number, maxInterval: number, jitter: number) {
    this.statsD      = statsD;
    this.maxAttempts = maxAttempts;
    this.minInterval = minInterval;
    this.maxInterval = maxInterval;
    this.jitter      = jitter;
  }

  public create(retryable: Retryable & Measurable<unknown>): Retryer {
    return new Retryer(this.statsD, retryable, this.maxAttempts + 1, this.minInterval, this.maxInterval, this.jitter);
  }
}