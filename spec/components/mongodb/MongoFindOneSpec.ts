import * as mongoose from 'mongoose';
import {MongoDocumentQuery} from '../../../src/components/mongodb/MongoDocumentQuery';
import {MongoFindOne} from '../../../src/components/mongodb/MongoFindOne';

describe('A MongoFindOne', () => {
  const modelMock              = {} as mongoose.Model<mongoose.Document> & any;
  const resultMock             = {} as mongoose.Document;
  const mongoDocumentQueryMock = {} as MongoDocumentQuery;

  const mongoFindOne = new MongoFindOne({}, modelMock, mongoDocumentQueryMock);

  it('Should be able to return tags', () => {
    expect(mongoFindOne.tags).toEqual([]);
  });

  describe('When quering', () => {
    beforeEach(() => {
      modelMock.findOne              = () => ({});
      mongoDocumentQueryMock.execute = async () => Promise.resolve(resultMock as any);
    });

    it('Should be able to find objects', async () => {
      const result = await mongoFindOne.execute();

      expect(result).toEqual(resultMock);
    });
  });
});