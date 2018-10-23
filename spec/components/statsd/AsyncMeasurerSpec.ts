import {StatsD} from 'hot-shots';
import {AsyncMeasurer} from '../../../src/components/statsd/AsyncMeasurer';
import {Measurable} from '../../../src/components/statsd/Measurable';

describe('An AsyncMeasurer', () => {
  const tagsMock: string[] = ['test:test'];
  let measurableMock: Measurable<any>;
  const statsDMock         = {} as StatsD;
  statsDMock.timing        = () => void 0;
  const resultMock         = {};
  const defaultTags        = ['default:tag', 'statsd:tag'];

  const asyncMeasurer = new AsyncMeasurer(statsDMock);

  beforeEach(() => {
    measurableMock = {
      tags: ['test:test'],
    } as Measurable<any>;

    measurableMock.execute = async () => Promise.resolve(resultMock);
  });

  describe('When measuring a measurable', async () => {
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
        jasmine.any(String), jasmine.any(Number), defaultTags.concat(tagsMock, 'result:success'));
    });
  });

  describe('When the measurable throws an error', async () => {
    let result: any;
    const error = Error('Error');

    beforeEach(async () => {
      spyOn(statsDMock, 'timing');

      measurableMock.execute = async () => Promise.reject(error);

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
        jasmine.any(String), jasmine.any(Number), defaultTags.concat(tagsMock, 'result:failed'));
    });
  });
});