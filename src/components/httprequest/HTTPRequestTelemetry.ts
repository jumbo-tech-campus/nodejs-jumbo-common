import {HTTPRequestResponse} from './HTTPRequest';
import {HTTPRequestDecorator} from './HTTPRequestDecorator';
import {HTTPRequestMeasurable} from './HTTPRequestMeasurable';
import {AsyncTelemetry} from '../telemetry/AsyncTelemetry';

export class HTTPRequestTelemetry extends HTTPRequestDecorator {
  private readonly asyncTelemetry: AsyncTelemetry<HTTPRequestResponse>;

  public constructor(request: HTTPRequestMeasurable,
                     asyncTelemetry: AsyncTelemetry<HTTPRequestResponse>) {
    super(request);

    this.asyncTelemetry = asyncTelemetry;
  }

  public execute(): Promise<HTTPRequestResponse> {
    return this.asyncTelemetry.execute();
  }
}