import {HTTPRequestFactory} from './HTTPRequestFactory';
import * as Logger from 'bunyan';
import {HTTPRequest, HTTPRequestOptions} from './HTTPRequest';
import {HTTPRequestTelemetry} from './HTTPRequestTelemetry';
import {AsyncMeasurer} from '../telemetry/AsyncMeasurer';
import {HTTPRequestMeasurable} from './HTTPRequestMeasurable';
import {AsyncTelemetry} from '../telemetry/AsyncTelemetry';

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
    let request: HTTPRequest = this.httpRequestFactory.create(options);

    return new HTTPRequestTelemetry(new HTTPRequestMeasurable(request), new AsyncTelemetry(this.logger, new HTTPRequestMeasurable(request), this.measurer));
  }
}
