import request from 'request-promise-native';
import {HTTPRequest, HTTPRequestOptions, HTTPRequestResponse} from './HTTPRequest';

const baseRequest = request.defaults({
  gzip: true,
  pool: {
    maxSockets: 10240,
  },
});

export class RequestJSWrapper implements HTTPRequest {
  public readonly options: HTTPRequestOptions;

  public constructor(options: HTTPRequestOptions) {
    this.options = options;
  }

  public async execute(): Promise<HTTPRequestResponse> {
    const response = await baseRequest({
      proxy:                   false,
      ...this.options,
      resolveWithFullResponse: true,
      simple:                  false,
    }).promise();

    return {
      statusCode: response.statusCode,
      body:       response.body,
      headers:    response.headers,
    };
  }
}
