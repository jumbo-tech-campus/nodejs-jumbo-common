import {MongoFind} from '../../../src/components/mongodb/MongoFind';
import * as mongoose from 'mongoose';
import {MongoDocumentQuery} from '../../../src/components/mongodb/MongoDocumentQuery';

describe('A MongoFind', () => {
  const modelMock              = {} as mongoose.Model<mongoose.Document> & any;
  const resultMock             = [{} as mongoose.Document];
  const mongoDocumentQueryMock = {} as MongoDocumentQuery;

  const mongoFind = new MongoFind({}, modelMock, mongoDocumentQueryMock);

  describe('When quering', () => {
    beforeEach(() => {
      modelMock.find                 = () => ({});
      mongoDocumentQueryMock.execute = () => Promise.resolve(resultMock as any);
    });

    it('Should be able to find objects', async () => {
      const result = await mongoFind.execute();

      expect(result).toEqual(resultMock);
    });
  });
});