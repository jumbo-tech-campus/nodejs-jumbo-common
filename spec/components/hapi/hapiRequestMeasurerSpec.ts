import * as hapi from 'hapi';
import Boom from 'boom';
import {statsDMock} from '../../helpers/mocks/statsDMock';
import {
  hapiRequestMeasurer,
  HapiRequestMeasurerOptions,
  createStatsdClientLifecycleMethod,
  extractStatsDTagsFromRequest,
  statsdTimingLifecycleMethod,
} from '../../../src/components/hapi/hapiRequestMeasurer';

describe('A hapiRequestMeasurer', () => {
  const serverMock = {} as hapi.Server;
  const optionsMock = {} as HapiRequestMeasurerOptions;
  const hMock = {} as hapi.ResponseToolkit & any;
  const requestMock = {} as hapi.Request & any;

  beforeEach(() => {
    serverMock.ext = () => void 0;
    optionsMock.statsdClient = statsDMock;
    hMock.continue = Symbol('continue');
    requestMock.app = {};
    requestMock.method = 'GET';
    requestMock.path = '/v0/product-lists/social-lists';
    requestMock.response = <hapi.ResponseObject>{statusCode: 200};
    requestMock.info = {} as hapi.RequestInfo & any;
  });

  it('should register lifecycle methods', () => {
    hapiRequestMeasurer.register(serverMock, optionsMock);
  });

  describe('The statsdAppStateLifecycleMethod', () => {
    const onRequestLifecycleMethod = createStatsdClientLifecycleMethod(optionsMock);

    it('should decorate the app lifecycle with a statsdClient', () => {
      const appStateDecorationResult = onRequestLifecycleMethod(requestMock, hMock);

      expect(requestMock.app.statsdClient).toBeDefined();
      expect(appStateDecorationResult).toEqual(hMock.continue);
    });
  });

  describe('The extractStatsDTagsFromRequest helper', () => {
    it('should extract statsD tags from request', () => {
      const tags = extractStatsDTagsFromRequest(requestMock);

      expect(tags).toEqual([
        'method:GET',
        'apiVersion:v0',
        'statusCode:200',
      ]);
    });

    it('should exclude apiVersion tags from corrupt path splits', () => {
      requestMock.path = '/';
      const tags = extractStatsDTagsFromRequest(requestMock);

      expect(tags).toEqual([
        'method:GET',
        'statusCode:200',
      ]);
    });
  });

  describe('The statsdTimingLifecycleMethod', () => {
    const onPreResponseLifecycleMethod = statsdTimingLifecycleMethod();
    const error = new Boom();

    beforeEach(() => {
      requestMock.info.received = Date.now();
      requestMock.app = {statsdClient: statsDMock};
      error.name = 'Foo';
    });

    it('should time requests with correct tags', (done) => {
      spyOn(requestMock.app.statsdClient, 'timing');
      onPreResponseLifecycleMethod(requestMock, hMock);
      expect((requestMock.app.statsdClient.timing as jasmine.Spy).calls.argsFor(0)).toEqual([
        jasmine.any(String),
        jasmine.any(Number),
        ['method:GET', 'apiVersion:v0', 'statusCode:200']]);
      done();
    });

    it('should add an errorname tag on error', (done) => {
      requestMock.response = error;

      spyOn(requestMock.app.statsdClient, 'timing');
      onPreResponseLifecycleMethod(requestMock, hMock);
      expect((requestMock.app.statsdClient.timing as jasmine.Spy).calls.argsFor(0)).toEqual([
        jasmine.any(String),
        jasmine.any(Number),
        ['method:GET', 'apiVersion:v0', 'error:Foo', 'statusCode:500']]);
      done();
    });
  });
});