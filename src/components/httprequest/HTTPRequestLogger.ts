import * as Logger from 'bunyan';
import {HTTPRequest, HTTPRequestResponse} from './HTTPRequest';
import {HTTPRequestDecorator} from './HTTPRequestDecorator';
import {HTTPRequestError} from './HTTPRequestError';
import {AsyncMeasurer} from '../statsd/AsyncMeasurer';
import {Measurable} from '../statsd/Measurable';

export class HTTPRequestLogger extends HTTPRequestDecorator {
  private logger: Logger;
  private readonly measurer: AsyncMeasurer;
  private request: HTTPRequest & Measurable<any>;

  public constructor(logger: Logger, request: HTTPRequest & Measurable<any>,  measurer: AsyncMeasurer) {
    super(request);

    this.logger = logger;
    this.measurer = measurer;
    this.request = request;
  }

  public async execute(): Promise<HTTPRequestResponse> {
    this.logger.debug({
      options: super.options
    }, 'Request options');

    let response: HTTPRequestResponse;

    try {
      response = await this.measurer.measure(this.request);
    } catch (error) {
      return this.handleError(error);
    }

    this.logger.debug({
      response: response
    }, 'Request response');

    return response;
  }

  private handleError(error: HTTPRequestError): never {
    this.logger.error({
      options: super.options,
      error:   error.toLogger(),
    }, 'Request error');

    throw error;
  }
}