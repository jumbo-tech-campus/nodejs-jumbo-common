import {HTTPRequestTelemetryFactory} from '../../../src/components/httprequest/HTTPRequestTelemetryFactory';
import {HTTPRequestTelemetry} from '../../../src/components/httprequest/HTTPRequestTelemetry';
import * as Logger from 'bunyan';
import {HTTPRequest} from '../../../src/components/httprequest/HTTPRequest';
import {AsyncMeasurer} from '../../../src/components/telemetry/AsyncMeasurer';

describe('A HTTPRequestTelemetryFactory', () => {
  const httpRequestFactoryMock = {} as HTTPRequestTelemetryFactory;

  beforeEach(() => {
    httpRequestFactoryMock.create = () => ({} as HTTPRequest);
  });

  it('Should be able to create a HTTPRequestTelemetry', () => {
    const factory = new HTTPRequestTelemetryFactory(httpRequestFactoryMock, {} as Logger, {} as AsyncMeasurer);

    const request = factory.create({url: 'url'});

    expect(request instanceof HTTPRequestTelemetry).toEqual(true);
  });
});
