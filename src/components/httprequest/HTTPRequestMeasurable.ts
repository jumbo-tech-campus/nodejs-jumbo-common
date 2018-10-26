import {objectToTags} from '../statsd/objectToTags';
import {Measurable} from '../statsd/Measurable';
import {HTTPRequest, HTTPRequestResponse} from './HTTPRequest';
import {HTTPRequestDecorator} from './HTTPRequestDecorator';

export class HTTPRequestMeasurable extends HTTPRequestDecorator implements Measurable<HTTPRequestResponse> {
  public measurePrefix: string;
  public request: HTTPRequest;
  private response?: HTTPRequestResponse;

  public constructor(request: HTTPRequest) {
    super(request);
    this.request = request;
    this.measurePrefix = 'httprequest.';

  }

  public get tags(): string[] {
    const options: Record<string, unknown> = JSON.parse(JSON.stringify(this.request.options));

    delete options.body;

    if (this.response) {
      options.statusCode = this.response.statusCode;
    }

    return objectToTags(options);
  }

  public async execute(): Promise<HTTPRequestResponse> {
    this.response = await this.request.execute();

    return this.response;
  }
}