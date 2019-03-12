import {Measurable} from '../telemetry/Measurable';
import {HTTPRequest, HTTPRequestResponse} from './HTTPRequest';
import {HTTPRequestDecorator} from './HTTPRequestDecorator';
import {statusCodeToTag} from './statusCodeToTag';

export class HTTPRequestMeasurable extends HTTPRequestDecorator implements Measurable<HTTPRequestResponse> {
  public request: HTTPRequest;
  public readonly type: string = 'HTTPRequest';
  private response?: HTTPRequestResponse;

  public constructor(request: HTTPRequest) {
    super(request);
    this.request = request;
  }

  public get name(): string {
    return this.request.constructor.name;
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
      tags.push(`result:${statusCodeToTag(this.response.statusCode)}`);
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