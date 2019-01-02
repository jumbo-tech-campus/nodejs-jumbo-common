import {HTTPRequestTelemetryFactory} from '../../../src/components/httprequest/HTTPRequestTelemetryFactory';
import {HTTPRequestTelemetry} from '../../../src/components/httprequest/HTTPRequestTelemetry';
import {HTTPRequest} from '../../../src/components/httprequest/HTTPRequest';
import {AsyncTelemetry} from '../../../src/components/telemetry/AsyncTelemetry';

describe('A HTTPRequestTelemetryFactory', () => {
  const httpRequestFactoryMock = {} as HTTPRequestTelemetryFactory;

  beforeEach(() => {
    httpRequestFactoryMock.create = () => ({} as HTTPRequest);
  });

  it('Should be able to create a HTTPRequestTelemetry', () => {
    const factory = new HTTPRequestTelemetryFactory(httpRequestFactoryMock, {} as AsyncTelemetry);

    const request = factory.create({url: 'url'});

    expect(request instanceof HTTPRequestTelemetry).toEqual(true);
  });
});
