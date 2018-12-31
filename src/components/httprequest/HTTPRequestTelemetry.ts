import * as Logger from 'bunyan';
import {HTTPRequest, HTTPRequestResponse} from './HTTPRequest';
import {HTTPRequestDecorator} from './HTTPRequestDecorator';
import {HTTPRequestError} from './HTTPRequestError';
import {AsyncMeasurer} from '../telemetry/AsyncMeasurer';
import {Measurable} from '../telemetry/Measurable';
import {HTTPRequestMeasurable} from './HTTPRequestMeasurable';

export class HTTPRequestTelemetry extends HTTPRequestDecorator {
  public request: HTTPRequest & Measurable<HTTPRequestResponse>;
  private logger: Logger;
  private readonly measurer: AsyncMeasurer;
  private readonly defaultStatsDTags?: string[];

  public constructor(logger: Logger, request: HTTPRequestMeasurable, measurer: AsyncMeasurer, defaultStatsDTags?: string[]) {
    super(request);

    this.logger            = logger;
    this.measurer          = measurer;
    this.request           = request;
    this.defaultStatsDTags = defaultStatsDTags;
  }

  public async execute(): Promise<HTTPRequestResponse> {
    this.logger.debug({
      options: super.options,
    }, 'Request options');

    let response: HTTPRequestResponse;

    try {
      response = await this.measurer.measure(this.request, this.defaultStatsDTags);
    } catch (error) {
      return this.handleError(error);
    }

    this.logger.debug({
      response: response,
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