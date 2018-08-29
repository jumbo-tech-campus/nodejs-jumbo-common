import {MongoQueryFactory} from '../../../src/components/mongodb/MongoQueryFactory';
import * as mongoose from 'mongoose';
import {AsyncMeasurer} from '../../../src/components/statsd/AsyncMeasurer';
import {MongoQueryTelemetry} from '../../../src/components/mongodb/MongoQueryTelemetry';
import * as Logger from 'bunyan';
import {MongoCreate} from '../../../src/components/mongodb/MongoCreate';

describe('A MongoQueryFactory', () => {
  const loggerMock        = {} as Logger;
  const modelMock         = {} as mongoose.Model<mongoose.Document> & any;
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

  it('Should be able to create MongoCreate without measurer', () => {
    const mongoQueryFactory = new MongoQueryFactory(modelMock);

    const mongoCreate = mongoQueryFactory.createCreate(loggerMock, {});

    expect(mongoCreate instanceof MongoCreate).toEqual(true);
  });

  it('Should be able to create MongoUpdate', () => {
    const mongoUpdate = mongoQueryFactory.createUpdate(loggerMock, {}, {});

    expect(mongoUpdate instanceof MongoQueryTelemetry).toEqual(true);
  });

  it('Should be able to create MongoUpdateMany', () => {
    const mongoUpdateMany = mongoQueryFactory.createUpdateMany(loggerMock, {}, {});

    expect(mongoUpdateMany instanceof MongoQueryTelemetry).toEqual(true);
  });

  it('Should be able to create MongoRemove', () => {
    const mongoRemove = mongoQueryFactory.createRemove(loggerMock, {});

    expect(mongoRemove instanceof MongoQueryTelemetry).toEqual(true);
  });

  it('Should be able to create MongoFindOrCreate', () => {
    const mongoFindOrCreate = mongoQueryFactory.createFindOrCreate(loggerMock, {});

    expect(mongoFindOrCreate instanceof MongoQueryTelemetry).toEqual(true);
  });

  it('Should be able to create MongoFindOrCreate with create Document', () => {
    const mongoFindOrCreate = mongoQueryFactory.createFindOrCreate(loggerMock, {}, {});

    expect(mongoFindOrCreate instanceof MongoQueryTelemetry).toEqual(true);
  });
});