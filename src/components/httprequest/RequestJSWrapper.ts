import * as request from 'request-promise-native';
import {HTTPRequest, HTTPRequestResponse} from './HTTPRequest';
import {HTTPRequestError} from './HTTPRequestError';

const baseRequest = request.defaults({
  gzip: true,
  pool: {
    maxSockets: 10240
  }
});

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
      throw new HTTPRequestError(requestError.error.message);
    }

    return {
      statusCode: response.statusCode,
      body:       response.body,
      headers:    response.headers,
    };
  }
}
