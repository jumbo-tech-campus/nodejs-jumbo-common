import * as mongoose from 'mongoose';
import {MongoDeleteMany} from '../../../src/components/mongodb/MongoRemoveMultiple';

describe('A MongoDeleteMany', () => {
  const modelMock = {} as mongoose.Model<mongoose.Document> & any;

  const mongoDeleteMany = new MongoDeleteMany({}, modelMock);

  beforeEach(() => {
    modelMock.deleteMany = () => ({
      exec: () => Promise.resolve(void 0),
    });
  });

  it('Can remove documents', async () => {
    await mongoDeleteMany.execute();
  });
});