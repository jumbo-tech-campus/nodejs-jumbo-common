import {MongoRemove} from '../../../src/components/mongodb/MongoRemove';
import * as mongoose from 'mongoose';

describe('A MongoRemove', () => {
  const modelMock = {} as mongoose.Model<mongoose.Document> & any;

  const mongoRemove = new MongoRemove({}, modelMock);

  beforeEach(() => {
    modelMock.findOneAndRemove = () => ({
      exec: () => Promise.resolve(void 0),
    });
  });

  describe('Document does not exist', () => {
    it('Returns undefined', async () => {
      expect(await mongoRemove.execute()).toBeUndefined();
    });
  });

  describe('Document exists', () => {
    beforeEach(() => {
      modelMock.findOneAndRemove = () => ({
        exec: () => Promise.resolve({}),
      });
    });

    it('Returns document', async () => {
      expect(await mongoRemove.execute()).toEqual({} as mongoose.Document);
    });
  });
});