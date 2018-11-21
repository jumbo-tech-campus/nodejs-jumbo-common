import {Measurable} from '../../../src/components/statsd/Measurable';
import {AsyncMeasurer} from '../../../src/components/statsd/AsyncMeasurer';
import {StatsD} from 'hot-shots';

describe('An AsyncMeasurer', () => {
  let tagsMock: string[] = ['test:test'];
  let measurableMock: Measurable<any>;
  const statsDMock       = {} as StatsD;
  statsDMock.timing      = () => void 0;
  const resultMock       = {};
  const defaultTags      = ['default:tag', 'statsd:tag'];

  const asyncMeasurer = new AsyncMeasurer(statsDMock);

  beforeEach(() => {
    measurableMock = {
      tags: ['test:test'],
    } as Measurable<any>;

    measurableMock.execute = () => Promise.resolve(resultMock);
  });

  describe('Measuring a measurable', () => {
    let result: any;

    beforeEach(async () => {
      spyOn(statsDMock, 'timing');

      result = await asyncMeasurer.measure(measurableMock, defaultTags);
    });

    it('Returns the measurable result', () => {
      expect(result).toEqual(resultMock);
    });

    it('Measured the measurable', () => {
      expect(statsDMock.timing).toHaveBeenCalledWith(
        jasmine.any(String), jasmine.any(Number), defaultTags.concat(tagsMock));
    });
  });

  describe('Measuring a measurable without default tags', () => {
    let result: any;

    beforeEach(async () => {
      spyOn(statsDMock, 'timing');

      result = await asyncMeasurer.measure(measurableMock);
    });

    it('Returns the measurable result', () => {
      expect(result).toEqual(resultMock);
    });

    it('Measured the measurable', () => {
      expect(statsDMock.timing).toHaveBeenCalledWith(
        jasmine.any(String), jasmine.any(Number), tagsMock);
    });
  });

  describe('Throwing an error', () => {
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

    it('Throws the correct error', () => {
      expect(result).toEqual(error);
    });

    it('Measured the measurable', () => {
      expect(statsDMock.timing).toHaveBeenCalledWith(
        jasmine.any(String), jasmine.any(Number), defaultTags.concat(tagsMock));
    });
  });
});