import {HTTPRequestResponse} from './HTTPRequest';
import {HTTPRequestDecorator} from './HTTPRequestDecorator';
import {AsyncTelemetry} from '../telemetry/AsyncTelemetry';
import {HTTPRequestMeasurable} from './HTTPRequestMeasurable';
import * as Logger from 'bunyan';

export class HTTPRequestTelemetry extends HTTPRequestDecorator {
  public readonly executable: HTTPRequestMeasurable;

  private readonly logger: Logger;
  private readonly asyncTelemetry: AsyncTelemetry;
  private readonly defaultTags?: string[];

  public constructor(request: HTTPRequestMeasurable,
                     logger: Logger,
                     asyncTelemetry: AsyncTelemetry,
                     defaultTags?: string[]) {
    super(request);

    this.executable     = request;
    this.logger         = logger;
    this.asyncTelemetry = asyncTelemetry;
    this.defaultTags    = defaultTags;
  }

  public async execute(): Promise<HTTPRequestResponse> {
    const response = await this.asyncTelemetry.execute(this.executable, this.defaultTags);

    if (response.statusCode >= 400) {
      this.logger.warn({
        request:  this.options,
        response: response,
      }, 'Unsuccessful HTTP Response');
    }

    return response;
  }
}