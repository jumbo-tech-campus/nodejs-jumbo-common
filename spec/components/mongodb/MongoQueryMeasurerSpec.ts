import {MongoQueryMeasurer} from '../../../src/components/mongodb/MongoQueryMeasurer';
import {MongoQuery} from '../../../src/components/mongodb/MongoQuery';
import * as mongoose from 'mongoose';
import {AsyncMeasurer} from '../../../src/components/statsd/AsyncMeasurer';
import {Measurable} from '../../../src/components/statsd/Measurable';

describe('A MongoQueryMeasurer', () => {
  const asyncMeasurerMock = {} as AsyncMeasurer;
  const mongoQueryMock    = {} as MongoQuery<mongoose.Document> & Measurable<mongoose.Document>;
  const mockResult: any   = {};

  const mongoQueryMeasurer = new MongoQueryMeasurer(asyncMeasurerMock, mongoQueryMock);

  beforeEach(() => {
    asyncMeasurerMock.measure = () => Promise.resolve(mockResult);
  });

  it('Should be able to measure a MongoQuery', async () => {
    const result = await mongoQueryMeasurer.execute();

    expect(result).toEqual(mockResult);
  });
});