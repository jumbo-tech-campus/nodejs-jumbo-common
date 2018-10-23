export class TransactionTimedoutHandler {
  private readonly transactionTimeoutInSeconds: number;
  private readonly transactionStartTimeStamp: number;

  public constructor(transactionTimeoutInSeconds: number, transactionStartTimeStamp: number) {
    this.transactionTimeoutInSeconds = transactionTimeoutInSeconds;
    this.transactionStartTimeStamp   = transactionStartTimeStamp;
  }

  public timedOut(timestamp: number): boolean {
    const secondsPassedSinceTransactionStart = (timestamp - this.transactionStartTimeStamp) / 1000;

    return secondsPassedSinceTransactionStart > this.transactionTimeoutInSeconds;
  }
}
