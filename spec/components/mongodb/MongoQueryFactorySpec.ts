import {MongoQueryFactory} from '../../../src/components/mongodb/MongoQueryFactory';
import * as mongoose from 'mongoose';
import {AsyncMeasurer} from '../../../src/components/statsd/AsyncMeasurer';
import {MongoQueryMeasurer} from '../../../src/components/mongodb/MongoQueryMeasurer';

describe('A MongoQueryFactory', () => {
  const modelMock  = {} as mongoose.Model<mongoose.Document> & any;
  const asyncMeasurerMock = {} as AsyncMeasurer;
  const mongoQueryFactory = new MongoQueryFactory(modelMock, asyncMeasurerMock);

  it('Should be able to create MongoFind', () => {
    const mongoFind = mongoQueryFactory.createFind({});

    expect(mongoFind instanceof MongoQueryMeasurer).toEqual(true);
  });

  it('Should be able to create MongoFindOne', () => {
    const mongoFindOne = mongoQueryFactory.createFindOne({});

    expect(mongoFindOne instanceof MongoQueryMeasurer).toEqual(true);
  });
});