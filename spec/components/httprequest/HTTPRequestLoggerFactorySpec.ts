import {HTTPRequestLoggerFactory} from '../../../src/components/httprequest/HTTPRequestLoggerFactory';
import {HTTPRequestLogger} from '../../../src/components/httprequest/HTTPRequestLogger';
import * as Logger from 'bunyan';
import {HTTPRequest} from '../../../src/components/httprequest/HTTPRequest';
import {AsyncMeasurer} from '../../../src/components/statsd/AsyncMeasurer';

describe('A HTTPRequestLoggerFactory', () => {
  const httpRequestFactoryMock = {} as HTTPRequestLoggerFactory;

  beforeEach(() => {
    httpRequestFactoryMock.create = () => ({} as HTTPRequest);
  });

  it('Should be able to create a HTTPRequestLogger', () => {
    const factory = new HTTPRequestLoggerFactory(httpRequestFactoryMock, {} as Logger, {} as AsyncMeasurer);

    const request = factory.create({url: 'url'});

    expect(request instanceof HTTPRequestLogger).toEqual(true);
  });
});
