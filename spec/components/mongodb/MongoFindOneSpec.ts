import * as mongoose from 'mongoose';
import {MongoFindOne} from '../../../src/components/mongodb/MongoFindOne';
import {MongoDocumentQuery} from '../../../src/components/mongodb/MongoDocumentQuery';

describe('A MongoFindOne', () => {
  const modelMock              = {} as mongoose.Model<mongoose.Document> & any;
  const resultMock             = {} as mongoose.Document;
  const mongoDocumentQueryMock = {} as MongoDocumentQuery;

  const mongoFindOne = new MongoFindOne({}, modelMock, mongoDocumentQueryMock);

  describe('When quering', () => {
    beforeEach(() => {
      modelMock.findOne = () => ({});
      mongoDocumentQueryMock.execute = () => Promise.resolve(resultMock as any);
    });

    it('Should be able to find objects', async () => {
      const result = await mongoFindOne.execute();

      expect(result).toEqual(resultMock);
    });
  });
});