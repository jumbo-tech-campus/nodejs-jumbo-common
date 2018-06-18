import * as mongoose from 'mongoose';
import {MongoFindOne} from '../../../src/components/mongodb/MongoFindOne';

describe('A MongoFindOne', () => {
  const modelMock  = {} as mongoose.Model<mongoose.Document> & any;
  const resultMock = {} as mongoose.Document;

  const mongoFindOne = new MongoFindOne({}, modelMock);

  it('Should be able to return tags', () => {
    expect(mongoFindOne.tags).toEqual([]);
  });

  describe('When quering', () => {
    beforeEach(() => {
      modelMock.findOne = () => ({
        exec: () => Promise.resolve(resultMock),
      });
    });

    it('Should be able to find objects', async () => {
      const result = await mongoFindOne.execute();

      expect(result).toEqual(resultMock);
    });
  });
});