import {MongoQueryFactory} from '../../../src/components/mongodb/MongoQueryFactory';
import * as mongoose from 'mongoose';
import {AsyncMeasurer} from '../../../src/components/statsd/AsyncMeasurer';
import {MongoQueryTelemetry} from '../../../src/components/mongodb/MongoQueryTelemetry';
import * as Logger from 'bunyan';

describe('A MongoQueryFactory', () => {
  const loggerMock = {} as Logger;
  const modelMock  = {} as mongoose.Model<mongoose.Document> & any;
  const asyncMeasurerMock = {} as AsyncMeasurer;
  const mongoQueryFactory = new MongoQueryFactory(modelMock, asyncMeasurerMock);

  it('Should be able to create MongoFind', () => {
    const mongoFind = mongoQueryFactory.createFind(loggerMock, {});

    expect(mongoFind instanceof MongoQueryTelemetry).toEqual(true);
  });

  it('Should be able to create MongoFindOne', () => {
    const mongoFindOne = mongoQueryFactory.createFindOne(loggerMock, {});

    expect(mongoFindOne instanceof MongoQueryTelemetry).toEqual(true);
  });
});