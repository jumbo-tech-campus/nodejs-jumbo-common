import {HTTPRequestDecorator} from '../httprequest/HTTPRequestDecorator';
import {RetryerFactory} from './RetryerFactory';
import {Retryable} from './Retryable';
import {HTTPRequest, HTTPRequestResponse} from '../httprequest/HTTPRequest';
import {Measurable} from '../statsd/Measurable';

export class HTTPRequestRetryer extends HTTPRequestDecorator {
  private readonly retryerFactory: RetryerFactory;
  private readonly retryableRequest: Retryable & HTTPRequest & Measurable<HTTPRequestResponse>;

  public constructor(retryerFactory: RetryerFactory, retryableRequest: Retryable & HTTPRequest & Measurable<HTTPRequestResponse>) {
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