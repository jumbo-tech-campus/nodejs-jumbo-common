import {MongoQueryTelemetry} from '../../../src/components/mongodb/MongoQueryTelemetry';
import {MongoQuery} from '../../../src/components/mongodb/MongoQuery';
import * as mongoose from 'mongoose';
import {AsyncMeasurer} from '../../../src/components/statsd/AsyncMeasurer';
import {Measurable} from '../../../src/components/statsd/Measurable';
import * as Logger from 'bunyan';

describe('A MongoQueryTelemetry', () => {
  const loggerMock        = {} as Logger;
  const asyncMeasurerMock = {} as AsyncMeasurer;
  const mongoQueryMock    = {
    constructor: {
      name: 'MongoQuery',
    },
  } as MongoQuery<mongoose.Document> & Measurable<mongoose.Document>;
  const mockResult: any   = {};

  const mongoQueryMeasurer = new MongoQueryTelemetry(loggerMock, asyncMeasurerMock, mongoQueryMock);

  beforeEach(() => {
    asyncMeasurerMock.measure = () => Promise.resolve(mockResult);
  });

  it('Should be able to measure a MongoQuery', async () => {
    const result = await mongoQueryMeasurer.execute();

    expect(result).toEqual(mockResult);
  });
});