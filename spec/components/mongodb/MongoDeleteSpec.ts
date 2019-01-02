import {MongoDelete} from '../../../src/components/mongodb/MongoDelete';
import * as mongoose from 'mongoose';

describe('A MongoDelete', () => {
  const modelMock = {} as mongoose.Model<mongoose.Document> & any;

  const mongoRemove = new MongoDelete({}, modelMock);

  beforeEach(() => {
    modelMock.findOneAndDelete = () => ({
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
      modelMock.findOneAndDelete = () => ({
        exec: () => Promise.resolve({}),
      });
    });

    it('Returns document', async () => {
      expect(await mongoRemove.execute()).toEqual({} as mongoose.Document);
    });
  });
});