import {HTTPRequestLoggerFactory} from '../src/HTTPRequestLoggerFactory';
import {HTTPRequestLogger} from '../src/HTTPRequestLogger';
import * as Logger from 'bunyan';
import {HTTPRequest} from '../src/HTTPRequest';

describe('A HTTPRequestLoggerFactory', () => {
  const httpRequestFactoryMock = {} as HTTPRequestLoggerFactory;

  beforeEach(() => {
    httpRequestFactoryMock.create = () => ({} as HTTPRequest);
  });

  it('Should be able to create a HTTPRequestLogger', () => {
    const factory = new HTTPRequestLoggerFactory(httpRequestFactoryMock, {} as Logger);

    const request = factory.create({url: 'url'});

    expect(request instanceof HTTPRequestLogger).toEqual(true);
  });
});
