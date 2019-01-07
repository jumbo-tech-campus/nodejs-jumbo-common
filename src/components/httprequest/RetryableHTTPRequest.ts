import {HTTPRequestDecorator} from './HTTPRequestDecorator';
import {Retryable} from '../retryer/Retryable';
import {HTTPRequest, HTTPRequestResponse} from './HTTPRequest';
import {objectToTags} from '../telemetry/objectToTags';

export class RetryableHTTPRequest extends HTTPRequestDecorator implements Retryable {
  private requestResult?: HTTPRequestResponse | Error;

  public constructor(request: HTTPRequest) {
    super(request);
  }

  public get tags(): string[] {
    const tags: Record<string, unknown> = JSON.parse(JSON.stringify(this.options));

    delete tags.body;

    if (this.requestResult) {
      tags.retryRequest = this.isRetryable(this.requestResult) ? 'yes' : 'no';

      if (this.requestResult instanceof Error) {
        tags.result = 'failed';
      } else {
        tags.result     = 'success';
        tags.statusCode = `${this.requestResult.statusCode}`;
      }
    } else {
      tags.result = 'noattempt';
    }

    return objectToTags(tags);
  }

  public async attempt(): Promise<boolean> {
    let requestResult: HTTPRequestResponse | Error;
    try {
      requestResult = await this.request.execute();
    } catch (error) {
      requestResult = error;
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