import {Measurable} from '../statsd/Measurable';
import {HTTPRequest, HTTPRequestResponse} from './HTTPRequest';
import {HTTPRequestDecorator} from './HTTPRequestDecorator';

export class HTTPRequestMeasurable extends HTTPRequestDecorator implements Measurable<HTTPRequestResponse> {
  public measurePrefix: string;
  public request: HTTPRequest;
  private response?: HTTPRequestResponse;

  public constructor(request: HTTPRequest) {
    super(request);
    this.request       = request;
    this.measurePrefix = 'httprequest.';
  }

  public get tags(): string[] {
    const tags: string[] = [
      `url:${this.request.options.url}`,
      `method:${this.request.options.method || 'get'}`,
    ];

    if (this.request.options.baseUrl) {
      tags.push(`baseurl:${this.request.options.baseUrl}`);
    }

    if (this.response) {
      tags.push(`statuscode:${this.response.statusCode}`);

      if (this.response.statusCode >= 200 && this.response.statusCode < 300) {
        tags.push(`result:success`);
      } else if (this.response.statusCode >= 400 && this.response.statusCode < 500) {
        tags.push(`result:badrequest`);
      } else if (this.response.statusCode >= 500) {
        tags.push(`result:internal`);
      } else {
        tags.push(`result:unknown`);
      }
    } else {
      tags.push(`result:failed`);
    }

    return tags;
  }

  public async execute(): Promise<HTTPRequestResponse> {
    this.response = await this.request.execute();

    return this.response;
  }
}