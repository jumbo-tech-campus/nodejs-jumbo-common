import * as mongoose from 'mongoose';
import {MongoRemoveMany} from '../../../src/components/mongodb/MongoRemoveMultiple';

describe('A MongoRemoveMany', () => {
  const modelMock = {} as mongoose.Model<mongoose.Document> & any;

  const mongoRemoveMany = new MongoRemoveMany({}, modelMock);

  beforeEach(() => {
    modelMock.deleteMany = () => ({
      exec: () => Promise.resolve(void 0),
    });
  });

  it('Can remove documents', async () => {
    await mongoRemoveMany.execute();
  });
});