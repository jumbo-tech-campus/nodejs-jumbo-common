import * as mongoose from 'mongoose';
import {MongoCount} from '../../../src/components/mongodb/MongoCount';

describe('A MongoCount', () => {
  const modelMock = {} as mongoose.Model<mongoose.Document> & any;

  const mongoCount = new MongoCount({}, modelMock);

  it('Should be able to return tags', () => {
    expect(mongoCount.tags).toEqual([]);
  });

  describe('When quering', () => {
    beforeEach(() => {
      modelMock.countDocuments = () => ({
        exec: async () => Promise.resolve(5),
      });
    });

    it('Should be able to count objects', async () => {
      const result = await mongoCount.execute();

      expect(result).toEqual(5);
    });
  });
});