import {HTTPRequestDecorator} from './HTTPRequestDecorator';
import {RetryerFactory} from '../retryer/RetryerFactory';
import {Retryable} from '../retryer/Retryable';
import {HTTPRequest, HTTPRequestResponse} from './HTTPRequest';

export class HTTPRequestRetryer extends HTTPRequestDecorator {
  private readonly retryerFactory: RetryerFactory;
  private readonly retryableRequest: Retryable & HTTPRequest;

  public constructor(retryerFactory: RetryerFactory, retryableRequest: Retryable & HTTPRequest) {
    super(retryableRequest);

    this.retryerFactory   = retryerFactory;
    this.retryableRequest = retryableRequest;
  }

  public async execute(): Promise<HTTPRequestResponse> {
    const retryer = this.retryerFactory.create(this.retryableRequest);
    await retryer.execute();

    return super.execute();
  }
}