import {MongoDocumentQuery} from '../../../src/components/mongodb/MongoDocumentQuery';
import {DocumentQuery} from 'mongoose';

describe('A MongoDocumentQuery', () => {
  const mongoDocumentMock = {} as DocumentQuery<any, any>;
  const validResult: any  = {};

  beforeEach(() => {
    mongoDocumentMock.populate = () => mongoDocumentMock;
    mongoDocumentMock.sort     = () => mongoDocumentMock;
    mongoDocumentMock.exec     = () => Promise.resolve(validResult);
  });

  it('Can execute a DocumentQuery without any options', async () => {
    const mongoDocumentQuery = new MongoDocumentQuery();

    const result = await mongoDocumentQuery.execute(mongoDocumentMock);

    expect(result).toEqual(validResult);
  });

  it('Can execute a DocumentQuery with all options', async () => {
    const mongoDocumentQuery = new MongoDocumentQuery({
      populate: {
        path: 'something',
      },
      sort:     [],
    });

    const result = await mongoDocumentQuery.execute(mongoDocumentMock);

    expect(result).toEqual(validResult);
  });
});