import {objectToTags} from '../../../src/components/telemetry/objectToTags';

describe('An objectToTags', () => {
  it('Should convert an object to statsd tags', () => {
    const result = objectToTags({
      test: 1,
      blob: 'string',
      bool: true,
    });

    expect(result).toEqual(['test:1', 'blob:string', 'bool:true']);
  });

  it('Should skip arrays and objects', () => {
    const result = objectToTags({
      array: ['sadf'],
      obj: {test: 'test'},
    });

    expect(result).toEqual([]);
  });

  it('Should skip empty strings', () => {
    const result = objectToTags({
      emptystring: '',
    });

    expect(result).toEqual([]);
  });
});