import {MongoMeasurable} from '../../../src/components/mongodb/MongoMeasurable';
import {MongoQuery} from '../../../src/components/mongodb/MongoQuery';

describe('A MongoMeasurable', () => {
  const mongoQueryMock = {
    constructor: {
      name: 'MongoQuery',
    },
    options: {},
  } as MongoQuery<unknown>;

  const mongoMeasurable = new MongoMeasurable(mongoQueryMock);

  it('Can create tags for a query', () => {
    expect(mongoMeasurable.tags).toContain('result:notexecuted');
    expect(mongoMeasurable.tags).toContain('type:MongoQuery');
  });

  it('Can return the query options', () => {
    expect(mongoMeasurable.options).toBe(mongoQueryMock.options);
  });

  it('Can return the mongoQuery result', async () => {
    mongoQueryMock.execute = () => Promise.resolve({});

    const result = await mongoMeasurable.execute();

    expect(result).toEqual({});
  });
});