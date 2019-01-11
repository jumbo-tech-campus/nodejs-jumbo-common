import * as mongoose from 'mongoose';
import {MongoCreateMany} from '../../../src/components/mongodb/MongoCreateMany';

describe('A MongoCreateMany', () => {
  const modelMock = {} as mongoose.Model<mongoose.Document> & any;

  const mongoCreate = new MongoCreateMany([{
    property: 'value',
  } as any], modelMock);

  beforeEach(() => {
    modelMock.create = () => Promise.resolve([{}]);
  });

  it('Can save a document', async () => {
    const result = await mongoCreate.execute();

    expect(result).toEqual([{} as any]);
  });
});