import * as Logger from 'bunyan';
import {AsyncMeasurer} from '../statsd/AsyncMeasurer';
import {HTTPRequest, HTTPRequestOptions} from './HTTPRequest';
import {HTTPRequestFactory} from './HTTPRequestFactory';
import {HTTPRequestMeasurable} from './HTTPRequestMeasurable';
import {HTTPRequestTelemetry} from './HTTPRequestTelemetry';

export class HTTPRequestTelemetryFactory implements HTTPRequestFactory {
  private readonly httpRequestFactory: HTTPRequestFactory;
  private readonly logger: Logger;
  private readonly measurer: AsyncMeasurer;

  public constructor(httpRequestFactory: HTTPRequestFactory, logger: Logger, measurer: AsyncMeasurer) {
    this.httpRequestFactory = httpRequestFactory;
    this.logger             = logger;
    this.measurer           = measurer;
  }

  public create(options: HTTPRequestOptions): HTTPRequest {
    const request: HTTPRequest = this.httpRequestFactory.create(options);

    return new HTTPRequestTelemetry(this.logger, new HTTPRequestMeasurable(request), this.measurer);
  }
}
