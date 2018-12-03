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
  const mongoQueryFactory = new MongoQueryFactory(loggerMock, modelMock, asyncMeasurerMock);

  it('Should be able to create MongoFind', () => {
    const mongoFind = mongoQueryFactory.createFind({});

    expect(mongoFind instanceof MongoQueryTelemetry).toEqual(true);
  });

  it('Should be able to create MongoFindOne', () => {
    const mongoFindOne = mongoQueryFactory.createFindOne({});

    expect(mongoFindOne instanceof MongoQueryTelemetry).toEqual(true);
  });

  it('Should be able to create MongoCreate without measurer', () => {
    const mongoQueryFactory = new MongoQueryFactory(loggerMock, modelMock);

    const mongoCreate = mongoQueryFactory.createCreate({});

    expect(mongoCreate instanceof MongoCreate).toEqual(true);
  });

  it('Should be able to create MongoUpdate', () => {
    const mongoUpdate = mongoQueryFactory.createUpdate({}, {});

    expect(mongoUpdate instanceof MongoQueryTelemetry).toEqual(true);
  });

  it('Should be able to create MongoUpdateMany', () => {
    const mongoUpdateMany = mongoQueryFactory.createUpdateMany({}, {});

    expect(mongoUpdateMany instanceof MongoQueryTelemetry).toEqual(true);
  });

  it('Should be able to create MongoRemove', () => {
    const mongoRemove = mongoQueryFactory.createRemove({});

    expect(mongoRemove instanceof MongoQueryTelemetry).toEqual(true);
  });

  it('Should be able to create MongoRemoveMany', () => {
    const mongoRemoveMany = mongoQueryFactory.createRemoveMany({});

    expect(mongoRemoveMany instanceof MongoQueryTelemetry).toEqual(true);
  });

  it('Should be able to create MongoFindOrCreate', () => {
    const mongoFindOrCreate = mongoQueryFactory.createFindOrCreate({});

    expect(mongoFindOrCreate instanceof MongoQueryTelemetry).toEqual(true);
  });

  it('Should be able to create MongoCount', () => {
    const mongoCount  = mongoQueryFactory.createCount({});

    expect(mongoCount instanceof MongoQueryTelemetry).toEqual(true);
  });

  it('Should be able to create MongoFindOrCreate with create Document', () => {
    const mongoFindOrCreate = mongoQueryFactory.createFindOrCreate({}, {});

    expect(mongoFindOrCreate instanceof MongoQueryTelemetry).toEqual(true);
  });
});