import {HTTPRequest, HTTPRequestResponse} from './HTTPRequest';
import {HTTPRequestDecorator} from './HTTPRequestDecorator';
import {AsyncTelemetry} from '../telemetry/AsyncTelemetry';

export class HTTPRequestTelemetry extends HTTPRequestDecorator {
  private readonly asyncTelemetry: AsyncTelemetry<HTTPRequestResponse>;

  public constructor(request: HTTPRequest,
                     asyncTelemetry: AsyncTelemetry<HTTPRequestResponse>) {
    super(request);

    this.asyncTelemetry = asyncTelemetry;
  }

  public execute(): Promise<HTTPRequestResponse> {
    return this.asyncTelemetry.execute();
  }
}