import {arrayToMap} from '../../src/components/arrayToMap';

describe('An ArrayToMap function', () => {
  describe('Converting an array to map', () => {
    const item = {
      id: 'string',
      test: {},
    };

    const convertedMap = arrayToMap([item], 'id');

    it('Returns a map', () => {
      expect(convertedMap.string).toEqual(item);
    });
  });
});