import * as request from 'request-promise-native';
import {HTTPRequest, HTTPRequestFactory, HTTPRequestResponse} from './HTTPRequest';

const baseRequest = request.defaults({
  gzip: true,
  pool: {
    maxSockets: 10240
  }
});

interface RequestError {
  error: Error;
}

export class RequestJSWrapper implements HTTPRequest {
  public readonly options: request.Options;

  public constructor(options: request.Options) {
    this.options = options;
  }

  public async execute(): Promise<HTTPRequestResponse> {
    let response: request.FullResponse;
    try {
      response = await baseRequest({
        proxy:                   false,
        ...this.options,
        resolveWithFullResponse: true,
        simple:                  false,
      });
    } catch (requestError) {
      return this.handleError(requestError);
    }

    return {
      statusCode: response.statusCode,
      body:       response.body,
      headers:    response.headers,
    };
  }

  private handleError(requestError: RequestError): never {
    throw new Error(requestError.error.message);
  }
}

export class RequestJSWrapperFactory implements HTTPRequestFactory {
  public create(options: request.Options): HTTPRequest {
    return new RequestJSWrapper(options);
  }
}
