import {objectToTags} from '../statsd/objectToTags';
import {Measurable} from '../statsd/Measurable';
import {HTTPRequest, HTTPRequestResponse} from './HTTPRequest';
import {HTTPRequestDecorator} from './HTTPRequestDecorator';

export class HTTPRequestMeasurable extends HTTPRequestDecorator implements Measurable<HTTPRequestResponse> {
  public measurePrefix: string;
  public request: HTTPRequest;

  public constructor(request: HTTPRequest) {
    super(request);
    this.request = request;
    this.measurePrefix = 'httprequest.';

  }

  public get tags(): string[] {
    return objectToTags(this.request.options);
  }
}