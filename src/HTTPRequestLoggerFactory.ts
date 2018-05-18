import {HTTPRequestFactory} from './HTTPRequestFactory';
import * as Logger from 'bunyan';
import {HTTPRequest, HTTPRequestOptions} from './HTTPRequest';
import {HTTPRequestLogger} from './HTTPRequestLogger';

export class HTTPRequestLoggerFactory implements HTTPRequestFactory {
  private readonly httpRequestFactory: HTTPRequestFactory;
  private readonly logger: Logger;

  public constructor(httpRequestFactory: HTTPRequestFactory, logger: Logger) {
    this.httpRequestFactory = httpRequestFactory;
    this.logger             = logger;
  }

  public create(options: HTTPRequestOptions): HTTPRequest {
    const request: HTTPRequest = this.httpRequestFactory.create(options);

    return new HTTPRequestLogger(this.logger, request);
  }
}
