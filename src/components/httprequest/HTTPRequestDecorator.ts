import {HTTPRequest, HTTPRequestOptions, HTTPRequestResponse} from './HTTPRequest';

export abstract class HTTPRequestDecorator implements HTTPRequest {
  public request: HTTPRequest;

  protected constructor(request: HTTPRequest) {
    this.request = request;
  }

  public execute(): Promise<HTTPRequestResponse> {
    return this.request.execute();
  }

  public get options(): HTTPRequestOptions {
    return this.request.options;
  }
}