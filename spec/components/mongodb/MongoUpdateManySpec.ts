import mongoose from 'mongoose';
import {MongoUpdateMany} from '../../../src/components/mongodb/MongoUpdateMany';

describe('A MongoUpdateMany', () => {
  const modelMock = {} as mongoose.Model<mongoose.Document> & any;

  const mongoUpdateMany = new MongoUpdateMany({
    property: 'value',
  } as any, {}, modelMock);

  beforeEach(() => {
    modelMock.updateMany = () => ({
      exec: () => Promise.resolve({}),
    });
  });

  it('Can update documents', async () => {
    const result = await mongoUpdateMany.execute();

    expect(result).toEqual({} as any);
  });

  it('Can return tags', async () => {
    expect(mongoUpdateMany.tags).toEqual(['property:value']);
  });
});