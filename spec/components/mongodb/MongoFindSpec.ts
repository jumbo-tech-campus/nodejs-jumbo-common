import {MongoFind} from '../../../src/components/mongodb/MongoFind';
import * as mongoose from 'mongoose';

describe('A MongoFind', () => {
  const modelMock  = {} as mongoose.Model<mongoose.Document> & any;
  const resultMock = [{} as mongoose.Document];

  const mongoFind = new MongoFind({}, modelMock);

  it('Should be able to return tags', () => {
    expect(mongoFind.tags).toEqual([]);
  });

  describe('When quering', () => {
    beforeEach(() => {
      modelMock.find = () => ({
        exec: () => Promise.resolve(resultMock),
      });
    });

    it('Should be able to find objects', async () => {
      const result = await mongoFind.execute();

      expect(result).toEqual(resultMock);
    });
  });
});