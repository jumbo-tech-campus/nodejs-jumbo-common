import {Retryer} from './Retryer';
import {Retryable} from './Retryable';

export class RetryerFactory {
  private readonly maxAttempts: number;
  private readonly minInterval: number;
  private readonly maxInterval: number;
  private readonly jitter: number;

  public constructor(maxAttempts: number, minInterval: number, maxInterval: number, jitter: number) {
    this.maxAttempts = maxAttempts;
    this.minInterval = minInterval;
    this.maxInterval = maxInterval;
    this.jitter      = jitter;
  }

  public create(retryable: Retryable): Retryer {
    return new Retryer(retryable, this.maxAttempts + 1, this.minInterval, this.maxInterval, this.jitter);
  }
}