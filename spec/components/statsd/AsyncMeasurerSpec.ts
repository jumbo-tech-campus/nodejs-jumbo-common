import {Measurable} from '../../../src/components/telemetry/Measurable';
import {AsyncMeasurer} from '../../../src/components/telemetry/AsyncMeasurer';
import {StatsD} from 'hot-shots';

describe('An AsyncMeasurer', () => {
  let tagsMock: string[] = ['test:test'];
  let measurableMock: Measurable<any>;
  const statsDMock     = {} as StatsD;
  statsDMock.timing    = () => void 0;
  const resultMock     = {};
  const defaultTags = ['default:tag', 'statsd:tag'];

  const asyncMeasurer = new AsyncMeasurer(statsDMock);

  beforeEach(() => {
    measurableMock = {
      tags: ['test:test'],
    } as Measurable<any>;

    measurableMock.execute = () => Promise.resolve(resultMock);
  });

  describe('When measuring a measurable', () => {
    let result: any;

    beforeEach(async () => {
      spyOn(statsDMock, 'timing');

      result = await asyncMeasurer.measure(measurableMock, defaultTags);
    });

    it('Has the correct result', () => {
      expect(result).toEqual(resultMock);
    });

    it('Timing has been called on statsd client', () => {
      expect(statsDMock.timing).toHaveBeenCalledWith(
        jasmine.any(String), jasmine.any(Number), defaultTags.concat(tagsMock));
    });
  });

  describe('When the measurable throws an error', () => {
    let result: any;
    let error = Error('Error');

    beforeEach(async () => {
      spyOn(statsDMock, 'timing');

      measurableMock.execute = () => Promise.reject(error);

      try {
        await asyncMeasurer.measure(measurableMock, defaultTags);
      } catch (error) {
        result = error;

        return;
      }

      fail();
    });

    it('Has the correct result', () => {
      expect(result).toEqual(error);
    });

    it('Timing has been called on statsd client', () => {
      expect(statsDMock.timing).toHaveBeenCalledWith(
        jasmine.any(String), jasmine.any(Number), defaultTags.concat(tagsMock));
    });
  });
});