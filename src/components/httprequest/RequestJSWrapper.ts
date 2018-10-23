/* tslint:disable:no-unsafe-any */
import requestPromise from 'request-promise-native';
import {HTTPRequest, HTTPRequestResponse} from './HTTPRequest';
import {HTTPRequestError} from './HTTPRequestError';
import {HTTPRequestTimedoutError} from './HTTPRequestTimedoutError';

const baseRequest = requestPromise.defaults({
  gzip: true,
  pool: {
    maxSockets: 10240,
  },
});

export class RequestJSWrapper implements HTTPRequest {
  public readonly options: requestPromise.Options;

  public constructor(options: requestPromise.Options) {
    this.options = options;
  }

  public async execute(): Promise<HTTPRequestResponse> {
    let response: requestPromise.FullResponse;
    try {
      response = await baseRequest({
        proxy:                   false,
        ...this.options,
        resolveWithFullResponse: true,
        simple:                  false,
      }).promise();
    } catch (requestError) {
      if (requestError.error.message === 'ETIMEDOUT') {
        throw new HTTPRequestTimedoutError('Request timed out');
      }

      throw new HTTPRequestError(requestError.error.message);
    }

    return {
      statusCode: response.statusCode,
      body:       response.body,
      headers:    response.headers,
    };
  }
}
