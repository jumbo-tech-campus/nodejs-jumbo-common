import {HTTPRequestFactory} from './HTTPRequestFactory';
import {HTTPRequest, HTTPRequestOptions} from './HTTPRequest';
import {HTTPRequestTelemetry} from './HTTPRequestTelemetry';
import {HTTPRequestMeasurable} from './HTTPRequestMeasurable';
import {AsyncTelemetry} from '../telemetry/AsyncTelemetry';
import Logger from 'bunyan';

export class HTTPRequestTelemetryFactory implements HTTPRequestFactory {
  private readonly httpRequestFactory: HTTPRequestFactory;
  private readonly logger: Logger;
  private readonly telemetry: AsyncTelemetry;

  public constructor(httpRequestFactory: HTTPRequestFactory, logger: Logger, telemetry: AsyncTelemetry) {
    this.httpRequestFactory = httpRequestFactory;
    this.logger             = logger;
    this.telemetry          = telemetry;
  }

  public create(options: HTTPRequestOptions): HTTPRequest {
    const request: HTTPRequest = this.httpRequestFactory.create(options);

    return new HTTPRequestTelemetry(new HTTPRequestMeasurable(request), this.logger, this.telemetry);
  }
}
