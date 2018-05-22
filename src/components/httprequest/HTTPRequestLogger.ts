import * as Logger from 'bunyan';
import {HTTPRequest, HTTPRequestResponse} from './HTTPRequest';
import {HTTPRequestDecorator} from './HTTPRequestDecorator';
import {HTTPRequestError} from './HTTPRequestError';

export class HTTPRequestLogger extends HTTPRequestDecorator {
  private logger: Logger;

  public constructor(logger: Logger, request: HTTPRequest) {
    super(request);

    this.logger = logger;
  }

  public async execute(): Promise<HTTPRequestResponse> {
    this.logger.debug({
      options: super.options
    }, 'Request options');

    let response: HTTPRequestResponse;

    try {
      response = await super.execute();
    } catch (error) {
      return this.handleError(error);
    }

    this.logger.debug({
      response: response
    }, 'Request response');

    return response;
  }

  private handleError(error: HTTPRequestError): never {
    this.logger.error({
      options: super.options,
      error:   error.message,
    }, 'Request error');

    throw error;
  }
}