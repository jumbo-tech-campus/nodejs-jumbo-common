import {MongoMeasurable} from '../../../src/components/mongodb/MongoMeasurable';
import {MongoQuery} from '../../../src/components/mongodb/MongoQuery';

describe('A MongoMeasurable', () => {
  const mongoQueryMock = {
    constructor: {
      name: 'MongoQuery',
    },
    options:     {},
  } as MongoQuery<unknown>;

  const mongoMeasurable = new MongoMeasurable(mongoQueryMock);

  describe('When executing succesfully', () => {
    let result: unknown;
    let tags: string[];

    beforeEach(async () => {
      mongoQueryMock.execute = () => Promise.resolve({});

      result = await mongoMeasurable.execute();
      tags   = mongoMeasurable.tags;
    });

    it('Has correct tags', () => {
      expect(tags).toContain('result:success');
      expect(tags).toContain('type:MongoQuery');
    });

    it('Can return the query options', () => {
      expect(mongoMeasurable.options).toBe(mongoQueryMock.options);
    });

    it('Can return the mongoQuery result', async () => {
      expect(result).toEqual({});
    });
  });

  describe('When executing unsuccesfully', () => {
    let error: unknown;
    const throwError = new Error();
    let tags: string[];

    beforeEach(async () => {
      mongoQueryMock.execute = () => Promise.reject(throwError);

      await mongoMeasurable.execute().catch((e) => {
        error = e;
      });
      tags = mongoMeasurable.tags;
    });

    it('Has correct tags', () => {
      expect(tags).toContain('result:failed');
      expect(tags).toContain('type:MongoQuery');
    });

    it('Throws the correct error', () => {
      expect(error).toBe(throwError);
    });
  });
});