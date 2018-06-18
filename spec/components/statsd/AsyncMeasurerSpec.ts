import {Measurable} from '../../../src/components/statsd/Measurable';
import {AsyncMeasurer} from '../../../src/components/statsd/AsyncMeasurer';
import {StatsD} from 'node-statsd';

describe('An AsyncMeasurer', () => {
  const tagsMock       = ['test:test'];
  const measurableMock = {
    tags: tagsMock,
  } as Measurable<any>;
  const statsDMock     = {} as StatsD;
  statsDMock.timing    = () => void 0;
  statsDMock.increment = () => void 0;
  const resultMock     = {};

  const asyncMeasurer = new AsyncMeasurer(statsDMock);

  beforeEach(() => {
    spyOn(statsDMock, 'timing');
    spyOn(statsDMock, 'increment');

    measurableMock.execute = () => Promise.resolve(resultMock);
  });

  describe('When measuring a measurable', async () => {
    let result: any;

    beforeEach(async () => {
      result = await asyncMeasurer.measure(measurableMock);
    });

    it('Has the correct result', () => {
      expect(result).toEqual(resultMock);
    });

    it('Timing has been called on statsd client', () => {
      expect(statsDMock.timing).toHaveBeenCalled();
    });

    it('Increment has been called on statsd client', () => {
      expect(statsDMock.increment).toHaveBeenCalled();
    });
  });

  describe('When the measurable throws an error', async () => {
    let result: any;
    let error = Error('Error');

    beforeEach(async () => {
      measurableMock.execute = () => {
        throw error;
      };

      try {
        await asyncMeasurer.measure(measurableMock);
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
      expect(statsDMock.timing).toHaveBeenCalled();
    });

    it('Increment has been called on statsd client', () => {
      expect(statsDMock.increment).toHaveBeenCalled();
    });
  });
});