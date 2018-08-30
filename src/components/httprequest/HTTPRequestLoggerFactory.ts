import {HTTPRequestFactory} from './HTTPRequestFactory';
import * as Logger from 'bunyan';
import {HTTPRequest, HTTPRequestOptions} from './HTTPRequest';
import {HTTPRequestLogger} from './HTTPRequestLogger';
import {AsyncMeasurer} from '../statsd/AsyncMeasurer';
import {HTTPRequestMeasurer} from './HTTPRequestMeasurer';

export class HTTPRequestLoggerFactory implements HTTPRequestFactory {
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
    return new HTTPRequestLogger(this.logger, new HTTPRequestMeasurer(request), this.measurer);
  }
}
