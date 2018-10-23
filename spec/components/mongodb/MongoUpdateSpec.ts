import mongoose from 'mongoose';
import {MongoUpdate} from '../../../src/components/mongodb/MongoUpdate';

describe('A MongoUpdate', () => {
  const modelMock = {} as mongoose.Model<mongoose.Document> & any;

  const mongoUpdate = new MongoUpdate({
    property: 'value',
  } as any, {}, modelMock);

  beforeEach(() => {
    modelMock.findOneAndUpdate = () => ({
      exec: async () => Promise.resolve({}),
    });
  });

  it('Can update a document', async () => {
    const result = await mongoUpdate.execute();

    expect(result).toEqual({} as any);
  });

  it('Can return tags', async () => {
    expect(mongoUpdate.tags).toEqual(['property:value']);
  });
});