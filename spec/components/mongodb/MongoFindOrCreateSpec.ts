import {MongoFindOrCreate} from '../../../src/components/mongodb/MongoFindOrCreate';
import mongoose from 'mongoose';
import {MongoFindOne} from '../../../src/components/mongodb/MongoFindOne';
import {MongoCreate} from '../../../src/components/mongodb/MongoCreate';

describe('A MongoFindOrCreate', () => {
  const mongoFindOneMock = {
    options: {},
  } as MongoFindOne<mongoose.Document>;
  const mongoCreateMock  = {} as MongoCreate<mongoose.Document>;
  const documentMock     = {} as mongoose.Document;

  const mongoFindOrCreate = new MongoFindOrCreate<mongoose.Document>(mongoFindOneMock, mongoCreateMock);

  beforeEach(() => {
    mongoFindOneMock.execute = () => Promise.resolve(documentMock);
    mongoCreateMock.execute  = () => Promise.resolve(documentMock);
  });

  it('Should be able to find a document', async () => {
    const document = await mongoFindOrCreate.execute();

    expect(document).toEqual(documentMock);
  });

  it('Should be able to create a document', async () => {
    mongoFindOneMock.execute = () => Promise.resolve(null);

    const document = await mongoFindOrCreate.execute();

    expect(document).toEqual(documentMock);
  });

  it('Has the same options as mongoFindOne', () => {
    expect(mongoFindOrCreate.options).toEqual(mongoFindOneMock.options);
  });

  it('Has the same options as mongoFindOne', () => {
    expect(mongoFindOrCreate.tags).toEqual([]);
  });
});