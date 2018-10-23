import * as mongoose from 'mongoose';
import {MongoCreate} from '../../../src/components/mongodb/MongoCreate';

describe('A MongoCreate', () => {
  const modelMock  = {} as mongoose.Model<mongoose.Document> & any;

  const mongoCreate = new MongoCreate({
    property: 'value'
  } as any,                           modelMock);

  beforeEach(() => {
    modelMock.create = () => Promise.resolve({});
  });

  it('Can save a document', async () => {
    const result = await mongoCreate.execute();

    expect(result).toEqual({} as any);
  });

  it('Generates the correct tags', () => {
    expect(mongoCreate.tags).toEqual(['property:value']);
  });
});