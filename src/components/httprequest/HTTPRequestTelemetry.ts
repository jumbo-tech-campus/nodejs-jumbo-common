import {HTTPRequestResponse} from './HTTPRequest';
import {HTTPRequestDecorator} from './HTTPRequestDecorator';
import {AsyncTelemetry} from '../telemetry/AsyncTelemetry';
import {HTTPRequestMeasurable} from './HTTPRequestMeasurable';

export class HTTPRequestTelemetry extends HTTPRequestDecorator {
  public readonly request: HTTPRequestMeasurable;

  private readonly asyncTelemetry: AsyncTelemetry;

  public constructor(request: HTTPRequestMeasurable,
                     asyncTelemetry: AsyncTelemetry) {
    super(request);

    this.asyncTelemetry = asyncTelemetry;
    this.request = request;
  }

  public execute(): Promise<HTTPRequestResponse> {
    return this.asyncTelemetry.execute(this.request);
  }
}