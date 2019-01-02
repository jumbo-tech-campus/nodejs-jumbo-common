import {HTTPRequestResponse} from './HTTPRequest';
import {HTTPRequestDecorator} from './HTTPRequestDecorator';
import {AsyncTelemetry} from '../telemetry/AsyncTelemetry';
import {HTTPRequestMeasurable} from './HTTPRequestMeasurable';

export class HTTPRequestTelemetry extends HTTPRequestDecorator {
  public readonly request: HTTPRequestMeasurable;

  private readonly asyncTelemetry: AsyncTelemetry;
  private readonly defaultTags?: string[];

  public constructor(request: HTTPRequestMeasurable,
                     asyncTelemetry: AsyncTelemetry,
                     defaultTags?: string[]) {
    super(request);

    this.request        = request;
    this.asyncTelemetry = asyncTelemetry;
    this.defaultTags    = defaultTags;
  }

  public execute(): Promise<HTTPRequestResponse> {
    return this.asyncTelemetry.execute(this.request, this.defaultTags);
  }
}