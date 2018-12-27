import {MongoQueryFactory} from '../../../src/components/mongodb/MongoQueryFactory';
import * as mongoose from 'mongoose';
import {MongoQueryTelemetry} from '../../../src/components/mongodb/MongoQueryTelemetry';
import {AsyncTelemetry} from '../../../src/components/telemetry/AsyncTelemetry';

describe('A MongoQueryFactory', () => {
  const modelMock          = {} as mongoose.Model<mongoose.Document> & any;
  const asyncTelemetryMock = {} as AsyncTelemetry;
  const mongoQueryFactory  = new MongoQueryFactory(modelMock, asyncTelemetryMock);

  it('Should be able to create MongoFind', () => {
    const mongoFind = mongoQueryFactory.createFind({});

    expect(mongoFind instanceof MongoQueryTelemetry).toEqual(true);
  });

  it('Should be able to create MongoFindOne', () => {
    const mongoFindOne = mongoQueryFactory.createFindOne({});

    expect(mongoFindOne instanceof MongoQueryTelemetry).toEqual(true);
  });

  it('Should be able to create MongoUpdate', () => {
    const mongoUpdate = mongoQueryFactory.createUpdate({}, {});

    expect(mongoUpdate instanceof MongoQueryTelemetry).toEqual(true);
  });

  it('Should be able to create MongoUpdateMany', () => {
    const mongoUpdateMany = mongoQueryFactory.createUpdateMany({}, {});

    expect(mongoUpdateMany instanceof MongoQueryTelemetry).toEqual(true);
  });

  it('Should be able to create MongoDelete', () => {
    const mongoRemove = mongoQueryFactory.createDelete({});

    expect(mongoRemove instanceof MongoQueryTelemetry).toEqual(true);
  });

  it('Should be able to create MongoDeleteMany', () => {
    const mongoRemoveMany = mongoQueryFactory.createDeleteMany({});

    expect(mongoRemoveMany instanceof MongoQueryTelemetry).toEqual(true);
  });

  it('Should be able to create MongoFindOrCreate', () => {
    const mongoFindOrCreate = mongoQueryFactory.createFindOrCreate({});

    expect(mongoFindOrCreate instanceof MongoQueryTelemetry).toEqual(true);
  });

  it('Should be able to create MongoCount', () => {
    const mongoCount = mongoQueryFactory.createCount({});

    expect(mongoCount instanceof MongoQueryTelemetry).toEqual(true);
  });

  it('Should be able to create MongoFindOrCreate with create Document', () => {
    const mongoFindOrCreate = mongoQueryFactory.createFindOrCreate({}, {});

    expect(mongoFindOrCreate instanceof MongoQueryTelemetry).toEqual(true);
  });
});