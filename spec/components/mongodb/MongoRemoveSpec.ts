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

  it('Can remove a document', async () => {
    await mongoRemove.execute();
  });
});