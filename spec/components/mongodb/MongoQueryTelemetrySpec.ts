import * as Logger from 'bunyan';
import * as mongoose from 'mongoose';
import {MongoQuery} from '../../../src/components/mongodb/MongoQuery';
import {MongoQueryTelemetry} from '../../../src/components/mongodb/MongoQueryTelemetry';
import {AsyncMeasurer} from '../../../src/components/statsd/AsyncMeasurer';
import {Measurable} from '../../../src/components/statsd/Measurable';

describe('A MongoQueryTelemetry', () => {
  const loggerMock        = {} as Logger;
  loggerMock.error        = () => true;
  const asyncMeasurerMock = {} as AsyncMeasurer;
  const mongoQueryMock    = {
    constructor: {
      name: 'MongoQuery'
    },
    options:     {
      property: 'value'
    }
  } as MongoQuery<mongoose.Document> & Measurable<mongoose.Document> & any;
  const mockResult: any   = {};

  const mongoQueryMeasurer = new MongoQueryTelemetry(loggerMock, asyncMeasurerMock, mongoQueryMock);

  beforeEach(() => {
    asyncMeasurerMock.measure = () => Promise.resolve(mockResult);
  });

  it('Should be able to measure a MongoQuery', async () => {
    const result = await mongoQueryMeasurer.execute();

    expect(result).toEqual(mockResult);
  });

  it('Should log an error', async () => {
    spyOn(loggerMock, 'error');
    const throwError          = new Error('Error');
    asyncMeasurerMock.measure = () => Promise.reject(throwError);

    try {
      await mongoQueryMeasurer.execute();
    } catch (error) {
      expect(error).toBe(throwError);
      expect(loggerMock.error).toHaveBeenCalled();

      return;
    }

    fail();
  });

  it('Can return query options', () => {
    expect(mongoQueryMeasurer.options).toEqual({
      property: 'value'
    });
  });
});