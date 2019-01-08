import {HTTPRequestDecorator} from '../httprequest';
import {Retryable} from './Retryable';
import {HTTPRequest, HTTPRequestResponse} from '../httprequest';
import {objectToTags} from '../telemetry';

export class RetryableHTTPRequest extends HTTPRequestDecorator implements Retryable {
  private requestResult?: HTTPRequestResponse | Error;
  private result: 'noattempt' | 'failed' | 'success' = 'noattempt';

  public constructor(request: HTTPRequest) {
    super(request);
  }

  public get tags(): string[] {
    const tags: Record<string, unknown> = JSON.parse(JSON.stringify(this.options));

    delete tags.body;

    tags.result = this.result;

    if (!this.requestResult) {
      return objectToTags(tags);
    }

    tags.retryRequest = this.isRetryable(this.requestResult) ? 'yes' : 'no';

    if (!(this.requestResult instanceof Error)) {
      tags.statusCode = `${this.requestResult.statusCode}`;
    }

    return objectToTags(tags);
  }

  public async attempt(): Promise<boolean> {
    let requestResult: HTTPRequestResponse | Error;
    try {
      requestResult = await this.request.execute();

      this.result = 'success';
    } catch (error) {
      requestResult = error;

      this.result = 'failed';
    }

    this.requestResult = requestResult;

    return !this.isRetryable(requestResult);
  }

  public async execute(): Promise<HTTPRequestResponse> {
    if (!this.requestResult) {
      throw new Error('No attempt has been made for retryable request');
    }

    if (this.requestResult instanceof Error) {
      throw this.requestResult;
    }

    return this.requestResult;
  }

  public getLogInformation(): object {
    return this.options;
  }

  private isRetryable(requestResult: HTTPRequestResponse | Error): boolean {
    if (requestResult instanceof Error) {
      const isNotSocketTimedOut = requestResult.message !== 'Error: ESOCKETTIMEDOUT';
      const isNotConnectionRefused = !requestResult.message.startsWith('Error: connect ECONNREFUSED');

      return isNotSocketTimedOut && isNotConnectionRefused;
    } else {
      return requestResult.statusCode >= 500;
    }
  }
}