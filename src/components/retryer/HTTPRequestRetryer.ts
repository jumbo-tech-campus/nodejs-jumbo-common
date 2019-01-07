import {HTTPRequestDecorator} from '../httprequest/HTTPRequestDecorator';
import {RetryerFactory} from './RetryerFactory';
import {Retryable} from './Retryable';
import {HTTPRequest, HTTPRequestResponse} from '../httprequest/HTTPRequest';

export class HTTPRequestRetryer extends HTTPRequestDecorator {
  private readonly retryerFactory: RetryerFactory;
  private readonly retryableRequest: Retryable & HTTPRequest;

  public constructor(retryerFactory: RetryerFactory, retryableRequest: Retryable & HTTPRequest) {
    super(retryableRequest);

    this.retryerFactory   = retryerFactory;
    this.retryableRequest = retryableRequest;
  }

  public async execute(): Promise<HTTPRequestResponse> {
    await this.retryerFactory.create(this.retryableRequest).execute();

    return super.execute();
  }
}