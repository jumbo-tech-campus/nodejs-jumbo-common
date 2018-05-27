import {Retryable} from './Retryable';

const backo = require('backo');

export class Retryer {
  private readonly retryable: Retryable;
  private readonly backo: any;
  private readonly maxAttempts: number;

  public constructor(retryable: Retryable, maxAttempts: number, minInterval: number, maxInterval: number, jitter: number) {
    this.retryable   = retryable;
    this.backo       = new backo({
      min:    minInterval,
      max:    maxInterval,
      jitter: jitter
    });
    this.maxAttempts = maxAttempts - 1;
  }

  public async execute(): Promise<void> {
    if (await this.shouldAttempt()) {
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