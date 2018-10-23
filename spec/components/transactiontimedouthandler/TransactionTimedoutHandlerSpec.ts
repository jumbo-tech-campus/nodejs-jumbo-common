import {TransactionTimedoutHandler} from '../../../src/components/transactiontimedouthandler/TransactionTimedoutHandler';

describe('A TimeoutHandler', () => {
  it('should be able to return true', () => {
    const timeoutHandler = new TransactionTimedoutHandler(1, 0);

    expect(timeoutHandler.timedOut(2000)).toEqual(true);
  });

  it('should be able to return false', () => {
    const timeoutHandler = new TransactionTimedoutHandler(1, 0);

    expect(timeoutHandler.timedOut(500)).toEqual(false);
  });
});
