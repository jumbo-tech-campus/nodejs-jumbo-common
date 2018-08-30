import {objectToTags} from '../statsd/objectToTags';
import {Measurable} from '../statsd/Measurable';
import {HTTPRequest} from './HTTPRequest';
import {HTTPRequestDecorator} from './HTTPRequestDecorator';

export class HTTPRequestMeasurer extends HTTPRequestDecorator implements Measurable<any> {
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