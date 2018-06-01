import {Retryer} from './Retryer';
import {Retryable} from './Retryable';
import * as Logger from 'bunyan';

export class RetryerFactory {
  private readonly logger: Logger;
  private readonly maxAttempts: number;
  private readonly minInterval: number;
  private readonly maxInterval: number;
  private readonly jitter: number;

  public constructor(logger: Logger, maxAttempts: number, minInterval: number, maxInterval: number, jitter: number) {
    this.logger      = logger;
    this.maxAttempts = maxAttempts;
    this.minInterval = minInterval;
    this.maxInterval = maxInterval;
    this.jitter      = jitter;
  }

  public create(retryable: Retryable): Retryer {
    return new Retryer(this.logger, retryable, this.maxAttempts + 1, this.minInterval, this.maxInterval, this.jitter);
  }
}