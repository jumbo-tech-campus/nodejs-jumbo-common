import {HTTPRequest, HTTPRequestResponse} from '../../../src/components/httprequest/HTTPRequest';
import {HTTPRequestRetryer} from '../../../src/components/retryer/HTTPRequestRetryer';
import {Retryable} from '../../../src/components/retryer/Retryable';
import {Retryer} from '../../../src/components/retryer/Retryer';
import {RetryerFactory} from '../../../src/components/retryer/RetryerFactory';
import {Measurable} from '../../../src/components/statsd/Measurable';
import {asyncIt} from '../../helpers/JasmineHelper';

describe('An HTTPRequestRetryer', () => {
  const retryerFactoryMock = {} as RetryerFactory;
  const retryerMock        = {} as Retryer;
  const retryableRequest   = {} as Retryable & HTTPRequest & Measurable<HTTPRequestResponse>;
  const resultMock         = {} as HTTPRequestResponse;

  beforeEach(() => {
    retryerFactoryMock.create = () => retryerMock;
    retryerMock.execute       = () => Promise.resolve();
    retryableRequest.execute  = () => Promise.resolve(resultMock);
  });

  asyncIt('Returns the response from the Retryer', async () => {
    const requestRetryer = new HTTPRequestRetryer(retryerFactoryMock, retryableRequest);

    const result = await requestRetryer.execute();

    expect(result).toEqual(resultMock);
  });
});